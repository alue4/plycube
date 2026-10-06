// Inscription (avec code d'invitation), connexion, déconnexion.
const express = require('express');
const db = require('../db');
const auth = require('../auth');
const { checkUsername } = require('../filters');
const { hashPassword, verifyPassword, getDummyHash, createLimiter, rateLimit } = require('../security');

const router = express.Router();

// Limites : 10 essais ratés par appareil et 5 par pseudo, sur 15 minutes.
const loginByIp = createLimiter({ max: 10, windowMs: 15 * 60 * 1000 });
const loginByName = createLimiter({ max: 5, windowMs: 15 * 60 * 1000 });

function checkPassword(pw) {
  if (typeof pw !== 'string' || pw.length < 8) return 'Le mot de passe doit faire au moins 8 caractères.';
  if (pw.length > 128) return 'Mot de passe trop long.';
  return null;
}

const findCode = db.prepare('SELECT * FROM invite_codes WHERE code = ?');
const useCode = db.prepare('UPDATE invite_codes SET uses = uses + 1 WHERE id = ? AND active = 1 AND uses < max_uses');
const findUserByKey = db.prepare('SELECT * FROM users WHERE username_key = ?');
const insertUser = db.prepare(`
  INSERT INTO users (username, username_key, pass_hash, invite_id, created_at, last_seen)
  VALUES (?, ?, ?, ?, ?, ?)`);

router.post('/register', rateLimit({ name: 'register', max: 10, windowMs: 60 * 60 * 1000 }), async (req, res) => {
  const { username, password } = req.body || {};
  const code = String((req.body || {}).code || '').trim().toUpperCase();

  const nameErr = checkUsername(username);
  if (nameErr) return res.status(400).json({ error: nameErr, field: 'username' });
  const pwErr = checkPassword(password);
  if (pwErr) return res.status(400).json({ error: pwErr, field: 'password' });
  if (password.toLowerCase().includes(username.toLowerCase())) {
    return res.status(400).json({ error: 'Le mot de passe ne doit pas contenir ton pseudo.', field: 'password' });
  }

  const invite = code && code.length <= 40 ? findCode.get(code) : null;
  if (!invite || !invite.active || invite.uses >= invite.max_uses) {
    return res.status(400).json({ error: 'Code d\'invitation invalide ou déjà utilisé.', field: 'code' });
  }

  const hash = await hashPassword(password);
  const now = Date.now();
  // "transaction" : soit tout réussit (code consommé + compte créé), soit rien.
  const create = db.transaction(() => {
    if (findUserByKey.get(username.toLowerCase())) return { error: 'Ce pseudo est déjà pris.', field: 'username' };
    if (useCode.run(invite.id).changes !== 1) return { error: 'Code d\'invitation invalide ou déjà utilisé.', field: 'code' };
    const r = insertUser.run(username, username.toLowerCase(), hash, invite.id, now, now);
    return { id: Number(r.lastInsertRowid) };
  });
  const result = create();
  if (result.error) return res.status(400).json(result);

  auth.createSession(req, res, result.id);
  res.status(201).json({ user: { id: result.id, username, isAdmin: false } });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || username.length > 32 || password.length > 128) {
    return res.status(400).json({ error: 'Pseudo ou mot de passe manquant.' });
  }
  const key = username.trim().toLowerCase();
  const ipKey = req.ip;
  const wait = Math.max(loginByIp.check(ipKey), loginByName.check(key));
  if (wait) {
    res.set('Retry-After', String(wait));
    return res.status(429).json({ error: `Trop d'essais ratés. Réessaie dans ${Math.ceil(wait / 60)} min.` });
  }

  const user = findUserByKey.get(key);
  const ok = await verifyPassword(password, user ? user.pass_hash : getDummyHash());
  if (!user || !ok) {
    loginByIp.hit(ipKey);
    loginByName.hit(key);
    return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect.' });
  }
  if (user.is_blocked) return res.status(403).json({ error: 'Ce compte est suspendu. Parle à l\'administrateur.' });

  loginByName.reset(key);
  auth.createSession(req, res, user.id);
  res.json({ user: { id: user.id, username: user.username, isAdmin: !!user.is_admin } });
});

router.post('/logout', (req, res) => {
  auth.destroySession(req, res);
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  res.json({ user: req.user || null });
});

// Changer son mot de passe (déconnecte les autres appareils).
router.post('/password', auth.requireUser, rateLimit({ name: 'password', max: 10, windowMs: 15 * 60 * 1000 }), async (req, res) => {
  const { current, next } = req.body || {};
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (typeof current !== 'string' || !(await verifyPassword(current, user.pass_hash))) {
    return res.status(400).json({ error: 'Mot de passe actuel incorrect.' });
  }
  const err = checkPassword(next);
  if (err) return res.status(400).json({ error: err });
  db.prepare('UPDATE users SET pass_hash = ? WHERE id = ?').run(await hashPassword(next), user.id);
  auth.destroyAllSessions(user.id);
  auth.createSession(req, res, user.id);
  res.json({ ok: true });
});

module.exports = { router, checkPassword };
