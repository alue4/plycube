// Les armes vues à la première personne (en bas de l'écran), avec les bras du joueur.
// Elles sont dessinées dans une "scène" à part, par-dessus le reste : elles ne
// rentrent jamais dans les murs. Ce fichier gère aussi les animations :
// sortir l'arme, viser (clic droit), recul, rechargements (chargeur, cartouches,
// barillet, arbalète, armes à bascule), pompe, culasse, coups de mêlée (dont le
// coup dans le dos au couteau), lancer de grenade, grappin, kit de soin et inspection (touche F).
// Une animation faite dans l'atelier d'animations remplace celle d'origine (voir animations-perso.js).
import * as THREE from '../vendor/three.min.js';
import { modeleArme } from './armes-modeles.js';
import { couleurManche, normaliserStyle } from './apparence.js';
import {
  COUPS, ARMEMENT, RAPIDES, INSPECTION_DEFAUT, PIECES, animationPerso, evaluer, dureeAnimation,
} from './animations-perso.js';
import { animationOrigine } from './animations-origine.js';

const lisse = (t) => t * t * (3 - 2 * t);           // départ et arrivée en douceur
const borne = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const phase = (p, debut, fin) => borne((p - debut) / (fin - debut)); // 0 → 1 entre deux moments

const AXE_Z = new THREE.Vector3(0, 0, 1);
const ZERO = new THREE.Vector3(); // (jamais modifié)
const _vx = new THREE.Vector3(); const _mx = new THREE.Matrix4(); const _qx = new THREE.Quaternion();
const _sx = new THREE.Vector3(); const _ex = new THREE.Euler();

// Force du recul visuel de chaque arme : [recul vers l'arrière, levée du canon]
const RECUL = {
  fusil: [0.035, 0.05], smg: [0.022, 0.035], pompe: [0.1, 0.22], sniper: [0.11, 0.24], roquette: [0.08, 0.12],
  rafale: [0.026, 0.04], mitrailleuse: [0.03, 0.04], precision: [0.07, 0.14], arbalete: [0.05, 0.08],
  revolver: [0.06, 0.32], pistolet: [0.03, 0.12], uzi: [0.02, 0.06], canon_scie: [0.1, 0.38], lance_fusee: [0.06, 0.26],
  grappin: [0.06, 0.18],
  // nouvelles armes
  pompe_auto: [0.07, 0.12], double_canon: [0.11, 0.3], vector: [0.018, 0.03], bullpup: [0.03, 0.045], lance_grenades: [0.08, 0.16],
  plasma: [0.02, 0.03], anti_materiel: [0.14, 0.3], cloueuse: [0.02, 0.04], pistolet_lourd: [0.05, 0.34], pistolet_auto: [0.02, 0.07],
  mini_arbalete: [0.04, 0.1], pistolet_eau: [0.006, 0.01], trou_noir: [0.09, 0.2], tesla: [0.05, 0.1], minigun: [0.012, 0.012],
  feu_artifice: [0.07, 0.16], rayon_lev: [0.03, 0.12],
};
// Son du coup de mêlée (sinon « batte_coup ») : aussi utilisé pour les coups des autres joueurs (main.js)
export const SON_FRAPPE = { couteau: 'couteau_coup', katana: 'couteau_coup', sabre_laser: 'sabre_coup' };
// Valeur d'une animation à étapes au moment q (0 → 1)
function etape(etapes, q) {
  for (let i = 1; i < etapes.length; i++) {
    const a = etapes[i - 1];
    const b = etapes[i];
    if (q <= b[0]) {
      const k = lisse(phase(q, a[0], b[0]));
      return a.map((v, j) => v + (b[j] - v) * k);
    }
  }
  return etapes[etapes.length - 1];
}

export class ArmeVue {
  constructor(style, armes) {
    this.armes = armes;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.005, 10);
    this.scene.add(new THREE.HemisphereLight(0xdff1ff, 0x4a4436, 1.5));
    const soleil = new THREE.DirectionalLight(0xfff1d6, 2.2);
    soleil.position.set(1, 2.5, 1.5);
    this.scene.add(soleil);
    const contre = new THREE.DirectionalLight(0x9fc4ff, 0.7);
    contre.position.set(-1.5, 0.5, -1);
    this.scene.add(contre);

    this.support = new THREE.Group(); // position à l'écran (hanche, visée, balancement)
    this.pivot = new THREE.Group();   // rotations des animations
    this.support.add(this.pivot);
    this.scene.add(this.support);
    this.modeles = armes.map((a) => {
      const m = modeleArme(a.id);
      m.visible = false;
      this.pivot.add(m);
      // positions de repos des pièces animées
      for (const k of PIECES) {
        const p = m.userData[k];
        if (p && !p.userData.repos) { p.userData.repos = p.position.clone(); p.userData.reposRot = p.rotation.clone(); }
      }
      return m;
    });

    // Les bras "en blocs" : manche (couleur du haut) + main (peau)
    const bras = (couleurManche) => {
      const g = new THREE.Group();
      const manche = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.075, 0.72).translate(0, 0, 0.36), new THREE.MeshLambertMaterial({ color: couleurManche }));
      const main = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.22).translate(0, 0, 0.8), new THREE.MeshLambertMaterial({ color: style.peau }));
      g.add(manche, main);
      g.userData.manche = manche;
      this.scene.add(g); // dans le repère de la caméra : les épaules restent fixes même quand l'arme tourne
      return g;
    };
    style = normaliserStyle(style);
    this.brasD = bras(couleurManche(style));
    this.brasG = bras(couleurManche(style));
    this.epauleD = new THREE.Vector3(0.31, -0.6, -0.1);
    this.epauleG = new THREE.Vector3(-0.15, -0.6, -0.18);

    // Éclair au bout du canon
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,240,1)');
    grad.addColorStop(0.25, 'rgba(255,220,120,0.95)');
    grad.addColorStop(0.6, 'rgba(255,140,40,0.45)');
    grad.addColorStop(1, 'rgba(255,100,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    g.strokeStyle = 'rgba(255,230,160,0.9)';
    g.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      g.beginPath(); g.moveTo(32, 32); g.lineTo(32 + Math.cos(a) * 31, 32 + Math.sin(a) * 31); g.stroke();
    }
    this.texEclair = new THREE.CanvasTexture(c);
    this.eclair = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.texEclair, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.eclair.visible = false;
    this.pivot.add(this.eclair);

    this.courante = 0;
    this.sortie = 1;          // 0 → 1 : l'arme monte à l'écran
    this.visee = 0;           // 0 → 1 : progression de la visée (ou de la garde, en mêlée)
    this.recul = 0;
    this.glissiere = 0;       // glissière du pistolet qui recule au tir
    this.balance = new THREE.Vector2();
    this.temps = 0;
    this.eclairVie = 0;
    this.recharge = null;     // { debut, duree }
    this.action = null;       // pompe ou culasse après un tir : { debut, duree, type, son }
    this.coup = null;         // coup de mêlée ou lancer : { debut, duree, etapes, special }
    this.soin = null;         // kit de soin : { debut, duree }
    this.inspection = null;   // inspection (touche F) : { debut, duree }
    this.tirDebut = null;     // moment du dernier tir (pour une animation de tir perso)
    this.apercu = null;       // atelier d'animations : { cle, anim } pendant poserApercu()
    this.sonsPerso = {};      // sons déjà joués par chaque animation perso en cours
    this.derniere = null;     // dernière pose calculée (pour l'atelier)
    this.crochetParti = false;
    this.cache = false;       // vrai quand on regarde dans la lunette du sniper
    this.surSon = () => {};   // appelé pour jouer les sons des animations
    this.sonsJoues = new Set();
    this.choisir(0, true);
  }

  get modele() { return this.modeles[this.courante]; }
  get arme() { return this.armes[this.courante]; }

  couleurEquipe(hex) {
    this.brasD.userData.manche.material.color.set(hex);
    this.brasG.userData.manche.material.color.set(hex);
  }

  // Change d'arme : l'ancienne disparaît, la nouvelle monte à l'écran.
  choisir(i, immediat = false) {
    this.modeles[this.courante].visible = false;
    this.courante = i;
    this.modele.visible = true;
    this.sortie = immediat ? 1 : 0;
    this.recharge = null;
    this.action = null;
    this.coup = null;
    this.soin = null;
    this.inspection = null;
    this.tirDebut = null;
    this.visee = 0;
    this.remettrePieces();
    this.nouveauxSons('sortir');
    if (!immediat && !this.perso('sortir')) this.surSon('arme_sortir'); // une sortie perso a ses propres sons
  }

  remettrePieces() {
    const u = this.modele.userData;
    for (const k of PIECES) {
      const p = u[k];
      if (!p || !p.userData.repos) continue;
      p.position.copy(p.userData.repos);
      p.rotation.copy(p.userData.reposRot);
      if (k !== 'munition') p.visible = true;
    }
  }

  // Animation perso pour ce moment de l'arme en main (ou null). Dans l'atelier : celle qu'on modifie.
  perso(cle) {
    if (this.apercu) return this.apercu.cle === cle ? this.apercu.anim : null;
    return animationPerso(this.arme.id, cle);
  }

  // Animation d'origine propre à cette arme (inspection, recharge), voir animations-origine.js
  origine(cle) { return animationOrigine(this.arme, cle, this.modele.userData); }

  nouveauxSons(cle) { this.sonsPerso[cle] = new Set(); }

  // Sons d'une animation perso : chacun est joué une fois, quand son moment arrive.
  sonsDe(cle, anim, t) {
    if (!anim.sons || !anim.sons.length) return;
    const joues = this.sonsPerso[cle] || (this.sonsPerso[cle] = new Set());
    anim.sons.forEach(([ts, nom], i) => {
      if (t >= ts && !joues.has(i)) { joues.add(i); this.surSon(nom); }
    });
  }

  // Laser d'admin : le cœur d'énergie grossit et brille plus pendant qu'on charge (0 → 1).
  // Les anneaux, la boule, les éclairs et le tourbillon sont animés dans animerLaser().
  chargerLaser(charge) {
    this.chargeLaser = charge;
    const u = this.modele.userData;
    if (!u || !u.emetteur) return;
    u.emetteur.scale.setScalar(1 + charge * 1.4);
    if (u.coeur) u.coeur.scale.set(1 + charge * 0.4, 1 + charge * 0.4, 1);
  }

  // Laser : les anneaux tourbillonnent de plus en plus vite, la boule grossit au bout du canon, des éclairs
  // sautent entre les anneaux et des particules sont aspirées dans le canon. Pendant l'inspection, ça pulse.
  animerLaser(dt, u) {
    const c = this.chargeLaser || 0;
    const t = this.temps;
    const pulse = this.inspection ? 0.3 + 0.25 * Math.sin(t * 9) : 0;
    const k = Math.max(c, pulse);
    const plein = c >= 1;
    this.angleLaser = (this.angleLaser || 0) + dt * (1.5 + k * k * 45);
    u.anneaux.forEach((p, i) => {
      p.rotation.z = this.angleLaser * (i % 2 ? -1.35 : 1 + i * 0.2) + i * 2;
      p.scale.setScalar(1 + k * 0.3 + (plein ? Math.sin(t * 55 + i) * 0.05 : 0));
      // cyan → blanc → rose quand c'est plein
      const m = p.userData.tore.material;
      if (plein) m.color.setHSL(0.83 + Math.sin(t * 20) * 0.04, 1, 0.65);
      else m.color.setHSL(i === 2 ? 0.72 : 0.53, 1, 0.55 + k * 0.4);
      m.opacity = 0.55 + k * 0.45;
    });
    // boule d'énergie
    u.orbe.visible = k > 0.02;
    if (u.orbe.visible) {
      const s = 0.02 + k * 0.2 + Math.sin(t * 31) * 0.015 * k + (plein ? Math.random() * 0.03 : 0);
      u.orbe.scale.set(s, s, 1);
      u.orbe.material.color.setHSL(plein ? 0.85 : 0.52, 1, 0.75);
      u.orbe.material.rotation = t * 3;
    }
    // éclairs entre le premier et le dernier anneau
    u.arcs.visible = c > 0.25 && Math.random() < 0.35 + c * 0.6;
    if (u.arcs.visible) {
      const a = u.arcs.geometry.attributes.position;
      const ang = Math.random() * Math.PI * 2;
      const r = 0.065 + c * 0.02;
      for (let i = 0; i < 12; i++) {
        const q = i / 11;
        const bruit = i === 0 || i === 11 ? 0 : (Math.random() - 0.5) * 0.03 * (0.5 + c);
        const aa = ang + q * (Math.random() - 0.5) * 1.5;
        a.setXYZ(i, Math.cos(aa) * r + bruit, 0.006 + Math.sin(aa) * r + bruit, -0.12 - q * 0.3);
      }
      a.needsUpdate = true;
      u.arcs.material.color.setHSL(plein ? 0.85 : 0.52, 1, 0.85);
    }
    // tourbillon de particules aspirées vers le bout du canon
    u.vortex.visible = c > 0.02;
    if (u.vortex.visible) {
      const n = u.vortex.count;
      const vitesse = 0.5 + c * 2.6;
      for (let i = 0; i < n; i++) {
        const ph = (i / n + t * vitesse) % 1;
        const r = 0.28 * (1 - ph) * (0.6 + 0.4 * ((i * 7) % 5) / 4);
        const ang = i * 2.4 + ph * 9;
        _vx.set(Math.cos(ang) * r, 0.006 + Math.sin(ang) * r, -0.43 - 0.35 * (1 - ph) * (1 - ph));
        const taille = (0.006 + ph * 0.009) * (i < n * c ? 1 : 0);
        _mx.compose(_vx, _qx.setFromEuler(_ex.set(ang, ph * 6, 0)), _sx.set(taille, taille, taille));
        u.vortex.setMatrixAt(i, _mx);
      }
      u.vortex.instanceMatrix.needsUpdate = true;
      u.vortex.material.color.setHSL(plein ? 0.85 : 0.52, 1, 0.7);
    }
  }

  // Minigun : les canons tournent de plus en plus vite pendant le préchauffage (k : 0 → 1), voir animerEffets().
  prechauffer(k) { this.prechauffe = Math.max(0, Math.min(1, k || 0)); }

  // Effets lumineux et pièces qui bougent toutes seules sur les nouvelles armes (armes-modeles-plus.js)
  animerEffets(dt, u) {
    const t = this.temps;
    const insp = this.inspection ? 1 : 0;
    if (u.rotor) {
      const k = Math.max(this.prechauffe || 0, this.recul > 0.05 ? 1 : 0);
      this.vitesseRotor = (this.vitesseRotor || 0) + ((k * 38 + insp * 6) - (this.vitesseRotor || 0)) * Math.min(1, dt * (k > 0 ? 4 : 1.5));
      u.rotor.rotation.z += dt * this.vitesseRotor;
    }
    if (u.anneauNoir) {
      u.anneauNoir.rotation.x = Math.sin(t * 1.3) * 0.5;
      u.anneauNoir.rotation.y += dt * (2 + insp * 6);
      u.anneauNoir.rotation.z += dt * 3;
      const s = 1 + Math.sin(t * 5) * 0.06 + insp * 0.15;
      u.orbeNoire.scale.setScalar(s);
      u.haloNoir.scale.setScalar(0.2 + Math.sin(t * 3.1) * 0.03 + insp * 0.08);
    }
    if (u.arcsTesla) {
      const fort = this.recul > 0.2 || insp;
      u.lueurTesla.scale.setScalar(0.1 + Math.random() * 0.04 + (fort ? 0.12 : 0));
      u.arcsTesla.forEach((l, i) => {
        l.visible = Math.random() < (fort ? 0.9 : 0.25);
        if (!l.visible) return;
        const a = l.geometry.attributes.position;
        const n = a.count;
        // de la petite bobine du dessus (ou d'une électrode) jusqu'à la boule du bout
        const dep = i === 0 ? [0, 0.15, -0.08] : [Math.random() < 0.5 ? -0.045 : 0.045, 0.035, -0.48];
        const arr = [0, 0.01, -0.52];
        for (let k = 0; k < n; k++) {
          const q = k / (n - 1);
          const bruit = k === 0 || k === n - 1 ? 0 : (Math.random() - 0.5) * 0.035;
          a.setXYZ(k, dep[0] + (arr[0] - dep[0]) * q + bruit, dep[1] + (arr[1] - dep[1]) * q + Math.sin(q * Math.PI) * 0.03 + bruit, dep[2] + (arr[2] - dep[2]) * q + bruit * 0.5);
        }
        a.needsUpdate = true;
      });
    }
    if (u.runes) {
      const k = 0.55 + 0.45 * Math.abs(Math.sin(t * 2.2)) + insp * 0.3;
      u.runes.opacity = Math.min(1, k);
      u.lueurThor.scale.setScalar(0.26 + 0.08 * Math.sin(t * 6) + (this.coup ? 0.2 : 0) + insp * 0.1);
      u.arcsThor.forEach((l) => {
        l.visible = Math.random() < (this.coup || insp ? 0.85 : 0.18);
        if (!l.visible) return;
        const a = l.geometry.attributes.position;
        const n = a.count;
        const ang = Math.random() * Math.PI * 2;
        const L = 0.12 + Math.random() * 0.12;
        for (let k = 0; k < n; k++) {
          const q = k / (n - 1);
          const bruit = k === 0 ? 0 : (Math.random() - 0.5) * 0.03;
          a.setXYZ(k, Math.cos(ang) * (0.06 + L * q) + bruit, Math.sin(ang) * (0.06 + L * q) + bruit, -0.24 + bruit);
        }
        a.needsUpdate = true;
      });
    }
    if (u.lameLaser) {
      const f = 1 + (Math.random() - 0.5) * 0.06 + (this.coup ? 0.12 : 0);
      u.lameLaser[1].scale.set(f, 1, f);
      u.lameLaser[2].scale.set(f * (1 + Math.sin(t * 40) * 0.05), 1, f);
      u.lameLaser[2].material.opacity = 0.2 + Math.random() * 0.08;
    }
    if (u.lueurs) for (const [i, m] of u.lueurs.entries()) m.material.opacity = 0.6 + 0.35 * Math.abs(Math.sin(t * 3 + i * 0.9)) + insp * 0.1;
    if (u.lumiere) u.lumiere.visible = Math.floor(t * (this.arme.id === 'mine' ? 2 : 4)) % 2 === 0;
  }

  tirer(munitionsRestantes) {
    this.recul = 1;
    this.tirDebut = this.temps;
    this.inspection = null;
    this.nouveauxSons('tir');
    const u = this.modele.userData;
    if (u.flash > 0) {
      this.eclairVie = 0.05;
      this.eclair.visible = true;
      this.eclair.material.rotation = Math.random() * Math.PI;
    }
    if (u.glissiere || this.arme.id === 'pistolet') this.glissiere = 1;
    const t = this.temps;
    if (this.arme.id === 'pompe') this.armer(t + 0.12);
    if (this.arme.id === 'sniper' && munitionsRestantes > 0) this.armer(t + 0.3);
  }

  // Pompe (fusil à pompe) ou culasse (sniper), à partir du moment debut
  armer(debut) {
    const pompe = this.arme.id === 'pompe';
    this.action = { debut, duree: ARMEMENT[this.arme.id], type: pompe ? 'pompe' : 'culasse', son: pompe ? 'pompe_armement' : 'sniper_culasse' };
    this.nouveauxSons('armement');
  }

  // Coup de mêlée. special = coup dans le dos au couteau (plus long, plus spectaculaire).
  frapper(special = false) {
    const id = this.arme.id;
    const dos = !!special && id === 'couteau';
    const anim = dos ? COUPS.couteauDos : (COUPS[id] || COUPS.couteau);
    const cle = dos ? 'coupDos' : 'coup';
    this.coup = { debut: this.temps, duree: anim.duree, etapes: anim.etapes, special: dos, cle };
    this.inspection = null;
    this.nouveauxSons(cle);
    if (!this.perso(cle)) this.surSon(SON_FRAPPE[id] || 'batte_coup');
  }

  // Lancer d'une grenade ou d'un fumigène.
  lancer() {
    this.coup = { debut: this.temps, duree: COUPS.lancer.duree, etapes: COUPS.lancer.etapes, lancer: true, cle: 'lancer' };
    this.inspection = null;
    this.nouveauxSons('lancer');
  }

  // Grappin : le crochet part (il reste caché jusqu'à rentrerGrappin()).
  grappiner() {
    this.recul = 1;
    this.tirDebut = this.temps;
    this.inspection = null;
    this.nouveauxSons('tir');
    this.crochetParti = true;
  }

  rentrerGrappin() { this.crochetParti = false; }

  // Kit de soin : animation qui dure dureeMs.
  soigner(dureeMs) {
    this.soin = { debut: this.temps, duree: dureeMs / 1000 };
    this.inspection = null;
    this.nouveauxSons('soin');
  }

  // Inspection (touche F) : seulement quand l'arme est en main et qu'on ne fait rien d'autre.
  inspecter() {
    if (this.inspection || this.recharge || this.coup || this.soin || this.sortie < 1 || this.visee > 0.05) return;
    if (this.action && this.temps < this.action.debut + this.action.duree) return;
    const anim = this.perso('inspecter') || this.origine('inspecter') || INSPECTION_DEFAUT;
    this.inspection = { debut: this.temps, duree: anim.duree };
    this.nouveauxSons('inspecter');
  }

  // Début d'un rechargement (durée en ms). Pour le fusil à pompe : une cartouche.
  recharger(dureeMs) {
    this.recharge = { debut: this.temps, duree: dureeMs / 1000 };
    this.inspection = null;
    this.sonsJoues.clear();
    this.nouveauxSons('recharge');
  }

  finRecharge(pompeALaFin) {
    this.recharge = null;
    this.remettrePieces();
    if (pompeALaFin) this.armer(this.temps);
  }

  // Position (dans le monde) d'un point de l'arme, ex. le bout du canon.
  pointMonde(nom, cameraJeu, cible) {
    const p = this.modele.userData[nom];
    if (!p) return null;
    this.support.updateMatrixWorld(true);
    cible.copy(p);
    this.modele.localToWorld(cible);
    return cible.applyMatrix4(cameraJeu.matrixWorld);
  }

  // Place un bras entre l'épaule et la main (les deux points sont dans le repère de la caméra).
  placerBras(bras, epaule, main) {
    const dir = main.clone().sub(epaule);
    const longueur = dir.length();
    bras.position.copy(epaule);
    bras.quaternion.setFromUnitVectors(AXE_Z, dir.divideScalar(Math.max(1e-6, longueur)));
    bras.scale.set(1, 1, Math.max(0.2, longueur / 0.85));
  }

  maj(dt, { vitesse, auSol, vy, sourisX, sourisY, viser, lateral, munitions, gadgetPret = true }) {
    this.temps += dt;
    const arme = this.arme;
    const u = this.modele.userData;
    const libre = !!u.repos;            // mêlée et gadgets tenus à la main : pas d'alignement de viseur
    const animSortie = this.perso('sortir');
    const dureeSortie = animSortie ? animSortie.duree : arme.sortieMs / 1000;
    this.sortie = Math.min(1, this.sortie + dt / Math.max(0.01, dureeSortie));
    if (viser && this.inspection) this.inspection = null; // viser arrête l'inspection
    const enAction = this.action && this.temps >= this.action.debut && this.temps < this.action.debut + this.action.duree;
    const peutViser = viser && !this.recharge && this.sortie >= 1 && !this.soin
      && !(enAction && this.action.type === 'culasse') && !(this.coup && this.coup.lancer);
    this.visee = borne(this.visee + (peutViser ? 1 : -1.4) * dt / (arme.viseeMs / 1000));
    const e = lisse(this.visee);
    const calme = 1 - e * (libre ? 0.5 : 0.9); // en visant, l'arme bouge beaucoup moins

    let x; let y; let z; let rx; let ry; let rz;
    if (libre) {
      // Mêlée / gadgets : pose de repos → pose "en garde" (sans zoom)
      const h = u.hanche; const gp = u.garde.pos; const r0 = u.repos; const r1 = u.garde.rot;
      x = h.x + (gp.x - h.x) * e; y = h.y + (gp.y - h.y) * e; z = h.z + (gp.z - h.z) * e;
      rx = r0[0] + (r1[0] - r0[0]) * e; ry = r0[1] + (r1[1] - r0[1]) * e; rz = r0[2] + (r1[2] - r0[2]) * e;
    } else {
      // Armes à feu : position à la hanche → position de visée (le viseur au centre de l'écran)
      const hanche = u.hanche;
      const ax = -u.visee.x; const ay = -u.visee.y; const az = -u.oeil - u.visee.z;
      x = hanche.x + (ax - hanche.x) * e;
      y = hanche.y + (ay - hanche.y) * e;
      z = hanche.z + (az - hanche.z) * e;
      rx = 0; ry = (1 - e) * -0.04; rz = 0;
    }

    // Balancement de la marche (en forme de 8), respiration, inertie de la souris
    const t = this.temps * 9.5;
    const marche = auSol ? vitesse : 0;
    x += Math.sin(t) * 0.012 * marche * calme;
    y -= Math.abs(Math.cos(t)) * 0.014 * marche * calme;
    y += Math.sin(this.temps * 1.6) * 0.0025 * calme;
    this.balance.x += ((-(sourisX || 0) * 0.0005) - this.balance.x) * Math.min(1, dt * 10);
    this.balance.y += (((sourisY || 0) * 0.0005) - this.balance.y) * Math.min(1, dt * 10);
    x += borne(this.balance.x, -0.04, 0.04) * calme;
    y += borne(this.balance.y, -0.03, 0.03) * calme;
    ry += borne(this.balance.x, -0.04, 0.04) * 1.5 * calme;
    rz += -(lateral || 0) * 0.06 * calme;                // penche en se déplaçant de côté
    y += borne(-(vy || 0) * 0.004, -0.03, 0.03) * calme;  // saut / chute
    // Laser en charge : l'arme vient vers le centre (on voit les anneaux) et tremble de plus en plus
    if (u.anneaux && this.chargeLaser > 0) {
      const c2 = this.chargeLaser * this.chargeLaser;
      x -= 0.05 * c2 * calme; y += 0.03 * c2 * calme; rz += 0.2 * c2 * calme; ry += 0.08 * c2 * calme;
      if (!this.apercu) {
        const s = c2 * 0.008;
        x += (Math.random() - 0.5) * s; y += (Math.random() - 0.5) * s; rz += (Math.random() - 0.5) * s * 3;
      }
    }

    // Mains : par défaut sur la poignée et le garde-main (pas de main gauche pour certains objets)
    const mainD = u.mainD.clone();
    let mainG = u.mainG ? u.mainG.clone() : null;
    this.remettrePieces();
    if (u.munition) u.munition.visible = munitions > 0;
    if (u.tendre && !this.recharge) u.tendre(munitions > 0 ? 1 : 0);
    // Grappin : le crochet est parti (ou pas encore prêt). Gadget pas encore rechargé : l'objet est caché.
    if (u.crochet) u.crochet.visible = !this.crochetParti && gadgetPret;
    if (u.objet && arme.categorie === 'gadget' && !u.crochet && !this.coup) u.objet.visible = gadgetPret;

    // Mains détachées de l'arme (0 = attachée, 1 = détachée) et leur décalage à l'écran
    let libreD = 0; let libreG = 0;
    const ecartD = new THREE.Vector3(); const ecartG = new THREE.Vector3();
    // Ajoute une pose d'animation perso (calculée par evaluer()) à la pose actuelle
    const ajouter = (o) => {
      const a = o.arme;
      if (a) { x += a[1]; y += a[2]; z += a[3]; rx += a[4]; ry += a[5]; rz += a[6]; }
      if (o.mainD) {
        mainD.set(u.mainD.x + o.mainD[1], u.mainD.y + o.mainD[2], u.mainD.z + o.mainD[3]);
        libreD = o.mainD[9] || 0;
        ecartD.set(o.mainD[1], o.mainD[2], o.mainD[3]);
      }
      const g = o.mainG;
      if (g) {
        // une arme sans main gauche : la main part d'à côté de la main droite
        const b = u.mainG || new THREE.Vector3(u.mainD.x - 0.09, u.mainD.y, u.mainD.z - 0.06);
        mainG = g[7] ? null : new THREE.Vector3(b.x + g[1], b.y + g[2], b.z + g[3]);
        libreG = g[9] || 0;
        ecartG.set(g[1], g[2], g[3]);
      }
      for (const nom of PIECES) {
        const k = o[nom]; const p = u[nom];
        if (!k || !p || !p.userData.repos || (nom === 'objet' && p === u.crochet)) continue;
        const r0 = p.userData.repos; const q0 = p.userData.reposRot;
        p.position.set(r0.x + k[1], r0.y + k[2], r0.z + k[3]);
        p.rotation.set(q0.x + k[4], q0.y + k[5], q0.z + k[6]);
        p.visible = !k[7];
      }
      if (o.corde && u.tendre) u.tendre(borne(o.corde[1]));
    };
    // Joue une animation perso au temps ta (secondes) : pose + sons
    const jouerPerso = (cle, anim, ta) => { ajouter(evaluer(anim, ta)); this.sonsDe(cle, anim, ta); };

    // Recul : l'arme part en arrière et se relève, puis revient (comme un ressort)
    const animTir = this.perso('tir');
    this.recul = Math.max(0, this.recul - dt * (RAPIDES.has(arme.id) ? 14 : 6));
    if (animTir) {
      if (this.tirDebut !== null && this.temps - this.tirDebut < animTir.duree) jouerPerso('tir', animTir, this.temps - this.tirDebut);
    } else {
      const [rz0, rr0] = RECUL[arme.id] || [0.04, 0.06];
      const r = this.recul * this.recul;
      z += r * rz0 * (1 - e * 0.5);
      rx += r * rr0 * (1 - e * 0.6);
      y += r * rz0 * 0.25;
      if (u.culasse && (u.glissiere || arme.id === 'pistolet')) {
        // glissière du pistolet qui recule au tir
        this.glissiere = Math.max(0, this.glissiere - dt * 12);
        u.culasse.position.z = u.culasse.userData.repos.z + 0.028 * this.glissiere;
      }
    }

    // Sortie de l'arme : elle remonte du bas de l'écran
    if (animSortie) {
      if (this.sortie < 1) jouerPerso('sortir', animSortie, this.sortie * animSortie.duree);
    } else {
      const s = 1 - lisse(this.sortie);
      y -= s * 0.28;
      rx -= s * 0.9;
    }

    // Rechargement
    const animRecharge = this.perso('recharge') || this.origine('recharge');
    if (this.recharge && animRecharge) {
      const p = borne((this.temps - this.recharge.debut) / this.recharge.duree);
      jouerPerso('recharge', animRecharge, p * animRecharge.duree);
    } else if (this.recharge) {
      const p = borne((this.temps - this.recharge.debut) / this.recharge.duree);
      const tilt = Math.sin(p * Math.PI);
      if (arme.parCartouche) {
        // Fusil à pompe : arme penchée, la main gauche glisse une cartouche
        rz += 0.45; rx += 0.12; y -= 0.02;
        const pousse = Math.sin(p * Math.PI);
        mainG = new THREE.Vector3(0.0, -0.07 + pousse * 0.035, -pousse * 0.02);
      } else if (arme.id === 'roquette') {
        // Lance-roquettes : on baisse le tube, une nouvelle roquette arrive par l'avant
        rx -= tilt * 0.35; y -= tilt * 0.08;
        const mun = u.munition;
        mun.visible = p > 0.35;
        const k = lisse(phase(p, 0.35, 0.8));
        mun.position.set(mun.userData.repos.x, mun.userData.repos.y - 0.35 * (1 - k), mun.userData.repos.z - 0.1 * (1 - k));
        if (p > 0.3 && p < 0.82) mainG = mun.position.clone().add(new THREE.Vector3(0, -0.04, -0.15)).add(mun.userData.decalageMain || ZERO);
        this.jouerUneFois('chargeur_insere', p > 0.78);
      } else if (u.barillet) {
        // Revolver : le barillet bascule sur le côté, on remet les balles, il revient
        rz += tilt * 0.6; rx += tilt * 0.2; y -= tilt * 0.02;
        const ouvert = lisse(phase(p, 0.1, 0.24)) * (1 - lisse(phase(p, 0.76, 0.9)));
        u.barillet.rotation.z = ouvert * 1.25;
        if (p > 0.2 && p < 0.8) mainG = new THREE.Vector3(-0.045, 0.01 + Math.sin(p * 30) * 0.008, -0.03);
        this.jouerUneFois('revolver_recharge', p > 0.12);
      } else if (u.tendre) {
        // Arbalète : pointe vers le bas, on retend la corde, on pose un nouveau carreau
        rx -= tilt * 0.45; y -= tilt * 0.05; rz += tilt * 0.15;
        const k = lisse(phase(p, 0.12, 0.55));
        u.tendre(k);
        if (p > 0.08 && p < 0.58) mainG = new THREE.Vector3(0, 0.035, -0.31 + 0.25 * k);
        const mun = u.munition;
        mun.visible = p > 0.6;
        const kb = lisse(phase(p, 0.6, 0.85));
        mun.position.set(mun.userData.repos.x, mun.userData.repos.y + 0.05 * (1 - kb), mun.userData.repos.z + 0.15 * (1 - kb));
        if (p >= 0.58 && p < 0.88) mainG = mun.position.clone().add(new THREE.Vector3(0, -0.01, -0.1));
        this.jouerUneFois('chargeur_retire', p > 0.12);
        this.jouerUneFois('chargeur_insere', p > 0.78);
      } else if (u.canons) {
        // Armes à bascule (canon scié, lance-fusée) : on casse l'arme, on remet les cartouches
        rx += tilt * 0.25; rz += tilt * 0.2;
        const ouvert = lisse(phase(p, 0.08, 0.22)) * (1 - lisse(phase(p, 0.78, 0.92)));
        u.canons.rotation.x = -0.7 * ouvert;
        if (u.munitionCanon) u.munitionCanon.visible = !(p > 0.25 && p < 0.55);
        if (p > 0.22 && p < 0.75) mainG = new THREE.Vector3(-0.02, 0.0 + Math.sin(p * 12) * 0.01, -0.05);
        this.jouerUneFois('chargeur_retire', p > 0.1);
        this.jouerUneFois('cartouche_insere', p > 0.55);
        this.jouerUneFois('chargeur_insere', p > 0.85);
      } else if (u.chargeur) {
        // Armes à chargeur : on penche l'arme, le chargeur tombe, un nouveau arrive
        const petit = !!u.pistolet || arme.id === 'uzi';
        rz += tilt * (petit ? 0.4 : 0.55); rx += tilt * 0.18; y -= tilt * 0.035;
        const ch = u.chargeur;
        const sortieCh = lisse(phase(p, 0.18, 0.38));
        const retourCh = lisse(phase(p, 0.5, 0.74));
        const bas = sortieCh * (1 - retourCh);
        ch.position.set(ch.userData.repos.x, ch.userData.repos.y - (petit ? 0.2 : 0.32) * bas, ch.userData.repos.z + 0.03 * bas);
        ch.visible = !(p > 0.38 && p < 0.5);
        // (decalageMain : modèle réaliste, la vraie pièce n'est pas tout à fait au même endroit que celle en boîtes)
        if (p > 0.15 && p < 0.82) mainG = ch.position.clone().add(new THREE.Vector3(0, -0.06, 0)).add(ch.userData.decalageMain || ZERO);
        this.jouerUneFois('chargeur_retire', p > 0.2);
        this.jouerUneFois('chargeur_insere', p > 0.72);
        if (arme.id === 'sniper') {
          this.animerCulasse(phase(p, 0.82, 1), u);
          this.jouerUneFois('sniper_culasse', p > 0.82);
        }
      } else {
        rx -= tilt * 0.3; y -= tilt * 0.06;
      }
    }

    // Pompe (fusil à pompe) ou culasse (sniper) après un tir
    if (this.action) {
      const a = this.action;
      const q = (this.temps - a.debut) / a.duree;
      const animArmement = this.perso('armement');
      if (q >= 0 && q <= 1 && animArmement) {
        jouerPerso('armement', animArmement, q * animArmement.duree);
      } else if (q >= 0 && q <= 1) {
        if (!a.sonJoue) { a.sonJoue = true; this.surSon(a.son); }
        if (a.type === 'pompe') {
          const k = Math.sin(q * Math.PI);
          u.pompe.position.z = u.pompe.userData.repos.z + 0.09 * k;
          if (mainG) mainG.z += 0.09 * k;
          rx += 0.06 * k; rz += 0.05 * k;
        } else {
          this.animerCulasse(q, u);
          rz += 0.12 * Math.sin(q * Math.PI);
          rx += 0.05 * Math.sin(q * Math.PI);
        }
      } else if (q > 1) this.action = null;
    }

    // Coups de mêlée et lancers
    if (this.coup) {
      const c = this.coup;
      const q = (this.temps - c.debut) / c.duree;
      const animCoup = this.perso(c.cle);
      if (q >= 1) this.coup = null;
      else if (animCoup) jouerPerso(c.cle, animCoup, Math.max(0, q) * animCoup.duree);
      else {
        const v = etape(c.etapes, Math.max(0, q));
        x += v[1]; y += v[2]; z += v[3]; rx += v[4]; ry += v[5]; rz += v[6];
        if (c.special && !this.apercu && q > 0.42 && q < 0.72) { x += (Math.random() - 0.5) * 0.012; y += (Math.random() - 0.5) * 0.012; } // secousse du coup final
        if (c.lancer && u.objet) u.objet.visible = q < 0.48;
      }
    }

    // Gadget pas encore rechargé : main vide (l'objet est caché, la main un peu plus basse)
    if (u.objet && arme.categorie === 'gadget' && !u.crochet && !gadgetPret && !this.coup) { y -= 0.04; rx -= 0.2; }

    // Kit de soin : on lève le kit devant soi, la main gauche enroule un bandage
    if (this.soin) {
      const q = (this.temps - this.soin.debut) / this.soin.duree;
      const animSoin = this.perso('soin');
      if (q >= 1) this.soin = null;
      else if (animSoin) jouerPerso('soin', animSoin, Math.max(0, q) * animSoin.duree);
      else {
        const k = lisse(phase(q, 0, 0.15)) * (1 - lisse(phase(q, 0.88, 1)));
        x += (0.02 - x) * k; y += (-0.13 - y) * k; z += (-0.3 - z) * k;
        rx += (0.35 - rx) * k; ry *= 1 - k; rz *= 1 - k;
        const a = this.temps * 9;
        mainG = new THREE.Vector3(-0.06 + Math.cos(a) * 0.05 * k, 0.04 + Math.sin(a) * 0.035 * k, -0.04);
      }
    }

    // Inspection (touche F) : animation perso, sinon celle propre à l'arme, sinon celle de base
    if (this.inspection) {
      const q = (this.temps - this.inspection.debut) / this.inspection.duree;
      const animInsp = this.perso('inspecter') || this.origine('inspecter');
      if (q >= 1) this.inspection = null;
      else if (animInsp) jouerPerso('inspecter', animInsp, Math.max(0, q) * animInsp.duree);
      else ajouter(evaluer(INSPECTION_DEFAUT, Math.max(0, q) * INSPECTION_DEFAUT.duree));
    }

    this.support.position.set(x, y, z);
    this.pivot.rotation.set(rx, ry, rz);
    // Les mains suivent l'arme (on passe du repère de l'arme à celui de la caméra)... sauf une main détachée,
    // qui garde sa place à l'écran (on passe en douceur de l'une à l'autre)
    this.support.updateMatrixWorld(true);
    const ecranD = this.modele.localToWorld(mainD.clone());
    if (libreD > 0) ecranD.lerp(this.mainReposEcran(u, 'D').clone().add(ecartD), libreD);
    const ecranG = mainG ? this.modele.localToWorld(mainG.clone()) : null;
    if (ecranG && libreG > 0) ecranG.lerp(this.mainReposEcran(u, 'G').clone().add(ecartG), libreG);
    this.derniere = {
      x, y, z, rx, ry, rz, mainD: mainD.clone(), mainG: mainG ? mainG.clone() : null,
      mainDEcran: ecranD.clone(), mainGEcran: ecranG ? ecranG.clone() : null, libreD, libreG,
    };
    this.placerBras(this.brasD, this.epauleD, ecranD);
    this.brasG.visible = !!ecranG;
    if (ecranG) this.placerBras(this.brasG, this.epauleG, ecranG);

    // Éclair
    if (this.eclairVie > 0) {
      this.eclairVie -= dt;
      this.eclair.position.copy(u.bout).add(new THREE.Vector3(0, 0, -0.03));
      const k = u.flash * (0.8 + Math.random() * 0.5);
      this.eclair.scale.set(k, k, 1);
      if (this.eclairVie <= 0) this.eclair.visible = false;
    }
    if (u.anneaux) this.animerLaser(dt, u);
    this.animerEffets(dt, u);
    // Dans la lunette du sniper, on cache l'arme (l'écran affiche la lunette)
    this.cache = !!u.lunette && e > (u.lunetteSeuil ?? 0.92); // (plus tôt pour les modèles réalistes, voir armes-glb.js)
    return e;
  }

  // Place normale d'une main à l'écran (arme à la hanche, sans animation) : le point de départ
  // d'une main détachée de l'arme. cote = 'D' ou 'G'.
  mainReposEcran(u, cote) {
    const cle = cote === 'D' ? '_mainDEcran' : '_mainGEcran';
    if (!u[cle]) {
      const r = u.repos || [0, -0.04, 0];
      const m = new THREE.Matrix4().compose(u.hanche.clone(), new THREE.Quaternion().setFromEuler(new THREE.Euler(r[0], r[1], r[2])), new THREE.Vector3(1, 1, 1));
      const local = cote === 'D' ? u.mainD.clone() : (u.mainG ? u.mainG.clone() : new THREE.Vector3(u.mainD.x - 0.09, u.mainD.y, u.mainD.z - 0.06));
      u[cle] = local.applyMatrix4(m);
    }
    return u[cle];
  }

  // ---------- Atelier d'animations ----------
  // Pose l'arme à l'instant t (secondes) de l'animation cle, sans balancement ni visée.
  // anim = l'animation perso à montrer, ou null pour celle d'origine ; cle = null : pose normale.
  // ecoute(nom) reçoit les sons de l'animation d'origine (sinon, aucun son).
  poserApercu(cle, t, anim, ecoute = null) {
    const arme = this.arme;
    this.recharge = null; this.action = null; this.coup = null; this.soin = null; this.inspection = null;
    this.tirDebut = null; this.recul = 0; this.glissiere = 0; this.sortie = 1; this.visee = 0;
    this.crochetParti = false; this.balance.set(0, 0); this.eclairVie = 0; this.eclair.visible = false;
    const d = cle ? dureeAnimation(arme, cle, anim) : 0;
    const debut = this.temps - t;
    switch (cle) {
      case 'sortir': this.sortie = d > 0 ? Math.min(1, t / d) : 1; break;
      case 'recharge': this.recharge = { debut, duree: d }; break;
      case 'tir':
        this.tirDebut = debut;
        this.recul = Math.max(0, 1 - t * (RAPIDES.has(arme.id) ? 14 : 6));
        if (arme.id === 'pistolet' || this.modele.userData.glissiere) this.glissiere = Math.max(0, 1 - t * 12);
        break;
      case 'armement':
        this.action = { debut, duree: d, type: arme.id === 'pompe' ? 'pompe' : 'culasse', son: arme.id === 'pompe' ? 'pompe_armement' : 'sniper_culasse', sonJoue: !ecoute };
        break;
      case 'coup': case 'coupDos': case 'lancer': {
        const c = cle === 'lancer' ? COUPS.lancer : cle === 'coupDos' ? COUPS.couteauDos : (COUPS[arme.id] || COUPS.couteau);
        this.coup = { debut, duree: d, etapes: c.etapes, special: cle === 'coupDos', lancer: cle === 'lancer', cle };
        break;
      }
      case 'soin': this.soin = { debut, duree: d }; break;
      case 'inspecter': this.inspection = { debut, duree: d }; break;
      default: break;
    }
    const surSon = this.surSon;
    this.surSon = ecoute || (() => {});
    this.apercu = { cle, anim };
    try {
      this.maj(0, { vitesse: 0, auSol: true, vy: 0, sourisX: 0, sourisY: 0, viser: false, lateral: 0, munitions: 1, gadgetPret: true });
    } finally {
      this.apercu = null;
      this.surSon = surSon;
    }
  }

  animerCulasse(q, u) {
    const c = u.culasse;
    if (!c) return;
    const leve = lisse(phase(q, 0, 0.25)) * (1 - lisse(phase(q, 0.75, 1)));
    const recule = lisse(phase(q, 0.25, 0.5)) * (1 - lisse(phase(q, 0.5, 0.75)));
    c.rotation.z = leve * 1.1;
    c.position.z = c.userData.repos.z + recule * 0.07;
  }

  jouerUneFois(nom, condition) {
    if (condition && !this.sonsJoues.has(nom)) { this.sonsJoues.add(nom); this.surSon(nom); }
  }

  dessiner(renderer, aspect, zoom) {
    if (this.cache) return;
    const fov = 55 / Math.sqrt(zoom || 1);
    if (this.camera.aspect !== aspect || this.camera.fov !== fov) {
      this.camera.aspect = aspect;
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(this.scene, this.camera);
    renderer.autoClear = true;
  }
}
