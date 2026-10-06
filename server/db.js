// Base de données SQLite : un seul fichier (data/site.db).
// Toutes les requêtes utilisent des paramètres "?" : c'est ce qui protège
// contre les injections SQL (on ne colle JAMAIS du texte utilisateur dans le SQL).
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const config = require('./config');

fs.mkdirSync(config.dataDir, { recursive: true });
const db = new Database(path.join(config.dataDir, 'site.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

// Chaque "migration" fait évoluer le schéma. On ajoute les futures à la fin
// de la liste : la base sait lesquelles ont déjà été appliquées (user_version).
const migrations = [
  `
  CREATE TABLE users (
    id            INTEGER PRIMARY KEY,
    username      TEXT NOT NULL,
    username_key  TEXT NOT NULL UNIQUE,       -- pseudo en minuscules, pour l'unicité
    pass_hash     TEXT NOT NULL,
    is_admin      INTEGER NOT NULL DEFAULT 0,
    is_blocked    INTEGER NOT NULL DEFAULT 0,
    invite_id     INTEGER REFERENCES invite_codes(id) ON DELETE SET NULL,
    created_at    INTEGER NOT NULL,
    last_seen     INTEGER
  );

  CREATE TABLE invite_codes (
    id          INTEGER PRIMARY KEY,
    code        TEXT NOT NULL UNIQUE,
    max_uses    INTEGER NOT NULL DEFAULT 1,
    uses        INTEGER NOT NULL DEFAULT 0,
    active      INTEGER NOT NULL DEFAULT 1,
    note        TEXT NOT NULL DEFAULT '',
    created_at  INTEGER NOT NULL
  );

  CREATE TABLE sessions (
    token_hash  TEXT PRIMARY KEY,             -- on ne stocke que l'empreinte du jeton
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  INTEGER NOT NULL,
    expires_at  INTEGER NOT NULL
  );
  CREATE INDEX sessions_user ON sessions(user_id);

  -- Une ligne par demande d'ami. status : 'pending' puis 'accepted'.
  CREATE TABLE friendships (
    id            INTEGER PRIMARY KEY,
    requester_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status        TEXT NOT NULL CHECK (status IN ('pending','accepted')),
    created_at    INTEGER NOT NULL,
    UNIQUE (requester_id, addressee_id)
  );
  CREATE INDEX friendships_addressee ON friendships(addressee_id);

  CREATE TABLE suggestions (
    id          INTEGER PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title       TEXT NOT NULL,
    body        TEXT NOT NULL DEFAULT '',
    status      TEXT NOT NULL DEFAULT 'ouverte'
                CHECK (status IN ('ouverte','planifiee','refusee','masquee')),
    created_at  INTEGER NOT NULL
  );

  CREATE TABLE votes (
    suggestion_id INTEGER NOT NULL REFERENCES suggestions(id) ON DELETE CASCADE,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (suggestion_id, user_id)
  );

  CREATE TABLE roadmap_items (
    id            INTEGER PRIMARY KEY,
    title         TEXT NOT NULL,
    description   TEXT NOT NULL DEFAULT '',
    col           TEXT NOT NULL CHECK (col IN ('en_cours','prochainement','termine')),
    position      INTEGER NOT NULL DEFAULT 0,
    suggestion_id INTEGER REFERENCES suggestions(id) ON DELETE SET NULL,
    created_at    INTEGER NOT NULL
  );
  `,
];

const current = db.pragma('user_version', { simple: true });
for (let v = current; v < migrations.length; v++) {
  db.transaction(() => {
    db.exec(migrations[v]);
    db.pragma(`user_version = ${v + 1}`);
  })();
}

// Ménage régulier des sessions expirées.
function purgeSessions() {
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
}
purgeSessions();
setInterval(purgeSessions, 60 * 60 * 1000).unref();

module.exports = db;
