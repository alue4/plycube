// Arena FPS : le chef d'orchestre du jeu dans le navigateur.
// Il relie le hall (choix de la carte et de la partie), le réseau, le joueur,
// les armes, les autres joueurs, les tirs, les éliminations, les sons et l'affichage.
import * as THREE from '../vendor/three.min.js';
import { construireMonde, rayonBoite } from './monde.js';
import { Personnage, styleParDefaut, COULEURS_EQUIPES, NOMS_EQUIPES } from './personnage.js';
import { Ragdoll } from './ragdoll.js';
import { Effets } from './effets.js';
import { JoueurLocal, YEUX } from './joueur.js';
import { ArmeVue, SON_FRAPPE } from './arme.js';
import * as Modeles from './armes-modeles.js';
import { directionsTir, dispersionActuelle, normaliser } from './balistique.js';
import { son, initSons, reglerVolume, reglerMusique, majAuditeur, musiqueMenu, jouerEnBoucle, prechargerSons, bourdonLaser, tirLaserSon, bourdonTrouNoir, moteurMinigun } from './sons.js';
import { LaserHud } from './laser-hud.js';
import { hud, el } from './hud.js';
import { definirCatalogue, normaliserStyle } from './apparence.js';
import { Atelier, boutonPersonnage } from './atelier.js';
import { Reseau } from './reseau.js';
import { Tactile } from './tactile.js';
import { choisirStyleArmes, prechargerArmes, styleArmes } from './armes-glb.js';
import { Accueil3D, brancherHall, panneauJouer } from './accueil3d.js';
import { ChoixEquipement, equipementMemorise as equipementGarde } from './equipement.js';
import { SalleAttente } from './salle-attente.js';
import { definirAnimations, evaluer } from './animations-perso.js';
import { Commandes, ACTIONS, ACTION } from './commandes.js';
import * as Menus from './menus-manette.js';
import { PanneauAdmin, POUVOIRS } from './panneau-admin.js';
import { RadarHud, EcranVisions } from './pouvoirs-ecran.js';
import { icone } from './icones.js';
import { rang, resultat } from './classe.js';

const $ = (id) => document.getElementById(id);
const DELAI_INTERPOLATION = 100; // on affiche les autres joueurs avec 0,1 s de retard : c'est plus fluide
const TRAVERSABLES = new Set(['vitre', 'invisible']); // les balles passent à travers

// ---------- Réglages personnels (gardés dans ce navigateur) ----------
const PREFS_DEFAUT = {
  sensibilite: 1, sensibiliteTactile: 1, volume: 0.7, musique: 0.35, fov: 80, ombres: true, commandes: 'auto', armes: 'simple',
  sensibiliteManette: 1, inverserY: false, vibrations: true, aideVisee: 'normale', // manette (et aide à la visée sur tablette)
  touches: null, // touches changées dans les réglages (voir commandes.js)
  pouvoirs: Object.fromEntries(POUVOIRS.map((p) => [p.cle, false])), // admin seulement (Réglages → ADMIN PANEL)
};
const prefs = (() => {
  try { return { ...PREFS_DEFAUT, ...JSON.parse(localStorage.getItem('fps-reglages') || '{}') }; } catch { return { ...PREFS_DEFAUT }; }
})();
function sauverPrefs() {
  try { localStorage.setItem('fps-reglages', JSON.stringify(prefs)); } catch { /* navigation privée */ }
}
const demarrerSons = () => { initSons(prefs.volume, prefs.musique); };

// Commandes tactiles (tablette) ou clavier + souris ?
// 'auto' : tactile sur un appareil sans souris (iPad...), clavier + souris sinon.
const appareilTactile = () => navigator.maxTouchPoints > 0 && !matchMedia('(pointer: fine)').matches;
const modeTactile = () => prefs.commandes === 'tactile' || (prefs.commandes === 'auto' && appareilTactile());

function message(titre, texte, recharger) {
  for (const id of ['hall', 'pause', 'reglages']) $(id).hidden = true;
  $('message').hidden = false;
  $('message-titre').textContent = titre;
  $('message-texte').textContent = texte;
  $('message-recharger').hidden = !recharger;
  if (document.pointerLockElement) document.exitPointerLock();
}
$('message-recharger').addEventListener('click', () => location.reload());

// Boîtes de collision d'un joueur (les mêmes que sur le serveur).
function boitesJoueur(p) {
  return {
    corps: [p.x - 0.36, p.y, p.z - 0.36, p.x + 0.36, p.y + 1.4, p.z + 0.36],
    tete: [p.x - 0.3, p.y + 1.4, p.z - 0.3, p.x + 0.3, p.y + 1.9, p.z + 0.3],
  };
}
const r3 = (v) => Math.round(v * 1000) / 1000;
const tableau = (v) => [r3(v.x), r3(v.y), r3(v.z)];
const SERIES = { 2: 'DOUBLE !', 3: 'TRIPLE !', 4: 'QUADRUPLE !' };
// Style des traînées de balles selon l'arme
const TRAINEES = {
  fusil: { couleur: 0xffe9a8, epaisseur: 0.012, duree: 0.06, opacite: 0.7 },
  smg: { couleur: 0xffe9a8, epaisseur: 0.01, duree: 0.05, opacite: 0.6 },
  pompe: { couleur: 0xffd88a, epaisseur: 0.007, duree: 0.05, opacite: 0.45 },
  sniper: { couleur: 0xffffff, epaisseur: 0.03, duree: 0.6, opacite: 0.5 },
  precision: { couleur: 0xfff3d0, epaisseur: 0.018, duree: 0.25, opacite: 0.55 },
  rafale: { couleur: 0xffe9a8, epaisseur: 0.012, duree: 0.06, opacite: 0.7 },
  mitrailleuse: { couleur: 0xffd27a, epaisseur: 0.014, duree: 0.06, opacite: 0.75 },
  revolver: { couleur: 0xffe9a8, epaisseur: 0.016, duree: 0.08, opacite: 0.7 },
  pistolet: { couleur: 0xffe9a8, epaisseur: 0.01, duree: 0.05, opacite: 0.6 },
  uzi: { couleur: 0xffe9a8, epaisseur: 0.009, duree: 0.05, opacite: 0.55 },
  canon_scie: { couleur: 0xffd88a, epaisseur: 0.007, duree: 0.05, opacite: 0.45 },
  pompe_auto: { couleur: 0xffd88a, epaisseur: 0.007, duree: 0.05, opacite: 0.45 },
  double_canon: { couleur: 0xffd88a, epaisseur: 0.007, duree: 0.05, opacite: 0.45 },
  vector: { couleur: 0xffe9a8, epaisseur: 0.009, duree: 0.045, opacite: 0.55 },
  bullpup: { couleur: 0xffe9a8, epaisseur: 0.012, duree: 0.06, opacite: 0.7 },
  anti_materiel: { couleur: 0xffffff, epaisseur: 0.04, duree: 0.8, opacite: 0.55 },
  pistolet_lourd: { couleur: 0xffe9a8, epaisseur: 0.016, duree: 0.08, opacite: 0.7 },
  pistolet_auto: { couleur: 0xffe9a8, epaisseur: 0.009, duree: 0.045, opacite: 0.55 },
  minigun: { couleur: 0xffd27a, epaisseur: 0.01, duree: 0.04, opacite: 0.6 },
  rayon_lev: { couleur: 0xc77dff, epaisseur: 0.05, duree: 0.25, opacite: 0.85 },
};
const AXE_MOINS_Z = new THREE.Vector3(0, 0, -1);
// Son quand un coup de mêlée touche
const SON_COUP = { couteau: 'couteau_touche', batte: 'batte_touche', poele: 'poele_touche' };

async function demarrer() {
  // Tablette : pas de zoom avec deux doigts, et le son se débloque au premier toucher.
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  addEventListener('touchend', demarrerSons, { passive: true });
  addEventListener('click', demarrerSons);
  document.body.classList.toggle('tactile', modeTactile());
  let reglages;
  try {
    reglages = await fetch('reglages.json').then((r) => r.json());
    definirCatalogue(await fetch('catalogue-apparence.json').then((r) => r.json()));
  } catch {
    return message('Oups', 'Impossible de charger le jeu. Vérifie ta connexion.', true);
  }
  const ARMES = reglages.armes;
  // Les modèles 3D des armes (style choisi dans les réglages) se chargent en arrière-plan.
  choisirStyleArmes(prefs.armes);
  // Animations perso des armes (atelier d'animations). Une sortie perso change aussi la durée de sortie.
  const sortieOrigine = new Map(ARMES.map((a) => [a.id, a.sortieMs]));
  const appliquerAnimations = (toutes) => {
    definirAnimations(toutes);
    for (const a of ARMES) a.sortieMs = toutes?.[a.id]?.sortir ? Math.round(toutes[a.id].sortir.duree * 1000) : sortieOrigine.get(a.id);
    // les sons envoyés par l'admin utilisés dans ces animations sont téléchargés à l'avance
    for (const parCle of Object.values(toutes || {})) for (const anim of Object.values(parCle)) prechargerSons((anim.sons || []).map((x) => x[1]));
  };
  fetch('api/animations').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) appliquerAnimations(d.animations); }).catch(() => {});
  fetch('api/danses').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) definirDanses(d.danses); }).catch(() => {});
  // Le bouton de l'atelier d'animations n'apparaît que pour l'admin du site
  fetch('/api/auth/me').then((r) => r.json()).then((d) => {
    if (!d.user || !d.user.isAdmin) return;
    E.admin = true;
    E.adminNom = d.user.username || '';
    if (choixArmes) choixArmes.admin = true; // le laser apparaît dans le choix des armes
    $('btn-atelier-anim').hidden = false;
    $('btn-atelier-cartes').hidden = false;
    $('reglages-admin').hidden = false;
    appliquerPouvoirs();
  }).catch(() => {});

  // ---------- Moteur 3D ----------
  const canvas = $('scene');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return message('3D indisponible', 'Ton navigateur ne peut pas afficher la 3D (WebGL). Essaie Chrome, Edge ou Firefox à jour.');
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = prefs.ombres;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(prefs.fov, 1, 0.05, 900);
  scene.add(camera);
  const effets = new Effets(scene);
  effets.fabriqueMeteore = Modeles.modeleMeteore; // (pluie de météores de l'admin)
  const joueur = new JoueurLocal({ boites: [], reglages });
  // Clavier, souris et manette : les touches se changent dans les réglages (écran « Touches »)
  const commandes = new Commandes(prefs.touches, (t) => { prefs.touches = t; sauverPrefs(); });
  commandes.saisie = modeTactile() ? 'tactile' : 'clavier';
  joueur.commandes = commandes;
  joueur.sensibilite = prefs.sensibilite;
  let arme = null;

  function redimensionner() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', redimensionner);
  redimensionner();

  // ---------- Cartes ----------
  let carte = null;
  let monde = null;
  let boitesTir = [];      // ce qui arrête les balles (avec la matière en 7e valeur)
  const cacheCartes = {};
  // data : la carte complète (cartes faites dans l'éditeur, envoyées par le serveur). Sinon, on la télécharge.
  async function chargerCarte(id, data = null) {
    if (!data && carte && carte.id === id) return;
    let c;
    if (data) { c = data; cacheCartes[id] = Promise.resolve(data); }
    else {
      if (!cacheCartes[id]) cacheCartes[id] = fetch(`cartes/${id}.json`).then((r) => { if (!r.ok) throw new Error('404'); return r.json(); });
      c = await cacheCartes[id];
    }
    c.id = id;
    if (!data && carte && carte.id === id) return;
    if (monde) monde.liberer();
    effets.viderTrous();
    carte = c;
    E.cassees = new Set();
    monde = construireMonde(scene, carte, { ombres: prefs.ombres });
    joueur.niveauEau = carte.eau ? carte.eau.niveau : null;
    majBoitesCassees();
  }

  // Recalcule les boîtes (collisions, tirs) en enlevant celles cassées par le laser de l'admin.
  function majBoitesCassees() {
    if (!carte) return;
    if (E.cassees.size) {
      joueur.boites = carte.boites.filter((b, i) => !E.cassees.has(i));
      boitesTir = carte.boites.filter((b, i) => !E.cassees.has(i) && !TRAVERSABLES.has(b[6]));
    } else {
      joueur.boites = carte.boites;
      boitesTir = carte.boites.filter((b) => !TRAVERSABLES.has(b[6]));
    }
  }

  // Premier obstacle touché par un tir : distance, boîte, normale (la face touchée).
  function rayonDetail(o, d, portee) {
    let t = portee;
    let boite = null;
    for (const b of boitesTir) {
      const tt = rayonBoite(o, d, b);
      if (tt < t) { t = tt; boite = b; }
    }
    if (!boite) return { t, boite: null, normale: null };
    const p = [o[0] + d[0] * t, o[1] + d[1] * t, o[2] + d[2] * t];
    let meilleur = Infinity;
    const normale = new THREE.Vector3(0, 1, 0);
    for (let a = 0; a < 3; a++) {
      for (const [k, s] of [[a, -1], [a + 3, 1]]) {
        const ecart = Math.abs(p[a] - boite[k]);
        if (ecart < meilleur) { meilleur = ecart; normale.set(0, 0, 0).setComponent(a, s); }
      }
    }
    return { t, boite, normale };
  }

  // ---------- État de la partie ----------
  const E = {
    enPartie: false, code: null, mode: null, moiId: null, moiNom: '', objectif: 0, niveauBots: 0,
    joueurs: new Map(), // id -> { id, nom, equipe, style, kills, morts, vivant, perso, tampon, protegeJusqua, ... }
    levitations: new Map(), // rayon anti-gravité : id du joueur -> fin de l'effet
    bourdons: new Map(),    // trous noirs : id de la zone -> son qui gronde
    prechauffe: 0,          // minigun : canons qui tournent (0 → 1)
    scores: [0, 0], finA: 0, etat: 'jeu', redemarrageA: 0,
    vie: 0, pv: 100,
    arme: 0, munitions: ARMES.map((a) => a.chargeur), rechargeFin: 0, rechargeDebut: 0,
    dernierTir: 0, pretA: 0, tirEnfonce: false, tirDemande: false, viser: false, visee: 0, chaleur: 0,
    reculARattraper: 0,
    reapparitionA: 0, tueurNom: '', ragdolls: [], monRagdoll: null, angleCamMort: 0,
    projectiles: new Map(), carreauxPlantes: [], cordesDistantes: new Map(),
    equipement: null, gadgetPretA: 0, soinFin: 0, soinDuree: 1, grappin: null, rafaleReste: 0, prochaineRafale: 0,
    eblouiJusqua: 0, eblouiDuree: 1, attenteFinA: 0, prets: new Set(),
    rtt: 0, dernierEnvoi: 0, salleDemandee: null, secousse: 0, carteChoisie: 'arene', cartes: [],
    danses: [], maDanse: null, menuDanse: false, // danses faites dans l'atelier d'animations
    mortA: 0, cameraTueur: null, // après ma mort : la caméra va voir celui qui m'a éliminé
    admin: false, adminNom: '', // l'admin du site a des pouvoirs (Réglages → ADMIN PANEL)
    libellesArmes: [], // nom des touches des 4 emplacements d'armes (barre en bas de l'écran)
    chargeLaser: 0, cassees: new Set(), // laser d'admin : charge en cours, blocs cassés (puis réparés)
    carteATester: null, // on arrive de l'éditeur de cartes (?creer=<id>)
  };
  const moi = () => E.joueurs.get(E.moiId);
  const reseau = new Reseau();
  // Emplacement (0 à 3 : principale, secondaire, mêlée, gadget) d'une arme de mon équipement
  const slotDe = (i) => (E.equipement ? E.equipement.indexOf(i) : -1);

  // L'arme tenue par un personnage (et la poêle dans le dos s'il l'a sans la tenir)
  function prendreArmePerso(j, a) {
    const w = ARMES[a] || ARMES[0];
    j.arme = a;
    j.perso.prendreArme(w.id, w.categorie);
    if (j.perso.afficherPoeleDos) {
      const poele = j.eq && ARMES[j.eq[2]];
      j.perso.afficherPoeleDos(!!(poele && poele.protegeDos) && a !== j.eq[2], poele && poele.id);
    }
  }

  // ---------- Joueurs ----------
  function ajouterJoueur(info) {
    const ancien = E.joueurs.get(info.id);
    if (ancien && ancien.perso) ancien.perso.liberer();
    const j = {
      id: info.id, nom: info.nom, equipe: info.equipe, style: info.style ? normaliserStyle(info.style) : styleParDefaut(info.id),
      kills: info.kills || 0, morts: info.morts || 0, vivant: info.vivant, tampon: [], protegeJusqua: 0, bot: !!info.bot,
      vitesse: new THREE.Vector3(), arme: info.arme || 0, visee: false, recharge: false, distancePas: 0, eq: info.eq || null,
      look: info.l || 0, // pouvoirs de l'admin visibles par tous (géant, mini, invisible, arc-en-ciel, aura)
    };
    const monEquipe = info.id === E.moiId ? info.equipe : (moi() ? moi().equipe : null);
    j.perso = new Personnage({
      style: j.style, equipe: E.mode === 'equipes' ? j.equipe : null, nom: info.id === E.moiId ? '' : j.nom,
      allieVisible: E.mode === 'equipes' && j.equipe === monEquipe,
    });
    prendreArmePerso(j, j.arme);
    if (info.danse && info.id !== E.moiId) setTimeout(() => commencerDanseDe(j, info.danse), 0);
    if (info.id !== E.moiId) {
      scene.add(j.perso.groupe);
      j.perso.groupe.visible = !!info.vivant;
      if (info.p) {
        j.perso.groupe.position.set(info.p[0], info.p[1], info.p[2]);
        j.perso.groupe.rotation.y = info.yaw || 0;
        j.tampon.push({ t: performance.now(), x: info.p[0], y: info.p[1], z: info.p[2], yaw: info.yaw || 0, pitch: 0 });
      }
    }
    E.joueurs.set(j.id, j);
    return j;
  }

  function retirerJoueur(id) {
    const j = E.joueurs.get(id);
    if (!j) return;
    arreterDanseDe(j);
    if (j.perso) j.perso.liberer();
    E.joueurs.delete(id);
  }

  // Position affichée d'un joueur (moi ou un autre).
  function positionDe(j) {
    if (j.id === E.moiId) return joueur.pos;
    return j.perso.groupe.position;
  }

  // ---------- Entrer / sortir d'une partie ----------
  async function entrerPartie(msg) {
    reseau.pause(); // les messages suivants attendront que la carte soit prête
    try {
      await chargerCarte(msg.carte || 'arene', msg.carteData || null);
      // les modèles 3D des armes (on n'attend pas plus de 4 s : sinon, les anciens modèles servent)
      await Promise.race([prechargerArmes(styleArmes()), new Promise((r) => { setTimeout(r, 4000); })]);
    } catch {
      message('Oups', 'Impossible de charger la carte.', true);
      return;
    }
    sortirPartie(true);
    E.enPartie = true;
    E.code = msg.code;
    E.mode = msg.mode;
    E.niveauBots = msg.niveauBots || 0;
    E.moiId = msg.moi;
    E.objectif = msg.objectif;
    E.scores = msg.scores;
    E.etat = msg.etat;
    E.finA = performance.now() + msg.finDans;
    E.redemarrageA = performance.now() + (msg.redemarrageDans || 0);
    // Moi d'abord (pour savoir qui est dans mon équipe), puis les autres.
    const liste = [...msg.joueurs].sort((a, b) => (a.id === msg.moi ? -1 : b.id === msg.moi ? 1 : 0));
    for (const info of liste) ajouterJoueur(info);

    E.arme = 0;
    E.equipement = null;
    E.munitions = ARMES.map((a) => a.chargeur);
    E.attenteFinA = msg.attenteDans != null ? performance.now() + msg.attenteDans : 0;
    E.prets = new Set(msg.joueurs.filter((x) => x.pret).map((x) => x.id));
    arme = new ArmeVue(moi().style, ARMES);
    arme.surSon = (nom) => son(nom, { vol: nom === 'arme_sortir' ? 0.5 : 0.7 });
    if (E.mode === 'equipes') arme.couleurEquipe(COULEURS_EQUIPES[moi().equipe]);
    $('hall').hidden = true;
    panneauJouer(false);
    $('pause-code').textContent = E.code;
    majModePause();
    $('liste-amis').hidden = true;
    hud.afficher(true);
    hud.fin(false);
    musiqueMenu(false);
    majClasseHud();
    if (E.mode === 'equipes') hud.annonce(`ÉQUIPE ${NOMS_EQUIPES[moi().equipe].toUpperCase()}`, `Partie ${E.code}`);
    if (E.mode === 'classe') hud.annonce('CLASSÉ', `Bots niveau ${E.niveauBots} · ton rang : ${rang(E.pointsClasse).nom}`);
    history.replaceState(null, '', `?room=${E.code}`);
    if (window.Plateforme) Plateforme.definirActivite({ jeu: 'fps', salle: E.code, rejoignable: true });
    // Carte déjà cassée par le laser quand on arrive
    if (Array.isArray(msg.casse) && msg.casse.length) {
      for (const i of msg.casse) E.cassees.add(i);
      majBoitesCassees();
      if (monde) monde.casser(msg.casse);
    }
    reseau.reprendre();
    if (E.etat === 'attente') ouvrirSalle();
    demanderEquipement(true); // on choisit ses armes en arrivant
  }

  // ---------- Équipement (les 4 armes) ----------
  // Le dernier choix est gardé dans ce navigateur (sinon : l'équipement par défaut des réglages).
  const equipementMemorise = () => equipementGarde(ARMES, reglages.equipementParDefaut);
  function envoyerEquipement(choix) {
    try { localStorage.setItem('fps-equipement', JSON.stringify(choix)); } catch { /* navigation privée */ }
    reseau.envoyer({ t: 'equipement', e: choix });
  }
  // L'écran de choix des armes : en arrivant dans une partie, quand on est éliminé,
  // depuis le menu ou la salle d'attente, et depuis le hall ("Mes armes").
  const choixArmes = new ChoixEquipement({
    armes: ARMES,
    parDefaut: reglages.equipementParDefaut,
    surValider: (choix) => {
      son('clic');
      accueil.majArme(choix.principale);
      if (!E.enPartie) { hud.toast('Tes armes sont enregistrées : tu les auras à ta prochaine partie !'); return; }
      envoyerEquipement(choix);
      // Dans la salle d'attente, on y retourne ; sinon on joue (le clic sur "Valider" permet de capturer la souris).
      majMenus();
      if (!(E.etat === 'attente' && salle.ouvert)) jouer();
    },
    surFermer: () => majMenus(),
  });
  // premiere = en arrivant dans la partie (on ne peut pas fermer sans choisir)
  function demanderEquipement(premiere) {
    if (!E.enPartie) return;
    relacherCommandes();
    lacherSouris();
    majTactile();
    let sousTitre = 'Une arme de chaque catégorie. Tu pourras en changer à chaque réapparition.';
    if (!premiere) sousTitre = joueur.vivant && E.etat !== 'attente' ? 'Tes nouvelles armes arriveront à ta prochaine apparition.' : 'Tu réapparaîtras avec ces armes.';
    choixArmes.ouvrir(null, {
      titre: premiere ? 'Choisis tes armes' : 'Changer d\'armes',
      sousTitre,
      texteBouton: premiere ? 'C\'est parti !' : 'Valider',
      fermable: !premiere,
    });
    majMenus();
  }

  // ---------- Salle d'attente (avant le début de la partie) ----------
  const salle = new SalleAttente({
    surChoisirArmes: () => { son('clic'); demanderEquipement(!E.equipement); },
    surEntrainer: () => { son('clic'); jouer(); },
    surInviter: () => { son('clic'); invitationsSalle.hidden = !invitationsSalle.hidden; if (!invitationsSalle.hidden) remplirInvitations(invitationsSalle); },
    surQuitter: () => { son('clic'); reseau.envoyer({ t: 'quitter' }); sortirPartie(); },
  });
  // En plus : les réglages et la liste des amis à inviter
  const invitationsSalle = el('ul', { class: 'liste-amis', hidden: true });
  {
    const actions = salle.racine.querySelector('.actions-attente');
    actions.insertBefore(el('button', { class: 'btn secondaire', type: 'button', onclick: () => { son('clic'); ouvrirReglages(); } }, icone('reglages'), ' Réglages'), actions.querySelector('.danger'));
    actions.after(invitationsSalle);
  }
  function ouvrirSalle() {
    invitationsSalle.hidden = true;
    salle.ouvrir({ code: E.code, nomCarte: carte ? carte.nom : '', mode: E.mode });
    majSalleAttente();
  }
  function majSalleAttente() {
    if (!salle.ouvert) return;
    salle.maj({
      joueurs: [...E.joueurs.values()].filter((j) => !j.bot).map((j) => ({ id: j.id, nom: j.nom, style: j.style, pret: E.prets.has(j.id), equipe: j.equipe })),
      dans: E.attenteFinA ? Math.max(0, E.attenteFinA - performance.now()) : null,
      moiId: E.moiId,
    });
  }
  // Quel écran montrer pendant une partie ? En jeu : aucun. Sinon : le choix des armes s'il est ouvert,
  // la salle d'attente avant le début, ou le menu pause.
  function majMenus() {
    document.body.classList.toggle('en-jeu', E.enPartie && joueur.actif);
    if (!joueur.actif && !modeTactile()) ouvrirMenuDanses(false);
    if (!E.enPartie) { salle.fermer(); return; }
    if (joueur.actif) {
      $('pause').hidden = true;
      salle.fermer();
      return;
    }
    if (choixArmes.ouvert) { $('pause').hidden = true; return; }
    if (E.etat === 'attente') {
      $('pause').hidden = true;
      if (!salle.ouvert) ouvrirSalle();
    } else {
      salle.fermer();
      $('pause').hidden = false;
    }
  }

  // ---------- Pouvoirs d'admin (Réglages → ADMIN PANEL) : voler, visée automatique, précision parfaite, pas de recul, munitions infinies ----------
  // Le serveur vérifie que c'est bien l'admin du site avant d'accepter le vol, la précision parfaite et les munitions infinies.
  const pouvoir = (nom) => E.admin && !!(prefs.pouvoirs && prefs.pouvoirs[nom]);
  function appliquerPouvoirs() {
    if (!prefs.pouvoirs) prefs.pouvoirs = { ...PREFS_DEFAUT.pouvoirs };
    joueur.vol = pouvoir('vol');
    joueur.multSaut = pouvoir('superSaut') ? 2.5 : 1;
    joueur.multGravite = pouvoir('gravite') ? 0.3 : 1;
    joueur.sautsEnLAir = pouvoir('doubleSaut') ? 2 : 0;
    joueur.fantome = pouvoir('fantome');
    joueur.echelleYeux = pouvoir('geant') ? 2.5 : pouvoir('mini') ? 0.45 : 1;
    panneauAdmin.maj();
    const n = POUVOIRS.filter((p) => prefs.pouvoirs[p.cle]).length;
    $('etat-admin-panel').textContent = n ? `${n} pouvoir${n > 1 ? 's' : ''} actif${n > 1 ? 's' : ''}` : 'aucun pouvoir actif';
    // le serveur reçoit seulement ceux qu'il doit vérifier (vol, munitions, invincible, géant...)
    if (E.admin && E.enPartie) reseau.envoyer({ t: 'pouvoirs', ...Object.fromEntries(POUVOIRS.filter((p) => p.serveur).map((p) => [p.cle, pouvoir(p.cle)])) });
  }
  function changerPouvoir(nom, oui) {
    prefs.pouvoirs = { ...PREFS_DEFAUT.pouvoirs, ...prefs.pouvoirs, [nom]: !!oui };
    if (oui && nom === 'geant') prefs.pouvoirs.mini = false; // on ne peut pas être géant et mini à la fois
    if (oui && nom === 'mini') prefs.pouvoirs.geant = false;
    sauverPrefs();
    appliquerPouvoirs();
  }
  // Boutons d'action du panneau (soin, réparer la carte, bots) : c'est le serveur qui les fait
  function actionAdmin(cle) {
    if (!E.admin) return;
    if (!E.enPartie) { hud.toast('Rejoins d\'abord une partie.'); return; }
    reseau.envoyer({ t: 'admin', a: cle });
  }

  // Téléportation (touche T) : je réapparais là où je vise
  function teleporter() {
    if (!pouvoir('teleport') || !joueur.vivant || !E.enPartie) return;
    camera.updateMatrixWorld();
    _o.copy(camera.position);
    _d.set(0, 0, -1).applyQuaternion(camera.quaternion);
    const coup = rayonDetail(tableau(_o), tableau(_d), 300);
    if (!coup.boite) { hud.toast('Vise un mur ou le sol pour te téléporter (pas le ciel).'); return; }
    const depart = joueur.pos.clone();
    const p = _fin.copy(_d).multiplyScalar(Math.max(0, coup.t - 0.7)).add(_o);
    // on vise le sol : on se pose dessus ; un mur : on arrive juste devant, à hauteur du point visé
    joueur.pos.set(p.x, coup.normale && coup.normale.y > 0.5 ? coup.boite[4] + 0.02 : Math.max(0, p.y - 1.2), p.z);
    for (let k = 0; k < 12 && joueur.collision(joueur.pos.x, joueur.pos.y, joueur.pos.z); k++) joueur.pos.y += 0.5;
    joueur.vit.set(0, 0, 0);
    for (const [q, n] of [[depart, 30], [joueur.pos, 40]]) {
      effets.explosion(new THREE.Vector3(q.x, q.y + 1, q.z), ['#39e0ff', '#c06cff', '#ffffff'], { nombre: n, force: 4, taille: 0.08, vie: 0.6, haut: 1, gravite: 0.2 });
    }
    son('apparition', { vol: 0.8 });
    E.fovKick = 18;
    E.secousse = Math.max(E.secousse, 0.3);
  }
  // Frappe orbitale (touche G) : le serveur fait tomber un rayon du ciel là où je vise
  function frappeOrbitale() {
    if (!pouvoir('frappe') || !joueur.vivant || !E.enPartie) return;
    camera.updateMatrixWorld();
    _d.set(0, 0, -1).applyQuaternion(camera.quaternion);
    reseau.envoyer({ t: 'admin', a: 'frappe', d: tableau(_d) });
  }

  // Effets à l'écran des pouvoirs (radar, vision nocturne, Matrix, disco) : créés au premier usage
  let radarHud = null;
  let visions = null;
  function majPouvoirsEcran(now) {
    const enJeu = E.enPartie && joueur.vivant;
    const v = { nocturne: enJeu && pouvoir('nocturne'), matrix: enJeu && pouvoir('matrix'), disco: enJeu && pouvoir('disco') };
    if (v.nocturne || v.matrix || v.disco || visions) {
      if (!visions) visions = new EcranVisions(renderer.domElement);
      visions.maj(now, v);
    }
    if (enJeu && pouvoir('radar')) {
      if (!radarHud) radarHud = new RadarHud();
      const s = Math.sin(joueur.yaw);
      const c = Math.cos(joueur.yaw);
      const monEquipe = moi() ? moi().equipe : null;
      const points = [];
      for (const j of E.joueurs.values()) {
        if (j.id === E.moiId || !j.vivant || !j.perso) continue;
        const g = j.perso.groupe.position;
        const dx = g.x - joueur.pos.x;
        const dz = g.z - joueur.pos.z;
        points.push({ x: dx * c - dz * s, z: -dx * s - dz * c, dy: g.y - joueur.pos.y, bot: j.bot, ennemi: !(E.mode === 'equipes' && j.equipe === monEquipe) });
      }
      radarHud.dessiner(points, now);
    } else if (radarHud) radarHud.cacher();
  }

  // Vue à la 3e personne (pouvoir d'admin) : la caméra derrière l'épaule, mon personnage visible
  function cameraTroisieme(dt) {
    const m = moi();
    if (!m || !m.perso) return;
    E.vueTroisieme = true;
    if (m.perso.groupe.parent !== scene) scene.add(m.perso.groupe);
    m.perso.groupe.visible = true;
    if (m.arme !== E.arme) prendreArmePerso(m, E.arme);
    const g = m.perso.groupe;
    g.position.copy(joueur.pos);
    g.rotation.y = joueur.yaw;
    const k = joueur.echelleYeux;
    g.scale.setScalar(k);
    m.perso.animer(dt, { vitesse: joueur.vitesseHorizontale(), enLAir: !joueur.auSol, pitch: joueur.pitch, visee: E.viser });
    // derrière moi et un peu à droite, sans traverser les murs
    const oeil = camera.position.clone();
    const recul = _v.set(0.7 * k, 0.35 * k, 3.2 * Math.max(1, k * 0.8)).applyQuaternion(camera.quaternion);
    const L = recul.length();
    const dir = recul.clone().divideScalar(L);
    const t = Math.max(0.4, rayonDetail(tableau(oeil), tableau(dir), L).t - 0.25);
    camera.position.copy(oeil).addScaledVector(dir, t);
  }
  function finTroisieme() {
    if (!E.vueTroisieme) return;
    E.vueTroisieme = false;
    const m = moi();
    if (m && m.perso && !E.maDanse) m.perso.groupe.removeFromParent();
  }

  // Ce que tout le monde voit des pouvoirs de l'admin (géant, mini, invisible, traînée arc-en-ciel, aura dorée)
  function effetsLook(look, position, now, dt) {
    if (look & 8 && Math.random() < dt * 40) {
      const teinte = (now / 5) % 360;
      effets.particule(_v.set(position.x + (Math.random() - 0.5) * 0.4, position.y + 0.2 + Math.random() * 0.8, position.z + (Math.random() - 0.5) * 0.4),
        new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.3, (Math.random() - 0.5) * 0.4), `hsl(${teinte}, 100%, 60%)`, { taille: 0.12, vie: 1.4, gravite: -0.02, freine: 1.5 });
    }
    if (look & 16 && Math.random() < dt * 25) {
      const a = Math.random() * Math.PI * 2;
      effets.particule(_v.set(position.x + Math.cos(a) * 0.55, position.y + Math.random() * 1.9, position.z + Math.sin(a) * 0.55),
        new THREE.Vector3(0, 0.8, 0), Math.random() < 0.5 ? '#ffd84d' : '#fff3b0', { taille: 0.06, vie: 0.8, gravite: -0.05, freine: 1 });
    }
  }
  // Le panneau d'admin, style terminal de hacker : menu des pouvoirs + fenêtres d'informations dans les coins
  const panneauAdmin = new PanneauAdmin({
    etat: (cle) => !!(prefs.pouvoirs && prefs.pouvoirs[cle]),
    changer: (cle, oui) => changerPouvoir(cle, oui),
    agir: (cle) => actionAdmin(cle),
    libelle: (action) => commandes.libelle(action, { type: 'clavier' }) || '?',
    aideVol: () => `Voler : ${commandes.libelle('voler', { type: 'clavier' }) || '—'} pour activer ou couper en jeu, ${commandes.libelle('sauter', { type: 'clavier' }) || '—'} pour monter, ${commandes.libelle('descendre', { type: 'clavier' }) || '—'} pour descendre.`,
    son: (nom) => son(nom, { vol: 0.4 }),
    infos: () => {
      const vivant = E.enPartie && joueur.vivant;
      const p = joueur.pos;
      return {
        nom: E.adminNom, partie: E.enPartie ? E.code : null, carte: E.enPartie && carte ? carte.nom : null,
        mode: E.enPartie ? (E.mode === 'equipes' ? 'Équipes' : E.mode === 'classe' ? 'Classé' : 'Chacun pour soi') : null,
        joueurs: E.joueurs.size, bots: [...E.joueurs.values()].filter((j) => j.bot).length, ping: E.rtt, fps,
        position: vivant ? `${p.x.toFixed(1)} ${p.y.toFixed(1)} ${p.z.toFixed(1)}` : null,
        pv: vivant ? Math.round(E.pv) : null, arme: vivant ? ARMES[E.arme].nom : null,
        commandes: { clavier: 'clavier + souris', manette: 'manette', tactile: 'tactile' }[commandes.saisie],
        manette: commandes.pad.connecte ? (commandes.pad.ps ? 'PlayStation' : 'détectée') : 'aucune',
        ecran: `${innerWidth}×${innerHeight}`,
      };
    },
    // Les autres joueurs vus d'en haut, dans mon repère (x vers ma droite, z devant moi)
    radar: () => {
      if (!E.enPartie) return null;
      const s = Math.sin(joueur.yaw);
      const c = Math.cos(joueur.yaw);
      const monEquipe = moi() ? moi().equipe : null;
      const points = [];
      for (const j of E.joueurs.values()) {
        if (j.id === E.moiId || !j.vivant || !j.perso) continue;
        const g = j.perso.groupe.position;
        const dx = g.x - joueur.pos.x;
        const dz = g.z - joueur.pos.z;
        points.push({ x: dx * c - dz * s, z: -dx * s - dz * c, ennemi: !(E.mode === 'equipes' && j.equipe === monEquipe) });
      }
      return { points };
    },
  });
  $('btn-admin-panel').addEventListener('click', () => panneauAdmin.ouvrir());
  // Visée automatique : quand on vise ou qu'on tire, le viseur se cale sur la tête (sinon le corps) de
  // l'adversaire visible le plus proche du centre de l'écran. instantane = au moment du tir.
  function viseeAuto(dt, instantane) {
    const oeil = camera.position;
    const devant = _d.set(0, 0, -1).applyQuaternion(camera.quaternion);
    let meilleur = null; let meilleurAngle = 0.8; // environ 45° autour du viseur
    for (const j of E.joueurs.values()) {
      if (j.id === E.moiId || !j.vivant || !j.perso || !j.perso.groupe.visible) continue;
      if (E.mode === 'equipes' && moi() && j.equipe === moi().equipe) continue;
      const g = j.perso.groupe.position;
      for (const h of [1.62, 1.05]) { // la tête, sinon le milieu du corps
        _v.set(g.x - oeil.x, g.y + h - oeil.y, g.z - oeil.z);
        const dist = _v.length();
        if (dist < 0.5 || dist > 200) break;
        const angle = Math.acos(Math.max(-1, Math.min(1, _v.dot(devant) / dist)));
        if (angle > meilleurAngle) break;
        if (rayonDetail([oeil.x, oeil.y, oeil.z], [_v.x / dist, _v.y / dist, _v.z / dist], dist).t < dist - 0.4) continue; // caché derrière un mur
        meilleur = [_v.x, _v.y, _v.z];
        meilleurAngle = angle;
        break;
      }
    }
    if (!meilleur) return;
    const yaw = Math.atan2(-meilleur[0], -meilleur[2]);
    const pitch = Math.atan2(meilleur[1], Math.hypot(meilleur[0], meilleur[2]));
    let dy = (yaw - joueur.yaw) % (Math.PI * 2);
    if (dy > Math.PI) dy -= Math.PI * 2;
    if (dy < -Math.PI) dy += Math.PI * 2;
    const k = instantane ? 1 : Math.min(1, dt * 20);
    joueur.yaw += dy * k;
    joueur.pitch += (pitch - joueur.pitch) * k;
  }

  // ---------- Danses (faites dans l'atelier d'animations, touche B) ----------
  const danseDe = (id) => E.danses.find((d) => d.id === id) || null;
  function definirDanses(liste) {
    E.danses = Array.isArray(liste) ? liste : [];
    for (const d of E.danses) prechargerSons((d.sons || []).map((x) => x[1])); // petits sons ; la musique se charge à la première danse
    // une danse supprimée s'arrête
    if (E.maDanse && !danseDe(E.maDanse.id)) arreterMaDanse();
    for (const j of E.joueurs.values()) if (j.danse && !danseDe(j.danse.id)) arreterDanseDe(j);
    remplirMenuDanses();
  }
  function remplirMenuDanses() {
    const ol = $('liste-danses');
    ol.textContent = '';
    if (!E.danses.length) { ol.append(el('li', { class: 'vide', text: 'Pas encore de danse : l\'admin peut en créer dans l\'atelier d\'animations.' })); return; }
    E.danses.forEach((d, i) => {
      ol.append(el('li', {}, el('button', { type: 'button', onclick: () => choisirDanse(i) }, i < 9 ? el('kbd', { text: String(i + 1) }) : null, el('span', { text: d.nom }))));
    });
  }
  function ouvrirMenuDanses(oui = !E.menuDanse) {
    E.menuDanse = !!oui && E.enPartie && joueur.vivant;
    const menu = $('menu-danses');
    menu.hidden = !E.menuDanse;
    if (menu.contains(document.activeElement)) document.activeElement.blur(); // Espace ne doit pas « cliquer » une danse
    if (!E.menuDanse) return;
    $('aide-danses').textContent = commandes.saisie === 'manette'
      ? `${commandes.nomBouton(12, true)} ${commandes.nomBouton(13, true)} pour choisir · ${commandes.nomBouton(0)} pour danser · ${commandes.nomBouton(1)} pour fermer`
      : `Appuie sur le chiffre de la danse · ${commandes.libelle('danser', { type: 'clavier' }) || 'Échap'} pour fermer`;
    if (commandes.saisie === 'manette') Menus.naviguer('bas', menu);
  }
  // La manette dans le menu des danses : la croix choisit, A danse, B ferme
  function boutonMenuDanses(i) {
    const menu = $('menu-danses');
    if (i === 12 || i === 13) { Menus.naviguer(i === 12 ? 'haut' : 'bas', menu); return true; }
    if (i === 0) { Menus.activer(menu); return true; }
    if (i === 1) { ouvrirMenuDanses(false); return true; }
    return false;
  }
  function choisirDanse(i) {
    ouvrirMenuDanses(false);
    if (E.danses[i]) commencerMaDanse(E.danses[i]);
  }
  // Est-ce que je demande à bouger ? (touches, joystick, saut)
  const veutBouger = () => ['avancer', 'reculer', 'gauche', 'droite', 'sauter'].some((a) => commandes.tenue(a)) || joueur.sautTactile
    || Math.abs(joueur.analogique.avant) + Math.abs(joueur.analogique.cote) + Math.abs(joueur.analogiqueManette.avant) + Math.abs(joueur.analogiqueManette.cote) > 0.15;
  function commencerMaDanse(d) {
    const m = moi();
    if (!m || !joueur.vivant || !E.enPartie || E.grappin) return;
    if (E.rechargeFin) { hud.toast('Attends la fin du rechargement pour danser.'); return; }
    arreterMaDanse(false);
    E.viser = false;
    E.tirEnfonce = false;
    E.maDanse = {
      id: d.id, debut: performance.now(), yaw: joueur.yaw, angleCam: joueur.yaw, // la caméra commence face à moi
      marcher: !!d.marcher, vitesse: d.vitesse || 0.7, // danse où l'on peut avancer (comme le Griddy)
      musique: d.musique ? jouerEnBoucle(d.musique, { vol: 0.9 }) : null, sonsJoues: new Set(), tour: -1,
    };
    scene.add(m.perso.groupe);
    m.perso.groupe.visible = true;
    reseau.envoyer({ t: 'danse', d: d.id });
  }
  function arreterMaDanse(prevenir = true) {
    const dz = E.maDanse;
    if (!dz) return;
    E.maDanse = null;
    if (dz.musique) dz.musique.arreter();
    const m = moi();
    if (m && m.perso) { m.perso.finDanse(); m.perso.groupe.removeFromParent(); }
    if (prevenir) reseau.envoyer({ t: 'danse', d: null });
  }
  // Un autre joueur danse : sa musique vient de l'endroit où il est
  function commencerDanseDe(j, id) {
    arreterDanseDe(j);
    const d = danseDe(id);
    if (!d || !j.perso) return;
    j.danse = {
      id, debut: performance.now(), sonsJoues: new Set(), tour: -1,
      musique: d.musique ? jouerEnBoucle(d.musique, { vol: 0.8, position: j.perso.groupe.position.clone(), portee: 1.5 }) : null,
    };
  }
  function arreterDanseDe(j) {
    if (!j.danse) return;
    if (j.danse.musique) j.danse.musique.arreter();
    j.danse = null;
    if (j.perso) j.perso.finDanse();
  }
  // Pose et sons d'une danse au moment présent (elle se répète en boucle)
  function animerDanse(perso, dz, now, position) {
    const d = danseDe(dz.id);
    if (!d) return;
    const ecoule = (now - dz.debut) / 1000;
    const tour = Math.floor(ecoule / d.duree);
    const t = ecoule - tour * d.duree;
    if (tour !== dz.tour) { dz.tour = tour; dz.sonsJoues.clear(); }
    perso.poserDanse(evaluer(d, t), !!d.arme);
    d.sons.forEach(([ts, nom], i) => {
      if (t >= ts && !dz.sonsJoues.has(i)) { dz.sonsJoues.add(i); son(nom, { vol: 0.8, position }); }
    });
  }
  // Pendant ma danse : la caméra est devant moi ; la souris la fait tourner autour (je garde ma direction)
  function cameraDanse() {
    const dz = E.maDanse;
    if (dz.marcher) dz.angleCam = joueur.yaw + Math.PI; // on avance en dansant : caméra derrière, la souris me fait tourner
    else {
      dz.angleCam += joueur.yaw - dz.yaw;
      joueur.yaw = dz.yaw;
    }
    const elev = Math.max(-0.35, Math.min(1.1, 0.2 - joueur.pitch * 0.8));
    const centre = [joueur.pos.x, joueur.pos.y + 1.1, joueur.pos.z];
    const dir = [-Math.sin(dz.angleCam) * Math.cos(elev), Math.sin(elev), -Math.cos(dz.angleCam) * Math.cos(elev)];
    const dist = Math.max(0.6, rayonDetail(centre, dir, 3.4).t - 0.25); // pas à travers les murs
    camera.position.set(centre[0] + dir[0] * dist, centre[1] + dir[1] * dist, centre[2] + dir[2] * dist);
    camera.lookAt(centre[0], centre[1], centre[2]);
  }

  // ---------- Caméra du tueur ----------
  // Après ma mort : d'abord mon ragdoll, puis la caméra vole jusqu'à l'endroit où était celui qui
  // m'a éliminé ; son « double » se tourne vers la caméra et fait coucou (le vrai joueur est caché pendant ce temps).
  function cameraTueur(k, ecoule, dt, now) {
    const j = E.joueurs.get(k.id);
    if (!k.pret) {
      k.pret = true;
      k.depart = camera.position.clone();
      k.regardDepart = E.monRagdoll ? E.monRagdoll.centre().clone() : k.vers.clone();
      // la caméra arrive du côté où j'étais, à 2,8 m devant lui (moins s'il y a un mur)
      const dir = new THREE.Vector3(k.vers.x - k.pos.x, 0, k.vers.z - k.pos.z);
      if (dir.lengthSq() < 0.01) dir.set(-Math.sin(k.yaw), 0, -Math.cos(k.yaw));
      dir.normalize();
      dir.y = 0.18;
      dir.normalize();
      const tete = [k.pos.x, k.pos.y + 1.5, k.pos.z];
      const dist = Math.max(1.2, Math.min(2.8, rayonDetail(tete, [dir.x, dir.y, dir.z], 2.8).t - 0.3));
      k.cible = new THREE.Vector3(tete[0] + dir.x * dist, tete[1] + dir.y * dist, tete[2] + dir.z * dist);
      k.regard = new THREE.Vector3(k.pos.x, k.pos.y + 1.25, k.pos.z);
      k.double = new Personnage({ style: j ? j.style : styleParDefaut(k.id), equipe: E.mode === 'equipes' && j ? j.equipe : null });
      if (j && ARMES[j.arme]) k.double.prendreArme(ARMES[j.arme].id, ARMES[j.arme].categorie);
      k.double.groupe.position.copy(k.pos);
      k.double.groupe.rotation.y = Math.atan2(-dir.x, -dir.z); // face à la caméra
      scene.add(k.double.groupe);
      if (j) j.perso.groupe.visible = false;
    }
    const a = Math.min(1, (ecoule - 1.3) / 0.9);
    const v = a * a * (3 - 2 * a);
    camera.position.lerpVectors(k.depart, k.cible, v);
    camera.lookAt(_v.lerpVectors(k.regardDepart, k.regard, v));
    if (j && j.vivant) j.perso.groupe.visible = false;
    k.double.animer(dt, { vitesse: 0, enLAir: false, pitch: 0 });
    const coucou = Math.max(0, Math.min(1, (ecoule - 2.0) / 0.35));
    if (coucou > 0) k.double.coucou(coucou, now / 1000);
  }
  function finCameraTueur() {
    const k = E.cameraTueur;
    if (!k) return;
    E.cameraTueur = null;
    if (k.double) k.double.liberer();
    const j = E.joueurs.get(k.id);
    if (j && j.vivant && j.perso) j.perso.groupe.visible = true;
  }

  function sortirPartie(silencieux) {
    finCameraTueur();
    arreterMaDanse(false);
    ouvrirMenuDanses(false);
    for (const j of E.joueurs.values()) arreterDanseDe(j);
    for (const j of E.joueurs.values()) if (j.perso) j.perso.liberer();
    E.joueurs.clear();
    for (const r of E.ragdolls) r.liberer();
    E.ragdolls = [];
    E.monRagdoll = null;
    for (const pr of E.projectiles.values()) pr.mesh.removeFromParent();
    E.projectiles.clear();
    for (const c of E.carreauxPlantes) c.mesh.removeFromParent();
    E.carreauxPlantes = [];
    E.levitations.clear();
    for (const b of E.bourdons.values()) b.arreter();
    E.bourdons.clear();
    E.prechauffe = 0;
    majMoteurMinigun(0);
    effets.viderNouveaux();
    for (const id of E.cordesDistantes.keys()) effets.enleverCorde(id);
    E.cordesDistantes.clear();
    finGrappin();
    E.soinFin = 0;
    E.equipement = null;
    joueur.vivant = false;
    E.enPartie = false;
    salle.fermer();
    choixArmes.fermer(true);
    E.tirEnfonce = false;
    E.viser = false;
    hud.lunette(false);
    if (!document.pointerLockElement) joueur.actif = false; // tablette, manette (sinon : plus bas, en libérant la souris)
    majTactile();
    if (silencieux) return;
    hud.afficher(false);
    hud.mort(false);
    hud.fin(false);
    hud.montrerTableau(false);
    $('pause').hidden = true;
    $('hall').hidden = false;
    majAmisHall();
    history.replaceState(null, '', location.pathname);
    if (window.Plateforme) Plateforme.effacerActivite();
    if (document.pointerLockElement) document.exitPointerLock();
    musiqueMenu(true);
  }

  // ---------- Souris capturée (pointer lock) ----------
  function verrouiller() {
    demarrerSons();
    try {
      const p = canvas.requestPointerLock();
      if (p && p.catch) p.catch(() => hud.toast('Attends une seconde puis clique encore.'));
    } catch { /* ancien navigateur */ }
  }
  document.addEventListener('pointerlockchange', () => {
    if (modeTactile()) return; // sur tablette, pas de souris capturée
    const verrou = document.pointerLockElement === canvas;
    joueur.actif = verrou; // (à la manette, la souris n'est pas capturée : cet événement n'arrive pas)
    if (!verrou) relacherCommandes();
    majMenus();
  });
  // On quitte le jeu (menu, choix des armes...) : la souris est libérée et on arrête de jouer
  function lacherSouris() {
    if (document.pointerLockElement) document.exitPointerLock(); // → pointerlockchange
    else joueur.actif = false;
  }

  // Toutes les commandes relâchées (pause, mort, changement de mode...)
  function relacherCommandes() {
    E.tirEnfonce = false;
    E.viser = false;
    commandes.toutRelacher();
    joueur.analogique.avant = 0;
    joueur.analogique.cote = 0;
    joueur.analogiqueManette.avant = 0;
    joueur.analogiqueManette.cote = 0;
    joueur.sautTactile = false;
    hud.montrerTableau(false);
    if (tactile) tactile.relacher();
  }

  // "Jouer" : souris capturée sur ordinateur, commandes à l'écran sur tablette.
  // À la manette, pas besoin de capturer la souris (et un bouton de manette ne le permet pas).
  function jouer() {
    demarrerSons();
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    if (!modeTactile() && commandes.saisie !== 'manette') { verrouiller(); return; }
    joueur.actif = true;
    Menus.oublierRepetition();
    majMenus();
    majTactile();
    if (modeTactile()) pleinEcran();
  }
  function mettreEnPause() {
    lacherSouris();
    joueur.actif = false;
    relacherCommandes();
    majMenus();
    majTactile();
  }
  function pleinEcran() {
    const d = document.documentElement;
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) return;
      const f = d.requestFullscreen || d.webkitRequestFullscreen;
      if (f) { const p = f.call(d); if (p && p.catch) p.catch(() => {}); }
    } catch { /* pas de plein écran sur cet appareil : tant pis */ }
  }
  $('btn-reprendre').addEventListener('click', jouer);
  // Un clic dans le jeu capture la souris (aussi quand on jouait à la manette : on passe à la souris)
  canvas.addEventListener('click', () => { if (E.enPartie && !modeTactile() && document.pointerLockElement !== canvas) verrouiller(); });
  addEventListener('contextmenu', (e) => { if (E.enPartie) e.preventDefault(); });

  // ---------- Les actions (clavier, souris, manette : voir commandes.js) ----------
  commandes.actifClavier = () => joueur.actif;
  commandes.actifSouris = () => joueur.actif && !modeTactile() && document.pointerLockElement === canvas;
  const SLOTS = { arme1: 0, arme2: 1, arme3: 2, arme4: 3 };
  commandes.surAppui = (a, { source, code, evenement }) => {
    if (!E.enPartie) return;
    if (a === 'scores') {
      if (evenement) evenement.preventDefault();
      hud.montrerTableau(true, hud.tableau([...E.joueurs.values()], E.mode, E.moiId));
      return;
    }
    if (a === 'menu') { if (joueur.actif) mettreEnPause(); return; } // bouton Menu de la manette
    if (!joueur.actif) return;
    if (a === 'changerArmes' && !joueur.vivant) { if (E.equipement) demanderEquipement(false); return; }
    // menu des danses ouvert : les chiffres choisissent une danse (pas une arme)
    if (E.menuDanse && source === 'clavier' && /^(Digit|Numpad)/.test(code || '')) return;
    if (a === 'danser') { if (joueur.vivant) ouvrirMenuDanses(); return; }
    if (a === 'voler') {
      if (!E.admin) return;
      changerPouvoir('vol', !pouvoir('vol'));
      hud.toast(pouvoir('vol') ? `Vol activé : ${commandes.libelle('sauter')} pour monter, ${commandes.libelle('descendre') || '?'} pour descendre` : 'Vol coupé');
      return;
    }
    if (a === 'teleporter') { if (E.admin) teleporter(); return; }
    if (a === 'frappe') { if (E.admin) frappeOrbitale(); return; }
    if (a === 'tirer') { E.tirEnfonce = true; E.tirDemande = true; return; }
    if (a === 'viser') { E.viser = true; return; }
    if (a === 'recharger') recharger();
    else if (a === 'armeSuivante') changerSlot((slotDe(E.arme) + 1) % 4);
    else if (a === 'armePrecedente') changerSlot((slotDe(E.arme) + 3) % 4);
    else if (a === 'inspecter') { if (joueur.vivant && arme) arme.inspecter(); }
    else if (a in SLOTS) changerSlot(SLOTS[a]);
  };
  commandes.surRelache = (a) => {
    if (a === 'scores') hud.montrerTableau(false);
    else if (a === 'tirer') E.tirEnfonce = false;
    else if (a === 'viser') E.viser = false;
  };
  // Touches qui ne sont pas des actions : Échap (menus) et les chiffres du menu des danses
  addEventListener('keydown', (e) => {
    if (commandes.capture) return;
    if (e.code === 'Escape' && panneauAdmin.ouvert) { panneauAdmin.fermer(); return; }
    if (e.code === 'Escape' && !$('ecran-touches').hidden) { fermerTouches(); return; }
    if (e.code === 'Escape' && !$('reglages').hidden) { $('reglages').hidden = true; return; }
    if (!E.enPartie || !joueur.actif) return;
    if (E.menuDanse) {
      const md = /^(Digit|Numpad)([1-9])$/.exec(e.code);
      if (md) { choisirDanse(Number(md[2]) - 1); return; }
      if (e.code === 'Escape') { ouvrirMenuDanses(false); return; }
    }
    // On jouait à la manette (souris pas capturée) : Échap met en pause
    if (e.code === 'Escape' && !modeTactile() && document.pointerLockElement !== canvas) mettreEnPause();
  });
  // Un bouton de la manette : dans les menus, il sert à choisir ; en jouant, aux actions
  commandes.surBoutonMenu = (i) => {
    if (E.enPartie && joueur.actif) return E.menuDanse ? boutonMenuDanses(i) : false;
    // Menu (Start) : reprendre la partie depuis le menu pause ou la salle d'attente
    if (i === 9 && E.enPartie && Menus.ecranActif() && ($('pause') === Menus.ecranActif() || salle.racine === Menus.ecranActif())) { jouer(); return true; }
    return Menus.bouton(i);
  };
  commandes.surSaisie = () => majSaisie();
  commandes.surManette = (branchee) => {
    document.body.classList.toggle('avec-manette', branchee);
    if (branchee) hud.toast(`Manette détectée${commandes.pad.ps ? ' (PlayStation)' : ''}`);
    // manette débranchée en pleine partie (sans souris capturée) : pause
    else if (E.enPartie && joueur.actif && !modeTactile() && document.pointerLockElement !== canvas) mettreEnPause();
    majEtatManette();
    remplirAides();
    majLibelles();
    if (!$('ecran-touches').hidden) remplirTouches();
  };
  // Le doigt (ou la souris) touche l'écran : c'est lui qu'on utilise maintenant
  addEventListener('pointerdown', (e) => {
    if (commandes.capture) return;
    commandes.changerSaisie(e.pointerType === 'touch' || e.pointerType === 'pen' ? 'tactile' : 'clavier');
  }, true);
  // On change de façon de jouer : aides, noms des touches, boutons tactiles cachés quand on joue à la manette
  function majSaisie() {
    document.body.classList.toggle('saisie-manette', commandes.saisie === 'manette');
    majLibelles();
    if (E.menuDanse) ouvrirMenuDanses(true);
  }

  // ---------- Commandes tactiles (tablette) ----------
  let dispositionSauvee = null;
  try { dispositionSauvee = JSON.parse(localStorage.getItem('fps-disposition') || 'null'); } catch { /* navigation privée */ }
  const tactile = new Tactile($('tactile'), {
    regarder: (dx, dy) => {
      if (!joueur.actif) return;
      const w = ARMES[E.arme];
      const zoom = 1 + (w.zoom - 1) * E.visee;
      const k = (0.005 * prefs.sensibiliteTactile * aide.ralenti) / zoom; // le viseur ralentit sur un adversaire (aide à la visée)
      aide.regardTactileA = performance.now();
      joueur.yaw -= dx * k;
      joueur.pitch = Math.max(-1.55, Math.min(1.55, joueur.pitch - dy * k));
      joueur.dernierMouvementSouris = (joueur.dernierMouvementSouris || 0) + dx;
      joueur.dernierMouvementSourisY = (joueur.dernierMouvementSourisY || 0) + dy;
    },
    deplacer: (cote, avant) => { joueur.analogique.cote = cote; joueur.analogique.avant = avant; },
    tir: (oui) => { E.tirEnfonce = oui; if (oui) E.tirDemande = true; },
    viser: () => { E.viser = !E.viser; return E.viser; },
    saut: (oui) => { joueur.sautTactile = oui; },
    recharger: () => recharger(),
    inspecter: () => { if (joueur.vivant && arme) arme.inspecter(); },
    arme: (i) => changerSlot(i),
    menu: () => mettreEnPause(),
    danse: () => ouvrirMenuDanses(),
    scores: (oui) => hud.montrerTableau(oui, oui ? hud.tableau([...E.joueurs.values()], E.mode, E.moiId) : null),
  }, dispositionSauvee, (d) => {
    try { localStorage.setItem('fps-disposition', JSON.stringify(d)); } catch { /* navigation privée */ }
  });
  // Les commandes ne s'affichent que pendant qu'on joue sur tablette (ou pour les déplacer).
  function majTactile() {
    $('tactile').hidden = !(tactile.edition || (modeTactile() && E.enPartie && joueur.actif));
  }
  // Mode "personnaliser les boutons" (depuis les réglages ou le menu pause)
  function editerDisposition() {
    $('reglages').hidden = true;
    document.body.classList.add('edition-boutons');
    const eqArmes = (E.equipement || equipementIndices(equipementMemorise())).map((i) => ARMES[i]);
    tactile.majArmes(eqArmes, 0, eqArmes.map((a) => (a.chargeur ? `${a.chargeur}/${a.chargeur}` : '')));
    tactile.surFinEdition = () => {
      document.body.classList.remove('edition-boutons');
      majTactile();
    };
    tactile.editer();
    majTactile();
  }
  // Textes et aides selon le mode (tablette ou clavier)
  function appliquerMode() {
    const t = modeTactile();
    document.body.classList.toggle('tactile', t);
    joueur.sourisActive = !t;
    majLibelles();
    majTactile();
  }

  // ---------- Manette : regarder avec le stick droit ----------
  function regarderManette(dt, pad, zoom) {
    const n = Math.hypot(pad.dx, pad.dy);
    if (!n) { aide.pleineCourse = 0; return; }
    // stick poussé à fond un moment : on tourne de plus en plus vite (pour se retourner)
    aide.pleineCourse = n > 0.95 ? aide.pleineCourse + dt : 0;
    const boost = 1 + Math.min(0.6, Math.max(0, aide.pleineCourse - 0.2) * 1.5);
    const courbe = n ** 1.7 / n; // petit mouvement du stick = très précis
    const v = (3.2 * prefs.sensibiliteManette * boost * aide.ralenti) / zoom; // radians par seconde
    const sx = pad.dx * courbe * v * dt;
    const sy = pad.dy * courbe * v * 0.8 * dt * (prefs.inverserY ? -1 : 1);
    joueur.yaw -= sx;
    joueur.pitch = Math.max(-1.55, Math.min(1.55, joueur.pitch - sy));
    // l'arme se balance comme avec la souris
    joueur.dernierMouvementSouris = (joueur.dernierMouvementSouris || 0) + sx / 0.0022;
    joueur.dernierMouvementSourisY = (joueur.dernierMouvementSourisY || 0) + sy / 0.0022;
  }

  // ---------- Aide à la visée (manette et tablette, jamais à la souris) ----------
  // Quand le viseur passe sur un adversaire visible : il ralentit (on s'arrête plus facilement dessus),
  // il suit un peu l'adversaire quand lui ou moi bougeons, et quand on commence à viser, il se
  // rapproche de lui. La force se règle dans les réglages.
  const FORCES_AIDE = { non: 0, legere: 0.55, normale: 1, forte: 1.5 };
  const aide = { id: null, yaw: 0, pitch: 0, aimantJusqua: 0, viseAvant: false, ralenti: 1, pleineCourse: 0, regardTactileA: 0 };
  function forceAide() {
    if (pouvoir('viseeAuto')) return 0; // l'admin a déjà sa visée automatique
    if (commandes.saisie !== 'manette' && commandes.saisie !== 'tactile') return 0;
    return FORCES_AIDE[prefs.aideVisee] || 0;
  }
  const POINTS_CORPS = [0.45, 0.95, 1.35, 1.68]; // hauteurs (m) des pieds à la tête
  // L'adversaire visible le plus près du viseur (dans une « bulle » autour de son corps), ou null.
  function cibleAide(now, w) {
    const ox = joueur.pos.x; const oy = joueur.pos.y + YEUX; const oz = joueur.pos.z;
    const cp = Math.cos(joueur.pitch);
    const vx = -Math.sin(joueur.yaw) * cp; const vy = Math.sin(joueur.pitch); const vz = -Math.cos(joueur.yaw) * cp;
    const portee = w.type === 'melee' ? w.portee + 2 : Math.min(90, w.portee || 90);
    let meilleur = null;
    for (const j of E.joueurs.values()) {
      if (j.id === E.moiId || !j.vivant || !j.perso || !j.perso.groupe.visible || now < j.protegeJusqua) continue;
      if (E.mode === 'equipes' && moi() && j.equipe === moi().equipe) continue;
      const g = j.perso.groupe.position;
      const hx = g.x - ox; const hz = g.z - oz;
      const dist = Math.hypot(hx, g.y + 1.1 - oy, hz);
      if (dist > portee || dist < 0.4) continue;
      const bulle = Math.max(0.03, Math.min(0.3, Math.atan2(0.85, dist))); // environ 85 cm autour de lui
      let angle = Infinity;
      let h = 0;
      for (const p of POINTS_CORPS) {
        const py = g.y + p - oy;
        const a = Math.acos(Math.max(-1, Math.min(1, (hx * vx + py * vy + hz * vz) / Math.hypot(hx, py, hz))));
        if (a < angle) { angle = a; h = p; }
      }
      if (angle > bulle) continue;
      const score = angle / bulle; // 0 = en plein dessus, 1 = au bord de la bulle
      if (meilleur && score >= meilleur.score) continue;
      const py = g.y + h - oy;
      const n = Math.hypot(hx, py, hz);
      if (rayonDetail([ox, oy, oz], [hx / n, py / n, hz / n], n).t < n - 0.4) continue; // caché derrière un mur
      meilleur = { j, score, dist };
    }
    return meilleur;
  }
  const ecartAngle = (a) => {
    let d = a % (Math.PI * 2);
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    return d;
  };
  // Direction (yaw, pitch) de mes yeux vers le milieu du corps d'un joueur
  function angleVers(j) {
    const g = j.perso.groupe.position;
    const x = g.x - joueur.pos.x; const y = g.y + 1.15 - (joueur.pos.y + YEUX); const z = g.z - joueur.pos.z;
    return [Math.atan2(-x, -z), Math.atan2(y, Math.hypot(x, z))];
  }
  // À chaque image (avant de lire le stick droit) : trouve la cible, règle le ralentissement,
  // fait suivre le viseur et l'attire quand on commence à viser.
  function aiderVisee(dt, now, w, pad) {
    const force = joueur.actif ? forceAide() : 0;
    const viseDebut = E.viser && !aide.viseAvant;
    aide.viseAvant = E.viser;
    const c = force > 0 ? cibleAide(now, w) : null;
    aide.ralenti = c ? 1 - Math.min(0.6, 0.4 * force) * (1 - c.score) : 1;
    if (!c) { aide.id = null; aide.aimantJusqua = 0; return; }
    const [yaw, pitch] = angleVers(c.j);
    // On suit l'adversaire seulement quand on joue (on vise, on tire, on bouge ou on regarde) : pas tout seul
    const engage = E.viser || E.tirEnfonce || Math.hypot(pad.dx, pad.dy) > 0 || Math.hypot(pad.gx, pad.gy) > 0.2
      || now - aide.regardTactileA < 150 || Math.abs(joueur.analogique.avant) + Math.abs(joueur.analogique.cote) > 0.1;
    const dyaw = ecartAngle(yaw - aide.yaw);
    const dpitch = pitch - aide.pitch;
    // (un gros saut = il vient de réapparaître ou le réseau a sauté : on ne suit pas)
    if (aide.id === c.j.id && engage && Math.abs(dyaw) + Math.abs(dpitch) < 0.2) {
      const k = Math.min(0.85, 0.5 * force) * (1 - 0.5 * c.score);
      joueur.yaw += dyaw * k;
      joueur.pitch = Math.max(-1.55, Math.min(1.55, joueur.pitch + dpitch * k));
    }
    aide.id = c.j.id;
    aide.yaw = yaw;
    aide.pitch = pitch;
    if (viseDebut && c.dist < 45) aide.aimantJusqua = now + 200;
    if (now < aide.aimantJusqua) {
      const k = Math.min(0.5, dt * 12 * Math.min(1, force));
      joueur.yaw += ecartAngle(yaw - joueur.yaw) * k;
      joueur.pitch += (pitch - joueur.pitch) * k;
    }
  }
  // Vibrations de la manette (si on joue avec et qu'elles sont activées)
  const vibrer = (fort, faible, ms) => { if (prefs.vibrations && commandes.saisie === 'manette') commandes.vibrer(fort, faible, ms); };

  // ---------- Écran « Touches » : changer les touches du clavier, de la souris et de la manette ----------
  let ongletTouches = 'clavier';
  function ouvrirTouches() {
    ongletTouches = commandes.saisie === 'manette' ? 'manette' : 'clavier';
    $('info-touches').textContent = '';
    $('ecran-touches').hidden = false;
    remplirTouches();
  }
  function fermerTouches() {
    commandes.annulerCapture();
    $('ecran-touches').hidden = true;
    remplirAides();
    majLibelles();
  }
  function remplirTouches(focusApres) {
    const manette = ongletTouches === 'manette';
    $('onglet-clavier').classList.toggle('actif', !manette);
    $('onglet-manette').classList.toggle('actif', manette);
    $('aide-touches').textContent = manette
      ? (commandes.pad.connecte
        ? `Choisis une case puis appuie sur le bouton de la manette que tu veux.${commandes.pad.ps ? ' (manette PlayStation)' : ''}`
        : 'Branche ta manette (ou connecte-la en Bluetooth) puis appuie sur un de ses boutons. Tu peux déjà changer les boutons ici.')
      : 'Clique sur une case puis appuie sur la nouvelle touche (la souris et la molette marchent aussi). Retour arrière : vider la case.';
    const liste = $('liste-touches');
    liste.textContent = '';
    let groupe = null;
    for (const a of ACTIONS) {
      if (a.admin && !E.admin) continue;
      if (a.groupe !== groupe) {
        groupe = a.groupe;
        liste.append(groupe === 'Admin' ? el('h3', {}, icone('eclair'), ' Admin') : el('h3', { text: groupe }));
        if (manette && groupe === 'Se déplacer') liste.append(el('div', { class: 'ligne-touche' }, el('span', { class: 'nom-action', text: 'Regarder' }), el('span', { class: 'fixe', text: 'Stick droit' })));
      }
      const ligne = el('div', { class: 'ligne-touche' }, el('span', { class: 'nom-action', text: a.nom }));
      if (manette && a.stick) ligne.append(el('span', { class: 'fixe', text: 'Stick gauche' }));
      else if (!manette && a.fixe) ligne.append(el('span', { class: 'fixe', text: a.fixe }));
      else for (const place of [0, 1]) ligne.append(caseTouche(a, place));
      liste.append(ligne);
    }
    if (focusApres) {
      const b = liste.querySelector(`[data-action="${focusApres.id}"][data-place="${focusApres.place}"]`);
      if (b && commandes.saisie === 'manette') b.focus({ preventScroll: true });
    }
  }
  function caseTouche(a, place) {
    const type = ongletTouches;
    const code = commandes.liaisons[type][a.id][place];
    const nom = code === undefined ? '—' : type === 'clavier' ? commandes.nomTouche(code) : commandes.nomBouton(code);
    const b = el('button', { class: `case-touche${code === undefined ? ' vide' : ''}`, type: 'button', 'data-action': a.id, 'data-place': place, text: nom });
    b.addEventListener('click', () => {
      if (commandes.capture) return;
      b.textContent = type === 'clavier' ? 'Appuie…' : 'Appuie sur un bouton…';
      b.classList.add('attente');
      $('info-touches').textContent = type === 'clavier'
        ? `${a.nom} : appuie sur une touche, ou clique sur la case avec le bouton de souris voulu. Échap ou clic ailleurs : annuler.`
        : `${a.nom} : appuie sur le bouton de la manette voulu.`;
      commandes.capturer(a.id, type, place, (r) => {
        $('info-touches').textContent = '';
        if (r.interdite) $('info-touches').textContent = `La touche ${commandes.nomTouche(r.interdite)} est réservée : choisis-en une autre.`;
        else if (r.conflits && r.conflits.length) {
          const n = type === 'clavier' ? commandes.nomTouche(r.code) : commandes.nomBouton(r.code);
          $('info-touches').textContent = `${n} ne sert plus à : ${r.conflits.join(', ')}.`;
        }
        remplirTouches({ id: a.id, place });
      }, b);
    });
    return b;
  }
  $('btn-touches').addEventListener('click', ouvrirTouches);
  $('btn-fermer-touches').addEventListener('click', fermerTouches);
  $('onglet-clavier').addEventListener('click', () => { commandes.annulerCapture(); ongletTouches = 'clavier'; remplirTouches(); });
  $('onglet-manette').addEventListener('click', () => { commandes.annulerCapture(); ongletTouches = 'manette'; remplirTouches(); });
  $('btn-touches-defaut').addEventListener('click', () => {
    if (!confirm('Remettre toutes les touches (clavier, souris et manette) comme au début ?')) return;
    commandes.annulerCapture();
    commandes.reinitialiser();
    $('info-touches').textContent = 'Les touches sont revenues comme au début.';
    remplirTouches();
  });

  // ---------- Aides (liste des commandes) et noms des touches dans les menus ----------
  function kbds(id, type, toutes = false) {
    const l = commandes.liaisons[type][id];
    const fixe = type === 'clavier' && ACTION[id].fixe;
    const noms = fixe ? [fixe] : (toutes ? l : l.slice(0, 1)).map((c) => (type === 'clavier' ? commandes.nomTouche(c) : commandes.nomBouton(c, true)));
    if (!noms.length) return [el('kbd', { text: '—' })];
    return noms.flatMap((n, i) => (i ? [' ou ', el('kbd', { text: n })] : [el('kbd', { text: n })]));
  }
  function remplirAides() {
    const k = (id, toutes) => kbds(id, 'clavier', toutes);
    const b = (id, toutes) => kbds(id, 'manette', toutes);
    const lignes = (hall) => [
      [...k('avancer'), ...k('gauche'), ...k('reculer'), ...k('droite'), ' se déplacer'],
      [...k('sauter'), ' sauter'],
      hall ? [el('kbd', { text: 'Souris' }), ' regarder'] : null,
      [...k('tirer'), ' tirer'],
      [...k('viser', true), hall ? ' viser (plus précis)' : ' viser'],
      [...k('arme1'), ' principale · ', ...k('arme2'), ' secondaire · ', ...k('arme3'), ' mêlée · ', ...k('arme4'), ' gadget ; ', ...k('armeSuivante', true), ' : arme suivante'],
      [...k('recharger'), ' recharger · ', ...k('inspecter'), ' regarder son arme · ', ...k('danser'), ' danser'],
      hall ? null : [...k('changerArmes'), ' changer d\'armes (quand tu es éliminé)'],
      hall ? null : ['Couteau : vise dans le dos d\'un adversaire pour l\'éliminer d\'un coup !'],
      hall ? [...k('scores'), ' scores'] : [...k('scores'), ' scores · ', el('kbd', { text: 'Échap' }), ' menu'],
      hall ? ['Les blocs bleus fléchés sont des ', el('b', { text: 'trampolines' }), ' ! Tire à tes pieds au lance-roquettes pour t\'envoler.'] : null,
      ['Les touches se changent dans ', icone('reglages'), ' Réglages → Changer les touches.'],
    ];
    const lignesManette = [
      [icone('joystick'), ' Stick gauche : se déplacer · stick droit : regarder'],
      [...b('tirer'), ' tirer · ', ...b('viser'), ' viser · ', ...b('sauter'), ' sauter · ', ...b('recharger'), ' recharger'],
      [...b('armePrecedente'), ' ', ...b('armeSuivante'), ' changer d\'arme · ', ...b('arme3'), ' mêlée · ', ...b('arme4'), ' gadget'],
      [...b('inspecter'), ' regarder son arme · ', ...b('danser'), ' danser · ', ...b('scores'), ' scores · ', ...b('menu'), ' menu'],
      ['Menus : la croix pour choisir, ', el('kbd', { text: commandes.nomBouton(0) }), ' pour valider, ', el('kbd', { text: commandes.nomBouton(1) }), ' pour revenir'],
    ];
    const remplir = (id, l) => { const n = $(id); if (n) n.replaceChildren(...l.filter(Boolean).map((x) => el('span', {}, ...x))); };
    remplir('aide-clavier-pause', lignes(false));
    remplir('aide-clavier-hall', lignes(true));
    remplir('aide-manette-pause', lignesManette);
    remplir('aide-manette-hall', lignesManette);
  }
  // Les petits textes qui citent une touche (selon qu'on joue au clavier ou à la manette)
  function majLibelles() {
    const manette = commandes.saisie === 'manette';
    const t = modeTactile();
    const kbdArmes = $('kbd-changer-armes');
    const nom = commandes.libelle('changerArmes', { court: true });
    kbdArmes.textContent = nom;
    kbdArmes.hidden = !nom || (t && !manette);
    $('btn-reprendre').replaceChildren(icone('jouer'), manette ? ` Jouer (${commandes.nomBouton(0)})` : t ? ' Toucher pour jouer' : ' Cliquer pour jouer');
    E.libellesArmes = ['arme1', 'arme2', 'arme3', 'arme4'].map((a) => commandes.libelle(a, { court: true }));
  }
  // État de la manette dans les réglages
  function majEtatManette() {
    $('etat-manette').textContent = commandes.pad.connecte
      ? `Manette détectée${commandes.pad.ps ? ' (PlayStation)' : ''}.`
      : 'Aucune manette : branche-la (ou connecte-la en Bluetooth) puis appuie sur un de ses boutons.';
  }

  // ---------- Armes ----------
  const _o = new THREE.Vector3();
  const _d = new THREE.Vector3();
  const _bout = new THREE.Vector3();
  const _fin = new THREE.Vector3();
  const _ej = new THREE.Vector3();

  const equipementIndices = (choix) => ['principale', 'secondaire', 'melee', 'gadget'].map((c) => ARMES.findIndex((a) => a.id === choix[c]));
  function changerSlot(k) {
    if (E.equipement && E.equipement[k] !== undefined) changerArme(E.equipement[k]);
  }
  function changerArme(i) {
    if (i === E.arme || !joueur.vivant || !arme) return;
    arreterMaDanse();
    if (E.soinFin) { E.soinFin = 0; if (arme.soigner) arme.soigner(0); }
    if (E.grappin) finGrappin();
    E.arme = i;
    E.rechargeFin = 0;
    E.rafaleReste = 0;
    E.chaleur = 0;
    E.pretA = performance.now() + ARMES[i].sortieMs * 0.75;
    if (modeTactile()) E.viser = false; // le bouton "Viser" se remet à zéro
    arme.choisir(i);
    reseau.envoyer({ t: 'arme', a: i });
  }

  function recharger() {
    const w = ARMES[E.arme];
    if (!w.chargeur) return; // mêlée et gadgets : pas de munitions
    if (E.rechargeFin || E.munitions[E.arme] >= w.chargeur || !joueur.vivant || performance.now() < E.pretA) return;
    arreterMaDanse();
    E.rechargeDebut = performance.now();
    E.rechargeFin = E.rechargeDebut + w.rechargementMs;
    arme.recharger(w.rechargementMs);
    reseau.envoyer({ t: 'rech' });
  }

  function finRechargement(now) {
    const w = ARMES[E.arme];
    if (w.parCartouche) {
      E.munitions[E.arme] = Math.min(w.chargeur, E.munitions[E.arme] + 1);
      son('cartouche_insere', { vol: 0.6 });
      if (E.munitions[E.arme] < w.chargeur) {
        E.rechargeDebut = now;
        E.rechargeFin = now + w.rechargementMs;
        arme.recharger(w.rechargementMs);
      } else {
        E.rechargeFin = 0;
        arme.finRecharge(true);
      }
    } else {
      E.munitions[E.arme] = w.chargeur;
      E.rechargeFin = 0;
      arme.finRecharge(false);
    }
  }

  // Direction de la caméra (là où on vise)
  function viseeCamera() {
    camera.updateMatrixWorld();
    _o.copy(camera.position);
    _d.set(0, 0, -1).applyQuaternion(camera.quaternion);
    return { o: tableau(_o), d: tableau(_d) };
  }

  // Un adversaire tout proche à qui on tourne... dans le dos ? (pour l'animation spéciale du couteau)
  function adversaireDeDos(w) {
    for (const j of E.joueurs.values()) {
      if (j.id === E.moiId || !j.vivant) continue;
      if (E.mode === 'equipes' && j.equipe === moi().equipe) continue;
      const p = j.perso.groupe.position;
      const dx = joueur.pos.x - p.x; const dz = joueur.pos.z - p.z;
      const dist = Math.hypot(dx, dz);
      if (dist > w.portee + 0.6) continue;
      const yaw = j.perso.groupe.rotation.y;
      if ((-Math.sin(yaw) * dx - Math.cos(yaw) * dz) / (dist || 1) < -0.35) return true;
    }
    return false;
  }

  // Mêlée : couteau, batte, poêle
  function frapper(now, w) {
    E.dernierTir = now;
    const { o, d } = viseeCamera();
    const special = !!(w.dansLeDos && E.viser && adversaireDeDos(w));
    reseau.envoyer({ t: 'tir', a: E.arme, o, d, v: E.viser ? 1 : 0 });
    if (arme.frapper) arme.frapper(special); else arme.tirer(1);
    vibrer(0.35, 0.3, 90);
  }

  // Gadgets : grenade, fumigène, grappin, kit de soin
  function utiliserGadget(now, w) {
    E.dernierTir = now;
    if (now < E.gadgetPretA) {
      son('vide', { vol: 0.4 });
      hud.toast(`${w.nom} : encore ${Math.ceil((E.gadgetPretA - now) / 1000)} s`);
      return;
    }
    if (w.id === 'kit_soin' && E.pv >= reglages.joueur.pointsDeVie) { hud.toast('Tu as déjà toute ta vie !'); return; }
    const { o, d } = viseeCamera();
    reseau.envoyer({ t: 'tir', a: E.arme, o, d });
    E.gadgetPretA = now + (pouvoir('munitions') ? 300 : w.rechargeGadgetMs); // le serveur confirme
    if (w.id === 'grenade' || w.id === 'fumigene' || w.id === 'grenade_flash' || w.id === 'meteores') {
      if (arme.lancer) arme.lancer();
      son(w.id === 'meteores' ? 'lobby_pret' : 'grenade_goupille', { vol: 0.6 });
      son('grenade_lancer', { vol: 0.7, delai: 0.2 });
    } else if (w.id === 'mine') {
      if (arme.lancer) arme.lancer();
      son('clic', { vol: 0.7, delai: 0.25 });
    } else if (w.id === 'propulseur') {
      if (arme.tirer) arme.tirer(1);
    } else if (w.id === 'grappin') {
      if (arme.grappiner) arme.grappiner();
      son('grappin_tir', { vol: 0.8 });
    } else if (w.id === 'kit_soin') {
      if (arme.soigner) arme.soigner(w.dureeSoinMs);
      son('soin', { vol: 0.7 });
      E.soinFin = now + w.dureeSoinMs;
      E.soinDuree = w.dureeSoinMs;
    }
  }

  // Le grappin est accroché : on est tiré vers le point
  function finGrappin() {
    if (!E.grappin) return;
    E.grappin = null;
    effets.enleverCorde('moi');
    if (arme && arme.rentrerGrappin) arme.rentrerGrappin();
  }

  // Laser de l'admin : bourdonnement qui monte et réacteur autour du viseur pendant la charge
  // (la charge elle-même est calculée dans la boucle, quand on garde le tir enfoncé).
  let bourdon = null;
  let laserHud = null;
  function majLaserFx(dt, now) {
    const w = ARMES[E.arme];
    if ((!E.enPartie || !joueur.vivant || !w || w.type !== 'laser') && E.chargeLaser) {
      E.chargeLaser = 0;
      if (arme && arme.chargerLaser) arme.chargerLaser(0);
    }
    const c = E.chargeLaser || 0;
    if (c > 0 && !bourdon) bourdon = bourdonLaser();
    if (bourdon) {
      if (c > 0) bourdon.maj(c);
      else { bourdon.arreter(); bourdon = null; }
    }
    if (c > 0 && !laserHud) laserHud = new LaserHud();
    if (laserHud) laserHud.maj(c, dt, now);
  }

  // Minigun : le bruit du moteur suit la vitesse des canons (0 → 1)
  let moteur = null;
  function majMoteurMinigun(k) {
    if (k > 0.02 && !moteur) moteur = moteurMinigun();
    if (!moteur) return;
    if (k > 0.02) moteur.maj(k);
    else { moteur.arreter(); moteur = null; }
  }

  // Fusil Tesla (admin) : le serveur cherche les cibles et renvoie l'éclair à tout le monde (message « tesla »).
  function tirerTesla(now, w) {
    E.dernierTir = now;
    const { o, d } = viseeCamera();
    reseau.envoyer({ t: 'tir', a: E.arme, o, d });
    arme.tirer(0);
    son('tesla_zap', { vol: 0.9 });
    const kick = pouvoir('sansRecul') ? 0 : w.recul;
    joueur.pitch = Math.min(1.55, joueur.pitch + kick);
    E.reculARattraper += kick * 0.6;
    E.secousse = Math.max(E.secousse, 0.25);
    vibrer(0.6, 0.4, 120);
  }

  // Laser de l'admin : on envoie la charge (0 → 1) ; le serveur fait les dégâts et casse la carte.
  function tirerLaser(now, charge) {
    const w = ARMES[E.arme];
    E.dernierTir = now;
    camera.updateMatrixWorld();
    _o.copy(camera.position);
    _d.set(0, 0, -1).applyQuaternion(camera.quaternion);
    const o = tableau(_o);
    const dRond = tableau(_d);
    reseau.envoyer({ t: 'tir', a: E.arme, o, d: dRond, ch: Math.round(charge * 1000) / 1000 });
    arme.pointMonde('bout', camera, _bout);
    const coup = rayonDetail(o, dRond, w.portee);
    const fin = _fin.copy(_d).multiplyScalar(coup.t).add(_o);
    effets.rayonLaser(_bout.clone(), fin.clone(), charge);
    arme.tirer(0);
    tirLaserSon(charge);
    if (!laserHud) laserHud = new LaserHud();
    laserHud.tir(charge);
    E.secousse = Math.max(E.secousse, 0.3 + charge * 0.9); // l'écran tremble au tir
    E.fovKick = 6 + charge * 16;                            // et la vue « s'ouvre » d'un coup
    const kick = pouvoir('sansRecul') ? 0 : w.recul * (0.4 + charge);
    joueur.pitch = Math.min(1.55, joueur.pitch + kick);
    E.reculARattraper += kick * 0.6;
    vibrer(Math.min(1, 0.3 + charge * 0.7), 0.5, 120 + charge * 180);
  }

  function tirer(now) {
    const w = ARMES[E.arme];
    if (w.type === 'laser') { tirerLaser(now, E.chargeLaser || 0); return; }
    if (w.type === 'tesla') { tirerTesla(now, w); return; }
    if (w.type === 'melee') { frapper(now, w); return; }
    if (w.type === 'gadget') { utiliserGadget(now, w); return; }
    // Le fusil à pompe peut interrompre son rechargement pour tirer.
    if (E.rechargeFin && w.parCartouche) { E.rechargeFin = 0; arme.finRecharge(false); }
    E.dernierTir = now;
    if (!pouvoir('munitions')) E.munitions[E.arme]--; // admin : munitions infinies
    camera.updateMatrixWorld();
    const vitesse = Math.min(1, joueur.vitesseHorizontale() / reglages.joueur.vitesse);
    const precis = pouvoir('precision');
    const dispersion = precis ? 0 : r3(dispersionActuelle(w, { visee: E.visee, vitesse, enLAir: !joueur.auSol, chaleur: E.chaleur }));
    if (!precis) E.chaleur = Math.min(w.dispersion.max, E.chaleur + w.dispersion.parTir);
    const graine = Math.floor(Math.random() * 4294967296) >>> 0;
    _o.copy(camera.position);
    _d.set(0, 0, -1).applyQuaternion(camera.quaternion);
    const o = tableau(_o);
    const dRond = tableau(_d);
    reseau.envoyer({ t: 'tir', a: E.arme, o, d: dRond, e: dispersion, s: graine });

    arme.pointMonde('bout', camera, _bout);
    effets.eclairCanon(_bout);
    arme.tirer(E.munitions[E.arme]);
    son(`${w.id}_tir`, { vol: 0.9, variation: 0.04 });
    // Recul de la caméra : le canon monte, puis redescend en partie tout seul (pas de recul : pouvoir d'admin)
    if (pouvoir('sansRecul')) arme.recul = 0;
    const kick = pouvoir('sansRecul') ? 0 : w.recul * (1 - 0.45 * E.visee);
    joueur.pitch = Math.min(1.55, joueur.pitch + kick);
    joueur.yaw += (Math.random() - 0.5) * kick * 0.6;
    E.reculARattraper += kick * 0.65;
    vibrer(Math.min(1, w.recul * 12), Math.min(1, 0.25 + w.recul * 8), w.recul > 0.04 ? 140 : 60);

    if (w.type !== 'balle') {
      // Roquette, carreau, fusée : le projectile arrive par le serveur ; ici un peu de fumée.
      // (la fumée part devant, jamais collée à la caméra)
      if (w.type === 'roquette') {
        const devant = _ej.copy(_d).multiplyScalar(1.6).add(camera.position);
        effets.fumee(devant, 5, '#c8c8c8', 0.08, { dir: _d, grandit: 0.25, vie: 0.8 });
      }
    } else {
      // Les balles : même calcul que le serveur, pour afficher les traînées au bon endroit
      const directions = directionsTir(normaliser(dRond), dispersion, w.plombs || 1, graine);
      const style = TRAINEES[w.id] || TRAINEES.fusil;
      for (const d of directions) {
        const coup = rayonDetail(o, d, w.portee);
        let t = coup.t;
        let joueurTouche = false;
        for (const j of E.joueurs.values()) {
          if (j.id === E.moiId || !j.vivant) continue;
          if (E.mode === 'equipes' && j.equipe === moi().equipe) continue;
          const b = boitesJoueur(positionDe(j));
          const tj = Math.min(rayonBoite(o, d, b.tete), rayonBoite(o, d, b.corps));
          if (tj < t) { t = tj; joueurTouche = true; }
        }
        _fin.set(o[0] + d[0] * t, o[1] + d[1] * t, o[2] + d[2] * t);
        if (w.traceur === 'eau') { effets.jetEau(_bout, _fin, joueurTouche); continue; } // pistolet à eau : pas de trou dans le mur
        if (w.plombs > 1 || Math.random() < 0.85) effets.trait(_bout, _fin, style);
        if (w.traceur === 'violet') effets.boule(_fin, 0xc77dff, 0.6, 0.25, 1.5);
        if (!joueurTouche && coup.boite && t < w.portee) {
          effets.impact(_fin, coup.normale, coup.boite[6]);
          if (Math.random() < 0.35) son('impact_mur', { position: _fin, vol: 0.5 });
        }
      }
      if (['pompe', 'sniper', 'canon_scie', 'revolver', 'precision'].includes(w.id)) {
        effets.fumee(_ej.copy(_d).multiplyScalar(1.2).add(camera.position), 3, '#c8c8c8', 0.05, { dir: _d, grandit: 0.12, vie: 0.6 });
      }
      // Douille éjectée sur la droite (pour le fusil à pompe : au moment de pomper)
      if (arme.pointMonde('ejection', camera, _ej)) {
        const droite = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        const vit = droite.multiplyScalar(2 + Math.random()).add(new THREE.Vector3(0, 2 + Math.random(), 0));
        if (w.id !== 'pompe') effets.douille(_ej, vit);
        else setTimeout(() => { if (arme && arme.pointMonde('ejection', camera, _ej)) effets.douille(_ej, vit, true); }, 250);
        if ((w.id !== 'smg' && !(w.cadenceMs < 50)) || Math.random() < 0.3) son('douille', { vol: 0.25, delai: 0.45 + Math.random() * 0.2 });
      }
    }
    if (E.munitions[E.arme] <= 0) setTimeout(recharger, w.id === 'sniper' ? 300 : 150);
  }

  // ---------- Messages du serveur ----------
  // ---------- Mon personnage (l'atelier de personnalisation) ----------
  E.monStyle = null;
  E.monId = 1;
  const monStyle = () => E.monStyle || styleParDefaut(E.monId);
  // « Mon personnage » du site (ou d'un autre jeu) : on arrive avec ?personnage=1&retour=/... ; l'atelier
  // s'ouvre tout seul et, en le fermant, on revient d'où l'on vient (le personnage est commun à tout le site).
  const parametres = new URLSearchParams(location.search);
  const retourPerso = /^\/(?!\/)[\w\-/]*$/.test(parametres.get('retour') || '') ? parametres.get('retour') : '';
  let persoDepuisLeSite = parametres.has('personnage');
  const atelier = new Atelier({
    sauver: (style) => reseau.envoyer({ t: 'sauverStyle', style }),
    surFermer: () => { if (persoDepuisLeSite === 'ouvert' && retourPerso) location.href = retourPerso; },
  });
  const boutonPerso = boutonPersonnage(() => { demarrerSons(); son('clic'); atelier.ouvrir(monStyle()); });
  $('hall-perso').append(boutonPerso);
  // L'écran d'accueil : mon personnage en grand, avec mon arme principale
  const accueil = new Accueil3D(renderer);
  accueil.majArme(equipementMemorise().principale);
  // quand les modèles 3D des armes sont chargés, le perso de l'accueil reprend son arme avec le nouveau modèle
  prechargerArmes(styleArmes()).then(() => { if (!E.enPartie) accueil.majStyle(monStyle()); });
  brancherHall();
  $('btn-armes').addEventListener('click', () => {
    demarrerSons();
    son('clic');
    choixArmes.ouvrir(null, { titre: 'Mes armes', sousTitre: 'Ton équipement pour les prochaines parties.', texteBouton: 'Enregistrer', fermable: true });
  });
  reseau.on('animations', (msg) => appliquerAnimations(msg.animations)); // l'admin vient d'en enregistrer une
  reseau.on('danses', (msg) => definirDanses(msg.danses));
  reseau.on('danse', (msg) => {
    const j = E.joueurs.get(msg.id);
    if (!j || msg.id === E.moiId) return;
    if (msg.d) commencerDanseDe(j, msg.d); else arreterDanseDe(j);
  });
  // Mode classé : les points de rang, gardés par le serveur avec le compte (à la connexion et après chaque manche classée)
  reseau.on('rang', (msg) => {
    E.pointsClasse = Math.max(0, Number(msg.points) || 0);
    if (typeof msg.gain === 'number') E.resultatClasse = resultat(msg.avant, E.pointsClasse);
    majBadgeClasse();
  });
  reseau.on('monStyle', (msg) => {
    E.monStyle = msg.style;
    boutonPerso.majVignette(monStyle());
    accueil.majStyle(monStyle());
    if (persoDepuisLeSite === true) { persoDepuisLeSite = 'ouvert'; atelier.ouvrir(monStyle()); }
  });
  reseau.on('styleSauve', (msg) => {
    E.monStyle = msg.style;
    boutonPerso.majVignette(msg.style);
    accueil.majStyle(msg.style);
    atelier.sauvegarde(true);
    hud.toast(E.enPartie ? 'Personnage enregistré : tu le verras à la prochaine partie.' : 'Ton personnage est enregistré !');
  });

  reseau.on('salons', (msg) => {
    if (msg.moi) {
      E.moiNom = msg.moi.nom;
      E.monId = msg.moi.id;
      if (!E.monStyle) accueil.majStyle(monStyle());
    }
    if (msg.cartes) afficherCartes(msg.cartes);
    afficherSalons(msg.liste);
    // Arrivée par une invitation ou "Rejoindre" : on entre directement dans la bonne partie.
    if (!E.enPartie && E.salleDemandee) {
      reseau.envoyer({ t: 'rejoindre', code: E.salleDemandee });
      E.salleDemandee = null;
    }
    // Arrivée depuis l'éditeur de cartes (bouton « Tester ») : on crée une partie sur cette carte.
    if (!E.enPartie && E.carteATester) {
      reseau.envoyer({ t: 'creer', mode: 'solo', carte: E.carteATester });
      E.carteATester = null;
    }
  });
  reseau.on('erreur', (msg) => {
    if (atelier.ouvert) { atelier.sauvegarde(false, msg.message); return; }
    $('hall-erreur').textContent = msg.message;
    if (E.enPartie) hud.toast(msg.message);
    if (!E.enPartie) history.replaceState(null, '', location.pathname);
  });
  reseau.on('bienvenue', entrerPartie);
  reseau.on('entree', (msg) => {
    if (!E.enPartie) return;
    ajouterJoueur(msg.joueur);
    hud.info(`${msg.joueur.nom} a rejoint la partie`);
    majSalleAttente();
  });
  reseau.on('sortie', (msg) => {
    const j = E.joueurs.get(msg.id);
    if (!j || msg.id === E.moiId) return;
    hud.info(`${j.nom} a quitté la partie`);
    retirerJoueur(msg.id);
    E.prets.delete(msg.id);
    majSalleAttente();
  });

  reseau.on('s', (msg) => {
    const now = performance.now();
    for (const [id, x, y, z, yaw, pitch, a, drapeaux] of msg.j) {
      if (id === E.moiId) continue;
      const j = E.joueurs.get(id);
      if (!j) continue;
      j.tampon.push({ t: now, x, y, z, yaw, pitch });
      if (j.tampon.length > 40) j.tampon.shift();
      if (a !== j.arme && ARMES[a]) prendreArmePerso(j, a);
      j.visee = !!(drapeaux & 1);
      j.recharge = !!(drapeaux & 2);
    }
    // Les grenades rebondissent : on se recale sur la position donnée par le serveur
    if (msg.pr) {
      for (const [id, x, y, z] of msg.pr) {
        const pr = E.projectiles.get(id);
        if (pr) (pr.cible || (pr.cible = new THREE.Vector3())).set(x, y, z);
      }
    }
  });

  reseau.on('apparition', (msg) => {
    const j = E.joueurs.get(msg.id);
    if (!j) return;
    const now = performance.now();
    j.vivant = true;
    j.protegeJusqua = now + msg.prot;
    const [x, y, z] = msg.p;
    if (msg.eq) j.eq = msg.eq;
    if (msg.id === E.moiId) { arreterMaDanse(false); finCameraTueur(); if (E.admin) appliquerPouvoirs(); } else arreterDanseDe(j);
    if (msg.id === E.moiId) {
      E.vie = msg.vie;
      E.equipement = msg.eq;
      E.arme = msg.arme;
      E.gadgetPretA = 0;
      E.soinFin = 0;
      E.rafaleReste = 0;
      finGrappin();
      joueur.placer(msg.p, msg.yaw);
      joueur.vivant = true;
      E.pv = msg.pv;
      E.munitions = msg.munitions.slice();
      E.rechargeFin = 0;
      E.chaleur = 0;
      E.reculARattraper = 0;
      E.monRagdoll = null;
      hud.mort(false);
      if (arme) { arme.choisir(E.arme, true); arme.visible = true; }
      son('apparition', { vol: 0.6 });
    } else {
      j.tampon = [{ t: now - 1, x, y, z, yaw: msg.yaw, pitch: 0 }];
      j.perso.groupe.position.set(x, y, z);
      j.perso.groupe.visible = true;
      if (msg.arme !== undefined) prendreArmePerso(j, msg.arme);
    }
    effets.explosion(new THREE.Vector3(x, y + 1, z), ['#7fe8ff', '#ffffff', '#3d8bff'],
      { nombre: 18, force: 2.5, haut: 3, taille: 0.1, vie: 0.8, gravite: 0.3 });
  });

  reseau.on('corr', (msg) => {
    if (msg.vie !== E.vie) return;
    joueur.pos.set(msg.p[0], msg.p[1], msg.p[2]);
    joueur.vit.set(0, 0, 0);
  });

  // Un autre joueur a tiré (balles)
  reseau.on('tir', (msg) => {
    const j = E.joueurs.get(msg.id);
    if (!j || !j.perso) return;
    j.protegeJusqua = 0;
    const w = ARMES[msg.a] || ARMES[0];
    if (j.arme !== msg.a) prendreArmePerso(j, msg.a);
    const depart = j.perso.boutDuCanon(new THREE.Vector3());
    effets.eclairCanon(depart);
    const style = { ...(TRAINEES[w.id] || TRAINEES.fusil) };
    if (E.mode === 'equipes') style.couleur = j.equipe === 0 ? 0x9cc4ff : 0xffa0a0;
    const origine = new THREE.Vector3(msg.o[0], msg.o[1], msg.o[2]);
    msg.f.forEach((f, i) => {
      const fin = new THREE.Vector3(f[0], f[1], f[2]);
      if (w.traceur === 'eau') { effets.jetEau(depart, fin, !!msg.c[i]); return; }
      effets.trait(depart, fin, style);
      if (w.traceur === 'violet') effets.boule(fin, 0xc77dff, 0.6, 0.25, 1.5);
      if (!msg.c[i]) {
        const d = normaliser([f[0] - msg.o[0], f[1] - msg.o[1], f[2] - msg.o[2]]);
        if (!d) return;
        const coup = rayonDetail(msg.o, d, fin.distanceTo(origine) + 0.5);
        if (coup.boite) effets.impact(fin, coup.normale, coup.boite[6]);
      }
    });
    son(`${w.id}_tir`, { position: depart, portee: w.id === 'sniper' || w.id === 'pompe' ? 2.5 : 1.6, vol: 0.9 });
  });

  // Projectiles (roquettes, carreaux, fusées, grenades, fumigènes) : le serveur les fait
  // voler et décide des impacts ; ici on les affiche.
  function meshProjectile(type) {
    const nouveau = Modeles.modeleProjectileVol && Modeles.modeleProjectileVol(type); // obus, plasma, clou, trou noir, artifice, flash, balise, mine
    if (nouveau) return nouveau;
    if (type === 'roquette') return Modeles.modeleRoquetteVol();
    if (type === 'carreau' && Modeles.modeleCarreauVol) return Modeles.modeleCarreauVol();
    if (type === 'fusee' && Modeles.modeleFuseeVol) return Modeles.modeleFuseeVol();
    if ((type === 'grenade' || type === 'fumigene') && Modeles.modeleGrenadeVol) return Modeles.modeleGrenadeVol(type);
    const tailles = { carreau: [0.03, 0.03, 0.55], fusee: [0.07, 0.07, 0.16], grenade: [0.09, 0.11, 0.09], fumigene: [0.08, 0.15, 0.08] };
    const couleurs = { carreau: 0x8b6b3d, fusee: 0xff5533, grenade: 0x3f5a2a, fumigene: 0x9aa0a8 };
    const m = type === 'fusee' ? new THREE.MeshBasicMaterial({ color: couleurs.fusee }) : new THREE.MeshLambertMaterial({ color: couleurs[type] || 0x888888 });
    return new THREE.Mesh(new THREE.BoxGeometry(...(tailles[type] || [0.1, 0.1, 0.1])), m);
  }
  const SON_PROJECTILE = {
    roquette: 'roquette_tir', carreau: 'arbalete_tir', fusee: 'lance_fusee_tir', grenade: 'grenade_lancer', fumigene: 'grenade_lancer',
    obus: 'lance_grenades_tir', plasma: 'plasma_tir', clou: 'cloueuse_tir', trou_noir: 'trou_noir_tir', artifice: 'feu_artifice_tir',
    flash: 'grenade_lancer', balise: 'grenade_lancer', mine: 'clic',
  };
  // Projectiles qui rebondissent (le serveur envoie leur position pour qu'on se recale)
  const REBONDISSENT = new Set(['grenade', 'fumigene', 'flash', 'balise']);
  reseau.on('projectile', (msg) => {
    const mesh = meshProjectile(msg.type);
    mesh.position.set(msg.p[0], msg.p[1], msg.p[2]);
    const v = new THREE.Vector3(msg.v[0], msg.v[1], msg.v[2]);
    if (v.lengthSq() > 0) mesh.quaternion.setFromUnitVectors(AXE_MOINS_Z, v.clone().normalize());
    scene.add(mesh);
    const rebondit = REBONDISSENT.has(msg.type);
    E.projectiles.set(msg.id, { mesh, type: msg.type, a: msg.a, v, nee: performance.now(), rebondit, cible: null });
    if (msg.tireur !== E.moiId) {
      const j = E.joueurs.get(msg.tireur);
      if (j) { j.protegeJusqua = 0; if ((rebondit || msg.type === 'mine') && j.perso.lancer) j.perso.lancer(); }
      son(SON_PROJECTILE[msg.type], { position: mesh.position, portee: 2, vol: 0.9 });
    }
  });
  reseau.on('projectileFin', (msg) => {
    const pr = E.projectiles.get(msg.id);
    const p = new THREE.Vector3(msg.p[0], msg.p[1], msg.p[2]);
    if (pr) {
      E.projectiles.delete(msg.id);
      if ((msg.type === 'carreau' || msg.type === 'clou') && msg.mur) { // le carreau ou le clou reste planté dans le mur
        pr.mesh.position.copy(p); // le carreau reste planté dans le mur
        E.carreauxPlantes.push({ mesh: pr.mesh, fin: performance.now() + 8000 });
        son('carreau_impact', { position: p, vol: 0.8 });
      } else pr.mesh.removeFromParent();
    }
    if (msg.type === 'fusee') {
      effets.explosion(p, ['#ff5533', '#ffb347', '#ffffff'], { nombre: 18, force: 3, taille: 0.06, vie: 0.7, haut: 1.5 });
      son('fusee_brule', { position: p, vol: 0.6 });
    }
  });
  reseau.on('explosion', (msg) => {
    const pr = E.projectiles.get(msg.id);
    if (pr) { pr.mesh.removeFromParent(); E.projectiles.delete(msg.id); }
    const p = new THREE.Vector3(msg.p[0], msg.p[1], msg.p[2]);
    const mini = msg.type === 'mini'; // balles explosives de l'admin
    // Nouvelles armes : des explosions qui ne ressemblent pas à celle de la roquette (obus, mine, météore : comme elle)
    const speciales = {
      plasma: () => { effets.explosionPlasma(p, msg.rayon); son('plasma_impact', { position: p, portee: 2 }); return 0.3; },
      artifice: () => { effets.explosionArtifice(p, msg.rayon, msg.c || 0); son('artifice', { position: p }); return msg.rayon >= 3.5 ? 0.5 : 0.25; },
      thor: () => { effets.eclairThor(p, msg.rayon); son('tonnerre', { position: p }); return 1.1; },
      trou_noir: () => { effets.implosion(p, msg.rayon); son('trou_noir_boom', { position: p }); return 1.3; },
      flash: () => { effets.flashBlanc(p); son('flash', { position: p }); return 0.35; },
    };
    if (speciales[msg.type]) {
      const force = speciales[msg.type]();
      const d = p.distanceTo(camera.position);
      E.secousse = Math.max(E.secousse, Math.max(0, 1 - d / 28) * force);
      if (d < 20 && force > 0.6) vibrer(1 - d / 22, 0.6 * (1 - d / 22), 300);
      return;
    }
    if (msg.type === 'frappe') effets.rayonLaser(new THREE.Vector3(p.x, p.y + 140, p.z), p, 1); // le rayon tombe du ciel
    effets.explosionRoquette(p, msg.rayon || 4);
    son('explosion', { position: p, portee: mini ? 2 : 4, vol: mini ? 0.45 : 1 });
    if (msg.type === 'frappe') tirLaserSon(1, p);
    const dist = p.distanceTo(camera.position);
    E.secousse = Math.max(E.secousse, Math.max(0, 1 - dist / 28) * (mini ? 0.3 : msg.type === 'frappe' ? 1.4 : 0.9));
    if (dist < 25) vibrer(1 - dist / 28, 0.7 * (1 - dist / 28), 300);
  });
  reseau.on('rebond', (msg) => son('grenade_rebond', { position: new THREE.Vector3(msg.p[0], msg.p[1], msg.p[2]), vol: 0.6 }));
  // Zones des armes d'admin : trou noir (il aspire tout le monde), pluie de météores (cercle rouge au sol)
  reseau.on('zone', (msg) => {
    const p = new THREE.Vector3(msg.p[0], msg.p[1], msg.p[2]);
    effets.zone(msg.id, msg.type, p, msg.ms, msg.rayon);
    if (msg.type === 'trou_noir') {
      if (E.bourdons.has(msg.id)) E.bourdons.get(msg.id).arreter();
      E.bourdons.set(msg.id, bourdonTrouNoir(p));
    } else if (msg.type === 'meteores') son('lobby_pret', { position: p, portee: 4, vol: 0.9 });
  });
  reseau.on('zoneFin', (msg) => {
    effets.finZone(msg.id);
    const b = E.bourdons.get(msg.id);
    if (b) { b.arreter(); E.bourdons.delete(msg.id); }
  });
  // Fusil Tesla : l'éclair part du canon et saute d'adversaire en adversaire (points = les impacts)
  reseau.on('tesla', (msg) => {
    if (!Array.isArray(msg.points) || !msg.points.length) return;
    let depart;
    if (msg.id === E.moiId && arme) depart = arme.pointMonde('bout', camera, new THREE.Vector3());
    else {
      const j = E.joueurs.get(msg.id);
      depart = j && j.perso ? j.perso.boutDuCanon(new THREE.Vector3()) : new THREE.Vector3(msg.o[0], msg.o[1], msg.o[2]);
      if (j) j.protegeJusqua = 0;
      son('tesla_zap', { position: depart, portee: 2, vol: 0.9 });
    }
    const points = [depart, ...msg.points.map((q) => new THREE.Vector3(q[0], q[1], q[2]))];
    effets.arcsTesla(points);
    const d = points[points.length - 1].distanceTo(camera.position);
    if (d < 20) E.secousse = Math.max(E.secousse, (1 - d / 20) * 0.4);
  });
  // Pluie de météores : un rocher en feu tombe, l'explosion arrive ensuite (message « explosion »)
  reseau.on('meteore', (msg) => {
    const cible = new THREE.Vector3(msg.cible[0], msg.cible[1], msg.cible[2]);
    effets.meteore(new THREE.Vector3(msg.p[0], msg.p[1], msg.p[2]), cible, msg.ms || 600);
    son('meteore', { position: cible });
  });
  // Propulseur : des flammes sous les pieds de celui qui s'envole
  reseau.on('propulse', (msg) => {
    const j = E.joueurs.get(msg.id);
    const base = msg.id === E.moiId ? joueur.pos : (j && j.perso ? j.perso.groupe.position : null);
    const p = base ? base.clone() : new THREE.Vector3(msg.p[0], msg.p[1], msg.p[2]);
    effets.flammes(p);
    son('propulseur', { position: p, portee: 2 });
  });
  // Rayon anti-gravité : le joueur touché s'envole, entouré d'étincelles violettes
  reseau.on('lev', (msg) => {
    E.levitations.set(msg.id, performance.now() + (msg.ms || 2000));
    if (msg.id === E.moiId) hud.toast('Tu t\'envoles !');
  });
  // Laser d'un autre joueur (admin) : on dessine le rayon et on casse la carte quand le serveur le dit.
  reseau.on('laser', (msg) => {
    if (msg.id === E.moiId) return; // le mien est déjà dessiné localement
    const j = E.joueurs.get(msg.id);
    const dep = j && j.perso ? j.perso.boutDuCanon(_v).clone() : new THREE.Vector3(msg.o[0], msg.o[1], msg.o[2]);
    const impact = new THREE.Vector3(msg.p[0], msg.p[1], msg.p[2]);
    effets.rayonLaser(dep, impact, msg.ch || 0.5);
    tirLaserSon(msg.ch || 0.5, dep);
    const dist = impact.distanceTo(camera.position);
    if (dist < 30) E.secousse = Math.max(E.secousse, (1 - dist / 30) * 0.6 * (msg.ch || 0.5));
  });
  reseau.on('casse', (msg) => {
    if (!Array.isArray(msg.i)) return;
    for (const i of msg.i) E.cassees.add(i);
    majBoitesCassees();
    if (monde) monde.casser(msg.i);
  });
  reseau.on('repare', (msg) => {
    if (!Array.isArray(msg.i)) return;
    for (const i of msg.i) E.cassees.delete(i);
    majBoitesCassees();
    if (monde) monde.reparer(msg.i);
  });
  reseau.on('fumee', (msg) => {
    const p = new THREE.Vector3(msg.p[0], msg.p[1], msg.p[2]);
    effets.nuageFumee(p, msg.ms, msg.rayon || 5);
    son('fumigene', { position: p, portee: 2, vol: 0.8 });
  });
  reseau.on('grappin', (msg) => {
    if (msg.id === E.moiId) {
      if (msg.rate) {
        hud.toast('Trop loin : vise un mur ou un toit plus proche.');
        if (arme && arme.rentrerGrappin) arme.rentrerGrappin();
        E.gadgetPretA = performance.now() + 800;
        return;
      }
      const g = ARMES.find((a) => a.id === 'grappin') || {};
      E.grappin = { cible: new THREE.Vector3(msg.p[0], msg.p[1], msg.p[2]), debut: performance.now(), vitesse: g.vitesseTraction || 26 };
      son('grappin_accroche', { vol: 0.8 });
      son('grappin_corde', { vol: 0.6 });
      return;
    }
    const j = E.joueurs.get(msg.id);
    if (!j || !msg.p) return;
    E.cordesDistantes.set(msg.id, { cible: new THREE.Vector3(msg.p[0], msg.p[1], msg.p[2]), fin: performance.now() + 1800 });
    son('grappin_tir', { position: j.perso.groupe.position, vol: 0.7 });
  });
  reseau.on('soin', (msg) => {
    if (msg.id === E.moiId) return;
    const j = E.joueurs.get(msg.id);
    if (!j) return;
    if (j.perso.soigner) j.perso.soigner(msg.ms);
    son('soin', { position: j.perso.groupe.position, vol: 0.5 });
  });
  reseau.on('soinAnnule', () => { E.soinFin = 0; if (arme && arme.soigner) arme.soigner(0); });
  reseau.on('pv', (msg) => {
    E.pv = msg.pv;
    if (msg.soin) { E.soinFin = 0; son('soin_fini', { vol: 0.7 }); hud.toast('Vie rendue : +50 !'); }
    if (msg.admin) { son('soin_fini', { vol: 0.7 }); hud.toast('Vie au maximum'); }
    if (msg.elim) { son('soin_fini', { vol: 0.5 }); hud.toast('Élimination : vie à 100 % !'); }
  });
  // Pouvoirs de l'admin visibles par tous : géant, mini, invisible, traînée arc-en-ciel, aura dorée
  reseau.on('look', (msg) => {
    const j = E.joueurs.get(msg.id);
    if (!j) return;
    const etaitInvisible = j.look & 4;
    j.look = msg.l || 0;
    if (etaitInvisible && !(j.look & 4) && j.id !== E.moiId && j.perso) j.perso.groupe.visible = !!j.vivant;
  });
  // Frappe orbitale : la cible apparaît au sol, l'explosion arrive après le compte à rebours
  reseau.on('frappe', (msg) => {
    const p = new THREE.Vector3(msg.p[0], msg.p[1], msg.p[2]);
    effets.marqueFrappe(p, msg.dans || 1300);
    son('lobby_pret', { position: p, portee: 4, vol: 0.9 });
    if (msg.id === E.moiId) hud.toast('Frappe orbitale en approche…');
  });
  reseau.on('adminOk', (msg) => {
    const textes = {
      reparer: 'Carte réparée', 'bots+': `Bots en plus : +${msg.bonus}`, bots0: 'Plus de bots', botsNormal: 'Bots normaux',
    };
    if (textes[msg.a]) hud.toast(`${textes[msg.a]}`);
  });
  reseau.on('gadget', (msg) => {
    E.gadgetPretA = performance.now() + (msg.pretDans || 0);
    if (msg.rate) hud.toast('Pose la mine sur le sol, juste devant toi.');
    if (msg.plein) { hud.toast('Tu as déjà toute ta vie !'); if (arme && arme.soigner) arme.soigner(0); E.soinFin = 0; }
  });
  reseau.on('eblouir', (msg) => {
    E.eblouiJusqua = performance.now() + msg.ms;
    E.eblouiDuree = msg.ms;
    son('eblouissement', { vol: 0.6 });
  });
  reseau.on('ding', (msg) => {
    const j = E.joueurs.get(msg.id);
    const base = msg.id === E.moiId ? joueur.pos : (j && j.perso.groupe.position);
    if (!base) return;
    const p = new THREE.Vector3(base.x, base.y + 1.1, base.z);
    son('poele_touche', { position: p, vol: 0.9 });
    effets.impact(p, null, 'metal');
  });
  // Un autre joueur donne un coup de mêlée
  reseau.on('coup', (msg) => {
    const j = E.joueurs.get(msg.id);
    if (!j) return;
    j.protegeJusqua = 0;
    if (j.perso.frapper) j.perso.frapper(!!msg.dos);
    const w = ARMES[msg.a] || {};
    const pos = j.perso.groupe.position;
    son(SON_FRAPPE[w.id] || 'batte_coup', { position: pos, vol: 0.6 });
    if (msg.cible !== undefined) {
      son(SON_COUP[w.id] || 'touche', { position: pos, vol: 0.9 });
      if (msg.dos) son('dos_special', { position: pos, vol: 1 });
    }
  });
  reseau.on('attente', (msg) => {
    E.attenteFinA = msg.dans != null ? performance.now() + msg.dans : 0;
    E.prets = new Set(msg.prets || []);
    majSalleAttente();
  });
  reseau.on('equipementOk', (msg) => {
    if (msg.plusTard) hud.toast('Tes nouvelles armes seront là à ta prochaine apparition.');
  });
  reseau.on('pousse', (msg) => joueur.pousser(msg.v));

  reseau.on('touche', (msg) => {
    const cible = E.joueurs.get(msg.id);
    if (msg.protege) { hud.marqueur('protege'); return; }
    hud.marqueur(msg.elim ? 'elim' : msg.tete ? 'tete' : null);
    if (msg.elim) vibrer(0.3, 0.9, 140); else vibrer(0, 0.35, 50);
    if (msg.melee) son(SON_COUP[ARMES[E.arme].id] || 'touche', { vol: 0.9 });
    else son(msg.tete ? 'tete' : 'touche', { vol: 0.7, variation: 0 });
    if (msg.dos) { son('dos_special', { vol: 1 }); hud.annonce('COUP DANS LE DOS !', cible ? cible.nom : ''); }
    if (cible && cible.perso) {
      const p = positionDe(cible);
      effets.touche(new THREE.Vector3(p.x, p.y + (msg.tete ? 1.65 : 1.0), p.z), msg.tete);
      cible.perso.toucher();
    }
  });

  reseau.on('degats', (msg) => {
    E.pv = msg.pv;
    son('degats', { vol: 0.7 });
    E.secousse = Math.max(E.secousse, 0.25);
    vibrer(0.8, 0.5, 200);
    const tireur = E.joueurs.get(msg.de);
    if (tireur && tireur.id !== E.moiId) {
      const p = positionDe(tireur);
      const angle = Math.atan2(-(p.x - joueur.pos.x), -(p.z - joueur.pos.z)) - joueur.yaw;
      hud.degats(-angle);
    }
  });

  reseau.on('elim', (msg) => {
    const tueur = msg.tueur !== null ? E.joueurs.get(msg.tueur) : null;
    const victime = E.joueurs.get(msg.victime);
    if (tueur) tueur.kills = msg.kills;
    if (victime) victime.morts = msg.morts;
    E.scores = msg.scores;
    hud.elimination({
      tueur, victime, tete: msg.tete, arme: msg.dos ? 'Dans le dos' : msg.brule ? 'Brûlure' : (ARMES[msg.a] ? ARMES[msg.a].nom : ''),
      moi: msg.tueur === E.moiId || msg.victime === E.moiId,
    });
    if (!victime) return;
    if (victime.id === E.moiId) { arreterMaDanse(false); ouvrirMenuDanses(false); } else arreterDanseDe(victime);
    victime.vivant = false;

    // Le ragdoll ! (une explosion l'envoie beaucoup plus loin)
    const impulsion = new THREE.Vector3(msg.imp[0], msg.imp[1], msg.imp[2]);
    const options = {
      impulsion, boites: carte.boites, tete: !!msg.tete, duree: reglages.fun.dureeRagdollSecondes,
      force: reglages.fun.forceRagdoll * (msg.expl ? 1.7 : ARMES[msg.a] && ARMES[msg.a].id === 'batte' ? 1.6 : 1),
    };
    let r;
    if (victime.id === E.moiId) {
      const p = victime.perso;
      p.groupe.position.copy(joueur.pos);
      p.groupe.rotation.y = joueur.yaw;
      p.animer(0, { vitesse: 0, enLAir: false, pitch: joueur.pitch });
      r = new Ragdoll(scene, p, { ...options, vitesse: joueur.vit.clone() });
      E.monRagdoll = r;
      E.angleCamMort = joueur.yaw;
      joueur.vivant = false;
      E.tirEnfonce = false;
      E.viser = false;
      E.rechargeFin = 0;
      E.soinFin = 0;
      finGrappin();
      E.reapparitionA = performance.now() + msg.dans;
      E.tueurNom = tueur && tueur !== victime ? tueur.nom : '';
      finCameraTueur();
      E.mortA = performance.now();
      if (tueur && tueur !== victime && tueur.perso && tueur.vivant) {
        E.cameraTueur = { id: tueur.id, pos: tueur.perso.groupe.position.clone(), yaw: tueur.perso.groupe.rotation.y, vers: joueur.pos.clone() };
      }
      if (arme) arme.visible = false;
      hud.lunette(false);
    } else {
      r = new Ragdoll(scene, victime.perso, { ...options, vitesse: victime.vitesse.clone() });
      victime.perso.groupe.visible = false;
    }
    r.style = victime.style;
    r.equipe = victime.equipe;
    E.ragdolls.push(r);

    if (msg.tueur === E.moiId && msg.victime !== E.moiId) {
      son('elimination', { vol: 0.8, variation: 0 });
      hud.annonce(SERIES[msg.serie] || (msg.serie >= 5 ? 'INARRÊTABLE !' : 'ÉLIMINATION !'), victime.nom);
    }
  });

  reseau.on('debut', (msg) => {
    const premiere = E.etat === 'attente';
    E.etat = 'jeu';
    E.attenteFinA = 0;
    // On était dans la salle d'attente : sur tablette (ou à la manette) on entre directement dans la partie,
    // sur ordinateur le menu propose "Cliquer pour jouer" (il faut un clic pour capturer la souris).
    if (salle.ouvert && !choixArmes.ouvert && (modeTactile() || commandes.saisie === 'manette')) { joueur.actif = true; majTactile(); }
    majMenus();
    son('lobby_depart', { vol: 0.8, variation: 0 });
    E.scores = msg.scores;
    E.finA = performance.now() + msg.finDans;
    for (const j of E.joueurs.values()) { j.kills = 0; j.morts = 0; }
    hud.fin(false);
    hud.annonce(premiere ? 'C\'EST PARTI !' : 'NOUVELLE MANCHE', 'Bonne chance !');
  });

  reseau.on('fin', (msg) => {
    E.etat = 'fin';
    E.scores = msg.scores;
    E.tirEnfonce = false;
    E.redemarrageA = performance.now() + msg.redemarrageDans;
    let titre;
    let couleur;
    let gagne = false;
    const g = msg.gagnant;
    if (E.mode === 'equipes') {
      if (!g || g.egalite) titre = 'ÉGALITÉ !';
      else {
        titre = `VICTOIRE DES ${NOMS_EQUIPES[g.equipe].toUpperCase()} !`;
        couleur = COULEURS_EQUIPES[g.equipe];
        gagne = moi() && moi().equipe === g.equipe;
      }
    } else if (g) {
      gagne = g.id === E.moiId;
      titre = gagne ? 'TU AS GAGNÉ !' : `${g.nom} GAGNE !`;
    }
    if (gagne) son('victoire', { vol: 0.8, variation: 0 });
    const tableau = hud.tableau(msg.classement, E.mode, E.moiId);
    // Classé : on gagne (ou perd) des points de rang selon sa place
    const place = msg.classement.findIndex((c) => c.id === E.moiId) + 1;
    if (E.mode === 'classe' && place > 0) {
      const r = E.resultatClasse || resultat(E.pointsClasse || 0, E.pointsClasse || 0); // (reçu juste avant, message « rang »)
      E.resultatClasse = null;
      if (msg.niveau) E.niveauBots = msg.niveau;
      majBadgeClasse();
      hud.fin(true, { titre, couleur, contenu: el('div', {}, resultatClasse(place, r, msg.niveau), tableau) });
      return;
    }
    hud.fin(true, { titre, couleur, contenu: tableau });
  });
  // Bloc « rang » de l'écran de fin (classé)
  function resultatClasse(place, { gain, avant, apres }, niveauBots) {
    const monte = apres.niveau > avant.niveau;
    const descend = apres.niveau < avant.niveau;
    const bloc = el('div', { class: `resultat-classe${gain > 0 ? ' gagne' : gain < 0 ? ' perdu' : ''}` },
      el('div', { class: 'rang-embleme' }, icone('rang')),
      el('div', { class: 'rang-infos' },
        el('div', { class: 'rang-ligne' },
          el('b', { class: 'rang-nom', text: apres.nom }),
          el('span', { class: 'rang-gain', text: `${gain > 0 ? '+' : ''}${gain} pts` })),
        barreRang(apres.progres),
        el('small', {
          text: `${place}${place === 1 ? 're' : 'e'} place · niveau ${apres.niveau}${monte ? ' : tu montes de niveau !' : descend ? ' : tu descends d\'un niveau' : ''}`
            + (niveauBots ? ` · prochaine manche : bots niveau ${niveauBots}` : ''),
        })));
    bloc.style.setProperty('--couleur-rang', apres.couleur);
    return bloc;
  }

  reseau.on('munitions', (msg) => {
    if (typeof msg.a === 'number') E.munitions[msg.a] = msg.n;
  });

  reseau.on('ping', (msg) => {
    reseau.envoyer({ t: 'pong', s: msg.s });
    E.rtt = msg.rtt;
  });

  let dejaConnecte = false;
  reseau.on('ouvert', () => { dejaConnecte = true; });
  reseau.on('ferme', (msg) => {
    if (msg.code === 4000) return message('Jeu ouvert ailleurs', 'Le jeu est ouvert dans un autre onglet. Ferme celui-ci ou recharge la page.', true);
    if (msg.code === 4001) { location.href = '/connexion'; return undefined; }
    if (!dejaConnecte) return message('Connexion impossible', 'Impossible de se connecter au jeu. Es-tu bien connecté au site ?', true);
    return message('Connexion perdue', 'La connexion avec le serveur a été coupée.', true);
  });

  // ---------- Hall ----------
  let listeCartesAffichee = '';
  function majCarteChoisie() {
    const c = E.cartes.find((x) => x.id === E.carteChoisie);
    $('carte-choisie').textContent = c ? `Carte choisie : ${c.nom}` : '';
  }
  function afficherCartes(liste) {
    // On ne redessine les cartes que si la liste a changé (sinon un toucher pourrait se perdre).
    const cle = JSON.stringify(liste);
    if (cle === listeCartesAffichee) return;
    listeCartesAffichee = cle;
    E.cartes = liste;
    const box = $('choix-cartes');
    if (!liste.some((c) => c.id === E.carteChoisie) && liste.length) E.carteChoisie = liste[0].id;
    const boutons = liste.map((c) => el('button', {
      class: 'choix-carte', type: 'button', role: 'radio', 'aria-checked': c.id === E.carteChoisie ? 'true' : 'false',
      onclick: () => {
        demarrerSons();
        son('clic');
        musiqueMenu(true);
        E.carteChoisie = c.id;
        boutons.forEach((b, i) => b.setAttribute('aria-checked', liste[i].id === c.id ? 'true' : 'false'));
        majCarteChoisie();
        // aperçu de la carte en fond (pas pour les cartes faites dans l'éditeur : pas de fichier à télécharger)
        if (!E.enPartie && !c.perso) chargerCarte(c.id).catch(() => {});
      },
    }, el('b', { text: c.nom }), el('span', { text: c.description })));
    box.replaceChildren(...boutons);
    majCarteChoisie();
  }

  function afficherSalons(liste) {
    const ul = $('salons');
    ul.replaceChildren();
    if (!liste.length) {
      ul.append(el('li', { class: 'vide', text: 'Aucune partie en cours. Crée la première !' }));
      return;
    }
    for (const s of liste) {
      const plein = s.n >= s.max;
      ul.append(el('li', {},
        el('span', { class: 'code', text: s.code }),
        el('div', { class: 'infos' },
          el('div', {}, el('span', { class: 'nom-carte', text: s.nomCarte || '' }), ` · ${s.n} / ${s.max} joueurs`),
          el('div', { class: 'mode', text: s.mode === 'equipes' ? 'Équipes Bleus vs Rouges' : s.mode === 'classe' ? `Classé · bots niveau ${s.niveau || 1}` : 'Chacun pour soi' })),
        el('button', {
          class: 'btn', type: 'button', disabled: plein, text: plein ? 'Pleine' : 'Rejoindre',
          onclick: () => { demarrerSons(); son('clic'); reseau.envoyer({ t: 'rejoindre', code: s.code }); },
        })));
    }
  }
  for (const b of document.querySelectorAll('[data-mode]')) {
    b.addEventListener('click', () => {
      demarrerSons();
      son('clic');
      $('hall-erreur').textContent = '';
      const mode = b.dataset.mode;
      // (classé : le serveur lit ton rang lui-même, les bots commencent à ton niveau)
      reseau.envoyer({ t: 'creer', mode, carte: E.carteChoisie });
    });
  }

  // ---------- Mode classé ----------
  // Le badge du rang, dans le panneau « Jouer »
  function majBadgeClasse() {
    const r = rang(E.pointsClasse);
    const box = $('badge-classe');
    box.style.setProperty('--couleur-rang', r.couleur);
    box.replaceChildren(
      el('div', { class: 'rang-embleme' }, icone('rang')),
      el('div', { class: 'rang-infos' },
        el('div', { class: 'rang-ligne' }, el('b', { class: 'rang-nom', text: r.nom }), el('span', { class: 'rang-niveau', text: `Niveau ${r.niveau}` })),
        barreRang(r.progres),
        el('small', { text: r.max ? `${r.points} points · rang maximum !` : `${r.points} points · encore ${r.reste} pour le niveau ${r.niveau + 1}` }),
        el('small', { class: 'rang-aide', text: 'Des bots complètent la partie et deviennent de plus en plus forts. Finis dans les 3 premiers pour monter !' })));
  }
  // (la page interdit les attributs style : on passe par element.style)
  function barreRang(progres) {
    const i = el('i');
    i.style.width = `${Math.round(progres * 100)}%`;
    return el('div', { class: 'rang-barre' }, i);
  }
  majBadgeClasse();
  // En partie : « Classé · bots niveau N » sous le score
  function majClasseHud() {
    const b = $('classe-hud');
    b.hidden = !(E.enPartie && E.mode === 'classe');
    if (!b.hidden) b.querySelector('span').textContent = `Classé · bots niveau ${E.niveauBots}`;
  }
  function majModePause() {
    const m = moi();
    $('pause-mode').textContent = `${(carte && carte.nom) || ''} · ${E.mode === 'equipes' && m
      ? `Équipes · tu es chez les ${NOMS_EQUIPES[m.equipe]}` : E.mode === 'classe' ? `Classé · bots niveau ${E.niveauBots}` : 'Chacun pour soi'}`;
  }
  reseau.on('niveauBots', (msg) => {
    E.niveauBots = msg.n;
    majClasseHud();
    majModePause();
    hud.toast(`Les bots passent au niveau ${msg.n} : ils visent mieux et réagissent plus vite !`);
    son('lobby_pret', { vol: 0.6, variation: 0 });
  });
  $('form-code').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = $('code').value.trim().toUpperCase();
    if (!/^[A-Z]{4}$/.test(code)) { $('hall-erreur').textContent = 'Le code fait 4 lettres.'; return; }
    demarrerSons();
    reseau.envoyer({ t: 'rejoindre', code });
  });
  // Premier clic dans le hall : on lance la musique (les navigateurs l'exigent).
  $('hall').addEventListener('pointerdown', () => { demarrerSons(); if (!E.enPartie) musiqueMenu(true); });

  // ---------- Menu pause ----------
  $('btn-quitter').addEventListener('click', () => {
    reseau.envoyer({ t: 'quitter' });
    sortirPartie();
  });
  $('btn-inviter').addEventListener('click', () => {
    const ul = $('liste-amis');
    ul.hidden = !ul.hidden;
    if (!ul.hidden) remplirInvitations(ul);
  });
  $('btn-armes-pause').addEventListener('click', () => { son('clic'); demanderEquipement(false); });
  $('btn-changer-armes').addEventListener('click', () => { son('clic'); demanderEquipement(false); });
  // Liste des amis en ligne, avec un bouton "Inviter" (menu pause et salle d'attente)
  async function remplirInvitations(ul) {
    if (!window.Plateforme) { ul.replaceChildren(el('li', { text: 'Invitations indisponibles.' })); return; }
    ul.replaceChildren(el('li', { text: 'Chargement…' }));
    try {
      const { friends } = await Plateforme.amis();
      const enLigne = friends.filter((f) => f.online);
      ul.replaceChildren();
      if (!enLigne.length) ul.append(el('li', { text: friends.length ? 'Aucun ami en ligne pour l\'instant.' : 'Tu n\'as pas encore d\'amis sur le site.' }));
      for (const f of enLigne) {
        ul.append(el('li', {}, el('span', { text: f.username }),
          el('button', {
            class: 'btn', type: 'button', text: 'Inviter',
            onclick: (ev) => {
              ev.target.disabled = true;
              Plateforme.inviter(f.id, 'fps', E.code)
                .then(() => { ev.target.textContent = 'Invité'; })
                .catch((err) => { ev.target.disabled = false; hud.toast(err.message); });
            },
          })));
      }
    } catch (err) {
      ul.replaceChildren(el('li', { text: err.message }));
    }
  }

  // ---------- Amis en ligne (dans le hall) ----------
  async function majAmisHall() {
    const ul = $('amis-hall');
    if (!ul || E.enPartie) return;
    if (!window.Plateforme) { ul.replaceChildren(el('li', { class: 'vide', text: 'Liste des amis indisponible.' })); return; }
    let friends;
    try { ({ friends } = await Plateforme.amis()); } catch {
      ul.replaceChildren(el('li', { class: 'vide', text: 'Liste des amis indisponible.' }));
      return;
    }
    const enLigne = friends.filter((f) => f.online);
    ul.replaceChildren();
    if (!enLigne.length) {
      ul.append(el('li', { class: 'vide', text: friends.length ? 'Aucun ami en ligne pour l\'instant.' : 'Ajoute des amis sur le site pour jouer ensemble !' }));
      return;
    }
    for (const f of enLigne) {
      const a = f.activity;
      const partie = a && a.game === 'fps' && a.joinable && a.room ? a.room : null;
      ul.append(el('li', {},
        el('span', { class: 'point' }),
        el('span', { class: 'nom' }, f.username,
          el('span', { class: `statut${a ? ' joue' : ''}`, text: partie ? `Partie ${partie}` : a ? `Joue à ${a.gameName || a.game}` : 'En ligne' })),
        partie ? el('button', {
          class: 'btn', type: 'button', text: 'Rejoindre',
          onclick: () => { demarrerSons(); son('clic'); reseau.envoyer({ t: 'rejoindre', code: partie }); },
        }) : null));
    }
  }
  majAmisHall();
  setInterval(() => { if (!E.enPartie && !$('hall').hidden && !document.hidden) majAmisHall(); }, 20000);

  // ---------- Réglages ----------
  const champs = {
    sensibilite: { input: $('r-sensibilite'), out: $('o-sensibilite'), fmt: (v) => `${Number(v).toFixed(2)}` },
    volume: { input: $('r-volume'), out: $('o-volume'), fmt: (v) => `${Math.round(v * 100)} %` },
    musique: { input: $('r-musique'), out: $('o-musique'), fmt: (v) => `${Math.round(v * 100)} %` },
    fov: { input: $('r-fov'), out: $('o-fov'), fmt: (v) => `${v}°` },
    sensibiliteTactile: { input: $('r-sensibilite-tactile'), out: $('o-sensibilite-tactile'), fmt: (v) => `${Number(v).toFixed(2)}` },
    sensibiliteManette: { input: $('r-sensibilite-manette'), out: $('o-sensibilite-manette'), fmt: (v) => `${Number(v).toFixed(2)}` },
  };
  for (const [cle, c] of Object.entries(champs)) {
    c.input.value = prefs[cle];
    c.out.textContent = c.fmt(prefs[cle]);
    c.input.addEventListener('input', () => {
      prefs[cle] = Number(c.input.value);
      c.out.textContent = c.fmt(prefs[cle]);
      reglerVolume(prefs.volume);
      reglerMusique(prefs.musique);
      sauverPrefs();
    });
  }
  $('r-ombres').checked = prefs.ombres;
  // manette et aide à la visée
  for (const [id, cle] of [['r-inverser', 'inverserY'], ['r-vibrations', 'vibrations']]) {
    $(id).checked = !!prefs[cle];
    $(id).addEventListener('change', () => { prefs[cle] = $(id).checked; sauverPrefs(); });
  }
  $('r-aide-visee').value = FORCES_AIDE[prefs.aideVisee] === undefined ? 'normale' : prefs.aideVisee;
  $('r-aide-visee').addEventListener('change', () => { prefs.aideVisee = $('r-aide-visee').value; sauverPrefs(); });
  majEtatManette();
  remplirAides();
  appliquerMode();
  $('r-ombres').addEventListener('change', () => {
    prefs.ombres = $('r-ombres').checked;
    $('reglages-note').hidden = false;
    sauverPrefs();
  });
  $('r-armes').value = prefs.armes;
  $('r-armes').addEventListener('change', () => {
    prefs.armes = $('r-armes').value;
    sauverPrefs();
    choisirStyleArmes(prefs.armes).then(() => { if (!E.enPartie) accueil.majStyle(monStyle()); });
    $('armes-note').hidden = !E.enPartie;
  });
  $('r-commandes').value = prefs.commandes;
  $('r-commandes').addEventListener('change', () => {
    prefs.commandes = $('r-commandes').value;
    sauverPrefs();
    if (E.enPartie && joueur.actif) mettreEnPause(); // on repart proprement avec les nouvelles commandes
    appliquerMode();
  });
  $('btn-disposition').addEventListener('click', editerDisposition);
  $('btn-disposition-pause').addEventListener('click', editerDisposition);
  const ouvrirReglages = () => { $('reglages').hidden = false; };
  $('btn-reglages').addEventListener('click', ouvrirReglages);
  $('btn-reglages-pause').addEventListener('click', ouvrirReglages);
  $('btn-fermer-reglages').addEventListener('click', () => { $('reglages').hidden = true; });

  // ---------- Invitations reçues ----------
  if (window.Plateforme) {
    Plateforme.connecter();
    Plateforme.on('invite', (msg) => {
      hud.toast(`${msg.from.username} t'invite dans ${msg.game.name}`, {
        texte: 'Rejoindre',
        action: () => { if (typeof msg.url === 'string' && msg.url.startsWith('/')) location.href = msg.url; },
      });
    });
    E.salleDemandee = Plateforme.salleDansAdresse();
  }
  // Éditeur de cartes : « Tester » renvoie ici avec ?creer=<id> pour lancer une partie sur la carte.
  {
    const m = /[?&]creer=([a-z0-9]{2,20})/i.exec(location.search);
    if (m) { E.carteATester = m[1]; history.replaceState(null, '', location.pathname); }
  }

  // ---------- Salle d'attente / échauffement ----------
  if (!document.querySelector('link[href="partie.css"]')) document.head.append(el('link', { rel: 'stylesheet', href: 'partie.css' }));
  const bandeau = el('div', { id: 'bandeau-attente', hidden: true });
  const eblouissement = el('div', { id: 'eblouissement' });
  document.body.append(bandeau, eblouissement);
  let dernierCompte = -1;
  function majBandeau(now) {
    const attente = E.enPartie && E.etat === 'attente';
    bandeau.hidden = !attente;
    if (!attente) return;
    if (E.attenteFinA) {
      const s = Math.max(0, Math.ceil((E.attenteFinA - now) / 1000));
      bandeau.textContent = `Échauffement : la partie commence dans ${s} s`;
      if (s <= 5 && s !== dernierCompte && s > 0) son('lobby_pret', { vol: 0.6, variation: 0 });
      dernierCompte = s;
    } else {
      const touche = commandes.saisie === 'manette' ? commandes.libelle('menu') : modeTactile() ? 'Menu' : 'Échap';
      bandeau.textContent = E.mode === 'classe' ? 'Classé : choisis tes armes, la partie démarre tout de suite'
        : `Échauffement : en attente d'un 2e joueur… (${touche} : salle d'attente)`;
    }
  }

  // ---------- Événements du joueur (sons de pas, saut, trampoline...) ----------
  joueur.surEvenement = (type) => {
    if (type === 'saut') son('saut', { vol: 0.4 });
    else if (type === 'atterrir') son('atterrissage', { vol: 0.5 });
    else if (type === 'pas') son(`pas_${1 + Math.floor(Math.random() * 4)}`, { vol: 0.35 });
    else if (type === 'eau' || type === 'eau_pas') son('eau', { vol: type === 'eau' ? 0.6 : 0.25 });
    else if (type === 'trampoline') {
      son('trampoline', { vol: 0.7 });
      effets.explosion(joueur.pos.clone().setY(joueur.pos.y + 0.2), ['#39e0ff', '#b8f6ff'], { nombre: 14, force: 3, haut: 2, taille: 0.08, vie: 0.5 });
    }
  };

  // Déplacement de côté (-1 gauche, +1 droite) pour pencher l'arme
  function lateralDe() {
    const c = Math.cos(joueur.yaw);
    const s = Math.sin(joueur.yaw);
    return (joueur.vit.x * c - joueur.vit.z * s) / reglages.joueur.vitesse;
  }

  // ---------- Boucle principale (environ 60 fois par seconde) ----------
  let avant = performance.now();
  let images = 0;
  let chronoImages = avant;
  let fps = 0;
  const _v = new THREE.Vector3();

  // La caméra tourne doucement autour de la carte.
  function orbiteCarte(now) {
    const a = now / 14000;
    const R = (carte.taille || 32) * 1.2;
    if (camera.fov !== prefs.fov) { camera.fov = prefs.fov; camera.updateProjectionMatrix(); }
    camera.position.set(Math.sin(a) * R, R * 0.55, Math.cos(a) * R);
    camera.lookAt(0, 2, 0);
  }

  function boucle(now) {
    requestAnimationFrame(boucle);
    const dt = Math.min(0.05, (now - avant) / 1000);
    avant = now;
    images++;
    if (now - chronoImages > 1000) { fps = images; images = 0; chronoImages = now; }
    // Manette : lue à chaque image (dans les menus, la croix ou le stick gauche passe d'un bouton à l'autre)
    const pad = commandes.majManette();
    if (pad.connecte && !commandes.capture && !(E.enPartie && joueur.actif)) Menus.maj(pad, now);
    if (!carte) return;

    monde.animer(dt);
    effets.maj(dt);

    // Projectiles en vol (même physique que le serveur ; les grenades se recalent sur lui)
    let fuseeVisible = null;
    for (const [id, pr] of E.projectiles) {
      const w = ARMES[pr.a] || {};
      const m = pr.mesh;
      if (pr.type === 'mine') {
        // posée au sol : la petite lumière clignote une fois armée (au bout d'une seconde) ; elle reste jusqu'à son explosion
        const armee = now - pr.nee > 1000;
        if (armee && !pr.armee) { pr.armee = true; son('mine_armee', { position: m.position, vol: 0.6 }); }
        if (m.userData.lumiere) m.userData.lumiere.visible = armee && Math.floor(now / 300) % 2 === 0;
        continue;
      }
      if (m.userData.lumiere) m.userData.lumiere.visible = Math.floor(now / 150) % 2 === 0; // balise des météores
      if (pr.rebondit && pr.cible) {
        m.position.lerp(pr.cible, Math.min(1, dt * 14));
        m.rotation.x += dt * 8;
      } else {
        if (pr.type !== 'roquette') pr.v.y -= (w.gravite || 0) * dt;
        m.position.addScaledVector(pr.v, dt);
        if (!pr.rebondit && pr.v.lengthSq() > 0) m.quaternion.setFromUnitVectors(AXE_MOINS_Z, _v.copy(pr.v).normalize());
        if (pr.rebondit) { m.rotation.x += dt * 8; if (m.position.y < 0.1) { m.position.y = 0.1; pr.v.multiplyScalar(0.5); pr.v.y = Math.abs(pr.v.y) * 0.4; } }
      }
      if (pr.type === 'roquette') {
        _v.copy(pr.v).normalize().multiplyScalar(-0.3).add(m.position);
        effets.particule(_v, new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.3, (Math.random() - 0.5) * 0.4), '#bdbdbd',
          { taille: 0.16, vie: 0.9, gravite: -0.05, freine: 2, grandit: 0.35 });
        effets.particule(_v, new THREE.Vector3(0, 0, 0), Math.random() < 0.5 ? '#ffb347' : '#fff1a8', { taille: 0.09, vie: 0.12, gravite: 0 });
      } else if (pr.type === 'fusee') {
        fuseeVisible = m.position;
        effets.particule(m.position, new THREE.Vector3((Math.random() - 0.5), Math.random(), (Math.random() - 0.5)), Math.random() < 0.5 ? '#ff5533' : '#ffd27a', { taille: 0.06, vie: 0.3, gravite: 0.3 });
      } else if (pr.type === 'fumigene' && Math.random() < 0.3) {
        effets.particule(m.position, new THREE.Vector3(0, 0.6, 0), '#c8c8c8', { taille: 0.08, vie: 0.6, gravite: -0.05, grandit: 0.2 });
      } else if (pr.type === 'plasma') {
        effets.particule(m.position, _v.set((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.3), Math.random() < 0.5 ? '#39e0ff' : '#b066ff', { taille: 0.05, vie: 0.25, gravite: 0 });
      } else if (pr.type === 'artifice') {
        effets.particule(m.position, _v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5), ['#ffd23f', '#ff3b5c', '#3fa9ff', '#ffffff'][(Math.random() * 4) | 0], { taille: 0.05, vie: 0.5, gravite: 0.4 });
      } else if (pr.type === 'trou_noir') {
        if (m.userData.anneau) m.userData.anneau.rotation.z += dt * 6;
        effets.particule(m.position, _v.set((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6), Math.random() < 0.5 ? '#9a4dff' : '#2a1040', { taille: 0.08, vie: 0.4, gravite: 0 });
      } else if (pr.type === 'obus' && Math.random() < 0.6) {
        effets.particule(m.position, _v.set(0, 0.3, 0), '#c8c8c8', { taille: 0.07, vie: 0.5, gravite: -0.05, grandit: 0.2 });
      }
      if (now - pr.nee > 8000) { m.removeFromParent(); E.projectiles.delete(id); }
    }
    effets.eclairerFusee(fuseeVisible);
    // Joueurs qui flottent (rayon anti-gravité) : étincelles violettes autour d'eux
    for (const [id, fin] of E.levitations) {
      if (now > fin) { E.levitations.delete(id); continue; }
      const j = E.joueurs.get(id);
      const base = id === E.moiId ? joueur.pos : (j && j.perso && j.vivant ? j.perso.groupe.position : null);
      if (base) { effets.auraLev(base); effets.auraLev(base); }
    }
    // Près d'un trou noir, la caméra tremble
    for (const z of effets.zonesActives()) {
      if (z.type !== 'trou_noir') continue;
      const portee = z.rayon * 1.6;
      const d = z.pos.distanceTo(camera.position);
      if (d < portee) E.secousse = Math.max(E.secousse, (1 - d / portee) * 0.45);
    }
    // Carreaux plantés dans les murs : ils disparaissent au bout de quelques secondes
    E.carreauxPlantes = E.carreauxPlantes.filter((c) => {
      if (now < c.fin) return true;
      c.mesh.removeFromParent();
      return false;
    });
    // Cordes de grappin des autres joueurs
    for (const [id, c] of E.cordesDistantes) {
      const j = E.joueurs.get(id);
      if (!j || now > c.fin || !j.vivant) { effets.enleverCorde(id); E.cordesDistantes.delete(id); continue; }
      effets.corde(id, j.perso.boutDuCanon(_v), c.cible);
    }

    majLaserFx(dt, now);
    majPouvoirsEcran(now);
    if (!E.enPartie) {
      // Dans le hall : mon personnage en grand. Panneau "Jouer" ouvert : la caméra tourne autour de la carte choisie.
      if (!$('hall').classList.contains('jouer-ouvert')) { accueil.dessiner(dt); return; }
      orbiteCarte(now);
      renderer.render(scene, camera);
      return;
    }

    // --- Mon joueur ---
    const w = ARMES[E.arme];
    if (!w.prechauffeMs || !joueur.vivant) E.prechauffe = 0; // (minigun : canons qui tournent)
    if (arme && arme.prechauffer) arme.prechauffer(E.prechauffe || 0);
    majMoteurMinigun(E.prechauffe || 0);
    joueur.multVitesse = (1 - (1 - w.vitesseVisee) * E.visee) * (w.vitesseArme || 1) * (E.maDanse && E.maDanse.marcher ? E.maDanse.vitesse : 1)
      * (pouvoir('vitesse') ? 2.2 : 1); // admin : super vitesse
    // Grappin : on est tiré tout droit vers le point accroché
    if (E.grappin) {
      const g = E.grappin;
      const vers = _v.set(g.cible.x - joueur.pos.x, g.cible.y - (joueur.pos.y + 1.62), g.cible.z - joueur.pos.z);
      const dist = vers.length();
      if (!joueur.vivant || dist < 1.3 || now - g.debut > 2600) {
        finGrappin();
        joueur.vit.multiplyScalar(0.45);
      } else {
        joueur.vit.copy(vers.multiplyScalar(g.vitesse / dist));
        joueur.auSol = false;
      }
    }
    const zoom = 1 + (w.zoom - 1) * E.visee;
    joueur.sensibilite = prefs.sensibilite / zoom; // moins sensible en zoomant
    const manette = joueur.actif && pad.connecte; // stick gauche : avancer
    joueur.analogiqueManette.cote = manette ? pad.gx : 0;
    joueur.analogiqueManette.avant = manette ? -pad.gy : 0;
    joueur.maj(dt);
    if (joueur.vivant) {
      // Le recul se rattrape en partie tout seul
      if (E.reculARattraper > 0) {
        const r = Math.min(E.reculARattraper, dt * 0.35);
        joueur.pitch -= r;
        E.reculARattraper -= r;
      }
      if (joueur.actif) {
        if (E.maDanse) aide.ralenti = 1; else aiderVisee(dt, now, w, pad); // aide à la visée (manette, tablette)
        if (pad.connecte) regarderManette(dt, pad, zoom); // stick droit : regarder
      }
      if (joueur.actif && pouvoir('viseeAuto') && (E.viser || E.tirEnfonce || E.tirDemande)) viseeAuto(dt, E.tirEnfonce || E.tirDemande);
      // Ma danse s'arrête dès que je bouge (sauf danse où l'on peut avancer), saute, tire ou vise
      const sauter = commandes.tenue('sauter') || joueur.sautTactile || !joueur.auSol;
      if (E.maDanse && ((E.maDanse.marcher ? sauter : veutBouger() || !joueur.auSol) || E.tirEnfonce || E.tirDemande || E.viser)) arreterMaDanse();
      joueur.appliquerCamera(camera);
      if (pouvoir('troisieme') && !E.maDanse) cameraTroisieme(dt); else finTroisieme();
      if (E.maDanse) {
        cameraDanse();
        const m = moi();
        if (m) {
          m.perso.groupe.position.copy(joueur.pos);
          m.perso.groupe.rotation.y = E.maDanse.marcher ? joueur.yaw : E.maDanse.yaw;
          m.perso.animer(dt, { vitesse: joueur.vitesseHorizontale(), enLAir: false, pitch: 0 });
          animerDanse(m.perso, E.maDanse, now, null);
        }
      }
      // Dans la lunette, la visée bouge un peu (la respiration)
      if (arme && arme.cache) {
        camera.rotation.x += Math.sin(now * 0.0009) * 0.0022;
        camera.rotation.y += Math.sin(now * 0.0006) * 0.0028;
      }
      if (E.secousse > 0) {
        E.secousse = Math.max(0, E.secousse - dt * 1.5);
        camera.rotation.z = Math.sin(now * 0.07) * E.secousse * 0.05;
        camera.rotation.x += Math.sin(now * 0.09) * E.secousse * 0.02;
      }
      // Laser en charge : plus il est chargé, plus l'écran tremble
      if (E.chargeLaser > 0) {
        const c2 = E.chargeLaser * E.chargeLaser;
        camera.rotation.x += (Math.sin(now * 0.091) * 0.6 + (Math.random() - 0.5)) * c2 * 0.011;
        camera.rotation.y += (Math.sin(now * 0.077) * 0.6 + (Math.random() - 0.5)) * c2 * 0.011;
        camera.rotation.z += (Math.random() - 0.5) * c2 * 0.03;
      }
      if (now - E.dernierEnvoi > 33) {
        E.dernierEnvoi = now;
        reseau.envoyer({ t: 'm', p: tableau(joueur.pos), r: [r3(joueur.yaw), r3(joueur.pitch)], v: E.vie, z: E.visee > 0.5 ? 1 : 0, a: joueur.actif ? 1 : 0 });
      }
      // Fin d'un rechargement
      if (E.rechargeFin && now >= E.rechargeFin) finRechargement(now);
      // Tir : en continu pour les armes automatiques, un tir par clic sinon, 3 balles pour la rafale
      const peutAgir = joueur.actif && E.equipement && E.etat !== 'fin' && now >= E.pretA && !(E.soinFin > now);
      const cadence = w.cadenceMs * (pouvoir('tirRapide') ? 0.3 : 1); // admin : tir ultra rapide
      if (w.type === 'laser') {
        // Laser : on charge en gardant le tir enfoncé, on l'envoie en relâchant (ou à pleine charge).
        if (peutAgir && E.tirEnfonce) {
          E.chargeLaser = Math.min(1, (E.chargeLaser || 0) + dt * 1000 / (w.chargeMaxMs || 1500));
          if (arme && arme.chargerLaser) arme.chargerLaser(E.chargeLaser);
        } else if (E.chargeLaser > 0) {
          if (peutAgir && now - E.dernierTir >= cadence) tirerLaser(now, E.chargeLaser);
          E.chargeLaser = 0;
          if (arme && arme.chargerLaser) arme.chargerLaser(0);
        }
      } else if (w.rafale) {
        if (E.tirDemande && !E.rafaleReste && now >= E.prochaineRafale) E.rafaleReste = w.rafale;
        if (E.rafaleReste && peutAgir && now - E.dernierTir >= cadence && !E.rechargeFin) {
          if (E.munitions[E.arme] > 0) {
            tirer(now);
            E.rafaleReste--;
            if (!E.rafaleReste) E.prochaineRafale = now + w.delaiRafaleMs;
          } else { E.rafaleReste = 0; E.dernierTir = now; son('vide', { vol: 0.5 }); recharger(); }
        }
      } else {
        // Minigun : les canons doivent d'abord tourner assez vite (préchauffage)
        if (w.prechauffeMs) E.prechauffe = Math.max(0, Math.min(1, (E.prechauffe || 0) + ((peutAgir && E.tirEnfonce && !E.rechargeFin) ? 1 : -0.6) * dt * 1000 / w.prechauffeMs));
        const veutTirer = (w.automatique ? E.tirEnfonce : E.tirDemande) && (!w.prechauffeMs || E.prechauffe >= 1);
        const sansMunitions = w.type === 'melee' || w.type === 'gadget' || w.type === 'tesla';
        if (veutTirer && peutAgir && now - E.dernierTir >= cadence
            && (sansMunitions || !E.rechargeFin || (w.parCartouche && E.munitions[E.arme] > 0))) {
          if (sansMunitions || E.munitions[E.arme] > 0) tirer(now);
          else { E.dernierTir = now; son('vide', { vol: 0.5 }); recharger(); }
        }
      }
      E.tirDemande = false;
      if (now - E.dernierTir > w.cadenceMs + 60) E.chaleur = Math.max(0, E.chaleur - dt * w.dispersion.max * 2);
    } else if (E.monRagdoll) {
      const ecoule = (now - E.mortA) / 1000;
      if (E.cameraTueur && ecoule > 1.3) cameraTueur(E.cameraTueur, ecoule, dt, now); // puis on va voir le tueur
      else {
        // Éliminé : la caméra tourne autour de mon ragdoll
        E.angleCamMort += dt * 0.4;
        const c = E.monRagdoll.centre();
        _v.set(c.x + Math.sin(E.angleCamMort) * 4.5, c.y + 2.5, c.z + Math.cos(E.angleCamMort) * 4.5);
        camera.position.lerp(_v, Math.min(1, dt * 4));
        camera.lookAt(c);
      }
      hud.mort(true, E.tueurNom, Math.ceil((E.reapparitionA - now) / 1000));
    } else {
      orbiteCarte(now); // pas encore apparu (choix des armes, salle d'attente) : vue d'ensemble de la carte
    }
    if (!joueur.vivant) finTroisieme();
    // Zoom de la visée
    // (laser : la vue se resserre pendant la charge, puis s'ouvre d'un coup au tir)
    E.fovKick = (E.fovKick || 0) * Math.exp(-dt * 7);
    const chargeL = E.chargeLaser || 0;
    const fov = (joueur.vivant ? prefs.fov / zoom : prefs.fov) * (1 - 0.1 * chargeL * chargeL) + E.fovKick;
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }

    // --- Les autres joueurs (positions adoucies) ---
    const rendu = now - DELAI_INTERPOLATION;
    for (const j of E.joueurs.values()) {
      if (j.id === E.moiId || !j.vivant || !j.tampon.length) continue;
      const b = j.tampon;
      let a = b[b.length - 1];
      let c = a;
      for (let i = b.length - 1; i > 0; i--) {
        if (b[i - 1].t <= rendu) { a = b[i - 1]; c = b[i]; break; }
      }
      if (rendu >= c.t) a = c;
      const k = c.t > a.t ? Math.max(0, Math.min(1, (rendu - a.t) / (c.t - a.t))) : 1;
      let dyaw = c.yaw - a.yaw;
      if (dyaw > Math.PI) dyaw -= Math.PI * 2;
      if (dyaw < -Math.PI) dyaw += Math.PI * 2;
      const g = j.perso.groupe;
      const px = g.position.x; const py = g.position.y; const pz = g.position.z;
      g.position.set(a.x + (c.x - a.x) * k, a.y + (c.y - a.y) * k, a.z + (c.z - a.z) * k);
      g.rotation.y = a.yaw + dyaw * k;
      if (dt > 0) {
        _v.set((g.position.x - px) / dt, (g.position.y - py) / dt, (g.position.z - pz) / dt);
        j.vitesse.lerp(_v, Math.min(1, dt * 10));
      }
      const vh = Math.hypot(j.vitesse.x, j.vitesse.z);
      const enLAir = Math.abs(j.vitesse.y) > 1.5;
      j.perso.animer(dt, { vitesse: vh, enLAir, pitch: a.pitch + (c.pitch - a.pitch) * k, visee: j.visee, recharge: j.recharge });
      if (j.danse) {
        animerDanse(j.perso, j.danse, now, g.position);
        if (j.danse.musique) j.danse.musique.placer(g.position); // la musique suit le danseur
      }
      j.perso.transparence(now < j.protegeJusqua ? 0.45 + 0.25 * Math.sin(now * 0.02) : 1);
      // Pouvoirs de l'admin visibles par tous (géant, mini, invisible, traînée, aura) et grosses têtes (chez moi)
      const look = j.look || 0;
      const taille = look & 1 ? 2.5 : look & 2 ? 0.45 : 1;
      if (g.scale.x !== taille) g.scale.setScalar(taille);
      if (look & 4) g.visible = false;
      else effetsLook(look, g.position, now, dt);
      const tete = j.perso.parties.tete.pivot;
      const grosse = pouvoir('grossesTetes') ? 2.6 : 1;
      if (tete.scale.x !== grosse) tete.scale.setScalar(grosse);
      // Wallhack (pouvoir d'admin) : silhouette des adversaires à travers les murs
      const ennemi = !(E.mode === 'equipes' && moi() && j.equipe === moi().equipe);
      const couleurMur = E.mode === 'equipes' && (j.equipe === 0 || j.equipe === 1) ? COULEURS_EQUIPES[j.equipe] : '#ff4d5e';
      j.perso.marqueurMur(joueur.actif && pouvoir('wallhack') && ennemi ? couleurMur : null);
      // Bruits de pas des autres (en 3D) quand ils sont proches
      if (!enLAir && vh > 2) {
        j.distancePas += vh * dt;
        if (j.distancePas > 2.4) {
          j.distancePas = 0;
          if (g.position.distanceTo(camera.position) < 25) son(`pas_${1 + Math.floor(Math.random() * 4)}`, { position: g.position, vol: 0.6 });
        }
      }
      while (b.length > 2 && b[1].t < rendu - 500) b.shift();
    }

    // --- Ragdolls ---
    E.ragdolls = E.ragdolls.filter((r) => {
      if (r.maj(dt)) return true;
      const couleurs = [r.equipe === 0 || r.equipe === 1 ? COULEURS_EQUIPES[r.equipe] : r.style.hautC1, r.style.peau, '#ffffff'];
      for (const p of r.positions()) effets.explosion(p, couleurs, { nombre: 6, force: 2.5, haut: 2, taille: 0.11, vie: 0.7 });
      son('pouf', { position: r.centre(), vol: 0.6 });
      r.liberer();
      return false;
    });

    // --- Affichage ---
    const m = moi();
    if (joueur.vivant && E.admin) effetsLook((pouvoir('arcEnCiel') ? 8 : 0) | (pouvoir('invincible') ? 16 : 0), joueur.pos, now, dt);
    hud.pv(E.pv, reglages.joueur.pointsDeVie);
    let progression = E.rechargeFin ? Math.min(1, (now - E.rechargeDebut) / Math.max(1, E.rechargeFin - E.rechargeDebut)) : null;
    if (E.soinFin > now) progression = 1 - (E.soinFin - now) / E.soinDuree;
    const gadgetPret = now >= E.gadgetPretA;
    const texteArme = (a, i) => {
      if (a.type === 'laser' || a.type === 'tesla') return '∞';
      if (a.chargeur) return pouvoir('munitions') ? '∞' : `${E.munitions[i]} / ${a.chargeur}`;
      if (a.type === 'gadget') return gadgetPret ? 'prêt' : `${Math.ceil((E.gadgetPretA - now) / 1000)} s`;
      return 'mêlée';
    };
    if (w.type === 'laser') hud.munitions(`${Math.round((E.chargeLaser || 0) * 100)} %`, null, E.chargeLaser || null, w.nom, 'Charge');
    else if (w.chargeur && pouvoir('munitions')) hud.munitions('∞', null, progression, w.nom);
    else if (w.chargeur) hud.munitions(E.munitions[E.arme], w.chargeur, progression, w.nom);
    else hud.munitions(w.type === 'gadget' || w.type === 'tesla' ? texteArme(w, E.arme) : '—', null, progression, w.nom);
    const eqArmes = E.equipement ? E.equipement.map((i) => ARMES[i]) : [];
    const textes = eqArmes.map((a, k) => texteArme(a, E.equipement[k]));
    const vides = eqArmes.map((a, k) => (a.chargeur ? E.munitions[E.equipement[k]] === 0 : a.type === 'gadget' && !gadgetPret));
    hud.barreArmes(eqArmes, slotDe(E.arme), textes, vides, E.libellesArmes);
    if (modeTactile()) {
      tactile.majArmes(eqArmes, slotDe(E.arme), textes);
      tactile.marquerVisee(E.viser);
    }
    majBandeau(now);
    eblouissement.style.opacity = now < E.eblouiJusqua ? String(Math.min(1, ((E.eblouiJusqua - now) / E.eblouiDuree) * 1.4)) : '0';
    hud.protege(joueur.vivant && m && now < m.protegeJusqua);
    hud.chrono(E.etat === 'jeu' ? E.finA - now : E.etat === 'attente' && E.attenteFinA ? E.attenteFinA - now : 0);
    if (E.etat === 'fin') hud.finCompte(Math.max(0, Math.ceil((E.redemarrageA - now) / 1000)));
    let meilleur = 0;
    for (const j of E.joueurs.values()) meilleur = Math.max(meilleur, j.kills);
    hud.scores({ mode: E.mode, scores: E.scores, moi: m ? m.kills : 0, meilleur, objectif: E.objectif });
    hud.infos(`${fps} img/s · ping ${E.rtt} ms · partie ${E.code}`);
    // Viseur : il s'écarte avec la dispersion (et disparaît quand on vise avec l'arme)
    const vitesse = Math.min(1, joueur.vitesseHorizontale() / reglages.joueur.vitesse);
    const disp = dispersionActuelle(w, { visee: E.visee, vitesse, enLAir: !joueur.auSol, chaleur: E.chaleur });
    const ecart = Math.tan((disp * Math.PI) / 180) / Math.tan((camera.fov * Math.PI) / 360) * (innerHeight / 2);
    hud.viseur(4 + ecart, E.visee < 0.5 && !E.maDanse);
    hud.lunette(!!(arme && arme.cache && joueur.vivant));

    renderer.render(scene, camera);
    majAuditeur(camera);
    if (arme && joueur.vivant && !E.maDanse && !E.vueTroisieme) { // en dansant (ou en 3e personne), on se voit de l'extérieur : pas d'arme à l'écran
      if (E.grappin) effets.corde('moi', arme.pointMonde('bout', camera, _ej) || joueur.pos, E.grappin.cible);
      E.visee = arme.maj(dt, {
        gadgetPret,
        vitesse, auSol: joueur.auSol, vy: joueur.vit.y,
        sourisX: joueur.dernierMouvementSouris, sourisY: joueur.dernierMouvementSourisY,
        viser: E.viser && joueur.actif, lateral: lateralDe(), munitions: E.munitions[E.arme],
      });
      joueur.dernierMouvementSouris = 0;
      joueur.dernierMouvementSourisY = 0;
      arme.dessiner(renderer, camera.aspect, zoom);
    } else {
      E.visee = 0;
    }
  }

  // On affiche une première carte dans le hall pendant que la connexion s'établit.
  try { await chargerCarte(E.carteChoisie); } catch { return message('Oups', 'Impossible de charger la carte.', true); }
  requestAnimationFrame(boucle);
  reseau.connecter();
  // Pour les tests automatiques uniquement (adresse terminée par ?debug).
  if (location.search.includes('debug')) window.__fps = { joueur, E, camera, atelier, commandes, aide, effets, reseau, ARMES, get arme() { return arme; } };
}

demarrer();
