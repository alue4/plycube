// Un salon de Caméléon : la salle d'attente, les manches de cache-cache et l'arbitrage.
//
// Déroulement d'une manche :
//   cachette  → 60 s : les cacheurs se cachent et se peignent ; les chercheurs ont les yeux bandés (ils ne bougent pas).
//   recherche → 3 min : les chercheurs tirent de la peinture. Touché = trouvé : le cacheur devient chercheur.
//               Tir raté : le chercheur ne peut plus tirer pendant 2,5 s. Toutes les 30 s, les cacheurs sifflent.
//   fin       → le classement, puis une nouvelle manche (avec de nouveaux chercheurs).
// 1 chercheur jusqu'à 4 joueurs, 2 à partir de 5, 3 à partir de 9...
//
// Le serveur est l'arbitre : il décide si un tir touche. Les navigateurs disent seulement « je suis ici »,
// « je tire dans cette direction », « voici ma peinture ».
const G = require('./geometrie');
const { Bots } = require('./bots');

const TICK_MS = 50;
const arrondi = (v) => Math.round(v * 100) / 100;
const arrondir = (v) => [arrondi(v[0]), arrondi(v[1]), arrondi(v[2])];
const COULEUR = /^#[0-9a-f]{6}$/;
const PARTIES_CORPS = ['tete', 'corps', 'brasD', 'brasG', 'jambeD', 'jambeG'];

function vecteur(v) {
  if (!Array.isArray(v) || v.length !== 3) return null;
  for (const n of v) if (typeof n !== 'number' || !Number.isFinite(n) || Math.abs(n) > 1000) return null;
  return v;
}

// Couleurs moyennes des parties du corps envoyées par le navigateur (pour les bots chercheurs)
function lireCouleurs(c) {
  if (!c || typeof c !== 'object') return null;
  const res = {};
  for (const k of PARTIES_CORPS) if (typeof c[k] === 'string' && COULEUR.test(c[k])) res[k] = c[k];
  return Object.keys(res).length ? res : null;
}

class Salon {
  constructor({ code, carte, reglages, surVide, styleDe = () => null }) {
    this.code = code;
    this.carte = carte;
    this.r = reglages;
    this.surVide = surVide;
    this.styleDe = styleDe;
    // ce qui arrête la peinture (les vitres et les murs invisibles la laissent passer) et ce qui arrête les bots
    this.boites = carte.boites.filter((b) => b[6] !== 'vitre' && b[6] !== 'invisible').map((b) => b.slice(0, 6));
    this.boitesMarche = carte.boites.map((b) => b.slice(0, 6));
    this.joueurs = new Map();
    this.leurres = new Map();
    this.prochainLeurre = 1;
    this.etat = 'attente';
    this.finEtatA = 0;      // fin de la phase en cours
    this.departA = 0;       // salle d'attente : départ automatique (2 joueurs ou plus)
    this.manche = 0;
    this.prochainSifflet = 0;
    this.prochainPointsSurvie = 0;
    this.gagnants = null;
    this.tickNo = 0;
    this.prefRoles = new Map(); // seul contre des bots : le rôle choisi dans le hall (« Me cacher » / « Chercher »)
    this.bots = new Bots(this);
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  humains() { let n = 0; for (const j of this.joueurs.values()) if (!j.bot) n++; return n; }
  liste(role) { return [...this.joueurs.values()].filter((j) => j.role === role); }

  infos() {
    return { code: this.code, carte: this.carte.id, nomCarte: this.carte.nom, n: this.humains(), max: this.r.joueursMax, etat: this.etat };
  }

  envoyer(j, msg) { if (j.ws && j.ws.readyState === 1) j.ws.send(JSON.stringify(msg)); }
  diffuser(msg, sauf) {
    const txt = JSON.stringify(msg);
    for (const j of this.joueurs.values()) if (j !== sauf && j.ws && j.ws.readyState === 1) j.ws.send(txt);
  }

  infosPubliques(j) {
    return {
      id: j.id, nom: j.nom, style: j.style, role: j.role, points: j.points, pose: j.pose,
      p: arrondir([j.x, j.y, j.z]), yaw: arrondi(j.yaw), ...(j.bot ? { bot: 1 } : {}),
      ...(j.peau ? { peau: j.peau } : {}), ...(j.couleurs && j.bot ? { couleurs: j.couleurs } : {}),
    };
  }

  // ---------- Arrivée / départ ----------
  ajouter(ws, user) {
    if (this.joueurs.has(user.id)) this.retirer(user.id);
    const j = this.creerJoueur({ id: user.id, nom: user.username, ws, style: this.styleDe(user.id) });
    // en pleine manche : on arrive comme chercheur (on ne peut pas se cacher en retard)
    if (this.etat === 'cachette' || this.etat === 'recherche') {
      j.role = 'chercheur';
      this.placer(j, this.pointChercheur(this.liste('chercheur').length));
    }
    this.joueurs.set(j.id, j);
    this.envoyer(j, {
      t: 'bienvenue', code: this.code, carte: this.carte.id, moi: j.id, etat: this.etat, manche: this.manche,
      finDans: Math.max(0, this.finEtatA - Date.now()), departDans: this.departA ? Math.max(0, this.departA - Date.now()) : null,
      joueurs: [...this.joueurs.values()].map((x) => this.infosPubliques(x)),
      leurres: [...this.leurres.values()],
    });
    this.diffuser({ t: 'entree', joueur: this.infosPubliques(j) }, j);
    this.majAttente();
    return j;
  }

  creerJoueur({ id, nom, ws, style = null, bot = false }) {
    return {
      id, nom, ws, bot, style,
      role: null, x: 0, y: 0, z: 0, yaw: 0, pitch: 0, pose: 0,
      peau: null, couleurs: null, points: 0, foisChercheur: 0,
      bloqueJusqua: 0, dernierTir: 0, leurreUtilise: false, radarUtilise: false,
      derniereMaj: Date.now(), dernierCorr: 0, derniereePeau: 0, rtt: 80, gele: false,
    };
  }

  retirer(id, ws) {
    const j = this.joueurs.get(id);
    if (!j || (ws && j.ws !== ws)) return;
    this.joueurs.delete(id);
    for (const [lid, l] of this.leurres) if (l.owner === id) { this.leurres.delete(lid); this.diffuser({ t: 'leurreDetruit', id: lid }); }
    if (j.ws && j.ws.salon === this) j.ws.salon = null;
    this.diffuser({ t: 'sortie', id });
    if (this.humains() === 0) {
      clearInterval(this.timer);
      this.surVide(this.code);
      return;
    }
    this.verifierFin();
    this.majAttente();
  }

  // ---------- Salle d'attente ----------
  majAttente() {
    if (this.etat !== 'attente') return;
    const n = this.humains();
    if (n >= 2 && !this.departA) this.departA = Date.now() + this.r.attenteSecondes * 1000;
    if (n < 2) this.departA = 0;
    this.diffuser({ t: 'attente', dans: this.departA ? Math.max(0, this.departA - Date.now()) : null, n });
  }

  // ---------- Messages reçus d'un joueur ----------
  message(j, data) {
    switch (data.t) {
      case 'm': return this.deplacement(j, data);
      case 'tir': return this.tir(j, data);
      case 'peau': return this.peindre(j, data);
      case 'pose': return this.changerPose(j, data);
      case 'leurre': return this.poserLeurre(j);
      case 'radar': return this.radar(j);
      case 'commencer': if (this.etat === 'attente') this.nouvelleManche(); return undefined;
      case 'pong':
        if (typeof data.s === 'number') j.rtt = j.rtt * 0.7 + Math.min(1000, Math.max(0, Date.now() - data.s)) * 0.3;
        return undefined;
      default: return undefined;
    }
  }

  placer(j, s) {
    j.x = s.x; j.y = s.y || 0; j.z = s.z;
    j.yaw = ((s.angle || 0) * Math.PI) / 180;
    j.derniereMaj = Date.now();
  }

  // Le navigateur dit où est son joueur : on vérifie la vitesse (pas de téléportation)
  deplacement(j, data) {
    const p = vecteur(data.p);
    const r = data.r;
    if (!p || !Array.isArray(r) || !Number.isFinite(r[0]) || !Number.isFinite(r[1])) return;
    const now = Date.now();
    const dt = Math.min(1, (now - j.derniereMaj) / 1000);
    j.yaw = r[0] % (Math.PI * 2);
    j.pitch = Math.max(-1.6, Math.min(1.6, r[1]));
    // chercheurs pendant la cachette : yeux bandés, ils ne bougent pas
    const gele = this.etat === 'cachette' && j.role === 'chercheur';
    const T = this.carte.taille;
    const vMax = this.r.joueur.vitesse * 1.4;
    const horizontal = Math.hypot(p[0] - j.x, p[2] - j.z);
    const montee = p[1] - j.y;
    if (gele ? horizontal > 0.6 : (Math.abs(p[0]) > T || Math.abs(p[2]) > T || p[1] < -5 || p[1] > 30
        || horizontal > vMax * dt + 1.2 || montee > 20 * dt + 1.2)) {
      j.derniereMaj = now;
      if (now - j.dernierCorr > 250) { j.dernierCorr = now; this.envoyer(j, { t: 'corr', p: arrondir([j.x, j.y, j.z]) }); }
      return;
    }
    if (gele) { j.derniereMaj = now; return; }
    // un cacheur qui bouge quitte sa pose
    if (j.pose && horizontal > 0.25 && j.role === 'cacheur') this.changerPose(j, { p: 0 });
    j.x = p[0]; j.y = p[1]; j.z = p[2];
    j.derniereMaj = now;
  }

  // La peinture d'un cacheur (image 64 × 64 en PNG) : relayée aux autres joueurs
  peindre(j, data) {
    if (j.role !== 'cacheur') return;
    const now = Date.now();
    if (now - j.derniereePeau < 250) return;
    if (typeof data.png !== 'string' || data.png.length > 40000 || !data.png.startsWith('data:image/png;base64,')) return;
    if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(data.png)) return;
    j.derniereePeau = now;
    j.peau = data.png;
    j.couleurs = lireCouleurs(data.couleurs) || j.couleurs;
    this.diffuser({ t: 'peau', id: j.id, png: j.peau }, j);
  }

  changerPose(j, data) {
    const p = [0, 1, 2, 3].includes(data.p) ? data.p : 0;
    if (j.role !== 'cacheur' && p !== 0) return;
    if (p === j.pose) return;
    j.pose = p;
    this.diffuser({ t: 'pose', id: j.id, p }, j.bot ? null : j);
  }

  // Leurre : une copie immobile du cacheur, une seule par manche
  poserLeurre(j) {
    if (j.role !== 'cacheur' || j.leurreUtilise || (this.etat !== 'cachette' && this.etat !== 'recherche')) return;
    j.leurreUtilise = true;
    const l = { id: this.prochainLeurre++, owner: j.id, p: arrondir([j.x, j.y, j.z]), yaw: arrondi(j.yaw), pose: j.pose };
    this.leurres.set(l.id, l);
    this.diffuser({ t: 'leurre', ...l });
  }

  // Radar du chercheur : une fois par manche, la direction de chaque cacheur pendant 2 s
  radar(j) {
    if (j.role !== 'chercheur' || j.radarUtilise || this.etat !== 'recherche') return;
    j.radarUtilise = true;
    const dirs = this.liste('cacheur').map((c) => {
      const dx = c.x - j.x; const dz = c.z - j.z;
      const n = Math.hypot(dx, dz) || 1;
      return [arrondi(dx / n), arrondi(dz / n), Math.round(n)];
    });
    this.envoyer(j, { t: 'radar', dirs, ms: this.r.radarMs });
  }

  // ---------- Tir de peinture ----------
  tir(j, data) {
    const now = Date.now();
    if (j.role !== 'chercheur' || this.etat !== 'recherche') return;
    if (now < j.bloqueJusqua || now - j.dernierTir < this.r.cadenceMs * 0.8) return;
    const d = G.normaliser(vecteur(data.d) || [0, 0, 0]);
    if (!d) return;
    j.dernierTir = now;
    const oeil = [j.x, j.y + G.HAUTEUR_YEUX * (j.pose === 2 ? 0.7 : 1), j.z];
    const mur = G.rayonCarteDetail(oeil, d, this.boites, this.r.porteeTir);
    let t = mur.t;
    let cible = null;
    let leurre = null;
    for (const c of this.joueurs.values()) {
      if (c.role !== 'cacheur') continue;
      const tc = G.rayonBoite(oeil, d, G.boiteJoueur(c.x, c.y, c.z, c.pose, c.yaw));
      if (tc < t) { t = tc; cible = c; leurre = null; }
    }
    for (const l of this.leurres.values()) {
      const tl = G.rayonBoite(oeil, d, G.boiteJoueur(l.p[0], l.p[1], l.p[2], l.pose, l.yaw));
      if (tl < t) { t = tl; leurre = l; cible = null; }
    }
    const impact = [oeil[0] + d[0] * t, oeil[1] + d[1] * t, oeil[2] + d[2] * t];
    this.diffuser({
      t: 'tir', id: j.id, o: arrondir(oeil), f: arrondir(impact),
      n: !cible && !leurre && mur.normale ? mur.normale : undefined, cible: cible ? cible.id : undefined, leurre: leurre ? leurre.id : undefined,
    });
    if (cible) return this.trouver(cible, j);
    if (leurre) {
      this.leurres.delete(leurre.id);
      const proprio = this.joueurs.get(leurre.owner);
      if (proprio) proprio.points += this.r.points.leurre;
      j.bloqueJusqua = now + this.r.penaliteLeurreMs;
      this.diffuser({ t: 'leurreDetruit', id: leurre.id, par: j.id });
      this.envoyer(j, { t: 'rate', ms: this.r.penaliteLeurreMs, leurre: 1 });
      return undefined;
    }
    j.bloqueJusqua = now + this.r.penaliteRateMs;
    this.envoyer(j, { t: 'rate', ms: this.r.penaliteRateMs });
    return undefined;
  }

  // Un cacheur est trouvé : il devient chercheur
  trouver(c, par) {
    c.role = 'chercheur';
    c.pose = 0;
    c.peau = null;
    c.couleurs = null;
    c.foisChercheur++;
    c.bloqueJusqua = Date.now() + 1500; // le temps de comprendre ce qui arrive
    if (par) par.points += this.r.points.trouve;
    this.diffuser({ t: 'trouve', id: c.id, par: par ? par.id : null, p: arrondir([c.x, c.y, c.z]), points: this.points() });
    this.verifierFin();
  }

  points() { return Object.fromEntries([...this.joueurs.values()].map((j) => [j.id, j.points])); }

  // ---------- Manches ----------
  pointChercheur(k) {
    const s = this.carte.apparitions.find((a) => a.role === 'chercheur') || this.carte.apparitions[0];
    const a = (k * 2.3) % (Math.PI * 2);
    const r = k ? 1.2 : 0;
    return { x: s.x + Math.cos(a) * r, y: s.y || 0, z: s.z + Math.sin(a) * r, angle: s.angle || 0 };
  }

  nouvelleManche() {
    const now = Date.now();
    this.bots.preparerManche(); // ajoute ou enlève des bots (seul : on joue avec des bots)
    const tous = [...this.joueurs.values()];
    if (tous.length < 2) {
      this.etat = 'attente';
      this.departA = 0;
      this.diffuser({ t: 'attente', dans: null, n: this.humains(), seul: 1 });
      return;
    }
    this.manche++;
    for (const [id] of this.leurres) this.diffuser({ t: 'leurreDetruit', id });
    this.leurres.clear();
    // les chercheurs : ceux qui l'ont été le moins souvent (un peu de hasard pour départager)
    const nb = Math.max(1, Math.ceil(tous.length / this.r.chercheursPour));
    // seul contre des bots, on garde le rôle choisi (chercheur : on passe en premier ; cacheur : en dernier)
    const humains = tous.filter((j) => !j.bot);
    const pref = humains.length === 1 ? this.prefRoles.get(humains[0].id) : null;
    const bonus = (j) => (pref && !j.bot ? (pref === 'chercheur' ? -1000 : 1000) : 0);
    const ordre = tous.map((j) => ({ j, cle: j.foisChercheur + Math.random() * 0.9 + bonus(j) })).sort((a, b) => a.cle - b.cle);
    const chercheurs = new Set(ordre.slice(0, nb).map((x) => x.j));
    const points = this.carte.apparitions.filter((a) => a.role !== 'chercheur').sort(() => Math.random() - 0.5);
    let k = 0; let kc = 0;
    for (const j of tous) {
      j.role = chercheurs.has(j) ? 'chercheur' : 'cacheur';
      if (j.role === 'chercheur') j.foisChercheur++;
      j.pose = 0; j.peau = null; j.couleurs = null;
      j.leurreUtilise = false; j.radarUtilise = false; j.bloqueJusqua = 0; j.dernierTir = 0;
      this.placer(j, j.role === 'chercheur' ? this.pointChercheur(kc++) : points[k++ % points.length]);
    }
    this.etat = 'cachette';
    this.finEtatA = now + this.r.cachetteSecondes * 1000;
    this.departA = 0;
    this.gagnants = null;
    this.diffuser({
      t: 'manche', manche: this.manche, etat: this.etat, finDans: this.finEtatA - now,
      joueurs: tous.map((j) => ({ id: j.id, role: j.role, p: arrondir([j.x, j.y, j.z]), yaw: arrondi(j.yaw) })),
    });
    this.bots.debutManche();
  }

  debutRecherche() {
    const now = Date.now();
    this.etat = 'recherche';
    this.finEtatA = now + this.r.rechercheSecondes * 1000;
    this.prochainSifflet = now + this.r.siffletSecondes * 1000;
    this.prochainPointsSurvie = now + 10000;
    this.diffuser({ t: 'etat', etat: this.etat, finDans: this.finEtatA - now });
    this.verifierFin();
  }

  verifierFin() {
    if (this.etat !== 'recherche' && this.etat !== 'cachette') return;
    const cacheurs = this.liste('cacheur').length;
    const chercheurs = this.liste('chercheur').length;
    if (cacheurs === 0) this.terminer('chercheurs');
    else if (chercheurs === 0) this.terminer('cacheurs');
  }

  terminer(gagnants) {
    const now = Date.now();
    if (gagnants === 'cacheurs') for (const j of this.liste('cacheur')) j.points += this.r.points.survieFin;
    this.etat = 'fin';
    this.gagnants = gagnants;
    this.finEtatA = now + this.r.finSecondes * 1000;
    const classement = [...this.joueurs.values()].sort((a, b) => b.points - a.points)
      .map((j) => ({ id: j.id, nom: j.nom, points: j.points, role: j.role, style: j.style }));
    this.diffuser({ t: 'fin', gagnants, classement, finDans: this.finEtatA - now, restants: this.liste('cacheur').map((j) => j.id) });
  }

  tick() {
    const now = Date.now();
    this.tickNo++;
    if (this.etat === 'attente') {
      if (this.departA && now >= this.departA) this.nouvelleManche();
      else if (this.tickNo % 20 === 0 && this.departA) this.majAttente();
    } else if (this.etat === 'cachette' && now >= this.finEtatA) this.debutRecherche();
    else if (this.etat === 'recherche') {
      if (now >= this.finEtatA) this.terminer('cacheurs');
      else {
        if (now >= this.prochainSifflet) {
          this.prochainSifflet = now + this.r.siffletSecondes * 1000;
          const p = this.liste('cacheur').map((j) => arrondir([j.x, j.y + 1.2, j.z]));
          if (p.length) { this.diffuser({ t: 'sifflet', p }); this.bots.surSifflet(p); }
        }
        if (now >= this.prochainPointsSurvie) {
          this.prochainPointsSurvie = now + 10000;
          for (const j of this.liste('cacheur')) j.points += this.r.points.survie10s;
          this.diffuser({ t: 'scores', points: this.points() });
        }
      }
    } else if (this.etat === 'fin' && now >= this.finEtatA) this.nouvelleManche();

    this.bots.tick(now, TICK_MS / 1000);
    // positions de tout le monde : [id, x, y, z, angle, regard haut/bas, pose]
    const etats = [];
    for (const j of this.joueurs.values()) etats.push([j.id, arrondi(j.x), arrondi(j.y), arrondi(j.z), arrondi(j.yaw), arrondi(j.pitch), j.pose]);
    this.diffuser({ t: 's', j: etats });
    if (this.tickNo % 40 === 0) for (const j of this.joueurs.values()) this.envoyer(j, { t: 'ping', s: now });
  }
}

module.exports = { Salon, PARTIES_CORPS };
