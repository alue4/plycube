// Icônes maison de Plycube (remplacent les emojis). Le dessin est dans /assets/img/icones.svg.
// Tout hérite de la couleur du texte (currentColor) et de la taille de police.
//   icone('arme')            -> un élément <svg> à mettre comme enfant (ex. dans el(...))
//   svgIcone('arme', 'gros') -> le même en texte (pour innerHTML ou gabarits)
//   hydrater(racine)         -> remplit les <i data-ic="arme"> d'une page par l'icône
const NS = 'http://www.w3.org/2000/svg';
const URL_SPRITE = '/assets/img/icones.svg';

export function icone(nom, classe = '') {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'ic' + (classe ? ' ' + classe : ''));
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(NS, 'use');
  // href + xlink:href pour les navigateurs plus anciens
  use.setAttribute('href', URL_SPRITE + '#' + nom);
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', URL_SPRITE + '#' + nom);
  svg.append(use);
  return svg;
}

export function svgIcone(nom, classe = '') {
  return `<svg class="ic${classe ? ' ' + classe : ''}" aria-hidden="true" focusable="false"><use href="${URL_SPRITE}#${nom}"/></svg>`;
}

// Remplace les repères <i data-ic="nom"></i> présents dans le HTML par l'icône.
export function hydrater(racine = document) {
  for (const marque of racine.querySelectorAll('i[data-ic]')) {
    const i = icone(marque.dataset.ic, marque.className.replace(/\bic\b/, '').trim());
    marque.replaceWith(i);
  }
}
