// Animations des armes faites dans l'atelier d'animations (page atelier-animations.html du jeu).
// Elles sont enregistrées dans data/fps-animations.json : { arme: { moment: animation } }.
// Le format est expliqué dans public/js/animations-perso.js. Seul l'admin du site peut les modifier.
const fs = require('fs');
const path = require('path');

// Mêmes valeurs que dans public/js/animations-perso.js (durées imposées par le jeu, en secondes)
const COUPS = { couteau: 0.32, batte: 0.55, poele: 0.5 };
const COUP_DOS = 0.75;
const LANCER = 0.6;
const ARMEMENT = { pompe: 0.5, sniper: 0.75 };
// Durées libres : [min, max]
const LIBRES = { sortir: [0.15, 2], tir: [0.04, 1.5], inspecter: [0.3, 6] };
const PISTES = new Set(['arme', 'mainD', 'mainG', 'chargeur', 'culasse', 'pompe', 'barillet', 'canons', 'munition', 'munitionCanon', 'crochet', 'objet', 'corde']);
const MAX_CLES_PISTE = 60;
const MAX_CLES = 400;
const MAX_SONS = 40;

// Durée imposée par le jeu (en s), null si elle est libre, undefined si ce moment n'existe pas pour cette arme.
function dureeImposee(arme, cle) {
  const tireur = arme.type !== 'melee' && arme.type !== 'gadget';
  switch (cle) {
    case 'sortir': case 'inspecter': return null;
    case 'tir': return tireur || arme.id === 'grappin' ? null : undefined;
    case 'armement': return ARMEMENT[arme.id];
    case 'recharge': return arme.chargeur > 0 && arme.rechargementMs > 0 ? arme.rechargementMs / 1000 : undefined;
    case 'coup': return arme.type === 'melee' ? (COUPS[arme.id] || COUPS.couteau) : undefined;
    case 'coupDos': return arme.dansLeDos ? COUP_DOS : undefined;
    case 'lancer': return arme.id === 'grenade' || arme.id === 'fumigene' ? LANCER : undefined;
    case 'soin': return arme.dureeSoinMs > 0 ? arme.dureeSoinMs / 1000 : undefined;
    default: return undefined;
  }
}

const nombre = (v, min, max) => {
  const n = typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n * 10000) / 10000)) : null;
};

// Vérifie une animation envoyée par l'atelier et n'en garde que ce qui est permis. null = refusée.
// sonConnu(nom) : son du jeu ou son perso existant ; strict = false : un son inconnu est simplement retiré.
function nettoyer(arme, cle, brut, sonConnu, strict = true) {
  if (!brut || typeof brut !== 'object' || !brut.pistes || typeof brut.pistes !== 'object' || Array.isArray(brut.pistes)) return null;
  const imposee = dureeImposee(arme, cle);
  if (imposee === undefined) return null;
  const duree = imposee !== null ? imposee : nombre(brut.duree, ...LIBRES[cle]);
  if (duree === null) return null;
  const pistes = {};
  let total = 0;
  for (const [nom, cles] of Object.entries(brut.pistes)) {
    if (!PISTES.has(nom)) continue; // pièce inconnue : ignorée
    if (!Array.isArray(cles) || cles.length > MAX_CLES_PISTE) return null;
    const liste = [];
    for (const c of cles) {
      if (!Array.isArray(c) || c.length < 7 || c.length > 10) return null;
      const k = [nombre(c[0], 0, duree)];
      for (let j = 1; j < 4; j++) k.push(nombre(c[j], -3, 3));        // décalages en mètres
      for (let j = 4; j < 7; j++) k.push(nombre(c[j], -63, 63));  // rotations en radians (10 tours max)
      if (k.some((v) => v === null)) return null;
      k.push(c[7] ? 1 : 0, c[8] ? 1 : 0, c[9] ? 1 : 0); // cachée, arrêt, main détachée
      liste.push(k);
    }
    liste.sort((a, b) => a[0] - b[0]);
    total += liste.length;
    if (liste.length) pistes[nom] = liste;
  }
  if (total > MAX_CLES) return null;
  const sons = [];
  if (brut.sons !== undefined) {
    if (!Array.isArray(brut.sons) || brut.sons.length > MAX_SONS) return null;
    for (const s of brut.sons) {
      if (!Array.isArray(s) || typeof s[1] !== 'string') return null;
      if (!sonConnu(s[1])) { if (strict) return null; continue; }
      const t = nombre(s[0], 0, duree);
      if (t === null) return null;
      sons.push([t, s[1]]);
    }
    sons.sort((a, b) => a[0] - b[0]);
  }
  return { duree, mouvement: brut.mouvement === 'doux' ? 'doux' : 'fluide', pistes, sons };
}

// Lecture / écriture du fichier. reglages : ceux du jeu (la durée de sortie des armes y est mise à jour).
function stockage({ reglages, sonConnu, fichier }) {
  const dossier = process.env.DATA_DIR || path.join(__dirname, '..', '..', '..', 'data');
  const chemin = fichier || path.join(dossier, 'fps-animations.json');
  const armes = new Map(reglages.armes.map((a) => [a.id, a]));
  const sortieOrigine = new Map(reglages.armes.map((a) => [a.id, a.sortieMs]));
  let toutes = {};

  // Une sortie perso change aussi le moment où on peut tirer (aux 3/4 de la sortie, comme avant)
  const appliquerSorties = () => {
    for (const a of reglages.armes) {
      const s = toutes[a.id] && toutes[a.id].sortir;
      a.sortieMs = s ? Math.round(s.duree * 1000) : sortieOrigine.get(a.id);
    }
  };

  try {
    if (fs.existsSync(chemin)) {
      const brut = JSON.parse(fs.readFileSync(chemin, 'utf8'));
      for (const [id, parCle] of Object.entries(brut || {})) {
        const arme = armes.get(id);
        if (!arme || !parCle || typeof parCle !== 'object') continue;
        for (const [cle, anim] of Object.entries(parCle)) {
          const propre = nettoyer(arme, cle, anim, sonConnu, false);
          if (propre) (toutes[id] || (toutes[id] = {}))[cle] = propre;
          else console.error(`FPS : animation ${id}/${cle} ignorée (pas valable)`);
        }
      }
    }
  } catch (e) {
    console.error(`FPS : impossible de lire ${path.basename(chemin)} (${e.message}) : animations d'origine utilisées`);
    toutes = {};
  }
  appliquerSorties();

  const ecrire = () => {
    const tmp = `${chemin}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(toutes));
    fs.renameSync(tmp, chemin);
  };

  return {
    tout: () => toutes,
    // Renvoie l'animation enregistrée, ou un message d'erreur (texte).
    enregistrer(id, cle, brut) {
      const arme = armes.get(id);
      if (!arme) return 'Arme inconnue.';
      if (dureeImposee(arme, cle) === undefined) return 'Cette animation n\'existe pas pour cette arme.';
      const propre = nettoyer(arme, cle, brut, sonConnu);
      if (!propre) return 'Animation pas valable (trop de clés, valeurs hors limites ou son inconnu).';
      const avant = toutes[id] && toutes[id][cle];
      (toutes[id] || (toutes[id] = {}))[cle] = propre;
      try { ecrire(); } catch (e) {
        if (avant) toutes[id][cle] = avant; else delete toutes[id][cle];
        console.error(`FPS : impossible d'enregistrer les animations (${e.message})`);
        return 'Le serveur n\'a pas pu enregistrer le fichier.';
      }
      appliquerSorties();
      return propre;
    },
    supprimer(id, cle) {
      if (!toutes[id] || !toutes[id][cle]) return false;
      const avant = toutes[id][cle];
      delete toutes[id][cle];
      if (!Object.keys(toutes[id]).length) delete toutes[id];
      try { ecrire(); } catch (e) {
        (toutes[id] || (toutes[id] = {}))[cle] = avant;
        console.error(`FPS : impossible d'enregistrer les animations (${e.message})`);
        return false;
      }
      appliquerSorties();
      return true;
    },
  };
}

// Adresses HTTP : lire (joueurs connectés), enregistrer et supprimer (admin seulement).
function routes({ app, auth, security, anims, annoncer }) {
  // Même protection que l'API du site : la demande doit venir du site lui-même
  const memeOrigine = security ? security.sameOriginOnly : (req, res) => res.status(403).json({ error: 'Mets le site à jour.' });
  const base = '/games/fps/api/animations';
  app.get(base, (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Connecte-toi pour jouer.' });
    res.set('Cache-Control', 'no-store');
    res.json({ animations: anims.tout() });
  });
  app.put(`${base}/:arme/:cle`, memeOrigine, auth.requireAdmin, (req, res) => {
    const r = anims.enregistrer(req.params.arme, req.params.cle, req.body && req.body.animation);
    if (typeof r === 'string') return res.status(400).json({ error: r });
    annoncer();
    res.json({ animation: r });
  });
  app.delete(`${base}/:arme/:cle`, memeOrigine, auth.requireAdmin, (req, res) => {
    if (!anims.supprimer(req.params.arme, req.params.cle)) return res.status(404).json({ error: 'Pas d\'animation perso à supprimer.' });
    annoncer();
    res.json({ ok: true });
  });
}

module.exports = { stockage, routes, nettoyer, dureeImposee };
