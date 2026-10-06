// Animations « perso » des armes, faites dans l'atelier d'animations (atelier-animations.html).
// Elles remplacent les animations écrites dans arme.js pour une arme et un moment précis
// (sortir l'arme, recharger, tirer...). S'il n'y en a pas, le jeu garde l'animation d'origine.
//
// Une animation :
//   { duree: 2.1, mouvement: 'fluide' | 'doux', pistes: { arme: [clé, ...], mainG: [...], chargeur: [...] }, sons: [[t, nom], ...] }
// Une clé = [t, px, py, pz, rx, ry, rz, cache, arret, libre] : à t secondes, décalage de position (mètres) et
// rotation (radians) par rapport à la pose normale ; cache = 1 pour cacher la pièce (ou lâcher l'arme
// avec la main gauche) ; arret = 1 : la pièce s'arrête un instant sur cette clé ;
// libre = 1 (mains seulement) : la main est détachée de l'arme, elle garde sa place à l'écran même si l'arme
// bouge (sa position est alors un décalage par rapport à sa place normale à l'écran).
// Pour la corde de l'arbalète, px = tension (0 = relâchée, 1 = tendue).
// Entre deux clés, le mouvement est calculé tout seul : « fluide » (sans arrêt, sauf sur les clés « arrêt »)
// ou « doux » (petit arrêt à chaque clé).

import { dureeInspection } from './animations-origine.js';

// Coups de mêlée et lancer d'origine : [moment (0 → 1), décalage x, y, z, rotation x, y, z]
export const COUPS = {
  couteau: { duree: 0.32, etapes: [[0, 0, 0, 0, 0, 0, 0], [0.25, 0.06, 0.03, 0.02, 0.1, -0.75, 0.2], [0.55, -0.22, 0.0, -0.1, -0.05, 0.65, -0.3], [1, 0, 0, 0, 0, 0, 0]] },
  couteauDos: { duree: 0.75, etapes: [[0, 0, 0, 0, 0, 0, 0], [0.3, -0.04, 0.1, 0.06, -0.55, 0, 0], [0.45, -0.06, -0.1, -0.2, -0.5, 0, 0], [0.72, -0.06, -0.11, -0.19, -0.5, 0, 0], [1, 0, 0, 0, 0, 0, 0]] },
  batte: { duree: 0.55, etapes: [[0, 0, 0, 0, 0, 0, 0], [0.2, 0.06, 0.04, 0.03, 0.3, -0.6, -0.2], [0.5, -0.2, 0.1, 0.05, -0.65, 0.7, 0.3], [0.7, -0.5, 0.05, 0.15, -0.6, 1.35, 0.4], [1, 0, 0, 0, 0, 0, 0]] },
  poele: { duree: 0.5, etapes: [[0, 0, 0, 0, 0, 0, 0], [0.25, 0, 0.05, 0.03, 0.4, 0, 0], [0.5, -0.05, 0.02, -0.1, -1.35, 0, 0], [0.65, -0.05, 0.02, -0.09, -1.3, 0, 0], [1, 0, 0, 0, 0, 0, 0]] },
  lancer: { duree: 0.6, etapes: [[0, 0, 0, 0, 0, 0, 0], [0.35, 0.08, 0.1, -0.02, 0.9, 0, 0], [0.5, -0.06, 0.08, -0.3, -0.5, 0, 0], [1, 0, 0, 0, 0, 0, 0]] },
};
// Pompe (fusil à pompe) et culasse (sniper) après un tir : durée en secondes
export const ARMEMENT = { pompe: 0.5, sniper: 0.75 };
// Armes dont le recul revient vite (le recul d'origine dure 1/14 s au lieu de 1/6 s)
export const RAPIDES = new Set(['smg', 'fusil', 'uzi', 'mitrailleuse', 'rafale', 'pistolet']);

// Inspection (touche F) quand l'arme n'a pas d'inspection perso : on tourne l'arme pour la regarder.
export const INSPECTION_DEFAUT = {
  duree: 2.2, mouvement: 'fluide',
  pistes: {
    arme: [[0, 0, 0, 0, 0, 0, 0, 0], [0.45, -0.07, 0.05, 0.04, 0.15, 0.7, 0.35, 0], [1.25, -0.07, 0.06, 0.04, 0.1, 0.75, -0.45, 0], [1.75, -0.03, 0.03, 0.02, 0.05, 0.25, 0, 0], [2.2, 0, 0, 0, 0, 0, 0, 0]],
  },
  sons: [],
};

const melee = (a) => a.type === 'melee';
const tireur = (a) => a.type !== 'melee' && a.type !== 'gadget';

// La liste des animations qu'on peut modifier. duree(arme) = durée imposée par le jeu (en s) ;
// libre = [min, max] quand c'est toi qui choisis la durée.
export const ANIMATIONS = [
  {
    cle: 'sortir', nom: 'Prendre en main', aide: "Quand on prend l'arme (touches 1 à 4, molette ou E). C'est toi qui choisis la durée : on peut tirer aux 3/4 de l'animation.",
    pour: () => true, libre: [0.15, 2], dureeParDefaut: (a) => a.sortieMs / 1000,
  },
  {
    cle: 'tir', nom: 'Tir (recul)', aide: "Rejoue à chaque tir. Garde-la plus courte que le temps entre deux tirs, sinon elle est coupée par le tir suivant.",
    pour: (a) => tireur(a) || a.id === 'grappin', libre: [0.04, 1.5], dureeParDefaut: (a) => (RAPIDES.has(a.id) ? 1 / 14 : 1 / 6),
  },
  {
    cle: 'armement', nom: 'Pompe / culasse après le tir', aide: 'Juste après le tir (et à la fin de la recharge du fusil à pompe). Durée imposée par le jeu.',
    pour: (a) => !!ARMEMENT[a.id], duree: (a) => ARMEMENT[a.id],
  },
  {
    cle: 'recharge', nom: 'Recharge', aide: 'Durée imposée par le jeu : ton animation doit tenir dans ce temps.',
    aideCartouche: "Durée imposée par le jeu, pour UNE cartouche : l'animation se répète pour chaque cartouche.",
    pour: (a) => a.chargeur > 0, duree: (a) => a.rechargementMs / 1000,
  },
  {
    cle: 'coup', nom: 'Coup', aide: 'Clic gauche. Durée imposée par le jeu.',
    pour: melee, duree: (a) => (COUPS[a.id] || COUPS.couteau).duree,
  },
  {
    cle: 'coupDos', nom: 'Coup dans le dos', aide: 'Couteau, en visant, dans le dos d\'un adversaire. Durée imposée par le jeu.',
    pour: (a) => !!a.dansLeDos, duree: () => COUPS.couteauDos.duree,
  },
  {
    cle: 'lancer', nom: 'Lancer', aide: 'Grenade et fumigène. Durée imposée par le jeu.',
    pour: (a) => a.id === 'grenade' || a.id === 'fumigene', duree: () => COUPS.lancer.duree,
  },
  {
    cle: 'soin', nom: 'Se soigner', aide: 'Durée imposée par le jeu.',
    pour: (a) => !!a.dureeSoinMs, duree: (a) => a.dureeSoinMs / 1000,
  },
  {
    cle: 'inspecter', nom: 'Inspecter (touche F)', aide: "Touche F, quand on ne fait rien d'autre. C'est toi qui choisis la durée.",
    pour: () => true, libre: [0.3, 6], dureeParDefaut: (a) => dureeInspection(a.id) || INSPECTION_DEFAUT.duree,
  },
];
export const ANIMATION = Object.fromEntries(ANIMATIONS.map((a) => [a.cle, a]));

// Durée d'une animation pour une arme : imposée par le jeu, ou celle choisie dans l'atelier.
export function dureeAnimation(arme, cle, anim) {
  const def = ANIMATION[cle];
  if (!def) return 0;
  if (def.duree) return def.duree(arme);
  return anim ? anim.duree : def.dureeParDefaut(arme);
}

// Les pièces qui peuvent bouger (en plus de l'arme entière et des deux mains)
export const PIECES = ['chargeur', 'culasse', 'pompe', 'barillet', 'canons', 'munition', 'munitionCanon', 'crochet', 'objet'];
export const NOMS_PISTES = {
  arme: 'Arme (toute)', mainD: 'Main droite', mainG: 'Main gauche', chargeur: 'Chargeur', culasse: 'Culasse / glissière', pompe: 'Pompe',
  barillet: 'Barillet', canons: 'Canons', munition: 'Munition', munitionCanon: 'Cartouches', crochet: 'Crochet', objet: 'Objet', corde: 'Corde',
};

// Pistes disponibles pour un modèle d'arme (dans cet ordre)
export function pistesDe(modele) {
  const u = modele.userData;
  const l = ['arme', 'mainD', 'mainG'];
  const vus = new Set();
  for (const p of PIECES) if (u[p] && !vus.has(u[p])) { vus.add(u[p]); l.push(p); } // le crochet du grappin est aussi son « objet »
  if (u.tendre) l.push('corde');
  return l;
}

// ---------- Les animations enregistrées ----------
let enregistrees = {}; // arme -> clé -> animation
export function definirAnimations(obj) { enregistrees = obj && typeof obj === 'object' ? obj : {}; }
export function animationsEnregistrees() { return enregistrees; }
export function animationPerso(armeId, cle) { return enregistrees[armeId]?.[cle] || null; }

// ---------- Calcul de la pose à un instant ----------
// Valeur d'une piste au temps t (en secondes) : [t, px, py, pz, rx, ry, rz, cache]
// (courbe qui passe par toutes les clés ; vitesse nulle à la première, à la dernière et aux clés « arrêt »)
export function valeurPiste(cles, t, mouvement = 'fluide') {
  const n = cles.length;
  if (!n) return null;
  if (n === 1 || t <= cles[0][0]) return cles[0];
  if (t >= cles[n - 1][0]) return cles[n - 1];
  let i = 1;
  while (cles[i][0] < t) i++;
  const a = cles[i - 1];
  const b = cles[i];
  const h = Math.max(1e-6, b[0] - a[0]);
  const k = (t - a[0]) / h;
  const out = [t, 0, 0, 0, 0, 0, 0, a[7] || 0]; // cacher / montrer : d'un coup, à la clé
  const doux = mouvement === 'doux';
  const p0 = doux || a[8] ? null : cles[i - 2];
  const p3 = doux || b[8] ? null : cles[i + 1];
  const k2 = k * k;
  const k3 = k2 * k;
  const h00 = 2 * k3 - 3 * k2 + 1; const h10 = k3 - 2 * k2 + k; const h01 = -2 * k3 + 3 * k2; const h11 = k3 - k2;
  for (let j = 1; j < 7; j++) {
    const ma = p0 ? ((b[j] - p0[j]) / Math.max(1e-6, b[0] - p0[0])) * h : 0;
    const mb = p3 ? ((p3[j] - a[j]) / Math.max(1e-6, p3[0] - a[0])) * h : 0;
    out[j] = h00 * a[j] + h10 * ma + h01 * b[j] + h11 * mb;
  }
  // main attachée / détachée : on passe de l'un à l'autre en douceur entre les deux clés
  const la = a[9] || 0; const lb = b[9] || 0;
  out[8] = 0;
  out[9] = la === lb ? la : la + (lb - la) * (k * k * (3 - 2 * k));
  return out;
}

// Toutes les pistes d'une animation au temps t : { arme: [...], mainG: [...], ... }
export function evaluer(anim, t) {
  const res = {};
  for (const [nom, cles] of Object.entries(anim.pistes || {})) {
    const v = valeurPiste(cles, t, anim.mouvement);
    if (v) res[nom] = v;
  }
  return res;
}
