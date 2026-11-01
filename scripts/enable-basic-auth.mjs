#!/usr/bin/env node
/**
 * Active le Basic Auth au niveau plateforme (Netlify) via public/_headers.
 *
 * Le mot de passe se fournit UNIQUEMENT ici, jamais commité :
 *   BASIC_AUTH_PASSWORD="votre mot de passe" node scripts/enable-basic-auth.mjs
 * ou interactif :
 *   node scripts/enable-basic-auth.mjs   (demande le mot de passe, saisie masquée)
 *
 * Le hash APR1 généré est écrit dans public/_headers ; seul le HASH est commité,
 * jamais le mot de passe en clair.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const headersPath = join(root, 'public/_headers');
const USERNAME = process.env.BASIC_AUTH_USER ?? 'foxling';

async function askPassword() {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve) => {
    process.stderr.write('Mot de passe Basic Auth (saisie masquée) : ');
    process.stdin.setRawMode?.(true);
    let pw = '';
    process.stdin.on('data', (c) => {
      const ch = c.toString();
      if (ch === '\n' || ch === '\r') {
        process.stdin.setRawMode?.(false);
        process.stderr.write('\n');
        rl.close();
        resolve(pw);
      } else if (ch === '\u0003') {
        process.exit(1);
      } else if (ch === '\u007f') {
        pw = pw.slice(0, -1);
      } else {
        pw += ch;
      }
    });
  });
}

const password = process.env.BASIC_AUTH_PASSWORD ?? (await askPassword());
if (!password || password.length < 8) {
  console.error('❌ Mot de passe requis (8 caractères min). Relancez avec BASIC_AUTH_PASSWORD=... ou en interactif.');
  process.exit(1);
}

const hash = execSync(`printf "%s" "${USERNAME}:${password.replace(/"/g, '\\"')}" | openssl passwd -apr1 -stdin`)
  .toString()
  .trim();

const content = `# Basic Auth plateforme (Netlify) — ACTIVÉ
# Généré par scripts/enable-basic-auth.mjs. Seul le hash APR1 est commité.
# Utilisateur : ${USERNAME}   (mot de passe : celui saisi dans le script, JAMAIS stocké)
/*
  Authorization: Basic ${hash}
  WWW-Authenticate: Basic realm="Foxling", charset="UTF-8"
`;
writeFileSync(headersPath, content);
console.log(`✅ Basic Auth activé dans public/_headers (user=${USERNAME}, hash APR1 généré).`);
console.log(`   Le mot de passe en clair n'a été ni affiché ni écrit dans aucun fichier.`);
console.log(`   Committez puis redéployez : git add public/_headers && git commit -m "chore: active Basic Auth Netlify" && git push`);
console.log(`   Alternative sans fichier : Netlify → Site settings → Password protection.`);

if (existsSync(headersPath)) {
  const check = readFileSync(headersPath, 'utf-8');
  if (check.includes(password)) {
    console.error('❌ ERREUR: le mot de passe en clair a été détecté dans _headers — avorte.');
    process.exit(1);
  }
}
