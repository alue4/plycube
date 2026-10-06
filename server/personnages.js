// Le personnage (en blocs) de chaque joueur, commun à tout le site : les jeux compatibles (Arena FPS,
// Caméléon...) l'affichent tous pareil. On le modifie dans « Mon personnage » (menu du site).
//
// Les règles (couleurs, coupes, vêtements permis, visage de 64 pixels jamais une photo) et la table de la base
// sont celles d'Arena FPS, qui a créé le personnage : games/fps/serveur/apparences.js et son catalogue.
const path = require('path');
const config = require('./config');

let module_ = null;  // games/fps/serveur/apparences.js
let stock = null;    // lecture / écriture dans la base

function preparer() {
  if (stock !== null) return stock;
  try {
    module_ = require(path.join(config.gamesDir, 'fps', 'serveur', 'apparences.js'));
    stock = module_.stockage(require('./db'));
  } catch (e) {
    console.error(`Personnages : indisponibles (${e.message})`);
    stock = false;
  }
  return stock;
}

module.exports = {
  // Apparence enregistrée d'un joueur (ou null : apparence par défaut)
  lire(userId) {
    const s = preparer();
    if (!s) return null;
    try { return s.lire(userId); } catch { return null; }
  },
  // Enregistre une apparence ; renvoie l'apparence propre, ou null si elle n'est pas valable
  ecrire(userId, style) {
    const s = preparer();
    return s ? s.ecrire(userId, style) : null;
  },
  valider(style) {
    preparer();
    return module_ ? module_.valider(style) : null;
  },
};
