# Plycube (bêta)

Site de jeux (https://plycube.fr) : comptes sur invitation, amis et personnage partagés entre tous les jeux, catalogue, suggestions et feuille de route, panneau admin. Deux jeux : **Arena FPS** (tir en blocs) et **Caméléon** (cache-cache en blocs).

- **Technique** : Node.js + Express, base SQLite, WebSocket (temps réel), HTML/CSS/JS simple.
- **Adresse** : sur ton réseau local, le site est à `http://192.168.1.37:3000` (l'adresse du NAS). Pour le rendre public, passe par ton reverse proxy.
- **Données** : tout est dans le dossier `data/` (la base `site.db`). C'est le seul dossier à sauvegarder.

> Toutes les commandes ci-dessous se tapent **dans le dossier du projet** (celui qui contient ce README).
> Pour y aller : `cd /chemin/vers/jeu-college`

---

## 1. Lancer le site (première fois)

```bash
docker compose up -d --build
```

- `up` = démarre, `-d` = en arrière-plan, `--build` = (re)construit l'image.
- La première fois, ça prend quelques minutes.

Vérifier que ça tourne :

```bash
docker compose ps          # l'état doit être "running" puis "healthy"
docker compose logs -f     # affiche le journal en direct (Ctrl + C pour quitter)
```

Ouvre ensuite `http://192.168.1.37:3000` depuis n'importe quel ordinateur ou téléphone de la maison.

> **Réserver le site au NAS seul** (quand ton reverse proxy est en place) : dans `docker-compose.yml`, remplace
> `"3000:3000"` par `"127.0.0.1:3000:3000"`, puis relance `docker compose up -d`.

## 2. Créer ton compte admin

```bash
docker compose exec site node scripts/admin.js creer-admin TonPseudo
```

Le mot de passe est demandé au clavier. **Rien ne s'affiche quand tu tapes, c'est normal.** Valide avec Entrée, puis retape-le pour confirmer.
Aucun mot de passe n'est écrit dans le code : il est stocké sous forme hachée dans la base.

Ensuite, connecte-toi sur le site : un lien **Admin** apparaît dans le menu.

## 3. Créer ton premier code d'invitation

**Depuis le site (le plus simple)** : Admin → onglet *Codes d'invitation* → choisis le nombre d'utilisations, une note (ex. « 4e B »), puis *Créer*. Tu peux désactiver un code à tout moment.

**Ou en ligne de commande** :

```bash
docker compose exec site node scripts/admin.js code 30 "Classe de 4e B"
```

(`30` = nombre de personnes qui peuvent l'utiliser ; sans nombre, il ne sert qu'une fois.)

Donne le code aux élèves : ils vont sur `/inscription`, choisissent un pseudo et un mot de passe. Aucune autre donnée ne leur est demandée.

---

## Commandes utiles au quotidien

| Je veux…                         | Commande                                                        |
|----------------------------------|-----------------------------------------------------------------|
| Arrêter le site                  | `docker compose down`                                           |
| Le relancer                      | `docker compose up -d`                                          |
| Le mettre à jour après une modif du code | `docker compose up -d --build`                          |
| Voir le journal                  | `docker compose logs -f --tail 100`                             |
| Changer un mot de passe          | `docker compose exec site node scripts/admin.js mot-de-passe Pseudo` |
| Lister les admins                | `docker compose exec site node scripts/admin.js liste-admins`   |
| Retirer les droits admin         | `docker compose exec site node scripts/admin.js retirer-admin Pseudo` |
| Sauvegarder la base              | `docker compose exec site node scripts/admin.js sauvegarde`     |
| Voir toutes les commandes admin  | `docker compose exec site node scripts/admin.js`                |

La sauvegarde est rangée dans `data/sauvegardes/`. Copie ce dossier ailleurs de temps en temps (clé USB, autre disque…).

**Restaurer une sauvegarde** : `docker compose down`, remplace `data/site.db` par le fichier sauvegardé (renommé en `site.db`), supprime `data/site.db-wal` et `data/site.db-shm` s'ils existent, puis `docker compose up -d`.

Le site redémarre tout seul si le NAS redémarre (`restart: unless-stopped`).

## Le panneau admin

- **Tableau de bord** : nombre de joueurs, joueurs en ligne, etc.
- **Codes d'invitation** : créer, voir combien de fois chaque code a servi, désactiver.
- **Joueurs** : bloquer/débloquer (le joueur est déconnecté immédiatement), donner un mot de passe provisoire, supprimer.
- **Suggestions** : masquer, supprimer, ou envoyer une idée sur la feuille de route.
- **Feuille de route** : trois colonnes, *En cours*, *Prochainement* et *Terminé*. Tu ajoutes des éléments et tu les déplaces.

---

## Modifier les animations

Tous les fichiers sont dans **`public/assets/animations/`** et sont commentés en français :

| Fichier             | Rôle |
|---------------------|------|
| `reglages.css`      | **Commence ici.** Toutes les vitesses, distances et intensités sont réunies en haut de ce fichier. |
| `apparition.css`    | Les éléments qui « glissent » en arrivant sur la page. |
| `survol.css`        | Effets au passage de la souris (cartes qui se soulèvent, boutons). |
| `fond.css`          | Les lueurs bleues qui bougent lentement en fond. |
| `notifications.css` | Notifications, pastille verte « en ligne », badges. |
| `animations.js`     | Déclenche les apparitions en cascade (réglages en haut : `ACTIVER`, `DECALAGE_MS`). |
| `animations.css`    | Charge tous les autres fichiers. |

**Exemples :**
- Cartes qui se soulèvent plus fort : dans `reglages.css`, `--anim-survol-hauteur: -10px;`
- Fond plus lent : `--anim-fond-duree: 40s;`
- Couper le fond animé : dans `animations.css`, mets en commentaire la ligne
  `@import url("fond.css");` → `/* @import url("fond.css"); */`
- Couper toutes les apparitions : dans `animations.js`, `var ACTIVER = false;`

**Pour voir le résultat** : enregistre le fichier, puis recharge la page avec **Ctrl + F5** (le navigateur garde les fichiers en mémoire jusqu'à une heure, et Ctrl + F5 force le rechargement).
Pas besoin de redémarrer ni de reconstruire : le dossier des animations est partagé avec le conteneur.

Les élèves qui ont activé « réduire les animations » sur leur appareil voient automatiquement un site sans mouvement.

Les **couleurs** (bleu et noir) sont en haut de `public/assets/css/style.css` (variables `--bleu`, `--fond`…). Après un changement de ce fichier, lance `docker compose up -d --build`.

---

## Ajouter un jeu

Chaque jeu est un dossier dans `games/<nom>/` (nom en minuscules, chiffres et tirets) :

```
games/fps/
  manifest.json     la fiche du jeu (obligatoire)
  public/           les fichiers envoyés au navigateur : image, index.html du jeu…
```

Exemple de `manifest.json` :

```json
{
  "nom": "Arena FPS",
  "description": "Un jeu de tir multijoueur…",
  "image": "cover.svg",
  "statut": "bientot",
  "joueurs": "2 à 8 joueurs",
  "tags": ["Multijoueur", "Action"],
  "ordre": 1
}
```

- `image` : un fichier du dossier `public/` du jeu.
- `statut` : `bientot` (carte « bientôt disponible », non jouable), `beta`, `disponible` ou `maintenance`.
- `statutAvecServeur` (facultatif) : le statut à utiliser **seulement quand la partie serveur du jeu (`server.js`) a bien été chargée** au démarrage du site. Exemple : Caméléon dit `"statut": "bientot", "statutAvecServeur": "beta"` : il reste « bientôt » tant que le site n'a pas été redémarré avec son serveur, puis devient jouable tout seul.
- `ordre` : position dans le catalogue (le plus petit en premier).

Le catalogue relit les fiches toutes les 10 secondes : une modification de `manifest.json` apparaît sans redémarrage.
Seuls les joueurs connectés peuvent ouvrir un jeu.

### API pour les jeux (amis, présence, invitations)

Un jeu inclut le script partagé du site :

```html
<script src="/assets/js/platform.js"></script>
```

puis :

```js
const moi = await Plateforme.moi();               // { id, username, isAdmin } ou null
Plateforme.connecter();                           // temps réel : présence, invitations
Plateforme.definirActivite({ jeu: 'fps', salle: 'abc123', rejoignable: true });
const { friends } = await Plateforme.amis();      // amis + en ligne + jeu en cours
await Plateforme.inviter(idAmi, 'fps', 'abc123'); // invite un ami dans ta partie
await Plateforme.rejoindre(idAmi);                // rejoint la partie d'un ami
Plateforme.on('invite', (msg) => { /* … */ });    // invitation reçue
Plateforme.on('presence', (msg) => { /* … */ });  // un ami change de statut
const salle = Plateforme.salleDansAdresse();      // lit ?room=… dans l'adresse
```

Les amis sont communs à tout le site : un ami ajouté une fois l'est dans tous les jeux.

---

## Le jeu Arena FPS

Jeu de tir en blocs (style Minecraft, sans sang) : **Chacun pour soi** ou **Équipes Bleus contre Rouges**, **4 cartes**, **40 armes et gadgets** (et 9 armes d'admin), des trampolines, et des ragdolls quand on est éliminé.

- **Tester avant d'ouvrir aux élèves** : tant que `games/fps/manifest.json` contient `"statut": "bientot"`, seul l'admin le voit. Sur l'accueil, son bouton s'appelle *Tester (admin)*.
- **L'ouvrir aux élèves** : remplace `"bientot"` par `"beta"` dans `games/fps/manifest.json`. Le changement apparaît dans les 10 secondes, sans redémarrage.
- **Jouer à plusieurs** : dans l'écran d'accueil du jeu, *JOUER* → choisis la carte et le mode, ou rejoins une partie de la liste (ou avec son code de 4 lettres, ou avec une invitation d'un ami).
- **Salle d'attente** : en arrivant dans une partie, on choisit ses 4 armes puis on peut s'échauffer (les tirs ne font pas de dégâts). La vraie partie démarre toute seule **30 secondes après l'arrivée du 2e joueur prêt** (réglable : `attenteSecondes` dans `reglages.json`). **Seul pour s'entraîner ?** Des bots arrivent (3 si tu es seul, moins s'il y a d'autres joueurs) : ils se promènent sur la carte, te cherchent, tirent, et on peut les éliminer. Ils ne visent que ceux qui jouent vraiment (pas ceux qui sont dans un menu) et partent dès que la vraie partie commence. Réglages : section `bots` de `reglages.json` (nombre, précision, temps de réaction, dégâts ou non).
- **Commandes (ordinateur)** : ZQSD (ou WASD) pour se déplacer, Espace pour sauter, souris pour regarder, clic gauche pour tirer / frapper / lancer, **clic droit ou Maj pour viser**, **touches 1 à 4** (principale, secondaire, mêlée, gadget), E ou la molette pour passer à l'arme suivante, R pour recharger, **F pour regarder son arme**, Tab pour les scores, Échap pour le menu.
- **Changer les touches** : *Réglages → Changer les touches* (onglets Clavier et souris / Manette). On clique sur une case puis on appuie sur la nouvelle touche (ou on clique sur la case avec le bouton de souris voulu, ou on tourne la molette dessus) ; Retour arrière vide la case. Une touche prise par une autre action lui est retirée (un message le dit). Gardé dans le navigateur ; bouton *Remettre les touches d'origine*. Échap (menu) ne se change pas.
- **Manette** (Xbox, PlayStation…, branchée ou en Bluetooth : appuyer sur un bouton pour qu'elle soit détectée) : stick gauche se déplacer, stick droit regarder, RT tirer, LT viser, A sauter, X recharger (ou changer d'armes quand on est éliminé), Y / LB arme suivante / précédente, croix ← principale, croix → secondaire, R3 mêlée, RB gadget, croix ↑ regarder son arme, croix ↓ danser, Affichage scores, Menu pause. **Dans les menus** : la croix (ou le stick gauche) pour choisir, A valider, B revenir. Pas besoin de capturer la souris : *Menu* ou *A* sur « Jouer » lance la partie. Réglages : sensibilité, inverser haut/bas, vibrations. Sur iPad, les boutons tactiles se cachent quand on joue à la manette et reviennent dès qu'on touche l'écran.
- **Aide à la visée** (manette et tablette seulement, jamais à la souris ; *Réglages → Aide à la visée* : désactivée, légère, normale, forte) : le viseur ralentit sur un adversaire visible, le suit un peu quand lui ou toi bougez, et se rapproche de lui quand on commence à viser. Pas à travers les murs, pas sur les coéquipiers ni sur un joueur protégé.
- **Sur tablette (iPad)** : les commandes tactiles s'affichent toutes seules. Un joystick pour se déplacer, le doigt sur l'écran pour regarder, et des boutons TIRER, VISER, SAUTER, recharger et les 4 emplacements. Pour **déplacer ou agrandir les boutons** : *Réglages → Personnaliser les boutons* (chaque tablette garde sa disposition). Le choix *Commandes* dans les réglages permet de forcer le mode tactile ou clavier.

### Les armes

Les armes existent en **3 styles**, au choix de chaque joueur dans *Réglages → Style des armes* : **Réaliste simplifié** (par défaut, léger), **Réaliste avec textures** (plus beau, environ 8 Mo à charger) et **Classique en blocs** (le plus léger). Les modèles réalistes sont des fichiers `.glb` libres dans `games/fps/public/modeles/armes/` (`simple/`, `texture/`, avec `catalogue.json` pour leur orientation et `LICENCES.md` pour les auteurs ; six modèles CC BY sont crédités dans les Réglages du jeu). Pour remplacer un modèle, mets un autre `.glb` à la place et corrige son orientation dans `catalogue.json` (`axe`, `bouche`, `haut`). **Pièces animées des modèles réalistes** : le chargeur, la culasse, la pompe, le barillet, les canons, la roquette et le crochet du grappin des modèles réalistes sont découpés et bougent comme ceux des armes en blocs (le chargeur tombe au rechargement, la glissière recule au tir, la roquette disparaît après le tir, les gadgets disparaissent quand on les lance…). Les morceaux de chaque fichier sont choisis dans `modeles/armes/pieces.json` (un « îlot » = un morceau qui ne touche pas les autres, noté `maillage:îlot`). Si tu changes un modèle `.glb`, il faut mettre à jour ses numéros dans ce fichier. Pas de pièce séparée dans le modèle (mitrailleuse, chargeur caché dans la crosse du pistolet…) : la pièce reste fixe.

Chaque joueur choisit **4 armes**, une par catégorie, en arrivant dans la partie. Il peut en changer à chaque réapparition (bouton *Changer d'armes* quand il est éliminé, ou touche <kbd>C</kbd> sur ordinateur ; aussi dans le menu pause et la salle d'attente) et choisir ses armes préférées depuis l'accueil (*Mes armes*).

| Catégorie (touche) | Armes |
|---|---|
| **Principale** (1) | Fusil d'assaut, Fusil à rafale (3 balles par clic), Mitraillette, Mitrailleuse lourde (100 balles, on marche moins vite), Fusil à pompe, Fusil de précision (semi-auto, lunette ×2,6), Sniper (lunette ×4,5), Arbalète (carreaux qui tombent en arc, silencieuse), Lance-roquettes, **Pompe automatique** (7 plombs, tire tout seul), **Fusil à double canon** (2 énormes coups de près), **Mitraillette rapide** (la plus rapide de toutes), **Fusil bullpup** (lunette ×2,2, plus puissant que le fusil d'assaut), **Lance-grenades** (les grenades retombent en arc et explosent au contact), **Fusil à plasma** (boules d'énergie qui éclatent en petite gerbe), **Fusil anti-matériel** (lunette ×6, une balle élimine presque à coup sûr), **Cloueuse** (des clous qui restent plantés dans les murs) |
| **Secondaire** (2) | Revolver, Pistolet, Mini-mitraillette, Fusil à canon scié (2 coups), Lance-fusée (brûle et éblouit), **Pistolet lourd** (7 balles puissantes), **Pistolet automatique**, **Mini-arbalète** (silencieuse, à une main), **Pistolet à eau** (presque pas de dégâts, mais tellement drôle) |
| **Mêlée** (3) | **Couteau** (on court plus vite ; *dans le dos d'un adversaire en visant* : élimination en un coup, avec une animation spéciale), Batte de baseball (projette l'adversaire), Poêle à frire (BOING ! et dans ton dos, elle arrête les balles qui arrivent par derrière), **Katana** (grande portée), **Hache** (lente, très puissante), **Masse** (envoie l'adversaire voler très loin), **Pelle** (comme la poêle : rangée dans ton dos, elle arrête les balles) |
| **Gadget** (4) | Grenade (rebondit, explose après 3 s), Fumigène (gros nuage pour se cacher), Grappin (tire vers un mur ou un toit), Kit de soin (+50 points de vie), **Grenade flash** (aveugle ceux qui la voient pendant 3,5 s, sans dégâts ; moitié moins pour le lanceur, rien derrière un mur), **Mine** (posée au sol, elle s'arme en 1 s et explose quand un adversaire passe tout près ; 2 au maximum), **Propulseur** (un coup de réacteur qui t'envoie sur les toits). Chaque gadget a un **temps de recharge**. |

**Chaque élimination remet ta vie à 100 %** (pour tout le monde, bots compris ; se tuer soi-même ne compte pas). Pour l'enlever : `"vieAuMaxApresElimination": false` dans la partie `joueur` de `games/fps/public/reglages.json`, puis `sudo docker compose restart`.

### Pouvoirs d'admin

Dans *Réglages*, l'admin du site a un bouton **>_ ADMIN PANEL** (les autres joueurs ne le voient pas). Il ouvre un panneau façon terminal de hacker : le menu des pouvoirs au milieu, rangés par catégorie (touche entre crochets pour activer / couper : <kbd>1</kbd> à <kbd>9</kbd> puis <kbd>A</kbd> à <kbd>Z</kbd> ; <kbd>0</kbd> pour tout couper ; flèches + Entrée ; Échap pour quitter ; à la manette : la croix, A, B) et, dans les coins, des fenêtres qui s'allument une par une : *Système*, *Journal*, *Session* et un *Radar*. Le choix des pouvoirs reste sur cet ordinateur (code : `games/fps/public/js/panneau-admin.js`).

**Accès facile** : tout en haut du panneau, l'option **ACCÈS FACILE** ajoute en partie un bouton transparent **>_ ADMIN** en haut à droite de l'écran, qui ouvre le panneau d'un clic (ordinateur : d'abord Échap pour libérer la souris) ou d'un toucher (iPad). Raccourcis : touche **²** au clavier (modifiable dans *Changer les touches*), **Affichage + Menu** en même temps à la manette (Share + Options sur PlayStation). En fermant le panneau, on revient directement au jeu (tablette, manette).

| Catégorie | Pouvoirs |
|---|---|
| **Mouvement** | **Voler** (<kbd>V</kbd>, <kbd>Espace</kbd> monter, <kbd>C</kbd> descendre) · **Super vitesse** · **Super saut** · **Triple saut** (deux sauts de plus en l'air) · **Gravité lunaire** · **Passe-muraille** (on traverse les murs, le sol porte toujours) · **Téléportation** (<kbd>T</kbd> : on apparaît là où on vise, jusqu'à 300 m) |
| **Combat** | **Visée auto** · **Précision parfaite** · **Sans recul** · **Munitions infinies** · **Tir ultra rapide** (×3, même le sniper et le laser) · **One shot** · **Balles explosives** (petite explosion à l'impact, qui ne blesse pas l'admin) · **Frappe orbitale** (<kbd>G</kbd> en visant le sol : une cible rouge apparaît, un rayon tombe du ciel 1,3 s plus tard, énorme explosion qui casse la carte) |
| **Survie** | **Invincible** (aura dorée visible par tous) · **Vampire** (la moitié des dégâts faits revient en vie) · **Régénération** (+16 PV/s) |
| **Vision** | **Voir à travers les murs** · **Radar** (mini-carte en haut à gauche) · **Vision nocturne** · **Mode Matrix** (pluie de code vert) · **Vue 3e personne** |
| **Fun** | **Géant** · **Mini** (tout le monde voit la taille changer) · **Invisible** (les autres ne te voient plus) · **Traînée arc-en-ciel** (visible par tous) · **Grosses têtes** (les autres, sur ton écran) · **Mode disco** |
| **Bots** | **Figer les bots** (ils ne bougent plus et ne tirent plus) |
| **Actions** (boutons) | **Vie au maximum** · **Réparer la carte** · **+2 bots** · **Enlever les bots** · **Bots normaux** |

Les touches <kbd>T</kbd> (téléportation) et <kbd>G</kbd> (frappe orbitale) se changent dans *Réglages → Changer les touches* (groupe Admin). Le serveur vérifie que c'est bien le compte admin pour tout ce qui compte (vol, vitesse, téléportation, dégâts, invincibilité, géant, invisible, bots…) : un élève ne peut rien activer. Les pouvoirs de vision (radar, nocturne, Matrix, disco, grosses têtes, wallhack) ne changent que l'écran de l'admin.

**Le laser (arme d'admin).** Dans le choix des armes, l'admin a en plus un **Laser** (catégorie principale). On **maintient le tir pour le charger** : quatre anneaux d'énergie tourbillonnent de plus en plus vite autour du canon, une boule de lumière grossit au bout, des éclairs sautent entre les anneaux, des particules sont aspirées dans le canon ; autour du viseur, un « réacteur » tourne et se remplit, les bords de l'écran s'illuminent, le son monte, **l'écran tremble de plus en plus** et la vue se resserre ; à 100 %, tout passe au rose et « MAX » clignote. On **relâche pour envoyer le rayon** (rayon en spirale, onde de choc, flash et lumière, la vue « s'ouvre » d'un coup) : plus c'est chargé, plus ça fait de dégâts (quasi un seul tir à pleine charge) et plus ça **casse la carte** autour du point d'impact — **jamais le sol** (ni le terrain de l'île, le pont ou les douves) : seulement les murs, tours, bâtiments, caisses… (réglage `casseSol` du laser dans `reglages.json`). Les blocs cassés disparaissent (plus de collision) puis **réapparaissent** tout seuls après quelques secondes ; une nouvelle manche repart avec une carte intacte. Le serveur vérifie que seul l'admin peut l'équiper et refait tous les dégâts et les cassures lui-même.

**Les autres armes d'admin** (elles aussi seulement dans le choix des armes de l'admin, vérifié par le serveur) :

| Arme | Ce qu'elle fait |
|---|---|
| **Canon à trou noir** (principale) | Une boule noire qui ouvre un trou noir en touchant quelque chose : pendant 3,5 s, il aspire les adversaires autour (et blesse ceux qui sont tout près du centre), puis tout explose. L'aspiration vise une vitesse vers le centre : elle ne s'emballe pas. |
| **Fusil Tesla** (principale) | Un éclair instantané qui saute d'adversaire en adversaire (5 touchés au maximum, à moins de 9 m les uns des autres et sans mur entre eux), de moins en moins fort. Pas de munitions. |
| **Minigun** (principale) | 6 canons qui tournent, 300 balles ; les canons mettent un instant à démarrer. |
| **Lance-feux d'artifice** (principale) | Une fusée qui éclate en bouquet de couleur, puis en 6 petites explosions colorées tout autour. |
| **Rayon anti-gravité** (principale) | Un rayon violet : l'adversaire touché s'envole et flotte dans les airs (avec une aura violette). |
| **Marteau de Thor** (mêlée) | À chaque coup, même dans le vide, la foudre tombe et une onde de choc envoie en l'air les adversaires autour (rien pour celui qui frappe). |
| **Sabre laser** (mêlée) | Une lame d'énergie qui touche jusqu'à 3 m, très puissante. |
| **Pluie de météores** (gadget) | Une balise qu'on lance : elle s'allume, puis 10 météores tombent du ciel autour d'elle et explosent. |

Toutes ces armes se règlent dans `games/fps/public/reglages.json` (à la fin de la liste `armes`). Les bots du mode classé n'utilisent jamais d'armes d'admin ; à partir de certains niveaux, ils prennent aussi la pompe automatique, la mitraillette rapide, le fusil bullpup ou le fusil anti-matériel. Les explosions, aspirations et envols des nouvelles armes poussent aussi les bots, et la grenade flash les aveugle.

### Inspections et recharges propres à chaque arme

Chaque arme a sa **propre inspection** (touche <kbd>F</kbd>) et sa **propre recharge** : le fusil d'assaut vérifie son chargeur et claque l'arrêtoir de culasse, le fusil à rafale fait un tour complet sur lui-même, le pistolet tourne autour du doigt, le revolver fait tourner son barillet puis on souffle sur le canon, le couteau est lancé en l'air et rattrapé, la batte est pointée vers l'horizon, la grenade est jetée en l'air en vrille, le laser tourne en pulsant… Pendant les recharges, l'arme est relevée pour qu'on voie le chargeur sortir et le neuf arriver (sniper : culasse ouverte d'abord ; canon scié : les douilles sautent ; arbalète : on retend la corde ; lance-roquettes : la roquette arrive par l'avant…).

Elles sont écrites dans `games/fps/public/js/animations-origine.js`, au même format que l'atelier d'animations : **une animation faite dans l'atelier passe toujours avant**, et l'atelier recopie ces animations telles quelles quand on veut les modifier.

### Jouer à plusieurs, et les cartes

- Chaque carte existe en **version normale** et en **version XXL** (deux fois plus grande, avec plus de bots à l'entraînement et plus de joueurs possibles).
- **Bots d'entraînement** : leur nombre dépend de la carte (jusqu'à 7 sur les grandes).

### Mode classé

Bouton **Classé** dans le panneau « Jouer ». C'est du chacun pour soi, mais :

- la partie démarre **5 secondes** après que tu as choisi tes armes, même tout seul (premier à **15** éliminations) ;
- des **bots complètent la partie** jusqu'à 6 joueurs, pendant toute la manche (tes amis peuvent venir avec le code : un bot leur laisse sa place) ;
- les bots deviennent **de plus en plus forts** : ils commencent au niveau de ton rang, gagnent **+1 niveau toutes les 3 éliminations** du meilleur joueur, et **+1 à chaque manche gagnée** par un vrai joueur (−1 si un bot gagne). Niveau 1 à 20 : visée plus précise (6° d'erreur → 0,6°), réaction plus rapide (0,7 s → 0,15 s), un peu plus rapides, et de meilleures armes (sniper au niveau 16).

**Ton rang** (Bronze, Argent, Or, Platine, Diamant de I à III, puis Champion) est affiché dans le panneau « Jouer ». Fin de manche : 1er **+30** points, 2e **+15**, 3e **+5**, sinon **−10** ; un niveau tous les 50 points. Il est **enregistré avec ton compte** (table `fps_classe` de la base du site) : c'est le même sur tous tes appareils. C'est le serveur qui compte les points à la fin de chaque manche (`games/fps/serveur/classement.js`), le navigateur ne fait que les afficher : impossible de tricher en modifiant son navigateur.

Réglages dans `games/fps/public/reglages.json` (`partie.objectifClasse`, `partie.attenteClasseSecondes`) ; la force des bots par niveau est dans `games/fps/serveur/bots.js` (`forceDuNiveau`).

### L'éditeur de cartes (admin)

L'admin a un bouton **🗺️ Éditeur de cartes** (dans le menu et dans l'atelier d'animations ; page `games/fps/public/atelier-cartes.html`). On construit sa propre carte en posant des blocs en 3D (comme dans Minecraft), puis on l'enregistre : elle apparaît alors dans le choix des cartes du jeu.

- **Outils** : *Bloc* (clic sur une face ou le sol pour poser un bloc ; « hauteur » empile plusieurs blocs d'un coup), *Boîte* (deux clics = les deux coins d'une grande boîte : mur, sol, bâtiment), *Gomme* (enlever un bloc), *Apparition* (poser un point d'apparition, chacun pour soi ou Bleus/Rouges). Caméra : clic droit tourne, molette zoome.
- **Palette** des matières (herbe, pierre, bois, métal, néon, vitre, trampoline, invisible…), case *Décor* pour un bloc sans collision.
- **Réglages de la carte** : nom, taille, ambiance (jour / soir / nuit / plage), eau.
- *Remettre le sol et les bords* (murs invisibles pour ne pas sortir), *Tout effacer*, *Annuler* (<kbd>Ctrl</kbd>+<kbd>Z</kbd>), *Partir d'une carte* (copier une carte du jeu pour la modifier).
- **Enregistrer** range la carte dans `data/fps-cartes.json` ; **Tester** l'enregistre puis lance une partie dessus. Le serveur (`games/fps/serveur/cartes.js`) revérifie tout (matières connues, nombre de blocs, au moins une apparition) avant de l'accepter.

### L'atelier d'animations (admin)

Dans le menu du jeu, l'admin du site a un bouton **🎬 Atelier d'animations** (page `games/fps/public/atelier-animations.html`). On y choisit une arme (modèles « classiques » en blocs) et un moment : **prendre en main**, **tir (recul)**, **pompe / culasse**, **recharge**, **coup**, **coup dans le dos**, **lancer**, **se soigner** ou **inspecter** (touche <kbd>F</kbd>, nouveau).

- L'animation actuelle du jeu est d'abord **recopiée en clés** : on la modifie au lieu de partir de zéro.
- On choisit une pièce (arme entière, main droite, main gauche, chargeur, culasse, pompe, barillet, canons, munition, corde...) dans la liste en bas ou en cliquant dessus, puis on la **déplace ou on la tourne** avec les flèches de couleur (ou les cases à droite). Chaque changement pose une **clé** au temps actuel ; entre deux clés, le mouvement se calcule tout seul. Une clé « arrêt » (carré) fait marquer une petite pause à la pièce.
- **Durées** : pour la recharge, la pompe, les coups, le lancer et le soin, la durée est **imposée par le jeu** (affichée à droite) : l'animation tient exactement dans ce temps. Pour *prendre en main*, *tir* et *inspecter*, c'est toi qui choisis (la prise en main change aussi le moment où on peut tirer : aux 3/4).
- **Sons** : choisis un son en bas et *Ajouter ici* le place au temps actuel.
- **Tours complets** : une pièce qu'on fait tourner avec les cercles continue dans le même sens même après un demi-tour. Si une ancienne animation fait repartir une pièce en arrière, le bouton *↻ Réparer les tours* devient orange : un clic la remet dans le bon sens.
- **Mains détachées** : sur une clé de main, décoche *Main attachée à l'arme* pour que la main reste en place à l'écran quand l'arme bouge (ex. lancer la poêle en l'air). Les clés détachées sont des losanges creux ; on passe de attaché à détaché en douceur entre deux clés.
- **Sélection de plusieurs clés** : Maj+clic (ou Ctrl+clic) pour en ajouter, ou glisser dans le vide de la frise pour tracer un cadre. Glisser une clé choisie déplace tout le groupe ; Suppr efface la sélection ; Ctrl+A choisit tout ; Ctrl+C puis Ctrl+V recopie les clés à la tête de lecture (pratique pour répéter un pas de danse).
- Raccourcis : Espace lecture (la pause coupe aussi tous les sons), K clé, Suppr effacer, Ctrl+Z / Ctrl+Y annuler / rétablir, Ctrl+S enregistrer, G déplacer, R tourner, ← → image par image, Échap désélectionner.
- **Enregistrer** l'envoie au serveur (fichier `data/fps-animations.json`) : les joueurs l'ont tout de suite, même en pleine partie. *Supprimer mon animation* remet celle d'origine.

Avec les styles d'armes réalistes, l'arme et les mains suivent l'animation, mais les pièces (chargeur...) ne bougent pas séparément.

**Danses et sons** : l'onglet **💃 Danses** de l'atelier sert à créer des danses. On anime tout le corps, le buste, la tête, les bras et les jambes, de la même façon (clés sur la ligne de temps) : chaque partie peut tourner et se déplacer. On choisit une **musique** qui tourne en boucle et des **sons** placés dans le temps. À gauche, *Envoyer des sons…* ajoute tes propres fichiers (MP3 conseillé, 4 Mo maximum, 100 Mo en tout ; rangés dans `data/fps-sons/`). Ils servent aussi pour les animations d'armes. Les danses sont dans `data/fps-danses.json`.

Options d'une danse : *On peut avancer en dansant* (comme le Griddy : on marche sans arrêter la danse, à la vitesse choisie, caméra derrière soi), *Garder l'arme en main*. Des **modèles tout prêts** se chargent d'un clic (dossier `games/fps/public/danses-modeles/`, par exemple « Griddy (amélioré) » calée sur la musique) : on les regarde, on les modifie, puis on enregistre.

En jeu, la touche **B** (ou le bouton 💃 sur tablette) ouvre la liste des danses ; le chiffre lance la danse. On se voit de face (la souris fait tourner la caméra), les autres joueurs voient la danse et entendent la musique autour de toi. Elle s'arrête dès qu'on bouge, saute, tire ou vise.

**Quand on est éliminé** : on voit d'abord son ragdoll, puis la caméra va jusqu'à celui qui nous a éliminé, et il nous fait coucou.

**Dispersion** : les balles s'écartent un peu (beaucoup moins en visant : la visée réduit aussi l'effet des tirs à la suite et des déplacements) (le viseur s'écarte aussi pour le montrer). Elles sont plus précises en visant (clic droit), à l'arrêt et en tirant par petites rafales ; moins précises en courant ou en sautant.

### Les cartes

**Arène**, **Château** (douves, remparts, donjon, passages secrets), **Ville** (rues, immeubles, ponts entre les toits) et **Île tropicale** (plage, cabanes sur pilotis, grotte). Elles sont dans `games/fps/public/cartes/` et sont fabriquées par le programme `games/fps/outils/cartes.py` (il vérifie chaque carte et refuse d'en écrire une avec un problème). Pour les régénérer :

```bash
python3 games/fps/outils/cartes.py
```

### Les sons

Les sons sont dans `games/fps/public/sons/`. Ils viennent de Freesound, Kenney et OpenGameArt et sont **libres** : presque tous en CC0 (domaine public), sauf deux en CC BY 4.0 (`lance_fusee_tir.mp3` par OGsoundFX et `grenade_goupille.mp3` par ryanconway, crédités dans *Réglages*) ; voir `games/fps/public/sons/LICENCES.md` pour l'origine de chacun. Pour changer un son, remplace le fichier `.mp3` par un autre portant le même nom. Si un fichier manque, le jeu fabrique un son de remplacement. Le volume des effets et de la musique se règle dans *Réglages*.

### Régler le jeu

Ouvre `games/fps/public/reglages.json` : dégâts, cadence, taille des chargeurs, dispersion et zoom de chaque arme, vitesse, saut, durée des parties, objectif, force des ragdolls… Les explications sont écrites dans le fichier. Modifie les nombres, puis relance avec :

```bash
sudo docker compose restart
```

### Mon personnage (personnalisation)

Le personnage est **commun à tout le site** : il sert dans Arena FPS et dans Caméléon. On l'ouvre depuis le menu du site (**Mon personnage**, adresse `/personnage`), depuis le hall de Caméléon, ou depuis le hall d'Arena FPS (bouton **Mon personnage**). Venant du site ou de Caméléon, l'atelier s'ouvre tout seul et, en le fermant, on revient d'où l'on vient. (Côté serveur : `server/personnages.js`, qui utilise les règles et la table d'Arena FPS.)

- **Visage** : on le dessine pixel par pixel (8 × 8, comme Minecraft), ou on prend une **photo** que la tablette transforme en pixels, avec des effets rigolos (Pop art, Zombie, Alien, Robot…). La photo ne quitte jamais l'appareil : seuls les 64 petits carrés de couleur sont envoyés et enregistrés, on ne peut donc pas reconnaître l'élève.
- **Tête** (peau, yeux, coiffure), **haut** (t-shirt, sweat, veste, maillot…), **bas et chaussures**, **chapeau** (casquette, couronne, cowboy, astronaute…) et **accessoires** (lunettes, casque audio, sac à dos, cape, jetpack, ailes, écharpe…).
- Le personnage est enregistré sur le serveur et les autres joueurs le voient. En mode équipes, la couleur principale du haut devient celle de l'équipe.

La liste des choix (couleurs, vêtements…) est dans `games/fps/public/catalogue-apparence.json`. Il n'y a pas de contrôle des visages dessinés ; si un élève abuse, tu peux toujours bloquer son compte depuis le panneau admin.

### La bande-annonce

Sur l'accueil du site, la carte d'Arena FPS montre une **boucle muette de 15 s** (elle ne se charge que quand la carte est à l'écran) et un bouton **Bande-annonce** qui ouvre la vidéo complète (50 s, avec musique et bruitages). Les fichiers sont dans `games/fps/public/` (`bande-annonce.mp4`, `bande-annonce-boucle.mp4`) et sont déclarés dans `games/fps/manifest.json` (`"bandeAnnonce"`). N'importe quel jeu peut avoir sa bande-annonce de la même façon.

La vidéo est fabriquée avec **HyperFrames** dans `videos/arena-fps-casting/` (ce dossier n'est pas copié dans le site). Les images sont calculées en 3D avec les vrais modules du jeu (`src/moteur.js`), les textes sont dans `compositions/`, les bruitages viennent des sons du jeu (`src/bruitages.py`) et la musique du catalogue HeyGen. Pour la refaire après une modification :

```bash
cd ~/jeu-college/videos/arena-fps-casting
~/.local/bin/hyperframes check
~/.local/bin/hyperframes render --quality delivery --output renders/bande-annonce.mp4
```

## Le jeu Caméléon (cache-cache)

Cache-cache en blocs, façon « Meccha Chameleon » : les **cacheurs se peignent aux couleurs du décor** pour devenir invisibles, les **chercheurs** les trouvent au **pistolet à peinture**. Dossier `games/cameleon/`.

- **Une manche** : **1 chercheur pour 4 joueurs** (2 à partir de 5, 3 à partir de 9…). **60 s de cachette** (les chercheurs ont les yeux bandés et ne bougent pas), puis **3 minutes de recherche**. Un cacheur touché devient chercheur. Les chercheurs gagnent s'ils trouvent tout le monde, sinon les cacheurs gagnent. Puis une nouvelle manche, avec de nouveaux chercheurs (ceux qui l'ont été le moins souvent).
- **Cacheur** : vue à la 3e personne (molette : distance de la caméra). <kbd>P</kbd> ouvre le **panneau de peinture** : 💧 *pipette* (on clique sur le décor, à côté du panneau, pour prendre la couleur telle que les chercheurs la voient), 🪣 *remplir* (une partie du corps d'un coup : tête, corps, un bras, une jambe), 🖌 *pinceau* (1 à 5 pixels, sur l'aperçu 3D), *annuler*, *tout en blanc*, *mon perso*. Marche au doigt sur iPad. **Poses** : <kbd>1</kbd> statue, <kbd>2</kbd> accroupi, <kbd>3</kbd> allongé (bouger remet debout). <kbd>L</kbd> pose un **leurre** (une copie immobile, une fois par manche). Toutes les 30 s, chaque cacheur **siffle** (on entend d'où ça vient).
- **Chercheur** : vue à la 1re personne avec le pistolet à peinture. **Tir raté = bloqué 2,5 s**, tir sur un leurre = bloqué 3,5 s (et le cacheur gagne des points). <kbd>R</kbd> **radar** une fois par manche : des flèches montrent la direction des cacheurs pendant 2 s.
- **Points** : +100 par cacheur trouvé, +10 toutes les 10 s cachées, +50 si on tient jusqu'au bout, +25 si son leurre piège un chercheur.
- **Seul ?** *Jouer avec des bots* → **Me cacher** ou **Chercher** : la partie démarre tout de suite à 4 (bots compris). Les bots cacheurs courent vers une cachette, prennent une pose et se peignent avec les couleurs du meuble à côté et du sol ; les bots chercheurs fouillent les cachettes, entendent les sifflets et repèrent plus facilement un cacheur mal camouflé, proche ou qui bouge (ils peuvent aussi se tromper).
- **À plusieurs** : *Créer un salon* (au choix : Maison, Jardin, Entrepôt) et donner le code de 4 lettres ; la partie démarre 20 s après l'arrivée du 2e joueur, ou avec *Commencer*. Quelqu'un qui arrive en pleine manche joue côté chercheurs.
- **Cartes** (dans `games/cameleon/public/cartes/`, fabriquées par `python3 games/cameleon/outils/cartes.py`) : **Maison** (salon, cuisine, couloir, chambre, salle de bain, garage, jardin), **Jardin** (labyrinthe de haies, massifs de fleurs, fontaine, serre, cabane, aire de jeux, potager), **Entrepôt** (rayonnages pleins de caisses colorées, conteneurs où l'on peut entrer, chariot élévateur, quai, bureau vitré). Les matières de couleur (`#rrggbb`, `raye:`, `damier:`, `pois:`, `tissu:`) sont dessinées par `games/fps/public/js/textures.js`.
- **Réglages** : `games/cameleon/public/reglages.json` (durées, pénalités, nombre de bots, points…), puis `sudo docker compose restart`.
- Le serveur est l'arbitre (`games/cameleon/serveur/salon.js`, bots dans `serveur/bots.js`) : il vérifie les vitesses, les tirs (pas à travers les murs), la peinture (seulement une image PNG, seulement pour un cacheur) et les rôles.

---

## Sécurité (ce qui est déjà en place)

- Inscription **uniquement avec un code d'invitation**. Pas d'e-mail ni de nom réel : seulement un pseudo, filtré (mots grossiers, pseudos réservés…).
- Mots de passe **hachés** (scrypt), jamais stockés en clair. Les essais de connexion sont limités pour bloquer les attaques par force brute.
- Cookies de session `HttpOnly` et `SameSite`, `Secure` en HTTPS. Les requêtes venant d'un autre site sont refusées.
- Requêtes SQL préparées (contre l'injection SQL), échappement de tout texte affiché et en-tête `Content-Security-Policy` (contre le XSS).
- Pas de chat libre.
- Le journal ne contient ni pseudo, ni mot de passe, ni adresse IP.
- Dans Docker, le site ne tourne pas en administrateur (root).

**Quand ton lien public HTTPS fonctionne**, mets `COOKIE_SECURE=true` dans `docker-compose.yml`, puis relance avec `docker compose up -d`.

### Ton reverse proxy

Il doit transmettre vers `http://127.0.0.1:3000` **avec le support WebSocket** (sinon les statuts « en ligne » et les invitations ne marchent pas). Exemple pour nginx :

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Si ton proxy a une interface graphique (sur ton NAS UGREEN ou ailleurs), cherche une option « WebSocket » et active-la.

## Accès depuis partout (Tailscale Funnel)

Le site peut avoir une **adresse publique en HTTPS**, du type `https://jeu-sjdc.tailXXXX.ts.net`, grâce à **Tailscale Funnel** : rien à ouvrir sur ta box, et les élèves n'ont **rien à installer** (pas de VPN, juste le lien). Le conteneur `jeu-sjdc-tailscale` (dans `docker-compose.yml`) s'en occupe ; le site reste aussi accessible chez toi par `http://IP-DU-NAS:3000`.

**Une seule fois :**

1. Crée un compte gratuit sur https://login.tailscale.com (avec Google, Microsoft ou GitHub).
2. Lance (ou relance) le site : `sudo docker compose up -d --build`
3. Connecte le NAS à ton compte : `sudo docker logs jeu-sjdc-tailscale` → ouvre le lien `https://login.tailscale.com/a/…` affiché, et accepte.
4. Ouvre le site au public : `sudo docker exec jeu-sjdc-tailscale tailscale funnel --bg http://site:3000`
   - Si la commande affiche un lien pour activer Funnel (ou HTTPS) sur ton compte, ouvre-le, accepte, puis relance la même commande.
   - Elle affiche alors l'adresse publique du site.
5. Dans https://login.tailscale.com/admin/machines, sur la machine **jeu-sjdc** : menu **…** → **Disable key expiry** (sinon il faudrait refaire l'étape 3 tous les 6 mois).

**Ensuite :** rien à faire, tout redémarre tout seul avec le NAS. Pour voir l'état : `sudo docker exec jeu-sjdc-tailscale tailscale funnel status`. Pour fermer l'accès public : `sudo docker exec jeu-sjdc-tailscale tailscale funnel reset`.

Le site reste protégé comme avant : seuls les élèves qui ont un **code d'invitation** peuvent créer un compte. Le dossier `./tailscale` contient les clés de connexion du NAS : ne le partage pas.

## Gérer le NAS quand tu n'es pas chez toi (Tailscale, sans UGREENlink)

Le conteneur `nas-tailscale` relie **le NAS lui-même** à ton compte Tailscale. Depuis n'importe où, seulement depuis **tes** appareils (téléphone, PC) connectés à ton compte Tailscale, tu peux ouvrir l'interface du NAS et t'y connecter en SSH. Rien n'est ouvert sur internet et ta box n'est pas modifiée. Ça remplace UGREENlink.

**Une seule fois, chez toi :**
```
cd ~/jeu-college
sudo docker compose up -d
sudo docker compose logs tailscale-nas | grep -i login.tailscale.com
```
Ouvre le lien affiché (`https://login.tailscale.com/a/…`) et connecte-toi avec **le même compte Tailscale** que pour le site. Ensuite, dans https://login.tailscale.com/admin/machines : sur la ligne **nas-maison**, menu `…` → **Disable key expiry**, sinon l'accès s'arrête au bout de 6 mois.

**Sur ton téléphone ou ton PC :** installe l'application **Tailscale** et connecte-toi avec le même compte. Ensuite, de partout :
- interface du NAS : **http://nas-maison:9999** dans le navigateur ;
- SSH : `ssh Marcel@nas-maison` (PowerShell sur PC, ou l'application **Termius** sur téléphone) ;
- le site : comme d'habitude (https://plycube.fr) ;
- Claude : l'onglet **Code** de l'application Claude (session « NAS jeu-sjdc »).

Si `nas-maison` ne marche pas, utilise l'adresse en `100.x.x.x` affichée dans l'application Tailscale. Si un Wi-Fi bloque Tailscale, passe par la 4G de ton téléphone. Protège bien ton compte Tailscale : c'est la clé pour entrer, alors active la validation en deux étapes sur le compte avec lequel tu t'y connectes (Google, Microsoft…). Après, il faut encore ton mot de passe du NAS.

Les conteneurs redémarrent tout seuls après une panne ou un redémarrage du NAS (`restart: unless-stopped`).

## Ton nom de domaine (Cloudflare Tunnel)

Le site s'affiche avec son propre nom, **https://plycube.fr**, grâce au conteneur `jeu-sjdc-cloudflared` qui le relie à Cloudflare (compte gratuit, sans carte bancaire, HTTPS automatique, aucun port à ouvrir sur la box). Tailscale (ci-dessus) reste disponible en secours.

L'ancienne adresse **jeux-sjdc.fr** marche encore : le site la renvoie vers la même page de plycube.fr (réglage `ANCIENNES_ADRESSES` dans `docker-compose.yml`), donc les anciennes affiches et les liens déjà envoyés restent bons. Les deux noms ont été achetés chez IONOS et sont gérés par Cloudflare (serveurs de noms `ainsley` et `coen`). Pense à garder jeux-sjdc.fr jusqu'à son renouvellement (septembre 2027), puis tu peux le laisser expirer.

Le tunnel a été créé depuis le NAS, sans passer par « Zero Trust » :

```bash
cd ~/jeu-college
# 1. Autoriser le NAS sur ton compte Cloudflare : ouvre le lien affiché, choisis jeux-sjdc.fr, « Authorize »
sudo docker run -it --rm --user "$(id -u):$(id -g)" -e HOME=/home/sjdc -v "$PWD/cloudflared":/home/sjdc/.cloudflared cloudflare/cloudflared:latest tunnel login
# 2. Créer le tunnel
sudo docker run --rm --user "$(id -u):$(id -g)" -e HOME=/home/sjdc -v "$PWD/cloudflared":/home/sjdc/.cloudflared cloudflare/cloudflared:latest tunnel create jeu-sjdc
# 3. Diriger l'ancien nom (et www) vers le tunnel
sudo docker run --rm --user "$(id -u):$(id -g)" -e HOME=/home/sjdc -v "$PWD/cloudflared":/home/sjdc/.cloudflared cloudflare/cloudflared:latest tunnel route dns jeu-sjdc jeux-sjdc.fr
sudo docker run --rm --user "$(id -u):$(id -g)" -e HOME=/home/sjdc -v "$PWD/cloudflared":/home/sjdc/.cloudflared cloudflare/cloudflared:latest tunnel route dns jeu-sjdc www.jeux-sjdc.fr
# 4. Démarrer
sudo docker compose up -d
```

Pour **plycube.fr**, la commande « route dns » ne marche pas (elle ne connaît que le premier domaine). Les deux enregistrements ont été faits à la main dans Cloudflare → `plycube.fr` → **DNS** : type `CNAME`, nom `@` puis `www`, cible `ec5a94e6-af4f-4a38-9aec-c3bf8f1cbe63.cfargotunnel.com`, nuage orange (proxy) allumé. Pour un futur domaine, c'est pareil, plus une ligne `hostname:` dans `cloudflared/config.yml`, puis `sudo docker compose restart cloudflared`.

Dans Cloudflare, sur **chaque** domaine : **Caching** → **Configuration** → **Browser Cache TTL** = « Respect Existing Headers » (sinon, après une mise à jour, les navigateurs mélangent anciens et nouveaux fichiers du jeu), et **SSL/TLS** → mode **Full**.

Le réglage du tunnel est dans `cloudflared/config.yml` (il désigne le tunnel par son identifiant : si un jour tu recrées le tunnel, remplace-le par le nom du nouveau fichier `.json`) ; ses clés (`cert.pem`, `<identifiant>.json`) sont dans le même dossier : ne les partage pas (le dossier n'est pas copié dans l'image Docker). Pour voir l'état : `sudo docker logs jeu-sjdc-cloudflared` (on doit voir « Registered tunnel connection »).

Une affiche A4 à imprimer, avec le QR code qui mène au site, est dans le dossier `affiche/` (`affiche-plycube.pdf`).

**Changement d'adresse :** quand le site passe sur un nouveau nom, tout le monde doit se reconnecter une fois (les connexions sont liées à l'adresse).

### Sur Google

Seule la **page de connexion** de `https://plycube.fr` peut apparaître dans Google (réglage `PUBLIC_URL` dans `docker-compose.yml`). Les pages des élèves, les jeux, l'adresse Tailscale et l'adresse du réseau local restent cachées (`noindex`), `www.plycube.fr` renvoie vers `plycube.fr`, et l'ancienne adresse aussi. La page ne contient que le nom du site : elle sort quand on cherche « plycube », pas sur d'autres recherches. Pour tout cacher à nouveau : enlève la ligne `PUBLIC_URL`, puis `sudo docker compose up -d`.

Pour que Google la trouve vite (une seule fois, avec ton compte Google) :
1. https://search.google.com/search-console → **Ajouter une propriété** → **Domaine** → `plycube.fr`.
2. Valide avec Cloudflare : Google le propose tout seul ; sinon copie l'enregistrement `TXT` (`google-site-verification=…`) dans Cloudflare → `plycube.fr` → **DNS** → **Add record** (Type `TXT`, Name `@`), puis **Valider**.
3. Menu **Sitemaps** → `sitemap.xml` → **Envoyer**.
4. En haut, **Inspection de l'URL** → `https://plycube.fr/connexion` → **Demander l'indexation**. Compte quelques jours à 2 semaines.
5. Sur l'ancienne propriété `jeux-sjdc.fr` (si tu l'avais créée) : **Paramètres** → **Changement d'adresse** → choisis `plycube.fr`. Google transfère tout seul.

---

## Le code sur GitHub (et l'adresse github.io)

- **Code** : https://github.com/alue4/plycube (dépôt **public** : tout le monde peut le lire).
- **Adresse gratuite** : https://alue4.github.io/plycube/ renvoie tout de suite vers l'adresse Tailscale du site (`https://plycube.lleyn-bass.ts.net`), même page (ex. `…/plycube/games/fps/` → Arena FPS). C'est le dossier `docs/` (GitHub Pages) : `index.html` et `404.html` font la redirection, `presentation.html` est une page de présentation de secours. Pour changer d'adresse de destination, remplace-la dans ces deux fichiers.
- **Jamais envoyé** (liste dans `.gitignore`) : la base des joueurs `data/`, les clés `cloudflared/`, `tailscale/`, `tailscale-nas/`, `node_modules/`, les rendus vidéo et la musique HeyGen de la bande-annonce.
- **Envoyer les nouveautés** (git et l'outil `gh` sont installés dans ton dossier, sans sudo ; tu es connecté avec `gh`) :

  ```bash
  git add -A
  git commit -m "Ce qui a changé"
  git push
  ```

  Les commits sont signés avec l'adresse anonyme de GitHub (pas ton e-mail). Pour couper l'accès du NAS à ton compte : GitHub → **Settings** → **Applications** → **GitHub CLI** → **Revoke**.

---

## Commande de mise à jour verrouillée (pour Claude)

Pour que Claude puisse reconstruire et relancer le site tout seul **sans avoir accès à Docker** (Docker donnerait tout le NAS), une seule commande lui est autorisée : `/usr/local/sbin/plycube-maj` (source : `scripts/plycube-maj.sh`). Elle appartient à root, Claude ne peut pas la modifier, et elle utilise une **copie verrouillée** du réglage Docker (`/etc/plycube/docker-compose.yml`).

| Commande | Effet |
|---|---|
| `sudo plycube-maj` | reconstruit et relance le site (comme `sudo docker compose up -d --build`) |
| `sudo plycube-maj redemarrer` | relance seulement le site |
| `sudo plycube-maj etat` | état des conteneurs |
| `sudo plycube-maj journal` | les 150 dernières lignes du journal du site |

Installation (une seule fois, dans le dossier du projet) :

```bash
sudo mkdir -p /etc/plycube
sudo install -o root -g root -m 0644 docker-compose.yml /etc/plycube/docker-compose.yml
sudo install -o root -g root -m 0644 /dev/null /etc/plycube/vide.env
sudo install -o root -g root -m 0755 scripts/plycube-maj.sh /usr/local/sbin/plycube-maj
sudo install -o root -g root -m 0440 scripts/plycube.sudoers /etc/plycube/plycube.sudoers
sudo visudo -cf /etc/plycube/plycube.sudoers && sudo cp -p /etc/plycube/plycube.sudoers /etc/sudoers.d/plycube
```

- **Après une modification de `docker-compose.yml`** : recopie-le dans la version verrouillée (2e ligne ci-dessus), sinon l'ancien réglage reste utilisé.
- **Retirer l'autorisation** : `sudo rm /etc/sudoers.d/plycube`.
- Une mise à jour du système du NAS peut effacer ces fichiers : il suffit de refaire l'installation.

## Sans Docker (pour développer)

Avec Node.js 18 ou plus :

```bash
npm install
npm start          # lance le site sur le port 3000
npm test           # lance les tests automatiques
npm run admin -- creer-admin TonPseudo
```

## En cas de problème

- **Le site ne répond pas** : `docker compose ps` puis `docker compose logs --tail 50`.
- **« port is already allocated »** : un autre programme utilise le port 3000. Change le premier `3000` dans `docker-compose.yml` (ex. `"127.0.0.1:3100:3000"`).
- **« permission denied » avec docker** : ajoute `sudo` devant la commande (ex. `sudo docker compose up -d --build`).
- **Impossible de se connecter en HTTP alors que `COOKIE_SECURE=true`** : normal, ce réglage exige le HTTPS. Remets `auto` pour tester en local.
