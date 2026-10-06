# ---- Étape 1 : installation des dépendances ----
# Les outils de compilation servent seulement si la base SQLite doit être
# compilée pour ton processeur (ex : NAS ARM). Ils ne sont pas gardés à la fin.
FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---- Étape 2 : l'image finale, légère ----
FROM node:20-bookworm-slim
ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/app/data
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Sur un NAS, les fichiers copiés peuvent n'être lisibles que par root :
# on les rend lisibles par tous (sans les rendre modifiables).
RUN find /app -path /app/node_modules -prune -o -exec chmod a+rX {} + \
 && mkdir -p /app/data \
 && chown node:node /app/data \
 && chmod +x /app/docker-entrypoint.sh
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server/index.js"]
