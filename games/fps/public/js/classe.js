// Mode classé : affichage du rang du joueur. Les points sont gardés sur le serveur, avec le compte
// (même rang sur tous les appareils) ; c'est lui qui les compte à la fin de chaque manche classée
// et qui les envoie (message « rang »). Ici, on ne fait que les afficher.
//   niveau = 1 + points / 50 (de 1 à 20) ; paliers : Bronze, Argent, Or, Platine, Diamant (I, II, III), puis Champion.
//   Fin de manche : 1er +30, 2e +15, 3e +5, sinon −10 (jamais en dessous de 0).
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

// L'ancienne version gardait le rang dans le navigateur : on efface cette copie, devenue inutile.
try { localStorage.removeItem('fps-classe'); } catch { /* navigation privée */ }

export const niveauDe = (points) => Math.min(NIVEAU_MAX, 1 + Math.floor(Math.max(0, points) / POINTS_PAR_NIVEAU));

// Tout ce qu'il faut pour afficher un rang : { niveau, nom ('Or II'), couleur, progres (0 à 1), reste (points avant le niveau suivant) }
export function rang(points = 0) {
  points = Math.max(0, Math.floor(Number(points) || 0));
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

// Résultat d'une manche classée (envoyé par le serveur) : { gain, avant, apres } (les rangs avant et après).
export const resultat = (avantPoints, apresPoints) => ({ gain: apresPoints - avantPoints, avant: rang(avantPoints), apres: rang(apresPoints) });
