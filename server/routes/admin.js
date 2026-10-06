// Panneau d'administration : codes, utilisateurs, suggestions, feuille de route.
const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const auth = require('../auth');
const realtime = require('../realtime');
const { randomCode, hashPassword } = require('../security');

const router = express.Router();
router.use(auth.requireAdmin);

const COLUMNS = ['en_cours', 'prochainement', 'termine'];
const SUGGESTION_STATUSES = ['ouverte', 'planifiee', 'refusee', 'masquee'];
const int = (v, def, min, max) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
};
// Les textes de l'admin ne passent pas par le filtre d'insultes, juste par un nettoyage.
const adminText = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);

router.get('/stats', (req, res) => {
  const one = (sql) => db.prepare(sql).get().n;
  res.json({
    users: one('SELECT COUNT(*) AS n FROM users'),
    blocked: one('SELECT COUNT(*) AS n FROM users WHERE is_blocked = 1'),
    activeCodes: one('SELECT COUNT(*) AS n FROM invite_codes WHERE active = 1 AND uses < max_uses'),
    openSuggestions: one("SELECT COUNT(*) AS n FROM suggestions WHERE status = 'ouverte'"),
  });
});

// ---------- Codes d'invitation ----------
router.get('/invites', (req, res) => {
  const rows = db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM users u WHERE u.invite_id = c.id) AS accounts
    FROM invite_codes c ORDER BY c.created_at DESC`).all();
  res.json({ invites: rows });
});

router.post('/invites', (req, res) => {
  const maxUses = int((req.body || {}).maxUses, 1, 1, 500);
  const count = int((req.body || {}).count, 1, 1, 50);
  const note = adminText((req.body || {}).note, 60);
  const insert = db.prepare('INSERT INTO invite_codes (code, max_uses, note, created_at) VALUES (?, ?, ?, ?)');
  const codes = [];
  db.transaction(() => {
    while (codes.length < count) {
      const code = randomCode(8);
      try { insert.run(code, maxUses, note, Date.now()); codes.push(code); } catch { /* doublon : on retire au sort */ }
    }
  })();
  res.status(201).json({ codes });
});

router.patch('/invites/:id', (req, res) => {
  const { active, maxUses } = req.body || {};
  const id = Number(req.params.id);
  if (active !== undefined) db.prepare('UPDATE invite_codes SET active = ? WHERE id = ?').run(active ? 1 : 0, id);
  if (maxUses !== undefined) db.prepare('UPDATE invite_codes SET max_uses = ? WHERE id = ?').run(int(maxUses, 1, 1, 500), id);
  res.json({ ok: true });
});

router.delete('/invites/:id', (req, res) => {
  db.prepare('DELETE FROM invite_codes WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// ---------- Utilisateurs ----------
router.get('/users', (req, res) => {
  const rows = db.prepare(`
    SELECT u.id, u.username, u.is_admin, u.is_blocked, u.created_at, u.last_seen, c.code AS invite_code
    FROM users u LEFT JOIN invite_codes c ON c.id = u.invite_id
    ORDER BY u.created_at DESC`).all();
  res.json({ users: rows.map((u) => ({ ...u, online: realtime.isOnline(u.id) })) });
});

router.post('/users/:id/block', (req, res) => {
  const id = Number(req.params.id);
  const blocked = !!(req.body || {}).blocked;
  if (id === req.user.id) return res.status(400).json({ error: 'Tu ne peux pas te bloquer toi-même.' });
  const u = db.prepare('SELECT is_admin FROM users WHERE id = ?').get(id);
  if (!u) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  if (u.is_admin) return res.status(400).json({ error: 'Impossible de bloquer un administrateur.' });
  db.prepare('UPDATE users SET is_blocked = ? WHERE id = ?').run(blocked ? 1 : 0, id);
  if (blocked) {
    auth.destroyAllSessions(id);      // déconnecté partout
    realtime.disconnectUser(id);      // y compris le temps réel
  }
  realtime.broadcastPresence(id);
  res.json({ ok: true });
});

// Pas d'e-mail sur le site : si un élève oublie son mot de passe, l'admin en génère un provisoire.
router.post('/users/:id/reset-password', async (req, res) => {
  const id = Number(req.params.id);
  const u = db.prepare('SELECT id, is_admin FROM users WHERE id = ?').get(id);
  if (!u) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  if (u.is_admin) return res.status(400).json({ error: 'Utilise la commande en terminal pour un compte admin.' });
  const temp = randomCode(4) + '-' + randomCode(4) + '-' + crypto.randomInt(10, 99);
  db.prepare('UPDATE users SET pass_hash = ? WHERE id = ?').run(await hashPassword(temp), id);
  auth.destroyAllSessions(id);
  realtime.disconnectUser(id);
  res.json({ password: temp });
});

router.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const u = db.prepare('SELECT is_admin FROM users WHERE id = ?').get(id);
  if (!u) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  if (u.is_admin) return res.status(400).json({ error: 'Impossible de supprimer un administrateur ici.' });
  realtime.disconnectUser(id);
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.json({ ok: true });
});

// ---------- Suggestions ----------
router.get('/suggestions', (req, res) => {
  const rows = db.prepare(`
    SELECT s.id, s.title, s.body, s.status, s.created_at, u.username AS author,
           (SELECT COUNT(*) FROM votes v WHERE v.suggestion_id = s.id) AS votes,
           EXISTS (SELECT 1 FROM roadmap_items r WHERE r.suggestion_id = s.id) AS on_roadmap
    FROM suggestions s LEFT JOIN users u ON u.id = s.user_id
    ORDER BY (s.status = 'ouverte') DESC, votes DESC, s.created_at DESC`).all();
  res.json({ suggestions: rows });
});

router.patch('/suggestions/:id', (req, res) => {
  const status = (req.body || {}).status;
  if (!SUGGESTION_STATUSES.includes(status)) return res.status(400).json({ error: 'Statut invalide.' });
  db.prepare('UPDATE suggestions SET status = ? WHERE id = ?').run(status, Number(req.params.id));
  res.json({ ok: true });
});

router.delete('/suggestions/:id', (req, res) => {
  db.prepare('DELETE FROM suggestions WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

// Transforme une suggestion en élément de la feuille de route.
router.post('/suggestions/:id/to-roadmap', (req, res) => {
  const id = Number(req.params.id);
  const s = db.prepare('SELECT * FROM suggestions WHERE id = ?').get(id);
  if (!s) return res.status(404).json({ error: 'Suggestion introuvable.' });
  const col = COLUMNS.includes((req.body || {}).col) ? req.body.col : 'prochainement';
  db.transaction(() => {
    insertRoadmap(s.title, s.body, col, s.id);
    db.prepare("UPDATE suggestions SET status = 'planifiee' WHERE id = ?").run(id);
  })();
  res.json({ ok: true });
});

// ---------- Feuille de route ----------
function insertRoadmap(title, description, col, suggestionId = null) {
  const pos = db.prepare('SELECT COALESCE(MAX(position), -1) + 1 AS p FROM roadmap_items WHERE col = ?').get(col).p;
  return db.prepare('INSERT INTO roadmap_items (title, description, col, position, suggestion_id, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(title, description, col, pos, suggestionId, Date.now());
}

router.post('/roadmap', (req, res) => {
  const title = adminText((req.body || {}).title, 100);
  const description = adminText((req.body || {}).description, 500);
  const col = (req.body || {}).col;
  if (!title) return res.status(400).json({ error: 'Titre obligatoire.' });
  if (!COLUMNS.includes(col)) return res.status(400).json({ error: 'Colonne invalide.' });
  const r = insertRoadmap(title, description, col);
  res.status(201).json({ id: Number(r.lastInsertRowid) });
});

router.patch('/roadmap/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = db.prepare('SELECT * FROM roadmap_items WHERE id = ?').get(id);
  if (!item) return res.status(404).json({ error: 'Élément introuvable.' });
  const b = req.body || {};
  const title = b.title !== undefined ? adminText(b.title, 100) : item.title;
  const description = b.description !== undefined ? adminText(b.description, 500) : item.description;
  if (!title) return res.status(400).json({ error: 'Titre obligatoire.' });
  let { col, position } = item;
  if (b.col !== undefined) {
    if (!COLUMNS.includes(b.col)) return res.status(400).json({ error: 'Colonne invalide.' });
    if (b.col !== col) {
      col = b.col;
      position = db.prepare('SELECT COALESCE(MAX(position), -1) + 1 AS p FROM roadmap_items WHERE col = ?').get(col).p;
    }
  }
  db.prepare('UPDATE roadmap_items SET title = ?, description = ?, col = ?, position = ? WHERE id = ?')
    .run(title, description, col, position, id);
  res.json({ ok: true });
});

// Monter / descendre un élément dans sa colonne.
router.post('/roadmap/:id/move', (req, res) => {
  const id = Number(req.params.id);
  const dir = (req.body || {}).dir === 'up' ? -1 : 1;
  const item = db.prepare('SELECT * FROM roadmap_items WHERE id = ?').get(id);
  if (!item) return res.status(404).json({ error: 'Élément introuvable.' });
  const list = db.prepare('SELECT id FROM roadmap_items WHERE col = ? ORDER BY position, created_at').all(item.col).map((r) => r.id);
  const i = list.indexOf(id);
  const j = i + dir;
  if (j >= 0 && j < list.length) {
    [list[i], list[j]] = [list[j], list[i]];
    const upd = db.prepare('UPDATE roadmap_items SET position = ? WHERE id = ?');
    db.transaction(() => list.forEach((rid, pos) => upd.run(pos, rid)))();
  }
  res.json({ ok: true });
});

router.delete('/roadmap/:id', (req, res) => {
  db.prepare('DELETE FROM roadmap_items WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

module.exports = router;
