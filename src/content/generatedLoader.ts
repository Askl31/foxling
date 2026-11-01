import generated from './generated-stories.json';
import { STORY_BANK, storyBankFor, withChildName } from './storyBank';
import { wordById } from './curriculum';
import { wordArt } from './art';
import type { Story } from '../engine/types';

interface GeneratedPage {
  text: string;
  imageHint: string;
  question: { prompt: string; choices: string[]; answerIndex: number } | null;
}

interface GeneratedStory {
  id: string;
  theme: string;
  title: string;
  pages: GeneratedPage[];
}

const raw = (generated as unknown as { stories: GeneratedStory[] }).stories;

function toStory(g: GeneratedStory): Story {
  return {
    id: g.id,
    theme: g.theme,
    title: g.title,
    pages: g.pages.map((p) => {
      const w = p.imageHint && wordById(p.imageHint);
      return {
        text: p.text,
        svg: w ? w.svg : p.imageHint === 'foxy' ? 'foxy:happy' : wordArt(p.imageHint),
        question: p.question
          ? { prompt: p.question.prompt, choices: p.question.choices, answerIndex: p.question.answerIndex }
          : undefined,
      };
    }),
  };
}

export const GENERATED_STORIES: Story[] = raw.map(toStory);
export const ALL_STORIES: Story[] = [...STORY_BANK, ...GENERATED_STORIES];

export function storyOfTheDay(profileId: string, dateISO: string): Story {
  let h = 0;
  const s = `${profileId}:${dateISO}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return ALL_STORIES[h % ALL_STORIES.length];
}

export { storyBankFor, withChildName };
