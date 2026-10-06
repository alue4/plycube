// Dispersion des balles : EXACTEMENT le même calcul que sur le serveur
// (serveur/geometrie.js), pour que les traînées affichées tombent là où le serveur
// a vraiment compté les impacts.

export function normaliser(v) {
  const n = Math.hypot(v[0], v[1], v[2]);
  return n > 1e-6 ? [v[0] / n, v[1] / n, v[2] / n] : null;
}

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
export function directionsTir(d, dispersion, plombs, graine) {
  const r = hasard(graine);
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

// La dispersion actuelle d'une arme (en degrés) selon ce que fait le joueur.
//   visee : 0 → 1 (progression de la visée au clic droit)
//   vitesse : 0 → 1 (part de la vitesse max), enLAir : vrai/faux, chaleur : dispersion
//   ajoutée par les tirs à la suite (elle redescend toute seule).
export function dispersionActuelle(arme, { visee, vitesse, enLAir, chaleur }) {
  const d = arme.dispersion;
  let e = d.hanche + (d.visee - d.hanche) * visee;
  e += d.mouvement * vitesse * (1 - visee * 0.8); // en visant, bouger gêne beaucoup moins
  if (enLAir) e += d.saut;
  e += chaleur * (1 - visee * 0.7);              // en visant, les tirs à la suite s'écartent beaucoup moins
  return Math.max(d.visee, Math.min(d.max + (enLAir ? d.saut : 0), e));
}
