// Laser d'admin : ce qui s'affiche à l'écran pendant la charge et au tir.
//   - autour du viseur, deux anneaux en pointillés tournent en sens inverse, de plus en plus vite ;
//   - un arc se remplit avec le pourcentage ; à 100 %, tout passe au rose et « MAX » clignote ;
//   - les bords de l'écran s'illuminent ; au tir, l'écran flashe.
// Les sons et le tremblement de la caméra sont dans main.js / sons.js.
import { el } from './hud.js';

const NS = 'http://www.w3.org/2000/svg';
const svg = (nom, attributs = {}) => {
  const n = document.createElementNS(NS, nom);
  for (const [k, v] of Object.entries(attributs)) n.setAttribute(k, v);
  return n;
};
const R_ARC = 46;
const LONGUEUR_ARC = 2 * Math.PI * R_ARC;

export class LaserHud {
  constructor() {
    this.angle = 0;
    this.charge = 0;
    this.lueur = el('div', { class: 'laser-lueur', 'aria-hidden': 'true' });
    this.flash = el('div', { class: 'laser-flash', 'aria-hidden': 'true' });
    const s = svg('svg', { viewBox: '-60 -60 120 120', class: 'laser-reacteur' });
    this.anneau1 = svg('circle', { r: 34, class: 'laser-anneau1' });
    this.anneau2 = svg('circle', { r: 40, class: 'laser-anneau2' });
    const fond = svg('circle', { r: R_ARC, class: 'laser-arc-fond' });
    this.arc = svg('circle', { r: R_ARC, class: 'laser-arc', 'stroke-dasharray': `${LONGUEUR_ARC}`, 'stroke-dashoffset': `${LONGUEUR_ARC}`, transform: 'rotate(-90)' });
    this.pointes = svg('g', { class: 'laser-pointes' });
    for (let i = 0; i < 4; i++) this.pointes.append(svg('path', { d: 'M0 -56 L4 -50 L-4 -50 Z', transform: `rotate(${i * 90})` }));
    s.append(fond, this.arc, this.anneau1, this.anneau2, this.pointes);
    this.texte = el('div', { class: 'laser-texte' });
    this.reacteur = el('div', { class: 'laser-hud', 'aria-hidden': 'true' }, s, this.texte);
    document.body.append(this.lueur, this.flash, this.reacteur);
    this.cacher();
  }

  // charge 0 → 1 (0 : rien n'est affiché)
  maj(charge, dt, now) {
    this.charge = charge;
    const actif = charge > 0.001;
    this.reacteur.classList.toggle('actif', actif);
    this.lueur.classList.toggle('actif', actif);
    if (!actif) return;
    const plein = charge >= 1;
    this.reacteur.classList.toggle('plein', plein);
    this.lueur.classList.toggle('plein', plein);
    this.angle += dt * (40 + charge * charge * 900); // degrés par seconde
    const resserre = 1.25 - charge * 0.3; // les anneaux se resserrent vers le viseur
    this.anneau1.setAttribute('transform', `rotate(${this.angle}) scale(${resserre})`);
    this.anneau2.setAttribute('transform', `rotate(${-this.angle * 1.4}) scale(${resserre})`);
    this.pointes.setAttribute('transform', `rotate(${this.angle * 0.25}) scale(${1.15 - charge * 0.25})`);
    this.arc.setAttribute('stroke-dashoffset', String(LONGUEUR_ARC * (1 - charge)));
    const pct = Math.round(charge * 100);
    this.texte.textContent = plein ? (Math.floor(now / 120) % 2 ? 'MAX' : '') : `${pct} %`;
    // les bords de l'écran : de plus en plus lumineux, ça pulse
    const pulse = 0.75 + 0.25 * Math.sin(now * (0.006 + charge * 0.03));
    this.lueur.style.opacity = String(Math.min(1, charge * charge * 0.85 * pulse + (plein ? 0.1 : 0)));
    // petite vibration de tout le réacteur à pleine charge
    const t = plein ? `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 4}px)` : '';
    this.reacteur.style.transform = `translate(-50%, -50%) ${t}`;
  }

  // Au tir : flash de l'écran (plus fort quand c'est chargé)
  tir(charge) {
    this.flash.style.setProperty('--force', String(0.25 + charge * 0.65));
    this.flash.classList.remove('boum');
    void this.flash.offsetWidth;
    this.flash.classList.add('boum');
    this.maj(0, 0, 0);
  }

  cacher() { this.maj(0, 0, 0); }
}
