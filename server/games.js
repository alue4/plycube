// Catalogue des jeux : chaque dossier games/<id>/ contient un manifest.json.
//
// games/<id>/
//   manifest.json   -> nom, description, image, statut... (obligatoire)
//                      bandeAnnonce (facultatif) : { "boucle": "court.mp4", "complete": "long.mp4" }
//                      -> la boucle muette tourne dans la carte du jeu, la complète s'ouvre au clic
//   public/         -> fichiers servis au navigateur sur /games/<id>/ (image, index.html du jeu...)
//   server.js       -> (facultatif, plus tard) logique serveur du jeu, voir README
const fs = require('fs');
const path = require('path');
const config = require('./config');

const STATUSES = ['bientot', 'beta', 'disponible', 'maintenance'];
const ID_RE = /^[a-z0-9][a-z0-9-]{0,31}$/;

let cache = null;
// Jeux dont la partie serveur (games/<id>/server.js) a bien été chargée au démarrage du site.
// Un jeu peut dire « statutAvecServeur » dans son manifeste : ce statut ne s'applique que si son serveur
// tourne (ex. un nouveau jeu reste « bientot » tant que le site n'a pas été redémarré).
const serveursCharges = new Set();
function marquerServeur(id) { serveursCharges.add(id); cache = null; }

function loadGames() {
  const games = [];
  let dirs = [];
  try { dirs = fs.readdirSync(config.gamesDir, { withFileTypes: true }); } catch { return games; }
  for (const d of dirs) {
    if (!d.isDirectory() || !ID_RE.test(d.name)) continue;
    const file = path.join(config.gamesDir, d.name, 'manifest.json');
    try {
      const m = JSON.parse(fs.readFileSync(file, 'utf8'));
      let status = STATUSES.includes(m.statut) ? m.statut : 'bientot';
      if (STATUSES.includes(m.statutAvecServeur) && serveursCharges.has(d.name)) status = m.statutAvecServeur;
      // Un fichier du dossier public/ du jeu (nom simple, sans remonter dans les dossiers)
      const fichier = (nom) => (typeof nom === 'string' && /^[\w.-]{1,80}$/.test(nom) && !nom.startsWith('.')
        ? `/games/${d.name}/${nom}` : null);
      const ba = m.bandeAnnonce && typeof m.bandeAnnonce === 'object' ? m.bandeAnnonce : {};
      games.push({
        id: d.name,
        name: String(m.nom || d.name).slice(0, 60),
        description: String(m.description || '').slice(0, 400),
        // L'image est un fichier du dossier public/ du jeu.
        image: m.image ? `/games/${d.name}/${String(m.image).replace(/^\/+/, '')}` : null,
        trailerLoop: fichier(ba.boucle),
        trailer: fichier(ba.complete),
        status,
        tags: Array.isArray(m.tags) ? m.tags.map(String).slice(0, 6) : [],
        players: m.joueurs ? String(m.joueurs).slice(0, 30) : '',
        order: Number.isFinite(m.ordre) ? m.ordre : 100,
        playable: status === 'beta' || status === 'disponible',
        url: `/games/${d.name}/`,
      });
    } catch (e) {
      console.error(`Manifeste invalide pour le jeu "${d.name}" : ${e.message}`);
    }
  }
  return games.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

// Le catalogue est relu au plus toutes les 10 secondes : tu peux modifier un
// manifest.json sans redémarrer le site.
let cacheTime = 0;
function getGames() {
  if (!cache || Date.now() - cacheTime > 10000) {
    cache = loadGames();
    cacheTime = Date.now();
  }
  return cache;
}

function getGame(id) {
  return getGames().find((g) => g.id === id) || null;
}

module.exports = { getGames, getGame, ID_RE, marquerServeur };
