// Partie serveur du jeu FPS, chargée automatiquement par le site au démarrage.
//
// Le navigateur se connecte en WebSocket sur /games/fps/ws (le site vérifie qu'il
// est connecté). On y trouve :
//   - le hall : liste des parties, créer une partie (mode + carte), rejoindre avec un code ;
//   - les parties elles-mêmes (voir serveur/partie.js).
// Et, en HTTP, ce qui est fait dans l'atelier d'animations : animations des armes (serveur/animations.js),
// danses (serveur/danses.js) et sons envoyés par l'admin (serveur/sons-perso.js).
//
// Après une modification des réglages (public/reglages.json) ou de la carte :
//   sudo docker compose restart
const fs = require('fs');
const path = require('path');
const { Partie } = require('./serveur/partie');
const apparences = require('./serveur/apparences');
const animations = require('./serveur/animations');
const sonsPerso = require('./serveur/sons-perso');
const dansesPerso = require('./serveur/danses');
const cartesPersoMod = require('./serveur/cartes');

const MAX_PARTIES = 30;
const LETTRES = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // sans I ni O (trop proches de 1 et 0)

module.exports = function ({ app, realtime, game, db, auth, security }) {
  // Apparences des personnages (enregistrées dans la base du site)
  // Si le site ne nous donne pas sa base (ancienne version du site), on la cherche nous-mêmes.
  let base = db;
  if (!base) {
    try { base = require(path.join(__dirname, '..', '..', 'server', 'db.js')); } catch { base = null; }
  }
  let stock = null;
  try {
    stock = base ? apparences.stockage(base) : null;
  } catch (e) {
    console.error(`FPS : impossible de préparer l'enregistrement des personnages (${e.message})`);
  }
  if (!stock) console.error('FPS : les personnages ne pourront pas être enregistrés (base de données introuvable).');
  const styleDe = (id) => (stock ? stock.lire(id) : null);

  const lire = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, 'public', f), 'utf8'));
  const reglages = lire('reglages.json');

  // Toutes les cartes du dossier public/cartes (une carte = un fichier .json).
  const cartes = new Map();
  for (const f of fs.readdirSync(path.join(__dirname, 'public', 'cartes')).sort()) {
    if (!f.endsWith('.json')) continue;
    try {
      const c = lire(`cartes/${f}`);
      c.id = f.slice(0, -5);
      if (!Array.isArray(c.boites) || !Array.isArray(c.apparitions) || !c.apparitions.length) throw new Error('boites ou apparitions manquantes');
      cartes.set(c.id, c);
    } catch (e) {
      console.error(`FPS : carte ${f} ignorée (${e.message})`);
    }
  }
  const ORDRE = ['arene', 'chateau', 'ville', 'ile', 'arene_xxl', 'chateau_xxl', 'ville_xxl', 'ile_xxl'];
  const cartesDuJeu = [...cartes.values()]
    .sort((a, b) => ((ORDRE.indexOf(a.id) + 1) || 99) - ((ORDRE.indexOf(b.id) + 1) || 99))
    .map((c) => ({ id: c.id, nom: c.nom || c.id, description: c.description || '' }));
  // Cartes faites par l'admin dans l'éditeur (data/fps-cartes.json), ajoutées à la suite.
  const cartesPerso = cartesPersoMod.stockage();
  const listeCartes = () => [...cartesDuJeu, ...cartesPerso.infos()];
  // La carte à jouer : d'abord les cartes du jeu, puis les cartes perso, sinon l'arène.
  const trouverCarte = (id) => cartes.get(String(id)) || cartesPerso.jouable(String(id)) || cartes.get('arene') || cartes.values().next().value;

  // Atelier d'animations : sons envoyés par l'admin (data/fps-sons), animations des armes
  // (data/fps-animations.json) et danses (data/fps-danses.json).
  const sons = sonsPerso.stockage();
  const sonsDuJeu = new Set();
  try {
    for (const f of fs.readdirSync(path.join(__dirname, 'public', 'sons'))) if (f.endsWith('.mp3')) sonsDuJeu.add(f.slice(0, -4));
  } catch { /* pas de sons */ }
  const sonConnu = (nom) => sonsDuJeu.has(nom) || (nom.startsWith('perso:') && sons.existe(nom.slice(6)));
  const anims = animations.stockage({ reglages, sonConnu });
  const danses = dansesPerso.stockage({ sonConnu });
  // les joueurs déjà connectés reçoivent tout de suite ce que l'admin vient d'enregistrer
  const annoncer = (msg) => () => { const m = msg(); for (const ws of sockets) envoyer(ws, m); };
  if (app && auth) {
    animations.routes({ app, auth, security, anims, annoncer: annoncer(() => ({ t: 'animations', animations: anims.tout() })) });
    dansesPerso.routes({ app, auth, security, danses, annoncer: annoncer(() => ({ t: 'danses', danses: danses.tout() })) });
    sonsPerso.routes({ app, auth, security, sons, annoncer: () => {} });
    cartesPersoMod.routes({ app, auth, security, cartes: cartesPerso, annoncer: () => annoncerSalons() });
  }

  const parties = new Map();        // code -> Partie
  const sockets = new Set();        // toutes les connexions
  const parCompte = new Map();      // id du compte -> sa connexion (une seule à la fois)

  function envoyer(ws, msg) {
    if (ws.readyState === 1) ws.send(JSON.stringify(msg));
  }

  const listeSalons = () => [...parties.values()].map((p) => p.infos());

  // Les joueurs dans le hall voient la liste des parties se mettre à jour.
  let annonce = null;
  function annoncerSalons() {
    if (annonce) return;
    annonce = setTimeout(() => {
      annonce = null;
      const msg = { t: 'salons', liste: listeSalons(), cartes: listeCartes() };
      for (const ws of sockets) if (!ws.partie) envoyer(ws, msg);
    }, 300);
  }

  function nouveauCode() {
    for (;;) {
      let c = '';
      for (let i = 0; i < 4; i++) c += LETTRES[Math.floor(Math.random() * LETTRES.length)];
      if (!parties.has(c)) return c;
    }
  }

  function entrer(ws, partie) {
    if (partie.humains() >= partie.max && !partie.joueurs.has(ws.user.id)) { // les bots laissent leur place
      return envoyer(ws, { t: 'erreur', message: 'Cette partie est pleine.' });
    }
    ws.partie = partie;
    ws.joueur = partie.ajouter(ws, ws.user, styleDe(ws.user.id));
    annoncerSalons();
  }

  function quitter(ws) {
    if (!ws.partie) return;
    ws.partie.retirer(ws.user.id, ws);
    ws.partie = null;
    ws.joueur = null;
    annoncerSalons();
    envoyer(ws, { t: 'salons', liste: listeSalons(), cartes: listeCartes() });
  }

  function message(ws, data) {
    // Enregistrer son personnage (possible depuis le hall ou en partie ; visible à la prochaine partie)
    if (data.t === 'sauverStyle') {
      const now = Date.now();
      if (!stock) return envoyer(ws, { t: 'erreur', message: 'Le serveur ne peut pas enregistrer les personnages pour l\'instant (il doit être mis à jour).' });
      if (now - (ws.dernierStyle || 0) < 2000) return envoyer(ws, { t: 'erreur', message: 'Attends un peu avant d\'enregistrer à nouveau.' });
      ws.dernierStyle = now;
      let style = null;
      try { style = stock.ecrire(ws.user.id, data.style); } catch (e) {
        console.error(`FPS : erreur d'enregistrement d'un personnage (${e.message})`);
        return envoyer(ws, { t: 'erreur', message: 'Erreur du serveur pendant l\'enregistrement. Réessaie.' });
      }
      if (!style) return envoyer(ws, { t: 'erreur', message: 'Ce personnage n\'est pas valable.' });
      return envoyer(ws, { t: 'styleSauve', style });
    }
    if (ws.partie) {
      if (data.t === 'quitter') return quitter(ws);
      return ws.partie.message(ws.joueur, data);
    }
    if (data.t === 'creer') {
      const mode = data.mode === 'equipes' ? 'equipes' : 'solo';
      if (parties.size >= MAX_PARTIES) return envoyer(ws, { t: 'erreur', message: 'Trop de parties en cours, rejoins-en une !' });
      const carte = trouverCarte(data.carte);
      const code = nouveauCode();
      const partie = new Partie({
        code, mode, reglages, carte, danseExiste: (id) => danses.existe(id),
        surVide: (c) => { parties.delete(c); annoncerSalons(); },
      });
      parties.set(code, partie);
      return entrer(ws, partie);
    }
    if (data.t === 'rejoindre') {
      const code = String(data.code || '').toUpperCase().slice(0, 8);
      const partie = parties.get(code);
      if (!partie) return envoyer(ws, { t: 'erreur', message: 'Cette partie n\'existe plus.' });
      return entrer(ws, partie);
    }
    if (data.t === 'salons') return envoyer(ws, { t: 'salons', liste: listeSalons(), cartes: listeCartes() });
    return undefined;
  }

  realtime.gameSocket(game.id, { maxPayload: 4096 }, (ws, user) => {
    // Un seul onglet de jeu par compte : l'ancien est fermé.
    const ancien = parCompte.get(user.id);
    if (ancien) ancien.close(4000, 'ailleurs');
    parCompte.set(user.id, ws);
    sockets.add(ws);
    ws.partie = null;
    ws.compteur = 0;
    envoyer(ws, { t: 'salons', liste: listeSalons(), cartes: listeCartes(), moi: { id: user.id, nom: user.username } });
    envoyer(ws, { t: 'monStyle', style: styleDe(user.id) });

    ws.on('message', (raw) => {
      // Anti-abus : 120 messages par seconde au maximum.
      if (++ws.compteur > 120) return;
      let data;
      try { data = JSON.parse(raw); } catch { return; }
      if (!data || typeof data !== 'object' || typeof data.t !== 'string') return;
      try { message(ws, data); } catch (e) { console.error(`FPS : erreur (${data.t}) : ${e.message}`); }
    });

    ws.on('close', () => {
      sockets.delete(ws);
      if (parCompte.get(user.id) === ws) parCompte.delete(user.id);
      quitter(ws);
    });
  });

  setInterval(() => { for (const ws of sockets) ws.compteur = 0; }, 1000).unref();
};
