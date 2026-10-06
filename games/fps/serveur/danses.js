// Danses faites par l'admin dans l'atelier d'animations (onglet Danses).
// Enregistrées dans data/fps-danses.json. Une danse anime le personnage entier :
//   { id, nom, duree, mouvement, musique, pistes: { tout, corps, tete, brasD, brasG, jambeD, jambeG }, sons,
//     marcher (on peut avancer en dansant), vitesse (vitesse de marche pendant la danse), arme (garder l'arme en main) }
// Les clés ont le même format que les animations d'armes (voir public/js/animations-perso.js) :
// [t, px, py, pz, rx, ry, rz, cache, arret] ; ici les rotations sont l'angle de chaque articulation
// (0 = debout, bras le long du corps) et les positions un décalage. La danse se répète en boucle.
const fs = require('fs');
const path = require('path');

const PISTES = new Set(['tout', 'corps', 'tete', 'brasD', 'brasG', 'jambeD', 'jambeG']);
const DUREE = [0.3, 30];
const MAX_DANSES = 40;
const MAX_CLES_PISTE = 150;
const MAX_CLES = 800;
const MAX_SONS = 80;
const TAILLE_MAX = 200 * 1024; // une danse envoyée par l'atelier (JSON)

const nombre = (v, min, max) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v * 10000) / 10000)) : null);
const nettoyerNom = (nom) => String(nom || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 30);

// sonConnu(nom) : son du jeu ou son perso qui existe. strict = false : un son inconnu est simplement retiré.
function nettoyer(id, brut, sonConnu, strict = true) {
  if (!/^d[a-z0-9]{6,16}$/.test(id) || !brut || typeof brut !== 'object') return null;
  const nom = nettoyerNom(brut.nom);
  const duree = nombre(brut.duree, ...DUREE);
  if (!nom || duree === null || !brut.pistes || typeof brut.pistes !== 'object' || Array.isArray(brut.pistes)) return null;
  const pistes = {};
  let total = 0;
  for (const [p, cles] of Object.entries(brut.pistes)) {
    if (!PISTES.has(p)) continue;
    if (!Array.isArray(cles) || cles.length > MAX_CLES_PISTE) return null;
    const liste = [];
    for (const c of cles) {
      if (!Array.isArray(c) || c.length < 7 || c.length > 10) return null;
      const k = [nombre(c[0], 0, duree)];
      for (let j = 1; j < 4; j++) k.push(nombre(c[j], -3, 3));
      for (let j = 4; j < 7; j++) k.push(nombre(c[j], -63, 63));
      if (k.some((v) => v === null)) return null;
      k.push(c[7] ? 1 : 0, c[8] ? 1 : 0, c[9] ? 1 : 0);
      liste.push(k);
    }
    liste.sort((a, b) => a[0] - b[0]);
    total += liste.length;
    if (liste.length) pistes[p] = liste;
  }
  if (total > MAX_CLES) return null;
  const sons = [];
  if (brut.sons !== undefined) {
    if (!Array.isArray(brut.sons) || brut.sons.length > MAX_SONS) return null;
    for (const s of brut.sons) {
      if (!Array.isArray(s) || typeof s[1] !== 'string') return null;
      if (!sonConnu(s[1])) { if (strict) return null; continue; }
      const t = nombre(s[0], 0, duree);
      if (t === null) return null;
      sons.push([t, s[1]]);
    }
    sons.sort((a, b) => a[0] - b[0]);
  }
  let musique = null;
  if (typeof brut.musique === 'string' && brut.musique) {
    if (sonConnu(brut.musique)) musique = brut.musique;
    else if (strict) return null;
  }
  const vitesse = nombre(brut.vitesse, 0.2, 1);
  return {
    id, nom, duree, mouvement: brut.mouvement === 'doux' ? 'doux' : 'fluide', musique, pistes, sons,
    marcher: !!brut.marcher, vitesse: vitesse === null ? 0.7 : vitesse, arme: !!brut.arme,
  };
}

function stockage({ sonConnu, dossier } = {}) {
  const base = dossier || process.env.DATA_DIR || path.join(__dirname, '..', '..', '..', 'data');
  const chemin = path.join(base, 'fps-danses.json');
  let danses = [];
  try {
    if (fs.existsSync(chemin)) {
      for (const d of JSON.parse(fs.readFileSync(chemin, 'utf8')) || []) {
        const propre = d && nettoyer(d.id, d, sonConnu, false);
        if (propre) danses.push(propre); else console.error('FPS : une danse ignorée (pas valable)');
      }
    }
  } catch (e) {
    console.error(`FPS : impossible de lire ${path.basename(chemin)} (${e.message})`);
    danses = [];
  }
  const ecrire = () => {
    const tmp = `${chemin}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(danses));
    fs.renameSync(tmp, chemin);
  };
  return {
    tout: () => danses,
    existe: (id) => danses.some((d) => d.id === id),
    // Crée ou remplace une danse. Renvoie la danse, ou un message d'erreur (texte).
    enregistrer(id, brut) {
      const propre = nettoyer(id, brut, sonConnu, true);
      if (!propre) return 'Danse pas valable (nom manquant, trop de clés, valeurs hors limites ou son inconnu).';
      const i = danses.findIndex((d) => d.id === id);
      if (i < 0 && danses.length >= MAX_DANSES) return `Trop de danses (${MAX_DANSES} maximum).`;
      const avant = danses.slice();
      if (i >= 0) danses[i] = propre; else danses.push(propre);
      try { ecrire(); } catch (e) {
        danses = avant;
        console.error(`FPS : impossible d'enregistrer les danses (${e.message})`);
        return 'Le serveur n\'a pas pu enregistrer le fichier.';
      }
      return propre;
    },
    supprimer(id) {
      const avant = danses;
      danses = danses.filter((d) => d.id !== id);
      if (danses.length === avant.length) return false;
      try { ecrire(); } catch (e) {
        danses = avant;
        console.error(`FPS : impossible d'enregistrer les danses (${e.message})`);
        return false;
      }
      return true;
    },
  };
}

// Lit une danse envoyée par l'atelier (type « application/vnd.fps+json », plus grande que les autres envois).
function lireJson(req, max) {
  return new Promise((resolve, reject) => {
    if (Number(req.headers['content-length']) > max) { reject(Object.assign(new Error('trop gros'), { code: 413 })); return; }
    const morceaux = []; let n = 0;
    req.on('data', (m) => {
      n += m.length;
      if (n > max) { reject(Object.assign(new Error('trop gros'), { code: 413 })); req.destroy(); return; }
      morceaux.push(m);
    });
    req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(morceaux).toString('utf8'))); } catch { reject(new Error('mal formé')); } });
    req.on('error', reject);
  });
}

function routes({ app, auth, security, danses, annoncer }) {
  const base = '/games/fps/api/danses';
  const memeOrigine = (req, res, next) => (security && security.isSameOrigin(req) ? next() : res.status(403).json({ error: 'Origine refusée.' }));
  app.get(base, (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Connecte-toi pour jouer.' });
    res.set('Cache-Control', 'no-store');
    return res.json({ danses: danses.tout() });
  });
  app.put(`${base}/:id`, memeOrigine, auth.requireAdmin, async (req, res) => {
    if (String(req.headers['content-type'] || '').split(';')[0].trim() !== 'application/vnd.fps+json') {
      return res.status(415).json({ error: 'Format attendu : application/vnd.fps+json.' });
    }
    let brut;
    try { brut = await lireJson(req, TAILLE_MAX); } catch (e) {
      return res.status(e.code === 413 ? 413 : 400).json({ error: e.code === 413 ? 'Danse trop grosse : enlève des clés.' : 'Requête mal formée.' });
    }
    const r = danses.enregistrer(req.params.id, brut && brut.danse);
    if (typeof r === 'string') return res.status(400).json({ error: r });
    annoncer();
    return res.json({ danse: r });
  });
  app.delete(`${base}/:id`, memeOrigine, auth.requireAdmin, (req, res) => {
    if (!danses.supprimer(req.params.id)) return res.status(404).json({ error: 'Danse introuvable.' });
    annoncer();
    return res.json({ ok: true });
  });
}

module.exports = { stockage, routes, nettoyer, PISTES };
