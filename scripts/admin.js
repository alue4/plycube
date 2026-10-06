#!/usr/bin/env node
// Outil d'administration en ligne de commande.
//
// Avec Docker (depuis le dossier du projet) :
//   docker compose exec site node scripts/admin.js creer-admin MonPseudo
//   docker compose exec site node scripts/admin.js mot-de-passe MonPseudo
//   docker compose exec site node scripts/admin.js code 30 "Classe de 4e B"
//   docker compose exec site node scripts/admin.js liste-admins
//   docker compose exec site node scripts/admin.js retirer-admin UnPseudo
//   docker compose exec site node scripts/admin.js sauvegarde
//
// Le mot de passe est demandé au clavier (rien ne s'affiche quand tu tapes, c'est normal).

// Dans le conteneur, on travaille avec le même utilisateur que le site (pas root)
// pour que les fichiers de la base gardent les bons droits.
if (process.getuid && process.getuid() === 0) {
  try { process.setgid('node'); process.setuid('node'); } catch { /* hors Docker : on continue */ }
}

const readline = require('readline');

const HELP = `
Commandes disponibles :
  creer-admin <pseudo>               Crée un compte administrateur (ou donne les droits admin à un compte existant)
  mot-de-passe <pseudo>              Change le mot de passe d'un compte
  code [utilisations] [note]         Crée un code d'invitation (1 utilisation par défaut)
  liste-admins                       Affiche les comptes administrateurs
  retirer-admin <pseudo>             Retire les droits admin d'un compte
  sauvegarde                         Copie la base dans data/sauvegardes/ (sans arrêter le site)
`;

let pipedLines = null;
function ask(question, hidden = false) {
  if (!process.stdin.isTTY) {
    // Réponses envoyées par un "tuyau" (scripts, tests) : une ligne par question.
    if (!pipedLines) pipedLines = require('fs').readFileSync(0, 'utf8').split(/\r?\n/);
    process.stdout.write(question + '\n');
    return Promise.resolve(pipedLines.shift() || '');
  }
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: !!process.stdin.isTTY });
    if (hidden && process.stdin.isTTY) {
      // On masque ce qui est tapé.
      rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); };
    }
    rl.question(question, (answer) => {
      if (hidden && process.stdin.isTTY) process.stdout.write('\n');
      rl.close();
      resolve(answer);
    });
  });
}

async function askNewPassword(checkPassword) {
  for (let i = 0; i < 3; i++) {
    const pw = await ask('Nouveau mot de passe (12 caractères ou plus conseillés) : ', true);
    const err = checkPassword(pw);
    if (err) { console.log('  ✗ ' + err); continue; }
    if (pw.length < 12) console.log('  ⚠ Pour un compte admin, 12 caractères ou plus c\'est mieux.');
    const again = await ask('Confirme le mot de passe : ', true);
    if (again !== pw) { console.log('  ✗ Les deux mots de passe sont différents.'); continue; }
    return pw;
  }
  console.log('Abandon.');
  process.exit(1);
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  if (!cmd || cmd === 'aide' || cmd === 'help') { console.log(HELP); return; }

  const db = require('../server/db');
  const { hashPassword, randomCode } = require('../server/security');
  const { checkPassword } = require('../server/routes/auth');
  const findUser = (name) => db.prepare('SELECT * FROM users WHERE username_key = ?').get(String(name || '').toLowerCase());

  switch (cmd) {
    case 'creer-admin': {
      const name = args[0];
      if (!name || !/^[A-Za-z0-9_-]{3,16}$/.test(name)) {
        console.log('Pseudo invalide : 3 à 16 caractères, lettres sans accents, chiffres, "_" ou "-".');
        process.exit(1);
      }
      const existing = findUser(name);
      if (existing) {
        db.prepare('UPDATE users SET is_admin = 1, is_blocked = 0 WHERE id = ?').run(existing.id);
        console.log(`✓ Le compte "${existing.username}" est maintenant administrateur.`);
        return;
      }
      const pw = await askNewPassword(checkPassword);
      db.prepare(`INSERT INTO users (username, username_key, pass_hash, is_admin, created_at) VALUES (?, ?, ?, 1, ?)`)
        .run(name, name.toLowerCase(), await hashPassword(pw), Date.now());
      console.log(`✓ Compte administrateur "${name}" créé. Connecte-toi sur le site puis va dans "Admin".`);
      return;
    }
    case 'mot-de-passe': {
      const u = findUser(args[0]);
      if (!u) { console.log('Compte introuvable.'); process.exit(1); }
      const pw = await askNewPassword(checkPassword);
      db.prepare('UPDATE users SET pass_hash = ? WHERE id = ?').run(await hashPassword(pw), u.id);
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(u.id);
      console.log(`✓ Mot de passe de "${u.username}" changé (déconnecté de tous ses appareils).`);
      return;
    }
    case 'code': {
      const uses = Math.min(500, Math.max(1, parseInt(args[0] || '1', 10) || 1));
      const note = (args.slice(1).join(' ') || '').slice(0, 60);
      const code = randomCode(8);
      db.prepare('INSERT INTO invite_codes (code, max_uses, note, created_at) VALUES (?, ?, ?, ?)').run(code, uses, note, Date.now());
      console.log(`✓ Code d'invitation : ${code}   (${uses} utilisation${uses > 1 ? 's' : ''})`);
      return;
    }
    case 'liste-admins': {
      const rows = db.prepare('SELECT username FROM users WHERE is_admin = 1 ORDER BY username').all();
      console.log(rows.length ? rows.map((r) => ' - ' + r.username).join('\n') : 'Aucun administrateur.');
      return;
    }
    case 'retirer-admin': {
      const u = findUser(args[0]);
      if (!u) { console.log('Compte introuvable.'); process.exit(1); }
      db.prepare('UPDATE users SET is_admin = 0 WHERE id = ?').run(u.id);
      console.log(`✓ "${u.username}" n'est plus administrateur.`);
      return;
    }
    case 'sauvegarde': {
      const path = require('path');
      const fs = require('fs');
      const config = require('../server/config');
      const dir = path.join(config.dataDir, 'sauvegardes');
      fs.mkdirSync(dir, { recursive: true });
      const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      const file = path.join(dir, `site-${stamp}.db`);
      await db.backup(file);
      console.log(`✓ Sauvegarde créée : data/sauvegardes/${path.basename(file)}`);
      return;
    }
    default:
      console.log(`Commande inconnue : ${cmd}`);
      console.log(HELP);
      process.exit(1);
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error('Erreur : ' + e.message); process.exit(1); });
