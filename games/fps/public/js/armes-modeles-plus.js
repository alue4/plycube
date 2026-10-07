// Modèles 3D des nouvelles armes (et de leurs projectiles en vol), dans le même style que armes-modeles.js :
// des boîtes et des cylindres, en mètres, l'arme pointe vers -z et l'origine est à la poignée.
// Les outils (boite, cylindre, lunette, matières M...) sont ceux d'armes-modeles.js : ils sont passés
// en paramètre, pour que les deux fichiers ne s'importent pas l'un l'autre.
// Pièces animées (userData) : comme dans armes-modeles.js (chargeur, culasse, barillet, canons, munition, objet...),
// plus quelques effets lumineux animés dans arme.js : rotor (minigun), orbeNoire / anneauNoir (trou noir),
// arcsTesla, runes / arcsThor (marteau de Thor), lameLaser (sabre laser), lueurs (plasma, rayon anti-gravité),
// lumiere (mine, balise des météores : petite lumière qui clignote).

export function fabriquesNouvelles({ THREE, M, phong, boite, cylindre, lunette, holo, mires, textureLueur }) {
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const lumineux = (couleur, opacite = 0.9) => new THREE.MeshBasicMaterial({
    color: couleur, transparent: true, opacity: opacite, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const plein = (couleur) => new THREE.MeshBasicMaterial({ color: couleur });
  const sphere = (parent, r, x, y, z, mat, segments = 14) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, segments, Math.max(6, Math.round(segments * 0.7))), mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const tore = (parent, r, epaisseur, x, y, z, mat, rx = 0, ry = 0) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, epaisseur, 8, 32), mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, 0);
    parent.add(m);
    return m;
  };
  const cone = (parent, r, h, x, y, z, mat, segments = 12) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, segments), mat);
    m.rotation.x = -Math.PI / 2; // pointe vers -z
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const halo = (parent, couleur, taille, x, y, z) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureLueur(), color: couleur, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    s.position.set(x, y, z);
    s.scale.setScalar(taille);
    parent.add(s);
    return s;
  };
  // Petits éclairs (une ligne brisée qu'arme.js redessine au hasard)
  const ligneEclair = (parent, points, couleur) => {
    const l = new THREE.Line(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * points), 3)),
      new THREE.LineBasicMaterial({ color: couleur, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
    l.frustumCulled = false;
    l.visible = false;
    parent.add(l);
    return l;
  };

  const N = {
    jaune: phong(0xf2b705, 25, 0x332200),
    orangeJouet: phong(0xff7a1a, 35, 0x332211),
    bleuJouet: phong(0x1e88ff, 45, 0x223344),
    vertJouet: phong(0x2ecc71, 45, 0x113322),
    chrome: phong(0xd9dde3, 140, 0xffffff),
    cuivre: phong(0xc8742f, 90, 0x664422),
    bleuNuit: phong(0x1b2440, 50, 0x334466),
    blancSF: phong(0xe9edf2, 60, 0x555555),
    violetSombre: phong(0x2a1640, 55, 0x553377),
    rougeHache: phong(0xc0281f, 30, 0x330000),
    cuir: phong(0x5a3a22, 10, 0x110a05),
    or: phong(0xe0b23a, 90, 0x886622),
    rose: phong(0xff4fa8, 30, 0x331122),
    eau: new THREE.MeshPhongMaterial({ color: 0x3fb4ff, transparent: true, opacity: 0.55, shininess: 120, specular: 0xffffff, depthWrite: false }),
    plastiqueTranslucide: new THREE.MeshPhongMaterial({ color: 0x8a96a3, transparent: true, opacity: 0.8, shininess: 60 }),
    pierre: new THREE.MeshPhongMaterial({ color: 0x4a3426, shininess: 4, flatShading: true }),
  };

  // ======================================================================================
  // Principales
  // ======================================================================================

  // Fusil à pompe automatique : gros boîtier carré, chargeur droit, protège-main ajouré
  function pompeAuto() {
    const g = new THREE.Group();
    boite(g, 0.062, 0.1, 0.36, 0, 0.0, -0.08, M.polymere);               // boîtier
    boite(g, 0.064, 0.02, 0.36, 0, 0.06, -0.08, M.noir);                 // dessus
    boite(g, 0.03, 0.012, 0.3, 0, 0.076, -0.1, M.gris);                  // rail
    holo(g, 0.104, -0.1);
    cylindre(g, 0.016, 0.26, 0, 0.02, -0.38, M.noir);                    // canon
    cylindre(g, 0.026, 0.2, 0, 0.02, -0.36, M.grisClair, { ouvert: true, segments: 10 }); // protège-main ajouré
    for (let i = 0; i < 4; i++) cylindre(g, 0.027, 0.008, 0, 0.02, -0.29 - i * 0.045, M.noir, { segments: 10 });
    cylindre(g, 0.026, 0.06, 0, 0.02, -0.53, M.noir, { segments: 8 });   // frein de bouche
    for (let i = 0; i < 3; i++) boite(g, 0.03, 0.006, 0.008, 0, 0.044, -0.515 - i * 0.015, M.tubeInterieur);
    const chargeur = new THREE.Group();
    chargeur.position.set(0, -0.05, -0.12);
    boite(chargeur, 0.05, 0.14, 0.11, 0, -0.07, 0, M.noir, 0.1);
    boite(chargeur, 0.054, 0.014, 0.114, 0, -0.142, -0.007, M.gris, 0.1);
    g.add(chargeur);
    boite(g, 0.034, 0.1, 0.046, 0, -0.09, 0.06, M.polymere, -0.28);      // poignée
    boite(g, 0.006, 0.02, 0.05, 0, -0.06, 0.0, M.noir);                  // pontet
    boite(g, 0.03, 0.08, 0.04, 0, -0.08, -0.3, M.polymere, 0.15);        // poignée avant
    boite(g, 0.05, 0.09, 0.2, 0, -0.01, 0.24, M.polymere);               // crosse
    boite(g, 0.054, 0.1, 0.02, 0, -0.01, 0.345, M.caoutchouc);
    Object.assign(g.userData, {
      bout: V(0, 0.02, -0.57), visee: V(0, 0.104, -0.06), oeil: 0.18,
      ejection: V(0.035, 0.03, -0.05), mainD: V(0, -0.085, 0.07), mainG: V(0, -0.07, -0.3),
      hanche: V(0.15, -0.17, -0.37), chargeur, flash: 0.28,
    });
    return g;
  }

  // Fusil à double canon (canons côte à côte, crosse en bois) : il se casse en deux pour recharger
  function doubleCanon() {
    const g = new THREE.Group();
    boite(g, 0.034, 0.09, 0.05, 0, -0.045, 0.04, M.bois, -0.35);         // col de la crosse (poignée)
    boite(g, 0.046, 0.045, 0.1, 0, 0.012, -0.02, M.acier);               // bascule
    boite(g, 0.047, 0.03, 0.06, 0, 0.012, -0.02, M.grisClair);           // gravures (bande claire)
    boite(g, 0.006, 0.016, 0.045, 0, -0.016, 0.0, M.noir);               // pontet
    boite(g, 0.003, 0.014, 0.004, 0, -0.014, -0.012, M.laiton);          // deux détentes
    boite(g, 0.003, 0.014, 0.004, 0, -0.014, 0.006, M.laiton);
    boite(g, 0.01, 0.016, 0.012, 0, 0.042, 0.03, M.noir, 0.3);           // clé d'ouverture
    const canons = new THREE.Group();                                    // les canons (basculent vers le bas)
    canons.position.set(0, 0.014, -0.07);
    for (const x of [-0.0135, 0.0135]) cylindre(canons, 0.0135, 0.56, x, 0.012, -0.28, M.noir, { segments: 12 });
    boite(canons, 0.012, 0.006, 0.54, 0, 0.026, -0.29, M.noir);          // bande de visée
    boite(canons, 0.046, 0.032, 0.21, 0, -0.012, -0.13, M.bois);         // devant en bois
    const guidon = new THREE.Mesh(new THREE.SphereGeometry(0.003, 8, 6), M.laiton);
    guidon.position.set(0, 0.031, -0.555);
    canons.add(guidon);
    const munition = new THREE.Group();                                   // culots des cartouches
    for (const x of [-0.0135, 0.0135]) cylindre(munition, 0.012, 0.006, x, 0.012, 0.003, M.laiton, { segments: 12 });
    canons.add(munition);
    g.add(canons);
    boite(g, 0.042, 0.075, 0.3, 0, -0.06, 0.24, M.bois, 0.14);           // crosse
    boite(g, 0.044, 0.1, 0.02, 0, -0.085, 0.39, M.caoutchouc, 0.14);
    Object.assign(g.userData, {
      bout: V(0, 0.026, -0.63), visee: V(0, 0.046, 0.06), oeil: 0.26,
      ejection: null, mainD: V(0, -0.06, 0.05), mainG: V(0, -0.012, -0.2),
      hanche: V(0.15, -0.16, -0.36), canons, munitionCanon: munition, flash: 0.32,
    });
    return g;
  }

  // Mitraillette rapide : bloc incliné couleur sable, crosse repliable, viseur holo
  function vector() {
    const g = new THREE.Group();
    boite(g, 0.05, 0.075, 0.26, 0, 0.02, -0.06, M.noir);                 // boîtier supérieur
    boite(g, 0.046, 0.1, 0.12, 0, -0.035, -0.11, M.tan, 0.35);           // bloc incliné (la signature de l'arme)
    boite(g, 0.056, 0.05, 0.14, 0, 0.012, -0.24, M.tan);                 // garde-main
    cylindre(g, 0.01, 0.09, 0, 0.012, -0.34, M.noir);                    // canon
    cylindre(g, 0.016, 0.05, 0, 0.012, -0.39, M.gris, { segments: 8 });  // compensateur
    boite(g, 0.03, 0.012, 0.26, 0, 0.064, -0.08, M.gris);                // rail
    holo(g, 0.092, -0.08);
    const chargeur = new THREE.Group();
    chargeur.position.set(0, -0.05, -0.02);
    boite(chargeur, 0.026, 0.15, 0.04, 0, -0.075, 0, M.noir, 0.05);
    boite(chargeur, 0.03, 0.012, 0.044, 0, -0.152, -0.004, M.tan, 0.05);
    g.add(chargeur);
    boite(g, 0.032, 0.1, 0.045, 0, -0.08, 0.065, M.tan, -0.25);          // poignée
    boite(g, 0.006, 0.018, 0.045, 0, -0.045, 0.015, M.noir);             // pontet
    boite(g, 0.03, 0.07, 0.035, 0, -0.04, -0.25, M.noir, 0.1);           // poignée avant
    boite(g, 0.03, 0.03, 0.2, 0, 0.02, 0.17, M.noir);                    // crosse repliable
    boite(g, 0.034, 0.09, 0.02, 0, -0.005, 0.27, M.caoutchouc);
    Object.assign(g.userData, {
      bout: V(0, 0.012, -0.415), visee: V(0, 0.092, -0.04), oeil: 0.18,
      ejection: V(0.03, 0.03, -0.04), mainD: V(0, -0.075, 0.07), mainG: V(0, -0.06, -0.25),
      hanche: V(0.14, -0.155, -0.33), chargeur, flash: 0.15,
    });
    return g;
  }

  // Fusil bullpup : corps vert arrondi, lunette intégrée, chargeur translucide derrière la poignée
  function bullpup() {
    const g = new THREE.Group();
    boite(g, 0.056, 0.085, 0.56, 0, -0.005, 0.02, M.olive);              // corps
    cylindre(g, 0.03, 0.5, 0, 0.034, 0.03, M.olive, { segments: 14 });   // dos arrondi
    cylindre(g, 0.012, 0.22, 0, 0.02, -0.37, M.noir);                    // canon
    cylindre(g, 0.017, 0.05, 0, 0.02, -0.49, M.gris, { segments: 8 });   // cache-flamme
    boite(g, 0.032, 0.03, 0.09, 0, 0.065, -0.08, M.olive);               // pont de la lunette
    lunette(g, { y: 0.1, zArriere: 0.03, longueur: 0.17, r: 0.019, rAvant: 0.026, rOeil: 0.021 });
    boite(g, 0.0016, 0.006, 0.0016, 0, 0.097, -0.17, M.reticule);
    boite(g, 0.004, 0.0016, 0.0016, 0, 0.1, -0.17, M.reticule);
    boite(g, 0.026, 0.09, 0.03, 0, -0.09, -0.2, M.olive, 0.15);          // poignée avant verticale
    boite(g, 0.034, 0.1, 0.045, 0, -0.085, -0.04, M.olive, -0.25);       // poignée
    boite(g, 0.062, 0.016, 0.14, 0, -0.05, -0.07, M.olive);              // pontet intégral
    const chargeur = new THREE.Group();
    chargeur.position.set(0, -0.045, 0.11);
    boite(chargeur, 0.028, 0.13, 0.065, 0, -0.065, 0, N.plastiqueTranslucide, 0.1);
    boite(chargeur, 0.012, 0.11, 0.024, 0, -0.06, 0, M.laiton, 0.1);     // les cartouches qu'on voit dedans
    g.add(chargeur);
    boite(g, 0.06, 0.1, 0.02, 0, -0.005, 0.31, M.caoutchouc);
    Object.assign(g.userData, {
      bout: V(0, 0.02, -0.52), visee: V(0, 0.1, 0.06), oeil: 0.12,
      ejection: V(0.035, 0.02, 0.1), mainD: V(0, -0.08, -0.03), mainG: V(0, -0.1, -0.2),
      hanche: V(0.15, -0.17, -0.38), chargeur, flash: 0.2,
    });
    return g;
  }

  // Lance-grenades à tambour (6 chambres qui tournent), canon court et gros
  function lanceGrenades() {
    const g = new THREE.Group();
    cylindre(g, 0.031, 0.22, 0, 0.03, -0.31, M.olive, { segments: 16 }); // canon
    cylindre(g, 0.026, 0.005, 0, 0.03, -0.421, M.tubeInterieur, { segments: 16 });
    cylindre(g, 0.034, 0.03, 0, 0.03, -0.41, M.noir, { segments: 16 });  // bouche
    const barillet = new THREE.Group();                                  // le tambour
    barillet.position.set(0, -0.008, -0.12);
    cylindre(barillet, 0.064, 0.15, 0, 0, 0, M.olive, { segments: 18 });
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 2;
      cylindre(barillet, 0.021, 0.152, Math.cos(a) * 0.04, Math.sin(a) * 0.04, 0, M.noir, { segments: 10 });
      cylindre(barillet, 0.019, 0.004, Math.cos(a) * 0.04, Math.sin(a) * 0.04, 0.077, M.laiton, { segments: 10 }); // culots
    }
    cylindre(barillet, 0.066, 0.01, 0, 0, -0.07, M.noir, { segments: 18 });
    g.add(barillet);
    boite(g, 0.04, 0.03, 0.36, 0, 0.076, -0.14, M.noir);                 // cadre du dessus
    boite(g, 0.03, 0.025, 0.08, 0, -0.08, -0.12, M.noir);                // axe sous le tambour
    boite(g, 0.05, 0.11, 0.16, 0, 0.007, 0.01, M.noir);                  // corps (relie le tambour, la poignée et la crosse)
    boite(g, 0.052, 0.012, 0.12, 0, -0.03, 0.0, M.olive);                // bande sur le corps
    holo(g, 0.115, -0.12);
    boite(g, 0.034, 0.1, 0.046, 0, -0.07, 0.05, M.polymere, -0.25);      // poignée
    boite(g, 0.006, 0.018, 0.05, 0, -0.06, -0.01, M.noir);               // pontet
    boite(g, 0.028, 0.034, 0.07, 0, -0.012, -0.33, M.noir);              // attache de la poignée avant (sous le canon)
    boite(g, 0.03, 0.08, 0.035, 0, -0.06, -0.33, M.polymere, 0.1);       // poignée avant
    boite(g, 0.034, 0.05, 0.18, 0, 0.005, 0.17, M.noir);                 // crosse
    boite(g, 0.04, 0.1, 0.02, 0, -0.012, 0.26, M.caoutchouc);
    Object.assign(g.userData, {
      bout: V(0, 0.03, -0.43), visee: V(0, 0.115, -0.08), oeil: 0.2,
      ejection: null, mainD: V(0, -0.07, 0.05), mainG: V(0, -0.05, -0.33),
      hanche: V(0.15, -0.15, -0.36), barillet, flash: 0.3,
    });
    return g;
  }

  // Fusil à plasma : corps blanc de science-fiction, bobines lumineuses autour du canon, cellule d'énergie
  function plasma() {
    const g = new THREE.Group();
    const cyan = plein(0x39e0ff);
    boite(g, 0.06, 0.07, 0.34, 0, 0.005, -0.05, N.blancSF);              // corps
    boite(g, 0.062, 0.03, 0.22, 0, 0.05, -0.08, N.bleuNuit);             // dessus
    boite(g, 0.064, 0.008, 0.3, 0, -0.012, -0.05, cyan);                 // bandes lumineuses sur les côtés
    cylindre(g, 0.016, 0.3, 0, 0.01, -0.33, N.bleuNuit, { segments: 12 }); // canon
    const lueurs = [];
    for (let i = 0; i < 4; i++) lueurs.push(tore(g, 0.03, 0.006, 0, 0.01, -0.24 - i * 0.055, lumineux(0x5ff6ff)));
    cylindre(g, 0.028, 0.045, 0, 0.01, -0.5, N.blancSF, { r2: 0.02, segments: 16 }); // émetteur
    lueurs.push(sphere(g, 0.012, 0, 0.01, -0.525, lumineux(0x9ffbff)));
    const chargeur = new THREE.Group();
    chargeur.position.set(0, -0.03, -0.06);
    boite(chargeur, 0.03, 0.08, 0.06, 0, -0.04, 0, N.bleuNuit);
    boite(chargeur, 0.032, 0.05, 0.026, 0, -0.04, 0, cyan);              // fenêtre qui brille
    g.add(chargeur);
    boite(g, 0.032, 0.1, 0.045, 0, -0.085, 0.07, N.bleuNuit, -0.3);      // poignée
    boite(g, 0.006, 0.02, 0.05, 0, -0.055, 0.02, N.bleuNuit);
    boite(g, 0.05, 0.08, 0.16, 0, 0.0, 0.24, N.blancSF);                 // crosse
    boite(g, 0.052, 0.03, 0.17, 0, 0.045, 0.24, N.bleuNuit);
    holo(g, 0.088, -0.06);
    Object.assign(g.userData, {
      bout: V(0, 0.01, -0.53), visee: V(0, 0.088, -0.02), oeil: 0.18,
      ejection: null, mainD: V(0, -0.08, 0.06), mainG: V(0, -0.025, -0.19),
      hanche: V(0.15, -0.165, -0.36), chargeur, flash: 0.1, lueurs,
    });
    return g;
  }

  // Fusil anti-matériel : énorme, long canon, frein de bouche double, grande lunette, bipied
  function antiMateriel() {
    const g = new THREE.Group();
    boite(g, 0.062, 0.1, 0.5, 0, 0.0, -0.12, M.noir);                    // boîtier
    boite(g, 0.066, 0.03, 0.5, 0, 0.065, -0.12, M.gris);                 // boîtier supérieur
    boite(g, 0.03, 0.012, 0.44, 0, 0.086, -0.1, M.gris);                 // rail
    for (let i = 0; i < 5; i++) boite(g, 0.068, 0.04, 0.012, 0, 0.0, -0.28 - i * 0.03, M.tubeInterieur); // aérations
    cylindre(g, 0.017, 0.72, 0, 0.03, -0.73, M.noir);                    // canon
    boite(g, 0.08, 0.056, 0.03, 0, 0.03, -1.07, M.noir);                 // frein de bouche (deux chicanes)
    boite(g, 0.08, 0.056, 0.03, 0, 0.03, -1.13, M.noir);
    cylindre(g, 0.02, 0.1, 0, 0.03, -1.1, M.noir, { segments: 10 });
    cylindre(g, 0.006, 0.32, 0.02, -0.035, -0.56, M.noir, { segments: 6 }); // bipied replié
    cylindre(g, 0.006, 0.32, -0.02, -0.035, -0.56, M.noir, { segments: 6 });
    const chargeur = new THREE.Group();
    chargeur.position.set(0, -0.05, -0.08);
    boite(chargeur, 0.04, 0.1, 0.12, 0, -0.05, 0, M.noir);
    boite(chargeur, 0.042, 0.012, 0.122, 0, -0.1, 0, M.gris);
    g.add(chargeur);
    boite(g, 0.034, 0.1, 0.05, 0, -0.09, 0.1, M.polymere, -0.3);         // poignée
    boite(g, 0.006, 0.02, 0.05, 0, -0.06, 0.05, M.noir);
    boite(g, 0.05, 0.11, 0.24, 0, -0.01, 0.3, M.noir);                   // crosse
    boite(g, 0.052, 0.04, 0.12, 0, 0.06, 0.28, M.noir);                  // appui-joue
    boite(g, 0.06, 0.13, 0.03, 0, -0.02, 0.44, M.caoutchouc);
    boite(g, 0.03, 0.04, 0.025, 0, 0.105, -0.16, M.noir);                // colliers de la lunette
    boite(g, 0.03, 0.04, 0.025, 0, 0.105, 0.0, M.noir);
    lunette(g, { y: 0.14, zArriere: 0.1, longueur: 0.36, r: 0.021, rAvant: 0.034, rOeil: 0.026 });
    cylindre(g, 0.012, 0.03, 0, 0.168, -0.06, M.noir, { axe: 'y', segments: 10 }); // tourelles
    cylindre(g, 0.012, 0.03, 0.028, 0.14, -0.06, M.noir, { axe: 'x', segments: 10 });
    Object.assign(g.userData, {
      bout: V(0, 0.03, -1.15), visee: V(0, 0.14, 0.13), oeil: 0.07,
      ejection: V(0.035, 0.04, -0.05), mainD: V(0, -0.09, 0.1), mainG: V(0, -0.05, -0.3),
      hanche: V(0.17, -0.19, -0.44), chargeur, lunette: true, flash: 0.42,
    });
    return g;
  }

  // Cloueuse : un outil de chantier jaune, bande de clous inclinée, batterie à l'arrière
  function cloueuse() {
    const g = new THREE.Group();
    boite(g, 0.046, 0.09, 0.22, 0, 0.015, -0.07, N.jaune);               // corps
    cylindre(g, 0.033, 0.22, 0, 0.045, -0.07, N.jaune, { segments: 16 }); // dessus arrondi (moteur)
    boite(g, 0.04, 0.012, 0.09, 0, 0.078, -0.05, M.noir);                // capot
    for (let i = 0; i < 4; i++) boite(g, 0.068, 0.006, 0.008, 0, 0.045, 0.0 - i * 0.02, M.noir); // aérations
    boite(g, 0.032, 0.12, 0.05, 0, -0.07, 0.06, M.noir, -0.25);          // poignée en caoutchouc
    boite(g, 0.008, 0.02, 0.012, 0, -0.03, 0.015, M.rougeVif);           // gâchette rouge
    boite(g, 0.026, 0.1, 0.034, 0, -0.025, -0.2, M.noir);                // nez
    boite(g, 0.032, 0.02, 0.05, 0, -0.075, -0.205, M.acier);             // palpeur
    const chargeur = new THREE.Group();                                  // la bande de clous
    chargeur.position.set(0, -0.06, -0.17);
    boite(chargeur, 0.022, 0.034, 0.3, 0, 0, 0.13, M.noir, 0.32);
    boite(chargeur, 0.012, 0.03, 0.27, 0, 0.012, 0.125, M.acier, 0.32);
    g.add(chargeur);
    boite(g, 0.06, 0.06, 0.08, 0, -0.125, 0.1, M.noir);                  // batterie
    boite(g, 0.062, 0.02, 0.082, 0, -0.1, 0.1, N.jaune);
    boite(g, 0.004, 0.012, 0.004, 0, 0.084, -0.15, M.noir);              // petite mire
    boite(g, 0.016, 0.01, 0.004, 0, 0.084, 0.03, M.noir);
    Object.assign(g.userData, {
      bout: V(0, -0.045, -0.24), visee: V(0, 0.09, 0.04), oeil: 0.26,
      ejection: null, mainD: V(0, -0.07, 0.06), mainG: V(-0.035, 0.035, -0.12),
      hanche: V(0.15, -0.15, -0.37), chargeur, flash: 0.06,
    });
    return g;
  }

  // ======================================================================================
  // Secondaires
  // ======================================================================================

  // Pistolet lourd : grosse glissière chromée, canon triangulaire
  function pistoletLourd() {
    const g = new THREE.Group();
    boite(g, 0.03, 0.11, 0.046, 0, -0.045, 0.02, M.polymere, -0.22);     // poignée
    const chargeur = new THREE.Group();
    chargeur.position.set(0, -0.065, 0.025);
    boite(chargeur, 0.024, 0.085, 0.034, 0, -0.012, 0, M.noir, -0.22);
    boite(chargeur, 0.028, 0.008, 0.04, 0, -0.056, 0.012, M.polymere, -0.22);
    g.add(chargeur);
    boite(g, 0.028, 0.024, 0.2, 0, 0.008, -0.05, N.chrome);              // carcasse
    const culasse = new THREE.Group();                                   // glissière (recule au tir)
    boite(culasse, 0.032, 0.036, 0.23, 0, 0.038, -0.06, N.chrome);
    boite(culasse, 0.02, 0.012, 0.17, 0, 0.06, -0.09, N.chrome);         // nervure triangulaire
    for (let i = 0; i < 6; i++) boite(culasse, 0.033, 0.026, 0.003, 0, 0.038, 0.02 + i * 0.008, M.gris);
    g.add(culasse);
    cylindre(g, 0.009, 0.006, 0, 0.036, -0.176, M.tubeInterieur, { segments: 10 });
    boite(g, 0.006, 0.018, 0.045, 0, -0.01, -0.02, N.chrome);            // pontet
    mires(g, 0.066, -0.165, 0.04);
    Object.assign(g.userData, {
      bout: V(0, 0.036, -0.18), visee: V(0, 0.072, 0.045), oeil: 0.3,
      ejection: V(0.02, 0.045, -0.03), mainD: V(0, -0.045, 0.02), mainG: V(-0.01, -0.06, 0.03),
      hanche: V(0.13, -0.145, -0.31), chargeur, culasse, flash: 0.18, pistolet: true, glissiere: true,
    });
    return g;
  }

  // Pistolet automatique : chargeur rallongé, compensateur, petit sélecteur orange
  function pistoletAuto() {
    const g = new THREE.Group();
    boite(g, 0.028, 0.1, 0.042, 0, -0.04, 0.02, M.polymere, -0.25);      // poignée
    const chargeur = new THREE.Group();
    chargeur.position.set(0, -0.06, 0.025);
    boite(chargeur, 0.022, 0.15, 0.032, 0, -0.05, 0.012, M.noir, -0.25); // chargeur rallongé
    boite(chargeur, 0.026, 0.01, 0.038, 0, -0.125, 0.03, N.orangeJouet, -0.25);
    g.add(chargeur);
    boite(g, 0.026, 0.02, 0.17, 0, 0.008, -0.05, M.polymere);            // carcasse
    const culasse = new THREE.Group();
    boite(culasse, 0.028, 0.03, 0.19, 0, 0.032, -0.05, M.noir);
    for (let i = 0; i < 5; i++) boite(culasse, 0.029, 0.022, 0.003, 0, 0.032, 0.02 + i * 0.008, M.gris);
    g.add(culasse);
    boite(g, 0.03, 0.032, 0.04, 0, 0.03, -0.165, M.gris);                // compensateur
    for (let i = 0; i < 2; i++) boite(g, 0.016, 0.004, 0.008, 0, 0.047, -0.155 - i * 0.015, M.tubeInterieur);
    boite(g, 0.006, 0.016, 0.04, 0, -0.008, -0.02, M.polymere);          // pontet
    boite(g, 0.004, 0.008, 0.012, -0.015, 0.036, 0.03, N.orangeJouet);   // sélecteur de tir
    mires(g, 0.047, -0.14, 0.035);
    Object.assign(g.userData, {
      bout: V(0, 0.03, -0.19), visee: V(0, 0.054, 0.04), oeil: 0.3,
      ejection: V(0.02, 0.04, -0.03), mainD: V(0, -0.045, 0.02), mainG: V(-0.01, -0.06, 0.03),
      hanche: V(0.13, -0.14, -0.31), chargeur, culasse, flash: 0.14, pistolet: true, glissiere: true,
    });
    return g;
  }

  // Mini-arbalète : une petite arbalète sur une poignée de pistolet
  function miniArbalete() {
    const g = new THREE.Group();
    boite(g, 0.03, 0.1, 0.044, 0, -0.045, 0.02, M.polymere, -0.25);      // poignée
    boite(g, 0.034, 0.04, 0.3, 0, 0.012, -0.08, M.noir);                 // fût
    boite(g, 0.012, 0.008, 0.24, 0, 0.036, -0.1, M.gris);                // rail du carreau
    boite(g, 0.006, 0.016, 0.04, 0, -0.012, 0.0, M.noir);                // pontet
    boite(g, 0.024, 0.026, 0.03, 0, 0.012, -0.24, M.noir);               // tête
    for (const sx of [-1, 1]) {
      boite(g, 0.16, 0.012, 0.018, sx * 0.085, 0.014, -0.226, M.noir, 0, sx * -0.25, 0); // branches
      boite(g, 0.008, 0.016, 0.008, sx * 0.16, 0.014, -0.19, M.gris);    // poulies
    }
    const corde = new THREE.Group();
    const segs = [0, 1].map(() => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.0025, 0.0025, 1).translate(0, 0, 0.5), M.corde);
      corde.add(m);
      return m;
    });
    g.add(corde);
    const tendre = (k) => {
      const nock = V(0, 0.038, -0.19 + 0.15 * k);
      [[-0.16, segs[0]], [0.16, segs[1]]].forEach(([x, m]) => {
        const bout = V(x, 0.016, -0.19);
        const dir = nock.clone().sub(bout);
        m.position.copy(bout);
        m.scale.set(1, 1, dir.length());
        m.quaternion.setFromUnitVectors(V(0, 0, 1), dir.normalize());
      });
    };
    tendre(1);
    const munition = new THREE.Group();                                  // le carreau chargé
    munition.position.set(0, 0.044, -0.04);
    cylindre(munition, 0.003, 0.2, 0, 0, -0.1, M.noir, { segments: 6 });
    cone(munition, 0.006, 0.022, 0, 0, -0.21, M.acier, 6);
    for (let i = 0; i < 3; i++) {
      const plume = boite(munition, 0.002, 0.012, 0.03, 0, 0, -0.008, M.rougeVif);
      plume.rotation.z = (i * Math.PI * 2) / 3;
    }
    g.add(munition);
    boite(g, 0.004, 0.012, 0.004, 0, 0.05, -0.22, M.noir);               // mires
    boite(g, 0.016, 0.012, 0.004, 0, 0.048, 0.02, M.noir);
    Object.assign(g.userData, {
      bout: V(0, 0.044, -0.26), visee: V(0, 0.056, 0.04), oeil: 0.3,
      ejection: null, mainD: V(0, -0.045, 0.02), mainG: V(-0.01, -0.06, 0.03),
      hanche: V(0.13, -0.14, -0.32), munition, corde, tendre, flash: 0, pistolet: true,
    });
    return g;
  }

  // Pistolet à eau : plastique de toutes les couleurs, réservoir d'eau sur le dessus, pompe dessous
  function pistoletEau() {
    const g = new THREE.Group();
    boite(g, 0.05, 0.07, 0.32, 0, 0.0, -0.08, N.orangeJouet);            // corps
    boite(g, 0.052, 0.016, 0.28, 0, -0.03, -0.09, N.jaune);              // bande jaune
    boite(g, 0.034, 0.1, 0.05, 0, -0.08, 0.05, N.vertJouet, -0.2);       // poignée
    boite(g, 0.008, 0.022, 0.014, 0, -0.035, 0.0, N.jaune);              // gâchette
    boite(g, 0.008, 0.02, 0.05, 0, -0.05, 0.0, N.orangeJouet);           // pontet
    cylindre(g, 0.008, 0.12, 0, 0.0, -0.3, N.jaune);                     // buse
    cylindre(g, 0.015, 0.024, 0, 0.0, -0.37, N.orangeJouet, { segments: 12 });
    const pompeG = new THREE.Group();                                    // pompe sous le canon
    cylindre(pompeG, 0.022, 0.12, 0, -0.05, -0.22, N.vertJouet, { segments: 14 });
    for (let i = 0; i < 4; i++) cylindre(pompeG, 0.023, 0.006, 0, -0.05, -0.18 - i * 0.025, N.jaune, { segments: 14 });
    g.add(pompeG);
    const chargeur = new THREE.Group();                                  // le réservoir (on le remplit en rechargeant)
    chargeur.position.set(0, 0.052, -0.08);
    cylindre(chargeur, 0.032, 0.16, 0, 0.0, 0, N.bleuJouet, { segments: 18, ouvert: true });
    cylindre(chargeur, 0.027, 0.155, 0, -0.003, 0, N.eau, { segments: 18 });
    cylindre(chargeur, 0.034, 0.012, 0, 0.0, 0.08, N.bleuJouet, { segments: 18 });
    cylindre(chargeur, 0.034, 0.012, 0, 0.0, -0.08, N.bleuJouet, { segments: 18 });
    cylindre(chargeur, 0.013, 0.02, 0, 0.034, 0.045, N.vertJouet, { axe: 'y', segments: 12 }); // bouchon
    g.add(chargeur);
    boite(g, 0.044, 0.07, 0.12, 0, -0.01, 0.15, N.vertJouet);            // crosse
    boite(g, 0.004, 0.014, 0.004, 0, 0.094, -0.17, N.jaune);             // mires
    boite(g, 0.016, 0.012, 0.004, 0, 0.092, 0.01, N.jaune);
    Object.assign(g.userData, {
      bout: V(0, 0.0, -0.385), visee: V(0, 0.1, 0.03), oeil: 0.26,
      ejection: null, mainD: V(0, -0.075, 0.05), mainG: V(0, -0.075, -0.22),
      hanche: V(0.15, -0.17, -0.37), chargeur, pompe: pompeG, flash: 0,
    });
    return g;
  }

  // ======================================================================================
  // Mêlée
  // ======================================================================================

  // Katana : poignée tressée noir et rouge, garde ronde dorée, longue lame un peu courbe
  function katana() {
    const g = new THREE.Group();
    boite(g, 0.028, 0.032, 0.26, 0, 0, 0.06, M.noir);                    // poignée
    for (let i = 0; i < 5; i++) boite(g, 0.03, 0.034, 0.018, 0, 0, -0.03 + i * 0.05, M.rougeVif); // tressage
    boite(g, 0.032, 0.036, 0.022, 0, 0, 0.2, M.laiton);                  // pommeau
    cylindre(g, 0.046, 0.008, 0, 0, -0.076, M.laiton, { segments: 18 }); // garde ronde (tsuba)
    boite(g, 0.012, 0.03, 0.03, 0, 0.003, -0.096, M.laiton);
    const lame = new THREE.Group();
    // la lame suit une courbe douce (elle remonte un peu vers la pointe) : des morceaux mis bout à bout
    const pt = (s) => [0.004 + 0.06 * s * s, -0.11 - 0.68 * s]; // [y, z] le long de la lame (s : 0 → 1)
    const morceaux = 8;
    for (let i = 0; i < morceaux; i++) {
      const [y0, z0] = pt(i / morceaux); const [y1, z1] = pt((i + 1) / morceaux);
      const L = Math.hypot(y1 - y0, z1 - z0) + 0.002; const a = Math.atan2(y1 - y0, z0 - z1);
      const h = 0.032 - 0.008 * (i / morceaux);
      boite(lame, 0.005, h, L, 0, (y0 + y1) / 2, (z0 + z1) / 2, M.acier, a);
      boite(lame, 0.0056, 0.006, L, 0, (y0 + y1) / 2 + h / 2 - 0.003, (z0 + z1) / 2, M.grisClair, a); // dos
    }
    const pointe = boite(lame, 0.005, 0.024, 0.024, 0, 0.068, -0.795, M.acier, Math.PI / 4); // pointe
    pointe.scale.set(1, 1, 1.6);
    g.add(lame);
    Object.assign(g.userData, {
      bout: V(0, 0.066, -0.8), visee: V(0, 0, 0), oeil: 0.3,
      ejection: null, mainD: V(0, -0.005, 0.02), mainG: V(0, -0.005, 0.12),
      hanche: V(0.2, -0.22, -0.44), lame, flash: 0, melee: true,
      repos: [0.55, 0.4, -0.35], garde: { pos: V(0.17, -0.17, -0.42), rot: [0.95, -0.15, -0.65] },
    });
    return g;
  }

  // Hache : long manche en bois, tête rouge avec un tranchant en acier en bas et une pointe en haut
  function hache() {
    const g = new THREE.Group();
    cylindre(g, 0.016, 0.64, 0, 0, -0.23, M.bois, { segments: 10 });     // manche
    cylindre(g, 0.0175, 0.12, 0, 0, 0.04, M.caoutchouc, { segments: 10 });
    cylindre(g, 0.021, 0.02, 0, 0, 0.1, M.bois, { segments: 10 });       // talon
    const tete = new THREE.Group();
    tete.position.set(0, 0, -0.5);
    boite(tete, 0.03, 0.06, 0.07, 0, 0, 0, N.rougeHache);                // œil de la hache
    boite(tete, 0.016, 0.06, 0.09, 0, -0.055, 0, N.rougeHache);          // lame (haut, étroit)
    boite(tete, 0.013, 0.05, 0.15, 0, -0.1, 0, N.rougeHache);            // lame (bas, large)
    boite(tete, 0.009, 0.016, 0.18, 0, -0.13, 0, M.acier);               // tranchant
    boite(tete, 0.012, 0.07, 0.024, 0, 0.06, 0, N.rougeHache);           // pointe
    cone(tete, 0.012, 0.03, 0, 0.1, 0, M.acier, 6).rotation.set(0, 0, 0);
    g.add(tete);
    Object.assign(g.userData, {
      bout: V(0, -0.14, -0.5), visee: V(0, 0, 0), oeil: 0.3,
      ejection: null, mainD: V(0, 0, 0.03), mainG: V(0, 0, 0.09),
      hanche: V(0.24, -0.28, -0.52), flash: 0, melee: true,
      repos: [0.8, 0.45, -0.5], garde: { pos: V(0.28, -0.24, -0.42), rot: [1.3, -0.1, -0.4] },
    });
    return g;
  }

  // Masse : grosse tête en fonte au bout d'un long manche
  function masse() {
    const g = new THREE.Group();
    cylindre(g, 0.016, 0.66, 0, 0, -0.24, M.boisClair, { segments: 10 }); // manche
    cylindre(g, 0.0175, 0.14, 0, 0, 0.04, M.caoutchouc, { segments: 10 });
    boite(g, 0.075, 0.2, 0.075, 0, 0, -0.57, M.fonte);                   // tête
    boite(g, 0.08, 0.014, 0.08, 0, 0.1, -0.57, M.acier);                 // faces de frappe
    boite(g, 0.08, 0.014, 0.08, 0, -0.1, -0.57, M.acier);
    boite(g, 0.077, 0.03, 0.077, 0, 0, -0.57, M.gris);                   // bague
    Object.assign(g.userData, {
      bout: V(0, 0, -0.57), visee: V(0, 0, 0), oeil: 0.3,
      ejection: null, mainD: V(0, 0, 0.03), mainG: V(0, 0, 0.1),
      hanche: V(0.25, -0.3, -0.54), flash: 0, melee: true,
      repos: [0.8, 0.5, -0.45], garde: { pos: V(0.28, -0.26, -0.42), rot: [1.25, -0.1, -0.35] },
    });
    return g;
  }

  // Pelle : poignée en D, long manche, lame large (rangée dans le dos, elle protège comme la poêle)
  function pelle() {
    const g = new THREE.Group();
    cylindre(g, 0.015, 0.62, 0, 0, -0.2, M.bois, { segments: 10 });      // manche
    boite(g, 0.08, 0.016, 0.016, 0, 0, 0.175, M.noir);                   // poignée en D
    boite(g, 0.012, 0.016, 0.07, -0.034, 0, 0.14, M.noir);
    boite(g, 0.012, 0.016, 0.07, 0.034, 0, 0.14, M.noir);
    cylindre(g, 0.021, 0.07, 0, 0, -0.53, M.gris, { segments: 10 });     // douille
    boite(g, 0.2, 0.008, 0.25, 0, -0.006, -0.68, M.gris);                // lame
    const pointe = boite(g, 0.142, 0.008, 0.142, 0, -0.006, -0.81, M.gris, 0, Math.PI / 4, 0);
    pointe.scale.set(1, 1, 0.55);
    for (const sx of [-1, 1]) boite(g, 0.008, 0.03, 0.25, sx * 0.1, 0.006, -0.68, M.gris); // bords relevés
    Object.assign(g.userData, {
      bout: V(0, 0, -0.82), visee: V(0, 0, 0), oeil: 0.3,
      ejection: null, mainD: V(0, 0, 0.1), mainG: V(0, 0, -0.22),
      hanche: V(0.22, -0.27, -0.5), flash: 0, melee: true,
      repos: [0.95, 0.3, -0.45], garde: { pos: V(0.24, -0.2, -0.46), rot: [1.5, 0.15, -0.3] },
    });
    return g;
  }

  // ======================================================================================
  // Gadgets
  // ======================================================================================
  const gadget = (g, corps, plus = {}) => Object.assign(g.userData, {
    bout: V(0, 0, 0), visee: V(0, 0, 0), oeil: 0.3, ejection: null, mainD: V(0, -0.03, 0.01), mainG: null,
    hanche: V(0.15, -0.12, -0.3), flash: 0, gadget: true, objet: corps,
    repos: [0.2, 0.3, 0.1], garde: { pos: V(0.13, -0.08, -0.3), rot: [0.5, 0.2, 0.1] }, ...plus,
  });

  // Grenade flash : cylindre gris troué, bande jaune, cuillère et goupille
  function grenadeFlash() {
    const g = new THREE.Group();
    const corps = new THREE.Group();
    cylindre(corps, 0.026, 0.1, 0, 0, 0, M.grisClair, { axe: 'y', segments: 16 });
    for (let r = 0; r < 3; r++) {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + r * 0.5;
        const trou = boite(corps, 0.008, 0.012, 0.004, Math.cos(a) * 0.026, -0.03 + r * 0.025, Math.sin(a) * 0.026, M.noir);
        trou.rotation.y = -a + Math.PI / 2;
      }
    }
    cylindre(corps, 0.0265, 0.014, 0, 0.038, 0, N.jaune, { axe: 'y', segments: 16 });
    cylindre(corps, 0.018, 0.016, 0, 0.058, 0, M.noir, { axe: 'y', segments: 12 });
    boite(corps, 0.012, 0.006, 0.06, 0, 0.068, 0.012, M.grisClair, -0.35); // cuillère
    const goupille = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.0022, 6, 14), M.laiton);
    goupille.position.set(0.018, 0.068, -0.004);
    goupille.rotation.y = Math.PI / 2;
    corps.add(goupille);
    g.add(corps);
    gadget(g, corps);
    return g;
  }

  // Mine : un disque olive avec une petite lumière rouge qui clignote quand elle est armée
  function mine() {
    const g = new THREE.Group();
    const corps = new THREE.Group();
    cylindre(corps, 0.075, 0.034, 0, 0, 0, M.olive, { axe: 'y', segments: 24 });
    cylindre(corps, 0.078, 0.008, 0, -0.014, 0, M.vert, { axe: 'y', segments: 24 });
    cylindre(corps, 0.03, 0.012, 0, 0.022, 0, M.noir, { axe: 'y', segments: 16 }); // détonateur
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      boite(corps, 0.012, 0.008, 0.012, Math.cos(a) * 0.05, 0.018, Math.sin(a) * 0.05, M.noir);
    }
    const lumiere = sphere(corps, 0.009, 0, 0.032, 0, plein(0xff2a2a), 10);
    corps.rotation.x = 0.7;  // tenue à plat, le dessus vers nous
    g.add(corps);
    gadget(g, corps, { lumiere, hanche: V(0.14, -0.13, -0.32), repos: [0.3, 0.2, 0.1], garde: { pos: V(0.1, -0.1, -0.3), rot: [0.5, 0.2, 0] } });
    return g;
  }

  // Propulseur : une petite bouteille avec une tuyère dessous (on la tient à la main, elle pousse vers le haut)
  function propulseur() {
    const g = new THREE.Group();
    const corps = new THREE.Group();
    cylindre(corps, 0.034, 0.12, 0, 0.02, 0, M.grisClair, { axe: 'y', segments: 18 });
    sphere(corps, 0.034, 0, 0.08, 0, M.grisClair, 18).scale.y = 0.6;
    cylindre(corps, 0.035, 0.012, 0, 0.055, 0, M.orange, { axe: 'y', segments: 18 });
    cylindre(corps, 0.035, 0.012, 0, -0.015, 0, M.orange, { axe: 'y', segments: 18 });
    cylindre(corps, 0.018, 0.04, 0, -0.06, 0, M.noir, { axe: 'y', r2: 0.028, segments: 16 }); // tuyère
    const feu = new THREE.Mesh(new THREE.CircleGeometry(0.02, 16), plein(0xff8a2a));
    feu.rotation.x = Math.PI / 2;
    feu.position.set(0, -0.081, 0);
    corps.add(feu);
    boite(corps, 0.012, 0.07, 0.02, 0, 0.02, 0.042, M.noir);              // poignée
    cylindre(corps, 0.012, 0.006, 0, 0.075, 0.034, M.blanc, { segments: 14 }); // manomètre
    boite(corps, 0.002, 0.008, 0.001, 0, 0.078, 0.038, M.rougeVif);
    g.add(corps);
    gadget(g, corps, { lueurs: [feu] });
    return g;
  }

  // Balise des météores : un petit phare rouge avec une antenne
  function balise() {
    const g = new THREE.Group();
    const corps = new THREE.Group();
    cylindre(corps, 0.022, 0.1, 0, 0, 0, M.noir, { axe: 'y', segments: 16 });
    cylindre(corps, 0.023, 0.012, 0, -0.02, 0, N.jaune, { axe: 'y', segments: 16 });
    cylindre(corps, 0.023, 0.012, 0, 0.02, 0, N.jaune, { axe: 'y', segments: 16 });
    cylindre(corps, 0.026, 0.012, 0, -0.055, 0, M.noir, { axe: 'y', segments: 16 });
    const lumiere = sphere(corps, 0.019, 0, 0.06, 0, plein(0xff3322), 14);
    cylindre(corps, 0.0022, 0.07, 0.013, 0.085, 0, M.gris, { axe: 'y', segments: 6 });
    sphere(corps, 0.004, 0.013, 0.12, 0, M.rougeVif, 8);
    g.add(corps);
    gadget(g, corps, { lumiere });
    return g;
  }

  // ======================================================================================
  // Armes d'admin
  // ======================================================================================

  // Canon à trou noir : canon violet foncé, une orbe noire tenue dans une cage, un anneau qui tourne
  function trouNoir() {
    const g = new THREE.Group();
    const violet = plein(0xb066ff);
    boite(g, 0.08, 0.1, 0.42, 0, 0, -0.05, N.violetSombre);              // corps
    boite(g, 0.084, 0.03, 0.3, 0, 0.065, -0.08, M.noir);                 // dessus
    boite(g, 0.086, 0.008, 0.36, 0, 0.0, -0.05, violet);                 // bandes lumineuses
    boite(g, 0.03, 0.012, 0.26, 0, 0.086, -0.08, M.gris);                // rail
    holo(g, 0.112, -0.1);
    for (let i = 0; i < 4; i++) {                                        // la cage (4 dents)
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      boite(g, 0.012, 0.012, 0.15, Math.cos(a) * 0.062, 0.01 + Math.sin(a) * 0.062, -0.32, N.violetSombre);
      boite(g, 0.014, 0.014, 0.02, Math.cos(a) * 0.05, 0.01 + Math.sin(a) * 0.05, -0.4, violet);
    }
    cylindre(g, 0.07, 0.03, 0, 0.01, -0.27, M.noir, { segments: 20 });
    const anneauNoir = tore(g, 0.078, 0.007, 0, 0.01, -0.35, lumineux(0xb066ff, 0.95));
    const orbeNoire = sphere(g, 0.044, 0, 0.01, -0.35, plein(0x000000), 20);
    const haloNoir = halo(g, 0x9a4dff, 0.22, 0, 0.01, -0.35);
    const chargeur = new THREE.Group();
    chargeur.position.set(0, -0.05, -0.02);
    boite(chargeur, 0.04, 0.07, 0.08, 0, -0.035, 0, M.noir);
    boite(chargeur, 0.042, 0.04, 0.03, 0, -0.035, 0, violet);
    g.add(chargeur);
    boite(g, 0.034, 0.1, 0.046, 0, -0.095, 0.08, M.noir, -0.28);         // poignée
    boite(g, 0.006, 0.02, 0.05, 0, -0.065, 0.03, M.noir);
    boite(g, 0.03, 0.08, 0.035, 0, -0.085, -0.2, M.noir, 0.1);           // poignée avant
    boite(g, 0.055, 0.09, 0.16, 0, 0, 0.25, N.violetSombre);             // crosse
    boite(g, 0.057, 0.1, 0.02, 0, 0, 0.34, M.caoutchouc);
    Object.assign(g.userData, {
      bout: V(0, 0.01, -0.42), visee: V(0, 0.112, -0.06), oeil: 0.18,
      ejection: null, mainD: V(0, -0.09, 0.07), mainG: V(0, -0.075, -0.2),
      hanche: V(0.15, -0.17, -0.38), chargeur, flash: 0, orbeNoire, anneauNoir, haloNoir,
    });
    return g;
  }

  // Fusil Tesla : bobines de cuivre autour du canon, boule chromée au bout, une petite bobine Tesla sur le dessus
  function tesla() {
    const g = new THREE.Group();
    boite(g, 0.06, 0.08, 0.34, 0, 0, -0.05, M.noir);                     // corps
    boite(g, 0.062, 0.03, 0.2, 0, 0.055, -0.06, N.cuivre);               // capot en cuivre
    cylindre(g, 0.014, 0.32, 0, 0.01, -0.34, M.noir);                    // canon
    for (let i = 0; i < 7; i++) tore(g, 0.026, 0.006, 0, 0.01, -0.23 - i * 0.03, N.cuivre); // bobine
    sphere(g, 0.03, 0, 0.01, -0.52, N.chrome, 18);                       // boule terminale
    for (const sx of [-1, 1]) {                                          // électrodes
      cylindre(g, 0.005, 0.12, sx * 0.045, 0.035, -0.42, N.cuivre, { segments: 8 });
      sphere(g, 0.009, sx * 0.045, 0.035, -0.48, N.chrome, 10);
    }
    cylindre(g, 0.016, 0.07, 0, 0.105, -0.08, N.cuivre, { axe: 'y', segments: 12 }); // bobine Tesla
    const terminal = tore(g, 0.03, 0.01, 0, 0.15, -0.08, N.chrome, Math.PI / 2);
    const lueurTesla = halo(g, 0x8fd8ff, 0.12, 0, 0.01, -0.52);
    const arcsTesla = [ligneEclair(g, 12, 0xcfeeff), ligneEclair(g, 12, 0x9fd4ff)];
    boite(g, 0.0016, 0.006, 0.0016, 0, 0.078, -0.15, M.reticule);        // mire
    boite(g, 0.034, 0.1, 0.046, 0, -0.085, 0.07, M.noir, -0.28);         // poignée
    boite(g, 0.006, 0.02, 0.05, 0, -0.055, 0.02, M.noir);
    boite(g, 0.03, 0.08, 0.035, 0, -0.07, -0.2, M.polymere, 0.1);        // poignée avant
    boite(g, 0.05, 0.085, 0.17, 0, -0.005, 0.25, M.noir);                // crosse
    boite(g, 0.052, 0.02, 0.17, 0, 0.035, 0.25, N.cuivre);
    Object.assign(g.userData, {
      bout: V(0, 0.01, -0.55), visee: V(0, 0.082, 0.06), oeil: 0.16,
      ejection: null, mainD: V(0, -0.08, 0.06), mainG: V(0, -0.07, -0.2),
      hanche: V(0.15, -0.165, -0.37), flash: 0, arcsTesla, lueurTesla, terminal,
    });
    return g;
  }

  // Minigun : 6 canons qui tournent (rotor), moteur, poignée de transport, boîte de munitions avec bande
  function minigun() {
    const g = new THREE.Group();
    const rotor = new THREE.Group();
    rotor.position.set(0, 0, -0.2);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      cylindre(rotor, 0.009, 0.62, Math.cos(a) * 0.028, Math.sin(a) * 0.028, -0.3, M.noir, { segments: 8 });
    }
    cylindre(rotor, 0.01, 0.62, 0, 0, -0.3, M.gris, { segments: 8 });
    cylindre(rotor, 0.045, 0.014, 0, 0, -0.08, M.gris, { segments: 18 });
    cylindre(rotor, 0.045, 0.014, 0, 0, -0.38, M.gris, { segments: 18 });
    cylindre(rotor, 0.042, 0.02, 0, 0, -0.6, M.noir, { segments: 18 });
    g.add(rotor);
    boite(g, 0.1, 0.11, 0.22, 0, 0, 0.0, M.noir);                        // moteur
    cylindre(g, 0.056, 0.12, 0, 0, -0.15, M.gris, { segments: 18 });     // carter
    boite(g, 0.02, 0.05, 0.02, 0, 0.08, 0.08, M.noir);                   // poignée de transport
    boite(g, 0.02, 0.05, 0.02, 0, 0.08, -0.08, M.noir);
    boite(g, 0.02, 0.02, 0.18, 0, 0.11, 0.0, M.noir);
    holo(g, 0.142, -0.02);
    boite(g, 0.034, 0.1, 0.045, 0, -0.1, 0.08, M.polymere, -0.2);        // poignée
    boite(g, 0.006, 0.02, 0.05, 0, -0.065, 0.03, M.noir);
    boite(g, 0.03, 0.08, 0.035, 0, -0.1, -0.14, M.polymere, 0.1);        // poignée avant
    const chargeur = new THREE.Group();                                  // boîte de munitions + bande
    chargeur.position.set(-0.09, -0.05, 0.0);
    boite(chargeur, 0.1, 0.12, 0.16, -0.03, -0.04, 0, M.olive);
    boite(chargeur, 0.104, 0.014, 0.164, -0.03, 0.02, 0, M.vert);
    for (let i = 0; i < 6; i++) boite(chargeur, 0.012, 0.026, 0.008, 0.03 + i * 0.006, 0.03 + i * 0.008, 0.03 - i * 0.012, M.laiton, 0, 0, 0.5);
    g.add(chargeur);
    Object.assign(g.userData, {
      bout: V(0, 0, -0.82), visee: V(0, 0.142, 0.02), oeil: 0.2,
      ejection: V(0.05, -0.04, -0.05), mainD: V(0, -0.1, 0.08), mainG: V(0, -0.1, -0.14),
      hanche: V(0.16, -0.21, -0.42), chargeur, rotor, flash: 0.3,
    });
    return g;
  }

  // Marteau de Thor : manche en cuir, grosse tête en acier gravée de runes lumineuses, des éclairs autour
  function marteauThor() {
    const g = new THREE.Group();
    cylindre(g, 0.017, 0.26, 0, 0, -0.07, N.cuir, { segments: 10 });     // manche
    for (let i = 0; i < 6; i++) cylindre(g, 0.0185, 0.008, 0, 0, 0.04 - i * 0.035, M.noir, { segments: 10 }); // lanières
    cylindre(g, 0.024, 0.03, 0, 0, 0.075, M.acier, { segments: 12 });    // pommeau
    tore(g, 0.022, 0.0045, 0, 0, 0.11, N.cuir, 0, Math.PI / 2);          // dragonne
    const tete = new THREE.Group();
    tete.position.set(0, 0, -0.24);
    boite(tete, 0.11, 0.22, 0.11, 0, 0, 0, M.acier);
    boite(tete, 0.116, 0.02, 0.116, 0, 0.1, 0, M.gris);
    boite(tete, 0.116, 0.02, 0.116, 0, -0.1, 0, M.gris);
    const runes = new THREE.MeshBasicMaterial({ color: 0x6fd8ff, transparent: true, opacity: 0.95 });
    for (const sx of [-1, 1]) {
      boite(tete, 0.002, 0.13, 0.01, sx * 0.0565, 0, 0, runes);
      boite(tete, 0.002, 0.01, 0.06, sx * 0.0565, 0.04, 0, runes);
      boite(tete, 0.002, 0.01, 0.05, sx * 0.0565, -0.035, 0.01, runes);
      boite(tete, 0.002, 0.04, 0.01, sx * 0.0565, 0.06, 0.03, runes);
    }
    for (const sz of [-1, 1]) boite(tete, 0.01, 0.1, 0.002, 0, 0, sz * 0.0565, runes);
    g.add(tete);
    const lueur = halo(tete, 0x6fd8ff, 0.32, 0, 0, 0);
    const arcsThor = [ligneEclair(g, 10, 0xcff4ff), ligneEclair(g, 10, 0x8fdcff)];
    Object.assign(g.userData, {
      bout: V(0, 0, -0.24), visee: V(0, 0, 0), oeil: 0.3,
      ejection: null, mainD: V(0, 0, 0.02), mainG: null,
      hanche: V(0.2, -0.22, -0.42), flash: 0, melee: true, runes, lueurThor: lueur, arcsThor,
      repos: [1.0, 0.25, -0.3], garde: { pos: V(0.2, -0.15, -0.42), rot: [1.5, 0.2, -0.3] },
    });
    return g;
  }

  // Lance-feux d'artifice : 4 tubes de couleur ; une fusée prête dépasse d'un tube
  function feuArtifice() {
    const g = new THREE.Group();
    const couleurs = [M.rougeVif, N.or, N.bleuJouet, N.vertJouet];
    for (let i = 0; i < 4; i++) {
      const x = ((i % 2) - 0.5) * 0.07;
      const y = (Math.floor(i / 2) - 0.5) * 0.07 + 0.03;
      cylindre(g, 0.032, 0.5, x, y, -0.15, couleurs[i], { segments: 16 });
      cylindre(g, 0.034, 0.02, x, y, -0.4, M.noir, { segments: 16 });
      cylindre(g, 0.026, 0.004, x, y, -0.411, M.tubeInterieur, { segments: 16 });
      for (let k = 0; k < 3; k++) boite(g, 0.012, 0.012, 0.012, x + (i % 2 ? 0.03 : -0.03), y, -0.3 + k * 0.12, N.or, 0, 0, Math.PI / 4); // étoiles
    }
    for (const z of [-0.34, 0.04]) {                                     // cerclages
      boite(g, 0.15, 0.012, 0.03, 0, 0.1, z, M.noir);
      boite(g, 0.15, 0.012, 0.03, 0, -0.04, z, M.noir);
      boite(g, 0.012, 0.15, 0.03, 0.07, 0.03, z, M.noir);
      boite(g, 0.012, 0.15, 0.03, -0.07, 0.03, z, M.noir);
    }
    const munition = new THREE.Group();                                  // la fusée prête
    munition.position.set(0.035, 0.065, -0.4);
    cylindre(munition, 0.022, 0.05, 0, 0, -0.01, N.rose, { segments: 12 });
    cone(munition, 0.024, 0.06, 0, 0, -0.065, N.or, 12);
    g.add(munition);
    holo(g, 0.142, -0.05);
    boite(g, 0.034, 0.1, 0.046, 0, -0.08, 0.05, M.polymere, -0.25);      // poignée
    boite(g, 0.006, 0.018, 0.05, 0, -0.05, 0.0, M.noir);
    boite(g, 0.03, 0.08, 0.035, 0, -0.07, -0.22, M.polymere, 0.1);       // poignée avant
    Object.assign(g.userData, {
      bout: V(0.035, 0.065, -0.43), visee: V(0, 0.142, -0.01), oeil: 0.2,
      ejection: null, mainD: V(0, -0.08, 0.05), mainG: V(0, -0.065, -0.22),
      hanche: V(0.17, -0.16, -0.42), munition, flash: 0.35,
    });
    return g;
  }

  // Rayon anti-gravité : pistolet rétro chromé et violet, avec une parabole au bout
  function rayonLev() {
    const g = new THREE.Group();
    const violet = lumineux(0xc77dff, 0.95);
    const arriere = sphere(g, 0.04, 0, 0.032, 0.005, N.chrome, 18);       // bulbe arrière
    arriere.scale.z = 1.25;
    cylindre(g, 0.022, 0.2, 0, 0.032, -0.11, N.chrome, { segments: 14 }); // tube
    const lueurs = [];
    for (let i = 0; i < 3; i++) {
      cylindre(g, 0.04 - i * 0.006, 0.012, 0, 0.032, -0.05 - i * 0.05, N.violetSombre, { segments: 18 }); // ailettes
      lueurs.push(tore(g, 0.041 - i * 0.006, 0.003, 0, 0.032, -0.05 - i * 0.05, violet));
    }
    cylindre(g, 0.046, 0.032, 0, 0.032, -0.235, N.chrome, { r2: 0.02, ouvert: true, segments: 20 }); // parabole
    lueurs.push(sphere(g, 0.013, 0, 0.032, -0.24, violet, 12));
    cylindre(g, 0.003, 0.08, 0, 0.1, 0.02, M.noir, { axe: 'y', segments: 6 }); // antenne
    lueurs.push(sphere(g, 0.008, 0, 0.14, 0.02, violet, 10));
    boite(g, 0.03, 0.1, 0.042, 0, -0.04, 0.03, N.violetSombre, -0.3);    // poignée
    boite(g, 0.006, 0.016, 0.03, 0, -0.005, -0.01, N.chrome);            // gâchette
    const chargeur = new THREE.Group();                                  // cellule dans la poignée
    chargeur.position.set(0, -0.075, 0.045);
    boite(chargeur, 0.024, 0.04, 0.03, 0, -0.01, 0, plein(0xb066ff), -0.3);
    g.add(chargeur);
    boite(g, 0.004, 0.012, 0.004, 0, 0.088, -0.05, M.noir);              // mire
    Object.assign(g.userData, {
      bout: V(0, 0.032, -0.26), visee: V(0, 0.092, 0.06), oeil: 0.3,
      ejection: null, mainD: V(0, -0.045, 0.03), mainG: V(-0.01, -0.06, 0.04),
      hanche: V(0.14, -0.15, -0.34), chargeur, flash: 0, pistolet: true, lueurs,
    });
    return g;
  }

  // Sabre laser : poignée chromée, lame verte qui brille (cœur blanc)
  function sabreLaser() {
    const g = new THREE.Group();
    cylindre(g, 0.017, 0.26, 0, 0, 0.04, N.chrome, { segments: 16 });    // poignée
    for (let i = 0; i < 6; i++) cylindre(g, 0.0185, 0.012, 0, 0, 0.1 - i * 0.025, M.noir, { segments: 16 });
    cylindre(g, 0.021, 0.04, 0, 0, -0.1, M.gris, { segments: 16 });      // émetteur
    cylindre(g, 0.019, 0.02, 0, 0, 0.18, M.noir, { segments: 16 });      // pommeau
    boite(g, 0.008, 0.008, 0.012, 0, 0.019, 0.0, M.rougeVif);            // bouton
    const lameLaser = [
      cylindre(g, 0.009, 0.85, 0, 0, -0.545, plein(0xe6ffe8), { segments: 12 }),
      cylindre(g, 0.017, 0.86, 0, 0, -0.545, new THREE.MeshBasicMaterial({ color: 0x2bff4a, transparent: true, opacity: 0.75, depthWrite: false }), { segments: 12 }),
      cylindre(g, 0.032, 0.87, 0, 0, -0.545, lumineux(0x12d630, 0.25), { segments: 12 }),
    ];
    Object.assign(g.userData, {
      bout: V(0, 0, -0.97), visee: V(0, 0, 0), oeil: 0.3,
      ejection: null, mainD: V(0, 0, 0.04), mainG: V(0, 0, 0.13),
      hanche: V(0.2, -0.22, -0.42), flash: 0, melee: true, lameLaser,
      repos: [0.65, 0.35, -0.35], garde: { pos: V(0.17, -0.16, -0.42), rot: [1.0, -0.15, -0.6] },
    });
    return g;
  }

  const fabriques = {
    pompe_auto: pompeAuto, double_canon: doubleCanon, vector, bullpup, lance_grenades: lanceGrenades,
    plasma, anti_materiel: antiMateriel, cloueuse,
    pistolet_lourd: pistoletLourd, pistolet_auto: pistoletAuto, mini_arbalete: miniArbalete, pistolet_eau: pistoletEau,
    katana, hache, masse, pelle,
    grenade_flash: grenadeFlash, mine, propulseur, meteores: balise,
    trou_noir: trouNoir, tesla, minigun, marteau_thor: marteauThor, feu_artifice: feuArtifice, rayon_lev: rayonLev, sabre_laser: sabreLaser,
  };

  // ======================================================================================
  // Projectiles en vol (pointent vers -z)
  // ======================================================================================
  function projectile(type) {
    const g = new THREE.Group();
    if (type === 'obus') {
      cylindre(g, 0.02, 0.05, 0, 0, 0.012, M.laiton, { segments: 12 });
      const nez = sphere(g, 0.02, 0, 0, -0.014, M.olive, 12);
      nez.scale.z = 1.4;
    } else if (type === 'plasma') {
      sphere(g, 0.035, 0, 0, 0, plein(0xffffff), 12);
      halo(g, 0x39e0ff, 0.42, 0, 0, 0);
      halo(g, 0xb066ff, 0.22, 0, 0, 0.05);
    } else if (type === 'clou') {
      cylindre(g, 0.0025, 0.075, 0, 0, 0, M.acier, { segments: 6 });
      cylindre(g, 0.007, 0.003, 0, 0, 0.038, M.acier, { segments: 10 });
      cone(g, 0.0025, 0.012, 0, 0, -0.043, M.acier, 6);
    } else if (type === 'trou_noir') {
      sphere(g, 0.07, 0, 0, 0, plein(0x000000), 18);
      halo(g, 0x9a4dff, 0.5, 0, 0, 0);
      g.userData.anneau = tore(g, 0.11, 0.008, 0, 0, 0, lumineux(0xc77dff, 0.95), Math.PI / 2.4);
    } else if (type === 'artifice') {
      cylindre(g, 0.02, 0.12, 0, 0, 0, N.rose, { segments: 12 });
      cylindre(g, 0.0205, 0.02, 0, 0, 0.02, N.or, { segments: 12 });
      cone(g, 0.022, 0.06, 0, 0, -0.09, N.or, 12);
      cylindre(g, 0.004, 0.25, 0, 0, 0.18, M.boisClair, { segments: 6 });
      halo(g, 0xffd27a, 0.25, 0, 0, 0.08);
    } else if (type === 'flash') {
      return grenadeFlash();
    } else if (type === 'balise') {
      return balise();
    } else if (type === 'mine') {
      const m = mine();
      m.userData.objet.rotation.set(0, 0, 0); // posée à plat, sur le sol
      m.userData.objet.position.y = 0.02;
      return m;
    } else return null;
    return g;
  }

  // Un météore : un rocher sombre qui brûle
  function meteore() {
    const g = new THREE.Group();
    const roc = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), N.pierre);
    g.add(roc);
    const braise = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), plein(0xff6a1a));
    braise.rotation.set(0.4, 0.7, 0);
    g.add(braise);
    halo(g, 0xff7a2a, 2.2, 0, 0, 0);
    g.userData.roc = roc;
    return g;
  }

  return { fabriques, projectile, meteore };
}
