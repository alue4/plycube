// Effets visuels : particules "pixels", traînées des balles, trous dans les murs,
// douilles, fumée, explosions.
import * as THREE from '../vendor/three.min.js';

const MAX_PARTICULES = 1600;
const MAX_TROUS = 150;
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _c = new THREE.Color();
const _e = new THREE.Euler();
const _v = new THREE.Vector3();
const HAUT = new THREE.Vector3(0, 0, 1);

// Couleur de la poussière quand une balle touche une matière
const POUSSIERE = {
  herbe: ['#5cb83c', '#3f8a2a', '#7a5a33'], terre: ['#7a5a33', '#5e4326'], sable: ['#e3cf94', '#cdb579'],
  bois: ['#b98a4e', '#7a5530'], planches: ['#9a6a3a', '#6e4a26'], caisse: ['#c98f4a', '#7a4f24'], tronc: ['#6b4a2b', '#4a321c'],
  palmier: ['#8a6a3e', '#5e4526'], feuilles: ['#3f9b3a', '#2e7a2a'], feuilles_palmier: ['#4caf3c', '#2e8a2a'], paille: ['#d9b85a', '#b8963e'],
  metal: ['#cfd6dd', '#ffd27a'], metal_rouge: ['#ffd27a', '#c33'], metal_bleu: ['#ffd27a', '#36c'], metal_jaune: ['#ffd27a', '#dc3'],
};
const POUSSIERE_DEFAUT = ['#a8adb5', '#82878f', '#c9ccd1'];

function texteRond(dessin, taille = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = taille;
  dessin(c.getContext('2d'), taille);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Effets {
  constructor(scene) {
    this.scene = scene;
    // ----- Particules : petits cubes, tous dessinés d'un coup (rapide) -----
    this.cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }), MAX_PARTICULES);
    this.cubes.frustumCulled = false;
    this.cubes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let i = 0; i < MAX_PARTICULES; i++) {
      this.cubes.setMatrixAt(i, _m.makeScale(0, 0, 0));
      this.cubes.setColorAt(i, _c.set(0xffffff));
    }
    scene.add(this.cubes);
    this.p = [];
    for (let i = 0; i < MAX_PARTICULES; i++) {
      this.p.push({ vie: 0, max: 1, pos: new THREE.Vector3(), vit: new THREE.Vector3(), taille: 0.1, rot: 0, gravite: 1, freine: 1.5, grandit: 0, sol: 0.03 });
    }
    this.suivante = 0;

    // ----- Traînées des balles -----
    this.traits = [];
    const geo = new THREE.BoxGeometry(1, 1, 1).translate(0, 0, 0.5);
    for (let i = 0; i < 60; i++) {
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
        color: 0xffe9a8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      m.visible = false;
      m.frustumCulled = false;
      scene.add(m);
      this.traits.push({ m, vie: 0, max: 0.1, opacite: 0.9 });
    }
    this.traitSuivant = 0;

    // ----- Trous de balles sur les murs -----
    const texTrou = texteRond((g, n) => {
      const grad = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      grad.addColorStop(0, 'rgba(10,10,10,1)');
      grad.addColorStop(0.35, 'rgba(25,22,20,0.95)');
      grad.addColorStop(0.6, 'rgba(60,55,50,0.5)');
      grad.addColorStop(1, 'rgba(60,55,50,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, n, n);
    });
    const matTrou = new THREE.MeshBasicMaterial({
      map: texTrou, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4,
    });
    const geoTrou = new THREE.PlaneGeometry(0.09, 0.09);
    this.trous = [];
    for (let i = 0; i < MAX_TROUS; i++) {
      const t = new THREE.Mesh(geoTrou, matTrou);
      t.visible = false;
      scene.add(t);
      this.trous.push(t);
    }
    this.trouSuivant = 0;
    // Marques noires des explosions au sol
    const texBrule = texteRond((g, n) => {
      const grad = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      grad.addColorStop(0, 'rgba(15,12,10,0.9)');
      grad.addColorStop(0.6, 'rgba(25,20,15,0.6)');
      grad.addColorStop(1, 'rgba(25,20,15,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, n, n);
    });
    this.matBrule = new THREE.MeshBasicMaterial({ map: texBrule, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
    this.brulures = [];

    // ----- Explosions : boule de feu + onde de choc -----
    const texFeu = texteRond((g, n) => {
      const grad = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      grad.addColorStop(0, 'rgba(255,255,220,1)');
      grad.addColorStop(0.3, 'rgba(255,200,80,1)');
      grad.addColorStop(0.65, 'rgba(255,100,20,0.7)');
      grad.addColorStop(1, 'rgba(120,30,0,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, n, n);
    }, 128);
    this.boules = [];
    for (let i = 0; i < 4; i++) {
      const feu = new THREE.Sprite(new THREE.SpriteMaterial({ map: texFeu, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
      const onde = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 40), new THREE.MeshBasicMaterial({
        color: 0xffe0b0, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
      }));
      onde.rotation.x = -Math.PI / 2;
      feu.visible = false;
      onde.visible = false;
      scene.add(feu, onde);
      this.boules.push({ feu, onde, vie: 0 });
    }

    // Lumières (toujours présentes, allumées brièvement : évite de ralentir le jeu)
    this.lumiere = new THREE.PointLight(0xffd59a, 0, 9, 2);
    scene.add(this.lumiere);
    this.lumiereVie = 0;
    this.lumiereExplosion = new THREE.PointLight(0xff9a40, 0, 22, 1.6);
    scene.add(this.lumiereExplosion);
    this.explosionVie = 0;

    // ----- Fumigènes : de gros cubes gris qui restent et bloquent la vue -----
    this.MAX_FUMEE = 420;
    this.fumees = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }), this.MAX_FUMEE);
    this.fumees.frustumCulled = false;
    this.fumees.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let i = 0; i < this.MAX_FUMEE; i++) {
      this.fumees.setMatrixAt(i, _m.makeScale(0, 0, 0));
      this.fumees.setColorAt(i, _c.set(0xd8dbe0));
    }
    scene.add(this.fumees);
    this.blocsFumee = Array.from({ length: this.MAX_FUMEE }, () => ({ vie: 0, max: 1, pos: new THREE.Vector3(), vit: new THREE.Vector3(), taille: 1, rot: 0 }));
    this.fumeeSuivante = 0;
    this.emetteurs = [];

    // ----- Cordes (grappin) -----
    this.cordes = new Map();
    this.matCorde = new THREE.MeshBasicMaterial({ color: 0x3a2f25 });
    this.geoCorde = new THREE.BoxGeometry(1, 1, 1).translate(0, 0, 0.5);

    // ----- Lumière des fusées éclairantes -----
    this.lumiereFusee = new THREE.PointLight(0xff5533, 0, 18, 1.4);
    scene.add(this.lumiereFusee);

    // ----- Laser d'admin : rayon en spirale, ondes de choc, éclair de lumière -----
    this.lasers = [];
    this.marques = []; // cibles des frappes orbitales (avant l'explosion)
    this.lumiereLaser = new THREE.PointLight(0x5ae8ff, 0, 30, 1.4);
    scene.add(this.lumiereLaser);
    this.laserLumiereVie = 0;
    this.laserLumiereMax = 1;
    this.geoAnneau = new THREE.RingGeometry(0.8, 1, 48);
    this.texLueur = texteRond((g, n) => {
      const grad = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.2, 'rgba(200,250,255,0.95)');
      grad.addColorStop(0.5, 'rgba(70,210,255,0.5)');
      grad.addColorStop(1, 'rgba(60,120,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, n, n);
    }, 128);
  }

  // Un fumigène éclate : le nuage grandit pendant quelques secondes puis se dissipe.
  nuageFumee(pos, dureeMs, rayon) {
    this.emetteurs.push({ pos: pos.clone(), reste: Math.min(4, dureeMs / 3000), duree: dureeMs / 1000, rayon, accu: 0 });
  }

  blocFumee(pos, vie, rayon) {
    const i = this.fumeeSuivante;
    this.fumeeSuivante = (i + 1) % this.MAX_FUMEE;
    const b = this.blocsFumee[i];
    b.pos.copy(pos).add(_v.set((Math.random() - 0.5) * rayon * 0.6, Math.random() * 0.8, (Math.random() - 0.5) * rayon * 0.6));
    b.vit.set((Math.random() - 0.5) * 2.2, 0.4 + Math.random() * 0.8, (Math.random() - 0.5) * 2.2);
    b.vie = b.max = vie;
    b.taille = 1.2 + Math.random() * 1.2;
    b.rot = Math.random() * 6;
    const g = 0.8 + Math.random() * 0.12;
    this.fumees.setColorAt(i, _c.setRGB(g, g, g * 1.03));
    this.fumees.instanceColor.needsUpdate = true;
  }

  // Corde du grappin entre a et b (cle : pour la retrouver et la bouger)
  corde(cle, a, b) {
    let m = this.cordes.get(cle);
    if (!m) {
      m = new THREE.Mesh(this.geoCorde, this.matCorde);
      m.frustumCulled = false;
      this.scene.add(m);
      this.cordes.set(cle, m);
    }
    m.position.copy(a);
    m.lookAt(b);
    m.scale.set(0.025, 0.025, Math.max(0.01, a.distanceTo(b)));
  }
  enleverCorde(cle) {
    const m = this.cordes.get(cle);
    if (m) { m.removeFromParent(); this.cordes.delete(cle); }
  }

  eclairerFusee(pos) {
    if (!pos) { this.lumiereFusee.intensity = 0; return; }
    this.lumiereFusee.position.copy(pos);
    this.lumiereFusee.intensity = 8 + Math.random() * 3;
  }

  particule(pos, vit, couleur, { taille = 0.12, vie = 0.6, gravite = 1, freine = 1.5, grandit = 0 } = {}) {
    const i = this.suivante;
    this.suivante = (i + 1) % MAX_PARTICULES;
    const p = this.p[i];
    p.pos.copy(pos);
    p.vit.copy(vit);
    p.vie = p.max = vie * (0.7 + Math.random() * 0.6);
    p.taille = taille;
    p.gravite = gravite;
    p.freine = freine;
    p.grandit = grandit;
    p.rot = Math.random() * 6;
    this.cubes.setColorAt(i, _c.set(couleur));
    this.cubes.instanceColor.needsUpdate = true;
  }

  // Une gerbe de particules dans toutes les directions.
  explosion(pos, couleurs, { nombre = 12, force = 4, taille = 0.12, vie = 0.6, haut = 2, gravite = 1 } = {}) {
    for (let i = 0; i < nombre; i++) {
      const v = new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 1.2 - 0.2, (Math.random() - 0.5) * 2)
        .normalize().multiplyScalar(force * (0.4 + Math.random() * 0.8));
      v.y += haut;
      this.particule(pos, v, couleurs[i % couleurs.length], { taille, vie, gravite });
    }
  }

  // Une balle touche un mur : poussière de la couleur de la matière + étincelles + trou.
  impact(pos, normale, matiere) {
    const couleurs = POUSSIERE[matiere] || POUSSIERE_DEFAUT;
    const n = normale || HAUT;
    for (let i = 0; i < 7; i++) {
      _v.set((Math.random() - 0.5) * 2.5, Math.random() * 2, (Math.random() - 0.5) * 2.5).addScaledVector(n, 2.5);
      this.particule(pos, _v, couleurs[i % couleurs.length], { taille: 0.05, vie: 0.45, gravite: 0.8 });
    }
    for (let i = 0; i < 2; i++) {
      _v.set((Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4).addScaledVector(n, 3);
      this.particule(pos, _v, '#ffd27a', { taille: 0.025, vie: 0.25 });
    }
    // un peu de fumée qui flotte
    _v.copy(n).multiplyScalar(0.4);
    this.particule(pos, _v, couleurs[0], { taille: 0.14, vie: 0.8, gravite: -0.05, freine: 3, grandit: 0.3 });
    if (normale && matiere !== 'feuilles' && matiere !== 'feuilles_palmier') this.trou(pos, normale);
  }

  trou(pos, normale) {
    const t = this.trous[this.trouSuivant];
    this.trouSuivant = (this.trouSuivant + 1) % MAX_TROUS;
    t.position.copy(pos).addScaledVector(normale, 0.005);
    t.quaternion.setFromUnitVectors(HAUT, normale);
    t.rotateZ(Math.random() * Math.PI);
    const k = 0.8 + Math.random() * 0.5;
    t.scale.set(k, k, 1);
    t.visible = true;
  }

  viderTrous() {
    for (const t of this.trous) t.visible = false;
    this.emetteurs = [];
    for (const b of this.blocsFumee) b.vie = Math.min(b.vie, 0.01);
    for (const cle of [...this.cordes.keys()]) this.enleverCorde(cle);
    for (const b of this.brulures) b.removeFromParent();
    this.brulures = [];
  }

  // Petits pixels jaunes et roses quand un joueur est touché (pas de sang !).
  touche(pos, tete) {
    this.explosion(pos, tete ? ['#ffe14d', '#ffffff', '#ff9d2e'] : ['#ff7ad9', '#ffe14d', '#ffffff'],
      { nombre: tete ? 14 : 8, force: 3, taille: 0.08, vie: 0.45, haut: 1 });
  }

  // Une douille éjectée par l'arme (vit : direction d'éjection).
  douille(pos, vit, rouge = false) {
    this.particule(pos, vit, rouge ? '#a32020' : '#c9a33b', { taille: 0.028, vie: 1.4, gravite: 1.1, freine: 0.4 });
  }

  // Petit nuage de fumée. dir : direction dans laquelle il part (ex. devant le canon)
  fumee(pos, nombre = 4, couleur = '#9a9a9a', taille = 0.12, { dir = null, grandit = 0.4, vie = 1 } = {}) {
    for (let i = 0; i < nombre; i++) {
      _v.set((Math.random() - 0.5) * 0.6, 0.3 + Math.random() * 0.5, (Math.random() - 0.5) * 0.6);
      if (dir) _v.addScaledVector(dir, 1.5 + Math.random() * 1.5);
      this.particule(pos, _v, couleur, { taille, vie, gravite: -0.08, freine: 2, grandit });
    }
  }

  // Traînée lumineuse d'une balle, de a vers b.
  trait(a, b, { couleur = 0xffe9a8, epaisseur = 0.012, duree = 0.07, opacite = 0.75 } = {}) {
    const t = this.traits[this.traitSuivant];
    this.traitSuivant = (this.traitSuivant + 1) % this.traits.length;
    const longueur = a.distanceTo(b);
    if (longueur < 0.1) return;
    t.m.position.copy(a);
    t.m.lookAt(b);
    t.m.scale.set(epaisseur, epaisseur, longueur);
    t.m.material.color.set(couleur);
    t.m.material.opacity = opacite;
    t.m.visible = true;
    t.vie = t.max = duree;
    t.opacite = opacite;
  }

  // Rayon du laser d'admin (de a vers b). charge 0 → 1 : plus épais, plus long, plus violent.
  // Un cœur blanc, un rayon cyan, des brins d'énergie qui tournent en spirale autour, un anneau qui
  // s'ouvre au bout du canon, une onde de choc et un éclair au point d'impact.
  rayonLaser(a, b, charge = 0.5) {
    const c = Math.max(0, Math.min(1, charge));
    const ep = 0.025 + c * 0.08;
    const vie = 0.35 + c * 0.45;
    this.trait(a, b, { couleur: 0x39e0ff, epaisseur: ep, duree: vie, opacite: 0.85 });
    this.trait(a, b, { couleur: 0xffffff, epaisseur: ep * 0.35, duree: vie * 0.8, opacite: 1 });
    if (c > 0.5) this.trait(a, b, { couleur: 0xc06cff, epaisseur: ep * 2, duree: vie * 0.6, opacite: 0.3 });
    const L = a.distanceTo(b);
    const dir = new THREE.Vector3().subVectors(b, a).normalize();
    const additif = (couleur, opacite = 0.9, double = false) => new THREE.MeshBasicMaterial({
      color: couleur, transparent: true, opacity: opacite, blending: THREE.AdditiveBlending, depthWrite: false, side: double ? THREE.DoubleSide : THREE.FrontSide,
    });
    const fx = { vie, max: vie, c, geos: [], mats: [], objets: [] };
    // 1. Brins en spirale autour du rayon (ils tournent et s'écartent en disparaissant)
    if (L > 0.3) {
      const spirale = new THREE.Group();
      spirale.position.copy(a);
      spirale.lookAt(b);
      const tours = Math.max(2, L / (1.5 - c * 0.7));
      const r0 = 0.06 + c * 0.13;
      const brins = c > 0.6 ? 3 : 2;
      const N = Math.min(420, Math.ceil(tours * 14));
      for (let k = 0; k < brins; k++) {
        const pts = [];
        for (let i = 0; i <= N; i++) {
          const q = i / N;
          const ang = q * tours * Math.PI * 2 + (k * Math.PI * 2) / brins;
          const rr = r0 * (0.35 + 0.65 * Math.min(1, q * 5));
          pts.push(new THREE.Vector3(Math.cos(ang) * rr, Math.sin(ang) * rr, q * L));
        }
        const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N, 0.006 + c * 0.012, 5, false);
        const mat = additif(k === 1 ? 0xc06cff : 0x6ff2ff, 0.9);
        spirale.add(new THREE.Mesh(geo, mat));
        fx.geos.push(geo); fx.mats.push(mat);
      }
      this.scene.add(spirale);
      fx.spirale = spirale;
      fx.objets.push(spirale);
    }
    // 2. Anneau qui s'ouvre au bout du canon, onde de choc à l'impact (face au rayon)
    const anneau = (pos, vers, couleur) => {
      const m = new THREE.Mesh(this.geoAnneau, additif(couleur, 0.95, true));
      m.position.copy(pos);
      m.lookAt(vers);
      m.scale.setScalar(0.01);
      this.scene.add(m);
      fx.mats.push(m.material); fx.objets.push(m);
      return m;
    };
    fx.anneauCanon = anneau(a, b, 0x8ff6ff);
    fx.onde = anneau(b, a, 0xbff8ff);
    if (c > 0.45) fx.onde2 = anneau(b, a, 0xc06cff);
    // 3. Éclair (boule de lumière) à l'impact
    const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.texLueur, color: 0xbff8ff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    flash.position.copy(b).addScaledVector(dir, -0.15);
    this.scene.add(flash);
    fx.flash = flash; fx.mats.push(flash.material); fx.objets.push(flash);
    this.lasers.push(fx);
    // 4. Lumière cyan qui éclaire la carte un instant
    this.lumiereLaser.position.copy(b).addScaledVector(dir, -0.4);
    this.laserLumiereForce = 15 + c * 55;
    this.lumiereLaser.intensity = this.laserLumiereForce;
    this.laserLumiereVie = this.laserLumiereMax = 0.2 + c * 0.35;
    // 5. Étincelles à l'impact et poussière d'énergie le long du rayon
    const n = Math.round(14 + c * 50);
    const couleurs = ['#39e0ff', '#ffffff', '#c06cff', '#8ff6ff'];
    for (let i = 0; i < n; i++) {
      _v.set((Math.random() - 0.5) * 2, Math.random() * 1.6 - 0.3, (Math.random() - 0.5) * 2).normalize().multiplyScalar(3 + c * 9 * Math.random());
      _v.addScaledVector(dir, -2 - c * 3);
      this.particule(b, _v, couleurs[i % 4], { taille: 0.04 + c * 0.07, vie: 0.35 + c * 0.5, gravite: 0.6, freine: 1.8 });
    }
    const m = Math.round(8 + c * 34);
    for (let i = 0; i < m; i++) {
      _s.copy(a).lerp(b, Math.random());
      _v.set((Math.random() - 0.5) * 1.2, (Math.random() - 0.2) * 1.2, (Math.random() - 0.5) * 1.2);
      this.particule(_s, _v, couleurs[(i + 1) % 4], { taille: 0.025 + c * 0.03, vie: 0.5 + c * 0.6, gravite: -0.05, freine: 1.5 });
    }
  }

  // Frappe orbitale de l'admin : une cible rouge au sol qui se resserre et un rayon de visée qui descend du ciel,
  // pendant le compte à rebours (ms). L'explosion arrive ensuite (message « explosion » du serveur).
  marqueFrappe(p, ms) {
    const mat = (couleur, opacite) => new THREE.MeshBasicMaterial({
      color: couleur, transparent: true, opacity: opacite, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    });
    const anneau = new THREE.Mesh(this.geoAnneau, mat(0xff3344, 0.9));
    anneau.rotation.x = -Math.PI / 2;
    anneau.position.set(p.x, p.y + 0.08, p.z);
    const anneau2 = new THREE.Mesh(this.geoAnneau, mat(0xffcc33, 0.7));
    anneau2.rotation.x = -Math.PI / 2;
    anneau2.position.set(p.x, p.y + 0.1, p.z);
    const geo = new THREE.CylinderGeometry(0.06, 0.06, 140, 8, 1, true);
    const colonne = new THREE.Mesh(geo, mat(0xff5566, 0.35));
    colonne.position.set(p.x, p.y + 70, p.z);
    this.scene.add(anneau, anneau2, colonne);
    this.marques.push({ objets: [anneau, anneau2, colonne], mats: [anneau.material, anneau2.material, colonne.material], geo, vie: ms / 1000, max: ms / 1000, anneau, anneau2, colonne });
  }

  majLasers(dt) {
    this.marques = this.marques.filter((m) => {
      m.vie -= dt;
      const k = Math.min(1, Math.max(0, 1 - m.vie / m.max));
      m.anneau.scale.setScalar(0.4 + 4.5 * (1 - k));
      m.anneau.rotation.z += dt * (2 + k * 10);
      m.anneau2.scale.setScalar(0.3 + 2.5 * (1 - k) * (0.6 + 0.4 * Math.sin(k * 40)));
      m.colonne.scale.set(1 + k * 6, 1, 1 + k * 6);
      m.mats[2].opacity = 0.2 + 0.6 * k * (0.7 + 0.3 * Math.sin(k * 60));
      if (m.vie > 0) return true;
      for (const o of m.objets) o.removeFromParent();
      for (const mat of m.mats) mat.dispose();
      m.geo.dispose();
      return false;
    });
    if (this.laserLumiereVie > 0) {
      this.laserLumiereVie -= dt;
      this.lumiereLaser.intensity = Math.max(0, this.laserLumiereVie / this.laserLumiereMax) * this.laserLumiereForce;
      if (this.laserLumiereVie <= 0) this.lumiereLaser.intensity = 0;
    }
    this.lasers = this.lasers.filter((fx) => {
      fx.vie -= dt;
      const k = Math.min(1, Math.max(0, 1 - fx.vie / fx.max)); // 0 → 1
      const fondu = Math.pow(1 - k, 1.4);
      const c = fx.c;
      if (fx.spirale) {
        fx.spirale.rotateZ(dt * (7 + c * 14));
        fx.spirale.scale.set(1 + k * (1.5 + c * 2), 1 + k * (1.5 + c * 2), 1);
      }
      for (const mat of fx.mats) mat.opacity = 0.95 * fondu;
      fx.anneauCanon.scale.setScalar(0.03 + Math.sqrt(k) * (0.25 + c * 0.5));
      fx.onde.scale.setScalar(0.1 + Math.sqrt(k) * (0.8 + c * 4.5));
      if (fx.onde2) fx.onde2.scale.setScalar(0.1 + k * (0.5 + c * 3));
      const f = (0.4 + c * 3.2) * (0.5 + Math.sqrt(k)) * (k < 0.15 ? 1.3 : 1);
      fx.flash.scale.set(f, f, 1);
      if (fx.vie > 0) return true;
      for (const o of fx.objets) o.removeFromParent();
      for (const g of fx.geos) g.dispose();
      for (const mat of fx.mats) mat.dispose();
      return false;
    });
  }

  eclairCanon(pos) {
    this.lumiere.position.copy(pos);
    this.lumiere.intensity = 5;
    this.lumiereVie = 0.05;
  }

  // Explosion d'une roquette !
  explosionRoquette(pos, rayon) {
    const b = this.boules.find((x) => x.vie <= 0) || this.boules[0];
    b.vie = 0.55;
    b.pos = pos.clone();
    b.rayon = rayon;
    b.feu.position.copy(pos);
    b.feu.visible = true;
    b.onde.position.set(pos.x, pos.y + 0.05, pos.z);
    b.onde.visible = true;
    this.lumiereExplosion.position.copy(pos).add(_v.set(0, 0.5, 0));
    this.lumiereExplosion.intensity = 60;
    this.explosionVie = 0.35;
    // étincelles, débris, fumée noire qui monte
    this.explosion(pos, ['#fff3b0', '#ffd27a', '#ff9a2e'], { nombre: 30, force: 11, taille: 0.06, vie: 0.6, haut: 3 });
    this.explosion(pos, ['#5a4a3a', '#7a6a5a', '#3a3a3a'], { nombre: 18, force: 7, taille: 0.13, vie: 1.4, haut: 5 });
    for (let i = 0; i < 26; i++) {
      _v.set((Math.random() - 0.5) * 3, 0.6 + Math.random() * 2.2, (Math.random() - 0.5) * 3);
      const gris = ['#2d2d2d', '#444444', '#5a5a5a', '#6e6e6e'][i % 4];
      const p = _s.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 1.5, Math.random() * 1, (Math.random() - 0.5) * 1.5));
      this.particule(p, _v, gris, { taille: 0.35 + Math.random() * 0.35, vie: 2.2, gravite: -0.06, freine: 1.2, grandit: 0.5 });
    }
    // Marque brûlée au sol (si l'explosion est près du sol)
    const brule = new THREE.Mesh(new THREE.PlaneGeometry(rayon * 0.9, rayon * 0.9), this.matBrule);
    brule.rotation.x = -Math.PI / 2;
    brule.position.set(pos.x, Math.max(0.02, pos.y - 0.3), pos.z);
    if (pos.y < 1.5) {
      this.scene.add(brule);
      this.brulures.push(brule);
      if (this.brulures.length > 12) this.brulures.shift().removeFromParent();
    }
  }

  maj(dt) {
    if (this.lasers.length || this.marques.length || this.laserLumiereVie > 0) this.majLasers(dt);
    for (let i = 0; i < MAX_PARTICULES; i++) {
      const p = this.p[i];
      if (p.vie <= 0) continue;
      p.vie -= dt;
      if (p.vie <= 0) {
        this.cubes.setMatrixAt(i, _m.makeScale(0, 0, 0));
        continue;
      }
      p.vit.y -= 12 * p.gravite * dt;
      p.vit.multiplyScalar(Math.max(0, 1 - p.freine * dt));
      p.pos.addScaledVector(p.vit, dt);
      if (p.pos.y < p.sol) { p.pos.y = p.sol; p.vit.y *= -0.35; p.vit.x *= 0.6; p.vit.z *= 0.6; }
      p.rot += dt * 5;
      p.taille += p.grandit * dt;
      const k = p.taille * Math.min(1, (p.vie / p.max) * 1.6);
      _q.setFromEuler(_e.set(p.rot, p.rot * 0.7, 0));
      this.cubes.setMatrixAt(i, _m.compose(p.pos, _q, _s.set(k, k, k)));
    }
    this.cubes.instanceMatrix.needsUpdate = true;

    for (const t of this.traits) {
      if (t.vie <= 0) continue;
      t.vie -= dt;
      t.m.material.opacity = Math.max(0, t.vie / t.max) * t.opacite;
      if (t.vie <= 0) t.m.visible = false;
    }
    for (const b of this.boules) {
      if (b.vie <= 0) continue;
      b.vie -= dt;
      const k = 1 - b.vie / 0.55; // 0 → 1
      const taille = b.rayon * (0.6 + 1.4 * Math.sqrt(k));
      b.feu.scale.set(taille, taille, 1);
      b.feu.material.opacity = Math.max(0, 1 - k * 1.2);
      b.onde.scale.setScalar(b.rayon * 0.3 + k * b.rayon * 1.6);
      b.onde.material.opacity = Math.max(0, 0.7 * (1 - k));
      if (b.vie <= 0) { b.feu.visible = false; b.onde.visible = false; }
    }
    if (this.lumiereVie > 0) {
      this.lumiereVie -= dt;
      if (this.lumiereVie <= 0) this.lumiere.intensity = 0;
    }
    if (this.explosionVie > 0) {
      this.explosionVie -= dt;
      this.lumiereExplosion.intensity = Math.max(0, (this.explosionVie / 0.35) * 60);
    }
    // Fumigènes
    this.emetteurs = this.emetteurs.filter((e) => {
      e.reste -= dt;
      e.accu += dt * 45;
      while (e.accu > 1) { e.accu -= 1; this.blocFumee(e.pos, e.duree * (0.75 + Math.random() * 0.3), e.rayon); }
      return e.reste > 0;
    });
    let fumeeActive = false;
    for (let i = 0; i < this.MAX_FUMEE; i++) {
      const b = this.blocsFumee[i];
      if (b.vie <= 0) continue;
      b.vie -= dt;
      if (b.vie <= 0) { this.fumees.setMatrixAt(i, _m.makeScale(0, 0, 0)); fumeeActive = true; continue; }
      b.vit.multiplyScalar(Math.max(0, 1 - 0.9 * dt));
      b.pos.addScaledVector(b.vit, dt);
      if (b.pos.y < 0.4) b.pos.y = 0.4;
      b.rot += dt * 0.3;
      const age = b.max - b.vie;
      const k = b.taille * Math.min(1, age * 1.5 + 0.3) * Math.min(1, b.vie / 1.5);
      _q.setFromEuler(_e.set(b.rot * 0.2, b.rot, 0));
      this.fumees.setMatrixAt(i, _m.compose(b.pos, _q, _s.set(k, k, k)));
      fumeeActive = true;
    }
    if (fumeeActive) this.fumees.instanceMatrix.needsUpdate = true;
  }
}
