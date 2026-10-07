// Modèles 3D des armes, construits avec des formes simples (boîtes, cylindres).
// Dimensions réelles en mètres. L'arme pointe vers -z ; l'origine est au niveau
// de la poignée. Chaque modèle donne aussi ses points importants (userData) :
//   bout      : bout du canon (d'où partent les balles et l'éclair)
//   visee     : centre du viseur (on aligne l'œil dessus en visant)
//   oeil      : distance entre l'œil et le viseur quand on vise
//   ejection  : d'où sortent les douilles
//   mainD / mainG : position des mains droite et gauche
//   hanche    : position de l'arme à l'écran sans viser
//   chargeur, pompe, culasse, munition : pièces animées (rechargement...)
import * as THREE from '../vendor/three.min.js';
import { habillerArme } from './armes-glb.js';
import { fabriquesNouvelles } from './armes-modeles-plus.js';

const phong = (color, shininess = 30, specular = 0x2a2a2a) => new THREE.MeshPhongMaterial({ color, shininess, specular });
const M = {
  noir: phong(0x24272c, 45, 0x3a3a3a),
  gris: phong(0x50555d, 50, 0x444444),
  polymere: phong(0x1c1e22, 12, 0x161616),
  bois: phong(0x7b4a25, 18, 0x221100),
  boisClair: phong(0x9a6436, 18, 0x221100),
  olive: phong(0x56603d, 15, 0x1a1a1a),
  tan: phong(0xb39b6c, 12, 0x1a1a1a),
  vert: phong(0x3d4a34, 15, 0x1a1a1a),
  laiton: phong(0xc9a33b, 80, 0x887744),
  rouge: phong(0x9b1c1c, 20, 0x220000),
  verre: new THREE.MeshPhongMaterial({
    color: 0x9cc8ff, transparent: true, opacity: 0.16, shininess: 120, specular: 0xffffff, depthWrite: false, side: THREE.DoubleSide,
  }),
  tubeInterieur: new THREE.MeshPhongMaterial({ color: 0x0b0c0e, shininess: 5, side: THREE.DoubleSide }),
  pointRouge: new THREE.MeshBasicMaterial({ color: 0xff2a2a }),
  reticule: new THREE.MeshBasicMaterial({ color: 0xff5a1f }),
  acier: phong(0xc9ced6, 110, 0xffffff),
  fonte: phong(0x1a1a1c, 35, 0x2a2a2a),
  orange: phong(0xff6a14, 30, 0x332211),
  vertGrenade: phong(0x4d5b2e, 20, 0x1a1a1a),
  grisClair: phong(0x9aa0a8, 40, 0x333333),
  blanc: phong(0xf2f2f2, 20, 0x222222),
  rougeVif: phong(0xd92b2b, 25, 0x220000),
  battebois: phong(0xc89a5b, 20, 0x221100),
  caoutchouc: phong(0x161616, 5, 0x111111),
  corde: phong(0xe8e1cf, 5, 0x111111),
  flamme: new THREE.MeshBasicMaterial({ color: 0xff7a2a }),
};

function boite(parent, w, h, d, x, y, z, mat, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  parent.add(m);
  return m;
}

// Cylindre couché le long de z (ou x si axe = 'x', y si axe = 'y').
function cylindre(parent, r, longueur, x, y, z, mat, { r2 = r, segments = 14, ouvert = false, axe = 'z' } = {}) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r2, longueur, segments, 1, ouvert), mat);
  if (axe === 'z') m.rotation.x = Math.PI / 2;
  else if (axe === 'x') m.rotation.z = Math.PI / 2;
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

function lentille(parent, r, x, y, z) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 18), M.verre);
  m.position.set(x, y, z);
  m.renderOrder = 5;
  parent.add(m);
  return m;
}

// Une lunette : tube ouvert (on voit à travers), lentilles, réticule au centre.
function lunette(parent, { y, zArriere, longueur, r, rAvant, rOeil }) {
  const zMilieu = zArriere - longueur / 2;
  cylindre(parent, r, longueur, 0, y, zMilieu, M.noir, { ouvert: true, segments: 20 });
  cylindre(parent, r * 0.97, longueur, 0, y, zMilieu, M.tubeInterieur, { ouvert: true, segments: 20 });
  const lAvant = longueur * 0.22;
  cylindre(parent, rAvant, lAvant, 0, y, zArriere - longueur - lAvant / 2 + 0.005, M.noir, { r2: r, ouvert: true, segments: 20 });
  const lOeil = 0.03;
  cylindre(parent, rOeil, lOeil, 0, y, zArriere + lOeil / 2, M.noir, { ouvert: true, segments: 20 });
  lentille(parent, rOeil * 0.95, 0, y, zArriere + lOeil);
  lentille(parent, rAvant * 0.95, 0, y, zArriere - longueur - lAvant + 0.006);
}

function fusil() {
  const g = new THREE.Group();
  boite(g, 0.05, 0.07, 0.22, 0, -0.01, 0, M.noir);                 // carcasse inférieure
  boite(g, 0.052, 0.05, 0.27, 0, 0.035, -0.02, M.noir);            // carcasse supérieure
  boite(g, 0.058, 0.062, 0.27, 0, 0.026, -0.285, M.polymere);      // garde-main
  boite(g, 0.03, 0.012, 0.5, 0, 0.066, -0.13, M.gris);             // rail
  for (let i = 0; i < 6; i++) boite(g, 0.06, 0.008, 0.012, 0, 0.026, -0.18 - i * 0.04, M.noir);
  cylindre(g, 0.011, 0.17, 0, 0.026, -0.5, M.noir);                // canon
  cylindre(g, 0.017, 0.05, 0, 0.026, -0.6, M.gris, { segments: 8 }); // cache-flamme
  const chargeur = new THREE.Group();
  chargeur.position.set(0, -0.04, -0.065);
  boite(chargeur, 0.028, 0.09, 0.07, 0, -0.045, 0, M.polymere);
  boite(chargeur, 0.028, 0.08, 0.068, 0, -0.12, -0.012, M.polymere, 0.25);
  g.add(chargeur);
  boite(g, 0.032, 0.1, 0.045, 0, -0.085, 0.075, M.polymere, -0.3); // poignée
  boite(g, 0.006, 0.02, 0.05, 0, -0.06, 0.02, M.noir);             // pontet
  cylindre(g, 0.015, 0.13, 0, 0.02, 0.18, M.noir);                 // tube de crosse
  boite(g, 0.045, 0.085, 0.16, 0, 0.0, 0.27, M.polymere);          // crosse
  boite(g, 0.048, 0.1, 0.02, 0, -0.005, 0.355, M.noir);            // plaque de couche
  boite(g, 0.015, 0.012, 0.03, 0.02, 0.045, 0.1, M.gris);          // levier d'armement
  // Lunette courte (grossissement ×1,8) avec réticule rouge
  boite(g, 0.024, 0.026, 0.026, 0, 0.083, -0.01, M.noir);
  boite(g, 0.024, 0.026, 0.026, 0, 0.083, -0.12, M.noir);
  lunette(g, { y: 0.108, zArriere: 0.02, longueur: 0.14, r: 0.02, rAvant: 0.026, rOeil: 0.022 });
  boite(g, 0.0016, 0.006, 0.0016, 0, 0.105, -0.13, M.reticule);
  boite(g, 0.004, 0.0016, 0.0016, 0, 0.1085, -0.13, M.reticule);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.026, -0.63), visee: new THREE.Vector3(0, 0.108, 0.05), oeil: 0.12,
    ejection: new THREE.Vector3(0.03, 0.035, -0.03), mainD: new THREE.Vector3(0, -0.08, 0.08), mainG: new THREE.Vector3(0, -0.01, -0.3),
    hanche: new THREE.Vector3(0.15, -0.165, -0.36), chargeur, flash: 0.22,
  });
  return g;
}

function smg() {
  const g = new THREE.Group();
  boite(g, 0.048, 0.07, 0.3, 0, 0.01, -0.03, M.noir);              // carcasse
  boite(g, 0.054, 0.056, 0.13, 0, 0.0, -0.21, M.tan);              // garde-main
  cylindre(g, 0.01, 0.06, 0, 0.012, -0.3, M.noir);                 // canon
  cylindre(g, 0.014, 0.03, 0, 0.012, -0.33, M.gris, { segments: 8 });
  const chargeur = new THREE.Group();
  chargeur.position.set(0, -0.025, -0.1);
  boite(chargeur, 0.026, 0.17, 0.045, 0, -0.085, -0.008, M.noir, 0.12);
  g.add(chargeur);
  boite(g, 0.032, 0.1, 0.045, 0, -0.07, 0.065, M.tan, -0.25);      // poignée
  boite(g, 0.006, 0.018, 0.045, 0, -0.04, 0.01, M.noir);
  cylindre(g, 0.006, 0.19, 0.018, 0.0, 0.21, M.gris);              // crosse en tiges
  cylindre(g, 0.006, 0.19, -0.018, 0.0, 0.21, M.gris);
  boite(g, 0.05, 0.075, 0.015, 0, -0.005, 0.305, M.noir);
  // Viseur point rouge
  boite(g, 0.028, 0.012, 0.05, 0, 0.051, -0.03, M.noir);
  cylindre(g, 0.017, 0.04, 0, 0.074, -0.03, M.noir, { ouvert: true, segments: 18 });
  cylindre(g, 0.0165, 0.04, 0, 0.074, -0.03, M.tubeInterieur, { ouvert: true, segments: 18 });
  lentille(g, 0.016, 0, 0.074, -0.049);
  const point = new THREE.Mesh(new THREE.SphereGeometry(0.0011, 8, 6), M.pointRouge);
  point.position.set(0, 0.074, -0.048);
  g.add(point);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.012, -0.35), visee: new THREE.Vector3(0, 0.074, -0.01), oeil: 0.2,
    ejection: new THREE.Vector3(0.03, 0.03, -0.03), mainD: new THREE.Vector3(0, -0.07, 0.07), mainG: new THREE.Vector3(0, -0.015, -0.21),
    hanche: new THREE.Vector3(0.14, -0.15, -0.33), chargeur, flash: 0.16,
  });
  return g;
}

function pompe() {
  const g = new THREE.Group();
  boite(g, 0.05, 0.068, 0.2, 0, 0, 0, M.noir);                      // carcasse
  cylindre(g, 0.012, 0.5, 0, 0.017, -0.35, M.noir);                 // canon
  cylindre(g, 0.011, 0.36, 0, -0.016, -0.28, M.noir);               // tube magasin
  const pompeG = new THREE.Group();
  boite(pompeG, 0.054, 0.048, 0.15, 0, -0.016, -0.28, M.bois);      // pompe (devant, en bois)
  for (let i = 0; i < 5; i++) boite(pompeG, 0.056, 0.004, 0.006, 0, -0.016, -0.23 - i * 0.025, M.noir);
  g.add(pompeG);
  const guidon = new THREE.Mesh(new THREE.SphereGeometry(0.0035, 8, 6), M.laiton);
  guidon.position.set(0, 0.031, -0.59);
  g.add(guidon);
  boite(g, 0.042, 0.075, 0.3, 0, -0.045, 0.25, M.bois, 0.12);       // crosse
  boite(g, 0.035, 0.065, 0.09, 0, -0.04, 0.11, M.bois, 0.35);
  boite(g, 0.045, 0.11, 0.02, 0, -0.07, 0.4, M.polymere, 0.12);     // plaque
  boite(g, 0.006, 0.02, 0.05, 0, -0.045, 0.02, M.noir);
  // Cartouches de réserve sur le côté
  for (let i = 0; i < 4; i++) {
    boite(g, 0.012, 0.012, 0.03, -0.031, 0.012 - (i % 2) * 0.0, -0.06 + i * 0.026, M.rouge, Math.PI / 2);
    boite(g, 0.013, 0.013, 0.008, -0.031, 0.012, -0.06 + i * 0.026 + 0.012, M.laiton);
  }
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.017, -0.61), visee: new THREE.Vector3(0, 0.05, 0.08), oeil: 0.26,
    ejection: new THREE.Vector3(0.03, 0.01, -0.02), mainD: new THREE.Vector3(0, -0.075, 0.13), mainG: new THREE.Vector3(0, -0.04, -0.28),
    hanche: new THREE.Vector3(0.15, -0.16, -0.35), pompe: pompeG, flash: 0.3,
  });
  return g;
}

function sniper() {
  const g = new THREE.Group();
  boite(g, 0.052, 0.08, 0.6, 0, -0.03, 0.04, M.vert);               // fût et crosse
  boite(g, 0.045, 0.035, 0.2, 0, 0.022, 0.25, M.vert);              // appui-joue
  boite(g, 0.055, 0.13, 0.03, 0, -0.04, 0.35, M.polymere);          // plaque de couche
  boite(g, 0.034, 0.09, 0.05, 0, -0.085, 0.1, M.vert, -0.3);         // poignée
  cylindre(g, 0.019, 0.25, 0, 0.035, -0.05, M.noir);                // boîtier
  cylindre(g, 0.013, 0.6, 0, 0.035, -0.47, M.noir);                 // canon
  cylindre(g, 0.02, 0.065, 0, 0.035, -0.8, M.gris, { segments: 8 }); // frein de bouche
  boite(g, 0.006, 0.02, 0.05, 0, -0.07, 0.03, M.noir);
  const chargeur = new THREE.Group();
  chargeur.position.set(0, -0.06, -0.04);
  boite(chargeur, 0.035, 0.05, 0.08, 0, -0.02, 0, M.noir);
  g.add(chargeur);
  // Culasse (levier à droite), qu'on manœuvre après chaque tir
  const culasse = new THREE.Group();
  culasse.position.set(0.0, 0.035, 0.06);
  cylindre(culasse, 0.004, 0.05, 0.03, 0, 0, M.gris, { axe: 'x', segments: 8 });
  const boule = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 8), M.noir);
  boule.position.set(0.055, 0, 0);
  culasse.add(boule);
  g.add(culasse);
  // Bipied replié
  cylindre(g, 0.004, 0.18, 0.012, -0.075, -0.33, M.noir, { segments: 6 });
  cylindre(g, 0.004, 0.18, -0.012, -0.075, -0.33, M.noir, { segments: 6 });
  // Grande lunette
  boite(g, 0.03, 0.04, 0.025, 0, 0.065, -0.14, M.noir);
  boite(g, 0.03, 0.04, 0.025, 0, 0.065, 0.02, M.noir);
  lunette(g, { y: 0.098, zArriere: 0.12, longueur: 0.33, r: 0.018, rAvant: 0.03, rOeil: 0.024 });
  cylindre(g, 0.011, 0.03, 0, 0.124, -0.06, M.noir, { axe: 'y', segments: 10 });   // tourelles
  cylindre(g, 0.011, 0.03, 0.026, 0.098, -0.06, M.noir, { axe: 'x', segments: 10 });
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.035, -0.84), visee: new THREE.Vector3(0, 0.098, 0.15), oeil: 0.07,
    ejection: new THREE.Vector3(0.03, 0.04, 0.0), mainD: new THREE.Vector3(0, -0.08, 0.11), mainG: new THREE.Vector3(0, -0.05, -0.2),
    hanche: new THREE.Vector3(0.16, -0.17, -0.38), chargeur, culasse, lunette: true, flash: 0.32,
  });
  return g;
}

function roquette() {
  const g = new THREE.Group();
  cylindre(g, 0.04, 0.95, 0, 0, -0.05, M.olive, { segments: 18 });          // tube
  cylindre(g, 0.047, 0.26, 0, 0, -0.05, M.bois, { segments: 18 });          // protection en bois
  cylindre(g, 0.04, 0.13, 0, 0, 0.48, M.noir, { r2: 0.062, ouvert: true, segments: 18 }); // tuyère arrière
  boite(g, 0.032, 0.1, 0.05, 0, -0.085, 0.06, M.bois, -0.2);                 // poignée
  boite(g, 0.032, 0.09, 0.045, 0, -0.08, -0.2, M.polymere, 0.1);             // poignée avant
  boite(g, 0.006, 0.02, 0.05, 0, -0.045, 0.02, M.noir);
  // Hausse et guidon
  boite(g, 0.004, 0.032, 0.004, 0, 0.058, -0.4, M.noir);
  boite(g, 0.02, 0.006, 0.006, 0, 0.075, -0.4, M.noir);
  boite(g, 0.024, 0.026, 0.006, 0, 0.055, 0.0, M.noir);
  // La roquette chargée (visible à l'avant)
  const munition = new THREE.Group();
  munition.position.set(0, 0, -0.52);
  cylindre(munition, 0.024, 0.1, 0, 0, -0.05, M.noir, { segments: 12 });
  cylindre(munition, 0.046, 0.2, 0, 0, -0.2, M.olive, { segments: 16 });
  const nez = new THREE.Mesh(new THREE.ConeGeometry(0.046, 0.13, 16), M.olive);
  nez.rotation.x = -Math.PI / 2;
  nez.position.set(0, 0, -0.365);
  munition.add(nez);
  g.add(munition);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0, -0.55), visee: new THREE.Vector3(0, 0.07, 0.02), oeil: 0.22,
    ejection: null, mainD: new THREE.Vector3(0, -0.085, 0.07), mainG: new THREE.Vector3(0, -0.075, -0.2),
    hanche: new THREE.Vector3(0.17, -0.11, -0.33), munition, flash: 0.45,
  });
  return g;
}

// Viseur holographique (cadre ouvert + point rouge) posé sur un rail à la hauteur y.
function holo(parent, y, z) {
  boite(parent, 0.034, 0.008, 0.06, 0, y - 0.022, z, M.noir);
  boite(parent, 0.004, 0.036, 0.05, -0.016, y, z, M.noir); boite(parent, 0.004, 0.036, 0.05, 0.016, y, z, M.noir);
  boite(parent, 0.036, 0.004, 0.05, 0, y + 0.018, z, M.noir);
  const verre = new THREE.Mesh(new THREE.PlaneGeometry(0.028, 0.032), M.verre);
  verre.position.set(0, y, z - 0.02);
  verre.renderOrder = 5;
  parent.add(verre);
  const point = new THREE.Mesh(new THREE.SphereGeometry(0.0011, 8, 6), M.pointRouge);
  point.position.set(0, y, z - 0.02);
  parent.add(point);
}

// Guidon et hausse (petites mires en métal)
function mires(parent, y, zAvant, zArriere) {
  boite(parent, 0.003, 0.008, 0.004, 0, y + 0.004, zAvant, M.noir);
  boite(parent, 0.004, 0.007, 0.004, -0.005, y + 0.0035, zArriere, M.noir);
  boite(parent, 0.004, 0.007, 0.004, 0.005, y + 0.0035, zArriere, M.noir);
}

function rafale() {
  // Fusil "bullpup" (le chargeur est derrière la poignée), avec poignée de transport et viseur holo
  const g = new THREE.Group();
  boite(g, 0.056, 0.085, 0.6, 0, 0.0, 0.0, M.polymere);                // corps
  boite(g, 0.05, 0.05, 0.16, 0, -0.005, -0.37, M.noir);                // garde-main
  cylindre(g, 0.011, 0.14, 0, 0.012, -0.5, M.noir);                     // canon
  cylindre(g, 0.016, 0.04, 0, 0.012, -0.585, M.gris, { segments: 8 });
  boite(g, 0.016, 0.03, 0.34, 0, 0.065, -0.08, M.noir);                 // poignée de transport
  boite(g, 0.012, 0.03, 0.02, 0, 0.05, -0.23, M.noir); boite(g, 0.012, 0.03, 0.02, 0, 0.05, 0.07, M.noir);
  holo(g, 0.112, -0.1);
  boite(g, 0.032, 0.1, 0.045, 0, -0.085, -0.04, M.polymere, -0.25);    // poignée (devant le chargeur)
  boite(g, 0.006, 0.02, 0.06, 0, -0.06, -0.09, M.noir);                // pontet
  const chargeur = new THREE.Group();
  chargeur.position.set(0, -0.04, 0.12);
  boite(chargeur, 0.028, 0.12, 0.06, 0, -0.06, 0, M.noir, 0.12);
  g.add(chargeur);
  boite(g, 0.06, 0.1, 0.02, 0, -0.005, 0.31, M.caoutchouc);            // plaque de couche
  // (l'origine reste à la poignée : on décale tout le modèle)
  g.children.forEach((c) => { c.position.z += 0.04; });
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.012, -0.57), visee: new THREE.Vector3(0, 0.112, -0.04), oeil: 0.18,
    ejection: new THREE.Vector3(0.03, 0.02, 0.1), mainD: new THREE.Vector3(0, -0.08, 0.0), mainG: new THREE.Vector3(0, -0.03, -0.32),
    hanche: new THREE.Vector3(0.15, -0.165, -0.38), chargeur, flash: 0.2,
  });
  return g;
}

function mitrailleuse() {
  const g = new THREE.Group();
  boite(g, 0.07, 0.09, 0.34, 0, 0.01, -0.04, M.noir);                   // boîtier
  boite(g, 0.072, 0.02, 0.2, 0, 0.065, -0.04, M.gris);                  // capot
  boite(g, 0.03, 0.012, 0.3, 0, 0.081, -0.06, M.gris);                  // rail
  holo(g, 0.105, -0.06);
  cylindre(g, 0.014, 0.56, 0, 0.02, -0.48, M.noir);                     // canon
  cylindre(g, 0.024, 0.3, 0, 0.02, -0.33, M.grisClair, { segments: 10, ouvert: true }); // cache-chaleur
  for (let i = 0; i < 6; i++) cylindre(g, 0.025, 0.006, 0, 0.02, -0.21 - i * 0.045, M.noir, { segments: 10 });
  cylindre(g, 0.02, 0.05, 0, 0.02, -0.78, M.gris, { segments: 8 });
  boite(g, 0.012, 0.05, 0.05, 0, 0.06, -0.38, M.noir);                  // poignée de transport
  boite(g, 0.012, 0.012, 0.12, 0, 0.085, -0.38, M.noir);
  boite(g, 0.05, 0.05, 0.14, 0, -0.04, -0.28, M.polymere);              // garde-main
  // Bipied replié
  cylindre(g, 0.005, 0.22, 0.014, -0.02, -0.55, M.noir, { segments: 6 });
  cylindre(g, 0.005, 0.22, -0.014, -0.02, -0.55, M.noir, { segments: 6 });
  // Boîte de munitions (sur le côté gauche, dessous) + bande de cartouches
  const chargeur = new THREE.Group();
  chargeur.position.set(-0.02, -0.04, -0.08);
  boite(chargeur, 0.1, 0.1, 0.13, -0.02, -0.06, 0, M.olive);
  boite(chargeur, 0.104, 0.012, 0.134, -0.02, -0.01, 0, M.vert);
  for (let i = 0; i < 4; i++) boite(chargeur, 0.012, 0.024, 0.008, 0.035, 0.015 + i * 0.012, 0.02 - i * 0.004, M.laiton, 0, 0, 0.4);
  g.add(chargeur);
  boite(g, 0.032, 0.1, 0.045, 0, -0.085, 0.07, M.polymere, -0.3);       // poignée
  boite(g, 0.006, 0.02, 0.05, 0, -0.06, 0.02, M.noir);
  boite(g, 0.05, 0.09, 0.22, 0, -0.005, 0.25, M.polymere);              // crosse
  boite(g, 0.052, 0.1, 0.02, 0, -0.005, 0.37, M.caoutchouc);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.02, -0.81), visee: new THREE.Vector3(0, 0.105, 0.0), oeil: 0.2,
    ejection: new THREE.Vector3(0.04, 0.0, -0.05), mainD: new THREE.Vector3(0, -0.08, 0.08), mainG: new THREE.Vector3(0, -0.04, -0.28),
    hanche: new THREE.Vector3(0.16, -0.19, -0.4), chargeur, flash: 0.26,
  });
  return g;
}

function precision() {
  // Fusil de précision semi-automatique (fût couleur sable, petite lunette)
  const g = new THREE.Group();
  boite(g, 0.05, 0.075, 0.24, 0, -0.005, 0, M.noir);                    // carcasse
  boite(g, 0.056, 0.06, 0.36, 0, 0.02, -0.3, M.tan);                    // garde-main
  boite(g, 0.03, 0.012, 0.52, 0, 0.056, -0.15, M.gris);                 // rail
  cylindre(g, 0.012, 0.22, 0, 0.022, -0.58, M.noir);                    // canon
  cylindre(g, 0.019, 0.06, 0, 0.022, -0.71, M.gris, { segments: 8 });   // frein de bouche
  const chargeur = new THREE.Group();
  chargeur.position.set(0, -0.04, -0.06);
  boite(chargeur, 0.03, 0.1, 0.075, 0, -0.05, 0, M.noir, 0.05);
  g.add(chargeur);
  boite(g, 0.032, 0.1, 0.045, 0, -0.085, 0.075, M.tan, -0.3);           // poignée
  boite(g, 0.006, 0.02, 0.05, 0, -0.06, 0.02, M.noir);
  boite(g, 0.048, 0.09, 0.24, 0, -0.01, 0.25, M.tan);                   // crosse
  boite(g, 0.044, 0.03, 0.14, 0, 0.045, 0.24, M.tan);                   // appui-joue
  boite(g, 0.05, 0.1, 0.02, 0, -0.01, 0.38, M.caoutchouc);
  boite(g, 0.024, 0.026, 0.026, 0, 0.074, -0.03, M.noir);
  boite(g, 0.024, 0.026, 0.026, 0, 0.074, -0.15, M.noir);
  lunette(g, { y: 0.1, zArriere: 0.02, longueur: 0.18, r: 0.019, rAvant: 0.027, rOeil: 0.022 });
  boite(g, 0.0016, 0.012, 0.0016, 0, 0.1, -0.17, M.noir);
  boite(g, 0.012, 0.0016, 0.0016, 0, 0.1, -0.17, M.noir);
  boite(g, 0.002, 0.002, 0.002, 0, 0.1, -0.168, M.pointRouge);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.022, -0.74), visee: new THREE.Vector3(0, 0.1, 0.05), oeil: 0.12,
    ejection: new THREE.Vector3(0.03, 0.03, -0.03), mainD: new THREE.Vector3(0, -0.08, 0.08), mainG: new THREE.Vector3(0, -0.01, -0.32),
    hanche: new THREE.Vector3(0.15, -0.17, -0.38), chargeur, flash: 0.24,
  });
  return g;
}

function arbalete() {
  const g = new THREE.Group();
  boite(g, 0.05, 0.06, 0.6, 0, 0.0, -0.08, M.bois);                     // fût
  boite(g, 0.016, 0.01, 0.42, 0, 0.033, -0.17, M.noir);                 // rail du carreau
  boite(g, 0.032, 0.1, 0.045, 0, -0.075, 0.06, M.bois, -0.3);           // poignée
  boite(g, 0.006, 0.02, 0.05, 0, -0.045, 0.01, M.noir);
  boite(g, 0.046, 0.085, 0.16, 0, -0.01, 0.28, M.bois);                 // crosse
  boite(g, 0.03, 0.03, 0.04, 0, 0.0, -0.4, M.noir);                     // tête
  // Branches (arcs) de chaque côté
  for (const sx of [-1, 1]) {
    const branche = boite(g, 0.27, 0.018, 0.026, sx * 0.14, 0.01, -0.4, M.noir, 0, sx * -0.22, 0);
    branche.position.z = -0.37;
    boite(g, 0.012, 0.022, 0.012, sx * 0.265, 0.01, -0.31, M.gris);     // poulie au bout
  }
  // La corde : deux segments qu'on tend ou qu'on relâche (userData.tendre)
  const corde = new THREE.Group();
  const segs = [0, 1].map(() => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.003, 1).translate(0, 0, 0.5), M.corde);
    corde.add(m);
    return m;
  });
  g.add(corde);
  const tendre = (k) => {
    // k = 0 : corde au repos (droite) ; k = 1 : tendue jusqu'au loquet
    const nock = new THREE.Vector3(0, 0.035, -0.31 + 0.25 * k);
    [[-0.265, segs[0]], [0.265, segs[1]]].forEach(([x, m]) => {
      const bout = new THREE.Vector3(x, 0.012, -0.31);
      const dir = nock.clone().sub(bout);
      m.position.copy(bout);
      m.scale.set(1, 1, dir.length());
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.normalize());
    });
  };
  tendre(1);
  // Le carreau chargé
  const munition = new THREE.Group();
  munition.position.set(0, 0.042, -0.06);
  cylindre(munition, 0.004, 0.36, 0, 0, -0.18, M.noir, { segments: 6 });
  const pointe = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.03, 6), M.acier);
  pointe.rotation.x = -Math.PI / 2;
  pointe.position.z = -0.375;
  munition.add(pointe);
  for (let i = 0; i < 3; i++) {
    const plume = boite(munition, 0.002, 0.016, 0.04, 0, 0, -0.01, M.rougeVif);
    plume.rotation.z = (i * Math.PI * 2) / 3;
  }
  g.add(munition);
  // Petite lunette
  boite(g, 0.022, 0.03, 0.022, 0, 0.06, -0.05, M.noir);
  boite(g, 0.022, 0.03, 0.022, 0, 0.06, 0.06, M.noir);
  lunette(g, { y: 0.088, zArriere: 0.11, longueur: 0.15, r: 0.017, rAvant: 0.024, rOeil: 0.02 });
  boite(g, 0.0016, 0.01, 0.0016, 0, 0.088, -0.06, M.reticule);
  boite(g, 0.01, 0.0016, 0.0016, 0, 0.088, -0.06, M.reticule);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.042, -0.44), visee: new THREE.Vector3(0, 0.088, 0.14), oeil: 0.12,
    ejection: null, mainD: new THREE.Vector3(0, -0.07, 0.07), mainG: new THREE.Vector3(0, -0.03, -0.24),
    hanche: new THREE.Vector3(0.15, -0.16, -0.36), munition, corde, tendre, flash: 0,
  });
  return g;
}

function revolver() {
  const g = new THREE.Group();
  boite(g, 0.028, 0.095, 0.036, 0, -0.045, 0.012, M.bois, -0.28);       // crosse en bois
  boite(g, 0.024, 0.045, 0.1, 0, 0.022, -0.02, M.gris);                 // carcasse
  cylindre(g, 0.0095, 0.16, 0, 0.034, -0.15, M.gris, { segments: 10 }); // canon
  boite(g, 0.008, 0.012, 0.16, 0, 0.044, -0.15, M.gris);                // nervure
  boite(g, 0.006, 0.016, 0.03, 0, 0.0, -0.01, M.gris);                  // pontet
  boite(g, 0.008, 0.018, 0.012, 0, 0.05, 0.04, M.noir, 0.4);            // chien
  // Barillet : pivote vers la gauche pour recharger
  const barillet = new THREE.Group();
  barillet.position.set(-0.014, 0.006, -0.03);
  const cyl = cylindre(barillet, 0.021, 0.05, 0.014, 0.018, 0, M.gris, { segments: 12 });
  cyl.userData.repos = cyl.position.clone();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    cylindre(barillet, 0.004, 0.052, 0.014 + Math.cos(a) * 0.012, 0.018 + Math.sin(a) * 0.012, 0, M.noir, { segments: 6 });
  }
  g.add(barillet);
  mires(g, 0.05, -0.225, 0.03);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.034, -0.235), visee: new THREE.Vector3(0, 0.055, 0.035), oeil: 0.3,
    ejection: null, mainD: new THREE.Vector3(0, -0.045, 0.02), mainG: new THREE.Vector3(-0.01, -0.06, 0.03),
    hanche: new THREE.Vector3(0.13, -0.14, -0.32), barillet, flash: 0.17, pistolet: true,
  });
  return g;
}

function pistolet() {
  const g = new THREE.Group();
  boite(g, 0.028, 0.1, 0.042, 0, -0.04, 0.02, M.polymere, -0.25);       // poignée
  const chargeur = new THREE.Group();
  chargeur.position.set(0, -0.06, 0.025);
  boite(chargeur, 0.022, 0.075, 0.032, 0, -0.012, 0, M.noir, -0.25);
  boite(chargeur, 0.026, 0.008, 0.038, 0, -0.05, 0.012, M.polymere, -0.25);
  g.add(chargeur);
  boite(g, 0.026, 0.02, 0.17, 0, 0.008, -0.05, M.polymere);             // carcasse
  const culasse = new THREE.Group();                                    // glissière (recule au tir)
  boite(culasse, 0.028, 0.03, 0.19, 0, 0.032, -0.05, M.noir);
  for (let i = 0; i < 5; i++) boite(culasse, 0.029, 0.022, 0.003, 0, 0.032, 0.02 + i * 0.008, M.gris);
  g.add(culasse);
  boite(g, 0.006, 0.016, 0.04, 0, -0.008, -0.02, M.polymere);           // pontet
  mires(g, 0.047, -0.135, 0.035);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.03, -0.15), visee: new THREE.Vector3(0, 0.054, 0.04), oeil: 0.3,
    ejection: new THREE.Vector3(0.02, 0.04, -0.03), mainD: new THREE.Vector3(0, -0.045, 0.02), mainG: new THREE.Vector3(-0.01, -0.06, 0.03),
    hanche: new THREE.Vector3(0.13, -0.14, -0.31), chargeur, culasse, flash: 0.13, pistolet: true,
  });
  return g;
}

function uzi() {
  const g = new THREE.Group();
  boite(g, 0.042, 0.07, 0.24, 0, 0.022, -0.05, M.noir);                 // boîtier
  cylindre(g, 0.009, 0.05, 0, 0.022, -0.19, M.noir);                    // canon court
  boite(g, 0.032, 0.09, 0.044, 0, -0.05, 0.0, M.polymere, -0.1);        // poignée
  const chargeur = new THREE.Group();                                   // chargeur dans la poignée
  chargeur.position.set(0, -0.09, 0.0);
  boite(chargeur, 0.022, 0.12, 0.03, 0, -0.03, 0, M.noir, -0.1);
  g.add(chargeur);
  boite(g, 0.006, 0.016, 0.04, 0, -0.018, -0.04, M.noir);               // pontet
  boite(g, 0.03, 0.03, 0.05, 0, -0.025, -0.13, M.polymere);             // poignée avant
  cylindre(g, 0.004, 0.14, 0.016, -0.012, -0.01, M.gris, { segments: 6 }); // crosse repliée sous le boîtier
  cylindre(g, 0.004, 0.14, -0.016, -0.012, -0.01, M.gris, { segments: 6 });
  boite(g, 0.04, 0.012, 0.03, 0, -0.012, 0.07, M.gris);
  mires(g, 0.057, -0.16, 0.04);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.022, -0.22), visee: new THREE.Vector3(0, 0.064, 0.05), oeil: 0.27,
    ejection: new THREE.Vector3(0.025, 0.04, -0.05), mainD: new THREE.Vector3(0, -0.05, 0.0), mainG: new THREE.Vector3(0, -0.04, -0.13),
    hanche: new THREE.Vector3(0.13, -0.14, -0.31), chargeur, flash: 0.12,
  });
  return g;
}

function canonScie() {
  const g = new THREE.Group();
  boite(g, 0.034, 0.09, 0.05, 0, -0.04, 0.03, M.bois, -0.4);           // crosse-pistolet en bois
  boite(g, 0.04, 0.04, 0.09, 0, 0.012, -0.02, M.gris);                 // bascule
  boite(g, 0.006, 0.016, 0.04, 0, -0.012, -0.0, M.noir);
  // Les deux canons (s'ouvrent vers le bas pour recharger)
  const canons = new THREE.Group();
  canons.position.set(0, 0.012, -0.065);
  for (const x of [-0.0125, 0.0125]) cylindre(canons, 0.0125, 0.27, x, 0.012, -0.135, M.noir, { segments: 10 });
  boite(canons, 0.042, 0.03, 0.16, 0, -0.012, -0.09, M.bois);          // devant en bois
  const munition = new THREE.Group();                                  // culots des cartouches
  for (const x of [-0.0125, 0.0125]) cylindre(munition, 0.011, 0.006, x, 0.012, 0.003, M.laiton, { segments: 10 });
  canons.add(munition);
  g.add(canons);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.024, -0.34), visee: new THREE.Vector3(0, 0.05, 0.03), oeil: 0.3,
    ejection: null, mainD: new THREE.Vector3(0, -0.05, 0.03), mainG: new THREE.Vector3(0, -0.01, -0.16),
    hanche: new THREE.Vector3(0.14, -0.15, -0.32), canons, munitionCanon: munition, flash: 0.3,
  });
  return g;
}

function lanceFusee() {
  const g = new THREE.Group();
  boite(g, 0.032, 0.1, 0.045, 0, -0.04, 0.02, M.orange, -0.25);        // poignée
  boite(g, 0.034, 0.03, 0.08, 0, 0.012, -0.0, M.orange);                // carcasse
  boite(g, 0.008, 0.02, 0.04, 0, -0.012, -0.02, M.orange);
  boite(g, 0.01, 0.02, 0.012, 0, 0.032, 0.04, M.noir, 0.4);            // chien
  const canons = new THREE.Group();                                     // canon (bascule vers le bas)
  canons.position.set(0, 0.02, -0.04);
  cylindre(canons, 0.02, 0.16, 0, 0.012, -0.08, M.orange, { segments: 14 });
  cylindre(canons, 0.014, 0.005, 0, 0.012, -0.161, M.noir, { segments: 14 });
  const munition = new THREE.Group();
  cylindre(munition, 0.017, 0.008, 0, 0.012, 0.004, M.rougeVif, { segments: 12 });
  canons.add(munition);
  g.add(canons);
  mires(g, 0.052, -0.19, 0.03);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.032, -0.2), visee: new THREE.Vector3(0, 0.058, 0.035), oeil: 0.3,
    ejection: null, mainD: new THREE.Vector3(0, -0.045, 0.02), mainG: new THREE.Vector3(-0.01, -0.06, 0.03),
    hanche: new THREE.Vector3(0.13, -0.14, -0.31), canons, munitionCanon: munition, flash: 0.22, pistolet: true,
  });
  return g;
}

// ----- Mêlée -----
// repos / garde : position et rotation (x, y, z) de l'arme à l'écran, au repos et "en garde" (clic droit).
function couteau() {
  const g = new THREE.Group();
  boite(g, 0.024, 0.03, 0.11, 0, 0, 0.01, M.caoutchouc);               // manche
  boite(g, 0.03, 0.04, 0.008, 0, 0.002, -0.048, M.noir);               // garde
  const lame = new THREE.Group();
  boite(lame, 0.004, 0.032, 0.15, 0, 0.004, -0.125, M.acier);
  boite(lame, 0.004, 0.022, 0.035, 0, 0.0, -0.21, M.acier, 0.45);       // pointe
  boite(lame, 0.0045, 0.006, 0.15, 0, 0.018, -0.125, M.gris);           // dos de la lame
  g.add(lame);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.0, -0.23), visee: new THREE.Vector3(0, 0, 0), oeil: 0.3,
    ejection: null, mainD: new THREE.Vector3(0, -0.005, 0.02), mainG: null,
    hanche: new THREE.Vector3(0.16, -0.13, -0.32), lame, flash: 0, melee: true,
    repos: [0.15, 0.35, -0.5], garde: { pos: new THREE.Vector3(0.13, -0.08, -0.38), rot: [-0.55, 0.1, -0.2] },
  });
  return g;
}

function batte() {
  const g = new THREE.Group();
  cylindre(g, 0.033, 0.62, 0, 0, -0.38, M.battebois, { r2: 0.016, segments: 14 }); // de la poignée (fine) au bout (large)
  cylindre(g, 0.015, 0.16, 0, 0, 0.0, M.battebois, { segments: 10 });
  cylindre(g, 0.024, 0.02, 0, 0, 0.085, M.battebois, { segments: 12 });            // pommeau
  for (let i = 0; i < 4; i++) cylindre(g, 0.0162, 0.012, 0, 0, 0.04 - i * 0.025, M.caoutchouc, { segments: 10 });
  cylindre(g, 0.033, 0.004, 0, 0, -0.69, M.battebois, { segments: 14 });
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0, -0.68), visee: new THREE.Vector3(0, 0, 0), oeil: 0.3,
    ejection: null, mainD: new THREE.Vector3(0, 0, 0.02), mainG: new THREE.Vector3(0, 0, 0.07),
    hanche: new THREE.Vector3(0.25, -0.3, -0.55), flash: 0, melee: true,
    repos: [0.75, 0.55, -0.4], garde: { pos: new THREE.Vector3(0.3, -0.27, -0.42), rot: [1.27, -0.1, -0.3] },
  });
  return g;
}

function poele() {
  const g = new THREE.Group();
  boite(g, 0.022, 0.016, 0.2, 0, 0, -0.06, M.fonte);                   // manche
  boite(g, 0.024, 0.018, 0.07, 0, 0, 0.03, M.bois);                    // poignée en bois
  const fond = cylindre(g, 0.125, 0.012, 0, -0.012, -0.29, M.fonte, { axe: 'y', segments: 20 });
  fond.userData.fond = true;
  cylindre(g, 0.13, 0.04, 0, 0.008, -0.29, M.fonte, { r2: 0.125, ouvert: true, axe: 'y', segments: 20 }); // bord
  cylindre(g, 0.118, 0.002, 0, -0.005, -0.29, M.grisClair, { axe: 'y', segments: 20 });                    // intérieur
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0, -0.29), visee: new THREE.Vector3(0, 0, 0), oeil: 0.3,
    ejection: null, mainD: new THREE.Vector3(0, 0, 0.03), mainG: null,
    hanche: new THREE.Vector3(0.2, -0.24, -0.46), flash: 0, melee: true,
    repos: [1.0, 0.2, -0.35], garde: { pos: new THREE.Vector3(0.2, -0.16, -0.46), rot: [1.6, 0.2, -0.3] },
  });
  return g;
}

// ----- Gadgets (tenus dans la main droite) -----
function grenade(fumee = false) {
  const g = new THREE.Group();
  const corps = new THREE.Group();
  if (fumee) {
    cylindre(corps, 0.028, 0.11, 0, 0, 0, M.grisClair, { axe: 'y', segments: 14 });
    cylindre(corps, 0.0285, 0.025, 0, 0.02, 0, M.vert, { axe: 'y', segments: 14 });
    cylindre(corps, 0.022, 0.015, 0, 0.062, 0, M.noir, { axe: 'y', segments: 12 });
  } else {
    const boule = new THREE.Mesh(new THREE.SphereGeometry(0.034, 14, 10), M.vertGrenade);
    boule.scale.y = 1.2;
    corps.add(boule);
    for (let i = 0; i < 3; i++) cylindre(corps, 0.0345, 0.004, 0, -0.02 + i * 0.02, 0, M.vert, { axe: 'y', segments: 14 });
    cylindre(corps, 0.012, 0.02, 0, 0.045, 0, M.grisClair, { axe: 'y', segments: 10 });
  }
  const haut = fumee ? 0.07 : 0.055;
  boite(corps, 0.012, 0.006, 0.06, 0, haut, 0.012, M.grisClair, -0.35);  // cuillère
  const goupille = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.0022, 6, 14), M.laiton);
  goupille.position.set(0.018, haut, -0.004);
  goupille.rotation.y = Math.PI / 2;
  corps.add(goupille);
  g.add(corps);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0, 0), visee: new THREE.Vector3(0, 0, 0), oeil: 0.3,
    ejection: null, mainD: new THREE.Vector3(0, -0.03, 0.01), mainG: null,
    hanche: new THREE.Vector3(0.15, -0.12, -0.3), flash: 0, gadget: true, objet: corps,
    repos: [0.2, 0.3, 0.1], garde: { pos: new THREE.Vector3(0.13, -0.08, -0.3), rot: [0.5, 0.2, 0.1] },
  });
  return g;
}

function grappin() {
  const g = new THREE.Group();
  boite(g, 0.032, 0.1, 0.045, 0, -0.04, 0.02, M.polymere, -0.25);      // poignée
  boite(g, 0.04, 0.05, 0.18, 0, 0.02, -0.06, M.noir);                  // corps
  cylindre(g, 0.026, 0.12, 0, 0.03, -0.2, M.gris, { segments: 14 });   // tube de lancement
  cylindre(g, 0.03, 0.04, 0.034, 0.012, -0.05, M.olive, { axe: 'x', segments: 14 }); // bobine de corde
  cylindre(g, 0.031, 0.005, 0.034, 0.012, -0.05, M.corde, { axe: 'x', segments: 14 });
  boite(g, 0.006, 0.016, 0.04, 0, -0.012, -0.0, M.noir);
  // Le crochet (part avec la corde quand on tire)
  const crochet = new THREE.Group();
  crochet.position.set(0, 0.03, -0.27);
  cylindre(crochet, 0.006, 0.07, 0, 0, 0, M.acier, { segments: 8 });
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const dent = boite(crochet, 0.006, 0.006, 0.05, Math.cos(a) * 0.016, Math.sin(a) * 0.016, -0.04, M.acier);
    dent.rotation.set(Math.sin(a) * 0.7, -Math.cos(a) * 0.7, 0);
  }
  g.add(crochet);
  mires(g, 0.045, -0.13, 0.02);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.03, -0.3), visee: new THREE.Vector3(0, 0.055, 0.03), oeil: 0.3,
    ejection: null, mainD: new THREE.Vector3(0, -0.045, 0.02), mainG: new THREE.Vector3(0, -0.005, -0.2),
    hanche: new THREE.Vector3(0.14, -0.15, -0.32), flash: 0, gadget: true, crochet, objet: crochet,
  });
  return g;
}

function kitSoin() {
  const g = new THREE.Group();
  const corps = new THREE.Group();
  boite(corps, 0.17, 0.11, 0.06, 0, 0, 0, M.blanc);
  boite(corps, 0.172, 0.014, 0.062, 0, 0.025, 0, M.rougeVif);
  boite(corps, 0.02, 0.06, 0.004, 0, -0.012, -0.031, M.rougeVif);       // croix
  boite(corps, 0.06, 0.02, 0.004, 0, -0.012, -0.031, M.rougeVif);
  boite(corps, 0.06, 0.012, 0.012, 0, 0.065, 0, M.noir);               // poignée
  g.add(corps);
  corps.position.set(0, 0.04, -0.02);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.04, -0.02), visee: new THREE.Vector3(0, 0, 0), oeil: 0.3,
    ejection: null, mainD: new THREE.Vector3(0.05, 0.0, 0.01), mainG: new THREE.Vector3(-0.07, 0.0, 0.0),
    hanche: new THREE.Vector3(0.1, -0.15, -0.38), flash: 0, gadget: true, objet: corps,
    repos: [0.1, 0.15, 0.05], garde: { pos: new THREE.Vector3(0.05, -0.12, -0.34), rot: [0.3, 0, 0] },
  });
  return g;
}

// Laser d'admin : un fusil futuriste noir avec un cœur d'énergie cyan qui brille (et brille plus en chargeant).
function laser() {
  const g = new THREE.Group();
  const corps = phong(0x14161c, 60, 0x3a3a3a);
  const neon = new THREE.MeshBasicMaterial({ color: 0x39e0ff });
  boite(g, 0.056, 0.06, 0.32, 0, 0, -0.03, corps);                  // carcasse
  boite(g, 0.03, 0.015, 0.52, 0, 0.05, -0.12, corps);              // rail dessus
  boite(g, 0.05, 0.05, 0.1, 0, 0.006, -0.2, corps);               // bloc avant
  // cœur d'énergie (brille) : on le garde dans userData pour le faire pulser en chargeant
  const coeur = cylindre(g, 0.02, 0.2, 0, 0.006, -0.12, neon, { segments: 16 });
  cylindre(g, 0.03, 0.14, 0, 0.006, -0.28, corps, { segments: 16 }); // canon émetteur
  const emetteur = cylindre(g, 0.026, 0.05, 0, 0.006, -0.37, neon, { segments: 16 });
  cylindre(g, 0.034, 0.03, 0, 0.006, -0.4, corps, { r2: 0.02, segments: 16 }); // bouche
  boite(g, 0.028, 0.1, 0.045, 0, -0.085, 0.07, corps, -0.3);       // poignée
  boite(g, 0.006, 0.02, 0.05, 0, -0.06, 0.02, corps);             // pontet
  boite(g, 0.045, 0.08, 0.16, 0, -0.005, 0.26, corps);            // crosse
  boite(g, 0.03, 0.05, 0.02, 0, 0.006, 0.18, neon);              // jauge arrière (brille)
  boite(g, 0.0016, 0.006, 0.0016, 0, 0.062, -0.14, M.reticule);   // mire
  // Trois anneaux d'énergie autour du canon : ils tourbillonnent de plus en plus vite pendant la charge (arme.js)
  const lumineux = (couleur, opacite = 0.8) => new THREE.MeshBasicMaterial({
    color: couleur, transparent: true, opacity: opacite, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const anneaux = [[-0.12, 0.052, 0.3, 0.15], [-0.25, 0.066, 0.55, 0.25], [-0.31, 0.078, -0.5, 0.45], [-0.37, 0.062, 0.35, -0.6]].map(([z, r, tx, ty], i) => {
    const pivot = new THREE.Group();
    pivot.position.set(0, 0.006, z);
    const tore = new THREE.Mesh(new THREE.TorusGeometry(r, 0.004, 6, 40), lumineux(i === 2 ? 0x9a6cff : 0x39e0ff));
    tore.rotation.set(tx, ty, 0);
    for (let k = 0; k < 3; k++) boite(tore, 0.009, 0.009, 0.009, Math.cos(k * 2.094) * r, Math.sin(k * 2.094) * r, 0, lumineux(0xffffff, 1)); // nœuds (on voit tourner)
    pivot.add(tore);
    g.add(pivot);
    pivot.userData.tore = tore;
    return pivot;
  });
  // Boule d'énergie au bout du canon (grossit avec la charge)
  const orbe = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureLueur(), color: 0x9ff4ff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  orbe.position.set(0, 0.006, -0.43);
  orbe.scale.setScalar(0.001);
  orbe.visible = false;
  g.add(orbe);
  // Petits éclairs entre les anneaux
  const arcs = new THREE.Line(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * 12), 3)),
    new THREE.LineBasicMaterial({ color: 0xd8fbff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
  arcs.visible = false;
  arcs.frustumCulled = false;
  g.add(arcs);
  // Particules aspirées par le canon (tourbillon)
  const vortex = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), lumineux(0x7ff0ff, 1), 64);
  vortex.visible = false;
  vortex.frustumCulled = false;
  g.add(vortex);
  Object.assign(g.userData, {
    bout: new THREE.Vector3(0, 0.006, -0.42), visee: new THREE.Vector3(0, 0.062, 0.05), oeil: 0.12,
    ejection: null, mainD: new THREE.Vector3(0, -0.08, 0.06), mainG: new THREE.Vector3(0, -0.01, -0.22),
    hanche: new THREE.Vector3(0.15, -0.165, -0.36), flash: 0, coeur, emetteur, anneaux, orbe, arcs, vortex,
  });
  return g;
}

// Texture ronde qui brille (blanc au centre, cyan, puis transparent)
let _lueur = null;
export function textureLueur() {
  if (_lueur) return _lueur;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d');
  const grad = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(190,250,255,0.95)');
  grad.addColorStop(0.55, 'rgba(60,200,255,0.45)');
  grad.addColorStop(1, 'rgba(40,120,255,0)');
  x.fillStyle = grad;
  x.fillRect(0, 0, 64, 64);
  _lueur = new THREE.CanvasTexture(c);
  return _lueur;
}

// Les nouvelles armes (et leurs projectiles) sont dans armes-modeles-plus.js
const PLUS = fabriquesNouvelles({ THREE, M, phong, boite, cylindre, lunette, holo, mires, textureLueur });
const FABRIQUES = {
  fusil, smg, pompe, sniper, roquette, rafale, mitrailleuse, precision, laser, arbalete,
  revolver, pistolet, uzi, canon_scie: canonScie, lance_fusee: lanceFusee,
  couteau, batte, poele, grenade: () => grenade(false), fumigene: () => grenade(true), grappin, kit_soin: kitSoin,
  ...PLUS.fabriques,
};

export function modeleArme(id, ombres = false) {
  const g = (FABRIQUES[id] || fusil)();
  if (ombres) g.traverse((o) => { if (o.isMesh && o.material !== M.verre) o.castShadow = true; });
  // Style « réaliste » choisi dans les réglages : le modèle .glb se pose par-dessus (voir armes-glb.js)
  return habillerArme(g, FABRIQUES[id] ? id : 'fusil', ombres);
}

// Une roquette en vol (pour l'affichage), qui pointe vers -z.
export function modeleRoquetteVol() {
  const g = new THREE.Group();
  cylindre(g, 0.045, 0.22, 0, 0, 0, M.olive, { segments: 12 });
  const nez = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.14, 12), M.olive);
  nez.rotation.x = -Math.PI / 2;
  nez.position.z = -0.18;
  g.add(nez);
  cylindre(g, 0.022, 0.16, 0, 0, 0.18, M.noir, { segments: 8 });
  for (let i = 0; i < 4; i++) {
    const a = boite(g, 0.004, 0.06, 0.06, 0, 0, 0.24, M.noir);
    a.rotation.z = (i * Math.PI) / 2;
    a.position.set(Math.sin((i * Math.PI) / 2) * 0.03, Math.cos((i * Math.PI) / 2) * 0.03, 0.24);
  }
  return g;
}

// Un carreau d'arbalète en vol (pointe vers -z).
export function modeleCarreauVol() {
  const g = new THREE.Group();
  cylindre(g, 0.005, 0.38, 0, 0, 0, M.noir, { segments: 6 });
  const pointe = new THREE.Mesh(new THREE.ConeGeometry(0.009, 0.035, 6), M.acier);
  pointe.rotation.x = -Math.PI / 2;
  pointe.position.z = -0.2;
  g.add(pointe);
  for (let i = 0; i < 3; i++) {
    const plume = boite(g, 0.002, 0.02, 0.05, 0, 0, 0.16, M.rougeVif);
    plume.rotation.z = (i * Math.PI * 2) / 3;
  }
  return g;
}

// Une fusée éclairante en vol (lumineuse).
export function modeleFuseeVol() {
  const g = new THREE.Group();
  cylindre(g, 0.014, 0.06, 0, 0, 0.02, M.rougeVif, { segments: 10 });
  const feu = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffd0a0 }));
  feu.position.z = -0.02;
  g.add(feu);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), new THREE.MeshBasicMaterial({
    color: 0xff5a20, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  halo.position.z = -0.02;
  g.add(halo);
  return g;
}

// Une grenade ou un fumigène lancé (type : 'grenade' ou 'fumigene').
export function modeleGrenadeVol(type) {
  const g = grenade(type === 'fumigene');
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

// Projectile en vol d'une nouvelle arme (obus, plasma, clou, trou_noir, artifice, flash, balise, mine), ou null.
export function modeleProjectileVol(type) {
  const g = PLUS.projectile(type);
  if (g) g.traverse((o) => { if (o.isMesh && o.material && !o.material.transparent) o.castShadow = true; });
  return g;
}

// Un météore qui tombe (pluie de météores de l'admin).
export function modeleMeteore() { return PLUS.meteore(); }
