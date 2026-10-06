// Réglages du site, lus depuis les variables d'environnement
// (définies dans docker-compose.yml). Valeurs par défaut entre parenthèses.
const path = require('path');

const root = path.join(__dirname, '..');

module.exports = {
  root,
  // Port d'écoute (3000)
  port: parseInt(process.env.PORT || '3000', 10),
  // Adresse d'écoute dans le conteneur (0.0.0.0). Le docker-compose limite déjà l'accès à la machine.
  host: process.env.HOST || '0.0.0.0',
  // Dossier où vit la base SQLite (./data)
  dataDir: process.env.DATA_DIR || path.join(root, 'data'),
  gamesDir: process.env.GAMES_DIR || path.join(root, 'games'),
  publicDir: path.join(root, 'public'),
  // Cookies "Secure" : 'auto' = seulement quand la page est servie en HTTPS (via ton proxy),
  // 'true' = toujours (le site ne marchera alors qu'en HTTPS), 'false' = jamais.
  cookieSecure: (process.env.COOKIE_SECURE || 'auto').toLowerCase(),
  // Proxys de confiance (pour connaître la vraie adresse et le HTTPS derrière ton reverse proxy).
  trustProxy: process.env.TRUST_PROXY || 'loopback, linklocal, uniquelocal',
  // Durée d'une connexion avant de devoir se reconnecter (30 jours)
  sessionDays: parseInt(process.env.SESSION_DAYS || '30', 10),
  siteName: process.env.SITE_NAME || 'Plycube',
  // Adresse publique officielle du site (ex. https://plycube.fr). Seule sa page de connexion
  // peut apparaître dans Google ; vide = le site reste invisible des moteurs de recherche.
  publicUrl: (process.env.PUBLIC_URL || '').replace(/\/+$/, ''),
  // Anciennes adresses du site (ex. « jeux-sjdc.fr ») : renvoyées vers PUBLIC_URL (les anciennes affiches marchent encore).
  anciennesAdresses: (process.env.ANCIENNES_ADRESSES || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
};
