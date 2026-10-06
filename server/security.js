// Outils de sécurité : mots de passe, limitation d'essais, en-têtes HTTP, journal.
const crypto = require('crypto');
const proxyaddr = require('proxy-addr'); // (fourni avec Express)
const config = require('./config');

// Les relais de confiance (Tailscale Funnel, reverse proxy du NAS...) : mêmes règles qu'Express.
const relaisDeConfiance = proxyaddr.compile(String(config.trustProxy).split(',').map((s) => s.trim()).filter(Boolean));

// ---------- Mots de passe ----------
// scrypt est intégré à Node.js et conçu pour être lent à "casser".
// Format stocké : scrypt$N$r$p$sel$empreinte
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16);
    crypto.scrypt(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p }, (err, key) => {
      if (err) return reject(err);
      resolve(['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('base64'), key.toString('base64')].join('$'));
    });
  });
}

function verifyPassword(password, stored) {
  return new Promise((resolve) => {
    const parts = String(stored || '').split('$');
    if (parts.length !== 6 || parts[0] !== 'scrypt') return resolve(false);
    const [, N, r, p, salt, hash] = parts;
    const expected = Buffer.from(hash, 'base64');
    crypto.scrypt(password, Buffer.from(salt, 'base64'), expected.length,
      { N: +N, r: +r, p: +p }, (err, key) => {
        if (err) return resolve(false);
        resolve(crypto.timingSafeEqual(key, expected));
      });
  });
}

// Empreinte "factice" pour que la connexion à un pseudo inexistant prenne
// le même temps (on ne révèle pas quels pseudos existent).
let dummyHash = null;
hashPassword(crypto.randomBytes(16).toString('hex')).then((h) => { dummyHash = h; });
const getDummyHash = () => dummyHash;

// ---------- Limitation des essais (en mémoire) ----------
// Exemple : createLimiter({ max: 5, windowMs: 15 min }) => 5 essais par 15 minutes.
function createLimiter({ max, windowMs }) {
  const hits = new Map(); // clé -> { count, reset }
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  }, 60 * 1000).unref();

  return {
    // Renvoie le nombre de secondes à attendre si la limite est atteinte, sinon 0.
    check(key) {
      const v = hits.get(key);
      if (!v || v.reset < Date.now()) return 0;
      return v.count >= max ? Math.ceil((v.reset - Date.now()) / 1000) : 0;
    },
    hit(key) {
      const now = Date.now();
      const v = hits.get(key);
      if (!v || v.reset < now) hits.set(key, { count: 1, reset: now + windowMs });
      else v.count++;
    },
    reset(key) { hits.delete(key); },
  };
}

// Middleware Express simple : limite le nombre de requêtes par adresse.
function rateLimit({ max, windowMs, name }) {
  const limiter = createLimiter({ max, windowMs });
  return (req, res, next) => {
    const key = name + ':' + req.ip;
    const wait = limiter.check(key);
    if (wait) {
      res.set('Retry-After', String(wait));
      return res.status(429).json({ error: `Trop de tentatives. Réessaie dans ${Math.ceil(wait / 60)} min.` });
    }
    limiter.hit(key);
    next();
  };
}

// ---------- En-têtes de sécurité ----------
// La "Content-Security-Policy" interdit tout script qui ne vient pas du site lui-même :
// même si quelqu'un réussissait à glisser du HTML, le navigateur refuserait d'exécuter son code.
function securityHeaders(req, res, next) {
  res.set({
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      // blob: = images fabriquées par la page elle-même (textures des modèles 3D .glb des jeux)
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self' ws: wss: blob:",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  });
  if (req.secure) res.set('Strict-Transport-Security', 'max-age=15552000');
  next();
}

// ---------- Protection CSRF ----------
// Toute requête qui modifie quelque chose (POST, PUT, PATCH, DELETE) doit :
//  - venir du site lui-même (en-tête Origin identique à l'hôte),
//  - envoyer du JSON s'il y a un contenu (un autre site ne peut pas forger ça sans être bloqué par le navigateur).
function sameOriginOnly(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (!isSameOrigin(req)) return res.status(403).json({ error: 'Origine refusée.' });
  // Une requête avec un contenu (même vide, comme un formulaire) doit être en JSON.
  const hasBody = req.headers['transfer-encoding'] !== undefined || req.headers['content-length'] !== undefined;
  if (hasBody && !req.is('application/json')) return res.status(415).json({ error: 'Format attendu : JSON.' });
  next();
}

function isSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // pas d'Origin : outils en ligne de commande, vieux navigateurs (le cookie SameSite protège)
  let hote;
  try { hote = new URL(origin).host; } catch { return false; }
  if (hote === req.headers.host) return true;
  // Derrière un relais de confiance (ex. Tailscale Funnel), l'adresse publique est dans X-Forwarded-Host.
  const transmis = String(req.headers['x-forwarded-host'] || '').split(',')[0].trim();
  const adresse = req.socket && req.socket.remoteAddress;
  return !!transmis && !!adresse && relaisDeConfiance(adresse, 0) && hote === transmis;
}

// ---------- Journal sans données personnelles ----------
// On note seulement : méthode, chemin (sans paramètres), code de réponse, durée.
// Jamais d'adresse IP, de pseudo, de cookie ni de contenu.
function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();
  const fullPath = (req.originalUrl || req.url).split('?')[0];
  res.on('finish', () => {
    if (fullPath.startsWith('/assets/') || fullPath === '/api/health') return;
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    const p = fullPath.replace(/\/\d+(?=\/|$)/g, '/:id').slice(0, 100); // masque les numéros
    console.log(`${new Date().toISOString()} ${req.method} ${p} ${res.statusCode} ${ms.toFixed(0)}ms`);
  });
  next();
}

function randomCode(length = 8) {
  // Pas de 0/O ni 1/I/L pour éviter les confusions à la lecture.
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

module.exports = {
  hashPassword, verifyPassword, getDummyHash,
  createLimiter, rateLimit,
  securityHeaders, sameOriginOnly, isSameOrigin, requestLogger,
  randomCode,
};
