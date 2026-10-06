// Panneau d'administration
(function () {
  var el = App.el;
  var api = Plateforme.api;
  var STATUS = { ouverte: 'Ouverte', planifiee: 'Planifiée', refusee: 'Refusée', masquee: 'Masquée' };
  var COLS = { en_cours: 'En cours', prochainement: 'Prochainement', termine: 'Terminé' };

  function fail(e) { App.toast(e.message, { type: 'error' }); }
  async function act(fn, reload) {
    try { await fn(); if (reload) reload(); } catch (e) { fail(e); }
  }

  // ---------- Onglets ----------
  var loaders = {};
  function showTab(name) {
    document.querySelectorAll('[data-tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === name)); });
    document.querySelectorAll('[data-panel]').forEach(function (p) { p.classList.toggle('hidden', p.dataset.panel !== name); });
    if (loaders[name]) loaders[name]();
    history.replaceState(null, '', '#' + name);
  }

  // ---------- Tableau de bord ----------
  loaders.dashboard = async function () {
    try {
      var s = await api('GET', '/api/admin/stats');
      var box = App.clear(document.getElementById('stats'));
      [[s.users, 'joueurs inscrits'], [s.blocked, 'comptes bloqués'], [s.activeCodes, 'codes d\'invitation actifs'], [s.openSuggestions, 'suggestions ouvertes']]
        .forEach(function (x) {
          box.appendChild(el('div', { class: 'stat', 'data-anim': 'apparition' }, el('div', { class: 'n', text: String(x[0]) }), el('div', { class: 'l', text: x[1] })));
        });
    } catch (e) { fail(e); }
  };

  // ---------- Codes d'invitation ----------
  loaders.invites = async function () {
    try {
      var data = await api('GET', '/api/admin/invites');
      var body = App.clear(document.getElementById('invites'));
      if (!data.invites.length) body.appendChild(el('tr', {}, el('td', { colspan: 6, class: 'empty' }, 'Aucun code. Crée le premier ci-dessus !')));
      data.invites.forEach(function (c) {
        var used = c.uses >= c.max_uses;
        var state = !c.active ? 'Désactivé' : used ? 'Épuisé' : 'Actif';
        body.appendChild(el('tr', {},
          el('td', {}, el('span', { class: 'code', text: c.code })),
          el('td', { text: c.note || '—' }),
          el('td', { text: c.uses + ' / ' + c.max_uses }),
          el('td', {}, el('span', { class: 'label ' + (state === 'Actif' ? 'label-ouverte' : 'label-masquee'), text: state })),
          el('td', { class: 'muted', text: App.formatDate(c.created_at) }),
          el('td', {}, el('div', { class: 'btn-row' },
            el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: function () { copy(c.code); } }, 'Copier'),
            el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: function () {
              act(function () { return api('PATCH', '/api/admin/invites/' + c.id, { active: !c.active }); }, loaders.invites);
            } }, c.active ? 'Désactiver' : 'Réactiver'),
            el('button', { class: 'btn btn-danger btn-sm', type: 'button', onclick: function () {
              if (confirm('Supprimer le code ' + c.code + ' ? (les comptes déjà créés restent)')) {
                act(function () { return api('DELETE', '/api/admin/invites/' + c.id); }, loaders.invites);
              }
            } }, 'Supprimer')))));
      });
    } catch (e) { fail(e); }
  };

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { App.toast('Copié : ' + text, { type: 'success' }); }, function () { App.toast(text); });
    } else {
      App.toast('Code : ' + text, { timeout: 10000 }); // copie automatique impossible sans HTTPS
    }
  }

  document.getElementById('invite-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
      var r = await api('POST', '/api/admin/invites', {
        maxUses: document.getElementById('i-uses').value,
        count: document.getElementById('i-count').value,
        note: document.getElementById('i-note').value,
      });
      App.dialog(r.codes.length > 1 ? 'Codes créés' : 'Code créé',
        el('div', {},
          el('p', { class: 'muted' }, 'Donne ce code à l\'élève : il le tapera sur la page d\'inscription.'),
          el('p', {}, r.codes.map(function (c) { return [el('span', { class: 'code', text: c }), ' ']; }))));
      loaders.invites();
    } catch (err) { fail(err); }
  });

  // ---------- Joueurs ----------
  var allUsers = [];
  function renderUsers() {
    var q = document.getElementById('user-search').value.trim().toLowerCase();
    var body = App.clear(document.getElementById('users'));
    var list = allUsers.filter(function (u) { return !q || u.username.toLowerCase().includes(q); });
    if (!list.length) body.appendChild(el('tr', {}, el('td', { colspan: 6, class: 'empty' }, 'Aucun joueur.')));
    list.forEach(function (u) {
      var status = u.is_admin ? 'Admin' : u.is_blocked ? 'Bloqué' : u.online ? 'En ligne' : 'Hors ligne';
      body.appendChild(el('tr', {},
        el('td', {}, el('strong', { text: u.username })),
        el('td', {}, el('span', { class: 'label ' + (u.is_blocked ? 'label-refusee' : u.online ? 'label-ouverte' : 'label-masquee'), text: status })),
        el('td', { class: 'muted', text: App.formatDate(u.created_at) }),
        el('td', { class: 'muted', text: u.online ? 'maintenant' : App.timeAgo(u.last_seen) }),
        el('td', {}, u.invite_code ? el('span', { class: 'code', text: u.invite_code }) : '—'),
        el('td', {}, u.is_admin ? null : el('div', { class: 'btn-row' },
          el('button', { class: 'btn btn-sm ' + (u.is_blocked ? 'btn-success' : 'btn-danger'), type: 'button', onclick: function () {
            if (!u.is_blocked && !confirm('Bloquer ' + u.username + ' ? Il sera déconnecté immédiatement.')) return;
            act(function () { return api('POST', '/api/admin/users/' + u.id + '/block', { blocked: !u.is_blocked }); }, loaders.users);
          } }, u.is_blocked ? 'Débloquer' : 'Bloquer'),
          el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: async function () {
            if (!confirm('Créer un mot de passe provisoire pour ' + u.username + ' ?')) return;
            try {
              var r = await api('POST', '/api/admin/users/' + u.id + '/reset-password', {});
              App.dialog('Mot de passe provisoire', el('div', {},
                el('p', {}, 'Nouveau mot de passe de ', el('strong', { text: u.username }), ' :'),
                el('p', {}, el('span', { class: 'code', text: r.password })),
                el('p', { class: 'muted small' }, 'Note-le maintenant : il ne sera plus affiché. L\'élève pourra le changer dans « Mon compte ».')));
            } catch (e) { fail(e); }
          } }, 'Mot de passe'),
          el('button', { class: 'btn btn-danger btn-sm', type: 'button', title: 'Supprimer le compte', onclick: function () {
            if (!confirm('Supprimer définitivement le compte ' + u.username + ' ? Cette action est irréversible.')) return;
            act(function () { return api('DELETE', '/api/admin/users/' + u.id); }, loaders.users);
          } }, 'Supprimer')))));
    });
  }
  loaders.users = async function () {
    try { allUsers = (await api('GET', '/api/admin/users')).users; renderUsers(); } catch (e) { fail(e); }
  };
  document.getElementById('user-search').addEventListener('input', renderUsers);

  // ---------- Suggestions ----------
  loaders.suggestions = async function () {
    try {
      var data = await api('GET', '/api/admin/suggestions');
      var body = App.clear(document.getElementById('admin-suggestions'));
      if (!data.suggestions.length) body.appendChild(el('tr', {}, el('td', { colspan: 5, class: 'empty' }, 'Aucune suggestion.')));
      data.suggestions.forEach(function (s) {
        var select = el('select', { 'aria-label': 'Statut', onchange: function () {
          act(function () { return api('PATCH', '/api/admin/suggestions/' + s.id, { status: select.value }); }, loaders.suggestions);
        } }, Object.keys(STATUS).map(function (k) { return el('option', { value: k, selected: k === s.status }, STATUS[k]); }));
        body.appendChild(el('tr', {},
          el('td', {}, el('strong', { text: String(s.votes) })),
          el('td', {}, el('strong', { text: s.title }), s.body ? el('div', { class: 'muted small', text: s.body }) : null),
          el('td', { class: 'muted', text: s.author || 'compte supprimé' }),
          el('td', {}, select),
          el('td', {}, el('div', { class: 'btn-row' },
            s.on_roadmap ? el('span', { class: 'muted small' }, 'Sur la feuille de route') :
              el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: function () {
                act(function () { return api('POST', '/api/admin/suggestions/' + s.id + '/to-roadmap', { col: 'prochainement' }); }, loaders.suggestions);
              } }, '→ Feuille de route'),
            el('button', { class: 'btn btn-danger btn-sm', type: 'button', onclick: function () {
              if (confirm('Supprimer cette suggestion ?')) act(function () { return api('DELETE', '/api/admin/suggestions/' + s.id); }, loaders.suggestions);
            } }, 'Supprimer')))));
      });
    } catch (e) { fail(e); }
  };

  // ---------- Feuille de route ----------
  function editItem(item) {
    var t = el('input', { type: 'text', maxlength: 100, value: item.title });
    var d = el('textarea', { maxlength: 500 }); d.value = item.description;
    App.dialog('Modifier', el('div', {},
      el('div', { class: 'field' }, el('label', { text: 'Titre' }), t),
      el('div', { class: 'field' }, el('label', { text: 'Description' }), d)), [
      { label: 'Annuler', class: 'btn-ghost' },
      { label: 'Enregistrer', onClick: function () {
        act(function () { return api('PATCH', '/api/admin/roadmap/' + item.id, { title: t.value, description: d.value }); }, loaders.roadmap);
      } },
    ]);
  }

  loaders.roadmap = async function () {
    try {
      var data = await api('GET', '/api/roadmap');
      document.querySelectorAll('#admin-roadmap [data-col]').forEach(function (col) {
        App.clear(col);
        var items = data.items.filter(function (i) { return i.col === col.dataset.col; });
        if (!items.length) col.appendChild(el('p', { class: 'empty' }, 'Vide'));
        items.forEach(function (i) {
          var others = Object.keys(COLS).filter(function (c) { return c !== i.col; });
          col.appendChild(el('div', { class: 'roadmap-item' },
            el('div', {}, el('strong', { text: i.title }), i.description ? el('p', { text: i.description }) : null),
            el('div', { class: 'icon-btns' },
              el('button', { class: 'icon-btn', type: 'button', title: 'Monter', onclick: function () {
                act(function () { return api('POST', '/api/admin/roadmap/' + i.id + '/move', { dir: 'up' }); }, loaders.roadmap);
              } }, '↑'),
              el('button', { class: 'icon-btn', type: 'button', title: 'Descendre', onclick: function () {
                act(function () { return api('POST', '/api/admin/roadmap/' + i.id + '/move', { dir: 'down' }); }, loaders.roadmap);
              } }, '↓'),
              others.map(function (c) {
                return el('button', { class: 'icon-btn', type: 'button', title: 'Déplacer vers « ' + COLS[c] + ' »', onclick: function () {
                  act(function () { return api('PATCH', '/api/admin/roadmap/' + i.id, { col: c }); }, loaders.roadmap);
                } }, c === 'en_cours' ? '▶' : c === 'prochainement' ? '⋯' : '✓');
              }),
              el('button', { class: 'icon-btn', type: 'button', title: 'Modifier', onclick: function () { editItem(i); } }, '✎'),
              el('button', { class: 'icon-btn danger', type: 'button', title: 'Supprimer', onclick: function () {
                if (confirm('Supprimer « ' + i.title + ' » ?')) act(function () { return api('DELETE', '/api/admin/roadmap/' + i.id); }, loaders.roadmap);
              } }, '✕'))));
        });
      });
    } catch (e) { fail(e); }
  };

  document.getElementById('roadmap-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    var title = document.getElementById('r-title');
    try {
      await api('POST', '/api/admin/roadmap', {
        title: title.value,
        description: document.getElementById('r-desc').value,
        col: document.getElementById('r-col').value,
      });
      e.target.reset();
      loaders.roadmap();
    } catch (err) { fail(err); }
  });

  App.ready(function () {
    document.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () { showTab(b.dataset.tab); });
    });
    var start = location.hash.slice(1);
    showTab(loaders[start] ? start : 'dashboard');
    window.addEventListener('hashchange', function () {
      var t = location.hash.slice(1);
      if (loaders[t]) showTab(t);
    });
  });
})();
