// Construction de l'arène en 3D à partir de la carte (cartes/arene.json) :
// les blocs, le ciel, le soleil et les nuages.
import * as THREE from '../vendor/three.min.js';
import { materiau, textureCanvas, INVISIBLES } from './textures.js';

// Les 6 faces d'une boîte (coins + normale + coordonnées de texture alignées comme dans Minecraft).
function facesBoite(b) {
  const [x0, y0, z0, x1, y1, z1] = b;
  return [
    { n: [1, 0, 0], c: [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]], uv: (p) => [-p[2], p[1]] },
    { n: [-1, 0, 0], c: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], uv: (p) => [p[2], p[1]] },
    { n: [0, 1, 0], c: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], uv: (p) => [p[0], -p[2]] },
    { n: [0, -1, 0], c: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], uv: (p) => [p[0], p[2]] },
    { n: [0, 0, 1], c: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], uv: (p) => [p[0], p[1]] },
    { n: [0, 0, -1], c: [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]], uv: (p) => [-p[0], p[1]] },
  ];
}

// Les 24 sommets d'une boîte (6 faces × 4 coins), dans l'ordre de construction : sert à la bâtir
// et à la remettre en place quand le laser l'a « cassée » (on l'avait repliée sur un point).
function sommetsBoite(b) {
  const out = [];
  for (const f of facesBoite(b)) for (const p of f.c) out.push(p);
  return out;
}

// Ajoute les 6 faces d'une boîte. Les coordonnées de texture suivent la position dans le monde.
function ajouterBoite(t, b) {
  for (const f of facesBoite(b)) {
    const base = t.pos.length / 3;
    for (const p of f.c) {
      t.pos.push(p[0], p[1], p[2]);
      t.nor.push(f.n[0], f.n[1], f.n[2]);
      const uv = f.uv(p);
      t.uv.push(uv[0], uv[1]);
    }
    t.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
}

function ciel(groupe, couleurHaut, couleurHorizon) {
  const geo = new THREE.SphereGeometry(400, 24, 16);
  const haut = new THREE.Color(couleurHaut);
  const bas = new THREE.Color(couleurHorizon);
  const couleurs = [];
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const k = Math.max(0, Math.min(1, p.getY(i) / 250 + 0.15));
    const c = bas.clone().lerp(haut, k);
    couleurs.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(couleurs, 3));
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
  m.renderOrder = -1;
  groupe.add(m);
  return m;
}

// Nuages "en blocs" qui avancent doucement.
function nuages(groupe) {
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.45, fog: false });
  const liste = [];
  for (let i = 0; i < 14; i++) {
    const g = new THREE.Group();
    const n = 2 + (i % 3);
    for (let k = 0; k < n; k++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(8 + (k * 7 + i * 3) % 10, 2.5, 6 + (k * 5 + i) % 8), mat);
      b.position.set(k * 6 - n * 3, (k % 2) * 1.2, ((k * 13 + i * 7) % 8) - 4);
      g.add(b);
    }
    g.position.set(((i * 53) % 220) - 110, 45 + (i * 17) % 18, ((i * 37) % 220) - 110);
    groupe.add(g);
    liste.push(g);
  }
  return liste;
}

// Texture de l'eau : petites vagues en pixels.
function textureEau(couleur) {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  const base = new THREE.Color(couleur);
  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 32; j++) {
      const v = Math.sin(i * 0.4 + Math.sin(j * 0.3) * 2) * 0.5 + 0.5;
      const k = 0.85 + v * 0.25;
      g.fillStyle = `rgb(${Math.min(255, base.r * 255 * k)},${Math.min(255, base.g * 255 * k)},${Math.min(255, base.b * 255 * k)})`;
      g.fillRect(i, j, 1, 1);
    }
  }
  g.fillStyle = 'rgba(255,255,255,0.55)';
  for (const [x, y] of [[3, 5], [4, 5], [17, 12], [18, 12], [19, 12], [9, 24], [10, 24], [26, 28], [27, 28], [24, 3], [25, 3]]) g.fillRect(x, y, 1, 1);
  const t = textureCanvas(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// Construit une liste de boîtes, regroupées par matière (un seul objet 3D par matière : rapide).
// registre (facultatif) : on y note, pour chaque boîte, de quoi la « casser » plus tard
// (attribut de position + numéro du premier sommet) : registre[numéroDansLaListe] = { attr, debut, boite }.
function construireBoites(groupe, boites, materiaux, { ombres, decor, registre }) {
  const parMatiere = {};
  const rangs = []; // pour chaque boîte visible : { m, debut (sommet dans sa matière) }
  boites.forEach((b, i) => {
    const m = b[6];
    if (INVISIBLES.has(m)) { rangs[i] = null; return; }
    if (!parMatiere[m]) parMatiere[m] = { pos: [], nor: [], uv: [], idx: [] };
    rangs[i] = { m, debut: parMatiere[m].pos.length / 3 };
    ajouterBoite(parMatiere[m], b);
  });
  const attrs = {};
  for (const [nom, t] of Object.entries(parMatiere)) {
    if (!materiaux.has(nom)) materiaux.set(nom, materiau(nom));
    const mat = materiaux.get(nom);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(t.pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(t.nor, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(t.uv, 2));
    geo.setIndex(t.idx);
    geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, mat);
    const transparent = mat.transparent;
    mesh.receiveShadow = ombres && !transparent;
    mesh.castShadow = ombres && !transparent && !SANS_OMBRE.has(nom) && (!decor || OMBRE_DECOR.has(nom));
    if (transparent) mesh.renderOrder = 2;
    groupe.add(mesh);
    attrs[nom] = geo.attributes.position;
  }
  if (registre) {
    boites.forEach((b, i) => {
      const r = rangs[i];
      if (r) registre[i] = { attr: attrs[r.m], debut: r.debut, boite: b };
    });
  }
}
const SANS_OMBRE = new Set(['herbe', 'sable', 'asphalte', 'trottoir', 'terre', 'pave']);
const OMBRE_DECOR = new Set(['feuilles', 'feuilles_palmier', 'tissu_bleu', 'tissu_rouge', 'toit_rouge', 'toit_ardoise', 'paille']);

const AMBIANCE_DEFAUT = {
  ciel: ['#2f7fe0', '#cdeaff'],
  brouillard: ['#cdeaff', 70, 220],
  soleil: { couleur: '#fff1d6', intensite: 2.1, position: [28, 55, 18] },
  ambiante: { ciel: '#cfe8ff', sol: '#5d7a3a', intensite: 1.35 },
  nuages: true,
};

// Construit toute la carte. Renvoie { animer(dt), liberer() } :
// liberer() enlève la carte de la scène et libère la mémoire (pour changer de carte).
export function construireMonde(scene, carte, { ombres }) {
  const a = { ...AMBIANCE_DEFAUT, ...(carte.ambiance || {}) };
  const taille = carte.taille || 32;
  const groupe = new THREE.Group();
  groupe.name = 'carte';
  scene.add(groupe);

  const [cf, procheF, loinF] = a.brouillard;
  scene.fog = new THREE.Fog(new THREE.Color(cf), procheF, loinF);
  ciel(groupe, a.ciel[0], a.ciel[1]);

  // Lumières : une lumière "ciel / sol" douce + le soleil (qui fait les ombres).
  groupe.add(new THREE.HemisphereLight(new THREE.Color(a.ambiante.ciel), new THREE.Color(a.ambiante.sol), a.ambiante.intensite));
  const soleil = new THREE.DirectionalLight(new THREE.Color(a.soleil.couleur), a.soleil.intensite);
  const dir = new THREE.Vector3(...a.soleil.position).normalize();
  const distance = taille * 2 + 30;
  soleil.position.copy(dir).multiplyScalar(distance);
  if (ombres) {
    soleil.castShadow = true;
    soleil.shadow.mapSize.set(2048, 2048);
    const s = taille * 1.15 + 6;
    Object.assign(soleil.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: distance + taille * 2 + 20 });
    soleil.shadow.bias = -0.0004;
    soleil.shadow.normalBias = 0.03;
  }
  groupe.add(soleil);
  groupe.add(soleil.target);

  const materiaux = new Map();
  const casseRegistre = {}; // numéro de boîte -> { attr, debut, boite } : pour le laser de l'admin
  construireBoites(groupe, carte.boites, materiaux, { ombres, decor: false, registre: casseRegistre });
  if (Array.isArray(carte.decors)) construireBoites(groupe, carte.decors, materiaux, { ombres, decor: true });

  // L'eau : une grande surface transparente qui bouge doucement.
  let texEau = null;
  if (carte.eau) {
    const cote = taille * 2 + 600;
    texEau = textureEau(carte.eau.couleur || '#2a8fd6');
    texEau.repeat.set(cote / 4, cote / 4);
    const eau = new THREE.Mesh(
      new THREE.PlaneGeometry(cote, cote),
      new THREE.MeshLambertMaterial({ map: texEau, transparent: true, opacity: 0.72, depthWrite: false }),
    );
    eau.rotation.x = -Math.PI / 2;
    eau.position.y = carte.eau.niveau || 0;
    eau.renderOrder = 1;
    eau.receiveShadow = ombres;
    groupe.add(eau);
  }

  const listeNuages = a.nuages === false ? [] : nuages(groupe);
  let temps = 0;

  // Le laser de l'admin « casse » des blocs : on replie leurs 24 sommets sur leur centre (ils disparaissent),
  // puis on les remet en place à la réparation. Rapide : on ne reconstruit rien.
  function ecrireSommets(reg, sommets) {
    const attr = reg.attr;
    if (!attr) return;
    for (let v = 0; v < 24; v++) attr.setXYZ(reg.debut + v, sommets[v][0], sommets[v][1], sommets[v][2]);
    attr.needsUpdate = true;
  }
  function casser(indices) {
    for (const i of indices) {
      const reg = casseRegistre[i];
      if (!reg) continue;
      const b = reg.boite;
      const c = [[(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2]];
      ecrireSommets(reg, Array(24).fill(c[0]));
    }
  }
  function reparer(indices) {
    for (const i of indices) {
      const reg = casseRegistre[i];
      if (reg) ecrireSommets(reg, sommetsBoite(reg.boite));
    }
  }

  return {
    couleurCiel: a.ciel[1],
    casser, reparer,
    animer(dt) {
      temps += dt;
      for (const n of listeNuages) {
        n.position.x += dt * 1.5;
        if (n.position.x > 130) n.position.x = -130;
      }
      if (texEau) {
        texEau.offset.x = Math.sin(temps * 0.3) * 0.08;
        texEau.offset.y = temps * 0.02;
      }
    },
    liberer() {
      groupe.removeFromParent();
      const deja = new Set();
      groupe.traverse((o) => {
        if (o.geometry && !deja.has(o.geometry)) { deja.add(o.geometry); o.geometry.dispose(); }
        if (o.material && !deja.has(o.material)) {
          deja.add(o.material);
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
        if (o.isLight && o.shadow && o.shadow.map) o.shadow.map.dispose();
      });
      if (scene.fog) scene.fog = null;
    },
  };
}

// ---------- Calculs de collision et de tir (côté navigateur) ----------

export function rayonBoite(o, d, b) {
  let tmin = 0;
  let tmax = Infinity;
  for (let a = 0; a < 3; a++) {
    if (Math.abs(d[a]) < 1e-9) {
      if (o[a] < b[a] || o[a] > b[a + 3]) return Infinity;
      continue;
    }
    let t1 = (b[a] - o[a]) / d[a];
    let t2 = (b[a + 3] - o[a]) / d[a];
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return Infinity;
  }
  return tmin;
}

export function rayonCarte(o, d, boites, portee) {
  let best = portee;
  for (const b of boites) {
    const t = rayonBoite(o, d, b);
    if (t < best) best = t;
  }
  return best;
}
