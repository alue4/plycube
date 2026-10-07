// "Mon personnage" : l'atelier pour personnaliser son personnage.
//   - Visage : dessin pixel par pixel (8 × 8), ou photo transformée en pixels.
//     La photo reste sur l'appareil : seuls les 64 pixels sont enregistrés.
//   - Tête (peau, yeux, coiffure), haut, bas et chaussures, chapeau, accessoires.
// L'aperçu 3D tourne quand on le fait glisser.
import * as THREE from '../vendor/three.min.js';
import { Personnage } from './personnage.js';
import {
  catalogue, normaliserStyle, styleAleatoire, visageParDefaut, visageVersCouleurs, couleursVersVisage,
} from './apparence.js';
import { el } from './hud.js';
import { icone } from './icones.js';

const ONGLETS = [
  { id: 'visage', nom: 'Visage', ic: 'visage' },
  { id: 'tete', nom: 'Tête', ic: 'cheveux' },
  { id: 'haut', nom: 'Haut', ic: 'haut' },
  { id: 'bas', nom: 'Bas', ic: 'bas' },
  { id: 'chapeau', nom: 'Chapeau', ic: 'chapeau' },
  { id: 'accessoires', nom: 'Accessoires', ic: 'lunettes' },
];
const EFFETS = [
  { id: 'normal', nom: 'Normal' }, { id: 'vif', nom: 'Couleurs vives' }, { id: 'pop', nom: 'Pop art' },
  { id: 'bd', nom: 'BD' }, { id: 'zombie', nom: 'Zombie' }, { id: 'alien', nom: 'Alien' },
  { id: 'robot', nom: 'Robot' }, { id: 'nb', nom: 'Noir et blanc' }, { id: 'negatif', nom: 'Négatif' },
];
const hex = (r, g, b) => `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;

// Transforme un pixel (r, g, b de 0 à 255) selon l'effet choisi.
function appliquerEffet(effet, r, g, b) {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const saturer = (k, c = 1.15) => {
    const R = lum + (r - lum) * k; const G = lum + (g - lum) * k; const B = lum + (b - lum) * k;
    return [(R - 128) * c + 128, (G - 128) * c + 128, (B - 128) * c + 128];
  };
  const niveaux = (v, n) => Math.round(Math.max(0, Math.min(255, v)) / (255 / (n - 1))) * (255 / (n - 1));
  switch (effet) {
    case 'vif': return saturer(1.7, 1.25);
    case 'pop': return saturer(2.2, 1.3).map((v) => niveaux(v, 3));
    case 'bd': return saturer(1.5, 1.6).map((v) => niveaux(v, 4));
    case 'zombie': return [lum * 0.45, lum * 0.95 + 25, lum * 0.4];
    case 'alien': return [lum * 0.35, lum * 0.85 + 30, lum * 1.05 + 40];
    case 'robot': return [lum * 0.8 + 10, lum * 0.88 + 15, lum * 1.0 + 30];
    case 'nb': return [lum * 1.1, lum * 1.1, lum * 1.1];
    case 'negatif': return [255 - r, 255 - g, 255 - b];
    default: return saturer(1.25, 1.12);
  }
}

export class Atelier {
  // sauver(style) : envoie au serveur ; il faut ensuite appeler sauvegarde(ok, message).
  constructor({ sauver, surFermer, id }) {
    this.envoyer = sauver;
    this.surFermer = surFermer || (() => {});
    this.idJoueur = id || 1;
    this.onglet = 'visage';
    this.outil = 'pinceau';
    this.couleur = '#222222';
    this.historique = [];
    this.angle = 0.5;
    this.ouvert = false;
    if (!document.querySelector('link[href="atelier.css"]')) {
      document.head.append(el('link', { rel: 'stylesheet', href: 'atelier.css' }));
    }
    this.construire();
  }

  // ---------- Construction de l'écran ----------
  construire() {
    this.canvas = el('canvas', { class: 'apercu-3d' });
    this.erreur = el('p', { class: 'erreur', role: 'alert' });
    this.btnSauver = el('button', { class: 'btn', type: 'button', text: 'Enregistrer', onclick: () => this.enregistrer() });
    this.panneau = el('div', { class: 'panneau' });
    this.barreOnglets = el('nav', { class: 'onglets' }, ONGLETS.map((o) => el('button', {
      class: 'onglet', type: 'button', 'data-onglet': o.id, onclick: () => { this.onglet = o.id; this.afficherPanneau(); },
    }, icone(o.ic), ' ' + o.nom)));
    this.racine = el('div', { id: 'atelier', class: 'ecran', hidden: true },
      el('div', { class: 'atelier carte' },
        el('header', {},
          el('h2', { text: 'Mon personnage' }),
          el('div', { class: 'actions' },
            el('button', { class: 'btn secondaire', type: 'button', onclick: () => this.auHasard() }, icone('de'), ' Au hasard'),
            el('button', { class: 'btn secondaire', type: 'button', text: 'Annuler', 'data-retour': true, onclick: () => this.fermer() }),
            this.btnSauver)),
        this.erreur,
        el('div', { class: 'atelier-corps' },
          el('div', { class: 'apercu' }, this.canvas, el('p', { class: 'sous', text: 'Glisse pour le faire tourner' })),
          el('div', { class: 'options' }, this.barreOnglets, this.panneau))));
    document.body.append(this.racine);

    // Aperçu 3D (un deuxième petit moteur 3D, juste pour l'atelier)
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xdff1ff, 0x5d7a3a, 1.6));
    const soleil = new THREE.DirectionalLight(0xfff1d6, 2);
    soleil.position.set(2, 4, 3);
    this.scene.add(soleil);
    const sol = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.06, 32), new THREE.MeshLambertMaterial({ color: 0x2a3550 }));
    sol.position.y = -0.03;
    this.scene.add(sol);
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
    this.camera.position.set(0, 1.15, 5.6);
    this.camera.lookAt(0, 1.05, 0);
    let glisse = null;
    this.canvas.addEventListener('pointerdown', (e) => { glisse = e.clientX; this.canvas.setPointerCapture(e.pointerId); this.dernierGeste = performance.now(); });
    this.canvas.addEventListener('pointermove', (e) => {
      if (glisse === null) return;
      this.angle += (e.clientX - glisse) * 0.012;
      glisse = e.clientX;
      this.dernierGeste = performance.now();
    });
    const fin = () => { glisse = null; };
    this.canvas.addEventListener('pointerup', fin);
    this.canvas.addEventListener('pointercancel', fin);
    this.dernierGeste = 0;
  }

  // ---------- Ouvrir / fermer ----------
  ouvrir(style) {
    this.style = normaliserStyle(style);
    this.historique = [];
    this.erreur.textContent = '';
    this.btnSauver.disabled = false;
    this.racine.hidden = false;
    this.ouvert = true;
    this.majPerso();
    this.afficherPanneau();
    const boucle = (t) => {
      if (!this.ouvert) return;
      requestAnimationFrame(boucle);
      this.dessiner(t);
    };
    requestAnimationFrame(boucle);
  }

  fermer() {
    this.ouvert = false;
    this.racine.hidden = true;
    this.fermerPhoto();
    this.surFermer();
  }

  enregistrer() {
    this.btnSauver.disabled = true;
    this.erreur.textContent = '';
    this.envoyer(normaliserStyle(this.style));
    // Si le serveur ne répond pas (vieille version, connexion coupée...), on le dit au lieu de rester bloqué.
    clearTimeout(this.attente);
    this.attente = setTimeout(() => {
      this.sauvegarde(false, 'Le serveur ne répond pas : ton personnage n\'a pas été enregistré. Le serveur doit peut-être être mis à jour.');
    }, 6000);
  }

  // Réponse du serveur après "Enregistrer"
  sauvegarde(ok, message) {
    clearTimeout(this.attente);
    this.btnSauver.disabled = false;
    if (ok) this.fermer();
    else this.erreur.textContent = message || 'Impossible d\'enregistrer.';
  }

  auHasard() {
    const visage = this.style.visage;
    this.style = { ...styleAleatoire(), visage };
    this.majPerso();
    this.afficherPanneau();
  }

  // ---------- Aperçu 3D ----------
  majPerso() {
    if (this.perso) this.perso.liberer();
    this.perso = new Personnage({ style: this.style });
    this.perso.groupe.position.y = 0;
    this.scene.add(this.perso.groupe);
  }

  dessiner(t) {
    const r = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    if (this.canvas.width !== Math.round(w * this.renderer.getPixelRatio()) || this.canvas.height !== Math.round(h * this.renderer.getPixelRatio())) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
    if (t - this.dernierGeste > 2500) this.angle += 0.006; // tourne tout seul si on n'y touche pas
    this.perso.groupe.rotation.y = this.angle + Math.PI; // de face au départ
    this.perso.animer(1 / 60, { vitesse: 0, enLAir: false, pitch: -0.15 });
    this.renderer.render(this.scene, this.camera);
  }

  // ---------- Petits éléments d'interface ----------
  titre(texte) { return el('h3', { text: texte }); }

  // Une rangée de boutons ; un seul est choisi (celui de la valeur actuelle)
  choix(liste, cle) {
    return el('div', { class: 'choix' }, liste.map((o) => el('button', {
      type: 'button', class: `option${this.style[cle] === o.id ? ' choisie' : ''}`, text: o.nom,
      onclick: () => { this.modifier({ [cle]: o.id }); },
    })));
  }

  // Des pastilles de couleur + une couleur libre
  couleurs(liste, cle) {
    const libre = el('input', { type: 'color', value: this.style[cle], 'aria-label': 'Autre couleur' });
    libre.addEventListener('input', () => this.modifier({ [cle]: libre.value }, false));
    return el('div', { class: 'couleurs' },
      liste.map((c) => {
        const b = el('button', { type: 'button', class: `pastille${this.style[cle] === c ? ' choisie' : ''}`, 'aria-label': c, onclick: () => this.modifier({ [cle]: c }) });
        b.style.background = c;
        return b;
      }),
      el('label', { class: 'pastille libre', title: 'Autre couleur' }, '+', libre));
  }

  modifier(changements, rafraichirPanneau = true) {
    Object.assign(this.style, changements);
    this.majPerso();
    if (rafraichirPanneau) this.afficherPanneau();
  }

  afficherPanneau() {
    const c = catalogue();
    for (const b of this.barreOnglets.children) b.classList.toggle('actif', b.dataset.onglet === this.onglet);
    const contenu = [];
    switch (this.onglet) {
      case 'visage': contenu.push(...this.panneauVisage()); break;
      case 'tete':
        contenu.push(this.titre('Peau'), this.couleurs(c.peaux, 'peau'),
          this.titre('Yeux'), this.couleurs(c.yeux, 'yeux'),
          this.titre('Coiffure'), this.choix(c.coupes, 'coupe'),
          this.titre('Couleur des cheveux'), this.couleurs(c.cheveux, 'cheveux'));
        if (this.style.visage) contenu.push(el('p', { class: 'sous', text: 'Ton visage est dessiné : les yeux et la frange se changent dans l\'onglet Visage.' }));
        break;
      case 'haut':
        contenu.push(this.titre('Modèle'), this.choix(c.hauts, 'haut'),
          this.titre('Couleur principale'), this.couleurs(c.couleurs, 'hautC1'),
          this.titre('Deuxième couleur'), this.couleurs(c.couleurs, 'hautC2'),
          this.titre('Motif'), this.choix(c.motifs, 'motif'),
          el('p', { class: 'sous', text: 'En mode équipes, la couleur principale devient celle de ton équipe.' }));
        break;
      case 'bas':
        contenu.push(this.titre('Bas'), this.choix(c.bas, 'bas'), this.couleurs(c.couleurs, 'basC'),
          this.titre('Chaussures'), this.choix(c.chaussures, 'chaussures'), this.couleurs(c.couleurs, 'chaussuresC'));
        break;
      case 'chapeau':
        contenu.push(this.titre('Chapeau'), this.choix(c.chapeaux, 'chapeau'),
          this.titre('Couleur'), this.couleurs(c.couleurs, 'chapeauC'));
        break;
      case 'accessoires':
        contenu.push(this.titre('Sur le visage'), this.choix(c.accessoires.visage, 'accVisage'),
          this.titre('Sur les oreilles'), this.choix(c.accessoires.oreilles, 'accOreilles'),
          this.titre('Dans le dos'), this.choix(c.accessoires.dos, 'accDos'),
          this.titre('Autour du cou'), this.choix(c.accessoires.cou, 'accCou'),
          this.titre('Couleur des accessoires'), this.couleurs(c.couleurs, 'accC'));
        break;
      default: break;
    }
    this.panneau.replaceChildren(...contenu);
  }

  // ---------- Onglet Visage : dessin pixel par pixel ----------
  pixels() {
    return visageVersCouleurs(this.style.visage || visageParDefaut(this.style));
  }

  panneauVisage() {
    const c = catalogue();
    const pixels = this.pixels();
    const grille = el('div', { class: 'grille-visage', 'aria-label': 'Visage à dessiner (8 × 8 pixels)' });
    pixels.forEach((col, i) => {
      const d = el('div', { class: 'pixel', 'data-i': i });
      d.style.background = col;
      grille.append(d);
    });
    this.grille = grille;
    let dessine = false;
    const caseSous = (e) => {
      const r = grille.getBoundingClientRect();
      const x = Math.floor(((e.clientX - r.left) / r.width) * 8);
      const y = Math.floor(((e.clientY - r.top) / r.height) * 8);
      return x >= 0 && x < 8 && y >= 0 && y < 8 ? y * 8 + x : -1;
    };
    grille.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      grille.setPointerCapture(e.pointerId);
      this.memoriser();
      dessine = true;
      this.peindre(caseSous(e), true);
    });
    grille.addEventListener('pointermove', (e) => { if (dessine) this.peindre(caseSous(e), false); });
    const fin = () => {
      if (!dessine) return;
      dessine = false;
      this.majPerso();
    };
    grille.addEventListener('pointerup', fin);
    grille.addEventListener('pointercancel', fin);

    const outil = (id, ic, texte) => el('button', {
      type: 'button', class: `option${this.outil === id ? ' choisie' : ''}`,
      onclick: () => { this.outil = id; this.afficherPanneau(); },
    }, icone(ic), ' ' + texte);
    const palette = [...new Set(['#222222', '#ffffff', ...c.peaux.slice(0, 8), ...c.cheveux.slice(0, 6), ...c.yeux.slice(0, 4), ...c.couleurs])];
    const libre = el('input', { type: 'color', value: this.couleur, 'aria-label': 'Autre couleur' });
    libre.addEventListener('input', () => { this.couleur = libre.value; this.majCouleurChoisie(); });
    this.paletteVisage = el('div', { class: 'couleurs' },
      palette.map((col) => {
        const b = el('button', { type: 'button', class: `pastille${col === this.couleur ? ' choisie' : ''}`, 'data-c': col, 'aria-label': col,
          onclick: () => { this.couleur = col; if (this.outil === 'gomme' || this.outil === 'pipette') this.outil = 'pinceau'; this.afficherPanneau(); } });
        b.style.background = col;
        return b;
      }),
      el('label', { class: 'pastille libre', title: 'Autre couleur' }, '+', libre));

    const photo = el('input', { type: 'file', accept: 'image/*', capture: 'user', hidden: true });
    const image = el('input', { type: 'file', accept: 'image/*', hidden: true });
    for (const inp of [photo, image]) inp.addEventListener('change', () => { if (inp.files && inp.files[0]) this.ouvrirPhoto(inp.files[0]); inp.value = ''; });

    this.zonePhoto = el('div', { class: 'zone-photo', hidden: true });
    return [
      el('div', { class: 'visage-ligne' },
        grille,
        el('div', { class: 'outils' },
          outil('pinceau', 'pinceau', 'Pinceau'), outil('remplir', 'seau', 'Remplir'), outil('pipette', 'pipette', 'Pipette'), outil('gomme', 'gomme', 'Gomme'),
          el('button', { type: 'button', class: 'option', onclick: () => this.annuler() }, icone('recharger'), ' Annuler'),
          el('button', { type: 'button', class: 'option', onclick: () => { this.memoriser(); this.modifier({ visage: null }); } }, icone('visage'), ' Visage de base'))),
      this.titre('Couleur du pinceau'), this.paletteVisage,
      this.titre('Ou à partir d\'une photo'),
      el('div', { class: 'choix' },
        el('button', { type: 'button', class: 'option', onclick: () => photo.click() }, icone('appareil'), ' Prendre une photo'),
        el('button', { type: 'button', class: 'option', onclick: () => image.click() }, icone('image'), ' Choisir une image')),
      el('p', { class: 'sous', text: 'La photo reste sur ton appareil : elle devient un visage de 8 × 8 pixels, et seuls ces pixels sont enregistrés.' }),
      photo, image, this.zonePhoto,
    ];
  }

  majCouleurChoisie() {
    if (!this.paletteVisage) return;
    for (const b of this.paletteVisage.querySelectorAll('.pastille[data-c]')) b.classList.toggle('choisie', b.dataset.c === this.couleur);
  }

  memoriser() {
    this.historique.push(this.style.visage);
    if (this.historique.length > 40) this.historique.shift();
  }

  annuler() {
    if (!this.historique.length) return;
    this.modifier({ visage: this.historique.pop() });
  }

  peindre(i, premier) {
    if (i < 0) return;
    const pixels = this.pixels();
    if (this.outil === 'pipette') {
      if (!premier) return;
      this.couleur = pixels[i];
      this.outil = 'pinceau';
      this.afficherPanneau();
      return;
    }
    if (this.outil === 'gomme') {
      pixels[i] = visageVersCouleurs(visageParDefaut({ ...this.style, visage: null }))[i];
    } else if (this.outil === 'remplir') {
      if (!premier) return;
      const cible = pixels[i];
      if (cible === this.couleur) return;
      const pile = [i];
      while (pile.length) {
        const k = pile.pop();
        if (pixels[k] !== cible) continue;
        pixels[k] = this.couleur;
        const x = k % 8; const y = Math.floor(k / 8);
        if (x > 0) pile.push(k - 1); if (x < 7) pile.push(k + 1);
        if (y > 0) pile.push(k - 8); if (y < 7) pile.push(k + 8);
      }
    } else {
      pixels[i] = this.couleur;
    }
    this.style.visage = couleursVersVisage(pixels);
    pixels.forEach((col, k) => { this.grille.children[k].style.background = col; });
    if (this.outil === 'remplir') this.majPerso();
  }

  // ---------- Photo → visage pixelisé ----------
  ouvrirPhoto(fichier) {
    this.fermerPhoto();
    if (!/^image\//.test(fichier.type || 'image/')) { this.erreur.textContent = 'Ce fichier n\'est pas une image.'; return; }
    // La photo est lue uniquement dans le navigateur (jamais envoyée au serveur).
    const lecteur = new FileReader();
    lecteur.onload = () => {
      const img = new Image();
      img.onload = () => {
        this.photo = { img, zoom: 1.4, dx: 0, dy: 0, effet: 'normal', miroir: true };
        this.afficherPhoto();
      };
      img.onerror = () => { this.erreur.textContent = 'Cette image ne peut pas être ouverte.'; };
      img.src = lecteur.result;
    };
    lecteur.onerror = () => { this.erreur.textContent = 'Cette image ne peut pas être ouverte.'; };
    lecteur.readAsDataURL(fichier);
  }

  fermerPhoto() {
    if (this.photo) {
      this.photo.img.onload = null;
      this.photo.img.onerror = null;
      this.photo.img.src = '';   // on oublie la photo
      this.photo = null;
    }
    if (this.zonePhoto) { this.zonePhoto.hidden = true; this.zonePhoto.replaceChildren(); }
  }

  afficherPhoto() {
    const P = this.photo;
    this.cadre = el('canvas', { class: 'cadre-photo', width: 240, height: 240 });
    this.resultat = el('canvas', { class: 'resultat-photo', width: 8, height: 8 });
    let glisse = null;
    this.cadre.addEventListener('pointerdown', (e) => { e.preventDefault(); glisse = [e.clientX, e.clientY]; this.cadre.setPointerCapture(e.pointerId); });
    this.cadre.addEventListener('pointermove', (e) => {
      if (!glisse) return;
      const r = this.cadre.getBoundingClientRect();
      const cote = Math.min(P.img.width, P.img.height) / P.zoom;
      P.dx -= ((e.clientX - glisse[0]) / r.width) * cote * (P.miroir ? -1 : 1);
      P.dy -= ((e.clientY - glisse[1]) / r.height) * cote;
      glisse = [e.clientX, e.clientY];
      this.majPhoto();
    });
    this.cadre.addEventListener('pointerup', () => { glisse = null; });
    const zoom = el('input', { type: 'range', min: '1', max: '4', step: '0.05', value: String(P.zoom), 'aria-label': 'Zoom' });
    zoom.addEventListener('input', () => { P.zoom = Number(zoom.value); this.majPhoto(); });
    const effets = el('div', { class: 'choix' }, EFFETS.map((f) => el('button', {
      type: 'button', class: `option${P.effet === f.id ? ' choisie' : ''}`, text: f.nom,
      onclick: (ev) => { P.effet = f.id; for (const b of ev.target.parentNode.children) b.classList.toggle('choisie', b === ev.target); this.majPhoto(); },
    })));
    this.zonePhoto.replaceChildren(
      el('div', { class: 'photo-ligne' },
        el('div', {}, this.cadre, el('p', { class: 'sous', text: 'Glisse pour centrer ton visage dans le carré.' })),
        el('div', {}, el('div', { class: 'fleche', text: '→' })),
        el('div', {}, this.resultat, el('p', { class: 'sous', text: 'Résultat' }))),
      el('label', { class: 'reglage' }, 'Zoom ', zoom),
      el('label', { class: 'reglage case' }, (() => {
        const m = el('input', { type: 'checkbox' });
        m.checked = P.miroir;
        m.addEventListener('change', () => { P.miroir = m.checked; this.majPhoto(); });
        return m;
      })(), ' Effet miroir'),
      this.titre('Effet rigolo'), effets,
      el('div', { class: 'choix' },
        el('button', { type: 'button', class: 'btn', text: 'Utiliser ce visage', onclick: () => this.utiliserPhoto() }),
        el('button', { type: 'button', class: 'btn secondaire', text: 'Annuler', onclick: () => this.fermerPhoto() })));
    this.zonePhoto.hidden = false;
    this.majPhoto();
    this.zonePhoto.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Calcule les 64 pixels à partir de la photo (recadrage, zoom, effet).
  calculerPixels() {
    const P = this.photo;
    const { img } = P;
    const cote = Math.min(img.width, img.height) / P.zoom;
    const cx = Math.max(cote / 2, Math.min(img.width - cote / 2, img.width / 2 + P.dx));
    const cy = Math.max(cote / 2, Math.min(img.height - cote / 2, img.height / 2 + P.dy));
    P.dx = cx - img.width / 2;
    P.dy = cy - img.height / 2;
    const dessinerDans = (canvas, taille) => {
      const g = canvas.getContext('2d');
      g.save();
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = 'high';
      if (P.miroir) { g.translate(taille, 0); g.scale(-1, 1); }
      g.drawImage(img, cx - cote / 2, cy - cote / 2, cote, cote, 0, 0, taille, taille);
      g.restore();
    };
    // On réduit en deux étapes (meilleure moyenne des couleurs)
    const moyen = document.createElement('canvas');
    moyen.width = moyen.height = 32;
    dessinerDans(moyen, 32);
    const petit = document.createElement('canvas');
    petit.width = petit.height = 8;
    const gp = petit.getContext('2d');
    gp.imageSmoothingEnabled = true;
    gp.imageSmoothingQuality = 'high';
    gp.drawImage(moyen, 0, 0, 8, 8);
    const d = gp.getImageData(0, 0, 8, 8).data;
    const res = [];
    for (let i = 0; i < 64; i++) {
      const [r, g, b] = appliquerEffet(P.effet, d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
      res.push(hex(r, g, b));
    }
    return { res, dessinerDans };
  }

  majPhoto() {
    if (!this.photo) return;
    const { res, dessinerDans } = this.calculerPixels();
    const g = this.cadre.getContext('2d');
    g.clearRect(0, 0, 240, 240);
    dessinerDans(this.cadre, 240);
    const gr = this.resultat.getContext('2d');
    res.forEach((col, i) => { gr.fillStyle = col; gr.fillRect(i % 8, Math.floor(i / 8), 1, 1); });
  }

  utiliserPhoto() {
    if (!this.photo) return;
    const { res } = this.calculerPixels();
    this.memoriser();
    this.fermerPhoto();
    this.modifier({ visage: couleursVersVisage(res) });
  }
}

// Bouton "Mon personnage" pour le hall, avec la petite tête du joueur.
export function boutonPersonnage(ouvrir) {
  const vignette = el('canvas', { width: 8, height: 8, 'aria-hidden': 'true' });
  const b = el('button', { class: 'bouton-perso', type: 'button', onclick: ouvrir },
    vignette,
    el('div', {}, el('b', {}, icone('perso'), ' Mon personnage'), el('span', { text: 'Visage (dessin ou photo), coiffure, vêtements, chapeaux, accessoires…' })));
  b.majVignette = (style) => {
    const s = normaliserStyle(style);
    const g = vignette.getContext('2d');
    visageVersCouleurs(s.visage || visageParDefaut(s)).forEach((col, i) => { g.fillStyle = col; g.fillRect(i % 8, Math.floor(i / 8), 1, 1); });
  };
  return b;
}
