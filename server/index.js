// Point d'entrée du site : assemble toutes les pièces et démarre le serveur.
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const config = require('./config');
require('./db'); // crée / met à jour la base au démarrage
const auth = require('./auth');
const security = require('./security');
const realtime = require('./realtime');
const games = require('./games');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', config.trustProxy);

app.use(security.requestLogger);
app.use(security.securityHeaders);
app.use(express.json({ limit: '20kb' }));

// ---------- Moteurs de recherche ----------
// Seule la page de connexion, ouverte avec l'adresse publique (PUBLIC_URL), peut apparaître dans Google :
// tout le reste (pages des élèves, jeux, adresse Tailscale, adresse du réseau local) est marqué « noindex ».
let hotePublic = '';
try { hotePublic = config.publicUrl ? new URL(config.publicUrl).hostname : ''; } catch { console.warn(`PUBLIC_URL invalide : ${config.publicUrl}`); }
const surAdressePublique = (req) => !!hotePublic && req.hostname === hotePublic;
// Anciennes adresses (et leur « www. ») : renvoyées vers l'adresse officielle, même chemin.
const anciennes = new Set(config.anciennesAdresses.flatMap((h) => [h, `www.${h}`]));
app.use((req, res, next) => {
  const get = req.method === 'GET' || req.method === 'HEAD';
  if (hotePublic && get && anciennes.has(String(req.hostname).toLowerCase())) return res.redirect(301, config.publicUrl + req.originalUrl);
  // www.adresse -> adresse (une seule adresse pour Google)
  if (hotePublic && req.hostname === `www.${hotePublic}` && req.method === 'GET') return res.redirect(301, config.publicUrl + req.originalUrl);
  const visible = surAdressePublique(req) && (req.path === '/' || req.path === '/connexion');
  if (!visible) res.set('X-Robots-Tag', 'noindex, nofollow');
  if (req.path === '/connexion' && config.publicUrl) res.set('Link', `<${config.publicUrl}/connexion>; rel="canonical"`);
  next();
});
app.get('/robots.txt', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300'); // Cloudflare ne le garde que 5 minutes (sinon une ancienne version reste des heures)
  res.type('text/plain').send(surAdressePublique(req)
    ? `User-agent: *\nDisallow: /api/\n\nSitemap: ${config.publicUrl}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n');
});
app.get('/sitemap.xml', (req, res, next) => {
  if (!surAdressePublique(req)) return next();
  res.set('Cache-Control', 'public, max-age=300');
  res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + `  <url><loc>${config.publicUrl}/connexion</loc></url>\n</urlset>\n`);
});
app.use(auth.loadUser);

// ---------- API ----------
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', security.sameOriginOnly);
app.use('/api/auth', require('./routes/auth').router);
app.use('/api/friends', require('./routes/friends'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api', require('./routes/community'));
app.use('/api', (req, res) => res.status(404).json({ error: 'Adresse inconnue.' }));

// ---------- Fichiers du site ----------
app.use('/assets', express.static(path.join(config.publicDir, 'assets'), { maxAge: '1h', dotfiles: 'deny' }));

// Pages : on vérifie la connexion avant de les envoyer.
const pages = {
  '/': { file: 'index.html', access: 'user' },
  '/amis': { file: 'amis.html', access: 'user' },
  '/suggestions': { file: 'suggestions.html', access: 'user' },
  '/compte': { file: 'compte.html', access: 'user' },
  '/admin': { file: 'admin.html', access: 'admin' },
  '/connexion': { file: 'connexion.html', access: 'guest' },
  '/inscription': { file: 'inscription.html', access: 'guest' },
};
for (const [route, page] of Object.entries(pages)) {
  app.get(route, (req, res) => {
    if (page.access === 'guest' && req.user) return res.redirect('/');
    if (page.access !== 'guest' && !req.user) return res.redirect('/connexion');
    if (page.access === 'admin' && !req.user.isAdmin) return res.redirect('/');
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(config.publicDir, page.file));
  });
}

// « Mon personnage » (menu du site) : le personnage est commun à tous les jeux compatibles ; on le modifie
// dans l'atelier d'Arena FPS, puis on revient sur le site.
app.get('/personnage', (req, res) => {
  if (!req.user) return res.redirect('/connexion');
  res.redirect('/games/fps/?personnage=1&retour=/');
});

// Jeux : chaque jeu sert son dossier games/<id>/public sur /games/<id>/.
// L'image de couverture est visible par tous ; le jeu lui-même demande d'être connecté
// et que son statut soit "beta" ou "disponible" (l'admin peut tester un jeu "bientot").
app.use('/games/:id', (req, res, next) => {
  const game = games.getGame(req.params.id);
  if (!game) return next();
  const dir = path.join(config.gamesDir, game.id, 'public');
  const isPage = req.path === '/' || req.path.endsWith('.html');
  if (isPage) {
    if (!req.user) return res.redirect('/connexion');
    if (!game.playable && !req.user.isAdmin) return res.redirect('/');
  }
  // Les fichiers du jeu sont toujours revérifiés (mises à jour visibles tout de suite),
  // sauf les gros fichiers qui ne changent presque jamais (moteur 3D, sons).
  const rarementModifie = /^\/(vendor|sons)\//.test(req.path);
  express.static(dir, { dotfiles: 'deny', maxAge: rarementModifie ? '1d' : 0 })(req, res, next);
});
app.get('/games/:id', (req, res, next) => (games.getGame(req.params.id) ? res.redirect(`/games/${req.params.id}/`) : next()));

// ---------- Logique serveur des jeux (facultatif) ----------
// Si games/<id>/server.js existe, on l'appelle avec les outils de la plateforme.
for (const g of games.getGames()) {
  const file = path.join(config.gamesDir, g.id, 'server.js');
  if (fs.existsSync(file)) {
    try {
      require(file)({ app, realtime, friends: require('./friends'), auth, security, db: require('./db'), game: g, personnages: require('./personnages') });
      games.marquerServeur(g.id);
      console.log(`Jeu chargé : ${g.id}`);
    } catch (e) {
      console.error(`Impossible de charger le serveur du jeu ${g.id} : ${e.message}`);
    }
  }
}

app.get('/favicon.ico', (req, res) => res.sendFile(path.join(config.publicDir, 'assets/img/favicon.svg'), {
  headers: { 'Content-Type': 'image/svg+xml' },
}));

app.use((req, res) => res.status(404).sendFile(path.join(config.publicDir, '404.html')));

// Erreur inattendue : on répond poliment sans détails techniques.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Requête mal formée.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Requête trop grosse.' });
  console.error(`Erreur serveur sur ${req.method} ${req.path} : ${err.message}`);
  res.status(500).json({ error: 'Erreur du serveur.' });
});

const server = http.createServer(app);
realtime.attach(server);

if (require.main === module) {
  server.listen(config.port, config.host, () => {
    console.log(`${config.siteName} démarré sur le port ${config.port}`);
  });
  const stop = () => { console.log('Arrêt du site...'); server.close(() => process.exit(0)); setTimeout(() => process.exit(0), 3000).unref(); };
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}

module.exports = { app, server };
