// « Ma pose » (Caméléon) : un cacheur règle sa taille et sa propre pose (position de départ + tête, corps,
// bras, jambes) pour mieux se fondre dans le décor. Gardé dans ce navigateur et envoyé au serveur
// (message « apparence ») : les autres le voient pareil, la zone de touche suit la taille, le leurre le copie.
import { el } from '/games/fps/js/hud.js';
import { icone } from '/games/fps/js/icones.js';

const CLE = 'cameleon-mapose';
// Le tableau d'une pose : [base (0 debout, 2 accroupi, 3 allongé), tête ↕, tête ↔, corps ↕, corps ↔,
// bras droit lever, bras droit écarter, bras gauche lever, bras gauche écarter, jambe droite, jambe gauche] (radians)
export const POSE_NEUTRE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// Bornes de chaque angle : les mêmes que le serveur (serveur/salon.js, BORNES_POSE)
const BORNES = [null, [-0.8, 0.8], [-1.2, 1.2], [-0.9, 0.9], [-0.6, 0.6], [-3.1, 1.2], [-0.3, 2.8], [-3.1, 1.2], [-0.3, 2.8], [-1.6, 1.6], [-1.6, 1.6]];
// Les curseurs : [indice, nom, sens] (sens -1 : on inverse pour que « vers la droite » = lever)
const GROUPES = [
  ['Tête', [[1, 'Baisser / lever', 1], [2, 'Tourner', 1]]],
  ['Corps', [[3, 'Pencher en avant', 1], [4, 'Pencher sur le côté', 1]]],
  ['Bras droit', [[5, 'Lever', -1], [6, 'Écarter', 1]]],
  ['Bras gauche', [[7, 'Lever', -1], [8, 'Écarter', 1]]],
  ['Jambes', [[9, 'Jambe droite', -1], [10, 'Jambe gauche', -1]]],
];
const BASES = [[0, 'Debout'], [2, 'Accroupi'], [3, 'Allongé']];
const borne = (v, a, b) => Math.max(a, Math.min(b, v));

// Le tableau → les pistes du personnage ([t, x, y, z, rx, ry, rz] par partie, comme les poses et les danses)
export function poseDepuis(tableau, poses) {
  const p = Array.isArray(tableau) && tableau.length === POSE_NEUTRE.length ? tableau : POSE_NEUTRE;
  const base = (p[0] === 2 || p[0] === 3) && poses[p[0]] ? poses[p[0]] : {};
  const res = {};
  for (const [k, v] of Object.entries(base)) res[k] = [...v];
  const tourner = (nom, rx, ry, rz) => {
    const k = res[nom] || [0, 0, 0, 0, 0, 0, 0];
    k[4] += rx; k[5] += ry; k[6] += rz;
    res[nom] = k;
  };
  tourner('tete', p[1], p[2], 0);
  tourner('corps', p[3], 0, p[4]);
  tourner('brasD', p[5], 0, p[6]);
  tourner('brasG', p[7], 0, -p[8]); // (écarter le bras gauche = tourner dans l'autre sens)
  tourner('jambeD', p[9], 0, 0);
  tourner('jambeG', p[10], 0, 0);
  return res;
}

export class MaPose {
  // min, max : bornes de la taille ; surChange(changePose) : appelé à chaque réglage
  constructor({ min = 0.6, max = 1.4, surChange, surFermer } = {}) {
    this.min = min; this.max = max;
    this.surChange = surChange || (() => {});
    this.surFermer = surFermer || (() => {});
    const s = this.charger();
    this.taille = s.taille;
    this.pose = s.pose;
    this.curseurs = [];
    this.construire();
  }

  charger() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(CLE) || 'null'); } catch { s = null; }
    const taille = s && Number.isFinite(s.taille) ? borne(s.taille, this.min, this.max) : 1;
    let pose = [...POSE_NEUTRE];
    if (s && Array.isArray(s.pose) && s.pose.length === POSE_NEUTRE.length && s.pose.every(Number.isFinite)) {
      pose = s.pose.map((v, i) => (i === 0 ? ([0, 2, 3].includes(v) ? v : 0) : borne(v, BORNES[i][0], BORNES[i][1])));
    }
    return { taille, pose };
  }

  sauver() { try { localStorage.setItem(CLE, JSON.stringify({ taille: this.taille, pose: this.pose })); } catch { /* navigation privée */ } }

  construire() {
    this.texteTaille = el('b');
    this.curseurTaille = el('input', { type: 'range', min: String(this.min), max: String(this.max), step: '0.05', 'aria-label': 'Taille' });
    this.curseurTaille.addEventListener('input', () => { this.taille = Number(this.curseurTaille.value); this.maj(false); });
    this.boutonsBase = BASES.map(([v, nom]) => {
      const b = el('button', { type: 'button', class: 'mp-base', text: nom });
      b.addEventListener('click', () => { this.pose[0] = v; this.maj(true); });
      b.dataset.base = String(v);
      return b;
    });
    const groupes = GROUPES.map(([titre, reglages]) => el('div', { class: 'mp-groupe' },
      el('div', { class: 'mp-titre', text: titre }),
      ...reglages.map(([i, nom, sens]) => {
        const [a, b] = BORNES[i];
        const c = el('input', { type: 'range', min: String(sens > 0 ? a : -b), max: String(sens > 0 ? b : -a), step: '0.05', 'aria-label': `${titre} : ${nom}` });
        c.addEventListener('input', () => { this.pose[i] = Math.round(sens * Number(c.value) * 100) / 100; this.maj(true); });
        this.curseurs.push({ c, i, sens });
        return el('label', { class: 'mp-ligne' }, el('span', { text: nom }), c);
      })));
    this.racine = el('div', { id: 'mapose', class: 'mapose', hidden: true, role: 'dialog', 'aria-label': 'Ma pose et ma taille' },
      el('header', { class: 'mp-entete' }, el('b', {}, icone('pose'), ' Ma pose et ma taille'),
        el('button', { type: 'button', class: 'mp-fermer', 'aria-label': 'Fermer', onclick: () => this.fermer() }, icone('croix'))),
      el('label', { class: 'mp-ligne mp-taille' }, el('span', {}, 'Taille : ', this.texteTaille), this.curseurTaille),
      el('div', { class: 'mp-titre', text: 'Position de départ' }),
      el('div', { class: 'mp-bases' }, ...this.boutonsBase),
      ...groupes,
      el('div', { class: 'mp-actions' },
        el('button', { type: 'button', onclick: () => this.remettreAZero() }, icone('recharger'), ' Remettre à zéro'),
        el('button', { type: 'button', class: 'mp-ok', onclick: () => this.fermer() }, icone('valider'), ' OK')),
      el('p', { class: 'mp-astuce', text: 'Tu prends ta pose tout de suite. Bouger la fait quitter ; touche 4 (ou le bouton Pose) pour la reprendre. Plus tu es petit, plus tu es dur à toucher !' }));
    document.body.append(this.racine);
    this.afficher();
  }

  // Les curseurs et les boutons suivent les valeurs
  afficher() {
    this.curseurTaille.value = String(this.taille);
    this.texteTaille.textContent = `${Math.round(this.taille * 100)} %`;
    for (const b of this.boutonsBase) b.classList.toggle('choisi', Number(b.dataset.base) === this.pose[0]);
    for (const { c, i, sens } of this.curseurs) c.value = String(sens * this.pose[i]);
  }

  maj(changePose) {
    this.afficher();
    this.sauver();
    this.surChange(changePose);
  }

  remettreAZero() {
    this.taille = 1;
    this.pose = [...POSE_NEUTRE];
    this.maj(true);
  }

  get ouvert() { return !this.racine.hidden; }
  ouvrir() { this.afficher(); this.racine.hidden = false; }
  fermer() {
    if (this.racine.hidden) return;
    this.racine.hidden = true;
    this.surFermer();
  }
}
