// Mode classé : les points de rang de chaque joueur, enregistrés dans la base du site
// (une ligne par compte, effacée avec le compte) : le rang est le même sur tous ses appareils.
// C'est le serveur qui compte les points à la fin de chaque manche classée (pas le navigateur).
//   niveau = 1 + points / 50 (de 1 à 20) ; fin de manche : 1er +30, 2e +15, 3e +5, sinon −10 (jamais en dessous de 0).
const POINTS_PAR_NIVEAU = 50;
const NIVEAU_MAX = 20;
const GAINS = [30, 15, 5]; // 1er, 2e, 3e
const PERTE = -10;

const niveauDe = (points) => Math.min(NIVEAU_MAX, 1 + Math.floor(Math.max(0, points) / POINTS_PAR_NIVEAU));
const gainPourPlace = (place) => (GAINS[place - 1] !== undefined ? GAINS[place - 1] : PERTE);

function stockage(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS fps_classe (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    points  INTEGER NOT NULL DEFAULT 0,
    maj     INTEGER NOT NULL
  )`);
  const lireReq = db.prepare('SELECT points FROM fps_classe WHERE user_id = ?');
  const ecrireReq = db.prepare(`INSERT INTO fps_classe (user_id, points, maj) VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET points = excluded.points, maj = excluded.maj`);
  const lire = (userId) => {
    const r = lireReq.get(userId);
    return r ? Math.max(0, r.points | 0) : 0;
  };
  return {
    lire,
    // Ajoute (ou enlève) des points ; renvoie { avant, apres } (les points avant et après).
    ajouter(userId, gain) {
      const avant = lire(userId);
      const apres = Math.max(0, avant + gain);
      ecrireReq.run(userId, apres, Date.now());
      return { avant, apres };
    },
  };
}

module.exports = { stockage, niveauDe, gainPourPlace, POINTS_PAR_NIVEAU, NIVEAU_MAX };
