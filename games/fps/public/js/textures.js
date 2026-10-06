// Textures "pixel" façon Minecraft, dessinées par le code (aucune image à télécharger).
// Chaque matière de la carte est un petit dessin de 16 × 16 pixels qui se répète
// tous les mètres. Pour changer une couleur, modifie la valeur "base" ci-dessous.
import * as THREE from '../vendor/three.min.js';

// Générateur de hasard "reproductible" : la même graine donne toujours le même dessin.
export function hasard(graine) {
  let s = (graine >>> 0) || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return (s % 100000) / 100000;
  };
}

// Éclaircit (k > 0) ou assombrit (k < 0) une couleur "#rrggbb".
export function nuance(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(k >= 0 ? c + (255 - c) * k : c * (1 + k))));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

function px(g, x, y, couleur) {
  g.fillStyle = couleur;
  g.fillRect(x, y, 1, 1);
}

// Remplit une zone avec une couleur légèrement variée à chaque pixel.
export function bruit(g, rnd, x, y, w, h, hex, force) {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) px(g, x + i, y + j, nuance(hex, (rnd() - 0.5) * force));
  }
}

const DESSINS = {
  herbe: { base: '#5cb83c', dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.22);
    for (let i = 0; i < 14; i++) px(g, Math.floor(rnd() * 16), Math.floor(rnd() * 16), nuance(b, -0.25));
    for (let i = 0; i < 6; i++) px(g, Math.floor(rnd() * 16), Math.floor(rnd() * 16), nuance(b, 0.25));
  } },
  pierre: { base: '#8f949c', dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.16);
    for (let i = 0; i < 5; i++) {
      let x = Math.floor(rnd() * 16); let y = Math.floor(rnd() * 16);
      for (let k = 0; k < 4; k++) { px(g, x & 15, y & 15, nuance(b, -0.35)); x += rnd() < 0.5 ? 1 : 0; y += 1; }
    }
  } },
  brique: { base: '#b4553c', dessin(g, rnd, b) {
    g.fillStyle = '#cfc6b8'; g.fillRect(0, 0, 16, 16);
    for (let rang = 0; rang < 4; rang++) {
      const dec = rang % 2 ? 4 : 0;
      for (let k = -1; k < 2; k++) {
        const x0 = k * 8 + dec;
        const ton = nuance(b, (rnd() - 0.5) * 0.25);
        for (let i = 0; i < 7; i++) for (let j = 0; j < 3; j++) {
          const x = x0 + i;
          if (x >= 0 && x < 16) px(g, x, rang * 4 + j, rnd() < 0.15 ? nuance(b, -0.2) : ton);
        }
      }
    }
  } },
  bois: { base: '#b98a4e', dessin(g, rnd, b) {
    for (let rang = 0; rang < 4; rang++) {
      const ton = nuance(b, (rnd() - 0.5) * 0.2);
      for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) {
        px(g, i, rang * 4 + j, j === 3 ? nuance(b, -0.35) : (rnd() < 0.12 ? nuance(b, -0.15) : ton));
      }
      px(g, (rang * 5 + 3) % 16, rang * 4 + 1, nuance(b, -0.3));
    }
  } },
  caisse: { base: '#c98f4a', dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.15);
    const cadre = '#7a4f24';
    for (let i = 0; i < 16; i++) {
      for (const k of [0, 1, 14, 15]) { px(g, i, k, nuance(cadre, (rnd() - 0.5) * 0.2)); px(g, k, i, nuance(cadre, (rnd() - 0.5) * 0.2)); }
      if (i > 1 && i < 14) { px(g, i, i, cadre); px(g, i, 15 - i, nuance(cadre, 0.1)); }
    }
  } },
  tronc: { base: '#6b4a2b', dessin(g, rnd, b) {
    for (let i = 0; i < 16; i++) {
      const ton = nuance(b, (i % 4 === 0 ? -0.25 : 0) + (rnd() - 0.5) * 0.15);
      for (let j = 0; j < 16; j++) px(g, i, j, rnd() < 0.1 ? nuance(b, -0.3) : ton);
    }
  } },
  feuilles: { base: '#3f9b3a', dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.35);
    for (let i = 0; i < 20; i++) px(g, Math.floor(rnd() * 16), Math.floor(rnd() * 16), nuance(b, -0.45));
    for (let i = 0; i < 6; i++) px(g, Math.floor(rnd() * 16), Math.floor(rnd() * 16), '#e85a8a'); // petites fleurs
  } },
  trampoline: { base: '#1a2c52', lumineux: true, dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.1);
    g.fillStyle = '#39e0ff';
    for (let i = 2; i < 14; i++) { g.fillRect(i, 2, 1, 1); g.fillRect(i, 13, 1, 1); g.fillRect(2, i, 1, 1); g.fillRect(13, i, 1, 1); }
    // flèche vers le haut
    g.fillStyle = '#b8f6ff';
    g.fillRect(7, 5, 2, 7);
    g.fillRect(5, 7, 6, 1); g.fillRect(6, 6, 4, 1);
  } },
  neon: { base: '#3aa8ff', lumineux: true, dessin(g, rnd, b) {
    g.fillStyle = b; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#d9f0ff'; g.fillRect(0, 6, 16, 4);
  } },
  neon_rouge: { base: '#ff4d4d', lumineux: true, dessin(g, rnd, b) {
    g.fillStyle = b; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#ffe0e0'; g.fillRect(0, 6, 16, 4);
  } },

  // ---------- Sols ----------
  terre: { base: '#7a5532', dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.25);
    for (let i = 0; i < 10; i++) px(g, Math.floor(rnd() * 16), Math.floor(rnd() * 16), nuance(b, -0.35));
    for (let i = 0; i < 5; i++) px(g, Math.floor(rnd() * 16), Math.floor(rnd() * 16), '#9a948a'); // cailloux
  } },
  sable: { base: '#e6cf94', dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.12);
    for (let i = 0; i < 12; i++) px(g, Math.floor(rnd() * 16), Math.floor(rnd() * 16), nuance(b, -0.18));
    for (let i = 0; i < 8; i++) px(g, Math.floor(rnd() * 16), Math.floor(rnd() * 16), nuance(b, 0.35));
  } },
  pave: { base: '#8b8a86', dessin(g, rnd, b) {
    g.fillStyle = nuance(b, -0.45); g.fillRect(0, 0, 16, 16);
    for (let rang = 0; rang < 4; rang++) {
      const dec = rang % 2 ? 2 : 0;
      for (let k = -1; k < 4; k++) {
        const x0 = k * 4 + dec;
        const ton = nuance(b, (rnd() - 0.5) * 0.3);
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
          const x = x0 + i;
          if (x >= 0 && x < 16) px(g, x, rang * 4 + j, rnd() < 0.2 ? nuance(b, -0.15) : ton);
        }
      }
    }
  } },
  asphalte: { base: '#3d4046', dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.2);
    for (let i = 0; i < 10; i++) px(g, Math.floor(rnd() * 16), Math.floor(rnd() * 16), nuance(b, 0.25));
  } },
  trottoir: { base: '#b9b6ae', dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.08);
    g.fillStyle = nuance(b, -0.25);
    g.fillRect(0, 0, 16, 1); g.fillRect(0, 8, 16, 1); g.fillRect(0, 0, 1, 16); g.fillRect(8, 0, 1, 16);
  } },

  // ---------- Murs ----------
  pierre_chateau: { base: '#b7af9c', echelle: 2, dessin(g, rnd, b) {
    g.fillStyle = '#857d6c'; g.fillRect(0, 0, 16, 16);
    for (let rang = 0; rang < 4; rang++) {
      const dec = rang % 2 ? 4 : 0;
      for (let k = -1; k < 2; k++) {
        const x0 = k * 8 + dec;
        const ton = nuance(b, (rnd() - 0.5) * 0.18);
        for (let i = 0; i < 7; i++) for (let j = 0; j < 3; j++) {
          const x = x0 + i;
          if (x >= 0 && x < 16) px(g, x, rang * 4 + j, rnd() < 0.18 ? nuance(b, (rnd() - 0.6) * 0.3) : ton);
        }
      }
    }
  } },
  beton: { base: '#a9acad', dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.08);
    for (let i = 0; i < 6; i++) px(g, Math.floor(rnd() * 16), Math.floor(rnd() * 16), nuance(b, -0.3));
    g.fillStyle = nuance(b, -0.18); g.fillRect(0, 15, 16, 1);
  } },
  planches: { base: '#7a5230', dessin(g, rnd, b) {
    for (let c = 0; c < 4; c++) {
      const ton = nuance(b, (rnd() - 0.5) * 0.25);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 16; j++) {
        px(g, c * 4 + i, j, i === 3 ? nuance(b, -0.45) : (rnd() < 0.1 ? nuance(b, -0.2) : ton));
      }
      px(g, c * 4 + 1, 2, '#3b2a1a'); px(g, c * 4 + 1, 13, '#3b2a1a'); // clous
    }
  } },
  paille: { base: '#d6b45a', dessin(g, rnd, b) {
    for (let i = 0; i < 16; i++) {
      const ton = nuance(b, (rnd() - 0.5) * 0.3);
      for (let j = 0; j < 16; j++) px(g, i, j, rnd() < 0.25 ? nuance(b, (rnd() - 0.5) * 0.5) : ton);
    }
    g.fillStyle = nuance(b, -0.35); g.fillRect(0, 7, 16, 1); g.fillRect(0, 15, 16, 1);
  } },
  toit_rouge: { base: '#b8452f', dessin(g, rnd, b) {
    for (let rang = 0; rang < 4; rang++) {
      const dec = rang % 2 ? 2 : 0;
      for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) {
        const bord = ((i + dec) % 4 === 0) || j === 3;
        px(g, i, rang * 4 + j, bord ? nuance(b, -0.4) : nuance(b, (j === 0 ? 0.15 : 0) + (rnd() - 0.5) * 0.12));
      }
    }
  } },
  toit_ardoise: { base: '#4d5868', dessin(g, rnd, b) {
    for (let rang = 0; rang < 4; rang++) {
      const dec = rang % 2 ? 3 : 0;
      for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) {
        const bord = ((i + dec) % 6 === 0) || j === 3;
        px(g, i, rang * 4 + j, bord ? nuance(b, -0.45) : nuance(b, (rnd() - 0.5) * 0.15));
      }
    }
  } },

  // ---------- Végétation ----------
  palmier: { base: '#9a7a4c', dessin(g, rnd, b) {
    for (let j = 0; j < 16; j++) {
      const bande = j % 4 === 3;
      for (let i = 0; i < 16; i++) px(g, i, j, bande ? nuance(b, -0.35) : nuance(b, (rnd() - 0.5) * 0.2 + ((i + j) % 5 === 0 ? -0.1 : 0)));
    }
  } },
  feuilles_palmier: { base: '#43b33a', dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.25);
    g.fillStyle = nuance(b, -0.35);
    for (let i = 0; i < 16; i++) { g.fillRect(i, 7, 1, 2); if (i % 3 === 0) { g.fillRect(i, 3 + (i % 2), 1, 1); g.fillRect(i, 12 - (i % 2), 1, 1); } }
    g.fillStyle = nuance(b, 0.3);
    for (let i = 0; i < 6; i++) g.fillRect(Math.floor(rnd() * 16), Math.floor(rnd() * 16), 1, 1);
  } },

  // ---------- Métal, verre, lumières ----------
  metal: { base: '#9aa3ad', dessin(g, rnd, b) {
    for (let j = 0; j < 16; j++) {
      const ton = nuance(b, (rnd() - 0.5) * 0.12);
      for (let i = 0; i < 16; i++) px(g, i, j, rnd() < 0.15 ? nuance(b, (rnd() - 0.5) * 0.2) : ton);
    }
    for (const [x, y] of [[1, 1], [14, 1], [1, 14], [14, 14]]) px(g, x, y, nuance(b, -0.4));
  } },
  metal_rouge: { base: '#c8352b', dessin: peinture },
  metal_bleu: { base: '#2f6fd0', dessin: peinture },
  metal_jaune: { base: '#e8b923', dessin: peinture },
  pneu: { base: '#1e1f22', dessin(g, rnd, b) {
    bruit(g, rnd, 0, 0, 16, 16, b, 0.15);
    g.fillStyle = '#34363b';
    for (let j = 1; j < 16; j += 4) g.fillRect(0, j, 16, 2);
  } },
  vitre: { base: '#9fd6ff', transparent: 0.38, dessin(g, rnd, b) {
    g.fillStyle = b; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#e8f7ff';
    for (let i = 0; i < 5; i++) { g.fillRect(3 + i, 10 - i, 1, 1); g.fillRect(8 + i, 13 - i, 1, 1); }
    g.fillStyle = '#d0ecff'; g.fillRect(0, 0, 16, 1); g.fillRect(0, 0, 1, 16);
  } },
  lampe: { base: '#ffd36b', lumineux: true, dessin(g, rnd, b) {
    g.fillStyle = b; g.fillRect(0, 0, 16, 16);
    g.fillStyle = '#fff6d8'; g.fillRect(3, 3, 10, 10);
    g.fillStyle = '#ffffff'; g.fillRect(6, 6, 4, 4);
  } },
  tissu_bleu: { base: '#2f6fe0', dessin: drapeau },
  tissu_rouge: { base: '#d63a3a', dessin: drapeau },
};

// Métal peint (voitures, poubelles...) : couleur unie, un reflet en haut, un peu d'usure.
function peinture(g, rnd, b) {
  bruit(g, rnd, 0, 0, 16, 16, b, 0.08);
  g.fillStyle = nuance(b, 0.3); g.fillRect(0, 1, 16, 1);
  g.fillStyle = nuance(b, -0.3); g.fillRect(0, 15, 16, 1);
  for (let i = 0; i < 4; i++) px(g, Math.floor(rnd() * 16), Math.floor(rnd() * 16), nuance(b, -0.2));
}

// Bannière : tissu de la couleur de l'équipe avec des chevrons blancs et un liseré doré.
function drapeau(g, rnd, b) {
  bruit(g, rnd, 0, 0, 16, 16, b, 0.1);
  g.fillStyle = nuance(b, -0.2);
  for (let i = 0; i < 16; i += 4) g.fillRect(i, 0, 1, 16);
  g.fillStyle = '#e8c45a'; g.fillRect(0, 14, 16, 1);
  g.fillStyle = '#ffffff';
  for (let i = 0; i < 4; i++) { g.fillRect(4 + i, 5 + i, 1, 1); g.fillRect(11 - i, 5 + i, 1, 1); }
}

export function textureCanvas(canvas) {
  const t = new THREE.CanvasTexture(canvas);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestMipmapLinearFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Matières jamais dessinées (murs invisibles au bord des cartes).
export const INVISIBLES = new Set(['invisible']);

// Crée le "matériau" (texture + façon de réagir à la lumière) d'une matière de la carte.
// Renvoie null pour une matière invisible.
// Matières « de couleur » (utilisées par les cartes de Caméléon pour les meubles et les objets) :
//   '#rrggbb'                → couleur unie (un peu de grain)
//   'raye:#aaaaaa:#bbbbbb'   → rayures   · 'damier:#a:#b' → damier · 'pois:#a:#b' → pois · 'tissu:#a:#b' → tissu tressé
const COULEUR_PERSO = /^(?:(#[0-9a-f]{6})|(raye|damier|pois|tissu):(#[0-9a-f]{6}):(#[0-9a-f]{6}))$/;
function dessinCouleur(nom) {
  const m = COULEUR_PERSO.exec(nom);
  if (!m) return null;
  if (m[1]) return { base: m[1], dessin(g, rnd, b) { bruit(g, rnd, 0, 0, 16, 16, b, 0.06); } };
  const [, , motif, a, b2] = m;
  return {
    base: a,
    dessin(g, rnd) {
      bruit(g, rnd, 0, 0, 16, 16, a, 0.05);
      for (let x = 0; x < 16; x++) {
        for (let y = 0; y < 16; y++) {
          let autre = false;
          if (motif === 'raye') autre = (x >> 2) % 2 === 1;
          else if (motif === 'damier') autre = ((x >> 2) + (y >> 2)) % 2 === 1;
          else if (motif === 'pois') autre = (x % 8 - 3.5) ** 2 + (y % 8 - 3.5) ** 2 < 5 && ((x >> 3) + (y >> 3)) % 2 === 0;
          else if (motif === 'tissu') autre = (x + y) % 4 < 2 !== (x - y + 16) % 4 < 2;
          if (autre) px(g, x, y, nuance(b2, (rnd() - 0.5) * 0.06));
        }
      }
    },
  };
}

export function materiau(nom) {
  if (INVISIBLES.has(nom)) return null;
  const d = DESSINS[nom] || dessinCouleur(nom) || DESSINS.pierre;
  const c = document.createElement('canvas');
  c.width = c.height = 16;
  let graine = 0;
  for (const ch of nom) graine = (graine * 31 + ch.charCodeAt(0)) >>> 0;
  d.dessin(c.getContext('2d'), hasard(graine), d.base);
  const t = textureCanvas(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  // "echelle" : nombre de mètres couverts par le dessin (2 = gros blocs de pierre).
  if (d.echelle) t.repeat.set(1 / d.echelle, 1 / d.echelle);
  if (d.lumineux) {
    return new THREE.MeshLambertMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.9 });
  }
  if (d.transparent) {
    return new THREE.MeshLambertMaterial({ map: t, transparent: true, opacity: d.transparent, depthWrite: false, side: THREE.DoubleSide });
  }
  return new THREE.MeshLambertMaterial({ map: t });
}
