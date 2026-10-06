// Affichage par-dessus le jeu : vie, munitions, scores, fil des éliminations...
// Sécurité : les pseudos sont toujours écrits avec textContent (jamais innerHTML).
import { COULEURS_EQUIPES, NOMS_EQUIPES } from './personnage.js';

const $ = (id) => document.getElementById(id);

export function el(tag, attrs = {}, ...enfants) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? '' : String(v));
  }
  for (const e of enfants.flat()) if (e !== null && e !== undefined && e !== false) n.append(e instanceof Node ? e : String(e));
  return n;
}

// Relance une animation CSS (en retirant puis remettant la classe).
function rejouer(n, ...classes) {
  n.className = '';
  void n.offsetWidth;
  n.classList.add(...classes);
}

export const hud = {
  afficher(oui) { $('hud').hidden = !oui; },

  pv(pv, max) {
    $('pv').textContent = Math.max(0, Math.round(pv));
    const b = $('pv-barre');
    b.style.width = `${Math.max(0, Math.min(100, (pv / max) * 100))}%`;
    b.classList.toggle('bas', pv <= max * 0.3);
  },

  // recharge : null, ou la progression du rechargement (0 → 1)
  // texteBarre : ce qui est écrit au-dessus de la barre (« Rechargement », ou « Charge » pour le laser)
  munitions(n, max, recharge, nom, texteBarre = 'Rechargement') {
    $('munitions').textContent = n;
    $('munitions').classList.toggle('vide', n === 0);
    $('chargeur').textContent = max ? `/ ${max}` : ''; // mêlée et gadgets : pas de chargeur
    $('arme-nom').textContent = nom;
    $('recharge').hidden = recharge === null;
    if (recharge !== null) {
      $('recharge-barre').style.width = `${Math.round(recharge * 100)}%`;
      const t = $('recharge').querySelector('span');
      if (t && t.textContent !== texteBarre) t.textContent = texteBarre;
    }
  },

  // La barre des 5 armes en bas de l'écran.
  // La barre des 4 emplacements (principale, secondaire, mêlée, gadget).
  // textes[i] : ce qu'on affiche sous le nom (munitions, "prêt", temps de recharge...) ; vides[i] : en rouge
  // touches : le nom de la touche (ou du bouton de la manette) de chaque emplacement
  barreArmes(armes, courante, textes, vides = [], touches = []) {
    const ol = $('barre-armes');
    const cle = armes.map((a) => a.id).join();
    if (ol.dataset.cle !== cle) {
      ol.dataset.cle = cle;
      ol.replaceChildren(...armes.map((a, i) => el('li', {},
        el('span', { class: 'touche', text: i + 1 }), el('span', { class: 'nom', text: a.nom }), el('span', { class: 'mun' }))));
    }
    armes.forEach((a, i) => {
      const li = ol.children[i];
      li.classList.toggle('active', i === courante);
      const t = li.firstChild;
      const nom = touches[i] === undefined ? String(i + 1) : touches[i];
      if (t.textContent !== nom) { t.textContent = nom; t.hidden = !nom; }
      const m = li.querySelector('.mun');
      if (m.textContent !== textes[i]) m.textContent = textes[i];
      m.classList.toggle('vide', !!vides[i]);
    });
  },

  // Écart des traits du viseur (en pixels) ; visible = false en visant (le viseur de l'arme suffit)
  viseur(ecart, visible) {
    const v = $('viseur');
    v.style.setProperty('--ecart', `${Math.round(ecart)}px`);
    v.classList.toggle('cache', !visible);
  },

  lunette(oui) { $('lunette').hidden = !oui; },

  protege(oui) { $('protege').hidden = !oui; },

  marqueur(type) { rejouer($('marqueur'), 'actif', ...(type ? [type] : [])); },

  annonce(grand, petit = '') {
    const a = $('annonce');
    a.querySelector('.grand').textContent = grand;
    a.querySelector('.petit').textContent = petit;
    rejouer(a, 'actif');
  },

  // "Untel ⟶ Machin" dans le coin en haut à droite
  elimination({ tueur, victime, tete, moi, arme }) {
    const fil = $('fil');
    const nom = (j) => el('span', { class: j && j.equipe === 0 ? 'b' : j && j.equipe === 1 ? 'r' : '', text: j ? j.nom : '?' });
    const li = el('li', { class: moi ? 'moi' : '' },
      tueur && tueur !== victime ? nom(tueur) : null,
      el('span', { class: 'arme', text: `${arme ? `[${arme}]` : '⟶'}${tete ? ' 🎯' : ''}` }),
      nom(victime));
    fil.prepend(li);
    while (fil.children.length > 5) fil.lastChild.remove();
    setTimeout(() => li.remove(), 6000);
  },

  info(texte) {
    const fil = $('fil');
    const li = el('li', { text: texte });
    fil.prepend(li);
    setTimeout(() => li.remove(), 4000);
  },

  // Flèche orange qui montre d'où vient le tir. angle en radians (0 = devant)
  degats(angle) {
    const i = el('div', { class: 'indicateur' });
    i.style.transform = `rotate(${angle}rad)`;
    $('indicateurs').append(i);
    setTimeout(() => i.remove(), 1000);
    const f = $('flash-degats');
    f.classList.add('actif');
    setTimeout(() => f.classList.remove('actif'), 60);
  },

  chrono(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    $('chrono').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  },

  scores({ mode, scores, moi, meilleur, objectif }) {
    const a = $('score-a');
    const b = $('score-b');
    if (mode === 'equipes') {
      a.className = 'score bleu'; a.textContent = scores[0];
      b.className = 'score rouge'; b.textContent = scores[1];
      $('objectif').textContent = `Première équipe à ${objectif} éliminations`;
    } else {
      a.className = 'score moi'; a.textContent = `Toi : ${moi}`;
      b.className = 'score moi'; b.textContent = `Top : ${meilleur}`;
      $('objectif').textContent = `Premier à ${objectif} éliminations`;
    }
  },

  infos(texte) { $('infos').textContent = texte; },

  mort(oui, parQui, secondes) {
    $('mort').hidden = !oui;
    $('hud').classList.toggle('elimine', oui);
    if (!oui) return;
    $('mort').querySelector('.par').textContent = parQui ? `par ${parQui}` : '';
    $('mort').querySelector('.compte').textContent = secondes > 0 ? `Réapparition dans ${secondes}…` : '';
  },

  // Tableau des scores (touche Tab, et fin de partie)
  tableau(joueurs, mode, moiId) {
    const ligne = (j) => el('tr', { class: j.id === moiId ? 'moi' : '' },
      el('td', {}, el('span', { class: `pastille ${j.equipe === 0 ? 'b' : j.equipe === 1 ? 'r' : ''}` }), j.nom),
      el('td', { class: 'n', text: j.kills }),
      el('td', { class: 'n', text: j.morts }));
    const table = (liste) => el('table', { class: 'classement' },
      el('tr', {}, el('th', { text: 'Joueur' }), el('th', { class: 'n', text: 'Élim.' }), el('th', { class: 'n', text: 'Morts' })),
      liste.map(ligne));
    const tri = [...joueurs].sort((a, b) => b.kills - a.kills || a.morts - b.morts);
    if (mode !== 'equipes') return table(tri);
    return el('div', { class: 'equipes-tableau' },
      [0, 1].map((e) => el('div', { class: e === 0 ? 'b' : 'r' },
        el('h3', { text: NOMS_EQUIPES[e] }), table(tri.filter((j) => j.equipe === e)))));
  },

  montrerTableau(oui, contenu) {
    $('tableau').hidden = !oui;
    if (oui) $('tableau-contenu').replaceChildren(contenu);
  },

  fin(oui, { titre, contenu, couleur } = {}) {
    $('fin').hidden = !oui;
    if (!oui) return;
    $('fin-titre').textContent = titre;
    $('fin-titre').style.color = couleur || '';
    $('fin-classement').replaceChildren(contenu);
  },

  finCompte(s) { $('fin-compte').textContent = `Nouvelle manche dans ${s} s`; },

  toast(texte, bouton) {
    const t = el('div', { class: 'toast' }, el('span', { text: texte }),
      bouton ? el('button', { class: 'btn', type: 'button', text: bouton.texte, onclick: bouton.action }) : null);
    $('toasts').append(t);
    setTimeout(() => t.remove(), bouton ? 10000 : 4000);
  },
};

export { COULEURS_EQUIPES };
