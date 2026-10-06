// Les bots de Caméléon : quand on est seul (ou peu nombreux), des bots complètent la partie.
//   - Bot cacheur : il court vers une cachette, prend la pose et se peint avec les couleurs des objets
//     autour de lui (tête et corps comme le meuble à côté, jambes comme le sol).
//   - Bot chercheur : il fouille les cachettes ; il repère plus facilement un cacheur mal camouflé, proche,
//     ou qui bouge ; il entend les sifflets ; il peut se tromper (tir raté = pénalité, comme tout le monde).
const G = require('./geometrie');

const CELLULE = 0.8;
const NOMS = ['Gecko', 'Iguane', 'Lézard', 'Pixel', 'Ninja', 'Galet', 'Brindille', 'Fantôme', 'Ombre', 'Camo', 'Moustique', 'Bambou'];
// Couleur de base des matières nommées (les mêmes que dans textures.js d'Arena FPS)
const BASES = {
  herbe: '#5cb83c', pierre: '#8f949c', brique: '#b4553c', bois: '#b98a4e', caisse: '#c98f4a', tronc: '#6b4a2b', feuilles: '#3f9b3a',
  terre: '#7a5532', sable: '#e6cf94', pave: '#8b8a86', asphalte: '#3d4046', trottoir: '#b9b6ae', pierre_chateau: '#b7af9c', beton: '#a9acad',
  planches: '#7a5230', paille: '#d6b45a', toit_rouge: '#b8452f', toit_ardoise: '#4d5868', metal: '#9aa3ad', metal_rouge: '#c8352b',
  metal_bleu: '#2f6fd0', metal_jaune: '#e8b923', pneu: '#1e1f22', vitre: '#9fd6ff', lampe: '#ffd36b', tissu_bleu: '#2f6fe0',
  tissu_rouge: '#d63a3a', neon: '#3aa8ff', neon_rouge: '#ff4d4d',
};
const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const hex = (c) => `#${c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
// couleur moyenne d'une matière (pour un motif à deux couleurs : le mélange)
function couleurMatiere(m) {
  if (BASES[m]) return BASES[m];
  const cs = (m.match(/#[0-9a-f]{6}/g) || []).map(rgb);
  if (!cs.length) return '#8f949c';
  if (cs.length === 1) return hex(cs[0]);
  return hex([0, 1, 2].map((k) => cs[0][k] * 0.6 + cs[1][k] * 0.4));
}
const ecartCouleurs = (a, b) => { const x = rgb(a); const y = rgb(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) / 441; };
const moyenne = (liste) => hex([0, 1, 2].map((k) => liste.reduce((s, h) => s + rgb(h)[k], 0) / liste.length));

// ---------- La grille où les bots peuvent marcher (une par carte, calculée une fois) ----------
const PLANS = new Map();
function planDe(carte, boites) {
  if (PLANS.has(carte.id) && PLANS.get(carte.id).carte === carte) return PLANS.get(carte.id);
  const T = carte.taille;
  const n = Math.ceil((2 * T) / CELLULE);
  const sol = new Float32Array(n * n).fill(NaN);
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      const x = -T + (i + 0.5) * CELLULE; const z = -T + (k + 0.5) * CELLULE;
      const h = G.hauteurSol(boites, x, z);
      if (h !== null) sol[i * n + k] = h;
    }
  }
  const plan = { carte, n, T, sol };
  PLANS.set(carte.id, plan);
  return plan;
}
const cellule = (plan, x, z) => [Math.max(0, Math.min(plan.n - 1, Math.floor((x + plan.T) / CELLULE))), Math.max(0, Math.min(plan.n - 1, Math.floor((z + plan.T) / CELLULE)))];
const centre = (plan, i, k) => [-plan.T + (i + 0.5) * CELLULE, -plan.T + (k + 0.5) * CELLULE];
const libre = (plan, i, k) => i >= 0 && k >= 0 && i < plan.n && k < plan.n && !Number.isNaN(plan.sol[i * plan.n + k]);

// Chemin le plus court (A*) entre deux points ; renvoie une liste de [x, y, z] ou null.
function chemin(plan, de, vers) {
  const n = plan.n;
  let [si, sk] = cellule(plan, de[0], de[2]);
  const [bi, bk] = cellule(plan, vers[0], vers[2]);
  if (!libre(plan, si, sk)) { // on part d'une case bloquée (contre un meuble) : la case libre la plus proche
    let trouve = false;
    for (let r = 1; r < 4 && !trouve; r++) for (let a = -r; a <= r && !trouve; a++) for (let b = -r; b <= r && !trouve; b++) if (libre(plan, si + a, sk + b)) { si += a; sk += b; trouve = true; }
    if (!trouve) return null;
  }
  if (!libre(plan, bi, bk)) return null;
  const idx = (i, k) => i * n + k;
  const g = new Float32Array(n * n).fill(Infinity);
  const venu = new Int32Array(n * n).fill(-1);
  const ouvert = [[0, si, sk]];
  g[idx(si, sk)] = 0;
  const h = (i, k) => Math.hypot(i - bi, k - bk);
  let tours = 0;
  while (ouvert.length && tours++ < 20000) {
    let m = 0;
    for (let q = 1; q < ouvert.length; q++) if (ouvert[q][0] < ouvert[m][0]) m = q;
    const [, i, k] = ouvert[m];
    ouvert[m] = ouvert[ouvert.length - 1]; ouvert.pop();
    if (i === bi && k === bk) break;
    const hi = plan.sol[idx(i, k)];
    for (let a = -1; a <= 1; a++) {
      for (let b = -1; b <= 1; b++) {
        if (!a && !b) continue;
        const ni = i + a; const nk = k + b;
        if (!libre(plan, ni, nk)) continue;
        if (a && b && (!libre(plan, i + a, k) || !libre(plan, i, k + b))) continue; // pas en diagonale contre un coin
        if (Math.abs(plan.sol[idx(ni, nk)] - hi) > 0.6) continue;
        const ng = g[idx(i, k)] + (a && b ? 1.414 : 1);
        if (ng < g[idx(ni, nk)]) { g[idx(ni, nk)] = ng; venu[idx(ni, nk)] = idx(i, k); ouvert.push([ng + h(ni, nk), ni, nk]); }
      }
    }
  }
  if (!Number.isFinite(g[idx(bi, bk)])) return null;
  const res = [];
  for (let c = idx(bi, bk); c !== -1; c = venu[c]) {
    const i = Math.floor(c / n); const k = c % n;
    const [x, z] = centre(plan, i, k);
    res.push([x, plan.sol[c], z]);
  }
  res.reverse();
  res.push([vers[0], plan.sol[idx(bi, bk)], vers[2]]);
  return res;
}

class Bots {
  constructor(salon) {
    this.salon = salon;
    this.suivant = 0;
    this.plan = null;
  }

  liste() { return [...this.salon.joueurs.values()].filter((j) => j.bot); }

  // Avant chaque manche : seul, on joue à 4 avec des bots ; plus on est de vrais joueurs, moins il y a de bots.
  preparerManche() {
    const s = this.salon;
    const humains = s.humains();
    const voulus = humains >= s.r.botsSolo ? 0 : s.r.botsSolo - humains;
    const bots = this.liste();
    for (let i = voulus; i < bots.length; i++) {
      s.joueurs.delete(bots[i].id);
      s.diffuser({ t: 'sortie', id: bots[i].id });
    }
    for (let i = bots.length; i < voulus; i++) this.ajouter();
  }

  ajouter() {
    const s = this.salon;
    this.suivant++;
    const pris = new Set(this.liste().map((j) => j.nom));
    const nom = `Bot ${NOMS.find((x) => !pris.has(`Bot ${x}`)) || this.suivant}`;
    const j = s.creerJoueur({ id: -this.suivant, nom, ws: { readyState: 3, send() {} }, bot: true });
    j.bot = { chemin: null, etape: 0, etat: 'attente', prochainScan: 0, cible: null, viseA: 0, pauseJusqua: 0, cibles: [], sons: [], vu: new Map(), dernierePos: null };
    s.joueurs.set(j.id, j);
    s.diffuser({ t: 'entree', joueur: s.infosPubliques(j) });
  }

  debutManche() {
    const s = this.salon;
    if (!this.plan) this.plan = planDe(s.carte, s.boitesMarche);
    const prises = new Set();
    for (const j of this.liste()) {
      const b = j.bot;
      b.chemin = null; b.etape = 0; b.cible = null; b.sons = []; b.vu = new Map(); b.pauseJusqua = 0;
      if (j.role === 'cacheur') {
        b.etat = 'va';
        b.leurreA = Math.random() < 0.6 ? 0.3 + Math.random() * 0.4 : 2; // pose un leurre en chemin (6 fois sur 10)
        const cachette = this.choisirCachette(j, prises);
        prises.add(cachette.join());
        b.chemin = chemin(this.plan, [j.x, j.y, j.z], cachette);
        b.longueur = b.chemin ? b.chemin.length : 0;
      } else {
        b.etat = 'attend';
        b.cibles = this.pointsDeFouille();
      }
    }
  }

  // Une cachette : celles prévues dans la carte (près des meubles), loin des chercheurs, pas déjà prises
  choisirCachette(j, prises) {
    const s = this.salon;
    const ch = s.carte.apparitions.find((a) => a.role === 'chercheur') || { x: 0, z: 0 };
    const points = (s.carte.cachettes || []).map((c) => [c[0], c[1], c[2]]);
    for (let i = 0; i < 12; i++) {
      const x = (Math.random() * 2 - 1) * (s.carte.taille - 2); const z = (Math.random() * 2 - 1) * (s.carte.taille - 2);
      const [ci, ck] = cellule(this.plan, x, z);
      if (libre(this.plan, ci, ck)) points.push([x, this.plan.sol[ci * this.plan.n + ck], z]);
    }
    const notes = points.filter((p) => !prises.has(p.join())).map((p) => ({ p, note: Math.hypot(p[0] - ch.x, p[2] - ch.z) * (0.6 + Math.random() * 0.8) }));
    notes.sort((a, b) => b.note - a.note);
    for (const { p } of notes) if (chemin(this.plan, [j.x, j.y, j.z], p)) return p;
    return [j.x, j.y, j.z];
  }

  pointsDeFouille() {
    const s = this.salon;
    const pts = (s.carte.cachettes || []).map((c) => [c[0] + (Math.random() - 0.5) * 2, c[1], c[2] + (Math.random() - 0.5) * 2]);
    return pts.sort(() => Math.random() - 0.5);
  }

  surSifflet(positions) {
    for (const j of this.liste()) {
      if (j.role !== 'chercheur') continue;
      let meilleur = null;
      for (const p of positions) {
        const d = Math.hypot(p[0] - j.x, p[2] - j.z);
        if (!meilleur || d < meilleur.d) meilleur = { p, d };
      }
      if (meilleur && meilleur.d < 35) {
        j.bot.cibles.unshift([meilleur.p[0] + (Math.random() - 0.5) * 5, 0, meilleur.p[2] + (Math.random() - 0.5) * 5]);
        j.bot.chemin = null; // on y va tout de suite
      }
    }
  }

  // Avance le long du chemin. Renvoie true quand le bout est atteint.
  avancer(j, dt, vitesse) {
    const b = j.bot;
    if (!b.chemin || b.etape >= b.chemin.length) return true;
    let reste = vitesse * dt;
    while (reste > 0 && b.etape < b.chemin.length) {
      const [x, y, z] = b.chemin[b.etape];
      const dx = x - j.x; const dz = z - j.z;
      const d = Math.hypot(dx, dz);
      if (d > 0.05) j.yaw = Math.atan2(-dx, -dz);
      if (d <= reste) { j.x = x; j.z = z; j.y = Number.isFinite(y) ? y : j.y; b.etape++; reste -= d; } else { j.x += (dx / d) * reste; j.z += (dz / d) * reste; reste = 0; }
    }
    return b.etape >= b.chemin.length;
  }

  // Se peindre avec les couleurs du coin : tête / corps / bras comme le bloc le plus proche à leur hauteur, jambes comme le sol
  peindre(j) {
    const s = this.salon;
    const pres = (y, rayon) => {
      let meilleur = null;
      for (const b of s.carte.boites) {
        if (b[6] === 'invisible' || b[6] === 'vitre') continue;
        if (b[1] > j.y + y || b[4] < j.y + y) continue;
        const d = G.distancePointBoite([j.x, j.y + y, j.z], b);
        if (d < rayon && (!meilleur || d < meilleur.d)) meilleur = { d, m: b[6] };
      }
      return meilleur ? couleurMatiere(meilleur.m) : null;
    };
    let sol = null;
    for (const b of s.carte.boites) {
      if (b[6] === 'invisible') continue;
      if (j.x >= b[0] && j.x <= b[3] && j.z >= b[2] && j.z <= b[5] && Math.abs(b[4] - j.y) < 0.1) sol = couleurMatiere(b[6]);
    }
    sol = sol || '#5cb83c';
    const bas = pres(0.4, 1.4) || sol;
    const milieu = pres(1.0, 1.6) || bas;
    const haut = pres(1.6, 1.6) || milieu;
    // allongé : tout le corps prend la couleur du sol ; accroupi : surtout ce qui est à côté en bas
    const couleurs = j.pose === 3 ? { tete: sol, corps: sol, brasD: sol, brasG: sol, jambeD: sol, jambeG: sol }
      : j.pose === 2 ? { tete: milieu, corps: bas, brasD: bas, brasG: bas, jambeD: sol, jambeG: sol }
        : { tete: haut, corps: milieu, brasD: milieu, brasG: milieu, jambeD: bas, jambeG: bas };
    j.couleurs = couleurs;
    s.diffuser({ t: 'peau', id: j.id, couleurs });
  }

  // ---------- À chaque tour ----------
  tick(now, dt) {
    const s = this.salon;
    if (s.etat !== 'cachette' && s.etat !== 'recherche') return;
    if (!this.plan) this.plan = planDe(s.carte, s.boitesMarche);
    for (const j of this.liste()) {
      if (j.role === 'cacheur') this.cacheur(j, now, dt);
      else if (j.role === 'chercheur' && s.etat === 'recherche') this.chercheur(j, now, dt);
    }
  }

  cacheur(j, now, dt) {
    const s = this.salon;
    const b = j.bot;
    if (b.etat === 'va') {
      // un leurre en chemin, pour tromper
      if (b.longueur && b.etape / b.longueur > b.leurreA && !j.leurreUtilise) s.poserLeurre(j);
      if (this.avancer(j, dt, s.r.joueur.vitesse * 0.9) || (s.etat === 'recherche' && now > s.finEtatA - (s.r.rechercheSecondes - 3) * 1000)) {
        b.etat = 'cache';
        j.yaw = Math.random() * Math.PI * 2;
        const r = Math.random();
        s.changerPose(j, { p: r < 0.45 ? 2 : r < 0.75 ? 3 : 1 });
        this.peindre(j);
      }
    }
  }

  // Le bot chercheur voit-il ce cacheur (ou ce leurre) ? Plus facile s'il est proche, mal camouflé ou s'il bouge.
  chanceDeVoir(j, cible, dt) {
    const s = this.salon;
    const oeil = [j.x, j.y + G.HAUTEUR_YEUX, j.z];
    const centreC = [cible.x, cible.y + (cible.pose === 3 ? 0.3 : cible.pose === 2 ? 0.7 : 1.0), cible.z];
    const v = [centreC[0] - oeil[0], centreC[1] - oeil[1], centreC[2] - oeil[2]];
    const d = Math.hypot(v[0], v[1], v[2]);
    if (d > 28 || d < 0.01) return 0;
    const dir = [v[0] / d, v[1] / d, v[2] / d];
    const devant = [-Math.sin(j.yaw), -Math.cos(j.yaw)];
    if ((dir[0] * devant[0] + dir[2] * devant[1]) / (Math.hypot(dir[0], dir[2]) || 1) < Math.cos((65 * Math.PI) / 180)) return 0; // pas dans son champ de vision
    if (G.rayonCarte(oeil, dir, s.boites, d) < d - 0.45) return 0; // caché derrière quelque chose
    // ce qu'il y a derrière le cacheur (le fond sur lequel il se détache)
    const fond = G.rayonCarteDetail(centreC, dir, s.boites, 30);
    const matFond = fond.boite ? (s.carte.boites.find((b) => b[0] === fond.boite[0] && b[1] === fond.boite[1] && b[2] === fond.boite[2] && b[3] === fond.boite[3]) || [])[6] : 'herbe';
    const couleurFond = couleurMatiere(matFond || 'herbe');
    const couleurCible = cible.couleurs ? moyenne(Object.values(cible.couleurs)) : null;
    const contraste = couleurCible ? Math.max(0.06, Math.min(1, ecartCouleurs(couleurCible, couleurFond) * 2.4)) : 1; // pas peint : très visible
    const proche = 1 - d / 28;
    const bouge = cible.bouge ? 2.5 : 1;
    const pose = cible.pose === 3 ? 0.6 : cible.pose === 2 ? 0.8 : 1;
    let p = 1.6 * contraste * proche * proche * bouge * pose;
    if (d < 2.2) p = Math.max(p, 1.2); // il lui marche dessus
    return 1 - Math.exp(-p * dt);
  }

  chercheur(j, now, dt) {
    const s = this.salon;
    const b = j.bot;
    if (now < b.pauseJusqua) return;
    // On regarde autour 4 fois par seconde
    if (now >= b.prochainScan && !b.cible) {
      const pas = (now - (b.dernierScan || now)) / 1000 || 0.25;
      b.dernierScan = now;
      b.prochainScan = now + 250;
      const candidats = [];
      for (const c of s.joueurs.values()) {
        if (c.role !== 'cacheur') continue;
        const avant = b.vu.get(c.id);
        c.bouge = avant ? Math.hypot(c.x - avant[0], c.z - avant[1]) > 0.15 : false;
        b.vu.set(c.id, [c.x, c.z]);
        candidats.push({ x: c.x, y: c.y, z: c.z, pose: c.pose, couleurs: c.couleurs, bouge: c.bouge, joueur: c });
      }
      for (const l of s.leurres.values()) {
        const proprio = s.joueurs.get(l.owner);
        candidats.push({ x: l.p[0], y: l.p[1], z: l.p[2], pose: l.pose, couleurs: proprio ? proprio.couleurs : null, leurre: l });
      }
      for (const c of candidats) {
        if (Math.random() < this.chanceDeVoir(j, c, pas)) { b.cible = c; b.viseA = now + 450 + Math.random() * 500; break; }
      }
      // Parfois, il tire sur un truc louche… et se trompe (2 % par regard, s'il n'a rien vu)
      if (!b.cible && Math.random() < 0.02) {
        const a = j.yaw + (Math.random() - 0.5) * 0.8;
        b.cible = { x: j.x - Math.sin(a) * 6, y: j.y - 0.5, z: j.z - Math.cos(a) * 6, pose: 0, faux: true };
        b.viseA = now + 400;
      }
    }
    if (b.cible) {
      const c = b.cible;
      j.yaw = Math.atan2(-(c.x - j.x), -(c.z - j.z));
      if (now >= b.viseA) {
        // il tire : un peu de maladresse (15 % de tirs à côté)
        const oeil = [j.x, j.y + G.HAUTEUR_YEUX, j.z];
        const hauteur = c.pose === 3 ? 0.3 : c.pose === 2 ? 0.65 : 1.0;
        const v = [c.x - oeil[0], c.y + hauteur - oeil[1], c.z - oeil[2]];
        if (Math.random() < 0.15) { v[0] += (Math.random() - 0.5) * 2.2; v[1] += 0.8; v[2] += (Math.random() - 0.5) * 2.2; }
        const d = G.normaliser(v);
        j.pitch = d ? Math.asin(Math.max(-1, Math.min(1, d[1]))) : 0;
        j.bloqueJusqua = Math.min(j.bloqueJusqua, now); // (le serveur vérifie quand même la cadence et la pénalité)
        if (d && now >= j.bloqueJusqua) s.tir(j, { d });
        b.cible = null;
        b.pauseJusqua = now + 300;
      }
      return;
    }
    // Sinon, il fouille : d'une cachette à l'autre
    if (!b.chemin || b.etape >= b.chemin.length) {
      if (!b.cibles.length) b.cibles = this.pointsDeFouille();
      let essais = 0;
      while (b.cibles.length && essais++ < 6) {
        const p = b.cibles.shift();
        const ch = chemin(this.plan, [j.x, j.y, j.z], p);
        if (ch) { b.chemin = ch; b.etape = 0; break; }
      }
      if (!b.chemin || b.etape >= (b.chemin || []).length) { b.pauseJusqua = now + 500; return; }
    }
    this.avancer(j, dt, s.r.joueur.vitesse * 0.85);
  }
}

module.exports = { Bots, couleurMatiere, planDe, chemin };
