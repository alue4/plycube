// Le joueur sur cet ordinateur : déplacements, collisions et regard à la souris.
// Les touches (clavier, souris, manette) sont lues par commandes.js.
import * as THREE from '../vendor/three.min.js';

export const RAYON = 0.3;        // demi-largeur du joueur (m)
export const HAUTEUR = 1.8;      // taille du joueur (m)
export const YEUX = 1.62;        // hauteur des yeux (m)
const MARCHE = 0.55;             // hauteur d'une marche que l'on monte sans sauter

export class JoueurLocal {
  constructor({ boites, reglages }) {
    this.boites = boites; // [x1, y1, z1, x2, y2, z2, matière]
    this.r = reglages.joueur;
    this.pos = new THREE.Vector3();
    this.vit = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;
    this.auSol = false;
    this.commandes = null;       // les touches (voir commandes.js), donné par main.js
    this.actif = false;          // vrai quand on joue (souris capturée, commandes tactiles ou manette)
    this.vivant = false;
    this.sensibilite = 1;
    this.surEvenement = () => {}; // 'saut', 'trampoline', 'atterrir'
    this.balancement = 0;
    this.chocAtterrissage = 0;
    this.multVitesse = 1;        // plus lent en visant
    this.niveauEau = null;       // hauteur de l'eau sur la carte (ou null)
    this.dansLEau = false;
    this.distancePas = 0;
    // Commandes tactiles (tablette) : joystick (-1 → 1) et bouton "Sauter" ; stick gauche de la manette
    this.analogique = { avant: 0, cote: 0 };
    this.analogiqueManette = { avant: 0, cote: 0 };
    this.sautTactile = false;
    this.vol = false;            // pouvoir d'admin : on vole (Espace monter, C descendre)
    // Autres pouvoirs d'admin (réglés par main.js) : saut plus fort, gravité plus faible, sauts en l'air,
    // passe-muraille (pas de collisions avec les murs, sauf le sol en dessous de 0), taille des yeux (géant / mini)
    this.multSaut = 1;
    this.multGravite = 1;
    this.sautsEnLAir = 0;
    this.fantome = false;
    this.echelleYeux = 1;
    this.sautsRestants = 0;
    this.sautRelache = true;

    addEventListener('mousemove', (e) => {
      // sur tablette, on regarde avec le doigt ; à la manette (souris pas capturée), avec le stick droit
      if (!this.actif || this.sourisActive === false || !document.pointerLockElement) return;
      if ((e.movementX || e.movementY) && this.commandes) this.commandes.changerSaisie('clavier');
      const k = 0.0022 * this.sensibilite;
      this.yaw -= e.movementX * k;
      this.pitch -= e.movementY * k;
      this.pitch = Math.max(-1.55, Math.min(1.55, this.pitch));
      this.dernierMouvementSouris = e.movementX;
      this.dernierMouvementSourisY = e.movementY;
    });
  }

  // Le souffle d'une explosion projette le joueur (rocket jump !)
  pousser(v) {
    this.vit.x += v[0];
    this.vit.y = Math.max(this.vit.y, 0) + v[1];
    this.vit.z += v[2];
    this.auSol = false;
  }

  placer(p, yaw) {
    this.pos.set(p[0], p[1], p[2]);
    this.vit.set(0, 0, 0);
    if (yaw !== undefined) { this.yaw = yaw; this.pitch = 0; }
  }

  // Est-ce que le joueur, placé en (x, y, z), touche une boîte ? Renvoie la boîte.
  collision(x, y, z) {
    if (this.fantome) return y < 0 ? [-1e4, -50, -1e4, 1e4, 0, 1e4, 'sol'] : null; // passe-muraille : seul le sol arrête
    for (const b of this.boites) {
      if (x - RAYON < b[3] && x + RAYON > b[0] && y < b[4] && y + HAUTEUR > b[1] && z - RAYON < b[5] && z + RAYON > b[2]) return b;
    }
    return null;
  }

  // Déplace sur un axe (0 = x, 1 = y, 2 = z) en s'arrêtant contre les obstacles.
  deplacerAxe(axe, delta, peutMonter) {
    if (delta === 0) return;
    const p = this.pos;
    if (axe === 0) p.x += delta; else if (axe === 1) p.y += delta; else p.z += delta;
    // Plusieurs boîtes peuvent se toucher : on corrige jusqu'à ne plus rien toucher.
    for (let essai = 0; essai < 4; essai++) {
      const b = this.collision(p.x, p.y, p.z);
      if (!b) return;
      if (this.repousser(axe, delta, peutMonter, b)) return;
    }
  }

  // Sort le joueur de la boîte b. Renvoie true s'il est monté sur une marche.
  repousser(axe, delta, peutMonter, b) {
    const p = this.pos;
    if (axe === 1) {
      if (delta < 0) {
        p.y = b[4];
        if (this.vit.y < -9) this.chocAtterrissage = Math.min(1, -this.vit.y / 25);
        if (!this.auSol && this.vit.y < -4) this.surEvenement('atterrir');
        this.vit.y = 0;
        this.auSol = true;
        this.solSous = b;
      } else {
        p.y = b[1] - HAUTEUR - 0.001;
        this.vit.y = 0;
      }
      return false;
    }
    // Petite marche (escaliers) : on monte dessus automatiquement.
    if (peutMonter && b[4] - p.y <= MARCHE && b[4] - p.y > 0 && !this.collision(p.x, b[4] + 0.001, p.z)) {
      p.y = b[4] + 0.001;
      return true;
    }
    const c = axe === 0 ? 'x' : 'z';
    if (delta > 0) p[c] = b[axe] - RAYON - 0.001;
    else p[c] = b[axe + 3] + RAYON + 0.001;
    if (axe === 0) this.vit.x = 0; else this.vit.z = 0;
    return false;
  }

  maj(dt) {
    if (!this.vivant) return;
    const tient = (action) => this.actif && !!this.commandes && this.commandes.tenue(action);
    // Clavier + joystick tactile + stick de la manette (les deux derniers permettent aussi de marcher doucement)
    const a = this.analogique;
    const m = this.analogiqueManette;
    const avant = Math.max(-1, Math.min(1, (tient('avancer') ? 1 : 0) - (tient('reculer') ? 1 : 0) + a.avant + m.avant));
    const cote = Math.max(-1, Math.min(1, (tient('droite') ? 1 : 0) - (tient('gauche') ? 1 : 0) + a.cote + m.cote));
    const saut = tient('sauter') || this.sautTactile;
    const force = Math.min(1, Math.hypot(avant, cote)); // à fond = 1, petite poussée = plus lent
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    let vx = -sin * avant + cos * cote;
    let vz = -cos * avant - sin * cote;
    const n = Math.hypot(vx, vz);
    // Dans l'eau, on avance moins vite.
    const eau = this.niveauEau !== null && this.pos.y < this.niveauEau - 0.25;
    if (eau && !this.dansLEau && this.vit.y < -2) this.surEvenement('eau');
    this.dansLEau = eau;
    const vMax = this.r.vitesse * this.multVitesse * (eau ? 0.62 : 1) * (this.vol ? 1.8 : 1);
    if (n > 0) { vx = (vx / n) * vMax * force; vz = (vz / n) * vMax * force; }

    // On découpe en petits pas pour ne jamais traverser un mur.
    let reste = Math.min(dt, 0.1);
    while (reste > 0) {
      const h = Math.min(reste, 1 / 120);
      reste -= h;
      const accel = (this.auSol ? 60 : 14) * h;
      this.vit.x += Math.max(-accel, Math.min(accel, vx - this.vit.x)) * (this.auSol || n > 0 ? 1 : 0.2);
      this.vit.z += Math.max(-accel, Math.min(accel, vz - this.vit.z)) * (this.auSol || n > 0 ? 1 : 0.2);

      if (this.vol) {
        // En vol : pas de gravité, la touche de saut pour monter, celle de « descendre » pour descendre
        const monter = (saut ? 1 : 0) - (tient('descendre') ? 1 : 0);
        const a = 30 * h;
        this.vit.y += Math.max(-a, Math.min(a, monter * vMax - this.vit.y));
      } else {
        if (this.auSol) this.sautsRestants = this.sautsEnLAir;
        if (this.auSol && saut) {
          this.vit.y = this.r.forceSaut * this.multSaut;
          this.auSol = false;
          this.sautRelache = false;
          this.surEvenement('saut');
        } else if (!this.auSol && saut && this.sautRelache && this.sautsRestants > 0) {
          // pouvoir d'admin : on peut resauter en l'air
          this.sautsRestants--;
          this.vit.y = this.r.forceSaut * this.multSaut;
          this.sautRelache = false;
          this.surEvenement('saut');
        }
        if (!saut) this.sautRelache = true;
        // Trampoline !
        if (this.auSol && this.solSous && this.solSous[6] === 'trampoline') {
          this.vit.y = this.r.forceTrampoline;
          this.auSol = false;
          this.surEvenement('trampoline');
        }
        this.vit.y -= this.r.gravite * this.multGravite * h;
      }
      const etaitAuSol = this.auSol;
      this.auSol = false;
      this.deplacerAxe(0, this.vit.x * h, etaitAuSol);
      this.deplacerAxe(2, this.vit.z * h, etaitAuSol);
      this.deplacerAxe(1, this.vit.y * h, false);
      if (this.pos.y < -5) this.pos.y = 2; // sécurité : on ne tombe jamais sous la carte
    }
    const v = Math.hypot(this.vit.x, this.vit.z);
    if (this.auSol) {
      this.balancement += dt * v * 1.6;
      // Un bruit de pas tous les 2,2 mètres environ
      this.distancePas += v * dt;
      if (this.distancePas > 2.2) { this.distancePas = 0; this.surEvenement(eau ? 'eau_pas' : 'pas'); }
    }
    this.chocAtterrissage = Math.max(0, this.chocAtterrissage - dt * 3);
  }

  vitesseHorizontale() {
    return Math.hypot(this.vit.x, this.vit.z);
  }

  // Place la caméra aux yeux du joueur, avec un léger balancement en marchant.
  appliquerCamera(camera) {
    const v = Math.min(1, this.vitesseHorizontale() / this.r.vitesse);
    const bob = this.auSol ? Math.sin(this.balancement * 2) * 0.035 * v : 0;
    camera.position.set(this.pos.x, this.pos.y + YEUX * this.echelleYeux + bob - this.chocAtterrissage * 0.12, this.pos.z);
    camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }
}
