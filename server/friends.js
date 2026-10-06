// Amitiés : partagées par TOUS les jeux (un ami sur le site = un ami partout).
const db = require('./db');

const q = {
  friendIds: db.prepare(`
    SELECT CASE WHEN requester_id = ? THEN addressee_id ELSE requester_id END AS id
    FROM friendships WHERE status = 'accepted' AND (requester_id = ? OR addressee_id = ?)`),
  friends: db.prepare(`
    SELECT u.id, u.username, u.last_seen, f.created_at AS since
    FROM friendships f
    JOIN users u ON u.id = CASE WHEN f.requester_id = ? THEN f.addressee_id ELSE f.requester_id END
    WHERE f.status = 'accepted' AND (f.requester_id = ? OR f.addressee_id = ?) AND u.is_blocked = 0
    ORDER BY u.username COLLATE NOCASE`),
  incoming: db.prepare(`
    SELECT f.id, u.id AS user_id, u.username, f.created_at
    FROM friendships f JOIN users u ON u.id = f.requester_id
    WHERE f.addressee_id = ? AND f.status = 'pending' AND u.is_blocked = 0
    ORDER BY f.created_at DESC`),
  outgoing: db.prepare(`
    SELECT f.id, u.id AS user_id, u.username, f.created_at
    FROM friendships f JOIN users u ON u.id = f.addressee_id
    WHERE f.requester_id = ? AND f.status = 'pending'
    ORDER BY f.created_at DESC`),
  between: db.prepare(`
    SELECT * FROM friendships
    WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)`),
  insert: db.prepare(`INSERT INTO friendships (requester_id, addressee_id, status, created_at) VALUES (?, ?, 'pending', ?)`),
  accept: db.prepare(`UPDATE friendships SET status = 'accepted' WHERE id = ?`),
  remove: db.prepare(`DELETE FROM friendships WHERE id = ?`),
  byId: db.prepare(`SELECT * FROM friendships WHERE id = ?`),
  countPendingOut: db.prepare(`SELECT COUNT(*) AS n FROM friendships WHERE requester_id = ? AND status = 'pending'`),
};

const MAX_PENDING_OUT = 30;
const MAX_FRIENDS = 200;

function friendIds(userId) {
  return q.friendIds.all(userId, userId, userId).map((r) => r.id);
}
function areFriends(a, b) {
  const f = q.between.get(a, b, b, a);
  return !!f && f.status === 'accepted';
}
function listFriends(userId) {
  return q.friends.all(userId, userId, userId);
}
function listRequests(userId) {
  return { incoming: q.incoming.all(userId), outgoing: q.outgoing.all(userId) };
}

// Envoie une demande. Renvoie { ok, accepted?, error? }.
// Si l'autre personne nous avait déjà fait une demande, on accepte directement.
function request(fromId, toId) {
  if (fromId === toId) return { error: 'Tu ne peux pas t\'ajouter toi-même 🙂' };
  const existing = q.between.get(fromId, toId, toId, fromId);
  if (existing) {
    if (existing.status === 'accepted') return { error: 'Vous êtes déjà amis.' };
    if (existing.requester_id === fromId) return { error: 'Demande déjà envoyée.' };
    q.accept.run(existing.id);
    return { ok: true, accepted: true };
  }
  if (q.countPendingOut.get(fromId).n >= MAX_PENDING_OUT) return { error: 'Trop de demandes en attente.' };
  if (friendIds(fromId).length >= MAX_FRIENDS) return { error: 'Liste d\'amis pleine.' };
  q.insert.run(fromId, toId, Date.now());
  return { ok: true, accepted: false };
}

// Répondre à une demande reçue.
function respond(userId, requestId, accept) {
  const f = q.byId.get(requestId);
  if (!f || f.addressee_id !== userId || f.status !== 'pending') return { error: 'Demande introuvable.' };
  if (accept) q.accept.run(f.id);
  else q.remove.run(f.id);
  return { ok: true, otherId: f.requester_id };
}

// Annuler une demande envoyée.
function cancel(userId, requestId) {
  const f = q.byId.get(requestId);
  if (!f || f.requester_id !== userId || f.status !== 'pending') return { error: 'Demande introuvable.' };
  q.remove.run(f.id);
  return { ok: true, otherId: f.addressee_id };
}

function unfriend(userId, otherId) {
  const f = q.between.get(userId, otherId, otherId, userId);
  if (!f || f.status !== 'accepted') return { error: 'Cette personne n\'est pas dans tes amis.' };
  q.remove.run(f.id);
  return { ok: true };
}

module.exports = { friendIds, areFriends, listFriends, listRequests, request, respond, cancel, unfriend };
