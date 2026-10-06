// Atelier d'animations (réservé à l'admin du site), avec deux onglets :
//
// - Armes : on choisit une arme (modèles « classiques » en blocs) et un moment (prendre en main,
//   recharge, tir...). L'animation du jeu est d'abord recopiée en clés : on la modifie en déplaçant
//   l'arme, les mains ou les pièces (chargeur, culasse...) à la souris ou avec les cases, à différents
//   moments de la ligne de temps (format et lecture : animations-perso.js, arme.js).
// - Danses : on anime le personnage entier (corps, tête, bras, jambes), avec une musique et des sons.
//   Les sons perso s'envoient depuis ici (serveur/sons-perso.js) ; les joueurs dansent avec la touche B.
//
// « Enregistrer » envoie au serveur : le jeu l'utilise aussitôt.
import * as THREE from '../vendor/three.min.js';
import { TransformControls } from '../vendor/addons/TransformControls.js';
import { OrbitControls } from '../vendor/addons/OrbitControls.js';
import { ArmeVue } from './arme.js';
import { choisirStyleArmes } from './armes-glb.js';
import { definirCatalogue, STYLE_DEFAUT } from './apparence.js';
import { Personnage } from './personnage.js';
import { initSons, son, chargerSon, jouerEnBoucle, couperSons } from './sons.js';
import {
  ANIMATIONS, ANIMATION, INSPECTION_DEFAUT, NOMS_PISTES, pistesDe, dureeAnimation, valeurPiste, evaluer,
} from './animations-perso.js';
import { animationOrigine } from './animations-origine.js';

const $ = (id) => document.getElementById(id);
const r4 = (v) => Math.round(v * 10000) / 10000;
const borne = (v, a, b) => Math.max(a, Math.min(b, v));
const copie = (o) => JSON.parse(JSON.stringify(o));
const secondes = (s) => `${s.toFixed(2).replace('.', ',')} s`;
const DEG = 180 / Math.PI;
const TOUR = Math.PI * 2;
const angleProche = (a, ref) => a + TOUR * Math.round((ref - a) / TOUR);
// Une rotation lue sur une pièce est toujours entre -180° et 180° : on prend la façon de l'écrire la plus
// proche de la valeur d'avant (ex. -247° plutôt que 113°), pour qu'une pièce qui fait un tour complet
// continue à tourner dans le même sens au lieu de repartir en arrière.
function rotationProche(r, ref) {
  const a = [angleProche(r[0], ref[0]), angleProche(r[1], ref[1]), angleProche(r[2], ref[2])];
  const b = [angleProche(r[0] + Math.PI, ref[0]), angleProche(Math.PI - r[1], ref[1]), angleProche(r[2] + Math.PI, ref[2])]; // la même orientation, écrite autrement
  const ecart = (v) => Math.abs(v[0] - ref[0]) + Math.abs(v[1] - ref[1]) + Math.abs(v[2] - ref[2]);
  return ecart(a) <= ecart(b) ? a : b;
}
// Deux clés qui se suivent et dont la rotation fait plus d'un demi-tour sur un axe (c'est presque toujours ce bug)
const clesQuiFontDemiTour = () => Object.values(E.anim.pistes).reduce((n, l) => n + l.filter((k, i) => i > 0
  && [4, 5, 6].some((j) => Math.abs(k[j] - l[i - 1][j]) > Math.PI)).length, 0);

function reparerTours() {
  memoriser();
  let n = 0;
  for (const l of Object.values(E.anim.pistes)) {
    for (let i = 1; i < l.length; i++) {
      const avant = [l[i][4], l[i][5], l[i][6]];
      const r = rotationProche(avant, [l[i - 1][4], l[i - 1][5], l[i - 1][6]]);
      if (r.some((v, j) => Math.abs(v - avant[j]) > 1e-6)) { l[i][4] = r4(r[0]); l[i][5] = r4(r[1]); l[i][6] = r4(r[2]); n++; }
    }
  }
  if (!n) { E.historique.pop(); majEtat('Rien à réparer : toutes les pièces tournent dans le bon sens.'); return; }
  marquerModifie();
  majTout();
  majEtat(`✓ ${n} clé(s) remise(s) dans le bon sens. Regarde avec ▶ puis Enregistrer.`);
}

// Sons qu'on peut placer dans une animation : [fichier, nom affiché]
const SONS = [
  ['chargeur_retire', 'Chargeur retiré'], ['chargeur_insere', 'Chargeur mis'], ['cartouche_insere', 'Cartouche glissée'],
  ['pompe_armement', 'Pompe'], ['sniper_culasse', 'Culasse'], ['revolver_recharge', 'Barillet'], ['arme_sortir', 'Arme sortie'],
  ['douille', 'Douille qui tombe'], ['vide', 'Clic à vide'], ['clic', 'Petit clic'], ['couteau_coup', 'Couteau (vent)'],
  ['batte_coup', 'Batte (vent)'], ['grenade_goupille', 'Goupille'], ['grenade_lancer', 'Lancer'], ['grappin_corde', 'Corde'],
  ['soin', 'Bandage'], ['soin_fini', 'Soin fini'],
];
const NOM_SON = Object.fromEntries(SONS);
const CATEGORIES = [['principale', 'Principales'], ['secondaire', 'Secondaires'], ['melee', 'Mêlée'], ['gadget', 'Gadgets']];
// Les parties du personnage qu'on anime dans une danse
const PISTES_DANSE = ['tout', 'corps', 'tete', 'brasD', 'brasG', 'jambeD', 'jambeG'];
const NOMS_DANSE = { tout: 'Tout le corps', corps: 'Buste', tete: 'Tête', brasD: 'Bras droit', brasG: 'Bras gauche', jambeD: 'Jambe droite', jambeG: 'Jambe gauche' };
const DUREE_DANSE = [0.3, 30];

let ARMES = [];
let enregistrees = {};   // animations enregistrées sur le serveur : arme -> moment -> animation
let danses = [];         // danses enregistrées sur le serveur
let sonsPerso = [];      // sons envoyés par l'admin : { id, nom, taille }
let modelesDanse = [];   // danses toutes prêtes (dossier danses-modeles) : { fichier, nom, description }
let vue = null;          // l'arme vue à la première personne (la même que dans le jeu)
let base = null;         // pose normale de l'arme choisie (sans animation)

// État de l'atelier
const E = {
  mode: 'arme',        // 'arme' ou 'danse'
  danseId: null,       // danse choisie
  musique: null,       // musique de la danse en cours de lecture
  i: 0,                // arme choisie (indice dans ARMES)
  cle: 'sortir',       // moment choisi (voir ANIMATIONS)
  anim: null,          // l'animation qu'on modifie
  modifie: false,      // pas encore enregistrée
  t: 0,                // tête de lecture (secondes)
  lecture: false,
  vitesse: 1,
  piste: 'arme',       // pièce choisie
  choix: null,         // { type: 'cle', piste, cle } ou { type: 'son', son } : dernier élément choisi dans la frise
  selection: [],       // tous les éléments choisis (Maj+clic, cadre de sélection)
  pressePapierCles: null, // clés copiées (Ctrl+C) : { t0, elements }
  vue: 'joueur',
  outil: 'translate',
  historique: [],
  futur: [],
  pressePapier: null,
  sale: true,          // la pose doit être recalculée
};

function bloquer(titre, texte) {
  $('bloque-titre').textContent = titre;
  $('bloque-texte').textContent = texte;
  $('bloque').hidden = false;
}

// ---------- Démarrage ----------
async function demarrer() {
  let reglages; let cat; let moi;
  try {
    [reglages, cat, moi] = await Promise.all([
      fetch('reglages.json').then((r) => r.json()),
      fetch('catalogue-apparence.json').then((r) => r.json()),
      fetch('/api/auth/me').then((r) => r.json()),
    ]);
  } catch {
    return bloquer('Oups', 'Impossible de charger l\'atelier. Vérifie ta connexion puis recharge la page.');
  }
  if (!moi.user || !moi.user.isAdmin) {
    return bloquer('Réservé à l\'admin', 'Seul l\'administrateur du site peut modifier les animations des armes.');
  }
  definirCatalogue(cat);
  ARMES = reglages.armes;
  try {
    const [a, d, s] = await Promise.all(['api/animations', 'api/danses', 'api/sons'].map((u) => fetch(u).then((r) => r.json())));
    enregistrees = a.animations || {};
    danses = d.danses || [];
    sonsPerso = s.sons || [];
  } catch { enregistrees = {}; }
  try { modelesDanse = await fetch('danses-modeles/index.json').then((r) => r.json()); } catch { modelesDanse = []; }
  await choisirStyleArmes('classique'); // l'atelier travaille sur les armes en blocs
  preparer3D();
  preparerInterface();
  choisirArme(0);
  requestAnimationFrame(boucle);
}

// ---------- 3D ----------
let renderer; let camLibre; let orbite; let gizmo; let repere; let grille;
let sceneDanse; let camDanse; let orbiteDanse; let perso; // onglet Danses : le personnage sur un podium
const raycaster = new THREE.Raycaster();
const enDanse = () => E.mode === 'danse';

function preparer3D() {
  const canvas = $('vue3d');
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch {
    bloquer('3D indisponible', 'Ton navigateur ne peut pas afficher la 3D (WebGL). Essaie Chrome, Edge ou Firefox à jour.');
    throw new Error('WebGL');
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x2b3b5e);
  vue = new ArmeVue(STYLE_DEFAUT, ARMES);
  // Pour lire la tension de la corde de l'arbalète
  for (const m of vue.modeles) {
    const u = m.userData;
    if (u.tendre) { const f = u.tendre; u.tendre = (k) => { u.tension = k; f(k); }; }
  }
  grille = new THREE.GridHelper(2, 20, 0x6688bb, 0x3a4b70);
  grille.position.set(0.1, -0.5, -0.4);
  vue.scene.add(grille);
  camLibre = new THREE.PerspectiveCamera(40, 1, 0.01, 20);

  // Les flèches pour déplacer / tourner (créées avant la caméra libre : elles passent en premier)
  gizmo = new TransformControls(vue.camera, canvas);
  gizmo.setSize(0.8);
  vue.scene.add(gizmo.getHelper());
  gizmo.addEventListener('dragging-changed', (e) => {
    orbite.enabled = !e.value && !enDanse() && E.vue === 'libre';
    orbiteDanse.enabled = !e.value && enDanse();
    if (e.value) { memoriser(); gizmoUtilise = true; } else majTout();
  });
  gizmo.addEventListener('objectChange', surDeplacement);
  orbite = new OrbitControls(camLibre, canvas);
  orbite.enabled = false;

  // Onglet Danses : le personnage, de face, sur un petit podium
  sceneDanse = new THREE.Scene();
  sceneDanse.background = new THREE.Color(0x2b3b5e);
  sceneDanse.add(new THREE.HemisphereLight(0xdff1ff, 0x40405a, 1.7));
  const soleil = new THREE.DirectionalLight(0xfff1d6, 2.1);
  soleil.position.set(2, 4, 3);
  sceneDanse.add(soleil);
  sceneDanse.add(new THREE.GridHelper(8, 16, 0x6688bb, 0x3a4b70));
  const podium = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.04, 40), new THREE.MeshLambertMaterial({ color: 0x18213d }));
  podium.position.y = -0.021;
  sceneDanse.add(podium);
  perso = new Personnage({ style: STYLE_DEFAUT });
  perso.groupe.rotation.y = Math.PI; // de face
  sceneDanse.add(perso.groupe);
  camDanse = new THREE.PerspectiveCamera(40, 1, 0.05, 60);
  camDanse.position.set(1.6, 1.6, 4.2);
  orbiteDanse = new OrbitControls(camDanse, canvas);
  orbiteDanse.target.set(0, 1, 0);
  orbiteDanse.update();
  orbiteDanse.enabled = false;

  // Petite boule orange : la main qu'on déplace
  repere = new THREE.Mesh(new THREE.SphereGeometry(0.013, 14, 10), new THREE.MeshBasicMaterial({ color: 0xff8a1f, depthTest: false }));
  repere.renderOrder = 999;
  repere.visible = false;

  // Cliquer sur une pièce la choisit
  let depart = null; let gizmoUtilise = false;
  canvas.addEventListener('pointerdown', (e) => { depart = [e.clientX, e.clientY]; gizmoUtilise = false; });
  canvas.addEventListener('pointerup', (e) => {
    if (!depart || gizmoUtilise || Math.hypot(e.clientX - depart[0], e.clientY - depart[1]) > 4) return;
    choisirPieceSous(e);
  });

  new ResizeObserver(redimensionner).observe(canvas.parentElement);
  redimensionner();
}

function redimensionner() {
  const el = $('vue3d');
  const w = el.clientWidth || 1; const h = el.clientHeight || 1;
  renderer.setSize(w, h, false);
  for (const c of [vue.camera, camLibre, camDanse]) { c.aspect = w / h; c.updateProjectionMatrix(); }
}

function camera() { return enDanse() ? camDanse : E.vue === 'joueur' ? vue.camera : camLibre; }
function sceneActive() { return enDanse() ? sceneDanse : vue.scene; }
const pistesActives = () => (enDanse() ? PISTES_DANSE : pistesDe(vue.modele));
const nomPiste = (p) => (enDanse() ? NOMS_DANSE[p] : NOMS_PISTES[p]);
const nomSon = (n) => NOM_SON[n] || (n.startsWith('perso:') ? (sonsPerso.find((x) => `perso:${x.id}` === n) || { nom: 'son supprimé' }).nom : n);

function choisirPieceSous(e) {
  const r = $('vue3d').getBoundingClientRect();
  raycaster.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera());
  if (enDanse()) {
    const touche = raycaster.intersectObject(perso.corpsEntier, true).find((h) => h.object.visible);
    if (!touche) return;
    let piste = 'tout';
    for (let o = touche.object; o && o !== perso.corpsEntier; o = o.parent) {
      const p = PISTES_DANSE.find((n) => perso.parties[n] && perso.parties[n].mesh === o);
      if (p) { piste = p; break; }
    }
    choisirPiste(piste);
    return;
  }
  const touche = raycaster.intersectObjects([vue.modele, vue.brasD, vue.brasG], true)
    .find((h) => h.object !== repere && h.object.visible && h.object.layers.test(camera().layers));
  if (!touche) return;
  const u = vue.modele.userData;
  const pistes = pistesDe(vue.modele);
  let piste = 'arme';
  for (let o = touche.object; o; o = o.parent) {
    if (o === vue.brasD) { piste = 'mainD'; break; }
    if (o === vue.brasG) { piste = 'mainG'; break; }
    const p = pistes.find((n) => u[n] === o);
    if (p) { piste = p; break; }
    if (o === vue.modele) break;
  }
  choisirPiste(piste);
}

// ---------- Choix de l'arme et du moment ----------
function choisirArme(i) {
  if (!confirmerAbandon()) return;
  E.i = i;
  vue.choisir(i, true);
  repere.removeFromParent();
  vue.modele.add(repere);
  // pose normale : l'arme à la hanche, sans animation
  vue.poserApercu(null, 0, null);
  const d = vue.derniere;
  const u = vue.modele.userData;
  base = {
    x: d.x, y: d.y, z: d.z, rx: d.rx, ry: d.ry, rz: d.rz,
    mainD: u.mainD.clone(),
    mainG: u.mainG ? u.mainG.clone() : new THREE.Vector3(u.mainD.x - 0.09, u.mainD.y, u.mainD.z - 0.06),
  };
  // caméra libre : un peu au-dessus, à gauche et en arrière de l'arme
  orbite.target.set(d.x, d.y, d.z - 0.15);
  camLibre.position.set(d.x - 0.85, d.y + 0.5, d.z + 0.35);
  orbite.update();
  const arme = ARMES[i];
  const dispo = ANIMATIONS.filter((a) => a.pour(arme));
  const cle = dispo.some((a) => a.cle === E.cle) ? E.cle : dispo[0].cle;
  E.modifie = false;
  ouvrirAnimation(cle, true);
}

function ouvrirAnimation(cle, sansConfirmer = false) {
  if (!sansConfirmer && !confirmerAbandon()) return;
  const arme = ARMES[E.i];
  E.cle = cle;
  const sauvee = enregistrees[arme.id]?.[cle];
  E.anim = sauvee ? copie(sauvee) : importerOrigine(cle);
  E.modifie = false;
  E.t = cle === 'sortir' ? E.anim.duree : 0; // au début de la sortie, l'arme est encore sous l'écran
  E.lecture = false;
  E.historique = [];
  E.futur = [];
  viderSelection();
  E.piste = 'arme';
  majTout();
}

function confirmerAbandon() {
  return !E.modifie || confirm('Ton animation n\'est pas enregistrée. Continuer sans enregistrer ?');
}

// ---------- Recopier l'animation du jeu en clés ----------
// On fait jouer l'animation d'origine image par image, on note la position de chaque pièce,
// puis on ne garde que les clés nécessaires.
function cleRepos(piste) {
  if (enDanse()) return [0, 0, 0, 0, 0, 0, 0];
  if (piste === 'corde') return [1, 0, 0, 0, 0, 0, 0];
  const cacheDefaut = piste === 'mainG' && !vue.modele.userData.mainG ? 1 : 0;
  return [0, 0, 0, 0, 0, 0, cacheDefaut];
}

function lirePiste(p, t) {
  const d = vue.derniere;
  const u = vue.modele.userData;
  if (p === 'arme') return [t, d.x - base.x, d.y - base.y, d.z - base.z, d.rx - base.rx, d.ry - base.ry, d.rz - base.rz, 0];
  if (p === 'mainD') return [t, d.mainD.x - base.mainD.x, d.mainD.y - base.mainD.y, d.mainD.z - base.mainD.z, 0, 0, 0, 0];
  if (p === 'mainG') {
    return d.mainG ? [t, d.mainG.x - base.mainG.x, d.mainG.y - base.mainG.y, d.mainG.z - base.mainG.z, 0, 0, 0, 0] : [t, 0, 0, 0, 0, 0, 0, 1];
  }
  if (p === 'corde') return [t, u.tension ?? 1, 0, 0, 0, 0, 0, 0];
  const o = u[p]; const r = o.userData.repos; const q = o.userData.reposRot;
  return [t, o.position.x - r.x, o.position.y - r.y, o.position.z - r.z, o.rotation.x - q.x, o.rotation.y - q.y, o.rotation.z - q.z, o.visible ? 0 : 1];
}

// Garde le moins de clés possible pour que l'animation recalculée reste à moins de 6 mm et 2°
// de l'originale. Les moments où une pièce apparaît/disparaît ou saute d'un coup (la main qui lâche
// la poignée...) sont toujours gardés. Une clé là où la pièce est immobile devient une clé « arrêt ».
function simplifier(piste, ech) {
  const defaut = cleRepos(piste);
  const normal = (k) => k.slice(1, 7).every((v, j) => Math.abs(v - defaut[j]) < 1e-4) && (k[7] || 0) === defaut[6];
  if (ech.every(normal)) return null; // la pièce ne bouge pas : pas besoin de piste
  const n = ech.length;
  const bouge = (a, b, pos, rot) => {
    for (let j = 1; j < 4; j++) if (Math.abs(a[j] - b[j]) > pos) return true;
    for (let j = 4; j < 7; j++) if (Math.abs(a[j] - b[j]) > rot) return true;
    return false;
  };
  // immobile : juste avant ou juste après, la pièce ne bouge (presque) pas
  const immobile = ech.map((k, i) => (i > 0 && !bouge(k, ech[i - 1], 0.0002, 0.0015)) || (i < n - 1 && !bouge(k, ech[i + 1], 0.0002, 0.0015)));
  const garder = new Set([0, n - 1]);
  const arret = new Set();
  const ecart = (a, b) => Math.max(Math.hypot(a[1] - b[1], a[2] - b[2], a[3] - b[3]) / 0.003, Math.hypot(a[4] - b[4], a[5] - b[5], a[6] - b[6]) / 0.02);
  for (let i = 1; i < n; i++) {
    if (ech[i][7] !== ech[i - 1][7]) { garder.add(i - 1); garder.add(i); continue; }
    // saut : bien plus grand que le mouvement juste avant et juste après
    const e = ecart(ech[i], ech[i - 1]);
    const voisins = Math.max(i > 1 ? ecart(ech[i - 1], ech[i - 2]) : 0, i + 1 < n ? ecart(ech[i + 1], ech[i]) : 0);
    if (e > 1 && e > 3 * voisins) { garder.add(i - 1); garder.add(i); arret.add(i - 1); arret.add(i); }
  }
  // début et fin de chaque mouvement (la pièce démarre ou s'arrête)
  for (let i = 1; i < n; i++) if (immobile[i] !== immobile[i - 1]) garder.add(immobile[i] ? i : i - 1);
  const cle = (i) => [...ech[i].slice(0, 7).map(r4), ech[i][7] ? 1 : 0, immobile[i] || arret.has(i) ? 1 : 0];
  const seuil = [0, 0.006, 0.006, 0.006, 0.035, 0.035, 0.035];
  for (let essai = 0; essai < 55; essai++) {
    const cles = [...garder].sort((x, y) => x - y).map(cle);
    let pire = -1; let pireErreur = 1;
    for (let i = 0; i < n; i++) {
      if (garder.has(i)) continue;
      const v = valeurPiste(cles, ech[i][0], 'fluide');
      let err = 0;
      for (let j = 1; j < 7; j++) err = Math.max(err, Math.abs(v[j] - ech[i][j]) / seuil[j]);
      if (err > pireErreur) { pireErreur = err; pire = i; }
    }
    if (pire < 0) break;
    garder.add(pire);
  }
  return [...garder].sort((x, y) => x - y).map(cle);
}

function importerOrigine(cle) {
  const arme = ARMES[E.i];
  // inspection et recharge : chaque arme a déjà ses clés (animations-origine.js), on les recopie telles quelles
  const propre = (cle === 'inspecter' || cle === 'recharge') && animationOrigine(arme, cle, vue.modele.userData);
  if (propre) return copie(propre);
  if (cle === 'inspecter') return copie(INSPECTION_DEFAUT);
  const d = dureeAnimation(arme, cle, null);
  const pistes = pistesDe(vue.modele);
  const N = Math.max(24, Math.min(600, Math.round(d * 120)));
  const echantillons = Object.fromEntries(pistes.map((p) => [p, []]));
  const sons = [];
  const entendus = new Set();
  if (cle === 'sortir') sons.push([0, 'arme_sortir']);
  if (cle === 'coup' || cle === 'coupDos') sons.push([0, arme.id === 'couteau' ? 'couteau_coup' : 'batte_coup']);
  vue.sonsJoues.clear();
  for (let i = 0; i <= N; i++) {
    const t = (d * i) / N;
    vue.poserApercu(cle, t, null, (nom) => { if (!entendus.has(nom)) { entendus.add(nom); sons.push([r4(t), nom]); } });
    for (const p of pistes) echantillons[p].push(lirePiste(p, t));
  }
  const anim = { duree: r4(d), mouvement: 'fluide', pistes: {}, sons };
  for (const p of pistes) {
    const cles = simplifier(p, echantillons[p]);
    if (cles) anim.pistes[p] = cles;
  }
  if (!anim.pistes.arme) anim.pistes.arme = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [r4(d), 0, 0, 0, 0, 0, 0, 0, 0]];
  return anim;
}

// ---------- Modifier l'animation ----------
function memoriser() {
  E.historique.push(copie(E.anim));
  if (E.historique.length > 100) E.historique.shift();
  E.futur = [];
}

function marquerModifie() {
  E.modifie = true;
  E.sale = true;
  majEtat();
}

function annuler() {
  if (!E.historique.length) return;
  E.futur.push(copie(E.anim));
  E.anim = E.historique.pop();
  viderSelection();
  marquerModifie();
  majTout();
}

function retablir() {
  if (!E.futur.length) return;
  E.historique.push(copie(E.anim));
  E.anim = E.futur.pop();
  viderSelection();
  marquerModifie();
  majTout();
}

// Valeur de la pièce choisie au temps actuel : [t, px, py, pz, rx, ry, rz, cache]
function valeurActuelle(piste = E.piste) {
  const l = E.anim.pistes[piste];
  if (l && l.length) {
    const v = valeurPiste(l, E.t, E.anim.mouvement);
    return [E.t, ...v.slice(1, 8), 0, v[9] || 0];
  }
  return [E.t, ...cleRepos(piste), 0, 0];
}

// Ajoute (ou remplace) une clé au temps de la clé k
function poserCle(piste, valeur) {
  const pistes = E.anim.pistes;
  let l = pistes[piste];
  const k = [...valeur.slice(0, 7).map(r4), valeur[7] ? 1 : 0, 0, (valeur[9] || 0) >= 0.5 ? 1 : 0];
  if (!l || !l.length) {
    // première clé d'une pièce : elle part de sa position normale et y revient à la fin
    l = pistes[piste] = [];
    if (k[0] > 0.001) l.push([0, ...cleRepos(piste), 0, 0]);
    if (k[0] < E.anim.duree - 0.001) l.push([E.anim.duree, ...cleRepos(piste), 0, 0]);
  }
  const i = l.findIndex((c) => Math.abs(c[0] - k[0]) < 0.001);
  if (i >= 0) { k[8] = l[i][8] ? 1 : 0; if (valeur[9] === undefined) k[9] = l[i][9] ? 1 : 0; l[i] = k; } else { l.push(k); l.sort((a, b) => a[0] - b[0]); }
  E.choix = { type: 'cle', piste, cle: k };
  E.selection = [E.choix];
  marquerModifie();
}

// Les flèches ont bougé la pièce : on enregistre sa nouvelle position comme clé
function surDeplacement() {
  const p = E.piste;
  const u = vue.modele.userData;
  const cache = valeurActuelle(p)[7] || 0;
  let k;
  if (enDanse()) {
    const o = p === 'tout' ? perso.corpsEntier : perso.parties[p].pivot;
    const r0 = p === 'tout' ? new THREE.Vector3() : perso.reposPivots[p];
    k = [E.t, o.position.x - r0.x, o.position.y - r0.y, o.position.z - r0.z, o.rotation.x, o.rotation.y, o.rotation.z, 0];
  } else if (p === 'arme') {
    const s = vue.support.position; const r = vue.pivot.rotation;
    k = [E.t, s.x - base.x, s.y - base.y, s.z - base.z, r.x - base.rx, r.y - base.ry, r.z - base.rz, 0];
  } else if (p === 'mainD' || p === 'mainG') {
    if ((valeurActuelle(p)[9] || 0) >= 0.5) {
      // main détachée : la boule orange est dans le repère de l'écran
      const r = vue.mainReposEcran(u, p === 'mainD' ? 'D' : 'G');
      k = [E.t, repere.position.x - r.x, repere.position.y - r.y, repere.position.z - r.z, 0, 0, 0, cache, 0, 1];
    } else {
      const b = base[p];
      k = [E.t, repere.position.x - b.x, repere.position.y - b.y, repere.position.z - b.z, 0, 0, 0, cache, 0, 0];
    }
  } else {
    const o = u[p]; const r = o.userData.repos; const q = o.userData.reposRot;
    k = [E.t, o.position.x - r.x, o.position.y - r.y, o.position.z - r.z, o.rotation.x - q.x, o.rotation.y - q.y, o.rotation.z - q.z, cache];
  }
  if (p !== 'mainD' && p !== 'mainG') { // les mains ne tournent pas
    const avant = valeurActuelle(p);
    [k[4], k[5], k[6]] = rotationProche([k[4], k[5], k[6]], [avant[4], avant[5], avant[6]]);
  }
  poserCle(p, k);
  poser(true);
  majPanneau();
  majFrise();
}

// ---------- Sélection dans la frise ----------
const memeElement = (a, b) => a.type === b.type && (a.type === 'son' ? a.son === b.son : a.cle === b.cle);
const estSelectionne = (x) => E.selection.some((y) => memeElement(x, y));
function viderSelection() { E.selection = []; E.choix = null; }
// ajouter = true (Maj ou Ctrl) : on ajoute l'élément à la sélection, ou on l'enlève s'il y est déjà
function choisirElement(x, ajouter) {
  if (!ajouter) { E.selection = [x]; E.choix = x; return; }
  if (estSelectionne(x)) {
    E.selection = E.selection.filter((y) => !memeElement(x, y));
    E.choix = E.selection[E.selection.length - 1] || null;
  } else { E.selection.push(x); E.choix = x; }
}
function toutSelectionner() {
  E.selection = [];
  for (const [piste, l] of Object.entries(E.anim.pistes)) for (const cle of l) E.selection.push({ type: 'cle', piste, cle });
  for (const son of E.anim.sons) E.selection.push({ type: 'son', son });
  E.choix = E.selection[E.selection.length - 1] || null;
  majTout();
}

function supprimerChoix() {
  if (!E.selection.length) return;
  memoriser();
  for (const x of E.selection) {
    if (x.type === 'son') { E.anim.sons = E.anim.sons.filter((s) => s !== x.son); continue; }
    const l = E.anim.pistes[x.piste] || [];
    const i = l.indexOf(x.cle);
    if (i >= 0) l.splice(i, 1);
    if (!l.length) delete E.anim.pistes[x.piste];
  }
  viderSelection();
  marquerModifie();
  majTout();
}

// Ctrl+C / Ctrl+V : copier les clés choisies, puis les coller à la tête de lecture (pour répéter un pas de danse...)
function copierCles() {
  if (!E.selection.length) return false;
  const t0 = Math.min(...E.selection.map((x) => (x.type === 'son' ? x.son[0] : x.cle[0])));
  E.pressePapierCles = { t0, elements: E.selection.map((x) => (x.type === 'son' ? { type: 'son', son: x.son.slice() } : { type: 'cle', piste: x.piste, cle: x.cle.slice() })) };
  majEtat(`${E.selection.length} élément(s) copié(s) : place la tête de lecture puis Ctrl+V.`);
  return true;
}
function collerCles() {
  const pp = E.pressePapierCles;
  if (!pp) return false;
  memoriser();
  const pistes = pistesActives();
  const colles = [];
  let horsDuree = 0;
  for (const x of pp.elements) {
    const t = r4(E.t + ((x.type === 'son' ? x.son[0] : x.cle[0]) - pp.t0));
    if (t > E.anim.duree + 1e-6) { horsDuree++; continue; } // après la fin de l'animation : pas collé
    if (x.type === 'son') { const son = [t, x.son[1]]; E.anim.sons.push(son); colles.push({ type: 'son', son }); continue; }
    if (!pistes.includes(x.piste)) continue; // pièce qui n'existe pas ici
    const cle = [t, ...x.cle.slice(1)];
    const l = E.anim.pistes[x.piste] || (E.anim.pistes[x.piste] = []);
    const i = l.findIndex((c) => Math.abs(c[0] - t) < 0.001);
    if (i >= 0) l[i] = cle; else l.push(cle);
    l.sort((a, b) => a[0] - b[0]);
    colles.push({ type: 'cle', piste: x.piste, cle });
  }
  E.anim.sons.sort((a, b) => a[0] - b[0]);
  E.selection = colles;
  E.choix = colles[colles.length - 1] || null;
  marquerModifie();
  majTout();
  if (horsDuree) majEtat(`${horsDuree} élément(s) pas collé(s) : ils tomberaient après la fin.`);
  return true;
}

function changerDuree(valeur) {
  const libre = enDanse() ? DUREE_DANSE : ANIMATION[E.cle].libre;
  if (!libre || !Number.isFinite(valeur)) return;
  const nouvelle = r4(borne(valeur, libre[0], libre[1]));
  if (Math.abs(nouvelle - E.anim.duree) < 1e-4) return;
  memoriser();
  const k = nouvelle / E.anim.duree; // toute l'animation est accélérée ou ralentie
  for (const l of Object.values(E.anim.pistes)) for (const c of l) c[0] = r4(c[0] * k);
  for (const s of E.anim.sons) s[0] = r4(s[0] * k);
  E.anim.duree = nouvelle;
  E.t = Math.min(E.t * k, nouvelle);
  marquerModifie();
  majTout();
}

// ---------- Pose et rendu ----------
function poser(pendantDeplacement = false) {
  if (enDanse()) { perso.poserDanse(evaluer(E.anim, E.t), !!E.anim.arme); return; }
  vue.poserApercu(E.cle, E.t, E.anim);
  const p = E.piste;
  if ((p === 'mainD' || p === 'mainG') && !pendantDeplacement) {
    // la boule orange suit la main : sur l'arme, ou à l'écran si la main est détachée
    const d = vue.derniere;
    const libre = (p === 'mainD' ? d.libreD : d.libreG) >= 0.5;
    const parent = libre ? vue.scene : vue.modele;
    if (repere.parent !== parent) parent.add(repere);
    if (libre) repere.position.copy((p === 'mainD' ? d.mainDEcran : d.mainGEcran) || vue.mainReposEcran(vue.modele.userData, 'G'));
    else repere.position.copy(p === 'mainD' ? d.mainD : (d.mainG || base.mainG));
  }
}

function majGizmo() {
  const p = E.piste;
  const u = vue.modele.userData;
  gizmo.camera = camera();
  if (gizmo.getHelper().parent !== sceneActive()) sceneActive().add(gizmo.getHelper());
  if (enDanse()) {
    repere.visible = false;
    // chaque partie du corps peut se déplacer (outil Déplacer) ou tourner (outil Tourner)
    const mode = E.outil;
    gizmo.attach(p === 'tout' ? perso.corpsEntier : perso.parties[p].pivot);
    gizmo.setMode(mode);
    gizmo.setSpace(mode === 'rotate' ? 'local' : 'world');
    return;
  }
  repere.visible = p === 'mainD' || p === 'mainG';
  if (p === 'corde') { gizmo.detach(); return; }
  if (p === 'arme') {
    gizmo.attach(E.outil === 'rotate' ? vue.pivot : vue.support);
    gizmo.setMode(E.outil);
    gizmo.setSpace(E.outil === 'rotate' ? 'local' : 'world');
  } else if (repere.visible) {
    gizmo.attach(repere);
    gizmo.setMode('translate'); // les mains se déplacent seulement (les bras suivent)
    gizmo.setSpace('local');
  } else {
    gizmo.attach(u[p]);
    gizmo.setMode(E.outil);
    gizmo.setSpace('local');
  }
}

let avant = performance.now();
function boucle(maintenant) {
  const dt = Math.min(0.1, (maintenant - avant) / 1000);
  avant = maintenant;
  if (E.lecture) {
    const t0 = E.t;
    E.t += dt * E.vitesse;
    if (E.t >= E.anim.duree) {
      if ($('boucle').checked) {
        jouerSonsEntre(t0, E.anim.duree + 1);
        E.t %= E.anim.duree;
        jouerSonsEntre(-1, E.t);
      } else {
        jouerSonsEntre(t0, E.anim.duree + 1);
        E.t = E.anim.duree;
        arreter();
      }
    } else jouerSonsEntre(t0, E.t);
    E.sale = true;
  }
  if (E.sale && !gizmo.dragging) {
    poser();
    majTete();
    if (!E.lecture) majPanneau();
    E.sale = false;
  }
  grille.visible = E.vue === 'libre';
  renderer.render(sceneActive(), camera());
  requestAnimationFrame(boucle);
}

function jouerSonsEntre(a, b) {
  for (const [t, nom] of E.anim.sons) if (t > a && t <= b) son(nom, { vol: 0.8 });
}

function lire() {
  initSons(0.8, 0);
  for (const [, nom] of E.anim.sons) chargerSon(nom);
  if (E.t >= E.anim.duree - 1e-3) E.t = 0;
  E.lecture = true;
  jouerSonsEntre(E.t - 1e-6, E.t);
  // danse : la musique tourne en boucle pendant la lecture
  if (enDanse() && E.anim.musique) E.musique = jouerEnBoucle(E.anim.musique, { vol: 0.9, depuis: E.t });
  $('btn-lecture').textContent = '⏸';
}
function arreter() {
  E.lecture = false;
  if (E.musique) { E.musique.arreter(); E.musique = null; }
  couperSons(); // les sons déjà lancés s'arrêtent aussi
  $('btn-lecture').textContent = '▶';
  E.sale = true;
}

// ---------- Interface ----------
function preparerInterface() {
  $('mode-armes').addEventListener('click', () => choisirMode('arme'));
  $('mode-danses').addEventListener('click', () => choisirMode('danse'));
  $('nom-danse').addEventListener('change', (e) => {
    if (!enDanse()) return;
    memoriser();
    E.anim.nom = e.target.value.trim().slice(0, 30) || 'Ma danse';
    marquerModifie();
    majTout();
  });
  $('musique').addEventListener('change', (e) => {
    if (!enDanse()) return;
    memoriser();
    E.anim.musique = e.target.value || null;
    if (E.anim.musique) { initSons(0.8, 0); chargerSon(E.anim.musique); }
    if (E.lecture) arreter();
    marquerModifie();
  });
  $('fichier-son').addEventListener('change', (e) => { envoyerSons([...e.target.files]); e.target.value = ''; });
  // options de la danse
  const option = (id, lire) => $(id).addEventListener('change', (e) => {
    if (!enDanse()) return;
    memoriser();
    lire(e.target);
    marquerModifie();
    majTout();
  });
  option('opt-marcher', (el) => { E.anim.marcher = el.checked; });
  option('opt-arme', (el) => { E.anim.arme = el.checked; });
  option('opt-vitesse', (el) => { const v = parseFloat(String(el.value).replace(',', '.')); E.anim.vitesse = Number.isFinite(v) ? borne(v, 0.2, 1) : 0.7; });
  $('vue-joueur').addEventListener('click', () => choisirVue('joueur'));
  $('vue-libre').addEventListener('click', () => choisirVue('libre'));
  $('outil-deplacer').addEventListener('click', () => choisirOutil('translate'));
  $('outil-tourner').addEventListener('click', () => choisirOutil('rotate'));
  $('btn-lecture').addEventListener('click', () => (E.lecture ? arreter() : lire()));
  $('btn-debut').addEventListener('click', () => { E.t = 0; E.sale = true; });
  $('btn-fin').addEventListener('click', () => { E.t = E.anim.duree; E.sale = true; });
  $('vitesse').addEventListener('change', (e) => { E.vitesse = Number(e.target.value); });
  $('btn-annuler').addEventListener('click', annuler);
  $('btn-retablir').addEventListener('click', retablir);
  $('btn-enregistrer').addEventListener('click', enregistrer);
  $('btn-cle').addEventListener('click', () => { memoriser(); poserCle(E.piste, valeurActuelle()); majTout(); });
  $('btn-suppr-cle').addEventListener('click', supprimerChoix);
  $('btn-copier').addEventListener('click', copierPose);
  $('btn-coller').addEventListener('click', collerPose);
  $('btn-importer').addEventListener('click', () => {
    if (!confirm('Remplacer ton travail par l\'animation actuelle du jeu ?')) return;
    memoriser();
    E.anim = importerOrigine(E.cle);
    viderSelection();
    marquerModifie();
    majTout();
  });
  $('btn-effacer').addEventListener('click', () => {
    if (!confirm('Tout effacer pour repartir de zéro ?')) return;
    memoriser();
    E.anim.pistes = { [enDanse() ? 'tout' : 'arme']: [[0, 0, 0, 0, 0, 0, 0, 0, 0], [E.anim.duree, 0, 0, 0, 0, 0, 0, 0, 0]] };
    E.anim.sons = [];
    viderSelection();
    marquerModifie();
    majTout();
  });
  $('btn-origine').addEventListener('click', supprimerEnregistree);
  $('btn-tours').addEventListener('click', reparerTours);
  $('duree').addEventListener('change', (e) => changerDuree(parseFloat(String(e.target.value).replace(',', '.'))));
  $('mouvement').addEventListener('change', (e) => { memoriser(); E.anim.mouvement = e.target.value; marquerModifie(); });

  // Cases de la pièce choisie : chaque changement pose une clé au temps actuel
  const champs = { px: [1, 0.01], py: [2, 0.01], pz: [3, 0.01], rx: [4, 1 / DEG], ry: [5, 1 / DEG], rz: [6, 1 / DEG] };
  for (const [id, [j, echelle]] of Object.entries(champs)) {
    $(id).addEventListener('change', (e) => {
      const v = parseFloat(String(e.target.value).replace(',', '.'));
      if (!Number.isFinite(v)) return majPanneau();
      memoriser();
      const k = valeurActuelle();
      k[j] = v * echelle;
      poserCle(E.piste, k);
      majTout();
    });
  }
  $('visible').addEventListener('change', (e) => {
    memoriser();
    const k = valeurActuelle();
    k[7] = e.target.checked ? 0 : 1;
    poserCle(E.piste, k);
    majTout();
  });
  $('corde').addEventListener('input', (e) => {
    const k = valeurActuelle('corde');
    k[1] = Number(e.target.value) / 100;
    poserCle('corde', k);
    majFrise();
  });
  $('corde').addEventListener('pointerdown', memoriser);
  $('attachee').addEventListener('change', (e) => basculerAttache(e.target.checked));
  $('arret').addEventListener('change', (e) => {
    const cles = E.selection.filter((x) => x.type === 'cle');
    if (!cles.length) return;
    memoriser();
    for (const x of cles) x.cle[8] = e.target.checked ? 1 : 0; // toutes les clés choisies
    marquerModifie();
    majTout();
  });

  // Sons
  const choixSon = $('choix-son');
  remplirChoixSons();
  $('btn-ecouter').addEventListener('click', () => { initSons(0.8, 0); ecouter(choixSon.value); });
  $('btn-ajout-son').addEventListener('click', () => {
    initSons(0.8, 0);
    memoriser();
    const s = [r4(E.t), choixSon.value];
    E.anim.sons.push(s);
    E.anim.sons.sort((a, b) => a[0] - b[0]);
    E.choix = { type: 'son', son: s };
    E.selection = [E.choix];
    ecouter(s[1]);
    marquerModifie();
    majTout();
  });

  preparerFrise();

  addEventListener('keydown', (e) => {
    if (e.target.closest('input, select, textarea')) return;
    const ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && e.code === 'KeyZ') { e.preventDefault(); if (e.shiftKey) retablir(); else annuler(); return; }
    if (ctrl && e.code === 'KeyY') { e.preventDefault(); retablir(); return; }
    if (ctrl && e.code === 'KeyS') { e.preventDefault(); enregistrer(); return; }
    if (ctrl && e.code === 'KeyC') { if (!copierCles()) copierPose(); return; }
    if (ctrl && e.code === 'KeyV') { if (!collerCles()) collerPose(); return; }
    if (ctrl && e.code === 'KeyA') { e.preventDefault(); toutSelectionner(); return; }
    if (ctrl) return;
    if (e.code === 'Space') { e.preventDefault(); if (E.lecture) arreter(); else lire(); }
    else if (e.code === 'KeyK') { memoriser(); poserCle(E.piste, valeurActuelle()); majTout(); }
    else if (e.code === 'Delete' || e.code === 'Backspace') { e.preventDefault(); supprimerChoix(); }
    else if (e.code === 'Escape') { viderSelection(); majTout(); }
    else if (e.code === 'KeyG') choisirOutil('translate');
    else if (e.code === 'KeyR') choisirOutil('rotate');
    else if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      e.preventDefault();
      const pas = e.shiftKey ? 0.1 : 1 / 60;
      E.t = borne(E.t + (e.code === 'ArrowLeft' ? -pas : pas), 0, E.anim.duree);
      viderSelection();
      E.sale = true;
    } else if (e.code === 'Home') { E.t = 0; E.sale = true; } else if (e.code === 'End') { E.t = E.anim.duree; E.sale = true; }
  });
  addEventListener('beforeunload', (e) => { if (E.modifie) { e.preventDefault(); e.returnValue = ''; } });
}

// Joue un son tout de suite (un son perso est d'abord téléchargé)
function ecouter(nom) {
  initSons(0.8, 0);
  chargerSon(nom).then(() => son(nom, { vol: 0.8 }));
}

// Listes des sons : ceux du jeu, puis les tiens
function remplirChoixSons() {
  const choixSon = $('choix-son');
  const avant = choixSon.value;
  choixSon.textContent = '';
  const jeu = document.createElement('optgroup');
  jeu.label = 'Sons du jeu';
  for (const [f, nom] of SONS) jeu.append(new Option(nom, f));
  choixSon.append(jeu);
  if (sonsPerso.length) {
    const miens = document.createElement('optgroup');
    miens.label = 'Mes sons';
    for (const x of sonsPerso) miens.append(new Option(x.nom, `perso:${x.id}`));
    choixSon.append(miens);
  }
  if (avant && [...choixSon.options].some((o) => o.value === avant)) choixSon.value = avant;
  const musique = $('musique');
  musique.textContent = '';
  musique.append(new Option('(aucune)', ''));
  for (const x of sonsPerso) musique.append(new Option(x.nom, `perso:${x.id}`));
  if (E.anim && enDanse()) musique.value = E.anim.musique || '';
}

// ---------- Onglets Armes / Danses ----------
function choisirMode(m) {
  if (m === E.mode || !confirmerAbandon()) return;
  arreter();
  E.mode = m;
  E.modifie = false;
  $('mode-armes').classList.toggle('actif', m === 'arme');
  $('mode-danses').classList.toggle('actif', m === 'danse');
  for (const id of ['vue-joueur', 'vue-libre']) $(id).hidden = m === 'danse';
  orbite.enabled = m === 'arme' && E.vue === 'libre';
  orbiteDanse.enabled = m === 'danse';
  if (m === 'danse') {
    if (danses.length) ouvrirDanse(danses[0].id, true); else nouvelleDanse(true);
  } else ouvrirAnimation(E.cle, true);
}

function ouvrirDanse(id, sansConfirmer = false) {
  if (!sansConfirmer && !confirmerAbandon()) return;
  arreter();
  const d = danses.find((x) => x.id === id);
  if (!d) return;
  E.danseId = id;
  E.anim = copie(d);
  E.modifie = false;
  E.t = 0;
  E.historique = [];
  E.futur = [];
  viderSelection();
  E.piste = 'tout';
  majTout();
}

function nouvelleDanse(sansConfirmer = false) {
  if (!sansConfirmer && !confirmerAbandon()) return;
  arreter();
  let id;
  do id = `d${Math.random().toString(36).slice(2, 12)}`; while (!/^d[a-z0-9]{6,16}$/.test(id) || danses.some((x) => x.id === id));
  E.danseId = id;
  E.anim = {
    id, nom: 'Nouvelle danse', duree: 2, mouvement: 'fluide', musique: null, marcher: false, vitesse: 0.7, arme: false,
    pistes: { tout: [[0, 0, 0, 0, 0, 0, 0, 0, 0], [2, 0, 0, 0, 0, 0, 0, 0, 0]] }, sons: [],
  };
  E.modifie = true; // pas encore enregistrée
  E.t = 0;
  E.historique = [];
  E.futur = [];
  viderSelection();
  E.piste = 'tout';
  majTout();
}

// Charge une danse toute prête comme nouvelle danse (pas encore enregistrée : tu peux la modifier avant)
async function chargerModele(m) {
  if (!confirmerAbandon()) return;
  let d;
  try { d = await fetch(`danses-modeles/${m.fichier}`).then((r) => r.json()); } catch { majEtat('✗ Modèle introuvable.'); return; }
  nouvelleDanse(true);
  const existe = (n) => !n.startsWith('perso:') || sonsPerso.some((x) => `perso:${x.id}` === n);
  const sons = (d.sons || []).filter((x) => existe(x[1]));
  Object.assign(E.anim, {
    nom: d.nom, duree: d.duree, mouvement: d.mouvement || 'fluide', musique: d.musique && existe(d.musique) ? d.musique : null,
    marcher: !!d.marcher, vitesse: d.vitesse || 0.7, arme: !!d.arme, pistes: d.pistes, sons,
  });
  majTout();
  majEtat(sons.length < (d.sons || []).length
    ? 'Modèle chargé, mais sa musique n\'est pas dans tes sons : envoie-la puis place-la à 0 s. Enregistre pour le garder.'
    : 'Modèle chargé : regarde-le avec ▶, modifie-le si tu veux, puis Enregistrer.');
}

// Envoie des fichiers son au serveur (un par un)
async function envoyerSons(fichiers) {
  for (const f of fichiers) {
    const nom = f.name.replace(/\.[a-z0-9]+$/i, '').slice(0, 40);
    majEtat(`Envoi de « ${nom} »…`);
    try {
      const r = await fetch(`api/sons?nom=${encodeURIComponent(nom)}`, {
        method: 'POST', headers: { 'Content-Type': f.type && f.type.startsWith('audio/') ? f.type : 'application/octet-stream' }, body: f,
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `Erreur ${r.status}`);
      sonsPerso.push(d.son);
      majEtat(`✓ « ${d.son.nom} » ajouté : choisis-le dans « Son » ou « Musique ».`);
    } catch (e) {
      majEtat(`✗ ${nom} : ${e.message}`);
    }
  }
  remplirChoixSons();
  majListes();
}

async function supprimerSon(x) {
  if (!confirm(`Supprimer le son « ${x.nom} » ? Les danses et animations qui l'utilisent ne le joueront plus.`)) return;
  try {
    const r = await fetch(`api/sons/${x.id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error(`Erreur ${r.status}`);
    sonsPerso = sonsPerso.filter((y) => y !== x);
    remplirChoixSons();
    majListes();
  } catch (e) {
    majEtat(`✗ ${e.message}`);
  }
}

// Attache (attachee = true) ou détache une main de l'arme : pour toutes les clés de main choisies, sinon
// au temps actuel. La position est recalculée pour que la main ne saute pas.
function basculerAttache(attachee) {
  if (enDanse()) return;
  let cibles = E.selection.filter((x) => x.type === 'cle' && (x.piste === 'mainD' || x.piste === 'mainG'));
  if (!cibles.length) {
    if (E.piste !== 'mainD' && E.piste !== 'mainG') return;
    cibles = [{ piste: E.piste, temps: E.t }];
  }
  memoriser();
  const tActuel = E.t;
  const u = vue.modele.userData;
  const nouvelles = [];
  for (const c of cibles) {
    const p = c.piste;
    E.t = c.cle ? c.cle[0] : c.temps;
    poser(true);
    const d = vue.derniere;
    const ecran = p === 'mainD' ? d.mainDEcran : d.mainGEcran;
    const k = valeurActuelle(p);
    if (ecran) {
      if (attachee) {
        const local = vue.modele.worldToLocal(ecran.clone());
        const b = base[p];
        k[1] = local.x - b.x; k[2] = local.y - b.y; k[3] = local.z - b.z;
      } else {
        const r = vue.mainReposEcran(u, p === 'mainD' ? 'D' : 'G');
        k[1] = ecran.x - r.x; k[2] = ecran.y - r.y; k[3] = ecran.z - r.z;
      }
    }
    k[9] = attachee ? 0 : 1;
    if (c.cle) k[8] = c.cle[8];
    poserCle(p, k);
    nouvelles.push(E.choix);
  }
  E.t = tActuel;
  E.selection = nouvelles;
  E.choix = nouvelles[nouvelles.length - 1] || null;
  marquerModifie();
  majTout();
}

function choisirVue(v) {
  E.vue = v;
  orbite.enabled = v === 'libre';
  $('vue-joueur').classList.toggle('actif', v === 'joueur');
  $('vue-libre').classList.toggle('actif', v === 'libre');
  majGizmo();
  majAideVue();
}

function choisirOutil(o) {
  E.outil = o;
  $('outil-deplacer').classList.toggle('actif', o === 'translate');
  $('outil-tourner').classList.toggle('actif', o === 'rotate');
  majGizmo();
  majAideVue();
}

function choisirPiste(p) {
  E.piste = p;
  if (E.selection.length <= 1 && E.choix && E.choix.type === 'cle' && E.choix.piste !== p) viderSelection();
  E.sale = true;
  majTout();
}

function copierPose() {
  E.pressePapier = { piste: E.piste, valeur: valeurActuelle().slice(1) };
  majEtat(`Pose de « ${nomPiste(E.piste)} » copiée.`);
}

function collerPose() {
  const pp = E.pressePapier;
  if (!pp) return;
  if (pp.piste !== E.piste) { majEtat(`Cette pose est celle de « ${nomPiste(pp.piste)} » : choisis la même pièce pour la coller.`); return; }
  memoriser();
  poserCle(E.piste, [E.t, ...pp.valeur]);
  majTout();
}

function majTout() {
  majListes();
  majAnimation();
  majFrise();
  majPanneau();
  majGizmo();
  majEtat();
  majAideVue();
  E.sale = true;
}

function bouton(texte, classe, quandClic) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = classe || '';
  b.textContent = texte;
  b.addEventListener('click', quandClic);
  return b;
}

function majListes() {
  if (enDanse()) return majListesDanses();
  $('titre-liste1').textContent = 'Arme';
  $('titre-liste2').textContent = 'Animation';
  const armes = $('liste-armes');
  armes.textContent = '';
  for (const [cat, titre] of CATEGORIES) {
    const liste = ARMES.map((a, i) => [a, i]).filter(([a]) => a.categorie === cat);
    if (!liste.length) continue;
    const h = document.createElement('div');
    h.className = 'categorie';
    h.textContent = titre;
    armes.append(h);
    for (const [a, i] of liste) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = i === E.i ? 'actif' : '';
      b.textContent = a.nom;
      if (enregistrees[a.id] && Object.keys(enregistrees[a.id]).length) {
        const point = document.createElement('span');
        point.className = 'point';
        point.textContent = '●';
        point.title = 'A des animations perso';
        b.append(point);
      }
      b.addEventListener('click', () => { if (i !== E.i) choisirArme(i); });
      armes.append(b);
    }
  }
  const anims = $('liste-anims');
  anims.textContent = '';
  const arme = ARMES[E.i];
  for (const def of ANIMATIONS.filter((a) => a.pour(arme))) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = def.cle === E.cle ? 'actif' : '';
    const nom = document.createElement('span');
    nom.textContent = def.nom;
    const d = document.createElement('small');
    d.textContent = def.libre ? 'libre' : secondes(dureeAnimation(arme, def.cle, null));
    b.append(nom, d);
    if (enregistrees[arme.id]?.[def.cle]) {
      const point = document.createElement('span');
      point.className = 'point';
      point.textContent = '●';
      point.title = 'Animation perso enregistrée';
      b.append(point);
    }
    b.addEventListener('click', () => { if (def.cle !== E.cle) ouvrirAnimation(def.cle); });
    anims.append(b);
  }
}

// Onglet Danses : la liste des danses et la bibliothèque de sons
function majListesDanses() {
  $('titre-liste1').textContent = 'Danses';
  $('titre-liste2').textContent = 'Mes sons';
  const l1 = $('liste-armes');
  l1.textContent = '';
  l1.append(bouton('+ Nouvelle danse', 'nouveau', () => nouvelleDanse()));
  const liste = danses.slice();
  if (!liste.some((d) => d.id === E.danseId)) liste.push({ id: E.danseId, nom: E.anim.nom, nouvelle: true });
  for (const d of liste) {
    const b = bouton(d.id === E.danseId ? E.anim.nom : d.nom, d.id === E.danseId ? 'actif' : '', () => { if (d.id !== E.danseId) ouvrirDanse(d.id); });
    if (d.nouvelle) { const i = document.createElement('small'); i.textContent = 'pas enregistrée'; b.append(i); }
    l1.append(b);
  }
  if (modelesDanse.length) {
    const h = document.createElement('div');
    h.className = 'categorie';
    h.textContent = 'Modèles tout prêts';
    l1.append(h);
    for (const m of modelesDanse) {
      const b = bouton(m.nom, '', () => chargerModele(m));
      b.title = m.description || '';
      l1.append(b);
    }
  }
  const l2 = $('liste-anims');
  l2.textContent = '';
  l2.append(bouton('📁 Envoyer des sons…', 'nouveau', () => $('fichier-son').click()));
  if (!sonsPerso.length) {
    const i = document.createElement('div');
    i.className = 'info';
    i.textContent = 'Aucun son pour l\'instant. MP3, OGG, WAV ou M4A, 4 Mo maximum.';
    l2.append(i);
  }
  for (const x of sonsPerso) {
    const ligne = document.createElement('div');
    ligne.className = 'son-perso';
    const n = document.createElement('span');
    n.textContent = x.nom;
    n.title = `${x.nom} (${Math.round(x.taille / 1024)} Ko)`;
    ligne.append(bouton('▶', '', () => ecouter(`perso:${x.id}`)), n, bouton('🗑', '', () => supprimerSon(x)));
    l2.append(ligne);
  }
}

function majAnimation() {
  $('bloc-nom').hidden = !enDanse();
  $('bloc-musique').hidden = !enDanse();
  $('bloc-options-danse').hidden = !enDanse();
  $('aide-musique').hidden = !enDanse();
  $('btn-importer').hidden = enDanse();
  if (enDanse()) {
    const sauvee = danses.some((d) => d.id === E.danseId);
    $('titre-anim').textContent = `Danse · ${E.anim.nom}`;
    $('aide-anim').textContent = 'La danse se répète en boucle tant que le joueur ne bouge pas. Touche B dans le jeu pour danser.';
    if (document.activeElement !== $('nom-danse')) $('nom-danse').value = E.anim.nom;
    $('duree-fixe').hidden = true;
    $('duree-libre').hidden = false;
    $('duree').min = DUREE_DANSE[0];
    $('duree').max = DUREE_DANSE[1];
    $('duree').value = E.anim.duree;
    $('aide-duree').textContent = `Durée d'un tour de danse, entre ${secondes(DUREE_DANSE[0])} et ${secondes(DUREE_DANSE[1])}. Changer la durée accélère ou ralentit toute la danse.`;
    $('mouvement').value = E.anim.mouvement;
    $('musique').value = E.anim.musique || '';
    $('opt-marcher').checked = !!E.anim.marcher;
    $('opt-arme').checked = !!E.anim.arme;
    $('bloc-vitesse-danse').hidden = !E.anim.marcher;
    if (document.activeElement !== $('opt-vitesse')) $('opt-vitesse').value = E.anim.vitesse || 0.7;
    $('btn-origine').textContent = 'Supprimer cette danse';
    $('btn-origine').disabled = !sauvee;
    return;
  }
  $('btn-origine').textContent = 'Supprimer mon animation (remettre celle du jeu)';
  const arme = ARMES[E.i];
  const def = ANIMATION[E.cle];
  $('titre-anim').textContent = `${arme.nom} · ${def.nom}`;
  $('aide-anim').textContent = arme.parCartouche && def.aideCartouche ? def.aideCartouche : def.aide;
  $('duree-fixe').hidden = !!def.libre;
  $('duree-libre').hidden = !def.libre;
  if (def.libre) {
    $('duree').min = def.libre[0];
    $('duree').max = def.libre[1];
    $('duree').value = E.anim.duree;
    let aide = `Entre ${secondes(def.libre[0])} et ${secondes(def.libre[1])}. Changer la durée accélère ou ralentit toute l'animation.`;
    if (E.cle === 'tir' && arme.cadenceMs) aide += ` Temps entre deux tirs de cette arme : ${secondes(arme.cadenceMs / 1000)}.`;
    $('aide-duree').textContent = aide;
  } else {
    $('duree-fixe').textContent = secondes(E.anim.duree);
    $('aide-duree').textContent = 'Imposée par le jeu : ton animation se joue exactement dans ce temps.';
  }
  $('mouvement').value = E.anim.mouvement;
  $('btn-origine').disabled = !enregistrees[arme.id]?.[E.cle];
}

function majEtat(message) {
  const demiTours = E.anim ? clesQuiFontDemiTour() : 0;
  $('btn-tours').classList.toggle('alerte', demiTours > 0);
  const sauvee = enDanse() ? danses.some((d) => d.id === E.danseId) : enregistrees[ARMES[E.i].id]?.[E.cle];
  const st = $('statut-anim');
  st.className = 'statut';
  if (E.modifie) st.textContent = 'Modifiée, pas encore enregistrée.';
  else if (enDanse()) { st.textContent = 'Danse enregistrée : les joueurs peuvent la faire avec la touche B.'; st.classList.add('perso'); }
  else if (sauvee) { st.textContent = 'Ton animation (enregistrée) : c\'est elle qui est utilisée dans le jeu.'; st.classList.add('perso'); } else st.textContent = 'Animation d\'origine du jeu, recopiée en clés. Modifie-la puis enregistre.';
  const etat = $('etat-sauvegarde');
  etat.className = `etat${E.modifie ? ' modifie' : ''}`;
  etat.textContent = message || (demiTours ? `⚠ ${demiTours} clé(s) font repartir une pièce dans l'autre sens : clique sur « ↻ Réparer les tours »` : E.modifie ? '● Pas enregistré' : '');
  $('btn-annuler').disabled = !E.historique.length;
  $('btn-retablir').disabled = !E.futur.length;
}

function majAideVue() {
  if (enDanse()) {
    const p = NOMS_DANSE[E.piste];
    const outil = E.outil === 'translate' ? 'déplace-la avec les flèches' : 'tourne-la avec les cercles';
    $('aide-vue').textContent = `${p} : ${outil}. Clique sur une partie du corps pour la choisir · Caméra : clic gauche tourner, molette zoom, clic droit glisser.`;
    return;
  }
  const p = NOMS_PISTES[E.piste];
  const outil = E.piste === 'corde' ? 'règle la corde avec le curseur à droite'
    : (E.piste === 'mainD' || E.piste === 'mainG') ? 'déplace la boule orange avec les flèches'
      : E.outil === 'rotate' ? 'tourne-la avec les cercles' : 'déplace-la avec les flèches';
  const camera = E.vue === 'libre' ? ' · Caméra : clic gauche tourner, molette zoom, clic droit glisser' : '';
  $('aide-vue').textContent = `${p} : ${outil}. Clique sur une pièce pour la choisir${camera}.`;
}

function majPanneau() {
  const p = E.piste;
  const v = valeurActuelle(p);
  const main = p === 'mainD' || p === 'mainG';
  $('titre-piste').textContent = enDanse() ? `Partie : ${NOMS_DANSE[p]}` : `Pièce : ${NOMS_PISTES[p]}`;
  $('bloc-position').hidden = p === 'corde';
  $('bloc-rotation').hidden = p === 'corde' || (!enDanse() && main);
  $('bloc-visible').hidden = enDanse() || p === 'corde' || p === 'arme' || p === 'mainD';
  $('bloc-attachee').hidden = enDanse() || !main;
  if (main) {
    const clesMains = E.selection.filter((x) => x.type === 'cle' && (x.piste === 'mainD' || x.piste === 'mainG'));
    $('attachee').checked = clesMains.length ? !clesMains.every((x) => x.cle[9]) : (v[9] || 0) < 0.5;
    $('texte-attachee').textContent = clesMains.length > 1 ? `Mains attachées à l'arme (${clesMains.length} clés)` : 'Main attachée à l\'arme';
  }
  $('texte-visible').textContent = p === 'mainG' ? 'Main gauche visible' : 'Visible';
  $('bloc-corde').hidden = p !== 'corde';
  const ecrire = (id, val) => { const el = $(id); if (document.activeElement !== el) el.value = Math.round(val * 10) / 10; };
  ecrire('px', v[1] * 100); ecrire('py', v[2] * 100); ecrire('pz', v[3] * 100);
  ecrire('rx', v[4] * DEG); ecrire('ry', v[5] * DEG); ecrire('rz', v[6] * DEG);
  $('visible').checked = !v[7];
  if (document.activeElement !== $('corde')) $('corde').value = Math.round(borne(v[1], 0, 1) * 100);
  const cles = E.selection.filter((x) => x.type === 'cle');
  $('bloc-arret').hidden = !cles.length;
  $('arret').checked = cles.length > 0 && cles.every((x) => x.cle[8]);
  $('texte-arret').textContent = cles.length > 1 ? `Arrêt sur ces ${cles.length} clés` : 'Arrêt sur cette clé';
  const n = E.selection.length;
  $('btn-suppr-cle').disabled = !n;
  $('btn-suppr-cle').textContent = n > 1 ? `Supprimer (${n})` : E.choix && E.choix.type === 'son' ? 'Supprimer le son' : 'Supprimer la clé';
  $('btn-coller').disabled = !E.pressePapier;
}

// ---------- Frise (ligne de temps) ----------
function preparerFrise() {
  const zone = $('zone-pistes');
  const cadre = $('cadre-selection');
  zone.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const rect = $('regle').getBoundingClientRect();
    const tDe = (x, libre) => {
      const t = borne((x - rect.left) / rect.width, 0, 1) * E.anim.duree;
      return libre ? r4(t) : Math.min(E.anim.duree, Math.round(t * 100) / 100); // pas de 1/100 s (Alt : sans arrondi)
    };
    const el = e.target;
    const ajouter = e.shiftKey || e.ctrlKey || e.metaKey;
    if (E.lecture) arreter();
    let bouge = false;
    let deplacer = () => {};
    let finir = () => {};
    const element = el.classList.contains('cle') ? { type: 'cle', piste: el.dataset.piste, cle: E.anim.pistes[el.dataset.piste][Number(el.dataset.i)] }
      : el.classList.contains('son') ? { type: 'son', son: E.anim.sons[Number(el.dataset.i)] } : null;
    if (element) {
      // Une clé (ou un son) : clic = la choisir ; Maj/Ctrl + clic = l'ajouter ou l'enlever de la sélection
      if (ajouter) choisirElement(element, true);
      else if (!estSelectionne(element)) choisirElement(element, false);
      else E.choix = E.selection.find((y) => memeElement(element, y));
      if (element.type === 'cle') E.piste = element.piste;
      const tElement = element.type === 'cle' ? element.cle[0] : element.son[0];
      E.t = tElement;
      if (element.type === 'son') initSons(0.8, 0);
      // Glisser : toutes les clés choisies bougent ensemble
      const groupe = estSelectionne(element) ? E.selection.slice() : [];
      const depart = groupe.map((x) => (x.type === 'cle' ? x.cle[0] : x.son[0]));
      const tMin = Math.min(...depart); const tMax = Math.max(...depart);
      const x0 = e.clientX;
      deplacer = (ev) => {
        if (!groupe.length || (!bouge && Math.abs(ev.clientX - x0) < 3)) return;
        if (!bouge) { memoriser(); bouge = true; }
        const delta = borne(tDe(ev.clientX, ev.altKey) - tElement, -tMin, E.anim.duree - tMax);
        groupe.forEach((x, i) => { const t = r4(depart[i] + delta); if (x.type === 'cle') x.cle[0] = t; else x.son[0] = t; });
        for (const l of Object.values(E.anim.pistes)) l.sort((p, q) => p[0] - q[0]);
        E.anim.sons.sort((p, q) => p[0] - q[0]);
        E.t = r4(tElement + delta);
        marquerModifie();
        majFrise();
      };
      finir = () => { if (!bouge && element.type === 'son' && !ajouter) ecouter(element.son[1]); };
    } else if (el.closest('#regle')) {
      // La règle : on déplace la tête de lecture
      E.t = tDe(e.clientX, e.altKey);
      deplacer = (ev) => { E.t = tDe(ev.clientX, ev.altKey); E.sale = true; majTete(); };
    } else {
      // Dans les pistes : clic = tête de lecture ici ; glisser = cadre de sélection
      const ligne = el.closest('[data-piste]');
      const x0 = e.clientX; const y0 = e.clientY;
      const deja = ajouter ? E.selection.slice() : [];
      deplacer = (ev) => {
        if (!bouge && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 5) return;
        bouge = true;
        const r = cadre.parentElement.getBoundingClientRect();
        const gauche = Math.min(x0, ev.clientX); const haut = Math.min(y0, ev.clientY);
        Object.assign(cadre.style, { left: `${gauche - r.left}px`, top: `${haut - r.top}px`, width: `${Math.abs(ev.clientX - x0)}px`, height: `${Math.abs(ev.clientY - y0)}px` });
        cadre.hidden = false;
        const dedans = elementsDansCadre(gauche, haut, Math.max(x0, ev.clientX), Math.max(y0, ev.clientY));
        E.selection = deja.concat(dedans.filter((x) => !deja.some((y) => memeElement(x, y))));
        E.choix = E.selection[E.selection.length - 1] || null;
        majFrise();
      };
      finir = () => {
        cadre.hidden = true;
        if (bouge) return;
        if (!ajouter) viderSelection();
        if (ligne && ligne.dataset.piste !== 'sons') E.piste = ligne.dataset.piste;
        E.t = tDe(e.clientX, e.altKey);
        E.sale = true;
      };
    }
    zone.setPointerCapture(e.pointerId);
    const fin = () => {
      zone.removeEventListener('pointermove', deplacer);
      zone.removeEventListener('pointerup', fin);
      zone.removeEventListener('pointercancel', fin);
      finir();
      majTout();
    };
    zone.addEventListener('pointermove', deplacer);
    zone.addEventListener('pointerup', fin);
    zone.addEventListener('pointercancel', fin);
    majTout();
  });
  $('noms-pistes').addEventListener('click', (e) => {
    const n = e.target.closest('[data-piste]');
    if (n && n.dataset.piste !== 'sons') choisirPiste(n.dataset.piste);
  });
}

// Les clés et les sons dont le centre est dans le cadre (coordonnées de l'écran)
function elementsDansCadre(x1, y1, x2, y2) {
  const res = [];
  for (const m of $('pistes').querySelectorAll('.cle, .son')) {
    const r = m.getBoundingClientRect();
    const cx = m.classList.contains('son') ? r.left : r.left + r.width / 2; // un son commence à son bord gauche
    const cy = r.top + r.height / 2;
    if (cx < x1 || cx > x2 || cy < y1 || cy > y2) continue;
    if (m.classList.contains('son')) res.push({ type: 'son', son: E.anim.sons[Number(m.dataset.i)] });
    else res.push({ type: 'cle', piste: m.dataset.piste, cle: E.anim.pistes[m.dataset.piste][Number(m.dataset.i)] });
  }
  return res;
}

function majFrise() {
  const d = E.anim.duree;
  const pistes = pistesActives();
  const regle = $('regle');
  regle.textContent = '';
  // un chiffre à chaque grand trait (environ 8 sur la règle), un petit trait entre deux
  const pas = [0.05, 0.1, 0.25, 0.5, 1].find((p) => d / p <= 10) || 1;
  const decimales = pas < 0.1 ? 2 : pas < 1 ? (pas === 0.25 ? 2 : 1) : 0;
  for (let n = 0; n * pas <= d + 1e-6; n++) {
    const t = n * pas;
    for (const [tt, grand] of [[t, true], [t + pas / 2, false]]) {
      if (tt > d + 1e-6) continue;
      const i = document.createElement('i');
      i.className = grand ? 'grand' : '';
      i.style.left = `${(tt / d) * 100}%`;
      regle.append(i);
    }
    if (t < d - pas * 0.4) {
      const b = document.createElement('b');
      b.textContent = t.toFixed(decimales).replace('.', ',');
      b.style.left = `${(t / d) * 100}%`;
      regle.append(b);
    }
  }
  const noms = $('noms-pistes');
  noms.textContent = '';
  const titre = document.createElement('div');
  titre.textContent = 'Secondes';
  noms.append(titre);
  const lignes = $('pistes');
  lignes.textContent = '';
  for (const p of [...pistes, 'sons']) {
    const n = document.createElement('div');
    n.dataset.piste = p;
    n.textContent = p === 'sons' ? '♪ Sons' : nomPiste(p);
    if (p === E.piste) n.className = 'actif';
    noms.append(n);
    const ligne = document.createElement('div');
    ligne.dataset.piste = p;
    if (p === E.piste) ligne.className = 'actif';
    if (p === 'sons') {
      E.anim.sons.forEach((s, i) => {
        const m = document.createElement('div');
        m.className = `son${estSelectionne({ type: 'son', son: s }) ? ' choisie' : ''}`;
        m.dataset.i = i;
        m.style.left = `${(s[0] / d) * 100}%`;
        m.textContent = `♪ ${nomSon(s[1])}`;
        m.title = `${nomSon(s[1])} à ${secondes(s[0])}`;
        ligne.append(m);
      });
    } else {
      (E.anim.pistes[p] || []).forEach((c, i) => {
        const m = document.createElement('div');
        m.className = `cle${c[7] ? ' cachee' : ''}${c[8] ? ' arret' : ''}${c[9] ? ' libre' : ''}${estSelectionne({ type: 'cle', piste: p, cle: c }) ? ' choisie' : ''}`;
        m.dataset.piste = p;
        m.dataset.i = i;
        m.style.left = `${(c[0] / d) * 100}%`;
        m.title = `${secondes(c[0])}${c[7] ? ' (caché)' : ''}${c[8] ? ' (arrêt)' : ''}${c[9] ? ' (main détachée de l\'arme)' : ''}`;
        ligne.append(m);
      });
    }
    lignes.append(ligne);
  }
  majTete();
}

function majTete() {
  $('tete').style.left = `${(E.t / E.anim.duree) * 100}%`;
  $('temps-actuel').textContent = `${secondes(E.t)} / ${secondes(E.anim.duree)}`;
}

// ---------- Enregistrer ----------
async function enregistrer() {
  if (enDanse()) return enregistrerDanse();
  const arme = ARMES[E.i];
  $('btn-enregistrer').disabled = true;
  try {
    const r = await fetch(`api/animations/${arme.id}/${E.cle}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ animation: E.anim }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || (r.status === 413 ? 'Animation trop grosse : enlève des clés.' : `Erreur ${r.status}`));
    (enregistrees[arme.id] || (enregistrees[arme.id] = {}))[E.cle] = d.animation;
    E.anim = copie(d.animation);
    E.modifie = false;
    viderSelection();
    majTout();
    majEtat('✓ Enregistré : c\'est en jeu !');
    $('etat-sauvegarde').classList.add('ok');
  } catch (e) {
    majEtat(`✗ ${e.message}`);
  } finally {
    $('btn-enregistrer').disabled = false;
  }
}

async function enregistrerDanse() {
  $('btn-enregistrer').disabled = true;
  try {
    const r = await fetch(`api/danses/${E.danseId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/vnd.fps+json' }, body: JSON.stringify({ danse: E.anim }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || `Erreur ${r.status}`);
    const i = danses.findIndex((x) => x.id === d.danse.id);
    if (i >= 0) danses[i] = d.danse; else danses.push(d.danse);
    E.anim = copie(d.danse);
    E.modifie = false;
    viderSelection();
    majTout();
    majEtat('✓ Enregistrée : les joueurs peuvent danser !');
    $('etat-sauvegarde').classList.add('ok');
  } catch (e) {
    majEtat(`✗ ${e.message}`);
  } finally {
    $('btn-enregistrer').disabled = false;
  }
}

async function supprimerEnregistree() {
  if (enDanse()) {
    if (!danses.some((x) => x.id === E.danseId) || !confirm(`Supprimer la danse « ${E.anim.nom} » ?`)) return;
    try {
      const r = await fetch(`api/danses/${E.danseId}`, { method: 'DELETE' });
      if (!r.ok) throw new Error(`Erreur ${r.status}`);
      danses = danses.filter((x) => x.id !== E.danseId);
      E.modifie = false;
      if (danses.length) ouvrirDanse(danses[0].id, true); else nouvelleDanse(true);
      majEtat('Danse supprimée.');
    } catch (e) {
      majEtat(`✗ ${e.message}`);
    }
    return;
  }
  const arme = ARMES[E.i];
  if (!enregistrees[arme.id]?.[E.cle]) return;
  if (!confirm('Supprimer ton animation ? Le jeu reprendra son animation d\'origine.')) return;
  try {
    const r = await fetch(`api/animations/${arme.id}/${E.cle}`, { method: 'DELETE' });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || `Erreur ${r.status}`);
    delete enregistrees[arme.id][E.cle];
    E.modifie = false;
    ouvrirAnimation(E.cle, true);
    majEtat('Animation d\'origine remise.');
  } catch (e) {
    majEtat(`✗ ${e.message}`);
  }
}

demarrer();
