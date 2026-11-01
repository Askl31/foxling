#!/usr/bin/env node
/**
 * Construit la banque d'histoires PRÉ-GÉNÉRÉES, localement et déterministiquement,
 * et l'écrit dans src/content/generated-stories.json (commitée ensuite).
 *
 * Aucune clé API nécessaire : génération 100 % locale. La banque résultante est
 * validée (liste blanche) puis couverte par les tests vitest du dépôt.
 *
 * Usage : node scripts/build-story-bank.mjs [--count 60]
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const count = Number(process.argv.find((a, i) => process.argv[i - 1] === '--count') ? process.argv[process.argv.indexOf('--count') + 1] : 60);

const curriculum = readFileSync(join(root, 'src/content/curriculum.ts'), 'utf-8');
const wordIds = [...curriculum.matchAll(/w[23]?\('([^']+)'/g)].map((m) => m[1]);
const themes = [...new Set([...curriculum.matchAll(/w[23]?\('([^']+)',\s*'[^']+',\s*'([^']+)'/g)].map((m) => m[2]))].filter((t) => t !== 'chunks');

const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'am', 'he', 'she', 'it', 'and', 'to', 'foxy', 'what', 'does', 'do', 'sees', 'see', 'i', 'you', 'we', 'my', 'your', 'this', 'that', 'here', 'on', 'in', 'at', 'of', 'with', 'or', 'not', 'now', 'up', 'down', 'all', 'too', 'so', 'oh', 'yes', 'no', 'bye', 'hi', 'hello', 'thank', 'please', 'sorry', 'who', 'how', 'many', 'color', 'look', 'touch', 'count', 'say', 'says', 'go', 'goes', 'has', 'have', 'want', 'wants', 'like', 'likes', 'yummy', 'yum', 'beep', 'choo', 'roar', 'rawr', 'ribbit', 'plip', 'plop', 'good', 'night', 'fine', 'friend', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'big', 'small', 'soft', 'warm', 'well', 'tight', 'nice', 'grows', 'swings', 'smile', 'soon', 'them', 'high']);
const ALLOWED = new Set([...wordIds, ...STOP, 'name']);

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = ['{name}'];
const PASSIONS = [['dinosaurs'], ['princesses'], ['cars'], ['animals'], ['space'], []];

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z'\s-]/g, ' ').split(/\s+/).filter(Boolean).map((t) => t.replace(/'/g, ''));
}

function validate(story, name) {
  if (!story.pages || story.pages.length < 3 || story.pages.length > 8) return 'pages 3-8';
  const bad = [];
  for (const p of story.pages) {
    for (const t of tokenize(p.text)) {
      if (!ALLOWED.has(t) && t !== name.toLowerCase() && !(t.endsWith('s') && t.length > 3 && ALLOWED.has(t.slice(0, -1)))) bad.push(t);
    }
    if (p.text.split(/\s+/).filter(Boolean).length > 8) bad.push('phrase>8mots');
    if (p.question) {
      if (!Array.isArray(p.question.choices) || p.question.choices.length < 2) bad.push('choices<2');
      if (typeof p.question.answerIndex !== 'number') bad.push('answerIndex');
    }
  }
  return bad.length ? [...new Set(bad)].join(',') : null;
}

function genOne(seed) {
  const rand = mulberry32(seed);
  const theme = themes[seed % themes.length];
  const pool = wordIds.filter((id) => themeOf(id) === theme && !['questions'].includes(themeOf(id)));
  const actors = pool.length >= 3 ? pool : wordIds.filter((id) => ['farm', 'food', 'nature', 'toys', 'wild', 'home'].includes(themeOf(id)));
  const name = '{name}';
  const chars = [];
  const copy = [...actors];
  while (chars.length < 3 + Math.floor(rand() * 2) && copy.length) chars.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  const pages = [];
  chars.forEach((c, i) => {
    const next = chars[(i + 1) % chars.length];
    const withArticle = !['red','blue','yellow','green','orange','purple','pink','black','white','brown','one','two','three','four','five','six','seven','eight','nine','ten'].includes(c);
    const a = withArticle ? `a ${c}` : c;
    const b = withArticle ? `a ${next}` : next;
    const t = rand() < 0.5
      ? `${name} sees ${a}. What do you see?`
      : `Look! ${name} sees ${a}!`;
    pages.push({
      text: t,
      imageHint: c,
      question: { prompt: 'What do you see?', choices: [next, c, chars[(i + 2) % chars.length] ?? c].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 3), answerIndex: 0 },
    });
    void b;
  });
  pages.push({ text: `Bye bye, {name}!`, imageHint: 'foxy', question: null });
  return { id: `gen-${theme}-${seed}`, theme, title: `${name} sees…`, pages };
}

function themeOf(id) {
  const m = curriculum.match(new RegExp(`w[23]?\\('${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\\s*'[^']+',\\s*'([^']+)'`));
  return m ? m[1] : 'farm';
}

const stories = [];
let seed = 1;
while (stories.length < count && seed < count * 20) {
  const s = genOne(seed++);
  const err = validate(s, 'Foxy');
  if (!err) stories.push(s);
  else process.stdout.write(`⚠️ seed ${seed - 1}: ${err}\n`);
}
mkdirSync(join(root, 'src/content'), { recursive: true });
writeFileSync(
  join(root, 'src/content/generated-stories.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), generator: 'local-deterministic', count: stories.length, stories }, null, 2),
);
console.log(`✅ ${stories.length} histoires générées et validées → src/content/generated-stories.json`);
