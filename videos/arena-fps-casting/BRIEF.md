---
workflow: general-video
flow: automation
storyboard: yes
message: "Crée ton perso en blocs et fonce dans l'arène avec tes potes."
destination: website
aspect: 1920x1080
language: fr
audience: "Collégiens de 11 à 15 ans (site Jeu SJDC)"
length: 45-60s
angle: casting
---

## Intent

Bande-annonce d'Arena FPS, le jeu de tir multijoueur en blocs du site « Jeu SJDC » (anciennement Jeu SJDC)
(personnages pixelisés façon Minecraft, ragdolls rigolos, **sans sang**). Concept choisi par
l'utilisateur parmi 5 pitchs : **« Le casting »** — un personnage monte sur le podium de
l'accueil, son visage se dessine pixel par pixel, il enfile chapeau, cape, choisit ses armes…
puis il est propulsé dans l'arène. Ouverture : gros plan sur une tête vide 8×8 où un sourire
se dessine. Ton : fun, énergique, façon Fortnite, jamais violent.

Déroulé proposé (validé dans le résumé) : tête vide → sourire qui se dessine → visage et
couleurs → vêtements qui défilent (haut, chapeau, cape, lunettes) → choix des 4 armes →
compte à rebours de la salle d'attente + coup de sifflet → action dans l'arène (grappin,
couteau dans le dos, « ding » de la poêle, ragdolls qui volent) → titre ARENA FPS +
« 4 cartes · 21 armes · 2 à 10 joueurs ».

## Assets

- ../../games/fps/public/js/ — les vrais modules du jeu (personnage.js, apparence.js, armes-modeles.js, monde.js, textures.js, ragdoll.js) : les images sont fabriquées en 3D avec eux (Three.js), pas filmées à l'écran.
- ../../games/fps/public/catalogue-apparence.json — vêtements, chapeaux, accessoires du jeu.
- ../../games/fps/public/cartes/*.json — les 4 cartes (arène, château, ville, île).
- ../../games/fps/public/sons/ — bruitages du jeu (CC0, sauf lance_fusee_tir et grenade_goupille en CC BY 4.0, crédits dans LICENCES.md).
- ../../games/fps/public/jeu.css, lobby.css, cover.svg — couleurs, titre « ARENA FPS », look de l'accueil (référence de style).

## Customizations

- Deux livrables : la vidéo complète 45–60 s avec le son (s'ouvre au clic sur la carte du jeu), et une boucle muette de 15 s (meilleurs moments) pour la carte du jeu, plus légère (réseau du collège).
- Son : musique énergique tirée du **catalogue HeyGen** (choix de l'utilisateur ; il faut être connecté avec `hyperframes auth login --device`), montage calé sur son rythme, + vrais bruitages du jeu (fait : assets/audio/bruitages.mp3, fabriqué par src/bruitages.py).
- Style : celui du jeu (mêmes couleurs, même titre « ARENA FPS » que l'écran d'accueil).
- Personnages inventés, visages dessinés en pixels.

## Notes

- Aucune vraie photo d'élève, aucun prénom réel. Aucun sang, aucune violence réaliste.
- Tout doit se comprendre sans le son (la boucle de la carte est muette) ; textes très lisibles même dans une petite carte 16:9.
- Après validation : intégrer au site (boucle dans la carte, vidéo au clic) et corriger la description du jeu (« 5 armes » → 21 armes en 4 catégories).
- Le NAS rend en mode logiciel (pas de GPU) : rendu lent, rester raisonnable sur les effets lourds.
