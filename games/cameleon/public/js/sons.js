// Sons de Caméléon : quelques sons d'Arena FPS (fichiers .mp3 du dossier /games/fps/sons/) et des sons
// fabriqués par le navigateur (sifflet, tir de peinture, éclaboussure, radar, bips du compte à rebours).
// Les sons des autres joueurs sont placés en 3D : on entend d'où vient un sifflet.
let ctx = null;
let sortie = null;
let volume = 0.7;
const tampons = {};
const FICHIERS = ['clic', 'pouf', 'apparition', 'victoire', 'elimination', 'saut', 'atterrissage', 'pas_1', 'pas_2', 'pas_3', 'pas_4',
  'touche', 'lobby_pret', 'lobby_depart', 'soin_fini', 'degats', 'vide'];

export function initSons(v) {
  if (v !== undefined) volume = v;
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  sortie = ctx.createGain();
  sortie.gain.value = volume;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.ratio.value = 4;
  sortie.connect(comp).connect(ctx.destination);
  for (const nom of FICHIERS) {
    fetch(`/games/fps/sons/${nom}.mp3`).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('absent'))))
      .then((b) => ctx.decodeAudioData(b)).then((t) => { tampons[nom] = t; }).catch(() => {});
  }
}

export function reglerVolume(v) { volume = v; if (sortie) sortie.gain.value = v; }

const _avant = { x: 0, y: 0, z: -1 };
export function majAuditeur(camera) {
  if (!ctx) return;
  const l = ctx.listener;
  const p = camera.position;
  const e = camera.matrixWorld.elements;
  _avant.x = -e[8]; _avant.y = -e[9]; _avant.z = -e[10];
  if (l.positionX) {
    const t = ctx.currentTime;
    l.positionX.setValueAtTime(p.x, t); l.positionY.setValueAtTime(p.y, t); l.positionZ.setValueAtTime(p.z, t);
    l.forwardX.setValueAtTime(_avant.x, t); l.forwardY.setValueAtTime(_avant.y, t); l.forwardZ.setValueAtTime(_avant.z, t);
    l.upX.setValueAtTime(e[4], t); l.upY.setValueAtTime(e[5], t); l.upZ.setValueAtTime(e[6], t);
  } else {
    l.setPosition(p.x, p.y, p.z);
    l.setOrientation(_avant.x, _avant.y, _avant.z, e[4], e[5], e[6]);
  }
}

// Sortie du son : directe, ou placée en 3D si on donne une position
function destination(position, portee = 1) {
  const g = ctx.createGain();
  if (!position) { g.connect(sortie); return g; }
  const p = ctx.createPanner();
  p.panningModel = 'HRTF';
  p.distanceModel = 'inverse';
  p.refDistance = 3 * portee;
  p.rolloffFactor = 1.1;
  p.maxDistance = 300;
  if (p.positionX) { p.positionX.value = position.x; p.positionY.value = position.y; p.positionZ.value = position.z; } else p.setPosition(position.x, position.y, position.z);
  g.connect(p).connect(sortie);
  return g;
}

export function son(nom, { vol = 1, position = null, portee = 1, variation = 0.06 } = {}) {
  if (!ctx || !tampons[nom]) return;
  const s = ctx.createBufferSource();
  s.buffer = tampons[nom];
  s.playbackRate.value = 1 + (Math.random() - 0.5) * variation * 2;
  const g = destination(position, portee);
  g.gain.value = vol;
  s.connect(g);
  s.start();
}

function ton(dest, type, de, a, duree, vol, delai = 0) {
  const t = ctx.currentTime + delai;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(de, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, a), t + duree);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + duree + 0.05);
}

let bruitBlanc = null;
function bruit(dest, { duree = 0.2, vol = 0.3, freq = 1200, q = 1, type = 'bandpass', delai = 0 }) {
  if (!bruitBlanc) {
    bruitBlanc = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = bruitBlanc.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = ctx.currentTime + delai;
  const s = ctx.createBufferSource();
  s.buffer = bruitBlanc;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  s.connect(f).connect(g).connect(dest);
  s.start(t, Math.random() * 0.5);
  s.stop(t + duree + 0.05);
}

// Le sifflet d'un cacheur (toutes les 30 s) : on l'entend venir de là où il est
export function sifflet(position) {
  if (!ctx) return;
  const d = destination(position, 2.5);
  d.gain.value = 0.9;
  const base = 1500 + Math.random() * 600;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const vib = ctx.createOscillator(); const vg = ctx.createGain();
  vib.frequency.value = 22; vg.gain.value = 60;
  vib.connect(vg).connect(o.frequency);
  o.type = 'sine';
  o.frequency.setValueAtTime(base, t);
  o.frequency.linearRampToValueAtTime(base * 1.35, t + 0.18);
  o.frequency.linearRampToValueAtTime(base * 0.9, t + 0.45);
  o.frequency.linearRampToValueAtTime(base * 1.25, t + 0.7);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.35, t + 0.03);
  g.gain.setValueAtTime(0.35, t + 0.62);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
  o.connect(g).connect(d);
  o.start(t); vib.start(t);
  o.stop(t + 0.85); vib.stop(t + 0.85);
}

// Tir du pistolet à peinture : « pop » + petit souffle
export function tirPeinture(position = null) {
  if (!ctx) return;
  const d = destination(position, 1.5);
  ton(d, 'square', 520, 140, 0.09, 0.18);
  ton(d, 'sine', 900, 300, 0.07, 0.12);
  bruit(d, { duree: 0.12, vol: 0.25, freq: 2400, q: 0.8 });
}

// La peinture s'écrase (sur un mur, un leurre ou un cacheur)
export function splat(position = null, fort = false) {
  if (!ctx) return;
  const d = destination(position, fort ? 2 : 1.2);
  bruit(d, { duree: fort ? 0.35 : 0.22, vol: fort ? 0.5 : 0.32, freq: 700, q: 0.6, type: 'lowpass' });
  ton(d, 'sine', 240, 70, 0.15, fort ? 0.3 : 0.15);
}

// Un cacheur trouvé : petite fanfare
export function trouve() {
  if (!ctx) return;
  const d = destination(null);
  [523, 659, 784, 1046].forEach((f, i) => ton(d, 'triangle', f, f, 0.14, 0.18, i * 0.07));
}

// Radar du chercheur : « ping » sonar
export function radar() {
  if (!ctx) return;
  const d = destination(null);
  ton(d, 'sine', 1400, 1350, 0.6, 0.25);
  ton(d, 'sine', 1400, 1350, 0.4, 0.12, 0.35);
}

// Bip du compte à rebours (aigu = le dernier)
export function bip(aigu = false) {
  if (!ctx) return;
  ton(destination(null), 'square', aigu ? 1320 : 880, aigu ? 1320 : 880, aigu ? 0.35 : 0.12, 0.12);
}

// Tir raté / pénalité : « bzz »
export function rate() {
  if (!ctx) return;
  const d = destination(null);
  ton(d, 'sawtooth', 220, 110, 0.35, 0.16);
}

// Coup de pinceau / remplissage (petit « plic »)
export function pinceau() {
  if (!ctx) return;
  ton(destination(null), 'sine', 1800 + Math.random() * 400, 1200, 0.05, 0.05);
}
