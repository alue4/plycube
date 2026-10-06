// Salle d'attente avant la partie : le code de la partie, la carte, les joueurs
// (avec leur tête en pixels) et le compte à rebours du départ automatique.
import { el } from './hud.js';
import { normaliserStyle, visageParDefaut, visageVersCouleurs } from './apparence.js';

const COULEURS_EQUIPES = ['#3d8bff', '#ff5a5a'];
const NOMS_EQUIPES = ['Bleus', 'Rouges'];

function chargerCss() {
  if (!document.querySelector('link[href="lobby.css"]')) document.head.append(el('link', { rel: 'stylesheet', href: 'lobby.css' }));
}

// Petite tête 8 × 8 dessinée dans un canvas
function tete(style) {
  const c = el('canvas', { width: 8, height: 8, class: 'tete-pixel', 'aria-hidden': 'true' });
  const s = normaliserStyle(style);
  const g = c.getContext('2d');
  visageVersCouleurs(s.visage || visageParDefaut(s)).forEach((col, i) => { g.fillStyle = col; g.fillRect(i % 8, Math.floor(i / 8), 1, 1); });
  return c;
}

export class SalleAttente {
  constructor({ surChoisirArmes, surEntrainer, surInviter, surQuitter } = {}) {
    chargerCss();
    this.actions = {
      armes: surChoisirArmes || (() => {}),
      entrainer: surEntrainer || (() => {}),
      inviter: surInviter || (() => {}),
      quitter: surQuitter || (() => {}),
    };
    this.estOuvert = false;
    this.finA = null;
    this.empreinte = '';
    this.construire();
  }

  get ouvert() { return this.estOuvert; }

  construire() {
    this.code = el('span', { class: 'code-partie' });
    this.carte = el('span', { class: 'nom-carte' });
    this.mode = el('span', { class: 'badge-mode' });
    this.statut = el('div', { class: 'statut-attente', role: 'status', 'aria-live': 'polite' });
    this.liste = el('div', { class: 'joueurs-attente' });
    this.racine = el('div', { class: 'salle-attente', hidden: true, role: 'dialog', 'aria-label': 'Salle d\'attente' },
      el('div', { class: 'attente' },
        el('header', {},
          el('div', {}, el('small', { text: 'Salle d\'attente · code de la partie' }), this.code),
          el('div', { class: 'infos-partie' }, this.carte, this.mode)),
        this.statut,
        this.liste,
        el('div', { class: 'actions-attente' },
          el('button', { class: 'btn', type: 'button', text: '🔫 Choisir mes armes', onclick: () => this.actions.armes() }),
          el('button', { class: 'btn entrainer', type: 'button', text: '🏃 S\'entraîner en attendant', onclick: () => this.actions.entrainer() }),
          el('button', { class: 'btn secondaire', type: 'button', text: '👥 Inviter des amis', onclick: () => this.actions.inviter() }),
          el('button', { class: 'btn danger', type: 'button', text: 'Quitter', onclick: () => this.actions.quitter() }))));
    document.body.append(this.racine);
  }

  ouvrir({ code, nomCarte, mode }) {
    this.code.textContent = code || '';
    this.carte.textContent = nomCarte || '';
    this.mode.textContent = mode === 'equipes' ? 'Bleus contre Rouges' : 'Chacun pour soi';
    this.mode.classList.toggle('equipes', mode === 'equipes');
    this.modeJeu = mode;
    this.racine.hidden = false;
    this.estOuvert = true;
    this.tic();
  }

  fermer() {
    this.estOuvert = false;
    this.racine.hidden = true;
    clearTimeout(this.minuteur);
  }

  // joueurs : [{ id, nom, style, pret, equipe }] ; dans : ms avant le départ (ou null) ; moiId : mon id
  maj({ joueurs = [], dans = null, moiId = null } = {}) {
    this.finA = typeof dans === 'number' ? performance.now() + Math.max(0, dans) : null;
    this.nbJoueurs = joueurs.length;
    const empreinte = JSON.stringify(joueurs.map((j) => [j.id, j.nom, !!j.pret, j.equipe, j.style && j.style.visage, j.style && j.style.peau, j.style && j.style.coupe]).concat([moiId, this.modeJeu]));
    if (empreinte !== this.empreinte) {
      this.empreinte = empreinte;
      this.dessinerJoueurs(joueurs, moiId);
    }
    this.majStatut();
  }

  dessinerJoueurs(joueurs, moiId) {
    const carte = (j) => {
      const c = el('div', { class: `joueur-attente${j.id === moiId ? ' moi' : ''}${j.pret ? ' pret' : ''}` },
        tete(j.style),
        el('div', { class: 'nom-attente' },
          el('b', { text: j.nom || '?' }),
          el('small', { text: j.pret ? '✓ Prêt' : 'Choisit ses armes…' })),
        j.id === moiId ? el('span', { class: 'toi', text: 'toi' }) : null);
      if (j.equipe === 0 || j.equipe === 1) c.style.borderColor = COULEURS_EQUIPES[j.equipe];
      return c;
    };
    if (this.modeJeu === 'equipes') {
      this.liste.classList.add('par-equipe');
      this.liste.replaceChildren(...[0, 1].map((e) => {
        const col = el('div', { class: 'colonne-equipe' }, el('h3', { text: NOMS_EQUIPES[e] }));
        col.querySelector('h3').style.color = COULEURS_EQUIPES[e];
        const membres = joueurs.filter((j) => j.equipe === e);
        if (!membres.length) col.append(el('p', { class: 'vide', text: 'Personne pour l\'instant' }));
        membres.forEach((j) => col.append(carte(j)));
        return col;
      }));
    } else {
      this.liste.classList.remove('par-equipe');
      this.liste.replaceChildren(...joueurs.map(carte));
    }
  }

  majStatut() {
    if (this.finA === null) {
      const points = '.'.repeat(1 + (Math.floor(performance.now() / 500) % 3));
      const texte = (this.nbJoueurs || 0) >= 2 ? 'Préparation de la partie' : 'En attente d\'un 2e joueur';
      if (!this.statut.classList.contains('attend')) {
        this.statut.className = 'statut-attente attend';
        this.statut.replaceChildren(el('span', { class: 'texte' }), el('small', { text: 'Invite tes amis ou partage le code ! La partie démarre toute seule 30 s après l\'arrivée du 2e joueur.' }));
      }
      this.statut.querySelector('.texte').textContent = `${texte}${points}`;
      return;
    }
    const s = Math.max(0, Math.ceil((this.finA - performance.now()) / 1000));
    if (!this.statut.classList.contains('decompte')) {
      this.statut.className = 'statut-attente decompte';
      this.statut.replaceChildren(el('span', { class: 'texte', text: 'La partie commence dans' }), el('b', { class: 'secondes' }), el('small', { text: 'Choisis tes armes en attendant !' }));
    }
    const b = this.statut.querySelector('.secondes');
    const txt = `${s} s`;
    if (b.textContent !== txt) {
      b.textContent = txt;
      b.classList.toggle('bientot', s <= 5);
      b.classList.remove('pulse');
      void b.offsetWidth;
      b.classList.add('pulse');
    }
  }

  tic() {
    clearTimeout(this.minuteur);
    if (!this.estOuvert) return;
    this.majStatut();
    this.minuteur = setTimeout(() => this.tic(), 250);
  }
}
