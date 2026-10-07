// Indicateurs de dégâts :
//  - chiffres qui sautent au-dessus de l'adversaire qu'on touche (blanc ; jaune dans la tête ; rouge quand il est éliminé).
//    Les touches rapprochées sur le même adversaire s'additionnent (armes automatiques, plombs du fusil à pompe) ;
//  - arc rouge autour du viseur qui montre d'où vient un tir reçu. Il suit le tireur quand on se tourne.
// Tout est dessiné en HTML par-dessus le jeu ; maj() est appelé à chaque image.
import * as THREE from '../vendor/three.min.js';
import { el } from './hud.js';

const DUREE_CHIFFRE = 950; // ms
const CUMUL_MS = 450;      // les touches sur le même adversaire dans ce délai s'additionnent
const MAX_CHIFFRES = 24;
const DUREE_ARC = 1800;
const _v = new THREE.Vector3();

export class IndicateursDegats {
  constructor(racine) {
    this.couche = el('div', { class: 'chiffres-degats', 'aria-hidden': 'true' });
    this.arcs = el('div', { class: 'arcs-degats', 'aria-hidden': 'true' });
    racine.append(this.couche, this.arcs);
    this.chiffres = []; // { el, pos, nee, derniere, total, cle, tete, elim, decalage }
    this.listeArcs = []; // { el, cle, source, nee, force }
  }

  // pos : point touché (dans le monde) ; cle : l'adversaire (pour additionner les touches rapprochées)
  chiffre(pos, degats, { tete = false, elim = false, cle = null } = {}) {
    if (!(degats > 0)) return;
    const now = performance.now();
    let c = cle !== null ? this.chiffres.find((x) => x.cle === cle && !x.elim && now - x.derniere < CUMUL_MS) : null;
    if (!c) {
      if (this.chiffres.length >= MAX_CHIFFRES) this.retirerChiffre(this.chiffres[0]);
      c = { el: el('div', { class: 'chiffre-degats' }), pos: pos.clone(), nee: now, derniere: now, total: 0, cle, tete: false, elim: false,
        decalage: (Math.random() - 0.5) * 36 };
      this.couche.append(c.el);
      this.chiffres.push(c);
    }
    c.total += degats;
    c.tete = c.tete || tete;
    c.elim = c.elim || elim;
    c.derniere = now;
    c.nee = now; // la durée repart à chaque touche
    c.pos.copy(pos);
    c.taille = Math.min(1.9, 0.85 + c.total / 90); // plus gros pour les gros dégâts
    c.el.textContent = String(Math.round(c.total));
    c.el.className = `chiffre-degats${c.tete ? ' tete' : ''}${c.elim ? ' elim' : ''}`;
    c.el.classList.remove('pop');
    void c.el.offsetWidth; // relance l'animation « pop »
    c.el.classList.add('pop');
  }

  // cle : le tireur ; source() : sa position actuelle (ou null s'il n'existe plus) ; perdu : vie perdue
  direction(cle, source, perdu) {
    const now = performance.now();
    const force = Math.min(1, 0.5 + perdu / 60);
    let a = this.listeArcs.find((x) => x.cle === cle);
    if (!a) {
      a = { el: el('div', { class: 'arc-degats' }), cle, source, nee: now, force: 0 };
      this.arcs.append(a.el);
      this.listeArcs.push(a);
    }
    a.source = source;
    a.nee = now;
    a.force = Math.max(force, a.force * 0.6);
  }

  // À chaque image : les chiffres montent et s'effacent, les arcs suivent les tireurs.
  maj(camera, pos, yaw) {
    const now = performance.now();
    const L = innerWidth;
    const H = innerHeight;
    for (const c of [...this.chiffres]) {
      const age = now - c.nee;
      if (age > DUREE_CHIFFRE) { this.retirerChiffre(c); continue; }
      _v.copy(c.pos);
      _v.y += 0.3 + (age / 1000) * 0.7; // il monte doucement
      _v.project(camera);
      if (_v.z > 1 || _v.z < -1) { c.el.style.opacity = '0'; continue; } // derrière la caméra
      const x = ((_v.x + 1) / 2) * L + c.decalage;
      const y = ((1 - _v.y) / 2) * H;
      c.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) scale(${c.taille.toFixed(2)})`;
      const fin = DUREE_CHIFFRE * 0.6;
      c.el.style.opacity = age < fin ? '1' : String(Math.max(0, 1 - (age - fin) / (DUREE_CHIFFRE - fin)));
    }
    for (const a of [...this.listeArcs]) {
      const age = now - a.nee;
      if (age > DUREE_ARC) { a.el.remove(); this.listeArcs.splice(this.listeArcs.indexOf(a), 1); continue; }
      const p = a.source && a.source();
      if (p) a.angle = Math.atan2(-(p.x - pos.x), -(p.z - pos.z)) - yaw;
      if (a.angle === undefined) continue;
      a.el.style.transform = `rotate(${(-a.angle).toFixed(3)}rad)`;
      const k = 1 - age / DUREE_ARC;
      a.el.style.opacity = String(Math.max(0, a.force * Math.min(1, k * 1.6)));
    }
  }

  retirerChiffre(c) {
    c.el.remove();
    const i = this.chiffres.indexOf(c);
    if (i >= 0) this.chiffres.splice(i, 1);
  }

  // Changement de partie, mort... : on efface tout
  vider() {
    for (const c of [...this.chiffres]) this.retirerChiffre(c);
    for (const a of this.listeArcs) a.el.remove();
    this.listeArcs = [];
  }
}
