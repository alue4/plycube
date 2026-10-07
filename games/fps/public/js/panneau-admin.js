// Panneau d'admin (Réglages → ADMIN PANEL), dans le style d'un terminal de hacker : à l'ouverture,
// des fenêtres s'allument dans les coins (système, journal, session, radar) autour du menu des pouvoirs.
// Les pouvoirs sont rangés par catégorie ; « serveur » = le serveur doit le savoir (il vérifie toujours
// que c'est bien l'admin du site). En bas, des boutons d'action (soin, réparer la carte, bots).
import { el } from './hud.js';

export const POUVOIRS = [
  { cle: 'vol', nom: 'VOL', section: 'MOUVEMENT', serveur: true },
  { cle: 'vitesse', nom: 'SUPER VITESSE', section: 'MOUVEMENT', serveur: true, aide: 'Tu cours plus de 2 fois plus vite.' },
  { cle: 'superSaut', nom: 'SUPER SAUT', section: 'MOUVEMENT', serveur: true, aide: 'Tu sautes 2,5 fois plus haut (sur les toits !).' },
  { cle: 'doubleSaut', nom: 'TRIPLE SAUT', section: 'MOUVEMENT', aide: 'En l\'air, appuie encore sur saut : deux sauts de plus.' },
  { cle: 'gravite', nom: 'GRAVITÉ LUNAIRE', section: 'MOUVEMENT', serveur: true, aide: 'Tu retombes tout doucement, comme sur la Lune.' },
  { cle: 'fantome', nom: 'PASSE-MURAILLE', section: 'MOUVEMENT', serveur: true, aide: 'Tu traverses les murs et les bâtiments (le sol te porte toujours).' },
  { cle: 'teleport', nom: 'TÉLÉPORTATION', section: 'MOUVEMENT', serveur: true, touche: 'teleporter', aide: 'Appuie sur {touche} : tu apparais là où tu vises (jusqu\'à 300 m).' },
  { cle: 'viseeAuto', nom: 'VISÉE AUTO', section: 'COMBAT', aide: 'Quand tu vises ou tires, le viseur se cale sur la tête de l\'adversaire visible le plus proche du viseur.' },
  { cle: 'precision', nom: 'PRÉCISION PARFAITE', section: 'COMBAT', serveur: true, aide: 'Aucune dispersion : chaque balle part pile au centre du viseur.' },
  { cle: 'sansRecul', nom: 'SANS RECUL', section: 'COMBAT', aide: 'L\'arme ne remonte plus quand tu tires.' },
  { cle: 'munitions', nom: 'MUNITIONS INFINIES', section: 'COMBAT', serveur: true, aide: 'Plus jamais besoin de recharger, et les gadgets sont prêts tout de suite.' },
  { cle: 'tirRapide', nom: 'TIR ULTRA RAPIDE', section: 'COMBAT', serveur: true, aide: 'Toutes les armes tirent 3 fois plus vite (même le sniper et le laser).' },
  { cle: 'oneShot', nom: 'ONE SHOT', section: 'COMBAT', serveur: true, aide: 'Chaque balle qui touche élimine d\'un coup.' },
  { cle: 'explosives', nom: 'BALLES EXPLOSIVES', section: 'COMBAT', serveur: true, aide: 'Chaque tir fait une petite explosion là où il touche (elle ne te blesse pas).' },
  { cle: 'frappe', nom: 'FRAPPE ORBITALE', section: 'COMBAT', serveur: true, touche: 'frappe', aide: 'Appuie sur {touche} en visant le sol : un rayon tombe du ciel 1,3 s plus tard. Énorme explosion !' },
  { cle: 'invincible', nom: 'INVINCIBLE', section: 'SURVIE', serveur: true, aide: 'Plus rien ne te fait de dégâts. Les autres voient une aura dorée autour de toi.' },
  { cle: 'vampire', nom: 'VAMPIRE', section: 'SURVIE', serveur: true, aide: 'La moitié des dégâts que tu fais te revient en vie.' },
  { cle: 'regen', nom: 'RÉGÉNÉRATION', section: 'SURVIE', serveur: true, aide: 'Ta vie remonte toute seule (+16 PV par seconde).' },
  { cle: 'wallhack', nom: 'VOIR À TRAVERS LES MURS', section: 'VISION', aide: 'Tu vois les adversaires en couleur à travers les murs (silhouette).' },
  { cle: 'radar', nom: 'RADAR', section: 'VISION', aide: 'Une mini-carte en haut à droite montre tous les joueurs (rouge = adversaires).' },
  { cle: 'nocturne', nom: 'VISION NOCTURNE', section: 'VISION', aide: 'Tout devient vert et lumineux, comme dans des jumelles de nuit.' },
  { cle: 'matrix', nom: 'MODE MATRIX', section: 'VISION', aide: 'Pluie de code vert sur l\'écran. Tu es l\'Élu.' },
  { cle: 'troisieme', nom: 'VUE 3E PERSONNE', section: 'VISION', aide: 'La caméra passe derrière toi : tu vois ton personnage.' },
  { cle: 'geant', nom: 'GÉANT', section: 'FUN', serveur: true, aide: 'Tout le monde te voit 2,5 fois plus grand, et tu vois de plus haut.' },
  { cle: 'mini', nom: 'MINI', section: 'FUN', serveur: true, aide: 'Tout le monde te voit tout petit, et tu vois à hauteur de souris.' },
  { cle: 'invisible', nom: 'INVISIBLE', section: 'FUN', serveur: true, aide: 'Les autres joueurs ne te voient plus (ils entendent quand même tes tirs).' },
  { cle: 'arcEnCiel', nom: 'TRAÎNÉE ARC-EN-CIEL', section: 'FUN', serveur: true, aide: 'Tu laisses une traînée de pixels arc-en-ciel derrière toi (tout le monde la voit).' },
  { cle: 'grossesTetes', nom: 'GROSSES TÊTES', section: 'FUN', aide: 'Les autres joueurs ont une tête énorme (seulement sur ton écran).' },
  { cle: 'disco', nom: 'MODE DISCO', section: 'FUN', aide: 'Les couleurs du jeu changent sans arrêt. Ambiance boîte de nuit.' },
  { cle: 'figerBots', nom: 'FIGER LES BOTS', section: 'BOTS', serveur: true, aide: 'Les bots d\'entraînement ne bougent plus et ne tirent plus.' },
];
// Boutons d'action (pas des interrupteurs)
export const ACTIONS_ADMIN = [
  { cle: 'soin', nom: 'VIE AU MAXIMUM', aide: 'Ta vie remonte à fond, tout de suite.' },
  { cle: 'reparer', nom: 'RÉPARER LA CARTE', aide: 'Tous les blocs cassés par le laser ou la frappe orbitale reviennent.' },
  { cle: 'bots+', nom: '+2 BOTS', aide: 'Deux bots d\'entraînement de plus (pendant l\'échauffement, 12 de plus au maximum).' },
  { cle: 'bots0', nom: 'ENLEVER LES BOTS', aide: 'Tous les bots d\'entraînement s\'en vont.' },
  { cle: 'botsNormal', nom: 'BOTS NORMAUX', aide: 'Le nombre de bots redevient celui de la carte.' },
];
const AIDES = Object.fromEntries(POUVOIRS.filter((p) => p.aide).map((p) => [p.cle, p.aide]));
const SECTIONS = [...new Set(POUVOIRS.map((p) => p.section))];
// Touches du panneau : 1 à 9 puis A, B, C... (dans l'ordre de la liste, pouvoirs puis actions)
const TOUCHES = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const BANNIERE = [
  ' █████  ██████  ███    ███ ██ ███    ██',
  '██   ██ ██   ██ ████  ████ ██ ████   ██',
  '███████ ██   ██ ██ ████ ██ ██ ██ ██  ██',
  '██   ██ ██   ██ ██  ██  ██ ██ ██  ██ ██',
  '██   ██ ██████  ██      ██ ██ ██   ████',
].join('\n');
const PORTEE_RADAR = 40; // mètres

const deux = (n) => String(n).padStart(2, '0');
const heure = () => { const d = new Date(); return `${deux(d.getHours())}:${deux(d.getMinutes())}:${deux(d.getSeconds())}`; };
const hexa = (n) => Math.floor(Math.random() * 16 ** n).toString(16).toUpperCase().padStart(n, '0');
const pid = () => 1000 + Math.floor(Math.random() * 8999);

export class PanneauAdmin {
  // etat(cle) : le pouvoir est-il activé ? · changer(cle, oui) · aideVol() : aide du vol (avec les touches choisies)
  // infos() : { nom, partie, carte, mode, joueurs, bots, ping, fps, position, pv, arme, commandes, manette, ecran }
  // radar() : null (pas de partie) ou { points: [{ x, z, ennemi }] } (x vers ma droite, z devant moi, en mètres)
  // agir(cle) : bouton d'action · libelle(action) : nom de la touche du jeu (ex. « T »)
  // facile : { etat(), changer(oui), aide() } : l'option « accès facile » (bouton transparent en jeu)
  // surFermer : appelé à la fermeture (posé par celui qui ouvre le panneau, ou null)
  constructor({ etat, changer, aideVol, infos, radar, son, agir, libelle, facile }) {
    Object.assign(this, { etat, changer, aideVol, infos, radar, son: son || (() => {}), agir: agir || (() => {}), libelle: libelle || (() => '?'), facile: facile || null });
    this.surFermer = null;
    this.estOuvert = false;
    this.minuteur = null;
    this.prochainLog = 0;
    this.construire();
    addEventListener('keydown', (e) => this.touche(e));
  }

  get ouvert() { return this.estOuvert; }

  construire() {
    const fenetre = (classe, titre, boutonFermer, ...contenu) => el('section', { class: `ap-fenetre ${classe}` },
      el('header', { class: 'ap-barre' }, el('span', { class: 'ap-titre-fenetre', text: titre }), boutonFermer || el('span', { class: 'ap-pid', text: `PID ${pid()}` })),
      el('div', { class: 'ap-corps' }, ...contenu));

    // Le menu des pouvoirs (au milieu)
    this.boot = el('div', { class: 'ap-boot' });
    this.options = el('div', { class: 'ap-options', role: 'group', 'aria-label': 'Pouvoirs d\'admin' });
    this.boutons = {};
    this.parTouche = {};
    this.liste = []; // tous les boutons, dans l'ordre (flèches)
    let n = 0;
    const touche = () => TOUCHES[n++] || '·';
    if (this.facile) {
      this.options.append(el('div', { class: 'ap-section', text: '── PANNEAU ──' }));
      const etat = el('span', { class: 'ap-etat' });
      const b = el('button', { class: 'ap-option', type: 'button', role: 'switch', 'aria-checked': 'false' },
        el('span', { class: 'ap-num', text: '[*]' }), el('span', { class: 'ap-nom', text: 'ACCÈS FACILE' }),
        el('span', { class: 'ap-points', 'aria-hidden': 'true' }), etat);
      b.addEventListener('click', () => {
        const oui = !this.facile.etat();
        this.facile.changer(oui);
        this.journal(`accès facile → ${oui ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`, true);
        this.son('clic');
        this.maj();
        this.aide.textContent = `> ${this.facile.aide()}`;
        b.classList.remove('ap-flash'); void b.offsetWidth; b.classList.add('ap-flash');
      });
      b.addEventListener('mouseenter', () => b.focus({ preventScroll: true }));
      b.addEventListener('focus', () => { this.choisir(b); this.aide.textContent = `> ${this.facile.aide()}`; });
      this.boutonFacile = { b, etat };
      this.liste.push(b);
      this.options.append(b);
    }
    for (const section of SECTIONS) {
      this.options.append(el('div', { class: 'ap-section', text: `── ${section} ──` }));
      for (const p of POUVOIRS.filter((x) => x.section === section)) {
        const etat = el('span', { class: 'ap-etat' });
        const k = touche();
        const b = el('button', { class: 'ap-option', type: 'button', role: 'switch', 'aria-checked': 'false' },
          el('span', { class: 'ap-num', text: `[${k}]` }), el('span', { class: 'ap-nom', text: p.nom }),
          el('span', { class: 'ap-points', 'aria-hidden': 'true' }), etat);
        b.addEventListener('click', () => this.basculer(p.cle));
        b.addEventListener('mouseenter', () => b.focus({ preventScroll: true }));
        b.addEventListener('focus', () => { this.choisir(b); this.decrire(p.cle); });
        this.boutons[p.cle] = { b, etat };
        this.parTouche[k] = () => { this.basculer(p.cle); b.focus({ preventScroll: true }); };
        this.liste.push(b);
        this.options.append(b);
      }
    }
    this.options.append(el('div', { class: 'ap-section', text: '── ACTIONS ──' }));
    for (const a of ACTIONS_ADMIN) {
      const k = touche();
      const b = el('button', { class: 'ap-option ap-action', type: 'button' },
        el('span', { class: 'ap-num', text: `[${k}]` }), el('span', { class: 'ap-nom', text: a.nom }),
        el('span', { class: 'ap-points', 'aria-hidden': 'true' }), el('span', { class: 'ap-etat', text: '[ EXÉCUTER ]' }));
      const faire = () => {
        this.agir(a.cle);
        this.journal(`exec ${a.cle} … OK`, true);
        this.son('clic');
        b.classList.remove('ap-flash'); void b.offsetWidth; b.classList.add('ap-flash');
      };
      b.addEventListener('click', faire);
      b.addEventListener('mouseenter', () => b.focus({ preventScroll: true }));
      b.addEventListener('focus', () => { this.choisir(b); this.aide.textContent = `> ${a.aide}`; });
      this.parTouche[k] = () => { faire(); b.focus({ preventScroll: true }); };
      this.liste.push(b);
      this.options.append(b);
    }
    this.btnTout = el('button', { class: 'ap-option ap-secondaire', type: 'button', onclick: () => this.toutCouper() },
      el('span', { class: 'ap-num', text: '[0]' }), el('span', { class: 'ap-nom', text: 'TOUT DÉSACTIVER' }));
    this.btnTout.addEventListener('mouseenter', () => this.btnTout.focus({ preventScroll: true }));
    this.btnTout.addEventListener('focus', () => { this.choisir(this.btnTout); this.decrire(null); });
    this.liste.push(this.btnTout);
    this.options.append(this.btnTout);
    this.aide = el('p', { class: 'ap-aide' });
    const fermer = el('button', { class: 'ap-fermer', type: 'button', 'aria-label': 'Fermer', 'data-retour': true, text: '[X]', onclick: () => this.fermer() });
    const principale = fenetre('ap-principale', 'root@plycube:~# admin-panel --mode menu', fermer,
      el('pre', { class: 'ap-banniere', 'aria-hidden': 'true', text: BANNIERE }),
      el('div', { class: 'ap-titre' }, 'ADMIN PANEL ', el('span', { class: 'ap-sep', text: '//' }), ' MODE MENU'),
      this.boot, this.options, this.aide,
      el('p', { class: 'ap-invite' }, 'root@plycube:~# ',el('span', { class: 'ap-curseur', text: '█' })),
      el('p', { class: 'ap-pied', text: '1-9, A-Z : activer / couper · 0 : tout couper · flèches + Entrée · Échap : quitter' }));

    // Les fenêtres des coins
    this.systeme = el('dl', { class: 'ap-infos' });
    this.journalListe = el('ol', { class: 'ap-journal' });
    this.session = el('dl', { class: 'ap-infos' });
    this.canvas = el('canvas', { class: 'ap-radar', width: 200, height: 200, 'aria-hidden': 'true' });
    this.legendeRadar = el('p', { class: 'ap-legende' });

    this.racine = el('div', { id: 'admin-panel', class: 'admin-panel', hidden: true, role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Admin panel' },
      el('div', { class: 'ap-ecran', 'aria-hidden': 'true' }),
      fenetre('ap-coin ap-hg', '─[ SYSTÈME ]─', null, this.systeme),
      fenetre('ap-coin ap-hd', '─[ JOURNAL ]─', null, this.journalListe),
      fenetre('ap-coin ap-bg', '─[ SESSION ]─', null, this.session),
      fenetre('ap-coin ap-bd', '─[ RADAR ]─', null, this.canvas, this.legendeRadar),
      principale);
    document.body.append(this.racine);
  }

  ouvrir() {
    this.estOuvert = true;
    this.racine.hidden = false;
    // on relance les animations d'allumage des fenêtres
    this.racine.classList.remove('ap-allume');
    void this.racine.offsetWidth;
    this.racine.classList.add('ap-allume');
    const i = this.infos();
    const lignes = ['> sudo admin-panel --mode menu', `[sudo] authentification de ${i.nom || 'admin'}… OK`, '> chargement de pouvoirs.sys… OK', '> ACCÈS AUTORISÉ'];
    this.boot.replaceChildren(...lignes.map((t, k) => {
      const n = el('div', { class: `ap-tape${k === lignes.length - 1 ? ' ap-ok' : ''}`, text: t });
      n.style.setProperty('--d', `${0.2 + k * 0.17}s`);
      return n;
    }));
    this.journalListe.textContent = '';
    ['connexion au serveur… OK', 'vérification du compte admin… OK', `chargement des pouvoirs (${POUVOIRS.length})… OK`, `bienvenue, ${i.nom || 'admin'}`]
      .forEach((t, k) => setTimeout(() => { if (this.estOuvert) this.journal(t); }, 400 + k * 240));
    this.prochainLog = performance.now() + 2600;
    this.maj();
    this.decrire(null);
    this.majInfos();
    clearInterval(this.minuteur);
    this.minuteur = setInterval(() => this.majInfos(), 300);
    this.boucleRadar();
    this.son('clic');
    this.boutons.vol.b.focus({ preventScroll: true });
  }

  fermer() {
    if (!this.estOuvert) return;
    this.estOuvert = false;
    this.racine.hidden = true;
    clearInterval(this.minuteur);
    this.minuteur = null;
    this.son('clic');
    const f = this.surFermer;
    this.surFermer = null;
    if (f) f();
  }

  // Les interrupteurs suivent l'état des pouvoirs (aussi quand on vole avec la touche V en jeu)
  maj() {
    if (this.boutonFacile) {
      const oui = !!this.facile.etat();
      this.boutonFacile.b.setAttribute('aria-checked', String(oui));
      this.boutonFacile.etat.textContent = oui ? '[  ACTIF  ]' : '[ INACTIF ]';
    }
    for (const p of POUVOIRS) {
      const { b, etat } = this.boutons[p.cle];
      const oui = !!this.etat(p.cle);
      b.setAttribute('aria-checked', String(oui));
      etat.textContent = oui ? '[  ACTIF  ]' : '[ INACTIF ]';
    }
  }

  basculer(cle) {
    const p = POUVOIRS.find((x) => x.cle === cle);
    const oui = !this.etat(cle);
    this.changer(cle, oui);
    this.journal(`pouvoir ${p.nom} → ${oui ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`, true);
    this.son('clic');
    this.decrire(cle);
    const b = this.boutons[cle].b;
    b.classList.remove('ap-flash');
    void b.offsetWidth;
    b.classList.add('ap-flash');
  }

  toutCouper() {
    const actifs = POUVOIRS.filter((p) => this.etat(p.cle));
    for (const p of actifs) this.changer(p.cle, false);
    this.journal(actifs.length ? 'tous les pouvoirs → DÉSACTIVÉS' : 'aucun pouvoir à couper', true);
    this.son('clic');
  }

  // Une seule ligne en surbrillance : celle sous la souris ou choisie au clavier / à la manette
  choisir(b) {
    for (const o of this.liste) o.classList.toggle('ap-choisie', o === b);
  }

  decrire(cle) {
    let t = 'choisis un pouvoir : sa touche entre crochets, ou les flèches puis Entrée.';
    if (cle === 'vol') t = this.aideVol();
    else if (cle) {
      const p = POUVOIRS.find((x) => x.cle === cle);
      t = (AIDES[cle] || '').replace('{touche}', p && p.touche ? this.libelle(p.touche) : '?');
    }
    this.aide.textContent = `> ${t}`;
  }

  // Une ligne dans le journal (fort = en couleur)
  journal(texte, fort = false) {
    const li = el('li', { class: fort ? 'fort' : '' }, el('span', { class: 't', text: heure() }), texte);
    this.journalListe.append(li);
    while (this.journalListe.children.length > 40) this.journalListe.firstChild.remove();
  }

  journalAuto(i) {
    const choix = [
      () => (i.partie ? `ping ${i.ping} ms` : 'en attente d\'une partie…'),
      () => `${i.fps} images/s`,
      () => (i.partie ? `scan : ${i.joueurs} joueur${i.joueurs > 1 ? 's' : ''} dans la partie ${i.partie}` : 'scan du hall… OK'),
      () => `paquet 0x${hexa(4)} reçu`,
      () => 'synchronisation des positions… OK',
      () => (i.partie ? (i.bots ? `bots actifs : ${i.bots}` : 'aucun bot dans la partie') : 'radar en veille'),
      () => 'anti-triche : admin reconnu, ignoré',
      () => `clé de session 0x${hexa(8)}`,
    ];
    this.journal(choix[Math.floor(Math.random() * choix.length)]());
  }

  majInfos() {
    if (!this.estOuvert) return;
    const i = this.infos();
    const remplir = (dl, lignes) => dl.replaceChildren(...lignes.flatMap(([k, v]) => [el('dt', { text: k }), el('dd', { text: v === null || v === undefined ? '—' : String(v) })]));
    remplir(this.systeme, [
      ['UTILISATEUR', i.nom], ['RÔLE', 'ADMIN'], ['PARTIE', i.partie || '— (hall)'], ['CARTE', i.carte], ['MODE', i.mode],
      ['JOUEURS', i.partie ? `${i.joueurs}${i.bots ? ` (${i.bots} bot${i.bots > 1 ? 's' : ''})` : ''}` : null],
      ['PING', i.partie ? `${i.ping} ms` : null], ['IMAGES/S', i.fps], ['HEURE', heure()],
    ]);
    const actifs = POUVOIRS.filter((p) => this.etat(p.cle)).length;
    remplir(this.session, [
      ['POSITION', i.position], ['VIE', i.pv], ['ARME', i.arme], ['COMMANDES', i.commandes], ['MANETTE', i.manette], ['ÉCRAN', i.ecran],
      ['POUVOIRS', `${'█'.repeat(Math.round((actifs / POUVOIRS.length) * 10))}${'░'.repeat(10 - Math.round((actifs / POUVOIRS.length) * 10))} ${actifs}/${POUVOIRS.length}`],
    ]);
    if (performance.now() > this.prochainLog) {
      this.journalAuto(i);
      this.prochainLog = performance.now() + 1300 + Math.random() * 1700;
    }
  }

  // ---------- Radar : les joueurs autour de moi (devant = en haut) ----------
  boucleRadar() {
    if (!this.estOuvert) return;
    requestAnimationFrame(() => this.boucleRadar());
    this.dessinerRadar(performance.now());
  }

  dessinerRadar(now) {
    const c = this.canvas;
    const w = c.clientWidth;
    if (!w) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const taille = Math.round(w * dpr);
    if (c.width !== taille) { c.width = taille; c.height = taille; }
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = w / 2;
    ctx.clearRect(0, 0, w, w);
    ctx.strokeStyle = 'rgba(57, 255, 136, .35)';
    ctx.lineWidth = 1;
    for (const k of [1, 2 / 3, 1 / 3]) { ctx.beginPath(); ctx.arc(r, r, (r - 2) * k, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(r, 2); ctx.lineTo(r, w - 2); ctx.moveTo(2, r); ctx.lineTo(w - 2, r); ctx.stroke();
    // le balayage qui tourne
    const a = ((now / 1000) * 1.6) % (Math.PI * 2);
    for (let k = 0; k < 12; k++) {
      ctx.beginPath();
      ctx.moveTo(r, r);
      ctx.arc(r, r, r - 2, a - (k + 1) * 0.06, a - k * 0.06);
      ctx.closePath();
      ctx.fillStyle = `rgba(57, 255, 136, ${0.22 * (1 - k / 12)})`;
      ctx.fill();
    }
    const d = this.radar();
    let legende = 'aucune partie : radar en veille';
    if (d) {
      for (const p of d.points) {
        const dist = Math.hypot(p.x, p.z) || 0.001;
        const k = Math.min(1, dist / PORTEE_RADAR) * (r - 6);
        ctx.fillStyle = p.ennemi ? '#ff4d5e' : '#39ff88';
        ctx.beginPath();
        ctx.arc(r + (p.x / dist) * k, r - (p.z / dist) * k, dist > PORTEE_RADAR ? 2 : 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      legende = `${d.points.length} signal${d.points.length > 1 ? 'aux' : ''} · portée ${PORTEE_RADAR} m`;
    }
    // moi, au centre
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(r, r - 6); ctx.lineTo(r - 4, r + 4); ctx.lineTo(r + 4, r + 4); ctx.closePath(); ctx.fill();
    if (this.legendeRadar.textContent !== legende) this.legendeRadar.textContent = legende;
  }

  // ---------- Clavier : 1-9 puis A-Z basculent, 0 coupe tout, flèches pour choisir ----------
  touche(e) {
    if (!this.estOuvert || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    const m = /^(Digit|Numpad)([0-9])$/.exec(e.code);
    const lettre = !m && typeof e.key === 'string' && e.key.length === 1 ? e.key.toUpperCase() : null;
    const k = m ? m[2] : lettre;
    if (k === '0') { e.preventDefault(); this.toutCouper(); return; }
    if (k && this.parTouche[k]) { e.preventDefault(); this.parTouche[k](); return; }
    if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
      e.preventDefault();
      const liste = this.liste;
      const i = liste.indexOf(document.activeElement);
      const j = i < 0 ? 0 : (i + (e.code === 'ArrowDown' ? 1 : -1) + liste.length) % liste.length;
      liste[j].focus({ preventScroll: false });
    }
  }
}
