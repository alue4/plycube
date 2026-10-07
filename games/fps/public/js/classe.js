// Mode classé : le rang du joueur. Il est gardé dans ce navigateur seulement (localStorage),
// jamais dans la base du site. Le serveur reçoit juste le niveau de départ des bots.
//   niveau = 1 + points / 50 (de 1 à 20) ; paliers : Bronze, Argent, Or, Platine, Diamant (I, II, III), puis Champion.
//   Fin de manche : 1er +30, 2e +15, 3e +5, sinon −10 (jamais en dessous de 0).
const CLE = 'fps-classe';
export const POINTS_PAR_NIVEAU = 50;
export const NIVEAU_MAX = 20;
const PALIERS = [
  { nom: 'Bronze', couleur: '#d08a4c' },
  { nom: 'Argent', couleur: '#c3cfdf' },
  { nom: 'Or', couleur: '#ffd23f' },
  { nom: 'Platine', couleur: '#5ee3d3' },
  { nom: 'Diamant', couleur: '#7aa7ff' },
];
const CHAMPION = { nom: 'Champion', couleur: '#ff5ea8' };
const GAINS = [30, 15, 5]; // 1er, 2e, 3e
const PERTE = -10;

export function lirePoints() {
  try {
    const d = JSON.parse(localStorage.getItem(CLE) || 'null');
    const p = d && Number(d.points);
    return Number.isFinite(p) && p > 0 ? Math.floor(p) : 0;
  } catch { return 0; } // navigation privée
}

function ecrirePoints(points) {
  try { localStorage.setItem(CLE, JSON.stringify({ points })); } catch { /* navigation privée */ }
}

export const niveauDe = (points) => Math.min(NIVEAU_MAX, 1 + Math.floor(points / POINTS_PAR_NIVEAU));

// Tout ce qu'il faut pour afficher un rang : { niveau, nom ('Or II'), couleur, progres (0 à 1), reste (points avant le niveau suivant) }
export function rang(points = lirePoints()) {
  const niveau = niveauDe(points);
  const i = Math.floor((niveau - 1) / 3);
  const palier = i < PALIERS.length ? PALIERS[i] : CHAMPION;
  const nom = i < PALIERS.length ? `${palier.nom} ${['I', 'II', 'III'][(niveau - 1) % 3]}` : palier.nom;
  const max = niveau >= NIVEAU_MAX;
  const dans = points - (niveau - 1) * POINTS_PAR_NIVEAU;
  return {
    points, niveau, nom, couleur: palier.couleur, max,
    progres: max ? 1 : dans / POINTS_PAR_NIVEAU,
    reste: max ? 0 : POINTS_PAR_NIVEAU - dans,
  };
}

// Fin d'une manche classée : place = 1, 2, 3... Renvoie { gain, avant, apres } (les rangs avant et après).
export function finDeManche(place) {
  const avantPoints = lirePoints();
  const gain = GAINS[place - 1] !== undefined ? GAINS[place - 1] : PERTE;
  const apresPoints = Math.max(0, avantPoints + gain);
  ecrirePoints(apresPoints);
  return { gain: apresPoints - avantPoints, avant: rang(avantPoints), apres: rang(apresPoints) };
}
