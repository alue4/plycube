// Filtres de contenu : pseudos et textes des suggestions.
// Tu peux compléter les listes ci-dessous (en minuscules, sans accents).

// Mots interdits partout, même cachés dans un mot plus long ("xXconnardXx").
const BANNED_ANYWHERE = [
  'connard', 'connasse', 'salope', 'salaud', 'encule', 'enculer', 'putain', 'pute',
  'nique', 'niquer', 'batard', 'merde', 'bordel', 'couille', 'bite', 'chatte', 'branler',
  'pedophile', 'pedo', 'nazi', 'hitler', 'negro', 'negre', 'bougnoul', 'youpin',
  'tapette', 'tafiole', 'gouine', 'trisomique', 'abruti', 'debile',
  'fuck', 'shit', 'bitch', 'dick', 'pussy', 'nigger', 'nigga', 'whore', 'slut', 'porn',
  'sexe', 'sexy', 'cul', 'zizi', 'kys',
];

// Mots normaux qui contiennent un mot interdit ("tech-NIQUE", "com-PUTE-r") :
// ils sont retirés avant la vérification des pseudos.
const ALLOWED_INSIDE = [
  'technique', 'unique', 'panique', 'pique', 'dispute', 'computer', 'reputation', 'deputes',
  'habite', 'orbite', 'torpedo', 'merdique', 'culture', 'culotte', 'calcul', 'reculer',
  'recul', 'dickens', 'cocon', 'bitcoin', 'scunthorpe', 'classic', 'assassin', 'pass',
];

// Mots courts interdits seulement s'ils sont seuls ou séparés (sinon trop de faux positifs :
// "con" est dans "conan", "pd" dans "speedrun"...).
const BANNED_WORDS = ['con', 'cons', 'conne', 'pd', 'fdp', 'ntm', 'tg', 'ta gueule', 'nik', 'bz', 'sex', 'ass', 'wtf'];

// Pseudos réservés : personne ne peut se faire passer pour l'équipe.
const RESERVED = [
  'admin', 'administrateur', 'administrator', 'moderateur', 'modo', 'moderator', 'staff',
  'prof', 'professeur', 'principal', 'directeur', 'directrice', 'cpe', 'systeme', 'system',
  'root', 'support', 'officiel', 'official', 'equipe', 'serveur', 'server',
];

const LEET = { '0': 'o', '1': 'i', '2': 'z', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '9': 'g', '@': 'a', '$': 's', '!': 'i', '€': 'e', '|': 'i' };

// Met un texte sous une forme "comparable" : minuscules, sans accents, chiffres -> lettres.
function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[0-9@$!€|]/g, (c) => LEET[c] || c);
}

// Version "collée" : on retire tout ce qui n'est pas une lettre et les lettres répétées.
function squash(text) {
  return normalize(text).replace(/[^a-z]/g, '').replace(/(.)\1+/g, '$1');
}

// mode 'text' (suggestions) : on regarde mot par mot, un mot interdit doit être le mot
//   entier ou son début ("connards", "putain").
// mode 'name' (pseudos) : on cherche aussi les mots cachés dans le pseudo collé ("xXconnardXx").
function containsBanned(text, mode = 'text') {
  const n = normalize(text);
  const words = n.split(/[^a-z]+/).filter(Boolean).map((w) => w.replace(/(.)\1+/g, '$1'));
  const banned = BANNED_ANYWHERE.map((w) => w.replace(/(.)\1+/g, '$1'));
  const shortBanned = banned.filter((w) => w.length < 4).concat(BANNED_WORDS);
  const longBanned = banned.filter((w) => w.length >= 4);

  if (words.some((w) => shortBanned.includes(w))) return true;
  if (words.some((w) => longBanned.some((b) => w.startsWith(b)))) return true;
  const spaced = ' ' + n.split(/[^a-z]+/).filter(Boolean).join(' ') + ' ';
  if (BANNED_WORDS.some((w) => w.includes(' ') && spaced.includes(' ' + w + ' '))) return true;

  if (mode === 'name') {
    let s = squash(text);
    for (const ok of ALLOWED_INSIDE) s = s.split(ok.replace(/(.)\1+/g, '$1')).join('_');
    if (longBanned.some((b) => s.includes(b))) return true;
  }
  return false;
}

// Renvoie un message d'erreur, ou null si le pseudo est accepté.
function checkUsername(username) {
  if (typeof username !== 'string') return 'Pseudo manquant.';
  if (username.length < 3 || username.length > 16) return 'Le pseudo doit faire entre 3 et 16 caractères.';
  if (!/^[A-Za-z0-9_-]+$/.test(username)) return 'Lettres sans accents, chiffres, "_" et "-" uniquement.';
  if (!/[A-Za-z]/.test(username)) return 'Le pseudo doit contenir au moins une lettre.';
  const s = squash(username);
  if (RESERVED.some((r) => s === r || s.startsWith(r) || s.endsWith(r))) return 'Ce pseudo est réservé.';
  if (containsBanned(username, 'name')) return 'Ce pseudo n\'est pas autorisé.';
  return null;
}

// Nettoie un texte libre (suggestion) : supprime les caractères de contrôle,
// limite la longueur. Renvoie { value } ou { error }.
function cleanText(text, { min = 0, max = 500, label = 'Le texte' } = {}) {
  if (typeof text !== 'string') text = '';
  const value = text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (value.length < min) return { error: `${label} est trop court (${min} caractères minimum).` };
  if (value.length > max) return { error: `${label} est trop long (${max} caractères maximum).` };
  if (containsBanned(value)) return { error: `${label} contient un mot interdit.` };
  // Pas de liens : on évite que le site serve à partager n'importe quoi.
  if (/(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|fr|net|org|io|gg|be|tv|ly)\b)/i.test(value)) {
    return { error: 'Les liens ne sont pas autorisés.' };
  }
  return { value };
}

module.exports = { checkUsername, cleanText, containsBanned, normalize };
