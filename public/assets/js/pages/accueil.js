// Page d'accueil : catalogue des jeux + amis en ligne
(function () {
  var el = App.el;
  var STATUS_LABEL = { bientot: 'Bientôt disponible', beta: 'Bêta', disponible: 'Disponible', maintenance: 'En maintenance' };

  // ---------- Bande-annonce ----------
  // La boucle muette tourne dans la carte seulement quand la carte est à l'écran
  // (et pas du tout si l'élève a demandé moins d'animations) ; le bouton ouvre la vidéo complète avec le son.
  var moinsDAnimations = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var observateur = 'IntersectionObserver' in window ? new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        if (!v.getAttribute('src')) v.setAttribute('src', v.dataset.src);
        var p = v.play();
        if (p && p.catch) p.catch(function () { /* lecture bloquée : l'image reste affichée */ });
      } else v.pause();
    });
  }, { threshold: 0.4 }) : null;

  function boucle(g) {
    if (!g.trailerLoop || moinsDAnimations || !observateur) return null;
    var v = el('video', { class: 'cover-video', muted: true, loop: true, playsinline: true, preload: 'none', poster: g.image || null, 'aria-hidden': 'true', dataset: { src: g.trailerLoop } });
    v.muted = true;
    observateur.observe(v);
    return v;
  }

  function ouvrirBandeAnnonce(g) {
    var v = el('video', { class: 'trailer-video', controls: true, autoplay: true, playsinline: true, preload: 'auto', src: g.trailer, poster: g.image || null });
    var d = App.dialog('Bande-annonce · ' + g.name, v);
    d.classList.add('dialog-video');
    d.addEventListener('close', function () { v.pause(); });
  }

  function gameCard(g) {
    var cover = el('div', { class: 'game-cover' },
      g.image ? el('img', { src: g.image, alt: '', loading: 'lazy' }) : null,
      boucle(g),
      el('span', { class: 'status status-' + g.status }, STATUS_LABEL[g.status] || g.status),
      g.trailer ? el('button', { class: 'btn-trailer', type: 'button', onclick: function () { ouvrirBandeAnnonce(g); } }, App.icon('play', 14), 'Bande-annonce') : null);
    var action = g.playable
      ? el('a', { class: 'btn btn-block', href: g.url }, App.icon('play', 16), 'Jouer')
      : g.canTest
      ? el('a', { class: 'btn btn-ghost btn-block', href: g.url, title: 'Visible seulement par toi (admin)' }, App.icon('play', 16), 'Tester (admin)')
      : el('button', { class: 'btn btn-ghost btn-block', type: 'button', disabled: true }, STATUS_LABEL[g.status]);
    return el('article', { class: 'game-card' + (g.playable ? '' : ' is-soon'), 'data-anim': 'apparition' },
      cover,
      el('div', { class: 'game-body' },
        el('h3', { text: g.name }),
        el('p', { text: g.description }),
        g.tags.length || g.players ? el('div', { class: 'tags' },
          g.players ? el('span', { class: 'tag' }, App.ic('joueurs'), ' ' + g.players) : null,
          g.tags.map(function (t) { return el('span', { class: 'tag' }, t); })) : null,
        action));
  }

  async function loadGames() {
    var box = document.getElementById('games');
    try {
      var games = await Plateforme.jeux();
      App.clear(box);
      if (!games.length) box.appendChild(el('p', { class: 'empty' }, 'Aucun jeu pour le moment.'));
      games.forEach(function (g) { box.appendChild(gameCard(g)); });
    } catch (e) {
      App.clear(box).appendChild(el('p', { class: 'empty' }, e.message));
    }
  }

  function renderOnline(data) {
    var list = document.getElementById('online-friends');
    App.clear(list);
    var online = data.friends.filter(function (f) { return f.online; });
    if (!data.friends.length) {
      list.appendChild(el('li', { class: 'empty' }, 'Pas encore d\'amis. ', el('a', { href: '/amis' }, 'Ajoute-en !')));
      return;
    }
    if (!online.length) {
      list.appendChild(el('li', { class: 'empty' }, 'Aucun ami en ligne pour l\'instant.'));
      return;
    }
    online.forEach(function (f) {
      var playing = f.activity && f.activity.gameName;
      list.appendChild(el('li', { class: 'friend' },
        App.avatar(f.username, playing ? 'playing' : 'online'),
        el('div', { class: 'friend-info' },
          el('div', { class: 'friend-name', text: f.username }),
          el('div', { class: 'friend-status ' + (playing ? 'playing' : 'online') }, playing ? 'Joue à ' + f.activity.gameName : 'En ligne')),
        f.activity && f.activity.joinable
          ? el('button', { class: 'btn btn-sm', type: 'button', onclick: function () { Plateforme.rejoindre(f.id).catch(function (e) { App.toast(e.message, { type: 'error' }); }); } }, 'Rejoindre')
          : null));
    });
  }

  App.ready(function () {
    loadGames();
    // common.js recharge la liste d'amis et nous prévient via "amis:maj"
    document.addEventListener('amis:maj', function (e) { renderOnline(e.detail); });
    Plateforme.on('presence', function () { App.refreshFriendBadge(); });
  });
})();
