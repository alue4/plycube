// Pouvoirs d'admin qui changent seulement l'écran de l'admin : radar, vision nocturne, mode Matrix, mode disco.
// (Les autres joueurs ne voient rien de tout ça.)
import { el } from './hud.js';

// ---------- Radar : mini-carte ronde en haut à droite, je suis au centre, devant = en haut ----------
const PORTEE = 60; // mètres
export class RadarHud {
  constructor() {
    this.canvas = el('canvas', { class: 'radar-admin', width: 180, height: 180, 'aria-hidden': 'true' });
    document.body.append(this.canvas);
    this.canvas.hidden = true;
  }

  // points : [{ x, z, ennemi, bot, dy }] (x vers ma droite, z devant moi, dy = hauteur par rapport à moi)
  dessiner(points, now) {
    this.canvas.hidden = false;
    const c = this.canvas;
    const w = c.clientWidth || 180;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const taille = Math.round(w * dpr);
    if (c.width !== taille) { c.width = taille; c.height = taille; }
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = w / 2;
    g.clearRect(0, 0, w, w);
    g.fillStyle = 'rgba(2, 14, 6, .72)';
    g.beginPath(); g.arc(r, r, r - 1, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(57, 255, 136, .45)';
    g.lineWidth = 1;
    for (const k of [1, 2 / 3, 1 / 3]) { g.beginPath(); g.arc(r, r, (r - 2) * k, 0, Math.PI * 2); g.stroke(); }
    g.beginPath(); g.moveTo(r, 3); g.lineTo(r, w - 3); g.moveTo(3, r); g.lineTo(w - 3, r); g.stroke();
    // balayage
    const a = ((now / 1000) * 1.8) % (Math.PI * 2);
    for (let k = 0; k < 10; k++) {
      g.beginPath(); g.moveTo(r, r);
      g.arc(r, r, r - 2, a - (k + 1) * 0.07, a - k * 0.07);
      g.closePath();
      g.fillStyle = `rgba(57, 255, 136, ${0.2 * (1 - k / 10)})`;
      g.fill();
    }
    for (const p of points) {
      const d = Math.hypot(p.x, p.z) || 0.001;
      const k = Math.min(1, d / PORTEE) * (r - 7);
      const x = r + (p.x / d) * k;
      const y = r - (p.z / d) * k;
      g.fillStyle = p.ennemi ? (p.bot ? '#ffa133' : '#ff4d5e') : '#5aa9ff';
      g.beginPath(); g.arc(x, y, d > PORTEE ? 2.5 : 4.5, 0, Math.PI * 2); g.fill();
      // plus haut / plus bas que moi : petit triangle
      if (Math.abs(p.dy) > 2.5 && d <= PORTEE) {
        g.beginPath();
        const s = p.dy > 0 ? -1 : 1;
        g.moveTo(x - 3, y + s * 6); g.lineTo(x + 3, y + s * 6); g.lineTo(x, y + s * 10); g.closePath(); g.fill();
      }
    }
    g.fillStyle = '#fff';
    g.beginPath(); g.moveTo(r, r - 7); g.lineTo(r - 5, r + 5); g.lineTo(r + 5, r + 5); g.closePath(); g.fill();
    g.fillStyle = 'rgba(57, 255, 136, .9)';
    g.font = '700 10px monospace';
    g.fillText(`${PORTEE} m`, r + 4, w - 8);
  }

  cacher() { this.canvas.hidden = true; }
}

// ---------- Visions : nocturne (vert lumineux + lignes), Matrix (pluie de code), disco (couleurs qui tournent) ----------
const SIGNES = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789PLYCUBE<>/*+=#';
export class EcranVisions {
  constructor(canvasJeu) {
    this.jeu = canvasJeu; // le canvas du jeu (on lui met un filtre CSS)
    this.nocturne = el('div', { class: 'vision-nocturne', 'aria-hidden': 'true' });
    this.pluie = el('canvas', { class: 'vision-matrix', 'aria-hidden': 'true' });
    this.nocturne.hidden = true;
    this.pluie.hidden = true;
    document.body.append(this.nocturne, this.pluie);
    this.colonnes = [];
    this.dernier = 0;
    this.filtre = '';
  }

  maj(now, { nocturne = false, matrix = false, disco = false } = {}) {
    this.nocturne.hidden = !nocturne;
    this.pluie.hidden = !matrix;
    let f = '';
    if (nocturne) f += 'grayscale(1) brightness(1.75) contrast(1.15) sepia(1) hue-rotate(55deg) saturate(3.2) ';
    if (matrix) f += 'sepia(.55) hue-rotate(65deg) saturate(1.7) brightness(.92) ';
    if (disco) f += `hue-rotate(${Math.round((now / 6) % 360)}deg) saturate(1.8) `;
    f = f.trim();
    if (f !== this.filtre) { this.filtre = f; this.jeu.style.filter = f; }
    if (matrix && now - this.dernier > 45) { this.dernier = now; this.dessinerPluie(); }
  }

  dessinerPluie() {
    const c = this.pluie;
    const w = innerWidth; const h = innerHeight;
    if (c.width !== w || c.height !== h) {
      c.width = w; c.height = h;
      this.colonnes = Array.from({ length: Math.ceil(w / 18) }, () => Math.random() * -h / 18);
    }
    const g = c.getContext('2d');
    g.fillStyle = 'rgba(0, 8, 0, 0.16)'; // les anciens signes s'effacent doucement (traînée)
    g.fillRect(0, 0, w, h);
    g.font = '700 16px monospace';
    this.colonnes.forEach((y, i) => {
      const signe = SIGNES[Math.floor(Math.random() * SIGNES.length)];
      g.fillStyle = Math.random() < 0.08 ? '#d8ffd8' : '#2bff6a';
      g.fillText(signe, i * 18, y * 18);
      this.colonnes[i] = y * 18 > h && Math.random() > 0.975 ? 0 : y + 1;
    });
  }

  cacher() { this.maj(0, {}); }
}
