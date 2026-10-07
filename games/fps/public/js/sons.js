// Sons du jeu.
// Les vrais sons sont dans le dossier public/sons/ (fichiers .mp3, voir sons/LICENCES.md).
// Si un fichier manque, on fabrique un son de remplacement avec le navigateur.
// Les sons des autres joueurs sont placés en 3D : on entend d'où vient un tir.
// Les sons envoyés par l'admin dans l'atelier s'appellent « perso:<identifiant> » : ils sont
// téléchargés seulement quand on en a besoin (chargerSon / prechargerSons).
let ctx = null;
let sortie = null;      // volume général des effets
let sortieMusique = null;
let volume = 0.6;
let volumeMusique = 0.35;
const tampons = {};     // nom -> AudioBuffer
let musique = null;

const FICHIERS = [
  'smg_tir', 'fusil_tir', 'pompe_tir', 'pompe_armement', 'sniper_tir', 'sniper_culasse', 'roquette_tir', 'explosion',
  'chargeur_retire', 'chargeur_insere', 'cartouche_insere', 'arme_sortir', 'vide', 'douille', 'impact_mur',
  'touche', 'tete', 'elimination', 'degats', 'pas_1', 'pas_2', 'pas_3', 'pas_4', 'saut', 'atterrissage',
  'trampoline', 'eau', 'pouf', 'apparition', 'clic', 'victoire', 'musique_menu',
  // nouvelles armes et gadgets
  'revolver_tir', 'pistolet_tir', 'uzi_tir', 'mitrailleuse_tir', 'rafale_tir', 'precision_tir', 'canon_scie_tir',
  'arbalete_tir', 'carreau_impact', 'lance_fusee_tir', 'fusee_brule', 'revolver_recharge',
  'couteau_coup', 'couteau_touche', 'batte_coup', 'batte_touche', 'poele_touche', 'dos_special',
  'grenade_goupille', 'grenade_lancer', 'grenade_rebond', 'fumigene', 'grappin_tir', 'grappin_accroche', 'grappin_corde',
  'soin', 'soin_fini', 'eblouissement', 'lobby_pret', 'lobby_depart',
];
// Si un fichier manque, on utilise un son qui y ressemble.
const SECOURS = {
  revolver_tir: 'sniper_tir', pistolet_tir: 'smg_tir', uzi_tir: 'smg_tir', mitrailleuse_tir: 'fusil_tir', rafale_tir: 'fusil_tir',
  precision_tir: 'sniper_tir', canon_scie_tir: 'pompe_tir', lance_fusee_tir: 'roquette_tir', revolver_recharge: 'chargeur_insere',
  carreau_impact: 'impact_mur', batte_touche: 'degats', couteau_touche: 'touche', poele_touche: 'impact_mur', dos_special: 'elimination',
  grenade_rebond: 'douille', grenade_goupille: 'vide', grappin_accroche: 'impact_mur', soin_fini: 'apparition', lobby_depart: 'victoire',
  // nouvelles armes (le son d'une arme proche, un peu plus aigu ou plus grave : voir TONS)
  pompe_auto_tir: 'pompe_tir', double_canon_tir: 'canon_scie_tir', vector_tir: 'smg_tir', bullpup_tir: 'rafale_tir',
  lance_grenades_tir: 'roquette_tir', anti_materiel_tir: 'sniper_tir', cloueuse_tir: 'arbalete_tir',
  pistolet_lourd_tir: 'revolver_tir', pistolet_auto_tir: 'pistolet_tir', mini_arbalete_tir: 'arbalete_tir',
  minigun_tir: 'smg_tir', feu_artifice_tir: 'lance_fusee_tir',
};
// Hauteur de base (vitesse de lecture) des sons empruntés à une autre arme
const TONS = {
  pompe_auto_tir: 1.12, double_canon_tir: 0.88, vector_tir: 1.22, bullpup_tir: 0.94, lance_grenades_tir: 0.78, anti_materiel_tir: 0.7,
  cloueuse_tir: 1.45, pistolet_lourd_tir: 0.86, pistolet_auto_tir: 1.15, mini_arbalete_tir: 1.25, minigun_tir: 1.3, feu_artifice_tir: 1.25,
};

export function initSons(v, vm) {
  if (v !== undefined) volume = v;
  if (vm !== undefined) volumeMusique = vm;
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  sortie = ctx.createGain();
  sortie.gain.value = volume;
  // Un "compresseur" évite que plusieurs tirs en même temps saturent.
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.ratio.value = 4;
  sortie.connect(comp).connect(ctx.destination);
  sortieMusique = ctx.createGain();
  sortieMusique.gain.value = volumeMusique;
  sortieMusique.connect(ctx.destination);
  for (const nom of enAttente) chargerSon(nom);
  enAttente.clear();
  for (const nom of FICHIERS) {
    fetch(`sons/${nom}.mp3`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('absent'))))
      .then((b) => ctx.decodeAudioData(b))
      .then((t) => { tampons[nom] = t; if (nom === 'musique_menu' && musique === 'attente') lancerMusique(); })
      .catch(() => { /* pas de fichier : son de remplacement */ });
  }
}

export function reglerVolume(v) {
  volume = v;
  if (sortie) sortie.gain.value = v;
}
export function reglerMusique(v) {
  volumeMusique = v;
  if (sortieMusique) sortieMusique.gain.setTargetAtTime(v, ctx.currentTime, 0.1);
}

// L'oreille du joueur suit la caméra (pour les sons en 3D).
const _avant = { x: 0, y: 0, z: -1 };
export function majAuditeur(camera) {
  if (!ctx) return;
  const l = ctx.listener;
  const p = camera.position;
  const e = camera.matrixWorld.elements;
  _avant.x = -e[8]; _avant.y = -e[9]; _avant.z = -e[10];
  if (l.positionX) {
    const t = ctx.currentTime;
    l.positionX.setValueAtTime(p.x, t); l.positionY.setValueAtTime(p.y, t); l.positionZ.setValueAtTime(p.z, t);
    l.forwardX.setValueAtTime(_avant.x, t); l.forwardY.setValueAtTime(_avant.y, t); l.forwardZ.setValueAtTime(_avant.z, t);
    l.upX.setValueAtTime(e[4], t); l.upY.setValueAtTime(e[5], t); l.upZ.setValueAtTime(e[6], t);
  } else {
    l.setPosition(p.x, p.y, p.z);
    l.setOrientation(_avant.x, _avant.y, _avant.z, e[4], e[5], e[6]);
  }
}

// Volume propre à chaque son (1 = normal). Pour qu'un son soit moins fort, baisse son nombre ici.
const VOLUMES = {
  fusil_tir: 0.45,   // le fusil d'assaut était trop fort
  mitrailleuse_tir: 0.55,
  rafale_tir: 0.55,
  fumigene: 0.6,
  eblouissement: 0.5,
  vector_tir: 0.8, bullpup_tir: 0.55, minigun_tir: 0.45, pistolet_auto_tir: 0.8, cloueuse_tir: 0.8, anti_materiel_tir: 1.1,
};

// Son placé en 3D (on entend d'où il vient)
function spatialiser(g, position, portee) {
  const p = ctx.createPanner();
  p.panningModel = 'HRTF';
  p.distanceModel = 'inverse';
  p.refDistance = 4 * portee;
  p.rolloffFactor = 1.1;
  p.maxDistance = 400;
  if (p.positionX) { p.positionX.value = position.x; p.positionY.value = position.y; p.positionZ.value = position.z; } else p.setPosition(position.x, position.y, position.z);
  g.connect(p);
  return p;
}

// Joue un fichier son. options : volume, variation (de la hauteur), position (Vector3 → son 3D), delai (s)
export function jouer(nom, { vol = 1, variation = 0.06, position = null, delai = 0, portee = 1 } = {}) {
  if (!ctx) return false;
  const t = tampons[nom] || tampons[SECOURS[nom]];
  if (!t) {
    if (nom.startsWith('perso:')) chargerSon(nom); // la prochaine fois, il sera prêt
    return false;
  }
  const s = ctx.createBufferSource();
  s.buffer = t;
  s.playbackRate.value = (TONS[nom] || 1) * (1 + (Math.random() * 2 - 1) * variation);
  const g = ctx.createGain();
  g.gain.value = vol * (VOLUMES[nom] ?? 1);
  const fin = position ? spatialiser(g, position, portee) : g;
  s.connect(g);
  fin.connect(sortie);
  s.start(ctx.currentTime + delai);
  actifs.add(s);
  s.onended = () => actifs.delete(s);
  return true;
}

// Coupe tous les sons en train de jouer (bouton pause de l'atelier)
const actifs = new Set();
export function couperSons() {
  for (const s of actifs) { try { s.stop(); } catch { /* déjà fini */ } }
  actifs.clear();
}

// ---------- Sons envoyés par l'admin (« perso:<identifiant> ») ----------
const chargements = {};
const enAttente = new Set(); // demandés avant que le son du navigateur soit prêt
export function chargerSon(nom) {
  if (tampons[nom]) return Promise.resolve(true);
  if (!nom.startsWith('perso:')) return Promise.resolve(false);
  if (!ctx) { enAttente.add(nom); return Promise.resolve(false); }
  if (!chargements[nom]) {
    chargements[nom] = fetch(`api/sons/${encodeURIComponent(nom.slice(6))}`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('absent'))))
      .then((b) => ctx.decodeAudioData(b))
      .then((t) => { tampons[nom] = t; return true; })
      .catch(() => { delete chargements[nom]; return false; });
  }
  return chargements[nom];
}
export function prechargerSons(noms) { for (const n of noms) if (n && n.startsWith('perso:')) chargerSon(n); }

// Musique qui tourne en boucle (danses). depuis = où commencer (s). Renvoie { arreter() }.
export function jouerEnBoucle(nom, { vol = 1, position = null, portee = 1, depuis = 0 } = {}) {
  let source = null;
  let fini = false;
  let panneau = null;
  const demande = performance.now();
  chargerSon(nom).then(() => {
    const t = tampons[nom];
    if (fini || !ctx || !t) return;
    source = ctx.createBufferSource();
    source.buffer = t;
    source.loop = true;
    const g = ctx.createGain();
    g.gain.value = vol;
    const fin = position ? spatialiser(g, position, portee) : g;
    if (position) panneau = fin;
    source.connect(g);
    fin.connect(sortie);
    // si le téléchargement a pris du temps, on démarre là où la musique devrait en être
    source.start(0, (depuis + (performance.now() - demande) / 1000) % t.duration);
  });
  return {
    arreter() {
      fini = true;
      if (source) { try { source.stop(); } catch { /* déjà arrêtée */ } source = null; }
    },
    // le danseur bouge : la musique vient de là où il est
    placer(p) {
      if (!panneau) return;
      if (panneau.positionX) { panneau.positionX.value = p.x; panneau.positionY.value = p.y; panneau.positionZ.value = p.z; } else panneau.setPosition(p.x, p.y, p.z);
    },
  };
}

// ---------- Sons de remplacement (si un fichier manque) ----------
function note({ type = 'square', de = 440, a = 440, duree = 0.1, vol = 0.2, delai = 0, dest = null }) {
  if (!ctx) return;
  const t = ctx.currentTime + delai;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(de, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, a), t + duree);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  o.connect(g).connect(dest || sortie);
  o.start(t);
  o.stop(t + duree + 0.02);
}
let bruitBlanc = null;
function bruit({ duree = 0.15, vol = 0.2, freq = 1200, q = 1, delai = 0, dest = null }) {
  if (!ctx) return;
  if (!bruitBlanc) {
    bruitBlanc = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = bruitBlanc.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = ctx.currentTime + delai;
  const s = ctx.createBufferSource();
  s.buffer = bruitBlanc;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  s.connect(f).connect(g).connect(dest || sortie);
  s.start(t, Math.random() * 0.5);
  s.stop(t + duree + 0.02);
}
// Sortie d'un son fabriqué : en 3D s'il a une position (options de son())
function destination({ position = null, portee = 1, vol = 1 } = {}) {
  const g = ctx.createGain();
  g.gain.value = vol;
  if (position) spatialiser(g, position, portee).connect(sortie); else g.connect(sortie);
  return g;
}
const REMPLACEMENT = {
  smg_tir: () => { bruit({ duree: 0.08, vol: 0.35, freq: 1800, q: 0.6 }); note({ type: 'square', de: 300, a: 80, duree: 0.06, vol: 0.1 }); },
  fusil_tir: () => { bruit({ duree: 0.12, vol: 0.4, freq: 1200, q: 0.5 }); note({ type: 'square', de: 220, a: 60, duree: 0.08, vol: 0.12 }); },
  pompe_tir: () => { bruit({ duree: 0.3, vol: 0.5, freq: 700, q: 0.4 }); note({ type: 'sawtooth', de: 150, a: 40, duree: 0.2, vol: 0.15 }); },
  sniper_tir: () => { bruit({ duree: 0.5, vol: 0.5, freq: 900, q: 0.4 }); note({ type: 'sawtooth', de: 180, a: 40, duree: 0.3, vol: 0.18 }); },
  roquette_tir: () => { bruit({ duree: 0.6, vol: 0.35, freq: 500, q: 0.5 }); },
  explosion: () => { bruit({ duree: 1.2, vol: 0.6, freq: 200, q: 0.4 }); note({ type: 'sawtooth', de: 90, a: 30, duree: 0.8, vol: 0.2 }); },
  pompe_armement: () => { bruit({ duree: 0.06, vol: 0.2, freq: 2200, q: 3 }); bruit({ duree: 0.06, vol: 0.2, freq: 1600, q: 3, delai: 0.18 }); },
  sniper_culasse: () => { bruit({ duree: 0.05, vol: 0.18, freq: 2600, q: 4 }); bruit({ duree: 0.05, vol: 0.18, freq: 1800, q: 4, delai: 0.25 }); },
  chargeur_retire: () => bruit({ duree: 0.05, vol: 0.15, freq: 2500, q: 4 }),
  chargeur_insere: () => bruit({ duree: 0.06, vol: 0.2, freq: 1800, q: 4 }),
  cartouche_insere: () => bruit({ duree: 0.05, vol: 0.15, freq: 2000, q: 4 }),
  arme_sortir: () => bruit({ duree: 0.08, vol: 0.12, freq: 2400, q: 3 }),
  vide: () => note({ type: 'square', de: 200, a: 200, duree: 0.04, vol: 0.06 }),
  douille: () => note({ type: 'sine', de: 4200, a: 3800, duree: 0.08, vol: 0.03 }),
  impact_mur: () => bruit({ duree: 0.05, vol: 0.06, freq: 3000, q: 2 }),
  touche: () => note({ type: 'triangle', de: 1800, a: 1700, duree: 0.05, vol: 0.18 }),
  tete: () => { note({ type: 'triangle', de: 2400, a: 2300, duree: 0.08, vol: 0.2 }); note({ type: 'sine', de: 3200, a: 3200, duree: 0.12, vol: 0.12, delai: 0.03 }); },
  elimination: () => { note({ type: 'square', de: 660, a: 660, duree: 0.08, vol: 0.12 }); note({ type: 'square', de: 990, a: 990, duree: 0.14, vol: 0.12, delai: 0.08 }); },
  degats: () => { note({ type: 'sawtooth', de: 220, a: 90, duree: 0.15, vol: 0.12 }); bruit({ duree: 0.1, vol: 0.12, freq: 500 }); },
  pas: () => bruit({ duree: 0.06, vol: 0.05, freq: 400, q: 1 }),
  saut: () => note({ type: 'sine', de: 300, a: 420, duree: 0.08, vol: 0.04 }),
  atterrissage: () => bruit({ duree: 0.08, vol: 0.08, freq: 300 }),
  trampoline: () => note({ type: 'sine', de: 180, a: 900, duree: 0.35, vol: 0.18 }),
  eau: () => bruit({ duree: 0.3, vol: 0.12, freq: 900, q: 0.6 }),
  pouf: () => bruit({ duree: 0.25, vol: 0.12, freq: 900, q: 0.7 }),
  apparition: () => note({ type: 'sine', de: 300, a: 1200, duree: 0.3, vol: 0.1 }),
  clic: () => note({ type: 'triangle', de: 900, a: 900, duree: 0.03, vol: 0.08 }),
  victoire: () => [523, 659, 784, 1046].forEach((f, i) => note({ type: 'square', de: f, a: f, duree: 0.18, vol: 0.1, delai: i * 0.12 })),
  // ----- nouvelles armes et effets (sons fabriqués, en 3D quand ils viennent de quelqu'un d'autre) -----
  plasma_tir: (o) => { const d = destination(o); note({ type: 'square', de: 1400, a: 260, duree: 0.18, vol: 0.09, dest: d }); note({ type: 'sine', de: 760, a: 140, duree: 0.25, vol: 0.16, dest: d }); bruit({ duree: 0.07, vol: 0.12, freq: 3200, q: 1, dest: d }); },
  rayon_lev_tir: (o) => { const d = destination(o); note({ type: 'sine', de: 950, a: 280, duree: 0.38, vol: 0.16, dest: d }); note({ type: 'triangle', de: 1900, a: 560, duree: 0.32, vol: 0.06, dest: d }); note({ type: 'sine', de: 400, a: 1300, duree: 0.2, vol: 0.05, delai: 0.05, dest: d }); },
  pistolet_eau_tir: (o) => { const d = destination(o); bruit({ duree: 0.12, vol: 0.16, freq: 2600, q: 0.7, dest: d }); note({ type: 'sine', de: 520, a: 380, duree: 0.06, vol: 0.03, dest: d }); },
  trou_noir_tir: (o) => { const d = destination(o); note({ type: 'sine', de: 220, a: 38, duree: 0.7, vol: 0.32, dest: d }); note({ type: 'sawtooth', de: 130, a: 30, duree: 0.55, vol: 0.07, dest: d }); bruit({ duree: 0.45, vol: 0.2, freq: 280, q: 0.6, dest: d }); },
  tesla_tir: (o) => REMPLACEMENT.tesla_zap(o),
  tesla_zap: (o) => {
    const d = destination(o);
    for (let i = 0; i < 7; i++) bruit({ duree: 0.03, vol: 0.28, freq: 3500 + Math.random() * 3000, q: 3, delai: i * 0.03 + Math.random() * 0.02, dest: d });
    note({ type: 'sawtooth', de: 120, a: 95, duree: 0.32, vol: 0.12, dest: d });
    note({ type: 'square', de: 2400, a: 1800, duree: 0.12, vol: 0.04, dest: d });
  },
  flash: (o) => { const d = destination({ ...o, portee: 3 }); bruit({ duree: 0.55, vol: 0.65, freq: 1800, q: 0.3, dest: d }); bruit({ duree: 0.2, vol: 0.5, freq: 400, q: 0.5, dest: d }); note({ type: 'sine', de: 3100, a: 2900, duree: 1.4, vol: 0.05, dest: d }); },
  propulseur: (o) => { const d = destination(o); bruit({ duree: 0.65, vol: 0.38, freq: 620, q: 0.5, dest: d }); note({ type: 'sawtooth', de: 80, a: 170, duree: 0.5, vol: 0.08, dest: d }); },
  meteore: (o) => { const d = destination({ ...o, portee: 3 }); note({ type: 'sine', de: 1800, a: 260, duree: 0.6, vol: 0.12, dest: d }); bruit({ duree: 0.6, vol: 0.22, freq: 900, q: 0.6, dest: d }); },
  artifice: (o) => {
    const d = destination({ ...o, portee: 3 });
    bruit({ duree: 0.3, vol: 0.4, freq: 900, q: 0.5, dest: d });
    for (let i = 0; i < 12; i++) bruit({ duree: 0.02, vol: 0.22, freq: 2500 + Math.random() * 2500, q: 2, delai: 0.1 + Math.random() * 0.7, dest: d });
  },
  plasma_impact: (o) => { const d = destination(o); note({ type: 'sine', de: 620, a: 90, duree: 0.22, vol: 0.18, dest: d }); bruit({ duree: 0.14, vol: 0.18, freq: 2200, q: 0.8, dest: d }); },
  tonnerre: (o) => { const d = destination({ ...o, portee: 4 }); bruit({ duree: 0.18, vol: 0.55, freq: 2400, q: 0.5, dest: d }); bruit({ duree: 1.7, vol: 0.6, freq: 140, q: 0.4, delai: 0.05, dest: d }); note({ type: 'sawtooth', de: 70, a: 30, duree: 1.2, vol: 0.14, dest: d }); },
  trou_noir_boom: (o) => { const d = destination({ ...o, portee: 4 }); note({ type: 'sine', de: 50, a: 200, duree: 0.3, vol: 0.25, dest: d }); note({ type: 'sine', de: 90, a: 28, duree: 1.3, vol: 0.4, delai: 0.3, dest: d }); bruit({ duree: 1.1, vol: 0.45, freq: 220, q: 0.5, delai: 0.3, dest: d }); },
  sabre_coup: (o) => { const d = destination(o); note({ type: 'sawtooth', de: 92, a: 150, duree: 0.32, vol: 0.09, dest: d }); note({ type: 'sawtooth', de: 95, a: 140, duree: 0.32, vol: 0.07, dest: d }); bruit({ duree: 0.25, vol: 0.08, freq: 1200, q: 1, dest: d }); },
  minigun_rotor: (o) => { const d = destination(o); note({ type: 'sawtooth', de: 60, a: 420, duree: 0.6, vol: 0.08, dest: d }); bruit({ duree: 0.6, vol: 0.06, freq: 1500, q: 0.8, dest: d }); },
  mine_armee: (o) => { const d = destination(o); note({ type: 'square', de: 1800, a: 1800, duree: 0.05, vol: 0.06, dest: d }); note({ type: 'square', de: 2400, a: 2400, duree: 0.05, vol: 0.06, delai: 0.09, dest: d }); },
};

// Joue un son : le vrai fichier s'il existe, sinon le remplacement.
export function son(nom, options = {}) {
  if (jouer(nom, options)) return;
  if (options.position && options.distance > 60) return;
  const r = REMPLACEMENT[nom] || REMPLACEMENT[nom.replace(/_\d$/, '')];
  if (r && ctx) r(options);
}

// Musique du menu (en boucle)
function lancerMusique() {
  if (!ctx || !tampons.musique_menu || (musique && musique !== 'attente')) return;
  const s = ctx.createBufferSource();
  s.buffer = tampons.musique_menu;
  s.loop = true;
  s.connect(sortieMusique);
  s.start();
  musique = s;
}
export function musiqueMenu(oui) {
  if (!ctx) return;
  if (oui) {
    sortieMusique.gain.setTargetAtTime(volumeMusique, ctx.currentTime, 0.3);
    if (!musique) { musique = 'attente'; lancerMusique(); }
  } else {
    sortieMusique.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
  }
}

// ---------- Laser d'admin (sons fabriqués par le navigateur) ----------
// Bourdonnement de charge : de plus en plus aigu, fort et rapide (vibrato) quand la charge monte.
// Renvoie { maj(charge 0 → 1), arreter() }.
export function bourdonLaser() {
  if (!ctx) return { maj() {}, arreter() {} };
  const t = ctx.currentTime;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  const filtre = ctx.createBiquadFilter();
  filtre.type = 'lowpass';
  filtre.frequency.value = 500;
  filtre.Q.value = 6;
  const o1 = ctx.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 70;
  const o2 = ctx.createOscillator(); o2.type = 'square'; o2.frequency.value = 71.5;
  const o3 = ctx.createOscillator(); o3.type = 'sine'; o3.frequency.value = 140;
  // vibrato (le son « tourne »)
  const lfo = ctx.createOscillator(); lfo.frequency.value = 5;
  const lfoGain = ctx.createGain(); lfoGain.gain.value = 0;
  lfo.connect(lfoGain);
  lfoGain.connect(o1.frequency); lfoGain.connect(o2.frequency);
  const g2 = ctx.createGain(); g2.gain.value = 0.35;
  o1.connect(filtre); o2.connect(filtre); o3.connect(g2).connect(filtre);
  filtre.connect(g).connect(sortie);
  [o1, o2, o3, lfo].forEach((o) => o.start(t));
  let fini = false;
  return {
    maj(charge) {
      if (fini) return;
      const n = ctx.currentTime;
      const c = Math.max(0, Math.min(1, charge));
      const f = 70 * Math.pow(14, c); // 70 Hz → ~1000 Hz
      o1.frequency.setTargetAtTime(f, n, 0.05);
      o2.frequency.setTargetAtTime(f * 1.02, n, 0.05);
      o3.frequency.setTargetAtTime(f * 2, n, 0.05);
      filtre.frequency.setTargetAtTime(400 + c * 5200, n, 0.05);
      lfo.frequency.setTargetAtTime(4 + c * 34, n, 0.05);
      lfoGain.gain.setTargetAtTime(f * 0.04 * c, n, 0.05);
      g.gain.setTargetAtTime(0.025 + c * 0.11, n, 0.04);
    },
    arreter() {
      if (fini) return;
      fini = true;
      const n = ctx.currentTime;
      g.gain.cancelScheduledValues(n);
      g.gain.setTargetAtTime(0.0001, n, 0.03);
      [o1, o2, o3, lfo].forEach((o) => { try { o.stop(n + 0.2); } catch { /* déjà arrêté */ } });
    },
  };
}

// Le tir du laser : un « VWOUM » qui descend, un souffle et (chargé à fond) un grondement grave.
// position : Vector3 pour un laser tiré par quelqu'un d'autre (son en 3D).
export function tirLaserSon(charge = 0.5, position = null) {
  if (!ctx) return;
  const t = ctx.currentTime;
  const c = Math.max(0, Math.min(1, charge));
  const dest = ctx.createGain();
  dest.gain.value = 0.5 + c * 0.6;
  if (position) spatialiser(dest, position, 3).connect(sortie); else dest.connect(sortie);
  const ton = (type, de, a, duree, vol, delai = 0) => {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(de, t + delai);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, a), t + delai + duree);
    g.gain.setValueAtTime(0.0001, t + delai);
    g.gain.exponentialRampToValueAtTime(vol, t + delai + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + delai + duree);
    o.connect(g).connect(dest);
    o.start(t + delai); o.stop(t + delai + duree + 0.05);
  };
  ton('sawtooth', 1800 + c * 1400, 60, 0.35 + c * 0.35, 0.18);
  ton('square', 900 + c * 700, 40, 0.3 + c * 0.3, 0.08);
  ton('sine', 120, 28, 0.5 + c * 0.9, 0.25 + c * 0.35); // grave
  if (c > 0.6) ton('sine', 2400, 2200, 0.25, 0.05, 0.02); // petit sifflement
  // souffle
  if (!bruitBlanc) { bruit({ duree: 0.01, vol: 0.0001 }); }
  const s = ctx.createBufferSource();
  s.buffer = bruitBlanc;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.setValueAtTime(3000, t);
  f.frequency.exponentialRampToValueAtTime(200, t + 0.5 + c * 0.5);
  f.Q.value = 0.8;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.35 + c * 0.3, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5 + c * 0.6);
  s.connect(f).connect(g).connect(dest);
  s.start(t, Math.random() * 0.3);
  s.stop(t + 1.3);
}

// ---------- Nouvelles armes : sons qui durent ----------
// Grondement d'un trou noir (en 3D) : il grossit puis se coupe. Renvoie { arreter() }.
export function bourdonTrouNoir(position) {
  if (!ctx) return { arreter() {} };
  const t = ctx.currentTime;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5, t + 0.6);
  spatialiser(g, position, 3).connect(sortie);
  const o1 = ctx.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 42;
  const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 63;
  const filtre = ctx.createBiquadFilter(); filtre.type = 'lowpass'; filtre.frequency.value = 260; filtre.Q.value = 4;
  const lfo = ctx.createOscillator(); lfo.frequency.value = 3.2;
  const lfoGain = ctx.createGain(); lfoGain.gain.value = 120;
  lfo.connect(lfoGain).connect(filtre.frequency);
  o1.connect(filtre); o2.connect(filtre); filtre.connect(g);
  [o1, o2, lfo].forEach((o) => o.start(t));
  o1.frequency.linearRampToValueAtTime(30, t + 3.5);
  let fini = false;
  return {
    arreter() {
      if (fini) return;
      fini = true;
      const n = ctx.currentTime;
      g.gain.cancelScheduledValues(n);
      g.gain.setTargetAtTime(0.0001, n, 0.08);
      [o1, o2, lfo].forEach((o) => { try { o.stop(n + 0.5); } catch { /* déjà arrêté */ } });
    },
  };
}

// Moteur du minigun : les canons tournent plus ou moins vite (k : 0 → 1). Renvoie { maj(k), arreter() }.
export function moteurMinigun() {
  if (!ctx) return { maj() {}, arreter() {} };
  const t = ctx.currentTime;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  const filtre = ctx.createBiquadFilter(); filtre.type = 'bandpass'; filtre.frequency.value = 400; filtre.Q.value = 1.2;
  const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 40;
  const o2 = ctx.createOscillator(); o2.type = 'square'; o2.frequency.value = 80;
  const g2 = ctx.createGain(); g2.gain.value = 0.3;
  o.connect(filtre); o2.connect(g2).connect(filtre); filtre.connect(g).connect(sortie);
  o.start(t); o2.start(t);
  let fini = false;
  return {
    maj(k) {
      if (fini) return;
      const n = ctx.currentTime;
      o.frequency.setTargetAtTime(40 + k * 260, n, 0.05);
      o2.frequency.setTargetAtTime(80 + k * 520, n, 0.05);
      filtre.frequency.setTargetAtTime(300 + k * 1600, n, 0.05);
      g.gain.setTargetAtTime(0.0001 + k * 0.07, n, 0.05);
    },
    arreter() {
      if (fini) return;
      fini = true;
      const n = ctx.currentTime;
      g.gain.setTargetAtTime(0.0001, n, 0.1);
      try { o.stop(n + 0.6); o2.stop(n + 0.6); } catch { /* déjà arrêté */ }
    },
  };
}
