#!/usr/bin/env python3
# Générateur des cartes de Caméléon (cache-cache). Elles sont faites pour se cacher : des meubles et des
# objets de toutes les couleurs, des motifs (rayures, damiers, pois, tissus), plein de recoins.
#
# Pour tout régénérer (depuis le dossier du projet) :
#     python3 games/cameleon/outils/cartes.py
# Puis redémarre le site : sudo docker compose restart
#
# Repères : x vers l'est, z vers le sud, y vers le haut (en mètres, le sol est à 0).
# Une boîte = [x1, y1, z1, x2, y2, z2, matière]. Matières : celles d'Arena FPS (bois, herbe, metal_rouge...)
# ou une couleur '#rrggbb', ou un motif 'raye:#aaaaaa:#bbbbbb' / 'damier:…' / 'pois:…' / 'tissu:…'.
import json
import os
import re
import sys

DOSSIER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'cartes')
NOMMEES = {
    'herbe', 'terre', 'sable', 'pierre', 'pave', 'pierre_chateau', 'brique', 'beton', 'asphalte',
    'trottoir', 'bois', 'planches', 'caisse', 'tronc', 'palmier', 'feuilles', 'feuilles_palmier',
    'paille', 'toit_rouge', 'toit_ardoise', 'metal', 'metal_rouge', 'metal_bleu', 'metal_jaune',
    'pneu', 'vitre', 'lampe', 'tissu_bleu', 'tissu_rouge', 'neon', 'neon_rouge', 'invisible',
}
COULEUR = re.compile(r'^(?:#[0-9a-f]{6}|(?:raye|damier|pois|tissu):#[0-9a-f]{6}:#[0-9a-f]{6})$')
LARGEUR, HAUTEUR = 0.3, 1.8
AIDE = ("Carte de Caméléon (fabriquée par games/cameleon/outils/cartes.py : modifie plutôt ce script). "
        "taille = demi-côté de la zone de jeu. boites = blocs solides [x1, y1, z1, x2, y2, z2, matière] ; "
        "decors = blocs sans collision ; apparitions : role 'cacheur' ou 'chercheur', angle en degrés.")


def r3(v):
    return round(v + 0.0, 3)


class Carte:
    def __init__(self, id, nom, description, taille, ambiance):
        self.id, self.nom, self.description, self.taille, self.ambiance = id, nom, description, taille, ambiance
        self.b, self.d, self.s, self.c = [], [], [], []

    def _boite(self, x0, y0, z0, x1, y1, z1, m):
        assert m in NOMMEES or COULEUR.match(m), m
        b = [r3(min(x0, x1)), r3(min(y0, y1)), r3(min(z0, z1)), r3(max(x0, x1)), r3(max(y0, y1)), r3(max(z0, z1)), m]
        assert b[0] < b[3] and b[1] < b[4] and b[2] < b[5], ('boîte vide', b)
        return b

    def box(self, *a):
        self.b.append(self._boite(*a))

    def deco(self, *a):
        self.d.append(self._boite(*a))

    def spawn(self, x, z, angle=0, role='cacheur', y=0.0):
        self.s.append({'x': r3(x), 'y': r3(y), 'z': r3(z), 'angle': angle, 'role': role})

    def cachette(self, x, z, y=0.0):
        self.c.append([r3(x), r3(y), r3(z)])

    # ---------- Objets ----------
    def mur(self, x0, z0, x1, z1, m, h=3.0, ep=0.3, portes=()):
        # mur droit (le long de x si z0 == z1, sinon le long de z) avec des portes (début, fin) le long du mur
        horiz = abs(z1 - z0) < 1e-6
        a0, a1 = (min(x0, x1), max(x0, x1)) if horiz else (min(z0, z1), max(z0, z1))
        coupes = sorted(portes)
        pos = a0
        morceaux = []
        for p0, p1 in coupes:
            if p0 > pos:
                morceaux.append((pos, p0))
            pos = max(pos, p1)
            # linteau au-dessus de la porte
            if h > 2.4:
                morceaux.append((p0, p1, 2.4))
        if pos < a1:
            morceaux.append((pos, a1))
        for mo in morceaux:
            ya = mo[2] if len(mo) == 3 else 0
            if horiz:
                self.box(mo[0], ya, z0 - ep / 2, mo[1], h, z0 + ep / 2, m)
            else:
                self.box(x0 - ep / 2, ya, mo[0], x0 + ep / 2, h, mo[1], m)

    def sol(self, x0, z0, x1, z1, m, y=0.02):
        self.box(x0, -0.3, z0, x1, y, z1, m)

    def tapis(self, x0, z0, x1, z1, m):
        self.deco(x0, 0.03, z0, x1, 0.05, z1, m)

    def table(self, x0, z0, x1, z1, h, m, pieds=None):
        e = 0.08
        self.box(x0, h - 0.06, z0, x1, h, z1, m)
        pm = pieds or m
        for (x, z) in ((x0, z0), (x1 - e, z0), (x0, z1 - e), (x1 - e, z1 - e)):
            self.box(x, 0, z, x + e, h - 0.06, z + e, pm)

    def chaise(self, x, z, m, dos='N'):
        self.table(x - 0.22, z - 0.22, x + 0.22, z + 0.22, 0.45, m)
        dx, dz = {'N': (0, -1), 'S': (0, 1), 'E': (1, 0), 'O': (-1, 0)}[dos]
        if dz:
            zz = z + dz * 0.2
            self.box(x - 0.22, 0.45, min(zz, zz + dz * 0.06), x + 0.22, 1.0, max(zz, zz + dz * 0.06), m)
        else:
            xx = x + dx * 0.2
            self.box(min(xx, xx + dx * 0.06), 0.45, z - 0.22, max(xx, xx + dx * 0.06), 1.0, z + 0.22, m)

    def canape(self, x0, z0, x1, z1, dos, m, coussins=None):
        # dos = côté du dossier (N, S, E, O)
        self.box(x0, 0, z0, x1, 0.45, z1, m)
        t = 0.3
        if dos == 'N':
            self.box(x0, 0.45, z0, x1, 1.0, z0 + t, m); bras = ((x0, z0, x0 + t, z1), (x1 - t, z0, x1, z1))
        elif dos == 'S':
            self.box(x0, 0.45, z1 - t, x1, 1.0, z1, m); bras = ((x0, z0, x0 + t, z1), (x1 - t, z0, x1, z1))
        elif dos == 'O':
            self.box(x0, 0.45, z0, x0 + t, 1.0, z1, m); bras = ((x0, z0, x1, z0 + t), (x0, z1 - t, x1, z1))
        else:
            self.box(x1 - t, 0.45, z0, x1, 1.0, z1, m); bras = ((x0, z0, x1, z0 + t), (x0, z1 - t, x1, z1))
        for (a, b, c, d) in bras:
            self.box(a, 0.45, b, c, 0.7, d, m)
        if coussins:
            self.deco(x0 + 0.35, 0.45, z0 + 0.35, x1 - 0.35, 0.55, z1 - 0.35, coussins)

    def etagere(self, x0, z0, x1, z1, h, m, niveaux=4, objets=()):
        # côtés + planches ; des objets colorés posés sur les planches (decors)
        ep = 0.05
        horiz = (x1 - x0) >= (z1 - z0)
        if horiz:
            self.box(x0, 0, z0, x0 + ep, h, z1, m); self.box(x1 - ep, 0, z0, x1, h, z1, m)
        else:
            self.box(x0, 0, z0, x1, h, z0 + ep, m); self.box(x0, 0, z1 - ep, x1, h, z1, m)
        for i in range(niveaux + 1):
            y = i * (h - ep) / niveaux
            self.box(x0, y, z0, x1, y + ep, z1, m)
            if objets and i < niveaux:
                n = 4
                for k in range(n):
                    c = objets[(i * n + k) % len(objets)]
                    if horiz:
                        a = x0 + ep + (x1 - x0 - 2 * ep) * k / n
                        self.deco(a + 0.03, y + ep, z0 + 0.04, a + (x1 - x0 - 2 * ep) / n - 0.03, y + ep + (h / niveaux) * 0.7, z1 - 0.04, c)
                    else:
                        a = z0 + ep + (z1 - z0 - 2 * ep) * k / n
                        self.deco(x0 + 0.04, y + ep, a + 0.03, x1 - 0.04, y + ep + (h / niveaux) * 0.7, a + (z1 - z0 - 2 * ep) / n - 0.03, c)

    def plante(self, x, z, pot='#d35400', h=1.2):
        self.box(x - 0.25, 0, z - 0.25, x + 0.25, 0.45, z + 0.25, pot)
        self.box(x - 0.4, 0.45, z - 0.4, x + 0.4, h, z + 0.4, 'feuilles')

    def arbre(self, x, z, h=4.5, r=1.6):
        self.box(x - 0.3, 0, z - 0.3, x + 0.3, h - 1.2, z + 0.3, 'tronc')
        self.box(x - r, h - 2.2, z - r, x + r, h, z + r, 'feuilles')
        self.box(x - r * 0.6, h, z - r * 0.6, x + r * 0.6, h + 0.8, z + r * 0.6, 'feuilles')

    def buisson(self, x, z, s=0.9, m='feuilles'):
        self.box(x - s / 2, 0, z - s / 2, x + s / 2, s, z + s / 2, m)

    def voiture(self, x, z, couleur, axe='x'):
        # 4 m de long, 1,8 m de large
        L, W = (2.0, 0.9) if axe == 'x' else (0.9, 2.0)
        self.box(x - L, 0.35, z - W, x + L, 1.05, z + W, couleur)
        if axe == 'x':
            self.box(x - 1.0, 1.05, z - W + 0.1, x + 0.9, 1.65, z + W - 0.1, couleur)
            self.deco(x - 0.95, 1.1, z - W + 0.08, x + 0.85, 1.6, z + W - 0.08, 'vitre')
            roues = [(x - 1.3, z - W), (x + 1.3, z - W), (x - 1.3, z + W - 0.25), (x + 1.3, z + W - 0.25)]
            for (a, b) in roues:
                self.box(a - 0.35, 0, b, a + 0.35, 0.7, b + 0.25, 'pneu')
        else:
            self.box(x - W + 0.1, 1.05, z - 1.0, x + W - 0.1, 1.65, z + 0.9, couleur)
            self.deco(x - W + 0.08, 1.1, z - 0.95, x + W - 0.08, 1.6, z + 0.85, 'vitre')
            roues = [(x - W, z - 1.3), (x - W, z + 1.3), (x + W - 0.25, z - 1.3), (x + W - 0.25, z + 1.3)]
            for (a, b) in roues:
                self.box(a, 0, b - 0.35, a + 0.25, 0.7, b + 0.35, 'pneu')

    def caisse(self, x, z, s=1.0, m='caisse', y=0.0):
        self.box(x - s / 2, y, z - s / 2, x + s / 2, y + s, z + s / 2, m)

    def tonneau(self, x, z, m, h=1.1):
        self.box(x - 0.35, 0, z - 0.35, x + 0.35, h, z + 0.35, m)
        self.deco(x - 0.37, h * 0.25, z - 0.37, x + 0.37, h * 0.3, z + 0.37, '#2d3436')
        self.deco(x - 0.37, h * 0.7, z - 0.37, x + 0.37, h * 0.75, z + 0.37, '#2d3436')

    def bords(self):
        T = self.taille
        for (a, b, c, d) in ((-T - 1, -T - 1, T + 1, -T), (-T - 1, T, T + 1, T + 1), (-T - 1, -T, -T, T), (T, -T, T + 1, T)):
            self.box(a, 0, b, c, 12, d, 'invisible')

    # ---------- Vérifications ----------
    def libre(self, x, y, z):
        for b in self.b:
            if b[6] == 'vitre':
                pass
            if x - LARGEUR < b[3] and x + LARGEUR > b[0] and y + 0.05 < b[4] and y + HAUTEUR > b[1] and z - LARGEUR < b[5] and z + LARGEUR > b[2]:
                return b
        return None

    # Un point dans un bloc est poussé vers la place libre la plus proche (à moins de 2 m), sinon on le dit.
    # Hauteur du sol sous (x, z) : on peut se tenir sur un bloc bas (bac à sable, tapis de sol...)
    def hauteur_sol(self, x, z):
        # la surface libre la plus basse : le sol, ou le dessus d'un bloc (quai, bac à sable...)
        hauteurs = sorted({0.0} | {b[4] for b in self.b if x - LARGEUR < b[3] and x + LARGEUR > b[0] and z - LARGEUR < b[5] and z + LARGEUR > b[2] and b[6] != 'invisible'})
        for h in hauteurs:
            if not self.libre(x, h, z):
                return h
        return 0.0

    def degager(self, x, y, z):
        if not self.libre(x, y, z):
            return x, z
        for r in (0.3, 0.6, 0.9, 1.2, 1.6, 2.0):
            for k in range(16):
                import math
                a = k * math.pi / 8
                nx, nz = x + math.cos(a) * r, z + math.sin(a) * r
                if not self.libre(nx, y, nz) and abs(nx) < self.taille - 0.5 and abs(nz) < self.taille - 0.5:
                    return r3(nx), r3(nz)
        return None

    def verifier(self):
        T = self.taille
        for s in self.s:
            assert abs(s['x']) < T - 0.5 and abs(s['z']) < T - 0.5, ('apparition hors carte', s)
            s['y'] = r3(self.hauteur_sol(s['x'], s['z']))
            p = self.degager(s['x'], s['y'], s['z'])
            assert p, ('apparition dans un bloc', s, self.libre(s['x'], s['y'], s['z']))
            s['x'], s['z'] = p
        garde = []
        for c in self.c:
            c[1] = r3(self.hauteur_sol(c[0], c[2]))
            p = self.degager(c[0], c[1], c[2])
            if p:
                garde.append([p[0], c[1], p[1]])
            else:
                print('  cachette enlevée (dans un bloc) :', c)
        self.c = garde
        assert any(s['role'] == 'chercheur' for s in self.s)
        assert sum(1 for s in self.s if s['role'] == 'cacheur') >= 10
        assert len(self.b) + len(self.d) < 2500

    def json(self):
        return {
            '_aide': AIDE, 'id': self.id, 'nom': self.nom, 'description': self.description, 'taille': self.taille,
            'ambiance': self.ambiance, 'boites': self.b, 'decors': self.d, 'apparitions': self.s, 'cachettes': self.c,
        }


JOUR = {
    'ciel': ['#4f9be8', '#d9efff'], 'brouillard': ['#d9efff', 60, 180],
    'soleil': {'couleur': '#fff3dc', 'intensite': 2.0, 'position': [24, 60, 14]},
    'ambiante': {'ciel': '#e8f4ff', 'sol': '#8a7a5a', 'intensite': 1.55}, 'nuages': True,
}

# Couleurs vives pour les objets
COUL = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db', '#9b59b6', '#e84393', '#fd79a8', '#00cec9',
        '#6c5ce7', '#fdcb6e', '#55efc4', '#ff7675', '#74b9ff', '#a29bfe', '#fab1a0', '#81ecec', '#ffeaa7', '#2d3436']


# =====================================================================================================
# 1. LA MAISON : salon, cuisine, couloir, chambre, salle de bain, garage, et le jardin tout autour
# =====================================================================================================
def maison():
    c = Carte('maison', 'Maison', "Une grande maison pleine de meubles : salon, cuisine, chambre, salle de bain, garage et jardin.", 27, JOUR)
    c.box(-27, -1, -27, 27, 0, 27, 'herbe')
    # allée et terrasse
    c.sol(-3, 12, 1, 25, 'pave')
    c.sol(-12, -18, 6, -12.2, 'planches')
    # ----- murs extérieurs (x -18 → 18, z -12 → 12) -----
    ext = 'raye:#f5e6c8:#ead2a4'
    c.mur(-18, -12, 18, -12, ext, portes=[(-2.6, -1)])           # nord (porte de derrière)
    c.mur(-18, 12, 18, 12, ext, portes=[(-2.6, -1), (11, 17)])   # sud (porte d'entrée, porte du garage)
    c.mur(-18, -12, -18, 12, ext)
    c.mur(18, -12, 18, 12, ext)
    # ----- murs intérieurs -----
    c.mur(-4, -12, -4, 12, 'raye:#dff9fb:#c7ecee', portes=[(-6.4, -4.6), (5.6, 7.4)])      # salon / cuisine | couloir
    c.mur(-18, 2, -4, 2, 'raye:#ffeaa7:#fdcb6e', portes=[(-12.4, -10.6)])                    # salon | cuisine
    c.mur(2, -12, 2, 12, 'raye:#e0d4ff:#cbbdfa', portes=[(-7.4, -5.6), (4.6, 6.4)])          # couloir | chambre, salle de bain
    c.mur(2, 0, 18, 0, 'damier:#ffffff:#dfe6e9', portes=[(12.6, 14.4)])                      # chambre | salle de bain, garage
    c.mur(10, 0, 10, 12, 'beton')                                                             # salle de bain | garage
    # ----- sols -----
    c.sol(-17.85, -11.85, -4.15, 1.85, 'planches')                   # salon
    c.sol(-17.85, 2.15, -4.15, 11.85, 'damier:#ffffff:#2d3436')      # cuisine
    c.sol(-3.85, -11.85, 1.85, 11.85, 'tissu:#6c5ce7:#8c7ae6')       # couloir
    c.sol(2.15, -11.85, 17.85, -0.15, 'tissu:#81ecec:#74b9ff')       # chambre
    c.sol(2.15, 0.15, 9.85, 11.85, 'damier:#74b9ff:#ffffff')         # salle de bain
    c.sol(10.15, 0.15, 17.85, 11.85, 'beton')                        # garage

    # ----- SALON (x -18 → -4, z -12 → 2) -----
    c.canape(-16, -11.8, -10, -10.2, 'N', '#c0392b', 'pois:#f6e58d:#c0392b')
    c.canape(-17.8, -9.6, -16.4, -5.6, 'O', '#c0392b')
    c.tapis(-15.6, -9.8, -9.6, -5.2, 'pois:#2e86de:#f6e58d')
    c.table(-14.2, -8.6, -11.8, -7.2, 0.45, '#8e5a2b')
    c.box(-15.2, 0, -3.2, -10.8, 0.55, -2.4, '#2d3436')              # meuble télé
    c.box(-14.6, 0.55, -2.9, -11.4, 1.75, -2.75, '#111111')          # télé
    c.etagere(-17.8, -4.6, -17.3, 1.4, 2.2, '#a0522d', 4, ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22'])
    c.box(-8.4, 0, -11.6, -6.9, 0.45, -10.1, '#27ae60'); c.box(-8.4, 0.45, -11.6, -6.9, 1.0, -11.3, '#27ae60')   # fauteuil vert
    c.box(-6.6, 0, -1.6, -4.4, 1.15, -0.4, '#222222')                # piano
    c.box(-6.4, 0, -0.35, -4.6, 0.5, 0.0, '#222222')
    c.plante(-17.2, 1.2); c.plante(-4.8, -11.2, '#6c5ce7'); c.plante(-9.4, 1.2, '#00cec9', 1.6)
    c.box(-9.5, 0, -5.4, -8.2, 0.7, -4.2, 'caisse')                  # coffre à jouets
    c.box(-8.0, 0, -7.6, -6.8, 0.6, -6.4, '#fd79a8')                 # pouf rose
    c.deco(-17.95, 1.2, -9, -17.9, 2.2, -7, 'raye:#fdcb6e:#e17055')  # tableau
    c.deco(-12, 1.3, -11.85, -9.5, 2.3, -11.8, 'damier:#55efc4:#ffeaa7')
    # ----- CUISINE (x -18 → -4, z 2 → 12) -----
    c.box(-17.85, 0, 2.6, -17.0, 0.9, 9.0, '#ffffff')                # placards bas
    c.box(-17.9, 0.9, 2.6, -16.95, 0.96, 9.0, 'pierre')              # plan de travail
    c.box(-17.85, 1.6, 2.6, -17.4, 2.4, 9.0, '#ffffff')              # placards hauts
    c.box(-17.85, 0, 9.4, -16.9, 2.1, 11.7, '#dfe6e9')               # frigo
    c.box(-16.6, 0, 11.0, -12, 0.9, 11.85, '#e17055')                # placards sud
    c.box(-16.6, 0.9, 10.95, -12, 0.96, 11.85, 'pierre')
    c.box(-11.6, 0, 11.1, -10.4, 0.9, 11.85, '#2d3436')              # four
    c.table(-12.2, 5.6, -9.2, 7.8, 0.78, '#d35400')
    for (x, z, d) in ((-11.6, 5.1, 'N'), (-9.8, 5.1, 'N'), (-11.6, 8.3, 'S'), (-9.8, 8.3, 'S'), (-12.7, 6.7, 'O'), (-8.7, 6.7, 'E')):
        c.chaise(x, z, '#f39c12', d)
    c.box(-7.2, 0, 4.5, -5.4, 0.95, 7.5, '#0984e3')                  # îlot bleu
    c.box(-7.3, 0.95, 4.4, -5.3, 1.0, 7.6, 'pierre')
    c.box(-4.9, 0, 10.4, -4.3, 1.1, 11.6, '#2ecc71')                 # poubelle
    c.plante(-4.8, 2.8, '#e84393')
    c.deco(-12, 1.4, 2.16, -10, 2.2, 2.2, 'damier:#ff7675:#ffffff')
    # ----- COULOIR (x -4 → 2) -----
    c.box(-3.8, 0, -1.0, -3.3, 1.9, 1.0, '#8e5a2b')                  # porte-manteau
    c.deco(-3.85, 1.2, -0.9, -3.0, 1.8, -0.2, 'tissu_rouge'); c.deco(-3.85, 1.1, 0.2, -3.0, 1.8, 0.9, 'tissu_bleu')
    c.box(1.2, 0, 8.6, 1.85, 0.9, 11.0, '#6c5ce7')                   # meuble à chaussures
    c.box(-3.7, 0, -9.0, -3.1, 1.0, -8.4, '#00cec9')                 # porte-parapluies
    c.plante(1.3, -11.2, '#fdcb6e', 1.5)
    c.box(1.2, 0, -3.0, 1.85, 1.6, -1.6, '#fab1a0')                  # commode
    c.deco(-3.95, 1.2, 3, -3.9, 2.2, 5, 'pois:#a29bfe:#ffffff')
    # ----- CHAMBRE (x 2 → 18, z -12 → 0) -----
    c.box(12.4, 0, -11.85, 16.6, 0.55, -8.6, '#ffffff')               # lit
    c.deco(12.5, 0.55, -11.0, 16.5, 0.7, -8.6, 'raye:#fd79a8:#ffffff')  # couette
    c.box(12.6, 0.55, -11.8, 16.4, 0.8, -11.2, '#ffeaa7')             # oreiller
    c.box(12.2, 0, -11.95, 16.8, 1.3, -11.85, '#a0522d')              # tête de lit
    c.box(17.2, 0, -7.4, 17.85, 2.3, -4.0, '#6c5ce7')                 # armoire
    c.table(3.0, -11.8, 6.0, -10.6, 0.76, '#ffffff', '#b2bec3')       # bureau
    c.chaise(4.5, -9.9, '#e84393', 'S')
    c.box(3.0, 0.76, -11.75, 3.6, 1.2, -11.2, '#2d3436')              # lampe de bureau
    c.box(7.0, 0, -11.8, 9.0, 0.7, -10.9, '#e17055')                  # coffre
    c.box(9.6, 0, -4.4, 10.9, 0.65, -3.1, '#fdcb6e')                  # pouf poire
    c.tapis(7.5, -7.5, 11.5, -3.5, 'pois:#ffeaa7:#e84393')
    c.etagere(2.2, -5.2, 2.7, -1.2, 1.8, '#ffffff', 3, ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe'])
    c.box(15.6, 0, -2.0, 17.8, 1.0, -0.2, '#00b894')                  # bac à jouets
    c.box(6.2, 0, -1.4, 7.8, 0.9, -0.2, '#0984e3')                    # table de nuit / caisse bleue
    c.deco(17.95, 1.2, -11, 17.9, 2.2, -9, 'damier:#6c5ce7:#ffeaa7')
    # ----- SALLE DE BAIN (x 2 → 10, z 0 → 12) -----
    c.box(6.8, 0, 8.6, 9.85, 0.6, 11.85, '#ffffff')                   # baignoire
    c.deco(7.0, 0.5, 8.8, 9.65, 0.55, 11.65, '#74b9ff')
    c.box(2.2, 0, 0.6, 3.2, 0.85, 1.8, '#ffffff')                     # lavabo
    c.box(2.15, 1.2, 0.6, 2.25, 2.0, 1.8, 'vitre')                    # miroir
    c.box(3.6, 0, 11.0, 4.4, 0.45, 11.85, '#ffffff'); c.box(3.6, 0.45, 11.5, 4.4, 1.0, 11.85, '#ffffff')  # toilettes
    c.box(8.6, 0, 0.3, 9.85, 1.8, 1.2, '#fab1a0')                     # meuble
    c.deco(2.16, 1.0, 4.0, 2.2, 1.9, 4.6, 'raye:#55efc4:#ffffff')      # serviettes
    c.box(5.0, 0, 5.2, 6.0, 0.5, 6.2, '#55efc4')                      # panier à linge
    # ----- GARAGE (x 10 → 18, z 0 → 12) -----
    c.voiture(14, 6.5, 'metal_rouge', 'z')
    c.etagere(10.2, 0.4, 10.8, 4.8, 2.4, 'metal_bleu', 3, ['caisse', '#e17055', '#fdcb6e', '#00cec9', '#2d3436'])
    c.box(16.8, 0, 0.3, 17.85, 0.95, 3.0, 'bois')                     # établi
    c.box(16.8, 0.95, 0.3, 17.85, 2.0, 0.4, 'metal')
    for i in range(3):
        c.box(10.3, i * 0.3, 10.2, 11.3, i * 0.3 + 0.3, 11.2, 'pneu')
    c.caisse(11.0, 8.2, 0.9); c.caisse(11.0, 7.2, 0.8, '#e74c3c')
    c.tonneau(17.3, 10.6, '#0984e3')
    # ----- JARDIN -----
    for x in range(-26, 27, 2):
        c.box(x - 0.08, 0, -26.1, x + 0.08, 1.2, -25.9, 'bois'); c.box(x - 0.08, 0, 25.9, x + 0.08, 1.2, 26.1, 'bois')
    c.box(-26, 0.8, -26.05, 26, 1.0, -25.95, 'bois'); c.box(-26, 0.8, 25.95, 26, 1.0, 26.05, 'bois')
    for z in range(-26, 27, 2):
        c.box(-26.1, 0, z - 0.08, -25.9, 1.2, z + 0.08, 'bois'); c.box(25.9, 0, z - 0.08, 26.1, 1.2, z + 0.08, 'bois')
    c.box(-26.05, 0.8, -26, -25.95, 1.0, 26, 'bois'); c.box(25.95, 0.8, -26, 26.05, 1.0, 26, 'bois')
    for (x, z) in ((-22, -20), (21, -21), (-22, 19), (22, 20), (-8, -22), (12, -22)):
        c.arbre(x, z)
    for (x, z, m) in ((-20, -14, 'feuilles'), (-19, 15, 'feuilles'), (20, -15, 'feuilles'), (6, 18, 'feuilles'), (-12, 20, 'feuilles')):
        c.buisson(x, z, 1.2, m)
    for k, (x, z) in enumerate(((-24, -6), (-24, -3), (-24, 0), (-24, 3), (24, -6), (24, -3), (24, 0), (24, 3))):
        c.box(x - 0.9, 0, z - 1.2, x + 0.9, 0.35, z + 1.2, 'terre')
        c.box(x - 0.8, 0.35, z - 1.1, x + 0.8, 0.75, z + 1.1, 'pois:%s:%s' % (COUL[k % 9 + 1], '#2ecc71'))
    c.voiture(-8, 19, 'metal_bleu', 'x')
    c.box(8, 0, 18.5, 10, 1.1, 20, '#e17055'); c.box(7.8, 1.1, 18.3, 10.2, 1.4, 20.2, 'toit_rouge')  # niche
    c.box(16, 0, 16, 20, 0.3, 20, 'sable')                            # bac à sable
    c.caisse(17, 17, 0.6, '#f1c40f'); c.caisse(19, 18.6, 0.5, '#e84393')
    c.box(-16, 0, -22, -11, 2.6, -18.5, 'planches'); c.box(-16.2, 2.6, -22.2, -10.8, 2.9, -18.3, 'toit_ardoise')  # cabane
    c.box(19, 0, -18, 19.8, 1.1, -17.2, 'metal_bleu'); c.box(20, 0, -18, 20.8, 1.1, -17.2, '#27ae60')  # poubelles
    c.table(-6, -16.5, -3, -15, 0.75, 'bois'); c.box(-6, 0, -17.4, -3, 0.45, -17.0, 'bois'); c.box(-6, 0, -14.5, -3, 0.45, -14.1, 'bois')
    c.bords()
    # ----- apparitions et cachettes -----
    c.spawn(-1, 22, 0, 'chercheur')
    for (x, z) in ((-12, -4), (-7, -8), (-15, 0), (-10, 4), (-14, 9), (-6, 9.5), (-1, -8), (-1, 4), (6, -6), (13, -6),
                   (9, -2), (5, 3), (5, 9), (13, 2.5), (16.5, 10.5), (-20, -10), (20, 8), (0, -20), (-20, 10), (14, -20)):
        c.spawn(x, z, 0)
    for (x, z) in ((-16.8, -10.6), (-12.9, -2.0), (-17.2, 3.2), (-5.0, 11.2), (-2.6, -11.2), (1.0, 0.0), (17.0, -8.2),
                   (11.8, -11.2), (8.0, -9.8), (2.8, 11.2), (9.4, 7.8), (11.6, 2.0), (17.0, 4.0), (-21, -14), (21, 15), (-16, -17.8)):
        c.cachette(x, z)
    return c


# =====================================================================================================
# 2. LE JARDIN : haies, massifs de fleurs, fontaine, serre, cabane, aire de jeux, potager
# =====================================================================================================
def jardin():
    c = Carte('jardin', 'Jardin', "Un immense jardin : haies, fleurs de toutes les couleurs, fontaine, serre, cabane et aire de jeux.", 32, JOUR)
    c.box(-32, -1, -32, 32, 0, 32, 'herbe')
    # allées en croix + cercle autour de la fontaine
    c.sol(-1.5, -32, 1.5, 32, 'pave'); c.sol(-32, -1.5, 32, 1.5, 'pave')
    c.sol(-6, -6, 6, 6, 'pave')
    # fontaine
    c.box(-3.5, 0, -3.5, 3.5, 0.7, -3.0, 'pierre'); c.box(-3.5, 0, 3.0, 3.5, 0.7, 3.5, 'pierre')
    c.box(-3.5, 0, -3.0, -3.0, 0.7, 3.0, 'pierre'); c.box(3.0, 0, -3.0, 3.5, 0.7, 3.0, 'pierre')
    c.deco(-3.0, 0.02, -3.0, 3.0, 0.5, 3.0, '#3c8dbc')
    c.box(-0.6, 0, -0.6, 0.6, 2.2, 0.6, 'pierre'); c.box(-1.2, 2.2, -1.2, 1.2, 2.5, 1.2, 'pierre')
    # haies (labyrinthe au nord-ouest)
    H = 2.2
    for (x0, z0, x1, z1) in ((-28, -28, -8, -27), (-28, -27, -27, -8), (-24, -24, -12, -23), (-24, -23, -23, -12), (-20, -20, -8, -19),
                             (-16, -16, -15, -8), (-12, -13, -8, -12), (-20, -15, -19, -10), (-28, -10, -20, -9)):
        c.box(x0, 0, z0, x1, H, z1, 'feuilles')
    c.box(-12, 0, -24, -11, H, -20.5, 'feuilles')
    # massifs de fleurs (nord-est)
    fleurs = ['pois:#e84393:#55efc4', 'pois:#fdcb6e:#e17055', 'pois:#ffffff:#6c5ce7', 'pois:#ff7675:#ffeaa7', 'pois:#74b9ff:#a29bfe',
              'raye:#fd79a8:#e84393', 'pois:#f1c40f:#27ae60', 'tissu:#e74c3c:#f39c12']
    k = 0
    for x in (8, 13, 18, 23):
        for z in (-26, -20, -14, -8):
            c.box(x - 1.6, 0, z - 1.6, x + 1.6, 0.3, z + 1.6, 'terre')
            c.box(x - 1.4, 0.3, z - 1.4, x + 1.4, 0.9 + (k % 3) * 0.2, z + 1.4, fleurs[k % len(fleurs)])
            k += 1
    # serre (sud-ouest)
    for x in (-26, -22, -18, -14):
        c.box(x - 0.1, 0, 8, x + 0.1, 3, 8.2, 'metal'); c.box(x - 0.1, 0, 19.8, x + 0.1, 3, 20, 'metal')
    c.box(-26, 0, 8, -14, 3, 8.1, 'vitre'); c.box(-26, 0, 19.9, -14, 3, 20, 'vitre')
    c.box(-26.1, 0, 8, -26, 3, 20, 'vitre'); c.box(-14, 0, 8, -13.9, 3, 12.5, 'vitre'); c.box(-14, 0, 15.5, -13.9, 3, 20, 'vitre')
    c.box(-26.1, 3, 8, -13.9, 3.1, 20, 'vitre')
    c.sol(-25.9, 8.2, -14.1, 19.8, 'planches')
    for z in (10.5, 14, 17.5):
        c.table(-24.5, z - 0.6, -16, z + 0.6, 0.85, 'bois')
        for i in range(5):
            c.deco(-24.2 + i * 1.6, 0.85, z - 0.45, -23.4 + i * 1.6, 1.4, z + 0.45, ['feuilles', 'pois:#e84393:#2ecc71', 'feuilles', 'pois:#f1c40f:#2ecc71', 'feuilles'][i])
    # cabane (sud-est)
    c.mur(16, 10, 26, 10, 'planches', 3, 0.3, [(19.6, 21.4)])
    c.mur(16, 20, 26, 20, 'planches', 3)
    c.mur(16, 10, 16, 20, 'planches', 3)
    c.mur(26, 10, 26, 20, 'planches', 3)
    c.box(15.6, 3, 9.6, 26.4, 3.3, 20.4, 'toit_rouge')
    c.sol(16.15, 10.15, 25.85, 19.85, 'planches')
    c.etagere(16.2, 12, 16.8, 18, 2.2, 'bois', 3, ['caisse', '#e17055', '#74b9ff', '#2d3436', '#fdcb6e'])
    c.box(22, 0, 17.5, 25.8, 0.9, 19.8, 'bois')                       # établi
    c.box(18, 0, 18, 19.2, 0.9, 19.5, 'metal_rouge')                  # tondeuse
    c.caisse(24.5, 12, 1.0); c.caisse(24.5, 13.2, 0.8, '#00b894'); c.box(20.5, 0, 12.0, 21.5, 1.2, 13.0, 'paille')
    # aire de jeux (sud, au centre)
    c.box(4, 0, 22, 9, 0.3, 30, 'sable')
    c.box(6, 0, 23, 8, 2.4, 25, 'metal_jaune'); c.box(5.9, 2.4, 22.9, 8.1, 2.5, 25.1, 'planches')
    for i in range(6):
        c.box(6, 0, 25 + i * 0.4, 8, 2.4 - (i + 1) * 0.38, 25.4 + i * 0.4, 'metal_rouge')  # toboggan
    c.box(-8, 0, 24, -7.8, 2.6, 24.2, 'metal_bleu'); c.box(-2.2, 0, 24, -2, 2.6, 24.2, 'metal_bleu'); c.box(-8, 2.5, 24, -2, 2.7, 24.2, 'metal_bleu')
    c.box(-6.5, 0.5, 23.7, -5.5, 0.6, 24.5, '#e74c3c'); c.box(-4.5, 0.5, 23.7, -3.5, 0.6, 24.5, '#3498db')  # balançoires
    # potager (ouest, au centre)
    for z in (-6, -3, 0, 3):
        c.box(-28, 0, z - 0.8, -20, 0.35, z + 0.8, 'terre')
        for i in range(6):
            c.box(-27.5 + i * 1.3, 0.35, z - 0.4, -26.9 + i * 1.3, 0.85, z + 0.4, ['feuilles', '#e67e22', 'feuilles', '#e74c3c', 'feuilles', '#f1c40f'][(i + int(z)) % 6])
    c.box(-19, 0, 4.5, -17, 1.0, 6.5, 'planches')                     # compost
    # bancs, tables de pique-nique, arbres, bottes de paille
    for (x, z) in ((5, -4.5), (-5, 4.5), (4.5, 5), (-4.5, -5)):
        c.box(x - 1, 0, z - 0.25, x + 1, 0.45, z + 0.25, 'bois')
    c.table(10, 4, 13, 6, 0.75, '#c0392b'); c.box(10, 0, 3.2, 13, 0.45, 3.6, '#c0392b'); c.box(10, 0, 6.4, 13, 0.45, 6.8, '#c0392b')
    c.table(10, -6, 13, -4, 0.75, '#2980b9')
    for (x, z) in ((-10, 10), (-6, 16), (12, 12), (27, -2), (-28, 26), (28, 28), (-4, -28), (28, -29), (-30, 2), (10, 27), (-12, 28)):
        c.arbre(x, z, 5, 1.8)
    for (x, z) in ((20, 2), (23, 4), (26, 6)):
        c.box(x - 0.7, 0, z - 0.5, x + 0.7, 1.0, z + 0.5, 'paille')
    for (x, z) in ((-14, 4), (14, -2), (-2, 14), (2, -14), (-24, 24), (24, -30), (-30, -30)):
        c.buisson(x, z, 1.3)
    c.box(29, 0, 10, 31.5, 0.8, 12, 'metal_bleu'); c.box(29, 0, 13, 31.5, 0.8, 15, '#27ae60')  # bacs
    c.bords()
    c.spawn(0, -30, 180, 'chercheur')
    for (x, z) in ((-25, -25), (-18, -22), (-14, -14), (-22, -12), (10, -23), (20, -17), (15, -11), (25, -5), (-20, 12), (-17, 18),
                   (20, 15), (23, 12), (7, 27), (-5, 27), (-24, -1.5), (12, 8), (-8, 8), (8, -8), (27, 22), (-28, 18)):
        c.spawn(x, z, 0)
    for (x, z) in ((-26.5, -26.5), (-21.5, -21.5), (-17.5, -17.5), (-13.0, -11.0), (6.0, -27.6), (24.7, -9.6), (-25.4, 9.0), (-14.6, 19.2),
                   (17.0, 11.0), (25.0, 19.0), (9.5, 22.8), (-7.0, 25.0), (-27.5, -7.5), (30.5, 9.5), (4.0, 3.8), (-3.8, -3.8)):
        c.cachette(x, z)
    return c


# =====================================================================================================
# 3. L'ENTREPÔT : rayonnages, caisses de toutes les couleurs, conteneurs, chariot élévateur, bureau
# =====================================================================================================
def entrepot():
    amb = dict(JOUR)
    amb = {**JOUR, 'ciel': ['#3a6aa8', '#c8d6e5'], 'ambiante': {'ciel': '#f0f4f8', 'sol': '#7f8c8d', 'intensite': 1.6}}
    c = Carte('entrepot', 'Entrepôt', "Un entrepôt géant : rayonnages, caisses de toutes les couleurs, conteneurs et chariot élévateur.", 30, amb)
    c.box(-30, -1, -30, 30, 0, 30, 'beton')
    # murs (8 m de haut) avec deux grandes portes
    c.mur(-28, -22, 28, -22, 'metal', 8, 0.4, [(-4, 4)])
    c.mur(-28, 22, 28, 22, 'metal', 8, 0.4, [(10, 18)])
    c.mur(-28, -22, -28, 22, 'metal', 8, 0.4)
    c.mur(28, -22, 28, 22, 'metal', 8, 0.4)
    # marquages au sol jaunes et noirs
    for z in (-12.5, -0.5, 11.5):
        c.deco(-27, 0.02, z - 0.15, 27, 0.04, z + 0.15, 'raye:#f1c40f:#2d3436')
    # rayonnages (3 rangées, 2 étagères dos à dos)
    objets = ['caisse', '#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6', 'caisse', '#e67e22', '#ecf0f1', '#1abc9c', '#2d3436', '#fd79a8']
    for z in (-17, -7, 5, 15):
        for (x0, x1) in ((-25, -15), (-11, -1), (3, 13)):
            c.box(x0, 0, z - 1.0, x0 + 0.15, 4.2, z + 1.0, 'metal_bleu'); c.box(x1 - 0.15, 0, z - 1.0, x1, 4.2, z + 1.0, 'metal_bleu')
            c.box((x0 + x1) / 2 - 0.08, 0, z - 1.0, (x0 + x1) / 2 + 0.08, 4.2, z + 1.0, 'metal_bleu')
            for i, y in enumerate((0.15, 1.5, 2.85)):
                c.box(x0, y, z - 1.0, x1, y + 0.12, z + 1.0, 'metal_jaune')
                # caisses posées (solides, on peut se cacher entre elles au niveau du sol)
                for kk in range(5):
                    if (kk + i + int(z)) % 4 == 0:
                        continue
                    m = objets[(kk * 3 + i * 5 + int(x0) + int(z)) % len(objets)]
                    a = x0 + 0.4 + kk * (x1 - x0 - 0.8) / 5
                    s = 0.9 if i else 1.0
                    c.box(a, y + 0.12, z - 0.8 + (kk % 2) * 0.2, a + s * 1.4, y + 0.12 + s, z + 0.6 + (kk % 2) * 0.2, m)
    # conteneurs (ouverts d'un côté : on peut entrer dedans)
    for (x, z, m, ouvert) in ((20, -16, 'metal_rouge', 'O'), (20, -10, 'metal_bleu', 'O'), (21, 8, '#27ae60', 'O'), (21, 15, 'metal_jaune', 'O')):
        L, W, H = 3.0, 1.2, 2.6
        c.box(x - L, 0, z - W, x + L, H, z - W + 0.1, m); c.box(x - L, 0, z + W - 0.1, x + L, H, z + W, m)
        c.box(x + L - 0.1, 0, z - W, x + L, H, z + W, m); c.box(x - L, H - 0.1, z - W, x + L, H, z + W, m)
        c.box(x - L, 0, z - W, x + L, 0.1, z + W, m)
    c.box(17, 2.6, -17.2, 23, 5.2, -14.8, 'metal_bleu')                 # un conteneur posé sur un autre
    # chariot élévateur
    c.box(0, 0.3, -2.5, 2.2, 1.6, -0.9, 'metal_jaune'); c.box(0.2, 1.6, -2.3, 2.0, 2.4, -1.1, 'metal')
    c.box(-0.4, 0, -2.4, -0.1, 3.2, -1.0, '#2d3436'); c.box(-1.6, 0.2, -2.2, -0.4, 0.3, -1.2, '#2d3436')
    for (x, z) in ((0.3, -2.6), (1.7, -2.6), (0.3, -0.95), (1.7, -0.95)):
        c.box(x - 0.3, 0, z - 0.15, x + 0.3, 0.6, z + 0.15, 'pneu')
    # palettes et tas
    for (x, z) in ((-20, 0.5), (-16, 0.5), (8, -0.8), (12, 0.8)):
        c.box(x - 0.6, 0, z - 0.5, x + 0.6, 0.15, z + 0.5, 'planches')
        c.box(x - 0.55, 0.15, z - 0.45, x + 0.55, 1.0, z + 0.45, '#ecf0f1')
    for i in range(4):
        c.box(-26, i * 0.3, 18, -25, i * 0.3 + 0.3, 19, 'pneu')
    for (x, z, m) in ((-22, 19.5, '#c0392b'), (-21, 19.5, '#2980b9'), (-20, 19.5, '#c0392b'), (-22, 20.5, '#16a085'), (-21, 20.5, '#f39c12')):
        c.tonneau(x, z, m)
    # bureau vitré (coin nord-est)
    c.box(16, 0, -21.8, 27.8, 0.3, -19.8, 'beton')
    c.mur(16, -19, 27.8, -19, 'vitre', 2.6, 0.1, [(18, 19.6)])
    c.table(22, -21.6, 26, -20.4, 0.76, '#ffffff', '#2d3436'); c.chaise(24, -19.8, '#e74c3c', 'S')
    c.box(17, 0, -21.7, 18.2, 1.9, -21.0, '#7f8c8d')                    # armoire
    c.plante(27.2, -19.6, '#e17055')
    # quai de chargement (sud-ouest) avec escalier
    c.box(-27.8, 0, 8, -18, 1.2, 21.8, 'beton')
    for i in range(3):
        c.box(-18 + i * 0.4, 0, 12, -17.6 + i * 0.4, 1.2 - (i + 1) * 0.3, 15, 'beton')
    for (x, z, s, m) in ((-26, 10, 1.0, 'caisse'), (-24.6, 10, 1.0, '#e74c3c'), (-26, 11.4, 1.0, '#3498db'), (-21, 18, 1.2, '#f1c40f'), (-23, 14, 1.0, 'caisse')):
        c.caisse(x, z, s, m, 1.2)
    # tapis roulant
    c.box(-12, 0, 18, 6, 0.8, 19.2, 'metal'); c.deco(-12, 0.8, 18.1, 6, 0.85, 19.1, 'pneu')
    for x in (-10, -6, -2, 2):
        c.caisse(x, 18.6, 0.6, COUL[int(x + 10) % len(COUL)], 0.85)
    c.bords()
    c.spawn(22, -20.6, 180, 'chercheur')
    for (x, z) in ((-20, -12), (-6, -12), (8, -12), (-20, 0), (-6, 2), (16, 0), (-20, 10), (-6, 10), (8, 10), (0, 15),
                   (24, -4), (24, 4), (-13, -20), (10, -20), (-2, 20), (-24, 3), (14, 18), (26, 18), (-10, -3), (5, -4)):
        c.spawn(x, z, 0)
    for (x, z) in ((19.0, -16.0), (19.0, -10.0), (20.0, 8.0), (20.0, 15.0), (-26.5, 16.5), (-23.0, 20.6), (-25.5, -20.5), (26.5, -15.0),
                   (-24.0, -12.0), (-10.0, -12.0), (4.0, -12.0), (-24.0, 10.0), (-10.0, 10.0), (12.0, 10.0), (-14.6, 0.0), (27.0, 21.0)):
        c.cachette(x, z)
    return c


CARTES = {'maison': maison, 'jardin': jardin, 'entrepot': entrepot}

if __name__ == '__main__':
    os.makedirs(DOSSIER, exist_ok=True)
    ids = sys.argv[1:] or list(CARTES)
    for i in ids:
        carte = CARTES[i]()
        carte.verifier()
        with open(os.path.join(DOSSIER, i + '.json'), 'w', encoding='utf-8') as f:
            json.dump(carte.json(), f, ensure_ascii=False, separators=(',', ':'))
        print(f'{i} : {len(carte.b)} blocs, {len(carte.d)} décors, {len(carte.s)} apparitions, {len(carte.c)} cachettes')
