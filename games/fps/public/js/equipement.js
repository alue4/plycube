// Choix de l'équipement : une arme par catégorie (principale, secondaire, mêlée, gadget).
// Le dernier choix est gardé dans ce navigateur.
import * as THREE from '../vendor/three.min.js';
import { el } from './hud.js';
import { modeleArme } from './armes-modeles.js';

export const CATEGORIES = [
  { id: 'principale', nom: 'Arme principale', touche: 1, icone: '🔫' },
  { id: 'secondaire', nom: 'Arme secondaire', touche: 2, icone: '🔫' },
  { id: 'melee', nom: 'Mêlée', touche: 3, icone: '🔪' },
  { id: 'gadget', nom: 'Gadget', touche: 4, icone: '💣' },
];
const CLE = 'fps-equipement';
const DEFAUT = ['fusil', 'pistolet', 'couteau', 'grenade'];

function chargerCss() {
  if (!document.querySelector('link[href="lobby.css"]')) document.head.append(el('link', { rel: 'stylesheet', href: 'lobby.css' }));
}

// Renvoie un choix valable : chaque catégorie a une arme qui existe vraiment dans la liste.
function valider(armes, choix, parDefaut) {
  const res = {};
  const liste = parDefaut || DEFAUT;
  for (const c of CATEGORIES) {
    const dans = armes.filter((a) => a.categorie === c.id);
    const voulu = choix && choix[c.id];
    const trouve = dans.find((a) => a.id === voulu)
      || dans.find((a) => liste.includes(a.id))
      || dans[0];
    res[c.id] = trouve ? trouve.id : null;
  }
  return res;
}

// Le dernier équipement choisi (ou celui par défaut).
export function equipementMemorise(armes, parDefaut) {
  let memo = null;
  try { memo = JSON.parse(localStorage.getItem(CLE) || 'null'); } catch { memo = null; }
  return valider(armes, memo, parDefaut);
}

function memoriser(choix) {
  try { localStorage.setItem(CLE, JSON.stringify(choix)); } catch { /* navigation privée */ }
}

// Petites barres de 1 à 5
function barres(nom, valeur, texte) {
  const n = Math.max(0, Math.min(5, Math.round(valeur || 0)));
  return el('div', { class: 'stat' },
    el('span', { class: 'stat-nom', text: nom }),
    texte
      ? el('span', { class: 'stat-texte', text: texte })
      : el('span', { class: 'stat-barres', 'aria-label': `${n} sur 5` }, [1, 2, 3, 4, 5].map((i) => el('i', { class: i <= n ? 'plein' : '' }))));
}

export class ChoixEquipement {
  constructor({ armes, surValider, surFermer, parDefaut }) {
    chargerCss();
    this.armes = armes;
    this.parDefaut = parDefaut;
    this.surValider = surValider || (() => {});
    this.surFermer = surFermer || (() => {}); // fermé sans valider (✕ ou Échap)
    this.choix = valider(armes, null, parDefaut);
    this.categorie = 'principale';
    this.admin = false; // l'admin du site voit en plus les armes d'admin (laser)
    this.estOuvert = false;
    this.angle = 0;
    this.construire();
    addEventListener('keydown', (e) => {
      if (!this.estOuvert) return;
      if (e.key === 'Escape' && this.fermable) { this.fermer(); return; }
      const m = /^(Digit|Numpad)([1-4])$/.exec(e.code);
      if (m) { this.categorie = CATEGORIES[Number(m[2]) - 1].id; this.afficher(); }
      if (e.key === 'Enter') this.valider();
    });
  }

  get ouvert() { return this.estOuvert; }

  construire() {
    this.titre = el('h2', { text: 'Choisis tes armes' });
    this.sousTitre = el('p', { class: 'sous' });
    this.btnFermer = el('button', { class: 'btn-fermer', type: 'button', 'aria-label': 'Fermer', text: '✕', 'data-retour': true, onclick: () => this.fermer() });
    this.btnValider = el('button', { class: 'btn btn-valider', type: 'button', text: 'Valider', onclick: () => this.valider() });
    this.emplacements = el('div', { class: 'emplacements', role: 'tablist' });
    this.cartes = el('div', { class: 'cartes-armes' });
    this.canvas = el('canvas', { class: 'apercu-arme', 'aria-hidden': 'true' });
    this.fiche = el('div', { class: 'fiche-arme' });
    this.racine = el('div', { class: 'choix-equipement', hidden: true, role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Choix des armes' },
      el('div', { class: 'equipement' },
        el('header', {}, el('div', { class: 'titres' }, this.titre, this.sousTitre), this.btnFermer),
        this.emplacements,
        el('div', { class: 'equipement-corps' },
          this.cartes,
          el('div', { class: 'detail-arme' }, this.canvas, this.fiche)),
        el('footer', {}, this.btnValider)));
    document.body.append(this.racine);
    // Faire tourner l'aperçu avec le doigt ou la souris
    let glisse = null;
    this.canvas.addEventListener('pointerdown', (e) => { glisse = e.clientX; this.canvas.setPointerCapture(e.pointerId); });
    this.canvas.addEventListener('pointermove', (e) => { if (glisse !== null) { this.angle += (e.clientX - glisse) * 0.015; glisse = e.clientX; } });
    const fin = () => { glisse = null; };
    this.canvas.addEventListener('pointerup', fin);
    this.canvas.addEventListener('pointercancel', fin);
  }

  // Aperçu 3D de l'arme choisie (petit moteur 3D à part, créé au premier besoin)
  preparer3D() {
    if (this.renderer || this.sans3D) return;
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    } catch {
      this.sans3D = true;
      this.canvas.hidden = true;
      return;
    }
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xdff1ff, 0x30304a, 1.6));
    const l = new THREE.DirectionalLight(0xfff1d6, 2.2);
    l.position.set(2, 3, 4);
    this.scene.add(l);
    const r = new THREE.DirectionalLight(0x39e0ff, 1.2);
    r.position.set(-3, 1, -2);
    this.scene.add(r);
    this.camera = new THREE.PerspectiveCamera(28, 1, 0.05, 50);
    this.camera.position.set(0, 0.35, 3.2);
    this.camera.lookAt(0, 0, 0);
    this.support = new THREE.Group();
    this.scene.add(this.support);
  }

  montrerModele(id) {
    if (!this.renderer || id === this.idModele) return;
    this.idModele = id;
    if (this.modele) {
      this.support.remove(this.modele);
      // Les matériaux des armes sont partagés avec le jeu : on ne libère que les formes.
      this.modele.traverse((o) => { if (o.geometry && !o.userData.partage) o.geometry.dispose(); });
    }
    const m = modeleArme(id);
    // On centre et on met à la bonne taille (tient dans ~1,6 unité)
    const boite = new THREE.Box3().setFromObject(m);
    const taille = boite.getSize(new THREE.Vector3());
    const centre = boite.getCenter(new THREE.Vector3());
    // (les petits objets comme la grenade ne sont pas agrandis autant que les fusils)
    const k = Math.min(6, 1.6 / Math.max(0.05, taille.x, taille.y, taille.z));
    m.position.sub(centre);
    const g = new THREE.Group();
    g.add(m);
    g.scale.setScalar(k);
    this.modele = g;
    this.support.add(g);
  }

  boucle() {
    if (!this.estOuvert) return;
    requestAnimationFrame(() => this.boucle());
    if (!this.renderer) return;
    const r = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    const pr = this.renderer.getPixelRatio();
    if (this.canvas.width !== Math.round(w * pr) || this.canvas.height !== Math.round(h * pr)) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
    this.angle += 0.008;
    this.support.rotation.set(0.12, -Math.PI / 2 + Math.sin(this.angle) * 0.9, 0);
    this.renderer.render(this.scene, this.camera);
  }

  // choix : { principale, secondaire, melee, gadget } (identifiants d'armes)
  ouvrir(choix, { titre = 'Choisis tes armes', sousTitre = '', texteBouton = 'Valider', fermable = true } = {}) {
    this.choix = valider(this.armes, choix || equipementMemorise(this.armes, this.parDefaut), this.parDefaut);
    this.categorie = 'principale';
    this.fermable = fermable;
    this.titre.textContent = titre;
    this.sousTitre.textContent = sousTitre;
    this.sousTitre.hidden = !sousTitre;
    this.btnValider.textContent = texteBouton;
    this.btnFermer.hidden = !fermable;
    this.racine.hidden = false;
    this.estOuvert = true;
    this.preparer3D();
    this.afficher();
    this.boucle();
  }

  // valide = true : fermé par "Valider" (ou par le jeu), sans prévenir surFermer
  fermer(valide = false) {
    const etaitOuvert = this.estOuvert;
    this.estOuvert = false;
    this.racine.hidden = true;
    if (etaitOuvert && !valide) this.surFermer();
  }

  valider() {
    const choix = valider(this.armes, this.choix, this.parDefaut);
    memoriser(choix);
    this.fermer(true);
    this.surValider({ ...choix });
  }

  afficher() {
    // Les 4 emplacements en haut (on touche pour changer de catégorie)
    this.emplacements.replaceChildren(...CATEGORIES.map((c) => {
      const arme = this.armes.find((a) => a.id === this.choix[c.id]);
      return el('button', {
        type: 'button', role: 'tab', 'aria-selected': c.id === this.categorie ? 'true' : 'false',
        class: `emplacement${c.id === this.categorie ? ' actif' : ''}`,
        onclick: () => { this.categorie = c.id; this.afficher(); },
      },
      el('span', { class: 'touche', text: c.touche }),
      el('span', { class: 'emplacement-textes' },
        el('small', { text: c.nom }),
        el('b', { text: arme ? arme.nom : '—' })));
    }));

    // Les cartes des armes de la catégorie (les armes d'admin, ex. le laser, seulement pour l'admin du site)
    const liste = this.armes.filter((a) => a.categorie === this.categorie && (!a.admin || this.admin));
    this.cartes.replaceChildren(...liste.map((a) => {
      const choisie = this.choix[this.categorie] === a.id;
      return el('button', {
        type: 'button', class: `carte-arme${choisie ? ' choisie' : ''}`, 'aria-pressed': choisie ? 'true' : 'false',
        onclick: () => { this.choix[this.categorie] = a.id; this.afficher(); },
      },
      el('b', { text: a.nom }),
      el('span', { class: 'desc', text: a.description || '' }),
      el('span', { class: 'mini' }, ...this.resumer(a)));
    }));

    // La fiche détaillée de l'arme choisie dans cette catégorie
    const a = this.armes.find((x) => x.id === this.choix[this.categorie]);
    if (a) {
      const f = a.fiche || {};
      const lignes = [barres('Dégâts', f.degats)];
      if (a.categorie === 'gadget') lignes.push(barres('Recharge', 0, `${Math.round((a.rechargeGadgetMs || 0) / 1000)} s`));
      else lignes.push(barres('Cadence', f.cadence));
      lignes.push(barres('Portée', f.portee), barres('Précision', f.precision));
      this.fiche.replaceChildren(
        el('h3', { text: a.nom }),
        el('p', { class: 'desc', text: a.description || '' }),
        el('div', { class: 'stats' }, lignes),
        el('p', { class: 'details', text: this.details(a) }));
      this.montrerModele(a.id);
    }
  }

  resumer(a) {
    if (a.categorie === 'gadget') return [el('span', { text: `⏱ ${Math.round((a.rechargeGadgetMs || 0) / 1000)} s` })];
    if (a.categorie === 'melee') return [el('span', { text: `💥 ${a.degats}` })];
    return [el('span', { text: `💥 ${a.degats}${a.plombs > 1 ? ` ×${a.plombs}` : ''}` }), el('span', { text: `🔄 ${a.chargeur}` })];
  }

  details(a) {
    if (a.categorie === 'gadget') return `Touche 4. Utilisable à nouveau ${Math.round((a.rechargeGadgetMs || 0) / 1000)} secondes après.`;
    if (a.categorie === 'melee') {
      const vite = a.vitesseArme > 1 ? ' On court plus vite avec en main.' : '';
      return `Touche 3. ${a.degats} dégâts par coup.${vite}`;
    }
    const tete = a.multiplicateurTete ? ` (×${a.multiplicateurTete} dans la tête)` : '';
    const lent = a.vitesseArme && a.vitesseArme < 1 ? ' On marche moins vite avec.' : '';
    return `Touche ${a.categorie === 'principale' ? 1 : 2}. ${a.degats} dégâts${a.plombs > 1 ? ` par plomb, ${a.plombs} plombs` : ''}${tete}, chargeur de ${a.chargeur}.${lent}`;
  }
}
