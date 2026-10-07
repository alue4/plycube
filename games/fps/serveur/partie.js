// Une partie (un "salon") : la salle d'attente, les joueurs, les scores, et l'arbitrage.
//
// Le serveur est l'arbitre : c'est lui qui décide si un tir touche, combien de
// points de vie il enlève et qui gagne. Les navigateurs envoient seulement
// "je suis ici", "j'ai pris telle arme", "je tire / je frappe / je lance dans cette direction".
//
// Déroulement :
//   attente → la salle d'attente : on choisit ses armes et on peut s'échauffer (sans dégâts entre joueurs).
//             Quand on s'entraîne seul, des bots viennent jouer (voir bots.js).
//             La partie démarre toute seule quelques secondes après l'arrivée du 2e joueur prêt.
//   jeu     → la vraie partie (avec les scores).
//   fin     → le classement, puis une nouvelle manche démarre.
//
// Mode classé ('classe') : comme chacun pour soi, mais la partie démarre dès qu'un seul joueur est prêt,
// et des bots complètent la partie pendant toute la manche. Ils sont de plus en plus forts : niveau de départ
// (le rang du joueur), +1 tous les 3 éliminations du meilleur joueur, +1 à chaque manche gagnée (voir bots.js).
//
// Chaque joueur a 4 emplacements : arme principale, secondaire, mêlée, gadget.
const G = require('./geometrie');
const { Bots } = require('./bots');
const { gainPourPlace } = require('./classement');

const TICK_MS = 50;            // 20 mises à jour par seconde envoyées aux joueurs
const HISTORIQUE_MS = 1000;    // on garde 1 s de positions passées (pour être juste avec le ping)
const CATEGORIES = ['principale', 'secondaire', 'melee', 'gadget'];

// Pouvoirs d'admin que le serveur connaît (Réglages → ADMIN PANEL). Les autres pouvoirs (visée auto, wallhack,
// vision nocturne...) ne changent que l'affichage chez l'admin : le serveur n'a pas besoin de les connaître.
const POUVOIRS_SERVEUR = ['vol', 'precision', 'munitions', 'vitesse', 'superSaut', 'gravite', 'teleport', 'fantome', 'tirRapide',
  'oneShot', 'explosives', 'frappe', 'invincible', 'vampire', 'regen', 'geant', 'mini', 'invisible', 'arcEnCiel', 'figerBots'];
// Mini-explosion des « balles explosives » et frappe orbitale (comme une arme qui explose)
const MINI_EXPLOSION = { rayon: 3, degats: 45, degatsMin: 12, poussee: 7, autoDegats: 0 };
const FRAPPE = { rayon: 9, degats: 160, degatsMin: 45, poussee: 20, autoDegats: 0, delaiMs: 1300 };

const arrondi = (v) => Math.round(v * 100) / 100;
const arrondir = (v) => [arrondi(v[0]), arrondi(v[1]), arrondi(v[2])];

// Lit un tableau [x, y, z] de nombres envoyé par un navigateur (ou null s'il est invalide).
function vecteur(v) {
  if (!Array.isArray(v) || v.length !== 3) return null;
  for (const n of v) if (typeof n !== 'number' || !Number.isFinite(n) || Math.abs(n) > 1000) return null;
  return v;
}

// Dégâts d'une balle selon la distance (les armes perdent de la puissance de loin).
function degatsBalle(arme, distance, tete) {
  let d = arme.degats * (tete ? arme.multiplicateurTete : 1);
  if (arme.chute) {
    const [debut, fin, min] = arme.chute;
    if (distance >= fin) d *= min;
    else if (distance > debut) d *= 1 - (1 - min) * ((distance - debut) / (fin - debut));
  }
  return d;
}

// Direction vers laquelle regarde un joueur (à plat).
const devant = (j) => [-Math.sin(j.yaw), 0, -Math.cos(j.yaw)];

class Partie {
  constructor({ code, mode, reglages, carte, surVide, danseExiste = () => false, niveau = 1, classement = null }) {
    this.code = code;
    this.mode = mode; // 'solo' (chacun pour soi), 'equipes' ou 'classe' (chacun pour soi contre des bots)
    this.niveau = mode === 'classe' ? niveau : 1; // classé : niveau de départ des bots (1 à 20)
    this.classement = classement; // classé : points de rang des comptes (serveur/classement.js)
    this.r = reglages;
    this.armes = reglages.armes;
    this.indexArme = new Map(this.armes.map((a, i) => [a.id, i]));
    this.equipementDefaut = this.validerEquipement(Object.fromEntries(
      CATEGORIES.map((c, k) => [c, (reglages.equipementParDefaut || [])[k]])));
    this.carte = carte;
    // Les boîtes solides (qui arrêtent les balles), avec leur numéro dans carte.boites : le laser
    // de l'admin peut en « casser » (elles disparaissent un moment puis réapparaissent).
    this.boitesSolides = [];
    carte.boites.forEach((b, i) => { if (b[6] !== 'vitre' && b[6] !== 'invisible') this.boitesSolides.push({ b: b.slice(0, 6), i }); });
    this.casse = new Map(); // numéro de boîte cassée -> moment où elle réapparaît
    this.boites = this.boitesSolides.map((x) => x.b); // ce qui arrête les balles (recalculé quand ça casse)
    // Nombre de joueurs max : propre à la carte (les cartes XXL en acceptent plus), sinon celui des réglages.
    this.max = (carte.joueursMax && carte.joueursMax[mode]) || (mode === 'equipes' ? reglages.partie.joueursMaxEquipes : reglages.partie.joueursMaxChacunPourSoi);
    this.objectif = mode === 'equipes' ? reglages.partie.objectifEquipes
      : mode === 'classe' ? (reglages.partie.objectifClasse || reglages.partie.objectifChacunPourSoi) : reglages.partie.objectifChacunPourSoi;
    this.joueurs = new Map(); // id du compte -> joueur
    this.projectiles = new Map(); // roquettes, carreaux, fusées, grenades, fumigènes
    this.prochainProjectile = 1;
    this.surVide = surVide;
    this.danseExiste = danseExiste; // danses faites dans l'atelier
    this.tickNo = 0;
    this.etat = 'attente';
    this.attenteFinA = 0;
    this.scoresEquipes = [0, 0];
    this.finA = 0;
    this.redemarrageA = 0;
    this.bots = new Bots(this);
    this.botsBonus = 0;  // l'admin peut ajouter (ou enlever) des bots d'entraînement
    this.frappes = [];   // frappes orbitales de l'admin en attente : { j, p, a, at }
    this.zones = new Map(); // zones actives (trou noir, pluie de météores) : id -> zone
    this.prochaineZone = 1;
    this.retards = [];   // événements à déclencher plus tard (petites explosions du feu d'artifice, météores) : { at, f }
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  // Nombre de vrais joueurs (sans les bots)
  humains() {
    let n = 0;
    for (const j of this.joueurs.values()) if (!j.bot) n++;
    return n;
  }

  infos() {
    return {
      code: this.code, mode: this.mode, carte: this.carte.id, nomCarte: this.carte.nom,
      n: this.humains(), max: this.max, etat: this.etat,
      ...(this.mode === 'classe' ? { niveau: this.bots.niveau || this.niveau } : {}),
    };
  }

  // ---------- Envoi de messages ----------
  envoyer(j, msg) {
    if (j.ws.readyState === 1) j.ws.send(JSON.stringify(msg));
  }
  diffuser(msg, sauf) {
    const txt = JSON.stringify(msg);
    for (const j of this.joueurs.values()) if (j !== sauf && j.ws.readyState === 1) j.ws.send(txt);
  }

  infosPubliques(j) {
    return {
      id: j.id, nom: j.nom, equipe: j.equipe, style: j.style,
      kills: j.kills, morts: j.morts, vivant: j.vivant, arme: j.arme, eq: j.equipement, pret: !!j.equipement,
      p: arrondir([j.x, j.y, j.z]), yaw: arrondi(j.yaw),
      ...(j.bot ? { bot: 1 } : {}),
      ...(j.danse ? { danse: j.danse } : {}),
      ...(this.look(j) ? { l: this.look(j) } : {}),
    };
  }

  // Ce que tout le monde voit des pouvoirs de l'admin : 1 géant, 2 mini, 4 invisible, 8 traînée arc-en-ciel,
  // 16 aura dorée (invincible)
  look(j) {
    const p = j.admin && j.pouvoirs;
    if (!p) return 0;
    return (p.geant ? 1 : 0) | (p.mini ? 2 : 0) | (p.invisible ? 4 : 0) | (p.arcEnCiel ? 8 : 0) | (p.invincible ? 16 : 0);
  }

  // Seulement pour l'admin du site (vérifié ici, pas par le navigateur)
  changerPouvoirs(j, data) {
    if (!j.admin) return;
    const avant = this.look(j);
    j.pouvoirs = Object.fromEntries(POUVOIRS_SERVEUR.map((k) => [k, !!data[k]]));
    if (j.pouvoirs.geant && j.pouvoirs.mini) j.pouvoirs.mini = false;
    const apres = this.look(j);
    if (apres !== avant) this.diffuser({ t: 'look', id: j.id, l: apres });
  }

  // Les bots sont-ils figés (pouvoir d'admin) ?
  botsFiges() {
    for (const j of this.joueurs.values()) if (j.admin && j.pouvoirs.figerBots) return true;
    return false;
  }

  // Boutons d'action du panneau d'admin (pas des interrupteurs) : se soigner, réparer la carte, bots, frappe orbitale
  actionAdmin(j, data) {
    if (!j.admin) return;
    const now = Date.now();
    if (now - (j.derniereAction || 0) < 200) return;
    j.derniereAction = now;
    switch (data.a) {
      case 'soin':
        if (j.vivant) { j.pv = this.r.joueur.pointsDeVie; j.brule = null; this.envoyer(j, { t: 'pv', pv: j.pv, admin: 1 }); }
        break;
      case 'reparer': this.toutReparer(); break;
      case 'bots+': this.botsBonus = Math.max(0, this.botsBonus) + 2; if (this.botsBonus > 12) this.botsBonus = 12; this.bots.dernierJoueurActif = now; break;
      case 'bots0': this.botsBonus = -99; break;
      case 'botsNormal': this.botsBonus = 0; this.bots.dernierJoueurActif = now; break;
      case 'frappe': this.frappeOrbitale(j, data, now); return;
      default: return;
    }
    this.envoyer(j, { t: 'adminOk', a: data.a, bonus: this.botsBonus });
  }

  // Frappe orbitale : un rayon tombe du ciel là où l'admin vise, 1,3 s plus tard (explosion énorme, carte cassée)
  frappeOrbitale(j, data, now) {
    if (!j.vivant || !j.pouvoirs.frappe || now - (j.derniereFrappe || 0) < 2500) return;
    const d = G.normaliser(vecteur(data.d) || [0, 0, 0]);
    if (!d) return;
    const oeil = [j.x, j.y + G.HAUTEUR_YEUX, j.z];
    const t = G.rayonCarte(oeil, d, this.boites, 400);
    if (t >= 400) return; // on ne vise rien (le ciel)
    const p = [oeil[0] + d[0] * Math.max(0, t - 0.2), oeil[1] + d[1] * Math.max(0, t - 0.2), oeil[2] + d[2] * Math.max(0, t - 0.2)];
    j.derniereFrappe = now;
    this.frappes.push({ j, p, a: j.arme, at: now + FRAPPE.delaiMs });
    this.diffuser({ t: 'frappe', id: j.id, p: arrondir(p), dans: FRAPPE.delaiMs });
  }

  // Balles explosives : une petite explosion au point d'impact (au plus une toutes les 110 ms)
  miniExplosion(j, p, a, now) {
    if (now - (j.derniereMini || 0) < 110) return;
    j.derniereMini = now;
    this.exploser({ id: 0, type: 'mini', tireur: j, a }, p, MINI_EXPLOSION);
  }

  // ---------- Équipement (les 4 armes du joueur) ----------
  // e = { principale: 'fusil', secondaire: 'pistolet', melee: 'couteau', gadget: 'grenade' }
  // Renvoie les 4 numéros d'armes, ou null si ce n'est pas valable.
  validerEquipement(e, admin = false) {
    if (!e || typeof e !== 'object') return null;
    const res = [];
    for (const c of CATEGORIES) {
      const i = this.indexArme.get(String(e[c]));
      if (i === undefined || this.armes[i].categorie !== c) return null;
      if (this.armes[i].admin && !admin) return null; // armes d'admin (laser) réservées à l'admin du site
      res.push(i);
    }
    return res;
  }

  choisirEquipement(j, data) {
    const eq = this.validerEquipement(data.e, j.admin);
    if (!eq) { this.envoyer(j, { t: 'erreur', message: 'Cet équipement n\'est pas valable.' }); return; }
    // En pleine partie, les nouvelles armes sont pour la prochaine apparition.
    // Pendant l'échauffement (salle d'attente), on réapparaît tout de suite avec.
    if (j.vivant && this.etat !== 'attente') {
      j.prochainEquipement = eq;
      this.envoyer(j, { t: 'equipementOk', eq, plusTard: 1 });
      return;
    }
    j.equipement = eq;
    j.prochainEquipement = null;
    this.envoyer(j, { t: 'equipementOk', eq });
    // Première fois, échauffement, ou retour après "Changer d'armes" : on apparaît tout de suite si on n'attend pas déjà.
    if (!j.reapparitionA) this.apparaitre(j);
    this.annoncerAttente();
  }

  // ---------- Arrivée / départ ----------
  // style : l'apparence du personnage (ou null = apparence par défaut)
  ajouter(ws, user, style = null) {
    if (this.joueurs.has(user.id)) this.retirer(user.id); // même compte dans un autre onglet
    // Partie pleine à cause des bots : un bot laisse sa place
    const bots = this.bots.liste();
    if (bots.length && this.joueurs.size >= this.max) this.bots.retirer(bots[bots.length - 1]);
    const j = this.creerJoueur({ id: user.id, nom: user.username, ws, style });
    j.admin = !!user.isAdmin; // l'admin du site a des pouvoirs (voler, précision parfaite) s'il les active
    this.joueurs.set(j.id, j);
    this.envoyer(j, {
      t: 'bienvenue', code: this.code, mode: this.mode, carte: this.carte.id, moi: j.id, objectif: this.objectif,
      niveauBots: this.mode === 'classe' ? (this.bots.niveau || this.niveau) : undefined,
      carteData: this.carte.perso ? this.carte : undefined, // carte faite dans l'éditeur : on envoie tout

      joueurs: [...this.joueurs.values()].map((x) => this.infosPubliques(x)),
      scores: this.scoresEquipes, etat: this.etat,
      finDans: Math.max(0, this.finA - Date.now()),
      attenteDans: this.etat === 'attente' && this.attenteFinA ? Math.max(0, this.attenteFinA - Date.now()) : null,
      redemarrageDans: this.etat === 'fin' ? Math.max(0, this.redemarrageA - Date.now()) : 0,
      casse: this.casse.size ? [...this.casse.keys()] : undefined, // blocs actuellement cassés (laser admin)
    });
    this.diffuser({ t: 'entree', joueur: this.infosPubliques(j) }, j);
    // Le joueur apparaîtra quand il aura choisi ses armes (message 'equipement').
    return j;
  }

  // Un nouveau joueur (vrai joueur ou bot), pas encore apparu sur la carte.
  creerJoueur({ id, nom, ws, style = null, bot = false }) {
    return {
      id, nom, ws, bot,
      equipe: this.mode === 'equipes' ? this.equipeLaMoinsRemplie(bot) : null,
      style, // apparence du personnage (voir serveur/apparences.js)
      x: 0, y: 0, z: 0, yaw: 0, pitch: 0, visee: false,
      pv: 0, vivant: false, vie: 0, protegeJusqua: 0, reapparitionA: 0, libreJusqua: 0,
      kills: 0, morts: 0, serie: 0,
      equipement: null, prochainEquipement: null,
      arme: 0, munitions: this.armes.map((a) => a.chargeur), dernierTir: this.armes.map(() => 0),
      rechargeA: 0, rechargeArme: 0, pretA: 0, gadgetPretA: 0, soinA: 0, brule: null,
      historique: [], derniereMaj: Date.now(), dernierCorr: 0, rtt: bot ? 0 : 80, actif: true,
      admin: false, pouvoirs: {},
    };
  }

  retirer(id, ws) {
    const j = this.joueurs.get(id);
    if (!j || (ws && j.ws !== ws)) return;
    this.joueurs.delete(id);
    if (j.ws.partie === this) j.ws.partie = null;
    for (const pr of [...this.projectiles.values()]) if (pr.type === 'mine' && pr.tireur === j) this.finProjectile(pr, pr.p); // ses mines disparaissent
    this.diffuser({ t: 'sortie', id });
    if (this.humains() === 0) {
      this.bots.toutRetirer();
      clearInterval(this.timer);
      this.surVide(this.code);
      return;
    }
    this.annoncerAttente();
  }

  // Les vrais joueurs sont répartis entre eux (les bots partiront au début de la partie) ;
  // un bot va dans l'équipe où il y a le moins de monde, bots compris.
  equipeLaMoinsRemplie(pourBot = false) {
    const n = [0, 0];
    for (const j of this.joueurs.values()) if ((j.equipe === 0 || j.equipe === 1) && (pourBot || !j.bot)) n[j.equipe]++;
    if (n[0] === n[1]) return Math.random() < 0.5 ? 0 : 1;
    return n[0] < n[1] ? 0 : 1;
  }

  // ---------- Salle d'attente ----------
  annoncerAttente() {
    if (this.etat !== 'attente') return;
    const prets = [...this.joueurs.values()].filter((x) => x.equipement && !x.bot);
    // Classé : on joue contre des bots, donc un seul joueur prêt suffit, et ça démarre vite.
    const classe = this.mode === 'classe';
    const besoin = classe ? 1 : 2;
    const secondes = classe ? (this.r.partie.attenteClasseSecondes || 5) : this.r.partie.attenteSecondes;
    if (prets.length >= besoin && !this.attenteFinA) this.attenteFinA = Date.now() + secondes * 1000;
    if (prets.length < besoin) this.attenteFinA = 0;
    this.diffuser({
      t: 'attente',
      dans: this.attenteFinA ? Math.max(0, this.attenteFinA - Date.now()) : null,
      prets: prets.map((x) => x.id),
    });
  }

  // ---------- Messages reçus d'un joueur ----------
  message(j, data) {
    switch (data.t) {
      case 'm': return this.deplacement(j, data);
      case 'tir': return this.tir(j, data);
      case 'arme': return this.changerArme(j, data);
      case 'rech': return this.commencerRecharge(j);
      case 'equipement': return this.choisirEquipement(j, data);
      case 'danse': return this.danser(j, data);
      case 'pouvoirs': return this.changerPouvoirs(j, data); // seulement pour l'admin du site (vérifié là-bas)
      case 'admin': return this.actionAdmin(j, data);
      case 'pong':
        if (typeof data.s === 'number') {
          const rtt = Math.min(1000, Math.max(0, Date.now() - data.s));
          j.rtt = j.rtt * 0.7 + rtt * 0.3;
        }
        return undefined;
      default: return undefined;
    }
  }

  // Le navigateur dit où est son joueur. On vérifie que ce n'est pas de la triche
  // (téléportation, vitesse impossible) ; sinon on le remet à sa dernière position.
  deplacement(j, data) {
    if (!j.vivant || data.v !== j.vie) return;
    const p = vecteur(data.p);
    const r = data.r;
    if (!p || !Array.isArray(r) || !Number.isFinite(r[0]) || !Number.isFinite(r[1])) return;
    const now = Date.now();
    const dt = Math.min(1, (now - j.derniereMaj) / 1000);
    const T = this.carte.taille;
    const libre = now < j.libreJusqua; // juste après une explosion ou un grappin : on peut voler vite !
    const pv = j.admin ? j.pouvoirs : {};
    // l'admin qui vole, se téléporte ou traverse les murs : on ne vérifie que les bords de la carte
    const vol = !!(pv.vol || pv.teleport || pv.fantome);
    const vMax = (libre ? 34 : this.r.joueur.vitesse * 1.35) * (pv.vitesse ? 2.6 : 1);
    const monteeMax = (libre ? 34 : 20) * (pv.superSaut ? 2.6 : 1);
    const horizontal = Math.hypot(p[0] - j.x, p[2] - j.z);
    const montee = p[1] - j.y;
    if (Math.abs(p[0]) > T || Math.abs(p[2]) > T || p[1] < -10 || p[1] > (vol ? 90 : 60)
        || (!vol && horizontal > vMax * dt + 1.2)
        || (!vol && montee > monteeMax * dt + 1.2)) {
      return this.corriger(j, now);
    }
    j.x = p[0]; j.y = p[1]; j.z = p[2];
    j.yaw = r[0] % (Math.PI * 2);
    j.pitch = Math.max(-1.6, Math.min(1.6, r[1]));
    j.visee = !!data.z;
    j.actif = data.a === undefined ? true : !!data.a; // en train de jouer (pas dans un menu)
    j.derniereMaj = now;
    this.memoriser(j, now);
  }

  // Le joueur danse (d = identifiant de la danse) ou arrête (d = null) : les autres le voient.
  danser(j, data) {
    const now = Date.now();
    if (!j.vivant || now - (j.derniereDanse || 0) < 200) return;
    const d = data.d === null || data.d === undefined ? null : String(data.d).slice(0, 20);
    if (d !== null && !this.danseExiste(d)) return;
    if (d === (j.danse || null)) return;
    j.derniereDanse = now;
    j.danse = d;
    this.diffuser({ t: 'danse', id: j.id, d }, j);
  }

  arreterDanse(j) {
    if (!j.danse) return;
    j.danse = null;
    this.diffuser({ t: 'danse', id: j.id, d: null }, j);
  }

  corriger(j, now) {
    j.derniereMaj = now;
    if (now - j.dernierCorr < 250) return;
    j.dernierCorr = now;
    this.envoyer(j, { t: 'corr', p: arrondir([j.x, j.y, j.z]), vie: j.vie });
  }

  memoriser(j, now) {
    j.historique.push({ t: now, x: j.x, y: j.y, z: j.z });
    while (j.historique.length > 2 && j.historique[0].t < now - HISTORIQUE_MS) j.historique.shift();
  }

  // Où était ce joueur à l'instant t ? (pour compenser le délai réseau du tireur)
  positionPassee(j, t) {
    const h = j.historique;
    if (!h.length || t >= h[h.length - 1].t) return [j.x, j.y, j.z];
    if (t <= h[0].t) return [h[0].x, h[0].y, h[0].z];
    for (let i = h.length - 1; i > 0; i--) {
      const a = h[i - 1];
      const b = h[i];
      if (a.t <= t) {
        const k = (t - a.t) / Math.max(1, b.t - a.t);
        return [a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, a.z + (b.z - a.z) * k];
      }
    }
    return [j.x, j.y, j.z];
  }

  // Les adversaires qu'on peut toucher (pas soi-même, pas ses coéquipiers), à l'instant t.
  cibles(j, t) {
    const res = [];
    for (const autre of this.joueurs.values()) {
      if (autre === j || !autre.vivant) continue;
      if (this.mode === 'equipes' && autre.equipe === j.equipe) continue; // pas de tir ami
      const pos = this.positionPassee(autre, t);
      res.push({ autre, pos, b: G.boitesJoueur(pos[0], pos[1], pos[2]) });
    }
    return res;
  }

  // ---------- Carte cassée par le laser de l'admin ----------
  recalculerBoites() {
    this.boites = this.boitesSolides.filter((x) => !this.casse.has(x.i)).map((x) => x.b);
  }

  // Casse les boîtes solides à moins de "rayon" du point d'impact (elles réapparaissent après "ms").
  // casseSol = false : on ne casse pas le sol (blocs enfoncés sous le niveau 0 et pas plus hauts que 2,5 m :
  // sol des cartes, terrain de l'île, pont, douves). Les murs, tours et bâtiments restent cassables.
  casserAutour(p, rayon, ms, maxBoites = 70, casseSol = false) {
    const now = Date.now();
    const casse = [];
    for (const { b, i } of this.boitesSolides) {
      if (this.casse.has(i)) continue;
      if (!casseSol && b[1] < -0.01 && b[4] <= 2.5) continue;
      if (G.distancePointBoite(p, b) > rayon) continue;
      this.casse.set(i, now + ms);
      casse.push(i);
      if (casse.length >= maxBoites) break;
    }
    if (!casse.length) return;
    this.recalculerBoites();
    this.diffuser({ t: 'casse', i: casse, ms });
  }

  // Répare les boîtes dont le temps est écoulé (appelé à chaque tour).
  reparerBoites(now) {
    if (!this.casse.size) return;
    const repares = [];
    for (const [i, t] of this.casse) if (now >= t) repares.push(i);
    if (!repares.length) return;
    for (const i of repares) this.casse.delete(i);
    this.recalculerBoites();
    this.diffuser({ t: 'repare', i: repares });
  }

  toutReparer() {
    if (!this.casse.size) return;
    const repares = [...this.casse.keys()];
    this.casse.clear();
    this.recalculerBoites();
    this.diffuser({ t: 'repare', i: repares });
  }

  // ---------- Armes ----------
  changerArme(j, data) {
    const a = data.a;
    if (!j.equipement || !j.equipement.includes(a) || a === j.arme) return;
    j.arme = a;
    j.rechargeA = 0; // changer d'arme annule le rechargement...
    if (j.soinA) { j.soinA = 0; this.envoyer(j, { t: 'soinAnnule' }); } // ... et le soin
    j.pretA = Date.now() + this.armes[a].sortieMs * 0.75;
  }

  commencerRecharge(j) {
    const arme = this.armes[j.arme];
    if (!j.vivant || j.rechargeA || !arme.chargeur || j.munitions[j.arme] >= arme.chargeur) return;
    j.rechargeA = Date.now() + arme.rechargementMs;
    j.rechargeArme = j.arme;
  }

  // Le rechargement est terminé (ou une cartouche de plus pour le fusil à pompe).
  finRecharge(j, now) {
    const a = j.rechargeArme;
    const arme = this.armes[a];
    if (a !== j.arme) { j.rechargeA = 0; return; }
    if (arme.parCartouche) {
      j.munitions[a]++;
      j.rechargeA = j.munitions[a] < arme.chargeur ? now + arme.rechargementMs : 0;
    } else {
      j.munitions[a] = arme.chargeur;
      j.rechargeA = 0;
    }
    this.envoyer(j, { t: 'munitions', a, n: j.munitions[a] });
  }

  tir(j, data) {
    const now = Date.now();
    if (this.etat === 'fin' || !j.vivant || !j.equipement) return;
    const a = data.a;
    if (a !== j.arme) return;
    const arme = this.armes[a];
    if (arme.admin && !j.admin) return; // armes d'admin : seulement l'admin du site
    if (now < j.pretA || j.soinA) return; // on ne tire pas en sortant l'arme ou en se soignant
    const rapide = j.admin && j.pouvoirs.tirRapide ? 0.3 : 1; // admin : tir ultra rapide
    if (now - j.dernierTir[a] < arme.cadenceMs * 0.8 * rapide) return;
    const d = G.normaliser(vecteur(data.d) || [0, 0, 0]);
    if (!d) return;
    const oeil = [j.x, j.y + G.HAUTEUR_YEUX, j.z];
    let o = vecteur(data.o);
    if (!o || Math.hypot(o[0] - oeil[0], o[1] - oeil[1], o[2] - oeil[2]) > 2) o = oeil;

    if (arme.type === 'melee') { this.arreterDanse(j); j.dernierTir[a] = now; this.coupMelee(j, a, oeil, d, data, now); return; }
    if (arme.type === 'gadget') { this.arreterDanse(j); this.utiliserGadget(j, a, oeil, d, now); return; }
    if (arme.type === 'laser') { if (j.admin) { this.arreterDanse(j); this.tirLaser(j, a, oeil, d, data, now); } return; }
    if (arme.type === 'tesla') { if (j.admin) { this.arreterDanse(j); this.tirTesla(j, a, oeil, d, now); } return; }

    if (j.rechargeA) {
      // Le fusil à pompe peut tirer pendant qu'on remet des cartouches.
      if (arme.parCartouche && j.munitions[a] > 0) j.rechargeA = 0;
      else return;
    }
    const infini = j.admin && j.pouvoirs.munitions; // admin : munitions infinies
    if (j.munitions[a] <= 0 && !infini) { this.commencerRecharge(j); return; }
    this.arreterDanse(j); // tirer arrête la danse
    j.dernierTir[a] = now;
    if (!infini) j.munitions[a]--;
    j.protegeJusqua = 0; // tirer met fin à la protection d'apparition
    if (arme.type === 'balle') this.tirBalles(j, a, o, d, data, now);
    else {
      // Projectiles : roquette (tout droit), carreau d'arbalète et fusée (ils retombent), obus du lance-grenades,
      // boule de plasma, clou, trou noir, feu d'artifice (le type de l'arme = le type du projectile)
      const p = [o[0] + d[0] * 0.7, o[1] + d[1] * 0.7, o[2] + d[2] * 0.7];
      const disp = j.admin && j.pouvoirs.precision ? 0 : Math.max(arme.dispersion.visee, Math.min(25, Number(data.e) || 0));
      const dir = G.directionsTir(d, disp, 1, Number(data.s) >>> 0)[0];
      this.creerProjectile(j, a, arme.type, p, [dir[0] * arme.vitesse, dir[1] * arme.vitesse, dir[2] * arme.vitesse]);
    }
    if (j.munitions[a] <= 0) this.commencerRecharge(j);
  }

  // La poêle accrochée dans le dos arrête les balles qui arrivent par derrière (corps seulement).
  protegeParPoele(cible, dir) {
    if (!cible.equipement) return false;
    const poele = this.armes[cible.equipement[2]];
    if (!poele || !poele.protegeDos || cible.arme === cible.equipement[2]) return false;
    const f = devant(cible);
    return dir[0] * f[0] + dir[2] * f[2] > 0.45; // la balle va dans le même sens que le regard = elle arrive dans le dos
  }

  tirBalles(j, a, o, d, data, now) {
    const arme = this.armes[a];
    // Dispersion : le navigateur dit celle qu'il a utilisée, mais jamais moins que la meilleure possible
    // (sauf l'admin avec le pouvoir « précision parfaite »).
    const dispersion = j.admin && j.pouvoirs.precision ? 0 : Math.max(arme.dispersion.visee, Math.min(25, Number(data.e) || 0));
    const directions = G.directionsTir(d, dispersion, arme.plombs || 1, Number(data.s) >>> 0);
    const retard = Math.min(250, j.rtt / 2 + 100); // on "rembobine" les autres joueurs
    const cibles = this.cibles(j, now - retard);
    const coups = new Map(); // joueur touché -> dégâts cumulés (plusieurs plombs)
    const fins = [];
    const touches = [];
    const dings = new Set();
    let premier = null; // premier impact (balles explosives de l'admin)
    for (const dir of directions) {
      let t = G.rayonCarte(o, dir, this.boites, arme.portee);
      let cible = null;
      let tete = false;
      for (const { autre, b } of cibles) {
        const th = G.rayonBoite(o, dir, b.tete);
        const tc = G.rayonBoite(o, dir, b.corps);
        const tt = Math.min(th, tc);
        if (tt < t) { t = tt; cible = autre; tete = th <= tc; }
      }
      if (cible && !tete && this.protegeParPoele(cible, dir)) { dings.add(cible.id); cible = null; }
      fins.push(arrondir([o[0] + dir[0] * t, o[1] + dir[1] * t, o[2] + dir[2] * t]));
      if (!premier && t < arme.portee - 0.1) premier = [o[0] + dir[0] * (t - 0.1), o[1] + dir[1] * (t - 0.1), o[2] + dir[2] * (t - 0.1)];
      touches.push(cible ? 1 : 0);
      if (cible) {
        const c = coups.get(cible) || { deg: 0, tete: false };
        c.deg += degatsBalle(arme, t, tete);
        c.tete = c.tete || tete;
        coups.set(cible, c);
      }
    }
    this.diffuser({ t: 'tir', id: j.id, a, o: arrondir(o), f: fins, c: touches }, j);
    for (const id of dings) this.diffuser({ t: 'ding', id });
    for (const [cible, c] of coups) this.infliger(j, cible, Math.max(1, Math.round(c.deg)), c.tete, d, a);
    if (arme.lev) for (const cible of coups.keys()) this.leviter(cible, d, arme, now); // rayon anti-gravité (admin)
    if (premier && j.admin && j.pouvoirs.explosives) this.miniExplosion(j, premier, a, now);
  }

  // Pousse un joueur (souffle, aspiration, envol...) : son navigateur ajoute cette vitesse à la sienne
  // (comme public/js/joueur.js pousser) ; un bot, lui, est poussé directement ici.
  pousser(j, v) {
    if (j.bot) {
      const b = j.bot;
      b.vit[0] += v[0]; b.vit[1] = Math.max(b.vit[1], 0) + v[1]; b.vit[2] += v[2];
      b.auSol = false;
      return;
    }
    this.envoyer(j, { t: 'pousse', v: arrondir(v) });
  }

  // Un joueur protégé (apparition) ou l'admin invincible ne se fait pas balader par les armes spéciales.
  intouchable(j, now) { return j.protegeJusqua > now || (j.admin && j.pouvoirs.invincible); }

  // Rayon anti-gravité : l'adversaire touché s'envole et flotte (les autres voient une aura violette).
  leviter(cible, d, arme, now) {
    if (!cible.vivant || this.intouchable(cible, now)) return;
    this.pousser(cible, [d[0] * (arme.levAvant || 0), arme.levHaut || 20, d[2] * (arme.levAvant || 0)]);
    cible.libreJusqua = now + 2500;
    this.diffuser({ t: 'lev', id: cible.id, ms: arme.levMs || 2000 });
  }

  // ---------- Fusil Tesla de l'admin ----------
  // Un éclair instantané : il touche le premier adversaire sur le trajet, puis saute vers le plus proche
  // (à moins de distanceSaut, sans mur entre eux), jusqu'à « sauts » fois, avec des dégâts qui baissent.
  tirTesla(j, a, oeil, d, now) {
    const arme = this.armes[a];
    if (now - j.dernierTir[a] < arme.cadenceMs * (j.pouvoirs.tirRapide ? 0.3 : 1)) return;
    j.dernierTir[a] = now;
    j.protegeJusqua = 0;
    const retard = Math.min(250, j.rtt / 2 + 100);
    const cibles = this.cibles(j, now - retard);
    const tMur = G.rayonCarte(oeil, d, this.boites, arme.portee);
    let premier = null; let tMin = tMur; let tete = false;
    for (const c of cibles) {
      const th = G.rayonBoite(oeil, d, c.b.tete);
      const tc = G.rayonBoite(oeil, d, c.b.corps);
      const t = Math.min(th, tc);
      if (t < tMin) { tMin = t; premier = c; tete = th <= tc; }
    }
    if (!premier) {
      this.diffuser({ t: 'tesla', id: j.id, o: arrondir(oeil), points: [arrondir([oeil[0] + d[0] * tMur, oeil[1] + d[1] * tMur, oeil[2] + d[2] * tMur])] });
      return;
    }
    const centre = (c) => [c.pos[0], c.pos[1] + 1.0, c.pos[2]];
    const chaine = [{ c: premier, dir: d, degats: arme.degats * (tete ? arme.multiplicateurTete || 1 : 1), tete }];
    const touches = new Set([premier.autre]);
    let degats = arme.degats;
    for (let s = 0; s < (arme.sauts || 0); s++) {
      degats *= arme.reductionSaut || 0.75;
      const de = centre(chaine[chaine.length - 1].c);
      let suivant = null; let dMin = arme.distanceSaut || 9;
      for (const c of cibles) {
        if (touches.has(c.autre)) continue;
        const q = centre(c);
        const v = [q[0] - de[0], q[1] - de[1], q[2] - de[2]];
        const L = Math.hypot(v[0], v[1], v[2]);
        if (L >= dMin || L < 0.01) continue;
        if (G.rayonCarte(de, [v[0] / L, v[1] / L, v[2] / L], this.boites, L) < L - 0.3) continue; // un mur entre eux
        suivant = { c, dir: [v[0] / L, v[1] / L, v[2] / L] }; dMin = L;
      }
      if (!suivant) break;
      touches.add(suivant.c.autre);
      chaine.push({ c: suivant.c, dir: suivant.dir, degats, tete: false });
    }
    this.diffuser({ t: 'tesla', id: j.id, o: arrondir(oeil), points: chaine.map((x) => arrondir(centre(x.c))) });
    for (const x of chaine) this.infliger(j, x.c.autre, Math.max(1, Math.round(x.degats)), x.tete, x.dir, a);
  }

  // ---------- Laser de l'admin ----------
  // Un rayon instantané : il traverse les adversaires jusqu'au premier mur, fait des dégâts selon la charge
  // (ch = 0 → 1 envoyé par le navigateur), et casse les blocs autour du point d'impact.
  tirLaser(j, a, oeil, d, data, now) {
    const arme = this.armes[a];
    if (now - j.dernierTir[a] < arme.cadenceMs * (j.pouvoirs.tirRapide ? 0.3 : 1)) return;
    j.dernierTir[a] = now;
    j.protegeJusqua = 0;
    const ch = Math.max(0, Math.min(1, Number(data.ch) || 0));
    const degats = Math.round(arme.degats + (arme.degatsMax - arme.degats) * ch);
    const retard = Math.min(250, j.rtt / 2 + 100);
    const tMur = G.rayonCarte(oeil, d, this.boites, arme.portee);
    // Tous les adversaires sur le trajet, avant le mur
    for (const { autre, b } of this.cibles(j, now - retard)) {
      const th = G.rayonBoite(oeil, d, b.tete);
      const tc = G.rayonBoite(oeil, d, b.corps);
      const t = Math.min(th, tc);
      if (t > tMur) continue;
      const tete = th <= tc;
      this.infliger(j, autre, Math.max(1, Math.round(degats * (tete ? arme.multiplicateurTete : 1))), tete, d, a);
    }
    const impact = [oeil[0] + d[0] * tMur, oeil[1] + d[1] * tMur, oeil[2] + d[2] * tMur];
    this.diffuser({ t: 'laser', id: j.id, o: arrondir(oeil), p: arrondir(impact), ch: Math.round(ch * 100) / 100 });
    this.casserAutour(impact, (arme.casseRayonMax || 4) * (0.2 + 0.8 * ch), arme.casseRegenMs || 7000, arme.casseMax || 70, !!arme.casseSol);
  }

  // ---------- Mêlée : couteau, batte, poêle ----------
  coupMelee(j, a, oeil, d, data, now) {
    const arme = this.armes[a];
    j.protegeJusqua = 0;
    const retard = Math.min(250, j.rtt / 2 + 100);
    let meilleur = null;
    for (const c of this.cibles(j, now - retard)) {
      const boite = [c.b.corps[0], c.b.corps[1], c.b.corps[2], c.b.corps[3], c.b.tete[4], c.b.corps[5]];
      const dist = G.distancePointBoite(oeil, boite);
      if (dist > arme.portee) continue;
      const centre = [c.pos[0], c.pos[1] + 1.0, c.pos[2]];
      const vers = [centre[0] - oeil[0], centre[1] - oeil[1], centre[2] - oeil[2]];
      const L = Math.hypot(vers[0], vers[1], vers[2]) || 1;
      const cos = (vers[0] * d[0] + vers[1] * d[1] + vers[2] * d[2]) / L;
      if (dist > 0.5 && cos < Math.cos((arme.angle * Math.PI) / 180)) continue; // pas devant nous
      if (G.rayonCarte(oeil, [vers[0] / L, vers[1] / L, vers[2] / L], this.boites, L) < L - 0.4) continue; // un mur entre nous
      if (!meilleur || dist < meilleur.dist) meilleur = { ...c, dist };
    }
    if (!meilleur) {
      this.diffuser({ t: 'coup', id: j.id, a }, j);
      if (arme.onde) this.ondeChoc(j, a, this.solDevant(j, 2.5), arme.onde); // Marteau de Thor : même dans le vide
      return;
    }
    const cible = meilleur.autre;
    // Coup dans le dos au couteau : en visant (clic droit), derrière l'adversaire → élimination
    let dos = false;
    if (arme.dansLeDos && data.v) {
      const f = devant(cible);
      const vx = j.x - cible.x; const vz = j.z - cible.z;
      const n = Math.hypot(vx, vz) || 1;
      dos = (f[0] * vx + f[2] * vz) / n < -0.35;
    }
    this.diffuser({ t: 'coup', id: j.id, a, cible: cible.id, dos: dos ? 1 : 0 }, j);
    // La batte (et un peu les autres) repousse l'adversaire
    if (arme.poussee && cible.protegeJusqua <= now && this.etat !== 'attente') {
      const h = Math.hypot(d[0], d[2]) || 1;
      const v = [(d[0] / h) * arme.poussee, arme.poussee * 0.45, (d[2] / h) * arme.poussee];
      cible.libreJusqua = now + 1500;
      this.envoyer(cible, { t: 'pousse', v: arrondir(v) });
    }
    this.infliger(j, cible, dos ? arme.dansLeDos : arme.degats, false, d, a, { melee: 1, dos: dos ? 1 : 0 });
    if (arme.onde) this.ondeChoc(j, a, [cible.x, cible.y + 0.3, cible.z], arme.onde); // (un peu au-dessus du sol : sinon le sol « cache » l'onde)
  }

  // Le point du sol à « distance » mètres devant un joueur (moins s'il y a un mur ; ses pieds s'il n'y a pas de sol).
  solDevant(j, distance) {
    const f = devant(j);
    const depart = [j.x, j.y + 1, j.z];
    const t = Math.max(0, Math.min(distance, G.rayonCarte(depart, f, this.boites, distance) - 0.3));
    const p = [j.x + f[0] * t, j.y + 1, j.z + f[2] * t];
    const bas = G.rayonCarte(p, [0, -1, 0], this.boites, 6);
    return bas < 6 ? [p[0], p[1] - bas + 0.3, p[2]] : [j.x, j.y + 0.3, j.z];
  }

  // Onde de choc du Marteau de Thor : la foudre tombe, les adversaires autour sont blessés et envoyés en l'air.
  // Rien pour celui qui frappe.
  ondeChoc(j, a, p, onde) {
    this.exploser({ id: 0, type: 'thor', tireur: j, a }, p,
      { rayon: onde.rayon, degats: onde.degats, degatsMin: onde.degatsMin, poussee: onde.poussee, autoDegats: 0 },
      { sansTireur: true, bots: true, haut: true });
  }

  // ---------- Gadgets : grenade, fumigène, grenade flash, balise des météores, grappin, kit de soin, mine, propulseur ----------
  utiliserGadget(j, a, oeil, d, now) {
    const arme = this.armes[a];
    if (now < j.gadgetPretA) { this.envoyer(j, { t: 'gadget', pretDans: j.gadgetPretA - now }); return; }
    if (arme.lancer) {
      // Gadgets qu'on lance (ils rebondissent) : le type du projectile est « projectile », sinon l'identifiant de l'arme
      const p = [oeil[0] + d[0] * 0.5, oeil[1] + d[1] * 0.5 - 0.1, oeil[2] + d[2] * 0.5];
      const v = [d[0] * arme.lancer, d[1] * arme.lancer + 3, d[2] * arme.lancer];
      this.creerProjectile(j, a, arme.projectile || arme.id, p, v);
    } else if (arme.id === 'mine') {
      if (!this.poserMine(j, a, arme)) { this.envoyer(j, { t: 'gadget', pretDans: 0, rate: 1 }); return; }
    } else if (arme.id === 'propulseur') {
      // Un coup de réacteur : vers le haut, et un peu dans la direction où l'on regarde
      this.pousser(j, [d[0] * (arme.pousseeAvant || 0), arme.pousseeHaut || 15, d[2] * (arme.pousseeAvant || 0)]);
      j.libreJusqua = now + 1800;
      this.diffuser({ t: 'propulse', id: j.id, p: arrondir([j.x, j.y, j.z]) });
    } else if (arme.id === 'grappin') {
      const coup = G.rayonCarteDetail(oeil, d, this.boites, arme.portee);
      if (!coup.boite) { this.envoyer(j, { t: 'grappin', id: j.id, rate: 1 }); j.gadgetPretA = now + 800; return; }
      const k = Math.max(0, coup.t - 0.4);
      const point = [oeil[0] + d[0] * k, oeil[1] + d[1] * k, oeil[2] + d[2] * k];
      j.libreJusqua = now + 3500;
      this.diffuser({ t: 'grappin', id: j.id, p: arrondir(point) });
    } else if (arme.id === 'kit_soin') {
      if (j.pv >= this.r.joueur.pointsDeVie) { this.envoyer(j, { t: 'gadget', plein: 1, pretDans: 0 }); return; }
      j.soinA = now + arme.dureeSoinMs;
      j.soinArme = a;
      this.diffuser({ t: 'soin', id: j.id, ms: arme.dureeSoinMs });
    } else return;
    j.protegeJusqua = 0;
    const attente = j.admin && j.pouvoirs.munitions ? 300 : arme.rechargeGadgetMs; // admin : gadgets sans attente
    j.gadgetPretA = now + attente;
    this.envoyer(j, { t: 'gadget', pretDans: attente });
  }

  // Inflige des dégâts ; prévient le tireur (marqueur) et la cible.
  // extra : informations en plus (ex. { dos: 1 } pour un coup de couteau dans le dos)
  infliger(tireur, cible, degats, tete, dir, a, extra = {}) {
    if (!cible.vivant) return;
    this.bots.touche(cible, tireur);
    // Échauffement : entre vrais joueurs, on voit qu'on touche mais personne ne perd de vie.
    // Contre les bots, c'est pour de vrai (sauf si "fontDegats" est à false dans les réglages des bots).
    const contreBot = cible.bot || (tireur.bot && this.bots.r.fontDegats);
    if (this.etat === 'attente' && !contreBot) {
      if (tireur !== cible) this.envoyer(tireur, { t: 'touche', id: cible.id, deg: 0, tete: tete ? 1 : 0, entrainement: 1 });
      return;
    }
    if (cible.protegeJusqua > Date.now() || (cible.admin && cible.pouvoirs.invincible)) { // admin invincible
      if (tireur !== cible) this.envoyer(tireur, { t: 'touche', id: cible.id, protege: 1 });
      return;
    }
    if (tireur.admin && tireur.pouvoirs.oneShot && tireur !== cible) degats = Math.max(degats, cible.pv); // admin : un coup suffit
    cible.pv -= degats;
    // Admin vampire : la moitié des dégâts faits lui revient en vie
    if (tireur.admin && tireur.pouvoirs.vampire && tireur !== cible && tireur.vivant) {
      const avant = tireur.pv;
      tireur.pv = Math.min(this.r.joueur.pointsDeVie, tireur.pv + Math.ceil(degats * 0.5));
      if (tireur.pv !== avant) this.envoyer(tireur, { t: 'pv', pv: tireur.pv });
    }
    if (tireur !== cible) {
      this.envoyer(tireur, { t: 'touche', id: cible.id, deg: degats, tete: tete ? 1 : 0, elim: cible.pv <= 0 ? 1 : 0, ...extra });
    }
    this.envoyer(cible, { t: 'degats', pv: Math.max(0, cible.pv), de: tireur.id, dir: arrondir(dir), ...extra });
    if (cible.pv <= 0) this.eliminer(cible, tireur, dir, tete, a, extra);
  }

  // ---------- Projectiles ----------
  creerProjectile(j, a, type, p, v) {
    const id = this.prochainProjectile++;
    this.projectiles.set(id, { id, type, tireur: j, a, p, v, nee: Date.now() });
    this.diffuser({ t: 'projectile', id, type, tireur: j.id, a, p: arrondir(p), v: arrondir(v) });
    return id;
  }

  finProjectile(pr, p, extra = {}) {
    this.projectiles.delete(pr.id);
    this.diffuser({ t: 'projectileFin', id: pr.id, type: pr.type, p: arrondir(p), ...extra });
  }

  majProjectiles(dt) {
    const now = Date.now();
    const pas = dt / 2;
    for (const pr of [...this.projectiles.values()]) {
      if (!this.projectiles.has(pr.id)) continue; // (déjà parti : une mine qui a explosé à côté...)
      const arme = this.armes[pr.a];
      const age = now - pr.nee;
      if (pr.type === 'mine') { this.majMine(pr, arme, age, now); continue; }
      const rebondit = !!arme.rebond; // grenade, fumigène, grenade flash, balise des météores
      if (rebondit && age >= arme.explosionMs) {
        if (pr.type === 'grenade') this.exploser(pr, pr.p, arme);
        else if (pr.type === 'flash') this.flash(pr, arme);
        else if (pr.type === 'balise') this.pluieMeteores(pr, arme, now);
        else {
          this.finProjectile(pr, pr.p);
          this.diffuser({ t: 'fumee', p: arrondir(pr.p), ms: arme.dureeFumeeMs, rayon: arme.rayon });
        }
        continue;
      }
      if (age > (arme.vieMs || 6000) || pr.p[1] < -20) {
        if (pr.p[1] >= -20 && pr.type === 'trou_noir') this.ouvrirTrouNoir(pr, pr.p, arme, now);
        else if (pr.type === 'roquette' || arme.explose) this.exploserProjectile(pr, pr.p, arme);
        else this.finProjectile(pr, pr.p);
        continue;
      }
      for (let k = 0; k < 2 && this.projectiles.has(pr.id); k++) this.avancerProjectile(pr, arme, pas, rebondit);
    }
  }

  avancerProjectile(pr, arme, h, rebondit) {
    if (pr.type !== 'roquette') pr.v[1] -= (arme.gravite || 0) * h;
    const L = Math.hypot(pr.v[0], pr.v[1], pr.v[2]) * h;
    if (L < 1e-5) return;
    const n = G.normaliser(pr.v);
    const coup = G.rayonCarteDetail(pr.p, n, this.boites, L);
    const gros = pr.type === 'roquette' || arme.explose || pr.type === 'trou_noir'; // ceux-là touchent un peu plus facilement
    // Joueurs touchés (pas pour les grenades : elles rebondissent seulement sur les murs)
    let cible = null;
    let tCible = coup.t;
    let tete = false;
    if (!rebondit) {
      for (const autre of this.joueurs.values()) {
        if (autre === pr.tireur || !autre.vivant) continue;
        if (this.mode === 'equipes' && autre.equipe === pr.tireur.equipe) continue;
        const b = G.boitesJoueur(autre.x, autre.y, autre.z, gros ? 0.15 : 0.05);
        const th = G.rayonBoite(pr.p, n, b.tete);
        const tc = G.rayonBoite(pr.p, n, b.corps);
        const t = Math.min(th, tc);
        if (t < tCible) { tCible = t; cible = autre; tete = th <= tc; }
      }
    }
    const point = (t) => [pr.p[0] + n[0] * t, pr.p[1] + n[1] * t, pr.p[2] + n[2] * t];
    if (cible || coup.boite) {
      const p = point(Math.max(0, (cible ? tCible : coup.t) - 0.05));
      if (pr.type === 'trou_noir') { this.ouvrirTrouNoir(pr, p, arme, Date.now()); return; }
      if (pr.type === 'roquette' || arme.explose) { this.exploserProjectile(pr, p, arme); return; }
    }
    if (cible) {
      const p = point(Math.max(0, tCible - 0.05));
      this.finProjectile(pr, p, { cible: cible.id });
      this.infliger(pr.tireur, cible, Math.round(arme.degats * (tete ? arme.multiplicateurTete || 1 : 1)), tete, n, pr.a);
      if (pr.type === 'fusee' && cible.vivant && this.etat !== 'attente') {
        const b = arme.brulure;
        cible.brule = { tireur: pr.tireur, a: pr.a, degats: b.degats, toutesLesMs: b.toutesLesMs, prochain: Date.now() + b.toutesLesMs, fin: Date.now() + b.dureeMs };
        this.envoyer(cible, { t: 'eblouir', ms: arme.eblouissementMs, brule: b.dureeMs });
      }
      return;
    }
    if (coup.boite) {
      const p = point(Math.max(0, coup.t - 0.05));
      if (!rebondit) { this.finProjectile(pr, p, { mur: 1 }); return; } // (carreau et clou restent plantés)
      // Rebond : la vitesse "rebondit" sur la face touchée et ralentit
      const nn = coup.normale;
      const vn = pr.v[0] * nn[0] + pr.v[1] * nn[1] + pr.v[2] * nn[2];
      pr.v = pr.v.map((c, i) => (c - (1 + arme.rebond) * vn * nn[i]) * 0.8);
      pr.p = [p[0] + nn[0] * 0.03, p[1] + nn[1] * 0.03, p[2] + nn[2] * 0.03];
      if (Math.abs(vn) > 2.5) this.diffuser({ t: 'rebond', id: pr.id, p: arrondir(pr.p) });
      return;
    }
    pr.p = point(L);
  }

  // Un projectile qui explose (roquette, obus, plasma, feu d'artifice). Le feu d'artifice éclate ensuite en petites
  // explosions colorées tout autour (« bouquet »). Les nouvelles armes poussent aussi les bots.
  exploserProjectile(pr, p, arme) {
    if (pr.type === 'roquette') { this.exploser(pr, p, arme); return; }
    const bouquet = arme.bouquet;
    this.exploser(pr, p, arme, { bots: true, ...(bouquet ? { c: Math.floor(Math.random() * 6) } : {}) });
    if (!bouquet) return;
    const now = Date.now();
    const sous = { rayon: bouquet.rayon, degats: bouquet.degats, degatsMin: bouquet.degatsMin, poussee: bouquet.poussee, autoDegats: arme.autoDegats || 0 };
    for (let i = 0; i < bouquet.nombre; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = bouquet.distance * (0.4 + 0.6 * Math.random());
      const dir = G.normaliser([Math.cos(ang), 0.15 + Math.random() * 0.35, Math.sin(ang)]);
      const t = Math.max(0, Math.min(r, G.rayonCarte(p, dir, this.boites, r) - 0.3)); // pas à travers les murs
      const q = [p[0] + dir[0] * t, p[1] + dir[1] * t, p[2] + dir[2] * t];
      const c = i % 6;
      const at = now + bouquet.delaiMinMs + Math.random() * (bouquet.delaiMaxMs - bouquet.delaiMinMs);
      this.retards.push({ at, f: () => this.exploser({ id: 0, type: 'artifice', tireur: pr.tireur, a: pr.a }, q, sous, { bots: true, c }) });
    }
  }

  // ---------- Mine ----------
  // Posée au sol devant le joueur (au plus « distancePose » mètres, moins s'il y a un mur). Renvoie false s'il n'y a pas de sol.
  poserMine(j, a, arme) {
    const f = devant(j);
    const depart = [j.x, j.y + 0.5, j.z];
    const t = Math.max(0, Math.min(arme.distancePose || 1.5, G.rayonCarte(depart, f, this.boites, arme.distancePose || 1.5) - 0.3));
    const p = [j.x + f[0] * t, j.y + 0.5, j.z + f[2] * t];
    const bas = G.rayonCarte(p, [0, -1, 0], this.boites, 6);
    if (bas >= 6) return false; // dans le vide
    // Pas plus de « maxPosees » mines : la plus vieille disparaît
    const miennes = [...this.projectiles.values()].filter((pr) => pr.type === 'mine' && pr.tireur === j).sort((x, y) => x.nee - y.nee);
    while (miennes.length >= (arme.maxPosees || 2)) { const vieille = miennes.shift(); this.finProjectile(vieille, vieille.p); }
    this.creerProjectile(j, a, 'mine', [p[0], p[1] - bas + 0.03, p[2]], [0, 0, 0]);
    return true;
  }

  // Une mine posée : elle s'arme au bout d'un moment, puis explose si un adversaire passe tout près.
  majMine(pr, arme, age, now) {
    if (age > (arme.dureeVieMs || 60000)) { this.finProjectile(pr, pr.p); return; }
    if (age < (arme.armementMs || 1000)) return;
    for (const autre of this.joueurs.values()) {
      if (autre === pr.tireur || !autre.vivant) continue;
      if (this.mode === 'equipes' && autre.equipe === pr.tireur.equipe) continue;
      if (G.distancePointBoite(pr.p, G.boitesJoueur(autre.x, autre.y, autre.z).corps) > (arme.rayonDeclenchement || 2)) continue;
      this.exploser(pr, pr.p, arme, { bots: true });
      return;
    }
  }

  // ---------- Grenade flash ----------
  // Un éclair aveuglant : tous ceux qui sont dans le rayon et la voient (pas de mur entre) sont éblouis.
  // Le lanceur l'est moitié moins longtemps, les coéquipiers pas du tout. Pas de dégâts.
  flash(pr, arme) {
    const now = Date.now();
    this.projectiles.delete(pr.id);
    this.diffuser({ t: 'explosion', id: pr.id, type: 'flash', p: arrondir(pr.p), rayon: arme.rayon });
    for (const j of this.joueurs.values()) {
      if (!j.vivant) continue;
      if (this.mode === 'equipes' && j !== pr.tireur && j.equipe === pr.tireur.equipe) continue;
      const oeil = [j.x, j.y + G.HAUTEUR_YEUX, j.z];
      const v = [oeil[0] - pr.p[0], oeil[1] - pr.p[1], oeil[2] - pr.p[2]];
      const L = Math.hypot(v[0], v[1], v[2]);
      if (L > arme.rayon) continue;
      if (L > 0.3 && G.rayonCarte(pr.p, [v[0] / L, v[1] / L, v[2] / L], this.boites, L) < L - 0.3) continue; // caché derrière un mur
      const ms = Math.round(arme.eblouissementMs * (j === pr.tireur ? 0.5 : 1));
      if (j.bot) { j.bot.aveugleJusqua = now + ms; j.bot.cible = null; } // un bot ébloui ne voit plus personne
      else this.envoyer(j, { t: 'eblouir', ms });
    }
  }

  // ---------- Trou noir de l'admin ----------
  // La boule s'arrête et ouvre une zone qui aspire les adversaires (et blesse ceux qui sont tout près),
  // puis tout explose à la fin (voir majZones).
  ouvrirTrouNoir(pr, p, arme, now) {
    this.finProjectile(pr, p);
    const z = arme.zone;
    const id = this.prochaineZone++;
    this.zones.set(id, { id, type: 'trou_noir', p, fin: now + z.dureeMs, prochain: now, tireur: pr.tireur, a: pr.a, arme });
    this.diffuser({ t: 'zone', id, type: 'trou_noir', p: arrondir(p), ms: z.dureeMs, rayon: z.rayon });
  }

  // Aspiration : on vise une vitesse vers le centre (plus forte en se rapprochant, plus douce tout au centre)
  // et on pousse de la différence avec la vitesse actuelle du joueur (mesurée avec ses positions récentes).
  // Ainsi l'aspiration ne s'emballe pas, même si les poussées s'ajoutent.
  aspirer(zone, now) {
    const z = zone.arme.zone;
    const centre = zone.p;
    for (const cible of this.joueurs.values()) {
      if (cible === zone.tireur || !cible.vivant) continue;
      if (this.mode === 'equipes' && cible.equipe === zone.tireur.equipe) continue;
      if (cible.admin && cible.pouvoirs.invincible) continue;
      const pos = [cible.x, cible.y + 0.9, cible.z];
      const vers = [centre[0] - pos[0], centre[1] - pos[1], centre[2] - pos[2]];
      const dist = Math.hypot(vers[0], vers[1], vers[2]);
      if (dist > z.rayon) continue;
      const dir = dist > 0.01 ? [vers[0] / dist, vers[1] / dist, vers[2] / dist] : [0, 1, 0];
      const vitesse = (z.forceMin + (z.forceMax - z.forceMin) * (1 - dist / z.rayon)) * Math.min(1, dist / 1.5);
      let vAct;
      if (cible.bot) vAct = cible.bot.vit;
      else {
        const avant = this.positionPassee(cible, now - 200);
        vAct = [(cible.x - avant[0]) / 0.2, (cible.y - avant[1]) / 0.2, (cible.z - avant[2]) / 0.2];
      }
      let dx = dir[0] * vitesse - vAct[0];
      let dz = dir[2] * vitesse - vAct[2];
      const h = Math.hypot(dx, dz);
      if (h > z.forceMax) { dx *= z.forceMax / h; dz *= z.forceMax / h; }
      // en hauteur : on flotte vers le centre (le navigateur fait vitesse = max(vitesse, 0) + poussée)
      const vyVoulue = Math.max(-4, Math.min(6, vers[1] * 2));
      const dy = Math.max(-6, Math.min(8, vyVoulue - Math.max(vAct[1], 0)));
      this.pousser(cible, [dx, dy, dz]);
      cible.libreJusqua = now + 1500;
      if (dist < z.rayonDegats) this.infliger(zone.tireur, cible, z.degats, false, dir, zone.a);
    }
  }

  majZones(now) {
    for (const zone of [...this.zones.values()]) {
      if (now >= zone.fin) {
        this.zones.delete(zone.id);
        this.diffuser({ t: 'zoneFin', id: zone.id });
        if (zone.type === 'trou_noir') {
          const arme = zone.arme;
          this.exploser({ id: 0, type: 'trou_noir', tireur: zone.tireur, a: zone.a }, zone.p,
            { rayon: arme.rayon, degats: arme.degats, degatsMin: arme.degatsMin, poussee: arme.poussee, autoDegats: 0 },
            { sansTireur: true, bots: true });
        }
        continue;
      }
      if (zone.type === 'trou_noir' && now >= zone.prochain) {
        zone.prochain = now + zone.arme.zone.toutesLesMs;
        this.aspirer(zone, now);
      }
    }
  }

  // ---------- Pluie de météores de l'admin ----------
  // La balise s'allume (zone rouge), puis des météores tombent du ciel au hasard autour d'elle.
  pluieMeteores(pr, arme, now) {
    this.finProjectile(pr, pr.p);
    const pl = arme.pluie;
    const id = this.prochaineZone++;
    this.zones.set(id, { id, type: 'meteores', p: pr.p, fin: now + pl.dureeZoneMs, tireur: pr.tireur, a: pr.a, arme });
    this.diffuser({ t: 'zone', id, type: 'meteores', p: arrondir(pr.p), ms: pl.dureeZoneMs, rayon: pl.rayonZone });
    const souffle = { rayon: arme.rayon, degats: arme.degats, degatsMin: arme.degatsMin, poussee: arme.poussee, autoDegats: arme.autoDegats || 0 };
    for (let i = 0; i < pl.nombre; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = pl.distance * Math.sqrt(Math.random());
      const haut = [pr.p[0] + Math.cos(ang) * r, pr.p[1] + 8, pr.p[2] + Math.sin(ang) * r];
      const bas = G.rayonCarte(haut, [0, -1, 0], this.boites, 40);
      const cible = bas < 40 ? [haut[0], haut[1] - bas + 0.05, haut[2]] : [haut[0], pr.p[1], haut[2]];
      const depart = [cible[0], cible[1] + pl.hauteur, cible[2]];
      this.retards.push({
        at: now + Math.random() * pl.dureeMs,
        f: () => {
          this.diffuser({ t: 'meteore', p: arrondir(depart), cible: arrondir(cible), ms: pl.chuteMs });
          this.retards.push({ at: Date.now() + pl.chuteMs, f: () => this.exploser({ id: 0, type: 'meteore', tireur: pr.tireur, a: pr.a }, cible, souffle, { bots: true }) });
        },
      });
    }
  }

  // Explosion : dégâts autour, et le souffle projette les joueurs.
  // opts : sansTireur (ni dégâts ni poussée pour le tireur), bots (le souffle pousse aussi les bots),
  //        haut (le souffle envoie surtout vers le haut), c (couleur du feu d'artifice, envoyée aux navigateurs).
  exploser(pr, pos, arme, opts = {}) {
    this.projectiles.delete(pr.id);
    this.diffuser({ t: 'explosion', id: pr.id, type: pr.type, p: arrondir(pos), rayon: arme.rayon, ...(opts.c !== undefined ? { c: opts.c } : {}) });
    for (const cible of [...this.joueurs.values()]) {
      if (!cible.vivant) continue;
      if (opts.sansTireur && cible === pr.tireur) continue;
      if (this.mode === 'equipes' && cible !== pr.tireur && cible.equipe === pr.tireur.equipe) continue;
      const b = G.boitesJoueur(cible.x, cible.y, cible.z);
      const dist = G.distancePointBoite(pos, b.corps);
      if (dist > arme.rayon) continue;
      // Un mur entre l'explosion et le joueur le protège.
      const centre = [cible.x, cible.y + 0.9, cible.z];
      const vers = [centre[0] - pos[0], centre[1] - pos[1], centre[2] - pos[2]];
      const L = Math.hypot(vers[0], vers[1], vers[2]);
      if (L > 0.3 && G.rayonCarte(pos, G.normaliser(vers), this.boites, L) < L - 0.5) continue;
      const k = 1 - dist / arme.rayon;
      let degats = arme.degatsMin + (arme.degats - arme.degatsMin) * k;
      if (cible === pr.tireur) degats *= arme.autoDegats;
      // Le souffle de l'explosion projette les joueurs (et permet le "rocket jump" !)
      let dir = L > 0.05 ? G.normaliser(vers) : [0, 1, 0];
      dir = opts.haut ? G.normaliser([dir[0] * 0.35, 1, dir[2] * 0.35]) : G.normaliser([dir[0], dir[1] + 0.6, dir[2]]);
      const force = arme.poussee * (0.35 + 0.65 * k);
      cible.libreJusqua = Date.now() + 1500;
      const v = [dir[0] * force, dir[1] * force, dir[2] * force];
      if (opts.bots) this.pousser(cible, v);
      else this.envoyer(cible, { t: 'pousse', v: arrondir(v) });
      if (degats <= 0) continue; // (explosions de l'admin : elles le poussent mais ne le blessent pas)
      this.infliger(pr.tireur, cible, Math.max(1, Math.round(degats)), false, dir, pr.a, { explosion: 1 });
    }
  }

  // ---------- Élimination ----------
  eliminer(victime, tueur, d, tete, a, extra = {}) {
    const now = Date.now();
    victime.vivant = false;
    victime.danse = null;
    victime.pv = 0;
    victime.morts++;
    victime.serie = 0;
    victime.rechargeA = 0;
    victime.soinA = 0;
    victime.brule = null;
    victime.reapparitionA = now + this.r.joueur.reapparitionSecondes * 1000;
    const vraiTueur = tueur && tueur !== victime && this.joueurs.get(tueur.id) === tueur;
    if (vraiTueur) {
      tueur.kills++;
      tueur.serie++;
      if (this.mode === 'equipes') this.scoresEquipes[tueur.equipe]++;
      // Chaque élimination remet la vie du tueur à 100 % (réglage joueur.vieAuMaxApresElimination)
      if (tueur.vivant && this.r.joueur.vieAuMaxApresElimination !== false && tueur.pv < this.r.joueur.pointsDeVie) {
        tueur.pv = this.r.joueur.pointsDeVie;
        this.envoyer(tueur, { t: 'pv', pv: tueur.pv, elim: 1 });
      }
    }
    this.diffuser({
      t: 'elim', tueur: tueur && tueur !== victime ? tueur.id : null, victime: victime.id, tete: tete ? 1 : 0,
      a, expl: extra.explosion ? 1 : 0, dos: extra.dos ? 1 : 0, brule: extra.brule ? 1 : 0,
      imp: arrondir(d), p: arrondir([victime.x, victime.y, victime.z]),
      serie: vraiTueur ? tueur.serie : 0,
      kills: vraiTueur ? tueur.kills : 0, morts: victime.morts,
      scores: this.scoresEquipes,
      dans: this.r.joueur.reapparitionSecondes * 1000,
    });
    if (this.etat === 'jeu' && vraiTueur) {
      const score = this.mode === 'equipes' ? Math.max(...this.scoresEquipes) : tueur.kills;
      if (score >= this.objectif) this.terminer();
    }
  }

  // ---------- Apparition ----------
  apparaitre(j) {
    if (!j.equipement) return; // il faut d'abord choisir ses armes
    const now = Date.now();
    if (j.prochainEquipement) { j.equipement = j.prochainEquipement; j.prochainEquipement = null; }
    const s = this.choisirApparition(j);
    j.x = s.x; j.y = s.y || 0; j.z = s.z;
    j.yaw = (s.angle || 0) * Math.PI / 180;
    j.pitch = 0;
    j.pv = this.r.joueur.pointsDeVie;
    j.vivant = true;
    j.danse = null;
    j.vie++;
    j.arme = j.equipement[0];
    j.munitions = this.armes.map((a) => a.chargeur);
    j.dernierTir = this.armes.map(() => 0);
    j.rechargeA = 0;
    j.soinA = 0;
    j.brule = null;
    j.gadgetPretA = now;
    j.pretA = now;
    j.reapparitionA = 0;
    j.libreJusqua = 0;
    j.protegeJusqua = now + this.r.joueur.protectionSecondes * 1000;
    j.derniereMaj = now;
    j.historique = [];
    this.memoriser(j, now);
    this.diffuser({
      t: 'apparition', id: j.id, p: [j.x, j.y, j.z], yaw: arrondi(j.yaw), vie: j.vie,
      prot: this.r.joueur.protectionSecondes * 1000, pv: j.pv, munitions: j.munitions, eq: j.equipement, arme: j.arme,
    });
  }

  // On choisit un point d'apparition loin des adversaires (avec un peu de hasard).
  choisirApparition(j) {
    let points = this.carte.apparitions;
    if (this.mode === 'equipes') {
      const ceux = points.filter((s) => s.equipe === j.equipe);
      if (ceux.length) points = ceux;
    }
    const autres = [...this.joueurs.values()].filter((a) => a !== j && a.vivant);
    const notes = points.map((s) => {
      let d = 60;
      for (const a of autres) {
        const dist = Math.hypot(a.x - s.x, a.z - s.z);
        if (dist < 2 && Math.abs(a.y - (s.y || 0)) < 2) d = -100; // jamais sur quelqu'un
        else if (!(this.mode === 'equipes' && a.equipe === j.equipe)) d = Math.min(d, dist);
      }
      return { s, note: d };
    }).sort((a, b) => b.note - a.note);
    // Un peu de hasard, mais seulement parmi les points presque aussi sûrs que le meilleur.
    const choix = notes.filter((n) => n.note >= notes[0].note - 8).slice(0, 3);
    return choix[Math.floor(Math.random() * choix.length)].s;
  }

  // ---------- Déroulement de la partie ----------
  nouvelleManche() {
    if (this.mode !== 'classe') this.bots.toutRetirer(); // la vraie partie se joue sans bots (sauf en classé)
    this.toutReparer(); // on repart avec une carte intacte
    this.etat = 'jeu';
    this.attenteFinA = 0;
    this.scoresEquipes = [0, 0];
    this.finA = Date.now() + this.r.partie.dureeMinutes * 60 * 1000;
    this.redemarrageA = 0;
    for (const pr of this.projectiles.values()) this.diffuser({ t: 'projectileFin', id: pr.id, type: pr.type, p: arrondir(pr.p) });
    this.projectiles.clear();
    for (const id of this.zones.keys()) this.diffuser({ t: 'zoneFin', id });
    this.zones.clear();
    this.retards = [];
    for (const j of this.joueurs.values()) { j.kills = 0; j.morts = 0; j.serie = 0; }
    this.diffuser({ t: 'debut', finDans: this.finA - Date.now(), scores: this.scoresEquipes });
    for (const j of this.joueurs.values()) {
      j.reapparitionA = 0;
      this.apparaitre(j);
    }
  }

  terminer() {
    if (this.etat !== 'jeu') return;
    this.etat = 'fin';
    this.redemarrageA = Date.now() + this.r.partie.pauseFinSecondes * 1000;
    const classement = [...this.joueurs.values()]
      .sort((a, b) => b.kills - a.kills || a.morts - b.morts)
      .map((j) => ({ id: j.id, nom: j.nom, equipe: j.equipe, kills: j.kills, morts: j.morts, style: j.style }));
    let gagnant = null;
    if (this.mode === 'equipes') {
      const [b, r] = this.scoresEquipes;
      gagnant = b === r ? { egalite: true } : { equipe: b > r ? 0 : 1 };
    } else if (classement.length) {
      gagnant = { id: classement[0].id, nom: classement[0].nom };
    }
    // Classé : un vrai joueur a gagné → les bots de la prochaine manche sont plus forts ; un bot a gagné → un peu moins.
    if (this.mode === 'classe' && gagnant) {
      const premier = this.joueurs.get(gagnant.id);
      this.niveau = premier && !premier.bot ? Math.min(20, this.niveau + 1) : Math.max(1, this.niveau - 1);
    }
    // Classé : chaque vrai joueur gagne (ou perd) des points de rang selon sa place, enregistrés sur son compte.
    if (this.mode === 'classe' && this.classement) {
      classement.forEach((c, i) => {
        const j = this.joueurs.get(c.id);
        if (!j || j.bot || !j.equipement) return; // (pas ceux qui n'ont jamais joué la manche)
        try {
          const { avant, apres } = this.classement.ajouter(j.id, gainPourPlace(i + 1));
          this.envoyer(j, { t: 'rang', points: apres, avant, gain: apres - avant });
        } catch (e) { console.error(`FPS : rang non enregistré (${e.message})`); }
      });
    }
    this.diffuser({
      t: 'fin', gagnant, classement, scores: this.scoresEquipes,
      redemarrageDans: this.r.partie.pauseFinSecondes * 1000,
      ...(this.mode === 'classe' ? { niveau: this.niveau } : {}),
    });
  }

  tick() {
    const now = Date.now();
    this.tickNo++;
    if (this.etat === 'attente') {
      if (this.attenteFinA && now >= this.attenteFinA) this.nouvelleManche();
      else if (this.tickNo % 20 === 0) this.annoncerAttente(); // une fois par seconde
    }
    if (this.etat === 'jeu' && now >= this.finA) this.terminer();
    if (this.etat === 'fin' && now >= this.redemarrageA) this.nouvelleManche();
    // Bots : seulement dans la salle d'attente, sauf en classé où ils jouent aussi la vraie manche (figés par l'admin : rien)
    const avecBots = this.etat === 'attente' || (this.etat === 'jeu' && this.mode === 'classe');
    if (avecBots && !this.botsFiges()) this.bots.gerer(now, TICK_MS / 1000);
    this.reparerBoites(now); // la carte cassée par le laser se répare
    this.majProjectiles(TICK_MS / 1000);
    // Événements prévus (petites explosions du feu d'artifice, météores) et zones (trou noir, pluie de météores)
    if (this.retards.length) {
      const prets = this.retards.filter((r) => now >= r.at);
      if (prets.length) {
        this.retards = this.retards.filter((r) => now < r.at);
        for (const r of prets) r.f(); // (un météore peut en prévoir un autre : il s'ajoute à la nouvelle liste)
      }
    }
    if (this.zones.size) this.majZones(now);
    // Frappes orbitales de l'admin : l'explosion arrive après le compte à rebours
    if (this.frappes.length) {
      this.frappes = this.frappes.filter((f) => {
        if (now < f.at) return true;
        if (this.joueurs.get(f.j.id) === f.j) {
          this.exploser({ id: 0, type: 'frappe', tireur: f.j, a: f.a }, f.p, FRAPPE);
          this.casserAutour(f.p, 4.5, 8000, 80, false);
        }
        return false;
      });
    }

    const etats = [];
    for (const j of this.joueurs.values()) {
      if (j.rechargeA && now >= j.rechargeA) this.finRecharge(j, now);
      if (!j.vivant && j.reapparitionA && now >= j.reapparitionA) this.apparaitre(j);
      // Admin qui se régénère : +8 PV toutes les demi-secondes
      if (j.vivant && j.admin && j.pouvoirs.regen && j.pv < this.r.joueur.pointsDeVie && this.tickNo % 10 === 0) {
        j.pv = Math.min(this.r.joueur.pointsDeVie, j.pv + 8);
        this.envoyer(j, { t: 'pv', pv: j.pv });
      }
      // Kit de soin terminé
      if (j.soinA && now >= j.soinA) {
        j.soinA = 0;
        if (j.vivant) {
          j.pv = Math.min(this.r.joueur.pointsDeVie, j.pv + this.armes[j.soinArme].soin);
          this.envoyer(j, { t: 'pv', pv: j.pv, soin: 1 });
        }
      }
      // Brûlure (fusée) : quelques dégâts toutes les demi-secondes
      if (j.brule && j.vivant && now >= j.brule.prochain) {
        const b = j.brule;
        if (now > b.fin) j.brule = null;
        else {
          b.prochain += b.toutesLesMs;
          this.infliger(b.tireur, j, b.degats, false, [0, 1, 0], b.a, { brule: 1 });
        }
      }
      if (j.vivant) {
        // [id, x, y, z, angle, visée haut/bas, arme, drapeaux (1 = vise, 2 = recharge, 4 = se soigne)]
        etats.push([j.id, arrondi(j.x), arrondi(j.y), arrondi(j.z), arrondi(j.yaw), arrondi(j.pitch),
          j.arme, (j.visee ? 1 : 0) | (j.rechargeA ? 2 : 0) | (j.soinA ? 4 : 0)]);
      }
    }
    // Position des projectiles qui rebondissent (grenades, fumigènes, flash, balise) : les navigateurs se recalent dessus
    const pr = [];
    for (const x of this.projectiles.values()) {
      if (this.armes[x.a].rebond) pr.push([x.id, arrondi(x.p[0]), arrondi(x.p[1]), arrondi(x.p[2])]);
    }
    this.diffuser(pr.length ? { t: 's', j: etats, pr } : { t: 's', j: etats });

    // Toutes les 2 secondes : mesure du ping de chacun.
    if (this.tickNo % 40 === 0) {
      for (const j of this.joueurs.values()) this.envoyer(j, { t: 'ping', s: now, rtt: Math.round(j.rtt) });
    }
  }
}

module.exports = { Partie, degatsBalle, CATEGORIES };
