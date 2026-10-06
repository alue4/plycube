// Éditeur de cartes (réservé à l'admin). On pose des blocs en 3D (comme dans Minecraft) pour
// fabriquer sa propre carte, puis on l'enregistre : elle apparaît alors dans le choix des cartes du jeu.
// Le serveur (serveur/cartes.js) revérifie tout avant d'accepter la carte.
import * as THREE from '../vendor/three.min.js';
import { OrbitControls } from '../vendor/addons/OrbitControls.js';
import { materiau } from './textures.js';

const $ = (id) => document.getElementById(id);

// Mêmes matières que le serveur (serveur/cartes.js). L'ordre = l'ordre dans la palette.
const MATIERES = [
  'herbe', 'terre', 'sable', 'pierre', 'pave', 'pierre_chateau', 'brique', 'beton', 'asphalte', 'trottoir',
  'bois', 'planches', 'caisse', 'tronc', 'feuilles', 'palmier', 'feuilles_palmier', 'paille',
  'toit_rouge', 'toit_ardoise', 'metal', 'metal_rouge', 'metal_bleu', 'metal_jaune', 'pneu',
  'lampe', 'neon', 'neon_rouge', 'tissu_bleu', 'tissu_rouge', 'vitre', 'trampoline', 'invisible',
];
const NOMS = {
  herbe: 'Herbe', terre: 'Terre', sable: 'Sable', pierre: 'Pierre', pave: 'Pavé', pierre_chateau: 'Pierre château',
  brique: 'Brique', beton: 'Béton', asphalte: 'Asphalte', trottoir: 'Trottoir', bois: 'Bois', planches: 'Planches',
  caisse: 'Caisse', tronc: 'Tronc', feuilles: 'Feuilles', palmier: 'Palmier', feuilles_palmier: 'Palmes', paille: 'Paille',
  toit_rouge: 'Toit rouge', toit_ardoise: 'Ardoise', metal: 'Métal', metal_rouge: 'Métal rouge', metal_bleu: 'Métal bleu',
  metal_jaune: 'Métal jaune', pneu: 'Pneu', lampe: 'Lampe', neon: 'Néon', neon_rouge: 'Néon rouge',
  tissu_bleu: 'Tissu bleu', tissu_rouge: 'Tissu rouge', vitre: 'Vitre', trampoline: 'Trampoline', invisible: 'Invisible',
};
const CIELS = {
  jour: ['#2f7fe0', '#cdeaff', '#5d7a3a'], soir: ['#3b5fa6', '#ffcf96', '#4f5d35'],
  nuit: ['#0a1026', '#24314f', '#1a1f30'], plage: ['#1d86de', '#c4f1ff', '#cbb37c'],
};
const COULEURS_EQUIPE = [0x3d8bff, 0xff5a5a];

// ---------- État de la carte en cours d'édition ----------
const E = {
  id: null, nom: '', taille: 30, ambiance: 'jour', eau: null,
  boites: [], decors: [], apparitions: [],
  outil: 'bloc', matiere: 'pierre', hauteur: 1, decor: false, equipe: '',
  modifie: false,
};
let cartesPerso = []; // les cartes de l'admin (pour le menu déroulant)
const historique = [];

// ---------- Three.js ----------
let renderer; let scene; let camera; let orbite; let canvas;
const groupeBoites = new THREE.Group();
const groupeSpawns = new THREE.Group();
const matCache = new Map();
let apercu; let plan; let grille;
let premierCoin = null; // outil « boîte » : premier coin cliqué

const matDe = (nom) => {
  if (nom === 'invisible') {
    if (!matCache.has('invisible')) matCache.set('invisible', new THREE.MeshLambertMaterial({ color: 0x7fd4ff, transparent: true, opacity: 0.22, depthWrite: false }));
    return matCache.get('invisible');
  }
  if (!matCache.has(nom)) matCache.set(nom, materiau(nom) || new THREE.MeshLambertMaterial({ color: 0x888888 }));
  return matCache.get(nom);
};

function demarrer() {
  canvas = $('vue3d');
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch {
    return bloquer('3D indisponible', 'Ton navigateur ne peut pas afficher la 3D (WebGL).');
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0e1630);
  camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
  camera.position.set(28, 28, 28);
  orbite = new OrbitControls(camera, canvas);
  orbite.enableDamping = true;
  orbite.dampingFactor = 0.12;
  orbite.mouseButtons = { LEFT: null, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
  orbite.touches = { ONE: null, TWO: THREE.TOUCH.DOLLY_ROTATE };
  scene.add(new THREE.HemisphereLight(0xdff1ff, 0x30304a, 1.5));
  const soleil = new THREE.DirectionalLight(0xffffff, 1.6);
  soleil.position.set(30, 50, 20);
  scene.add(soleil);
  scene.add(groupeBoites, groupeSpawns);

  // Plan (pour poser au sol) + grille
  plan = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshBasicMaterial({ visible: false }));
  plan.rotation.x = -Math.PI / 2;
  scene.add(plan);
  grille = new THREE.GridHelper(2, 2, 0x7fe8ff, 0x3a4a6a);
  scene.add(grille);

  // Aperçu du bloc visé (cube en fil de fer)
  apercu = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff8a1f, wireframe: true }));
  apercu.visible = false;
  scene.add(apercu);

  redimensionner();
  addEventListener('resize', redimensionner);
  brancherSouris();
  brancherUI();
  construirePalette();
  nouvelleCarte(false);
  chargerListe();
  boucle();
  // Pour les tests automatiques uniquement (adresse terminée par ?debug)
  if (location.search.includes('debug')) window.__ed = { E, cibler, appliquerOutil, reconstruire, poserBoite, enregistrer, choisirOutil };
}

function redimensionner() {
  const r = canvas.getBoundingClientRect();
  renderer.setSize(r.width, r.height, false);
  camera.aspect = r.width / Math.max(1, r.height);
  camera.updateProjectionMatrix();
}

function boucle() {
  requestAnimationFrame(boucle);
  orbite.update();
  renderer.render(scene, camera);
}

// ---------- Construction de la scène depuis l'état ----------
function reconstruire() {
  const partages = new Set(matCache.values()); // matières partagées : on ne les libère pas
  for (const g of [groupeBoites, groupeSpawns]) {
    while (g.children.length) {
      const o = g.children[0];
      g.remove(o);
      o.traverse((x) => {
        if (x.geometry) x.geometry.dispose();
        const mats = Array.isArray(x.material) ? x.material : (x.material ? [x.material] : []);
        for (const mm of mats) if (!partages.has(mm)) mm.dispose();
      });
    }
  }
  E.boites.forEach((b, i) => ajouterMesh(b, 'boite', i));
  E.decors.forEach((b, i) => ajouterMesh(b, 'decor', i));
  E.apparitions.forEach((s, i) => ajouterSpawn(s, i));
  const T = E.taille;
  grille.geometry.dispose();
  grille.geometry = new THREE.GridHelper(2 * T, 2 * T, 0x4a5a7a, 0x2a3a5a).geometry;
  const c = CIELS[E.ambiance] || CIELS.jour;
  scene.background = new THREE.Color(c[0]);
  majCompteur();
}

function ajouterMesh(b, kind, index) {
  const geo = new THREE.BoxGeometry(b[3] - b[0], b[4] - b[1], b[5] - b[2]);
  const m = new THREE.Mesh(geo, matDe(b[6]));
  m.position.set((b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2);
  if (kind === 'decor') { m.material = m.material.clone(); m.material.transparent = true; m.material.opacity = (m.material.opacity || 1) * 0.6; }
  m.userData = { kind, index };
  groupeBoites.add(m);
}

function ajouterSpawn(s, index) {
  const g = new THREE.Group();
  const couleur = s.equipe === 0 || s.equipe === 1 ? COULEURS_EQUIPE[s.equipe] : 0xffd21f;
  const socle = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 16), new THREE.MeshBasicMaterial({ color: couleur, transparent: true, opacity: 0.55 }));
  socle.position.y = 0.05;
  const fleche = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.7, 12), new THREE.MeshBasicMaterial({ color: couleur }));
  fleche.position.set(0, 0.9, -0.35); fleche.rotation.x = Math.PI / 2;
  g.add(socle, fleche);
  g.position.set(s.x, s.y + 0.01, s.z);
  g.rotation.y = (s.angle || 0) * Math.PI / 180;
  g.userData = { kind: 'spawn', index };
  g.traverse((o) => { o.userData = g.userData; });
  groupeSpawns.add(g);
}

function majCompteur() {
  $('compteur').textContent = `${E.boites.length} blocs · ${E.decors.length} décors · ${E.apparitions.length} apparitions`;
}
function marquerModifie() { E.modifie = true; $('etat').textContent = '● modifié'; $('etat').className = 'etat modifie'; }

// ---------- Souris : poser / enlever ----------
const souris = new THREE.Vector2();
const rayon = new THREE.Raycaster();

function cibler(ev) {
  const r = canvas.getBoundingClientRect();
  souris.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  rayon.setFromCamera(souris, camera);
  const inters = rayon.intersectObjects([...groupeBoites.children, ...groupeSpawns.children, plan], false);
  if (!inters.length) return null;
  const hit = inters[0];
  if (hit.object === plan) {
    const p = hit.point;
    return { cellule: [Math.floor(p.x), 0, Math.floor(p.z)], objet: null };
  }
  // sur un bloc (ou un spawn) : la cellule vide adjacente à la face touchée
  const n = hit.face ? hit.face.normal.clone() : new THREE.Vector3(0, 1, 0);
  const p = hit.point.clone().addScaledVector(n, 0.5);
  return { cellule: [Math.floor(p.x), Math.floor(p.y), Math.floor(p.z)], objet: hit.object.userData };
}

function dansLesLimites(c) {
  const T = E.taille;
  return c[0] >= -T && c[0] < T && c[2] >= -T && c[2] < T && c[1] >= 0 && c[1] < 32;
}

function majApercu(ev) {
  const t = cibler(ev);
  if (!t || (E.outil !== 'bloc' && E.outil !== 'boite' && E.outil !== 'apparition') || !dansLesLimites(t.cellule)) { apercu.visible = false; return; }
  const c = t.cellule;
  const h = E.outil === 'apparition' ? 0.2 : Math.max(1, E.hauteur);
  apercu.visible = true;
  apercu.scale.set(1, h, 1);
  apercu.position.set(c[0] + 0.5, c[1] + h / 2, c[2] + 0.5);
}

function brancherSouris() {
  let depart = null;
  canvas.addEventListener('pointerdown', (e) => { if (e.button === 0) depart = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointermove', (e) => majApercu(e));
  canvas.addEventListener('pointerup', (e) => {
    if (e.button !== 0 || !depart) return;
    const bouge = Math.hypot(e.clientX - depart.x, e.clientY - depart.y);
    depart = null;
    if (bouge > 6) return; // c'était un glissement (rotation/zoom), pas un clic
    appliquerOutil(e);
  });
  canvas.addEventListener('pointerleave', () => { apercu.visible = false; });
}

const memeBoite = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6];

function appliquerOutil(ev) {
  const t = cibler(ev);
  if (!t) return;
  if (E.outil === 'gomme') {
    if (!t.objet) return;
    sauverHistorique();
    if (t.objet.kind === 'spawn') E.apparitions.splice(t.objet.index, 1);
    else if (t.objet.kind === 'decor') E.decors.splice(t.objet.index, 1);
    else E.boites.splice(t.objet.index, 1);
    apresEdition();
    return;
  }
  if (!dansLesLimites(t.cellule)) { statut('Clique à l\'intérieur du terrain.', 'erreur'); return; }
  const c = t.cellule;
  if (E.outil === 'apparition') {
    sauverHistorique();
    E.apparitions.push({ x: c[0] + 0.5, y: c[1], z: c[2] + 0.5, angle: angleVersCentre(c[0] + 0.5, c[2] + 0.5), equipe: E.equipe === '' ? null : Number(E.equipe) });
    apresEdition();
    return;
  }
  if (E.outil === 'bloc') {
    poserBoite([c[0], c[1], c[2], c[0] + 1, c[1] + Math.max(1, E.hauteur), c[2] + 1, E.matiere]);
    return;
  }
  if (E.outil === 'boite') {
    if (!premierCoin) { premierCoin = c; statut('Clique le coin opposé de la boîte.'); majApercu(ev); return; }
    const a = premierCoin; premierCoin = null;
    const x0 = Math.min(a[0], c[0]); const x1 = Math.max(a[0], c[0]) + 1;
    const z0 = Math.min(a[2], c[2]); const z1 = Math.max(a[2], c[2]) + 1;
    const y0 = Math.min(a[1], c[1]); const y1 = y0 + Math.max(1, E.hauteur);
    poserBoite([x0, y0, z0, x1, Math.min(32, y1), z1, E.matiere]);
    statut('');
  }
}

function poserBoite(b) {
  const liste = E.decor ? E.decors : E.boites;
  if (liste.some((x) => memeBoite(x, b))) return;
  sauverHistorique();
  liste.push(b);
  apresEdition();
}

const angleVersCentre = (x, z) => (x || z ? Math.round(Math.atan2(x, z) * 180 / Math.PI) : 0);

function apresEdition() { marquerModifie(); reconstruire(); }

// ---------- Historique (annuler) ----------
function instantane() { return JSON.stringify({ boites: E.boites, decors: E.decors, apparitions: E.apparitions }); }
function sauverHistorique() { historique.push(instantane()); if (historique.length > 40) historique.shift(); }
function annuler() {
  if (!historique.length) return;
  const s = JSON.parse(historique.pop());
  E.boites = s.boites; E.decors = s.decors; E.apparitions = s.apparitions;
  marquerModifie(); reconstruire();
}

// ---------- Sol et bords ----------
function bordsEtSol() {
  const T = E.taille;
  const sol = [-T, -1, -T, T, 0, T, 'herbe'];
  const murs = [
    [-T - 1, -1, -T - 1, T + 1, 14, -T, 'invisible'],
    [-T - 1, -1, T, T + 1, 14, T + 1, 'invisible'],
    [-T - 1, -1, -T, -T, 14, T, 'invisible'],
    [T, -1, -T, T + 1, 14, T, 'invisible'],
  ];
  return [sol, ...murs];
}
function remettreSolEtBords() {
  sauverHistorique();
  for (const b of bordsEtSol()) if (!E.boites.some((x) => memeBoite(x, b))) E.boites.unshift(b);
  apresEdition();
}

// ---------- Nouvelle carte ----------
function nouvelleCarte(demander = true) {
  if (demander && E.modifie && !confirm('Commencer une nouvelle carte ? Les changements non enregistrés seront perdus.')) return;
  E.id = null; E.nom = ''; E.taille = 30; E.ambiance = 'jour'; E.eau = null;
  E.boites = bordsEtSol();
  E.decors = [];
  E.apparitions = [
    { x: -4.5, y: 0, z: 0, angle: 90, equipe: null }, { x: 4.5, y: 0, z: 0, angle: -90, equipe: null },
    { x: 0, y: 0, z: -4.5, angle: 180, equipe: null }, { x: 0, y: 0, z: 4.5, angle: 0, equipe: null },
  ];
  historique.length = 0;
  E.modifie = false;
  majChamps();
  reconstruire();
  $('liste-cartes').value = '';
  $('etat').textContent = ''; $('etat').className = 'etat';
  statut('Nouvelle carte. Pose des blocs, des apparitions, puis enregistre !');
}

function majChamps() {
  $('nom').value = E.nom;
  $('taille').value = E.taille;
  $('ambiance').value = E.ambiance;
  $('eau').checked = !!E.eau;
  $('bloc-niveau-eau').hidden = !E.eau;
  if (E.eau) $('niveau-eau').value = E.eau.niveau;
}

// ---------- Charger / enregistrer / supprimer (serveur) ----------
async function chargerListe() {
  try {
    const d = await fetch('api/cartes').then((r) => r.json());
    cartesPerso = Array.isArray(d.cartes) ? d.cartes : [];
  } catch { cartesPerso = []; }
  const sel = $('liste-cartes');
  const actuel = E.id || '';
  sel.replaceChildren(opt('', '— Nouvelle carte —'), ...cartesPerso.map((c) => opt(c.id, c.nom || c.id)));
  sel.value = actuel;
}
const opt = (v, t) => { const o = document.createElement('option'); o.value = v; o.textContent = t; return o; };

function chargerCarte(id) {
  const c = cartesPerso.find((x) => x.id === id);
  if (!c) return;
  if (E.modifie && !confirm('Ouvrir cette carte ? Les changements non enregistrés seront perdus.')) { $('liste-cartes').value = E.id || ''; return; }
  E.id = c.id; E.nom = c.nom || ''; E.taille = c.taille || 30; E.ambiance = c.ambiance || 'jour';
  E.eau = c.eau && Number.isFinite(c.eau.niveau) ? { niveau: c.eau.niveau } : null;
  E.boites = (c.boites || []).map((b) => b.slice());
  E.decors = (c.decors || []).map((b) => b.slice());
  E.apparitions = (c.apparitions || []).map((s) => ({ ...s }));
  historique.length = 0; E.modifie = false;
  majChamps(); reconstruire();
  $('etat').textContent = ''; $('etat').className = 'etat';
  statut(`« ${E.nom} » ouverte.`);
}

async function partirDeCarte() {
  const id = prompt('Copier quelle carte du jeu ? (arene, chateau, ville, ile)', 'arene');
  if (!id) return;
  let c;
  try { c = await fetch(`cartes/${id.trim()}.json`).then((r) => (r.ok ? r.json() : null)); } catch { c = null; }
  if (!c) { statut('Carte introuvable.', 'erreur'); return; }
  const T = Math.min(90, Math.max(16, c.taille || 30));
  const dans = (b) => Math.abs(b[0]) <= T + 2 && Math.abs(b[3]) <= T + 2 && Math.abs(b[2]) <= T + 2 && Math.abs(b[5]) <= T + 2 && b[1] >= -12 && b[4] <= 32;
  E.id = null; E.nom = `${c.nom || id} (copie)`; E.taille = T;
  E.ambiance = 'jour'; E.eau = c.eau && Number.isFinite(c.eau.niveau) ? { niveau: c.eau.niveau } : null;
  E.boites = (c.boites || []).filter((b) => MATIERES.includes(b[6]) && dans(b)).slice(0, 1200).map((b) => b.slice());
  E.decors = (c.decors || []).filter((b) => MATIERES.includes(b[6]) && dans(b)).slice(0, 500).map((b) => b.slice());
  E.apparitions = (c.apparitions || []).filter((s) => Math.abs(s.x) <= T && Math.abs(s.z) <= T).slice(0, 48).map((s) => ({ ...s }));
  historique.length = 0; E.modifie = true;
  majChamps(); reconstruire();
  $('liste-cartes').value = '';
  statut('Carte copiée. Change le nom puis enregistre pour en faire ta carte.');
}

async function enregistrer() {
  E.nom = $('nom').value.trim();
  if (!E.nom) { statut('Donne un nom à ta carte.', 'erreur'); $('nom').focus(); return null; }
  if (!E.apparitions.length) { statut('Pose au moins un point d\'apparition.', 'erreur'); return null; }
  if (!E.id) E.id = 'c' + Math.random().toString(36).slice(2, 12).replace(/[^a-z0-9]/g, '0');
  const carte = { nom: E.nom, taille: E.taille, ambiance: E.ambiance, eau: E.eau, boites: E.boites, decors: E.decors, apparitions: E.apparitions };
  $('btn-enregistrer').disabled = true;
  try {
    const rep = await fetch(`api/cartes/${E.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/vnd.fps+json' }, body: JSON.stringify({ carte }),
    });
    const d = await rep.json().catch(() => ({}));
    if (!rep.ok) { statut(d.error || 'Enregistrement refusé.', 'erreur'); E.id = cartesPerso.some((c) => c.id === E.id) ? E.id : null; return null; }
    E.modifie = false;
    $('etat').textContent = '✓ enregistré'; $('etat').className = 'etat ok';
    await chargerListe();
    $('liste-cartes').value = E.id;
    statut(`« ${E.nom} » est enregistrée : tu peux la choisir dans le jeu !`, 'ok');
    return E.id;
  } catch { statut('Pas de connexion au serveur.', 'erreur'); return null; } finally { $('btn-enregistrer').disabled = false; }
}

async function supprimer() {
  if (!E.id || !cartesPerso.some((c) => c.id === E.id)) { nouvelleCarte(); return; }
  if (!confirm(`Supprimer la carte « ${E.nom} » ? C'est définitif.`)) return;
  try {
    const rep = await fetch(`api/cartes/${E.id}`, { method: 'DELETE' });
    if (!rep.ok) { statut('Suppression refusée.', 'erreur'); return; }
  } catch { statut('Pas de connexion.', 'erreur'); return; }
  await chargerListe();
  nouvelleCarte(false);
  statut('Carte supprimée.');
}

function statut(t, cls = '') { const n = $('statut'); n.textContent = t; n.className = `statut ${cls}`; }

// ---------- Palette et interface ----------
function construirePalette() {
  const box = $('matieres');
  box.replaceChildren(...MATIERES.map((nom) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `matiere${nom === E.matiere ? ' actif' : ''}${nom === 'invisible' ? ' invisible' : ''}`;
    b.title = NOMS[nom] || nom;
    b.dataset.nom = nom;
    if (nom !== 'invisible') {
      const m = materiau(nom);
      const img = m && m.map && m.map.image;
      if (img && img.toDataURL) b.style.backgroundImage = `url(${img.toDataURL()})`;
    }
    b.append(Object.assign(document.createElement('span'), { className: 'nom', textContent: NOMS[nom] || nom }));
    b.addEventListener('click', () => { E.matiere = nom; for (const x of box.children) x.classList.toggle('actif', x.dataset.nom === nom); });
    return b;
  }));
}

function choisirOutil(o) {
  E.outil = o;
  premierCoin = null;
  for (const b of $('outils').children) b.classList.toggle('actif', b.dataset.outil === o);
  $('bloc-hauteur').hidden = !(o === 'bloc' || o === 'boite');
  $('bloc-decor').hidden = !(o === 'bloc' || o === 'boite');
  $('bloc-equipe').hidden = o !== 'apparition';
  const aides = {
    bloc: 'Clique sur une face ou le sol pour ajouter un bloc. « Hauteur » empile plusieurs blocs d\'un coup.',
    boite: 'Clique deux coins opposés : ça crée une grande boîte (mur, sol, bâtiment). « Hauteur » = combien de blocs de haut.',
    gomme: 'Clique un bloc (ou une apparition) pour l\'enlever.',
    apparition: 'Clique le sol (ou le dessus d\'un bloc) pour poser un point d\'apparition. Choisis l\'équipe pour le mode Équipes.',
  };
  $('aide-outil').textContent = aides[o] || '';
}

function brancherUI() {
  for (const b of $('outils').children) b.addEventListener('click', () => choisirOutil(b.dataset.outil));
  choisirOutil('bloc');
  $('hauteur').addEventListener('input', () => { E.hauteur = Math.max(1, Math.min(20, Number($('hauteur').value) || 1)); });
  $('decor').addEventListener('change', () => { E.decor = $('decor').checked; });
  $('equipe').addEventListener('change', () => { E.equipe = $('equipe').value; });
  $('nom').addEventListener('input', () => { E.nom = $('nom').value; marquerModifie(); });
  $('taille').addEventListener('change', () => {
    E.taille = Math.max(16, Math.min(90, Math.round(Number($('taille').value) || 30)));
    $('taille').value = E.taille; marquerModifie(); reconstruire();
  });
  $('ambiance').addEventListener('change', () => { E.ambiance = $('ambiance').value; marquerModifie(); reconstruire(); });
  $('eau').addEventListener('change', () => {
    E.eau = $('eau').checked ? { niveau: Number($('niveau-eau').value) || 0 } : null;
    $('bloc-niveau-eau').hidden = !E.eau; marquerModifie();
  });
  $('niveau-eau').addEventListener('input', () => { if (E.eau) { E.eau.niveau = Number($('niveau-eau').value) || 0; marquerModifie(); } });
  $('liste-cartes').addEventListener('change', (e) => { if (e.target.value) chargerCarte(e.target.value); else nouvelleCarte(); });
  $('btn-nouvelle').addEventListener('click', () => nouvelleCarte());
  $('btn-partir').addEventListener('click', partirDeCarte);
  $('btn-supprimer').addEventListener('click', supprimer);
  $('btn-sol').addEventListener('click', remettreSolEtBords);
  $('btn-vider').addEventListener('click', () => { if (confirm('Tout effacer ?')) { sauverHistorique(); E.boites = []; E.decors = []; E.apparitions = []; apresEdition(); } });
  $('btn-annuler').addEventListener('click', annuler);
  $('btn-enregistrer').addEventListener('click', enregistrer);
  $('btn-tester').addEventListener('click', async () => { const id = await enregistrer(); if (id) location.href = `./?creer=${id}`; });
  addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') { e.preventDefault(); annuler(); }
    else if (e.code === 'Escape') { premierCoin = null; statut(''); }
    else { const o = { Digit1: 'bloc', Digit2: 'boite', Digit3: 'gomme', Digit4: 'apparition' }[e.code]; if (o) choisirOutil(o); }
  });
  addEventListener('beforeunload', (e) => { if (E.modifie) { e.preventDefault(); e.returnValue = ''; } });
}

function bloquer(titre, texte) {
  $('bloque-titre').textContent = titre;
  $('bloque-texte').textContent = texte;
  $('bloque').hidden = false;
}

// ---------- Vérifier que c'est bien l'admin ----------
fetch('/api/auth/me').then((r) => r.json()).then((d) => {
  if (!d.user) return bloquer('Connecte-toi', 'Il faut être connecté au site pour ouvrir l\'éditeur.');
  if (!d.user.isAdmin) return bloquer('Réservé à l\'admin', 'Seul l\'administrateur du site peut créer des cartes.');
  demarrer();
}).catch(() => bloquer('Oups', 'Impossible de vérifier ton compte. Vérifie ta connexion.'));
