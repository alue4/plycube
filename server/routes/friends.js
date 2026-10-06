// API des amis, utilisée par le site ET par les futurs jeux.
// Toutes ces routes demandent d'être connecté.
//
//   GET    /api/friends                 -> { friends: [...], incoming: [...], outgoing: [...] }
//   POST   /api/friends/request         { username }          -> envoyer une demande
//   POST   /api/friends/respond         { requestId, accept } -> accepter / refuser
//   POST   /api/friends/cancel          { requestId }         -> annuler une demande envoyée
//   DELETE /api/friends/:userId                               -> retirer un ami
//   POST   /api/friends/invite          { userId, game, room } -> inviter un ami dans sa partie
//   GET    /api/friends/:userId/join                          -> où rejoindre cet ami ?
const express = require('express');
const db = require('../db');
const friends = require('../friends');
const realtime = require('../realtime');
const games = require('../games');
const { requireUser } = require('../auth');
const { createLimiter } = require('../security');

const router = express.Router();
router.use(requireUser);

const requestLimiter = createLimiter({ max: 20, windowMs: 60 * 60 * 1000 });
const inviteLimiter = createLimiter({ max: 20, windowMs: 60 * 1000 });
const findUser = db.prepare('SELECT id, username FROM users WHERE username_key = ? AND is_blocked = 0');

function friendView(f) {
  const p = realtime.presenceOf(f.id);
  return {
    id: f.id,
    username: f.username,
    online: p.online,
    activity: p.activity, // { game, gameName, room, joinable } ou null
    lastSeen: p.online ? null : f.last_seen,
  };
}

router.get('/', (req, res) => {
  const list = friends.listFriends(req.user.id).map(friendView);
  // En ligne d'abord, puis par ordre alphabétique.
  list.sort((a, b) => (b.online - a.online) || a.username.localeCompare(b.username));
  const { incoming, outgoing } = friends.listRequests(req.user.id);
  const short = (r) => ({ id: r.id, userId: r.user_id, username: r.username, createdAt: r.created_at });
  res.json({ friends: list, incoming: incoming.map(short), outgoing: outgoing.map(short) });
});

router.post('/request', (req, res) => {
  const name = String((req.body || {}).username || '').trim().toLowerCase();
  if (requestLimiter.check(req.user.id)) return res.status(429).json({ error: 'Trop de demandes, réessaie plus tard.' });
  requestLimiter.hit(req.user.id);
  const target = name && name.length <= 32 ? findUser.get(name) : null;
  if (!target) return res.status(404).json({ error: 'Aucun joueur avec ce pseudo.' });
  const r = friends.request(req.user.id, target.id);
  if (r.error) return res.status(400).json(r);
  const me = { id: req.user.id, username: req.user.username };
  if (r.accepted) {
    realtime.notify(target.id, { type: 'friends-changed' });
    realtime.notify(req.user.id, { type: 'friends-changed' });
  } else {
    realtime.notify(target.id, { type: 'friend-request', from: me });
  }
  res.json({ ok: true, accepted: r.accepted, username: target.username });
});

router.post('/respond', (req, res) => {
  const { requestId, accept } = req.body || {};
  const r = friends.respond(req.user.id, Number(requestId), !!accept);
  if (r.error) return res.status(404).json(r);
  realtime.notify(r.otherId, { type: 'friends-changed' });
  realtime.notify(req.user.id, { type: 'friends-changed' });
  res.json({ ok: true });
});

router.post('/cancel', (req, res) => {
  const r = friends.cancel(req.user.id, Number((req.body || {}).requestId));
  if (r.error) return res.status(404).json(r);
  realtime.notify(r.otherId, { type: 'friends-changed' });
  res.json({ ok: true });
});

router.delete('/:userId', (req, res) => {
  const other = Number(req.params.userId);
  const r = friends.unfriend(req.user.id, other);
  if (r.error) return res.status(404).json(r);
  realtime.notify(other, { type: 'friends-changed' });
  realtime.notify(req.user.id, { type: 'friends-changed' });
  res.json({ ok: true });
});

router.post('/invite', (req, res) => {
  const { userId, game, room } = req.body || {};
  const target = Number(userId);
  if (!friends.areFriends(req.user.id, target)) return res.status(403).json({ error: 'Tu ne peux inviter que tes amis.' });
  const g = games.getGame(String(game || ''));
  if (!g || !g.playable) return res.status(400).json({ error: 'Ce jeu n\'est pas encore disponible.' });
  if (room != null && !/^[A-Za-z0-9_-]{1,40}$/.test(String(room))) return res.status(400).json({ error: 'Salle invalide.' });
  if (!realtime.isOnline(target)) return res.status(409).json({ error: 'Ton ami n\'est pas en ligne.' });
  if (inviteLimiter.check(req.user.id)) return res.status(429).json({ error: 'Doucement avec les invitations !' });
  inviteLimiter.hit(req.user.id);

  const url = g.url + (room ? `?room=${encodeURIComponent(room)}` : '');
  realtime.notify(target, {
    type: 'invite',
    from: { id: req.user.id, username: req.user.username },
    game: { id: g.id, name: g.name },
    room: room || null,
    url,
  });
  res.json({ ok: true });
});

router.get('/:userId/join', (req, res) => {
  const other = Number(req.params.userId);
  if (!friends.areFriends(req.user.id, other)) return res.status(403).json({ error: 'Ce joueur n\'est pas ton ami.' });
  const { activity } = realtime.presenceOf(other);
  if (!activity || !activity.joinable) return res.status(409).json({ error: 'Ton ami n\'est pas dans une partie que l\'on peut rejoindre.' });
  const g = games.getGame(activity.game);
  if (!g || !g.playable) return res.status(409).json({ error: 'Ce jeu n\'est pas disponible.' });
  res.json({ url: `${g.url}?room=${encodeURIComponent(activity.room)}`, game: g.id, room: activity.room });
});

module.exports = router;
