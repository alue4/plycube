// Apparence des personnages : couleurs, coupe, visage (dessiné ou photo pixelisée),
// vêtements et accessoires.
//
// Un "style" est un petit objet (voir catalogue-apparence.json pour la liste des choix) :
//   peau, yeux, cheveux, coupe, visage (64 pixels "rrggbb" collés, ou null),
//   haut, hautC1, hautC2, motif, bas, basC, chaussures, chaussuresC,
//   chapeau, chapeauC, accVisage, accOreilles, accDos, accCou, accC
// On le dessine dans une image de 64 × 64 pixels au format d'un skin Minecraft,
// et on ajoute les chapeaux et accessoires en 3D.
import * as THREE from '../vendor/three.min.js';
import { hasard, nuance, bruit } from './textures.js';

export const PX = 1.85 / 32; // taille d'un "pixel" du personnage, en mètres
export const COULEURS_EQUIPES = ['#3d8bff', '#ff5a5a'];

let CAT = null;
export function definirCatalogue(c) { CAT = c; }
export function catalogue() { return CAT; }

export const STYLE_DEFAUT = {
  peau: '#e0ac69', yeux: '#2d6cdf', cheveux: '#4a2c17', coupe: 'courts', visage: null,
  haut: 'tshirt', hautC1: '#2fb5ff', hautC2: '#ffffff', motif: 'uni',
  bas: 'jean', basC: '#2b3a67', chaussures: 'baskets', chaussuresC: '#2a2a2a',
  chapeau: 'aucun', chapeauC: '#ff3b3b',
  accVisage: 'aucun', accOreilles: 'aucun', accDos: 'aucun', accCou: 'aucun', accC: '#2a2a2a',
};
const COULEUR = /^#[0-9a-f]{6}$/;
const CHAMPS_COULEUR = ['peau', 'yeux', 'cheveux', 'hautC1', 'hautC2', 'basC', 'chaussuresC', 'chapeauC', 'accC'];

// Vérifie un style reçu (même règles que le serveur) et complète ce qui manque.
export function normaliserStyle(s) {
  const res = { ...STYLE_DEFAUT };
  if (!s || typeof s !== 'object') return res;
  for (const k of CHAMPS_COULEUR) if (typeof s[k] === 'string' && COULEUR.test(s[k])) res[k] = s[k];
  for (const k of ['coupe', 'haut', 'motif', 'bas', 'chaussures', 'chapeau', 'accVisage', 'accOreilles', 'accDos', 'accCou']) {
    if (typeof s[k] === 'string' && /^[a-z_]{1,30}$/.test(s[k])) res[k] = s[k];
  }
  if (typeof s.visage === 'string' && /^[0-9a-f]{384}$/.test(s.visage)) res.visage = s.visage;
  return res;
}

// Style tiré au hasard (r = générateur de hasard, Math.random par défaut).
export function styleAleatoire(r = Math.random) {
  const c = CAT;
  const pick = (l) => l[Math.floor(r() * l.length)];
  const id = (l) => pick(l).id;
  if (!c) return { ...STYLE_DEFAUT };
  const sansRien = (l) => l.filter((x) => x.id !== 'aucun');
  return {
    ...STYLE_DEFAUT,
    peau: pick(c.peaux.slice(0, 8)), yeux: pick(c.yeux), cheveux: pick(c.cheveux.slice(0, 8)), coupe: id(c.coupes),
    haut: id(c.hauts), hautC1: pick(c.couleurs), hautC2: pick(c.couleurs), motif: id(c.motifs),
    bas: id(c.bas), basC: pick(c.couleurs), chaussures: id(c.chaussures), chaussuresC: pick(c.couleurs),
    chapeau: r() < 0.35 ? id(sansRien(c.chapeaux)) : 'aucun', chapeauC: pick(c.couleurs),
    accVisage: r() < 0.25 ? id(sansRien(c.accessoires.visage)) : 'aucun',
    accDos: r() < 0.2 ? id(sansRien(c.accessoires.dos)) : 'aucun',
    accC: pick(c.couleurs),
  };
}

// Style par défaut d'un joueur qui n'a rien choisi : toujours le même pour un même compte.
export function styleParDefaut(id) {
  const s = styleAleatoire(hasard(id * 7919 + 13));
  s.chapeau = 'aucun'; s.accVisage = 'aucun'; s.accDos = 'aucun';
  return s;
}

// Couleur des manches (pour les bras vus à la première personne)
export function couleurManche(style) {
  return style.haut === 'debardeur' ? style.peau : style.hautC1;
}

// ---------- Visage (8 × 8 pixels, vu de face) ----------

// Le visage dessiné automatiquement selon la peau, les yeux et la coupe.
export function visageParDefaut(style) {
  const s = normaliserStyle(style);
  const g = Array.from({ length: 8 }, () => Array(8).fill(s.peau));
  const H = s.cheveux;
  const frange = { courts: 2, frange: 3, longs: 2, queue: 2, herisses: 1, chauve: 0 }[s.coupe] ?? 2;
  for (let y = 0; y < frange; y++) for (let x = 0; x < 8; x++) g[y][x] = H;
  if (s.coupe === 'frange') { g[2][6] = s.peau; g[2][7] = s.peau; }
  if (s.coupe === 'herisses') for (let x = 0; x < 8; x += 2) g[1][x] = H;
  if (s.coupe === 'longs') for (let y = 2; y < 8; y++) { g[y][0] = H; g[y][7] = H; }
  if (frange >= 2) { g[2][0] = nuanceHex(H, -0.1); g[2][7] = s.coupe === 'frange' ? s.peau : nuanceHex(H, -0.1); }
  g[4][1] = '#ffffff'; g[4][2] = s.yeux; g[4][5] = s.yeux; g[4][6] = '#ffffff';
  g[3][1] = nuanceHex(H, -0.2); g[3][2] = nuanceHex(H, -0.2); g[3][5] = nuanceHex(H, -0.2); g[3][6] = nuanceHex(H, -0.2);
  if (s.coupe === 'chauve' || s.coupe === 'herisses') { g[3][1] = g[3][2] = g[3][5] = g[3][6] = nuanceHex(s.peau, -0.35); }
  g[6][3] = nuanceHex(s.peau, -0.45); g[6][4] = nuanceHex(s.peau, -0.45);
  g[5][2] = nuanceHex(s.peau, -0.25); g[5][5] = nuanceHex(s.peau, -0.25);
  if (s.coupe === 'longs') { g[5][0] = H; g[5][7] = H; }
  return g.flat().map((c) => c.slice(1)).join('');
}

export function visageVersCouleurs(hex384) {
  const res = [];
  for (let i = 0; i < 64; i++) res.push(`#${hex384.slice(i * 6, i * 6 + 6)}`);
  return res;
}
export function couleursVersVisage(liste) {
  return liste.map((c) => c.slice(1).toLowerCase()).join('');
}

function nuanceHex(hex, k) {
  const m = /rgb\((\d+),(\d+),(\d+)\)/.exec(nuance(hex, k));
  return `#${[m[1], m[2], m[3]].map((v) => Number(v).toString(16).padStart(2, '0')).join('')}`;
}

// ---------- Petits dessins (motifs) : '#' = couleur 2 ----------
const MOTIFS = {
  eclair: ['...##.', '..##..', '.####.', '..##..', '.##...', '.#....'],
  etoile: ['..##..', '..##..', '######', '.####.', '.#..#.', '#....#'],
  coeur: ['.#..#.', '######', '######', '.####.', '..##..', '......'],
  smiley: ['.####.', '#.##.#', '######', '#.##.#', '##..##', '.####.'],
};
const CHIFFRES = { 1: ['.#.', '##.', '.#.', '.#.', '###'], 0: ['###', '#.#', '#.#', '#.#', '###'] };

// ---------- Dessin du skin 64 × 64 ----------
// En mode équipes, la couleur principale du haut devient celle de l'équipe.
export function dessinerSkin(styleBrut, equipe) {
  const s = normaliserStyle(styleBrut);
  if (equipe === 0 || equipe === 1) s.hautC1 = COULEURS_EQUIPES[equipe];
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const r = hasard(17);
  const zone = (x, y, w, h, hex, f = 0.1) => bruit(g, r, x, y, w, h, hex, f);
  const p = (x, y, col) => { g.fillStyle = col; g.fillRect(x, y, 1, 1); };
  const H = s.cheveux;
  const chauve = s.coupe === 'chauve';

  // Une boîte (u, v, largeur w, hauteur h, profondeur d) au format Minecraft.
  // Sur la face "droite", la colonne de gauche est à l'arrière ; sur la face "gauche", à l'avant.
  const boite = (u, v, w, h, d, f) => {
    f.dessus(u + d, v, w, d);
    f.dessous(u + d + w, v, w, d);
    f.cote(u, v + d, d, h, 'droite');
    f.devant(u + d, v + d, w, h);
    f.cote(u + d + w, v + d, d, h, 'gauche');
    f.dos(u + d + w + d, v + d, w, h);
  };

  // ----- Tête -----
  const hautCheveuxCote = { courts: 3, frange: 4, longs: 8, queue: 3, herisses: 2, chauve: 0 }[s.coupe] ?? 3;
  const hautCheveuxDos = { courts: 6, frange: 7, longs: 8, queue: 7, herisses: 5, chauve: 0 }[s.coupe] ?? 6;
  boite(0, 0, 8, 8, 8, {
    dessus: (x, y, w, h) => {
      zone(x, y, w, h, chauve ? s.peau : H, 0.12);
      if (s.coupe === 'herisses') for (let i = 0; i < 8; i += 2) for (let j = (i / 2) % 2; j < 8; j += 2) p(x + i, y + j, nuance(H, 0.25));
    },
    dessous: (x, y, w, h) => zone(x, y, w, h, s.peau, 0.04),
    cote: (x, y, w, h, cote) => {
      zone(x, y, w, h, s.peau, 0.05);
      const avant = cote === 'droite' ? 7 : 0; // colonne côté visage
      if (hautCheveuxCote) zone(x, y, w, hautCheveuxCote, H, 0.12);
      if (s.coupe === 'courts' || s.coupe === 'queue') zone(cote === 'droite' ? x : x + 5, y + 3, 3, 2, H, 0.12); // pattes
      // oreille
      if (hautCheveuxCote < 5) { p(x + 3, y + 4, nuance(s.peau, -0.2)); p(x + 4, y + 4, nuance(s.peau, -0.2)); p(x + 3, y + 5, nuance(s.peau, -0.2)); }
      if (s.coupe === 'longs') for (let j = 2; j < 8; j++) p(x + avant, y + j, nuance(H, 0.05));
    },
    devant: (x, y) => {
      const pixels = visageVersCouleurs(s.visage || visageParDefaut(s));
      pixels.forEach((col, i) => p(x + (i % 8), y + Math.floor(i / 8), col));
    },
    dos: (x, y, w, h) => {
      zone(x, y, w, h, s.peau, 0.05);
      if (hautCheveuxDos) zone(x, y, w, hautCheveuxDos, H, 0.12);
    },
  });

  // ----- Corps : le haut -----
  const C1 = s.hautC1;
  const C2 = s.hautC2;
  const sombre = nuance(C1, -0.3);
  const manche = { tshirt: 4, maillot: 4, debardeur: 0, sweat: 11, veste: 11, chemise: 11, pull: 11 }[s.haut] ?? 4;
  const rayures = (x, y, w, h) => { for (let j = 0; j < h; j++) zone(x, y + j, w, 1, Math.floor(j / 2) % 2 ? C2 : C1, 0.08); };
  const fondHaut = (x, y, w, h) => (s.haut === 'pull' ? rayures(x, y, w, h) : zone(x, y, w, h, C1, 0.08));
  const motif = (x, y) => {
    if (s.motif === 'uni' || s.haut === 'veste' || s.haut === 'chemise') return;
    if (s.motif === 'bande') { zone(x, y + 4, 8, 2, C2, 0.05); return; }
    if (s.motif === 'numero') { dessinChiffres(p, x + 1, y + 2, C2); return; }
    const m = MOTIFS[s.motif];
    if (m) m.forEach((ligne, j) => [...ligne].forEach((ch, i) => { if (ch === '#') p(x + 1 + i, y + 2 + j, C2); }));
  };
  boite(16, 16, 8, 12, 4, {
    dessus: (x, y, w, h) => zone(x, y, w, h, s.haut === 'debardeur' ? s.peau : C1, 0.06),
    dessous: (x, y, w, h) => zone(x, y, w, h, s.basC, 0.06),
    cote: (x, y, w, h) => {
      fondHaut(x, y, w, h - 2);
      if (s.haut === 'maillot') zone(x + 1, y, 2, h - 2, C2, 0.05);
      zone(x, y + h - 2, w, 2, s.bas === 'short' ? s.basC : s.basC, 0.08);
    },
    devant: (x, y, w, h) => {
      fondHaut(x, y, w, h - 2);
      zone(x, y + h - 2, w, 2, s.basC, 0.08);
      p(x + 3, y + h - 2, '#d4af37'); p(x + 4, y + h - 2, '#d4af37'); // boucle de ceinture
      if (s.haut === 'debardeur') { p(x, y, s.peau); p(x + 7, y, s.peau); p(x + 3, y, s.peau); p(x + 4, y, s.peau); p(x + 3, y + 1, s.peau); p(x + 4, y + 1, s.peau); }
      else { p(x + 3, y, nuance(s.peau, -0.05)); p(x + 4, y, nuance(s.peau, -0.05)); }
      if (s.haut === 'sweat') {
        zone(x + 1, y + 6, 6, 3, sombre, 0.05);                       // poche
        p(x + 3, y + 1, C2); p(x + 3, y + 2, C2); p(x + 4, y + 1, C2); p(x + 4, y + 3, C2); // cordons
      }
      if (s.haut === 'veste') {
        zone(x + 2, y, 4, h - 2, C2, 0.06);                            // t-shirt dessous
        for (let j = 0; j < h - 2; j++) { p(x + 2, y + j, sombre); p(x + 5, y + j, sombre); }
      }
      if (s.haut === 'maillot') { zone(x, y, 8, 1, C2, 0.03); zone(x, y, 1, h - 2, C2, 0.03); zone(x + 7, y, 1, h - 2, C2, 0.03); }
      if (s.haut === 'chemise') {
        p(x + 2, y, C2); p(x + 5, y, C2); p(x + 2, y + 1, C2); p(x + 5, y + 1, C2); // col
        for (let j = 2; j < h - 2; j += 2) p(x + 4, y + j, C2);           // boutons
        zone(x + 1, y + 3, 2, 2, sombre, 0.03);                          // poche
      }
      motif(x, y);
    },
    dos: (x, y, w, h) => {
      fondHaut(x, y, w, h - 2);
      zone(x, y + h - 2, w, 2, s.basC, 0.08);
      if (s.haut === 'sweat') zone(x + 1, y, 6, 4, sombre, 0.05);       // capuche
      if (s.haut === 'maillot') { zone(x, y, 8, 1, C2, 0.03); dessinChiffres(p, x + 1, y + 3, C2); }
    },
  });

  // ----- Bras : manches (selon le haut) puis la peau -----
  const bras = (u, v) => {
    const face = (x, y, w, h) => {
      zone(x, y, w, h, s.peau, 0.05);
      if (manche) {
        if (s.haut === 'pull') rayures(x, y, w, manche); else zone(x, y, w, manche, C1, 0.08);
        if (manche > 4) zone(x, y + manche - 1, w, 1, s.haut === 'pull' ? C1 : sombre, 0.04); // poignet
        if (s.haut === 'maillot') zone(x, y + manche - 1, w, 1, C2, 0.04);
      }
    };
    boite(u, v, 4, 12, 4, {
      dessus: (x, y, w, h) => zone(x, y, w, h, manche ? C1 : s.peau, 0.06),
      dessous: (x, y, w, h) => zone(x, y, w, h, s.peau, 0.04),
      cote: face, devant: face, dos: face,
    });
  };
  bras(40, 16); bras(32, 48);

  // ----- Jambes : bas puis chaussures -----
  const hautChaussure = { baskets: 2, montantes: 3, bottes: 5 }[s.chaussures] ?? 2;
  const jambe = (u, v, coteExterieur) => {
    const face = (x, y, w, h, cote) => {
      if (s.bas === 'short') { zone(x, y, w, 5, s.basC, 0.08); zone(x, y + 5, w, h - 5, s.peau, 0.05); }
      else zone(x, y, w, h, s.basC, s.bas === 'jean' ? 0.14 : 0.08);
      if (s.bas === 'jean' && cote === 'devant') for (let j = 1; j < 10; j += 3) p(x + 1, y + j, nuance(s.basC, 0.25));
      if (s.bas === 'jogging') { zone(x, y + 9, w, 1, nuance(s.basC, -0.3), 0.03); if (cote === coteExterieur) zone(x + 1, y, 1, 9, '#ffffff', 0.03); }
      if (s.bas === 'cargo' && cote === coteExterieur) zone(x, y + 4, w, 3, nuance(s.basC, -0.25), 0.05);
      // chaussures
      zone(x, y + h - hautChaussure, w, hautChaussure, s.chaussuresC, 0.06);
      if (s.chaussures === 'baskets') zone(x, y + h - 1, w, 1, '#f2f2f2', 0.03);
      if (s.chaussures === 'montantes') { zone(x, y + h - 1, w, 1, '#f2f2f2', 0.03); if (cote === 'devant') p(x + 1, y + h - 3, '#ffffff'); }
      if (s.chaussures === 'bottes') zone(x, y + h - 1, w, 1, nuance(s.chaussuresC, -0.4), 0.03);
    };
    boite(u, v, 4, 12, 4, {
      dessus: (x, y, w, h) => zone(x, y, w, h, s.basC, 0.06),
      dessous: (x, y, w, h) => zone(x, y, w, h, s.chaussures === 'bottes' ? nuance(s.chaussuresC, -0.4) : '#f2f2f2', 0.03),
      cote: (x, y, w, h, cote) => face(x, y, w, h, cote),
      devant: (x, y, w, h) => face(x, y, w, h, 'devant'),
      dos: (x, y, w, h) => face(x, y, w, h, 'dos'),
    });
  };
  jambe(0, 16, 'droite'); jambe(16, 48, 'gauche');
  return c;
}

function dessinChiffres(p, x, y, col) {
  [CHIFFRES[1], CHIFFRES[0]].forEach((ch, k) => ch.forEach((ligne, j) => [...ligne].forEach((c, i) => {
    if (c === '#') p(x + i + k * 3, y + j, col);
  })));
}

// ---------- Chapeaux et accessoires en 3D ----------
const materiaux = new Map();
function mat(hex, { lumineux = false, transparent = false, brillant = false } = {}) {
  const cle = `${hex}|${lumineux}|${transparent}|${brillant}`;
  if (!materiaux.has(cle)) {
    let m;
    if (transparent) m = new THREE.MeshPhongMaterial({ color: hex, transparent: true, opacity: 0.35, shininess: 120, specular: 0xffffff, depthWrite: false });
    else if (brillant) m = new THREE.MeshPhongMaterial({ color: hex, shininess: 90, specular: 0x666666 });
    else m = new THREE.MeshLambertMaterial(lumineux ? { color: hex, emissive: hex, emissiveIntensity: 0.9 } : { color: hex });
    materiaux.set(cle, m);
  }
  return materiaux.get(cle);
}

// Ajoute une boîte (dimensions et position en "pixels" du personnage).
function bloc(parent, w, h, d, x, y, z, materiau, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w * PX, h * PX, d * PX), materiau);
  m.position.set(x * PX, y * PX, z * PX);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  parent.add(m);
  return m;
}

// Habille un personnage : chapeau, accessoires, détails de coiffure.
// tete et corps sont les "mesh" de la tête (centre de la tête) et du corps.
// Renvoie les pièces animées (cape, ailes, flammes du jetpack).
export function habiller(tete, corps, styleBrut) {
  const s = normaliserStyle(styleBrut);
  const anim = {};
  const H = mat(s.cheveux);
  const C = mat(s.chapeauC);
  const Cs = mat(nuance(s.chapeauC, -0.3));
  const A = mat(s.accC);
  const As = mat(nuance(s.accC, -0.3));

  // Coiffure en relief
  if (s.coupe === 'queue') bloc(tete, 2.2, 4.5, 2.2, 0, -1.2, 5.1, H, 0.35);
  if (s.coupe === 'herisses' && s.chapeau === 'aucun') {
    for (const [x, z] of [[-2.5, -2.5], [0, -2.8], [2.5, -2.5], [-2.5, 0.5], [0.5, 0], [2.5, 0.5], [-1.5, 3], [1.5, 3]]) {
      bloc(tete, 1.6, 1.8, 1.6, x, 4.8, z, H, 0.2 * Math.sign(z), 0, -0.15 * x);
    }
  }

  // Chapeaux (sur la tête : le dessus de la tête est à y = 4)
  switch (s.chapeau) {
    case 'casquette':
    case 'casquette_envers': {
      const sens = s.chapeau === 'casquette' ? -1 : 1;
      bloc(tete, 8.6, 2.6, 8.6, 0, 4.9, 0, C);
      bloc(tete, 8.6, 0.6, 4.5, 0, 3.9, sens * 6.3, Cs);
      bloc(tete, 1.2, 0.6, 1.2, 0, 6.4, 0, Cs);
      break;
    }
    case 'bonnet':
      bloc(tete, 8.8, 3.4, 8.8, 0, 5.0, 0, C);
      bloc(tete, 9.0, 1.3, 9.0, 0, 3.8, 0, Cs);
      bloc(tete, 2.2, 2.2, 2.2, 0, 7.6, 0, mat('#ffffff'));
      break;
    case 'couronne': {
      const or = mat('#f5c542', { brillant: true });
      bloc(tete, 9, 1.8, 0.6, 0, 4.9, -4.3, or); bloc(tete, 9, 1.8, 0.6, 0, 4.9, 4.3, or);
      bloc(tete, 0.6, 1.8, 9, -4.3, 4.9, 0, or); bloc(tete, 0.6, 1.8, 9, 4.3, 4.9, 0, or);
      for (const x of [-3.6, 0, 3.6]) { bloc(tete, 1.2, 1.6, 0.6, x, 6.5, -4.3, or); bloc(tete, 1.2, 1.6, 0.6, x, 6.5, 4.3, or); }
      for (const z of [-1.8, 1.8]) { bloc(tete, 0.6, 1.6, 1.2, -4.3, 6.5, z, or); bloc(tete, 0.6, 1.6, 1.2, 4.3, 6.5, z, or); }
      bloc(tete, 1.2, 1.0, 0.4, 0, 4.9, -4.65, mat('#e33b3b', { brillant: true }));
      bloc(tete, 0.4, 1.0, 1.2, -4.65, 4.9, 0, mat('#3b6bff', { brillant: true }));
      bloc(tete, 0.4, 1.0, 1.2, 4.65, 4.9, 0, mat('#3b6bff', { brillant: true }));
      break;
    }
    case 'chantier': {
      const jaune = mat('#ffcc00', { brillant: true });
      bloc(tete, 8.8, 3, 8.8, 0, 5, 0, jaune);
      bloc(tete, 10.6, 0.6, 10.6, 0, 3.9, 0, jaune);
      bloc(tete, 1.4, 0.8, 8.9, 0, 6.6, 0, mat('#e6b800'));
      break;
    }
    case 'astronaute': {
      const blanc = mat('#f2f4f7');
      bloc(tete, 11, 1, 11, 0, 5.6, 0, blanc);
      bloc(tete, 11, 10, 1, 0, 0.6, 5.5, blanc);
      bloc(tete, 1, 10, 11, -5.5, 0.6, 0, blanc); bloc(tete, 1, 10, 11, 5.5, 0.6, 0, blanc);
      bloc(tete, 11, 1.6, 1, 0, 5, -5.5, blanc); bloc(tete, 11, 1.8, 1, 0, -3.6, -5.5, blanc);
      bloc(tete, 9.4, 7.4, 0.3, 0, 0.6, -5.4, mat('#ffd27a', { transparent: true }));
      bloc(tete, 0.5, 3, 0.5, 3.5, 7.4, 2, mat('#c9ced6'));
      bloc(tete, 1, 1, 1, 3.5, 9.2, 2, mat('#ff3b3b', { lumineux: true }));
      break;
    }
    case 'cowboy':
      bloc(tete, 13, 0.6, 13, 0, 4.1, 0, C);
      bloc(tete, 8, 3.4, 8, 0, 5.9, 0, C);
      bloc(tete, 8.2, 0.9, 8.2, 0, 4.8, 0, Cs);
      break;
    case 'haut_de_forme':
      bloc(tete, 10.6, 0.6, 10.6, 0, 4.2, 0, C);
      bloc(tete, 7.6, 6.5, 7.6, 0, 7.6, 0, C);
      bloc(tete, 7.8, 1.2, 7.8, 0, 5.2, 0, mat('#d93a3a'));
      break;
    case 'pirate': {
      const noir = mat('#1d1d1f');
      bloc(tete, 11, 0.8, 10, 0, 4.3, 0, noir);
      bloc(tete, 8, 3, 8, 0, 5.9, 0, noir);
      bloc(tete, 11.1, 0.3, 0.3, 0, 4.75, -5, mat('#f5c542'));
      bloc(tete, 1.8, 1.8, 0.3, 0, 5.9, -4.1, mat('#f2f2f2'));
      break;
    }
    case 'viking': {
      const metal = mat('#9aa0a8', { brillant: true });
      const corne = mat('#efe6c8');
      bloc(tete, 8.8, 3, 8.8, 0, 5, 0, metal);
      bloc(tete, 9, 0.9, 9, 0, 3.9, 0, mat('#7a5530'));
      bloc(tete, 1.6, 4.5, 1.6, -5.4, 6.2, 0, corne, 0, 0, 0.55);
      bloc(tete, 1.6, 4.5, 1.6, 5.4, 6.2, 0, corne, 0, 0, -0.55);
      break;
    }
    case 'oreilles_chat':
      bloc(tete, 8.6, 0.6, 1.2, 0, 4.3, 0, C);
      for (const x of [-2.7, 2.7]) {
        bloc(tete, 2.4, 2.8, 0.8, x, 5.6, 0, C);
        bloc(tete, 1.2, 1.5, 0.9, x, 5.4, 0, mat('#ffb3c7'));
      }
      break;
    default: break;
  }

  // Accessoires du visage (les yeux sont à la ligne 4 : y ≈ -0.5)
  switch (s.accVisage) {
    case 'lunettes_soleil': {
      const noir = mat('#111111', { brillant: true });
      bloc(tete, 3, 1.8, 0.5, -2, -0.5, -4.3, noir); bloc(tete, 3, 1.8, 0.5, 2, -0.5, -4.3, noir);
      bloc(tete, 1.2, 0.5, 0.5, 0, -0.1, -4.3, noir);
      bloc(tete, 0.4, 0.5, 8, -4.25, -0.1, 0, noir); bloc(tete, 0.4, 0.5, 8, 4.25, -0.1, 0, noir);
      break;
    }
    case 'lunettes_rondes': {
      const cadre = mat(s.accC);
      for (const x of [-2, 2]) {
        bloc(tete, 2.8, 0.4, 0.4, x, 0.9, -4.3, cadre); bloc(tete, 2.8, 0.4, 0.4, x, -1.9, -4.3, cadre);
        bloc(tete, 0.4, 2.8, 0.4, x - 1.2, -0.5, -4.3, cadre); bloc(tete, 0.4, 2.8, 0.4, x + 1.2, -0.5, -4.3, cadre);
        bloc(tete, 2.2, 2.2, 0.2, x, -0.5, -4.3, mat('#bfe3ff', { transparent: true }));
      }
      bloc(tete, 0.4, 0.5, 8, -4.25, 0.5, 0, cadre); bloc(tete, 0.4, 0.5, 8, 4.25, 0.5, 0, cadre);
      break;
    }
    case 'masque_ski':
      bloc(tete, 8.6, 2.4, 0.9, 0, -0.3, -4.4, mat(s.accC, { brillant: true }));
      bloc(tete, 7.6, 1.6, 0.3, 0, -0.3, -4.9, mat('#ffb347', { transparent: true }));
      bloc(tete, 0.5, 1.4, 8.6, -4.3, -0.3, 0, As); bloc(tete, 0.5, 1.4, 8.6, 4.3, -0.3, 0, As);
      bloc(tete, 8.6, 1.4, 0.5, 0, -0.3, 4.3, As);
      break;
    case 'moustache':
      bloc(tete, 4, 0.9, 0.5, 0, -1.6, -4.25, H);
      bloc(tete, 1, 1, 0.5, -2.4, -1.25, -4.25, H); bloc(tete, 1, 1, 0.5, 2.4, -1.25, -4.25, H);
      break;
    default: break;
  }
  if (s.accOreilles === 'casque_audio') {
    bloc(tete, 9.4, 0.8, 1.6, 0, 4.5, 0, As);
    bloc(tete, 1.4, 3.4, 3.4, -4.7, -0.5, 0, A); bloc(tete, 1.4, 3.4, 3.4, 4.7, -0.5, 0, A);
    bloc(tete, 0.6, 1.8, 1.8, -5.6, -0.5, 0, mat('#111111')); bloc(tete, 0.6, 1.8, 1.8, 5.6, -0.5, 0, mat('#111111'));
  }

  // Dos (sur le corps : le dos est à z = +2, les épaules à y = +6)
  switch (s.accDos) {
    case 'sac_a_dos':
      bloc(corps, 6, 7, 3, 0, 0.5, 3.5, A);
      bloc(corps, 6.2, 2.2, 3.2, 0, 3.4, 3.6, As);
      bloc(corps, 4, 2, 0.6, 0, -1.6, 5.2, As);
      bloc(corps, 1, 11, 0.4, -2.2, 0.3, -2.2, As); bloc(corps, 1, 11, 0.4, 2.2, 0.3, -2.2, As);
      break;
    case 'cape': {
      const pivot = new THREE.Group();
      pivot.position.set(0, 5.6 * PX, 2.3 * PX);
      corps.add(pivot);
      bloc(pivot, 8.4, 14, 0.4, 0, -7, 0.2, A);
      bloc(pivot, 8.6, 0.8, 0.6, 0, 0, 0.2, As);
      anim.cape = pivot;
      break;
    }
    case 'jetpack': {
      const metal = mat('#9aa0a8', { brillant: true });
      for (const x of [-1.7, 1.7]) {
        bloc(corps, 2.6, 6.5, 2.6, x, 0.6, 3.6, metal);
        bloc(corps, 2.8, 0.8, 2.8, x, 3.6, 3.6, A);
        bloc(corps, 1.6, 1.2, 1.6, x, -3.3, 3.6, mat('#3a3a3a'));
      }
      anim.flammes = [-1.7, 1.7].map((x) => bloc(corps, 1.2, 3, 1.2, x, -5.4, 3.6, mat('#ff9a2e', { lumineux: true })));
      for (const f of anim.flammes) f.castShadow = false;
      break;
    }
    case 'ailes': {
      anim.ailes = [-1, 1].map((sens) => {
        const pivot = new THREE.Group();
        pivot.position.set(sens * 1 * PX, 2.5 * PX, 2.3 * PX);
        corps.add(pivot);
        bloc(pivot, 9, 7, 0.5, sens * 4.5, 0.5, 0, A);
        bloc(pivot, 7, 4, 0.55, sens * 5.5, -3.5, 0, mat(nuance(s.accC, 0.25)));
        pivot.rotation.y = sens * -0.5;
        pivot.userData.sens = sens;
        return pivot;
      });
      break;
    }
    default: break;
  }
  switch (s.accCou) {
    case 'echarpe':
      bloc(corps, 8.6, 1.8, 4.6, 0, 5.4, 0, A);
      bloc(corps, 1.8, 5.5, 0.6, -2.2, 2.4, -2.5, A);
      bloc(corps, 1.9, 0.5, 0.65, -2.2, 0.2, -2.5, As);
      break;
    case 'noeud_papillon':
      bloc(corps, 1, 1, 0.5, 0, 5.1, -2.25, As);
      bloc(corps, 1.6, 1.6, 0.5, -1.2, 5.1, -2.25, A); bloc(corps, 1.6, 1.6, 0.5, 1.2, 5.1, -2.25, A);
      break;
    default: break;
  }
  return anim;
}

// Anime les pièces : la cape flotte, les ailes battent, le jetpack crache des flammes en l'air.
export function animerAccessoires(anim, temps, { vitesse, enLAir }) {
  // (angle négatif = la cape part vers l'arrière)
  if (anim.cape) anim.cape.rotation.x = -(0.12 + Math.min(1, vitesse / 7) * 0.45 + Math.sin(temps * 1.7) * 0.06 + (enLAir ? 0.35 : 0));
  if (anim.ailes) for (const a of anim.ailes) a.rotation.y = a.userData.sens * (-0.5 + (enLAir ? Math.sin(temps * 2.2) * 0.45 : Math.sin(temps * 0.6) * 0.05));
  if (anim.flammes) {
    for (const f of anim.flammes) {
      f.visible = enLAir;
      f.scale.y = 0.7 + Math.random() * 0.6;
    }
  }
}
