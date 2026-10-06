// Personnages "en blocs" façon Minecraft.
//
// L'apparence (couleurs, visage, vêtements, accessoires) vient d'un "style" :
// voir apparence.js. On la dessine dans une image de 64 × 64 pixels au même
// format qu'un skin Minecraft, plus les chapeaux et accessoires en 3D.
import * as THREE from '../vendor/three.min.js';
import { textureCanvas } from './textures.js';
import { modeleArme } from './armes-modeles.js';
import { PX, COULEURS_EQUIPES, dessinerSkin, habiller, animerAccessoires, styleParDefaut } from './apparence.js';

export { PX, COULEURS_EQUIPES, styleParDefaut, dessinerSkin };
export const NOMS_EQUIPES = ['Bleus', 'Rouges'];

// Place les coordonnées de texture d'une boîte selon le format Minecraft.
// Ordre des faces de three.js : +x (droite du perso), -x (gauche), +y (dessus), -y (dessous), +z (dos), -z (devant).
function uvMinecraft(geo, u, v, w, h, d) {
  const rect = [
    [u, v + d, d, h],             // droite
    [u + d + w, v + d, d, h],     // gauche
    [u + d, v, w, d],             // dessus
    [u + d + w, v, w, d],         // dessous
    [u + d + w + d, v + d, w, h], // dos
    [u + d, v + d, w, h],         // devant
  ];
  const uv = geo.attributes.uv;
  for (let f = 0; f < 6; f++) {
    const [x, y, rw, rh] = rect[f];
    const u0 = x / 64; const u1 = (x + rw) / 64;
    const v0 = 1 - y / 64; const v1 = 1 - (y + rh) / 64;
    uv.setXY(f * 4 + 0, u0, v0);
    uv.setXY(f * 4 + 1, u1, v0);
    uv.setXY(f * 4 + 2, u0, v1);
    uv.setXY(f * 4 + 3, u1, v1);
  }
  uv.needsUpdate = true;
  return geo;
}

function etiquetteNom(nom, couleur) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  g.font = 'bold 30px system-ui, sans-serif';
  const w = Math.min(240, g.measureText(nom).width + 24);
  g.fillStyle = 'rgba(8, 12, 24, 0.6)';
  g.fillRect(128 - w / 2, 10, w, 44);
  g.fillStyle = couleur;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(nom, 128, 33, 230);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthWrite: false }));
  s.scale.set(1.6, 0.4, 1);
  return s;
}

export class Personnage {
  constructor({ style, equipe = null, nom = '', allieVisible = false }) {
    this.canvas = dessinerSkin(style, equipe);
    this.texture = textureCanvas(this.canvas);
    this.materiau = new THREE.MeshLambertMaterial({ map: this.texture, transparent: true });
    this.groupe = new THREE.Group();
    // Tout le corps est dans un groupe à part : une danse peut le faire sauter ou tourner
    // sans changer la vraie position du joueur.
    this.corpsEntier = new THREE.Group();
    this.groupe.add(this.corpsEntier);
    this.parties = {};
    this.reposPivots = {};
    this.temps = Math.random() * 10;

    // pivot = articulation ; la boîte est décalée pour tourner autour de l'articulation.
    const partie = (nom, [w, h, d], [u, v], pivot, decalage) => {
      const geo = uvMinecraft(new THREE.BoxGeometry(w * PX, h * PX, d * PX), u, v, w, h, d);
      const mesh = new THREE.Mesh(geo, this.materiau);
      mesh.castShadow = true;
      mesh.position.set(0, decalage * PX, 0);
      const p = new THREE.Group();
      p.position.set(pivot[0] * PX, pivot[1] * PX, 0);
      p.add(mesh);
      this.corpsEntier.add(p);
      this.parties[nom] = { pivot: p, mesh, taille: [w * PX, h * PX, d * PX] };
      this.reposPivots[nom] = p.position.clone();
      return p;
    };
    partie('jambeD', [4, 12, 4], [0, 16], [2, 12], -6);
    partie('jambeG', [4, 12, 4], [16, 48], [-2, 12], -6);
    partie('corps', [8, 12, 4], [16, 16], [0, 18], 0);
    partie('tete', [8, 8, 8], [0, 0], [0, 24], 4);
    partie('brasD', [4, 12, 4], [40, 16], [6, 22], -4);
    partie('brasG', [4, 12, 4], [32, 48], [-6, 22], -4);

    // Chapeau, accessoires, coiffure en relief
    this.accessoires = habiller(this.parties.tete.mesh, this.parties.corps.mesh, style);

    // L'arme dans la main droite (elle suit le bras). Les modèles sont créés au besoin.
    this.modelesArmes = {};
    this.armeId = null;
    this.categorie = 'principale';
    this.prendreArme('fusil', 'principale');
    this.choc = 0;      // 1 → 0 : le personnage vient d'être touché
    this.eclairCanon = 0;
    this.anim = null;   // coup de mêlée, lancer ou soin en cours : { type, t, duree, special }
    this.poeleDos = null;

    if (nom) {
      const couleur = equipe === 0 || equipe === 1 ? COULEURS_EQUIPES[equipe] : '#ffffff';
      this.etiquette = etiquetteNom(nom, couleur);
      this.etiquette.position.y = 2.2;
      // Les coéquipiers restent visibles à travers les murs.
      if (allieVisible) { this.etiquette.material.depthTest = false; this.etiquette.renderOrder = 10; }
      this.groupe.add(this.etiquette);
    }
  }

  // Change l'arme tenue en main (identifiant de reglages.json) et sa catégorie
  // (principale, secondaire, melee, gadget) : la façon de la tenir en dépend.
  prendreArme(id, categorie) {
    if (categorie) this.categorie = categorie;
    if (id === this.armeId) return;
    if (this.arme) this.arme.visible = false;
    if (!this.modelesArmes[id]) {
      const m = modeleArme(id, true);
      const u = m.userData;
      if (u.melee || u.gadget && !u.crochet) {
        // Objet tenu dans le poing, qui pointe vers l'avant quand le bras pend
        m.rotation.x = u.melee ? -0.25 : 0;
        m.position.set(0, -11 * PX, -0.01);
      } else {
        m.rotation.x = -Math.PI / 2;         // l'arme pointe dans le prolongement du bras
        m.position.set(0, -11 * PX, -0.02);
      }
      this.parties.brasD.pivot.add(m);
      this.modelesArmes[id] = m;
    }
    this.armeId = id;
    this.arme = this.modelesArmes[id];
    this.arme.visible = true;
    if (!categorie) {
      const u = this.arme.userData;
      this.categorie = u.melee ? 'melee' : (u.gadget ? 'gadget' : (u.pistolet ? 'secondaire' : 'principale'));
    }
  }

  // Animations déclenchées quand un autre joueur frappe, lance ou se soigne.
  frapper(special = false) { this.anim = { type: 'coup', t: 0, duree: special ? 0.75 : (this.armeId === 'batte' ? 0.55 : 0.4), special }; }
  lancer() { this.anim = { type: 'lancer', t: 0, duree: 0.6 }; }
  soigner(dureeMs) { this.anim = { type: 'soin', t: 0, duree: dureeMs / 1000 }; }

  // La poêle dans le dos (elle arrête les balles qui arrivent par derrière).
  afficherPoeleDos(oui) {
    if (oui && !this.poeleDos) {
      const m = modeleArme('poele', true);
      m.rotation.x = Math.PI / 2;            // à plat contre le dos, manche vers le bas
      m.position.set(0, -0.29, 2 * PX + 0.022);
      this.parties.corps.mesh.add(m);        // sur le corps : elle suit aussi le ragdoll
      this.poeleDos = m;
    }
    if (this.poeleDos) this.poeleDos.visible = !!oui;
  }

  // Position (dans le monde) du bout du canon : d'où partent les traînées des tirs.
  boutDuCanon(cible) {
    this.groupe.updateMatrixWorld(true);
    cible.copy(this.arme.userData.bout);
    return this.arme.localToWorld(cible);
  }

  toucher() { this.choc = 1; }

  // Anime le personnage : vitesse horizontale (m/s), en l'air ou non, angle de visée,
  // en train de viser (clic droit) ou de recharger.
  animer(dt, { vitesse, enLAir, pitch, visee = false, recharge = false }) {
    const p = this.parties;
    const k = Math.min(1, vitesse / 7);
    this.temps += dt * (4 + 8 * k);
    const balancier = Math.sin(this.temps) * 0.9 * k;
    if (enLAir) {
      p.jambeD.pivot.rotation.x = 0.5;
      p.jambeG.pivot.rotation.x = -0.4;
    } else {
      p.jambeD.pivot.rotation.x = balancier;
      p.jambeG.pivot.rotation.x = -balancier;
    }
    const vise = Math.max(-1.2, Math.min(1.2, pitch || 0));
    // En visant, l'arme monte à hauteur des yeux et la tête se penche dessus.
    this.viseeLisse = (this.viseeLisse || 0) + ((visee ? 1 : 0) - (this.viseeLisse || 0)) * Math.min(1, dt * 10);
    const v = this.viseeLisse;
    p.tete.pivot.rotation.set(vise * 0.8 + v * 0.15, 0, v * 0.12);
    const tenuALaMain = this.arme && !this.arme.userData.crochet && (this.arme.userData.melee || this.arme.userData.gadget);
    const cat = tenuALaMain ? this.categorie : (this.categorie === 'gadget' ? 'secondaire' : this.categorie);
    if (cat === 'melee' || cat === 'gadget') {
      // Arme de mêlée ou gadget dans la main droite, bras gauche détendu
      const garde = cat === 'melee' ? 0.95 + v * 0.5 : 0.9;
      p.brasD.pivot.rotation.set(garde + vise * 0.4, -0.1, 0);
      p.brasG.pivot.rotation.set(0.15 + Math.sin(this.temps) * 0.25 * k, 0, -0.12);
    } else {
      // Les deux bras tiennent l'arme vers l'avant, en suivant la visée (plus près du corps pour un pistolet).
      p.brasD.pivot.rotation.set(Math.PI / 2 + vise + v * 0.12, -v * 0.1, 0);
      let gauche = Math.PI / 2 + vise - 0.1 + v * 0.1;
      if (recharge) gauche -= 0.6 + Math.sin(this.temps * 2.5) * 0.25; // la main gauche va chercher un chargeur
      p.brasG.pivot.rotation.set(gauche, cat === 'secondaire' ? 0.75 : 0.55, 0);
    }
    // Coup, lancer, soin
    if (this.anim) {
      const a = this.anim;
      a.t += dt;
      const q = Math.min(1, a.t / a.duree);
      const env = Math.sin(q * Math.PI);
      if (a.type === 'coup') {
        if (a.special) {
          // coup dans le dos : bras levé très haut puis planté vers le bas
          const haut = q < 0.4 ? q / 0.4 : 1 - (q - 0.4) / 0.6;
          p.brasD.pivot.rotation.x = 0.6 + Math.max(0, haut) * 2.4;
          p.corps.pivot.rotation.x = -0.2 * env;
        } else {
          const vague = q < 0.35 ? q / 0.35 : 1 - (q - 0.35) / 0.65;
          p.brasD.pivot.rotation.x = 0.5 + vague * 1.9;
          p.brasD.pivot.rotation.y = -0.1 - (q > 0.35 ? (q - 0.35) * 1.6 : 0);
          p.corps.pivot.rotation.y = 0.25 * env;
        }
      } else if (a.type === 'lancer') {
        const vague = q < 0.4 ? q / 0.4 : 1 - (q - 0.4) / 0.6;
        p.brasD.pivot.rotation.set(0.6 + vague * 2.4, -0.2, 0);
        if (q > 0.45 && this.arme) this.arme.visible = false;
      } else if (a.type === 'soin') {
        p.brasD.pivot.rotation.set(1.2, 0.5, 0);
        p.brasG.pivot.rotation.set(1.2 + Math.sin(this.temps * 3) * 0.2, -0.5, 0);
      }
      if (q >= 1) {
        this.anim = null;
        if (this.arme) this.arme.visible = true;
      }
    }
    // Le corps se balance en marchant, sursaute quand il est touché
    this.choc = Math.max(0, this.choc - dt * 5);
    p.corps.pivot.position.y = 18 * PX + Math.abs(Math.sin(this.temps)) * 0.02 * k;
    p.corps.pivot.rotation.set(-this.choc * 0.25, Math.sin(this.temps) * 0.08 * k, 0);
    p.tete.pivot.rotation.x -= this.choc * 0.3;
    this.materiau.emissive.setScalar(this.choc * 0.55);
    animerAccessoires(this.accessoires, this.temps, { vitesse, enLAir });
  }

  // Danse (faite dans l'atelier) : pose calculée par evaluer() de animations-perso.js.
  // Pistes : tout (le corps entier), corps, tete, brasD, brasG, jambeD, jambeG. Les rotations sont
  // l'angle de chaque articulation (0 = debout, bras le long du corps), les positions un décalage.
  poserDanse(pose, avecArme = false) {
    for (const [nom, r0] of Object.entries(this.reposPivots)) {
      const p = this.parties[nom].pivot;
      const k = pose[nom];
      if (k) { p.position.set(r0.x + k[1], r0.y + k[2], r0.z + k[3]); p.rotation.set(k[4], k[5], k[6]); } else { p.position.copy(r0); p.rotation.set(0, 0, 0); }
    }
    const t = pose.tout;
    if (t) { this.corpsEntier.position.set(t[1], t[2], t[3]); this.corpsEntier.rotation.set(t[4], t[5], t[6]); } else { this.corpsEntier.position.set(0, 0, 0); this.corpsEntier.rotation.set(0, 0, 0); }
    if (this.arme) this.arme.visible = !!avecArme; // on range l'arme pour danser (sauf option « garder l'arme »)
    this.enDanse = true;
  }

  finDanse() {
    if (!this.enDanse) return;
    this.enDanse = false;
    this.corpsEntier.position.set(0, 0, 0);
    this.corpsEntier.rotation.set(0, 0, 0);
    for (const [nom, r0] of Object.entries(this.reposPivots)) this.parties[nom].pivot.position.copy(r0);
    if (this.arme) this.arme.visible = true;
  }

  // Coucou de la main gauche (k = 0 → 1 : bras levé), t = temps en secondes
  coucou(k, t) {
    const P = this.parties;
    P.brasG.pivot.rotation.set(Math.sin(t * 14) * 0.25 * k, 0, -(0.06 + k * 2.6));
    P.tete.pivot.rotation.set(0, 0, Math.sin(t * 3) * 0.08 * k);
  }

  // Wallhack (pouvoir d'admin) : une silhouette colorée visible à travers les murs.
  // couleur = null : on la cache. On ne touche pas aux matériaux du personnage (ni à ceux,
  // partagés, des armes) : on ajoute juste une boîte qui se dessine toujours par-dessus.
  marqueurMur(couleur) {
    if (!couleur) { if (this.espBox) this.espBox.visible = false; return; }
    if (!this.espBox) {
      const geo = new THREE.BoxGeometry(0.8, 1.95, 0.55);
      geo.translate(0, 0.95, 0);
      const mat = new THREE.MeshBasicMaterial({ color: couleur, transparent: true, opacity: 0.35, depthTest: false, depthWrite: false });
      this.espBox = new THREE.Mesh(geo, mat);
      this.espBox.renderOrder = 20;
      this.groupe.add(this.espBox);
    }
    this.espBox.visible = true;
    this.espBox.material.color.set(couleur);
  }

  // Effet "protégé" après l'apparition : le personnage clignote.
  transparence(opacite) {
    this.materiau.opacity = opacite;
    this.materiau.depthWrite = opacite > 0.99;
  }

  liberer() {
    this.groupe.removeFromParent();
    this.texture.dispose();
    this.materiau.dispose();
    this.groupe.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material && o.material.map && o.material !== this.materiau) { o.material.map.dispose(); o.material.dispose(); }
    });
  }
}
