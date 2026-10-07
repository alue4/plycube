// Page "Idées & feuille de route"
(function () {
  var el = App.el;
  var LABELS = { planifiee: 'Planifiée', refusee: 'Pas retenue', ouverte: 'Ouverte aux votes' };

  async function loadRoadmap() {
    try {
      var data = await Plateforme.api('GET', '/api/roadmap');
      document.querySelectorAll('#roadmap [data-col]').forEach(function (col) {
        App.clear(col);
        var items = data.items.filter(function (i) { return i.col === col.dataset.col; });
        if (!items.length) col.appendChild(el('p', { class: 'empty' }, 'Rien pour l\'instant.'));
        items.forEach(function (i) {
          col.appendChild(el('div', { class: 'roadmap-item' },
            el('strong', { text: i.title }),
            i.description ? el('p', { text: i.description }) : null));
        });
      });
    } catch (e) { App.toast(e.message, { type: 'error' }); }
  }

  function suggestionCard(s) {
    var count = el('span', { text: String(s.votes) });
    var btn = el('button', {
      class: 'vote-btn' + (s.voted ? ' voted' : ''), type: 'button',
      'aria-pressed': String(s.voted),
      'aria-label': (s.voted ? 'Retirer mon vote' : 'Voter') + ' (' + s.votes + ' votes)',
      disabled: s.status !== 'ouverte',
      onclick: async function () {
        try {
          var r = await Plateforme.api('POST', '/api/suggestions/' + s.id + '/vote', {});
          s.voted = r.voted; s.votes = r.votes;
          count.textContent = String(r.votes);
          btn.classList.toggle('voted', r.voted);
          btn.setAttribute('aria-pressed', String(r.voted));
          // Petite animation (définie dans assets/animations/survol.css)
          btn.classList.remove('vote-anim'); void btn.offsetWidth; btn.classList.add('vote-anim');
        } catch (e) { App.toast(e.message, { type: 'error' }); }
      },
    }, App.icon('up', 16), count);

    return el('article', { class: 'suggestion', 'data-anim': 'apparition' },
      btn,
      el('div', { class: 'suggestion-body' },
        el('h3', { text: s.title }),
        s.body ? el('p', { text: s.body }) : null,
        el('div', { class: 'meta' },
          el('span', { class: 'label label-' + s.status, text: LABELS[s.status] || s.status }),
          el('span', { text: 'par ' + s.author + (s.mine ? ' (toi)' : '') }),
          el('span', { text: App.timeAgo(s.created_at) }))));
  }

  async function loadSuggestions() {
    var box = document.getElementById('suggestions');
    try {
      var data = await Plateforme.api('GET', '/api/suggestions');
      App.clear(box);
      if (!data.suggestions.length) box.appendChild(el('p', { class: 'empty' }, 'Aucune idée pour l\'instant. Sois le premier !'));
      data.suggestions.forEach(function (s) { box.appendChild(suggestionCard(s)); });
    } catch (e) {
      App.clear(box).appendChild(el('p', { class: 'empty', text: e.message }));
    }
  }

  App.ready(function () {
    loadRoadmap();
    loadSuggestions();

    var form = document.getElementById('suggest-form');
    var body = document.getElementById('s-body');
    var count = document.getElementById('s-count');
    body.addEventListener('input', function () { count.textContent = body.value.length; });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      App.showFormError(form, '');
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        await Plateforme.api('POST', '/api/suggestions', { title: document.getElementById('s-title').value, body: body.value });
        form.reset();
        count.textContent = '0';
        App.toast('Merci pour ton idée !', { type: 'success' });
        loadSuggestions();
      } catch (err) {
        App.showFormError(form, err.message);
      } finally {
        btn.disabled = false;
      }
    });
  });
})();
