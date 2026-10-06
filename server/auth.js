// Sessions de connexion via un cookie sécurisé.
const crypto = require('crypto');
const db = require('./db');
const config = require('./config');

const COOKIE = 'sid';
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

function parseCookies(header) {
  const out = {};
  for (const part of String(header || '').split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    try { out[k] = decodeURIComponent(v); } catch { /* cookie mal formé : ignoré */ }
  }
  return out;
}

function useSecureCookie(req) {
  if (config.cookieSecure === 'true') return true;
  if (config.cookieSecure === 'false') return false;
  return req.secure; // 'auto'
}

function cookieHeader(req, value, maxAgeSec) {
  return [
    `${COOKIE}=${value}`,
    'Path=/',
    'HttpOnly',            // le JavaScript de la page ne peut pas lire le cookie
    'SameSite=Lax',        // le cookie n'est pas envoyé par les requêtes venant d'autres sites
    `Max-Age=${maxAgeSec}`,
    useSecureCookie(req) ? 'Secure' : '', // envoyé seulement en HTTPS
  ].filter(Boolean).join('; ');
}

function createSession(req, res, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  const maxAge = config.sessionDays * 24 * 3600;
  db.prepare('INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .run(sha256(token), userId, now, now + maxAge * 1000);
  res.setHeader('Set-Cookie', cookieHeader(req, token, maxAge));
}

function destroySession(req, res) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
  res.setHeader('Set-Cookie', cookieHeader(req, '', 0));
}

function destroyAllSessions(userId) {
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
}

const findSession = db.prepare(`
  SELECT u.id, u.username, u.is_admin, u.is_blocked, u.last_seen
  FROM sessions s JOIN users u ON u.id = s.user_id
  WHERE s.token_hash = ? AND s.expires_at > ?`);
const touchUser = db.prepare('UPDATE users SET last_seen = ? WHERE id = ?');

// Retrouve l'utilisateur à partir des en-têtes d'une requête (HTTP ou WebSocket).
function userFromRequest(req) {
  const token = parseCookies(req.headers.cookie)[COOKIE];
  if (!token || token.length > 100) return null;
  const u = findSession.get(sha256(token), Date.now());
  if (!u || u.is_blocked) return null;
  // On met à jour "vu pour la dernière fois" au plus une fois par minute.
  const now = Date.now();
  if (!u.last_seen || now - u.last_seen > 60 * 1000) touchUser.run(now, u.id);
  return { id: u.id, username: u.username, isAdmin: !!u.is_admin };
}

// Middlewares Express
function loadUser(req, res, next) {
  req.user = userFromRequest(req);
  next();
}
function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Connecte-toi d\'abord.' });
  next();
}
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Connecte-toi d\'abord.' });
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Réservé à l\'administrateur.' });
  next();
}

module.exports = {
  createSession, destroySession, destroyAllSessions, userFromRequest,
  loadUser, requireUser, requireAdmin, parseCookies,
};
