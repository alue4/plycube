// Page "Mes amis" : liste, demandes, rejoindre, inviter
(function () {
  var el = App.el;
  var playableGames = [];

  function fail(e) { App.toast(e.message, { type: 'error' }); }

  function statusText(f) {
    if (!f.online) return { text: 'Hors ligne · vu ' + App.timeAgo(f.lastSeen), cls: '' };
    if (f.activity && f.activity.gameName) return { text: 'Joue à ' + f.activity.gameName, cls: 'playing' };
    return { text: 'En ligne', cls: 'online' };
  }

  // Petit menu "Inviter à..." avec la liste des jeux jouables.
  function inviteButton(f) {
    var wrap = el('div', { class: 'menu-pop' });
    var btn = el('button', {
      class: 'btn btn-ghost btn-sm', type: 'button',
      disabled: !f.online || !playableGames.length,
      title: !playableGames.length ? 'Aucun jeu disponible pour l\'instant' : (!f.online ? 'Ton ami est hors ligne' : 'Inviter à jouer'),
      onclick: function (e) {
        e.stopPropagation();
        var existing = wrap.querySelector('.menu');
        if (existing) return existing.remove();
        document.querySelectorAll('.menu-pop .menu').forEach(function (m) { m.remove(); });
        wrap.appendChild(el('div', { class: 'menu', role: 'menu' }, playableGames.map(function (g) {
          return el('button', { type: 'button', role: 'menuitem', onclick: async function () {
            wrap.querySelector('.menu').remove();
            try {
              await Plateforme.inviter(f.id, g.id, null);
              App.toast('Invitation envoyée à ' + f.username + ' ✔', { type: 'success' });
            } catch (err) { fail(err); }
          } }, g.name);
        })));
      },
    }, App.icon('send', 14), 'Inviter');
    wrap.appendChild(btn);
    return wrap;
  }

  function friendRow(f) {
    var st = statusText(f);
    var dot = !f.online ? '' : (st.cls === 'playing' ? 'playing' : 'online');
    return el('li', { class: 'friend' },
      App.avatar(f.username, dot),
      el('div', { class: 'friend-info' },
        el('div', { class: 'friend-name', text: f.username }),
        el('div', { class: 'friend-status ' + st.cls, text: st.text })),
      el('div', { class: 'friend-actions' },
        f.activity && f.activity.joinable
          ? el('button', { class: 'btn btn-sm', type: 'button', onclick: function () { Plateforme.rejoindre(f.id).catch(fail); } }, App.icon('play', 14), 'Rejoindre')
          : null,
        inviteButton(f),
        el('button', {
          class: 'btn btn-danger btn-sm', type: 'button', title: 'Retirer de mes amis', 'aria-label': 'Retirer ' + f.username,
          onclick: async function () {
            if (!confirm('Retirer ' + f.username + ' de tes amis ?')) return;
            try { await Plateforme.retirerAmi(f.id); load(); } catch (e) { fail(e); }
          },
        }, App.icon('x', 14))));
  }

  function requestRow(r, incoming) {
    return el('li', { class: 'friend' },
      App.avatar(r.username),
      el('div', { class: 'friend-info' },
        el('div', { class: 'friend-name', text: r.username }),
        el('div', { class: 'friend-status', text: App.timeAgo(r.createdAt) })),
      el('div', { class: 'friend-actions' }, incoming ? [
        el('button', { class: 'btn btn-success btn-sm', type: 'button', onclick: function () { respond(r.id, true); } }, App.icon('check', 14), 'Accepter'),
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: function () { respond(r.id, false); } }, 'Refuser'),
      ] : el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: async function () {
        try { await Plateforme.annulerDemande(r.id); load(); } catch (e) { fail(e); }
      } }, 'Annuler')));
  }

  async function respond(id, accept) {
    try {
      await Plateforme.repondreDemande(id, accept);
      if (accept) App.toast('Nouvel ami ajouté 🎉', { type: 'success' });
      load();
    } catch (e) { fail(e); }
  }

  function render(data) {
    var list = App.clear(document.getElementById('friends'));
    document.getElementById('friends-count').textContent = data.friends.length ? '(' + data.friends.length + ')' : '';
    if (!data.friends.length) list.appendChild(el('li', { class: 'empty' }, 'Tu n\'as pas encore d\'amis. Ajoute quelqu\'un avec son pseudo !'));
    data.friends.forEach(function (f) { list.appendChild(friendRow(f)); });

    var inc = App.clear(document.getElementById('incoming'));
    if (!data.incoming.length) inc.appendChild(el('li', { class: 'empty' }, 'Aucune demande.'));
    data.incoming.forEach(function (r) { inc.appendChild(requestRow(r, true)); });

    var out = App.clear(document.getElementById('outgoing'));
    if (!data.outgoing.length) out.appendChild(el('li', { class: 'empty' }, 'Aucune demande en attente.'));
    data.outgoing.forEach(function (r) { out.appendChild(requestRow(r, false)); });
  }

  // Recharge tout (common.js met aussi à jour le badge du menu).
  function load() { App.refreshFriendBadge(); }

  App.ready(async function () {
    document.addEventListener('amis:maj', function (e) { render(e.detail); });
    try {
      playableGames = (await Plateforme.jeux()).filter(function (g) { return g.playable; });
    } catch (e) { playableGames = []; }
    load();

    // Mise à jour en direct quand un ami se connecte / change de jeu.
    var timer = null;
    Plateforme.on('presence', function () { clearTimeout(timer); timer = setTimeout(load, 300); });

    document.addEventListener('click', function () {
      document.querySelectorAll('.menu-pop .menu').forEach(function (m) { m.remove(); });
    });

    var form = document.getElementById('add-friend');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var name = form.username.value.trim();
      if (!name) return;
      try {
        var r = await Plateforme.demanderAmi(name);
        App.toast(r.accepted ? 'Vous êtes maintenant amis avec ' + r.username + ' 🎉' : 'Demande envoyée à ' + r.username + ' ✔', { type: 'success' });
        form.reset();
        load();
      } catch (err) { fail(err); }
    });
  });
})();
