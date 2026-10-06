// Les commandes du joueur : clavier, souris et manette (Xbox, PlayStation, Switch Pro...).
// Chaque action (sauter, tirer, recharger...) a ses touches. On peut les changer dans les réglages :
// elles sont gardées dans ce navigateur.
//
// Clavier : on retient la position physique de la touche (e.code), comme ça ZQSD sur un clavier
// français et WASD sur un clavier anglais marchent tous les deux. La souris compte comme des touches
// (« Souris0 » = clic gauche, « Souris2 » = clic droit, « MoletteHaut » / « MoletteBas »).
// Manette : numéro des boutons dans la disposition « standard » des navigateurs
// (0 A, 1 B, 2 X, 3 Y, 4 LB, 5 RB, 6 LT, 7 RT, 8 Affichage, 9 Menu, 10 et 11 clic des sticks, 12 à 15 la croix).
// Le stick gauche fait avancer, le stick droit fait regarder (voir main.js).

// quand : 'vivant' (en jouant, par défaut), 'mort' (éliminé) ou 'partout'. Deux actions qui ne servent pas
// au même moment peuvent avoir la même touche (C : descendre en vol, ou changer d'armes quand on est éliminé).
export const ACTIONS = [
  { id: 'avancer', nom: 'Avancer', groupe: 'Se déplacer', clavier: ['KeyW', 'ArrowUp'], manette: [], stick: true },
  { id: 'reculer', nom: 'Reculer', groupe: 'Se déplacer', clavier: ['KeyS', 'ArrowDown'], manette: [], stick: true },
  { id: 'gauche', nom: 'Aller à gauche', groupe: 'Se déplacer', clavier: ['KeyA', 'ArrowLeft'], manette: [], stick: true },
  { id: 'droite', nom: 'Aller à droite', groupe: 'Se déplacer', clavier: ['KeyD', 'ArrowRight'], manette: [], stick: true },
  { id: 'sauter', nom: 'Sauter', groupe: 'Se déplacer', clavier: ['Space'], manette: [0] },
  { id: 'tirer', nom: 'Tirer', groupe: 'Combat', clavier: ['Souris0'], manette: [7] },
  { id: 'viser', nom: 'Viser', groupe: 'Combat', clavier: ['Souris2', 'ShiftLeft'], manette: [6] },
  { id: 'recharger', nom: 'Recharger', groupe: 'Combat', clavier: ['KeyR'], manette: [2] },
  { id: 'inspecter', nom: 'Regarder son arme', groupe: 'Combat', clavier: ['KeyF'], manette: [12] },
  { id: 'armeSuivante', nom: 'Arme suivante', groupe: 'Armes', clavier: ['KeyE', 'MoletteBas'], manette: [3] },
  { id: 'armePrecedente', nom: 'Arme précédente', groupe: 'Armes', clavier: ['MoletteHaut'], manette: [4] },
  { id: 'arme1', nom: 'Arme principale', groupe: 'Armes', clavier: ['Digit1', 'Numpad1'], manette: [14] },
  { id: 'arme2', nom: 'Arme secondaire', groupe: 'Armes', clavier: ['Digit2', 'Numpad2'], manette: [15] },
  { id: 'arme3', nom: 'Mêlée', groupe: 'Armes', clavier: ['Digit3', 'Numpad3'], manette: [11] },
  { id: 'arme4', nom: 'Gadget', groupe: 'Armes', clavier: ['Digit4', 'Numpad4'], manette: [5] },
  { id: 'danser', nom: 'Danser', groupe: 'Autres', clavier: ['KeyB'], manette: [13] },
  { id: 'scores', nom: 'Scores', groupe: 'Autres', clavier: ['Tab'], manette: [8], quand: 'partout' },
  { id: 'changerArmes', nom: 'Changer d\'armes (éliminé)', groupe: 'Autres', clavier: ['KeyC'], manette: [2], quand: 'mort' },
  { id: 'menu', nom: 'Menu (pause)', groupe: 'Autres', clavier: [], manette: [9], quand: 'partout', fixe: 'Échap' },
  { id: 'voler', nom: 'Voler ou atterrir', groupe: 'Admin', clavier: ['KeyV'], manette: [10], admin: true },
  { id: 'descendre', nom: 'Descendre en vol', groupe: 'Admin', clavier: ['KeyC'], manette: [1], admin: true },
  { id: 'teleporter', nom: 'Se téléporter là où on vise', groupe: 'Admin', clavier: ['KeyT'], manette: [], admin: true },
  { id: 'frappe', nom: 'Frappe orbitale', groupe: 'Admin', clavier: ['KeyG'], manette: [], admin: true },
];
export const ACTION = Object.fromEntries(ACTIONS.map((a) => [a.id, a]));

// Touches qu'on ne peut pas prendre : Échap libère la souris, F5 recharge la page, F11 plein écran...
const INTERDITES = new Set(['Escape', 'F5', 'F11', 'F12', 'MetaLeft', 'MetaRight', 'OSLeft', 'OSRight']);
const NOMS_TOUCHES = {
  Space: 'Espace', ShiftLeft: 'Maj', ShiftRight: 'Maj droite', ControlLeft: 'Ctrl', ControlRight: 'Ctrl droite',
  AltLeft: 'Alt', AltRight: 'Alt Gr', Tab: 'Tab', Enter: 'Entrée', NumpadEnter: 'Entrée (pavé)', CapsLock: 'Verr. Maj',
  ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Insert: 'Inser', Home: 'Début', End: 'Fin',
  PageUp: 'Page ↑', PageDown: 'Page ↓', Backquote: '²', IntlBackslash: '<', ContextMenu: 'Menu',
  Souris0: 'Clic gauche', Souris1: 'Clic molette', Souris2: 'Clic droit', Souris3: 'Souris arrière', Souris4: 'Souris avant',
  MoletteHaut: 'Molette ↑', MoletteBas: 'Molette ↓',
};
// Sans la carte du clavier (Firefox, Safari) : clavier AZERTY si le navigateur est en français
const AZERTY = { KeyQ: 'A', KeyW: 'Z', KeyA: 'Q', KeyZ: 'W', Semicolon: 'M', KeyM: ',' };
const XBOX = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Affichage', 'Menu', 'L3', 'R3', 'Croix ↑', 'Croix ↓', 'Croix ←', 'Croix →', 'Xbox'];
const PLAYSTATION = ['✕', '○', '□', '△', 'L1', 'R1', 'L2', 'R2', 'Share', 'Options', 'L3', 'R3', 'Croix ↑', 'Croix ↓', 'Croix ←', 'Croix →', 'PS'];
const estPlayStation = (id) => !/xbox|xinput|045e/i.test(id) && /054c|sony|playstation|dualsense|dualshock|wireless controller/i.test(id);

const ZONE_MORTE = 0.16; // les sticks ne sont jamais parfaitement au centre
function zoneMorte(x, y) {
  const n = Math.hypot(x, y);
  if (n < ZONE_MORTE) return [0, 0];
  const k = Math.min(1, (n - ZONE_MORTE) / (1 - ZONE_MORTE)) / n;
  return [x * k, y * k];
}
// On tape du texte (code de la partie...) : les touches ne servent pas au jeu
const saisieTexte = (n) => !!n && (n.isContentEditable || n.tagName === 'TEXTAREA'
  || (n.tagName === 'INPUT' && !['checkbox', 'radio', 'range', 'button', 'submit'].includes(n.type)));
const chevauche = (a, b) => {
  const qa = a.quand || 'vivant';
  const qb = b.quand || 'vivant';
  return qa === 'partout' || qb === 'partout' || qa === qb;
};

export class Commandes {
  // sauvees : ce que renvoie exporter() (ou rien) ; sauver(donnees) : appelé à chaque changement de touche
  constructor(sauvees, sauver) {
    this.sauver = sauver || (() => {});
    this.charger(sauvees);
    this.enfoncees = new Set();   // touches du clavier et boutons de la souris tenus (en jouant)
    this.boutonsJeu = new Set();  // boutons de la manette tenus qui servent au jeu (pas aux menus)
    this.actifClavier = () => false; // le jeu dit quand le clavier et la souris servent à jouer
    this.actifSouris = () => false;
    this.surAppui = () => {};     // (action, { source, code, bouton, evenement })
    this.surRelache = () => {};   // (action, { source })
    this.surBoutonMenu = () => false; // (bouton) : true si ce bouton de la manette sert aux menus (pas au jeu)
    this.surSaisie = () => {};    // la dernière commande vient d'ailleurs : 'clavier', 'manette' ou 'tactile'
    this.surManette = () => {};   // (branchée) : une manette vient d'être branchée ou débranchée
    this.saisie = 'clavier';
    this.capture = null;          // changement de touche en cours (réglages)
    this.ignorerClicJusqua = 0;
    this.pad = { connecte: false, nom: '', ps: false, gx: 0, gy: 0, dx: 0, dy: 0, boutons: [] };
    this.indexPad = null;
    this.molette = { cumul: 0, derniere: 0, dernierChangement: 0 };
    this.carteClavier = null;     // nom des touches sur CE clavier (Chrome, Edge)
    this.azerty = /^fr\b/i.test(navigator.language || '');
    try {
      const p = navigator.keyboard && navigator.keyboard.getLayoutMap && navigator.keyboard.getLayoutMap();
      if (p) p.then((m) => { this.carteClavier = m; }).catch(() => {});
    } catch { /* pas disponible */ }
    this.brancher();
  }

  // ---------- Les touches de chaque action ----------
  charger(s) {
    const ok = (v, type) => (type === 'clavier' ? typeof v === 'string' && /^[A-Za-z0-9]{1,24}$/.test(v) && !INTERDITES.has(v)
      : Number.isInteger(v) && v >= 0 && v < 32);
    this.liaisons = { clavier: {}, manette: {} };
    for (const type of ['clavier', 'manette']) {
      for (const a of ACTIONS) {
        const l = s && s[type] && s[type][a.id];
        this.liaisons[type][a.id] = Array.isArray(l) ? l.filter((v) => ok(v, type)).slice(0, 2) : [...a[type]];
      }
    }
    this.noms = {};
    if (s && s.noms && typeof s.noms === 'object') {
      for (const [code, nom] of Object.entries(s.noms)) if (typeof nom === 'string' && nom.length <= 3) this.noms[code] = nom;
    }
  }
  exporter() { return { clavier: this.liaisons.clavier, manette: this.liaisons.manette, noms: this.noms }; }
  reinitialiser() {
    this.charger(null);
    this.sauver(this.exporter());
  }

  actionsDe(type, code) {
    const res = [];
    for (const a of ACTIONS) if (this.liaisons[type][a.id].includes(code)) res.push(a.id);
    return res;
  }
  // L'action est-elle tenue en ce moment (une de ses touches, ou un de ses boutons de manette) ?
  tenue(id) {
    return this.liaisons.clavier[id].some((c) => this.enfoncees.has(c)) || this.liaisons.manette[id].some((b) => this.boutonsJeu.has(b));
  }
  // Tout est relâché (pause, mort...) sans prévenir : le jeu remet lui-même son état à zéro.
  toutRelacher() {
    this.enfoncees.clear();
    this.boutonsJeu.clear();
  }

  // Donne une touche (ou un bouton) à une action. Renvoie les noms des actions qui l'avaient (elles la perdent).
  assigner(id, type, place, code) {
    const conflits = [];
    for (const a of ACTIONS) {
      if (a.id === id || !chevauche(a, ACTION[id])) continue;
      const l = this.liaisons[type][a.id];
      const k = l.indexOf(code);
      if (k >= 0) { l.splice(k, 1); conflits.push(a.nom); }
    }
    const l = this.liaisons[type][id].filter((c) => c !== code);
    if (place < l.length) l[place] = code; else l.push(code);
    this.liaisons[type][id] = l.slice(0, 2);
    this.sauver(this.exporter());
    return conflits;
  }
  effacer(id, type, place) {
    this.liaisons[type][id].splice(place, 1);
    this.sauver(this.exporter());
  }

  // ---------- Noms à afficher ----------
  nomTouche(code) {
    if (NOMS_TOUCHES[code]) return NOMS_TOUCHES[code];
    let m = /^Digit(\d)$/.exec(code);
    if (m) return m[1];
    m = /^Numpad(.+)$/.exec(code);
    if (m) return `Pavé ${m[1]}`;
    const c = this.carteClavier && this.carteClavier.get(code);
    if (c && c.trim()) return c.toUpperCase();
    if (this.noms[code]) return this.noms[code];
    if (this.azerty && AZERTY[code]) return AZERTY[code];
    m = /^Key([A-Z])$/.exec(code);
    if (m) return m[1];
    return code.replace(/^(Bracket|Intl)/, '');
  }
  nomBouton(i, court = false) {
    const n = (this.pad.ps ? PLAYSTATION : XBOX)[i] || `Bouton ${i}`;
    return court ? n.replace('Croix ', '') : n;
  }
  // Nom de la touche (ou du bouton) d'une action, selon ce qu'on utilise. toutes : « Clic droit ou Maj »
  libelle(id, { type = this.saisie === 'manette' ? 'manette' : 'clavier', toutes = false, court = false } = {}) {
    const a = ACTION[id];
    if (type === 'clavier' && a.fixe) return a.fixe;
    const l = this.liaisons[type][id];
    if (!l.length) return '';
    const noms = l.map((c) => (type === 'clavier' ? this.nomTouche(c) : this.nomBouton(c, court)));
    return toutes ? noms.join(' ou ') : noms[0];
  }

  changerSaisie(s) {
    if (s === this.saisie) return;
    this.saisie = s;
    this.surSaisie(s);
  }

  // ---------- Changer une touche (écran « Touches » des réglages) ----------
  // fini({ code, conflits } | { annule } | { efface } | { interdite })
  // element : la case cliquée. Un bouton de la souris (ou la molette) ne compte que sur cette case :
  // cliquer ailleurs annule (pour ne pas donner le clic gauche à « Recharger » sans le vouloir).
  capturer(id, type, place, fini, element = null) {
    this.annulerCapture();
    this.capture = { id, type, place, fini, element, debut: performance.now(), pret: type === 'clavier' || !this.pad.boutons.some(Boolean) };
  }
  surLaCase(e) { return !this.capture.element || this.capture.element.contains(e.target); }
  annulerCapture() {
    const c = this.capture;
    if (!c) return;
    this.capture = null;
    c.fini({ annule: true });
  }
  finCapture(code) {
    const c = this.capture;
    if (!c) return;
    this.capture = null;
    if (code === null) { this.effacer(c.id, c.type, c.place); c.fini({ efface: true }); return; }
    if (c.type === 'clavier' && INTERDITES.has(code)) { c.fini({ interdite: code }); return; }
    c.fini({ code, conflits: this.assigner(c.id, c.type, c.place, code) });
  }
  captureClavier(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (e.repeat) return;
    if (e.code === 'Escape') { this.annulerCapture(); return; }
    if (e.code === 'Backspace' || e.code === 'Delete') { this.finCapture(null); return; }
    if (this.capture.type !== 'clavier' || !e.code) return;
    if (e.key && e.key.length === 1 && e.key !== ' ') this.noms[e.code] = e.key.toUpperCase();
    this.finCapture(e.code);
  }

  // ---------- Clavier et souris ----------
  brancher() {
    addEventListener('keydown', (e) => {
      if (this.capture) { this.captureClavier(e); return; }
      if (saisieTexte(e.target) || !e.code) return;
      const actions = this.actionsDe('clavier', e.code);
      const actif = this.actifClavier();
      if (actif && actions.length && !/^F\d+$/.test(e.code)) e.preventDefault(); // pas de défilement de la page (Espace, flèches, Tab)
      this.changerSaisie('clavier');
      if (e.repeat) return;
      if (actif) this.enfoncees.add(e.code);
      for (const a of actions) this.surAppui(a, { source: 'clavier', code: e.code, evenement: e });
    }, true);
    addEventListener('keyup', (e) => {
      this.enfoncees.delete(e.code);
      if (this.capture) return;
      for (const a of this.actionsDe('clavier', e.code)) if (!this.tenue(a)) this.surRelache(a, { source: 'clavier' });
    }, true);
    addEventListener('blur', () => this.toutRelacher());

    addEventListener('mousedown', (e) => {
      const code = `Souris${e.button}`;
      if (this.capture) {
        if (this.capture.type !== 'clavier' || !this.surLaCase(e)) { this.annulerCapture(); return; }
        e.preventDefault();
        e.stopImmediatePropagation();
        this.ignorerClicJusqua = performance.now() + 600; // le clic qui a servi ne doit pas appuyer sur un bouton
        this.finCapture(code);
        return;
      }
      if (!this.actifSouris()) return;
      if (e.button !== 0) e.preventDefault(); // pas de défilement avec la molette, pas de « page précédente »
      this.changerSaisie('clavier');
      this.enfoncees.add(code);
      for (const a of this.actionsDe('clavier', code)) this.surAppui(a, { source: 'clavier', code, evenement: e });
    }, true);
    addEventListener('mouseup', (e) => {
      const code = `Souris${e.button}`;
      if (!this.enfoncees.delete(code)) return;
      if (e.button === 3 || e.button === 4) e.preventDefault();
      for (const a of this.actionsDe('clavier', code)) if (!this.tenue(a)) this.surRelache(a, { source: 'clavier' });
    }, true);
    // Après un changement de touche à la souris, le clic ne doit rien faire d'autre
    const avaler = (e) => {
      if (performance.now() < this.ignorerClicJusqua) { e.preventDefault(); e.stopImmediatePropagation(); }
    };
    addEventListener('click', avaler, true);
    addEventListener('auxclick', avaler, true);
    addEventListener('contextmenu', avaler, true);

    // Molette : on additionne les petits mouvements (pavé tactile) pour ne pas changer d'arme 10 fois d'un coup
    addEventListener('wheel', (e) => {
      const sens = e.deltaY > 0 ? 'MoletteBas' : 'MoletteHaut';
      if (this.capture) {
        if (this.capture.type === 'clavier' && Math.abs(e.deltaY) > 2 && this.surLaCase(e)) this.finCapture(sens);
        return;
      }
      if (!this.actifSouris()) return;
      const m = this.molette;
      const now = performance.now();
      if (now - m.derniere > 300) m.cumul = 0;
      m.derniere = now;
      if (now - m.dernierChangement < 250) return;
      m.cumul += e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      if (Math.abs(m.cumul) < 50) return;
      const code = m.cumul > 0 ? 'MoletteBas' : 'MoletteHaut';
      m.cumul = 0;
      m.dernierChangement = now;
      for (const a of this.actionsDe('clavier', code)) {
        this.surAppui(a, { source: 'clavier', code });
        this.surRelache(a, { source: 'clavier' });
      }
    }, { passive: true });

    addEventListener('gamepadconnected', () => this.majManette());
    addEventListener('gamepaddisconnected', () => this.majManette());
  }

  // ---------- Manette ----------
  // À appeler à chaque image : lit les sticks et les boutons, et prévient des boutons appuyés ou relâchés.
  majManette() {
    let pads = [];
    try { pads = [...(navigator.getGamepads ? navigator.getGamepads() : [])].filter((p) => p && p.connected); } catch { /* bloqué */ }
    // La manette dont on vient d'appuyer un bouton devient celle du joueur (s'il y en a plusieurs)
    for (const p of pads) if (p.index !== this.indexPad && p.buttons.some((b) => b.pressed)) { this.lacherBoutons(); this.indexPad = p.index; }
    const gp = pads.find((p) => p.index === this.indexPad) || pads[0] || null;
    const pad = this.pad;
    if (!gp) {
      if (pad.connecte) {
        this.lacherBoutons();
        Object.assign(pad, { connecte: false, nom: '', gx: 0, gy: 0, dx: 0, dy: 0, boutons: [] });
        this.indexPad = null;
        clearInterval(this.minuteur);
        this.minuteur = null;
        this.surManette(false);
      }
      return pad;
    }
    if (gp.index !== this.indexPad) { this.lacherBoutons(); this.indexPad = gp.index; }
    if (!pad.connecte || pad.nom !== gp.id) {
      Object.assign(pad, { connecte: true, nom: gp.id, ps: estPlayStation(gp.id) });
      // On relit aussi la manette entre deux images : sur un ordinateur lent (20 images par seconde),
      // un appui très court sur un bouton passerait sinon inaperçu.
      if (!this.minuteur) this.minuteur = setInterval(() => this.majManette(), 10);
      this.surManette(true);
    }
    const avant = pad.boutons;
    // gâchettes (LT, RT) : à moitié enfoncées suffit
    pad.boutons = gp.buttons.map((b, i) => (i === 6 || i === 7 ? b.value > 0.3 : b.pressed || b.value > 0.5));
    [pad.gx, pad.gy] = zoneMorte(gp.axes[0] || 0, gp.axes[1] || 0);
    [pad.dx, pad.dy] = zoneMorte(gp.axes[2] || 0, gp.axes[3] || 0);
    const changes = [];
    pad.boutons.forEach((b, i) => { if (b !== !!avant[i]) changes.push(i); });
    // un stick à peine bougé (une vieille manette qui « dérive ») ne compte pas pour changer de commandes
    if (changes.some((i) => pad.boutons[i]) || Math.hypot(pad.gx, pad.gy) > 0.5 || Math.hypot(pad.dx, pad.dy) > 0.5) this.changerSaisie('manette');
    const c = this.capture;
    if (c && c.type === 'manette') {
      if (!c.pret && !pad.boutons.some(Boolean)) c.pret = true; // on attend que le bouton qui a ouvert la case soit relâché
      if (performance.now() - c.debut > 10000) this.annulerCapture();
    }
    for (const i of changes) {
      if (pad.boutons[i]) this.appuiBouton(i); else this.relacheBouton(i);
    }
    return pad;
  }

  appuiBouton(i) {
    const c = this.capture;
    if (c) {
      if (c.type !== 'manette') this.annulerCapture(); // on changeait une touche du clavier : la manette annule
      else if (c.pret) this.finCapture(i);
      return;
    }
    if (this.surBoutonMenu(i)) return;
    this.boutonsJeu.add(i);
    for (const a of this.actionsDe('manette', i)) this.surAppui(a, { source: 'manette', bouton: i });
  }
  relacheBouton(i) {
    if (!this.boutonsJeu.delete(i)) return;
    for (const a of this.actionsDe('manette', i)) if (!this.tenue(a)) this.surRelache(a, { source: 'manette' });
  }
  lacherBoutons() {
    for (const i of [...this.boutonsJeu]) this.relacheBouton(i);
    this.pad.boutons = [];
  }

  // Petite vibration (fort : gros moteur, faible : petit moteur ; de 0 à 1)
  vibrer(fort, faible, ms) {
    if (!this.pad.connecte) return;
    try {
      const gp = navigator.getGamepads()[this.indexPad];
      if (!gp) return;
      const v = gp.vibrationActuator;
      if (v && v.playEffect) {
        const p = v.playEffect('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, fort), weakMagnitude: Math.min(1, faible) });
        if (p && p.catch) p.catch(() => {});
        return;
      }
      const h = gp.hapticActuators && gp.hapticActuators[0];
      if (h && h.pulse) {
        const p = h.pulse(Math.min(1, Math.max(fort, faible)), ms);
        if (p && p.catch) p.catch(() => {});
      }
    } catch { /* manette sans vibrations */ }
  }
}
