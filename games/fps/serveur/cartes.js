// Cartes faites par l'admin dans l'éditeur (atelier → Cartes). Enregistrées dans data/fps-cartes.json.
// Une carte perso a le même format que les cartes du dossier public/cartes, mais c'est l'admin qui la
// dessine depuis le navigateur. Le serveur vérifie tout (matières connues, nombre de blocs, apparitions
// valables) avant de l'accepter : les navigateurs n'envoient jamais de carte en laquelle on ait confiance.
const fs = require('fs');
const path = require('path');

// Mêmes matières que le générateur (games/fps/outils/cartes.py).
const MATIERES = new Set([
  'herbe', 'terre', 'sable', 'pierre', 'pave', 'pierre_chateau', 'brique', 'beton', 'asphalte',
  'trottoir', 'bois', 'planches', 'caisse', 'tronc', 'palmier', 'feuilles', 'feuilles_palmier',
  'paille', 'toit_rouge', 'toit_ardoise', 'metal', 'metal_rouge', 'metal_bleu', 'metal_jaune',
  'pneu', 'vitre', 'lampe', 'tissu_bleu', 'tissu_rouge', 'trampoline', 'neon', 'neon_rouge', 'invisible',
]);
// Ambiances au choix (l'éditeur envoie juste le nom, le serveur met les bonnes couleurs).
const AMBIANCES = {
  jour: {
    ciel: ['#2f7fe0', '#cdeaff'], brouillard: ['#cdeaff', 70, 260],
    soleil: { couleur: '#fff1d6', intensite: 2.1, position: [28, 55, 18] },
    ambiante: { ciel: '#cfe8ff', sol: '#5d7a3a', intensite: 1.35 }, nuages: true,
  },
  soir: {
    ciel: ['#3b5fa6', '#ffcf96'], brouillard: ['#f3d0a4', 70, 260],
    soleil: { couleur: '#ffbe7a', intensite: 2.2, position: [-50, 32, 22] },
    ambiante: { ciel: '#ffe0bd', sol: '#4f5d35', intensite: 1.2 }, nuages: true,
  },
  nuit: {
    ciel: ['#0a1026', '#24314f'], brouillard: ['#1a2238', 55, 200],
    soleil: { couleur: '#9fb6ff', intensite: 0.8, position: [20, 55, -18] },
    ambiante: { ciel: '#2a3350', sol: '#1a1f30', intensite: 0.8 }, nuages: false,
  },
  plage: {
    ciel: ['#1d86de', '#c4f1ff'], brouillard: ['#c4f1ff', 85, 300],
    soleil: { couleur: '#fffbe8', intensite: 2.4, position: [22, 70, 30] },
    ambiante: { ciel: '#d6f4ff', sol: '#cbb37c', intensite: 1.45 }, nuages: true,
  },
};
const TAILLE = [16, 90];
const MAX_BOITES = 1200;      // blocs solides
const MAX_DECORS = 500;
const MAX_APPARITIONS = 48;
const MAX_CARTES = 40;
const TAILLE_MAX_OCTETS = 3 * 1024 * 1024; // JSON envoyé par l'éditeur

const nombre = (v) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v * 1000) / 1000 : null);
const nettoyerNom = (nom) => String(nom || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 30);

function nettoyerBoite(c, T) {
  if (!Array.isArray(c) || c.length !== 7 || typeof c[6] !== 'string' || !MATIERES.has(c[6])) return null;
  const v = c.slice(0, 6).map(nombre);
  if (v.some((n) => n === null)) return null;
  const b = [Math.min(v[0], v[3]), Math.min(v[1], v[4]), Math.min(v[2], v[5]), Math.max(v[0], v[3]), Math.max(v[1], v[4]), Math.max(v[2], v[5]), c[6]];
  if (b[0] >= b[3] || b[1] >= b[4] || b[2] >= b[5]) return null;              // boîte vide
  if (Math.abs(b[0]) > T + 2 || Math.abs(b[3]) > T + 2 || Math.abs(b[2]) > T + 2 || Math.abs(b[5]) > T + 2) return null;
  if (b[1] < -12 || b[4] > 32) return null;
  // taille maxi d'un bloc (pour éviter un « mur » géant qui couvre tout)
  if (b[3] - b[0] > 2 * T + 4 || b[5] - b[2] > 2 * T + 4 || b[4] - b[1] > 40) return null;
  return b;
}

// strict = false : à la lecture du fichier, on garde une carte même si quelques blocs sont ignorés.
function nettoyer(id, brut, strict = true) {
  if (!/^c[a-z0-9]{6,16}$/.test(id) || !brut || typeof brut !== 'object') return null;
  const nom = nettoyerNom(brut.nom);
  const T = nombre(brut.taille);
  if (!nom || T === null || T < TAILLE[0] || T > TAILLE[1]) return null;
  if (!Array.isArray(brut.boites) || !Array.isArray(brut.apparitions)) return null;
  if (brut.boites.length > MAX_BOITES || brut.apparitions.length > MAX_APPARITIONS) return null;
  const boites = [];
  for (const c of brut.boites) {
    const b = nettoyerBoite(c, T);
    if (b) boites.push(b); else if (strict) return null;
  }
  const decors = [];
  if (Array.isArray(brut.decors)) {
    if (brut.decors.length > MAX_DECORS) return null;
    for (const c of brut.decors) { const b = nettoyerBoite(c, T); if (b) decors.push(b); else if (strict) return null; }
  }
  const apparitions = [];
  for (const s of brut.apparitions) {
    if (!s || typeof s !== 'object') { if (strict) return null; continue; }
    const x = nombre(s.x); const y = nombre(s.y); const z = nombre(s.z);
    if (x === null || y === null || z === null || Math.abs(x) > T || Math.abs(z) > T || y < -12 || y > 32) { if (strict) return null; continue; }
    let equipe = null;
    if (s.equipe === 0 || s.equipe === 1) equipe = s.equipe;
    const angle = Number.isFinite(s.angle) ? Math.round(s.angle) : 0;
    apparitions.push({ x, y, z, angle: ((angle % 360) + 540) % 360 - 180, equipe });
  }
  if (!apparitions.length) return null; // il faut au moins un point d'apparition
  const ambiance = AMBIANCES[brut.ambiance] ? brut.ambiance : 'jour';
  const eau = brut.eau && Number.isFinite(brut.eau.niveau) ? { niveau: nombre(brut.eau.niveau), couleur: '#2a8fd6' } : null;
  return { id, nom, taille: T, ambiance, eau, boites, decors, apparitions };
}

// Transforme une carte enregistrée en carte jouable (ambiance complète, bots/joueurs selon la taille).
function enCarteJouable(m) {
  const botsMax = m.taille > 55 ? 7 : m.taille > 40 ? 5 : 3;
  return {
    id: m.id, nom: m.nom, description: 'Carte faite dans l\'éditeur.', perso: true,
    taille: m.taille, ambiance: AMBIANCES[m.ambiance] || AMBIANCES.jour, eau: m.eau,
    boites: m.boites, decors: m.decors, apparitions: m.apparitions,
    botsMax, joueursMax: { solo: 8, equipes: 12 },
  };
}

function stockage({ dossier } = {}) {
  const base = dossier || process.env.DATA_DIR || path.join(__dirname, '..', '..', '..', 'data');
  const chemin = path.join(base, 'fps-cartes.json');
  let cartes = [];
  try {
    if (fs.existsSync(chemin)) {
      for (const d of JSON.parse(fs.readFileSync(chemin, 'utf8')) || []) {
        const propre = d && nettoyer(d.id, d, false);
        if (propre) cartes.push(propre); else console.error('FPS : une carte perso ignorée (pas valable)');
      }
    }
  } catch (e) {
    console.error(`FPS : impossible de lire ${path.basename(chemin)} (${e.message})`);
    cartes = [];
  }
  const ecrire = () => {
    const tmp = `${chemin}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(cartes));
    fs.renameSync(tmp, chemin);
  };
  return {
    tout: () => cartes,
    // pour l'éditeur : les cartes brutes (pour les rouvrir et les modifier)
    brutes: () => cartes,
    jouable: (id) => { const m = cartes.find((c) => c.id === id); return m ? enCarteJouable(m) : null; },
    infos: () => cartes.map((c) => ({ id: c.id, nom: c.nom, description: 'Éditeur', perso: true })),
    enregistrer(id, brut) {
      const propre = nettoyer(id, brut, true);
      if (!propre) return 'Carte pas valable (nom, taille, matière inconnue, trop de blocs, ou pas d\'apparition).';
      const i = cartes.findIndex((c) => c.id === id);
      if (i < 0 && cartes.length >= MAX_CARTES) return `Trop de cartes (${MAX_CARTES} maximum).`;
      const avant = cartes.slice();
      if (i >= 0) cartes[i] = propre; else cartes.push(propre);
      try { ecrire(); } catch (e) { cartes = avant; console.error(`FPS : enregistrement carte impossible (${e.message})`); return 'Le serveur n\'a pas pu enregistrer.'; }
      return propre;
    },
    supprimer(id) {
      const avant = cartes;
      cartes = cartes.filter((c) => c.id !== id);
      if (cartes.length === avant.length) return false;
      try { ecrire(); } catch (e) { cartes = avant; console.error(`FPS : suppression carte impossible (${e.message})`); return false; }
      return true;
    },
  };
}

function lireJson(req, max) {
  return new Promise((resolve, reject) => {
    if (Number(req.headers['content-length']) > max) { reject(Object.assign(new Error('trop gros'), { code: 413 })); return; }
    const morceaux = []; let n = 0;
    req.on('data', (m) => { n += m.length; if (n > max) { reject(Object.assign(new Error('trop gros'), { code: 413 })); req.destroy(); return; } morceaux.push(m); });
    req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(morceaux).toString('utf8'))); } catch { reject(new Error('mal formé')); } });
    req.on('error', reject);
  });
}

function routes({ app, auth, security, cartes, annoncer }) {
  const base = '/games/fps/api/cartes';
  const memeOrigine = (req, res, next) => (security && security.isSameOrigin(req) ? next() : res.status(403).json({ error: 'Origine refusée.' }));
  app.get(base, (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Connecte-toi.' });
    res.set('Cache-Control', 'no-store');
    // L'admin reçoit les cartes complètes (pour les modifier) ; les autres, juste la liste.
    if (req.user.isAdmin) return res.json({ cartes: cartes.brutes() });
    return res.json({ cartes: cartes.infos() });
  });
  app.put(`${base}/:id`, memeOrigine, auth.requireAdmin, async (req, res) => {
    if (String(req.headers['content-type'] || '').split(';')[0].trim() !== 'application/vnd.fps+json') {
      return res.status(415).json({ error: 'Format attendu : application/vnd.fps+json.' });
    }
    let brut;
    try { brut = await lireJson(req, TAILLE_MAX_OCTETS); } catch (e) {
      return res.status(e.code === 413 ? 413 : 400).json({ error: e.code === 413 ? 'Carte trop grosse : enlève des blocs.' : 'Requête mal formée.' });
    }
    const r = cartes.enregistrer(req.params.id, brut && brut.carte);
    if (typeof r === 'string') return res.status(400).json({ error: r });
    annoncer();
    return res.json({ carte: r });
  });
  app.delete(`${base}/:id`, memeOrigine, auth.requireAdmin, (req, res) => {
    if (!cartes.supprimer(req.params.id)) return res.status(404).json({ error: 'Carte introuvable.' });
    annoncer();
    return res.json({ ok: true });
  });
}

module.exports = { stockage, routes, nettoyer, enCarteJouable, MATIERES: [...MATIERES], AMBIANCES };
