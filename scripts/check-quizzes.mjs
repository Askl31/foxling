import fs from 'node:fs';
import { wordArt, scenes } from '../src/content/art.ts';
import { WORDS_ALL, wordById } from '../src/content/curriculum.ts';

console.log('Total words in curriculum:', WORDS_ALL.length);

let fallbackCount = 0;
const wordsWithFallback = [];
for (const w of WORDS_ALL) {
  const art = wordArt(w.id);
  if (art === scenes.farm && w.id !== 'farm') {
    fallbackCount++;
    wordsWithFallback.push(w.id);
  }
}
console.log(`Words falling back to default sceneFarm: ${fallbackCount}`, wordsWithFallback);

// Check storyBank
const sbContent = fs.readFileSync('src/content/storyBank.ts', 'utf8');
const pages = [...sbContent.matchAll(/page\('([^']+)',\s*'([^']+)'(?:,\s*\{([^}]+)\})?\)/g)];
console.log('Total pages in storyBank.ts:', pages.length);

let sbQuizErrors = 0;
for (const [full, text, svg, qStr] of pages) {
  if (svg.startsWith('foxy:')) {
    // ok
  } else {
    const art = wordArt(svg);
    if (art === scenes.farm && svg !== 'farm') {
      console.error(`Page with text "${text}" has missing art for svg "${svg}"!`);
      sbQuizErrors++;
    }
  }
  if (qStr) {
    const promptMatch = qStr.match(/prompt:\s*'([^']+)'/);
    const choicesMatch = qStr.match(/choices:\s*\[([^\]]+)\]/);
    const answerIndexMatch = qStr.match(/answerIndex:\s*(\d+)/);
    
    const prompt = promptMatch ? promptMatch[1] : null;
    const choices = choicesMatch ? choicesMatch[1].replace(/['\s]/g, '').split(',') : [];
    const answerIndex = answerIndexMatch ? parseInt(answerIndexMatch[1], 10) : null;
    
    if (!prompt || choices.length < 2 || answerIndex === null) {
      console.error(`Malformed quiz: ${qStr}`);
      sbQuizErrors++;
    }
    for (const c of choices) {
      const art = wordArt(c);
      if (art === scenes.farm && c !== 'farm') {
        console.error(`Choice '${c}' in storyBank page "${text}" has missing art (falls back to farm)!`);
        sbQuizErrors++;
      }
    }
  }
}

// Check generated-stories.json
const gen = JSON.parse(fs.readFileSync('src/content/generated-stories.json', 'utf8'));
let genErrors = 0;
for (const s of gen.stories) {
  for (const p of s.pages) {
    if (p.imageHint && p.imageHint !== 'foxy') {
      const art = wordArt(p.imageHint);
      if (art === scenes.farm && p.imageHint !== 'farm') {
        console.error(`Generated story imageHint '${p.imageHint}' falls back to farm!`);
        genErrors++;
      }
    }
    if (p.question) {
      const { prompt, choices, answerIndex } = p.question;
      if (answerIndex < 0 || answerIndex >= choices.length) {
        console.error(`Generated question out of range answerIndex: ${answerIndex} (choices: ${choices})`);
        genErrors++;
      }
      const ans = choices[answerIndex];
      if (p.imageHint && ans !== p.imageHint) {
        console.error(`Generated question mismatch: answer is '${ans}' but imageHint is '${p.imageHint}'! Text: "${p.text}"`);
        genErrors++;
      }
      for (const c of choices) {
        const art = wordArt(c);
        if (art === scenes.farm && c !== 'farm') {
          console.error(`Generated choice '${c}' falls back to farm!`);
          genErrors++;
        }
      }
    }
  }
}
console.log(`Generated stories check complete. Errors found: ${genErrors}`);
console.log(`StoryBank check complete. Errors found: ${sbQuizErrors}`);
