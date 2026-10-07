// Les bots : des adversaires joués par le serveur, pour s'entraîner quand on est seul
// dans la salle d'attente (bouton « S'entraîner en attendant »).
//
// Pour se déplacer, ils utilisent un plan de la carte calculé une seule fois par carte :
// une grille de cases de 50 cm où l'on note les endroits où l'on peut se tenir debout
// (le sol, le dessus des caisses, les étages...) et comment passer d'une case à l'autre
// (en marchant, en sautant ou en se laissant tomber). Ils y cherchent leur chemin (A*).
//
// Ils tirent avec les mêmes règles que les joueurs (Partie.tir) : le serveur reste l'arbitre.
// Ils ne visent que les joueurs qui sont vraiment en train de jouer (pas ceux qui sont dans un menu).
//
// Mode classé : ils complètent la partie (jusqu'à 6 joueurs) pendant toute la manche, et leur niveau (1 à 20)
// règle leur force : visée plus précise, réaction plus rapide, un peu plus rapides, et de meilleures armes.
const G = require('./geometrie');

const CASE = 0.5;          // taille d'une case du plan (m)
const RAYON = 0.3;         // demi-largeur d'un joueur (comme public/js/joueur.js)
const HAUTEUR = 1.8;
const MARCHE = 0.55;       // marche qu'on monte sans sauter
const SAUT_MAX = 1.25;     // hauteur qu'un bot accepte de sauter
const CHUTE_MAX = 10;      // hauteur dont il accepte de se laisser tomber (pas de dégâts de chute dans le jeu)
const NOMS = ['Cubo', 'Pixa', 'Bloxi', 'Nova', 'Turbo', 'Zigzag', 'Pépite', 'Rocky'];
const REGLAGES_DEFAUT = {
  nombre: 3, precisionDegres: 2.5, reactionMs: 450, fontDegats: true,
  armes: ['fusil', 'smg', 'rafale', 'pompe', 'precision'],
};
// Mode classé
const JOUEURS_CLASSE = 6;  // les bots complètent jusqu'à ce nombre de joueurs
const NIVEAU_MAX = 20;
// Armes principales des bots selon leur niveau (à partir du niveau indiqué)
const ARMES_PAR_NIVEAU = [
  [1, ['smg', 'pompe', 'rafale']],
  [5, ['fusil', 'smg', 'rafale', 'pompe']],
  [10, ['fusil', 'rafale', 'precision', 'mitrailleuse']],
  [16, ['fusil', 'precision', 'mitrailleuse', 'sniper']],
];

// Force des bots au niveau n (1 = facile, 20 = très fort)
function forceDuNiveau(n) {
  const k = Math.max(0, Math.min(NIVEAU_MAX, n) - 1);
  let armes = ARMES_PAR_NIVEAU[0][1];
  for (const [des, liste] of ARMES_PAR_NIVEAU) if (n >= des) armes = liste;
  return {
    precisionDegres: Math.max(0.6, 6 - 0.45 * k), // erreur de visée (degrés)
    reactionMs: Math.max(150, 700 - 45 * k),      // temps avant de tirer
    vitesse: 1 + (0.2 * k) / (NIVEAU_MAX - 1),     // jusqu'à 20 % plus rapides
    armes,
  };
}

const hasard = (a, b) => a + Math.random() * (b - a);
const angleVers = (dx, dz) => Math.atan2(-dx, -dz); // même convention que le jeu (yaw)
const ecartAngle = (a, b) => { let d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; };

// ---------- Index des boîtes : pour ne tester que celles qui sont proches ----------
class Index {
  constructor(boites, taille = 4) {
    this.taille = taille;
    this.cases = new Map();
    for (const b of boites) {
      for (let i = Math.floor(b[0] / taille); i <= Math.floor(b[3] / taille); i++) {
        for (let k = Math.floor(b[2] / taille); k <= Math.floor(b[5] / taille); k++) {
          const c = i * 100003 + k;
          if (!this.cases.has(c)) this.cases.set(c, []);
          this.cases.get(c).push(b);
        }
      }
    }
  }

  // Les boîtes autour du rectangle [x1, x2] × [z1, z2] (une boîte peut revenir plusieurs fois)
  pres(x1, z1, x2, z2) {
    const t = this.taille;
    const i1 = Math.floor(x1 / t); const i2 = Math.floor(x2 / t);
    const k1 = Math.floor(z1 / t); const k2 = Math.floor(z2 / t);
    if (i1 === i2 && k1 === k2) return this.cases.get(i1 * 100003 + k1) || [];
    const res = [];
    for (let i = i1; i <= i2; i++) for (let k = k1; k <= k2; k++) { const l = this.cases.get(i * 100003 + k); if (l) res.push(...l); }
    return res;
  }

  // Un joueur dont les pieds sont en (x, y, z) touche-t-il une boîte ? Renvoie la boîte.
  // marches = true : on ne compte pas une petite marche qui monte du sol (le joueur monte dessus tout seul).
  collision(x, y, z, marches = false) {
    for (const b of this.pres(x - RAYON, z - RAYON, x + RAYON, z + RAYON)) {
      if (marches && b[4] - y <= MARCHE && b[1] <= y) continue;
      if (x - RAYON < b[3] && x + RAYON > b[0] && y < b[4] && y + HAUTEUR > b[1] && z - RAYON < b[5] && z + RAYON > b[2]) return b;
    }
    return null;
  }
}

// ---------- Le plan de la carte ----------
const plans = new Map(); // carte -> plan (calculé une seule fois)

function planDe(carte) {
  const cle = `${carte.id}:${carte.boites.length}`;
  if (!plans.has(cle)) plans.set(cle, construirePlan(carte));
  return plans.get(cle);
}

function construirePlan(carte) {
  const T = carte.taille;
  const index = new Index(carte.boites);
  const n = Math.ceil((2 * T) / CASE);
  const eau = carte.eau ? carte.eau.niveau : null;
  const X = []; const Y = []; const Z = []; const caseDe = [];
  const parCase = new Array(n * n);
  // 1) Les endroits où l'on peut se tenir debout
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < n; k++) {
      const x = -T + (i + 0.5) * CASE; const z = -T + (k + 0.5) * CASE;
      const liste = [];
      for (const b of index.pres(x, z, x, z)) {
        if (x < b[0] || x > b[3] || z < b[2] || z > b[5]) continue;
        if (b[6] === 'trampoline' || b[6] === 'invisible' || b[4] > 13) continue;
        const h = b[4];
        if (liste.some((a) => Math.abs(Y[a] - h) < 0.05)) continue;
        if (index.collision(x, h + 0.02, z, true)) continue; // pas la place (mur, plafond trop bas)
        liste.push(X.length);
        X.push(x); Y.push(h); Z.push(z); caseDe.push(i * n + k);
      }
      parCase[i * n + k] = liste;
    }
  }
  // 2) Comment passer d'une case à sa voisine : [voisin, coût, type (0 marche, 1 saut, 2 chute)] à la suite
  const voisins = X.map(() => []);
  const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  const prochePlat = (c, ha, hb) => parCase[c].some((v) => Math.abs(Y[v] - ha) <= MARCHE || Math.abs(Y[v] - hb) <= MARCHE);
  for (let a = 0; a < X.length; a++) {
    const ci = Math.floor(caseDe[a] / n); const ck = caseDe[a] % n;
    for (const [di, dk] of DIRECTIONS) {
      const ni = ci + di; const nk = ck + dk;
      if (ni < 0 || nk < 0 || ni >= n || nk >= n) continue;
      for (const b of parCase[ni * n + nk]) {
        const dh = Y[b] - Y[a];
        if (dh > SAUT_MAX || dh < -CHUTE_MAX) continue;
        if (index.collision((X[a] + X[b]) / 2, Math.max(Y[a], Y[b]) + 0.02, (Z[a] + Z[b]) / 2, true)) continue;
        if (di && dk && (!prochePlat(ni * n + ck, Y[a], Y[b]) || !prochePlat(ci * n + nk, Y[a], Y[b]))) continue; // pas de coin coupé
        let type = 0;
        if (dh > MARCHE) {
          type = 1;
          if (index.collision(X[a], Y[a] + dh + 0.1, Z[a], true)) continue; // pas la place de sauter
        } else if (dh < -MARCHE) type = 2;
        let cout = Math.hypot(X[b] - X[a], Z[b] - Z[a]) + (type === 1 ? 1.2 : type === 2 ? 0.3 : 0);
        if (eau !== null && Y[b] < eau - 0.25) cout *= 2.5; // dans l'eau, on avance moins vite
        voisins[a].push(b, cout, type);
      }
    }
  }
  // 3) Les zones reliées entre elles (on ne cherche pas de chemin vers une zone inaccessible).
  // Un passage compte dans les deux sens ici (on peut sauter d'un toit sans pouvoir y remonter).
  const lies = X.map(() => []);
  for (let a = 0; a < X.length; a++) for (let m = 0; m < voisins[a].length; m += 3) { lies[a].push(voisins[a][m]); lies[voisins[a][m]].push(a); }
  const zone = new Int32Array(X.length).fill(-1);
  const taillesZones = [];
  for (let s = 0; s < X.length; s++) {
    if (zone[s] >= 0) continue;
    const z = taillesZones.length; let nb = 0;
    const pile = [s]; zone[s] = z;
    while (pile.length) {
      const a = pile.pop(); nb++;
      for (const b of lies[a]) if (zone[b] < 0) { zone[b] = z; pile.push(b); }
    }
    taillesZones.push(nb);
  }
  return {
    n, T, X, Y, Z, parCase, voisins, zone, taillesZones, index, eau,
    // pour la recherche de chemin (réutilisés d'une recherche à l'autre)
    g: new Float64Array(X.length), parent: new Int32Array(X.length), marque: new Int32Array(X.length), tour: 0,
  };
}

// Le point du plan le plus proche de (x, y, z) : de préférence le sol juste sous les pieds.
function noeudPres(plan, x, y, z, rayonCases = 3) {
  const ci = Math.floor((x + plan.T) / CASE); const ck = Math.floor((z + plan.T) / CASE);
  let meilleur = -1; let note = Infinity;
  for (let r = 0; r <= rayonCases && meilleur < 0; r++) {
    for (let i = ci - r; i <= ci + r; i++) {
      for (let k = ck - r; k <= ck + r; k++) {
        if (i < 0 || k < 0 || i >= plan.n || k >= plan.n) continue;
        for (const a of plan.parCase[i * plan.n + k]) {
          const dy = y - plan.Y[a];
          const s = Math.hypot(plan.X[a] - x, plan.Z[a] - z) + (dy < -0.6 ? 10 : Math.abs(dy) * 0.7);
          if (s < note) { note = s; meilleur = a; }
        }
      }
    }
  }
  return meilleur;
}

// Recherche du chemin le plus court (A*). Renvoie la liste des points, ou null.
function chercherChemin(plan, depart, arrivee, maxEtapes = 25000) {
  if (depart < 0 || arrivee < 0 || plan.zone[depart] !== plan.zone[arrivee]) return null;
  const { X, Y, Z, voisins, g, parent, marque } = plan;
  const tour = ++plan.tour;
  const ouverts = [[0, depart]]; // tas binaire [note, noeud]
  const pousser = (e) => {
    ouverts.push(e);
    let i = ouverts.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (ouverts[p][0] <= e[0]) break; ouverts[i] = ouverts[p]; i = p; }
    ouverts[i] = e;
  };
  const retirer = () => {
    const haut = ouverts[0]; const dernier = ouverts.pop();
    if (ouverts.length) {
      let i = 0;
      for (;;) {
        const a = 2 * i + 1; const b = a + 1; let m = i;
        if (a < ouverts.length && ouverts[a][0] < (m === i ? dernier[0] : ouverts[m][0])) m = a;
        if (b < ouverts.length && ouverts[b][0] < (m === i ? dernier[0] : ouverts[m][0])) m = b;
        if (m === i) break;
        ouverts[i] = ouverts[m]; i = m;
      }
      ouverts[i] = dernier;
    }
    return haut;
  };
  const h = (a) => Math.hypot(X[a] - X[arrivee], Y[a] - Y[arrivee], Z[a] - Z[arrivee]);
  marque[depart] = tour; g[depart] = 0; parent[depart] = -1;
  let etapes = 0;
  while (ouverts.length && etapes++ < maxEtapes) {
    const [note, a] = retirer();
    if (a === arrivee) {
      const res = [];
      for (let c = a; c >= 0; c = parent[c]) res.push(c);
      return res.reverse();
    }
    if (note - h(a) > g[a] + 1e-6) continue; // déjà vu avec un meilleur coût
    const v = voisins[a];
    for (let m = 0; m < v.length; m += 3) {
      const b = v[m]; const ng = g[a] + v[m + 1];
      if (marque[b] === tour && ng >= g[b]) continue;
      marque[b] = tour; g[b] = ng; parent[b] = a;
      pousser([ng + h(b), b]);
    }
  }
  return null;
}

// Type du passage de a vers b (0 marche, 1 saut, 2 chute)
function typePassage(plan, a, b) {
  const v = plan.voisins[a];
  for (let m = 0; m < v.length; m += 3) if (v[m] === b) return v[m + 2];
  return 0;
}

// Peut-on aller tout droit (en marchant) d'un point à un autre ? On suit la ligne sur le plan.
function toutDroit(plan, a, b) {
  const L = Math.hypot(plan.X[b] - plan.X[a], plan.Z[b] - plan.Z[a]);
  const pas = Math.max(1, Math.ceil(L / (CASE * 0.5)));
  let h = plan.Y[a];
  for (let s = 1; s <= pas; s++) {
    const k = s / pas;
    const x = plan.X[a] + (plan.X[b] - plan.X[a]) * k; const z = plan.Z[a] + (plan.Z[b] - plan.Z[a]) * k;
    const ci = Math.floor((x + plan.T) / CASE); const ck = Math.floor((z + plan.T) / CASE);
    if (ci < 0 || ck < 0 || ci >= plan.n || ck >= plan.n) return false;
    const ici = plan.parCase[ci * plan.n + ck].find((c) => Math.abs(plan.Y[c] - h) <= MARCHE);
    if (ici === undefined) return false;
    h = plan.Y[ici];
  }
  return Math.abs(h - plan.Y[b]) <= MARCHE;
}

// Chemin simplifié : on saute les points intermédiaires quand on peut aller tout droit.
function lisserChemin(plan, chemin) {
  const res = [chemin[0]];
  let i = 0;
  while (i < chemin.length - 1) {
    let j = i + 1;
    // un saut ou une chute : on garde ce passage tel quel
    if (typePassage(plan, chemin[i], chemin[i + 1]) === 0) {
      for (let k = Math.min(chemin.length - 1, i + 14); k > i + 1; k--) {
        let plat = true;
        for (let m = i; m < k; m++) if (typePassage(plan, chemin[m], chemin[m + 1]) !== 0) { plat = false; break; }
        if (plat && toutDroit(plan, chemin[i], chemin[k])) { j = k; break; }
      }
    }
    res.push(chemin[j]);
    i = j;
  }
  return res;
}

// ---------- Déplacement d'un bot (la même physique que les joueurs, en plus simple) ----------
function deplacerAxe(plan, j, b, axe, delta, peutMonter) {
  if (delta === 0) return;
  if (axe === 0) j.x += delta; else if (axe === 1) j.y += delta; else j.z += delta;
  for (let essai = 0; essai < 4; essai++) {
    const boite = plan.index.collision(j.x, j.y, j.z);
    if (!boite) return;
    if (axe === 1) {
      if (delta < 0) { j.y = boite[4]; b.vit[1] = 0; b.auSol = true; b.solSous = boite; } else { j.y = boite[1] - HAUTEUR - 0.001; b.vit[1] = 0; }
      return;
    }
    if (peutMonter && boite[4] - j.y <= MARCHE && boite[4] - j.y > 0 && !plan.index.collision(j.x, boite[4] + 0.001, j.z)) {
      j.y = boite[4] + 0.001;
      return;
    }
    if (axe === 0) { j.x = delta > 0 ? boite[0] - RAYON - 0.001 : boite[3] + RAYON + 0.001; b.vit[0] = 0; } else { j.z = delta > 0 ? boite[2] - RAYON - 0.001 : boite[5] + RAYON + 0.001; b.vit[2] = 0; }
    b.bloque = true;
  }
}

function physique(plan, j, b, dt, reglages) {
  const eau = plan.eau !== null && j.y < plan.eau - 0.25;
  const vMax = reglages.joueur.vitesse * b.vitesse * (eau ? 0.62 : 1);
  const vx = b.dir[0] * vMax; const vz = b.dir[1] * vMax;
  b.bloque = false;
  let reste = Math.min(dt, 0.1);
  while (reste > 0) {
    const h = Math.min(reste, 1 / 60);
    reste -= h;
    const accel = (b.auSol ? 60 : 14) * h;
    b.vit[0] += Math.max(-accel, Math.min(accel, vx - b.vit[0]));
    b.vit[2] += Math.max(-accel, Math.min(accel, vz - b.vit[2]));
    if (b.auSol && b.sauter) { b.vit[1] = reglages.joueur.forceSaut; b.auSol = false; b.sauter = false; }
    if (b.auSol && b.solSous && b.solSous[6] === 'trampoline') { b.vit[1] = reglages.joueur.forceTrampoline; b.auSol = false; }
    b.vit[1] -= reglages.joueur.gravite * h;
    const etaitAuSol = b.auSol;
    b.auSol = false;
    deplacerAxe(plan, j, b, 0, b.vit[0] * h, etaitAuSol);
    deplacerAxe(plan, j, b, 2, b.vit[2] * h, etaitAuSol);
    deplacerAxe(plan, j, b, 1, b.vit[1] * h, false);
  }
}

// ---------- Les bots d'une partie ----------
class Bots {
  constructor(partie) {
    this.partie = partie;
    this.r = { ...REGLAGES_DEFAUT, ...(partie.r.bots || {}) };
    this.plan = null;
    this.suivant = 0;            // pour donner un numéro à chaque bot
    this.dernierAjout = 0;
    this.dernierJoueurActif = 0;
    this.niveau = 0;             // classé : niveau actuel des bots (0 = pas encore calculé)
    this.boost = 1;              // classé : vitesse en plus
  }

  // Classé : niveau effectif = niveau de la partie + 1 tous les 3 éliminations du meilleur vrai joueur (max 20).
  niveauEffectif() {
    const p = this.partie;
    let meilleur = 0;
    for (const j of p.joueurs.values()) if (!j.bot && j.kills > meilleur) meilleur = j.kills;
    return Math.min(NIVEAU_MAX, p.niveau + Math.floor(meilleur / 3));
  }

  // Classé : applique le niveau (tout de suite pour la visée et la réaction, à la prochaine apparition pour les armes).
  majNiveau() {
    const p = this.partie;
    const n = this.niveauEffectif();
    if (n === this.niveau) return;
    const monte = this.niveau > 0 && n > this.niveau;
    this.niveau = n;
    const f = forceDuNiveau(n);
    this.r.precisionDegres = f.precisionDegres;
    this.r.reactionMs = f.reactionMs;
    this.r.armes = f.armes;
    this.boost = f.vitesse;
    for (const j of this.liste()) {
      const eq = this.equipementBot();
      if (eq && j.vivant) j.prochainEquipement = eq; else if (eq) j.equipement = eq;
    }
    if (monte && p.etat === 'jeu') p.diffuser({ t: 'niveauBots', n });
  }

  // 4 armes d'un bot : une arme principale au hasard parmi celles de son niveau
  equipementBot() {
    const p = this.partie;
    const armes = this.r.armes.filter((id) => p.indexArme.has(id));
    const arme = armes[Math.floor(Math.random() * armes.length)] || 'fusil';
    return p.validerEquipement({ principale: arme, secondaire: 'pistolet', melee: 'couteau', gadget: 'grenade' }) || p.equipementDefaut;
  }

  liste() { return [...this.partie.joueurs.values()].filter((j) => j.bot); }

  // Un joueur humain est-il en train de jouer (pas dans un menu, et il a bougé récemment) ?
  actif(j, now) { return !j.bot && j.vivant && j.actif && now - j.derniereMaj < 3000; }

  // Appelé à chaque tour pendant la salle d'attente (et pendant la manche en classé) : ajoute ou retire des bots.
  gerer(now, dt) {
    const p = this.partie;
    const humains = [...p.joueurs.values()].filter((j) => !j.bot);
    if (humains.some((j) => this.actif(j, now))) this.dernierJoueurActif = now;
    const bots = this.liste();
    let voulu;
    if (p.mode === 'classe') {
      // Classé : les bots complètent la partie tant qu'il y a un vrai joueur (+ ceux ajoutés ou enlevés par l'admin).
      this.majNiveau();
      const complet = Math.min(p.max, JOUEURS_CLASSE) - humains.length + (p.botsBonus || 0);
      voulu = humains.length ? Math.max(0, Math.min(complet, p.max - humains.length)) : 0;
    } else {
      // Nombre de bots voulus : propre à la carte (les cartes XXL en ont plus), sans dépasser la partie.
      // Personne ne s'entraîne depuis 30 s : les bots s'en vont.
      const voulusCarte = Math.max(0, (p.carte.botsMax || this.r.nombre) + (p.botsBonus || 0)); // (+ ceux ajoutés par l'admin)
      voulu = now - this.dernierJoueurActif < 30000
        ? Math.max(0, Math.min(voulusCarte, p.max - humains.length)) : 0;
    }
    if (bots.length > voulu) this.retirer(bots[bots.length - 1]);
    else if (bots.length < voulu && now - this.dernierAjout > 800) { this.dernierAjout = now; this.ajouter(); }
    for (const j of this.liste()) this.penser(j, now, dt);
  }

  ajouter() {
    const p = this.partie;
    if (!this.plan) this.plan = planDe(p.carte);
    this.suivant++;
    const pris = new Set(this.liste().map((j) => j.nom));
    const nom = `Bot ${NOMS.find((x) => !pris.has(`Bot ${x}`)) || this.suivant}`;
    const j = p.creerJoueur({ id: -this.suivant, nom, ws: { readyState: 3, send() {} }, style: null, bot: true });
    j.equipement = this.equipementBot();
    j.actif = true;
    j.bot = {
      vit: [0, 0, 0], auSol: false, solSous: null, dir: [0, 0], vitesse: 1, sauter: false, bloque: false,
      cible: null, vuDepuis: 0, reactionA: 0, derniereVue: null, derniereVueA: 0,
      chemin: null, etape: 0, but: -1, prochainChemin: 0, coince: 0, dernierePos: [0, 0, 0], derniereVerif: 0,
      lateral: 0, prochainLateral: 0, rafaleJusqua: 0, pauseJusqua: 0, attaquant: null, attaqueA: 0,
    };
    p.joueurs.set(j.id, j);
    p.diffuser({ t: 'entree', joueur: p.infosPubliques(j) });
    p.apparaitre(j);
  }

  retirer(j) {
    const p = this.partie;
    p.joueurs.delete(j.id);
    p.diffuser({ t: 'sortie', id: j.id });
  }

  toutRetirer() { for (const j of this.liste()) this.retirer(j); }

  // Un bot vient d'être touché : il se tourne vers celui qui lui tire dessus.
  touche(bot, tireur) {
    if (!bot.bot || !tireur || tireur === bot) return;
    bot.bot.attaquant = tireur;
    bot.bot.attaqueA = Date.now();
  }

  // ---------- Le « cerveau » d'un bot ----------
  penser(j, now, dt) {
    const b = j.bot;
    const p = this.partie;
    if (!j.vivant) { b.cible = null; b.chemin = null; return; }
    const plan = this.plan;
    const oeil = [j.x, j.y + G.HAUTEUR_YEUX, j.z];

    // 1) Qui voit-il ? (les joueurs en train de jouer et les autres bots, pas ses coéquipiers)
    const visibles = [];
    for (const e of p.joueurs.values()) {
      if (e === j || !e.vivant) continue;
      if (!e.bot && !this.actif(e, now)) continue;
      if (p.mode === 'equipes' && e.equipe === j.equipe) continue;
      const vise = [e.x, e.y + 1.2, e.z];
      const v = [vise[0] - oeil[0], vise[1] - oeil[1], vise[2] - oeil[2]];
      const dist = Math.hypot(v[0], v[1], v[2]);
      if (dist > 70) continue;
      const devant = Math.abs(ecartAngle(j.yaw, angleVers(v[0], v[2]))) < 1.1 || dist < 8 || e === b.cible || e === b.attaquant;
      if (!devant) continue;
      if (G.rayonCarte(oeil, G.normaliser(v), p.boites, dist) < dist - 0.4) continue; // un mur entre les deux
      visibles.push({ e, dist, note: dist * (e.bot ? 1.6 : 1) }); // il préfère les vrais joueurs
    }
    // Celui qui vient de lui tirer dessus, sinon le plus proche
    let cible = null;
    const attaquant = now - b.attaqueA < 2500 ? visibles.find((x) => x.e === b.attaquant) : null;
    const actuelle = visibles.find((x) => x.e === b.cible);
    if (attaquant) cible = attaquant;
    else if (actuelle) cible = actuelle;
    else if (visibles.length) cible = visibles.sort((x, y) => x.note - y.note)[0];
    if (cible && cible.e !== b.cible) {
      b.cible = cible.e;
      b.vuDepuis = now;
      b.reactionA = now + this.r.reactionMs * hasard(0.7, 1.4); // temps de réaction
    }
    if (!cible) b.cible = null;

    // 2) Viser et tirer
    if (cible) {
      const e = cible.e;
      b.derniereVue = [e.x, e.y, e.z];
      b.derniereVueA = now;
      const vise = [e.x, e.y + (Math.random() < 0.15 ? 1.65 : 1.1), e.z];
      const dx = vise[0] - oeil[0]; const dy = vise[1] - oeil[1]; const dz = vise[2] - oeil[2];
      const yaw = angleVers(dx, dz);
      const pitch = Math.atan2(dy, Math.hypot(dx, dz));
      const tourne = 7 * dt; // il ne se retourne pas instantanément
      j.yaw += Math.max(-tourne, Math.min(tourne, ecartAngle(j.yaw, yaw)));
      j.pitch += Math.max(-tourne, Math.min(tourne, pitch - j.pitch));
      this.combattre(j, e, cible.dist, oeil, now, Math.abs(ecartAngle(j.yaw, yaw)) + Math.abs(pitch - j.pitch));
    } else {
      j.visee = false;
      if (j.arme !== j.equipement[0] && !j.rechargeA) p.changerArme(j, { a: j.equipement[0] });
      // Pas d'ennemi en vue : il recharge tranquillement
      const arme = p.armes[j.arme];
      if (arme.chargeur && j.munitions[j.arme] < arme.chargeur * 0.5) p.commencerRecharge(j);
    }

    // 3) Se déplacer
    this.choisirDeplacement(j, cible, now);
    b.vitesse *= this.boost; // (classé : plus rapides aux niveaux élevés)
    physique(plan, j, b, dt, p.r);
    if (j.y < -4) { p.apparaitre(j); b.chemin = null; return; } // tombé dans le vide : on le replace
    // Coincé ? (il n'avance plus) : il saute, puis il change de chemin
    if (now - b.derniereVerif > 600) {
      const bouge = Math.hypot(j.x - b.dernierePos[0], j.z - b.dernierePos[2]);
      const veutBouger = Math.hypot(b.dir[0], b.dir[1]) > 0.3;
      if (veutBouger && bouge < 0.35) {
        b.coince++;
        if (b.auSol) b.sauter = true;
        if (b.coince >= 3) { b.chemin = null; b.but = -1; b.coince = 0; }
      } else b.coince = 0;
      b.dernierePos = [j.x, j.y, j.z];
      b.derniereVerif = now;
    }
    if (!cible) {
      // regarde là où il va
      const v = Math.hypot(b.vit[0], b.vit[2]);
      if (v > 1) {
        const yaw = angleVers(b.vit[0], b.vit[2]);
        j.yaw += Math.max(-4 * dt, Math.min(4 * dt, ecartAngle(j.yaw, yaw)));
        j.pitch *= 0.9;
      }
    }
    j.yaw %= Math.PI * 2;
    j.derniereMaj = now;
    p.memoriser(j, now);
  }

  combattre(j, e, dist, oeil, now, erreurVisee) {
    const p = this.partie;
    const b = j.bot;
    const couteau = j.equipement[2];
    // Tout près : coup de couteau ; plus loin : son arme principale
    if (dist < 2.2 && j.arme !== couteau && p.armes[j.arme].id !== 'pompe') p.changerArme(j, { a: couteau });
    else if (dist > 4 && j.arme === couteau) p.changerArme(j, { a: j.equipement[0] });
    const arme = p.armes[j.arme];
    j.visee = arme.type !== 'melee' && dist > 15;
    if (now < b.reactionA || erreurVisee > 0.25 || dist > arme.portee) return;
    // Armes automatiques : des rafales, avec de petites pauses
    if (arme.automatique) {
      if (now < b.pauseJusqua) return;
      if (now > b.rafaleJusqua) {
        if (b.rafaleJusqua && now < b.rafaleJusqua + 100) return;
        b.rafaleJusqua = now + hasard(400, 1000);
        b.pauseJusqua = b.rafaleJusqua + hasard(250, 650);
      }
    } else if (now - j.dernierTir[j.arme] < arme.cadenceMs + hasard(0, 220)) return;
    // Précision : moins bonne au début, puis il s'ajuste ; moins bonne en bougeant
    const suivi = Math.min(1, (now - b.vuDepuis) / 1500);
    const enMouvement = Math.hypot(b.vit[0], b.vit[2]) > 2 ? 1.2 : 0;
    const erreur = ((this.r.precisionDegres + enMouvement + (1 - suivi) * 3) * Math.PI) / 180;
    const vers = [e.x - oeil[0], e.y + (Math.random() < 0.2 ? 1.6 : 1.05) - oeil[1], e.z - oeil[2]];
    let d = G.normaliser(vers);
    if (!d) return;
    const a = Math.random() * Math.PI * 2; const r = erreur * Math.sqrt(Math.random());
    // petit décalage aléatoire dans un cône autour de la bonne direction
    const u = Math.abs(d[1]) < 0.99 ? G.normaliser([-d[2], 0, d[0]]) : [1, 0, 0];
    const w = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]];
    d = G.normaliser([d[0] + (u[0] * Math.cos(a) + w[0] * Math.sin(a)) * r, d[1] + (u[1] * Math.cos(a) + w[1] * Math.sin(a)) * r, d[2] + (u[2] * Math.cos(a) + w[2] * Math.sin(a)) * r]);
    const dispersion = arme.dispersion ? (j.visee ? arme.dispersion.visee : arme.dispersion.hanche) : 0;
    p.tir(j, { a: j.arme, o: oeil, d, e: dispersion, s: Math.floor(Math.random() * 4294967296), v: 0 });
  }

  choisirDeplacement(j, cible, now) {
    const b = j.bot;
    const plan = this.plan;
    const p = this.partie;
    b.vitesse = 1;
    if (cible) {
      // Au combat : il garde une bonne distance et se décale sur les côtés
      const e = cible.e;
      const arme = p.armes[j.arme];
      const ideal = arme.type === 'melee' ? 0 : arme.id === 'pompe' ? 6 : arme.id === 'precision' ? 22 : 12;
      if (now > b.prochainLateral) { b.lateral = [-1, 0, 1][Math.floor(Math.random() * 3)]; b.prochainLateral = now + hasard(500, 1400); }
      const dx = e.x - j.x; const dz = e.z - j.z;
      const L = Math.hypot(dx, dz) || 1;
      let avant = cible.dist > ideal + 4 ? 1 : cible.dist < ideal - 3 ? -0.7 : 0;
      if (arme.type === 'melee') avant = 1;
      let mx = (dx / L) * avant + (-dz / L) * b.lateral * 0.8;
      let mz = (dz / L) * avant + (dx / L) * b.lateral * 0.8;
      // pas de pas de côté dans le vide : on vérifie qu'il y a du sol par là
      const m = Math.hypot(mx, mz);
      if (m > 0.01) {
        mx /= m; mz /= m;
        const ici = noeudPres(plan, j.x, j.y, j.z, 1);
        const la = noeudPres(plan, j.x + mx * 1.2, j.y, j.z + mz * 1.2, 0);
        if (la < 0 || ici < 0 || plan.Y[la] < plan.Y[ici] - MARCHE || plan.Y[la] > plan.Y[ici] + MARCHE) {
          b.lateral = -b.lateral; mx = 0; mz = 0;
        }
      }
      // trop loin ou caché : il suit un chemin vers lui
      if (avant > 0 && cible.dist > ideal + 4 && arme.type !== 'melee') { b.vitesse = 0.85; this.suivreChemin(j, noeudPres(plan, e.x, e.y, e.z), now); return; }
      b.dir = [mx, mz];
      b.vitesse = 0.8;
      b.chemin = null;
      return;
    }
    // Pas d'ennemi en vue : il va là où il a vu quelqu'un, ou il part chercher les joueurs
    if (b.derniereVue && now - b.derniereVueA < 6000) {
      const but = noeudPres(plan, b.derniereVue[0], b.derniereVue[1], b.derniereVue[2]);
      if (Math.hypot(j.x - b.derniereVue[0], j.z - b.derniereVue[2]) < 1.5) b.derniereVue = null;
      else { this.suivreChemin(j, but, now); return; }
    }
    if (now < (b.attenteChemin || 0)) { b.dir = [0, 0]; return; } // pas de chemin trouvé : il attend un peu
    if (b.but < 0 || !b.chemin) {
      const actifs = [...p.joueurs.values()].filter((x) => this.actif(x, now) && !(p.mode === 'equipes' && x.equipe === j.equipe));
      let but = -1;
      const ici = noeudPres(plan, j.x, j.y, j.z);
      for (let essai = 0; essai < 6 && but < 0; essai++) {
        let x; let y; let z;
        if (actifs.length && Math.random() < 0.7) {
          // il se dirige vers un joueur (à peu près : il ne triche pas en sachant où il est exactement)
          const h = actifs[Math.floor(Math.random() * actifs.length)];
          x = h.x + hasard(-8, 8); y = h.y; z = h.z + hasard(-8, 8);
        } else {
          const s = p.carte.apparitions[Math.floor(Math.random() * p.carte.apparitions.length)];
          x = s.x; y = s.y || 0; z = s.z;
        }
        const n = noeudPres(plan, x, y, z, 4);
        if (n >= 0 && ici >= 0 && plan.zone[n] === plan.zone[ici]) but = n;
      }
      b.but = but;
      b.chemin = null;
    }
    this.suivreChemin(j, b.but, now);
  }

  // Suit (ou calcule) un chemin vers le point du plan « but »
  suivreChemin(j, but, now) {
    const b = j.bot;
    const plan = this.plan;
    if (but < 0) { b.dir = [0, 0]; return; }
    if (!b.chemin || b.cheminVers !== but || now > b.prochainChemin) {
      const depart = noeudPres(plan, j.x, j.y, j.z);
      const c = chercherChemin(plan, depart, but);
      b.chemin = c ? lisserChemin(plan, c) : null;
      b.cheminVers = but;
      b.etape = 1;
      b.prochainChemin = now + 2000; // on recalcule de temps en temps (la cible bouge)
      if (!b.chemin) { b.but = -1; b.dir = [0, 0]; b.attenteChemin = now + 1000; return; }
    }
    const ch = b.chemin;
    // point suivant atteint ?
    while (b.etape < ch.length) {
      const n = ch[b.etape];
      if (Math.hypot(plan.X[n] - j.x, plan.Z[n] - j.z) < 0.45 && Math.abs(plan.Y[n] - j.y) < 1.3) b.etape++;
      else break;
    }
    if (b.etape >= ch.length) { b.chemin = null; b.but = -1; b.dir = [0, 0]; return; }
    const n = ch[b.etape];
    const dx = plan.X[n] - j.x; const dz = plan.Z[n] - j.z;
    const L = Math.hypot(dx, dz) || 1;
    b.dir = [dx / L, dz / L];
    // marche trop haute devant : il saute
    if (plan.Y[n] - j.y > MARCHE && L < 1.3 && b.auSol) b.sauter = true;
  }
}

module.exports = { Bots, planDe, noeudPres, chercherChemin, lisserChemin, physique, Index };
