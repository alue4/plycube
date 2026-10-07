// Petits calculs de géométrie pour l'arbitre de Caméléon : tirs de peinture, boîtes des joueurs, sol.
// Une "boîte" est [x1, y1, z1, x2, y2, z2] (coins min et max), comme dans les cartes.

const HAUTEUR_YEUX = 1.62;
const LARGEUR = 0.3; // demi-largeur d'un joueur
const HAUTEUR = 1.8;

// Distance à laquelle un rayon (origine o, direction d normalisée) touche une boîte (Infinity sinon).
function rayonBoite(o, d, b) {
  let tmin = 0;
  let tmax = Infinity;
  for (let a = 0; a < 3; a++) {
    const min = b[a];
    const max = b[a + 3];
    if (Math.abs(d[a]) < 1e-9) {
      if (o[a] < min || o[a] > max) return Infinity;
      continue;
    }
    let t1 = (min - o[a]) / d[a];
    let t2 = (max - o[a]) / d[a];
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return Infinity;
  }
  return tmin;
}

// Premier obstacle touché : distance, boîte et face (normale).
function rayonCarteDetail(o, d, boites, portee) {
  let t = portee;
  let boite = null;
  for (const b of boites) {
    const tt = rayonBoite(o, d, b);
    if (tt < t) { t = tt; boite = b; }
  }
  if (!boite) return { t, boite: null, normale: null };
  const p = [o[0] + d[0] * t, o[1] + d[1] * t, o[2] + d[2] * t];
  let meilleur = Infinity;
  let normale = [0, 1, 0];
  for (let a = 0; a < 3; a++) {
    for (const [k, s] of [[a, -1], [a + 3, 1]]) {
      const ecart = Math.abs(p[a] - boite[k]);
      if (ecart < meilleur) { meilleur = ecart; normale = [0, 0, 0]; normale[a] = s; }
    }
  }
  return { t, boite, normale };
}

function rayonCarte(o, d, boites, portee) { return rayonCarteDetail(o, d, boites, portee).t; }

// Boîte d'un joueur selon sa pose : 0 normal / 1 statue (debout), 2 accroupi, 3 allongé (le long de son regard).
// taille : la taille choisie par un cacheur (1 = normale) ; la boîte grandit ou rétrécit depuis les pieds.
function boiteJoueur(x, y, z, pose = 0, yaw = 0, marge = 0.05, taille = 1) {
  const k = taille;
  if (pose === 2) { const w = 0.36 * k + marge; return [x - w, y, z - w, x + w, y + 1.25 * k + marge, z + w]; }
  if (pose === 3) {
    const lelongX = Math.abs(Math.sin(yaw)) > Math.abs(Math.cos(yaw));
    const L = 0.95 * k + marge; const W = 0.38 * k + marge; const h = 0.5 * k + marge;
    return lelongX ? [x - L, y, z - W, x + L, y + h, z + W] : [x - W, y, z - L, x + W, y + h, z + L];
  }
  const w = 0.36 * k + marge;
  return [x - w, y, z - w, x + w, y + 1.9 * k + marge, z + w];
}

function distancePointBoite(p, b) {
  const dx = Math.max(b[0] - p[0], 0, p[0] - b[3]);
  const dy = Math.max(b[1] - p[1], 0, p[1] - b[4]);
  const dz = Math.max(b[2] - p[2], 0, p[2] - b[5]);
  return Math.hypot(dx, dy, dz);
}

function normaliser(v) {
  const n = Math.hypot(v[0], v[1], v[2]);
  return n > 1e-6 ? [v[0] / n, v[1] / n, v[2] / n] : null;
}

// Un joueur placé en (x, y, z) touche-t-il une boîte ? (pour les bots)
function collision(boites, x, y, z) {
  for (const b of boites) {
    if (x - LARGEUR < b[3] && x + LARGEUR > b[0] && y + 0.05 < b[4] && y + HAUTEUR > b[1] && z - LARGEUR < b[5] && z + LARGEUR > b[2]) return b;
  }
  return null;
}

// Hauteur du sol sous (x, z) : la surface libre la plus basse (le sol ou le dessus d'un bloc bas)
function hauteurSol(boites, x, z, maxMarche = 0.6) {
  const hauteurs = [0];
  for (const b of boites) {
    if (x - LARGEUR < b[3] && x + LARGEUR > b[0] && z - LARGEUR < b[5] && z + LARGEUR > b[2] && b[4] > 0 && b[4] <= maxMarche) hauteurs.push(b[4]);
  }
  hauteurs.sort((a, b) => a - b);
  for (const h of hauteurs) if (!collision(boites, x, h, z)) return h;
  return null; // pas de place pour se tenir debout ici
}

module.exports = {
  HAUTEUR_YEUX, LARGEUR, HAUTEUR, rayonBoite, rayonCarte, rayonCarteDetail, boiteJoueur, distancePointBoite, normaliser,
  collision, hauteurSol,
};
