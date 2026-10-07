// Les animations « d'origine » propres à chaque arme : l'inspection (touche F) et la recharge.
// Elles ont le même format que les animations de l'atelier (voir animations-perso.js) :
//   - une animation faite dans l'atelier passe toujours avant celle-ci ;
//   - l'atelier peut recopier celle-ci telle quelle, pour partir de là.
// Elles sont calculées à partir du modèle de l'arme (place des mains et des pièces), pour que la main
// gauche attrape vraiment le chargeur, même sur les modèles réalistes (decalageMain, voir armes-glb.js).
//
// Une clé : K(t, [x, y, z], [rx, ry, rz], { cache, arret, libre })
//   arme  : décalage de l'arme à l'écran (mètres) et rotation (radians) ;
//           rx > 0 : le canon monte · ry > 0 : le canon part à gauche · rz > 0 : l'arme penche à gauche
//   mains : décalage par rapport à leur place normale sur l'arme (libre = 1 : la main lâche l'arme et
//           garde sa place à l'écran) ; pièces : décalage par rapport à leur place normale.
// Les recharges sont écrites de 0 à 1 puis mises à la durée du jeu (rechargementMs).

const O = [0, 0, 0];
const K = (t, p = O, r = O, o = {}) => [t, p[0], p[1], p[2], r[0], r[1], r[2], o.cache ? 1 : 0, o.arret ? 1 : 0, o.libre || 0];
const plus = (a, b) => a.map((v, i) => v + b[i]);
const TOUR = Math.PI * 2;

// Ce qu'il faut savoir du modèle pour placer les mains
function geometrie(u) {
  const v = (p) => [p.x, p.y, p.z];
  const mG = u.mainG ? v(u.mainG) : [u.mainD.x - 0.09, u.mainD.y, u.mainD.z - 0.06];
  const mD = v(u.mainD);
  const repos = (nom) => (u[nom] && u[nom].userData.repos ? v(u[nom].userData.repos) : [0, 0, 0]);
  const decalage = (nom) => (u[nom] && u[nom].userData.decalageMain ? v(u[nom].userData.decalageMain) : [0, 0, 0]);
  return {
    // décalage de la main gauche / droite pour toucher le point P (dans le repère de l'arme)
    G: (P) => P.map((c, i) => c - mG[i]),
    D: (P) => P.map((c, i) => c - mD[i]),
    // point où la main tient la pièce, quand la pièce est décalée de d
    sur: (nom, d = O, prise = [0, -0.06, 0]) => plus(plus(plus(repos(nom), d), prise), decalage(nom)),
    repos,
  };
}

// Met une recharge écrite de 0 à 1 à la durée du jeu
function aDuree(anim, duree) {
  const pistes = {};
  for (const [nom, cles] of Object.entries(anim.pistes)) pistes[nom] = cles.map((k) => [Math.round(k[0] * duree * 1e4) / 1e4, ...k.slice(1)]);
  return { duree, mouvement: anim.mouvement || 'fluide', pistes, sons: (anim.sons || []).map(([t, n]) => [Math.round(t * duree * 1e4) / 1e4, n]) };
}

// Échange de chargeur classique (vu de la main gauche) : la main va au chargeur, le sort de « bas »,
// le lâche, en prend un neuf, le remet et tape dessous. Les moments sont donnés en fractions (0 → 1).
function echangeChargeur(g, { prise, debut = 0.14, sortie = 0.34, cache = 0.35, neuf = 0.44, dedans = 0.6, tape = 0.64, bas = [0, -0.32, 0.03], loin = [-0.06, -0.38, 0.08], arrivee = [0, -0.3, 0.04] }) {
  const sur = (d) => g.G(g.sur('chargeur', d, prise));
  return {
    chargeur: [K(0), K(debut + 0.03), K(sortie, bas), K(cache, bas, O, { cache: 1 }), K(neuf, arrivee), K(dedans, [0, -0.012, 0]), K(tape)],
    mainG: [K(debut, sur(O)), K(debut + 0.03, sur(O), O, { arret: 1 }), K(sortie, sur(bas)), K((sortie + neuf) / 2 + 0.01, sur(loin)), K(neuf + 0.01, sur(arrivee)),
      K(dedans, sur([0, -0.012, 0])), K(dedans + (tape - dedans) / 2, sur([0, -0.04, 0])), K(tape, sur([0, -0.004, 0]))],
  };
}

// ----------------------------------------------------------------------------------------------
// Inspections (touche F) : une par arme
// ----------------------------------------------------------------------------------------------
const INSPECTIONS = {
  // Fusil d'assaut : on regarde le côté, on vérifie le chargeur, une claque sur l'arrêtoir de culasse
  fusil(g) {
    const ch = (d = O) => g.G(g.sur('chargeur', d));
    const levier = [-0.04, 0.0, -0.04]; // arrêtoir de culasse (côté gauche)
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.45, [-0.07, 0.05, 0.04], [0.12, 0.75, 0.35]), K(1.0, [-0.075, 0.055, 0.045], [0.1, 0.82, 0.28]), K(1.4, [-0.04, 0.03, 0.03], [0.18, 0.25, -0.55]),
          K(1.95, [-0.04, 0.03, 0.03], [0.2, 0.2, -0.6]), K(2.35, [-0.04, 0.04, -0.02], [0.15, 0.2, -0.65]), K(2.55, [-0.04, 0.03, -0.02], [0.11, 0.2, -0.67]), K(3)],
        chargeur: [K(0), K(1.45), K(1.6, [0, -0.04, 0.006]), K(1.85, [0, -0.04, 0.006], O, { arret: 1 }), K(1.93, [0, 0.003, 0]), K(2.0)],
        mainG: [K(0), K(1.15, [0, -0.02, 0.05]), K(1.42, ch()), K(1.6, ch([0, -0.04, 0.006])), K(1.85, ch([0, -0.04, 0.006]), O, { arret: 1 }), K(1.93, ch()),
          K(2.2, g.G(plus(levier, [-0.02, 0.01, 0]))), K(2.45, g.G(plus(levier, [-0.02, 0.01, 0])), O, { arret: 1 }), K(2.55, g.G(levier)), K(2.7, g.G(plus(levier, [-0.03, -0.02, 0]))), K(3)],
      },
      sons: [[1.6, 'chargeur_retire'], [1.93, 'chargeur_insere'], [2.55, 'clic']],
    };
  },
  // Fusil à rafale (bullpup) : un tour complet sur lui-même, puis une tape sur le chargeur à l'arrière
  rafale(g) {
    const ch = (d = O) => g.G(g.sur('chargeur', d));
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.5, [-0.06, 0.06, 0.05], [0.25, 0.55, 0.4]), K(1.0, [-0.065, 0.065, 0.05], [0.28, 0.6, 0.5]), K(1.55, [-0.05, 0.08, -0.07], [0.18, 0.3, 3.0]),
          K(2.0, [-0.05, 0.08, -0.07], [0.15, 0.28, 3.25]), K(2.5, [-0.02, 0.02, -0.02], [0.05, 0.1, 6.0]), K(3, O, [0, 0, TOUR])],
        mainG: [K(0), K(0.5), K(0.8, [0, -0.1, 0.05], O, { libre: 1 }), K(2.15, [0, -0.1, 0.05], O, { libre: 1 }), K(2.45, ch([0, -0.04, 0])), K(2.55, ch()), K(2.7, ch([0, -0.03, 0])), K(3)],
        chargeur: [K(0), K(2.52), K(2.56, [0, 0.004, 0]), K(2.64)],
      },
      sons: [[1.3, 'couteau_coup'], [2.55, 'chargeur_insere']],
    };
  },
  // Mitraillette : on sort le chargeur et on le regarde de près, puis on le remet d'une tape
  smg(g) {
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.05, 0]));
    const vu = [-0.1, 0.0, -0.02];
    const P = poseRecharge([-0.07, 0.08, -0.05], [0.25, 0.4, -0.45]);
    return {
      duree: 2.8,
      pistes: {
        arme: [K(0), K(0.4, ...P()), K(0.9, ...P([0, 0, 0], [0.02, 0.05, 0.05])), K(1.7, ...P([0, 0, 0], [0.02, 0.05, 0.05]), { arret: 1 }),
          K(2.0, ...P()), K(2.05, ...P([0, 0.012, 0.004], [0.07, 0, 0.02])), K(2.35, [-0.02, 0.01, -0.01], [0.05, 0.05, -0.05]), K(2.8)],
        chargeur: [K(0), K(0.55), K(0.75, [0, -0.2, 0.02]), K(1.05, vu, [0.4, 0, -0.9]), K(1.6, plus(vu, [0, 0.01, 0.01]), [0.5, 0.1, -1.0], { arret: 1 }),
          K(1.85, [0, -0.2, 0.02]), K(2.02, [0, -0.01, 0]), K(2.05), K(2.8)],
        mainG: [K(0), K(0.45, ch()), K(0.55, ch(), O, { arret: 1 }), K(0.75, ch([0, -0.2, 0.02])), K(1.05, ch(vu)), K(1.6, ch(plus(vu, [0, 0.01, 0.01]))),
          K(1.85, ch([0, -0.2, 0.02])), K(2.02, ch([0, -0.03, 0])), K(2.05, ch([0, -0.005, 0])), K(2.35), K(2.8)],
      },
      sons: [[0.75, 'chargeur_retire'], [2.05, 'chargeur_insere']],
    };
  },
  // Mitrailleuse : on tapote la boîte de munitions, puis on soulève l'arme (elle est lourde)
  mitrailleuse(g) {
    const boite = plus(g.sur('chargeur', O, [-0.06, -0.03, 0]), [0, 0, 0]);
    const haut = plus(boite, [0, 0.035, 0]);
    return {
      duree: 3.2,
      pistes: {
        arme: [K(0), K(0.6, [-0.08, 0.09, -0.06], [0.3, 0.45, -0.5]), K(1.0, [-0.08, 0.09, -0.06], [0.31, 0.47, -0.52], { arret: 1 }), K(1.15, [-0.08, 0.082, -0.06], [0.28, 0.47, -0.55]),
          K(1.3, [-0.08, 0.09, -0.06], [0.31, 0.47, -0.52]), K(1.45, [-0.08, 0.082, -0.06], [0.28, 0.47, -0.55]), K(1.65, [-0.08, 0.09, -0.06], [0.31, 0.47, -0.52]),
          K(2.3, [-0.04, 0.06, 0.03], [0.45, 0.35, 0.15]), K(2.6, [-0.04, 0.062, 0.03], [0.47, 0.37, 0.12], { arret: 1 }), K(3.2)],
        chargeur: [K(0), K(1.1), K(1.15, [0, -0.008, 0]), K(1.25), K(1.4), K(1.45, [0, -0.008, 0]), K(1.55)],
        mainG: [K(0), K(0.6), K(0.95, g.G(haut)), K(1.15, g.G(boite)), K(1.3, g.G(haut)), K(1.45, g.G(boite)), K(1.65, g.G(haut)), K(2.0), K(3.2)],
      },
      sons: [[1.15, 'clic'], [1.45, 'clic']],
    };
  },
  // Fusil à pompe : on entrouvre la pompe pour voir la cartouche, on tapote les cartouches de réserve, on arme
  pompe(g) {
    const etui = [-0.045, 0.012, -0.02];
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.45, [-0.06, 0.05, -0.02], [0.15, 0.7, 0.3]), K(0.9, [-0.06, 0.055, -0.02], [0.15, 0.72, 0.6]), K(1.25, [-0.06, 0.055, -0.02], [0.16, 0.72, 0.62], { arret: 1 }),
          K(1.45, [-0.06, 0.05, -0.02], [0.15, 0.6, 0.3]), K(1.8, [-0.05, 0.06, -0.04], [0.2, 0.2, -0.75]), K(2.25, [-0.05, 0.06, -0.04], [0.22, 0.18, -0.78], { arret: 1 }),
          K(2.45, [-0.03, 0.03, -0.02], [0.1, 0.1, -0.2]), K(2.55, [-0.03, 0.03, -0.01], [0.16, 0.1, -0.15]), K(2.65, [-0.03, 0.03, -0.02], [0.1, 0.1, -0.15]), K(3)],
        pompe: [K(0), K(0.55), K(0.8, [0, 0, 0.05]), K(1.3, [0, 0, 0.05], O, { arret: 1 }), K(1.42), K(2.4), K(2.5, [0, 0, 0.09]), K(2.62), K(3)],
        mainG: [K(0), K(0.55), K(0.8, [0, 0, 0.05]), K(1.3, [0, 0, 0.05], O, { arret: 1 }), K(1.42), K(1.75, g.G(plus(etui, [-0.02, 0.01, 0]))), K(1.9, g.G(etui)),
          K(2.0, g.G(plus(etui, [-0.015, 0.005, 0.01]))), K(2.1, g.G(plus(etui, [0, 0, 0.02]))), K(2.35), K(2.5, [0, 0, 0.09]), K(2.62), K(3)],
      },
      sons: [[0.8, 'clic'], [1.42, 'clic'], [1.9, 'douille'], [2.1, 'douille'], [2.5, 'pompe_armement']],
    };
  },
  // Fusil de précision : on essuie la lentille de la lunette, puis on vérifie le chargeur
  precision(g) {
    const ch = (d = O) => g.G(g.sur('chargeur', d));
    const L = (x, y) => g.G([x, y, -0.19]);
    return {
      duree: 3.2,
      pistes: {
        arme: [K(0), K(0.5, [-0.06, 0.07, 0.06], [0.05, 0.55, 0.15]), K(1.8, [-0.06, 0.075, 0.06], [0.06, 0.6, 0.12]), K(2.2, [-0.04, 0.02, 0.03], [0.2, 0.15, -0.5]),
          K(2.6, [-0.04, 0.02, 0.03], [0.22, 0.12, -0.52], { arret: 1 }), K(3.2)],
        mainG: [K(0), K(0.6, L(-0.03, 0.115)), K(0.8, L(0.03, 0.115)), K(1.0, L(-0.03, 0.105)), K(1.2, L(0.03, 0.11)), K(1.4, L(-0.02, 0.112)), K(1.7),
          K(2.15, ch()), K(2.3, ch([0, -0.03, 0.004])), K(2.5, ch([0, -0.03, 0.004]), O, { arret: 1 }), K(2.58, ch()), K(2.9), K(3.2)],
        chargeur: [K(0), K(2.2), K(2.3, [0, -0.03, 0.004]), K(2.5, [0, -0.03, 0.004], O, { arret: 1 }), K(2.58), K(3.2)],
      },
      sons: [[2.3, 'chargeur_retire'], [2.58, 'chargeur_insere']],
    };
  },
  // Sniper : la main droite ouvre la culasse pour regarder dedans, la referme, puis on regarde la lunette
  sniper(g) {
    const ferme = [0.07, 0.035, 0.08]; const leve = [0.04, 0.084, 0.08]; const tire = [0.04, 0.084, 0.15];
    return {
      duree: 3.4,
      pistes: {
        arme: [K(0), K(0.5, [-0.05, 0.05, -0.1], [0.12, 0.35, 0.4]), K(1.9, [-0.05, 0.055, -0.1], [0.14, 0.38, 0.45]), K(2.4, [-0.04, 0.07, -0.02], [0.02, 0.7, 0]),
          K(2.9, [-0.04, 0.07, -0.02], [0.03, 0.72, -0.02], { arret: 1 }), K(3.4)],
        culasse: [K(0), K(0.7), K(0.85, O, [0, 0, 1.1]), K(1.0, [0, 0, 0.07], [0, 0, 1.1]), K(1.5, [0, 0, 0.07], [0, 0, 1.1], { arret: 1 }), K(1.65, O, [0, 0, 1.1]), K(1.8), K(3.4)],
        mainD: [K(0), K(0.5), K(0.7, g.D(ferme)), K(0.85, g.D(leve)), K(1.0, g.D(tire)), K(1.5, g.D(tire), O, { arret: 1 }), K(1.65, g.D(leve)), K(1.8, g.D(ferme)), K(2.1), K(3.4)],
      },
      sons: [[0.85, 'sniper_culasse'], [1.65, 'clic']],
    };
  },
  // Arbalète : on pince la corde (elle vibre), puis on touche la pointe du carreau
  arbalete(g) {
    const pointe = plus(g.repos('munition'), [0, 0.02, -0.4]);
    return {
      duree: 2.8,
      pistes: {
        arme: [K(0), K(0.5, [-0.05, 0.06, -0.07], [0.35, 0.4, 0.25]), K(1.6, [-0.05, 0.065, -0.07], [0.38, 0.42, 0.22]), K(2.2, [-0.03, 0.03, -0.02], [0.15, 0.2, 0]), K(2.8)],
        corde: [K(0, [1, 0, 0]), K(0.85, [1, 0, 0]), K(0.95, [0.86, 0, 0]), K(1.0, [1.03, 0, 0]), K(1.05, [0.95, 0, 0]), K(1.1, [1.02, 0, 0]), K(1.15, [0.98, 0, 0]), K(1.2, [1, 0, 0]), K(2.8, [1, 0, 0])],
        mainG: [K(0), K(0.55), K(0.85, g.G([-0.13, 0.045, -0.185])), K(0.95, g.G([-0.13, 0.02, -0.175])), K(1.05, g.G([-0.15, 0.06, -0.2])), K(1.3, g.G(plus(pointe, [0, 0.02, 0.02]))),
          K(1.5, g.G(pointe)), K(1.7, g.G(plus(pointe, [0, 0.03, 0.02]))), K(2.2), K(2.8)],
        munition: [K(0), K(1.45), K(1.5, [0, 0, -0.004]), K(1.6), K(2.8)],
      },
      sons: [[0.95, 'grappin_corde'], [1.5, 'clic']],
    };
  },
  // Lance-roquettes : sur l'épaule, puis on penche le tube pour tapoter la roquette
  roquette(g) {
    const bout = [0, 0.055, -0.55];
    return {
      duree: 3.2,
      pistes: {
        arme: [K(0), K(0.6, [0.02, 0.06, 0.05], [0.1, -0.1, -0.25]), K(1.1, [0.02, 0.065, 0.05], [0.12, -0.1, -0.25], { arret: 1 }), K(1.6, [-0.05, 0, 0], [-0.35, 0.45, 0.2]),
          K(2.4, [-0.05, 0, 0], [-0.37, 0.47, 0.18], { arret: 1 }), K(3.2)],
        mainG: [K(0), K(1.6), K(1.9, g.G(plus(bout, [0, 0.03, 0]))), K(2.0, g.G(bout)), K(2.1, g.G(plus(bout, [0, 0.03, 0]))), K(2.2, g.G(bout)), K(2.5), K(3.2)],
        munition: [K(0), K(1.95), K(2.0, [0, -0.004, 0]), K(2.05), K(2.15), K(2.2, [0, -0.004, 0]), K(2.25), K(3.2)],
      },
      sons: [[2.0, 'clic'], [2.2, 'clic']],
    };
  },
  // Revolver : on ouvre le barillet, on le fait tourner (clic clic clic), on le referme d'un coup de poignet,
  // puis on souffle sur le canon
  revolver(g) {
    const cote = (y) => g.G([-0.05, y, -0.03]);
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.4, [-0.06, 0.06, -0.07], [0.1, 0.3, 0.6]), K(0.55, [-0.06, 0.06, -0.07], [0.1, 0.3, 0.65]), K(1.6, [-0.065, 0.065, -0.07], [0.12, 0.35, 0.7]),
          K(1.75, [-0.04, 0.04, -0.05], [0.1, 0.2, -0.3]), K(1.85, [-0.04, 0.04, -0.05], [0.08, 0.2, -0.15]), K(2.3, [-0.08, 0.06, -0.04], [0.7, 0.4, 0]),
          K(2.6, [-0.08, 0.06, -0.04], [0.75, 0.4, 0], { arret: 1 }), K(3)],
        barillet: [K(0), K(0.45), K(0.6, O, [0, 0, 1.25]), K(0.8, O, [0, 0, 1.25]), K(0.9, O, [0, 0, 1.15]), K(1.0, O, [0, 0, 1.3]), K(1.1, O, [0, 0, 1.2]),
          K(1.2, O, [0, 0, 1.28]), K(1.6, O, [0, 0, 1.25], { arret: 1 }), K(1.75), K(3)],
        mainG: [K(0), K(0.45, cote(0.02)), K(0.85, cote(0.035)), K(0.95, cote(0.01)), K(1.05, cote(0.035)), K(1.15, cote(0.01)), K(1.4), K(3)],
      },
      sons: [[0.6, 'revolver_recharge'], [0.9, 'clic'], [1.0, 'clic'], [1.1, 'clic'], [1.2, 'clic'], [1.75, 'chargeur_insere']],
    };
  },
  // Pistolet : on tire un peu la glissière pour voir la balle, puis on le fait tourner autour du doigt
  pistolet(g) {
    const arriere = [-0.012, 0.05, -0.1];
    return {
      duree: 2.6,
      pistes: {
        arme: [K(0), K(0.35, [-0.05, 0.05, -0.04], [0.1, 0.3, 0.55]), K(0.95, [-0.055, 0.055, -0.04], [0.12, 0.35, 0.6], { arret: 1 }), K(1.2, [-0.02, 0, 0], [0, 0.05, 0]),
          K(1.35, [0, 0, -0.02]), K(1.6, [0, -0.02, -0.03], [-Math.PI, 0, 0]), K(1.85, [0, 0, -0.02], [-TOUR, 0, 0]), K(2.0, [0, -0.01, 0], [-TOUR - 0.07, 0, 0]), K(2.6, O, [-TOUR, 0, 0])],
        culasse: [K(0), K(0.45), K(0.55, [0, 0, 0.015]), K(0.85, [0, 0, 0.015], O, { arret: 1 }), K(0.92), K(2.6)],
        mainG: [K(0), K(0.35, g.G(arriere)), K(0.45, g.G(arriere)), K(0.55, g.G(plus(arriere, [0, 0, 0.015]))), K(0.85, g.G(plus(arriere, [0, 0, 0.015]))), K(0.92, g.G(arriere)),
          K(1.15, [0, -0.08, 0.03], O, { libre: 1 }), K(2.0, [0, -0.08, 0.03], O, { libre: 1 }), K(2.3), K(2.6)],
      },
      sons: [[0.55, 'clic'], [0.92, 'clic'], [1.45, 'couteau_coup']],
    };
  },
  // Mini-mitraillette : tenue à plat « comme dans les films », puis on arme le levier du dessus
  uzi(g) {
    const levier = [0, 0.07, -0.08];
    return {
      duree: 2.8,
      pistes: {
        arme: [K(0), K(0.4, [-0.05, 0.03, 0.03], [0.05, 0.15, -1.45]), K(1.0, [-0.055, 0.035, 0.03], [0.08, 0.2, -1.5], { arret: 1 }), K(1.3, [-0.04, 0.05, -0.07], [0.2, 0.15, 0.1]),
          K(1.5, [-0.04, 0.05, -0.07], [0.2, 0.15, 0.15]), K(1.6, [-0.04, 0.05, -0.055], [0.27, 0.15, 0.15]), K(1.9, [-0.05, 0.06, -0.05], [0.15, 0.35, 0.5]),
          K(2.3, [-0.05, 0.06, -0.05], [0.17, 0.37, 0.5], { arret: 1 }), K(2.8)],
        mainG: [K(0), K(0.3, [0, -0.1, 0.04], O, { libre: 1 }), K(1.0, [0, -0.1, 0.04], O, { libre: 1 }), K(1.3, g.G(levier)), K(1.4, g.G(levier), O, { arret: 1 }),
          K(1.6, g.G(plus(levier, [0, 0, 0.05]))), K(1.7, g.G(plus(levier, [0, 0.02, 0.05]))), K(2.0), K(2.8)],
      },
      sons: [[1.6, 'clic']],
    };
  },
  // Canon scié : on casse l'arme pour regarder dans les canons, puis on la referme d'un coup sec vers le haut
  canon_scie() {
    return {
      duree: 2.8,
      pistes: {
        arme: [K(0), K(0.35, [-0.03, 0.02, 0.03], [0.1, 0.2, 0.3]), K(0.45, [-0.03, 0, 0.03], [-0.1, 0.2, 0.3]), K(0.9, [-0.05, 0.08, 0.1], [0.75, 0.15, 0.1]),
          K(1.6, [-0.05, 0.085, 0.1], [0.78, 0.15, 0.08], { arret: 1 }), K(1.9, [-0.02, 0, 0.02], [-0.2, 0.1, 0]), K(2.0, [-0.02, 0.01, 0.02], [0.35, 0.1, 0]),
          K(2.2, [-0.01, 0, 0.01], [0.05, 0.05, 0]), K(2.8)],
        canons: [K(0), K(0.38), K(0.48, O, [-0.7, 0, 0]), K(1.95, O, [-0.7, 0, 0], { arret: 1 }), K(2.02), K(2.8)],
        mainG: [K(0), K(0.35, [0, -0.06, 0.05], O, { libre: 1 }), K(1.9, [0, -0.06, 0.05], O, { libre: 1 }), K(2.2), K(2.8)],
      },
      sons: [[0.48, 'chargeur_retire'], [2.02, 'chargeur_insere']],
    };
  },
  // Lance-fusée : deux tours en arrière autour du doigt, façon cow-boy, puis une tape sur le canon
  lance_fusee(g) {
    const canon = [0, 0.05, -0.12];
    const D = 4 * Math.PI;
    return {
      duree: 2.6,
      pistes: {
        arme: [K(0), K(0.25, [0, 0.01, -0.02], [0.15, 0, 0]), K(0.55, [0, 0, -0.03], [3.3, 0, 0]), K(0.85, [0, 0, -0.03], [6.6, 0, 0]), K(1.1, [0, 0, -0.02], [9.42, 0, 0]),
          K(1.35, [0, -0.01, 0], [12.4, 0, 0]), K(1.5, O, [D, 0, 0]), K(1.9, [-0.04, 0.03, 0.04], [D + 0.1, 0.3, 0.5]), K(2.2, [-0.04, 0.03, 0.04], [D + 0.1, 0.3, 0.5], { arret: 1 }),
          K(2.6, O, [D, 0, 0])],
        mainG: [K(0), K(0.2, [0, -0.08, 0.03], O, { libre: 1 }), K(1.6, [0, -0.08, 0.03], O, { libre: 1 }), K(1.95, g.G(canon)), K(2.05, g.G(plus(canon, [0, 0.02, 0]))),
          K(2.15, g.G(canon)), K(2.4), K(2.6)],
      },
      sons: [[0.4, 'couteau_coup'], [1.0, 'couteau_coup'], [2.05, 'clic']],
    };
  },
  // Couteau : lancé en l'air en tournant, rattrapé, puis on regarde les deux côtés de la lame
  couteau() {
    const T = -4 * Math.PI;
    return {
      duree: 2.6,
      pistes: {
        arme: [K(0), K(0.25, [0, -0.02, 0], [-0.1, 0, 0]), K(0.4, [0, 0.08, -0.02], [-2.5, 0, 0]), K(0.55, [0, 0.14, -0.03], [-6.3, 0, 0]), K(0.7, [0, 0.08, -0.02], [-10, 0, 0]),
          K(0.85, O, [T, 0, 0]), K(0.95, [0, -0.015, 0], [T, 0, 0]), K(1.4, [-0.06, 0.04, 0.03], [T + 0.1, 0.9, 0.4]), K(1.8, [-0.06, 0.04, 0.03], [T + 0.1, -0.4, -0.5]),
          K(2.1, [-0.06, 0.04, 0.03], [T + 0.1, -0.45, -0.55], { arret: 1 }), K(2.6, O, [T, 0, 0])],
        mainD: [K(0), K(0.33), K(0.36, O, O, { libre: 1 }), K(0.8, O, O, { libre: 1 }), K(0.85), K(2.6)],
      },
      sons: [[0.38, 'couteau_coup'], [0.85, 'clic']],
    };
  },
  // Batte : pointée vers l'horizon (« je vais l'envoyer là-bas »), un swing d'essai, puis deux tapes dans la main
  batte() {
    const paume = [-0.06, 0.02, -0.12];
    return {
      duree: 3.2,
      pistes: {
        arme: [K(0), K(0.5, [-0.2, 0.17, -0.02], [-0.55, -0.45, 0.4]), K(1.2, [-0.2, 0.175, -0.02], [-0.58, -0.47, 0.42], { arret: 1 }), K(1.45, [0.04, 0.05, 0.02], [0.2, -0.3, -0.1]),
          K(1.75, [-0.15, 0.0, -0.05], [-0.7, 0.9, 0.4]), K(1.95, [-0.05, 0.03, 0], [-0.5, 0.5, 0.6]), K(2.1, [-0.05, 0.06, 0], [-0.2, 0.5, 0.6]),
          K(2.25, [-0.05, 0.01, 0], [-0.6, 0.5, 0.6]), K(2.4, [-0.05, 0.06, 0], [-0.2, 0.5, 0.6]), K(2.55, [-0.05, 0.01, 0], [-0.6, 0.5, 0.6]), K(2.8, [-0.02, 0, 0], [-0.2, 0.2, 0.2]), K(3.2)],
        mainG: [K(0), K(1.4), K(1.9, paume, O, { libre: 1 }), K(2.65, paume, O, { libre: 1 }), K(2.95), K(3.2)],
      },
      sons: [[1.7, 'batte_coup'], [2.25, 'clic'], [2.55, 'clic']],
    };
  },
  // Poêle : on fait sauter une crêpe imaginaire, puis on regarde le dessous et on toque dessus
  poele() {
    const fond = [0.09, -0.06, -0.26];
    const toc = [0.09, -0.03, -0.26];
    return {
      duree: 2.8,
      pistes: {
        arme: [K(0), K(0.3, [0, -0.03, 0], [-0.15, 0, 0]), K(0.42, [0, 0.05, -0.02], [0.25, 0, 0]), K(0.6, [0, -0.02, 0], [-0.1, 0, 0]), K(0.75),
          K(1.3, [-0.06, 0.06, 0.05], [-1.2, 0.2, 0.3]), K(1.7, [-0.06, 0.065, 0.05], [-1.25, 0.2, 0.3], { arret: 1 }), K(1.85, [-0.06, 0.06, 0.05], [-1.2, 0.2, 0.3]), K(2.3), K(2.8)],
        mainG: [K(0, O, O, { cache: 1 }), K(1.2, [0, -0.25, 0], O, { libre: 1 }), K(1.55, fond), K(1.62, toc), K(1.7, fond), K(1.77, toc), K(1.9, fond),
          K(2.2, [0, -0.25, 0], O, { libre: 1 }), K(2.25, [0, -0.25, 0], O, { libre: 1, cache: 1 }), K(2.8, O, O, { cache: 1 })],
      },
      sons: [[0.42, 'couteau_coup'], [1.62, 'poele_touche'], [1.77, 'poele_touche']],
    };
  },
  // Grenade : lancée en l'air en tournant, rattrapée, regardée, puis relancée en vrille
  grenade() { return lancerEnLAir(); },
  // Fumigène : on le secoue comme une bombe de peinture, puis on lit l'étiquette
  fumigene() {
    const s = [0.2, 0, 0];
    return {
      duree: 2.4,
      pistes: {
        arme: [K(0), K(0.2, [0, 0.03, 0.02], s), K(0.3, [0, 0.06, 0.02], s), K(0.4, [0, 0, 0.02], s), K(0.5, [0, 0.06, 0.02], s), K(0.6, [0, 0, 0.02], s), K(0.7, [0, 0.06, 0.02], s),
          K(0.8, [0, 0.01, 0.02], s), K(1.2, [-0.05, 0.05, 0.05], [0.1, 1.3, 0.1]), K(1.7, [-0.05, 0.05, 0.05], [0.1, -0.4, 0.1]), K(1.9, [-0.05, 0.05, 0.05], [0.1, -0.42, 0.1], { arret: 1 }), K(2.4)],
      },
      sons: [[0.3, 'douille'], [0.5, 'douille'], [0.7, 'douille']],
    };
  },
  // Grappin : on sort un peu le crochet et on le fait tourner pour vérifier ses dents
  grappin(g) {
    const crochet = plus(g.repos('crochet'), [0, 0.015, -0.03]);
    const sorti = plus(crochet, [0, 0, -0.06]);
    return {
      duree: 2.6,
      pistes: {
        arme: [K(0), K(0.4, [-0.04, 0.04, 0.04], [0.2, 0.4, 0.3]), K(1.8, [-0.04, 0.045, 0.04], [0.22, 0.42, 0.3]), K(2.2), K(2.6)],
        crochet: [K(0), K(0.5), K(0.7, [0, 0, -0.06]), K(1.4, [0, 0, -0.06], [0, 0, TOUR]), K(1.6, [0, 0, -0.06], [0, 0, TOUR], { arret: 1 }), K(1.75, O, [0, 0, TOUR]), K(2.6, O, [0, 0, TOUR])],
        mainG: [K(0), K(0.45, g.G(crochet)), K(0.5, g.G(crochet), O, { arret: 1 }), K(0.7, g.G(sorti)), K(1.6, g.G(sorti), O, { arret: 1 }), K(1.75, g.G(crochet)), K(2.1), K(2.6)],
      },
      sons: [[0.7, 'grappin_corde'], [1.75, 'clic']],
    };
  },
  // Kit de soin : on le fait tourner entre les doigts, puis on le secoue (ça fait du bruit dedans)
  kit_soin() {
    const p = [-0.05, 0.05, 0.04]; const r = [0.25, 0, 0];
    return {
      duree: 2.4,
      pistes: {
        arme: [K(0), K(0.4, p, r), K(1.5, p, r, { arret: 1 }), K(1.6, plus(p, [0, 0.02, 0]), r), K(1.7, plus(p, [0, -0.015, 0]), r), K(1.8, plus(p, [0, 0.02, 0]), r),
          K(1.9, plus(p, [0, -0.01, 0]), r), K(2.0, p, r), K(2.4)],
        objet: [K(0), K(0.5), K(1.0, O, [0, Math.PI, 0]), K(1.5, O, [0, TOUR, 0]), K(2.4, O, [0, TOUR, 0])],
      },
      sons: [[1.6, 'douille'], [1.8, 'douille']],
    };
  },
  // Laser d'admin : on le tourne vers soi pendant que le cœur d'énergie pulse (voir aussi arme.js)
  laser() {
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.5, [-0.06, 0.05, 0.05], [0.15, 0.8, 0.3]), K(1.2, [-0.065, 0.06, 0.05], [0.2, 0.85, -0.2]), K(1.5, [-0.03, 0.03, 0.03], [0.1, 0.1, 1.2]),
          K(1.9, [-0.03, 0.03, 0.03], [0.1, 0.1, TOUR * 0.5 + 1.2]), K(2.3, [-0.02, 0.02, 0.02], [0.05, 0.05, TOUR - 0.1]), K(3, O, [0, 0, TOUR])],
        mainG: [K(0), K(0.4), K(0.7, [0, -0.1, 0.05], O, { libre: 1 }), K(2.3, [0, -0.1, 0.05], O, { libre: 1 }), K(2.7), K(3)],
      },
      sons: [[0.5, 'apparition'], [1.6, 'couteau_coup']],
    };
  },
  // ----- Nouvelles armes -----
  // Pompe automatique : on regarde le côté, on vérifie le gros chargeur, puis deux tapes sur le protège-main
  pompe_auto(g) {
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.08, 0]));
    const garde = [0, 0.05, -0.36];
    return {
      duree: 3.1,
      pistes: {
        arme: [K(0), K(0.45, [-0.07, 0.05, 0.03], [0.1, 0.7, 0.35]), K(1.0, [-0.072, 0.055, 0.03], [0.12, 0.78, 0.3]), K(1.35, [-0.05, 0.04, 0.02], [0.2, 0.25, -0.6]),
          K(1.9, [-0.05, 0.04, 0.02], [0.22, 0.22, -0.62], { arret: 1 }), K(2.3, [-0.04, 0.06, -0.04], [0.35, 0.1, -0.1]), K(2.7, [-0.04, 0.06, -0.04], [0.36, 0.1, -0.1], { arret: 1 }), K(3.1)],
        chargeur: [K(0), K(1.45), K(1.6, [0, -0.035, 0.004]), K(1.85, [0, -0.035, 0.004], O, { arret: 1 }), K(1.92, [0, 0.003, 0]), K(2.0)],
        mainG: [K(0), K(1.2, [0, -0.02, 0.05]), K(1.42, ch()), K(1.6, ch([0, -0.035, 0.004])), K(1.85, ch([0, -0.035, 0.004]), O, { arret: 1 }), K(1.92, ch()),
          K(2.3, g.G(plus(garde, [0, 0.03, 0]))), K(2.4, g.G(garde)), K(2.5, g.G(plus(garde, [0, 0.03, 0.01]))), K(2.6, g.G(garde)), K(2.85), K(3.1)],
      },
      sons: [[1.6, 'chargeur_retire'], [1.92, 'chargeur_insere'], [2.4, 'clic'], [2.6, 'clic']],
    };
  },
  // Double canon : on casse l'arme, on sort une cartouche pour la regarder et on la remet, on referme d'un coup
  double_canon(g) {
    return {
      duree: 3.2,
      pistes: {
        arme: [K(0), K(0.35, [-0.03, 0.02, -0.02], [0.1, 0.2, 0.3]), K(0.45, [-0.03, 0, -0.02], [-0.1, 0.2, 0.3]), K(0.95, [-0.05, 0.05, -0.05], [0.42, 0.25, 0.2]),
          K(2.0, [-0.05, 0.055, -0.05], [0.44, 0.25, 0.18], { arret: 1 }), K(2.3, [-0.02, 0, 0.0], [-0.2, 0.1, 0]), K(2.4, [-0.02, 0.01, 0.0], [0.35, 0.1, 0]),
          K(2.6, [-0.01, 0, 0.01], [0.05, 0.05, 0]), K(3.2)],
        canons: [K(0), K(0.38), K(0.48, O, [-0.7, 0, 0]), K(2.35, O, [-0.7, 0, 0], { arret: 1 }), K(2.42), K(3.2)],
        munitionCanon: [K(0), K(1.1), K(1.3, [0, 0.03, 0.05]), K(1.6, [0, 0.03, 0.05], O, { arret: 1 }), K(1.75), K(3.2)],
        mainG: [K(0), K(0.35, [0, -0.08, 0.05], O, { libre: 1 }), K(1.0, [0, -0.08, 0.05], O, { libre: 1 }), K(1.2, g.G([-0.02, 0.04, -0.09])), K(1.3, g.G([-0.02, 0.07, -0.06])),
          K(1.6, g.G([-0.02, 0.07, -0.06]), O, { arret: 1 }), K(1.75, g.G([-0.02, 0.04, -0.09])), K(1.95, [0, -0.08, 0.05], O, { libre: 1 }), K(2.3, [0, -0.08, 0.05], O, { libre: 1 }), K(2.6), K(3.2)],
      },
      sons: [[0.48, 'chargeur_retire'], [1.3, 'douille'], [1.75, 'cartouche_insere'], [2.42, 'chargeur_insere']],
    };
  },
  // Mitraillette rapide : deux tapes sur le bloc incliné, l'arme bascule à plat d'un coup de poignet, tape sur le chargeur
  vector(g) {
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.08, 0]));
    const bloc = [-0.03, -0.04, -0.11];
    return {
      duree: 2.9,
      pistes: {
        arme: [K(0), K(0.4, [-0.06, 0.05, 0.03], [0.15, 0.6, 0.4]), K(0.9, [-0.06, 0.055, 0.03], [0.18, 0.65, 0.35]), K(1.15, [-0.03, 0.04, 0], [0.1, 0.3, -0.2]),
          K(1.45, [-0.03, 0.04, 0], [0.1, 0.3, -2.0]), K(1.75, [-0.03, 0.04, 0], [0.1, 0.3, -2.05], { arret: 1 }), K(2.05, [-0.03, 0.04, 0], [0.12, 0.25, -0.3]),
          K(2.45, [-0.02, 0.02, 0], [0.05, 0.1, -0.4]), K(2.9)],
        chargeur: [K(0), K(2.1), K(2.18, [0, 0.004, 0]), K(2.26)],
        mainG: [K(0), K(0.55, g.G(plus(bloc, [-0.02, 0, 0]))), K(0.65, g.G(bloc)), K(0.75, g.G(plus(bloc, [-0.02, 0, 0]))), K(0.85, g.G(bloc)), K(1.05),
          K(1.2, [0, -0.08, 0.04], O, { libre: 1 }), K(1.95, [0, -0.08, 0.04], O, { libre: 1 }), K(2.12, ch([0, -0.03, 0])), K(2.18, ch()), K(2.4), K(2.9)],
      },
      sons: [[0.65, 'clic'], [0.85, 'clic'], [1.4, 'couteau_coup'], [2.18, 'chargeur_insere']],
    };
  },
  // Fusil bullpup : on sort le chargeur transparent et on regarde les cartouches à travers, puis un œil dans la lunette
  bullpup(g) {
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.07, 0]));
    const vu = [-0.12, 0.06, -0.15];
    const P = poseRecharge([-0.1, 0.1, -0.1], [0.3, 0.55, -0.5]);
    return {
      duree: 3.2,
      pistes: {
        arme: [K(0), K(0.4, ...P()), K(1.9, ...P([0, 0, 0], [0.02, 0.04, 0.04]), { arret: 1 }), K(2.15, ...P()), K(2.2, ...P([0, 0.012, 0.004], [0.07, 0, 0.02])),
          K(2.6, [-0.05, 0.07, -0.02], [0.04, 0.7, 0]), K(2.9, [-0.05, 0.07, -0.02], [0.05, 0.72, 0], { arret: 1 }), K(3.2)],
        chargeur: [K(0), K(0.55), K(0.75, [0, -0.2, 0.02]), K(1.05, vu, [0.3, 0.2, -1.2]), K(1.75, plus(vu, [0, 0.01, 0]), [0.35, 0.3, -1.3], { arret: 1 }),
          K(2.0, [0, -0.2, 0.02]), K(2.17, [0, -0.01, 0]), K(2.2), K(3.2)],
        mainG: [K(0), K(0.45, ch()), K(0.55, ch(), O, { arret: 1 }), K(0.75, ch([0, -0.2, 0.02])), K(1.05, ch(vu)), K(1.75, ch(plus(vu, [0, 0.01, 0]))),
          K(2.0, ch([0, -0.2, 0.02])), K(2.17, ch([0, -0.03, 0])), K(2.2, ch([0, -0.005, 0])), K(2.45), K(3.2)],
      },
      sons: [[0.75, 'chargeur_retire'], [2.2, 'chargeur_insere']],
    };
  },
  // Lance-grenades : on fait tourner le tambour à la main (clic clic clic), puis une tape sur le canon
  lance_grenades(g) {
    const tambour = plus(g.repos('barillet'), [-0.07, 0.0, 0.0]);
    const canon = [0, 0.065, -0.36];
    const t = (dy) => g.G(plus(tambour, [0, dy, 0]));
    return {
      duree: 3.2,
      pistes: {
        arme: [K(0), K(0.45, [-0.06, 0.06, 0.0], [0.15, 0.5, 0.45]), K(2.0, [-0.065, 0.065, 0.0], [0.17, 0.55, 0.5], { arret: 1 }), K(2.4, [-0.04, 0.05, -0.05], [0.3, 0.2, -0.2]),
          K(2.8, [-0.04, 0.05, -0.05], [0.32, 0.2, -0.22], { arret: 1 }), K(3.2)],
        barillet: [K(0), K(0.7), K(0.85, O, [0, 0, 1.05]), K(1.0, O, [0, 0, 2.09]), K(1.15, O, [0, 0, 3.14]), K(1.3, O, [0, 0, 4.19]), K(1.45, O, [0, 0, 5.24]),
          K(1.6, O, [0, 0, TOUR]), K(3.2, O, [0, 0, TOUR])],
        mainG: [K(0), K(0.55, t(0.03)), K(0.7, t(0)), K(0.85, t(-0.03)), K(0.9, t(0.03)), K(1.0, t(-0.03)), K(1.05, t(0.03)), K(1.15, t(-0.03)), K(1.2, t(0.03)),
          K(1.3, t(-0.03)), K(1.6, t(0)), K(1.9), K(2.45, g.G(plus(canon, [0, 0.025, 0]))), K(2.55, g.G(canon)), K(2.65, g.G(plus(canon, [0, 0.025, 0]))), K(2.95), K(3.2)],
      },
      sons: [[0.85, 'clic'], [1.0, 'clic'], [1.15, 'clic'], [1.3, 'clic'], [1.45, 'clic'], [1.6, 'clic'], [2.55, 'clic']],
    };
  },
  // Fusil à plasma : on le tourne pour admirer les bobines qui brillent, puis on vérifie la cellule d'énergie
  plasma(g) {
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.06, 0]));
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.5, [-0.06, 0.05, 0.05], [0.1, 0.85, 0.25]), K(1.3, [-0.065, 0.06, 0.05], [0.15, 0.9, -0.25]), K(1.6, [-0.04, 0.04, 0.02], [0.2, 0.25, -0.5]),
          K(2.3, [-0.04, 0.04, 0.02], [0.22, 0.22, -0.52], { arret: 1 }), K(3)],
        chargeur: [K(0), K(1.7), K(1.85, [0, -0.05, 0]), K(2.1, [0, -0.05, 0], O, { arret: 1 }), K(2.18, [0, 0.004, 0]), K(2.25)],
        mainG: [K(0), K(0.4), K(0.7, [0, -0.1, 0.05], O, { libre: 1 }), K(1.3, [0, -0.1, 0.05], O, { libre: 1 }), K(1.65, ch()), K(1.85, ch([0, -0.05, 0])),
          K(2.1, ch([0, -0.05, 0]), O, { arret: 1 }), K(2.18, ch()), K(2.5), K(3)],
      },
      sons: [[0.5, 'apparition'], [1.85, 'chargeur_retire'], [2.18, 'chargeur_insere']],
    };
  },
  // Fusil anti-matériel : on essuie la grande lentille, on vérifie le chargeur, puis un regard dans la lunette
  anti_materiel(g) {
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.06, 0]));
    const L = (x, y) => g.G([x, y, -0.31]);
    return {
      duree: 3.6,
      pistes: {
        arme: [K(0), K(0.55, [-0.05, 0.05, 0.0], [0.06, 0.5, 0.15]), K(1.6, [-0.055, 0.055, 0.0], [0.08, 0.55, 0.12]), K(2.0, [-0.04, 0.03, 0.04], [0.2, 0.15, -0.5]),
          K(2.5, [-0.04, 0.03, 0.04], [0.22, 0.12, -0.52], { arret: 1 }), K(2.9, [-0.03, 0.06, 0], [0.02, 0.6, 0]), K(3.2, [-0.03, 0.06, 0], [0.03, 0.62, 0], { arret: 1 }), K(3.6)],
        chargeur: [K(0), K(2.05), K(2.15, [0, -0.03, 0.004]), K(2.4, [0, -0.03, 0.004], O, { arret: 1 }), K(2.48), K(3.6)],
        mainG: [K(0), K(0.6, L(-0.03, 0.155)), K(0.8, L(0.03, 0.155)), K(1.0, L(-0.03, 0.148)), K(1.2, L(0.03, 0.15)), K(1.4, L(0, 0.152)), K(1.65),
          K(2.0, ch()), K(2.15, ch([0, -0.03, 0.004])), K(2.4, ch([0, -0.03, 0.004]), O, { arret: 1 }), K(2.48, ch()), K(2.75), K(3.6)],
      },
      sons: [[2.15, 'chargeur_retire'], [2.48, 'chargeur_insere']],
    };
  },
  // Cloueuse : deux « tchak » à vide en appuyant le nez devant soi, on la retourne pour regarder dessous, tape sur la bande de clous
  cloueuse(g) {
    const bande = (d = O) => g.G(g.sur('chargeur', d, [0, -0.02, 0.12]));
    return {
      duree: 2.8,
      pistes: {
        arme: [K(0), K(0.35, [-0.03, 0.03, -0.04], [-0.25, 0.1, 0]), K(0.5, [-0.03, 0.03, -0.07], [-0.25, 0.1, 0]), K(0.6, [-0.03, 0.03, -0.04], [-0.25, 0.1, 0]),
          K(0.75, [-0.03, 0.03, -0.07], [-0.25, 0.1, 0]), K(0.9, [-0.03, 0.03, -0.04], [-0.2, 0.1, 0]), K(1.4, [-0.05, 0.04, -0.05], [0.2, 0.4, 2.6]),
          K(1.9, [-0.05, 0.04, -0.05], [0.2, 0.42, 2.65], { arret: 1 }), K(2.3, [-0.03, 0.03, 0.0], [0.1, 0.2, 0.2]), K(2.8)],
        chargeur: [K(0), K(1.95), K(2.05, [0, 0, 0.03]), K(2.15), K(2.8)],
        mainG: [K(0), K(1.0), K(1.2, [0, -0.13, 0.04], O, { libre: 1 }), K(1.85, [0, -0.13, 0.04], O, { libre: 1 }), K(2.0, bande()), K(2.05, bande([0, 0, 0.03])), K(2.15, bande()),
          K(2.45), K(2.8)],
      },
      sons: [[0.5, 'clic'], [0.75, 'clic'], [2.05, 'chargeur_retire'], [2.15, 'chargeur_insere']],
    };
  },
  // Pistolet lourd : on le montre de profil des deux côtés (il brille), puis la main tire la glissière par-dessus
  pistolet_lourd(g) {
    const dessus = [-0.008, 0.066, -0.12];
    return {
      duree: 2.8,
      pistes: {
        arme: [K(0), K(0.4, [-0.05, 0.05, -0.04], [0.1, 0.25, 1.2]), K(0.9, [-0.055, 0.055, -0.04], [0.12, -0.3, 1.25]), K(1.2, [-0.03, 0.03, -0.03], [0.08, 0.1, 0.2]),
          K(1.35, [-0.04, 0.05, -0.08], [0.15, 0.25, 0.5]), K(1.9, [-0.04, 0.05, -0.08], [0.15, 0.25, 0.55], { arret: 1 }), K(2.3, [-0.02, 0.02, -0.02], [0.05, 0.1, 0.1]), K(2.8)],
        culasse: [K(0), K(1.5), K(1.6, [0, 0, 0.03]), K(1.75, [0, 0, 0.03], O, { arret: 1 }), K(1.8), K(2.8)],
        mainG: [K(0), K(0.3, [0, -0.08, 0.03], O, { libre: 1 }), K(1.15, [0, -0.08, 0.03], O, { libre: 1 }), K(1.4, g.G(dessus)), K(1.5, g.G(dessus), O, { arret: 1 }),
          K(1.6, g.G(plus(dessus, [0, 0, 0.03]))), K(1.75, g.G(plus(dessus, [0, 0, 0.03]))), K(1.8, g.G(plus(dessus, [0, 0.02, 0.05]))), K(2.1), K(2.8)],
      },
      sons: [[1.6, 'clic'], [1.8, 'clic']],
    };
  },
  // Pistolet automatique : clic clic sur le sélecteur de tir, on le penche à plat, puis une tape sous le long chargeur
  pistolet_auto(g) {
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.1, 0.02]));
    const selecteur = [-0.02, 0.034, -0.02];
    return {
      duree: 2.6,
      pistes: {
        arme: [K(0), K(0.35, [-0.05, 0.05, -0.09], [0.12, 0.3, 0.6]), K(1.0, [-0.055, 0.055, -0.09], [0.13, 0.32, 0.62], { arret: 1 }), K(1.3, [-0.04, 0.05, -0.03], [0.05, 0.2, -0.6]),
          K(1.6, [-0.04, 0.05, -0.03], [0.05, 0.2, -0.62], { arret: 1 }), K(1.85, [-0.03, 0.04, -0.03], [0.15, 0.15, 0.1]), K(2.0, [-0.03, 0.05, -0.03], [0.2, 0.15, 0.1]), K(2.6)],
        chargeur: [K(0), K(1.85), K(1.95, [0, 0.004, 0]), K(2.05)],
        mainG: [K(0), K(0.4, g.G(plus(selecteur, [-0.01, 0.01, 0]))), K(0.55, g.G(selecteur)), K(0.65, g.G(plus(selecteur, [0, 0.006, 0]))), K(0.75, g.G(selecteur)),
          K(0.85, g.G(plus(selecteur, [0, -0.006, 0]))), K(1.05), K(1.25, [0, -0.08, 0.03], O, { libre: 1 }), K(1.65, [0, -0.08, 0.03], O, { libre: 1 }),
          K(1.88, ch([0, -0.03, 0])), K(1.95, ch()), K(2.25), K(2.6)],
      },
      sons: [[0.65, 'clic'], [0.85, 'clic'], [1.95, 'chargeur_insere']],
    };
  },
  // Mini-arbalète : un tour autour du doigt façon cow-boy, puis on pince la corde (elle vibre)
  mini_arbalete(g) {
    const corde = [0.07, 0.03, -0.17];
    return {
      duree: 2.8,
      pistes: {
        arme: [K(0), K(0.25, [-0.02, 0.02, -0.06], [0.1, 0, 0]), K(0.55, [-0.02, 0.03, -0.08], [0.1, 0, Math.PI]), K(0.85, [-0.02, 0.02, -0.06], [0.1, 0, TOUR]), K(1.0, [0, -0.01, 0], [0.05, 0, TOUR]),
          K(1.4, [-0.05, 0.05, -0.05], [0.3, 0.35, TOUR + 0.3]), K(2.2, [-0.05, 0.055, -0.05], [0.32, 0.37, TOUR + 0.28], { arret: 1 }), K(2.8, O, [0, 0, TOUR])],
        corde: [K(0, [1, 0, 0]), K(1.55, [1, 0, 0]), K(1.62, [0.85, 0, 0]), K(1.67, [1.04, 0, 0]), K(1.72, [0.95, 0, 0]), K(1.77, [1.02, 0, 0]), K(1.82, [0.98, 0, 0]),
          K(1.9, [1, 0, 0]), K(2.8, [1, 0, 0])],
        mainG: [K(0), K(0.2, [0, -0.08, 0.03], O, { libre: 1 }), K(1.1, [0, -0.08, 0.03], O, { libre: 1 }), K(1.45, g.G(plus(corde, [0, 0.01, 0]))), K(1.55, g.G(corde)),
          K(1.65, g.G(plus(corde, [0.01, 0.03, 0.02]))), K(2.1), K(2.8)],
      },
      sons: [[0.4, 'couteau_coup'], [1.62, 'grappin_corde']],
    };
  },
  // Pistolet à eau : on le secoue (l'eau fait « floc floc »), on regarde le réservoir, puis deux coups de pompe
  pistolet_eau(g) {
    const pompe = plus(g.repos('pompe'), [0, -0.05, -0.22]);
    const s = [0.15, 0.2, 0.3];
    return {
      duree: 2.8,
      pistes: {
        arme: [K(0), K(0.3, [-0.04, 0.04, 0.02], s), K(0.4, [-0.04, 0.07, 0.02], s), K(0.5, [-0.04, 0.02, 0.02], s), K(0.6, [-0.04, 0.07, 0.02], s), K(0.7, [-0.04, 0.02, 0.02], s),
          K(0.8, [-0.04, 0.06, 0.02], s), K(1.1, [-0.05, 0.05, 0.04], [0.1, 0.7, 0.2]), K(1.5, [-0.05, 0.05, 0.04], [0.12, 0.72, 0.2], { arret: 1 }),
          K(1.8, [-0.03, 0.03, 0], [0.1, 0.2, -0.1]), K(2.4, [-0.03, 0.03, 0], [0.1, 0.2, -0.1], { arret: 1 }), K(2.8)],
        pompe: [K(0), K(1.85), K(1.95, [0, 0, 0.05]), K(2.05), K(2.15, [0, 0, 0.05]), K(2.25), K(2.8)],
        mainG: [K(0), K(1.85, g.G(pompe)), K(1.95, g.G(plus(pompe, [0, 0, 0.05]))), K(2.05, g.G(pompe)), K(2.15, g.G(plus(pompe, [0, 0, 0.05]))), K(2.25, g.G(pompe)), K(2.8)],
      },
      sons: [[0.4, 'eau'], [0.6, 'eau'], [1.95, 'pompe_armement'], [2.15, 'pompe_armement']],
    };
  },
  // Katana : on regarde le fil de la lame, un moulinet du poignet, puis le petit coup sec pour « essuyer » la lame
  katana() {
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.4, [-0.05, 0.05, 0.04], [-0.4, 0.8, 0.5]), K(1.2, [-0.06, 0.055, 0.04], [-0.45, 0.85, 0.45], { arret: 1 }), K(1.5), K(1.75, [0, 0.02, 0], [0, 0, Math.PI]),
          K(2.0, [0, 0.02, 0], [0, 0, TOUR]), K(2.3, [0.05, -0.02, 0], [-0.3, -0.6, TOUR + 0.2]), K(2.45, [0.02, -0.03, 0], [-0.5, -0.1, TOUR]), K(3, O, [0, 0, TOUR])],
        mainG: [K(0), K(0.3, [0, -0.05, 0.04], O, { libre: 1 }), K(2.5, [0, -0.05, 0.04], O, { libre: 1 }), K(3)],
      },
      sons: [[1.75, 'couteau_coup'], [2.3, 'couteau_coup']],
    };
  },
  // Hache : on la soupèse deux fois, on la tourne et on passe le doigt sur le tranchant (toc)
  hache(g) {
    const tranchant = [-0.03, -0.12, -0.5];
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.3, [0, 0.04, 0], [0.2, 0, 0]), K(0.45, [0, -0.01, 0], [-0.05, 0, 0]), K(0.6, [0, 0.04, 0], [0.2, 0, 0]), K(0.75),
          K(1.3, [-0.08, 0.08, 0.06], [-0.5, 0.7, 0.6]), K(2.2, [-0.08, 0.085, 0.06], [-0.52, 0.72, 0.58], { arret: 1 }), K(2.6, [-0.02, 0.02, 0], [-0.1, 0.1, 0.1]), K(3)],
        mainG: [K(0), K(1.2), K(1.55, g.G(plus(tranchant, [0, 0.03, 0.04]))), K(1.75, g.G(tranchant)), K(1.95, g.G(plus(tranchant, [0, 0, -0.06]))),
          K(2.15, g.G(plus(tranchant, [0, 0.03, 0]))), K(2.5), K(3)],
      },
      sons: [[0.45, 'clic'], [0.75, 'clic'], [1.75, 'poele_touche']],
    };
  },
  // Masse : on la lève devant soi pour regarder la tête (elle est lourde, ça tremble), puis elle retombe avec son poids
  masse() {
    const h = [-0.07, 0.03, -0.08]; const r = [0.6, 0.35, 0.25];
    const tremble = (k, d) => K(k, plus(h, [0, d, 0]), r);
    return {
      duree: 3.2,
      pistes: {
        arme: [K(0), K(0.6, h, r), tremble(0.9, 0.006), tremble(1.1, -0.004), tremble(1.3, 0.006), tremble(1.5, -0.004), K(1.9, plus(h, [0, 0, 0.01]), [0.62, -0.3, 0.2]),
          K(2.2, plus(h, [0, 0.005, 0.01]), [0.64, -0.32, 0.2], { arret: 1 }), K(2.5, [0, -0.05, -0.02], [-0.4, 0, 0]), K(2.6, [0, -0.06, -0.02], [-0.45, 0, 0]), K(3.2)],
      },
      sons: [[2.55, 'batte_coup']],
    };
  },
  // Pelle : on creuse un coup devant soi, on jette la terre par-dessus l'épaule, puis on toque sur la lame
  pelle(g) {
    const lame = [0.02, 0.01, -0.66];
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.4, [0, -0.06, -0.06], [-0.6, 0, 0]), K(0.55, [0, -0.08, -0.12], [-0.7, 0, 0]), K(0.9, [0, -0.02, -0.06], [0.1, 0, 0]), K(1.05, [0.02, 0.02, -0.04], [0.3, -0.2, 0.2]),
          K(1.5, [-0.06, 0.06, 0.04], [-0.3, 0.8, 0.5]), K(2.2, [-0.06, 0.065, 0.04], [-0.32, 0.82, 0.48], { arret: 1 }), K(2.5, [-0.06, 0.06, 0.04], [-0.3, 0.8, 0.5]), K(3)],
        mainG: [K(0), K(1.5), K(1.75, g.G(plus(lame, [0.03, 0.03, 0]))), K(1.85, g.G(lame)), K(1.95, g.G(plus(lame, [0.03, 0.03, 0]))), K(2.05, g.G(lame)), K(2.4), K(3)],
      },
      sons: [[0.55, 'impact_mur'], [1.05, 'pouf'], [1.85, 'poele_touche'], [2.05, 'poele_touche']],
    };
  },
  // Grenade flash : on lit l'étiquette des deux côtés, puis petit lancer en vrille au-dessus de la main
  grenade_flash() {
    return {
      duree: 2.4,
      pistes: {
        arme: [K(0), K(0.4, [-0.05, 0.05, 0.05], [0.1, 1.2, 0.1]), K(1.0, [-0.05, 0.05, 0.05], [0.1, -0.5, 0.1]), K(1.2, [-0.05, 0.05, 0.05], [0.1, -0.52, 0.1], { arret: 1 }),
          K(1.5, [0, -0.02, 0], [-0.1, 0, 0]), K(1.6, [0, 0.01, 0], [0.1, 0, 0]), K(2.4)],
        objet: [K(0), K(1.55), K(1.8, [0, 0.15, 0], [0, TOUR, 0]), K(2.05, O, [0, TOUR * 2, 0]), K(2.4, O, [0, TOUR * 2, 0])],
      },
      sons: [[1.6, 'couteau_coup'], [2.05, 'clic']],
    };
  },
  // Mine : deux tapes sur le détonateur, puis on la retourne pour voir dessous
  mine() {
    return {
      duree: 2.6,
      pistes: {
        arme: [K(0), K(0.4, [-0.03, 0.05, 0.04], [0.5, 0.2, 0.1]), K(1.1, [-0.03, 0.05, 0.04], [0.5, 0.2, 0.1], { arret: 1 }), K(1.4, [-0.03, 0.05, 0.04], [0.5, 0.2, 0.1]),
          K(2.0, [-0.02, 0.03, 0.02], [0.3, 0.1, 0.1]), K(2.6)],
        objet: [K(0), K(1.1), K(1.6, O, [Math.PI, 0, 0]), K(1.9, O, [Math.PI, 0, 0], { arret: 1 }), K(2.3, O, [TOUR, 0, 0]), K(2.6, O, [TOUR, 0, 0])],
        mainG: [K(0), K(0.5, [-0.03, 0.05, -0.03]), K(0.6, [-0.03, 0.035, -0.03]), K(0.7, [-0.03, 0.05, -0.03]), K(0.8, [-0.03, 0.035, -0.03]), K(1.0), K(2.6)],
      },
      sons: [[0.6, 'clic'], [0.8, 'clic']],
    };
  },
  // Propulseur : on regarde le manomètre (toc toc), puis un petit « pschht » d'essai qui fait sauter la main
  propulseur() {
    return {
      duree: 2.6,
      pistes: {
        arme: [K(0), K(0.4, [-0.04, 0.06, 0.04], [0.4, 0.6, 0]), K(1.2, [-0.04, 0.065, 0.04], [0.42, 0.62, 0], { arret: 1 }), K(1.5, O, [-0.2, 0, 0]), K(1.6, [0, 0.05, 0], [-0.2, 0, 0]),
          K(1.75, O, [-0.2, 0, 0]), K(2.6)],
        mainG: [K(0), K(0.5, [-0.02, 0.06, -0.02]), K(0.7, [-0.02, 0.05, -0.02]), K(0.8, [-0.02, 0.06, -0.02]), K(0.9, [-0.02, 0.05, -0.02]), K(1.2), K(2.6)],
      },
      sons: [[0.7, 'clic'], [0.9, 'clic'], [1.6, 'pouf']],
    };
  },
  // Balise des météores : levée vers le ciel (bip !), puis un petit lancer en tournant
  meteores() {
    return {
      duree: 2.8,
      pistes: {
        arme: [K(0), K(0.5, [-0.05, 0.25, -0.1], [0.6, 0, 0]), K(1.5, [-0.05, 0.27, -0.1], [0.62, 0, 0], { arret: 1 }), K(1.9), K(2.0, [0, -0.02, 0]), K(2.8)],
        objet: [K(0), K(1.6), K(1.85, [0, 0.15, 0], [0, Math.PI, 0]), K(2.1, O, [0, TOUR, 0]), K(2.8, O, [0, TOUR, 0])],
      },
      sons: [[0.6, 'lobby_pret'], [2.1, 'clic']],
    };
  },
  // Canon à trou noir : on le tourne vers soi pour regarder l'orbe qui pulse, la main s'approche... et recule vite
  trou_noir(g) {
    const orbe = [0, 0.06, -0.33];
    return {
      duree: 3.2,
      pistes: {
        arme: [K(0), K(0.5, [-0.06, 0.06, 0.06], [0.15, 0.9, 0.3]), K(1.5, [-0.065, 0.065, 0.06], [0.18, 0.95, 0.25], { arret: 1 }), K(1.9, [-0.04, 0.05, 0.03], [0.3, 0.3, -0.2]),
          K(2.7, [-0.04, 0.05, 0.03], [0.32, 0.3, -0.22], { arret: 1 }), K(3.2)],
        mainG: [K(0), K(1.6), K(2.0, g.G(plus(orbe, [0, 0.04, 0.03]))), K(2.2, g.G(plus(orbe, [0, 0.02, 0.02]))), K(2.3, g.G(plus(orbe, [0, 0.07, 0.06]))), K(2.7), K(3.2)],
      },
      sons: [[0.5, 'apparition'], [2.3, 'couteau_coup']],
    };
  },
  // Fusil Tesla : on touche la bobine de cuivre... zap ! (la main saute), les éclairs crépitent
  tesla(g) {
    const bobine = [0, 0.045, -0.3];
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.45, [-0.06, 0.05, 0.05], [0.15, 0.8, 0.3]), K(1.2, [-0.06, 0.055, 0.05], [0.18, 0.85, 0.25], { arret: 1 }), K(1.5, [-0.04, 0.04, 0.02], [0.2, 0.3, -0.3]),
          K(1.85, [-0.04, 0.04, 0.02], [0.2, 0.3, -0.3]), K(1.9, [-0.03, 0.05, 0.03], [0.28, 0.32, -0.25]), K(1.98, [-0.04, 0.04, 0.02], [0.2, 0.3, -0.3]),
          K(2.4, [-0.04, 0.04, 0.02], [0.22, 0.3, -0.32], { arret: 1 }), K(3)],
        mainG: [K(0), K(1.5), K(1.8, g.G(plus(bobine, [0, 0.03, 0]))), K(1.88, g.G(bobine)), K(1.95, g.G(plus(bobine, [-0.03, 0.07, 0.04]))), K(2.3), K(3)],
      },
      sons: [[0.5, 'apparition'], [1.88, 'tesla_zap']],
    };
  },
  // Minigun : deux tapes sur la boîte de munitions, puis la main lance les canons qui tournent
  minigun(g) {
    const boite = g.sur('chargeur', O, [-0.03, 0.03, 0]);
    const canons = [0, 0.05, -0.45];
    return {
      duree: 3.2,
      pistes: {
        arme: [K(0), K(0.6, [-0.05, 0.08, -0.03], [0.25, 0.4, -0.4]), K(1.6, [-0.05, 0.085, -0.03], [0.27, 0.42, -0.42], { arret: 1 }), K(2.0, [-0.03, 0.05, 0.02], [0.1, 0.2, 0.3]),
          K(2.7, [-0.03, 0.05, 0.02], [0.12, 0.2, 0.32], { arret: 1 }), K(3.2)],
        mainG: [K(0), K(0.65, g.G(plus(boite, [0, 0.04, 0]))), K(0.8, g.G(boite)), K(0.95, g.G(plus(boite, [0, 0.04, 0]))), K(1.1, g.G(boite)), K(1.4),
          K(2.05, g.G(plus(canons, [0, 0.02, 0]))), K(2.15, g.G(plus(canons, [0.04, 0.0, 0]))), K(2.25, g.G(plus(canons, [0, -0.02, 0]))), K(2.5), K(3.2)],
      },
      sons: [[0.8, 'clic'], [1.1, 'clic'], [2.15, 'minigun_rotor']],
    };
  },
  // Marteau de Thor : levé vers le ciel (le tonnerre gronde), puis deux tours en le faisant tourner par le manche
  marteau_thor() {
    return {
      duree: 3.2,
      pistes: {
        arme: [K(0), K(0.5, [-0.08, 0.3, -0.1], [1.6, 0, 0]), K(1.4, [-0.08, 0.31, -0.1], [1.62, 0, 0], { arret: 1 }), K(1.7, [0, 0.02, 0]), K(1.9, [0, 0.02, 0], [-Math.PI, 0, 0]),
          K(2.1, [0, 0.02, 0], [-TOUR, 0, 0]), K(2.3, [0, 0.02, 0], [-TOUR * 1.5, 0, 0]), K(2.5, O, [-TOUR * 2, 0, 0]), K(3.2, O, [-TOUR * 2, 0, 0])],
      },
      sons: [[0.6, 'tonnerre'], [1.9, 'couteau_coup'], [2.3, 'couteau_coup']],
    };
  },
  // Lance-feux d'artifice : une tape sur chaque tube (on dirait des notes de musique), puis on vérifie la fusée
  feu_artifice(g) {
    const tube = (i) => [((i % 2) - 0.5) * 0.07, (Math.floor(i / 2) - 0.5) * 0.07 + 0.065, -0.3];
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.5, [-0.07, 0.05, 0.04], [0.2, 0.5, 0.4]), K(2.0, [-0.072, 0.055, 0.04], [0.22, 0.52, 0.38], { arret: 1 }), K(2.4, [-0.04, 0.03, 0.02], [0.1, 0.2, -0.2]), K(3)],
        munition: [K(0), K(1.95), K(2.05, [0, 0, -0.01]), K(2.15), K(3)],
        mainG: [K(0), K(0.6, g.G(tube(2))), K(0.75, g.G(plus(tube(2), [0, 0.02, 0]))), K(0.9, g.G(tube(3))), K(1.05, g.G(plus(tube(3), [0, 0.02, 0]))),
          K(1.2, g.G(plus(tube(2), [0, 0, 0.12]))), K(1.35, g.G(plus(tube(2), [0, 0.02, 0.12]))), K(1.5, g.G(plus(tube(3), [0, 0, 0.12]))), K(1.65, g.G(plus(tube(3), [0, 0.02, 0.12]))),
          K(1.9, g.G(plus(g.repos('munition'), [0, 0.03, 0.02]))), K(2.05, g.G(plus(g.repos('munition'), [0, 0.02, 0.01]))), K(2.3), K(3)],
      },
      sons: [[0.6, 'clic'], [0.9, 'clic'], [1.2, 'clic'], [1.5, 'clic'], [2.05, 'clic']],
    };
  },
  // Rayon anti-gravité : pointé vers le ciel, « piou » d'essai, puis on le regarde de près
  rayon_lev() {
    return {
      duree: 2.8,
      pistes: {
        arme: [K(0), K(0.4, [-0.03, 0.1, -0.05], [1.0, 0.1, 0.2]), K(1.0, [-0.03, 0.11, -0.05], [1.05, 0.1, 0.2], { arret: 1 }), K(1.08, [-0.03, 0.12, -0.03], [1.15, 0.1, 0.2]),
          K(1.2, [-0.03, 0.11, -0.05], [1.05, 0.1, 0.2]), K(1.6, [-0.06, 0.05, -0.04], [0.6, 0.4, 0]), K(2.3, [-0.06, 0.055, -0.04], [0.62, 0.42, 0], { arret: 1 }), K(2.8)],
        mainG: [K(0), K(0.3, [0, -0.08, 0.03], O, { libre: 1 }), K(2.4, [0, -0.08, 0.03], O, { libre: 1 }), K(2.8)],
      },
      sons: [[1.08, 'rayon_lev_tir']],
    };
  },
  // Sabre laser : deux moulinets (vvvoum), puis la lame tenue près du visage pour l'admirer
  sabre_laser() {
    return {
      duree: 3,
      pistes: {
        arme: [K(0), K(0.3, [0, 0.02, 0], [-0.3, 0, 0]), K(0.6, [0, 0.03, 0], [-0.3, 0, Math.PI]), K(0.9, [0, 0.03, 0], [-0.3, 0, TOUR]), K(1.2, [0.03, 0.02, 0], [-0.2, 0.6, TOUR]),
          K(1.5, [-0.02, 0.02, 0], [-0.2, -0.6, TOUR]), K(1.9, [-0.08, 0.06, 0.06], [-0.5, 0.9, TOUR + 0.5]), K(2.4, [-0.08, 0.065, 0.06], [-0.52, 0.92, TOUR + 0.48], { arret: 1 }),
          K(3, O, [0, 0, TOUR])],
        mainG: [K(0), K(0.25, [0, -0.05, 0.04], O, { libre: 1 }), K(2.6, [0, -0.05, 0.04], O, { libre: 1 }), K(3)],
      },
      sons: [[0.6, 'sabre_coup'], [1.2, 'sabre_coup'], [1.5, 'sabre_coup']],
    };
  },
};

// Grenade : lancée en l'air (l'objet monte en tournant, la main reste en bas), rattrapée, regardée,
// puis un deuxième petit lancer en vrille
function lancerEnLAir() {
  return {
    duree: 2.6,
    pistes: {
      arme: [K(0), K(0.3, [0, -0.03, 0], [-0.1, 0, 0]), K(0.4, [0, 0.02, 0], [0.1, 0, 0]), K(0.95, [0, -0.02, 0], [-0.05, 0, 0]), K(1.1),
        K(1.5, [-0.07, 0.06, -0.05], [0.3, 0.6, 0.3]), K(1.85, [-0.07, 0.06, -0.05], [0.3, 0.6, 0.3], { arret: 1 }), K(2.0, [-0.03, 0.0, -0.02], [0.1, 0.2, 0.1]),
        K(2.1, [-0.03, 0.03, -0.02], [0.2, 0.2, 0.1]), K(2.6)],
      objet: [K(0), K(0.38), K(0.65, [0, 0.22, 0], [Math.PI, 0, Math.PI]), K(0.92, O, [TOUR, 0, TOUR]), K(2.05, O, [TOUR, 0, TOUR]), K(2.25, [0, 0.1, 0], [TOUR, TOUR, TOUR]),
        K(2.45, O, [TOUR, 2 * TOUR, TOUR]), K(2.6, O, [TOUR, 2 * TOUR, TOUR])],
    },
    sons: [[0.4, 'couteau_coup'], [0.95, 'clic'], [2.1, 'couteau_coup'], [2.45, 'clic']],
  };
}

// ----------------------------------------------------------------------------------------------
// Recharges : une par arme (écrites de 0 à 1)
// ----------------------------------------------------------------------------------------------
// Pose « arme relevée » pendant les recharges : sans elle, le chargeur change sous le bas de l'écran.
// pose(p, r) renvoie une fonction qui décale la pose (secousses, tapes).
const poseRecharge = (p, r) => (dp = O, dr = O) => [plus(p, dp), plus(r, dr)];

const RECHARGES = {
  // Fusil d'assaut : arme relevée, chargeur sorti, chargeur neuf, tape dessous, puis une claque sur l'arrêtoir de culasse
  fusil(g) {
    const P = poseRecharge([-0.08, 0.09, -0.05], [0.3, 0.45, -0.5]);
    const e = echangeChargeur(g, { bas: [0, -0.26, 0.03], loin: [-0.04, -0.3, 0.07], arrivee: [0, -0.24, 0.04] });
    const arretoir = [-0.04, 0.0, -0.04];
    return {
      pistes: {
        arme: [K(0), K(0.12, ...P()), K(0.4, ...P([0, -0.005, 0], [0.02, 0.02, -0.03]), { arret: 1 }), K(0.6, ...P()), K(0.64, ...P([0, 0.014, 0.004], [0.07, 0, 0.02])),
          K(0.7, ...P()), K(0.8, ...P([0, 0, -0.02], [0, 0, -0.2])), K(0.84, ...P([0, -0.01, -0.02], [-0.04, 0, -0.22])), K(1)],
        chargeur: [...e.chargeur, K(1)],
        mainG: [K(0), ...e.mainG, K(0.76, g.G(plus(arretoir, [-0.02, 0.01, 0]))), K(0.82, g.G(plus(arretoir, [-0.02, 0.01, 0])), O, { arret: 1 }), K(0.84, g.G(arretoir)),
          K(0.9, g.G(plus(arretoir, [-0.03, -0.02, 0]))), K(1)],
      },
      sons: [[0.2, 'chargeur_retire'], [0.64, 'chargeur_insere'], [0.84, 'clic']],
    };
  },
  // Fusil à rafale (bullpup) : l'arme part loin devant et penche, la main va chercher le chargeur derrière
  // la poignée, puis claque le levier d'armement à l'avant
  rafale(g) {
    const P = poseRecharge([-0.1, 0.11, -0.12], [0.35, 0.6, -0.55]);
    const e = echangeChargeur(g, { debut: 0.15, sortie: 0.34, cache: 0.35, neuf: 0.45, dedans: 0.62, tape: 0.66, bas: [0, -0.24, 0.02], loin: [-0.05, -0.3, 0], arrivee: [0, -0.22, 0.03] });
    const levier = [-0.035, 0.03, -0.22];
    return {
      pistes: {
        arme: [K(0), K(0.12, ...P()), K(0.42, ...P([0, -0.005, 0], [0.02, 0, -0.02]), { arret: 1 }), K(0.62, ...P()), K(0.66, ...P([0, 0.014, 0.005], [0.07, 0, 0.02])),
          K(0.74, ...P()), K(0.82, [-0.04, 0.04, -0.05], [0.05, 0.2, -0.2]), K(0.87, [-0.04, 0.028, -0.05], [-0.01, 0.2, -0.22]), K(1)],
        chargeur: [...e.chargeur, K(1)],
        mainG: [K(0), ...e.mainG, K(0.78, g.G(levier)), K(0.84, g.G(plus(levier, [0, 0, 0.05]))), K(0.87, g.G(plus(levier, [0, -0.02, 0]))), K(1)],
      },
      sons: [[0.2, 'chargeur_retire'], [0.66, 'chargeur_insere'], [0.87, 'clic']],
    };
  },
  // Mitraillette : un coup de poignet éjecte le chargeur, le neuf rentre, tape dessous, tape sur le levier
  smg(g) {
    const P = poseRecharge([-0.07, 0.08, -0.04], [0.25, 0.4, -0.45]);
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.05, 0]));
    const levier = [-0.045, 0.03, -0.1];
    return {
      pistes: {
        arme: [K(0), K(0.1, ...P()), K(0.2, ...P([0.03, 0.01, 0], [0, -0.1, 0.55])), K(0.3, ...P()), K(0.55, ...P([0, -0.004, 0], [0.02, 0, -0.02]), { arret: 1 }),
          K(0.6, ...P([0, 0.013, 0.004], [0.08, 0, 0.02])), K(0.68, ...P()), K(0.78, [-0.05, 0.05, -0.04], [0.1, 0.25, -0.2]), K(0.82, [-0.045, 0.048, -0.04], [0.1, 0.25, -0.26]), K(1)],
        chargeur: [K(0), K(0.12), K(0.3, [0.1, -0.3, 0.04], [0, 0, -1.2]), K(0.31, [0.1, -0.3, 0.04], [0, 0, -1.2], { cache: 1 }), K(0.38, [0, -0.2, 0.03]),
          K(0.55, [0, -0.01, 0]), K(0.6), K(1)],
        mainG: [K(0), K(0.15, [0, -0.06, 0.06]), K(0.3, ch([0, -0.21, 0.04])), K(0.38, ch([0, -0.2, 0.03])), K(0.55, ch([0, -0.01, 0])), K(0.58, ch([0, -0.04, 0])),
          K(0.6, ch([0, -0.003, 0])), K(0.74, g.G(levier)), K(0.82, g.G(plus(levier, [0.015, 0, 0]))), K(0.88, g.G(plus(levier, [-0.02, 0, 0]))), K(1)],
      },
      sons: [[0.18, 'chargeur_retire'], [0.6, 'chargeur_insere'], [0.82, 'clic']],
    };
  },
  // Mitrailleuse : on ouvre le capot, on change la boîte, on pose la bande, on claque le capot et on arme
  mitrailleuse(g) {
    const P = poseRecharge([-0.08, 0.08, -0.06], [0.25, 0.4, -0.4]);
    const capot = [-0.02, 0.09, -0.16];
    const leve = plus(capot, [0, 0.05, 0.02]);
    const b = (d = O) => g.G(g.sur('chargeur', d, [-0.06, -0.05, 0]));
    const levier = [0.06, 0.03, -0.14];
    return {
      pistes: {
        arme: [K(0), K(0.06, ...P([0, 0, 0], [0, 0, 0.2])), K(0.15, ...P([0, 0, 0], [0.05, 0, 0.2])), K(0.25, ...P()), K(0.55, ...P([0, -0.004, 0], [0, 0, -0.02]), { arret: 1 }),
          K(0.62, ...P([0, 0, 0], [0.05, -0.05, 0.25])), K(0.75, ...P([0, 0, 0], [0.06, -0.05, 0.27]), { arret: 1 }), K(0.8, ...P([0, -0.015, 0], [-0.03, -0.05, 0.27])),
          K(0.86, ...P([0, 0, 0], [0, 0, 0.3])), K(0.92, [-0.05, 0.05, -0.06], [0.15, 0.1, 0.35]), K(0.95, [-0.05, 0.05, -0.045], [0.19, 0.1, 0.35]), K(1)],
        chargeur: [K(0), K(0.25), K(0.38, [-0.06, -0.26, 0.02], [0, 0, 0.3]), K(0.39, [-0.06, -0.26, 0.02], [0, 0, 0.3], { cache: 1 }), K(0.44, [-0.06, -0.24, 0.02], [0, 0, 0.2]),
          K(0.55, [0, -0.005, 0]), K(0.57), K(1)],
        mainG: [K(0), K(0.08, g.G(capot)), K(0.15, g.G(leve)), K(0.22, b()), K(0.26, b(), O, { arret: 1 }), K(0.38, b([-0.06, -0.26, 0.02])), K(0.42, b([-0.09, -0.3, 0])),
          K(0.45, b([-0.06, -0.24, 0.02])), K(0.55, b([0, -0.005, 0])), K(0.58, b(), O, { arret: 1 }), K(0.62, g.G([-0.04, 0.08, -0.08])), K(0.7, g.G([0.03, 0.08, -0.08])),
          K(0.74, g.G(leve)), K(0.8, g.G(capot)), K(0.86, g.G(plus(capot, [0, 0.03, 0]))), K(0.9, g.G(levier)), K(0.95, g.G(plus(levier, [0, 0, 0.07]))), K(1)],
      },
      sons: [[0.13, 'clic'], [0.36, 'chargeur_retire'], [0.56, 'chargeur_insere'], [0.7, 'douille'], [0.8, 'chargeur_insere'], [0.95, 'pompe_armement']],
    };
  },
  // Fusil à pompe (pour UNE cartouche, l'animation se répète) : la main prend une cartouche sur le côté
  // de l'arme et la glisse dessous
  pompe(g) {
    const P = [-0.06, 0.07, -0.1]; const R = [0.25, 0.35, -0.45];
    const etui = [-0.045, 0, -0.02]; const trou = [0, -0.055, -0.03];
    return {
      pistes: {
        arme: [K(0, P, R), K(0.55, P, R), K(0.68, plus(P, [0, 0.008, 0]), plus(R, [0.05, 0, 0])), K(0.8, P, R), K(1, P, R)],
        mainG: [K(0, g.G(plus(trou, [0, -0.03, 0.02]))), K(0.25, g.G(etui)), K(0.4, g.G(plus(etui, [-0.01, -0.01, 0]))), K(0.68, g.G(trou)), K(0.8, g.G(plus(trou, [0, -0.02, 0.01]))),
          K(1, g.G(plus(trou, [0, -0.03, 0.02])))],
      },
      sons: [[0.68, 'cartouche_insere']],
    };
  },
  // Fusil de précision : on regarde le chargeur neuf avant de le mettre, puis on appuie sur l'arrêtoir de culasse
  precision(g) {
    const P = poseRecharge([-0.09, 0.1, -0.1], [0.3, 0.35, -0.55]);
    const ch = (d = O) => g.G(g.sur('chargeur', d));
    const arretoir = [-0.04, 0, -0.02];
    return {
      pistes: {
        arme: [K(0), K(0.12, ...P()), K(0.35, ...P([0, -0.004, 0], [0.02, 0, -0.02]), { arret: 1 }), K(0.5, ...P([0.01, 0.01, 0], [-0.05, 0, 0.1])), K(0.62, ...P()),
          K(0.66, ...P([0, 0.013, 0.004], [0.07, 0, 0.02])), K(0.74, ...P()), K(0.82, [-0.06, 0.06, -0.06], [0.15, 0.1, -0.7]), K(0.86, [-0.06, 0.055, -0.06], [0.1, 0.1, -0.72]), K(1)],
        chargeur: [K(0), K(0.17), K(0.32, [0, -0.26, 0.03]), K(0.33, [0, -0.26, 0.03], O, { cache: 1 }), K(0.4, [-0.03, -0.2, 0.06], [0.6, 0, 0.4]), K(0.48, [-0.03, -0.17, 0.07], [0.7, 0, 0.3]),
          K(0.62, [0, -0.012, 0]), K(0.66), K(1)],
        mainG: [K(0), K(0.14, ch()), K(0.17, ch(), O, { arret: 1 }), K(0.32, ch([0, -0.26, 0.03])), K(0.37, ch([-0.05, -0.29, 0.06])), K(0.4, ch([-0.03, -0.2, 0.06])),
          K(0.48, ch([-0.03, -0.17, 0.07])), K(0.62, ch([0, -0.012, 0])), K(0.64, ch([0, -0.04, 0])), K(0.66, ch([0, -0.004, 0])), K(0.78, g.G(arretoir)),
          K(0.86, g.G(plus(arretoir, [0.01, 0.008, 0]))), K(0.9, g.G(plus(arretoir, [-0.01, -0.01, 0]))), K(1)],
      },
      sons: [[0.2, 'chargeur_retire'], [0.66, 'chargeur_insere'], [0.86, 'clic']],
    };
  },
  // Sniper : la main droite ouvre la culasse, la gauche change le chargeur, la droite referme la culasse
  sniper(g) {
    const ferme = [0.07, 0.035, 0.08]; const leve = [0.04, 0.084, 0.08]; const tire = [0.04, 0.084, 0.15];
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.05, 0]));
    const C = poseRecharge([-0.05, 0.05, -0.1], [0.15, 0.3, 0.35]); // culasse (côté droit vers nous, arme loin devant)
    const M = poseRecharge([-0.08, 0.09, -0.08], [0.3, 0.45, -0.5]); // chargeur
    return {
      pistes: {
        arme: [K(0), K(0.08, ...C()), K(0.22, ...C([0, 0, 0], [0.02, 0, 0.02]), { arret: 1 }), K(0.32, ...M()), K(0.62, ...M([0, -0.004, 0], [0.02, 0, -0.02]), { arret: 1 }),
          K(0.66, ...M([0, 0.013, 0.004], [0.07, 0, 0.02])), K(0.72, ...C()), K(0.9, ...C([0, 0, 0], [0.02, 0, 0.02])), K(1)],
        culasse: [K(0), K(0.08), K(0.14, O, [0, 0, 1.1]), K(0.2, [0, 0, 0.07], [0, 0, 1.1]), K(0.75, [0, 0, 0.07], [0, 0, 1.1], { arret: 1 }), K(0.82, O, [0, 0, 1.1]), K(0.88), K(1)],
        mainD: [K(0), K(0.06, g.D(ferme)), K(0.14, g.D(leve)), K(0.2, g.D(tire)), K(0.24, g.D(tire), O, { arret: 1 }), K(0.32), K(0.68), K(0.74, g.D(tire)),
          K(0.82, g.D(leve)), K(0.88, g.D(ferme)), K(0.96), K(1)],
        chargeur: [K(0), K(0.33), K(0.45, [0, -0.22, 0.02]), K(0.46, [0, -0.22, 0.02], O, { cache: 1 }), K(0.5, [0, -0.2, 0.03]), K(0.62, [0, -0.01, 0]), K(0.66), K(1)],
        mainG: [K(0), K(0.3, ch()), K(0.33, ch(), O, { arret: 1 }), K(0.45, ch([0, -0.22, 0.02])), K(0.48, ch([-0.04, -0.25, 0.03])), K(0.51, ch([0, -0.2, 0.03])),
          K(0.62, ch([0, -0.01, 0])), K(0.64, ch([0, -0.04, 0])), K(0.66, ch([0, -0.003, 0])), K(0.74), K(1)],
      },
      sons: [[0.14, 'sniper_culasse'], [0.45, 'chargeur_retire'], [0.66, 'chargeur_insere'], [0.84, 'sniper_culasse']],
    };
  },
  // Arbalète : canon vers le ciel, la main tire la corde jusqu'au loquet, puis pose un nouveau carreau
  arbalete(g) {
    const encoche = (k) => [0, 0.045, -0.31 + 0.25 * k];
    const milieu = plus(g.repos('munition'), [0, 0, -0.18]);
    const depart = [0, 0.05, 0.15];
    const B = [[-0.05, 0.0, -0.1], [0.6, 0.3, 0.2]];
    return {
      pistes: {
        arme: [K(0), K(0.12, ...B), K(0.55, B[0], plus(B[1], [-0.03, 0, 0])), K(0.62, [-0.05, 0.04, -0.06], [0.05, 0.3, 0.2]),
          K(0.88, [-0.05, 0.04, -0.06], [0.07, 0.3, 0.2], { arret: 1 }), K(1)],
        corde: [K(0, [0, 0, 0]), K(0.12, [0, 0, 0]), K(0.5, [1, 0, 0]), K(1, [1, 0, 0])],
        mainG: [K(0), K(0.1, g.G(encoche(0))), K(0.12, g.G(encoche(0)), O, { arret: 1 }), K(0.5, g.G(encoche(1))), K(0.55, g.G(encoche(1)), O, { arret: 1 }),
          K(0.62, g.G(plus(milieu, depart))), K(0.85, g.G(milieu)), K(0.88, g.G(milieu), O, { arret: 1 }), K(1)],
        munition: [K(0, O, O, { cache: 1 }), K(0.6, depart), K(0.85), K(1)],
      },
      sons: [[0.12, 'chargeur_retire'], [0.5, 'clic'], [0.85, 'chargeur_insere']],
    };
  },
  // Lance-roquettes : le tube tourné sur le côté, la main amène une roquette par l'avant, l'enfonce et la verrouille
  roquette(g) {
    const R = (d) => g.G(plus(plus(g.repos('munition'), [0, -0.05, -0.2]), d));
    const pose = [[0.05, -0.04, 0.05], [-0.4, 0.9, 0.1]];
    return {
      pistes: {
        arme: [K(0), K(0.14, ...pose), K(0.75, pose[0], plus(pose[1], [-0.02, 0, 0]), { arret: 1 }), K(0.82, plus(pose[0], [0, 0.01, 0]), plus(pose[1], [0.04, 0, -0.1])),
          K(0.9, ...pose), K(1)],
        munition: [K(0, [0, -0.4, 0.1], O, { cache: 1 }), K(0.3, [0, -0.4, 0.1]), K(0.55, [0, 0, -0.15]), K(0.75), K(0.82, O, [0, 0, 0.5]), K(0.86), K(1)],
        mainG: [K(0), K(0.15, [0, -0.1, 0.1], O, { libre: 1 }), K(0.3, R([0, -0.4, 0.1])), K(0.55, R([0, 0, -0.15])), K(0.75, R(O)), K(0.82, R(O)), K(0.92), K(1)],
      },
      sons: [[0.6, 'chargeur_retire'], [0.75, 'chargeur_insere'], [0.82, 'clic']],
    };
  },
  // Revolver : barillet ouvert, canon vers le haut pour vider les douilles, chargeur rapide, coup de poignet
  revolver(g) {
    const cote = [-0.05, 0.02, -0.03]; const tige = [-0.03, 0.02, -0.08];
    return {
      pistes: {
        arme: [K(0), K(0.08, [-0.05, 0.05, -0.06], [0.1, 0.3, 0.6]), K(0.18, [-0.05, 0.05, -0.08], [0.85, 0.25, 0.5]), K(0.3, [-0.05, 0.05, -0.08], [0.9, 0.25, 0.5], { arret: 1 }),
          K(0.42, [-0.06, 0.08, -0.09], [-0.35, 0.3, 0.45]), K(0.75, [-0.06, 0.078, -0.09], [-0.38, 0.3, 0.47], { arret: 1 }), K(0.84, [-0.04, 0.03, -0.04], [0.05, 0.2, -0.25]),
          K(0.9, [-0.02, 0.01, 0], [0.05, 0.1, 0]), K(1)],
        barillet: [K(0), K(0.05), K(0.12, O, [0, 0, 1.25]), K(0.78, O, [0, 0, 1.25], { arret: 1 }), K(0.84), K(1)],
        mainG: [K(0), K(0.1, g.G(cote)), K(0.18, g.G(tige)), K(0.24, g.G(plus(tige, [0, 0, 0.03]))), K(0.3, g.G(tige)), K(0.38, [0, -0.15, 0.05], O, { libre: 1 }),
          K(0.5, g.G([-0.03, -0.01, 0.04])), K(0.6, g.G([-0.028, 0.02, 0.005])), K(0.66, g.G([-0.028, 0.02, 0.005]), O, { arret: 1 }), K(0.72, [0, -0.12, 0.05], O, { libre: 1 }),
          K(0.9), K(1)],
      },
      sons: [[0.12, 'revolver_recharge'], [0.25, 'douille'], [0.29, 'douille'], [0.6, 'cartouche_insere'], [0.84, 'chargeur_insere']],
    };
  },
  // Pistolet : le chargeur tombe tout seul, le neuf rentre d'une tape, et la main tire la glissière par l'avant
  pistolet(g) {
    const P = poseRecharge([-0.06, 0.09, -0.06], [0.3, 0.4, -0.45]);
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.05, 0]));
    const glissiere = [-0.01, 0.05, -0.09];
    return {
      pistes: {
        arme: [K(0), K(0.1, ...P()), K(0.4, ...P([0, -0.004, 0], [0.02, 0, -0.02]), { arret: 1 }), K(0.56, ...P()), K(0.6, ...P([0, 0.012, 0.004], [0.08, 0, 0.02])),
          K(0.7, [-0.05, 0.06, -0.06], [0.15, 0.3, 0.3]), K(0.84, [-0.05, 0.06, -0.06], [0.15, 0.3, 0.32]), K(0.88, [-0.05, 0.065, -0.055], [0.2, 0.3, 0.3]), K(1)],
        chargeur: [K(0), K(0.1), K(0.25, [0, -0.2, 0.04]), K(0.26, [0, -0.2, 0.04], O, { cache: 1 }), K(0.36, [0, -0.16, 0.05]), K(0.56, [0, -0.01, 0]), K(0.6), K(1)],
        culasse: [K(0), K(0.72), K(0.8, [0, 0, 0.03]), K(0.84, [0, 0, 0.03]), K(0.86), K(1)],
        mainG: [K(0), K(0.12, [0, -0.06, 0.02]), K(0.3, ch([0, -0.18, 0.05])), K(0.36, ch([0, -0.16, 0.05])), K(0.56, ch([0, -0.01, 0])), K(0.58, ch([0, -0.03, 0])),
          K(0.6, ch([0, -0.003, 0])), K(0.72, g.G(glissiere)), K(0.8, g.G(plus(glissiere, [0, 0, 0.03]))), K(0.84, g.G(plus(glissiere, [-0.02, 0.0, 0.04]))), K(1)],
      },
      sons: [[0.15, 'chargeur_retire'], [0.6, 'chargeur_insere'], [0.86, 'clic']],
    };
  },
  // Mini-mitraillette : chargeur dans la poignée, puis on arme le levier du dessus
  uzi(g) {
    const P = poseRecharge([-0.06, 0.09, -0.06], [0.3, 0.35, -0.45]);
    const e = echangeChargeur(g, { prise: [0, -0.09, 0], debut: 0.1, sortie: 0.26, cache: 0.27, neuf: 0.36, dedans: 0.5, tape: 0.54, bas: [0, -0.2, 0.02], loin: [-0.04, -0.23, 0.03], arrivee: [0, -0.18, 0.03] });
    const levier = [0, 0.07, -0.08];
    return {
      pistes: {
        arme: [K(0), K(0.1, ...P()), K(0.5, ...P([0, -0.004, 0], [0.02, 0, -0.02]), { arret: 1 }), K(0.54, ...P([0, 0.012, 0.004], [0.08, 0, 0.02])),
          K(0.64, [-0.04, 0.05, -0.07], [0.2, 0.15, 0.1]), K(0.8, [-0.04, 0.05, -0.07], [0.2, 0.15, 0.12]), K(0.84, [-0.04, 0.05, -0.055], [0.26, 0.15, 0.12]), K(1)],
        chargeur: [...e.chargeur, K(1)],
        mainG: [K(0), ...e.mainG, K(0.66, g.G(levier)), K(0.72, g.G(levier), O, { arret: 1 }), K(0.84, g.G(plus(levier, [0, 0, 0.05]))), K(0.9, g.G(plus(levier, [0, 0.02, 0.05]))), K(1)],
      },
      sons: [[0.15, 'chargeur_retire'], [0.54, 'chargeur_insere'], [0.84, 'clic']],
    };
  },
  // Canon scié : on casse l'arme d'un coup sec, les douilles sautent, deux cartouches neuves, on referme vers le haut
  canon_scie(g) {
    const P = poseRecharge([-0.06, 0.07, -0.1], [-0.1, 0.25, 0.25]);
    return {
      pistes: {
        arme: [K(0), K(0.06, [-0.03, 0.04, -0.02], [0.15, 0.15, 0.2]), K(0.12, ...P()), K(0.2, ...P([0, 0.02, 0], [0.6, 0, 0])), K(0.3, ...P()),
          K(0.75, ...P([0, -0.004, 0], [-0.02, 0, 0.02]), { arret: 1 }), K(0.82, ...P([0, 0, 0], [-0.2, 0, -0.1])), K(0.88, [-0.03, 0.04, -0.02], [0.35, 0.1, 0]), K(1)],
        canons: [K(0), K(0.08), K(0.14, O, [-0.7, 0, 0]), K(0.86, O, [-0.7, 0, 0], { arret: 1 }), K(0.9), K(1)],
        munitionCanon: [K(0), K(0.18), K(0.26, [0, 0.03, 0.09], [0.8, 0, 0]), K(0.27, [0, 0.03, 0.09], O, { cache: 1 }), K(0.42, [0, 0, 0.08]), K(0.62), K(1)],
        mainG: [K(0), K(0.1, [0, -0.06, 0.05], O, { libre: 1 }), K(0.3, [0, -0.14, 0.05], O, { libre: 1 }), K(0.42, g.G([0, 0.075, 0.02])), K(0.62, g.G([0, 0.023, -0.04])),
          K(0.7, g.G([0, 0.03, -0.03])), K(0.8), K(1)],
      },
      sons: [[0.14, 'chargeur_retire'], [0.24, 'douille'], [0.28, 'douille'], [0.58, 'cartouche_insere'], [0.64, 'cartouche_insere'], [0.9, 'chargeur_insere']],
    };
  },
  // Lance-fusée : on casse l'arme, l'ancienne cartouche saute, on glisse la fusée neuve, on referme d'un coup
  lance_fusee(g) {
    const P = poseRecharge([-0.06, 0.07, -0.1], [-0.25, 0.25, 0.3]);
    return {
      pistes: {
        arme: [K(0), K(0.08, [-0.03, 0.03, -0.02], [0.15, 0.15, 0.3]), K(0.15, ...P()), K(0.6, ...P([0, -0.004, 0], [-0.02, 0, 0.02]), { arret: 1 }),
          K(0.78, ...P([0, 0, 0], [-0.1, -0.05, -0.2])), K(0.86, [-0.03, 0.04, -0.02], [0.3, 0.05, 0]), K(1)],
        canons: [K(0), K(0.1), K(0.16, O, [-0.7, 0, 0]), K(0.84, O, [-0.7, 0, 0], { arret: 1 }), K(0.88), K(1)],
        munitionCanon: [K(0), K(0.16), K(0.24, [0, 0.02, 0.07], [1.0, 0, 0]), K(0.25, [0, 0.02, 0.07], O, { cache: 1 }), K(0.42, [0, 0, 0.07]), K(0.6), K(1)],
        mainG: [K(0), K(0.12, [0, -0.08, 0.03], O, { libre: 1 }), K(0.32, [0, -0.14, 0.05], O, { libre: 1 }), K(0.42, g.G([0, 0.077, 0.03])), K(0.6, g.G([0, 0.032, -0.015])),
          K(0.68, g.G([0, 0.04, -0.01])), K(0.8), K(1)],
      },
      sons: [[0.16, 'chargeur_retire'], [0.24, 'douille'], [0.58, 'cartouche_insere'], [0.88, 'chargeur_insere']],
    };
  },
  // ----- Nouvelles armes -----
  // Pompe automatique : gros chargeur changé, puis la main tire le levier d'armement sur le dessus
  pompe_auto(g) {
    const P = poseRecharge([-0.08, 0.1, -0.06], [0.3, 0.45, -0.5]);
    const e = echangeChargeur(g, { prise: [0, -0.08, 0], bas: [0, -0.28, 0.03], loin: [-0.05, -0.32, 0.07], arrivee: [0, -0.26, 0.04] });
    const levier = [-0.035, 0.05, -0.2];
    return {
      pistes: {
        arme: [K(0), K(0.12, ...P()), K(0.4, ...P([0, -0.005, 0], [0.02, 0.02, -0.03]), { arret: 1 }), K(0.6, ...P()), K(0.64, ...P([0, 0.016, 0.005], [0.08, 0, 0.02])),
          K(0.7, ...P()), K(0.8, [-0.05, 0.06, -0.05], [0.12, 0.3, -0.25]), K(0.86, [-0.05, 0.055, -0.03], [0.08, 0.3, -0.27]), K(1)],
        chargeur: [...e.chargeur, K(1)],
        mainG: [K(0), ...e.mainG, K(0.76, g.G(levier)), K(0.82, g.G(plus(levier, [0, 0, 0.06]))), K(0.88, g.G(plus(levier, [0, -0.02, 0.02]))), K(1)],
      },
      sons: [[0.2, 'chargeur_retire'], [0.64, 'chargeur_insere'], [0.82, 'pompe_armement']],
    };
  },
  // Double canon : on casse l'arme d'un coup sec, les douilles sautent, deux cartouches neuves, on referme vers le haut
  double_canon(g) {
    const P = poseRecharge([-0.05, 0.05, -0.12], [0.35, 0.15, 0.3]);
    return {
      pistes: {
        arme: [K(0), K(0.06, [-0.03, 0.04, -0.02], [0.15, 0.15, 0.2]), K(0.12, ...P()), K(0.2, ...P([0, 0.02, 0], [0.3, 0, 0])), K(0.3, ...P()),
          K(0.75, ...P([0, -0.004, 0], [-0.02, 0, 0.02]), { arret: 1 }), K(0.82, ...P([0, 0, 0], [-0.2, 0, -0.1])), K(0.88, [-0.03, 0.04, -0.02], [0.35, 0.1, 0]), K(1)],
        canons: [K(0), K(0.08), K(0.14, O, [-0.7, 0, 0]), K(0.86, O, [-0.7, 0, 0], { arret: 1 }), K(0.9), K(1)],
        munitionCanon: [K(0), K(0.18), K(0.26, [0, 0.04, 0.11], [0.9, 0, 0]), K(0.27, [0, 0.04, 0.11], O, { cache: 1 }), K(0.4, [0, 0, 0.09]), K(0.6), K(1)],
        mainG: [K(0), K(0.1, [0, -0.06, 0.05], O, { libre: 1 }), K(0.3, [0, -0.14, 0.05], O, { libre: 1 }), K(0.4, g.G([0, 0.08, 0.03])), K(0.5, g.G([0, 0.025, -0.05])),
          K(0.53, g.G([0, 0.06, -0.02])), K(0.6, g.G([0, 0.025, -0.05])), K(0.7, g.G([0, 0.035, -0.04])), K(0.8), K(1)],
      },
      sons: [[0.14, 'chargeur_retire'], [0.24, 'douille'], [0.28, 'douille'], [0.5, 'cartouche_insere'], [0.6, 'cartouche_insere'], [0.9, 'chargeur_insere']],
    };
  },
  // Mitraillette rapide : coup de poignet, chargeur neuf, puis le levier d'armement sur le côté gauche
  vector(g) {
    const P = poseRecharge([-0.07, 0.09, -0.05], [0.3, 0.4, -0.45]);
    const e = echangeChargeur(g, { prise: [0, -0.09, 0], debut: 0.12, sortie: 0.3, cache: 0.31, neuf: 0.42, dedans: 0.58, tape: 0.62, bas: [0, -0.24, 0.02], loin: [-0.05, -0.28, 0.05], arrivee: [0, -0.22, 0.03] });
    const levier = [-0.03, 0.04, -0.06];
    return {
      pistes: {
        arme: [K(0), K(0.1, ...P()), K(0.2, ...P([0.02, 0.01, 0], [0, -0.1, 0.4])), K(0.3, ...P()), K(0.55, ...P([0, -0.004, 0], [0.02, 0, -0.02]), { arret: 1 }),
          K(0.62, ...P([0, 0.014, 0.004], [0.08, 0, 0.02])), K(0.7, ...P()), K(0.8, [-0.05, 0.06, -0.04], [0.1, 0.3, -0.2]), K(0.86, [-0.045, 0.055, -0.04], [0.08, 0.3, -0.25]), K(1)],
        chargeur: [...e.chargeur, K(1)],
        mainG: [K(0), ...e.mainG, K(0.76, g.G(levier)), K(0.82, g.G(plus(levier, [0, 0, 0.05]))), K(0.88, g.G(plus(levier, [-0.02, 0, 0.05]))), K(1)],
      },
      sons: [[0.18, 'chargeur_retire'], [0.62, 'chargeur_insere'], [0.82, 'clic']],
    };
  },
  // Fusil bullpup : l'arme loin devant, chargeur derrière la poignée, puis la main claque le levier vers l'arrière
  bullpup(g) {
    const P = poseRecharge([-0.11, 0.12, -0.14], [0.35, 0.65, -0.6]);
    const e = echangeChargeur(g, { prise: [0, -0.07, 0], debut: 0.13, sortie: 0.32, cache: 0.33, neuf: 0.44, dedans: 0.6, tape: 0.64, bas: [0, -0.22, 0.02], loin: [-0.05, -0.28, 0.02], arrivee: [0, -0.2, 0.03] });
    const levier = [-0.035, 0.04, -0.18];
    return {
      pistes: {
        arme: [K(0), K(0.12, ...P()), K(0.42, ...P([0, -0.005, 0], [0.02, 0, -0.02]), { arret: 1 }), K(0.6, ...P()), K(0.64, ...P([0, 0.014, 0.005], [0.07, 0, 0.02])),
          K(0.72, ...P()), K(0.8, [-0.05, 0.05, -0.06], [0.08, 0.25, -0.25]), K(0.86, [-0.05, 0.04, -0.06], [0.03, 0.25, -0.27]), K(1)],
        chargeur: [...e.chargeur, K(1)],
        mainG: [K(0), ...e.mainG, K(0.76, g.G(levier)), K(0.82, g.G(plus(levier, [0, 0, 0.07]))), K(0.86, g.G(plus(levier, [0, -0.02, 0.07]))), K(1)],
      },
      sons: [[0.2, 'chargeur_retire'], [0.64, 'chargeur_insere'], [0.82, 'clic']],
    };
  },
  // Lance-grenades : on penche l'arme, quatre grenades glissées une par une dans le tambour qui tourne d'un cran à chaque fois
  lance_grenades(g) {
    const P = poseRecharge([-0.06, 0.08, -0.06], [0.2, 0.4, 0.6]);
    const t = plus(g.repos('barillet'), [-0.06, 0.04, 0.05]);
    const mainG = [K(0)];
    const tambour = [K(0), K(0.15)];
    const sons = [[0.12, 'chargeur_retire']];
    for (let i = 0; i < 4; i++) {
      const d = 0.2 + i * 0.15;
      mainG.push(K(d, [0, -0.15, 0.06], O, { libre: 1 }), K(d + 0.07, g.G(plus(t, [0, 0, 0.04]))), K(d + 0.1, g.G(t)));
      tambour.push(K(d + 0.1, O, [0, 0, (i * Math.PI) / 3]), K(d + 0.14, O, [0, 0, ((i + 1) * Math.PI) / 3]));
      sons.push([d + 0.1, 'cartouche_insere'], [d + 0.14, 'clic']);
    }
    mainG.push(K(0.86), K(1));
    tambour.push(K(1, O, [0, 0, (4 * Math.PI) / 3]));
    return {
      pistes: {
        arme: [K(0), K(0.12, ...P()), K(0.8, ...P([0, -0.004, 0], [0.02, 0, 0.02]), { arret: 1 }), K(0.88, [-0.03, 0.04, -0.03], [0.1, 0.15, 0.1]), K(1)],
        barillet: tambour, mainG,
      },
      sons: [...sons, [0.88, 'chargeur_insere']],
    };
  },
  // Fusil à plasma : la cellule vide tombe, une neuve, puis une tape sur le dessus (ça se rallume)
  plasma(g) {
    const P = poseRecharge([-0.08, 0.09, -0.06], [0.3, 0.45, -0.5]);
    const e = echangeChargeur(g, { prise: [0, -0.06, 0], bas: [0, -0.24, 0.03], loin: [-0.05, -0.3, 0.06], arrivee: [0, -0.22, 0.04] });
    const dessus = [-0.02, 0.07, -0.08];
    return {
      pistes: {
        arme: [K(0), K(0.12, ...P()), K(0.4, ...P([0, -0.005, 0], [0.02, 0.02, -0.03]), { arret: 1 }), K(0.6, ...P()), K(0.64, ...P([0, 0.014, 0.004], [0.07, 0, 0.02])),
          K(0.72, ...P()), K(0.82, [-0.05, 0.05, -0.04], [0.12, 0.25, -0.2]), K(1)],
        chargeur: [...e.chargeur, K(1)],
        mainG: [K(0), ...e.mainG, K(0.76, g.G(plus(dessus, [0, 0.03, 0]))), K(0.82, g.G(dessus)), K(0.9), K(1)],
      },
      sons: [[0.2, 'chargeur_retire'], [0.64, 'chargeur_insere'], [0.82, 'apparition']],
    };
  },
  // Fusil anti-matériel : énorme chargeur changé, puis la main droite tire le gros levier d'armement
  anti_materiel(g) {
    const P = poseRecharge([-0.09, 0.1, -0.12], [0.3, 0.35, -0.55]);
    const e = echangeChargeur(g, { prise: [0, -0.06, 0], debut: 0.12, sortie: 0.3, cache: 0.31, neuf: 0.44, dedans: 0.6, tape: 0.64, bas: [0, -0.26, 0.03], loin: [-0.05, -0.32, 0.06], arrivee: [0, -0.24, 0.04] });
    const levier = [0.045, 0.05, -0.18]; const tire = [0.045, 0.05, -0.08];
    const C = poseRecharge([-0.04, 0.05, -0.1], [0.15, 0.3, 0.35]);
    return {
      pistes: {
        arme: [K(0), K(0.1, ...P()), K(0.42, ...P([0, -0.005, 0], [0.02, 0, -0.02]), { arret: 1 }), K(0.6, ...P()), K(0.64, ...P([0, 0.014, 0.005], [0.07, 0, 0.02])),
          K(0.72, ...C()), K(0.92, ...C([0, 0, 0], [0.02, 0, 0.02])), K(1)],
        chargeur: [...e.chargeur, K(1)],
        mainG: [K(0), ...e.mainG, K(1)],
        mainD: [K(0), K(0.72), K(0.78, g.D(levier)), K(0.84, g.D(tire)), K(0.88, g.D(levier)), K(0.94), K(1)],
      },
      sons: [[0.2, 'chargeur_retire'], [0.64, 'chargeur_insere'], [0.84, 'sniper_culasse'], [0.88, 'clic']],
    };
  },
  // Cloueuse : la bande vide glisse vers l'arrière, une bande pleine rentre et se verrouille
  cloueuse(g) {
    const P = poseRecharge([-0.06, 0.08, -0.06], [0.25, 0.4, -0.5]);
    const b = (d = O) => g.G(g.sur('chargeur', d, [0, -0.03, 0.25]));
    const dir = [0, -0.1, 0.28];
    return {
      pistes: {
        arme: [K(0), K(0.12, ...P()), K(0.75, ...P([0, -0.004, 0], [0.02, 0, -0.02]), { arret: 1 }), K(0.8, ...P([0, 0.01, 0.004], [0.06, 0, 0.02])),
          K(0.9, [-0.03, 0.03, -0.02], [0.1, 0.15, -0.1]), K(1)],
        chargeur: [K(0), K(0.16), K(0.32, dir), K(0.33, dir, O, { cache: 1 }), K(0.45, dir), K(0.7, [0, -0.005, 0.01]), K(0.76), K(1)],
        mainG: [K(0), K(0.13, b()), K(0.16, b(), O, { arret: 1 }), K(0.32, b(dir)), K(0.38, b(plus(dir, [-0.05, -0.04, 0.05]))), K(0.45, b(dir)), K(0.7, b([0, -0.005, 0.01])),
          K(0.76, b([0, 0.01, 0])), K(0.86), K(1)],
      },
      sons: [[0.2, 'chargeur_retire'], [0.74, 'chargeur_insere']],
    };
  },
  // Pistolet lourd : glissière bloquée en arrière, chargeur neuf, puis le pouce relâche la glissière (clac)
  pistolet_lourd(g) {
    const P = poseRecharge([-0.06, 0.09, -0.06], [0.3, 0.45, -0.4]);
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.05, 0]));
    const arret = [-0.018, 0.02, -0.02];
    return {
      pistes: {
        arme: [K(0), K(0.1, ...P()), K(0.4, ...P([0, -0.004, 0], [0.02, 0, -0.02]), { arret: 1 }), K(0.56, ...P()), K(0.6, ...P([0, 0.012, 0.004], [0.08, 0, 0.02])),
          K(0.72, [-0.04, 0.05, -0.05], [0.1, 0.25, 0.4]), K(0.84, [-0.04, 0.05, -0.05], [0.1, 0.25, 0.42]), K(0.88, [-0.04, 0.055, -0.045], [0.16, 0.25, 0.4]), K(1)],
        chargeur: [K(0), K(0.1), K(0.25, [0, -0.22, 0.04]), K(0.26, [0, -0.22, 0.04], O, { cache: 1 }), K(0.36, [0, -0.16, 0.05]), K(0.56, [0, -0.01, 0]), K(0.6), K(1)],
        culasse: [K(0), K(0.05, [0, 0, 0.04]), K(0.84, [0, 0, 0.04]), K(0.87), K(1)],
        mainG: [K(0), K(0.12, [0, -0.06, 0.02]), K(0.3, ch([0, -0.18, 0.05])), K(0.36, ch([0, -0.16, 0.05])), K(0.56, ch([0, -0.01, 0])), K(0.58, ch([0, -0.03, 0])),
          K(0.6, ch([0, -0.003, 0])), K(0.76, g.G(plus(arret, [-0.01, 0.01, 0]))), K(0.84, g.G(arret)), K(0.87, g.G(plus(arret, [0, -0.01, 0]))), K(1)],
      },
      sons: [[0.15, 'chargeur_retire'], [0.6, 'chargeur_insere'], [0.87, 'clic']],
    };
  },
  // Pistolet automatique : le long chargeur tombe, un neuf, puis la main arme la glissière par-dessus
  pistolet_auto(g) {
    const P = poseRecharge([-0.06, 0.1, -0.06], [0.3, 0.4, -0.45]);
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.11, 0.02]));
    const dessus = [-0.01, 0.05, -0.1];
    return {
      pistes: {
        arme: [K(0), K(0.1, ...P()), K(0.42, ...P([0, -0.004, 0], [0.02, 0, -0.02]), { arret: 1 }), K(0.58, ...P()), K(0.62, ...P([0, 0.012, 0.004], [0.08, 0, 0.02])),
          K(0.72, [-0.05, 0.06, -0.06], [0.15, 0.3, 0.3]), K(0.86, [-0.05, 0.06, -0.06], [0.15, 0.3, 0.32]), K(0.9, [-0.05, 0.065, -0.055], [0.2, 0.3, 0.3]), K(1)],
        chargeur: [K(0), K(0.1), K(0.26, [0, -0.26, 0.05]), K(0.27, [0, -0.26, 0.05], O, { cache: 1 }), K(0.38, [0, -0.2, 0.06]), K(0.58, [0, -0.01, 0]), K(0.62), K(1)],
        culasse: [K(0), K(0.74), K(0.82, [0, 0, 0.03]), K(0.86, [0, 0, 0.03]), K(0.88), K(1)],
        mainG: [K(0), K(0.12, [0, -0.07, 0.02]), K(0.32, ch([0, -0.22, 0.06])), K(0.38, ch([0, -0.2, 0.06])), K(0.58, ch([0, -0.01, 0])), K(0.6, ch([0, -0.03, 0])),
          K(0.62, ch([0, -0.003, 0])), K(0.74, g.G(dessus)), K(0.82, g.G(plus(dessus, [0, 0, 0.03]))), K(0.86, g.G(plus(dessus, [0, 0.02, 0.05]))), K(1)],
      },
      sons: [[0.15, 'chargeur_retire'], [0.62, 'chargeur_insere'], [0.88, 'clic']],
    };
  },
  // Mini-arbalète : pointée vers le ciel, la main tend la corde jusqu'au loquet, puis pose un carreau
  mini_arbalete(g) {
    const encoche = (k) => [0, 0.045, -0.19 + 0.15 * k];
    const milieu = plus(g.repos('munition'), [0, 0, -0.1]);
    const depart = [0, 0.04, 0.1];
    const B = [[-0.05, 0.03, -0.08], [0.5, 0.3, 0.2]];
    return {
      pistes: {
        arme: [K(0), K(0.12, ...B), K(0.55, B[0], plus(B[1], [-0.03, 0, 0])), K(0.62, [-0.05, 0.05, -0.06], [0.1, 0.3, 0.2]),
          K(0.88, [-0.05, 0.05, -0.06], [0.12, 0.3, 0.2], { arret: 1 }), K(1)],
        corde: [K(0, [0, 0, 0]), K(0.12, [0, 0, 0]), K(0.5, [1, 0, 0]), K(1, [1, 0, 0])],
        mainG: [K(0), K(0.1, g.G(encoche(0))), K(0.12, g.G(encoche(0)), O, { arret: 1 }), K(0.5, g.G(encoche(1))), K(0.55, g.G(encoche(1)), O, { arret: 1 }),
          K(0.62, g.G(plus(milieu, depart))), K(0.85, g.G(milieu)), K(0.88, g.G(milieu), O, { arret: 1 }), K(1)],
        munition: [K(0, O, O, { cache: 1 }), K(0.6, depart), K(0.85), K(1)],
      },
      sons: [[0.12, 'chargeur_retire'], [0.5, 'clic'], [0.85, 'chargeur_insere']],
    };
  },
  // Pistolet à eau : on enlève le réservoir, on le remplit (il gigote), on le remet, deux coups de pompe
  pistolet_eau(g) {
    const P = poseRecharge([-0.05, 0.06, -0.06], [0.15, 0.4, 0.4]);
    const t = (d = O) => g.G(g.sur('chargeur', d, [0, 0.04, 0]));
    const haut = [-0.04, 0.085, 0.0];
    const pompe = plus(g.repos('pompe'), [0, -0.05, -0.22]);
    return {
      pistes: {
        arme: [K(0), K(0.12, ...P()), K(0.62, ...P([0, -0.003, 0], [0.02, 0, 0.02]), { arret: 1 }), K(0.7, [-0.03, 0.03, -0.02], [0.1, 0.2, 0]), K(1)],
        chargeur: [K(0), K(0.15), K(0.3, haut, [0, 0, 0.3]), K(0.38, plus(haut, [0, 0.01, 0]), [0, 0, -0.3]), K(0.46, haut, [0, 0, 0.3]), K(0.54, plus(haut, [0, 0.01, 0]), [0, 0, -0.2]),
          K(0.66), K(1)],
        pompe: [K(0), K(0.72), K(0.78, [0, 0, 0.05]), K(0.84), K(0.9, [0, 0, 0.05]), K(0.96), K(1)],
        mainG: [K(0), K(0.12, t()), K(0.15, t(), O, { arret: 1 }), K(0.3, t(haut)), K(0.38, t(plus(haut, [0, 0.01, 0]))), K(0.46, t(haut)), K(0.54, t(plus(haut, [0, 0.01, 0]))),
          K(0.66, t()), K(0.7, g.G(pompe)), K(0.78, g.G(plus(pompe, [0, 0, 0.05]))), K(0.84, g.G(pompe)), K(0.9, g.G(plus(pompe, [0, 0, 0.05]))), K(0.96, g.G(pompe)), K(1)],
      },
      sons: [[0.3, 'clic'], [0.42, 'eau'], [0.66, 'chargeur_insere'], [0.78, 'pompe_armement'], [0.9, 'pompe_armement']],
    };
  },
  // Canon à trou noir : la cellule d'énergie violette sort par le bas, une neuve, l'orbe se rallume
  trou_noir(g) {
    const P = poseRecharge([-0.08, 0.09, -0.08], [0.3, 0.5, -0.5]);
    const e = echangeChargeur(g, { prise: [0, -0.05, 0], bas: [0, -0.26, 0.03], loin: [-0.05, -0.32, 0.06], arrivee: [0, -0.24, 0.04] });
    return {
      pistes: {
        arme: [K(0), K(0.12, ...P()), K(0.4, ...P([0, -0.005, 0], [0.02, 0.02, -0.03]), { arret: 1 }), K(0.6, ...P()), K(0.64, ...P([0, 0.016, 0.005], [0.08, 0, 0.02])),
          K(0.72, ...P()), K(0.85, [-0.04, 0.05, -0.04], [0.2, 0.3, -0.2]), K(1)],
        chargeur: [...e.chargeur, K(1)],
        mainG: [K(0), ...e.mainG, K(0.8), K(1)],
      },
      sons: [[0.2, 'chargeur_retire'], [0.64, 'chargeur_insere'], [0.7, 'apparition']],
    };
  },
  // Minigun : on change la grosse boîte de munitions, on pose la bande, puis on relance les canons à la main
  minigun(g) {
    const P = poseRecharge([-0.06, 0.08, -0.06], [0.2, 0.3, -0.35]);
    const b = (d = O) => g.G(g.sur('chargeur', d, [-0.03, 0.0, 0]));
    return {
      pistes: {
        arme: [K(0), K(0.1, ...P()), K(0.6, ...P([0, -0.004, 0], [0, 0, -0.02]), { arret: 1 }), K(0.66, ...P([0, 0.012, 0], [0.04, 0, 0.02])), K(0.75, ...P()),
          K(0.85, [-0.04, 0.05, -0.05], [0.1, 0.15, 0.1]), K(1)],
        chargeur: [K(0), K(0.15), K(0.3, [-0.06, -0.3, 0.02], [0, 0, 0.3]), K(0.31, [-0.06, -0.3, 0.02], [0, 0, 0.3], { cache: 1 }), K(0.4, [-0.06, -0.28, 0.02], [0, 0, 0.2]),
          K(0.6, [0, -0.008, 0]), K(0.64), K(1)],
        mainG: [K(0), K(0.12, b()), K(0.15, b(), O, { arret: 1 }), K(0.3, b([-0.06, -0.3, 0.02])), K(0.35, b([-0.1, -0.34, 0])), K(0.4, b([-0.06, -0.28, 0.02])),
          K(0.6, b([0, -0.008, 0])), K(0.64, b([0, 0.01, 0])), K(0.72, g.G([0, 0.03, -0.2])), K(0.8, g.G([0.03, 0.03, -0.22])), K(0.88), K(1)],
      },
      sons: [[0.18, 'chargeur_retire'], [0.64, 'chargeur_insere'], [0.78, 'minigun_rotor']],
    };
  },
  // Lance-feux d'artifice : la main amène une nouvelle fusée par l'avant et la glisse dans le tube
  feu_artifice(g) {
    const R = (d) => g.G(plus(plus(g.repos('munition'), [0, 0.03, -0.08]), d));
    const pose = [[-0.05, -0.03, -0.04], [0.6, 0.35, 0.2]];
    return {
      pistes: {
        arme: [K(0), K(0.14, ...pose), K(0.75, pose[0], plus(pose[1], [-0.02, 0, 0]), { arret: 1 }), K(0.82, plus(pose[0], [0, 0.01, 0]), plus(pose[1], [0.04, 0, -0.1])),
          K(0.9, ...pose), K(1)],
        munition: [K(0, [0, 0.3, -0.05], O, { cache: 1 }), K(0.3, [0, 0.3, -0.05]), K(0.55, [0, 0, -0.12]), K(0.75), K(1)],
        mainG: [K(0), K(0.15, [0, -0.1, 0.1], O, { libre: 1 }), K(0.3, R([0, 0.3, -0.05])), K(0.55, R([0, 0, -0.12])), K(0.75, R(O)), K(0.85), K(1)],
      },
      sons: [[0.6, 'chargeur_retire'], [0.75, 'chargeur_insere'], [0.82, 'clic']],
    };
  },
  // Rayon anti-gravité : la cellule glisse hors de la poignée, une neuve, l'arme vibre en se rechargeant
  rayon_lev(g) {
    const P = poseRecharge([-0.06, 0.09, -0.06], [0.3, 0.4, -0.45]);
    const ch = (d = O) => g.G(g.sur('chargeur', d, [0, -0.04, 0]));
    return {
      pistes: {
        arme: [K(0), K(0.1, ...P()), K(0.42, ...P([0, -0.004, 0], [0.02, 0, -0.02]), { arret: 1 }), K(0.58, ...P()), K(0.62, ...P([0, 0.012, 0.004], [0.08, 0, 0.02])),
          K(0.7, ...P()), K(0.75, ...P([0.004, 0, 0], [0, 0, 0.05])), K(0.8, ...P([-0.004, 0, 0], [0, 0, -0.05])), K(0.85, ...P()), K(1)],
        chargeur: [K(0), K(0.1), K(0.25, [0, -0.2, 0.04]), K(0.26, [0, -0.2, 0.04], O, { cache: 1 }), K(0.36, [0, -0.15, 0.05]), K(0.58, [0, -0.01, 0]), K(0.62), K(1)],
        mainG: [K(0), K(0.12, [0, -0.06, 0.02]), K(0.3, ch([0, -0.17, 0.05])), K(0.36, ch([0, -0.15, 0.05])), K(0.58, ch([0, -0.01, 0])), K(0.6, ch([0, -0.03, 0])),
          K(0.62, ch([0, -0.003, 0])), K(0.8), K(1)],
      },
      sons: [[0.15, 'chargeur_retire'], [0.62, 'chargeur_insere'], [0.75, 'apparition']],
    };
  },
};

// Animation d'origine d'une arme pour un moment ('inspecter' ou 'recharge'), ou null.
// u = userData du modèle affiché (elle est recalculée si la pièce réaliste arrive après coup).
export function animationOrigine(arme, cle, u) {
  const table = cle === 'inspecter' ? INSPECTIONS : cle === 'recharge' ? RECHARGES : null;
  const fabrique = table && table[arme.id];
  if (!fabrique || !u || !u.mainD) return null;
  const dec = ['chargeur', 'munition'].map((n) => (u[n] && u[n].userData.decalageMain ? u[n].userData.decalageMain.toArray().join() : '')).join('|');
  const signature = `${cle}:${dec}:${arme.rechargementMs || 0}`;
  u._origine = u._origine || {};
  const deja = u._origine[cle];
  if (deja && deja.signature === signature) return deja.anim;
  let anim = fabrique(geometrie(u));
  if (cle === 'recharge') {
    if (!(arme.rechargementMs > 0)) return null;
    anim = aDuree(anim, arme.rechargementMs / 1000);
  } else anim = { mouvement: 'fluide', sons: [], ...anim };
  u._origine[cle] = { signature, anim };
  return anim;
}

// Durée de l'inspection propre à une arme (en secondes), ou 0 (sans avoir besoin du modèle)
const FAUSSE = { G: () => [0, 0, 0], D: () => [0, 0, 0], sur: () => [0, 0, 0], repos: () => [0, 0, 0] };
export function dureeInspection(armeId) {
  const f = INSPECTIONS[armeId];
  return f ? f(FAUSSE).duree : 0;
}

// Liste des armes qui ont leur propre animation pour ce moment (pour l'atelier et les tests)
export function armesAvecOrigine(cle) {
  return Object.keys(cle === 'inspecter' ? INSPECTIONS : RECHARGES);
}
