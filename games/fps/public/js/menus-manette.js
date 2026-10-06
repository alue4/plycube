// Les menus à la manette : la croix (ou le stick gauche) passe d'un bouton à l'autre,
// A appuie sur le bouton choisi, B revient en arrière (comme la touche Échap).
// Gauche / droite sur un curseur ou une liste déroulante change sa valeur.
const FOCUSABLES = 'button, a[href], input, select, summary, [role="button"], [tabindex]:not([tabindex="-1"])';

// Les écrans, du plus haut au plus bas : on navigue dans le premier qui est affiché.
const ECRANS = ['#admin-panel', '#ecran-touches', '#message', '#reglages', '.choix-equipement', '#atelier', '#pause', '.salle-attente',
  '#hall.jouer-ouvert #panneau-jouer', '#hall'];
// Le bouton choisi en arrivant sur un écran
const PREMIERS = '[data-premier], .btn-valider, .entrainer';
const DIRECTIONS = { haut: [0, -1], bas: [0, 1], gauche: [-1, 0], droite: [1, 0] };

const affiche = (n) => !!n && !n.hidden && n.getClientRects().length > 0 && getComputedStyle(n).visibility !== 'hidden';

export function ecranActif() {
  for (const s of ECRANS) {
    const n = document.querySelector(s);
    if (affiche(n)) return n;
  }
  return null;
}

function candidats(ecran) {
  const hall = ecran.id === 'hall';
  return [...ecran.querySelectorAll(FOCUSABLES)].filter((n) => !n.disabled && affiche(n) && !(hall && n.closest('#panneau-jouer')));
}
const actuel = (liste) => (liste.includes(document.activeElement) ? document.activeElement : null);
const centre = (r) => [r.left + r.width / 2, r.top + r.height / 2];

let memoire = null; // { r, ecran } : où était le dernier bouton choisi (pour le retrouver si l'écran se redessine)

function choisir(n, ecran) {
  if (!n) return;
  n.focus({ preventScroll: true });
  n.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  memoire = { r: n.getBoundingClientRect(), ecran };
}
function plusProche(liste, r) {
  const [x, y] = centre(r);
  let meilleur = null;
  let d = Infinity;
  for (const n of liste) {
    const [qx, qy] = centre(n.getBoundingClientRect());
    const dd = Math.hypot(qx - x, qy - y);
    if (dd < d) { d = dd; meilleur = n; }
  }
  return meilleur;
}
function premier(liste, ecran) {
  if (memoire && memoire.ecran === ecran && ecran.isConnected) return plusProche(liste, memoire.r);
  return liste.find((n) => n.matches(PREMIERS)) || liste[0];
}

// Curseur ou liste déroulante : change la valeur (sens = +1 ou -1). tourner : revient au début après la fin.
function regler(n, sens, tourner = false) {
  if (n.tagName === 'SELECT') {
    const nb = n.options.length;
    let i = n.selectedIndex + sens;
    if (tourner) i = (i + nb) % nb; else i = Math.max(0, Math.min(nb - 1, i));
    if (i !== n.selectedIndex) {
      n.selectedIndex = i;
      n.dispatchEvent(new Event('change', { bubbles: true }));
    }
    return true;
  }
  if (n.tagName === 'INPUT' && n.type === 'range') {
    if (sens > 0) n.stepUp(); else n.stepDown();
    n.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }
  return false;
}

// Passe au bouton le plus proche dans une direction ('haut', 'bas', 'gauche', 'droite')
export function naviguer(dir, ecran = ecranActif()) {
  if (!ecran) return;
  const liste = candidats(ecran);
  if (!liste.length) return;
  const a = actuel(liste);
  if (!a) { choisir(premier(liste, ecran), ecran); return; }
  if ((dir === 'gauche' || dir === 'droite') && regler(a, dir === 'droite' ? 1 : -1)) return;
  const r = a.getBoundingClientRect();
  const [vx, vy] = DIRECTIONS[dir];
  let meilleur = null;
  let score = Infinity;
  for (const n of liste) {
    if (n === a) continue;
    const q = n.getBoundingClientRect();
    // décalage des centres dans la direction voulue (il faut qu'il soit devant)
    const avance = vx ? ((q.left + q.right - r.left - r.right) / 2) * vx : ((q.top + q.bottom - r.top - r.bottom) / 2) * vy;
    if (avance <= 2) continue;
    // distance de bord à bord, et écart sur le côté (on préfère ce qui est bien en face)
    const ecart = vx > 0 ? q.left - r.right : vx < 0 ? r.left - q.right : vy > 0 ? q.top - r.bottom : r.top - q.bottom;
    const cote = vx ? Math.max(0, q.top - r.bottom, r.top - q.bottom) : Math.max(0, q.left - r.right, r.left - q.right);
    const s = Math.max(0, ecart) + cote * 2.5 + avance * 0.05;
    if (s < score) { score = s; meilleur = n; }
  }
  if (meilleur) choisir(meilleur, ecran);
}

// Bouton A : appuie sur le bouton choisi (ou en choisit un s'il n'y en a pas)
export function activer(ecran = ecranActif()) {
  if (!ecran) return;
  const liste = candidats(ecran);
  const a = actuel(liste);
  if (!a) { if (liste.length) choisir(premier(liste, ecran), ecran); return; }
  if (regler(a, 1, true)) return;
  if (a.tagName === 'INPUT' && !['checkbox', 'radio', 'button', 'submit'].includes(a.type)) return; // champ de texte : il faut un clavier
  const r = a.getBoundingClientRect();
  memoire = { r, ecran };
  a.click();
  // L'écran a pu se redessiner (choix des armes...) : on reprend le bouton qui est à la même place
  requestAnimationFrame(() => {
    const e = ecranActif();
    if (e !== ecran) return;
    const l = candidats(e);
    if (l.length && !actuel(l)) choisir(plusProche(l, r), e);
  });
}

// Bouton B : revenir en arrière (bouton « retour » de l'écran, sinon comme la touche Échap)
export function retour(ecran = ecranActif()) {
  if (!ecran) return;
  const b = [...ecran.querySelectorAll('[data-retour]')].find(affiche);
  if (b) { b.click(); return; }
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
}

// Un bouton de la manette dans un menu. Renvoie toujours true : dans les menus, les boutons ne servent pas au jeu.
const CROIX = { 12: 'haut', 13: 'bas', 14: 'gauche', 15: 'droite' };
const repetition = { dir: null, prochain: 0 };
export function bouton(i) {
  if (CROIX[i]) {
    naviguer(CROIX[i]);
    repetition.dir = CROIX[i];
    repetition.prochain = performance.now() + 380;
  } else if (i === 0) activer();
  else if (i === 1) retour();
  return true;
}

// À chaque image dans les menus : la croix ou le stick gauche tenus (en restant appuyé, ça avance tout seul)
export function maj(pad, now) {
  const b = pad.boutons;
  const croix = b[12] ? 'haut' : b[13] ? 'bas' : b[14] ? 'gauche' : b[15] ? 'droite' : null;
  let dir = croix;
  if (!dir && Math.hypot(pad.gx, pad.gy) > 0.6) {
    dir = Math.abs(pad.gx) > Math.abs(pad.gy) ? (pad.gx > 0 ? 'droite' : 'gauche') : (pad.gy > 0 ? 'bas' : 'haut');
  }
  if (dir !== repetition.dir) {
    repetition.dir = dir;
    // (un appui sur la croix a déjà été traité par bouton() ; ici, c'est le stick)
    if (dir && !croix) { naviguer(dir); repetition.prochain = now + 380; }
    return;
  }
  if (dir && now >= repetition.prochain) { naviguer(dir); repetition.prochain = now + 110; }
}
// On quitte les menus : la croix repartira de zéro
export function oublierRepetition() { repetition.dir = null; }
