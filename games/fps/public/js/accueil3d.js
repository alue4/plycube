// Écran d'accueil du jeu, façon Fortnite : ton personnage en grand sur une
// plateforme lumineuse, un ciel en dégradé, des cubes qui flottent autour.
// Il est dessiné avec le moteur 3D du jeu (le même "renderer"), dans sa propre scène.
//
// brancherHall() s'occupe du bouton JOUER : il ouvre / ferme le panneau des parties.
import * as THREE from '../vendor/three.min.js';
import { Personnage } from './personnage.js';
import { normaliserStyle } from './apparence.js';

const PALETTE = [0x3d8bff, 0xff8a1f, 0x8b5cf6, 0x39e0ff, 0xffd21f, 0xec4899, 0x22c55e];
const _taille = new THREE.Vector2();

// Petite image ronde et floue (lueurs, étincelles)
function textureLueur(couleurCentre, couleurBord) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, couleurCentre);
  grad.addColorStop(1, couleurBord);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Accueil3D {
  constructor(renderer) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 300);
    this.temps = 0;
    this.perso = null;
    this.style = null;
    this.armeId = 'fusil';
    this.prochaineInspection = 6;
    this.inspection = 0; // 0 → 1 → 0 : le personnage regarde son arme

    const s = this.scene;
    s.fog = new THREE.Fog(0x6a5fd0, 18, 70);

    // Ciel : grande sphère en dégradé (haut bleu nuit → milieu bleu → horizon orange)
    const geoCiel = new THREE.SphereGeometry(150, 32, 20);
    const haut = new THREE.Color('#081438');
    const milieu = new THREE.Color('#2a5bd7');
    const horizon = new THREE.Color('#ff9d5c');
    const couleurs = [];
    const pos = geoCiel.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const k = pos.getY(i) / 150; // -1 → 1
      const c = k > 0.15 ? milieu.clone().lerp(haut, Math.min(1, (k - 0.15) / 0.7))
        : horizon.clone().lerp(milieu, Math.max(0, (k + 0.25) / 0.4));
      couleurs.push(c.r, c.g, c.b);
    }
    geoCiel.setAttribute('color', new THREE.Float32BufferAttribute(couleurs, 3));
    s.add(new THREE.Mesh(geoCiel, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })));

    // Un "soleil" doux derrière le personnage
    this.soleil = new THREE.Sprite(new THREE.SpriteMaterial({
      map: textureLueur('rgba(255,214,150,0.9)', 'rgba(255,140,80,0)'), blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
    }));
    this.soleil.scale.set(26, 26, 1);
    this.soleil.position.set(4, 4, -40);
    s.add(this.soleil);

    // Lumières : ambiance, lumière principale chaude, contre-jour cyan
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

    // Plateforme ronde avec anneaux de néon
    this.plateforme = new THREE.Group();
    const socle = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.65, 0.36, 48),
      new THREE.MeshStandardMaterial({ color: 0x18213d, roughness: 0.6, metalness: 0.3 }));
    socle.position.y = -0.18;
    socle.receiveShadow = true;
    const dessus = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.02, 48),
      new THREE.MeshStandardMaterial({ color: 0x2b3866, roughness: 0.4, metalness: 0.2 }));
    dessus.position.y = 0.0;
    dessus.receiveShadow = true;
    const neon = (rayon, couleur, y, epaisseur = 0.03) => {
      const t = new THREE.Mesh(new THREE.TorusGeometry(rayon, epaisseur, 10, 80), new THREE.MeshBasicMaterial({ color: couleur }));
      t.rotation.x = Math.PI / 2;
      t.position.y = y;
      return t;
    };
    this.anneau1 = neon(1.52, 0x39e0ff, 0.02, 0.035);
    this.anneau2 = neon(1.66, 0xff8a1f, -0.32, 0.025);
    const lueur = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 5.5), new THREE.MeshBasicMaterial({
      map: textureLueur('rgba(57,224,255,0.55)', 'rgba(57,224,255,0)'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    lueur.rotation.x = -Math.PI / 2;
    lueur.position.y = -0.36;
    this.plateforme.add(socle, dessus, this.anneau1, this.anneau2, lueur);
    s.add(this.plateforme);

    // Sol lointain très sombre qui se fond dans le brouillard
    const sol = new THREE.Mesh(new THREE.CircleGeometry(80, 48), new THREE.MeshLambertMaterial({ color: 0x1a1640 }));
    sol.rotation.x = -Math.PI / 2;
    sol.position.y = -2.5;
    s.add(sol);

    // Cubes qui flottent tout autour (dessinés d'un coup)
    const N = 70;
    this.cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xffffff }), N);
    this.donneesCubes = [];
    const hasard = (a, b) => a + Math.random() * (b - a);
    for (let i = 0; i < N; i++) {
      let x; let z;
      do { x = hasard(-26, 26); z = hasard(-40, 6); } while (Math.hypot(x, z) < 5);
      this.donneesCubes.push({
        x, z, y: hasard(-1.5, 9), taille: hasard(0.25, 1.6),
        rx: hasard(0, 6), ry: hasard(0, 6), vr: hasard(-0.4, 0.4), phase: hasard(0, 6), amplitude: hasard(0.1, 0.5),
      });
      this.cubes.setColorAt(i, new THREE.Color(PALETTE[i % PALETTE.length]).multiplyScalar(hasard(0.65, 1.1)));
    }
    this.cubes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    s.add(this.cubes);

    // Étincelles qui montent autour de la plateforme
    const M = 90;
    const pts = new Float32Array(M * 3);
    this.vitesseEtincelles = new Float32Array(M);
    for (let i = 0; i < M; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = hasard(0.8, 2.6);
      pts[i * 3] = Math.cos(a) * r;
      pts[i * 3 + 1] = hasard(-0.3, 3.5);
      pts[i * 3 + 2] = Math.sin(a) * r;
      this.vitesseEtincelles[i] = hasard(0.15, 0.5);
    }
    const geoPts = new THREE.BufferGeometry();
    geoPts.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    this.etincelles = new THREE.Points(geoPts, new THREE.PointsMaterial({
      map: textureLueur('rgba(255,255,255,1)', 'rgba(127,232,255,0)'), size: 0.12, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, color: 0xbff4ff,
    }));
    s.add(this.etincelles);

    this.majStyle(null);
  }

  // Nouvelle apparence du personnage (style venant de l'atelier, ou null = par défaut)
  majStyle(style) {
    this.style = normaliserStyle(style);
    if (this.perso) this.perso.liberer();
    this.perso = new Personnage({ style: this.style, nom: '' });
    this.perso.groupe.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    this.perso.prendreArme(this.armeId);
    this.scene.add(this.perso.groupe);
  }

  // L'arme que le personnage tient (identifiant du catalogue : fusil, pistolet, batte...)
  majArme(id) {
    if (!id) return;
    this.armeId = id;
    if (this.perso) this.perso.prendreArme(id);
  }

  // Cadrage : le personnage un peu à gauche du centre en paysage, centré et plus haut en portrait.
  cadrer(aspect) {
    const portrait = aspect < 1;
    const distance = portrait ? 9.4 : 6.8;
    const cibleY = portrait ? 0.15 : 1.05;   // en portrait, le personnage est plus haut (les boutons sont en bas)
    const hauteurVisible = 2 * distance * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const largeurVisible = hauteurVisible * aspect;
    // Position horizontale voulue du personnage à l'écran (0 = gauche, 1 = droite)
    const xEcran = portrait ? 0.5 : (aspect > 1.6 ? 0.47 : 0.5);
    const decalage = (0.5 - xEcran) * largeurVisible;
    const balancement = Math.sin(this.temps * 0.23) * 0.25;
    this.camera.position.set(decalage + balancement, (portrait ? 1.7 : 1.4) + Math.sin(this.temps * 0.17) * 0.06, distance);
    this.camera.lookAt(decalage + balancement * 0.6, cibleY, 0);
  }

  dessiner(dt) {
    const pas = Math.min(0.05, dt || 0.016);
    this.temps += pas;
    const t = this.temps;
    this.renderer.getSize(_taille);
    const aspect = _taille.x / Math.max(1, _taille.y);
    if (this.camera.aspect !== aspect) {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    }
    this.cadrer(aspect);

    // Personnage : respire, regarde autour de lui, inspecte son arme de temps en temps
    if (this.perso) {
      if (t > this.prochaineInspection && this.inspection === 0) this.inspection = 0.0001;
      if (this.inspection > 0) {
        this.inspection += pas / 2.6;
        if (this.inspection >= 1) { this.inspection = 0; this.prochaineInspection = t + 7 + Math.random() * 5; }
      }
      const k = this.inspection > 0 ? Math.sin(this.inspection * Math.PI) : 0;
      this.perso.animer(pas, { vitesse: 0, enLAir: false, pitch: -0.25 - k * 0.35 });
      const g = this.perso.groupe;
      g.position.set(0, 0.01, 0);
      g.rotation.y = Math.PI + 0.38 + Math.sin(t * 0.3) * 0.08 - k * 0.5;
      const p = this.perso.parties;
      if (p && p.corps && p.tete) {
        p.corps.pivot.position.y += Math.sin(t * 1.6) * 0.008;            // respiration
        p.tete.pivot.rotation.y = Math.sin(t * 0.45) * 0.3 * (1 - k) + k * 0.4; // regarde autour / son arme
        p.tete.pivot.rotation.x += k * 0.3;
        if (p.brasD) p.brasD.pivot.rotation.z = k * 0.5;                    // tourne l'arme pour la montrer
      }
    }

    // Décor animé
    this.anneau1.material.color.setHSL(0.52 + Math.sin(t * 0.8) * 0.03, 1, 0.55 + Math.sin(t * 2) * 0.08);
    this.plateforme.rotation.y = t * 0.15;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const v = new THREE.Vector3();
    const sc = new THREE.Vector3();
    this.donneesCubes.forEach((c, i) => {
      e.set(c.rx + t * c.vr, c.ry + t * c.vr * 0.7, 0);
      q.setFromEuler(e);
      v.set(c.x, c.y + Math.sin(t * 0.6 + c.phase) * c.amplitude, c.z);
      sc.setScalar(c.taille);
      this.cubes.setMatrixAt(i, m.compose(v, q, sc));
    });
    this.cubes.instanceMatrix.needsUpdate = true;
    const p = this.etincelles.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let y = p.getY(i) + this.vitesseEtincelles[i] * pas;
      if (y > 3.6) y = -0.3;
      p.setY(i, y);
    }
    p.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }

  liberer() {
    if (this.perso) { this.perso.liberer(); this.perso = null; }
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const mat of mats) { if (mat.map) mat.map.dispose(); mat.dispose(); }
      }
    });
    this.scene.clear();
  }
}

// Ouvre ou ferme le panneau "Jouer" (choix de la carte et des parties).
export function panneauJouer(ouvrir) {
  const hall = document.getElementById('hall');
  const panneau = document.getElementById('panneau-jouer');
  if (!hall || !panneau) return;
  hall.classList.toggle('jouer-ouvert', !!ouvrir);
  panneau.setAttribute('aria-hidden', ouvrir ? 'false' : 'true');
  if (ouvrir) {
    const premier = panneau.querySelector('.choix-carte, button');
    if (premier) setTimeout(() => premier.focus({ preventScroll: true }), 250);
  }
}

// Branche les boutons du hall : JOUER ouvre le panneau, ✕ (ou Échap) le ferme.
export function brancherHall() {
  const jouer = document.getElementById('btn-jouer');
  const fermer = document.getElementById('btn-fermer-jouer');
  if (jouer) jouer.addEventListener('click', () => panneauJouer(true));
  if (fermer) fermer.addEventListener('click', () => panneauJouer(false));
  addEventListener('keydown', (e) => {
    const hall = document.getElementById('hall');
    if (e.key === 'Escape' && hall && !hall.hidden && hall.classList.contains('jouer-ouvert')) panneauJouer(false);
  });
}
