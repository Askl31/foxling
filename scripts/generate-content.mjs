#!/usr/bin/env node
/**
 * Génération de contenu EN AMONT (jamais pendant l'usage par les enfants).
 *
 * Usage :
 *   MISTRAL_API_KEY=... node scripts/generate-content.mjs stories --out src/content/generated-stories.json
 *   MISTRAL_API_KEY=... node scripts/generate-content.mjs stories --count 40 --themes farm,food,colors
 *   MISTRAL_API_KEY=... node scripts/generate-content.mjs audio --out public/audio   (TTS Voxtral)
 *
 * Garde-fous :
 *  - la clé est lue UNIQUEMENT depuis l'environnement (jamais écrite dans un fichier du dépôt) ;
 *  - chaque histoire générée est validée contre la liste blanche du curriculum avant écriture ;
 *  - en cas de lexique invalide, on régénère (max 3 tentatives) puis on échoue proprement.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEY = process.env.MISTRAL_API_KEY;
if (!KEY) {
  console.error('❌ MISTRAL_API_KEY manquante dans l\'environnement.');
  process.exit(1);
}

const curriculum = readFileSync(join(root, 'src/content/curriculum.ts'), 'utf-8');
const wordIds = [...curriculum.matchAll(/w[23]?\('([^']+)'/g)].map((m) => m[1]);
const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'am', 'he', 'she', 'it', 'and', 'to', 'foxy', 'what', 'does', 'do', 'sees', 'see', 'find', 'finds', 'findss', 'likes', 'like', 'i', 'you', 'we', 'my', 'your', 'this', 'that', 'here', 'on', 'in', 'at', 'of', 'with', 'or', 'not', 'now', 'up', 'down', 'all', 'too', 'so', 'oh', 'yes', 'no', 'bye', 'hi', 'hello', 'thank', 'please', 'sorry', 'who', 'how', 'many', 'color', 'look', 'touch', 'count', 'say', 'says', 'go', 'goes', 'has', 'have', 'want', 'wants', 'like', 'likes', 'yummy', 'yum', 'beep', 'choo', 'roar', 'rawr', 'ribbit', 'plip', 'plop', 'big', 'small', 'soft', 'warm', 'good', 'night', 'fine', 'friend', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
const ALLOWED_BASE = new Set([...wordIds, ...STOP]);

const SYSTEM = `You write interactive stories for children aged 4-6 learning English. Rules: only use words from the allowed list; 4-6 pages; max 6 words per sentence; present simple; repetitive Brown-Bear structure; use the child name twice; each page but the last ends with a question (2-3 choices, one correct); imageHint from the allowed image list. Output STRICT JSON: {"title":string,"pages":[{"text":string,"imageHint":string,"question":{"prompt":string,"choices":string[],"answerIndex":number}|null}]}`;

function validateStoryJSON(raw, name) {
  let data;
  try { data = JSON.parse(raw); } catch { return { error: 'JSON invalide' }; }
  if (!data.pages || !Array.isArray(data.pages) || data.pages.length < 3 || data.pages.length > 8) return { error: 'nombre de pages invalide' };
  const bad = [];
  for (const p of data.pages) {
    if (typeof p.text !== 'string') return { error: 'page sans texte' };
    for (const tok of p.text.toLowerCase().replace(/[^a-z'\s-]/g, ' ').split(/\s+/).filter(Boolean)) {
      const t = tok.replace(/'/g, '');
      if (!ALLOWED_BASE.has(t) && t !== name.toLowerCase() && !(t.endsWith('s') && ALLOWED_BASE.has(t.slice(0, -1)))) bad.push(t);
    }
    const n = p.text.split(/\s+/).filter(Boolean).length;
    if (n > 8) bad.push(`phrase trop longue (${n} mots)`);
  }
  if (bad.length) return { error: `lexique hors liste: ${[...new Set(bad)].join(', ')}` };
  return { story: data };
}

/**
 * Mode hybride robuste : le LLM ne rédige PAS l'histoire, il choisit uniquement
 * 3-4 "acteurs" (ids) et un ordre parmi la liste blanche fournie. L'assemblage
 * des pages (phrases <= 6 mots, structure répétitive, questions) est fait
 * localement avec des templates garantis conformes — zéro dérive lexicale.
 */
async function genOne(theme, name, passions, attempt) {
  const themeWords = wordIds.filter((id) => themeOf(id) === theme);
  const pool = themeWords.length >= 3 ? themeWords : wordIds.filter((id) => ['farm', 'food', 'nature', 'toys', 'wild', 'home', 'colors'].includes(themeOf(id)));
  const passionWords = pool.filter((id) => passions.some((pa) => id.includes(pa) || themeOf(id).includes(pa)));
  const actors = passionWords.length >= 3 ? passionWords : pool;

  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: `Pick 3 to 4 items from the CANDIDATES list and return STRICT JSON only: {"actors": string[], "twist": string}. twist must be one of: "sees", "likes", "finds". No commentary.` },
        { role: 'user', content: `CANDIDATES: ${actors.join(', ')}\nChild passions: ${passions.join(', ') || 'none'}\nTheme: ${theme}\nJSON only.` },
      ],
      temperature: 0,
      max_tokens: 120,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = `HTTP ${res.status} ${err?.error?.message ?? ''}`.trim();
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      return genOne(theme, name, passions, attempt + 1);
    }
    throw new Error(msg);
  }
  const data = await res.json();
  const raw = data.choices[0]?.message?.content ?? '{}';
  let picked;
  try { picked = JSON.parse(raw); } catch { picked = null; }
  const validActors = Array.isArray(picked?.actors) ? picked.actors.filter((a) => ALLOWED_BASE.has(String(a))) : [];
  if (validActors.length < 3) {
    if (attempt < 3) return genOne(theme, name, passions, attempt + 1);
    throw new Error('LLM: acteurs invalides');
  }
  const twist = ['sees', 'likes', 'finds'].includes(picked?.twist) ? picked.twist : 'sees';
  const chars = [...new Set(validActors)].slice(0, 4);

  const isColorOrNumber = (id) => ['red','blue','yellow','green','orange','purple','pink','black','white','brown','one','two','three','four','five','six','seven','eight','nine','ten'].includes(id);
  const art = (id) => (isColorOrNumber(id) ? id : `a ${id}`);
  const pages = [];
  chars.forEach((c, i) => {
    const next = chars[(i + 1) % chars.length];
    const t = i % 2 === 0
      ? `${name} ${twist} ${art(c)}. What do you ${twist === 'sees' ? 'see' : twist === 'likes' ? 'like' : 'find'}?`
      : `Look! ${name} ${twist}s ${art(c)}!`;
    pages.push({
      text: t,
      imageHint: c,
      question: { prompt: `What do you ${twist === 'sees' ? 'see' : twist === 'likes' ? 'like' : 'find'}?`, choices: [next, c, chars[(i + 2) % chars.length] ?? c].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 3), answerIndex: 0 },
    });
  });
  pages.push({ text: `Bye bye, ${name}!`, imageHint: 'foxy', question: null });
  const story = { id: `llm-${theme}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`, theme, title: `${name} ${twist}s…`, pages };
  const v = validateStoryJSON(JSON.stringify({ pages: story.pages }), name);
  if (v.error) throw new Error(v.error);
  return story;
}

function themeOf(id) {
  const m = curriculum.match(new RegExp("w[23]?\\('" + id + "',\\s*'[^']+',\\s*'([^']+)'"));
  return m ? m[1] : 'farm';
}

async function main() {
  const [, , cmd, ...rest] = process.argv;
  const opt = Object.fromEntries(rest.filter((a, i) => rest[i - 1]?.startsWith('--')).map((a, i) => [a.replace(/^--/, ''), rest[rest.indexOf(a) + 1] && !rest[rest.indexOf(a) + 1].startsWith('--') ? rest[rest.indexOf(a) + 1] : true]));
  if (cmd === 'stories') {
    const count = Number(opt.count ?? 20);
    const themes = String(opt.themes ?? 'farm,colors,numbers,body,actions,food,family,home,toys,nature,politeness,emotions,vehicles,wild').split(',');
    const name = String(opt.name ?? 'Foxy');
    const passions = String(opt.passions ?? '').split(',').filter(Boolean);
    const out = join(root, String(opt.out ?? 'src/content/generated-stories.json'));
    const stories = [];
    for (let i = 0; i < count; i++) {
      const theme = themes[i % themes.length];
      process.stdout.write(`[${i + 1}/${count}] thème=${theme}… `);
      try {
        const s = await genOne(theme, name, passions, 0);
        stories.push({ id: `llm-${theme}-${i}`, theme, title: s.title, pages: s.pages });
        console.log('✅');
      } catch (e) {
        console.log(`⚠️ ${e.message}`);
      }
    }
    mkdirSync(dirname(out), { recursive: true });
    // FUSION : conserve les histoires existantes du fichier (banque locale + LLM précédents)
    let existing = [];
    try {
      const cur = JSON.parse(readFileSync(out, 'utf-8'));
      existing = Array.isArray(cur.stories) ? cur.stories : (Array.isArray(cur) ? cur : []);
    } catch { /* fichier absent ou invalide */ }
    const ids = new Set(existing.map((x) => x.id));
    const merged = [...existing, ...stories.filter((x) => !ids.has(x.id))];
    writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), model: 'mistral-small-latest', count: merged.length, stories: merged }, null, 2));
    console.log(`\n✅ ${stories.length}/${count} nouvelles histoires validées ; total fichier: ${merged.length} → ${out}`);
  } else if (cmd === 'audio') {
    console.log('Génération audio (TTS Voxtral) : à lancer avec --out public/audio et une liste de textes.');
    console.log('Exemple : MISTRAL_API_KEY=... node scripts/generate-content.mjs audio --out public/audio --texts "cat,dog,duck"');
    const texts = String(opt.texts ?? '').split(',').filter(Boolean);
    const outDir = join(root, String(opt.out ?? 'public/audio'));
    if (!texts.length) { console.error('❌ --texts vide'); process.exit(1); }
    mkdirSync(outDir, { recursive: true });
    for (const t of texts) {
      const res = await fetch('https://api.mistral.ai/v1/audio/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({ model: 'voxtral-mini-tts-3-0', input: t, voice_id: 'gb_jane_neutral', response_format: 'mp3' }),
      });
      if (!res.ok) { console.error(`❌ ${t}: HTTP ${res.status}`); continue; }
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(join(outDir, `${t.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.mp3`), buf);
      console.log(`✅ ${t} → ${buf.length} octets`);
    }
  } else {
    console.log('Usage: node scripts/generate-content.mjs stories|audio [--count N] [--themes a,b] [--name X] [--passions a,b] [--out chemin] [--texts "a,b"]');
  }
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
