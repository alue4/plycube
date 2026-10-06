#!/usr/bin/env python3
# Générateur des cartes d'Arena FPS.
#
# Ce script fabrique les fichiers games/fps/public/cartes/*.json (arene, chateau,
# ville, ile), vérifie qu'ils sont corrects (points d'apparition, bords de la carte...)
# et affiche un plan vu du dessus de chaque carte.
#
# Pour tout régénérer (depuis le dossier du projet) :
#     python3 games/fps/outils/cartes.py
# Pour une seule carte :
#     python3 games/fps/outils/cartes.py chateau
# Puis redémarre le site : sudo docker compose restart
#
# Repères : x vers l'est, z vers le sud, y vers le haut (en mètres, le sol est à 0).
# Une boîte = [x1, y1, z1, x2, y2, z2, matière].
import json
import math
import os
import re
import sys

DOSSIER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'cartes')

MATIERES = {
    'herbe', 'terre', 'sable', 'pierre', 'pave', 'pierre_chateau', 'brique', 'beton', 'asphalte',
    'trottoir', 'bois', 'planches', 'caisse', 'tronc', 'palmier', 'feuilles', 'feuilles_palmier',
    'paille', 'toit_rouge', 'toit_ardoise', 'metal', 'metal_rouge', 'metal_bleu', 'metal_jaune',
    'pneu', 'vitre', 'lampe', 'tissu_bleu', 'tissu_rouge', 'trampoline', 'neon', 'neon_rouge', 'invisible',
}
LARGEUR, HAUTEUR = 0.3, 1.8   # demi-largeur et taille d'un joueur
MAX_OBJETS = 900

AIDE = ("Carte d'Arena FPS (fabriquée par games/fps/outils/cartes.py : modifie plutôt ce script). "
        "taille = demi-côté de la zone de jeu. boites = blocs solides [x1, y1, z1, x2, y2, z2, matière] "
        "(en mètres, le sol est à y = 0) ; decors = blocs sans collision ; apparitions : y = hauteur du sol, "
        "angle en degrés (0 = regarde vers le nord, 90 = l'ouest, -90 = l'est, 180 = le sud), "
        "equipe 0 = Bleus (au nord), 1 = Rouges (au sud), null = chacun pour soi. "
        "Les vitres et les murs invisibles laissent passer les balles.")

DIRS = {'N': (0, -1), 'S': (0, 1), 'E': (1, 0), 'O': (-1, 0)}

# Identité d'une carte : normale (k = 1) ou version XXL (k > 1, plus grande et avec plus de monde).
def variante(base_id, base_nom, k):
    if k == 1:
        return base_id, base_nom, None, None
    return base_id + '_xxl', base_nom + ' XXL', 7, {'solo': 12, 'equipes': 16}


def r3(v):
    return round(v + 0.0, 3)


class Carte:
    # k = facteur d'agrandissement horizontal (x, z) pour les cartes XXL : tout est plus grand
    # au sol (positions ET tailles), mais les hauteurs (y) ne changent pas, pour que les marches
    # restent franchissables et que les bâtiments gardent une hauteur normale. botsMax / joueursMax
    # permettent aux cartes XXL d'accueillir plus de monde.
    def __init__(self, id, nom, description, taille, ambiance, eau=None, k=1, botsMax=None, joueursMax=None):
        self.id, self.nom, self.description = id, nom, description
        self.k = k
        self.T = taille                 # demi-côté en unités « plan » (ce que manipule le code)
        self.taille = r3(taille * k)    # demi-côté réel (dans le fichier et dans le jeu)
        self.botsMax, self.joueursMax = botsMax, joueursMax
        # Le brouillard et le soleil s'éloignent avec la carte.
        amb = {kk: (list(vv) if isinstance(vv, list) else vv) for kk, vv in ambiance.items()}
        if k != 1 and 'brouillard' in amb:
            amb['brouillard'] = [amb['brouillard'][0], r3(amb['brouillard'][1] * k), r3(amb['brouillard'][2] * k)]
        self.ambiance, self.eau = amb, eau
        self.b, self.d, self.s = [], [], []

    # ---------- Ajout d'objets ----------
    # x et z sont multipliés par k (carte XXL) ; y reste tel quel.
    def box(self, x0, y0, z0, x1, y1, z1, m):
        assert m in MATIERES, m
        k = self.k
        b = [r3(min(x0, x1) * k), r3(min(y0, y1)), r3(min(z0, z1) * k), r3(max(x0, x1) * k), r3(max(y0, y1)), r3(max(z0, z1) * k), m]
        assert b[0] < b[3] and b[1] < b[4] and b[2] < b[5], ('boîte vide', b)
        self.b.append(b)
        return b

    def deco(self, x0, y0, z0, x1, y1, z1, m):
        assert m in MATIERES, m
        k = self.k
        b = [r3(min(x0, x1) * k), r3(min(y0, y1)), r3(min(z0, z1) * k), r3(max(x0, x1) * k), r3(max(y0, y1)), r3(max(z0, z1) * k), m]
        assert b[0] < b[3] and b[1] < b[4] and b[2] < b[5], ('décor vide', b)
        self.d.append(b)
        return b

    def spawn(self, x, z, equipe=None, angle=None, y=None):
        if y is None:
            y = self.sol(x, z, 0.6)
        if angle is None:  # regarde vers le centre
            angle = round(math.degrees(math.atan2(x, z))) if (x or z) else 0
        self.s.append({'x': r3(x * self.k), 'y': r3(y), 'z': r3(z * self.k), 'angle': int(angle), 'equipe': equipe})

    # Hauteur du sol (dessus de la boîte la plus haute) en (x, z) « plan », sans dépasser "max".
    def sol(self, x, z, max=50):
        x *= self.k
        z *= self.k
        h = -99
        for b in self.b:
            if b[6] == 'invisible':
                continue
            if b[0] <= x <= b[3] and b[2] <= z <= b[5] and b[4] <= max + 1e-6:
                h = b[4] if b[4] > h else h
        return h

    # ---------- Symétrie (équité entre les équipes) ----------
    def marque(self):
        return (len(self.b), len(self.d), len(self.s))

    # Ajoute la copie tournée de 180° (x, z) -> (-x, -z) de tout ce qui a été ajouté depuis "marque".
    def symetriser(self, m):
        nb, nd, ns = m
        for b in self.b[nb:len(self.b)]:
            self.b.append([r3(-b[3]), b[1], r3(-b[5]), r3(-b[0]), b[4], r3(-b[2]), b[6]])
        for b in self.d[nd:len(self.d)]:
            self.d.append([r3(-b[3]), b[1], r3(-b[5]), r3(-b[0]), b[4], r3(-b[2]), b[6]])
        for s in self.s[ns:len(self.s)]:
            a = s['angle'] + 180
            a = a - 360 if a > 180 else a
            e = s['equipe']
            self.s.append({'x': r3(-s['x']), 'y': s['y'], 'z': r3(-s['z']), 'angle': a, 'equipe': None if e is None else 1 - e})

    # ---------- Briques de construction ----------
    # Escalier : (x, z) = milieu du bord de la première marche, dir = sens de la montée.
    # plein=False : marches "suspendues" (on peut passer dessous).
    def escalier(self, x, z, dir, marches, largeur, y0=0.0, m='pierre', h=0.5, prof=1.0, plein=True, deco_rampe=None):
        dx, dz = DIRS[dir]
        for k in range(1, marches + 1):
            a, b = (k - 1) * prof, k * prof
            haut = y0 + h * k
            bas = y0 if plein else haut - 0.3
            if dx:
                self.box(x + dx * a, bas, z - largeur / 2, x + dx * b, haut, z + largeur / 2, m)
            else:
                self.box(x - largeur / 2, bas, z + dz * a, x + largeur / 2, haut, z + dz * b, m)
        return (x + dx * marches * prof, z + dz * marches * prof, y0 + h * marches)

    # Mur avec des ouvertures (portes, fenêtres). axe = 'x' si le mur est le long de x.
    # trous = [(debut, fin, y_bas, y_haut), ...] le long du mur.
    def mur(self, x0, z0, x1, z1, y0, y1, m, trous=(), axe='x', vitres=False):
        A, B = (x0, x1) if axe == 'x' else (z0, z1)
        coupes = sorted({A, B} | {c for t in trous for c in (t[0], t[1]) if A < c < B})
        for s, e in zip(coupes, coupes[1:]):
            libres = [(max(y0, t[2]), min(y1, t[3])) for t in trous if t[0] <= s + 1e-9 and t[1] >= e - 1e-9]
            libres.sort()
            y = y0
            morceaux = []
            for (a, b) in libres:
                if a > y:
                    morceaux.append((y, a))
                y = max(y, b)
            if y < y1:
                morceaux.append((y, y1))
            for (a, b) in morceaux:
                if axe == 'x':
                    self.box(s, a, z0, e, b, z1, m)
                else:
                    self.box(x0, a, s, x1, b, e, m)
            if vitres:
                for (a, b) in libres:
                    if b - a < 2.0 and a > y0 + 0.1:  # fenêtre (pas une porte) : on met une vitre
                        ep = 0.05
                        if axe == 'x':
                            zc = (z0 + z1) / 2
                            self.box(s, a, zc - ep, e, b, zc + ep, 'vitre')
                        else:
                            xc = (x0 + x1) / 2
                            self.box(xc - ep, a, s, xc + ep, b, e, 'vitre')

    # Bâtiment creux : murs + toit plat (+ rebord). portes = [(côté, centre, largeur)],
    # fenetres = [(côté, centre, largeur, y_bas, y_haut)], côtés : 'N', 'S', 'E', 'O'.
    def batiment(self, x0, z0, x1, z1, y0, h, m, portes=(), fenetres=(), toit='beton', rebord=True,
                 trous_rebord=(), ep=0.4, vitres=True, plafond=None):
        haut = y0 + h
        trous = {c: [] for c in 'NSEO'}
        for (c, centre, larg) in portes:
            trous[c].append((centre - larg / 2, centre + larg / 2, y0, y0 + 2.5))
        for (c, centre, larg, ya, yb) in fenetres:
            trous[c].append((centre - larg / 2, centre + larg / 2, y0 + ya, y0 + yb))
        self.mur(x0, z0, x1, z0 + ep, y0, haut, m, trous['N'], 'x', vitres)
        self.mur(x0, z1 - ep, x1, z1, y0, haut, m, trous['S'], 'x', vitres)
        self.mur(x0, z0 + ep, x0 + ep, z1 - ep, y0, haut, m, trous['O'], 'z', vitres)
        self.mur(x1 - ep, z0 + ep, x1, z1 - ep, y0, haut, m, trous['E'], 'z', vitres)
        if toit:
            self.box(x0, haut - 0.3, z0, x1, haut, z1, toit)
            if rebord:
                self.rebord(x0, z0, x1, z1, haut, 'beton' if m in ('beton', 'brique') else m, trous_rebord)
        return haut

    # Petit muret autour d'un toit (on peut s'abriter derrière). trous = [(côté, début, fin)]
    def rebord(self, x0, z0, x1, z1, y, m, trous=(), h=0.7, ep=0.3):
        t = {c: [] for c in 'NSEO'}
        for (c, a, b) in trous:
            t[c].append((a, b, y, y + h))
        self.mur(x0, z0, x1, z0 + ep, y, y + h, m, t['N'], 'x')
        self.mur(x0, z1 - ep, x1, z1, y, y + h, m, t['S'], 'x')
        self.mur(x0, z0 + ep, x0 + ep, z1 - ep, y, y + h, m, t['O'], 'z')
        self.mur(x1 - ep, z0 + ep, x1, z1 - ep, y, y + h, m, t['E'], 'z')

    def trampoline(self, x, z, y=0.0):
        self.box(x - 1, y, z - 1, x + 1, y + 0.2, z + 1, 'trampoline')

    def caisse(self, x, z, t=1.4, y=0.0, m='caisse'):
        self.box(x - t / 2, y, z - t / 2, x + t / 2, y + t, z + t / 2, m)

    def arbre(self, x, z, y=0.0, h=3.5, r=1.5):
        self.box(x - 0.5, y, z - 0.5, x + 0.5, y + h, z + 0.5, 'tronc')
        self.box(x - r, y + h, z - r, x + r, y + h + 2.5, z + r, 'feuilles')
        self.deco(x - r + 0.5, y + h + 2.5, z - r + 0.5, x + r - 0.5, y + h + 3.2, z + r - 0.5, 'feuilles')

    def lampadaire(self, x, z, y=0.0, h=3.4):
        self.deco(x - 0.1, y, z - 0.1, x + 0.1, y + h, z + 0.1, 'metal')
        self.deco(x - 0.3, y + h, z - 0.3, x + 0.3, y + h + 0.4, z + 0.3, 'lampe')
        self.deco(x - 0.38, y + h + 0.4, z - 0.38, x + 0.38, y + h + 0.5, z + 0.38, 'metal')

    def buisson(self, x, z, y=0.0, l=0.9, h=0.6):
        self.deco(x - l / 2, y, z - l / 2, x + l / 2, y + h, z + l / 2, 'feuilles')

    # Drapeau : mât + bannière (le long de x).
    def drapeau(self, x, z, m, y=0.0, h=6.0):
        self.deco(x - 0.08, y, z - 0.08, x + 0.08, y + h, z + 0.08, 'metal')
        self.deco(x + 0.08, y + h - 2.2, z - 0.04, x + 1.9, y + h - 0.2, z + 0.04, m)

    # Murs du bord de la carte (+ un mur invisible au-dessus jusqu'à 14 m).
    def limites(self, h=8.0, m='pierre', invisible_dessus=True):
        T = self.T  # en unités « plan » : box() applique l'agrandissement
        if m != 'invisible':
            self.box(-T - 1, 0 if m != 'invisible' else -5, -T - 1, T + 1, h, -T, m)
            self.box(-T - 1, 0, T, T + 1, h, T + 1, m)
            self.box(-T - 1, 0, -T, -T, h, T, m)
            self.box(T, 0, -T, T + 1, h, T, m)
        bas = h if m != 'invisible' else -5
        if invisible_dessus or m == 'invisible':
            self.box(-T - 1, bas, -T - 1, T + 1, 14, -T, 'invisible')
            self.box(-T - 1, bas, T, T + 1, 14, T + 1, 'invisible')
            self.box(-T - 1, bas, -T, -T, 14, T, 'invisible')
            self.box(T, bas, -T, T + 1, 14, T, 'invisible')

    # ---------- Vérifications ----------
    def verifier(self):
        T = self.taille
        err = []
        solides = [b for b in self.b]
        for s in self.s:
            x, y, z = s['x'], s['y'], s['z']
            if abs(x) > T - 0.6 or abs(z) > T - 0.6:
                err.append(f'apparition hors carte {s}')
            pose = any(b[0] - 1e-6 <= x <= b[3] + 1e-6 and b[2] - 1e-6 <= z <= b[5] + 1e-6 and abs(b[4] - y) < 0.02
                       and b[6] != 'invisible' for b in solides)
            if not pose:
                err.append(f'apparition dans le vide {s}')
            for b in solides:
                if (x - LARGEUR < b[3] - 1e-6 and x + LARGEUR > b[0] + 1e-6 and y + 0.01 < b[4] and y + HAUTEUR > b[1]
                        and z - LARGEUR < b[5] - 1e-6 and z + LARGEUR > b[2] + 1e-6):
                    err.append(f'apparition coincée dans {b} : {s}')
                    break
            if self.eau and y < self.eau['niveau'] - 0.75:
                err.append(f'apparition trop profonde dans l\'eau {s}')
        libres = [s for s in self.s if s['equipe'] is None]
        bleus = [s for s in self.s if s['equipe'] == 0]
        rouges = [s for s in self.s if s['equipe'] == 1]
        if len(libres) < 10:
            err.append(f'seulement {len(libres)} apparitions "chacun pour soi"')
        if len(bleus) < 5 or len(rouges) < 5:
            err.append(f'apparitions d\'équipe : {len(bleus)} bleus, {len(rouges)} rouges')
        if any(s['z'] >= 0 for s in bleus) or any(s['z'] <= 0 for s in rouges):
            err.append('apparitions d\'équipe du mauvais côté')
        n = len(self.b) + len(self.d)
        if n > MAX_OBJETS:
            err.append(f'trop d\'objets : {n} > {MAX_OBJETS}')
        # Les bords doivent être fermés : au bord, une boîte part du sol et le tout monte à 12 m au moins.
        for (cx, cz) in [(0, -T - 0.5), (0, T + 0.5), (-T - 0.5, 0), (T + 0.5, 0)]:
            for k in range(-int(T), int(T) + 1, 2):
                px, pz = (k, cz) if cx == 0 else (cx, k)
                dessus = [b for b in self.b if b[0] <= px <= b[3] and b[2] <= pz <= b[5]]
                bas = any(b[1] <= 1 and b[4] >= 2 for b in dessus)
                hauteur = max([b[4] for b in dessus] + [-9])
                if not bas or hauteur < 12:
                    err.append(f'bord ouvert en ({px}, {pz}) : hauteur {hauteur}')
                    break
        return err

    # Plan vu du dessus (1 caractère = 1 m).
    def plan(self):
        T = int(self.taille)
        lignes = []
        spawns = {}
        for s in self.s:
            spawns[(math.floor(s['x']), math.floor(s['z']))] = 'S' if s['equipe'] is None else str(s['equipe'])
        for z in range(-T, T):
            ligne = ''
            for x in range(-T, T):
                cx, cz = x + 0.5, z + 0.5
                if (x, z) in spawns:
                    ligne += spawns[(x, z)]
                    continue
                h, mat = -99, None
                for b in self.b:
                    if b[6] == 'invisible':
                        continue
                    if b[0] <= cx <= b[3] and b[2] <= cz <= b[5] and b[4] < 30 and b[4] > h:
                        h, mat = b[4], b[6]
                if mat == 'trampoline':
                    c = 'J'
                elif self.eau and h < self.eau['niveau']:
                    c = '~'
                elif h < 0.25:
                    c = '.'
                elif h >= 9.5:
                    c = '#'
                else:
                    c = str(int(round(h)))
                ligne += c
            lignes.append(ligne)
        return '\n'.join(lignes)

    def json(self):
        doc = {
            '_aide': AIDE, 'id': self.id, 'nom': self.nom, 'description': self.description,
            'taille': self.taille, 'ambiance': self.ambiance, 'eau': self.eau,
            'boites': self.b, 'decors': self.d, 'apparitions': self.s,
        }
        if self.botsMax:
            doc['botsMax'] = self.botsMax
        if self.joueursMax:
            doc['joueursMax'] = self.joueursMax
        txt = json.dumps(doc, ensure_ascii=False, indent=1)
        # une boîte par ligne pour que ce soit lisible
        txt = re.sub(r'\[\n\s+(-?[\d.]+),\n\s+(-?[\d.]+),\n\s+(-?[\d.]+),\n\s+(-?[\d.]+),\n\s+(-?[\d.]+),\n\s+(-?[\d.]+),\n\s+("[a-z_]+")\n\s+\]',
                     r'[\1, \2, \3, \4, \5, \6, \7]', txt)
        txt = re.sub(r'\{\n\s+"x": (-?[\d.]+),\n\s+"y": (-?[\d.]+),\n\s+"z": (-?[\d.]+),\n\s+"angle": (-?\d+),\n\s+"equipe": (\w+)\n\s+\}',
                     r'{"x": \1, "y": \2, "z": \3, "angle": \4, "equipe": \5}', txt)
        json.loads(txt)
        return txt + '\n'


# =====================================================================
#  1. ARÈNE
# =====================================================================
def arene(k=1):
    T = 34
    cid, cnom, bmax, jmax = variante('arene', 'Arène', k)
    c = Carte(cid, cnom, "L'arène classique : une tour au centre, des ponts, des balcons et des trampolines.", T, {
        'ciel': ['#2f7fe0', '#cdeaff'],
        'brouillard': ['#cdeaff', 70, 220],
        'soleil': {'couleur': '#fff1d6', 'intensite': 2.1, 'position': [28, 55, 18]},
        'ambiante': {'ciel': '#cfe8ff', 'sol': '#5d7a3a', 'intensite': 1.35},
        'nuages': True,
    }, k=k, botsMax=bmax, joueursMax=jmax)
    c.box(-T, -1, -T, T, 0, T, 'herbe')
    c.limites(8, 'pierre')
    # Bandes néon en haut des murs
    c.deco(-T, 7.5, -T, T, 7.8, -T + 0.15, 'neon'); c.deco(-T, 7.5, T - 0.15, T, 7.8, T, 'neon')
    c.deco(-T, 7.5, -T, -T + 0.15, 7.8, T, 'neon'); c.deco(T - 0.15, 7.5, -T, T, 7.8, T, 'neon')
    # Chemins de terre
    c.deco(-1.5, 0, -T, 1.5, 0.02, T, 'terre')
    c.deco(-T, 0, -1.5, T, 0.02, 1.5, 'terre')
    for s in (1, -1):
        c.deco(-14, 0, s * 18 - 1, 14, 0.02, s * 18 + 1, 'terre')

    # --- Tour centrale (dessus à 4 m, toit sur piliers) ---
    c.box(-4, 0, -4, 4, 4, 4, 'brique')
    for s in (1, -1):
        c.escalier(s * 12, 0, 'O' if s > 0 else 'E', 8, 3)
        # rebords avec passages (escaliers à l'est/ouest, ponts au nord/sud)
        c.box(s * 3.6, 4, -4, s * 4, 5, -1.5, 'brique'); c.box(s * 3.6, 4, 1.5, s * 4, 5, 4, 'brique')
        c.box(-4, 4, s * 3.6, -1.25, 5, s * 4, 'brique'); c.box(1.25, 4, s * 3.6, 4, 5, s * 4, 'brique')
        for t in (1, -1):
            c.box(s * 3.5, 5, t * 3.5, s * 4, 7.5, t * 4, 'pierre')  # piliers
    c.box(-4.5, 7.5, -4.5, 4.5, 7.9, 4.5, 'metal')
    c.deco(-4.6, 7.9, -4.6, 4.6, 8.0, 4.6, 'neon')
    c.caisse(0, 0, 1.6, 4)

    m = c.marque()  # ----- moitié nord (copiée au sud) -----
    # Pont nord : tour -> plate-forme -> escalier vers la base bleue
    c.box(-1.25, 3.7, -11, 1.25, 4, -4, 'planches')
    for x in (-1.3, 1.1):
        c.deco(x, 4, -11, x + 0.2, 4.9, -4, 'bois')
    c.box(-3, 0, -15, 3, 4, -11, 'bois')
    c.box(-3, 4, -15, -2.6, 5, -11, 'bois'); c.box(2.6, 4, -15, 3, 5, -11, 'bois')
    c.escalier(0, -23, 'S', 8, 3, m='pierre')
    # Base bleue : murets avec néon, drapeaux
    for (a, b) in ((-10, -3), (3, 10)):
        c.box(a, 0, -21, b, 1.2, -20, 'pierre')
        c.deco(a, 1.2, -21, b, 1.35, -20, 'neon')
    c.drapeau(-13, -24, 'tissu_bleu'); c.drapeau(11, -24, 'tissu_bleu')
    # Abris de la base (on peut entrer dedans, toit plat)
    for x0 in (-22, 15):
        c.batiment(x0, -30.5, x0 + 7, -25, 0, 3, 'planches', portes=[('S', x0 + 3.5, 1.8)],
                   fenetres=[('E', -27.75, 1.6, 1.1, 2.1), ('O', -27.75, 1.6, 1.1, 2.1)], toit='bois', rebord=False, vitres=False)
    c.trampoline(-24.5, -22.5)
    # Grands murs en brique et petits murs en pierre (couverture)
    for sx in (1, -1):
        c.box(sx * 12, 0, -15, sx * 13, 3.2, -9, 'brique')
        c.box(sx * 19, 0, -7, sx * 24, 2.4, -6, 'pierre')
        c.caisse(sx * 17.5, -8.5, 1.2)
    # Abris "bunker" à l'est/ouest du centre (portes nord et sud)
    c.batiment(17, -3, 24, 3, 0, 2.8, 'brique', portes=[('N', 20.5, 1.8), ('S', 20.5, 1.8)],
               fenetres=[('E', 0, 2, 1.1, 2), ('O', 0, 2, 1.1, 2)], toit='metal', rebord=False, vitres=False)
    # Balcons le long des murs (hauteur 3) + escalier côté nord
    c.box(T - 4, 0, -10, T, 3, 10, 'bois')
    c.box(T - 4, 3, -10, T - 3.7, 3.8, 10, 'pierre')
    c.escalier(T - 2, -16, 'S', 6, 4)
    # Caisses
    for (x, z, t, y) in ((8, -5, 1.4, 0), (8, -6.4, 1.2, 0), (8, -5, 1.0, 1.4), (6, -13, 1.6, 0), (-7, -13, 1.4, 0),
                         (17, -12, 1.4, 0), (26, -16, 1.4, 0), (26, -17.4, 1.2, 0), (22, -22, 1.4, 0), (-26, -14, 1.4, 0),
                         (10, -27, 1.2, 0), (-10, -27, 1.2, 0)):
        c.caisse(x, z, t, y)
    # Arbres et buissons
    c.arbre(-22, -12); c.arbre(24, -19); c.arbre(-7, -26)
    for (x, z) in ((-15, -8), (5, -18), (-28, -20), (28, -7), (13, -21), (-19, -17), (3, -30), (-30, -3)):
        c.buisson(x, z)
    # Trampolines et tours de guet dans les coins
    c.trampoline(8, -9)
    c.trampoline(-8, -9)
    for sx in (1, -1):
        x0 = sx * 27
        c.box(x0, 0, -31, x0 + sx * 0.4, 4.5, -30.6, 'tronc'); c.box(x0 + sx * 3.6, 0, -31, x0 + sx * 4, 4.5, -30.6, 'tronc')
        c.box(x0, 0, -27.4, x0 + sx * 0.4, 4.5, -27, 'tronc'); c.box(x0 + sx * 3.6, 0, -27.4, x0 + sx * 4, 4.5, -27, 'tronc')
        c.box(x0, 4.5, -31, x0 + sx * 4, 4.9, -27, 'planches')
        c.box(x0, 4.9, -31, x0 + sx * 4, 5.6, -30.8, 'planches'); c.box(x0 + sx * 3.8, 4.9, -31, x0 + sx * 4, 5.6, -27, 'planches')
        c.deco(x0, 7.2, -31.2, x0 + sx * 4, 7.5, -26.8, 'toit_rouge')
        for (px, pz) in ((x0, -31), (x0 + sx * 3.8, -31), (x0, -27.2), (x0 + sx * 3.8, -27.2)):
            c.deco(min(px, px + sx * 0.2), 4.9, pz, max(px, px + sx * 0.2), 7.2, pz + 0.2, 'tronc')
    c.trampoline(-24.5, -27.5)
    c.trampoline(24.5, -27.5)
    # Lampadaires
    for (x, z) in ((-4, -17), (4, -17), (-15, -1.5), (15, -1.5), (-25, -9), (25, -9), (-12, -30), (12, -30)):
        c.lampadaire(x, z)
    # Apparitions
    for x in (-12, -6, 0, 6, 12):
        c.spawn(x, -32, 0, 180)
    for (x, z) in ((-27, 3), (-14, 3), (-11, -24), (20, -18), (-30, -24), (30, -18)):
        c.spawn(x, z)
    c.symetriser(m)
    return c


# =====================================================================
#  2. CHÂTEAU
# =====================================================================
def hutte(c, x0, z0, porte='S', l=5.0, p=4.0):
    """Hutte en planches avec toit de paille (on peut monter sur le toit)."""
    cx, cz = x0 + l / 2, z0 + p / 2
    portes = [(porte, cx if porte in 'NS' else cz, 1.6)]
    fen = [('E' if porte in 'NS' else 'N', cz if porte in 'NS' else cx, 1.0, 1.0, 1.8)]
    c.batiment(x0, z0, x0 + l, z0 + p, 0, 2.6, 'planches', portes=portes, fenetres=fen, toit=None, vitres=False, ep=0.3)
    c.box(x0 - 0.3, 2.6, z0 - 0.3, x0 + l + 0.3, 3.0, z0 + p + 0.3, 'paille')
    c.box(x0 + 0.4, 3.0, z0 + 0.4, x0 + l - 0.4, 3.4, z0 + p - 0.4, 'paille')
    c.box(x0 + 1.1, 3.4, z0 + 1.1, x0 + l - 1.1, 3.8, z0 + p - 1.1, 'paille')


def merlons(c, x0, z0, x1, z1, y, m='pierre_chateau', pas=2.0):
    """Créneaux le long d'un segment (x0,z0)-(x1,z1) (horizontal ou vertical)."""
    if abs(z1 - z0) < abs(x1 - x0):
        x = min(x0, x1)
        while x + 1 <= max(x0, x1) + 1e-6:
            c.box(x, y, min(z0, z1), x + 1, y + 1.2, max(z0, z1), m)
            x += pas
    else:
        z = min(z0, z1)
        while z + 1 <= max(z0, z1) + 1e-6:
            c.box(min(x0, x1), y, z, max(x0, x1), y + 1.2, z + 1, m)
            z += pas


def chateau(k=1):
    T = 44
    cid, cnom, bmax, jmax = variante('chateau', 'Château', k)
    c = Carte(cid, cnom, 'Un château fort avec ses douves, ses remparts, son donjon et un village autour.', T, {
        'ciel': ['#3b5fa6', '#ffcf96'],
        'brouillard': ['#f3d0a4', 75, 260],
        'soleil': {'couleur': '#ffbe7a', 'intensite': 2.3, 'position': [-50, 32, 22]},
        'ambiante': {'ciel': '#ffe0bd', 'sol': '#4f5d35', 'intensite': 1.15},
        'nuages': True,
    }, eau={'niveau': -0.4, 'couleur': '#4fa6c9'}, k=k, botsMax=bmax, joueursMax=jmax)
    PC = 'pierre_chateau'
    # --- Sol : champs autour, douves (fond à -1,6), cour pavée ---
    c.box(-T, -3, -T, T, 0, -24, 'herbe'); c.box(-T, -3, 24, T, 0, T, 'herbe')
    c.box(-T, -3, -24, -24, 0, 24, 'herbe'); c.box(24, -3, -24, T, 0, 24, 'herbe')
    c.box(-24, -3, -24, 24, -1.6, 24, 'terre')
    c.box(-18, -3, -18, 18, 0, 18, 'pave')
    c.limites(m='invisible')
    # herbe et forêt au-delà des bords (décor)
    for (a, b, d, e) in ((-200, -200, 200, -T), (-200, T, 200, 200), (-200, -T, -T, T), (T, -T, 200, T)):
        c.deco(a, -3, b, d, 0, e, 'herbe')
    for k in range(-T, T, 6):
        for (x, z) in ((k + 1.5, -T - 3), (-k - 1.5, T + 3), (-T - 3, -k - 1.5), (T + 3, k + 1.5)):
            c.deco(x - 0.5, 0, z - 0.5, x + 0.5, 4, z + 0.5, 'tronc')
            c.deco(x - 2, 4, z - 2, x + 2, 7.5, z + 2, 'feuilles')

    # --- Donjon au centre (3 étages + toit), portes à l'est et à l'ouest ---
    fen = lambda c_: [(c_, -2.5, 1.0, 5, 6.2), (c_, 2.5, 1.0, 5, 6.2), (c_, -2.5, 1.0, 9, 10.2), (c_, 2.5, 1.0, 9, 10.2)]
    c.batiment(-6, -6, 6, 6, 0, 12, PC, portes=[('E', 0, 2.0), ('O', 0, 2.0)],
               fenetres=fen('N') + fen('S') + fen('E')[2:] + fen('O')[2:] + [('E', -3, 1.0, 5, 6.2), ('O', 3, 1.0, 5, 6.2)],
               toit=None, ep=1.0, vitres=False)
    # étage 1 (y = 4) avec trou au-dessus du premier escalier
    c.box(-5, 3.6, -3.5, 5, 4, 5, 'planches'); c.box(4, 3.6, -5, 5, 4, -3.5, 'planches')
    c.escalier(-5, -4.25, 'E', 8, 1.5, m='planches', plein=False)
    # étage 2 (y = 8)
    c.box(-5, 7.6, -5, 5, 8, 3.5, 'planches'); c.box(-5, 7.6, 3.5, -4, 8, 5, 'planches')
    c.escalier(5, 4.25, 'O', 8, 1.5, y0=4, m='planches', plein=False)
    # toit (y = 12) avec créneaux
    c.box(-6, 11.6, -3.5, 6, 12, 6, PC); c.box(-6, 11.6, -6, 6, 12, -5, PC)
    c.box(4, 11.6, -5, 6, 12, -3.5, PC); c.box(-6, 11.6, -5, -5, 12, -3.5, PC)
    c.escalier(-5, -4.25, 'E', 8, 1.5, y0=8, m='planches', plein=False)
    merlons(c, -6, -6, 6, -5.6, 12); merlons(c, -6, 5.6, 6, 6, 12)
    merlons(c, -6, -5, -5.6, 5, 12); merlons(c, 5.6, -5, 6, 5, 12)
    c.deco(-0.08, 12, -0.08, 0.08, 17, 0.08, 'metal')
    c.deco(0.08, 15, -0.04, 1.9, 16.8, 0.04, 'tissu_bleu'); c.deco(-1.9, 15, -0.04, -0.08, 16.8, 0.04, 'tissu_rouge')
    c.box(-1, 4, -1, 1, 5.2, 1, 'caisse')  # couverture au 1er étage
    c.box(-3.8, 8, 0.5, -2.4, 9.1, 2, 'caisse')

    m = c.marque()  # ===== moitié nord (copiée au sud en tournant) =====
    # --- Remparts (hauteur 6, chemin de ronde de 2 m) ---
    c.mur(-18, -18, 18, -16, -3, 6, PC, [(-2.5, 2.5, 0, 3.4)], 'x')           # nord (avec la porte)
    c.mur(-18, -16, -16, 0, -3, 6, PC, [], 'z')                                 # moitié du mur ouest
    c.mur(16, -16, 18, 0, -3, 6, PC, [(-9.5, -8, 0, 2.4)], 'z')                 # moitié du mur est (passage secret)
    merlons(c, -13, -18, -7, -17.6, 6); merlons(c, 7, -18, 13, -17.6, 6)
    merlons(c, -18, -12, -17.6, -1, 6); merlons(c, 17.6, -12, 18, -1, 6)
    # --- Tours d'angle (dessus à 8 m) + marches depuis le chemin de ronde ---
    for sx in (1, -1):
        c.box(sx * 14, -3, -20, sx * 20, 8, -14, PC)
        merlons(c, sx * 14, -20, sx * 20, -19.6, 8); merlons(c, sx * 19.6, -19, sx * 20, -14, 8)
        c.escalier(sx * 10, -17, 'E' if sx > 0 else 'O', 4, 2, y0=6, m=PC)
        c.escalier(sx * 17, -10, 'N', 4, 2, y0=6, m=PC)
        c.drapeau(sx * 17, -17, 'tissu_bleu', y=8, h=5)
    # --- Porte nord : châtelet (dessus à 8 m), pont-levis, herse ---
    c.box(-6, -3, -20, -2.5, 8, -15, PC); c.box(2.5, -3, -20, 6, 8, -15, PC)
    c.box(-2.5, 3.4, -20, 2.5, 8, -15, PC)
    merlons(c, -6, -20, 6, -19.6, 8)
    c.escalier(-10, -17, 'E', 4, 2, y0=6, m=PC)
    c.escalier(10, -17, 'O', 4, 2, y0=6, m=PC)
    c.box(-2.5, -0.3, -24, 2.5, 0, -20, 'planches')                              # pont-levis
    c.box(-2.5, -1.6, -20, 2.5, 0, -18, 'planches')                              # seuil : comble le trou entre le pont et la cour (on y tombait sans pouvoir ressortir)
    c.deco(-2.5, 0, -24, -2.3, 0.6, -20, 'bois'); c.deco(2.3, 0, -24, 2.5, 0.6, -20, 'bois')
    c.deco(-2.5, 2.9, -20.05, 2.5, 3.4, -19.8, 'metal')                         # herse relevée
    c.deco(-5.6, 2.5, -20.06, -3, 7, -20, 'tissu_bleu'); c.deco(3, 2.5, -20.06, 5.6, 7, -20, 'tissu_bleu')
    c.deco(-1.2, 7, -6.06, 1.2, 11, -6, 'tissu_bleu')                           # bannière sur le donjon
    # --- Escaliers pour monter sur les remparts depuis la cour ---
    c.escalier(10, -4, 'N', 12, 2, m=PC)
    c.escalier(-4, -10, 'O', 12, 2, m=PC)
    c.trampoline(13.5, -11)
    # --- Passage secret : chaussée immergée dans les douves (mur ouest, côté sud -> copiée) ---
    # (le trou dans le mur est fait plus haut ; la chaussée est sous l'eau)
    c.box(18, -3, -9.5, 24, -0.5, -8, 'pierre')
    c.buisson(25, -8.75, l=1.6, h=1.4); c.buisson(25, -10.2, l=1.2, h=1.0)
    # --- Marches pour sortir des douves ---
    c.escalier(12, -21, 'N', 3, 2, y0=-1.6)
    c.escalier(-12, -21, 'N', 3, 2, y0=-1.6)
    c.escalier(21, -12, 'E', 3, 2, y0=-1.6)
    # --- Cour : foin, charrette, étal, puits ---
    c.box(-13.5, 0, -14.5, -11.5, 1, -13.5, 'paille'); c.box(-13.5, 0, -13.4, -11.5, 1, -12.4, 'paille')
    c.box(-13, 1, -14.3, -12, 2, -12.8, 'paille')
    c.box(4, 0.5, -13, 7, 1.3, -11.5, 'planches')
    c.deco(4.2, 0, -13.1, 4.9, 0.7, -12.9, 'tronc'); c.deco(6.1, 0, -13.1, 6.8, 0.7, -12.9, 'tronc')
    c.deco(4.2, 0, -11.6, 4.9, 0.7, -11.4, 'tronc'); c.deco(6.1, 0, -11.6, 6.8, 0.7, -11.4, 'tronc')
    c.box(-4, 0, -13, 0, 1.1, -12.2, 'planches')
    c.deco(-4.1, 2.4, -13.4, 0.1, 2.6, -11.6, 'tissu_bleu')
    for (x, z) in ((-4, -13), (0, -13)):
        c.deco(x, 0, z - 0.4, x + 0.15, 2.4, z - 0.25, 'bois')
    c.box(-13, 0, -5, -11, 1, -3, 'pierre'); c.deco(-12.7, 1, -4.7, -11.3, 1.02, -3.3, 'pierre')
    c.deco(-13, 1, -5, -12.8, 2.6, -4.8, 'bois'); c.deco(-11.2, 1, -3.2, -11, 2.6, -3, 'bois')
    c.deco(-13.2, 2.6, -5.2, -10.8, 2.9, -2.8, 'toit_rouge')
    for (x, z) in ((7.5, -7.5), (-8, -7), (13, -3)):
        c.caisse(x, z, 1.2)
    c.lampadaire(-7.5, -15)
    c.lampadaire(7.5, -15)

    # --- Dehors : camp des Bleus, village, arbres, rochers ---
    for (a, b) in ((-16, -9), (-3, 3), (9, 16)):
        c.box(a, 0, -33, b, 1.2, -32.5, 'planches')
    for x in (-24, 24):
        c.deco(x - 3, 0, -40, x + 3, 0.1, -36, 'terre')
        c.box(x - 2.5, 0, -40, x + 2.5, 0.25, -36, 'planches')
        c.deco(x - 2.8, 2.6, -40.2, x + 2.8, 3.0, -35.8, 'tissu_bleu')
        for (px, pz) in ((x - 2.5, -40), (x + 2.3, -40), (x - 2.5, -36.2), (x + 2.3, -36.2)):
            c.deco(px, 0.25, pz, px + 0.2, 2.6, pz + 0.2, 'bois')
    c.drapeau(-8, -36, 'tissu_bleu', h=7); c.drapeau(6, -36, 'tissu_bleu', h=7)
    hutte(c, 30, -15, 'O'); hutte(c, 36, -6, 'O', 5, 5); hutte(c, -39, -14, 'E')
    hutte(c, 33, -28, 'S', 6, 4)
    c.box(29, 0, -20, 30.2, 1.0, -19, 'caisse'); c.box(36, 0, -24, 37.2, 1.0, -23, 'caisse')
    # clôtures des champs
    for (a, b) in ((-40, -34), (-31, -26)):
        c.box(a, 0, -22, b, 1.1, -21.8, 'planches')
    c.box(-26.2, 0, -30, -26, 1.1, -22, 'planches')
    for (x, z) in ((-36, -27), (-34, -25), (-30, -28)):
        c.box(x - 0.75, 0, z - 0.5, x + 0.75, 1, z + 0.5, 'paille')
    for (x, z) in ((-14, -27), (14, -26), (-32, -4), (40, -16), (27, -36), (-40, -30), (19, -40)):
        c.arbre(x, z, h=4)
    for (x, z, l, h) in ((-20, -27, 2.4, 1.6), (-21, -26, 1.4, 2.4), (20, -29, 2.0, 1.3), (-28, -9, 2.2, 1.5), (40, -32, 2.4, 2.0), (-5, -28, 1.6, 1.1)):
        c.box(x - l / 2, 0, z - l / 2, x + l / 2, h, z + l / 2, 'pierre')
    for (x, z) in ((-30, -32), (32, -33), (-22, -18), (26, -10)):
        c.buisson(x, z)
    # haies et bottes de foin dans le champ devant le château (couverture)
    for (a, b, z) in ((-12, -7, -29), (6, 11, -30), (-30, -25, -16)):
        c.box(a, 0, z, b, 1.2, z + 1, 'feuilles')
    for (x, z) in ((4, -26), (-9, -33.5), (17, -33.5), (-24, -30)):
        c.box(x - 0.8, 0, z - 0.6, x + 0.8, 1.1, z + 0.6, 'paille')
    for (x, z) in ((-27, -24.5), (27, -24.5)):
        c.lampadaire(x, z)
    # --- Apparitions ---
    for x in (-18, -9, 0, 9, 18):
        c.spawn(x, -41, 0, 180)
    for (x, z, y) in ((-12, -8, 0), (12.5, -1, 0), (-36, -20, 0), (38, -11.5, 0), (-17, -17, 8), (-2, 2, 4),
                      (26, -18, 0), (-34, -36, 0)):
        c.spawn(x, z, y=y)
    c.symetriser(m)
    return c


# =====================================================================
#  3. VILLE
# =====================================================================
def _local(cote, f, u0, u1, v0, v1):
    """Rectangle (u le long de la façade, v = distance devant la façade) -> (x0, z0, x1, z1)."""
    if cote == 'S':
        return (u0, f + v0, u1, f + v1)
    if cote == 'N':
        return (u0, f - v1, u1, f - v0)
    if cote == 'E':
        return (f + v0, u0, f + v1, u1)
    return (f - v1, u0, f - v0, u1)


def secours(c, cote, f, a, y0, etages, m='metal'):
    """Escalier de secours en zigzag le long d'une façade (côté, position f de la façade),
    qui part de u = a et monte de 3 m par volée. Renvoie (u_debut, u_fin) de l'arrivée sur le toit."""
    def plat(u0, u1, v0, v1, ya, yb, mat=m):
        x0, z0, x1, z1 = _local(cote, f, u0, u1, v0, v1)
        c.box(x0, ya, z0, x1, yb, z1, mat)
    y = y0
    for v in range(etages):
        if v % 2 == 0:   # volée extérieure, vers +u
            for k in range(1, 7):
                plat(a + k - 1, a + k, 1.2, 2.4, y + 0.5 * k - 0.3, y + 0.5 * k)
            y += 3
            if v < etages - 1 or etages % 2 == 1:
                plat(a + 6, a + 7.5, 0, 2.4, y - 0.3, y)            # palier
                x0, z0, x1, z1 = _local(cote, f, a + 6, a + 7.5, 2.3, 2.4)
                c.deco(x0, y, z0, x1, y + 1.0, z1, m)                # rambarde
        else:            # volée contre le mur, vers -u
            for k in range(1, 7):
                plat(a + 6 - k, a + 7 - k, 0, 1.2, y + 0.5 * k - 0.3, y + 0.5 * k)
            y += 3
            if v < etages - 1:
                plat(a - 1.5, a, 0, 2.4, y - 0.3, y)
    return (a + 5.5, a + 7.5) if etages % 2 == 1 else (a - 0.5, a + 1.5)


def fenetres_deco(c, x0, z0, x1, z1, y0, y1, pas=3.0):
    """Bandes de fenêtres sur les 4 façades d'un bloc plein (décor)."""
    y = y0 + 1.0
    while y + 1.4 <= y1 - 0.4:
        c.deco(x0 + 0.5, y, z0 - 0.04, x1 - 0.5, y + 1.4, z0, 'vitre')
        c.deco(x0 + 0.5, y, z1, x1 - 0.5, y + 1.4, z1 + 0.04, 'vitre')
        c.deco(x0 - 0.04, y, z0 + 0.5, x0, y + 1.4, z1 - 0.5, 'vitre')
        c.deco(x1, y, z0 + 0.5, x1 + 0.04, y + 1.4, z1 - 0.5, 'vitre')
        y += pas


def immeuble(c, x0, z0, x1, z1, h, m, y0=0.15, portes=None, vitrines=(), trous_toit=(), rebord=True):
    """Immeuble : rez-de-chaussée ouvert si portes est donné (sinon plein), toit plat avec rebord."""
    haut = y0 + h
    if portes is not None:
        rdc = min(h, 3.6)
        c.batiment(x0, z0, x1, z1, y0, rdc, m, portes=portes, fenetres=list(vitrines), toit=None, ep=0.4)
        c.box(x0, y0 + rdc - 0.3, z0, x1, y0 + rdc, z1, 'beton')
        if h > rdc + 0.1:
            c.box(x0, y0 + rdc, z0, x1, haut, z1, m)
            fenetres_deco(c, x0, z0, x1, z1, y0 + rdc - 0.6, haut)
    else:
        c.box(x0, y0, z0, x1, haut, z1, m)
        fenetres_deco(c, x0, z0, x1, z1, y0, haut)
    if rebord:
        c.rebord(x0, z0, x1, z1, haut, 'beton', trous_toit)
    return haut


def voiture(c, x, z, axe, couleur):
    L, W = 2.1, 0.95
    ax, az = (L, W) if axe == 'x' else (W, L)
    c.box(x - ax, 0.3, z - az, x + ax, 1.15, z + az, couleur)
    cx, cz = (1.1, 0.85) if axe == 'x' else (0.85, 1.1)
    c.box(x - cx, 1.15, z - cz, x + cx, 1.85, z + cz, couleur)
    for (dx, dz) in ((1, 1), (1, -1), (-1, 1), (-1, -1)):
        px, pz = (x + dx * (ax - 0.55), z + dz * az) if axe == 'x' else (x + dx * ax, z + dz * (az - 0.55))
        c.box(px - 0.35, 0, pz - 0.35, px + 0.35, 0.7, pz + 0.35, 'pneu')
    # vitres et phares (décor)
    if axe == 'x':
        c.deco(x - cx + 0.15, 1.25, z - cz - 0.03, x + cx - 0.15, 1.75, z + cz + 0.03, 'vitre')
        c.deco(x + ax, 0.7, z - az + 0.15, x + ax + 0.03, 0.95, z - az + 0.45, 'lampe')
        c.deco(x + ax, 0.7, z + az - 0.45, x + ax + 0.03, 0.95, z + az - 0.15, 'lampe')
    else:
        c.deco(x - cx - 0.03, 1.25, z - cz + 0.15, x + cx + 0.03, 1.75, z + cz - 0.15, 'vitre')
        c.deco(x - ax + 0.15, 0.7, z + az, x - ax + 0.45, 0.95, z + az + 0.03, 'lampe')
        c.deco(x + ax - 0.45, 0.7, z + az, x + ax - 0.15, 0.95, z + az + 0.03, 'lampe')


def ville(k=1):
    T = 42
    cid, cnom, bmax, jmax = variante('ville', 'Ville', k)
    c = Carte(cid, cnom, 'Des rues, des immeubles et des toits reliés par des ponts de planches.', T, {
        'ciel': ['#5a8fd2', '#e2e8ef'],
        'brouillard': ['#dde3ea', 55, 200],
        'soleil': {'couleur': '#fff4e0', 'intensite': 2.0, 'position': [30, 60, -22]},
        'ambiante': {'ciel': '#dde8f5', 'sol': '#6a6a66', 'intensite': 1.35},
        'nuages': True,
    }, k=k, botsMax=bmax, joueursMax=jmax)
    c.box(-T, -1, -T, T, 0, T, 'asphalte')
    c.limites(14, 'beton', invisible_dessus=False)
    # façades tout autour (bandes de fenêtres)
    for y in (1.5, 4.5, 7.5, 10.5):
        c.deco(-T, y, -T, T, y + 1.4, -T + 0.04, 'vitre'); c.deco(-T, y, T - 0.04, T, y + 1.4, T, 'vitre')
        c.deco(-T, y, -T, -T + 0.04, y + 1.4, T, 'vitre'); c.deco(T - 0.04, y, -T, T, y + 1.4, T, 'vitre')
    # trottoirs de tous les pâtés de maisons
    for (a, b) in ((-36, -18), (-10, 10), (18, 36)):
        for (d, e) in ((-36, -18), (-10, 10), (18, 36)):
            if (a, d) != (-10, -10):
                c.box(a, 0, d, b, 0.15, e, 'trottoir')
    # --- Parc central (symétrique) ---
    c.box(-10, 0, -10, 10, 0.15, 10, 'herbe')
    c.deco(-1.5, 0.15, -10, 1.5, 0.17, 10, 'pave'); c.deco(-10, 0.15, -1.5, 10, 0.17, 1.5, 'pave')
    c.box(-2.6, 0.15, -2.6, 2.6, 0.8, -2.1, 'pierre'); c.box(-2.6, 0.15, 2.1, 2.6, 0.8, 2.6, 'pierre')
    c.box(-2.6, 0.15, -2.1, -2.1, 0.8, 2.1, 'pierre'); c.box(2.1, 0.15, -2.1, 2.6, 0.8, 2.1, 'pierre')
    c.deco(-2.1, 0.15, -2.1, 2.1, 0.6, 2.1, 'neon')
    c.box(-0.5, 0.15, -0.5, 0.5, 2.4, 0.5, 'pierre'); c.deco(-0.7, 2.4, -0.7, 0.7, 2.7, 0.7, 'lampe')
    m0 = c.marque()
    for (sx, sz) in ((1, 1), (-1, 1)):
        # haies en L dans les coins du parc
        c.box(sx * 4, 0.15, -sz * 8.5, sx * 8.5, 1.2, -sz * 7.5, 'feuilles')
        c.box(sx * 7.5, 0.15, -sz * 8.5, sx * 8.5, 1.2, -sz * 4, 'feuilles')
        c.arbre(sx * 6, -sz * 6, y=0.15, h=3.5, r=1.4)
        c.box(sx * 3.5, 0.15, -sz * 5.2, sx * 5.5, 0.6, -sz * 4.6, 'planches')  # banc
        c.lampadaire(sx * 2.3, -sz * 9, y=0.15)
    c.symetriser(m0)

    m = c.marque()  # ===== moitié nord + pâté ouest (copiés en tournant) =====
    # --- Pâté nord-ouest ---
    immeuble(c, -36, -36, -28, -28, 12, 'brique', rebord=False)
    immeuble(c, -26, -36, -19, -29, 6, 'beton', trous_toit=[('S', -26, -23.5), ('E', -31.5, -30)])
    secours(c, 'S', -29, -26, 0.15, 2)
    immeuble(c, -36, -26, -28, -19, 3.5, 'brique', portes=[('E', -22.5, 1.8)],
             vitrines=[('S', -33.5, 2.4, 0.8, 2.6), ('S', -30, 2.4, 0.8, 2.6)])
    c.caisse(-26.5, -20.5, 1.4, 0.15); c.caisse(-26.5, -20.5, 1.2, 1.55); c.caisse(-25.2, -21.5, 1.2, 0.15)
    c.box(-24, 0.15, -27.6, -22, 1.5, -26.6, 'metal_bleu')     # poubelle
    # --- Pâté nord : deux immeubles reliés par un pont ---
    immeuble(c, -10, -32, -3, -20, 6, 'beton', portes=[('E', -23, 1.8)],
             vitrines=[('S', -6.5, 3, 0.8, 2.6)], trous_toit=[('N', -9.5, -7.5), ('E', -27, -25.5), ('O', -31.5, -30)])
    secours(c, 'N', -32, -9.5, 0.15, 2)
    immeuble(c, 3, -32, 10, -20, 6, 'brique', portes=[('O', -23, 1.8)],
             vitrines=[('S', 6.5, 3, 0.8, 2.6)], trous_toit=[('O', -27, -25.5)])
    c.box(-3, 5.9, -27, 3, 6.15, -25.5, 'planches')                                   # pont entre les toits
    c.deco(-3, 6.15, -27, 3, 7.0, -26.9, 'metal'); c.deco(-3, 6.15, -25.6, 3, 7.0, -25.5, 'metal')
    c.box(-19, 5.9, -31.5, -10, 6.15, -30, 'planches')                                # pont au-dessus de la rue
    c.deco(-19, 6.15, -31.5, -10, 7.0, -31.4, 'metal'); c.deco(-19, 6.15, -30.1, -10, 7.0, -30, 'metal')
    c.caisse(0, -21, 1.4, 0.15); c.caisse(-1.2, -30, 1.2, 0.15)
    # --- Pâté nord-est : parking et garage ---
    immeuble(c, 26, -36, 36, -28, 3, 'beton', trous_toit=[('S', 30, 32)])
    c.escalier(31, -22, 'N', 6, 2, y0=0.15, m='beton')
    c.deco(33.4, 3.15, -33, 33.6, 7, -32.8, 'metal'); c.deco(28, 5, -33.05, 34.5, 7.4, -32.9, 'metal_jaune')
    voiture(c, 21.5, -33, 'z', 'metal_rouge'); voiture(c, 24.5, -24, 'z', 'metal_bleu'); voiture(c, 21.5, -24, 'z', 'metal_jaune')
    for x in (20, 23, 26):
        c.deco(x - 0.05, 0.15, -27, x + 0.05, 0.17, -21, 'trottoir')
    c.box(34, 0.15, -21, 36, 2.6, -20.6, 'vitre'); c.box(34, 2.6, -22, 36, 2.8, -20.4, 'metal')   # abribus
    # --- Pâté ouest : hôtel (toit à 9 m) et boutique ---
    immeuble(c, -36, -10, -28, 0, 9, 'brique', portes=[('E', -5, 1.8)], trous_toit=[('E', -3.5, -1)])
    secours(c, 'E', -28, -9, 0.15, 3)
    immeuble(c, -36, 3, -29, 10, 3.5, 'beton', portes=[('E', 6.5, 1.8)], vitrines=[('S', -32.5, 3, 0.8, 2.6)])
    immeuble(c, -24, -8, -18.5, -2, 6, 'beton', trous_toit=[('E', -6.5, -3.5)])
    c.trampoline(-16.5, -5)
    c.caisse(-22, 5, 1.4, 0.15); c.caisse(-22, 6.4, 1.2, 0.15)
    # --- Rues : marquages, voitures, lampadaires ---
    for zc in (-14,):
        for x in range(-40, 41, 4):
            if not (-19 < x < -9 or 9 < x < 19):
                c.deco(x - 1, 0, zc - 0.1, x + 1, 0.02, zc + 0.1, 'metal_jaune')
    for xc in (-14, 14):
        for z in range(-40, 0, 4):
            if not (-19 < z < -9):
                c.deco(xc - 0.1, 0, z - 1, xc + 0.1, 0.02, z + 1, 'metal_jaune')
    for x in (-39, 39):
        for z in range(-34, 0, 4):
            c.deco(x - 0.1, 0, z - 1, x + 0.1, 0.02, z + 1, 'metal_jaune')
    for x in range(-34, 35, 4):
        c.deco(x - 1, 0, -39.1, x + 1, 0.02, -38.9, 'metal_jaune')
    for k in range(6):   # passages piétons
        c.deco(-17.4 + k * 1.2, 0, -21.5, -16.8 + k * 1.2, 0.02, -19.2, 'trottoir')
        c.deco(-9.5, 0, -17.4 + k * 1.2, -7.2, 0.02, -16.8 + k * 1.2, 'trottoir')
    voiture(c, -6, -14, 'x', 'metal_bleu'); voiture(c, 30, -12, 'x', 'metal_rouge')
    voiture(c, -12, -27, 'z', 'metal_jaune'); voiture(c, 16, -4, 'z', 'metal_rouge')
    voiture(c, -30, -39.5, 'x', 'metal_bleu')
    for (x, z) in ((-18.6, -24), (-9.4, -34), (9.4, -24), (18.6, -32), (-18.6, -2), (-36.6, -14), (24, -17.4), (-24, -17.4)):
        c.lampadaire(x, z, y=0.15)
    # --- Apparitions ---
    for x in (-24, -12, 0, 12, 24):
        c.spawn(x, -39, 0, 180, y=0)
    for (x, z, y) in ((-14, -24, 0), (14, -6, 0), (-30, -14, 0), (-6, -25, 0.15), (-22.5, -33, 6.15),
                      (6.5, -26, 6.15), (-38, -2, 0), (24, -30, 0.15), (-32, 6.5, 0.15), (-14, 2, 0)):
        c.spawn(x, z, y=y)
    c.symetriser(m)
    return c


# =====================================================================
#  4. ÎLE TROPICALE
# =====================================================================
def hauteur_ile(x, z):
    """Hauteur du terrain de l'île (par paliers de 0,5 m pour pouvoir monter sans sauter)."""
    th = math.atan2(z, x)
    rr = math.sqrt((x / 33) ** 2 + (z / 29) ** 2) + 0.06 * math.cos(2 * th + 0.5) + 0.04 * math.cos(4 * th)
    for (limite, h) in ((0.45, 2.3), (0.62, 1.8), (0.74, 1.3), (0.86, 0.8), (1.0, 0.3), (1.08, -0.2)):
        if rr <= limite:
            return h
    return None


def terrain(c, fonction, T, pas=2.0, fond=-0.7):
    """Transforme une carte de hauteurs en grands blocs (on fusionne les cases identiques)."""
    n = int(2 * T / pas)
    grille = [[fonction(-T + (i + 0.5) * pas, -T + (j + 0.5) * pas) for i in range(n)] for j in range(n)]
    pris = [[False] * n for _ in range(n)]
    for j in range(n):
        for i in range(n):
            h = grille[j][i]
            if h is None or pris[j][i]:
                continue
            # on agrandit le rectangle vers la droite puis vers le bas
            i2 = i
            while i2 + 1 < n and grille[j][i2 + 1] == h and not pris[j][i2 + 1]:
                i2 += 1
            j2 = j
            while j2 + 1 < n and all(grille[j2 + 1][k] == h and not pris[j2 + 1][k] for k in range(i, i2 + 1)):
                j2 += 1
            for jj in range(j, j2 + 1):
                for k in range(i, i2 + 1):
                    pris[jj][k] = True
            mat = 'sable' if h <= 0.8 else 'herbe'
            c.box(-T + i * pas, fond, -T + j * pas, -T + (i2 + 1) * pas, h, -T + (j2 + 1) * pas, mat)


def palmier(c, x, z, y, sens=(1, 0), h=1.6):
    dx, dz = sens
    pts = [(x, z), (x + dx * 0.3, z + dz * 0.3), (x + dx * 0.7, z + dz * 0.7)]
    for k, (px, pz) in enumerate(pts):
        c.box(px - 0.35, y + k * h, pz - 0.35, px + 0.35, y + (k + 1) * h, pz + 0.35, 'palmier')
    tx, tz = pts[-1]
    top = y + 3 * h
    c.deco(tx - 0.8, top, tz - 0.8, tx + 0.8, top + 0.5, tz + 0.8, 'feuilles_palmier')
    for (ex, ez) in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        a0, a1 = (0.8, 2.3), (2.3, 3.2)
        if ex:
            c.deco(tx + ex * a0[0], top + 0.05, tz - 0.5, tx + ex * a0[1], top + 0.35, tz + 0.5, 'feuilles_palmier')
            c.deco(tx + ex * a1[0], top - 0.45, tz - 0.4, tx + ex * a1[1], top - 0.1, tz + 0.4, 'feuilles_palmier')
        else:
            c.deco(tx - 0.5, top + 0.05, tz + ez * a0[0], tx + 0.5, top + 0.35, tz + ez * a0[1], 'feuilles_palmier')
            c.deco(tx - 0.4, top - 0.45, tz + ez * a1[0], tx + 0.4, top - 0.1, tz + ez * a1[1], 'feuilles_palmier')
    c.deco(tx - 0.45, top - 0.35, tz - 0.1, tx - 0.15, top - 0.05, tz + 0.2, 'tronc')  # noix de coco
    c.deco(tx + 0.1, top - 0.35, tz + 0.15, tx + 0.4, top - 0.05, tz + 0.45, 'tronc')


def paillote(c, x0, z0, y, l=5.0, p=4.0, porte='S'):
    cx, cz = x0 + l / 2, z0 + p / 2
    c.batiment(x0, z0, x0 + l, z0 + p, y, 2.6, 'planches', portes=[(porte, cx if porte in 'NS' else cz, 1.6)],
               fenetres=[('E' if porte in 'NS' else 'N', cz if porte in 'NS' else cx, 1.2, 1.0, 1.8),
                         ('O' if porte in 'NS' else 'S', cz if porte in 'NS' else cx, 1.2, 1.0, 1.8)],
               toit=None, vitres=False, ep=0.3)
    c.box(x0 - 0.5, y + 2.6, z0 - 0.5, x0 + l + 0.5, y + 3.0, z0 + p + 0.5, 'paille')
    c.box(x0 + 0.3, y + 3.0, z0 + 0.3, x0 + l - 0.3, y + 3.4, z0 + p - 0.3, 'paille')
    c.box(x0 + 1.0, y + 3.4, z0 + 1.0, x0 + l - 1.0, y + 3.8, z0 + p - 1.0, 'paille')


def ile(k=1):
    T = 44
    cid, cnom, bmax, jmax = variante('ile', 'Île tropicale', k)
    c = Carte(cid, cnom, 'Une île au soleil : plages, palmiers, cabanes sur pilotis et une grotte sous la colline.', T, {
        'ciel': ['#1d86de', '#c4f1ff'],
        'brouillard': ['#c4f1ff', 85, 280],
        'soleil': {'couleur': '#fffbe8', 'intensite': 2.4, 'position': [22, 70, 30]},
        'ambiante': {'ciel': '#d6f4ff', 'sol': '#cbb37c', 'intensite': 1.45},
        'nuages': True,
    }, eau={'niveau': 0.0, 'couleur': '#21b8c9'}, k=k, botsMax=bmax, joueursMax=jmax)
    c.box(-T, -3, -T, T, -0.7, T, 'sable')               # fond de la mer
    c.limites(m='invisible')
    for (a, b, d, e) in ((-200, -200, 200, -T), (-200, T, 200, 200), (-200, -T, -T, T), (T, -T, 200, T)):
        c.deco(a, -4, b, d, -2.4, e, 'sable')
    terrain(c, hauteur_ile, T)
    sol = lambda x, z, m=12: c.sol(x, z, m)

    # --- Colline centrale avec une grotte (tunnel nord-sud) ---
    for (x0, z0, x1, z1, ya, yb, mat) in ((-10, -8, 10, 8, 2.3, 3.6, 'pierre'), (-8.5, -7, 8.5, 7, 3.6, 4.9, 'pierre')):
        c.box(x0, ya, z0, -1.5, yb, z1, mat); c.box(1.5, ya, z0, x1, yb, z1, mat)
        c.deco(x0, yb, z0, -1.5, yb + 0.02, z1, 'herbe'); c.deco(1.5, yb, z0, x1, yb + 0.02, z1, 'herbe')
    c.box(-7, 4.9, -6, 7, 6.2, 6, 'herbe')
    c.box(-5, 6.2, -4.5, 5, 7.5, 4.5, 'herbe')
    c.box(-2.5, 7.5, -2, 2.5, 8.8, 2, 'pierre')
    for z in (-4, 0, 4):
        c.deco(-1.5, 3.6, z - 0.15, -1.35, 4.1, z + 0.15, 'lampe'); c.deco(1.35, 3.6, z - 0.15, 1.5, 4.1, z + 0.15, 'lampe')
    c.deco(-0.08, 8.8, -0.08, 0.08, 13, 0.08, 'tronc'); c.deco(0.08, 11.3, -0.04, 1.9, 12.8, 0.04, 'tissu_bleu')
    c.deco(-1.9, 11.3, -0.04, -0.08, 12.8, 0.04, 'tissu_rouge')

    m = c.marque()  # ===== moitié nord (copiée au sud en tournant) =====
    # --- Cabane sur pilotis à l'est + ponton ---
    x0, z0 = 33, -18
    for (px, pz) in ((x0, z0), (x0 + 7.6, z0), (x0, z0 + 6.6), (x0 + 7.6, z0 + 6.6), (x0 + 3.8, z0), (x0 + 3.8, z0 + 6.6)):
        c.box(px, -0.7, pz, px + 0.4, 1.5, pz + 0.4, 'tronc')
    c.box(x0, 1.5, z0, x0 + 8, 1.8, z0 + 7, 'planches')
    paillote(c, x0 + 1.5, z0 + 1.5, 1.8, 5, 4, 'O')
    c.box(x0 + 7.8, 1.8, z0, x0 + 8, 2.7, z0 + 7, 'planches')
    c.box(24, 0.5, z0 + 2.75, x0 - 2, 0.8, z0 + 4.25, 'planches')                     # ponton (dessus 0,8)
    c.escalier(x0 - 2, z0 + 3.5, 'E', 2, 1.5, y0=0.8, m='planches', plein=False)
    for xx in range(24, int(x0) - 1, 3):
        c.box(xx, -0.7, z0 + 2.6, xx + 0.3, 0.5, z0 + 2.9, 'tronc')
    c.caisse(x0 + 6.5, z0 + 6, 1.0, 1.8)
    # --- Petit ponton et barque au nord (base des Bleus) ---
    c.box(-3, 0, -36, 3, 0.3, -27, 'planches')
    for (px, pz) in ((-3, -35), (2.7, -35), (-3, -31), (2.7, -31)):
        c.box(px, -0.7, pz, px + 0.3, 0, pz + 0.3, 'tronc')
    c.box(5, -0.4, -34, 6.6, 0.4, -29, 'bois'); c.box(5.2, 0.4, -33.8, 6.4, 0.6, -29.2, 'planches')
    # --- Tour de guet en bois (dessus à +4 m) ---
    gx, gz = -20, -12
    gy = sol(gx, gz)
    for (px, pz) in ((gx, gz), (gx + 3.6, gz), (gx, gz + 3.6), (gx + 3.6, gz + 3.6)):
        c.box(px, gy, pz, px + 0.4, gy + 4, pz + 0.4, 'tronc')
    c.box(gx, gy + 4, gz, gx + 4, gy + 4.3, gz + 4, 'planches')
    c.box(gx, gy + 4.3, gz, gx + 4, gy + 5.1, gz + 0.2, 'planches'); c.box(gx, gy + 4.3, gz + 3.8, gx + 4, gy + 5.1, gz + 4, 'planches')
    c.box(gx, gy + 4.3, gz + 0.2, gx + 0.2, gy + 5.1, gz + 3.8, 'planches')
    c.escalier(gx + 12, gz + 2, 'O', 8, 1.6, y0=gy, m='planches', plein=False, h=0.5)
    c.deco(gx - 0.3, gy + 7, gz - 0.3, gx + 4.3, gy + 7.4, gz + 4.3, 'paille')
    for (px, pz) in ((gx, gz), (gx + 3.8, gz), (gx, gz + 3.8), (gx + 3.8, gz + 3.8)):
        c.deco(px, gy + 5.1, pz, px + 0.2, gy + 7, pz + 0.2, 'tronc')
    # --- Paillotes sur l'île ---
    paillote(c, 8, -19, sol(10.5, -17), 5, 4, 'S')
    paillote(c, -27, -2, sol(-24.5, 0), 4.5, 4, 'E')
    # --- Palmiers, rochers, caisses ---
    for (x, z, sens) in ((-12, -21, (1, 0)), (14, -11, (0, -1)), (-27, -9, (1, 0)), (22, -2, (-1, 0)), (-6, -14, (0, 1)),
                         (25, -15, (0, 1)), (-16, -2, (1, 0)), (4, -24, (0, -1))):
        palmier(c, x, z, sol(x, z), sens)
    for (x, z, l, h) in ((-9, -24, 2.2, 1.4), (-8, -25.2, 1.2, 2.0), (12, -24, 2.0, 1.2), (-22, -18, 2.4, 1.6),
                         (28, -6, 1.8, 1.3), (17, -7, 1.6, 1.1), (-30, -14, 2.0, 1.4)):
        y = sol(x, z)
        c.box(x - l / 2, y - 0.3, z - l / 2, x + l / 2, y + h, z + l / 2, 'pierre')
    for (x, z) in ((7, -15.5), (-3, -18), (19, -18), (-24, -6)):
        c.caisse(x, z, 1.2, sol(x, z))
    # --- Îlots de sable avec palmier (dans la mer, pour se cacher) ---
    for (x, z) in ((38, -36), (-30, -37)):
        c.box(x - 3, -0.7, z - 2.5, x + 3, 0.3, z + 2.5, 'sable')
        palmier(c, x, z, 0.3, (0, 1))
        c.box(x + 1, 0.3, z - 1.5, x + 2.6, 1.4, z - 0.3, 'pierre')
    # --- Apparitions ---
    for x in (-16, -8, 0, 8, 16):
        z = -22 if abs(x) > 4 else -24
        c.spawn(x, z, 0, 180, y=sol(x, z))
    for (x, z, y) in ((0, -4, None), (37, -11.6, 1.8), (-20, -6, None), (14, -5, None), (-34, -24, None), (30, -24, None),
                      (0, -33, 0.3), (-26, 8, None)):
        c.spawn(x, z, y=sol(x, z) if y is None else y)
    c.symetriser(m)
    return c


# Chaque carte existe en version normale et en version XXL (plus grande, plus de bots et de joueurs).
CARTES = {}
for _nom, _f in (('arene', arene), ('chateau', chateau), ('ville', ville), ('ile', ile)):
    CARTES[_nom] = _f
    CARTES[_nom + '_xxl'] = (lambda f=_f: f(k=2))


def main():
    choix = sys.argv[1:] or list(CARTES)
    ok = True
    for nom in choix:
        c = CARTES[nom]()
        print(f'===== {c.nom} ({c.id}) : {len(c.b)} boîtes, {len(c.d)} décors, {len(c.s)} apparitions =====')
        print(c.plan())
        err = c.verifier()
        for e in err:
            print('  ERREUR :', e)
        if err:
            ok = False
            continue
        with open(os.path.join(DOSSIER, c.id + '.json'), 'w') as f:
            f.write(c.json())
        print(f'  -> enregistré dans cartes/{c.id}.json')
    if not ok:
        sys.exit(1)


if __name__ == '__main__':
    main()
