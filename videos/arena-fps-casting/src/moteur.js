// Le moteur 3D de la bande-annonce « Le casting » d'Arena FPS.
//
// Il réutilise les VRAIS modules du jeu (personnages, vêtements, armes, cartes, ragdolls)
// et dessine, pour chaque instant de la vidéo, l'image exacte demandée par HyperFrames
// (événement « hf-seek »). Rien ne dépend de l'horloge : même temps = même image.
//
// Les moments (en secondes) doivent correspondre aux scènes de index.html.
import * as THREE from '../../../games/fps/public/vendor/three.min.js';
import { Personnage } from '../../../games/fps/public/js/personnage.js';
import { definirCatalogue, visageParDefaut, dessinerSkin, normaliserStyle } from '../../../games/fps/public/js/apparence.js';
import { construireMonde } from '../../../games/fps/public/js/monde.js';
import { modeleArme, modeleGrenadeVol } from '../../../games/fps/public/js/armes-modeles.js';
import { Ragdoll } from '../../../games/fps/public/js/ragdoll.js';
import catalogue from '../../../games/fps/public/catalogue-apparence.json';
import carteArene from '../../../games/fps/public/cartes/arene.json';
import carteChateau from '../../../games/fps/public/cartes/chateau.json';
import carteVille from '../../../games/fps/public/cartes/ville.json';
import carteIle from '../../../games/fps/public/cartes/ile.json';

// ---------- Hasard reproductible ----------
function graineur(graine) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
Math.random = graineur(20261003); // tout ce qui est construit au chargement est identique à chaque fois

// ---------- Les moments de la vidéo ----------
export const T = {
  tete: [0, 3.5], podium: [3.5, 8], garde: [8, 15], armes: [15, 21], compte: [21, 24.5],
  sautA: [24.5, 28], sautB: [28, 31], grappin: [31, 34], dos: [34, 37],
  dingA: [37, 38.6], dingB: [38.6, 40], fun: [40, 43.5], logo: [43.5, 50],
};
// Changements de tenue dans la garde-robe (temps absolus) : de plus en plus rapides.
export const TENUES_T = [8.0, 8.94, 9.74, 10.40, 10.81, 11.60, 12.005, 12.50, 12.81]; // calés sur les temps de la musique

// ---------- Petits outils ----------
const W = 1920; const H = 1080; const FPS = 60; // la vidéo est rendue à 60 images par seconde
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const sortieCubique = (k) => 1 - (1 - k) ** 3;
const sortieQuint = (k) => 1 - (1 - k) ** 5;
const doux = (k) => k * k * (3 - 2 * k);
const entreeQuad = (k) => k * k;
const ressort = (k) => { const c = 1.70158 * 1.6; return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2; }; // back.out
const PX = 1.85 / 32;
const _v = new THREE.Vector3();
const _w = new THREE.Vector3();

// Le personnage regarde vers (dx, dz)
const angleVers = (dx, dz) => Math.atan2(-dx, -dz);

definirCatalogue(catalogue);

const canvas = document.getElementById('vue3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H, false);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// Petite image ronde et floue (lueurs, étincelles, flash)
function textureLueur(centre, bord) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, centre);
  grad.addColorStop(1, bord);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const LUEUR_BLANCHE = textureLueur('rgba(255,255,255,1)', 'rgba(255,255,255,0)');
const LUEUR_CHAUDE = textureLueur('rgba(255,236,170,1)', 'rgba(255,140,40,0)');

// Étoile jaune (coups, « ding »)
function textureEtoile() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#ffd84a';
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 22 : 62;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    g.lineTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r);
  }
  g.closePath();
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const ETOILE = textureEtoile();

// ---------- Les personnages ----------
const VISAGE_BOUCHE = '8a3b3b';
// Le héros : son visage dessiné à la main (un grand sourire)
const HEROS_BASE = {
  peau: '#f1c7a0', yeux: '#2d6cdf', cheveux: '#2b1d0e', coupe: 'courts',
  haut: 'sweat', hautC1: '#3d6bff', hautC2: '#ffd21f', motif: 'eclair',
  bas: 'jogging', basC: '#2a2a2a', chaussures: 'baskets', chaussuresC: '#ffffff',
  chapeau: 'casquette_envers', chapeauC: '#ff8a1f', accDos: 'cape', accC: '#ff3b3b',
};
function visageSourire(style) {
  const px = visageParDefaut(style).match(/.{6}/g);
  const peau = style.peau.slice(1);
  for (const i of [5 * 8 + 2, 5 * 8 + 5, 6 * 8 + 3, 6 * 8 + 4]) px[i] = peau;
  for (const i of [5 * 8 + 1, 5 * 8 + 6, 6 * 8 + 2, 6 * 8 + 3, 6 * 8 + 4, 6 * 8 + 5]) px[i] = VISAGE_BOUCHE;
  return px.join('');
}
const VISAGE_HEROS = visageSourire(HEROS_BASE);
const heros = (extra = {}) => normaliserStyle({ ...HEROS_BASE, visage: VISAGE_HEROS, ...extra });

// Les tenues qui défilent dans la garde-robe (la dernière est la tenue du héros)
export const TENUES = [
  { haut: 'tshirt', hautC1: '#2fb5ff', motif: 'uni', bas: 'jean', basC: '#2b3a67', chapeau: 'aucun', accDos: 'aucun', categorie: 'HAUTS' },
  { haut: 'sweat', hautC1: '#ff8a1f', motif: 'uni', bas: 'short', basC: '#2a2a2a', chapeau: 'aucun', accDos: 'aucun', categorie: 'BAS' },
  { haut: 'maillot', hautC1: '#22c55e', hautC2: '#ffffff', motif: 'numero', bas: 'short', basC: '#ffffff', chapeau: 'casquette', chapeauC: '#ff3b3b', accDos: 'aucun', categorie: 'CHAPEAUX' },
  { haut: 'veste', hautC1: '#8b5cf6', motif: 'uni', bas: 'cargo', basC: '#6b7280', chapeau: 'couronne', chapeauC: '#ffd21f', accDos: 'aucun', categorie: 'CHAPEAUX' },
  { haut: 'chemise', hautC1: '#ec4899', motif: 'uni', bas: 'jean', basC: '#2b3a67', chapeau: 'cowboy', chapeauC: '#7b4a25', accVisage: 'lunettes_soleil', accDos: 'aucun', categorie: 'ACCESSOIRES' },
  { haut: 'pull', hautC1: '#14b8a6', motif: 'coeur', hautC2: '#ffffff', bas: 'jogging', basC: '#2a2a2a', chapeau: 'oreilles_chat', chapeauC: '#ff8a1f', accCou: 'echarpe', accC: '#ff3b3b', accDos: 'aucun', categorie: 'ACCESSOIRES' },
  { haut: 'tshirt', hautC1: '#ffd21f', motif: 'eclair', hautC2: '#2a2a2a', bas: 'cargo', basC: '#7b4a25', chapeau: 'viking', chapeauC: '#c9ced6', accDos: 'ailes', accC: '#ffffff', categorie: 'CAPES' },
  { haut: 'debardeur', hautC1: '#ff3b3b', motif: 'uni', bas: 'short', basC: '#3d6bff', chapeau: 'astronaute', chapeauC: '#ffffff', accDos: 'jetpack', accC: '#6b7280', categorie: 'ACCESSOIRES' },
  { categorie: 'CAPES' }, // tenue finale : celle du héros
];

function nouveauPerso(style, equipe = null) {
  const p = new Personnage({ style, equipe });
  p.groupe.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
  return p;
}
function cacherArme(p) { if (p.arme) p.arme.visible = false; }

// Pose debout, bras le long du corps, qui respire
function poseRepos(p, t, { regard = 0 } = {}) {
  p.temps = t;
  p.viseeLisse = 0; p.anim = null; p.choc = 0;
  p.animer(0, { vitesse: 0, enLAir: false, pitch: 0 });
  const P = p.parties;
  P.brasD.pivot.rotation.set(Math.sin(t * 1.3) * 0.03, 0, 0.06);
  P.brasG.pivot.rotation.set(-Math.sin(t * 1.3) * 0.03, 0, -0.06);
  P.jambeD.pivot.rotation.set(0, 0, 0);
  P.jambeG.pivot.rotation.set(0, 0, 0);
  P.corps.pivot.position.y = 18 * PX + Math.sin(t * 1.6) * 0.006;
  P.tete.pivot.rotation.set(Math.sin(t * 0.7) * 0.03, regard, 0);
}

// Pose de marche / course (vitesse en m/s), avec ou sans arme tenue
function poseMarche(p, t, vitesse, { pitch = 0, enLAir = false, arme = true } = {}) {
  p.temps = t * (4 + 8 * Math.min(1, vitesse / 7));
  p.viseeLisse = 0; p.anim = null; p.choc = 0;
  p.animer(0, { vitesse, enLAir, pitch });
  if (!arme) {
    const k = Math.min(1, vitesse / 7);
    const b = Math.sin(p.temps) * 0.9 * k;
    p.parties.brasD.pivot.rotation.set(-b, 0, 0.08);
    p.parties.brasG.pivot.rotation.set(b, 0, -0.08);
  }
}

// ---------- Les ragdolls « enregistrés » ----------
// On simule une fois au chargement (avec un hasard fixe) et on garde les positions
// image par image : la vidéo peut ensuite aller à n'importe quel instant.
function enregistrerRagdoll(scene, perso, options, dureeS) {
  const r = new Ragdoll(scene, perso, options);
  const images = [];
  const n = Math.ceil(dureeS * FPS) + 2;
  for (let f = 0; f < n; f++) {
    images.push(r.morceaux.map((m) => [m.mesh.position.clone(), m.mesh.quaternion.clone()]));
    r.maj(1 / FPS);
  }
  r.groupe.visible = false;
  return {
    groupe: r.groupe,
    centre: (k) => images[Math.min(images.length - 1, Math.max(0, Math.floor(k * FPS)))][r.morceaux.findIndex((m) => m.nom === 'corps')][0],
    montrer(tl) {
      r.groupe.visible = tl >= 0;
      if (tl < 0) return;
      const x = tl * FPS;
      const i = Math.min(images.length - 2, Math.floor(x));
      const f = clamp(x - i);
      r.morceaux.forEach((m, j) => {
        m.mesh.position.lerpVectors(images[i][j][0], images[i + 1][j][0], f);
        m.mesh.quaternion.slerpQuaternions(images[i][j][1], images[i + 1][j][1], f);
      });
    },
  };
}

// ---------- Étiquettes accrochées au décor (texte en 3D) ----------
function etiquette3D(texte) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  g.font = '700 64px "Space Mono", monospace';
  const w = Math.min(500, g.measureText(texte).width + 56);
  g.fillStyle = 'rgba(10, 15, 29, 0.88)';
  g.beginPath();
  g.roundRect(256 - w / 2, 14, w, 100, 18);
  g.fill();
  g.strokeStyle = '#ff8a1f';
  g.lineWidth = 6;
  g.stroke();
  g.fillStyle = '#eef4ff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(texte, 256, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, fog: false }));
  s.renderOrder = 20;
  s.userData.ratio = 0.25;
  return s;
}

// ---------- Particules simples (cubes qui volent, calculés par formule) ----------
function nuageCubes(scene, n, couleurs, graine) {
  const r = graineur(graine);
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }), n);
  const d = [];
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const h = 0.3 + r() * 0.9;
    const v = 4 + r() * 7;
    d.push({ vx: Math.cos(a) * v * (1 - h * 0.5), vy: v * h + 2, vz: Math.sin(a) * v * (1 - h * 0.5), taille: 0.08 + r() * 0.16, rot: r() * 10, vr: (r() - 0.5) * 16 });
    mesh.setColorAt(i, new THREE.Color(couleurs[i % couleurs.length]));
  }
  mesh.frustumCulled = false;
  mesh.visible = false;
  scene.add(mesh);
  const m4 = new THREE.Matrix4(); const q = new THREE.Quaternion(); const e = new THREE.Euler(); const p = new THREE.Vector3(); const s = new THREE.Vector3();
  return {
    montrer(origine, tl, duree = 1.6) {
      mesh.visible = tl >= 0 && tl < duree;
      if (!mesh.visible) return;
      const fin = 1 - prog(tl, duree * 0.6, duree);
      d.forEach((c, i) => {
        p.set(origine.x + c.vx * tl, Math.max(origine.y * 0 + 0.05, origine.y + c.vy * tl - 11 * tl * tl), origine.z + c.vz * tl);
        e.set(c.rot + c.vr * tl, c.rot * 0.7 + c.vr * tl * 0.6, 0);
        q.setFromEuler(e);
        s.setScalar(c.taille * fin);
        mesh.setMatrixAt(i, m4.compose(p, q, s));
      });
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

// ======================================================================
// SCÈNE 1 : le podium de l'accueil (scènes 01, 02, 03 et 11)
// ======================================================================
const podium = (() => {
  const s = new THREE.Scene();
  s.fog = new THREE.Fog(0x6a5fd0, 18, 70);
  const geoCiel = new THREE.SphereGeometry(150, 32, 20);
  const haut = new THREE.Color('#081438'); const milieu = new THREE.Color('#2a5bd7'); const horizon = new THREE.Color('#ff9d5c');
  const couleurs = [];
  const pos = geoCiel.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const k = pos.getY(i) / 150;
    const c = k > 0.15 ? milieu.clone().lerp(haut, Math.min(1, (k - 0.15) / 0.7)) : horizon.clone().lerp(milieu, Math.max(0, (k + 0.25) / 0.4));
    couleurs.push(c.r, c.g, c.b);
  }
  geoCiel.setAttribute('color', new THREE.Float32BufferAttribute(couleurs, 3));
  s.add(new THREE.Mesh(geoCiel, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })));
  const soleil = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureLueur('rgba(255,214,150,0.9)', 'rgba(255,140,80,0)'), blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  soleil.scale.set(26, 26, 1);
  soleil.position.set(4, 4, -40);
  s.add(soleil);
  s.add(new THREE.HemisphereLight(0xcfe3ff, 0x2a1f4a, 1.25));
  const cle = new THREE.DirectionalLight(0xfff0dc, 2.3);
  cle.position.set(-3, 5, 6);
  cle.castShadow = true;
  cle.shadow.mapSize.set(1024, 1024);
  Object.assign(cle.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 20 });
  s.add(cle);
  const contre = new THREE.DirectionalLight(0x39e0ff, 1.6);
  contre.position.set(4, 3, -5);
  s.add(contre);
  const violet = new THREE.PointLight(0xb46bff, 6, 8, 2);
  violet.position.set(-2.5, 1.2, 1.5);
  s.add(violet);
  const plateforme = new THREE.Group();
  const socle = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.65, 0.36, 48), new THREE.MeshStandardMaterial({ color: 0x18213d, roughness: 0.6, metalness: 0.3 }));
  socle.position.y = -0.18; socle.receiveShadow = true;
  const dessus = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.02, 48), new THREE.MeshStandardMaterial({ color: 0x2b3866, roughness: 0.4, metalness: 0.2 }));
  dessus.receiveShadow = true;
  const neon = (rayon, couleur, y, ep) => { const t = new THREE.Mesh(new THREE.TorusGeometry(rayon, ep, 10, 80), new THREE.MeshBasicMaterial({ color: couleur })); t.rotation.x = Math.PI / 2; t.position.y = y; return t; };
  const anneau1 = neon(1.52, 0x39e0ff, 0.02, 0.035);
  const lueur = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 5.5), new THREE.MeshBasicMaterial({ map: textureLueur('rgba(57,224,255,0.55)', 'rgba(57,224,255,0)'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  lueur.rotation.x = -Math.PI / 2; lueur.position.y = -0.36;
  plateforme.add(socle, dessus, anneau1, neon(1.66, 0xff8a1f, -0.32, 0.025), lueur);
  s.add(plateforme);
  const sol = new THREE.Mesh(new THREE.CircleGeometry(80, 48), new THREE.MeshLambertMaterial({ color: 0x1a1640 }));
  sol.rotation.x = -Math.PI / 2; sol.position.y = -2.5;
  s.add(sol);
  // Cubes qui flottent
  const PALETTE = [0x3d8bff, 0xff8a1f, 0x8b5cf6, 0x39e0ff, 0xffd21f, 0xec4899, 0x22c55e];
  const N = 70;
  const cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }), N);
  const r = graineur(7);
  const donnees = [];
  for (let i = 0; i < N; i++) {
    let x; let z;
    do { x = -26 + r() * 52; z = -40 + r() * 46; } while (Math.hypot(x, z) < 5 || z > -2.5);
    donnees.push({ x, z, y: -1.5 + r() * 10.5, taille: 0.25 + r() * 1.35, rx: r() * 6, ry: r() * 6, vr: -0.4 + r() * 0.8, phase: r() * 6, amp: 0.1 + r() * 0.4 });
    cubes.setColorAt(i, new THREE.Color(PALETTE[i % PALETTE.length]).multiplyScalar(0.65 + r() * 0.45));
  }
  s.add(cubes);
  // Étincelles
  const M = 90;
  const pts = new Float32Array(M * 3);
  const et = [];
  for (let i = 0; i < M; i++) { const a = r() * Math.PI * 2; et.push({ a, rayon: 0.8 + r() * 1.8, y0: r() * 3.8, v: 0.15 + r() * 0.35 }); }
  const geoPts = new THREE.BufferGeometry();
  geoPts.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  const etincelles = new THREE.Points(geoPts, new THREE.PointsMaterial({ map: LUEUR_BLANCHE, size: 0.12, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: 0xbff4ff }));
  s.add(etincelles);

  // Le héros : une version par tenue (la dernière = la tenue du héros)
  const tenues = TENUES.map(({ categorie, ...t }) => {
    const p = nouveauPerso(heros(t));
    cacherArme(p);
    p.groupe.visible = false;
    s.add(p.groupe);
    return p;
  });
  // Le héros pendant l'ouverture : visage vide qui se dessine
  const hero = tenues[tenues.length - 1];
  // Le pinceau-crayon qui pose les pixels
  const crayon = new THREE.Group();
  const bois = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.26), new THREE.MeshLambertMaterial({ color: 0xff8a1f }));
  bois.position.z = 0.13;
  const pointe = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.04), new THREE.MeshLambertMaterial({ color: 0x2b1d14 }));
  pointe.position.z = -0.01;
  const gomme = new THREE.Mesh(new THREE.BoxGeometry(0.037, 0.037, 0.04), new THREE.MeshLambertMaterial({ color: 0xff7aa8 }));
  gomme.position.z = 0.27;
  crayon.add(bois, pointe, gomme);
  crayon.visible = false;
  s.add(crayon);

  const camera = new THREE.PerspectiveCamera(30, W / H, 0.05, 300);
  const m4 = new THREE.Matrix4(); const q = new THREE.Quaternion(); const e = new THREE.Euler(); const v = new THREE.Vector3(); const sc = new THREE.Vector3();
  function decor(t) {
    anneau1.material.color.setHSL(0.52 + Math.sin(t * 0.8) * 0.03, 1, 0.55 + Math.sin(t * 2) * 0.08);
    plateforme.rotation.y = t * 0.15;
    donnees.forEach((c, i) => {
      e.set(c.rx + t * c.vr, c.ry + t * c.vr * 0.7, 0);
      q.setFromEuler(e);
      v.set(c.x, c.y + Math.sin(t * 0.6 + c.phase) * c.amp, c.z);
      sc.setScalar(c.taille);
      cubes.setMatrixAt(i, m4.compose(v, q, sc));
    });
    cubes.instanceMatrix.needsUpdate = true;
    et.forEach((p, i) => {
      const y = ((p.y0 + p.v * t) % 3.8) - 0.3;
      pts[i * 3] = Math.cos(p.a + t * 0.2) * p.rayon; pts[i * 3 + 1] = y; pts[i * 3 + 2] = Math.sin(p.a + t * 0.2) * p.rayon;
    });
    geoPts.attributes.position.needsUpdate = true;
  }
  return { scene: s, camera, tenues, hero, crayon, decor, soleil };
})();

// ---------- Le visage qui se dessine (scène 01) ----------
// Ordre des pixels : cheveux, sourcils, yeux, sourire ; chacun « flashe » en apparaissant.
const ORDRE_VISAGE = (() => {
  const px = VISAGE_HEROS.match(/.{6}/g);
  const peau = HEROS_BASE.peau.slice(1);
  const ordre = [];
  for (let y = 0; y < 3; y++) for (let x = 0; x < 8; x++) if (px[y * 8 + x] !== peau) ordre.push(y * 8 + x);
  for (const y of [3, 4]) for (const x of [1, 2, 5, 6]) if (px[y * 8 + x] !== peau) ordre.push(y * 8 + x);
  for (const i of [5 * 8 + 1, 6 * 8 + 2, 6 * 8 + 3, 6 * 8 + 4, 6 * 8 + 5, 5 * 8 + 6]) ordre.push(i);
  for (let i = 0; i < 64; i++) if (!ordre.includes(i) && px[i] !== peau) ordre.push(i);
  return ordre;
})();
// Moment où chaque pixel apparaît (le dernier « clique » vers 3,0 s)
const T_PIXELS = ORDRE_VISAGE.map((_, i, l) => 0.35 + 2.6 * (1 - (1 - i / (l.length - 1)) ** 1.35));
const DUREE_FLASH = 0.12;
let derniereCleVisage = '';
function dessinerVisageProgressif(t) {
  const px = VISAGE_HEROS.match(/.{6}/g);
  const peau = HEROS_BASE.peau.slice(1);
  const out = Array(64).fill(peau);
  ORDRE_VISAGE.forEach((idx, i) => {
    const ti = T_PIXELS[i];
    if (t >= ti) out[idx] = t < ti + DUREE_FLASH ? 'ffffff' : px[idx];
  });
  const cle = out.join('');
  if (cle === derniereCleVisage) return;
  derniereCleVisage = cle;
  const p = podium.hero;
  const c = dessinerSkin(heros({ visage: cle }));
  const g = p.canvas.getContext('2d');
  g.clearRect(0, 0, 64, 64);
  g.drawImage(c, 0, 0);
  p.texture.needsUpdate = true;
}
function visageComplet() { dessinerVisageProgressif(99); }

// Position (dans le monde) d'un pixel du visage du héros.
// Sur la face avant (-z) d'une boîte three.js, la colonne 0 de l'image est du côté +x.
function positionPixel(idx, cible) {
  const x = idx % 8; const y = Math.floor(idx / 8);
  cible.set((3.5 - x) * PX, (3.5 - y) * PX, -4 * PX - 0.002);
  return podium.hero.parties.tete.mesh.localToWorld(cible);
}

function rendrePodium(t, phase) {
  const P = podium;
  P.decor(t);
  P.soleil.visible = phase !== 'logo'; // pour le logo, le fond reste sombre derrière le titre
  P.tenues.forEach((p) => { p.groupe.visible = false; });
  P.crayon.visible = false;
  const cam = P.camera;
  let perso = P.hero;
  if (phase === 'tete') {
    dessinerVisageProgressif(t);
    perso = P.hero;
    perso.groupe.visible = true;
    perso.groupe.position.set(0, 0, 0);
    perso.groupe.rotation.y = Math.PI; // de face pour la caméra placée vers -z… voir camera
    poseRepos(perso, t);
    perso.parties.tete.pivot.rotation.set(0, 0, 0);
    // Caméra très proche du visage, qui avance doucement
    const d = lerp(1.5, 1.3, doux(prog(t, 0, 3.5)));
    cam.fov = 30;
    cam.position.set(0, 28 * PX + 0.01, d);
    cam.lookAt(0, 28 * PX + 0.01, 0);
    // Le crayon suit le dernier pixel posé
    let i = T_PIXELS.findIndex((ti) => ti > t);
    if (i < 0) i = T_PIXELS.length;
    if (i > 0 && t < 3.15) {
      const prec = Math.max(0, i - 1); const suiv = Math.min(T_PIXELS.length - 1, i);
      const k = i >= T_PIXELS.length ? 1 : doux(prog(t, T_PIXELS[prec], T_PIXELS[suiv]));
      perso.groupe.updateMatrixWorld(true);
      const a = positionPixel(ORDRE_VISAGE[prec], _v).clone();
      const b = positionPixel(ORDRE_VISAGE[suiv], _w);
      P.crayon.position.lerpVectors(a, b, k);
      P.crayon.position.z += 0.035 + Math.sin(k * Math.PI) * 0.04; // le crayon se lève entre deux pixels
      P.crayon.rotation.set(-0.6, 0.35, 0);
      P.crayon.visible = true;
    } else if (t < 0.35) {
      P.crayon.position.set(0.12, 28 * PX - 0.05, 4 * PX + 0.12);
      P.crayon.rotation.set(-0.6, 0.35, 0);
      P.crayon.visible = true;
    }
  } else if (phase === 'podium') {
    visageComplet();
    perso.groupe.visible = true;
    perso.groupe.position.set(0, 0, 0);
    perso.groupe.rotation.y = Math.PI - 0.25 * doux(prog(t, 3.5, 6));
    poseRepos(perso, t);
    // salut de la main (bras gauche du perso)
    const s = prog(t, 5.0, 7.6);
    if (s > 0 && s < 1) {
      const leve = Math.sin(Math.PI * clamp(s * 1.25));
      perso.parties.brasG.pivot.rotation.set(0, 0, -(0.06 + leve * 2.6) );
      perso.parties.brasG.pivot.rotation.x = Math.sin(t * 14) * 0.25 * leve;
    }
    // Un seul zoom arrière qui ralentit : du visage au perso entier (décalé à droite)
    const p = prog(t, 3.5, 7.4);
    const k = sortieQuint(p) * doux(Math.min(1, p / 0.14)); // démarre en douceur, file, puis ralentit
    const d = lerp(1.3, 7.4, k);
    const cibleY = lerp(28 * PX + 0.01, 1.0, k);
    const decalX = lerp(0, -1.15, k); // le perso passe à droite de l'image (titre à gauche)
    cam.fov = 30;
    cam.position.set(decalX, lerp(28 * PX + 0.01, 1.55, k), d);
    cam.lookAt(decalX, cibleY, 0);
  } else if (phase === 'garde') {
    visageComplet();
    let n = 0;
    for (let i = 0; i < TENUES_T.length; i++) if (t >= TENUES_T[i]) n = i;
    perso = P.tenues[n];
    perso.groupe.visible = true;
    perso.groupe.position.set(0, 0, 0);
    const depuis = t - TENUES_T[n];
    const pop = n > 0 ? 1 + 0.07 * Math.exp(-depuis * 14) * Math.cos(depuis * 30) : 1;
    perso.groupe.scale.setScalar(pop);
    perso.groupe.rotation.y = Math.PI - 0.35 + Math.sin(t * 0.9) * 0.18;
    poseRepos(perso, t);
    cam.fov = 30;
    const a = Math.sin((t - 8) * 0.25) * 0.12;
    cam.position.set(Math.sin(a) * 7.2 + 0.0, 1.45, Math.cos(a) * 7.2);
    cam.lookAt(0, 0.98, 0);
  } else if (phase === 'logo') {
    visageComplet();
    perso.groupe.visible = true;
    perso.groupe.scale.setScalar(1);
    // le héros entre par la droite et s'arrête, se tourne vers nous et salue
    const k = sortieCubique(prog(t, 43.9, 45.2));
    perso.groupe.position.set(lerp(3.2, 0, k), 0, 0);
    perso.groupe.rotation.y = Math.PI + 0.3 * k - (1 - k) * 1.2;
    if (k < 1) poseMarche(perso, t, 4.5 * (1 - k), { arme: false }); else poseRepos(perso, t);
    const s = prog(t, 45.6, 48.2);
    if (s > 0 && s < 1) {
      const leve = Math.sin(Math.PI * clamp(s * 1.2));
      perso.parties.brasG.pivot.rotation.set(Math.sin(t * 14) * 0.25 * leve, 0, -(0.06 + leve * 2.6));
    }
    cam.fov = 30;
    const z = lerp(8.4, 7.8, doux(prog(t, 43.5, 50)));
    cam.position.set(-2.75, 1.5, z);
    cam.lookAt(-2.75, 1.1, 0);
  }
  cam.updateProjectionMatrix();
  renderer.render(P.scene, cam);
}

// ======================================================================
// SCÈNE 2 : la vitrine des armes (scène 04)
// ======================================================================
// Centres des fenêtres des cartes (en pixels) : doivent correspondre à compositions/04-equipement.html
export const FENETRES_ARMES = [[278, 690], [729, 690], [1180, 690], [1631, 690]];
const vitrine = (() => {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x0b1124);
  s.add(new THREE.HemisphereLight(0xeaf4ff, 0x404060, 2.2));
  const l = new THREE.DirectionalLight(0xfff1d6, 3.2); l.position.set(1, 3, 4); s.add(l);
  const r2 = new THREE.DirectionalLight(0x7fe8ff, 2.2); r2.position.set(-3, 2, -3); s.add(r2);
  const r3 = new THREE.DirectionalLight(0xff8a1f, 1.4); r3.position.set(4, -1, -2); s.add(r3);
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.05, 50);
  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, -1);
  const D = 3;
  const demi = Math.tan(THREE.MathUtils.degToRad(15));
  const versMonde = (sx, sy) => new THREE.Vector3(((sx / W) * 2 - 1) * demi * (W / H) * D, (1 - (sy / H) * 2) * demi * D, -D);
  const ids = [['fusil', 0.9], ['revolver', 1.7], ['poele', 1.15], ['grappin', 1.4]];
  const armes = ids.map(([id, echelle], i) => {
    const g = new THREE.Group();
    const m = modeleArme(id, false);
    // centrer le modèle sur son milieu
    const boite = new THREE.Box3().setFromObject(m);
    boite.getCenter(_v);
    m.position.sub(_v);
    g.add(m);
    g.position.copy(versMonde(...FENETRES_ARMES[i]));
    g.userData.echelle = echelle;
    s.add(g);
    return g;
  });
  // Cubes du décor (au fond)
  const N = 40;
  const r = graineur(11);
  const cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }), N);
  const d = [];
  for (let i = 0; i < N; i++) {
    d.push({ x: -14 + r() * 28, y: -6 + r() * 12, z: -14 - r() * 16, t: 0.3 + r() * 0.8, rot: r() * 6, v: -0.3 + r() * 0.6 });
    cubes.setColorAt(i, new THREE.Color([0x3d8bff, 0xff8a1f, 0x7fe8ff, 0x8b5cf6][i % 4]).multiplyScalar(0.35));
  }
  s.add(cubes);
  const m4 = new THREE.Matrix4(); const q = new THREE.Quaternion(); const e = new THREE.Euler(); const sc = new THREE.Vector3(); const p = new THREE.Vector3();
  return {
    scene: s, camera, armes,
    rendre(t) {
      armes.forEach((g, i) => {
        const debut = 15.35 + i * 0.18;
        const k = prog(t, debut, debut + 0.55);
        const echelle = g.userData.echelle * (k <= 0 ? 0 : ressort(k));
        g.scale.setScalar(Math.max(0.0001, echelle));
        // un tour complet en arrivant, puis de profil en se balançant doucement
        const tour = (1 - sortieCubique(k)) * Math.PI * 2;
        g.rotation.set(0.12 + Math.sin(t * 0.8 + i) * 0.06, Math.PI / 2 + tour + Math.sin((t - debut) * 0.9 + i) * 0.45, 0);
      });
      d.forEach((c, i) => {
        e.set(c.rot + t * c.v, c.rot + t * c.v * 0.6, 0);
        q.setFromEuler(e);
        p.set(c.x, c.y + Math.sin(t * 0.5 + i) * 0.3, c.z);
        sc.setScalar(c.t);
        cubes.setMatrixAt(i, m4.compose(p, q, sc));
      });
      cubes.instanceMatrix.needsUpdate = true;
      renderer.render(s, camera);
    },
  };
})();

// ======================================================================
// SCÈNES 3 à 6 : les vraies cartes du jeu
// ======================================================================
function carte(donnees) {
  const s = new THREE.Scene();
  construireMonde(s, donnees, { ombres: true });
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.05, 900);
  return { scene: s, camera, boites: donnees.boites.filter((b) => b[6] !== 'invisible').map((b) => b.slice(0, 6)), donnees };
}
const chateau = carte(carteChateau);
const ville = carte(carteVille);
const ile = carte(carteIle);
const arene = carte(carteArene);

// Le héros en action (tenue finale), un exemplaire par carte
function herosDans(c) {
  const p = nouveauPerso(heros());
  c.scene.add(p.groupe);
  return p;
}
const herosChateau = herosDans(chateau);
const herosVille = herosDans(ville);
const herosIle = herosDans(ile);
const herosArene = herosDans(arene);
[herosChateau, herosVille, herosIle, herosArene].forEach((p) => {
  const c = dessinerSkin(heros());
  p.canvas.getContext('2d').drawImage(c, 0, 0);
  p.texture.needsUpdate = true;
});

// --- Étiquettes accrochées au décor ---
const etiqChateau = etiquette3D('CHÂTEAU');
chateau.scene.add(etiqChateau);
const etiqVille = etiquette3D('VILLE');
ville.scene.add(etiqVille);

// ---------- Scène 05 : vue d'ensemble du château derrière la salle d'attente ----------
function rendreCompte(t) {
  const c = chateau;
  herosChateau.groupe.visible = false;
  etiqChateau.visible = false;
  const a = 0.6 + (t - 21) * 0.09;
  const R = 52;
  c.camera.fov = 55;
  c.camera.position.set(Math.sin(a) * R, 26, Math.cos(a) * R);
  c.camera.lookAt(0, 3, 0);
  c.camera.updateProjectionMatrix();
  renderer.render(c.scene, c.camera);
}

// ---------- Scène 06a : le grand saut au-dessus du château ----------
// Trampoline (12.5..14.5, -12..-10) ; le héros arrive en courant, rebondit, vole vers le donjon.
const SAUT = (() => {
  const depart = new THREE.Vector3(13.5, 0, -6.2);
  const tramp = new THREE.Vector3(13.5, 0.2, -11);
  const arrivee = new THREE.Vector3(-13.5, 0.2, 11);
  return { depart, tramp, arrivee };
})();
function positionSaut(t, cible) {
  const { depart, tramp, arrivee } = SAUT;
  if (t < 25.2) {
    const k = prog(t, 24.5, 25.2);
    return cible.lerpVectors(depart, tramp, k).setY(0);
  }
  const k = prog(t, 25.2, 28.4);
  cible.lerpVectors(tramp, arrivee, k);
  cible.y = lerp(tramp.y, arrivee.y, k) + 4 * 17 * k * (1 - k); // parabole : sommet ~17 m, au-dessus du donjon (13 m)
  return cible;
}
function rendreSautA(t) {
  const c = chateau;
  const p = herosChateau;
  p.groupe.visible = true;
  const pos = positionSaut(t, _v);
  p.groupe.position.copy(pos);
  const dir = _w.subVectors(SAUT.arrivee, SAUT.tramp);
  // en rebondissant, il se tourne vers le donjon
  const aCourse = angleVers(SAUT.tramp.x - SAUT.depart.x, SAUT.tramp.z - SAUT.depart.z);
  const aVol = angleVers(dir.x, dir.z);
  let dA = aVol - aCourse; while (dA > Math.PI) dA -= 2 * Math.PI; while (dA < -Math.PI) dA += 2 * Math.PI;
  p.groupe.rotation.set(0, aCourse + dA * doux(prog(t, 25.15, 25.6)), 0);
  if (t < 25.2) {
    poseMarche(p, t, 8, { arme: false });
  } else {
    poseMarche(p, t, 7, { enLAir: true, arme: false });
    // bras en avant comme un super-héros, le corps penché
    const k = sortieCubique(prog(t, 25.25, 25.8));
    p.parties.brasD.pivot.rotation.set(lerp(0, 2.9, k), 0, 0.1);
    p.parties.brasG.pivot.rotation.set(lerp(0, 2.9, k), 0, -0.1);
    p.groupe.rotation.x = 0;
    p.parties.corps.pivot.rotation.x = 0;
  }
  cacherArme(p);
  // Caméra 1 : basse, dans la cour, face au héros qui court vers le trampoline.
  // Caméra 2 : derrière lui pendant le vol. On passe de l'une à l'autre en douceur.
  const arriere = _w.subVectors(SAUT.tramp, SAUT.arrivee).setY(0).normalize();
  const cote = new THREE.Vector3(-arriere.z, 0, arriere.x);
  const cam1 = new THREE.Vector3(12.6, 1.1, -15.2);
  const vise1 = new THREE.Vector3(pos.x, Math.max(1.0, pos.y + 0.9), pos.z);
  const cam2 = pos.clone().addScaledVector(arriere, 6).addScaledVector(cote, 2.5).add(new THREE.Vector3(0, 2.8, 0));
  const vise2 = new THREE.Vector3(pos.x, pos.y + 0.8, pos.z).addScaledVector(arriere, -3);
  const m = doux(prog(t, 25.45, 26.2));
  c.camera.fov = 55;
  c.camera.position.lerpVectors(cam1, cam2, m);
  c.camera.lookAt(_v.lerpVectors(vise1, vise2, m));
  c.camera.updateProjectionMatrix();
  // étiquette sur la grande tour
  etiqChateau.visible = t > 26.0;
  const e = prog(t, 26.0, 26.4);
  etiqChateau.position.set(-3.5, 17.5, -2.5);
  const d = c.camera.position.distanceTo(etiqChateau.position);
  const taille = d * 0.42 * ressort(e);
  etiqChateau.scale.set(taille, taille * etiqChateau.userData.ratio, 1);
  renderer.render(c.scene, c.camera);
}

// ---------- Scène 06b : la suite du vol au-dessus des toits de la ville ----------
const VOL_VILLE = { a: new THREE.Vector3(30, 16, -26), b: new THREE.Vector3(-6, 6.5, 8) };
function rendreSautB(t) {
  const c = ville;
  const p = herosVille;
  p.groupe.visible = true;
  const k = sortieCubique(prog(t, 28, 31));
  const pos = _v.lerpVectors(VOL_VILLE.a, VOL_VILLE.b, k);
  pos.y += Math.sin(k * Math.PI) * 2.5;
  p.groupe.position.copy(pos);
  const dir = _w.subVectors(VOL_VILLE.b, VOL_VILLE.a);
  p.groupe.rotation.set(0, angleVers(dir.x, dir.z), 0);
  poseMarche(p, t, 7, { enLAir: true, arme: false });
  p.parties.brasD.pivot.rotation.set(2.9, 0, 0.1);
  p.parties.brasG.pivot.rotation.set(2.9, 0, -0.1);
  cacherArme(p);
  const arriere = dir.clone().setY(0).normalize().negate();
  const cote = new THREE.Vector3(-arriere.z, 0, arriere.x);
  c.camera.fov = 55;
  c.camera.position.copy(pos).addScaledVector(arriere, 8).addScaledVector(cote, -4).add(new THREE.Vector3(0, 3.5, 0));
  c.camera.lookAt(pos.x, pos.y + 0.6, pos.z);
  c.camera.updateProjectionMatrix();
  etiqVille.visible = t > 28.2;
  etiqVille.position.set(12, 18, -8);
  const e = prog(t, 28.2, 28.6);
  const d = c.camera.position.distanceTo(etiqVille.position);
  const taille = d * 0.42 * ressort(e);
  etiqVille.scale.set(taille, taille * etiqVille.userData.ratio, 1);
  renderer.render(c.scene, c.camera);
}

// ---------- Scène 07 : le grappin ----------
const GRAPPIN = { depart: new THREE.Vector3(-6.5, 0, 12), cible: new THREE.Vector3(-6.5, 6.85, 19.95), toit: new THREE.Vector3(-6.5, 6.15, 21.3) };
const corde = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 6), new THREE.MeshLambertMaterial({ color: 0x3b2a1a }));
corde.visible = false;
ville.scene.add(corde);
const crochet = (() => {
  const g = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color: 0x9aa3b5 });
  g.add(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.22), mat));
  for (let i = 0; i < 3; i++) {
    const dent = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.14), mat);
    const a = (i / 3) * Math.PI * 2;
    dent.position.set(Math.cos(a) * 0.06, Math.sin(a) * 0.06, -0.12);
    dent.rotation.set(Math.sin(a) * 0.6, -Math.cos(a) * 0.6, 0);
    g.add(dent);
  }
  g.visible = false;
  ville.scene.add(g);
  return g;
})();
function placerCorde(a, b) {
  const d = _w.subVectors(b, a);
  const l = d.length();
  corde.position.copy(a).addScaledVector(d, 0.5);
  corde.scale.set(1, l, 1);
  corde.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  corde.visible = true;
}
function rendreGrappin(t) {
  const c = ville;
  const p = herosVille;
  p.groupe.visible = true;
  p.groupe.rotation.set(0, 0, 0);
  p.prendreArme('grappin', 'gadget');
  p.arme.visible = true;
  const { depart, cible } = GRAPPIN;
  const tir = prog(t, 31.25, 31.6);
  const tire = doux(prog(t, 31.7, 32.95));
  const accroche = cible.clone().add(new THREE.Vector3(0, -2.0, -0.45));
  const pos = _v.lerpVectors(depart, accroche, tire);
  if (t > 33.0) {
    const k = sortieCubique(prog(t, 33.0, 33.55));
    pos.copy(accroche).lerp(GRAPPIN.toit, k);
    pos.y += Math.sin(k * Math.PI) * 0.6;
  }
  p.groupe.position.copy(pos);
  p.groupe.rotation.y = angleVers(cible.x - depart.x, cible.z - depart.z);
  const pitch = Math.atan2(cible.y - pos.y, Math.hypot(cible.x - pos.x, cible.z - pos.z));
  poseMarche(p, t, t < 33 ? 0 : 3, { pitch: t < 33 ? pitch : 0, enLAir: tire > 0 && t < 33.3 });
  // bout du grappin
  const main = p.boutDuCanon(new THREE.Vector3());
  crochet.visible = tir > 0 && t < 33.1;
  if (p.arme.userData.crochet) p.arme.userData.crochet.visible = !crochet.visible;
  if (crochet.visible) {
    crochet.position.lerpVectors(main, cible, sortieCubique(tir));
    crochet.lookAt(main);
    crochet.rotateY(Math.PI);
    placerCorde(main, crochet.position);
  } else corde.visible = false;
  // Caméra de côté : on voit le héros, la corde et le mur de l'immeuble
  c.camera.fov = 50;
  const k = doux(prog(t, 31, 34));
  const milieu = _w.lerpVectors(depart, cible, 0.5);
  c.camera.position.set(milieu.x + 12.5, lerp(2.2, 6.5, k), milieu.z - 1.5 + k * 1.5);
  c.camera.lookAt(lerp(milieu.x, pos.x, 0.5), lerp(milieu.y, pos.y + 1, 0.55), lerp(milieu.z, pos.z, 0.55));
  c.camera.updateProjectionMatrix();
  renderer.render(c.scene, c.camera);
  corde.visible = false; crochet.visible = false;
}

// ---------- Scène 08 : le couteau dans le dos (sur l'île) ----------
const rouge = nouveauPerso(normaliserStyle({ peau: '#c68642', cheveux: '#121212', coupe: 'herisses', haut: 'tshirt', bas: 'cargo', basC: '#6b7280' }), 1);
ile.scene.add(rouge.groupe);
const DOS = { rouge: new THREE.Vector3(4, 0.8, 25.6), regard: new THREE.Vector3(0, 0, 1) };
let ragdollRouge = null;
const etoilesDos = [0, 1, 2, 3].map(() => {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ETOILE, transparent: true, depthWrite: false }));
  sp.visible = false;
  ile.scene.add(sp);
  return sp;
});
const cubesDos = nuageCubes(ile.scene, 26, ['#ffd84a', '#ffffff', '#ff8a1f', '#7fe8ff'], 21);
function preparerDos() {
  // le rouge, au moment du coup (35,9 s), avant de basculer
  rouge.groupe.position.copy(DOS.rouge);
  rouge.groupe.rotation.set(0, angleVers(DOS.regard.x, DOS.regard.z), 0);
  poseRepos(rouge, 35.9);
  cacherArme(rouge);
  ragdollRouge = enregistrerRagdoll(ile.scene, rouge, { impulsion: new THREE.Vector3(0, 0, 1), boites: ile.boites, force: 0.42, duree: 3 }, 1.4);
}
function rendreDos(t) {
  const c = ile;
  const h = herosIle;
  h.groupe.visible = true;
  h.prendreArme('couteau', 'melee');
  h.arme.visible = true;
  // le héros arrive derrière le rouge, sur la pointe des pieds
  const derriere = DOS.rouge.clone().addScaledVector(DOS.regard, -1.15);
  const debut = derriere.clone().add(new THREE.Vector3(-2.8, 0, 0.15));
  const k = doux(prog(t, 34, 35.2));
  h.groupe.position.lerpVectors(debut, derriere, k);
  h.groupe.position.y = DOS.rouge.y;
  h.groupe.rotation.set(0, angleVers(DOS.rouge.x - h.groupe.position.x, DOS.rouge.z - h.groupe.position.z), 0);
  if (t < 35.2) poseMarche(h, t * 0.6, 2.2, {});
  else {
    h.temps = t; h.viseeLisse = 1; h.choc = 0;
    const a = prog(t, 35.3, 36.05);
    h.anim = a > 0 && a < 1 ? { type: 'coup', t: a * 0.75, duree: 0.75, special: true } : null;
    h.animer(0, { vitesse: 0, enLAir: false, pitch: -0.2, visee: true });
  }
  // le rouge regarde la mer, puis bascule en ragdoll
  const tr = t - 35.9;
  rouge.groupe.visible = tr < 0;
  if (tr < 0) {
    rouge.groupe.position.copy(DOS.rouge);
    rouge.groupe.rotation.set(0, angleVers(DOS.regard.x, DOS.regard.z), 0);
    poseRepos(rouge, t);
    cacherArme(rouge);
  }
  ragdollRouge.montrer(tr);
  // étoiles et cubes au moment du coup
  const centre = tr >= 0 ? ragdollRouge.centre(tr) : DOS.rouge;
  etoilesDos.forEach((sp, i) => {
    const e = t - 35.85 - i * 0.06;
    sp.visible = e > 0 && e < 1.0;
    if (!sp.visible) return;
    const a = i * 1.7 + e * 3;
    sp.position.set(centre.x + Math.cos(a) * 0.6, centre.y + 1.1 + e * 0.8, centre.z + Math.sin(a) * 0.6);
    const s = 0.35 * Math.sin(Math.PI * clamp(e / 1.0));
    sp.scale.set(s, s, 1);
  });
  cubesDos.montrer(new THREE.Vector3(DOS.rouge.x, DOS.rouge.y + 1.2, DOS.rouge.z), t - 35.88, 1.2);
  // Caméra de trois quarts, à hauteur d'épaule, qui se rapproche
  const kc = doux(prog(t, 34, 37));
  c.camera.fov = 45;
  c.camera.position.set(DOS.rouge.x + lerp(4.2, 3.6, kc), DOS.rouge.y + lerp(1.9, 1.7, kc), DOS.rouge.z - lerp(4.8, 3.9, kc));
  c.camera.lookAt(DOS.rouge.x - 0.6, DOS.rouge.y + 1.0, DOS.rouge.z + 0.2);
  c.camera.updateProjectionMatrix();
  renderer.render(c.scene, c.camera);
}

// ---------- Scène 09 : « ding ! » puis la grenade (dans l'arène) ----------
const DING = { heros: new THREE.Vector3(-27, 0, -20), regard: new THREE.Vector3(-1, 0, 0) }; // longue allée dégagée de l'arène
const T_TIR = 37.36; const T_DING = 37.6; const T_COUPE_DING = 37.55;
// Le joueur rouge qui tire sur la poêle (derrière le héros)
const tireur = nouveauPerso(normaliserStyle({ peau: '#a8714a', cheveux: '#121212', coupe: 'courts', haut: 'veste', bas: 'cargo', basC: '#2b3a67', chapeau: 'casquette', chapeauC: '#2a2a2a' }), 1);
arene.scene.add(tireur.groupe);
const POS_TIREUR = DING.heros.clone().add(new THREE.Vector3(9, 0, 0.6));
const flashTir = new THREE.Sprite(new THREE.SpriteMaterial({ map: LUEUR_CHAUDE, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
flashTir.visible = false;
arene.scene.add(flashTir);
const etincelleDing = new THREE.Sprite(new THREE.SpriteMaterial({ map: ETOILE, transparent: true, depthWrite: false }));
etincelleDing.visible = false;
arene.scene.add(etincelleDing);
const flashDing = new THREE.Sprite(new THREE.SpriteMaterial({ map: LUEUR_CHAUDE, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
flashDing.visible = false;
arene.scene.add(flashDing);
const trainee = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 1), new THREE.MeshBasicMaterial({ color: 0xffe9a8 }));
trainee.visible = false;
arene.scene.add(trainee);
// Les trois joueurs soufflés par la grenade
const GROUPE = new THREE.Vector3(-24, 0, -21); // zone dégagée de l'arène
const victimes = [
  { style: { peau: '#8d5524', cheveux: '#121212', haut: 'maillot', hautC1: '#ff3b3b', motif: 'numero', chapeau: 'chantier', chapeauC: '#ffd21f' }, d: [-0.9, 0, 0.2] },
  { style: { peau: '#ffdbac', cheveux: '#d9a441', coupe: 'longs', haut: 'pull', hautC1: '#8b5cf6', chapeau: 'bonnet', chapeauC: '#14b8a6' }, d: [0.8, 0, -0.3] },
  { style: { peau: '#9be37a', cheveux: '#2bd46c', coupe: 'herisses', haut: 'tshirt', hautC1: '#ffffff', motif: 'smiley', hautC2: '#ffd21f', accVisage: 'lunettes_rondes' }, d: [0.1, 0, 0.9] },
].map((v) => {
  const p = nouveauPerso(normaliserStyle(v.style));
  arene.scene.add(p.groupe);
  p.groupe.position.set(GROUPE.x + v.d[0], 0, GROUPE.z + v.d[2]);
  return { ...v, p };
});
const grenade = modeleGrenadeVol('grenade');
grenade.scale.setScalar(2.6);
grenade.visible = false;
arene.scene.add(grenade);
const flashExplosion = new THREE.Sprite(new THREE.SpriteMaterial({ map: LUEUR_CHAUDE, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
flashExplosion.visible = false;
arene.scene.add(flashExplosion);
const cubesExplosion = nuageCubes(arene.scene, 60, ['#ff8a1f', '#ffd21f', '#ffffff', '#bdbdbd', '#6b7280'], 33);
const T_BOUM = 39.2; // sur un temps fort de la musique
let ragdollsBoum = [];
function preparerBoum() {
  ragdollsBoum = victimes.map((v, i) => {
    v.p.groupe.rotation.set(0, angleVers(-v.d[0] - 0.5, 2), 0);
    poseRepos(v.p, T_BOUM + i);
    cacherArme(v.p);
    const imp = new THREE.Vector3(v.d[0], 0, v.d[2] + 0.2).normalize();
    return enregistrerRagdoll(arene.scene, v.p, { impulsion: imp, boites: arene.boites, force: 1.9 + i * 0.15, duree: 4 }, 1.6);
  });
}
// Trajectoire de la grenade : lancée de la gauche, un rebond, explose au milieu du groupe
function positionGrenade(t, cible) {
  const a = GROUPE.clone().add(new THREE.Vector3(9, 1.6, 2.5)); const r = GROUPE.clone().add(new THREE.Vector3(3.4, 0.12, 0.9)); const b = new THREE.Vector3(GROUPE.x, 0.12, GROUPE.z + 0.2);
  // lancée à 38,65 s, rebondit à 38,95 s, roule jusqu'au groupe et explose à 39,2 s
  if (t < 38.65) return cible.copy(a);
  if (t < 38.95) { const k = prog(t, 38.65, 38.95); cible.lerpVectors(a, r, k); cible.y = lerp(a.y, r.y, k) + 2.2 * 4 * k * (1 - k); return cible; }
  const k = prog(t, 38.95, T_BOUM);
  cible.lerpVectors(r, b, k); cible.y = 0.12 + 0.5 * 4 * k * (1 - k);
  return cible;
}
function rendreDingA(t) {
  const c = arene;
  const h = herosArene;
  tireur.groupe.visible = true;
  victimes.forEach((v) => { v.p.groupe.visible = false; });
  ragdollsBoum.forEach((r) => r.montrer(-1));
  grenade.visible = false; flashExplosion.visible = false; cubesExplosion.montrer(_v, -1);
  h.groupe.visible = true;
  h.prendreArme('fusil', 'principale');
  h.arme.visible = true;
  h.afficherPoeleDos(true);
  if (!h.poeleDos.userData.ajustee) {
    // deux fois plus grande, et bien centrée au milieu du dos
    h.poeleDos.scale.setScalar(2.0);
    h.groupe.updateMatrixWorld(true);
    const centre = new THREE.Box3().setFromObject(h.poeleDos).getCenter(new THREE.Vector3());
    h.parties.corps.mesh.worldToLocal(centre);
    h.poeleDos.position.y -= centre.y + 0.02;
    h.poeleDos.position.z += 0.015;
    h.poeleDos.userData.ajustee = true;
  }
  if (h.accessoires.cape) h.accessoires.cape.visible = false;
  h.groupe.position.copy(DING.heros);
  h.groupe.rotation.set(0, angleVers(DING.regard.x, DING.regard.z), 0);
  poseMarche(h, t, 0, { pitch: 0.05 });
  const impact = T_DING;
  h.choc = clamp(1 - (t - impact) * 4, 0, 1) * (t >= impact ? 1 : 0);
  h.parties.corps.pivot.rotation.x = -h.choc * 0.25;
  h.materiau.emissive.setScalar(h.choc * 0.08);
  // la poêle dans le dos (monde)
  h.groupe.updateMatrixWorld(true);
  const poele = new THREE.Box3().setFromObject(h.poeleDos).getCenter(new THREE.Vector3());
  // le tireur vise la poêle et tire
  tireur.groupe.position.copy(POS_TIREUR);
  tireur.groupe.rotation.set(0, angleVers(poele.x - POS_TIREUR.x, poele.z - POS_TIREUR.z), 0);
  tireur.prendreArme('fusil', 'principale');
  tireur.arme.visible = true;
  tireur.temps = t; tireur.viseeLisse = 1; tireur.anim = null;
  tireur.choc = 0;
  const recul = t >= T_TIR ? Math.exp(-(t - T_TIR) * 12) : 0;
  tireur.animer(0, { vitesse: 0, enLAir: false, pitch: Math.atan2(poele.y - 1.55, poele.distanceTo(POS_TIREUR)) + recul * 0.25, visee: true });
  tireur.groupe.updateMatrixWorld(true);
  const source = tireur.boutDuCanon(new THREE.Vector3());
  flashTir.visible = t >= T_TIR && t < T_TIR + 0.08;
  if (flashTir.visible) { flashTir.position.copy(source); const f = 0.9 * (1 - (t - T_TIR) / 0.08); flashTir.scale.set(f, f, 1); }
  const kt = prog(t, T_TIR, impact);
  trainee.visible = t > T_TIR && t < impact + 0.05;
  if (trainee.visible) {
    const bout = _w.lerpVectors(source, poele, kt);
    const queue = _v.lerpVectors(source, poele, Math.max(0, kt - 0.35));
    trainee.position.copy(bout).add(queue).multiplyScalar(0.5);
    trainee.scale.set(1, 1, bout.distanceTo(queue));
    trainee.lookAt(bout);
  }
  const e = t - impact;
  etincelleDing.visible = e >= 0 && e < 0.5;
  flashDing.visible = e >= 0 && e < 0.25;
  if (etincelleDing.visible) {
    const back = poele.clone().addScaledVector(DING.regard, -0.12); // juste devant la poêle, côté tireur
    etincelleDing.position.copy(back);
    const s = 0.55 * sortieCubique(clamp(e / 0.12)) * (1 - prog(e, 0.25, 0.5));
    etincelleDing.scale.set(s, s, 1);
    etincelleDing.material.rotation = e * 6;
    flashDing.position.copy(back);
    const f = 0.9 * (1 - prog(e, 0, 0.25));
    flashDing.scale.set(f, f, 1);
  }
  if (t < T_COUPE_DING) {
    // Plan 1 : par-dessus l'épaule du tireur, on voit la poêle dans le dos du héros
    const k = doux(prog(t, 37.0, T_COUPE_DING));
    c.camera.fov = 30;
    c.camera.position.set(POS_TIREUR.x + 2.3 - k * 0.4, 2.0, POS_TIREUR.z + 1.5 - k * 0.2);
    c.camera.lookAt(lerp(poele.x, POS_TIREUR.x, 0.25), poele.y + 0.15, lerp(poele.z, POS_TIREUR.z, 0.25));
  } else {
    // Plan 2 : gros plan sur la poêle au moment du « DING »
    const sec = e > 0 ? Math.exp(-e * 8) * Math.sin(e * 60) * 0.03 : 0;
    const k = doux(prog(t, T_COUPE_DING, 38.6));
    c.camera.fov = 40;
    c.camera.position.set(DING.heros.x + 2.3 - k * 0.3 + sec, 1.5 + sec, DING.heros.z + 0.9);
    c.camera.lookAt(poele.x, poele.y + 0.05, poele.z + 0.05);
  }
  c.camera.updateProjectionMatrix();
  renderer.render(c.scene, c.camera);
  trainee.visible = false; etincelleDing.visible = false; flashDing.visible = false; flashTir.visible = false;
}
function rendreDingB(t) {
  const c = arene;
  herosArene.groupe.visible = false;
  tireur.groupe.visible = false;
  const tb = t - T_BOUM;
  victimes.forEach((v, i) => {
    v.p.groupe.visible = tb < 0;
    if (tb < 0) {
      v.p.groupe.position.set(GROUPE.x + v.d[0], 0, GROUPE.z + v.d[2]);
      v.p.groupe.rotation.set(0, angleVers(-v.d[0] - 0.5, 2) + Math.sin(t * 2 + i) * 0.2, 0);
      poseRepos(v.p, t + i);
      cacherArme(v.p);
      // ils voient la grenade arriver : bras en l'air
      const peur = prog(t, 38.95, 39.15);
      v.p.parties.brasD.pivot.rotation.set(0, 0, 0.06 + peur * 2.4);
      v.p.parties.brasG.pivot.rotation.set(0, 0, -(0.06 + peur * 2.4));
    }
  });
  ragdollsBoum.forEach((r) => r.montrer(tb));
  grenade.visible = tb < 0;
  if (grenade.visible) { positionGrenade(t, grenade.position); grenade.rotation.set(t * 9, t * 5, 0); }
  flashExplosion.visible = tb >= 0 && tb < 0.45;
  if (flashExplosion.visible) {
    flashExplosion.position.set(GROUPE.x, 1.0, GROUPE.z);
    const f = 9 * sortieCubique(clamp(tb / 0.12)) * (1 - prog(tb, 0.15, 0.45));
    flashExplosion.scale.set(f, f, 1);
  }
  cubesExplosion.montrer(new THREE.Vector3(GROUPE.x, 0.4, GROUPE.z), tb, 1.6);
  // Caméra large, qui recule un peu au moment de l'explosion
  const sec = tb > 0 ? Math.exp(-tb * 5) * Math.sin(tb * 50) * 0.12 : 0;
  c.camera.fov = 50;
  const recul = sortieCubique(prog(t, T_BOUM, T_BOUM + 0.8));
  c.camera.position.set(GROUPE.x + 5.6 + recul * 1.4 + sec, 2.0 + recul * 1.2 + sec, GROUPE.z + 3.3 + recul * 0.9);
  c.camera.lookAt(GROUPE.x + 0.4, 1.2 + recul * 1.6, GROUPE.z);
  c.camera.updateProjectionMatrix();
  renderer.render(c.scene, c.camera);
}

// ---------- Scène 10 : un ragdoll retombe au ralenti sur un trampoline ----------
// Trampoline de l'arène (7..9, -10..-8)
const TRAMP_FUN = new THREE.Vector3(8, 0.2, -9);
const persoFun = nouveauPerso(normaliserStyle({ peau: '#7fc8ff', cheveux: '#ff5fa2', coupe: 'queue', haut: 'sweat', hautC1: '#ffd21f', motif: 'etoile', hautC2: '#ff3b3b', bas: 'short', basC: '#14b8a6', chapeau: 'bonnet', chapeauC: '#ec4899' }));
arene.scene.add(persoFun.groupe);
let ragdollFun = null;
let CONTACT_FUN = 1;
const T_GEL = 41.55; // l'image se fige
function preparerFun() {
  persoFun.groupe.position.set(TRAMP_FUN.x - 2.2, 5.6, TRAMP_FUN.z + 1.2);
  persoFun.groupe.rotation.set(0.6, 0.8, 0.3);
  poseRepos(persoFun, 3);
  cacherArme(persoFun);
  ragdollFun = enregistrerRagdoll(arene.scene, persoFun, { impulsion: new THREE.Vector3(1, 0, -0.5).normalize(), vitesse: new THREE.Vector3(2.0, -1, -1.0), boites: arene.boites, force: 0.35, duree: 5 }, 3);
  persoFun.groupe.visible = false;
  // instant du premier contact avec le trampoline (le corps arrête de descendre)
  let prec = Infinity;
  CONTACT_FUN = 1;
  for (let f = 0; f < 3 * FPS; f++) {
    const y = ragdollFun.centre(f / FPS).y;
    if (y > prec - 1e-4 && f > 3) { CONTACT_FUN = f / FPS; break; }
    prec = y;
  }
}
// temps local du ragdoll : ralenti (x0,3) puis figé
function tempsFun(t) {
  return CONTACT_FUN + 0.04 - (T_GEL - Math.min(t, T_GEL)) * 0.3;
}
function rendreFun(t) {
  const c = arene;
  herosArene.groupe.visible = false;
  tireur.groupe.visible = false;
  victimes.forEach((v) => { v.p.groupe.visible = false; });
  ragdollsBoum.forEach((r) => r.montrer(-1));
  grenade.visible = false; flashExplosion.visible = false; cubesExplosion.montrer(_v, -1);
  persoFun.groupe.visible = false;
  const tl = tempsFun(t);
  ragdollFun.montrer(tl);
  const centre = ragdollFun.centre(tl);
  const ancienFog = c.scene.fog;
  c.scene.fog = new THREE.Fog(ancienFog.color, 6, 34); // décor adouci : on ne regarde que lui
  c.camera.fov = 38;
  const k = doux(prog(t, 40, T_GEL));
  c.camera.position.set(TRAMP_FUN.x + 3.6 - k * 0.6, 0.9 + k * 0.2, TRAMP_FUN.z + 3.4 - k * 0.6);
  c.camera.lookAt(lerp(TRAMP_FUN.x - 0.6, centre.x, 0.5), lerp(1.2, centre.y, 0.4), lerp(TRAMP_FUN.z, centre.z, 0.5));
  c.camera.updateProjectionMatrix();
  renderer.render(c.scene, c.camera);
  c.scene.fog = ancienFog;
  ragdollFun.montrer(-1);
}

// ======================================================================
// Le chef d'orchestre : quelle scène pour quel instant
// ======================================================================
const dans = (t, [a, b]) => t >= a && t < b;
let pret = false;
export function rendre(t) {
  if (!pret) return;
  Math.random = graineur(Math.round(t * 1000) + 1); // même instant = même hasard
  if (dans(t, T.tete)) return rendrePodium(t, 'tete');
  if (dans(t, T.podium)) return rendrePodium(t, 'podium');
  if (dans(t, T.garde)) return rendrePodium(t, 'garde');
  if (dans(t, T.armes)) return vitrine.rendre(t);
  if (dans(t, T.compte)) return rendreCompte(t);
  if (dans(t, T.sautA)) return rendreSautA(t);
  if (dans(t, T.sautB)) return rendreSautB(t);
  if (dans(t, T.grappin)) return rendreGrappin(t);
  if (dans(t, T.dos)) return rendreDos(t);
  if (dans(t, T.dingA)) return rendreDingA(t);
  if (dans(t, T.dingB)) return rendreDingB(t);
  if (dans(t, T.fun)) return rendreFun(t);
  return rendrePodium(Math.min(t, 49.999), 'logo');
}

// Préparation (les polices doivent être chargées pour les étiquettes en 3D)
async function preparer() {
  try { await document.fonts.load('700 64px "Space Mono"'); } catch { /* police de secours */ }
  // redessiner les étiquettes avec la bonne police
  for (const [sp, txt] of [[etiqChateau, 'CHÂTEAU'], [etiqVille, 'VILLE']]) {
    const n = etiquette3D(txt);
    sp.material.map.dispose();
    sp.material.map = n.material.map;
  }
  Math.random = graineur(424242);
  preparerDos();
  preparerBoum();
  preparerFun();
  pret = true;
  rendre(window.__hfThreeTime || 0);
}
window.__hf = window.__hf || {};
window.__hf.buildReady = window.__hf.buildReady || {};
window.__hf.buildReady['moteur-3d'] = preparer();
window.addEventListener('hf-seek', (e) => rendre(e.detail.time));
