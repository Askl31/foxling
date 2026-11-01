// scripts/fix-audio-files.mjs
// Converts all JSON-wrapped audio files in public/audio/*.mp3 into real binary MP3 files.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const audioDir = path.join(root, 'public/audio');

const files = fs.readdirSync(audioDir).filter((f) => f.endsWith('.mp3'));
console.log(`Decoding ${files.length} audio files in public/audio...`);

let converted = 0;
let alreadyBinary = 0;
let errors = 0;

for (const file of files) {
  const filePath = path.join(audioDir, file);
  try {
    const raw = fs.readFileSync(filePath);
    // Check if it starts with {"audio_data"
    const prefix = raw.slice(0, 20).toString('utf8');
    if (prefix.startsWith('{"audio_data"')) {
      const json = JSON.parse(raw.toString('utf8'));
      if (json.audio_data) {
        const bin = Buffer.from(json.audio_data, 'base64');
        fs.writeFileSync(filePath, bin);
        converted++;
      } else {
        console.error(`❌ ${file}: no audio_data property`);
        errors++;
      }
    } else if (raw[0] === 0x49 && raw[1] === 0x44 && raw[2] === 0x33) {
      alreadyBinary++;
    } else if (raw[0] === 0xff && (raw[1] & 0xe0) === 0xe0) {
      alreadyBinary++;
    } else {
      console.warn(`⚠️ ${file}: unknown format`);
    }
  } catch (err) {
    console.error(`❌ Error converting ${file}:`, err.message);
    errors++;
  }
}

console.log(`✅ Conversion complete:`);
console.log(`   - Converted from JSON to binary MP3: ${converted}`);
console.log(`   - Already binary: ${alreadyBinary}`);
console.log(`   - Errors: ${errors}`);
