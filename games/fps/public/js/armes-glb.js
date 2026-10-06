// Modèles 3D « réalistes » des armes : des fichiers .glb (dossier modeles/armes/),
// en deux styles au choix dans les réglages ("simple" ou "texture"). Le style "classique"
// garde les modèles en boîtes de armes-modeles.js.
//
// Le modèle en boîtes reste toujours là, mais invisible : il garde tous les points utiles
// (bout du canon, viseur, position des mains, pièces animées...). Le .glb est simplement
// posé par-dessus, tourné dans le même sens et mis à la même longueur.
// Tant qu'un fichier n'est pas chargé (ou s'il manque), l'arme garde son modèle en boîtes.
import * as THREE from '../vendor/three.min.js';
import { GLTFLoader } from '../vendor/addons/GLTFLoader.js';

export const STYLES_ARMES = ['simple', 'texture', 'classique'];
const CALQUE_INVISIBLE = 31; // calque qu'aucune caméra n'affiche : les boîtes d'origine y vont

// Petits réglages à la main, arme par arme : { echelle, decalage: [x, y, z], rotation: [x, y, z] }
const AJUSTEMENTS = { simple: {}, texture: {} };
// Modèles qui ont une vraie lunette : en visant, l'œil se place dans l'axe de la lunette
// (le MK14 du style « texture » n'en a pas : on vise au-dessus, comme avec un viseur simple).
const A_LUNETTE = { simple: new Set(['sniper', 'precision', 'arbalete']), texture: new Set(['sniper', 'arbalete']) };

// Trouve l'axe de la lunette d'un modèle déjà placé : le tube tout en haut de l'arme.
// Renvoie { y, x, zArriere } (centre du tube et bout côté œil), ou null.
function axeLunette(visuel, boite) {
  const pts = [];
  const v = new THREE.Vector3();
  visuel.updateMatrixWorld(true);
  visuel.traverse((o) => {
    if (!o.isMesh) return;
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); pts.push(v.x, v.y, v.z); }
  });
  const L = boite.max.z - boite.min.z;
  let r = 0.02 * L;
  let x = (boite.min.x + boite.max.x) / 2;
  let zArriere = null;
  for (let iter = 0; iter < 4; iter++) {
    let minX = Infinity; let maxX = -Infinity; let zMax = -Infinity; let n = 0;
    for (let i = 0; i < pts.length; i += 3) {
      if (pts[i + 1] < boite.max.y - 2 * r) continue;
      minX = Math.min(minX, pts[i]); maxX = Math.max(maxX, pts[i]); zMax = Math.max(zMax, pts[i + 2]); n++;
    }
    if (!n) return null;
    r = Math.max(0.006, Math.min(0.05, (maxX - minX) / 2));
    x = (minX + maxX) / 2;
    zArriere = zMax;
  }
  return { y: boite.max.y - r, x, zArriere };
}

const modeles = new Map(); // style -> Map(id -> modèle tourné dans le bon sens)
const chargements = new Map(); // style -> Promise
let catalogue = null;
let piecesGlb = {}; // modeles/armes/pieces.json : quels îlots de chaque fichier .glb vont dans quelle pièce animée
let styleActif = 'simple';

export function styleArmes() { return styleActif; }

// Change de style et charge ses modèles (en arrière-plan). Renvoie une promesse.
export function choisirStyleArmes(style) {
  styleActif = STYLES_ARMES.includes(style) ? style : 'simple';
  return prechargerArmes(styleActif);
}

export function prechargerArmes(style) {
  if (style === 'classique') return Promise.resolve();
  if (chargements.has(style)) return chargements.get(style);
  const p = (async () => {
    if (!catalogue) {
      try { catalogue = await fetch('modeles/armes/catalogue.json').then((r) => (r.ok ? r.json() : {})); } catch { catalogue = {}; }
      try { piecesGlb = await fetch('modeles/armes/pieces.json').then((r) => (r.ok ? r.json() : {})); } catch { piecesGlb = {}; }
    }
    // une arme sans modèle dans ce style prend celle du style « simple »
    const liste = { ...(catalogue.simple || {}), ...(catalogue[style] || {}) };
    const prets = new Map();
    modeles.set(style, prets);
    const loader = new GLTFLoader();
    await Promise.all(Object.entries(liste).map(async ([id, info]) => {
      try {
        const gltf = await loader.loadAsync(`modeles/armes/${info.fichier}`);
        prets.set(id, orienter(gltf.scene, info));
      } catch (e) {
        console.warn(`Arme ${id} (${style}) : modèle 3D indisponible, on garde l'ancien (${e.message})`);
      }
    }));
  })();
  chargements.set(style, p);
  return p;
}

// Vecteur à partir de "x", "-y", "+z"...
function vecteur(axe, signe = '+') {
  const v = new THREE.Vector3();
  const a = String(axe || 'z').replace(/[+-]/g, '');
  const s = (String(axe).startsWith('-') ? -1 : 1) * (signe === '-' ? -1 : 1);
  v[a] = s;
  return v;
}

// Tourne le modèle pour que le canon pointe vers -z et le dessus vers +y (comme les modèles en boîtes),
// et remplace les matériaux par des matériaux qui réagissent à l'éclairage du jeu.
function orienter(scene, info) {
  const avant = vecteur(info.axe, info.bouche);       // direction de la bouche du canon dans le fichier
  let haut = vecteur(info.haut || '+y');
  if (Math.abs(haut.dot(avant)) > 0.9) haut = Math.abs(avant.y) > 0.9 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0);
  const droite = new THREE.Vector3().crossVectors(avant, haut).normalize();
  haut = new THREE.Vector3().crossVectors(droite, avant).normalize();
  // on veut : avant -> -z, haut -> +y, droite -> +x
  const base = new THREE.Matrix4().makeBasis(droite, haut, avant.clone().negate()).transpose();
  const racine = new THREE.Group();
  scene.quaternion.setFromRotationMatrix(base);
  racine.add(scene);
  racine.traverse((o) => {
    if (!o.isMesh) return;
    const liste = Array.isArray(o.material) ? o.material : [o.material];
    const nouveaux = liste.map((m) => {
      if (!m || m.isMeshPhongMaterial) return m;
      const phong = new THREE.MeshPhongMaterial({
        color: m.color ? m.color.clone() : 0xffffff,
        map: m.map || null,
        vertexColors: !!m.vertexColors,
        transparent: !!m.transparent,
        opacity: m.opacity ?? 1,
        side: m.side,
        shininess: 12 + (1 - (m.roughness ?? 0.7)) * 70,
        specular: (m.metalness ?? 0) > 0.5 ? 0x5a5a5a : 0x1e1e1e,
      });
      if (phong.map) phong.map.colorSpace = THREE.SRGBColorSpace;
      return phong;
    });
    o.material = Array.isArray(o.material) ? nouveaux : nouveaux[0];
  });
  racine.userData.info = info;
  return racine;
}

const _boite = new THREE.Box3();
const _taille = new THREE.Vector3();
const _centre = new THREE.Vector3();

// ---------- Découpage du .glb en pièces animées ----------
// Le .glb est d'un seul bloc, mais le modèle en boîtes a des pièces qui bougent (chargeur, culasse, pompe,
// barillet...). On coupe le .glb en « îlots » (des morceaux de formes qui ne se touchent pas : le chargeur,
// la culasse, la gâchette...) et les îlots choisis dans modeles/armes/pieces.json sont accrochés à la pièce
// animée : ils bougent, tombent ou disparaissent avec elle (rechargement, tir, lancer...).
// Un îlot s'écrit "maillage:îlot" (numéros dans l'ordre du fichier), ou "maillage:*" pour tout un maillage.
// Les gadgets (grenade, fumigène, kit de soin) sont pris en entier. Calculé une seule fois par arme et par style.
export const PIECES_ANIMEES = ['chargeur', 'culasse', 'pompe', 'barillet', 'canons', 'munition', 'munitionCanon', 'crochet', 'objet'];
const decoupes = new Map(); // `${style}:${id}` -> plan de découpe (un par maillage du .glb)
const _v = new THREE.Vector3();

// Les îlots d'un maillage : groupes de triangles reliés par des sommets au même endroit.
function ilots(geo) {
  const pos = geo.attributes.position;
  const n = pos.count;
  const index = geo.index ? geo.index.array : Array.from({ length: n }, (_, i) => i);
  // sommets soudés : deux sommets au même endroit comptent pour un
  geo.computeBoundingBox();
  const pas = Math.max(1e-6, geo.boundingBox.getSize(_v).length() * 1e-4);
  const soude = new Int32Array(n);
  const vus = new Map();
  for (let i = 0; i < n; i++) {
    const cle = `${Math.round(pos.getX(i) / pas)},${Math.round(pos.getY(i) / pas)},${Math.round(pos.getZ(i) / pas)}`;
    let s = vus.get(cle);
    if (s === undefined) { s = vus.size; vus.set(cle, s); }
    soude[i] = s;
  }
  const parent = new Int32Array(vus.size).map((_, i) => i);
  const racine = (a) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
  const unir = (a, b) => { a = racine(a); b = racine(b); if (a !== b) parent[a] = b; };
  for (let t = 0; t < index.length; t += 3) { unir(soude[index[t]], soude[index[t + 1]]); unir(soude[index[t + 1]], soude[index[t + 2]]); }
  const parIlot = new Map(); // racine -> liste des premiers indices de triangles
  for (let t = 0; t < index.length; t += 3) {
    const r = racine(soude[index[t]]);
    if (!parIlot.has(r)) parIlot.set(r, []);
    parIlot.get(r).push(t);
  }
  return { index, ilots: [...parIlot.values()] };
}

// Les îlots du .glb posé sur l'arme g (pour choisir les pièces : voir pieces.json). Renvoie
// [{ cle: "maillage:îlot", maillage, nom, triangles, centre, boite }] (centre et boîte dans le repère de l'arme).
export function ilotsArme(g) {
  const visuel = g.userData.glb;
  if (!visuel) return [];
  g.updateMatrixWorld(true);
  const gInv = g.matrixWorld.clone().invert();
  const res = [];
  let m = -1;
  visuel.traverse((o) => {
    if (!o.isMesh) return;
    m++;
    if (o.isSkinnedMesh) return;
    const { index, ilots: liste } = ilots(o.geometry);
    const pos = o.geometry.attributes.position;
    const versG = new THREE.Matrix4().multiplyMatrices(gInv, o.matrixWorld);
    liste.forEach((tris, i) => {
      const boite = new THREE.Box3();
      for (const t of tris) for (let k = 0; k < 3; k++) boite.expandByPoint(_v.fromBufferAttribute(pos, index[t + k]).applyMatrix4(versG));
      res.push({ cle: `${m}:${i}`, maillage: m, nom: o.name, triangles: tris.length, centre: boite.getCenter(new THREE.Vector3()), boite, tris, index, objet: o });
    });
  });
  return res;
}

// Calcule le plan de découpe : pour chaque maillage du .glb, les triangles qui restent et ceux de chaque pièce.
function planDecoupe(g, visuel, fichier) {
  g.updateMatrixWorld(true);
  const gInv = g.matrixWorld.clone().invert();
  const u = g.userData;
  // quelle pièce pour quel îlot : la table, ou tout le gadget dans « objet »
  const table = piecesGlb[fichier] || {};
  const tout = u.gadget && u.objet && !u.crochet ? 'objet' : null;
  const pieceDe = (m, i) => {
    if (tout) return tout;
    for (const [nom, cles] of Object.entries(table)) {
      if (!u[nom] || !u[nom].isObject3D) continue;
      if (cles.includes(`${m}:${i}`) || cles.includes(`${m}:*`)) return nom;
    }
    return null;
  };
  const plan = [];
  if (!tout && !Object.keys(table).length) return plan;
  const boitesGlb = new Map(); // pièce -> boîte de ses morceaux (repère de la pièce)
  let m = -1;
  visuel.traverse((o) => {
    if (!o.isMesh) return;
    m++;
    const entree = { reste: null, morceaux: [] };
    plan.push(entree);
    if (o.isSkinnedMesh) return; // maillages à os : on les laisse entiers
    const { index, ilots: liste } = ilots(o.geometry);
    const versG = new THREE.Matrix4().multiplyMatrices(gInv, o.matrixWorld);
    const reste = [];
    const parPiece = new Map();
    liste.forEach((tris, i) => {
      const nom = pieceDe(m, i);
      const cible = nom ? (parPiece.get(nom) || parPiece.set(nom, []).get(nom)) : reste;
      for (const t of tris) cible.push(index[t], index[t + 1], index[t + 2]);
    });
    if (!parPiece.size) return;
    const avecIndex = (tab) => {
      const geo = new THREE.BufferGeometry();
      for (const [nom, attr] of Object.entries(o.geometry.attributes)) geo.setAttribute(nom, attr); // mêmes sommets, partagés
      geo.setIndex(tab);
      geo.computeBoundingSphere();
      return geo;
    };
    entree.reste = avecIndex(reste);
    for (const [nom, tab] of parPiece) {
      // le morceau passe dans la pièce : même place au repos, puis il suit ses mouvements
      const versPiece = new THREE.Matrix4().multiplyMatrices(gInv, u[nom].matrixWorld).invert();
      const matrice = new THREE.Matrix4().multiplyMatrices(versPiece, versG);
      entree.morceaux.push({ nom, geo: avecIndex(tab), matrice });
      // boîte du morceau dans le repère de la pièce (pour placer la main dessus)
      const pos = o.geometry.attributes.position;
      const b = boitesGlb.get(nom) || boitesGlb.set(nom, new THREE.Box3()).get(nom);
      for (const i of tab) b.expandByPoint(_v.fromBufferAttribute(pos, i).applyMatrix4(matrice));
    }
  });
  // Décalage entre la pièce en boîtes et la vraie pièce : la main gauche (rechargement...) se pose sur la vraie.
  plan.decalages = {};
  for (const [nom, b] of boitesGlb) {
    const groupe = u[nom];
    const inv = groupe.matrixWorld.clone().invert();
    const bb = new THREE.Box3();
    groupe.traverse((x) => {
      if (!x.isMesh || x.userData.glbPiece) return;
      const pos = x.geometry.attributes.position;
      const m = new THREE.Matrix4().multiplyMatrices(inv, x.matrixWorld);
      for (let i = 0; i < pos.count; i++) bb.expandByPoint(_v.fromBufferAttribute(pos, i).applyMatrix4(m));
    });
    if (!bb.isEmpty()) plan.decalages[nom] = b.getCenter(new THREE.Vector3()).sub(bb.getCenter(new THREE.Vector3()));
  }
  return plan;
}

// Applique le plan de découpe à une copie du .glb posée sur le modèle en boîtes g.
function appliquerDecoupe(g, visuel, plan, ombres) {
  for (const [nom, d] of Object.entries(plan.decalages || {})) if (g.userData[nom]) g.userData[nom].userData.decalageMain = d;
  let k = 0;
  visuel.traverse((o) => {
    if (!o.isMesh) return;
    const e = plan[k++];
    if (!e || !e.reste) return;
    o.geometry = e.reste;
    for (const m of e.morceaux) {
      const piece = new THREE.Mesh(m.geo, o.material);
      m.matrice.decompose(piece.position, piece.quaternion, piece.scale);
      piece.castShadow = ombres;
      piece.layers.set(0);
      piece.userData.partage = true;   // formes partagées entre les copies : ne pas les libérer
      piece.userData.glbPiece = m.nom;
      g.userData[m.nom].add(piece);
    }
  });
}

// Pose le modèle .glb sur le modèle en boîtes (g) de l'arme id, si le style actif en a un.
export function habillerArme(g, id, ombres = false) {
  const modele = modeles.get(styleActif)?.get(id);
  if (!modele) return g;
  // taille du modèle en boîtes (ce qui se voit)
  g.updateMatrixWorld(true);
  const boiteP = new THREE.Box3();
  g.traverse((o) => { if (o.isMesh && o.visible) boiteP.expandByObject(o); });
  if (boiteP.isEmpty()) return g;
  const visuel = modele.clone(true);
  const aj = AJUSTEMENTS[styleActif]?.[id] || {};
  if (aj.rotation) visuel.rotation.set(...aj.rotation);
  visuel.updateMatrixWorld(true);
  _boite.setFromObject(visuel);
  _boite.getSize(_taille);
  // même plus grande dimension que le modèle en boîtes (la longueur, pour une arme à feu)
  const tailleP = boiteP.getSize(new THREE.Vector3());
  const k = (Math.max(tailleP.x, tailleP.y, tailleP.z) / Math.max(1e-6, _taille.x, _taille.y, _taille.z)) * (aj.echelle || 1);
  visuel.scale.setScalar(k);
  visuel.updateMatrixWorld(true);
  _boite.setFromObject(visuel);
  _boite.getCenter(_centre);
  const armeAFeu = !g.userData.melee && !g.userData.gadget;
  // arme à feu : même avant (bouche du canon) ; mêlée et gadgets : même centre
  const d = aj.decalage || [0, 0, 0];
  visuel.position.set(
    (boiteP.min.x + boiteP.max.x) / 2 - _centre.x + d[0],
    (boiteP.min.y + boiteP.max.y) / 2 - _centre.y + d[1],
    (armeAFeu ? boiteP.min.z - _boite.min.z : (boiteP.min.z + boiteP.max.z) / 2 - _centre.z) + d[2],
  );
  // En visant, l'œil passe juste au-dessus du nouveau modèle (sinon on regarderait à travers)
  if (armeAFeu && g.userData.visee) {
    visuel.updateMatrixWorld(true);
    _boite.setFromObject(visuel);
    const v = g.userData.visee;
    const lunette = A_LUNETTE[styleActif]?.has(id) ? axeLunette(visuel, _boite) : null;
    if (lunette) {
      // on ne voit pas à travers la lunette d'un vrai modèle : la vue « dans la lunette »
      // (grand rond noir et réticule) apparaît dès la moitié du mouvement de visée
      g.userData.lunette = true;
      g.userData.lunetteSeuil = 0.5;
    }
    g.userData.visee = lunette
      ? new THREE.Vector3(lunette.x, lunette.y + (aj.visee || 0), lunette.zArriere)
      : new THREE.Vector3((boiteP.min.x + boiteP.max.x) / 2, _boite.max.y + 0.006 + (aj.visee || 0), v.z);
  }
  // les boîtes passent sur un calque invisible (elles gardent les points utiles)
  g.traverse((o) => { if (o.isMesh) o.layers.set(CALQUE_INVISIBLE); });
  visuel.traverse((o) => { if (o.isMesh) { o.castShadow = ombres; o.layers.set(0); o.userData.partage = true; } }); // formes partagées : ne pas les libérer
  g.add(visuel);
  g.userData.glb = visuel;
  // Les morceaux du .glb qui sont dans une pièce animée (chargeur, culasse...) passent dans cette pièce
  const fichier = modele.userData.info && modele.userData.info.fichier;
  const cle = `${fichier}:${id}`;
  if (!decoupes.has(cle)) {
    try { decoupes.set(cle, planDecoupe(g, visuel, fichier)); } catch (e) { console.warn(`Arme ${id} : découpage en pièces impossible (${e.message})`); decoupes.set(cle, []); }
  }
  appliquerDecoupe(g, visuel, decoupes.get(cle), ombres);
  return g;
}
