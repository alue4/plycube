# Affiche « Scanne pour jouer »

- `affiche-plycube.pdf` : l'affiche A4 à imprimer (choisir « Taille réelle » ou « Ajuster à la page »).
- `affiche-plycube.png` : la même en image (300 ppp), pour l'envoyer ou la projeter.
- `qr-plycube.png` / `.svg` : le QR code seul, vers https://plycube.fr (niveau de correction H : il se lit même un peu abîmé).
- `image-podium.jpg` : le perso sur le podium, rendu avec le moteur 3D de la bande-annonce (caméra centrée).
- Les anciens fichiers `affiche-jeu-sjdc.*` et `qr-jeux-sjdc.*` marchent encore (jeux-sjdc.fr renvoie vers plycube.fr), mais imprime plutôt la nouvelle.

Pour refaire le PDF après une modification de `affiche.html` (depuis ce dossier) :

```bash
~/.cache/hyperframes/chrome/chrome-headless-shell/linux-*/chrome-headless-shell-linux64/chrome-headless-shell \
  --no-sandbox --disable-gpu --virtual-time-budget=5000 --no-pdf-header-footer \
  --print-to-pdf=affiche-plycube.pdf "file://$PWD/affiche.html"
pdftoppm -r 300 -png -singlefile affiche-plycube.pdf affiche-plycube
```
