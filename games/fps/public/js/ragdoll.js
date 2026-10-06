// Ragdoll : quand un joueur est éliminé, son personnage se "désarticule" et
// s'envole de façon rigolote, puis disparaît dans un nuage de pixels.
//
// Chaque morceau (tête, corps, bras, jambes) est un petit objet physique.
// Des "articulations" les gardent attachés au corps.
import * as THREE from '../vendor/three.min.js';

const GRAVITE = new THREE.Vector3(0, -22, 0);
const REBOND = 0.35;
const _v = new THREE.Vector3();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _d = new THREE.Vector3();
const _q = new THREE.Quaternion();

export class Ragdoll {
  // personnage : le Personnage à copier ; impulsion : direction du tir (Vector3)
  constructor(scene, personnage, { impulsion, vitesse, boites, force = 1, tete = false, duree = 3.5 }) {
    this.scene = scene;
    this.boites = boites;
    this.age = 0;
    this.duree = duree;
    this.morceaux = [];
    this.groupe = new THREE.Group();
    scene.add(this.groupe);
    personnage.groupe.updateMatrixWorld(true);

    const materiau = personnage.materiau.clone();
    materiau.opacity = 1;
    materiau.depthWrite = true;
    materiau.emissive.setScalar(0);
    this.materiau = materiau;
    const pousse = impulsion.clone().setY(0).normalize().multiplyScalar(10 * force);
    pousse.y = 7 * force;

    const index = {};
    for (const [nom, p] of Object.entries(personnage.parties)) {
      const mesh = new THREE.Mesh(p.mesh.geometry, materiau);
      for (const enfant of p.mesh.children) mesh.add(enfant.clone(true)); // chapeau, sac à dos...
      mesh.castShadow = true;
      p.mesh.getWorldPosition(mesh.position);
      p.mesh.getWorldQuaternion(mesh.quaternion);
      this.groupe.add(mesh);
      const v = (vitesse ? vitesse.clone() : new THREE.Vector3()).add(pousse);
      v.x += (Math.random() - 0.5) * 3;
      v.z += (Math.random() - 0.5) * 3;
      if (nom === 'tete' && tete) v.addScaledVector(impulsion, 6 * force).y += 3;
      const h = Math.max(...p.taille) / 2;
      const r = Math.min(...p.taille) / 2;
      const m = {
        nom, mesh,
        prec: mesh.position.clone().addScaledVector(v, -1 / 120),
        w: new THREE.Vector3((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 14),
        masse: nom === 'corps' ? 3 : 1,
        rayon: r,
        // points testés contre le sol et les murs : le centre et les deux bouts du morceau
        bouts: [new THREE.Vector3(0, h - r, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -(h - r), 0)],
      };
      if (nom === 'tete') m.bouts = [new THREE.Vector3()];
      if (nom === 'corps') m.bouts = [new THREE.Vector3(0, h - r, 0), new THREE.Vector3(0, -(h - r), 0)];
      index[nom] = m;
      this.morceaux.push(m);
    }

    // Articulations : le point (dans le monde) où deux morceaux sont attachés.
    this.liens = [];
    const lier = (nomA, nomB, pivot) => {
      const A = index[nomA];
      const B = index[nomB];
      const monde = new THREE.Vector3();
      pivot.getWorldPosition(monde);
      const local = (m) => monde.clone().sub(m.mesh.position).applyQuaternion(m.mesh.quaternion.clone().invert());
      this.liens.push({ A, B, ancreA: local(A), ancreB: local(B) });
    };
    const P = personnage.parties;
    lier('corps', 'tete', P.tete.pivot);
    lier('corps', 'brasD', P.brasD.pivot);
    lier('corps', 'brasG', P.brasG.pivot);
    lier('corps', 'jambeD', P.jambeD.pivot);
    lier('corps', 'jambeG', P.jambeG.pivot);
  }

  pas(h) {
    // 1. Mouvement libre (méthode de Verlet : la vitesse = position - position précédente)
    for (const m of this.morceaux) {
      const p = m.mesh.position;
      _v.subVectors(p, m.prec).multiplyScalar(0.998);
      m.prec.copy(p);
      p.add(_v).addScaledVector(GRAVITE, h * h);
      if (m.w.lengthSq() > 1e-6) {
        _q.setFromAxisAngle(_a.copy(m.w).normalize(), m.w.length() * h);
        m.mesh.quaternion.premultiply(_q);
      }
      m.w.multiplyScalar(0.995);
    }
    // 2. Les articulations ramènent les morceaux ensemble
    for (let it = 0; it < 5; it++) {
      for (const l of this.liens) {
        const { A, B } = l;
        _a.copy(l.ancreA).applyQuaternion(A.mesh.quaternion).add(A.mesh.position);
        _b.copy(l.ancreB).applyQuaternion(B.mesh.quaternion).add(B.mesh.position);
        _d.subVectors(_b, _a);
        const total = A.masse + B.masse;
        A.mesh.position.addScaledVector(_d, B.masse / total);
        B.mesh.position.addScaledVector(_d, -A.masse / total);
        // le morceau léger pivote autour de l'articulation
        const r = _v.copy(l.ancreB).applyQuaternion(B.mesh.quaternion);
        const axe = _a.crossVectors(r, _d.negate());
        const angle = axe.length() / Math.max(1e-4, r.lengthSq());
        if (angle > 1e-5) {
          _q.setFromAxisAngle(axe.normalize(), Math.min(angle, 0.3) * 0.5);
          B.mesh.quaternion.premultiply(_q);
        }
      }
    }
    // 3. Collisions avec la carte (sol, murs, caisses)
    for (const m of this.morceaux) {
      for (const bout of m.bouts) {
        _a.copy(bout).applyQuaternion(m.mesh.quaternion).add(m.mesh.position);
        for (const b of this.boites) {
          const r = m.rayon;
          if (_a.x < b[0] - r || _a.x > b[3] + r || _a.y < b[1] - r || _a.y > b[4] + r || _a.z < b[2] - r || _a.z > b[5] + r) continue;
          _b.set(Math.max(b[0], Math.min(_a.x, b[3])), Math.max(b[1], Math.min(_a.y, b[4])), Math.max(b[2], Math.min(_a.z, b[5])));
          _d.subVectors(_a, _b);
          let dist = _d.length();
          if (dist < 1e-5) { _d.set(0, 1, 0); dist = 0; _a.y = b[4]; } // à l'intérieur : on remonte
          else _d.divideScalar(dist);
          if (dist >= r) continue;
          const enfonce = r - dist;
          m.mesh.position.addScaledVector(_d, enfonce);
          _a.addScaledVector(_d, enfonce);
          // rebond + frottement
          _v.subVectors(m.mesh.position, m.prec);
          const vn = _v.dot(_d);
          if (vn < 0) {
            _v.addScaledVector(_d, -vn * (1 + REBOND));
            const tangente = _b.copy(_v).addScaledVector(_d, -_v.dot(_d));
            _v.addScaledVector(tangente, -0.25);
            m.prec.subVectors(m.mesh.position, _v);
            m.w.multiplyScalar(0.85);
          }
        }
      }
    }
  }

  // Renvoie false quand le ragdoll a fini (il faut alors le retirer).
  maj(dt) {
    this.age += dt;
    const n = Math.ceil(Math.min(dt, 0.05) / (1 / 120));
    for (let i = 0; i < n; i++) this.pas(1 / 120);
    return this.age < this.duree;
  }

  // Positions des morceaux (pour le nuage de pixels final).
  positions() {
    return this.morceaux.map((m) => m.mesh.position.clone());
  }

  centre() {
    return this.morceaux.find((m) => m.nom === 'corps').mesh.position;
  }

  liberer() {
    this.groupe.removeFromParent();
    this.materiau.dispose();
  }
}
