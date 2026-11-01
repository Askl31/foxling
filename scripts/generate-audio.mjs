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

for (const e of todo) {
  const file = join(outDir, `${e.slug}.mp3`);
  try {
    const res = await fetch('https://api.mistral.ai/v1/audio/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({ model: MODEL, input: e.text, voice_id: VOICE, response_format: 'mp3' }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`HTTP ${res.status} ${err?.error?.message ?? ''}`.trim());
    }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(file, buf);
    done++;
    if (done % 25 === 0) console.log(`  …${done}/${todo.length}`);
  } catch (err) {
    failed++;
    console.error(`  ❌ ${e.slug}: ${err.message}`);
  }
}

const report = { generatedAt: new Date().toISOString(), model: MODEL, voice: VOICE, done, skipped, failed, total: manifest.entries.length };
writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 2));
console.log(`✅ Terminé : ${done} générés, ${skipped} déjà présents, ${failed} échecs → public/audio/`);
console.log(`   Rapport : public/audio/report.json`);
