/* =====================================================================
   PLATEFORME — API JavaScript partagée par le site et TOUS les jeux.
   ---------------------------------------------------------------------
   Un jeu l'inclut avec :   <script src="/assets/js/platform.js"></script>

   Exemples d'utilisation dans un jeu :
     const moi = await Plateforme.moi();                 // { id, username, isAdmin } ou null
     Plateforme.connecter();                             // temps réel (présence, invitations)
     Plateforme.definirActivite({ jeu: 'fps', salle: 'abc123', rejoignable: true });
     const { friends } = await Plateforme.amis();        // liste des amis + statut
     await Plateforme.inviter(idAmi, 'fps', 'abc123');   // envoie une invitation
     await Plateforme.rejoindre(idAmi);                  // va dans la partie de l'ami
     Plateforme.on('invite', (msg) => { ... });          // reçoit une invitation
     Plateforme.on('presence', (msg) => { ... });        // un ami change de statut
     Plateforme.salleDansAdresse();                      // lit ?room=... dans l'adresse
   ===================================================================== */
(function () {
  'use strict';

  var listeners = {};
  var ws = null;
  var activity = null;
  var retryDelay = 1000;
  var wanted = false;

  function emit(type, msg) {
    (listeners[type] || []).concat(listeners['*'] || []).forEach(function (fn) {
      try { fn(msg); } catch (e) { console.error(e); }
    });
  }

  // Appel à l'API du site. Lance une erreur avec un message lisible si ça échoue.
  async function api(method, url, body) {
    var opts = { method: method, credentials: 'same-origin', headers: { Accept: 'application/json' } };
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    var res;
    try { res = await fetch(url, opts); } catch (e) { throw new Error('Connexion au serveur impossible.'); }
    var data = null;
    try { data = await res.json(); } catch (e) { /* réponse vide */ }
    if (!res.ok) {
      var err = new Error((data && data.error) || 'Erreur ' + res.status);
      err.status = res.status;
      err.field = data && data.field;
      throw err;
    }
    return data;
  }

  function send(msg) {
    if (ws && ws.readyState === 1) ws.send(JSON.stringify(msg));
  }

  function connect() {
    wanted = true;
    if (ws && (ws.readyState === 0 || ws.readyState === 1)) return;
    var proto = location.protocol === 'https:' ? 'wss://' : 'ws://';
    ws = new WebSocket(proto + location.host + '/ws');
    ws.onopen = function () {
      retryDelay = 1000;
      if (activity) send(activity); // on renvoie notre activité après une reconnexion
      emit('connecte', {});
    };
    ws.onmessage = function (ev) {
      var msg;
      try { msg = JSON.parse(ev.data); } catch (e) { return; }
      if (msg && typeof msg.type === 'string') emit(msg.type, msg);
    };
    ws.onclose = function (ev) {
      emit('deconnecte', { code: ev.code });
      if (ev.code === 4001) { location.href = '/connexion'; return; } // compte bloqué
      if (!wanted) return;
      // Reconnexion automatique, de plus en plus espacée (max 30 s).
      setTimeout(connect, retryDelay);
      retryDelay = Math.min(retryDelay * 2, 30000);
    };
  }

  // Garde la connexion vivante derrière certains proxys.
  setInterval(function () { send({ type: 'ping' }); }, 25000);

  window.Plateforme = {
    api: api,
    connecter: connect,

    moi: function () {
      return api('GET', '/api/auth/me').then(function (d) { return d.user; });
    },

    // Abonnement aux messages temps réel : 'invite', 'presence', 'friend-request',
    // 'friends-changed', 'hello', 'game', 'connecte', 'deconnecte', ou '*' pour tout.
    on: function (type, fn) {
      (listeners[type] = listeners[type] || []).push(fn);
      return function () { listeners[type] = listeners[type].filter(function (f) { return f !== fn; }); };
    },

    // Indique aux amis à quoi on joue. salle = identifiant de partie (lettres, chiffres, - et _).
    definirActivite: function (opts) {
      activity = { type: 'activity', game: opts.jeu, room: opts.salle || null, joinable: !!opts.rejoignable };
      send(activity);
    },
    effacerActivite: function () {
      activity = null;
      send({ type: 'activity', game: null });
    },

    amis: function () { return api('GET', '/api/friends'); },
    demanderAmi: function (pseudo) { return api('POST', '/api/friends/request', { username: pseudo }); },
    repondreDemande: function (idDemande, accepter) { return api('POST', '/api/friends/respond', { requestId: idDemande, accept: !!accepter }); },
    annulerDemande: function (idDemande) { return api('POST', '/api/friends/cancel', { requestId: idDemande }); },
    retirerAmi: function (idAmi) { return api('DELETE', '/api/friends/' + encodeURIComponent(idAmi)); },
    inviter: function (idAmi, jeu, salle) { return api('POST', '/api/friends/invite', { userId: idAmi, game: jeu, room: salle || null }); },
    rejoindre: function (idAmi) {
      return api('GET', '/api/friends/' + encodeURIComponent(idAmi) + '/join').then(function (d) {
        location.href = d.url;
        return d;
      });
    },
    jeux: function () { return api('GET', '/api/games').then(function (d) { return d.games; }); },

    // Message libre vers la partie serveur d'un jeu (voir README, "Ajouter un jeu").
    envoyerAuJeu: function (jeu, data) { send({ type: 'game', game: jeu, data: data }); },

    salleDansAdresse: function () {
      var r = new URLSearchParams(location.search).get('room');
      return r && /^[A-Za-z0-9_-]{1,40}$/.test(r) ? r : null;
    },
  };
})();
