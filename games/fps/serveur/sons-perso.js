// Sons envoyés par l'admin depuis l'atelier d'animations (musiques de danse, bruitages...).
// Ils sont rangés dans data/fps-sons/ (un fichier par son) avec la liste dans data/fps-sons.json.
// Dans une animation ou une danse, un son perso s'appelle « perso:<identifiant> ».
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TAILLE_MAX = 4 * 1024 * 1024;   // 4 Mo par son (environ 4 minutes de MP3)
const TOTAL_MAX = 100 * 1024 * 1024;  // 100 Mo en tout
const NOMBRE_MAX = 100;
const TYPES = { mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav', m4a: 'audio/mp4' };

// Reconnaît le format d'après les premiers octets du fichier (on ne se fie pas à son nom).
function formatDe(b) {
  if (b.length < 12) return null;
  if (b.slice(0, 3).toString('latin1') === 'ID3') return 'mp3';
  if (b[0] === 0xff && (b[1] & 0xe0) === 0xe0) return 'mp3';
  if (b.slice(0, 4).toString('latin1') === 'OggS') return 'ogg';
  if (b.slice(0, 4).toString('latin1') === 'RIFF' && b.slice(8, 12).toString('latin1') === 'WAVE') return 'wav';
  if (b.slice(4, 8).toString('latin1') === 'ftyp') return 'm4a';
  return null;
}

// Un nom lisible : sans caractères bizarres, 40 caractères au plus.
function nettoyerNom(nom) {
  return String(nom || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
}

function stockage({ dossier } = {}) {
  const base = dossier || process.env.DATA_DIR || path.join(__dirname, '..', '..', '..', 'data');
  const rep = path.join(base, 'fps-sons');
  const fichierListe = path.join(base, 'fps-sons.json');
  let sons = [];
  try {
    if (fs.existsSync(fichierListe)) {
      sons = JSON.parse(fs.readFileSync(fichierListe, 'utf8')).filter((s) => s && /^p[a-z0-9]{10}$/.test(s.id) && TYPES[s.ext]
        && fs.existsSync(path.join(rep, `${s.id}.${s.ext}`)));
    }
  } catch (e) {
    console.error(`FPS : liste des sons illisible (${e.message})`);
    sons = [];
  }
  const ecrireListe = () => {
    const tmp = `${fichierListe}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(sons));
    fs.renameSync(tmp, fichierListe);
  };
  const trouver = (id) => sons.find((s) => s.id === id) || null;

  return {
    liste: () => sons.map(({ id, nom, taille }) => ({ id, nom, taille })),
    existe: (id) => !!trouver(id),
    trouver,
    chemin: (s) => path.join(rep, `${s.id}.${s.ext}`),
    type: (s) => TYPES[s.ext],
    // Ajoute un son. Renvoie le son, ou un message d'erreur (texte).
    ajouter(nom, contenu) {
      const propre = nettoyerNom(nom) || 'Son sans nom';
      if (!contenu || !contenu.length) return 'Fichier vide.';
      if (contenu.length > TAILLE_MAX) return 'Fichier trop gros (4 Mo maximum).';
      const ext = formatDe(contenu);
      if (!ext) return 'Ce n\'est pas un son reconnu (MP3, OGG, WAV ou M4A).';
      if (sons.length >= NOMBRE_MAX) return `Trop de sons (${NOMBRE_MAX} maximum) : supprimes-en d'abord.`;
      if (sons.reduce((n, s) => n + s.taille, 0) + contenu.length > TOTAL_MAX) return 'Plus de place pour les sons (100 Mo en tout) : supprimes-en d\'abord.';
      const id = `p${crypto.randomBytes(8).toString('hex').slice(0, 10)}`;
      const s = { id, nom: propre, ext, taille: contenu.length, ajoute: Date.now() };
      try {
        fs.mkdirSync(rep, { recursive: true });
        fs.writeFileSync(path.join(rep, `${id}.${ext}`), contenu);
        sons.push(s);
        ecrireListe();
      } catch (e) {
        sons = sons.filter((x) => x !== s);
        console.error(`FPS : impossible d'enregistrer un son (${e.message})`);
        return 'Le serveur n\'a pas pu enregistrer le fichier.';
      }
      return { id, nom: propre, taille: s.taille };
    },
    supprimer(id) {
      const s = trouver(id);
      if (!s) return false;
      sons = sons.filter((x) => x !== s);
      try { ecrireListe(); fs.rmSync(path.join(rep, `${s.id}.${s.ext}`), { force: true }); } catch (e) {
        console.error(`FPS : impossible de supprimer un son (${e.message})`);
      }
      return true;
    },
  };
}

// Lit le contenu envoyé (le fichier son), sans dépasser la taille maximale.
function lireCorps(req, max) {
  return new Promise((resolve, reject) => {
    const annonce = Number(req.headers['content-length']);
    if (annonce > max) { reject(Object.assign(new Error('trop gros'), { code: 413 })); return; }
    const morceaux = []; let n = 0;
    req.on('data', (m) => {
      n += m.length;
      if (n > max) { reject(Object.assign(new Error('trop gros'), { code: 413 })); req.destroy(); return; }
      morceaux.push(m);
    });
    req.on('end', () => resolve(Buffer.concat(morceaux)));
    req.on('error', reject);
  });
}

// Adresses HTTP : liste et écoute (joueurs connectés), envoi et suppression (admin seulement).
function routes({ app, auth, security, sons, annoncer }) {
  const base = '/games/fps/api/sons';
  const connecte = (req, res, next) => (req.user ? next() : res.status(401).json({ error: 'Connecte-toi pour jouer.' }));
  // La demande doit venir du site lui-même (protection contre les autres sites)
  const memeOrigine = (req, res, next) => (security && security.isSameOrigin(req) ? next() : res.status(403).json({ error: 'Origine refusée.' }));
  app.get(base, connecte, (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({ sons: sons.liste() });
  });
  app.get(`${base}/:id`, connecte, (req, res) => {
    const s = sons.trouver(req.params.id);
    if (!s) return res.status(404).json({ error: 'Son introuvable.' });
    res.set('Cache-Control', 'private, max-age=86400');
    res.type(sons.type(s));
    return res.sendFile(sons.chemin(s));
  });
  app.post(base, memeOrigine, auth.requireAdmin, async (req, res) => {
    // Un vrai fichier son (pas un formulaire envoyé par un autre site)
    if (!/^(audio\/[a-z0-9.+-]+|application\/octet-stream)$/i.test(String(req.headers['content-type'] || '').split(';')[0].trim())) {
      return res.status(415).json({ error: 'Envoie un fichier son.' });
    }
    let contenu;
    try { contenu = await lireCorps(req, TAILLE_MAX); } catch (e) {
      return res.status(e.code === 413 ? 413 : 400).json({ error: e.code === 413 ? 'Fichier trop gros (4 Mo maximum).' : 'Envoi interrompu.' });
    }
    const r = sons.ajouter(req.query.nom, contenu);
    if (typeof r === 'string') return res.status(400).json({ error: r });
    annoncer();
    return res.status(201).json({ son: r });
  });
  app.delete(`${base}/:id`, memeOrigine, auth.requireAdmin, (req, res) => {
    if (!sons.supprimer(req.params.id)) return res.status(404).json({ error: 'Son introuvable.' });
    annoncer();
    return res.json({ ok: true });
  });
}

module.exports = { stockage, routes, formatDe, TAILLE_MAX };
