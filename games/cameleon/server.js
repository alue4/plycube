// Partie serveur de Caméléon (cache-cache en blocs), chargée automatiquement par le site au démarrage.
//
// Le navigateur se connecte en WebSocket sur /games/cameleon/ws (le site vérifie qu'il est connecté).
//   - le hall : liste des salons, créer un salon (avec une carte), rejoindre avec un code ;
//   - les salons eux-mêmes : voir serveur/salon.js (et serveur/bots.js pour les bots).
// Le personnage de chaque joueur est celui du site (« Mon personnage », commun à tous les jeux).
//
// Après une modification des réglages (public/reglages.json) ou des cartes : sudo docker compose restart
const fs = require('fs');
const path = require('path');
const { Salon } = require('./serveur/salon');

const MAX_SALONS = 30;
const LETTRES = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const ORDRE = ['maison', 'jardin', 'entrepot'];

module.exports = function ({ realtime, game, personnages }) {
  const lire = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, 'public', f), 'utf8'));
  const reglages = lire('reglages.json');
  const styleDe = (id) => (personnages ? personnages.lire(id) : null);

  const cartes = new Map();
  for (const f of fs.readdirSync(path.join(__dirname, 'public', 'cartes')).sort()) {
    if (!f.endsWith('.json')) continue;
    try {
      const c = lire(`cartes/${f}`);
      c.id = f.slice(0, -5);
      if (!Array.isArray(c.boites) || !Array.isArray(c.apparitions) || !c.apparitions.some((a) => a.role === 'chercheur')) throw new Error('boites ou apparitions manquantes');
      cartes.set(c.id, c);
    } catch (e) {
      console.error(`Caméléon : carte ${f} ignorée (${e.message})`);
    }
  }
  const listeCartes = [...cartes.values()]
    .sort((a, b) => ((ORDRE.indexOf(a.id) + 1) || 99) - ((ORDRE.indexOf(b.id) + 1) || 99))
    .map((c) => ({ id: c.id, nom: c.nom || c.id, description: c.description || '' }));
  const trouverCarte = (id) => cartes.get(String(id)) || cartes.get('maison') || cartes.values().next().value;

  const salons = new Map();
  const sockets = new Set();
  const parCompte = new Map();
  const envoyer = (ws, msg) => { if (ws.readyState === 1) ws.send(JSON.stringify(msg)); };
  const listeSalons = () => [...salons.values()].map((s) => s.infos());

  let annonce = null;
  function annoncerSalons() {
    if (annonce) return;
    annonce = setTimeout(() => {
      annonce = null;
      const msg = { t: 'salons', liste: listeSalons(), cartes: listeCartes };
      for (const ws of sockets) if (!ws.salon) envoyer(ws, msg);
    }, 300);
  }

  function nouveauCode() {
    for (;;) {
      let c = '';
      for (let i = 0; i < 4; i++) c += LETTRES[Math.floor(Math.random() * LETTRES.length)];
      if (!salons.has(c)) return c;
    }
  }

  function entrer(ws, salon) {
    if (salon.humains() >= salon.r.joueursMax && !salon.joueurs.has(ws.user.id)) return envoyer(ws, { t: 'erreur', message: 'Ce salon est plein.' });
    ws.salon = salon;
    ws.joueur = salon.ajouter(ws, ws.user);
    annoncerSalons();
    return undefined;
  }

  function quitter(ws) {
    if (!ws.salon) return;
    ws.salon.retirer(ws.user.id, ws);
    ws.salon = null;
    ws.joueur = null;
    annoncerSalons();
    envoyer(ws, { t: 'salons', liste: listeSalons(), cartes: listeCartes });
  }

  function message(ws, data) {
    if (ws.salon) {
      if (data.t === 'quitter') return quitter(ws);
      return ws.salon.message(ws.joueur, data);
    }
    if (data.t === 'creer') {
      if (salons.size >= MAX_SALONS) return envoyer(ws, { t: 'erreur', message: 'Trop de salons en cours, rejoins-en un !' });
      const code = nouveauCode();
      const salon = new Salon({
        code, carte: trouverCarte(data.carte), reglages, styleDe,
        surVide: (c) => { salons.delete(c); annoncerSalons(); },
      });
      salons.set(code, salon);
      entrer(ws, salon);
      if (data.seul) { // « Jouer avec des bots » : on commence tout de suite, avec le rôle choisi
        if (data.role === 'cacheur' || data.role === 'chercheur') salon.prefRoles.set(ws.user.id, data.role);
        salon.nouvelleManche();
      }
      return undefined;
    }
    if (data.t === 'rejoindre') {
      const salon = salons.get(String(data.code || '').toUpperCase().slice(0, 8));
      if (!salon) return envoyer(ws, { t: 'erreur', message: 'Ce salon n\'existe plus.' });
      return entrer(ws, salon);
    }
    if (data.t === 'salons') return envoyer(ws, { t: 'salons', liste: listeSalons(), cartes: listeCartes });
    return undefined;
  }

  realtime.gameSocket(game.id, { maxPayload: 48 * 1024 }, (ws, user) => {
    const ancien = parCompte.get(user.id);
    if (ancien) ancien.close(4000, 'ailleurs');
    parCompte.set(user.id, ws);
    sockets.add(ws);
    ws.salon = null;
    ws.compteur = 0;
    envoyer(ws, { t: 'salons', liste: listeSalons(), cartes: listeCartes, moi: { id: user.id, nom: user.username, admin: !!user.isAdmin }, style: styleDe(user.id) });
    ws.on('message', (raw) => {
      if (++ws.compteur > 80) return; // anti-abus : 80 messages par seconde au maximum
      let data;
      try { data = JSON.parse(raw); } catch { return; }
      if (!data || typeof data !== 'object' || typeof data.t !== 'string') return;
      try { message(ws, data); } catch (e) { console.error(`Caméléon : erreur (${data.t}) : ${e.message}`); }
    });
    ws.on('close', () => {
      sockets.delete(ws);
      if (parCompte.get(user.id) === ws) parCompte.delete(user.id);
      quitter(ws);
    });
  });
  setInterval(() => { for (const ws of sockets) ws.compteur = 0; }, 1000).unref();
};
