#!/usr/bin/env node
// Test automatique de bout en bout : lance un serveur avec une base temporaire
// (ta vraie base n'est jamais touchée) et vérifie toutes les fonctions du site.
//   Dans Docker :  docker compose exec site node scripts/test.js
//   Sans Docker :  npm test
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const WebSocket = require('ws');

const ROOT = path.join(__dirname, '..');
const DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'arcade-test-'));
const PORT = 3900 + Math.floor(Math.random() * 90);
const BASE = `http://127.0.0.1:${PORT}`;
// Dossier de jeux de test : une copie du FPS (bientôt disponible) + un faux jeu jouable.
const GAMES = path.join(DATA, 'games');
fs.cpSync(path.join(ROOT, 'games/fps'), path.join(GAMES, 'fps'), { recursive: true });
// Dans la copie de test, le FPS est « bientôt disponible » (seul l'admin peut l'ouvrir),
// quel que soit son statut réel : on vérifie ainsi les règles d'accès.
{
  const fichier = path.join(GAMES, 'fps/manifest.json');
  const m = JSON.parse(fs.readFileSync(fichier, 'utf8'));
  m.statut = 'bientot';
  fs.writeFileSync(fichier, JSON.stringify(m));
}
// Caméléon : il est « bientôt » dans son manifeste, mais « bêta » dès que son serveur est chargé (statutAvecServeur)
fs.cpSync(path.join(ROOT, 'games/cameleon'), path.join(GAMES, 'cameleon'), { recursive: true });
fs.mkdirSync(path.join(GAMES, 'test-jeu/public'), { recursive: true });
fs.writeFileSync(path.join(GAMES, 'test-jeu/manifest.json'), JSON.stringify({ nom: 'Jeu de test', statut: 'beta' }));
const ENV = { ...process.env, DATA_DIR: DATA, GAMES_DIR: GAMES, PORT: String(PORT), COOKIE_SECURE: 'auto', PUBLIC_URL: 'https://jeux-sjdc.exemple', ANCIENNES_ADRESSES: 'ancien-site.exemple', NODE_NO_WARNINGS: '1' };

let passed = 0;
let failed = 0;
function check(name, cond, extra) {
  if (cond) { passed++; console.log('  ✓ ' + name); }
  else { failed++; console.log('  ✗ ' + name + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); }
}

// Petit client HTTP qui garde son cookie, comme un navigateur.
function client() {
  let cookie = '';
  return {
    get cookie() { return cookie; },
    async req(method, url, body, headers = {}) {
      const h = { Origin: BASE, ...headers };
      if (cookie) h.Cookie = cookie;
      if (body !== undefined && !h['Content-Type']) h['Content-Type'] = 'application/json';
      const res = await fetch(BASE + url, {
        method, headers: h, redirect: 'manual',
        body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)),
      });
      const set = res.headers.get('set-cookie');
      if (set) cookie = set.split(';')[0].endsWith('=') ? '' : set.split(';')[0];
      let data = null;
      try { data = await res.json(); } catch { /* pas du JSON */ }
      return { status: res.status, data, headers: res.headers };
    },
  };
}

function wsConnect(c) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://127.0.0.1:${PORT}/ws`, { headers: { Cookie: c.cookie, Origin: BASE } });
    ws.messages = [];
    ws.on('message', (m) => ws.messages.push(JSON.parse(m)));
    ws.on('open', () => resolve(ws));
    ws.on('error', reject);
  });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(ws, type, ms = 2000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const i = ws.messages.findIndex((m) => m.type === type);
    if (i >= 0) return ws.messages.splice(i, 1)[0];
    await wait(20);
  }
  return null;
}

function cli(args, input) {
  return spawnSync(process.execPath, [path.join(ROOT, 'scripts/admin.js'), ...args], { env: ENV, input: input || '', encoding: 'utf8' });
}

// Vérification des apparences (personnalisation des personnages)
function testerApparences() {
  const { valider } = require(path.join(ROOT, 'games/fps/serveur/apparences.js'));
  check('apparence : un objet invalide est refusé', valider('coucou') === null && valider(null) === null && valider([1]) === null);
  const v = valider({ cheveux: '<script>', coupe: 'n\'importe quoi', visage: 'abc', chapeau: 'cowboy', accDos: 'cape' });
  check('apparence : les valeurs inconnues sont remplacées', v.cheveux === '#4a2c17' && v.coupe === 'courts' && v.visage === null && v.chapeau === 'cowboy' && v.accDos === 'cape', v);
  check('apparence : le visage ne contient que 64 pixels de couleur', valider({ visage: '00ff00'.repeat(64) }).visage.length === 384
    && valider({ visage: `${'00ff00'.repeat(63)}zzzzzz` }).visage === null);
}

// Teste la logique d'une partie de FPS directement, avec de faux joueurs,
// sur une petite carte de test (indépendante des vraies cartes).
function testerDanses() {
  const { Partie } = require(path.join(ROOT, 'games/fps/serveur/partie.js'));
  const reglages = JSON.parse(fs.readFileSync(path.join(ROOT, 'games/fps/public/reglages.json'), 'utf8'));
  const carte = { id: 'test', nom: 'Test', taille: 20, boites: [[-20, -1, -20, 20, 0, 20, 'herbe']], apparitions: [{ x: -5, z: 0, angle: 0 }, { x: 5, z: 0, angle: 0 }] };
  const fauxWs = () => ({ readyState: 1, recus: [], send(x) { this.recus.push(JSON.parse(x)); } });
  const p = new Partie({ code: 'DANS', mode: 'solo', reglages, carte, surVide: () => {}, danseExiste: (id) => id === 'dtest1234' });
  clearInterval(p.timer);
  const wa = fauxWs(); const wb = fauxWs();
  const a = p.ajouter(wa, { id: 1, username: 'Danseur' });
  p.ajouter(wb, { id: 2, username: 'Spectateur' });
  const EQ = { principale: 'fusil', secondaire: 'pistolet', melee: 'couteau', gadget: 'grenade' };
  p.message(a, { t: 'equipement', e: EQ });
  wb.recus.length = 0;
  p.message(a, { t: 'danse', d: 'dinconnue1' });
  check('danse : une danse qui n\'existe pas est refusée', !wb.recus.some((m) => m.t === 'danse'));
  p.message(a, { t: 'danse', d: 'dtest1234' });
  check('danse : les autres joueurs voient la danse', wb.recus.some((m) => m.t === 'danse' && m.id === 1 && m.d === 'dtest1234'));
  check('danse : celui qui arrive pendant la danse la voit aussi', p.infosPubliques(a).danse === 'dtest1234');
  a.derniereDanse = 0;
  wb.recus.length = 0;
  p.message(a, { t: 'tir', a: a.arme, d: [0, 0, -1], o: [a.x, a.y + 1.62, a.z], e: 1, s: 1 });
  check('danse : tirer arrête la danse', !a.danse && wb.recus.some((m) => m.t === 'danse' && m.id === 1 && m.d === null));
  clearInterval(p.timer);
}

function testerPouvoirs() {
  const { Partie } = require(path.join(ROOT, 'games/fps/serveur/partie.js'));
  const reglages = JSON.parse(fs.readFileSync(path.join(ROOT, 'games/fps/public/reglages.json'), 'utf8'));
  const carte = { id: 'test', nom: 'Test', taille: 40, boites: [[-40, -1, -40, 40, 0, 40, 'herbe']], apparitions: [{ x: -5, z: 0, angle: 0 }, { x: 5, z: 0, angle: 0 }] };
  const fauxWs = () => ({ readyState: 1, recus: [], send(x) { this.recus.push(JSON.parse(x)); } });
  const p = new Partie({ code: 'POUV', mode: 'solo', reglages, carte, surVide: () => {} });
  clearInterval(p.timer);
  const EQ = { principale: 'fusil', secondaire: 'pistolet', melee: 'couteau', gadget: 'grenade' };
  const eleve = p.ajouter(fauxWs(), { id: 1, username: 'Eleve', isAdmin: false });
  const chef = p.ajouter(fauxWs(), { id: 2, username: 'Chef', isAdmin: true });
  for (const j of [eleve, chef]) p.message(j, { t: 'equipement', e: EQ });
  p.message(eleve, { t: 'pouvoirs', vol: true, precision: true });
  p.message(chef, { t: 'pouvoirs', vol: true, precision: true });
  check('pouvoirs : un élève ne peut pas s\'en donner', !eleve.pouvoirs.vol && !eleve.pouvoirs.precision);
  check('pouvoirs : l\'admin peut voler et viser parfaitement', chef.pouvoirs.vol && chef.pouvoirs.precision);
  // monter de 15 m d'un coup : refusé pour l'élève, accepté pour l'admin qui vole
  for (const j of [eleve, chef]) { j.derniereMaj = Date.now() - 100; j.dernierCorr = 0; p.message(j, { t: 'm', p: [j.x, j.y + 15, j.z], r: [0, 0], v: j.vie }); }
  check('pouvoirs : l\'élève ne peut pas voler (le serveur le remet en place)', eleve.y < 1);
  check('pouvoirs : l\'admin qui vole peut monter', chef.y > 14);
  // munitions infinies : l'admin tire sans rien perdre, pas l'élève
  p.message(chef, { t: 'pouvoirs', vol: false, precision: false, munitions: true });
  p.message(eleve, { t: 'pouvoirs', munitions: true });
  for (const j of [eleve, chef]) {
    j.munitions[j.arme] = 1; j.dernierTir[j.arme] = 0; j.pretA = 0;
    p.message(j, { t: 'tir', a: j.arme, d: [0, 0, -1], o: [j.x, j.y + 1.62, j.z], e: 1, s: 1 });
  }
  check('pouvoirs : munitions infinies pour l\'admin seulement', chef.munitions[chef.arme] === 1 && eleve.munitions[eleve.arme] === 0, [chef.munitions[chef.arme], eleve.munitions[eleve.arme]]);
  clearInterval(p.timer);
}

function testerLaser() {
  const { Partie } = require(path.join(ROOT, 'games/fps/serveur/partie.js'));
  const reglages = JSON.parse(fs.readFileSync(path.join(ROOT, 'games/fps/public/reglages.json'), 'utf8'));
  // sol (enfoncé sous 0), un mur devant le joueur, et un mur haut ancré dans le sol (comme les remparts du château)
  const carte = {
    id: 'test', nom: 'Test', taille: 40,
    boites: [[-40, -1, -40, 40, 0, 40, 'herbe'], [-3, 0, -6, 3, 3, -5, 'brique'], [-3, -3, 5, 3, 6, 6, 'pierre_chateau']],
    apparitions: [{ x: 0, z: 0, angle: 0 }, { x: 10, z: 10, angle: 0 }],
  };
  const fauxWs = () => ({ readyState: 1, recus: [], send(x) { this.recus.push(JSON.parse(x)); } });
  const p = new Partie({ code: 'LASR', mode: 'solo', reglages, carte, surVide: () => {} });
  clearInterval(p.timer);
  const EQ = { principale: 'laser', secondaire: 'pistolet', melee: 'couteau', gadget: 'grenade' };
  const eleve = p.ajouter(fauxWs(), { id: 1, username: 'Eleve', isAdmin: false });
  const chef = p.ajouter(fauxWs(), { id: 2, username: 'Chef', isAdmin: true });
  p.message(eleve, { t: 'equipement', e: EQ });
  p.message(chef, { t: 'equipement', e: EQ });
  check('laser : un élève ne peut pas l\'équiper', !eleve.equipement);
  check('laser : l\'admin peut l\'équiper', !!chef.equipement && p.armes[chef.equipement[0]].id === 'laser');
  const tirer = (d, oeil) => {
    chef.x = oeil[0]; chef.y = oeil[1]; chef.z = oeil[2];
    chef.dernierTir[chef.arme] = 0; chef.pretA = 0;
    p.message(chef, { t: 'tir', a: chef.arme, d, o: [chef.x, chef.y + 1.62, chef.z], ch: 1 });
  };
  // 1) tir à pleine charge droit dans le sol : rien ne casse
  tirer([0, -1, 0], [0, 0, 0]);
  check('laser : il ne casse pas le sol', !p.casse.has(0), [...p.casse.keys()]);
  // 2) tir sur le mur devant : le mur casse, toujours pas le sol
  tirer([0, 0, -1], [0, 0, 0]);
  check('laser : il casse un mur', p.casse.has(1), [...p.casse.keys()]);
  check('laser : le sol reste là même à côté du mur cassé', !p.casse.has(0));
  // 3) un grand mur ancré dans le sol (comme les remparts) reste cassable
  tirer([0, 0, 1], [0, 0, 0]);
  check('laser : un rempart haut ancré dans le sol reste cassable', p.casse.has(2), [...p.casse.keys()]);
  // 4) tout revient après le temps de réparation
  p.reparerBoites(Date.now() + 60000);
  check('laser : les blocs cassés réapparaissent', p.casse.size === 0 && p.boites.length === 3);
}

// Les nouveaux pouvoirs d'admin (vérifiés par le serveur) : look, invincible, one shot, vampire, régénération,
// actions (soin, bots), frappe orbitale, balles explosives, tir rapide, super vitesse, bots figés.
function testerPouvoirsAdmin() {
  const { Partie } = require(path.join(ROOT, 'games/fps/serveur/partie.js'));
  const reglages = JSON.parse(fs.readFileSync(path.join(ROOT, 'games/fps/public/reglages.json'), 'utf8'));
  const carte = { id: 'test', nom: 'Test', taille: 60, boites: [[-60, -1, -60, 60, 0, 60, 'herbe']], apparitions: [{ x: -5, z: 0, angle: 0 }, { x: 5, z: 0, angle: 0 }] };
  const fauxWs = () => ({ readyState: 1, recus: [], send(x) { this.recus.push(JSON.parse(x)); } });
  const p = new Partie({ code: 'ADMN', mode: 'solo', reglages, carte, surVide: () => {} });
  clearInterval(p.timer);
  const EQ = { principale: 'fusil', secondaire: 'pistolet', melee: 'couteau', gadget: 'grenade' };
  const we = fauxWs(); const wc = fauxWs();
  const eleve = p.ajouter(we, { id: 1, username: 'Eleve', isAdmin: false });
  const chef = p.ajouter(wc, { id: 2, username: 'Chef', isAdmin: true });
  for (const j of [eleve, chef]) p.message(j, { t: 'equipement', e: EQ });
  p.etat = 'jeu'; p.finA = Date.now() + 1e6; // vraie partie : les dégâts comptent
  const MAX = reglages.joueur.pointsDeVie;
  const reset = () => { for (const j of [eleve, chef]) { j.pv = MAX; j.vivant = true; j.protegeJusqua = 0; } };
  // look : visible par tous
  we.recus.length = 0;
  p.message(eleve, { t: 'pouvoirs', geant: true, invincible: true });
  check('admin : un élève ne peut pas devenir géant ni invincible', !eleve.pouvoirs.geant && !eleve.pouvoirs.invincible && !we.recus.some((m) => m.t === 'look'));
  p.message(chef, { t: 'pouvoirs', geant: true, mini: true, arcEnCiel: true });
  check('admin : géant + arc-en-ciel annoncés à tout le monde (pas mini en même temps)', we.recus.some((m) => m.t === 'look' && m.id === 2 && m.l === 9) && p.infosPubliques(chef).l === 9);
  // invincible
  reset();
  p.message(chef, { t: 'pouvoirs', invincible: true });
  p.infliger(eleve, chef, 80, false, [0, 0, -1], eleve.arme);
  check('admin : invincible, il ne perd pas de vie', chef.pv === MAX);
  // one shot
  reset();
  p.message(chef, { t: 'pouvoirs', oneShot: true });
  p.infliger(chef, eleve, 10, false, [0, 0, -1], chef.arme);
  check('admin : one shot élimine d\'un coup', !eleve.vivant);
  // vampire
  reset();
  p.message(chef, { t: 'pouvoirs', vampire: true });
  chef.pv = 50;
  p.infliger(chef, eleve, 40, false, [0, 0, -1], chef.arme);
  check('admin : vampire, la moitié des dégâts revient en vie', chef.pv === 70, chef.pv);
  // régénération
  reset();
  p.message(chef, { t: 'pouvoirs', regen: true });
  chef.pv = 30; p.tickNo = 9; p.tick();
  check('admin : régénération, la vie remonte toute seule', chef.pv === 38, chef.pv);
  // actions : soin (admin seulement), bots en plus
  reset();
  chef.pv = 10; eleve.pv = 10;
  p.message(eleve, { t: 'admin', a: 'soin' });
  p.message(chef, { t: 'admin', a: 'soin' });
  check('admin : « vie au maximum » pour l\'admin seulement', chef.pv === MAX && eleve.pv === 10);
  chef.derniereAction = 0;
  p.message(chef, { t: 'admin', a: 'bots+' });
  check('admin : +2 bots', p.botsBonus === 2);
  // frappe orbitale : refusée sans le pouvoir, puis explosion après le compte à rebours
  reset();
  p.message(chef, { t: 'pouvoirs', frappe: false });
  chef.derniereAction = 0;
  p.message(chef, { t: 'admin', a: 'frappe', d: [0, -1, 0] });
  check('admin : pas de frappe orbitale sans le pouvoir', p.frappes.length === 0);
  p.message(chef, { t: 'pouvoirs', frappe: true });
  chef.x = 0; chef.y = 0; chef.z = 0; eleve.x = 2; eleve.y = 0; eleve.z = 0;
  chef.derniereAction = 0;
  p.message(chef, { t: 'admin', a: 'frappe', d: [0.35, -0.94, 0] });
  check('admin : la frappe orbitale est annoncée', p.frappes.length === 1 && we.recus.some((m) => m.t === 'frappe'));
  p.frappes[0].at = 0; p.tickNo = 1; p.tick();
  check('admin : la frappe orbitale explose (l\'élève à côté est éliminé, pas l\'admin)', !eleve.vivant && chef.vivant && p.frappes.length === 0);
  // balles explosives : un tir dans le sol blesse l'élève à côté
  reset();
  p.message(chef, { t: 'pouvoirs', explosives: true, munitions: true });
  chef.x = 0; chef.z = 0; eleve.x = 1.6; eleve.z = 0; eleve.historique = [];
  chef.dernierTir[chef.arme] = 0; chef.pretA = 0;
  p.message(chef, { t: 'tir', a: chef.arme, d: [0, -1, 0], o: [0, 1.62, 0], e: 0, s: 1 });
  check('admin : balles explosives (l\'élève à côté de l\'impact est touché, pas l\'admin)', eleve.pv < MAX && chef.pv === MAX, [eleve.pv, chef.pv]);
  // tir ultra rapide : deux tirs à 50 ms d'écart
  reset();
  const essai = (j) => { j.dernierTir[j.arme] = Date.now() - 50; j.pretA = 0; j.munitions[j.arme] = 10; p.message(j, { t: 'tir', a: j.arme, d: [0, 0, -1], o: [j.x, j.y + 1.62, j.z], e: 1, s: 1 }); return j.munitions[j.arme]; };
  p.message(chef, { t: 'pouvoirs', tirRapide: true });
  p.message(eleve, { t: 'pouvoirs', tirRapide: true });
  check('admin : tir ultra rapide pour l\'admin seulement', essai(chef) === 9 && essai(eleve) === 10);
  // super vitesse : 3 fois la distance normale en 1/10 s
  p.message(chef, { t: 'pouvoirs', vitesse: true });
  for (const j of [eleve, chef]) { j.x = 0; j.y = 0; j.z = 0; j.libreJusqua = 0; j.derniereMaj = Date.now() - 100; j.dernierCorr = 0; p.message(j, { t: 'm', p: [2.6, 0, 0], r: [0, 0], v: j.vie }); }
  check('admin : super vitesse acceptée pour l\'admin seulement', chef.x > 2.5 && eleve.x < 0.1, [chef.x, eleve.x]);
  // bots figés
  p.message(chef, { t: 'pouvoirs', figerBots: true });
  check('admin : bots figés', p.botsFiges());
  clearInterval(p.timer);
}

// Mode classé du FPS : niveau de départ, démarrage avec un seul joueur, bots pendant la vraie manche,
// bots plus forts quand le niveau monte, niveau ajusté à la fin de la manche. (Le chacun pour soi garde ses bots d'entraînement.)
function testerClasse() {
  const { Partie } = require(path.join(ROOT, 'games/fps/serveur/partie.js'));
  const reglages = JSON.parse(fs.readFileSync(path.join(ROOT, 'games/fps/public/reglages.json'), 'utf8'));
  const carte = { id: 'test', nom: 'Test', taille: 60, boites: [[-60, -1, -60, 60, 0, 60, 'herbe']],
    apparitions: [{ x: -5, z: 0, angle: 0 }, { x: 5, z: 0, angle: 0 }, { x: 0, z: -12, angle: 0 }, { x: 0, z: 12, angle: 0 }, { x: -15, z: -15, angle: 0 }, { x: 15, z: 15, angle: 0 }] };
  const fauxWs = () => ({ readyState: 1, recus: [], send(x) { this.recus.push(JSON.parse(x)); } });
  const EQ = { principale: 'fusil', secondaire: 'pistolet', melee: 'couteau', gadget: 'grenade' };
  const nouvelle = (mode, niveau) => { const p = new Partie({ code: 'CLAS', mode, niveau, reglages, carte, surVide: () => {} }); clearInterval(p.timer); return p; };
  const bots = (p) => [...p.joueurs.values()].filter((j) => j.bot);

  const p = nouvelle('classe', 3);
  check('classé : la partie garde son niveau de départ et son objectif', p.niveau === 3 && p.infos().niveau === 3 && p.infos().mode === 'classe'
    && p.objectif === (reglages.partie.objectifClasse || reglages.partie.objectifChacunPourSoi), [p.niveau, p.objectif]);
  const w = fauxWs();
  const moi = p.ajouter(w, { id: 1, username: 'Solo' });
  p.message(moi, { t: 'equipement', e: EQ });
  const delai = p.attenteFinA - Date.now();
  check('classé : un seul joueur prêt suffit, et la partie démarre vite', p.attenteFinA > 0 && delai <= (reglages.partie.attenteClasseSecondes || 5) * 1000 + 50, delai);
  let now = Date.now();
  for (let i = 0; i < 10; i++) { now += 900; p.bots.gerer(now, 0.05); }
  check('classé : des bots complètent la partie (6 joueurs)', bots(p).length === Math.min(p.max, 6) - 1, bots(p).length);
  p.nouvelleManche();
  check('classé : les bots restent pour la vraie manche', p.etat === 'jeu' && bots(p).length === Math.min(p.max, 6) - 1, bots(p).length);
  p.tick();
  check('classé : les bots jouent pendant la manche, au niveau de la partie', p.bots.niveau === 3, p.bots.niveau);
  const avant = { prec: p.bots.r.precisionDegres, reaction: p.bots.r.reactionMs };
  w.recus.length = 0;
  moi.kills = 9; // 3 éliminations = +1 niveau
  p.bots.gerer(now + 900, 0.05);
  check('classé : le niveau des bots monte avec les éliminations du joueur (annoncé à tous)', p.bots.niveau === 6 && w.recus.some((m) => m.t === 'niveauBots' && m.n === 6), [p.bots.niveau, w.recus.filter((m) => m.t === 'niveauBots')]);
  check('classé : plus de niveau = visée plus précise et réaction plus rapide', p.bots.r.precisionDegres < avant.prec && p.bots.r.reactionMs < avant.reaction, [avant, p.bots.r.precisionDegres, p.bots.r.reactionMs]);
  moi.kills = 90;
  p.bots.gerer(now + 1800, 0.05);
  check('classé : niveau des bots limité à 20', p.bots.niveau === 20 && p.bots.r.precisionDegres >= 0.6, p.bots.niveau);
  // fin de manche : un vrai joueur gagne → la manche suivante commence un niveau plus haut
  w.recus.length = 0;
  p.terminer();
  const fin = w.recus.find((m) => m.t === 'fin');
  check('classé : manche gagnée par le joueur → bots un niveau plus haut', p.niveau === 4 && fin && fin.niveau === 4, [p.niveau, fin && fin.niveau]);
  p.nouvelleManche();
  bots(p)[0].kills = 50; // un bot gagne la manche
  p.terminer();
  check('classé : manche gagnée par un bot → bots un niveau plus bas', p.niveau === 3, p.niveau);
  const fort = nouvelle('classe', 20); const faible = nouvelle('classe', 1);
  for (const x of [fort, faible]) { x.ajouter(fauxWs(), { id: 1, username: 'Solo' }); x.bots.gerer(Date.now(), 0.05); }
  check('classé : bots de niveau 20 bien plus précis que ceux du niveau 1', fort.bots.r.precisionDegres < faible.bots.r.precisionDegres - 4, [fort.bots.r.precisionDegres, faible.bots.r.precisionDegres]);

  // Chacun pour soi : les bots d'entraînement partent quand la vraie partie commence (inchangé)
  const s = nouvelle('solo', 1);
  const js = s.ajouter(fauxWs(), { id: 1, username: 'Solo' });
  s.message(js, { t: 'equipement', e: EQ });
  check('chacun pour soi : un seul joueur ne lance pas la partie', !s.attenteFinA, s.attenteFinA);
  let t = Date.now();
  for (let i = 0; i < 3; i++) { t += 900; js.derniereMaj = t; s.bots.gerer(t, 0.05); }
  const avantDebut = bots(s).length;
  s.nouvelleManche();
  check('chacun pour soi : les bots d\'entraînement partent au début de la vraie partie', avantDebut > 0 && bots(s).length === 0, [avantDebut, bots(s).length]);
  for (const x of [p, fort, faible, s]) clearInterval(x.timer);
}

// Caméléon (cache-cache) : rôles, chercheurs figés pendant la cachette, tir qui touche / rate / leurre,
// peinture, radar, fin de manche, bots quand on est seul.
function testerCameleon() {
  const { Salon } = require(path.join(ROOT, 'games/cameleon/serveur/salon.js'));
  const reglages = JSON.parse(fs.readFileSync(path.join(ROOT, 'games/cameleon/public/reglages.json'), 'utf8'));
  const carte = {
    id: 'test-cam', nom: 'Test', taille: 30,
    boites: [[-30, -1, -30, 30, 0, 30, 'herbe'], [-30, 0, -10.3, 30, 3, -10, 'brique']],
    apparitions: [{ x: 0, y: 0, z: 20, angle: 0, role: 'chercheur' }, ...[[-5, 5], [5, 5], [0, 8], [-8, 0], [8, 0], [0, 0]].map(([x, z]) => ({ x, y: 0, z, angle: 0, role: 'cacheur' }))],
    cachettes: [[-5, 0, 5], [5, 0, 5]],
  };
  const fauxWs = () => ({ readyState: 1, recus: [], send(x) { this.recus.push(JSON.parse(x)); } });
  const s = new Salon({ code: 'CAME', carte, reglages, surVide: () => {} });
  clearInterval(s.timer);
  const ws = [fauxWs(), fauxWs(), fauxWs()];
  const js = ws.map((w, i) => s.ajouter(w, { id: i + 1, username: `Joueur${i + 1}` }));
  check('caméléon : 3 joueurs dans le salon, en attente', s.joueurs.size === 3 && s.etat === 'attente');
  s.bots.preparerManche = () => {}; // (pas de bots pour ce test : 3 vrais joueurs)
  s.nouvelleManche();
  const chercheurs = js.filter((j) => j.role === 'chercheur');
  const cacheurs = js.filter((j) => j.role === 'cacheur');
  check('caméléon : 1 chercheur pour 3 joueurs, les autres cacheurs', chercheurs.length === 1 && cacheurs.length === 2, js.map((j) => j.role));
  check('caméléon : tout le monde reçoit son rôle', ws.every((w) => w.recus.some((m) => m.t === 'manche')));
  const ch = chercheurs[0]; const c1 = cacheurs[0]; const c2 = cacheurs[1];
  // pendant la cachette, le chercheur ne peut pas bouger
  ch.derniereMaj = Date.now() - 100;
  s.message(ch, { t: 'm', p: [ch.x + 3, 0, ch.z], r: [0, 0] });
  check('caméléon : le chercheur a les yeux bandés (il ne bouge pas pendant la cachette)', Math.abs(ch.x - carte.apparitions[0].x) < 1.5);
  // peinture : seulement une vraie image PNG, seulement pour un cacheur
  const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  s.message(c1, { t: 'peau', png, couleurs: { tete: '#5cb83c', corps: '#5cb83c' } });
  s.message(ch, { t: 'peau', png });
  c2.derniereePeau = 0;
  s.message(c2, { t: 'peau', png: 'javascript:alert(1)' });
  check('caméléon : peinture acceptée pour un cacheur, refusée pour un chercheur ou une fausse image', c1.peau === png && !ch.peau && !c2.peau);
  // pose + leurre
  s.message(c1, { t: 'pose', p: 3 });
  s.message(c1, { t: 'leurre' });
  s.message(c1, { t: 'leurre' });
  check('caméléon : pose allongée et un seul leurre par manche', c1.pose === 3 && s.leurres.size === 1);
  // la recherche commence
  s.debutRecherche();
  check('caméléon : la recherche commence', s.etat === 'recherche');
  // tir raté : pénalité
  ch.x = 0; ch.y = 0; ch.z = 20; c1.x = -5; c1.z = 5; c1.y = 0; c2.x = 20; c2.z = -20; // c2 derrière le mur
  const viser = (cible, h = 0.25) => { const v = [cible[0] - ch.x, cible[1] + h - (ch.y + 1.62), cible[2] - ch.z]; const n = Math.hypot(...v); return v.map((x) => x / n); };
  s.message(ch, { t: 'tir', d: [0, 0.2, -1] });
  check('caméléon : un tir raté bloque le chercheur', ch.bloqueJusqua > Date.now() + 1500 && ws[js.indexOf(ch)].recus.some((m) => m.t === 'rate'));
  // pendant la pénalité, il ne peut pas tirer
  s.message(ch, { t: 'tir', d: viser([c1.x, c1.y, c1.z]) });
  check('caméléon : pas de tir pendant la pénalité', c1.role === 'cacheur');
  // tir sur le leurre
  ch.bloqueJusqua = 0; ch.dernierTir = 0;
  const l = [...s.leurres.values()][0];
  c1.x = 6; c1.z = 6; // le vrai cacheur s'est éloigné de son leurre
  s.message(ch, { t: 'tir', d: viser(l.p) });
  check('caméléon : tirer sur un leurre le détruit, pénalise le chercheur et donne des points au cacheur', s.leurres.size === 0 && ch.bloqueJusqua > Date.now() && c1.points >= reglages.points.leurre);
  // radar : une seule fois
  s.message(ch, { t: 'radar' });
  s.message(ch, { t: 'radar' });
  check('caméléon : radar une seule fois par manche', ws[js.indexOf(ch)].recus.filter((m) => m.t === 'radar').length === 1);
  // tir réussi : le cacheur devient chercheur
  ch.bloqueJusqua = 0; ch.dernierTir = 0;
  c1.pose = 0;
  s.message(ch, { t: 'tir', d: viser([c1.x, c1.y, c1.z], 1.0) });
  check('caméléon : touché = trouvé, le cacheur devient chercheur', c1.role === 'chercheur' && ch.points >= reglages.points.trouve);
  // le dernier cacheur derrière le mur : on ne peut pas le toucher à travers
  ch.bloqueJusqua = 0; ch.dernierTir = 0;
  s.message(ch, { t: 'tir', d: viser([c2.x, c2.y, c2.z], 1.0) });
  check('caméléon : on ne touche pas à travers un mur', c2.role === 'cacheur');
  // fin : le dernier cacheur trouvé
  s.trouver(c2, ch);
  check('caméléon : plus de cacheurs = les chercheurs gagnent', s.etat === 'fin' && s.gagnants === 'chercheurs');
  // seul : des bots complètent la partie
  const s2 = new Salon({ code: 'SOLO', carte, reglages, surVide: () => {} });
  clearInterval(s2.timer);
  s2.ajouter(fauxWs(), { id: 9, username: 'Solo' });
  s2.nouvelleManche();
  const bots = [...s2.joueurs.values()].filter((j) => j.bot);
  check('caméléon : seul, on joue avec des bots', bots.length === reglages.botsSolo - 1 && s2.etat === 'cachette', bots.length);
  // les bots cacheurs vont se cacher et se peignent
  for (let i = 0; i < 400; i++) s2.bots.tick(Date.now(), 0.05);
  const botsCaches = bots.filter((b) => b.role === 'cacheur');
  check('caméléon : les bots cacheurs se cachent, prennent une pose et se peignent', botsCaches.length > 0 && botsCaches.every((b) => b.bot.etat === 'cache' && b.pose > 0 && b.couleurs), botsCaches.map((b) => [b.bot.etat, b.pose, !!b.couleurs]));
  clearInterval(s2.timer);
}

function testerArbitre() {
  const { Partie, degatsBalle } = require(path.join(ROOT, 'games/fps/serveur/partie.js'));
  const reglages = JSON.parse(fs.readFileSync(path.join(ROOT, 'games/fps/public/reglages.json'), 'utf8'));
  reglages.partie.attenteSecondes = 30;
  const A = Object.fromEntries(reglages.armes.map((x, i) => [x.id, i]));
  const carte = {
    id: 'test', nom: 'Test', taille: 40,
    boites: [
      [-40, -1, -40, 40, 0, 40, 'herbe'],
      [12, 0, 9, 13, 3.2, 15, 'brique'],
      [20, 0, -5, 20.5, 3, 5, 'vitre'],
      [-20, 0, -30, -19, 6, -20, 'brique'],
    ],
    apparitions: [
      { x: -30, z: -30, angle: 0, equipe: 0 }, { x: 30, z: 30, angle: 0, equipe: 1 },
      { x: -30, z: 30, angle: 0, equipe: null }, { x: 30, z: -30, angle: 0, equipe: null },
    ],
  };
  const fauxWs = () => ({ readyState: 1, recus: [], send(s) { this.recus.push(JSON.parse(s)); } });
  const EQ = { principale: 'fusil', secondaire: 'pistolet', melee: 'couteau', gadget: 'grenade' };
  let vide = false;
  const p = new Partie({ code: 'TEST', mode: 'solo', reglages, carte, surVide: () => { vide = true; } });
  clearInterval(p.timer); // on fait avancer le temps nous-mêmes
  const wa = fauxWs();
  const wb = fauxWs();
  const a = p.ajouter(wa, { id: 1, username: 'Tireur' });
  const b = p.ajouter(wb, { id: 2, username: 'Cible' });
  check('salle d\'attente : personne n\'apparaît avant de choisir ses armes', !a.vivant && !b.vivant && p.etat === 'attente');
  p.message(a, { t: 'equipement', e: EQ });
  check('salle d\'attente : on s\'échauffe dès qu\'on a choisi ses armes', a.vivant && a.arme === A.fusil);
  check('salle d\'attente : pas de compte à rebours avec un seul joueur prêt', p.attenteFinA === 0);
  p.message(b, { t: 'equipement', e: EQ });
  check('salle d\'attente : le compte à rebours démarre avec 2 joueurs prêts', p.attenteFinA > Date.now() + 25000);
  const placer = (j, x, z, y = 0) => { j.x = x; j.y = y; j.z = z; j.historique = []; j.protegeJusqua = 0; };
  const tirer = (j, d, arme = j.arme, e = 0, v = 0) => {
    j.dernierTir[arme] = 0;
    j.rechargeA = 0;
    j.pretA = 0;
    p.tir(j, { a: arme, o: [j.x, j.y + 1.62, j.z], d, e, s: 12345, v });
  };
  const dernier = (ws, t) => ws.recus.filter((m) => m.t === t).pop();
  const CORPS = [1, -0.062, 0];
  const TETE = [1, 0.003, 0];
  // Pendant l'échauffement, les tirs ne font pas de dégâts
  placer(a, 0, 0); placer(b, 10, 0);
  tirer(a, CORPS);
  check('échauffement : on voit qu\'on touche mais personne ne perd de vie', b.pv === 100 && dernier(wa, 'touche') && dernier(wa, 'touche').entrainement === 1);
  const vieAvant = b.vie;
  p.message(b, { t: 'equipement', e: { ...EQ, principale: 'pompe' } });
  check('échauffement : changer d\'armes s\'applique tout de suite', b.vivant && b.vie === vieAvant + 1 && b.arme === A.pompe && !b.prochainEquipement);
  p.message(b, { t: 'equipement', e: EQ });
  p.attenteFinA = Date.now() - 1;
  p.tick();
  check('la partie démarre toute seule à la fin du compte à rebours', p.etat === 'jeu' && a.vivant && b.vivant);
  // On choisit l'équipement complet d'un joueur (pour les tests)
  const equiper = (j, ids) => { j.equipement = ids.map((id) => A[id]); };
  const prendre = (j, arme) => { if (!j.equipement.includes(A[arme])) j.equipement[reglages.armes[A[arme]].categorie === 'principale' ? 0 : reglages.armes[A[arme]].categorie === 'secondaire' ? 1 : reglages.armes[A[arme]].categorie === 'melee' ? 2 : 3] = A[arme]; p.changerArme(j, { a: A[arme] }); j.pretA = 0; };

  placer(a, 0, 0); placer(b, 10, 0);
  wa.recus.length = 0;
  tirer(a, CORPS);
  let m = dernier(wa, 'touche');
  check('fusil d\'assaut : tir dans le corps = 21 dégâts', m && m.deg === 21 && !m.tete, m);
  check('la cible est prévenue des dégâts', wb.recus.some((x) => x.t === 'degats' && x.pv === 79));
  wa.recus.length = 0;
  tirer(a, TETE);
  m = dernier(wa, 'touche');
  check('tir dans la tête = double dégâts', m && m.tete === 1 && m.deg === 42, m);
  tirer(a, TETE); // 21 + 42 + 42 = 105
  check('élimination quand les points de vie tombent à 0', !b.vivant && a.kills === 1 && b.morts === 1);
  check('tout le monde est prévenu de l\'élimination (avec l\'arme)', wb.recus.some((x) => x.t === 'elim' && x.tueur === 1 && x.victime === 2 && x.a === A.fusil));
  p.changerArme(a, { a: A.sniper });
  check('impossible de prendre une arme qui n\'est pas dans son équipement', a.arme === A.fusil);

  p.apparaitre(b);
  placer(a, 10, 12); placer(b, 16, 12); // un mur en brique entre x = 12 et 13
  wa.recus.length = 0;
  tirer(a, [1, 0, 0]);
  check('les murs arrêtent les balles', !dernier(wa, 'touche') && b.pv === 100);
  placer(a, 18, 0); placer(b, 23, 0); // une vitre entre x = 20 et 20,5
  tirer(a, [1, -0.12, 0]);
  check('les balles traversent les vitres', !!dernier(wa, 'touche'));

  p.apparaitre(b);
  placer(a, 0, 0); placer(b, 10, 0);
  prendre(a, 'sniper');
  tirer(a, TETE);
  check('sniper : une balle dans la tête élimine d\'un coup', !b.vivant);

  p.apparaitre(b);
  placer(a, 0, -20); placer(b, 3, -20);
  prendre(a, 'pompe');
  wa.recus.length = 0;
  tirer(a, [1, -0.2, 0]);
  m = dernier(wa, 'touche');
  check('fusil à pompe de près : très gros dégâts (plusieurs plombs)', m && m.deg >= 70, m);
  const fx = wb.recus.filter((x) => x.t === 'tir').pop();
  check('fusil à pompe : 9 plombs envoyés aux autres joueurs', fx && fx.f.length === 9, fx);
  const pompe = reglages.armes[A.pompe];
  check('les plombs perdent leur puissance de loin', degatsBalle(pompe, 30, false) < pompe.degats * 0.3);
  a.munitions[A.pompe] = 3;
  p.commencerRecharge(a);
  p.finRecharge(a, Date.now());
  check('fusil à pompe : on recharge une cartouche à la fois', a.munitions[A.pompe] === 4 && a.rechargeA > 0);

  // Lance-roquettes : explosion, dégâts autour, souffle
  p.apparaitre(b);
  placer(a, 0, 0); placer(b, 8, 0);
  prendre(a, 'roquette');
  wb.recus.length = 0;
  tirer(a, [1, -0.05, 0]);
  check('lance-roquettes : la roquette part', p.projectiles.size === 1);
  for (let i = 0; i < 20 && p.projectiles.size; i++) p.majProjectiles(0.05);
  check('la roquette explose sur la cible', p.projectiles.size === 0 && b.pv < 100, b.pv);
  check('l\'explosion projette la cible', wb.recus.some((x) => x.t === 'pousse'));
  p.apparaitre(b);
  placer(a, 0, 0); placer(b, 30, 30);
  wa.recus.length = 0;
  const pvAvant = a.pv;
  tirer(a, [0, -1, 0]);
  for (let i = 0; i < 5 && p.projectiles.size; i++) p.majProjectiles(0.05);
  const pousse = dernier(wa, 'pousse');
  check('rocket jump : on s\'envole en tirant à ses pieds', pousse && pousse.v[1] > 5 && a.pv < pvAvant && a.pv > 40, { pousse, pv: a.pv });

  // Arbalète : le carreau retombe (il faut viser au-dessus de loin)
  p.apparaitre(a); p.apparaitre(b);
  placer(a, 0, 0); placer(b, 30, 0);
  prendre(a, 'arbalete');
  wa.recus.length = 0;
  tirer(a, [1, 0, 0]); // visé droit sur la tête, à 30 m, sans compenser la chute
  for (let i = 0; i < 30 && p.projectiles.size; i++) p.majProjectiles(0.05);
  m = dernier(wa, 'touche');
  check('arbalète : le carreau tombe en arc (visé sur la tête, il touche plus bas)', m && !m.tete && b.vivant, m);
  p.apparaitre(b);
  placer(b, 30, 0);
  a.munitions[A.arbalete] = 1;
  tirer(a, [1, 0.045, 0]); // visé un peu au-dessus
  for (let i = 0; i < 30 && p.projectiles.size; i++) p.majProjectiles(0.05);
  check('arbalète : en visant au-dessus, le carreau atteint la tête', !b.vivant);
  p.apparaitre(b);
  placer(a, 0, 0); placer(b, 6, 0);
  a.munitions[A.arbalete] = 1;
  tirer(a, [1, 0.01, 0]);
  for (let i = 0; i < 10 && p.projectiles.size; i++) p.majProjectiles(0.05);
  check('arbalète : un carreau dans la tête élimine', !b.vivant);

  // Lance-fusée : dégâts + brûlure + éblouissement
  p.apparaitre(b);
  placer(a, 0, 0); placer(b, 8, 0);
  prendre(a, 'lance_fusee');
  wb.recus.length = 0;
  tirer(a, [1, -0.05, 0]);
  for (let i = 0; i < 10 && p.projectiles.size; i++) p.majProjectiles(0.05);
  const pvFusee = b.pv;
  check('lance-fusée : la cible est éblouie et brûle', b.brule && wb.recus.some((x) => x.t === 'eblouir') && pvFusee <= 75);
  b.brule.prochain = 0;
  p.tick();
  check('la brûlure enlève encore des points de vie', b.pv < pvFusee);
  b.brule = null;

  // Mêlée
  p.apparaitre(b);
  placer(a, 0, 0); placer(b, 1.5, 0);
  a.yaw = -Math.PI / 2; // a regarde vers +x
  b.yaw = -Math.PI / 2; // b regarde aussi vers +x : a est dans son dos
  prendre(a, 'couteau');
  wa.recus.length = 0;
  tirer(a, [1, 0, 0], A.couteau, 0, 0);
  m = dernier(wa, 'touche');
  check('couteau : coup normal = 40 dégâts', m && m.deg === 40 && !m.dos, m);
  tirer(a, [1, 0, 0], A.couteau, 0, 1);
  m = dernier(wa, 'touche');
  check('couteau : dans le dos en visant = élimination en un coup', !b.vivant && m && m.dos === 1, m);
  check('le coup dans le dos est annoncé à tout le monde', wb.recus.some((x) => x.t === 'elim' && x.dos === 1));
  p.apparaitre(b);
  placer(a, 0, 0); placer(b, 1.5, 0);
  b.yaw = Math.PI / 2; // b regarde vers a (de face)
  wa.recus.length = 0;
  tirer(a, [1, 0, 0], A.couteau, 0, 1);
  check('couteau : de face, même en visant, pas d\'élimination en un coup', b.vivant && b.pv === 60);
  placer(b, 4, 0);
  const pvLoin = b.pv;
  tirer(a, [1, 0, 0], A.couteau, 0, 0);
  check('couteau : trop loin = raté', b.pv === pvLoin);
  prendre(a, 'batte');
  placer(b, 2, 0);
  wb.recus.length = 0;
  tirer(a, [1, 0, 0], A.batte);
  check('batte : 50 dégâts et l\'adversaire est projeté', b.pv === pvLoin - 50 && wb.recus.some((x) => x.t === 'pousse' && x.v[0] > 5));

  // Poêle dans le dos : arrête les balles qui arrivent par derrière
  p.apparaitre(b);
  equiper(b, ['fusil', 'pistolet', 'poele', 'grenade']);
  b.arme = A.fusil;
  placer(a, 0, 0); placer(b, 10, 0);
  b.yaw = -Math.PI / 2; // b tourne le dos à a
  prendre(a, 'fusil');
  wb.recus.length = 0;
  tirer(a, CORPS);
  check('poêle dans le dos : la balle est arrêtée (DING)', b.pv === 100 && wb.recus.some((x) => x.t === 'ding'));
  b.yaw = Math.PI / 2; // de face
  tirer(a, CORPS);
  check('poêle : de face, elle ne protège pas', b.pv < 100);

  // Gadgets
  p.apparaitre(a); p.apparaitre(b);
  equiper(a, ['fusil', 'pistolet', 'couteau', 'grenade']);
  placer(a, 0, 0); placer(b, 9, 0);
  prendre(a, 'grenade');
  wa.recus.length = 0;
  tirer(a, [0.75, 0.2, 0], A.grenade);
  check('grenade : elle part et le gadget se recharge', p.projectiles.size === 1 && a.gadgetPretA > Date.now() + 10000);
  tirer(a, [1, 0, 0], A.grenade);
  check('grenade : impossible d\'en relancer une tout de suite', p.projectiles.size === 1 && dernier(wa, 'gadget').pretDans > 10000);
  const gr = [...p.projectiles.values()][0];
  for (let i = 0; i < 20; i++) p.majProjectiles(0.05);
  check('grenade : elle rebondit et reste sur le sol', gr.p[1] > -0.1 && gr.p[1] < 1 && p.projectiles.size === 1, gr.p);
  gr.nee -= 5000;
  p.majProjectiles(0.05);
  check('grenade : explosion au bout de 3 secondes', p.projectiles.size === 0 && wa.recus.some((x) => x.t === 'explosion'));

  equiper(a, ['fusil', 'pistolet', 'couteau', 'grappin']);
  prendre(a, 'grappin');
  a.gadgetPretA = 0;
  placer(a, -15, -25);
  wa.recus.length = 0;
  tirer(a, [-1, 0.3, 0], A.grappin); // vers le mur en brique x = -19
  m = dernier(wa, 'grappin');
  check('grappin : il s\'accroche au mur visé', m && m.p && Math.abs(m.p[0] + 19) < 0.6 && a.libreJusqua > Date.now(), m);

  equiper(a, ['fusil', 'pistolet', 'couteau', 'kit_soin']);
  prendre(a, 'kit_soin');
  a.gadgetPretA = 0;
  a.pv = 30;
  tirer(a, [1, 0, 0], A.kit_soin);
  check('kit de soin : le soin commence', a.soinA > Date.now());
  a.soinA = Date.now() - 1;
  p.tick();
  check('kit de soin : +50 points de vie', a.pv === 80);

  // Anti-triche
  prendre(a, 'fusil');
  p.apparaitre(a);
  placer(a, 0, -27);
  a.derniereMaj = Date.now();
  wa.recus.length = 0;
  p.deplacement(a, { p: [20, 0, 20], r: [0, 0], v: a.vie });
  check('la téléportation est refusée', a.x === 0 && wa.recus.some((x) => x.t === 'corr'));
  const avant = a.munitions[A.fusil];
  a.dernierTir[A.fusil] = Date.now();
  p.tir(a, { a: A.fusil, o: [0, 1.62, -27], d: [1, 0, 0], e: 0, s: 1 });
  check('impossible de tirer plus vite que l\'arme', a.munitions[A.fusil] === avant);
  a.munitions[A.fusil] = 0;
  a.dernierTir[A.fusil] = 0;
  a.pretA = 0;
  p.tir(a, { a: A.fusil, o: [0, 1.62, -27], d: [1, 0, 0], e: 0, s: 1 });
  check('sans munitions : rechargement automatique', a.rechargeA > 0);

  // Changer d'équipement en étant vivant : appliqué à la prochaine apparition
  p.message(a, { t: 'equipement', e: { principale: 'mitrailleuse', secondaire: 'uzi', melee: 'batte', gadget: 'fumigene' } });
  check('changer d\'armes en vie : ce sera pour la prochaine apparition', a.equipement[0] !== A.mitrailleuse && a.prochainEquipement);
  p.apparaitre(a);
  check('à la réapparition, on a le nouvel équipement', a.equipement[0] === A.mitrailleuse && a.arme === A.mitrailleuse);

  // Réapparition : jamais sur un autre joueur, même avec peu de points d'apparition.
  carte.apparitions = carte.apparitions.slice(0, 2);
  let surQuelqun = 0;
  for (let i = 0; i < 30; i++) {
    placer(a, carte.apparitions[0].x, carte.apparitions[0].z);
    p.apparaitre(b);
    if (Math.hypot(b.x - a.x, b.z - a.z) < 2) surQuelqun++;
  }
  check('on ne réapparaît jamais sur un autre joueur', surQuelqun === 0, surQuelqun);

  // Fin de partie quand l'objectif est atteint.
  a.kills = reglages.partie.objectifChacunPourSoi - 1;
  p.apparaitre(b);
  placer(a, 0, 0); placer(b, 10, 0);
  b.pv = 1;
  equiper(a, ['fusil', 'pistolet', 'couteau', 'grenade']);
  prendre(a, 'fusil');
  a.munitions[A.fusil] = 5;
  tirer(a, CORPS);
  check('la partie se termine à l\'objectif', p.etat === 'fin' && wa.recus.some((x) => x.t === 'fin' && x.gagnant && x.gagnant.id === 1));
  p.retirer(1);
  p.retirer(2);
  check('partie vide fermée', vide);

  // Mode équipes : pas de tir ami
  const q = new Partie({ code: 'EQUI', mode: 'equipes', reglages, carte, surVide: () => {} });
  clearInterval(q.timer);
  const c1 = q.ajouter(fauxWs(), { id: 3, username: 'Bleu1' });
  const c2 = q.ajouter(fauxWs(), { id: 4, username: 'Bleu2' });
  q.message(c1, { t: 'equipement', e: EQ });
  q.message(c2, { t: 'equipement', e: EQ });
  q.nouvelleManche();
  c2.equipe = c1.equipe;
  c1.x = 0; c1.y = 0; c1.z = 0; c1.protegeJusqua = 0; c1.historique = [];
  c2.x = 10; c2.y = 0; c2.z = 0; c2.protegeJusqua = 0; c2.historique = [];
  c1.pretA = 0;
  q.tir(c1, { a: A.fusil, o: [0, 1.62, 0], d: CORPS, e: 0, s: 1 });
  check('équipes : on ne blesse pas ses coéquipiers', c2.pv === 100);
  q.retirer(3);
  q.retirer(4);
}

async function main() {
  console.log('\n— Commande admin —');
  let r = cli(['creer-admin', 'Patron'], 'motdepasse-admin-123\nmotdepasse-admin-123\n');
  check('création du compte admin par commande', r.status === 0 && /créé/.test(r.stdout), r.stdout + r.stderr);
  r = cli(['code', '1', 'test']);
  const code1 = (r.stdout.match(/: ([A-Z0-9]{8})/) || [])[1];
  check('création d\'un code d\'invitation par commande', !!code1, r.stdout);

  const server = spawn(process.execPath, [path.join(ROOT, 'server/index.js')], { env: ENV });
  let log = '';
  server.stdout.on('data', (d) => { log += d; });
  server.stderr.on('data', (d) => { log += d; });
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(BASE + '/api/health')).ok) break; } catch { /* pas encore prêt */ }
    await wait(100);
  }

  try {
    const admin = client();
    const alice = client();
    const bob = client();
    const intrus = client();

    console.log('\n— Inscription —');
    r = await alice.req('POST', '/api/auth/register', { username: 'Alice', password: 'motdepasse1' });
    check('refusée sans code d\'invitation', r.status === 400 && r.data.field === 'code', r.data);
    r = await alice.req('POST', '/api/auth/register', { username: 'connard', password: 'motdepasse1', code: code1 });
    check('pseudo grossier refusé', r.status === 400 && r.data.field === 'username', r.data);
    r = await alice.req('POST', '/api/auth/register', { username: 'Admin', password: 'motdepasse1', code: code1 });
    check('pseudo réservé refusé', r.status === 400, r.data);
    r = await alice.req('POST', '/api/auth/register', { username: '<b>xss</b>', password: 'motdepasse1', code: code1 });
    check('pseudo avec caractères HTML refusé', r.status === 400, r.data);
    r = await alice.req('POST', '/api/auth/register', { username: 'Alice', password: 'court', code: code1 });
    check('mot de passe trop court refusé', r.status === 400 && r.data.field === 'password', r.data);
    r = await alice.req('POST', '/api/auth/register', { username: 'Alice', password: 'motdepasse1', code: code1.toLowerCase() });
    check('inscription avec code valide', r.status === 201, r.data);
    const setCookie = r.headers.get('set-cookie') || '';
    check('cookie HttpOnly + SameSite', /HttpOnly/.test(setCookie) && /SameSite=Lax/.test(setCookie), setCookie);
    r = await bob.req('POST', '/api/auth/register', { username: 'Bob', password: 'motdepasse2', code: code1 });
    check('code à usage unique refusé la 2e fois', r.status === 400 && r.data.field === 'code', r.data);

    console.log('\n— Connexion et limitation des essais —');
    r = await admin.req('POST', '/api/auth/login', { username: 'patron', password: 'motdepasse-admin-123' });
    check('connexion admin (pseudo insensible à la casse)', r.status === 200 && r.data.user.isAdmin, r.data);
    r = await intrus.req('POST', '/api/auth/login', { username: "' OR 1=1 --", password: "' OR '1'='1" });
    check('injection SQL sans effet', r.status === 401, r.data);
    for (let i = 0; i < 5; i++) await intrus.req('POST', '/api/auth/login', { username: 'Alice', password: 'mauvais' + i });
    r = await intrus.req('POST', '/api/auth/login', { username: 'Alice', password: 'motdepasse1' });
    check('compte verrouillé après 5 essais ratés (même avec le bon mot de passe)', r.status === 429, r.data);

    console.log('\n— Panneau admin —');
    r = await alice.req('GET', '/api/admin/stats');
    check('un joueur n\'a pas accès à l\'admin', r.status === 403, r.data);
    r = await intrus.req('GET', '/api/admin/stats');
    check('un visiteur non connecté non plus', r.status === 401, r.data);
    r = await admin.req('POST', '/api/admin/invites', { maxUses: 2, count: 1, note: '4e B' });
    const code2 = r.data && r.data.codes[0];
    check('l\'admin crée un code à 2 utilisations', r.status === 201 && /^[A-Z0-9]{8}$/.test(code2), r.data);
    r = await bob.req('POST', '/api/auth/register', { username: 'Bob', password: 'motdepasse2', code: code2 });
    check('Bob s\'inscrit', r.status === 201, r.data);
    const carol = client();
    r = await carol.req('POST', '/api/auth/register', { username: 'Carol', password: 'motdepasse3', code: code2 });
    check('Carol s\'inscrit avec le même code', r.status === 201, r.data);
    r = await client().req('POST', '/api/auth/register', { username: 'Dave', password: 'motdepasse4', code: code2 });
    check('3e utilisation refusée', r.status === 400, r.data);
    const inv = (await admin.req('GET', '/api/admin/invites')).data.invites.find((c) => c.code === code2);
    r = await admin.req('PATCH', '/api/admin/invites/' + inv.id, { active: false });
    check('désactivation d\'un code', r.status === 200);

    console.log('\n— Protection CSRF —');
    r = await alice.req('POST', '/api/suggestions', { title: 'Idée piégée' }, { Origin: 'https://site-pirate.example' });
    check('requête venant d\'un autre site refusée', r.status === 403, r.data);
    r = await alice.req('POST', '/api/suggestions', 'title=Idee', { 'Content-Type': 'application/x-www-form-urlencoded' });
    check('formulaire non-JSON refusé', r.status === 415, r.data);
    // Derrière Tailscale Funnel : l'adresse publique arrive dans X-Forwarded-Host (relais de confiance)
    r = await alice.req('POST', '/api/suggestions', { title: 'Idée envoyée via le lien public' }, { Origin: 'https://jeu-sjdc.exemple.ts.net', 'X-Forwarded-Host': 'jeu-sjdc.exemple.ts.net' });
    check('requête venant du lien public (Tailscale) acceptée', r.status !== 403 && r.status < 400, r.data);
    r = await alice.req('POST', '/api/suggestions', { title: 'Idée piégée 2' }, { Origin: 'https://site-pirate.example', 'X-Forwarded-Host': 'jeu-sjdc.exemple.ts.net' });
    check('autre site refusé même derrière le relais', r.status === 403, r.data);

    console.log('\n— Moteurs de recherche —');
    const publique = { 'X-Forwarded-Host': 'jeux-sjdc.exemple' };
    r = await intrus.req('GET', '/connexion', undefined, publique);
    check('page de connexion visible par Google sur l\'adresse publique', r.status === 200 && !r.headers.get('x-robots-tag'), r.headers.get('x-robots-tag'));
    check('adresse officielle indiquée (canonical)', r.headers.get('link') === '<https://jeux-sjdc.exemple/connexion>; rel="canonical"', r.headers.get('link'));
    r = await intrus.req('GET', '/connexion');
    check('connexion cachée de Google sur les autres adresses (Tailscale, réseau local)', /noindex/.test(r.headers.get('x-robots-tag') || ''), r.headers.get('x-robots-tag'));
    r = await alice.req('GET', '/amis', undefined, publique);
    check('pages des élèves cachées de Google', /noindex/.test(r.headers.get('x-robots-tag') || ''), r.headers.get('x-robots-tag'));
    r = await intrus.req('GET', '/games/fps/cover.svg', undefined, publique);
    check('fichiers des jeux cachés de Google', /noindex/.test(r.headers.get('x-robots-tag') || ''), r.headers.get('x-robots-tag'));
    let txt = await (await fetch(BASE + '/robots.txt', { headers: publique })).text();
    check('robots.txt public avec le plan du site', /Sitemap: https:\/\/jeux-sjdc\.exemple\/sitemap\.xml/.test(txt) && /Disallow: \/api\//.test(txt), txt);
    txt = await (await fetch(BASE + '/robots.txt')).text();
    check('robots.txt interdit tout sur les autres adresses', /Disallow: \/\n/.test(txt), txt);
    let rep = await fetch(BASE + '/sitemap.xml', { headers: publique });
    txt = await rep.text();
    check('plan du site : seulement la page de connexion', rep.status === 200 && (txt.match(/<loc>/g) || []).length === 1 && txt.includes('<loc>https://jeux-sjdc.exemple/connexion</loc>'), txt);
    check('pas de plan du site sur les autres adresses', (await fetch(BASE + '/sitemap.xml')).status === 404);
    r = await intrus.req('GET', '/connexion?x=1', undefined, { 'X-Forwarded-Host': 'www.jeux-sjdc.exemple' });
    check('www redirigé vers l\'adresse sans www', r.status === 301 && r.headers.get('location') === 'https://jeux-sjdc.exemple/connexion?x=1', r.headers.get('location'));
    r = await intrus.req('GET', '/jeux/fps/?room=ABCD', undefined, { 'X-Forwarded-Host': 'ancien-site.exemple' });
    check('ancienne adresse renvoyée vers la nouvelle (même chemin)', r.status === 301 && r.headers.get('location') === 'https://jeux-sjdc.exemple/jeux/fps/?room=ABCD', r.headers.get('location'));
    r = await intrus.req('GET', '/', undefined, { 'X-Forwarded-Host': 'www.ancien-site.exemple' });
    check('www de l\'ancienne adresse aussi', r.status === 301 && r.headers.get('location') === 'https://jeux-sjdc.exemple/', r.headers.get('location'));
    check('les autres adresses (Tailscale, réseau local) ne sont pas renvoyées', (await fetch(BASE + '/connexion', { redirect: 'manual' })).status === 200);

    console.log('\n— Amis et temps réel —');
    const wsAlice = await wsConnect(alice);
    const wsBob = await wsConnect(bob);
    check('connexion WebSocket', !!(await waitFor(wsAlice, 'hello')));
    let refused = false;
    await new Promise((res) => {
      const w = new WebSocket(`ws://127.0.0.1:${PORT}/ws`, { headers: { Origin: BASE } });
      w.on('error', () => { refused = true; res(); });
      w.on('open', () => { w.close(); res(); });
    });
    check('WebSocket refusé sans être connecté', refused);

    const bobId = (await bob.req('GET', '/api/auth/me')).data.user.id;
    const aliceId = (await alice.req('GET', '/api/auth/me')).data.user.id;
    r = await alice.req('POST', '/api/friends/request', { username: 'bob' });
    check('Alice demande Bob en ami', r.status === 200 && r.data.accepted === false, r.data);
    const fr = await waitFor(wsBob, 'friend-request');
    check('Bob reçoit la demande en direct', fr && fr.from.username === 'Alice', fr);
    r = await alice.req('POST', '/api/friends/request', { username: 'bob' });
    check('pas de double demande', r.status === 400, r.data);
    r = await bob.req('GET', '/api/friends');
    const reqId = r.data.incoming[0] && r.data.incoming[0].id;
    check('Bob voit la demande reçue', !!reqId, r.data);
    r = await carol.req('POST', '/api/friends/respond', { requestId: reqId, accept: true });
    check('Carol ne peut pas accepter à la place de Bob', r.status === 404, r.data);
    r = await bob.req('POST', '/api/friends/respond', { requestId: reqId, accept: true });
    check('Bob accepte', r.status === 200, r.data);
    r = await alice.req('GET', '/api/friends');
    const fb = r.data.friends.find((f) => f.username === 'Bob');
    check('Alice voit Bob en ligne', fb && fb.online === true, r.data);

    wsBob.send(JSON.stringify({ type: 'activity', game: 'fps', room: 'salle-1', joinable: true }));
    const pres = await waitFor(wsAlice, 'presence');
    check('Alice voit que Bob joue à Arena FPS', pres && pres.userId === bobId && pres.activity && pres.activity.game === 'fps', pres);
    wsBob.send(JSON.stringify({ type: 'activity', game: 'jeu-inexistant' }));
    await wait(100);
    r = await alice.req('GET', '/api/friends');
    check('activité vers un jeu inexistant ignorée', r.data.friends[0].activity.game === 'fps', r.data.friends[0]);
    r = await alice.req('GET', `/api/friends/${bobId}/join`);
    check('« Rejoindre » refusé tant que le jeu est « bientôt disponible »', r.status === 409, r.data);
    r = await alice.req('POST', '/api/friends/invite', { userId: bobId, game: 'fps' });
    check('« Inviter » refusé tant que le jeu est « bientôt disponible »', r.status === 400, r.data);
    r = await carol.req('POST', '/api/friends/invite', { userId: bobId, game: 'fps' });
    check('on ne peut pas inviter quelqu\'un qui n\'est pas ami', r.status === 403, r.data);
    r = await carol.req('GET', `/api/friends/${bobId}/join`);
    check('on ne peut pas espionner un non-ami', r.status === 403, r.data);

    // Avec un jeu jouable ("beta"), « Rejoindre » et « Inviter » fonctionnent.
    wsBob.send(JSON.stringify({ type: 'activity', game: 'test-jeu', room: 'salle-1', joinable: true }));
    await waitFor(wsAlice, 'presence');
    r = await alice.req('GET', `/api/friends/${bobId}/join`);
    check('« Rejoindre » donne l\'adresse de la partie de Bob', r.status === 200 && r.data.url === '/games/test-jeu/?room=salle-1', r.data);
    r = await bob.req('POST', '/api/friends/invite', { userId: aliceId, game: 'test-jeu', room: 'salle-1' });
    const invite = await waitFor(wsAlice, 'invite');
    check('« Inviter » : Alice reçoit l\'invitation de Bob', r.status === 200 && invite && invite.from.username === 'Bob' && invite.url === '/games/test-jeu/?room=salle-1', invite);
    r = await bob.req('POST', '/api/friends/invite', { userId: aliceId, game: 'test-jeu', room: '../../etc' });
    check('nom de salle invalide refusé', r.status === 400, r.data);

    wsBob.messages.length = 0;
    r = await alice.req('DELETE', `/api/friends/${bobId}`);
    check('retirer un ami', r.status === 200, r.data);
    check('Bob est prévenu', !!(await waitFor(wsBob, 'friends-changed')));

    console.log('\n— Suggestions, votes et XSS —');
    const xss = '<img src=x onerror=alert(1)> Mode zombie';
    r = await alice.req('POST', '/api/suggestions', { title: xss, body: '<script>alert("pirate")</script>' });
    check('suggestion créée', r.status === 201, r.data);
    const sid = r.data.id;
    r = await bob.req('GET', '/api/suggestions');
    const s = r.data.suggestions.find((x) => x.id === sid);
    check('le texte est renvoyé tel quel (affiché comme du texte, jamais exécuté)', s && s.title === xss && s.votes === 1);
    const pages = ['index.html', 'suggestions.html', 'amis.html', 'admin.html'].map((f) => fs.readFileSync(path.join(ROOT, 'public', f), 'utf8')).join('');
    const jsFiles = fs.readdirSync(path.join(ROOT, 'public/assets/js/pages')).map((f) => fs.readFileSync(path.join(ROOT, 'public/assets/js/pages', f), 'utf8')).join('')
      + fs.readFileSync(path.join(ROOT, 'public/assets/js/common.js'), 'utf8');
    check('aucun script en ligne dans les pages (bloqué par la CSP)', !/<script>(?!<\/script>)/.test(pages) && !/style="/.test(pages));
    check('aucun innerHTML dans le JavaScript du site', !/\.(innerHTML|outerHTML)\s*=|insertAdjacentHTML\(|document\.write\(/.test(jsFiles));
    r = await bob.req('POST', `/api/suggestions/${sid}/vote`, {});
    check('Bob vote', r.data.voted === true && r.data.votes === 2, r.data);
    r = await bob.req('POST', `/api/suggestions/${sid}/vote`, {});
    check('Bob retire son vote', r.data.voted === false && r.data.votes === 1, r.data);
    r = await bob.req('POST', '/api/suggestions', { title: 'Un jeu de merde' });
    check('suggestion grossière refusée', r.status === 400, r.data);
    r = await bob.req('POST', '/api/suggestions', { title: 'Allez voir www.monsite.com' });
    check('liens refusés', r.status === 400, r.data);
    r = await bob.req('POST', '/api/suggestions', { title: 'Une technique unique' });
    check('pas de faux positif (« technique », « unique »)', r.status === 201, r.data);
    await bob.req('POST', '/api/suggestions', { title: 'Deuxième idée' });
    await bob.req('POST', '/api/suggestions', { title: 'Troisième idée' });
    r = await bob.req('POST', '/api/suggestions', { title: 'Quatrième idée' });
    check('limite de 3 suggestions par jour', r.status === 429, r.data);

    console.log('\n— Feuille de route —');
    r = await admin.req('POST', `/api/admin/suggestions/${sid}/to-roadmap`, {});
    check('l\'admin passe une suggestion sur la feuille de route', r.status === 200, r.data);
    r = await admin.req('POST', '/api/admin/roadmap', { title: 'Site en bêta', col: 'termine' });
    check('ajout direct dans « Terminé »', r.status === 201, r.data);
    const rid = r.data.id;
    r = await admin.req('PATCH', `/api/admin/roadmap/${rid}`, { col: 'en_cours' });
    check('déplacement vers « En cours »', r.status === 200);
    r = await alice.req('GET', '/api/roadmap');
    check('les joueurs voient la feuille de route', r.data.items.length === 2 && r.data.items.some((i) => i.id === rid && i.col === 'en_cours'), r.data);
    r = await bob.req('POST', `/api/suggestions/${sid}/vote`, {});
    check('votes fermés sur une idée planifiée', r.status === 400, r.data);
    r = await admin.req('PATCH', `/api/admin/suggestions/${sid}`, { status: 'masquee' });
    r = await bob.req('GET', '/api/suggestions');
    check('suggestion masquée invisible pour les joueurs', !r.data.suggestions.some((x) => x.id === sid));

    console.log('\n— Blocage d\'un joueur —');
    const closed = new Promise((res) => wsBob.on('close', (c) => res(c)));
    r = await admin.req('POST', `/api/admin/users/${bobId}/block`, { blocked: true });
    check('l\'admin bloque Bob', r.status === 200, r.data);
    check('Bob est déconnecté du temps réel', (await Promise.race([closed, wait(2000)])) === 4001);
    r = await bob.req('GET', '/api/friends');
    check('la session de Bob ne marche plus', r.status === 401);
    r = await bob.req('POST', '/api/auth/login', { username: 'Bob', password: 'motdepasse2' });
    check('Bob ne peut plus se connecter', r.status === 403, r.data);
    r = await admin.req('POST', `/api/admin/users/${bobId}/reset-password`, {});
    const temp = r.data && r.data.password;
    await admin.req('POST', `/api/admin/users/${bobId}/block`, { blocked: false });
    r = await bob.req('POST', '/api/auth/login', { username: 'Bob', password: temp });
    check('débloqué + mot de passe provisoire fonctionne', r.status === 200, r.data);
    r = await bob.req('POST', '/api/auth/password', { current: temp, next: 'nouveau-mdp-bob' });
    check('Bob change son mot de passe', r.status === 200, r.data);

    console.log('\n— Pages et fichiers —');
    r = await intrus.req('GET', '/');
    check('accueil → redirection vers /connexion si non connecté', r.status === 302 && r.headers.get('location') === '/connexion');
    r = await alice.req('GET', '/admin');
    check('page admin → redirection pour un joueur', r.status === 302);
    r = await admin.req('GET', '/admin');
    check('page admin accessible à l\'admin', r.status === 200);
    r = await alice.req('GET', '/games/fps/');
    check('le FPS « bientôt disponible » ne s\'ouvre pas', r.status === 302);
    r = await alice.req('GET', '/api/games');
    check('catalogue : le FPS est « bientôt »', r.data.games.some((g) => g.id === 'fps' && g.status === 'bientot' && !g.playable), r.data);
    check('catalogue : Caméléon devient jouable dès que son serveur est chargé', r.data.games.some((g) => g.id === 'cameleon' && g.status === 'beta' && g.playable), r.data.games.map((g) => [g.id, g.status]));
    r = await alice.req('GET', '/games/cameleon/');
    check('un joueur peut ouvrir Caméléon', r.status === 200, r.status);
    r = await alice.req('GET', '/personnage');
    check('« Mon personnage » du site ouvre l\'atelier puis revient sur le site', r.status === 302 && r.headers.get('location') === '/games/fps/?personnage=1&retour=/', r.headers.get('location'));
    {
      const w = new WebSocket(`ws://127.0.0.1:${PORT}/games/cameleon/ws`, { headers: { Cookie: alice.cookie, Origin: BASE } });
      const recus = [];
      w.on('message', (x) => recus.push(JSON.parse(x)));
      await new Promise((res, rej) => { w.on('open', res); w.on('error', rej); });
      const attendreMsg = async (t, ms = 4000) => { const fin = Date.now() + ms; while (Date.now() < fin) { const m = recus.find((x) => x.t === t); if (m) return m; await new Promise((r2) => setTimeout(r2, 50)); } return null; };
      const salons = await attendreMsg('salons');
      check('Caméléon : le hall propose les 3 cartes', salons && salons.cartes.length === 3 && salons.moi && typeof salons.moi.nom === 'string', salons && salons.cartes);
      w.send(JSON.stringify({ t: 'creer', carte: 'jardin', seul: 1, role: 'chercheur' }));
      const manche = await attendreMsg('manche');
      const moi = manche && manche.joueurs.find((j) => j.id === salons.moi.id);
      check('Caméléon : seul avec des bots, on commence comme chercheur (rôle choisi)', manche && moi && moi.role === 'chercheur' && manche.joueurs.length === 4, manche);
      w.close();
    }
    r = await fetch(BASE + '/games/fps/../../server/config.js');
    check('impossible de lire le code du serveur', r.status === 404 || r.status === 400 || r.status === 302);
    r = await fetch(BASE + '/');
    check('en-tête Content-Security-Policy présent', /script-src 'self'/.test(r.headers.get('content-security-policy') || ''));

    console.log('\n— Jeu FPS : accès —');
    r = await admin.req('GET', '/api/games');
    check('l\'admin voit « Tester » sur le FPS', r.data.games.some((g) => g.id === 'fps' && g.canTest), r.data);
    r = await admin.req('GET', '/games/fps/');
    check('l\'admin peut ouvrir le FPS pour le tester', r.status === 200);
    const fpsUrl = `ws://127.0.0.1:${PORT}/games/fps/ws`;
    const refus = await new Promise((resolve) => {
      const w = new WebSocket(fpsUrl, { headers: { Cookie: alice.cookie, Origin: BASE } });
      w.on('open', () => { w.close(); resolve('ouvert'); });
      w.on('unexpected-response', (req, res) => resolve(res.statusCode));
      w.on('error', () => resolve('erreur'));
    });
    check('un joueur ne peut pas entrer dans le FPS « bientôt »', refus === 403, refus);
    const wsJeu = await new Promise((resolve, reject) => {
      const w = new WebSocket(fpsUrl, { headers: { Cookie: admin.cookie, Origin: BASE } });
      w.messages = [];
      w.on('message', (m) => w.messages.push(JSON.parse(m)));
      w.on('open', () => resolve(w));
      w.on('error', reject);
    });
    const attendre = async (t, ms = 2000) => {
      const end = Date.now() + ms;
      while (Date.now() < end) {
        const i = wsJeu.messages.findIndex((m) => m.t === t);
        if (i >= 0) return wsJeu.messages.splice(i, 1)[0];
        await wait(20);
      }
      return null;
    };
    check('le hall du jeu envoie la liste des parties', !!(await attendre('salons')));
    const monStyle = await attendre('monStyle');
    check('apparence : rien d\'enregistré au début', monStyle && monStyle.style === null, monStyle);
    const visage = 'ff0000'.repeat(64);
    wsJeu.send(JSON.stringify({ t: 'sauverStyle', style: { peau: '#C68642', haut: 'sweat', chapeau: 'couronne', visage, pirate: 'oui', hautC1: 'rouge' } }));
    const sauve = await attendre('styleSauve');
    check('apparence : enregistrée et vérifiée par le serveur', sauve && sauve.style.peau === '#c68642' && sauve.style.haut === 'sweat'
      && sauve.style.chapeau === 'couronne' && sauve.style.visage === visage && !('pirate' in sauve.style) && sauve.style.hautC1 === '#2fb5ff', sauve);
    wsJeu.send(JSON.stringify({ t: 'sauverStyle', style: { peau: '#000000' } }));
    const tropVite = await attendre('erreur');
    check('apparence : pas plus d\'un enregistrement toutes les 2 secondes', !!tropVite);
    wsJeu.send(JSON.stringify({ t: 'creer', mode: 'equipes' }));
    const bienvenue = await attendre('bienvenue');
    check('apparence : visible par les autres joueurs de la partie', bienvenue && bienvenue.joueurs.some((j) => j.style && j.style.chapeau === 'couronne'), bienvenue && bienvenue.joueurs);
    check('création d\'une partie en équipes', bienvenue && bienvenue.mode === 'equipes' && /^[A-Z]{4}$/.test(bienvenue.code), bienvenue);
    check('une nouvelle partie commence par la salle d\'attente', bienvenue && bienvenue.etat === 'attente', bienvenue && bienvenue.etat);
    check('on n\'apparaît pas avant d\'avoir choisi ses armes', !(await attendre('apparition', 400)));
    wsJeu.send(JSON.stringify({ t: 'equipement', e: { principale: 'fusil', secondaire: 'couteau', melee: 'couteau', gadget: 'grenade' } }));
    check('un équipement mal rempli est refusé', !!(await attendre('erreur')));
    wsJeu.send(JSON.stringify({ t: 'equipement', e: { principale: 'arbalete', secondaire: 'revolver', melee: 'poele', gadget: 'grappin' } }));
    const eqOk = await attendre('equipementOk');
    const app = await attendre('apparition');
    check('après le choix des armes, le joueur apparaît avec son arme principale', eqOk && app && app.pv === 100 && app.eq.length === 4 && app.arme === app.eq[0], app);
    check('les positions sont envoyées 20 fois par seconde', !!(await attendre('s')));
    wsJeu.send(JSON.stringify({ t: 'quitter' }));
    const apres = await attendre('salons');
    check('quitter : la partie vide est supprimée', apres && apres.liste.length === 0, apres);
    wsJeu.send(JSON.stringify({ t: 'creer', mode: 'classe', niveau: 99 }));
    const bClasse = await attendre('bienvenue');
    check('classé : création d\'une partie, niveau des bots limité à 20', bClasse && bClasse.mode === 'classe' && bClasse.niveauBots === 20, bClasse && [bClasse.mode, bClasse.niveauBots]);
    wsJeu.send(JSON.stringify({ t: 'quitter' }));
    const apresClasse = await attendre('salons');
    check('classé : la partie vide est supprimée (avec ses bots)', apresClasse && apresClasse.liste.length === 0, apresClasse);

    console.log('\n— Jeu FPS : atelier d\'animations —');
    const anims = '/games/fps/api/animations';
    const cle0 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const recharge = { duree: 99, mouvement: 'fluide', pistes: { arme: [cle0, [1, 0, 0.1, 0, 0.2, 0, 0, 0, 1], [2.1, 0, 0, 0, 0, 0, 0, 0, 0]], inconnue: [cle0] }, sons: [[0.5, 'chargeur_retire']] };
    r = await fetch(BASE + anims);
    check('animations : il faut être connecté', r.status === 401, r.status);
    r = await alice.req('GET', anims);
    check('animations : un joueur connecté les reçoit (aucune au début)', r.status === 200 && JSON.stringify(r.data.animations) === '{}', r.data);
    r = await alice.req('PUT', `${anims}/fusil/recharge`, { animation: recharge });
    check('animations : un joueur ne peut pas en enregistrer', r.status === 403, r.data);
    r = await admin.req('PUT', `${anims}/fusil/recharge`, { animation: recharge }, { Origin: 'https://site-pirate.example' });
    check('animations : refusé depuis un autre site', r.status === 403, r.data);
    r = await admin.req('PUT', `${anims}/fusil/recharge`, { animation: recharge });
    check('animations : l\'admin enregistre ; durée imposée par le jeu et pistes inconnues retirées',
      r.status === 200 && r.data.animation.duree === 2.1 && !r.data.animation.pistes.inconnue && r.data.animation.pistes.arme[1][8] === 1, r.data);
    const annonce = await attendre('animations');
    check('animations : les joueurs déjà en jeu reçoivent la nouvelle animation', annonce && annonce.animations.fusil && annonce.animations.fusil.recharge, annonce);
    check('animations : enregistrées dans le dossier data', fs.existsSync(path.join(DATA, 'fps-animations.json')));
    r = await admin.req('PUT', `${anims}/couteau/recharge`, { animation: recharge });
    check('animations : refusée pour un moment qui n\'existe pas (recharge du couteau)', r.status === 400, r.data);
    r = await admin.req('PUT', `${anims}/fusil/recharge`, { animation: { ...recharge, sons: [[0.2, '../../etc/passwd']] } });
    check('animations : son inconnu refusé', r.status === 400, r.data);
    r = await admin.req('PUT', `${anims}/fusil/recharge`, { animation: { ...recharge, pistes: { arme: Array.from({ length: 61 }, (_, i) => [i * 0.03, 0, 0, 0, 0, 0, 0, 0, 0]) } } });
    check('animations : trop de clés refusées', r.status === 400, r.data);
    r = await admin.req('PUT', `${anims}/poele/inspecter`, { animation: { duree: 2, pistes: { mainD: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0.05, 0, 0, 0, 0, 0, 0, 0, 1]] } } });
    check('animations : une main peut être détachée de l\'arme', r.status === 200 && r.data.animation.pistes.mainD[1][9] === 1 && r.data.animation.pistes.mainD[0][9] === 0, r.data);
    await admin.req('DELETE', `${anims}/poele/inspecter`);
    r = await admin.req('PUT', `${anims}/fusil/sortir`, { animation: { duree: 30, pistes: { arme: [cle0] } } });
    check('animations : durée libre limitée (sortir : 2 s maximum)', r.status === 200 && r.data.animation.duree === 2, r.data);
    r = await alice.req('GET', anims);
    check('animations : les joueurs reçoivent les animations enregistrées', r.data.animations.fusil && r.data.animations.fusil.recharge && r.data.animations.fusil.sortir, r.data);
    r = await admin.req('DELETE', `${anims}/fusil/sortir`);
    check('animations : l\'admin peut remettre l\'animation d\'origine', r.status === 200 && (await alice.req('GET', anims)).data.animations.fusil.sortir === undefined);
    r = await admin.req('DELETE', `${anims}/fusil/sortir`);
    check('animations : rien à supprimer deux fois', r.status === 404, r.data);
    r = await admin.req('GET', '/games/fps/atelier-animations.html');
    check('la page de l\'atelier d\'animations s\'ouvre', r.status === 200);

    console.log('\n— Jeu FPS : sons perso et danses —');
    const sonsApi = '/games/fps/api/sons';
    const envoyerSon = (c, contenu, type, nom = 'Mon son', origine = BASE) => fetch(`${BASE}${sonsApi}?nom=${encodeURIComponent(nom)}`, {
      method: 'POST', headers: { Cookie: c.cookie, Origin: origine, 'Content-Type': type }, body: contenu,
    }).then(async (x) => ({ status: x.status, data: await x.json().catch(() => null) }));
    const wav = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WAVEfmt '), Buffer.alloc(200)]);
    r = await fetch(BASE + sonsApi);
    check('sons : il faut être connecté', r.status === 401);
    r = await envoyerSon(alice, wav, 'audio/wav');
    check('sons : un joueur ne peut pas en envoyer', r.status === 403, r);
    r = await envoyerSon(admin, wav, 'audio/wav', 'Pirate', 'https://site-pirate.example');
    check('sons : refusé depuis un autre site', r.status === 403, r);
    r = await envoyerSon(admin, 'nom=truc', 'application/x-www-form-urlencoded');
    check('sons : un formulaire n\'est pas un son', r.status === 415, r);
    r = await envoyerSon(admin, Buffer.from('<script>alert(1)</script> pas un son'), 'audio/mpeg');
    check('sons : un faux fichier son est refusé', r.status === 400, r);
    r = await envoyerSon(admin, Buffer.alloc(4 * 1024 * 1024 + 10, 0xff), 'audio/mpeg');
    check('sons : fichier trop gros refusé', r.status === 413, r);
    r = await envoyerSon(admin, wav, 'audio/wav', 'Musique <b>disco</b>');
    const sonId = r.data && r.data.son && r.data.son.id;
    check('sons : l\'admin envoie un son (nom nettoyé)', r.status === 201 && /^p[a-z0-9]{10}$/.test(sonId || '') && r.data.son.nom === 'Musique bdisco/b', r);
    r = await fetch(`${BASE}${sonsApi}/${sonId}`, { headers: { Cookie: alice.cookie } });
    check('sons : les joueurs peuvent l\'écouter', r.status === 200 && r.headers.get('content-type') === 'audio/wav');
    check('sons : enregistré dans le dossier data', fs.readdirSync(path.join(DATA, 'fps-sons')).length === 1);

    const dansesApi = '/games/fps/api/danses';
    const envoyerDanse = (c, id, danse, type = 'application/vnd.fps+json') => fetch(`${BASE}${dansesApi}/${id}`, {
      method: 'PUT', headers: { Cookie: c.cookie, Origin: BASE, 'Content-Type': type }, body: JSON.stringify({ danse }),
    }).then(async (x) => ({ status: x.status, data: await x.json().catch(() => null) }));
    const danse = { nom: 'Disco', duree: 2, musique: `perso:${sonId}`, pistes: { brasD: [[0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 2.5, 0, 1]], inconnue: [[0, 0, 0, 0, 0, 0, 0]] }, sons: [[0.5, 'clic']] };
    r = await envoyerDanse(alice, 'dabc12345', danse);
    check('danses : un joueur ne peut pas en créer', r.status === 403, r);
    r = await envoyerDanse(admin, 'dabc12345', danse, 'application/json');
    check('danses : mauvais format refusé', r.status === 415, r);
    r = await envoyerDanse(admin, 'dabc12345', { ...danse, musique: 'perso:pzzzzzzzzzz' });
    check('danses : musique inconnue refusée', r.status === 400, r);
    r = await envoyerDanse(admin, '../../x', danse);
    check('danses : identifiant pas valable refusé', r.status === 400 || r.status === 404, r);
    r = await envoyerDanse(admin, 'dabc12345', danse);
    check('danses : l\'admin crée une danse (pièces inconnues retirées)', r.status === 200 && r.data.danse.nom === 'Disco' && r.data.danse.musique === `perso:${sonId}` && !r.data.danse.pistes.inconnue, r);
    r = await envoyerDanse(admin, 'dopt12345', { nom: 'Griddy', duree: 1, marcher: true, vitesse: 5, arme: 1, pistes: { jambeD: [[0, 0, 0, 0, 0.6, 0, 0, 0, 1, 0]] } });
    check('danses : options « avancer en dansant » et « garder l\'arme » (vitesse limitée à 1)', r.status === 200 && r.data.danse.marcher === true && r.data.danse.vitesse === 1 && r.data.danse.arme === true, r.data);
    await admin.req('DELETE', `${dansesApi}/dopt12345`);
    const annonceDanses = await attendre('danses');
    check('danses : les joueurs connectés reçoivent la nouvelle danse', annonceDanses && annonceDanses.danses.some((d) => d.id === 'dabc12345'), annonceDanses);
    r = await alice.req('GET', dansesApi);
    check('danses : les joueurs reçoivent la liste', r.status === 200 && r.data.danses.length === 1, r.data);
    r = await admin.req('PUT', `${anims}/fusil/recharge`, { animation: { ...recharge, sons: [[0.3, `perso:${sonId}`]] } });
    check('animations : un son perso peut être utilisé', r.status === 200, r.data);
    r = await admin.req('DELETE', `${sonsApi}/${sonId}`);
    check('sons : l\'admin peut supprimer un son', r.status === 200 && (await fetch(`${BASE}${sonsApi}/${sonId}`, { headers: { Cookie: alice.cookie } })).status === 404);
    r = await admin.req('DELETE', `${dansesApi}/dabc12345`);
    check('danses : l\'admin peut supprimer une danse', r.status === 200 && (await alice.req('GET', dansesApi)).data.danses.length === 0);
    wsJeu.close();

    console.log('\n— Jeu FPS : arbitre —');
    testerArbitre();
    console.log('\n— Jeu FPS : apparences —');
    testerApparences();
    console.log('\n— Jeu FPS : danses dans une partie —');
    testerDanses();
    console.log('\n— Jeu FPS : pouvoirs d\'admin —');
    testerPouvoirs();
    console.log('\n— Jeu FPS : laser de l\'admin —');
    testerLaser();
    testerPouvoirsAdmin();
    console.log('\n— Jeu FPS : mode classé —');
    testerClasse();
    testerCameleon();

    console.log('\n— Journal —');
    check('aucun pseudo ni mot de passe dans le journal', !/Alice|Bob|Carol|Patron|motdepasse/i.test(log), log);
    wsAlice.close();
  } finally {
    server.kill();
    fs.rmSync(DATA, { recursive: true, force: true });
  }

  console.log(`\n${passed} tests réussis, ${failed} échoué(s).`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
