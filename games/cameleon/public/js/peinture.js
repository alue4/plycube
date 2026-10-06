// Peindre son personnage (les cacheurs) pour se fondre dans le décor.
//   - Pinceau : on glisse sur l'aperçu 3D du personnage (souris ou doigt) ; tailles 1, 2, 3 ou 5 pixels.
//   - Remplir : un clic sur une partie du corps (tête, corps, un bras, une jambe) la remplit d'un coup.
//   - Pipette : un clic sur le décor (le jeu, à côté du panneau) ou sur le personnage prend la couleur.
// La peau est une image de 64 × 64 pixels (format Minecraft), partagée avec le personnage du jeu :
// ce qu'on peint se voit tout de suite, et les autres joueurs la reçoivent (voir main.js).
import * as THREE from '/games/fps/vendor/three.min.js';
import { Personnage, dessinerSkin } from '/games/fps/js/personnage.js';
import { el } from '/games/fps/js/hud.js';

// Zone de chaque partie dans la peau : [u, v, largeur, hauteur, profondeur]
export const ZONES = {
  tete: [0, 0, 8, 8, 8], corps: [16, 16, 8, 12, 4], brasD: [40, 16, 4, 12, 4], brasG: [32, 48, 4, 12, 4], jambeD: [0, 16, 4, 12, 4], jambeG: [16, 48, 4, 12, 4],
};
const NOMS_PARTIES = { tete: 'la tête', corps: 'le corps', brasD: 'le bras droit', brasG: 'le bras gauche', jambeD: 'la jambe droite', jambeG: 'la jambe gauche' };
// Les 6 faces d'une partie, dans l'ordre de three.js : droite, gauche, dessus, dessous, dos, devant
function faces([u, v, w, h, d]) {
  return [[u, v + d, d, h], [u + d + w, v + d, d, h], [u + d, v, w, d], [u + d + w, v, w, d], [u + d + w + d, v + d, w, h], [u + d, v + d, w, h]];
}
const PRESETS = ['#ffffff', '#d9d9d9', '#8f949c', '#3d4046', '#111111', '#7a5532', '#b98a4e', '#e6cf94',
  '#5cb83c', '#2e7a2a', '#2f6fd0', '#74b9ff', '#d63a3a', '#e67e22', '#f1c40f', '#e84393'];
const hex = (r, g, b) => `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;

// Personnage sans accessoires (chapeau, lunettes, sac... ne se peignent pas) : c'est celui des cacheurs
export function sansAccessoires(style) {
  const s = { ...(style || {}) };
  for (const k of ['accVisage', 'accOreilles', 'accDos', 'accCou']) s[k] = 'aucun';
  s.chapeau = 'aucun';
  if (s.coupe === 'queue' || s.coupe === 'herisses') s.coupe = 'courts';
  return s;
}

// Remplit les parties du corps de couleurs unies (avec un peu de grain) : peinture des bots
export function remplirParties(canvas, couleurs) {
  const g = canvas.getContext('2d');
  for (const [nom, couleur] of Object.entries(couleurs || {})) {
    if (!ZONES[nom] || !/^#[0-9a-f]{6}$/.test(couleur)) continue;
    const r = parseInt(couleur.slice(1, 3), 16); const v = parseInt(couleur.slice(3, 5), 16); const b = parseInt(couleur.slice(5, 7), 16);
    for (const [x0, y0, w, h] of faces(ZONES[nom])) {
      for (let x = x0; x < x0 + w; x++) {
        for (let y = y0; y < y0 + h; y++) {
          const k = 1 + (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1) * 0.06;
          g.fillStyle = hex(r * k, v * k, b * k);
          g.fillRect(x, y, 1, 1);
        }
      }
    }
  }
}

// Couleur moyenne de chaque partie du corps (envoyée au serveur : les bots chercheurs s'en servent)
export function couleursMoyennes(canvas) {
  const img = canvas.getContext('2d').getImageData(0, 0, 64, 64).data;
  const res = {};
  for (const [nom, zone] of Object.entries(ZONES)) {
    let r = 0; let v = 0; let b = 0; let n = 0;
    for (const [x0, y0, w, h] of faces(zone)) {
      for (let x = x0; x < x0 + w; x++) {
        for (let y = y0; y < y0 + h; y++) {
          const i = (y * 64 + x) * 4;
          if (img[i + 3] < 10) continue;
          r += img[i]; v += img[i + 1]; b += img[i + 2]; n++;
        }
      }
    }
    if (n) res[nom] = hex(r / n, v / n, b / n);
  }
  return res;
}

export class Peinture {
  // surChangement(fini) : la peau a changé (fini = fin d'un coup de pinceau) · lirePixelJeu(x, y) : couleur du jeu
  // à cet endroit de l'écran · son(nom) : petit son · surFermer() : le panneau se ferme
  constructor({ surChangement, lirePixelJeu, son, surFermer }) {
    Object.assign(this, { surChangement, lirePixelJeu, son: son || (() => {}), surFermer: surFermer || (() => {}) });
    this.outil = 'pinceau';
    this.taille = 2;
    this.couleur = '#5cb83c';
    this.prises = [];      // couleurs prises à la pipette (les plus récentes d'abord)
    this.historique = [];  // pour « Annuler »
    this.angle = 0.4;
    this.estOuvert = false;
    this.perso = null;
    this.construire();
  }

  get ouvert() { return this.estOuvert; }

  construire() {
    this.canvas = el('canvas', { class: 'peinture-apercu', width: 300, height: 380 });
    this.boutonsOutils = {};
    const outil = (id, texte, titre) => {
      const b = el('button', { type: 'button', class: 'pt-outil', title: titre, text: texte, onclick: () => this.choisirOutil(id) });
      this.boutonsOutils[id] = b;
      return b;
    };
    this.boutonsTaille = [1, 2, 3, 5].map((t) => el('button', { type: 'button', class: 'pt-taille', text: String(t), title: `Pinceau de ${t} pixel${t > 1 ? 's' : ''}`, onclick: () => this.choisirTaille(t) }));
    this.pastille = el('span', { class: 'pt-pastille' });
    this.choixCouleur = el('input', { type: 'color', value: this.couleur, 'aria-label': 'Choisir une couleur' });
    this.choixCouleur.addEventListener('input', () => this.choisirCouleur(this.choixCouleur.value, false));
    this.listePrises = el('div', { class: 'pt-couleurs' });
    const presets = el('div', { class: 'pt-couleurs' }, PRESETS.map((c) => this.carreCouleur(c)));
    this.message = el('p', { class: 'pt-message' });
    this.racine = el('div', { id: 'peinture', class: 'peinture', hidden: true, role: 'dialog', 'aria-label': 'Peindre mon personnage' },
      el('header', { class: 'pt-entete' }, el('b', { text: '🎨 Peindre mon perso' }),
        el('button', { type: 'button', class: 'pt-fermer', 'aria-label': 'Fermer', text: '✕', onclick: () => this.fermer() })),
      el('div', { class: 'pt-apercu' }, this.canvas, el('small', { text: 'Glisse sur le perso pour peindre · à côté pour le tourner' })),
      el('div', { class: 'pt-ligne' }, outil('pinceau', '🖌 Pinceau', 'Pinceau (B)'), outil('remplir', '🪣 Remplir', 'Remplir une partie du corps (F)'), outil('pipette', '💧 Pipette', 'Prendre une couleur dans le décor (I)')),
      el('div', { class: 'pt-ligne pt-tailles' }, el('span', { text: 'Taille :' }), this.boutonsTaille),
      el('div', { class: 'pt-ligne' }, this.pastille, this.choixCouleur, el('span', { class: 'pt-petit', text: 'couleur actuelle' })),
      el('div', { class: 'pt-titre', text: 'Couleurs prises dans le décor' }), this.listePrises,
      el('div', { class: 'pt-titre', text: 'Couleurs de base' }), presets,
      el('div', { class: 'pt-ligne pt-actions' },
        el('button', { type: 'button', text: '↶ Annuler', title: 'Ctrl + Z', onclick: () => this.annuler() }),
        el('button', { type: 'button', text: '⬜ Tout en blanc', onclick: () => this.toutRemplir('#ffffff') }),
        el('button', { type: 'button', text: '🎨 Tout de cette couleur', onclick: () => this.toutRemplir(this.couleur) }),
        el('button', { type: 'button', text: '👤 Mon perso', title: 'Revenir à ton personnage de départ', onclick: () => this.revenirAuDepart() })),
      this.message);
    document.body.append(this.racine);
    this.majOutils();
    this.majPrises();
    this.choisirCouleur(this.couleur, false);

    // Aperçu 3D
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8a8a, 2.4));
    const l = new THREE.DirectionalLight(0xffffff, 1.2); l.position.set(2, 3, 4); this.scene.add(l);
    this.camera = new THREE.PerspectiveCamera(30, 300 / 380, 0.1, 20);
    this.camera.position.set(0, 1.05, 4.3);
    this.camera.lookAt(0, 0.95, 0);
    this.rayon = new THREE.Raycaster();
    const c = this.canvas;
    c.style.touchAction = 'none';
    c.addEventListener('pointerdown', (e) => this.appui(e));
    c.addEventListener('pointermove', (e) => this.glisse(e));
    addEventListener('pointerup', () => this.relache());
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    addEventListener('keydown', (e) => this.touche(e));
  }

  carreCouleur(c) {
    const b = el('button', { type: 'button', class: 'pt-carre', title: c, 'aria-label': `Couleur ${c}`, onclick: () => this.choisirCouleur(c, false) });
    b.style.background = c;
    return b;
  }

  // Le personnage à peindre (un nouveau à chaque manche) et son apparence de départ (sans accessoires)
  attacher(perso, styleDepart) {
    this.perso = perso;
    this.styleDepart = styleDepart;
    this.historique = [];
    if (this.apercu) {
      // (on lui rend son propre matériau avant de le libérer : celui du vrai personnage doit rester intact)
      for (const p of Object.values(this.apercu.parties)) p.mesh.material = this.apercu.materiau;
      this.apercu.liberer();
      this.apercu = null;
    }
    const a = new Personnage({ style: styleDepart });
    // l'aperçu utilise le matériau (donc la peau) du vrai personnage
    for (const p of Object.values(a.parties)) p.mesh.material = perso.materiau;
    if (a.arme) a.arme.visible = false;
    a.poserDanse({}, false);
    this.apercu = a;
    this.maillages = Object.entries(a.parties).map(([nom, p]) => { p.mesh.userData.partie = nom; return p.mesh; });
    this.scene.add(a.groupe);
  }

  ouvrir() {
    if (!this.perso) return;
    this.estOuvert = true;
    this.racine.hidden = false;
    this.message.textContent = 'Astuce : avec la 💧 pipette, clique sur le décor à côté du panneau pour prendre sa couleur.';
    const boucle = () => {
      if (!this.estOuvert) return;
      requestAnimationFrame(boucle);
      this.dessinerApercu();
    };
    boucle();
  }

  fermer() {
    if (!this.estOuvert) return;
    this.estOuvert = false;
    this.racine.hidden = true;
    this.relache();
    this.surFermer();
  }

  dessinerApercu() {
    const c = this.canvas;
    const w = c.clientWidth || 300; const h = c.clientHeight || 380;
    if (c.width !== Math.round(w * this.renderer.getPixelRatio())) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
    if (this.apercu) this.apercu.groupe.rotation.y = this.angle;
    this.renderer.render(this.scene, this.camera);
  }

  choisirOutil(id) {
    this.outil = id;
    this.majOutils();
    if (id === 'pipette') this.message.textContent = '💧 Clique sur le décor (à côté du panneau) ou sur ton perso pour prendre une couleur.';
    else if (id === 'remplir') this.message.textContent = '🪣 Clique sur une partie de ton perso : elle prend la couleur d\'un coup.';
    else this.message.textContent = '🖌 Glisse sur ton perso pour peindre.';
  }

  choisirTaille(t) { this.taille = t; this.majOutils(); }

  majOutils() {
    for (const [id, b] of Object.entries(this.boutonsOutils)) b.classList.toggle('actif', id === this.outil);
    this.boutonsTaille.forEach((b, i) => b.classList.toggle('actif', [1, 2, 3, 5][i] === this.taille));
  }

  choisirCouleur(c, prise) {
    this.couleur = c;
    this.pastille.style.background = c;
    if (this.choixCouleur.value !== c) this.choixCouleur.value = c;
    if (prise) {
      this.prises = [c, ...this.prises.filter((x) => x !== c)].slice(0, 12);
      this.majPrises();
    }
  }

  majPrises() {
    this.listePrises.replaceChildren(...(this.prises.length ? this.prises.map((c) => this.carreCouleur(c)) : [el('span', { class: 'pt-petit', text: 'aucune pour l\'instant : prends-en avec la pipette' })]));
  }

  // La pipette dans le décor : main.js nous donne la couleur sous le clic
  pipetteDecor(couleur) {
    if (!couleur) return;
    this.choisirCouleur(couleur, true);
    this.son('pinceau');
    this.message.textContent = `💧 Couleur prise : ${couleur}. Choisis le 🖌 pinceau ou 🪣 remplir pour l'utiliser.`;
  }

  // ---------- Peindre sur l'aperçu ----------
  viser(e) {
    const r = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.rayon.setFromCamera(ndc, this.camera);
    const t = this.rayon.intersectObjects(this.maillages || [], false)[0];
    return t || null;
  }

  appui(e) {
    if (!this.perso) return;
    e.preventDefault();
    const t = this.viser(e);
    this.glisser = { x: e.clientX, angle: this.angle, peint: false };
    if (!t || e.button === 2) { this.glisser.tourne = true; return; }
    if (this.outil === 'pipette') {
      const c = this.couleurPixel(t);
      if (c) this.pipetteDecor(c);
      this.glisser = null;
      return;
    }
    this.memoriser();
    if (this.outil === 'remplir') {
      const nom = t.object.userData.partie;
      const g = this.perso.canvas.getContext('2d');
      g.fillStyle = this.couleur;
      for (const [x, y, w, h] of faces(ZONES[nom])) g.fillRect(x, y, w, h);
      this.majPeau(true);
      this.son('pinceau');
      this.message.textContent = `🪣 ${NOMS_PARTIES[nom]} : ${this.couleur}`;
      this.glisser = null;
      return;
    }
    this.glisser.peint = true;
    this.peindre(t);
  }

  glisse(e) {
    if (!this.glisser) return;
    if (this.glisser.tourne) {
      this.angle = this.glisser.angle + (e.clientX - this.glisser.x) * 0.012;
      return;
    }
    const t = this.viser(e);
    if (t) this.peindre(t);
  }

  relache() {
    if (!this.glisser) return;
    const peint = this.glisser.peint;
    this.glisser = null;
    if (peint) this.majPeau(true);
  }

  // Le pixel de la peau sous ce point de l'aperçu, et le rectangle de la face (pour ne pas déborder)
  pixel(t) {
    if (!t || !t.uv) return null;
    const x = Math.min(63, Math.max(0, Math.floor(t.uv.x * 64)));
    const y = Math.min(63, Math.max(0, Math.floor((1 - t.uv.y) * 64)));
    const face = faces(ZONES[t.object.userData.partie])[Math.floor(t.faceIndex / 2)];
    return { x, y, face };
  }

  couleurPixel(t) {
    const p = this.pixel(t);
    if (!p) return null;
    const d = this.perso.canvas.getContext('2d').getImageData(p.x, p.y, 1, 1).data;
    return hex(d[0], d[1], d[2]);
  }

  peindre(t) {
    const p = this.pixel(t);
    if (!p) return;
    const g = this.perso.canvas.getContext('2d');
    g.fillStyle = this.couleur;
    const [fx, fy, fw, fh] = p.face;
    const r = this.taille;
    const x0 = Math.max(fx, p.x - Math.floor((r - 1) / 2)); const y0 = Math.max(fy, p.y - Math.floor((r - 1) / 2));
    const x1 = Math.min(fx + fw, x0 + r); const y1 = Math.min(fy + fh, y0 + r);
    if (x1 > x0 && y1 > y0) g.fillRect(x0, y0, x1 - x0, y1 - y0);
    this.majPeau(false);
  }

  toutRemplir(c) {
    if (!this.perso) return;
    this.memoriser();
    const g = this.perso.canvas.getContext('2d');
    g.fillStyle = c;
    for (const zone of Object.values(ZONES)) for (const [x, y, w, h] of faces(zone)) g.fillRect(x, y, w, h);
    this.majPeau(true);
    this.son('pinceau');
  }

  revenirAuDepart() {
    if (!this.perso) return;
    this.memoriser();
    const g = this.perso.canvas.getContext('2d');
    g.clearRect(0, 0, 64, 64);
    g.drawImage(dessinerSkin(this.styleDepart), 0, 0);
    this.majPeau(true);
  }

  memoriser() {
    this.historique.push(this.perso.canvas.getContext('2d').getImageData(0, 0, 64, 64));
    if (this.historique.length > 30) this.historique.shift();
  }

  annuler() {
    const img = this.historique.pop();
    if (!img || !this.perso) return;
    this.perso.canvas.getContext('2d').putImageData(img, 0, 0);
    this.majPeau(true);
  }

  majPeau(fini) {
    this.perso.texture.needsUpdate = true;
    this.surChangement(fini);
  }

  touche(e) {
    if (!this.estOuvert) return;
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') { e.preventDefault(); this.annuler(); return; }
    if (e.target && e.target.tagName === 'INPUT') return;
    if (e.code === 'KeyB') this.choisirOutil('pinceau');
    else if (e.code === 'KeyF') this.choisirOutil('remplir');
    else if (e.code === 'KeyI') this.choisirOutil('pipette');
  }
}
