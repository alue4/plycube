# Fabrique la piste de bruitages (assets/audio/bruitages.mp3) à partir des vrais sons du jeu.
# Chaque ligne : (moment en secondes, fichier son du jeu, volume, vitesse de lecture)
# Les moments suivent les scènes de index.html et src/moteur.js.
import subprocess, os
SONS = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'games', 'fps', 'public', 'sons')
SORTIE = os.path.join(os.path.dirname(__file__), '..', 'assets', 'audio', 'bruitages.mp3')

def pixels():
    n = 32
    return [0.35 + 2.6 * (1 - (1 - i / (n - 1)) ** 1.35) for i in range(n)]

EVENEMENTS = []
for i, t in enumerate(pixels()):                      # 01 : chaque pixel posé fait « clic »
    EVENEMENTS.append((t, 'clic', 0.35 + 0.25 * (i == 31), 1.0 + (i % 4) * 0.04))
EVENEMENTS += [
    (2.97, 'tete', 0.55, 1.0),                         # le sourire est fini
    (4.54, 'degats', 0.55, 1.0), (5.20, 'degats', 0.6, 0.9),   # 02 : CRÉE / TON PERSO
]
for t in [8.94, 9.74, 10.40, 10.81, 11.60, 12.005, 12.50, 12.81]:    # 03 : changements de tenue
    EVENEMENTS.append((t, 'pouf', 0.45, 1.0))
EVENEMENTS += [
    (12.92, 'elimination', 0.5, 1.0),                   # 100 % TOI
    (14.68, 'saut', 0.5, 0.8),                         # transition pixels
    (15.35, 'chargeur_insere', 0.5, 1.0), (15.53, 'revolver_recharge', 0.45, 1.0),
    (15.71, 'poele_touche', 0.45, 1.0), (15.89, 'grappin_accroche', 0.5, 1.0),   # 04 : les 4 armes
    (16.3, 'tete', 0.35, 1.0),                         # « 21 »
    (21.2, 'lobby_pret', 0.55, 1.0), (22.0, 'lobby_pret', 0.55, 1.0), (22.75, 'lobby_pret', 0.6, 1.25),  # 05 : 3, 2, 1
    (23.6, 'lobby_depart', 0.7, 1.0),                  # coup de sifflet, C'EST PARTI
    (24.18, 'saut', 0.5, 0.8),
    (24.55, 'pas_1', 0.4, 1.0), (24.78, 'pas_2', 0.4, 1.0), (25.0, 'pas_3', 0.4, 1.0),
    (25.2, 'trampoline', 0.75, 1.0),                   # 06 : le grand saut
    (27.95, 'saut', 0.4, 0.7),
    (31.25, 'grappin_tir', 0.6, 1.0), (31.6, 'grappin_accroche', 0.55, 1.0), (31.75, 'grappin_corde', 0.5, 1.0),
    (33.45, 'atterrissage', 0.5, 1.0),                 # 07 : grappin
    (34.25, 'pas_4', 0.22, 1.0), (34.65, 'pas_1', 0.22, 1.0), (35.05, 'pas_2', 0.22, 1.0),
    (35.35, 'couteau_coup', 0.55, 1.0), (35.75, 'dos_special', 0.75, 1.0), (35.95, 'elimination', 0.45, 1.0),  # 08
    (37.36, 'fusil_tir', 0.55, 1.0), (37.6, 'poele_touche', 0.95, 1.0),     # 09 : le tireur, puis DING
    (38.65, 'grenade_lancer', 0.5, 1.0), (38.95, 'grenade_rebond', 0.55, 1.0), (39.2, 'explosion', 0.8, 1.0),
    (41.5, 'trampoline', 0.6, 0.62),                   # 10 : ralenti (son plus grave)
    (43.18, 'saut', 0.5, 0.8),
]
for i in range(6):                                     # 11 : les pixels du logo
    EVENEMENTS.append((44.05 + i * 0.13, 'clic', 0.3, 1.1))
EVENEMENTS.append((44.9, 'tete', 0.55, 1.0))

def fabriquer():
    entrees, filtres, noms = [], [], []
    for k, (t, son, vol, vitesse) in enumerate(EVENEMENTS):
        entrees += ['-i', os.path.join(SONS, f'{son}.mp3')]
        f = f'[{k}:a]aresample=44100,'
        if vitesse != 1.0: f += f'asetrate={int(44100 * vitesse)},aresample=44100,'
        f += f'volume={vol},adelay={int(t * 1000)}:all=1[s{k}]'
        filtres.append(f)
        noms.append(f'[s{k}]')
    filtres.append(f"{''.join(noms)}amix=inputs={len(noms)}:normalize=0:dropout_transition=0,apad=whole_dur=50,atrim=0:50,alimiter=limit=0.9[out]")
    cmd = ['ffmpeg', '-v', 'error', '-y'] + entrees + ['-filter_complex', ';'.join(filtres), '-map', '[out]', '-ac', '2', '-b:a', '160k', SORTIE]
    subprocess.run(cmd, check=True)
    print(f'{len(EVENEMENTS)} bruitages -> {SORTIE}')

if __name__ == '__main__':
    fabriquer()
