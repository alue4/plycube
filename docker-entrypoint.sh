#!/bin/sh
# Démarrage du conteneur : on donne le dossier data/ à l'utilisateur "node",
# puis on lance le site avec cet utilisateur (jamais en root).
set -e
if [ "$(id -u)" = "0" ]; then
  chown -R node:node /app/data
  if command -v setpriv >/dev/null 2>&1; then
    exec setpriv --reuid=node --regid=node --init-groups "$@"
  fi
  exec runuser -u node -- "$@"
fi
exec "$@"
