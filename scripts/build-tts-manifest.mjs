#!/usr/bin/env node
/**
 * Construit le manifeste TTS complet (public/audio/manifest.json) :
 *  - chaque mot du curriculum (texte isolé)
 *  - prompts des jeux : « Show me the X! », « Where is the X? Find it! », « Simon says: X! », « Feed Foxy the X! »
 *  - chaque ligne de chanson
 *  - toutes les répliques fixes de Foxy (encouragements, consignes, erreurs, rituels)
 *
 * Résultat : 100 % de couverture offline avec voix IA Voxtral, zéro fallback robotique.
 *
 * Usage : node scripts/build-tts-manifest.mjs
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function slugify(text) {
  const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return `${base}-${(h % 46656).toString(36)}`;
}

const curriculum = readFileSync(join(root, 'src/content/curriculum.ts'), 'utf-8');
// Capture w, w2, w3 avec gestion des guillemets simples ET doubles (ex: "What's this?")
const words = [...curriculum.matchAll(/w[23]?\('([^']+)',\s*(?:"([^"]+)"|'([^']+)')/g)].map((m) => ({
  id: m[1],
  text: m[2] || m[3],
}));

// extraction des chansons depuis le bloc SONGS
const songsBlock = curriculum.slice(curriculum.indexOf('export const SONGS'));
const songEntries = [...songsBlock.matchAll(/id: '([^']+)',[\s\S]*?lines: \[([\s\S]*?)\],/g)].map((m) => ({
  id: m[1],
  lines: [...m[2].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((l) => l[1].replace(/\\'/g, "'")),
}));

const FIXED_PHRASES = [
  "Hello, hello! Let's play with Foxy!",
  "Ready to play with Foxy?",
  "Yes! Well done!",
  "Wow! Amazing!",
  "Hmm, try again!",
  "Good job!",
  "Here it is!",
  "Where is it? Find it!",
  "Foxy is hungry! Feed Foxy!",
  "Sing with me!",
  "Say it with me!",
  "I heard you! Well done!",
  "Watch Foxy!",
  "New word!",
  "Got it!",
  "Let's go!",
  "Well done!",
  "Foxy is going to sleep now. See you soon!",
  "Bye bye!",
  "Touch it!",
  "No, no! Try again!",
  "Done!",
  "Yum yum! Thank you!",
  "Great job!",
  "You found it!",
  "You sing so well!",
  "Again! You can do it!",
  "Let's look together! Watch Foxy!",
  "This one! Touch it!",
];

const entries = [];
const seenSlugs = new Set();

function getTtsInput(text) {
  // Contourne les faux positifs de modération Mistral AI (HTTP 403 sur "black", "white", "daddy" isolés)
  if (text === 'Show me the black!') return 'Show me the color black!';
  if (text === 'Where is the black? Find it!') return 'Where is the color black? Find it!';
  if (text === 'Simon says: black!') return 'Simon says: touch the color black!';
  if (text === 'Show me the white!') return 'Show me the color white!';
  if (text === 'Simon says: white!') return 'Simon says: touch the color white!';
  if (text === 'Show me the daddy!') return 'Show me daddy!';
  return text;
}

function addEntry(text, kind) {
  const slug = slugify(text);
  if (!seenSlugs.has(slug)) {
    seenSlugs.add(slug);
    const ttsInput = getTtsInput(text);
    const entry = { slug, text, kind };
    if (ttsInput !== text) entry.ttsInput = ttsInput;
    entries.push(entry);
  }
}

const clean = (t) => t.replace(/ down| up| around/g, '');

for (const w of words) {
  const c = clean(w.text);
  // Mot isolé (carte de présentation, prononciation de base)
  addEntry(w.text, 'word');
  // Prompts des mini-jeux
  addEntry(`Show me the ${c}!`, 'prompt-show-me');
  addEntry(`Where is the ${c}? Find it!`, 'prompt-hide-seek');
  addEntry(`Simon says: ${w.text}!`, 'prompt-simon-says');
  addEntry(`Feed Foxy the ${c}!`, 'prompt-feed-foxy');
}

for (const s of songEntries) {
  s.lines.forEach((line) => {
    addEntry(line, 'song');
  });
}

for (const f of FIXED_PHRASES) {
  addEntry(f, 'fixed');
}

mkdirSync(join(root, 'public/audio'), { recursive: true });
const manifest = { generatedAt: new Date().toISOString(), voice: 'voxtral-mini-tts-3-0', count: entries.length, entries };
writeFileSync(join(root, 'public/audio/manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`✅ ${entries.length} entrées TTS → public/audio/manifest.json`);
console.log(`   mots=${words.length}, chansons=${songEntries.length}, phrases fixes=${FIXED_PHRASES.length}`);
