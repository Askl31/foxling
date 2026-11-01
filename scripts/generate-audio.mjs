#!/usr/bin/env node
/**
 * Génère tous les fichiers audio TTS (Voxtral) listés dans public/audio/manifest.json
 * et les écrit dans public/audio/<slug>.mp3, prêts à être servis et mis en cache
 * par le service worker (100 % offline ensuite).
 *
 * La clé se lit UNIQUEMENT depuis l'environnement :
 *   MISTRAL_API_KEY=sk-... node scripts/generate-audio.mjs [--limit 50] [--force]
 *
 * Coût indicatif : ~13 $ / 1M caractères. Les 332 entrées ≈ 7 000 caractères ≈ 0,0001 $.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEY = process.env.MISTRAL_API_KEY;
if (!KEY) {
  console.error('❌ MISTRAL_API_KEY manquante. Lancez :');
  console.error('   MISTRAL_API_KEY=sk-... node scripts/generate-audio.mjs');
  process.exit(1);
}
const args = process.argv.slice(2);
const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;
const force = args.includes('--force');

const manifestPath = join(root, 'public/audio/manifest.json');
if (!existsSync(manifestPath)) {
  console.error('❌ public/audio/manifest.json absent — lancez d\'abord : node scripts/build-tts-manifest.mjs');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
const outDir = join(root, 'public/audio');
mkdirSync(outDir, { recursive: true });

const VOICE = process.env.MISTRAL_TTS_VOICE ?? 'gb_jane_neutral';
const MODEL = 'voxtral-mini-tts-3-0';

let done = 0, skipped = 0, failed = 0;
const todo = manifest.entries.filter((e) => force || !existsSync(join(outDir, `${e.slug}.mp3`))).slice(0, limit);
console.log(`🎙️ ${todo.length} fichiers à générer (modèle ${MODEL}, voix ${VOICE})…`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function genOneWithRetry(e, maxRetries = 3) {
  const file = join(outDir, `${e.slug}.mp3`);
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch('https://api.mistral.ai/v1/audio/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({ model: MODEL, input: e.text, voice_id: VOICE, response_format: 'mp3' }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = `HTTP ${res.status} ${err?.error?.message ?? ''}`.trim();
        const retryable = res.status === 429 || res.status >= 500;
        if (retryable && attempt < maxRetries) {
          const wait = 2000 * attempt + Math.floor(Math.random() * 1000);
          console.error(`  ⏳ ${e.slug}: ${msg} — retry ${attempt}/${maxRetries - 1} dans ${wait} ms`);
          await sleep(wait);
          continue;
        }
        throw new Error(msg);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 200) throw new Error(`MP3 trop petit (${buf.length} o) — réponse invalide`);
      writeFileSync(file, buf);
      return buf.length;
    } catch (err) {
      if (attempt < maxRetries && /fetch failed|ECONNRESET|ETIMEDOUT|network/i.test(String(err.message))) {
        await sleep(2000 * attempt);
        continue;
      }
      throw err;
    }
  }
  throw new Error('échec après retries');
}

for (const e of todo) {
  try {
    const size = await genOneWithRetry(e);
    done++;
    if (done % 25 === 0) console.log(`  …${done}/${todo.length}`);
    void size;
  } catch (err) {
    failed++;
    console.error(`  ❌ ${e.slug}: ${err.message}`);
  }
}

const report = { generatedAt: new Date().toISOString(), model: MODEL, voice: VOICE, done, skipped, failed, total: manifest.entries.length };
writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 2));
console.log(`✅ Terminé : ${done} générés, ${skipped} déjà présents, ${failed} échecs → public/audio/`);
console.log(`   Rapport : public/audio/report.json`);
