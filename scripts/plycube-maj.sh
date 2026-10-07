#!/bin/sh
# Commande verrouillée de Plycube : reconstruire, relancer ou regarder le site. RIEN D'AUTRE.
#
# L'admin du NAS l'installe une fois dans /usr/local/sbin/plycube-maj (propriétaire root : personne d'autre
# ne peut la modifier), et /etc/sudoers.d/plycube autorise Marcel à la lancer sans mot de passe.
# Elle utilise une COPIE verrouillée du réglage Docker : /etc/plycube/docker-compose.yml.
# Modifier docker-compose.yml dans le dossier du projet ne change donc rien tant que l'admin ne l'a pas recopié :
#   sudo install -o root -g root -m 0644 ~/jeu-college/docker-compose.yml /etc/plycube/docker-compose.yml
#
# Utilisation :
#   sudo plycube-maj              reconstruit et relance le site (après une mise à jour du code)
#   sudo plycube-maj redemarrer   relance seulement le site (après un changement dans reglages.json)
#   sudo plycube-maj etat         état des conteneurs
#   sudo plycube-maj journal      les 150 dernières lignes du journal du site
set -eu
PATH=/usr/sbin:/usr/bin:/sbin:/bin
export PATH
# (sudo efface déjà l'environnement ; on s'assure que rien ne redirige Docker ailleurs)
unset DOCKER_HOST DOCKER_CONTEXT DOCKER_CONFIG COMPOSE_FILE COMPOSE_PROJECT_NAME COMPOSE_PROFILES COMPOSE_ENV_FILES

PROJET=/home/Marcel/jeu-college
REGLAGE=/etc/plycube/docker-compose.yml
VIDE=/etc/plycube/vide.env   # fichier vide : le .env du projet n'est jamais lu

cd "$PROJET"
dc() {
  docker compose --env-file "$VIDE" -f "$REGLAGE" --project-directory "$PROJET" -p jeu-college "$@"
}

case "${1:-maj}" in
  maj) dc up -d --build ;;
  redemarrer) dc restart site ;;
  etat) dc ps ;;
  journal) dc logs --tail 150 --no-color site ;;
  *) echo "Utilisation : sudo plycube-maj [maj|redemarrer|etat|journal]" >&2; exit 2 ;;
esac
