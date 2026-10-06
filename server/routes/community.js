// Suggestions (propositions + votes) et feuille de route (lecture seule pour les joueurs).
const express = require('express');
const db = require('../db');
const { requireUser } = require('../auth');
const { cleanText } = require('../filters');
const games = require('../games');

const router = express.Router();
router.use(requireUser);

const MAX_PER_DAY = 3;

router.get('/games', (req, res) => {
  // canTest : l'admin peut ouvrir un jeu pas encore disponible pour le tester.
  res.json({ games: games.getGames().map((g) => ({ ...g, canTest: !g.playable && req.user.isAdmin })) });
});

const listSuggestions = db.prepare(`
  SELECT s.id, s.title, s.body, s.status, s.created_at,
         COALESCE(u.username, 'Ancien joueur') AS author,
         (SELECT COUNT(*) FROM votes v WHERE v.suggestion_id = s.id) AS votes,
         EXISTS (SELECT 1 FROM votes v WHERE v.suggestion_id = s.id AND v.user_id = ?) AS voted,
         s.user_id = ? AS mine
  FROM suggestions s LEFT JOIN users u ON u.id = s.user_id
  WHERE s.status != 'masquee'
  ORDER BY (s.status = 'ouverte') DESC, votes DESC, s.created_at DESC
  LIMIT 200`);

router.get('/suggestions', (req, res) => {
  const rows = listSuggestions.all(req.user.id, req.user.id).map((r) => ({
    ...r, voted: !!r.voted, mine: !!r.mine,
  }));
  res.json({ suggestions: rows });
});

router.post('/suggestions', (req, res) => {
  const title = cleanText((req.body || {}).title, { min: 5, max: 80, label: 'Le titre' });
  if (title.error) return res.status(400).json({ error: title.error, field: 'title' });
  const body = cleanText((req.body || {}).body, { min: 0, max: 500, label: 'La description' });
  if (body.error) return res.status(400).json({ error: body.error, field: 'body' });

  const since = Date.now() - 24 * 3600 * 1000;
  const n = db.prepare('SELECT COUNT(*) AS n FROM suggestions WHERE user_id = ? AND created_at > ?').get(req.user.id, since).n;
  if (n >= MAX_PER_DAY) return res.status(429).json({ error: `Maximum ${MAX_PER_DAY} suggestions par jour. Reviens demain !` });

  const r = db.prepare('INSERT INTO suggestions (user_id, title, body, created_at) VALUES (?, ?, ?, ?)')
    .run(req.user.id, title.value, body.value, Date.now());
  // On vote automatiquement pour sa propre idée.
  db.prepare('INSERT INTO votes (suggestion_id, user_id) VALUES (?, ?)').run(r.lastInsertRowid, req.user.id);
  res.status(201).json({ ok: true, id: Number(r.lastInsertRowid) });
});

// Voter / retirer son vote (bascule).
router.post('/suggestions/:id/vote', (req, res) => {
  const id = Number(req.params.id);
  const s = db.prepare("SELECT id, status FROM suggestions WHERE id = ? AND status != 'masquee'").get(id);
  if (!s) return res.status(404).json({ error: 'Suggestion introuvable.' });
  if (s.status !== 'ouverte') return res.status(400).json({ error: 'Les votes sont fermés pour cette idée.' });
  const del = db.prepare('DELETE FROM votes WHERE suggestion_id = ? AND user_id = ?').run(id, req.user.id);
  if (del.changes === 0) db.prepare('INSERT INTO votes (suggestion_id, user_id) VALUES (?, ?)').run(id, req.user.id);
  const votes = db.prepare('SELECT COUNT(*) AS n FROM votes WHERE suggestion_id = ?').get(id).n;
  res.json({ voted: del.changes === 0, votes });
});

router.get('/roadmap', (req, res) => {
  const items = db.prepare(`
    SELECT id, title, description, col, position FROM roadmap_items
    ORDER BY col, position, created_at`).all();
  res.json({ items });
});

module.exports = router;
