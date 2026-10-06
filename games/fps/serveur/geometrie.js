// Petits calculs de géométrie pour l'arbitre : trajectoire des tirs et boîtes de collision.
// Une "boîte" est [x1, y1, z1, x2, y2, z2] (coins min et max), comme dans la carte.

// Distance à laquelle un rayon (origine o, direction d normalisée) touche une boîte.
// Renvoie Infinity si le rayon ne la touche pas.
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

// Premier obstacle de la carte touché par le rayon (distance), ou la portée max.
function rayonCarte(o, d, boites, portee) {
  let best = portee;
  for (const b of boites) {
    const t = rayonBoite(o, d, b);
    if (t < best) best = t;
  }
  return best;
}

// Comme rayonCarte, mais renvoie aussi la boîte touchée et la face (normale) : pour les rebonds.
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

// Les boîtes qui arrêtent les balles : toutes sauf les vitres et les murs invisibles.
const TRAVERSABLES = new Set(['vitre', 'invisible']);
function boitesTir(carte) {
  return carte.boites.filter((b) => !TRAVERSABLES.has(b[6])).map((b) => b.slice(0, 6));
}

// Boîtes de collision d'un joueur dont les pieds sont en (x, y, z).
// Le personnage mesure 1,85 m : le corps va jusqu'à 1,4 m, la tête au-dessus.
function boitesJoueur(x, y, z, marge = 0) {
  return {
    corps: [x - 0.36 - marge, y - marge, z - 0.36 - marge, x + 0.36 + marge, y + 1.4, z + 0.36 + marge],
    tete: [x - 0.3 - marge, y + 1.4, z - 0.3 - marge, x + 0.3 + marge, y + 1.9 + marge, z + 0.3 + marge],
  };
}

// Distance entre un point et une boîte (0 si le point est dedans).
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

// ---------- Dispersion des balles ----------
// Le navigateur et le serveur font EXACTEMENT le même calcul (même "graine" de hasard),
// pour que les traînées affichées correspondent aux vrais impacts.
// (Copie identique dans public/js/balistique.js)
function hasard(graine) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Directions des balles : un cône autour de d, d'un demi-angle "dispersion" (en degrés).
function directionsTir(d, dispersion, plombs, graine) {
  const r = hasard(graine);
  // deux vecteurs perpendiculaires à d
  let u = Math.abs(d[1]) < 0.99 ? [-d[2], 0, d[0]] : [1, 0, 0];
  u = normaliser(u);
  const w = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]];
  const max = (dispersion * Math.PI) / 180;
  const res = [];
  for (let i = 0; i < plombs; i++) {
    const ang = max * Math.sqrt(r());
    const phi = r() * Math.PI * 2;
    const s = Math.sin(ang);
    const c = Math.cos(ang);
    const cp = Math.cos(phi) * s;
    const sp = Math.sin(phi) * s;
    res.push(normaliser([
      d[0] * c + u[0] * cp + w[0] * sp,
      d[1] * c + u[1] * cp + w[1] * sp,
      d[2] * c + u[2] * cp + w[2] * sp,
    ]));
  }
  return res;
}

module.exports = {
  rayonBoite, rayonCarte, rayonCarteDetail, boitesTir, boitesJoueur, distancePointBoite, normaliser,
  hasard, directionsTir, HAUTEUR_YEUX: 1.62,
};
