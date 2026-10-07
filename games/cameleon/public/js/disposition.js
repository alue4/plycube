// Boutons tactiles de Caméléon (tablette) : chacun peut les déplacer et changer leur taille.
// La disposition est gardée dans ce navigateur (localStorage). Mode « édition » : on glisse un bouton
// pour le déplacer, on le touche pour le choisir, puis « Plus petit » / « Plus grand ».
import { el } from '/games/fps/js/hud.js';

const CLE = 'cameleon-disposition';
// Centre de chaque commande en % de l'écran (x de gauche à droite, y de haut en bas) et taille (1 = normale).
// Les boutons qui ne servent jamais en même temps partagent une place (Tirer / Peindre, Radar / Pose).
export const DISPOSITION_DEFAUT = {
  joystick: { x: 12, y: 80, taille: 1 },
  tirer: { x: 88, y: 72, taille: 1 },
  peindre: { x: 88, y: 72, taille: 1 },
  radar: { x: 95, y: 58, taille: 1 },
  pose: { x: 95, y: 58, taille: 1 },
  leurre: { x: 81, y: 58, taille: 1 },
  mapose: { x: 81, y: 72, taille: 1 },
  sauter: { x: 95, y: 86, taille: 1 },
  menu: { x: 81, y: 86, taille: 1 },
};
const NOMS = { joystick: 'Déplacement', tirer: 'Tirer', peindre: 'Peindre', radar: 'Radar', pose: 'Pose', leurre: 'Leurre', mapose: 'Ma pose', sauter: 'Sauter', menu: 'Menu' };
const borne = (v, a, b) => Math.max(a, Math.min(b, v));

export class DispositionTactile {
  // racine : #tactile ; surFin() : appelé en sortant du mode édition ; surRole(role) : afficher les boutons d'un rôle
  constructor(racine, { surFin, surRole } = {}) {
    this.racine = racine;
    this.surFin = surFin || (() => {});
    this.surRole = surRole || (() => {});
    this.dispo = this.charger();
    this.edition = false;
    this.selection = null;
    this.roleEdition = 'cacheur';
    this.outils = el('div', { class: 'outils-edition', hidden: true },
      el('p', { class: 'consigne', text: 'Fais glisser les boutons où tu veux. Touche un bouton puis agrandis-le ou rétrécis-le.' }),
      el('div', { class: 'rangee' },
        this.btnRole = el('button', { class: 'btn btn-petit', type: 'button', onclick: () => this.changerRole() }),
        el('button', { class: 'btn btn-petit', type: 'button', text: '− Plus petit', onclick: () => this.redimensionner(-0.1) }),
        el('button', { class: 'btn btn-petit', type: 'button', text: '+ Plus grand', onclick: () => this.redimensionner(0.1) }),
        el('button', { class: 'btn btn-petit danger', type: 'button', text: 'Réinitialiser', onclick: () => this.reinitialiser() }),
        el('button', { class: 'btn btn-petit', type: 'button', text: 'Terminé', onclick: () => this.finEdition() })));
    document.body.append(this.outils);
    addEventListener('resize', () => this.placerTout());
  }

  charger() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(CLE) || 'null'); } catch { s = null; }
    const res = {};
    for (const [id, d] of Object.entries(DISPOSITION_DEFAUT)) {
      const v = s && s[id];
      res[id] = v && Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.taille)
        ? { x: borne(v.x, 2, 98), y: borne(v.y, 3, 97), taille: borne(v.taille, 0.6, 1.8) } : { ...d };
    }
    return res;
  }

  sauver() { try { localStorage.setItem(CLE, JSON.stringify(this.dispo)); } catch { /* navigation privée */ } }

  // Les commandes présentes à l'écran : [data-commande="id"]
  commandes() { return [...this.racine.querySelectorAll('[data-commande]')]; }

  placer(elem) {
    const d = this.dispo[elem.dataset.commande];
    if (!d) return;
    elem.style.left = `${d.x}%`;
    elem.style.top = `${d.y}%`;
    elem.style.transform = `translate(-50%, -50%) scale(${d.taille})`;
  }

  placerTout() { for (const c of this.commandes()) this.placer(c); }

  // Branche le glisser (mode édition) sur une commande. Appelé à chaque création de bouton.
  brancher(elem) {
    elem.classList.add('commande-tactile');
    this.placer(elem);
    elem.addEventListener('pointerdown', (e) => {
      if (!this.edition) return;
      e.preventDefault();
      e.stopPropagation();
      this.choisir(elem.dataset.commande);
      const id = e.pointerId;
      try { elem.setPointerCapture(id); } catch { /* ancien navigateur */ }
      const bouge = (ev) => {
        if (ev.pointerId !== id) return;
        const d = this.dispo[elem.dataset.commande];
        d.x = borne((ev.clientX / innerWidth) * 100, 2, 98);
        d.y = borne((ev.clientY / innerHeight) * 100, 3, 97);
        this.placer(elem);
      };
      const fin = (ev) => {
        if (ev.pointerId !== id) return;
        elem.removeEventListener('pointermove', bouge);
        elem.removeEventListener('pointerup', fin);
        elem.removeEventListener('pointercancel', fin);
        this.sauver();
      };
      elem.addEventListener('pointermove', bouge);
      elem.addEventListener('pointerup', fin);
      elem.addEventListener('pointercancel', fin);
    });
  }

  // ---------- Mode édition ----------
  editer(role = 'cacheur') {
    this.edition = true;
    this.roleEdition = role === 'chercheur' ? 'chercheur' : 'cacheur';
    this.majRole();
    this.racine.hidden = false;
    this.racine.classList.add('edition');
    this.outils.hidden = false;
    this.choisir(this.commandes()[0] && this.commandes()[0].dataset.commande);
  }

  finEdition() {
    this.edition = false;
    this.racine.classList.remove('edition');
    this.outils.hidden = true;
    for (const c of this.commandes()) c.classList.remove('choisi');
    this.sauver();
    this.surFin();
  }

  changerRole() {
    this.roleEdition = this.roleEdition === 'cacheur' ? 'chercheur' : 'cacheur';
    this.majRole();
  }

  majRole() {
    this.surRole(this.roleEdition);
    this.btnRole.textContent = this.roleEdition === 'cacheur' ? 'Voir les boutons du chercheur' : 'Voir les boutons du cacheur';
    this.placerTout();
    if (!this.dispo[this.selection] || !this.commandes().some((c) => c.dataset.commande === this.selection)) this.choisir('joystick');
    else this.choisir(this.selection);
  }

  choisir(id) {
    this.selection = id;
    for (const c of this.commandes()) c.classList.toggle('choisi', c.dataset.commande === id);
  }

  redimensionner(delta) {
    const d = this.dispo[this.selection];
    if (!d) return;
    d.taille = borne(Math.round((d.taille + delta) * 10) / 10, 0.6, 1.8);
    this.placerTout();
    this.sauver();
  }

  reinitialiser() {
    for (const [id, d] of Object.entries(DISPOSITION_DEFAUT)) this.dispo[id] = { ...d };
    this.placerTout();
    this.sauver();
  }
}

export { NOMS as NOMS_COMMANDES };
