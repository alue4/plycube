---
format: 1920x1080
duration: 50s
message: "Crée ton perso en blocs et fonce dans l'arène avec tes potes."
arc: Accroche (tête vide) → Valeur (crée ton perso) → Preuves (garde-robe, armes, potes) → Action (l'arène) → Respiration → Logo
audience: Collégiens de 11 à 15 ans (site Jeu SJDC)
mode: collaborative
---

# Arena FPS — « Le casting » (v1)

- **Message** : « Crée ton perso en blocs et fonce dans l'arène avec tes potes. »
- **Public et arc** : collégiens 11-15 ans ; accroche → valeur → preuves → action → respiration → logo.
- **Format** : 1920×1080 (16:9, comme les cartes du site), ~50 s, pas de voix off, musique + bruitages. Tout se comprend sans le son (la boucle de 15 s de la carte est muette).
- **Fil conducteur (spine)** : **le pixel**. La grille 8×8 du visage ouvre le film ; les changements de scène se font en « pixels » (grid dissolve, carrés qui recouvrent l'image) ; le logo final se construit à partir des mêmes pixels (rappel de la scène 01).
- **Images** : fabriquées en 3D avec les vrais modules du jeu (personnages, vêtements du catalogue, armes, cartes) via Three.js — rien n'est une fausse interface : l'écran d'attente et les bandeaux reprennent ceux du jeu.
- **Style (celui du jeu)** : fond nuit #0a0f1d, texte #eef4ff, accent orange #ff8a1f (le « FPS » du titre), bleu #3d8bff, cyan #7fe8ff, rouge #ff5a5a (équipe rouge). Titre très gras, italique, avec ombre portée en relief comme sur l'accueil.
- **Interdits** : pas de sang, pas d'arme braquée sur la caméra, pas de vraie photo d'élève, pas de prénoms réels, pas de lueurs néon gratuites. Éviter le « diaporama » (chaque scène une carte figée) et l'« économiseur d'écran » (du mouvement qui ne dit rien).
- **Plan tenu (respiration)** : scène 10, le ragdoll se pose au ralenti, l'image se fige, une seule phrase.

## Locked

- Plan v1 et croquis v1 validés par l'utilisateur (« oui et oui », puis « oui mais j'espère que c'est en 3D ») : mise en page, textes et enchaînements des 11 scènes figés.
- Rappel de l'utilisateur : tout doit être en vraie 3D (modules du jeu), les croquis n'étaient que la mise en page.

## Version finale (v2, validée le 2026-10-03)

- Durée réelle : 50,0 s, 1920×1080, 60 images/s (rendu `renders/bande-annonce-v2.mp4`, version site `renders/bande-annonce-web.mp4`, boucle muette 15 s `renders/bande-annonce-boucle.mp4`).
- Changements demandés après le brouillon : poêle 2× plus grande et centrée dans le dos ; scène 09 en deux plans (le tireur rouge vu par-dessus l'épaule, puis gros plan « DING ! » à 37,6 s) ; 60 images/s et zoom arrière qui démarre en douceur ; site renommé « Jeu SJDC ».
- Musique : catalogue HeyGen (« fast-paced energetic gaming montage », bgm_002), adoucie pendant le visage et le ralenti, fondu à la fin ; moments clés calés sur ses temps forts.

## Frame 1 — Tête vide

- scene: Gros plan sur une tête en blocs encore vide ; un sourire et des yeux se dessinent pixel par pixel
- duration: 3.5s
- transition_in: cut
- status: animated
- src: compositions/01-tete-vide.html
- blueprint: zoom-out-workspace-reveal (ouverture serrée sur le détail)
- rules: spring-pop-entrance, discrete-text-sequence
- voiceover: onscreen
- type: hook

0–3,5 s. L'écran entier est le visage 8×8 d'un personnage (peau beige, pixels énormes). Un curseur-crayon pose les pixels : deux yeux, puis un sourire qui « clique » en place. Petite étiquette en bas à gauche : « 8 × 8 pixels ». Premier mouvement dans les 0,2 s. Bruitage : petit « clic » à chaque pixel, la musique monte doucement. Contrainte : pas de texte en grand ici, le visage parle seul. Pourquoi : accroche — on comprend tout de suite que c'est TON personnage qu'on fabrique.

## Frame 2 — Le podium

- scene: Zoom arrière continu : la tête appartient à un personnage debout sur le podium lumineux de l'accueil ; « CRÉE TON PERSO » claque à gauche
- duration: 4.5s
- transition_in: cut
- status: animated
- src: compositions/02-podium.html
- blueprint: zoom-out-workspace-reveal (signature : un seul zoom arrière qui ralentit)
- rules: kinetic-beat-slam, ambient-glow-bloom
- voiceover: onscreen
- type: product_intro

3,5–8 s. Un seul zoom arrière qui ralentit révèle le personnage entier (ciel dégradé de l'accueil, anneau lumineux sous ses pieds, cubes qui flottent). Il fait un petit salut de la main. À gauche, « CRÉE TON PERSO » arrive en deux coups sur le temps fort de la musique. Pourquoi : la valeur (le message) est posée dès la 2e scène.

## Frame 3 — La garde-robe

- scene: Le personnage reste au centre ; ses vêtements changent sur chaque temps de la musique ; les étiquettes de catégorie défilent
- duration: 7s
- transition_in: cut
- status: animated
- src: compositions/03-garde-robe.html
- blueprint: fixed-anchor-cycle (le personnage est l'ancre immobile, tout le reste change, de plus en plus vite)
- rules: vertical-spring-ticker, beat-accent (registre)
- voiceover: onscreen
- type: feature_showcase

8–15 s. Le personnage ne bouge pas du centre ; à chaque temps : t-shirt → sweat → maillot, casquette → casque → couronne, cape, lunettes, masque… Les tenues viennent du vrai catalogue du jeu. À droite, une colonne d'étiquettes défile comme une machine à sous : « HAUTS », « BAS », « CHAPEAUX », « CAPES », « ACCESSOIRES ». Le rythme accélère puis s'arrête net sur la tenue finale, avec « 100 % TOI ». Pourquoi : prouve que chacun a un perso unique.

## Frame 4 — L'équipement

- scene: Les 4 emplacements d'armes s'assemblent en cascade, chacun avec sa vraie arme 3D qui tourne ; « 21 ARMES » compte jusqu'à 21
- duration: 6s
- transition_in: grid-dissolve (pixels)
- status: animated
- src: compositions/04-equipement.html
- blueprint: grid-card-assemble
- rules: spring-pop-entrance, counting-dynamic-scale
- voiceover: onscreen
- type: feature_showcase

15–21 s. Quatre cartes comme l'écran « Choisis tes armes » du jeu : « 1 · PRINCIPALE — Fusil d'assaut », « 2 · SECONDAIRE — Revolver », « 3 · MÊLÉE — Poêle à frire », « 4 · GADGET — Grappin ». Chaque arme 3D tourne sur elle-même. En haut à gauche, « 21 ARMES » compte de 0 à 21. Contrainte : aucune arme pointée vers la caméra. Pourquoi : montre le choix d'équipement (4 catégories, 21 armes).

## Frame 5 — Le compte à rebours

- scene: La salle d'attente du jeu : 4 joueurs inventés « ✓ Prêt » ; 3… 2… 1… claquent sur la musique ; coup de sifflet « C'EST PARTI ! »
- duration: 3.5s
- transition_in: cut
- status: animated
- src: compositions/05-compte-a-rebours.html
- blueprint: kinetic-type-beats
- rules: kinetic-beat-slam, spring-pop-entrance
- voiceover: onscreen
- type: product_intro

21–24,5 s. La vraie salle d'attente du jeu : « La partie commence dans », 4 cartes de joueurs avec leur petite tête en pixels (« Bloxi », « Pixa », « Cubo », « Nova »), toutes « ✓ Prêt ». « 3 », « 2 », « 1 » tapent fort au centre, le dernier passe au rouge ; sifflet → « C'EST PARTI ! ». Pourquoi : « avec tes potes » — on joue ensemble, la partie démarre toute seule.

## Frame 6 — Le grand saut

- scene: Le personnage est propulsé par un trampoline ; la caméra le suit en vol au-dessus du château puis de la ville ; « 4 CARTES » ; « FONCE DANS L'ARÈNE »
- duration: 6.5s
- transition_in: grid-dissolve (pixels)
- status: animated
- src: compositions/06-grand-saut.html
- blueprint: camera-journey (B : vol de caméra continu, sans curseur)
- rules: motion-blur-streak, 3d-camera-flight
- voiceover: onscreen
- type: benefit_highlight

24,5–31 s. Le perso saute sur un trampoline bleu fléché (le vrai bloc du jeu) et s'envole ; la caméra le suit, passe au-dessus des tours du château, puis glisse vers les toits de la ville. Étiquettes accrochées au décor : « CHÂTEAU », « VILLE », puis « 4 CARTES ». À la fin : « FONCE DANS L'ARÈNE ». Pourquoi : la 2e moitié du message, et la variété des cartes.

## Frame 7 — Le grappin

- scene: Coupe franche : le perso tire son grappin vers un toit et file le long de la corde
- duration: 3s
- transition_in: cut
- status: animated
- src: compositions/07-grappin.html
- blueprint: camera-journey (A : l'action déclenche, la caméra suit la conséquence)
- rules: motion-blur-streak, viewport-change
- voiceover: onscreen
- type: feature_showcase

31–34 s. Plan de côté : le crochet part, s'accroche au rebord (petit choc), le perso est tiré en diagonale avec des traits de vitesse. Bruitages : tir du grappin, accroche, corde. Pourquoi : un gadget fun, l'action continue.

## Frame 8 — Dans le dos

- scene: Le perso se glisse derrière un joueur rouge, coup de couteau spécial ; bandeau « COUP DANS LE DOS ! » ; le rouge part en ragdoll (étoiles, pas de sang)
- duration: 3s
- transition_in: cut
- status: animated
- src: compositions/08-dans-le-dos.html
- blueprint: kinetic-type-beats (le bandeau du jeu comme payoff)
- rules: kinetic-beat-slam, particle-burst
- voiceover: onscreen
- type: feature_showcase

34–37 s. Le joueur rouge regarde ailleurs ; notre perso arrive derrière, animation spéciale du couteau, « COUP DANS LE DOS ! » (le vrai bandeau du jeu) ; le rouge bascule en ragdoll avec des petites étoiles et des cubes. Contrainte : ni sang ni gros plan sur la lame. Pourquoi : l'attaque spéciale imaginée par toi.

## Frame 9 — Ding !

- scene: Un tir rebondit sur la poêle dans le dos du perso : « DING ! » ; une grenade fait voler trois ragdolls
- duration: 3s
- transition_in: cut
- status: animated
- src: compositions/09-ding.html
- blueprint: kinetic-type-beats
- rules: spring-pop-entrance, particle-burst
- voiceover: onscreen
- type: feature_showcase

37–40 s. De dos : la poêle accrochée sur le dos bloque un tir, étincelle + énorme « DING ! » façon BD. Puis plan large : une grenade rebondit, explosion de cubes, trois ragdolls s'envolent en tournant. Pourquoi : l'humour et les ragdolls rigolos, la signature du jeu.

## Frame 10 — Sans sang, que du fun

- scene: Un ragdoll retombe au ralenti sur un trampoline ; l'image se fige ; « SANS SANG. QUE DU FUN. »
- duration: 3.5s
- transition_in: cut
- status: animated
- src: compositions/10-que-du-fun.html
- blueprint: titlecard-reveal (un seul mouvement retenu, puis immobile)
- rules: depth-of-field-blur
- voiceover: onscreen
- type: benefit_highlight

40–43,5 s. Ralenti sur un ragdoll qui touche le trampoline, puis arrêt sur image (le décor flou derrière). Une seule phrase monte doucement : « SANS SANG. QUE DU FUN. » La musique retient son souffle. Pourquoi : rassure (jeu adapté au collège) et c'est la respiration avant la fin.

## Frame 11 — ARENA FPS

- scene: Les pixels se rassemblent en logo « ARENA FPS » ; « 4 cartes · 21 armes · 2 à 10 joueurs » ; « Joue avec tes potes sur Jeu SJDC »
- duration: 6.5s
- transition_in: grid-dissolve (pixels)
- status: animated
- src: compositions/11-logo.html
- blueprint: logo-assemble-lockup
- rules: depth-scatter-assemble, waterfall-entry
- voiceover: onscreen
- type: branding

43,5–50 s. Des carrés de couleur (les pixels de la scène 01) volent et s'assemblent en « ARENA FPS » (« FPS » en orange, relief comme sur l'accueil). Le perso de la scène 01 arrive à côté et sourit. Dessous, en cascade : « 4 cartes · 21 armes · 2 à 10 joueurs », puis « Joue avec tes potes sur Jeu SJDC ». Rappel : la grille 8×8 de l'ouverture. Pourquoi : on retient le nom et où jouer.
