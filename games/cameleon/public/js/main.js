// Caméléon : le jeu dans le navigateur (hall, salle d'attente, manches de cache-cache).
// Le serveur est l'arbitre (voir games/cameleon/serveur/salon.js) ; ici on affiche, on écoute les touches
// et on envoie « je suis ici », « je tire par là », « voici ma peinture ».
// Le personnage en blocs, la carte, les déplacements et les effets viennent d'Arena FPS (/games/fps/js/...).
import * as THREE from '/games/fps/vendor/three.min.js';
import { Personnage, styleParDefaut } from '/games/fps/js/personnage.js';
import { definirCatalogue, normaliserStyle } from '/games/fps/js/apparence.js';
import { construireMonde, rayonBoite } from '/games/fps/js/monde.js';
import { JoueurLocal, YEUX } from '/games/fps/js/joueur.js';
import { ArmeVue } from '/games/fps/js/arme.js';
import { choisirStyleArmes } from '/games/fps/js/armes-glb.js';
import { Effets } from '/games/fps/js/effets.js';
import { el } from '/games/fps/js/hud.js';
import { Peinture, sansAccessoires, remplirParties, couleursMoyennes } from './peinture.js';
import * as S from './sons.js';

const $ = (id) => document.getElementById(id);
const COULEURS_PEINTURE = ['#ff5ea8', '#ffd23f', '#3bb3ff', '#ff7a2f', '#b06cff', '#3bd36b'];
const TRAVERSABLES = new Set(['vitre', 'invisible']);
const DELAI = 100; // on affiche les autres joueurs avec 0,1 s de retard (plus fluide)
const NOMS_POSES = ['debout', 'statue', 'accroupi', 'allongé'];
const couleurDe = (id) => COULEURS_PEINTURE[Math.abs(Number(id) || 0) % COULEURS_PEINTURE.length];
const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

// Poses du personnage (mêmes pistes que les danses de l'atelier : [t, x, y, z, rx, ry, rz])
const POSES = {
  1: {}, // statue : bien droit, les bras le long du corps
  2: { // accroupi (assis sur les talons, les bras autour des genoux)
    tout: [0, 0, -0.42, 0.12, 0, 0, 0], jambeD: [0, 0, 0, 0, 1.45, 0, 0.05], jambeG: [0, 0, 0, 0, 1.45, 0, -0.05],
    corps: [0, 0, 0, 0, -0.35, 0, 0], brasD: [0, 0, 0, 0, 1.15, 0, 0.12], brasG: [0, 0, 0, 0, 1.15, 0, -0.12], tete: [0, 0, 0, 0, 0.25, 0, 0],
  },
  3: { tout: [0, 0, 0.2, 0.92, -Math.PI / 2, 0, 0], tete: [0, 0, 0, 0, -0.3, 0, 0] }, // allongé à plat ventre, la tête un peu relevée
};

const prefs = (() => {
  const d = { sensibilite: 1, volume: 0.7, inverser: false };
  try { return { ...d, ...JSON.parse(localStorage.getItem('cameleon-reglages') || '{}') }; } catch { return d; }
})();
const sauverPrefs = () => { try { localStorage.setItem('cameleon-reglages', JSON.stringify(prefs)); } catch { /* navigation privée */ } };

async function demarrer() {
  choisirStyleArmes('classique');
  const lireJson = (u) => fetch(u).then((r) => r.json());
  const [R, reglagesFps, catalogue] = await Promise.all([lireJson('reglages.json'), lireJson('/games/fps/reglages.json'), lireJson('/games/fps/catalogue-apparence.json')]);
  definirCatalogue(catalogue);
  const armePeinture = { ...(reglagesFps.armes.find((a) => a.id === 'lance_fusee') || reglagesFps.armes[0]), nom: 'Pistolet à peinture' };
  const tactile = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  document.body.classList.toggle('tactile', tactile);

  // ---------- 3D ----------
  const renderer = new THREE.WebGLRenderer({ canvas: $('jeu'), antialias: !tactile, preserveDrawingBuffer: true }); // (pour la pipette)
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, tactile ? 1.25 : 1.75));
  renderer.shadowMap.enabled = !tactile;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.05, 400);
  const redimensionner = () => {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  addEventListener('resize', redimensionner);
  redimensionner();
  const effets = new Effets(scene);

  // ---------- État du jeu ----------
  const E = {
    ecran: 'hall', moiId: null, monNom: '', monStyle: null, admin: false,
    salon: null, carte: null, monde: null, etat: 'attente', manche: 0, finA: 0, departA: 0,
    joueurs: new Map(), leurres: new Map(), taches: [], role: null, pose: 0, points: 0,
    bloqueJusqua: 0, dernierTir: 0, radar: null, dernierEnvoi: 0, facing: 0, distCam: 3.6, dernierBip: 0,
    leurreUtilise: false, radarUtilise: false, cartes: [], peauEnvoyee: 0, peauEnAttente: null,
  };
  const joueur = new JoueurLocal({ boites: [], reglages: { joueur: R.joueur } });
  joueur.sourisActive = false; // on gère la souris nous-mêmes (pour « inverser haut / bas »)
  const touches = new Set();
  const TOUCHES = { avancer: ['KeyW', 'ArrowUp'], reculer: ['KeyS', 'ArrowDown'], gauche: ['KeyA', 'ArrowLeft'], droite: ['KeyD', 'ArrowRight'], sauter: ['Space'] };
  joueur.commandes = { tenue: (a) => (TOUCHES[a] || []).some((c) => touches.has(c)), changerSaisie() {} };
  const veutBouger = () => ['avancer', 'reculer', 'gauche', 'droite', 'sauter'].some((a) => joueur.commandes.tenue(a))
    || Math.abs(joueur.analogique.avant) + Math.abs(joueur.analogique.cote) > 0.2 || joueur.sautTactile;
  let armeVue = null;
  let monPerso = null; // mon personnage (visible à la 3e personne quand je suis cacheur)

  // ---------- Petits outils d'affichage ----------
  function toast(texte) {
    const t = el('div', { class: 'toast', text: texte });
    $('toasts').append(t);
    setTimeout(() => t.remove(), 3100);
    while ($('toasts').children.length > 4) $('toasts').firstChild.remove();
  }
  function montrer(id) {
    for (const x of ['hall', 'attente', 'fin', 'pause']) $(x).hidden = x !== id;
  }

  // ---------- Réseau ----------
  let ws = null;
  const gestion = {};
  const on = (t, f) => { gestion[t] = f; };
  const envoyer = (m) => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(m)); };
  function connecter() {
    ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/games/cameleon/ws`);
    ws.onopen = () => { $('hall-etat').textContent = ''; };
    ws.onmessage = (ev) => {
      let m;
      try { m = JSON.parse(ev.data); } catch { return; }
      if (gestion[m.t]) {
        try { gestion[m.t](m); } catch (e) { console.error(m.t, e); }
      }
    };
    ws.onclose = (ev) => {
      if (ev.code === 4000) { $('hall-etat').textContent = 'Caméléon est ouvert dans un autre onglet.'; return; }
      if (E.ecran !== 'hall') sortirSalon(true);
      $('hall-etat').textContent = ev.code === 1006 || ev.code === 1002 ? 'Le serveur de Caméléon ne répond pas (il doit peut-être être redémarré). Nouvel essai…' : 'Connexion perdue, reconnexion…';
      setTimeout(connecter, 2500);
    };
  }

  // ---------- La carte ----------
  async function chargerCarte(id) {
    if (E.carte && E.carte.id === id) return;
    const c = await fetch(`cartes/${id}.json`).then((r) => r.json());
    c.id = id;
    if (E.monde) E.monde.liberer();
    E.carte = c;
    E.monde = construireMonde(scene, c, { ombres: !tactile });
    joueur.boites = c.boites;
    E.boitesTir = c.boites.filter((b) => !TRAVERSABLES.has(b[6]));
    // la caméra à la 3e personne ne bute que sur les murs et les grands objets (pas sur une télé ou un canapé)
    E.boitesCamera = E.boitesTir.filter((b) => b[4] - b[1] >= 1.9 || b[4] >= 2.4);
    for (const t of E.taches) t.removeFromParent();
    E.taches = [];
  }
  // Premier mur touché par un rayon (pour la caméra à la 3e personne)
  function rayon(o, d, portee) {
    let t = portee;
    for (const b of E.boitesCamera || []) { const tt = rayonBoite(o, d, b); if (tt < t) t = tt; }
    return t;
  }

  // ---------- Les joueurs ----------
  function styleDe(j) { return normaliserStyle(j.style || styleParDefaut(j.id)); }
  function creerPerso(j) {
    if (j.perso) j.perso.liberer();
    const cacheur = j.role === 'cacheur';
    j.perso = new Personnage(cacheur ? { style: sansAccessoires(styleDe(j)) } : { style: styleDe(j), nom: j.id === E.moiId ? '' : j.nom });
    if (cacheur) { if (j.perso.arme) j.perso.arme.visible = false; } else j.perso.prendreArme('lance_fusee', 'secondaire');
    j.poseAffichee = -1;
    appliquerPeau(j);
    if (j.id !== E.moiId) scene.add(j.perso.groupe);
    j.perso.groupe.position.set(j.x || 0, j.y || 0, j.z || 0);
    j.perso.groupe.rotation.y = j.yaw || 0;
    j.perso.groupe.visible = E.etat !== 'attente';
    if (j.id === E.moiId) {
      monPerso = j.perso;
      if (cacheur) { peinture.attacher(j.perso, sansAccessoires(styleDe(j))); scene.add(j.perso.groupe); }
    }
  }
  function appliquerPeau(j) {
    if (!j.perso || j.role !== 'cacheur') return;
    if (j.peauPng) {
      const img = new Image();
      img.onload = () => {
        if (!j.perso || j.role !== 'cacheur') return;
        const g = j.perso.canvas.getContext('2d');
        g.clearRect(0, 0, 64, 64);
        g.drawImage(img, 0, 0, 64, 64);
        j.perso.texture.needsUpdate = true;
      };
      img.src = j.peauPng;
    } else if (j.couleurs) {
      remplirParties(j.perso.canvas, j.couleurs);
      j.perso.texture.needsUpdate = true;
    }
  }
  function ajouterJoueur(info) {
    const ancien = E.joueurs.get(info.id);
    if (ancien && ancien.perso) ancien.perso.liberer();
    const j = {
      id: info.id, nom: info.nom, style: info.style, role: info.role, bot: !!info.bot, points: info.points || 0,
      pose: info.pose || 0, peauPng: info.peau || null, couleurs: info.couleurs || null, tampon: [], vitesse: new THREE.Vector3(),
      x: info.p ? info.p[0] : 0, y: info.p ? info.p[1] : 0, z: info.p ? info.p[2] : 0, yaw: info.yaw || 0,
    };
    E.joueurs.set(j.id, j);
    if (E.carte) creerPerso(j);
    return j;
  }
  function retirerJoueur(id) {
    const j = E.joueurs.get(id);
    if (!j) return;
    if (j.perso) j.perso.liberer();
    E.joueurs.delete(id);
  }
  const moi = () => E.joueurs.get(E.moiId);

  // Petite tache de peinture sur un personnage (quand il est touché)
  function tacheSurPeau(j, couleur) {
    if (!j || !j.perso) return;
    const g = j.perso.canvas.getContext('2d');
    g.fillStyle = couleur;
    for (let i = 0; i < 18; i++) g.fillRect(16 + Math.floor(Math.random() * 24), 16 + Math.floor(Math.random() * 16), 2 + Math.floor(Math.random() * 3), 2);
    j.perso.texture.needsUpdate = true;
  }

  // Poses et animation d'un personnage (cacheur sans arme : les bras se balancent)
  function animerPerso(j, perso, dt, vitesse, enLAir, pitch) {
    const pose = j.role === 'cacheur' ? j.pose : 0;
    if (pose) {
      if (j.poseAffichee !== pose) { perso.poserDanse(POSES[pose] || {}, false); j.poseAffichee = pose; }
      return;
    }
    if (j.poseAffichee > 0) { perso.finDanse(); }
    j.poseAffichee = 0;
    perso.animer(dt, { vitesse, enLAir, pitch: j.role === 'cacheur' ? 0 : pitch });
    if (j.role === 'cacheur') {
      if (perso.arme) perso.arme.visible = false;
      const k = Math.min(1, vitesse / 7);
      const b = Math.sin(perso.temps) * 0.9 * k;
      perso.parties.brasD.pivot.rotation.set(-b, 0, 0.06);
      perso.parties.brasG.pivot.rotation.set(b, 0, -0.06);
    }
  }

  // ---------- Leurres ----------
  function creerLeurre(l) {
    detruireLeurre(l.id, false);
    const proprio = E.joueurs.get(l.owner);
    const style = proprio ? sansAccessoires(styleDe(proprio)) : sansAccessoires(styleParDefaut(l.owner));
    const perso = new Personnage({ style });
    if (perso.arme) perso.arme.visible = false;
    // il porte la peinture du cacheur au moment où il l'a posé
    if (proprio && proprio.perso && proprio.role === 'cacheur') { perso.canvas.getContext('2d').drawImage(proprio.perso.canvas, 0, 0); perso.texture.needsUpdate = true; }
    perso.groupe.position.set(l.p[0], l.p[1], l.p[2]);
    perso.groupe.rotation.y = l.yaw;
    if (l.pose) perso.poserDanse(POSES[l.pose] || {}, false);
    scene.add(perso.groupe);
    E.leurres.set(l.id, { ...l, perso });
  }
  function detruireLeurre(id, effet = true) {
    const l = E.leurres.get(id);
    if (!l) return;
    if (effet) {
      const p = new THREE.Vector3(l.p[0], l.p[1] + 1, l.p[2]);
      effets.explosion(p, ['#ffffff', '#ff5ea8', '#ffd23f', '#3bb3ff'], { nombre: 26, force: 4, taille: 0.1, vie: 0.8, haut: 2 });
      S.son('pouf', { position: p });
    }
    l.perso.liberer();
    E.leurres.delete(id);
  }

  // ---------- Taches de peinture (tirs) ----------
  const texTache = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d'); g.fillStyle = '#fff';
    g.beginPath(); g.arc(32, 32, 20, 0, Math.PI * 2); g.fill();
    for (let i = 0; i < 10; i++) { const a = i * 0.63 + Math.random() * 0.3; const r = 18 + Math.random() * 10; g.beginPath(); g.arc(32 + Math.cos(a) * r, 32 + Math.sin(a) * r, 3 + Math.random() * 5, 0, Math.PI * 2); g.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const geoTache = new THREE.PlaneGeometry(0.7, 0.7);
  function tache(p, n, couleur) {
    const m = new THREE.Mesh(geoTache, new THREE.MeshLambertMaterial({ map: texTache, color: couleur, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 }));
    const normale = new THREE.Vector3(n[0], n[1], n[2]);
    m.position.set(p[0], p[1], p[2]).addScaledVector(normale, 0.01);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normale);
    m.rotateZ(Math.random() * Math.PI * 2);
    m.scale.setScalar(0.7 + Math.random() * 0.6);
    scene.add(m);
    E.taches.push(m);
    if (E.taches.length > 160) { const v = E.taches.shift(); v.material.dispose(); v.removeFromParent(); }
  }

  // ---------- Peinture (cacheurs) ----------
  const peinture = new Peinture({
    son: (n) => { if (n === 'pinceau') S.pinceau(); },
    surChangement: (fini) => envoyerPeau(fini),
    surFermer: () => { if (!tactile && E.ecran === 'jeu') $('jeu').requestPointerLock?.(); },
  });
  function envoyerPeau(fini) {
    const now = performance.now();
    clearTimeout(E.peauEnAttente);
    if (!fini && now - E.peauEnvoyee < 350) { E.peauEnAttente = setTimeout(() => envoyerPeau(true), 380); return; }
    if (!monPerso || E.role !== 'cacheur') return;
    E.peauEnvoyee = now;
    envoyer({ t: 'peau', png: monPerso.canvas.toDataURL('image/png'), couleurs: couleursMoyennes(monPerso.canvas) });
  }
  function ouvrirPeinture() {
    if (E.role !== 'cacheur' || E.ecran !== 'jeu' || !monPerso) return;
    if (document.pointerLockElement) document.exitPointerLock();
    peinture.ouvrir();
  }
  // Pipette dans le décor : la couleur du pixel du jeu sous le clic (avec la lumière, comme les chercheurs la voient)
  $('jeu').addEventListener('pointerdown', (e) => {
    if (!peinture.ouvert || peinture.outil !== 'pipette') return;
    const gl = renderer.getContext();
    const r = renderer.domElement.getBoundingClientRect();
    const k = renderer.domElement.width / r.width;
    const px = new Uint8Array(4);
    gl.readPixels(Math.floor((e.clientX - r.left) * k), Math.floor((r.bottom - e.clientY) * k), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    peinture.pipetteDecor(`#${[px[0], px[1], px[2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`);
  });

  // ---------- Actions ----------
  function changerPose(p) {
    if (E.role !== 'cacheur' || E.pose === p) return;
    E.pose = p;
    const m = moi();
    if (m) m.pose = p;
    envoyer({ t: 'pose', p });
  }
  function poserLeurre() {
    if (E.role !== 'cacheur' || E.leurreUtilise) return;
    if (E.etat !== 'cachette' && E.etat !== 'recherche') return;
    E.leurreUtilise = true;
    envoyer({ t: 'leurre' });
  }
  function demanderRadar() {
    if (E.role !== 'chercheur' || E.etat !== 'recherche') return;
    if (E.radarUtilise) { toast('Radar déjà utilisé pendant cette manche.'); return; }
    E.radarUtilise = true;
    envoyer({ t: 'radar' });
  }
  function tirer() {
    const now = performance.now();
    if (E.role !== 'chercheur' || E.etat !== 'recherche' || E.ecran !== 'jeu') return;
    if (now < E.bloqueJusqua) { S.son('vide', { vol: 0.5 }); return; }
    if (now - E.dernierTir < R.cadenceMs) return;
    E.dernierTir = now;
    camera.updateMatrixWorld();
    const d = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    envoyer({ t: 'tir', d: [d.x, d.y, d.z].map((v) => Math.round(v * 1000) / 1000) });
    if (armeVue) armeVue.tirer(1);
    S.tirPeinture();
  }

  // ---------- Clavier, souris ----------
  addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) return;
    if (E.ecran !== 'jeu') return;
    if (e.code === 'Tab') { e.preventDefault(); montrerTableau(true); return; }
    if (e.code === 'KeyP') { if (peinture.ouvert) peinture.fermer(); else ouvrirPeinture(); return; }
    if (peinture.ouvert) { if (e.code === 'Escape') peinture.fermer(); return; }
    touches.add(e.code);
    if (e.repeat) return;
    if (e.code === 'Digit1' || e.code === 'Numpad1') changerPose(1);
    else if (e.code === 'Digit2' || e.code === 'Numpad2') changerPose(2);
    else if (e.code === 'Digit3' || e.code === 'Numpad3') changerPose(3);
    else if (e.code === 'Digit0' || e.code === 'Numpad0') changerPose(0);
    else if (e.code === 'KeyL') poserLeurre();
    else if (e.code === 'KeyR') demanderRadar();
    else if (e.code === 'KeyF' && armeVue && E.role === 'chercheur') armeVue.inspecter();
    if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
  });
  addEventListener('keyup', (e) => {
    touches.delete(e.code);
    if (e.code === 'Tab') montrerTableau(false);
  });
  addEventListener('blur', () => touches.clear());
  $('jeu').addEventListener('click', () => {
    if (tactile || E.ecran !== 'jeu' || peinture.ouvert || !$('pause').hidden) return;
    if (!document.pointerLockElement) $('jeu').requestPointerLock?.();
  });
  addEventListener('mousedown', (e) => { if (e.button === 0 && document.pointerLockElement) tirer(); });
  addEventListener('mousemove', (e) => {
    if (!document.pointerLockElement || E.ecran !== 'jeu') return;
    const k = 0.0022 * prefs.sensibilite;
    joueur.yaw -= e.movementX * k;
    joueur.pitch -= e.movementY * k * (prefs.inverser ? -1 : 1);
    joueur.pitch = Math.max(-1.5, Math.min(1.5, joueur.pitch));
  });
  addEventListener('wheel', (e) => { if (E.ecran === 'jeu') E.distCam = Math.max(1.8, Math.min(7, E.distCam + Math.sign(e.deltaY) * 0.4)); }, { passive: true });
  document.addEventListener('pointerlockchange', () => {
    if (!document.pointerLockElement && E.ecran === 'jeu' && !peinture.ouvert && !tactile && E.etat !== 'fin') $('pause').hidden = false;
    if (document.pointerLockElement) $('pause').hidden = true;
  });

  // ---------- Commandes tactiles ----------
  if (tactile) {
    $('tactile').hidden = false;
    const joy = $('joystick'); const bouton = $('joystick-bouton');
    let doigtJoy = null;
    const majJoy = (t) => {
      const r = joy.getBoundingClientRect();
      let x = (t.clientX - (r.left + r.width / 2)) / (r.width / 2);
      let y = (t.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const n = Math.hypot(x, y);
      if (n > 1) { x /= n; y /= n; }
      joueur.analogique.cote = x; joueur.analogique.avant = -y;
      bouton.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
    };
    joy.addEventListener('touchstart', (e) => { e.preventDefault(); doigtJoy = e.changedTouches[0].identifier; majJoy(e.changedTouches[0]); }, { passive: false });
    joy.addEventListener('touchmove', (e) => { e.preventDefault(); for (const t of e.changedTouches) if (t.identifier === doigtJoy) majJoy(t); }, { passive: false });
    const finJoy = (e) => { for (const t of e.changedTouches) if (t.identifier === doigtJoy) { doigtJoy = null; joueur.analogique.cote = 0; joueur.analogique.avant = 0; bouton.style.transform = ''; } };
    joy.addEventListener('touchend', finJoy); joy.addEventListener('touchcancel', finJoy);
    // regarder : glisser le doigt sur le jeu
    const regards = new Map();
    $('jeu').addEventListener('touchstart', (e) => { if (peinture.ouvert) return; for (const t of e.changedTouches) regards.set(t.identifier, [t.clientX, t.clientY]); }, { passive: true });
    $('jeu').addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) {
        const a = regards.get(t.identifier);
        if (!a) continue;
        joueur.yaw -= (t.clientX - a[0]) * 0.006 * prefs.sensibilite;
        joueur.pitch = Math.max(-1.5, Math.min(1.5, joueur.pitch - (t.clientY - a[1]) * 0.006 * prefs.sensibilite * (prefs.inverser ? -1 : 1)));
        regards.set(t.identifier, [t.clientX, t.clientY]);
      }
    }, { passive: true });
    const finRegard = (e) => { for (const t of e.changedTouches) regards.delete(t.identifier); };
    $('jeu').addEventListener('touchend', finRegard); $('jeu').addEventListener('touchcancel', finRegard);
  }
  function majBoutonsTactiles() {
    if (!tactile) return;
    const b = (ico, texte, action, maintenu = false) => {
      const x = el('button', { type: 'button' }, el('span', { class: 'ico', text: ico }), texte);
      if (maintenu) {
        x.addEventListener('touchstart', (e) => { e.preventDefault(); action(true); }, { passive: false });
        x.addEventListener('touchend', (e) => { e.preventDefault(); action(false); }, { passive: false });
      } else x.addEventListener('touchstart', (e) => { e.preventDefault(); action(); }, { passive: false });
      return x;
    };
    const saut = b('⬆', 'Sauter', (oui) => { joueur.sautTactile = oui; }, true);
    const liste = E.role === 'chercheur'
      ? [b('🔫', 'Tirer', () => tirer()), b('📡', 'Radar', () => demanderRadar()), saut, b('☰', 'Menu', () => { $('pause').hidden = false; })]
      : [b('🎨', 'Peindre', () => (peinture.ouvert ? peinture.fermer() : ouvrirPeinture())), b('🧍', 'Pose', () => changerPose((E.pose + 1) % 4)),
        b('🦎', 'Leurre', () => poserLeurre()), saut, b('☰', 'Menu', () => { $('pause').hidden = false; })];
    $('boutons-tactiles').replaceChildren(...liste);
  }

  // ---------- Hall et salle d'attente ----------
  on('salons', (m) => {
    if (m.moi) { E.moiId = m.moi.id; E.monNom = m.moi.nom; E.admin = !!m.moi.admin; }
    if (m.style !== undefined) E.monStyle = m.style;
    if (m.cartes) {
      E.cartes = m.cartes;
      const sel = $('choix-carte');
      const avant = sel.value;
      sel.replaceChildren(...m.cartes.map((c) => el('option', { value: c.id, text: c.nom })));
      if (avant) sel.value = avant;
    }
    const ul = $('salons');
    const liste = (m.liste || []).filter((s) => s.n > 0);
    ul.replaceChildren(...(liste.length ? liste.map((s) => el('li', {},
      el('span', {}, el('b', { text: s.code }), ` · ${s.nomCarte} · ${s.n}/${s.max} · ${s.etat === 'attente' ? 'en attente' : 'en jeu'}`),
      el('button', { class: 'btn btn-petit', type: 'button', text: 'Rejoindre', onclick: () => envoyer({ t: 'rejoindre', code: s.code }) })))
      : [el('li', { class: 'vide', text: 'Aucun salon pour l\'instant : crée le tien !' })]));
  });
  on('erreur', (m) => { toast(m.message); $('hall-etat').textContent = m.message; });
  $('btn-bots-cacher').addEventListener('click', () => { S.initSons(prefs.volume); envoyer({ t: 'creer', carte: $('choix-carte').value, seul: 1, role: 'cacheur' }); });
  $('btn-bots-chercher').addEventListener('click', () => { S.initSons(prefs.volume); envoyer({ t: 'creer', carte: $('choix-carte').value, seul: 1, role: 'chercheur' }); });
  $('btn-creer').addEventListener('click', () => { S.initSons(prefs.volume); envoyer({ t: 'creer', carte: $('choix-carte').value }); });
  $('btn-rejoindre').addEventListener('click', () => { S.initSons(prefs.volume); envoyer({ t: 'rejoindre', code: $('code').value.trim().toUpperCase() }); });
  $('code').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('btn-rejoindre').click(); });
  $('btn-commencer').addEventListener('click', () => { S.initSons(prefs.volume); envoyer({ t: 'commencer' }); });
  $('btn-quitter-att').addEventListener('click', () => { envoyer({ t: 'quitter' }); sortirSalon(); });
  $('btn-quitter').addEventListener('click', () => { envoyer({ t: 'quitter' }); sortirSalon(); });
  $('btn-reprendre').addEventListener('click', () => { $('pause').hidden = true; if (!tactile) $('jeu').requestPointerLock?.(); });
  for (const id of ['btn-regles', 'btn-regles2']) $(id).addEventListener('click', () => { $('regles').hidden = false; });
  for (const id of ['btn-reglages', 'btn-reglages2']) $(id).addEventListener('click', () => { $('reglages').hidden = false; });
  for (const b of document.querySelectorAll('[data-fermer]')) b.addEventListener('click', () => { b.closest('.ecran').hidden = true; });
  $('r-sensibilite').value = prefs.sensibilite; $('r-volume').value = prefs.volume; $('r-inverser').checked = prefs.inverser;
  $('r-sensibilite').addEventListener('input', () => { prefs.sensibilite = Number($('r-sensibilite').value); sauverPrefs(); });
  $('r-volume').addEventListener('input', () => { prefs.volume = Number($('r-volume').value); S.reglerVolume(prefs.volume); sauverPrefs(); });
  $('r-inverser').addEventListener('change', () => { prefs.inverser = $('r-inverser').checked; sauverPrefs(); });

  function sortirSalon(silencieux = false) {
    peinture.fermer();
    if (document.pointerLockElement) document.exitPointerLock();
    for (const id of [...E.joueurs.keys()]) retirerJoueur(id);
    for (const id of [...E.leurres.keys()]) detruireLeurre(id, false);
    monPerso = null;
    E.salon = null; E.role = null; E.ecran = 'hall';
    $('hud').hidden = true; $('bandeau').hidden = true; $('tableau').hidden = true;
    montrer('hall');
    if (!silencieux) envoyer({ t: 'salons' });
  }

  on('bienvenue', async (m) => {
    await chargerCarte(m.carte);
    E.salon = m.code; E.moiId = m.moi; E.etat = m.etat; E.manche = m.manche;
    E.finA = performance.now() + (m.finDans || 0);
    E.departA = m.departDans ? performance.now() + m.departDans : 0;
    for (const id of [...E.joueurs.keys()]) retirerJoueur(id);
    for (const id of [...E.leurres.keys()]) detruireLeurre(id, false);
    for (const info of m.joueurs) ajouterJoueur(info);
    for (const l of m.leurres || []) creerLeurre(l);
    const j = moi();
    E.role = j ? j.role : null;
    E.points = j ? j.points : 0;
    $('att-code').textContent = m.code;
    const c = E.cartes.find((x) => x.id === m.carte);
    $('att-carte').textContent = c ? `${c.nom} — ${c.description}` : m.carte;
    if (m.etat === 'attente') entrerAttente();
    else entrerJeu(); // en pleine manche : on arrive comme chercheur
  });
  function entrerAttente() {
    E.ecran = 'attente';
    $('hud').hidden = true;
    montrer('attente');
    majAttente();
  }
  function majAttente(info, listeAussi = true) {
    if (listeAussi) $('att-joueurs').replaceChildren(...[...E.joueurs.values()].map((j) => el('li', { text: `${j.bot ? '🤖 ' : ''}${j.nom}${j.id === E.moiId ? ' (toi)' : ''}` })));
    const n = [...E.joueurs.values()].filter((j) => !j.bot).length;
    let t = n < 2 ? 'Tout seul ? Clique sur « Commencer » : des bots viendront jouer avec toi.' : 'La partie démarre toute seule bientôt, ou clique sur « Commencer ».';
    if (E.departA) t = `Départ dans ${Math.max(0, Math.ceil((E.departA - performance.now()) / 1000))} s… (ou « Commencer » tout de suite)`;
    if (info && info.seul) t = 'Il faut au moins 2 joueurs (ou des bots). Clique sur « Commencer » pour jouer avec des bots.';
    $('att-info').textContent = t;
  }
  on('attente', (m) => { E.departA = m.dans ? performance.now() + m.dans : 0; if (E.ecran === 'attente') majAttente(m); });
  on('entree', (m) => { ajouterJoueur(m.joueur); if (E.ecran === 'attente') majAttente(); else if (!m.joueur.bot) toast(`${m.joueur.nom} arrive (côté chercheurs)`); });
  on('sortie', (m) => { const j = E.joueurs.get(m.id); if (j && E.ecran === 'jeu' && !j.bot) toast(`${j.nom} est parti`); retirerJoueur(m.id); if (E.ecran === 'attente') majAttente(); });

  // ---------- Manches ----------
  function entrerJeu() {
    E.ecran = 'jeu';
    montrer(null);
    $('hud').hidden = false;
    $('fin').hidden = true;
    joueur.vivant = true;
    const j = moi();
    if (j) { joueur.placer([j.x, j.y, j.z], j.yaw); E.facing = j.yaw; }
    majRole();
    if (!tactile) $('jeu').requestPointerLock?.();
  }
  function majRole() {
    const cacheur = E.role === 'cacheur';
    $('role').className = cacheur ? 'cacheur' : 'chercheur';
    $('role').textContent = cacheur ? '🦎 CACHEUR' : '🔫 CHERCHEUR';
    $('viseur').hidden = cacheur;
    $('aide-touches').replaceChildren(...(cacheur
      ? ['<kbd>P</kbd> se peindre (pipette 💧 dans le décor)', '<kbd>1</kbd> statue · <kbd>2</kbd> accroupi · <kbd>3</kbd> allongé', '<kbd>L</kbd> leurre (1 par manche) · molette : caméra']
      : ['<kbd>Clic</kbd> tirer de la peinture (raté = bloqué 2,5 s)', '<kbd>R</kbd> radar (1 par manche)', '<kbd>Tab</kbd> scores']).map((h) => { const d = document.createElement('div'); d.innerHTML = h; return d; }));
    if (!cacheur && !armeVue) armeVue = new ArmeVue(normaliserStyle(E.monStyle || styleParDefaut(E.moiId)), [armePeinture]);
    if (!cacheur) peinture.fermer();
    majBoutonsTactiles();
  }
  on('manche', (m) => {
    E.etat = m.etat; E.manche = m.manche;
    E.finA = performance.now() + m.finDans;
    E.pose = 0; E.leurreUtilise = false; E.radarUtilise = false; E.bloqueJusqua = 0; E.radar = null;
    for (const id of [...E.leurres.keys()]) detruireLeurre(id, false);
    for (const t of E.taches) { t.material.dispose(); t.removeFromParent(); }
    E.taches = [];
    for (const r of m.joueurs) {
      const j = E.joueurs.get(r.id);
      if (!j) continue;
      Object.assign(j, { role: r.role, x: r.p[0], y: r.p[1], z: r.p[2], yaw: r.yaw, pose: 0, peauPng: null, couleurs: null, tampon: [] });
      if (j.id === E.moiId) E.role = r.role;
      creerPerso(j);
    }
    entrerJeu();
    S.son('lobby_depart', { vol: 0.8 });
    toast(E.role === 'cacheur' ? '🦎 Tu es CACHEUR : cache-toi et peins-toi (touche P) !' : '🔫 Tu es CHERCHEUR : attends que les cacheurs se cachent…');
  });
  on('etat', (m) => {
    E.etat = m.etat;
    E.finA = performance.now() + m.finDans;
    if (m.etat === 'recherche') {
      S.son('apparition');
      toast(E.role === 'chercheur' ? '🔍 À toi de jouer : trouve-les !' : '⚠ Les chercheurs arrivent ! Ne bouge plus…');
    }
  });
  on('fin', (m) => {
    E.etat = 'fin';
    E.finA = performance.now() + m.finDans;
    peinture.fermer();
    const gagne = (m.gagnants === 'cacheurs' && m.restants.includes(E.moiId)) || (m.gagnants === 'chercheurs' && E.role === 'chercheur');
    $('fin-titre').textContent = m.gagnants === 'cacheurs' ? '🦎 Les cacheurs gagnent !' : '🔫 Les chercheurs ont trouvé tout le monde !';
    $('fin-classement').replaceChildren(...m.classement.map((c) => el('li', {}, el('b', { text: c.nom }), ` — ${c.points} pts`,
      el('span', { class: 'role', text: m.restants.includes(c.id) ? '🦎 jamais trouvé' : '' }))));
    $('fin-info').textContent = 'Nouvelle manche dans quelques secondes (avec de nouveaux chercheurs)…';
    $('fin').hidden = false;
    if (document.pointerLockElement) document.exitPointerLock();
    $('pause').hidden = true;
    S.son(gagne ? 'victoire' : 'pouf', { vol: 0.8 });
  });
  on('scores', (m) => { for (const [id, p] of Object.entries(m.points)) { const j = E.joueurs.get(Number(id)); if (j) j.points = p; } const j = moi(); if (j) E.points = j.points; });

  // ---------- Pendant la manche ----------
  on('s', (m) => {
    const now = performance.now();
    for (const [id, x, y, z, yaw, pitch, pose] of m.j) {
      const j = E.joueurs.get(id);
      if (!j || id === E.moiId) continue;
      j.tampon.push({ t: now, x, y, z, yaw, pitch });
      if (j.tampon.length > 30) j.tampon.shift();
      j.pose = pose;
    }
  });
  on('corr', (m) => { joueur.pos.set(m.p[0], m.p[1], m.p[2]); joueur.vit.set(0, 0, 0); });
  on('ping', (m) => envoyer({ t: 'pong', s: m.s }));
  on('peau', (m) => {
    const j = E.joueurs.get(m.id);
    if (!j || j.id === E.moiId) return;
    j.peauPng = m.png || null;
    j.couleurs = m.couleurs || null;
    appliquerPeau(j);
  });
  on('pose', (m) => { const j = E.joueurs.get(m.id); if (j && m.id !== E.moiId) j.pose = m.p; });
  on('tir', (m) => {
    const couleur = couleurDe(m.id);
    const o = new THREE.Vector3(...m.o); const f = new THREE.Vector3(...m.f);
    const tireur = E.joueurs.get(m.id);
    const depart = tireur && tireur.perso && m.id !== E.moiId ? tireur.perso.boutDuCanon(new THREE.Vector3()) : o.clone().add(new THREE.Vector3(0, -0.15, 0));
    effets.trait(depart, f, { couleur: new THREE.Color(couleur).getHex(), epaisseur: 0.05, duree: 0.18, opacite: 0.9 });
    effets.explosion(f, [couleur, '#ffffff'], { nombre: 14, force: 3, taille: 0.07, vie: 0.6, haut: 1 });
    if (m.n) tache(m.f, m.n, couleur);
    if (m.id !== E.moiId) S.tirPeinture(o);
    S.splat(f, !!m.cible);
    if (m.cible) tacheSurPeau(E.joueurs.get(m.cible), couleur);
  });
  on('rate', (m) => {
    E.bloqueJusqua = performance.now() + m.ms;
    S.rate();
    toast(m.leurre ? `🦎 C'était un leurre ! Bloqué ${(m.ms / 1000).toFixed(1).replace('.', ',')} s` : `Raté ! Bloqué ${(m.ms / 1000).toFixed(1).replace('.', ',')} s`);
  });
  on('trouve', (m) => {
    const j = E.joueurs.get(m.id);
    const par = E.joueurs.get(m.par);
    for (const [id, p] of Object.entries(m.points || {})) { const x = E.joueurs.get(Number(id)); if (x) x.points = p; }
    const p = new THREE.Vector3(m.p[0], m.p[1] + 1, m.p[2]);
    effets.explosion(p, [couleurDe(m.par), '#ffffff', '#ffd23f'], { nombre: 40, force: 6, taille: 0.1, vie: 1, haut: 3 });
    if (m.id === E.moiId) {
      E.role = 'chercheur'; E.pose = 0;
      S.son('elimination');
      toast(`🎯 ${par ? par.nom : 'Quelqu\'un'} t'a trouvé ! Tu deviens chercheur 🔫`);
      if (j) { j.role = 'chercheur'; j.pose = 0; j.peauPng = null; creerPerso(j); }
      majRole();
    } else {
      S.trouve();
      toast(`🎯 ${par ? par.nom : '?'} a trouvé ${j ? j.nom : '?'} !`);
      if (j) { j.role = 'chercheur'; j.pose = 0; j.peauPng = null; j.couleurs = null; creerPerso(j); }
    }
    const mm = moi(); if (mm) E.points = mm.points;
  });
  on('leurre', (m) => { creerLeurre(m); if (m.owner === E.moiId) toast('🦎 Leurre posé ! Il ne bouge pas, mais il te ressemble.'); });
  on('leurreDetruit', (m) => { detruireLeurre(m.id, true); if (m.par && m.par !== E.moiId) { const j = E.joueurs.get(m.par); if (j) toast(`🦎 ${j.nom} a tiré sur un leurre !`); } });
  on('sifflet', (m) => {
    for (const p of m.p) {
      const v = new THREE.Vector3(p[0], p[1], p[2]);
      S.sifflet(v);
      if (E.role === 'cacheur' && v.distanceTo(new THREE.Vector3(joueur.pos.x, joueur.pos.y + 1.2, joueur.pos.z)) < 1.5) toast('🎵 Tu as sifflé ! Les chercheurs ont entendu d\'où ça vient…');
    }
  });
  on('radar', (m) => { E.radar = { dirs: m.dirs, fin: performance.now() + m.ms }; S.radar(); });

  // ---------- Tableau des scores (Tab) ----------
  function montrerTableau(oui) {
    $('tableau').hidden = !oui;
    if (!oui) return;
    const lignes = [...E.joueurs.values()].sort((a, b) => b.points - a.points)
      .map((j) => `<tr><td>${j.role === 'cacheur' ? '🦎' : '🔫'}</td><td></td><td>${j.points}</td></tr>`);
    $('tableau').innerHTML = `<table><tr><th></th><th>Joueur</th><th>Points</th></tr>${lignes.join('')}</table>`;
    // (les noms sont écrits avec textContent : jamais de code dans un pseudo)
    const noms = [...E.joueurs.values()].sort((a, b) => b.points - a.points);
    $('tableau').querySelectorAll('tr td:nth-child(2)').forEach((td, i) => { td.textContent = `${noms[i].bot ? '🤖 ' : ''}${noms[i].nom}${noms[i].id === E.moiId ? ' (toi)' : ''}`; });
  }

  // ---------- Boucle ----------
  let dernier = performance.now();
  let angleHall = 0;
  const _v = new THREE.Vector3();
  function boucle() {
    requestAnimationFrame(boucle);
    const now = performance.now();
    const dt = Math.min(0.05, (now - dernier) / 1000);
    dernier = now;
    if (E.monde) E.monde.animer(dt);
    effets.maj(dt);

    if (E.ecran !== 'jeu' || !E.carte) {
      // hall ou salle d'attente : la caméra tourne lentement au-dessus de la carte
      angleHall += dt * 0.08;
      const T = E.carte ? E.carte.taille : 30;
      camera.position.set(Math.sin(angleHall) * T * 1.1, T * 0.75, Math.cos(angleHall) * T * 1.1);
      camera.lookAt(0, 0, 0);
      if (E.ecran === 'attente' && E.departA) majAttente(null, false);
      renderer.render(scene, camera);
      return;
    }

    const cacheur = E.role === 'cacheur';
    const yeuxBandes = E.etat === 'cachette' && E.role === 'chercheur';
    $('bandeau').hidden = !yeuxBandes;
    if (yeuxBandes) $('bandeau-chrono').textContent = mmss(E.finA - now);

    // --- moi ---
    joueur.actif = (tactile || !!document.pointerLockElement) && !peinture.ouvert && $('pause').hidden && E.etat !== 'fin';
    if (cacheur && E.pose && veutBouger() && joueur.actif) changerPose(0); // bouger fait quitter la pose
    if (!yeuxBandes && !(cacheur && E.pose)) joueur.maj(dt);
    const vh = joueur.vitesseHorizontale();
    if (cacheur) {
      if (vh > 0.5 && !E.pose) E.facing = Math.atan2(-joueur.vit.x, -joueur.vit.z);
      const m = moi();
      if (m && m.perso) {
        m.perso.groupe.position.copy(joueur.pos);
        m.perso.groupe.rotation.y = E.facing;
        m.pose = E.pose;
        animerPerso(m, m.perso, dt, vh, !joueur.auSol, 0);
        m.perso.groupe.visible = true;
      }
      // caméra à la 3e personne, derrière moi (sans traverser les murs)
      const hauteur = E.pose === 3 ? 0.6 : E.pose === 2 ? 1.0 : 1.5;
      const cible = [joueur.pos.x, joueur.pos.y + hauteur, joueur.pos.z];
      const pitch = Math.max(-1.2, Math.min(0.9, joueur.pitch));
      const dir = [Math.sin(joueur.yaw) * Math.cos(pitch), -Math.sin(pitch), Math.cos(joueur.yaw) * Math.cos(pitch)];
      const d = Math.max(0.6, rayon(cible, dir, E.distCam) - 0.25);
      camera.position.set(cible[0] + dir[0] * d, cible[1] + dir[1] * d, cible[2] + dir[2] * d);
      camera.rotation.set(pitch, joueur.yaw, 0, 'YXZ');
    } else {
      joueur.appliquerCamera(camera);
      const m = moi();
      if (m && m.perso) m.perso.groupe.visible = false;
    }

    // --- les autres (positions adoucies) ---
    const rendu = now - DELAI;
    for (const j of E.joueurs.values()) {
      if (j.id === E.moiId || !j.perso) continue;
      const b = j.tampon;
      if (b.length) {
        let a = b[b.length - 1]; let c = a;
        for (let i = b.length - 1; i > 0; i--) if (b[i - 1].t <= rendu) { a = b[i - 1]; c = b[i]; break; }
        if (rendu >= c.t) a = c;
        const k = c.t > a.t ? Math.max(0, Math.min(1, (rendu - a.t) / (c.t - a.t))) : 1;
        let dyaw = c.yaw - a.yaw;
        if (dyaw > Math.PI) dyaw -= Math.PI * 2;
        if (dyaw < -Math.PI) dyaw += Math.PI * 2;
        const g = j.perso.groupe;
        const px = g.position.x; const pz = g.position.z;
        g.position.set(a.x + (c.x - a.x) * k, a.y + (c.y - a.y) * k, a.z + (c.z - a.z) * k);
        g.rotation.y = a.yaw + dyaw * k;
        if (dt > 0) j.vitesse.set((g.position.x - px) / dt, 0, (g.position.z - pz) / dt);
        while (b.length > 2 && b[1].t < rendu - 500) b.shift();
        animerPerso(j, j.perso, dt, Math.hypot(j.vitesse.x, j.vitesse.z), false, a.pitch);
      }
      j.perso.groupe.visible = E.etat !== 'attente';
    }

    renderer.render(scene, camera);
    S.majAuditeur(camera);

    // --- le pistolet à peinture (chercheur, à la 1re personne) ---
    if (!cacheur && armeVue && !yeuxBandes) {
      armeVue.maj(dt, { vitesse: Math.min(1, vh / R.joueur.vitesse), auSol: joueur.auSol, vy: joueur.vit.y, sourisX: 0, sourisY: 0, viser: false, lateral: 0, munitions: 1, gadgetPret: true });
      armeVue.dessiner(renderer, camera.aspect, 1);
    }

    // --- HUD ---
    const reste = E.finA - now;
    $('phase').textContent = E.etat === 'cachette' ? (cacheur ? '🙈 Cache-toi !' : '🙈 Ils se cachent…') : E.etat === 'recherche' ? '🔍 Recherche' : E.etat === 'fin' ? '🏁 Fin de la manche' : '⏳ Attente';
    $('chrono').textContent = mmss(reste);
    $('chrono').classList.toggle('urgent', reste < 20000 && E.etat !== 'fin');
    const nCacheurs = [...E.joueurs.values()].filter((j) => j.role === 'cacheur').length;
    const nChercheurs = [...E.joueurs.values()].filter((j) => j.role === 'chercheur').length;
    $('compte').textContent = `🦎 ${nCacheurs} · 🔫 ${nChercheurs}`;
    $('mes-points').textContent = `⭐ ${E.points} pts${E.role === 'cacheur' && E.pose ? ` · ${NOMS_POSES[E.pose]}` : ''}`;
    const bloque = E.role === 'chercheur' && now < E.bloqueJusqua;
    $('viseur').classList.toggle('bloque', bloque);
    $('penalite').hidden = !bloque;
    if (bloque) $('penalite').textContent = `Bloqué ${((E.bloqueJusqua - now) / 1000).toFixed(1).replace('.', ',')} s`;
    // bips des 5 dernières secondes
    if ((E.etat === 'cachette' || E.etat === 'recherche') && reste < 5500 && reste > 0) {
      const s = Math.ceil(reste / 1000);
      if (s !== E.dernierBip) { E.dernierBip = s; S.bip(s === 1); }
    }
    // flèches du radar
    if (E.radar && now < E.radar.fin) {
      $('fleches').replaceChildren(...E.radar.dirs.map(([dx, dz, dist]) => {
        const angle = Math.atan2(dx, -dz) + joueur.yaw; // 0 = devant moi
        const f = el('div', { class: 'fleche' }, el('span', { text: `${dist} m` }));
        f.style.transform = `rotate(${angle}rad)`;
        return f;
      }));
    } else if (E.radar) { E.radar = null; $('fleches').replaceChildren(); }

    // --- j'envoie ma position (20 fois par seconde) ---
    if (now - E.dernierEnvoi > 50 && E.etat !== 'attente') {
      E.dernierEnvoi = now;
      const yaw = cacheur ? E.facing : joueur.yaw;
      envoyer({ t: 'm', p: [joueur.pos.x, joueur.pos.y, joueur.pos.z].map((v) => Math.round(v * 100) / 100), r: [Math.round(yaw * 1000) / 1000, Math.round(joueur.pitch * 1000) / 1000] });
    }
  }

  // Le hall montre la première carte pendant la connexion
  try { await chargerCarte('maison'); } catch { /* pas grave */ }
  requestAnimationFrame(boucle);
  connecter();
  if (location.search.includes('debug')) window.__cam = { E, joueur, camera, peinture, envoyer, get armeVue() { return armeVue; } };
}

demarrer();
