#!/usr/bin/env node
/**
 * Construit le manifeste TTS complet (public/audio/manifest.json) :
 *  - chaque mot du curriculum (texte isolé + prompt « Show me the X! »)
 *  - chaque ligne de chanson
 *  - les phrases fixes de l'interface enfant
 * Les histoires (texte avec prénom) sont générées à la volée via le proxy /api/tts
 * puis mises en cache localement (CacheStorage) : qualité Voxtral, puis 100 % offline.
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
const words = [...curriculum.matchAll(/w[23]?\('([^']+)',\s*'([^']+)'/g)].map((m) => ({ id: m[1], text: m[2] }));
const songs = [...curriculum.matchAll(/id: '([^']+)‘?,[\s\S]*?lines: \[([\s\S]*?)\]/g)];

// extraction simple des chansons depuis le bloc SONGS
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
];

const entries = [];
const clean = (t) => t.replace(/ down| up| around/g, '');
for (const w of words) {
  entries.push({ slug: slugify(w.text), text: w.text, kind: 'word' });
  entries.push({ slug: slugify(`show me the ${clean(w.text)}`), text: `Show me the ${clean(w.text)}!`, kind: 'prompt' });
}
for (const s of songEntries) {
  s.lines.forEach((line, i) => entries.push({ slug: slugify(`${s.id}-${i}-${line}`), text: line, kind: 'song' }));
}
for (const f of FIXED_PHRASES) {
  entries.push({ slug: slugify(f), text: f, kind: 'fixed' });
}

mkdirSync(join(root, 'public/audio'), { recursive: true });
const manifest = { generatedAt: new Date().toISOString(), voice: 'voxtral-mini-tts-3-0', count: entries.length, entries };
writeFileSync(join(root, 'public/audio/manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`✅ ${entries.length} entrées TTS → public/audio/manifest.json`);
console.log(`   mots=${words.length}, chansons=${songEntries.length}, phrases fixes=${FIXED_PHRASES.length}`);
