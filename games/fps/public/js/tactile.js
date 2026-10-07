// Commandes tactiles (iPad, tablettes) : un joystick pour se déplacer, l'écran pour
// regarder, et des boutons (tirer, viser, sauter, recharger, armes 1 à 5...).
// Chaque joueur peut déplacer et agrandir les boutons : la disposition est gardée
// dans le navigateur (mode "édition").
import { el } from './hud.js';
import { icone } from './icones.js';

// Position du centre de chaque commande, en % de l'écran (x de gauche à droite, y de haut en bas).
export const DISPOSITION_DEFAUT = {
  joystick: { x: 15, y: 70, taille: 1 },
  tir: { x: 86, y: 60, taille: 1 },
  visee: { x: 72, y: 80, taille: 1 },
  saut: { x: 90, y: 84, taille: 1 },
  recharge: { x: 75, y: 46, taille: 1 },
  inspection: { x: 62, y: 46, taille: 1 },
  armes: { x: 50, y: 92, taille: 1 },
  menu: { x: 5, y: 9, taille: 1 },
  scores: { x: 13, y: 9, taille: 1 },
  danse: { x: 21, y: 9, taille: 1 },
};
const NOMS = {
  joystick: 'Déplacement', tir: 'Tirer', visee: 'Viser', saut: 'Sauter', recharge: 'Recharger',
  inspection: 'Regarder son arme', armes: 'Armes', menu: 'Menu', scores: 'Scores', danse: 'Danser',
};

export class Tactile {
  // actions : { regarder(dx, dy), deplacer(cote, avant), tir(oui), viser(), saut(oui), recharger(), arme(i), menu(), scores(oui), danse() }
  constructor(racine, actions, disposition, sauver) {
    this.racine = racine;
    this.actions = actions;
    this.sauver = sauver;
    this.dispo = this.fusion(disposition);
    this.edition = false;
    this.selection = null;
    this.elements = {};

    // Zone de regard : tout l'écran, sous les boutons
    this.zone = el('div', { class: 'zone-regard' });
    racine.append(this.zone);
    this.suivreGlisser(this.zone, {
      bouge: (dx, dy) => this.actions.regarder(dx, dy),
    });

    // Joystick
    const manette = el('div', { class: 'manette' });
    this.manette = manette;
    const joy = this.commande('joystick', el('div', { class: 'joystick' }, el('div', { class: 'base' }, manette)));
    this.suivreGlisser(joy, {
      debut: (x, y) => { this.centreJoy = this.centre(joy); this.majJoy(x, y, manette); },
      bouge: (dx, dy, x, y) => this.majJoy(x, y, manette),
      fin: () => { manette.style.transform = ''; this.actions.deplacer(0, 0); },
    });

    // Boutons
    const bouton = (id, texte, classe = '') => this.commande(id, el('div', { class: `bouton ${classe}`, role: 'button', 'aria-label': NOMS[id] }, texte));
    const tir = bouton('tir', 'TIRER', 'gros');
    this.suivreGlisser(tir, {
      debut: () => this.actions.tir(true),
      bouge: (dx, dy) => this.actions.regarder(dx, dy), // on peut viser en gardant le doigt sur "Tirer"
      fin: () => this.actions.tir(false),
    });
    this.btnVisee = bouton('visee', 'VISER');
    this.suivreGlisser(this.btnVisee, { debut: () => this.marquerVisee(this.actions.viser()) });
    const saut = bouton('saut', 'SAUTER');
    this.suivreGlisser(saut, { debut: () => this.actions.saut(true), fin: () => this.actions.saut(false) });
    const recharge = bouton('recharge', icone('recharger'), 'petit');
    this.suivreGlisser(recharge, { debut: () => this.actions.recharger() });
    const inspection = bouton('inspection', icone('oeil'), 'petit');
    this.suivreGlisser(inspection, { debut: () => this.actions.inspecter && this.actions.inspecter() });
    const menu = bouton('menu', icone('menu'), 'petit');
    this.suivreGlisser(menu, { debut: () => this.actions.menu() });
    const scores = bouton('scores', icone('trophee'), 'petit');
    this.suivreGlisser(scores, { debut: () => this.actions.scores(true), fin: () => this.actions.scores(false) });
    const danse = bouton('danse', icone('danse'), 'petit');
    this.suivreGlisser(danse, { debut: () => this.actions.danse && this.actions.danse() });

    // Armes 1 à 5
    this.barre = el('div', { class: 'armes-tactiles' });
    this.commande('armes', this.barre);
    this.suivreGlisser(this.elements.armes, {}); // pour pouvoir déplacer la barre en édition

    // Barre d'outils du mode édition
    this.outils = el('div', { class: 'outils-edition' },
      el('p', { class: 'consigne', text: 'Fais glisser les boutons où tu veux. Touche un bouton puis agrandis-le ou rétrécis-le.' }),
      el('div', { class: 'rangee' },
        el('button', { class: 'btn', type: 'button', text: '− Plus petit', onclick: () => this.redimensionner(-0.1) }),
        el('button', { class: 'btn', type: 'button', text: '+ Plus grand', onclick: () => this.redimensionner(0.1) }),
        el('button', { class: 'btn danger', type: 'button', text: 'Réinitialiser', onclick: () => this.reinitialiser() }),
        el('button', { class: 'btn', type: 'button', text: '✓ Terminé', onclick: () => this.finEdition() })));
    this.outils.hidden = true;
    racine.append(this.outils);
    this.placerTout();
    addEventListener('resize', () => this.placerTout());
  }

  fusion(d) {
    const res = {};
    for (const [k, v] of Object.entries(DISPOSITION_DEFAUT)) res[k] = { ...v, ...((d && d[k]) || {}) };
    return res;
  }

  commande(id, contenu) {
    const c = el('div', { class: 'commande', 'data-id': id }, contenu);
    this.racine.append(c);
    this.elements[id] = c;
    return c;
  }

  centre(elem) {
    const r = elem.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, rayon: r.width / 2 };
  }

  majJoy(x, y, manette) {
    const c = this.centreJoy;
    const max = c.rayon * 0.75;
    let dx = x - c.x;
    let dy = y - c.y;
    const n = Math.hypot(dx, dy);
    if (n > max) { dx = (dx / n) * max; dy = (dy / n) * max; }
    manette.style.transform = `translate(${dx}px, ${dy}px)`;
    // un peu de zone morte au centre
    const k = (v) => (Math.abs(v / max) < 0.12 ? 0 : v / max);
    this.actions.deplacer(k(dx), -k(dy));
  }

  // Suivi d'un doigt (ou de la souris) qui appuie sur un élément puis glisse.
  // En mode édition, glisser déplace le bouton au lieu de l'utiliser.
  suivreGlisser(elem, { debut, bouge, fin } = {}) {
    let id = null;
    let px = 0;
    let py = 0;
    elem.addEventListener('pointerdown', (e) => {
      if (id !== null) return;
      e.preventDefault();
      id = e.pointerId;
      px = e.clientX; py = e.clientY;
      try { elem.setPointerCapture(id); } catch { /* ancien navigateur */ }
      if (this.edition) {
        if (elem === this.zone) { id = null; return; }
        this.choisir(elem.dataset.id);
        return;
      }
      if (debut) debut(e.clientX, e.clientY);
    });
    elem.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      e.preventDefault();
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      px = e.clientX; py = e.clientY;
      if (this.edition) { this.deplacerCommande(elem.dataset.id, e.clientX, e.clientY); return; }
      if (bouge) bouge(dx, dy, e.clientX, e.clientY);
    });
    const relacher = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      if (this.edition) { this.sauver(this.dispo); return; }
      if (fin) fin();
    };
    elem.addEventListener('pointerup', relacher);
    elem.addEventListener('pointercancel', relacher);
    elem.addEventListener('lostpointercapture', relacher);
  }

  placer(id) {
    const d = this.dispo[id];
    const c = this.elements[id];
    if (!c || !d) return;
    c.style.left = `${d.x}%`;
    c.style.top = `${d.y}%`;
    c.style.transform = `translate(-50%, -50%) scale(${d.taille})`;
  }
  placerTout() { for (const id of Object.keys(this.elements)) this.placer(id); }

  // ---------- Mode édition ----------
  editer() {
    this.edition = true;
    this.racine.classList.add('edition');
    this.outils.hidden = false;
    this.choisir('tir');
  }
  finEdition() {
    this.edition = false;
    this.racine.classList.remove('edition');
    this.outils.hidden = true;
    for (const c of Object.values(this.elements)) c.classList.remove('choisi');
    this.sauver(this.dispo);
    if (this.surFinEdition) this.surFinEdition();
  }
  choisir(id) {
    this.selection = id;
    for (const [k, c] of Object.entries(this.elements)) c.classList.toggle('choisi', k === id);
  }
  deplacerCommande(id, x, y) {
    const d = this.dispo[id];
    d.x = Math.max(2, Math.min(98, (x / innerWidth) * 100));
    d.y = Math.max(3, Math.min(97, (y / innerHeight) * 100));
    this.placer(id);
  }
  redimensionner(delta) {
    const d = this.dispo[this.selection];
    if (!d) return;
    d.taille = Math.max(0.6, Math.min(1.8, Math.round((d.taille + delta) * 10) / 10));
    this.placer(this.selection);
    this.sauver(this.dispo);
  }
  reinitialiser() {
    this.dispo = this.fusion(null);
    this.placerTout();
    this.sauver(this.dispo);
  }

  // Remet toutes les commandes au repos (pause, changement d'écran...)
  relacher() {
    this.manette.style.transform = '';
    this.actions.deplacer(0, 0);
    this.marquerVisee(false);
  }

  // ---------- Affichage ----------
  marquerVisee(oui) {
    const actif = !!oui;
    const b = this.btnVisee.querySelector('.bouton'); // le rond à l'intérieur de la commande
    if (b.classList.contains('actif') !== actif) b.classList.toggle('actif', actif);
  }

  // armes : les 4 armes de l'équipement ; textes[i] : munitions ou temps de recharge
  majArmes(armes, courante, textes) {
    const cle = armes.map((a) => a.id).join();
    if (this.barre.dataset.cle !== cle) {
      this.barre.dataset.cle = cle;
      this.barre.replaceChildren(...armes.map((a, i) => {
        const b = el('div', { class: 'arme-tactile', role: 'button', 'aria-label': a.nom },
          el('b', { text: i + 1 }), el('span', { class: 'nom', text: a.nom.replace('Fusil d\'assaut', 'Fusil').replace('Lance-roquettes', 'Roquettes') }),
          el('span', { class: 'mun' }));
        b.addEventListener('pointerdown', (e) => {
          if (this.edition) return; // en édition, c'est toute la barre qu'on déplace
          e.preventDefault();
          e.stopPropagation();
          this.actions.arme(i);
        });
        return b;
      }));
    }
    armes.forEach((a, i) => {
      const b = this.barre.children[i];
      b.classList.toggle('active', i === courante);
      const m = b.querySelector('.mun');
      const txt = textes[i];
      if (m.textContent !== txt) m.textContent = txt;
    });
  }
}
