/* =====================================================================
   Code commun à toutes les pages du site.
   RÈGLE DE SÉCURITÉ : on n'utilise jamais innerHTML avec du texte venant
   des joueurs. La fonction el() crée les éléments et y met le texte avec
   textContent : un pseudo comme "<script>" s'affiche tel quel, sans danger.
   ===================================================================== */
(function () {
  'use strict';

  // Crée un élément HTML. Exemple : el('a', { href: '/', class: 'btn' }, 'Accueil')
  function el(tag, attrs) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === undefined || v === null || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (k === 'dataset') Object.assign(node.dataset, v);
      else if (k === 'href' && !/^(\/|#|\?)/.test(String(v))) node.setAttribute('href', '#'); // liens internes seulement
      else node.setAttribute(k, v === true ? '' : String(v));
    });
    for (var i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }
  function append(node, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) return child.forEach(function (c) { append(node, c); });
    node.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }

  // Petite icône SVG (dessinée depuis une liste de chemins, sans texte utilisateur).
  var ICONS = {
    menu: 'M3 6h18M3 12h18M3 18h18',
    up: 'M12 19V5M5 12l7-7 7 7',
    play: 'M8 5v14l11-7z',
    userPlus: 'M15 19a6 6 0 0 0-12 0M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6',
    send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
    x: 'M18 6 6 18M6 6l12 12',
    check: 'M20 6 9 17l-5-5',
  };
  function icon(name, size) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', size || 18);
    svg.setAttribute('height', size || 18);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', ICONS[name] || '');
    svg.appendChild(path);
    return svg;
  }

  // ---------- Notifications (en bas à droite) ----------
  function toast(message, opts) {
    opts = opts || {};
    var box = document.getElementById('toasts');
    if (!box) { box = el('div', { id: 'toasts', class: 'toasts', 'aria-live': 'polite' }); document.body.appendChild(box); }
    var t = el('div', { class: 'toast ' + (opts.type || ''), role: 'status' }, el('div', {}, message));
    function close() {
      t.classList.add('sortie');
      setTimeout(function () { t.remove(); }, 400);
    }
    if (opts.actions && opts.actions.length) {
      t.appendChild(el('div', { class: 'btn-row' }, opts.actions.map(function (a) {
        return el('button', { class: 'btn btn-sm ' + (a.class || ''), type: 'button', onclick: function () { close(); if (a.onClick) a.onClick(); } }, a.label);
      })));
    }
    box.appendChild(t);
    setTimeout(close, opts.timeout || 5000);
    return close;
  }

  // ---------- Fenêtre de dialogue simple ----------
  function dialog(title, content, buttons) {
    var d = el('dialog', {}, el('h2', { text: title }), content,
      el('div', { class: 'btn-row' }, (buttons || [{ label: 'Fermer' }]).map(function (b) {
        return el('button', { class: 'btn ' + (b.class || ''), type: 'button', onclick: function () { d.close(); if (b.onClick) b.onClick(); } }, b.label);
      })));
    d.addEventListener('close', function () { d.remove(); });
    document.body.appendChild(d);
    d.showModal();
    return d;
  }

  // "il y a 5 min"
  function timeAgo(ts) {
    if (!ts) return 'jamais';
    var s = Math.max(1, Math.round((Date.now() - ts) / 1000));
    if (s < 60) return 'à l\'instant';
    var m = Math.round(s / 60); if (m < 60) return 'il y a ' + m + ' min';
    var h = Math.round(m / 60); if (h < 24) return 'il y a ' + h + ' h';
    var d = Math.round(h / 24); if (d < 31) return 'il y a ' + d + ' j';
    return new Date(ts).toLocaleDateString('fr-FR');
  }
  function formatDate(ts) {
    return ts ? new Date(ts).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—';
  }

  // Affiche une erreur de formulaire dans une zone .form-error
  function showFormError(form, message) {
    var box = form.querySelector('.form-error');
    if (!box) { box = el('div', { class: 'form-error', role: 'alert' }); form.prepend(box); }
    box.textContent = message;
    box.classList.toggle('hidden', !message);
  }

  // Avatar : première lettre du pseudo + pastille de statut
  function avatar(name, state) {
    return el('div', { class: 'avatar', 'aria-hidden': 'true' },
      (name || '?').charAt(0).toUpperCase(),
      state !== undefined ? el('span', { class: 'dot ' + (state || '') }) : null);
  }

  // ---------- En-tête ----------
  var me = null;

  function setupHeader() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.nav');
    if (toggle && nav) {
      toggle.appendChild(icon('menu', 20));
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
    // Lien actif
    document.querySelectorAll('.nav a[href]').forEach(function (a) {
      if (a.getAttribute('href') === location.pathname) a.setAttribute('aria-current', 'page');
    });
    if (me) document.querySelectorAll('[data-me-name]').forEach(function (n) { n.textContent = me.username; });
    if (me && me.isAdmin) document.querySelectorAll('[data-admin-only]').forEach(function (n) { n.classList.remove('hidden'); });
    var logout = document.querySelector('[data-logout]');
    if (logout) logout.addEventListener('click', async function () {
      try { await Plateforme.api('POST', '/api/auth/logout', {}); } catch (e) { /* on redirige quand même */ }
      location.href = '/connexion';
    });
  }

  // Badge "demandes d'amis" dans le menu
  async function refreshFriendBadge() {
    var link = document.querySelector('[data-friends-link]');
    if (!link) return;
    try {
      var data = await Plateforme.amis();
      var old = link.querySelector('.badge');
      if (old) old.remove();
      if (data.incoming.length) link.appendChild(el('span', { class: 'badge', title: 'Demandes d\'amis' }, String(data.incoming.length)));
      document.dispatchEvent(new CustomEvent('amis:maj', { detail: data }));
    } catch (e) { /* silencieux */ }
  }

  function safeUrl(url) {
    return typeof url === 'string' && /^\/games\/[a-z0-9-]+\//.test(url) ? url : null;
  }

  function setupRealtime() {
    Plateforme.connecter();
    Plateforme.on('friend-request', function (msg) {
      toast(msg.from.username + ' veut devenir ton ami.', {
        actions: [{ label: 'Voir', onClick: function () { location.href = '/amis'; } }],
      });
      refreshFriendBadge();
    });
    Plateforme.on('friends-changed', refreshFriendBadge);
    Plateforme.on('invite', function (msg) {
      var url = safeUrl(msg.url);
      toast(msg.from.username + ' t\'invite à jouer à ' + msg.game.name + ' !', {
        timeout: 20000,
        actions: [
          { label: 'Rejoindre', onClick: function () { if (url) location.href = url; } },
          { label: 'Plus tard', class: 'btn-ghost' },
        ],
      });
    });
  }

  async function init() {
    var page = document.body.dataset.page;
    var guestPage = page === 'connexion' || page === 'inscription';
    if (!guestPage) {
      try { me = await Plateforme.moi(); } catch (e) { me = null; }
      if (!me) { location.href = '/connexion'; return; }
    }
    setupHeader();
    if (me) {
      setupRealtime();
      refreshFriendBadge();
    }
    var year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();
    document.dispatchEvent(new CustomEvent('app:pret', { detail: { me: me } }));
  }

  window.App = {
    el: el, clear: clear, icon: icon, toast: toast, dialog: dialog, avatar: avatar,
    timeAgo: timeAgo, formatDate: formatDate, showFormError: showFormError,
    refreshFriendBadge: refreshFriendBadge,
    me: function () { return me; },
    // Lance fn quand la page est prête (utilisateur connu).
    ready: function (fn) {
      if (App._ready) fn(App._ready);
      else document.addEventListener('app:pret', function (e) { fn(e.detail); }, { once: true });
    },
  };
  document.addEventListener('app:pret', function (e) { App._ready = e.detail; });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
