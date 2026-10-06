// Apparence des personnages (Arena FPS) : vérification et enregistrement.
//
// Une apparence est un petit objet : couleurs, coupe de cheveux, vêtements,
// accessoires, et éventuellement un visage dessiné ou tiré d'une photo.
// Le visage n'est JAMAIS une photo : seulement 8 × 8 = 64 couleurs (la photo est
// transformée en pixels sur l'appareil du joueur et n'est jamais envoyée).
const fs = require('fs');
const path = require('path');

const COULEUR = /^#[0-9a-f]{6}$/;
const VISAGE = /^[0-9a-f]{384}$/; // 64 pixels × 6 caractères (rrggbb)

function charger() {
  const c = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'catalogue-apparence.json'), 'utf8'));
  const ids = (liste) => new Set(liste.map((x) => x.id));
  return {
    coupes: ids(c.coupes), hauts: ids(c.hauts), motifs: ids(c.motifs), bas: ids(c.bas),
    chaussures: ids(c.chaussures), chapeaux: ids(c.chapeaux),
    accVisage: ids(c.accessoires.visage), accOreilles: ids(c.accessoires.oreilles),
    accDos: ids(c.accessoires.dos), accCou: ids(c.accessoires.cou),
  };
}
const CATALOGUE = charger();

// Valeurs utilisées quand un champ manque ou n'est pas valable.
const DEFAUT = {
  peau: '#e0ac69', yeux: '#2d6cdf', cheveux: '#4a2c17', coupe: 'courts', visage: null,
  haut: 'tshirt', hautC1: '#2fb5ff', hautC2: '#ffffff', motif: 'uni',
  bas: 'jean', basC: '#2b3a67', chaussures: 'baskets', chaussuresC: '#2a2a2a',
  chapeau: 'aucun', chapeauC: '#ff3b3b',
  accVisage: 'aucun', accOreilles: 'aucun', accDos: 'aucun', accCou: 'aucun', accC: '#2a2a2a',
};
const COULEURS = ['peau', 'yeux', 'cheveux', 'hautC1', 'hautC2', 'basC', 'chaussuresC', 'chapeauC', 'accC'];
const CHOIX = {
  coupe: 'coupes', haut: 'hauts', motif: 'motifs', bas: 'bas', chaussures: 'chaussures', chapeau: 'chapeaux',
  accVisage: 'accVisage', accOreilles: 'accOreilles', accDos: 'accDos', accCou: 'accCou',
};

// Renvoie une apparence propre (seulement les champs connus, valeurs vérifiées), ou null.
function valider(s) {
  if (!s || typeof s !== 'object' || Array.isArray(s)) return null;
  const res = { ...DEFAUT };
  for (const k of COULEURS) {
    if (typeof s[k] === 'string' && COULEUR.test(s[k].toLowerCase())) res[k] = s[k].toLowerCase();
  }
  for (const [k, liste] of Object.entries(CHOIX)) {
    if (typeof s[k] === 'string' && CATALOGUE[liste].has(s[k])) res[k] = s[k];
  }
  if (typeof s.visage === 'string' && VISAGE.test(s.visage.toLowerCase())) res.visage = s.visage.toLowerCase();
  return res;
}

// Stockage dans la base du site (une ligne par joueur, effacée avec le compte).
function stockage(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS fps_apparences (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    style   TEXT NOT NULL,
    maj     INTEGER NOT NULL
  )`);
  const lireReq = db.prepare('SELECT style FROM fps_apparences WHERE user_id = ?');
  const ecrireReq = db.prepare(`INSERT INTO fps_apparences (user_id, style, maj) VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET style = excluded.style, maj = excluded.maj`);
  return {
    lire(userId) {
      const r = lireReq.get(userId);
      if (!r) return null;
      try { return valider(JSON.parse(r.style)); } catch { return null; }
    },
    ecrire(userId, style) {
      const s = valider(style);
      if (!s) return null;
      ecrireReq.run(userId, JSON.stringify(s), Date.now());
      return s;
    },
  };
}

module.exports = { valider, stockage, DEFAUT };
