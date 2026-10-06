// Temps réel (WebSocket sur /ws) : présence en ligne, jeu en cours, notifications.
//
// Messages envoyés PAR le navigateur :
//   { type: 'activity', game: 'fps', room: 'salle-42', joinable: true }  -> "je joue à..."
//   { type: 'activity', game: null }                                      -> "je ne joue plus"
//   { type: 'ping' }
// Messages envoyés PAR le serveur :
//   { type: 'hello', user }                                  à la connexion
//   { type: 'presence', userId, online, activity }           un ami change de statut
//   { type: 'friend-request', from }                         nouvelle demande d'ami
//   { type: 'friends-changed' }                              liste d'amis à recharger
//   { type: 'invite', from, game, room, url }                invitation à rejoindre une partie
//   { type: 'game', game, data }                             message d'un jeu (pour les futurs jeux)
const { WebSocketServer } = require('ws');
const { userFromRequest } = require('./auth');
const { isSameOrigin } = require('./security');
const friends = require('./friends');
const games = require('./games');

const ROOM_RE = /^[A-Za-z0-9_-]{1,40}$/;
const clients = new Map(); // userId -> Set<ws>
const gameHandlers = new Map(); // gameId -> fonction(user, data, reply) pour les futurs jeux
const gameSockets = new Map(); // '/games/<id>/ws' -> { wss, gameId } (connexions rapides des jeux)

function send(ws, msg) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(msg));
}

function notify(userId, msg) {
  const set = clients.get(userId);
  if (set) for (const ws of set) send(ws, msg);
}

function isOnline(userId) {
  return clients.has(userId);
}

// Activité d'un joueur = la plus récente de ses onglets ouverts.
function activityOf(userId) {
  const set = clients.get(userId);
  if (!set) return null;
  let best = null;
  for (const ws of set) if (ws.activity && (!best || ws.activity.since > best.since)) best = ws.activity;
  return best;
}

function presenceOf(userId) {
  return { online: isOnline(userId), activity: activityOf(userId) };
}

function broadcastPresence(userId) {
  const msg = { type: 'presence', userId, ...presenceOf(userId) };
  for (const fid of friends.friendIds(userId)) notify(fid, msg);
}

// Déconnecte immédiatement un utilisateur (ex : compte bloqué).
function disconnectUser(userId) {
  const set = clients.get(userId);
  if (set) for (const ws of set) ws.close(4001, 'blocked');
  for (const { wss } of gameSockets.values()) {
    for (const ws of wss.clients) if (ws.user && ws.user.id === userId) ws.close(4001, 'blocked');
  }
}

function setActivity(ws, data) {
  if (!data || data.game == null) {
    ws.activity = null;
    return true;
  }
  const game = games.getGame(String(data.game));
  if (!game) return false;
  const room = data.room != null && ROOM_RE.test(String(data.room)) ? String(data.room) : null;
  ws.activity = {
    game: game.id,
    gameName: game.name,
    room,
    joinable: !!data.joinable && !!room,
    since: Date.now(),
  };
  return true;
}

function attach(server) {
  const wss = new WebSocketServer({ noServer: true, maxPayload: 8 * 1024 });

  server.on('upgrade', (req, socket, head) => {
    const url = (req.url || '').split('?')[0];
    const gs = gameSockets.get(url);
    const user = (url === '/ws' || gs) && isSameOrigin(req) ? userFromRequest(req) : null;
    if (!user) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      return socket.destroy();
    }
    if (gs) {
      // Connexion d'un jeu : le jeu doit être ouvert (ou l'utilisateur admin).
      const game = games.getGame(gs.gameId);
      if (!game || (!game.playable && !user.isAdmin)) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        return socket.destroy();
      }
      return gs.wss.handleUpgrade(req, socket, head, (ws) => { ws.user = user; gs.wss.emit('connection', ws, user); });
    }
    wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, user));
  });

  wss.on('connection', (ws, user) => {
    ws.user = user;
    ws.alive = true;
    ws.activity = null;
    ws.msgCount = 0;
    const firstTab = !clients.has(user.id);
    if (firstTab) clients.set(user.id, new Set());
    clients.get(user.id).add(ws);
    send(ws, { type: 'hello', user: { id: user.id, username: user.username } });
    if (firstTab) broadcastPresence(user.id);

    ws.on('pong', () => { ws.alive = true; });

    ws.on('message', (raw) => {
      // Anti-abus : 30 messages max toutes les 10 secondes par onglet.
      if (++ws.msgCount > 30) return;
      let data;
      try { data = JSON.parse(raw); } catch { return; }
      if (!data || typeof data !== 'object') return;
      if (data.type === 'ping') return send(ws, { type: 'pong' });
      if (data.type === 'activity') {
        if (setActivity(ws, data)) broadcastPresence(user.id);
        return;
      }
      if (data.type === 'game' && typeof data.game === 'string') {
        const handler = gameHandlers.get(data.game);
        if (handler) {
          try { handler(user, data.data, (msg) => send(ws, { type: 'game', game: data.game, data: msg })); }
          catch (e) { console.error(`Erreur dans le jeu ${data.game} : ${e.message}`); }
        }
      }
    });

    ws.on('close', () => {
      const set = clients.get(user.id);
      if (!set) return;
      set.delete(ws);
      if (set.size === 0) clients.delete(user.id);
      broadcastPresence(user.id);
    });
  });

  // Toutes les 10 s : on remet à zéro les compteurs anti-abus.
  // Toutes les 30 s : on coupe les connexions mortes (onglet fermé brutalement, wifi perdu...).
  let tick = 0;
  setInterval(() => {
    tick++;
    for (const ws of wss.clients) {
      ws.msgCount = 0;
      if (tick % 3 === 0) {
        if (!ws.alive) { ws.terminate(); continue; }
        ws.alive = false;
        ws.ping();
      }
    }
  }, 10 * 1000).unref();

  return wss;
}

// Pour les futurs jeux : recevoir leurs messages WebSocket.
function onGameMessage(gameId, handler) {
  gameHandlers.set(gameId, handler);
}

// Pour les jeux rapides (FPS...) : une connexion WebSocket à eux, sur /games/<id>/ws,
// sans la limite de messages du temps réel du site. Le site vérifie que le joueur est
// connecté ; onConnection(ws, user) reçoit chaque nouvelle connexion.
function gameSocket(gameId, options, onConnection) {
  const wss = new WebSocketServer({ noServer: true, maxPayload: (options && options.maxPayload) || 4096 });
  wss.on('connection', onConnection);
  gameSockets.set(`/games/${gameId}/ws`, { wss, gameId });
  return wss;
}

module.exports = { attach, notify, isOnline, presenceOf, disconnectUser, broadcastPresence, onGameMessage, gameSocket };
