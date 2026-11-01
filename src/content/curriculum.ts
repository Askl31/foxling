import { wordArt } from './art';
import type { Word, Chunk, Story } from '../engine/types';

export const THEME_COLORS: Record<string, string> = {
  farm: '#8ce99a',
  colors: '#ffd43b',
  numbers: '#ffa94d',
  body: '#ffc9de',
  actions: '#a5d8ff',
  food: '#ff922b',
  family: '#d0bfff',
  default: '#ffe8d6',
};

function w(id: string, text: string, theme: string, kind: Word['kind'], extra: Partial<Word> = {}): Word {
  return { id, text, theme, level: 1, kind, svg: wordArt(id), ...extra };
}

export const WORDS: Word[] = [
  w('cat', 'cat', 'farm', 'noun'),
  w('dog', 'dog', 'farm', 'noun'),
  w('duck', 'duck', 'farm', 'noun'),
  w('fish', 'fish', 'farm', 'noun'),
  w('bird', 'bird', 'farm', 'noun'),
  w('cow', 'cow', 'farm', 'noun'),
  w('horse', 'horse', 'farm', 'noun'),
  w('pig', 'pig', 'farm', 'noun'),
  w('sheep', 'sheep', 'farm', 'noun', { similarTo: ['goat'] }),
  w('rabbit', 'rabbit', 'farm', 'noun'),
  w('mouse', 'mouse', 'farm', 'noun'),
  w('frog', 'frog', 'farm', 'noun'),
  w('red', 'red', 'colors', 'color'),
  w('blue', 'blue', 'colors', 'color'),
  w('yellow', 'yellow', 'colors', 'color'),
  w('green', 'green', 'colors', 'color'),
  w('orange', 'orange', 'colors', 'color'),
  w('purple', 'purple', 'colors', 'color'),
  w('pink', 'pink', 'colors', 'color'),
  w('black', 'black', 'colors', 'color', { similarTo: ['brown'] }),
  w('white', 'white', 'colors', 'color'),
  w('brown', 'brown', 'colors', 'color', { similarTo: ['black'] }),
  w('one', 'one', 'numbers', 'number'),
  w('two', 'two', 'numbers', 'number'),
  w('three', 'three', 'numbers', 'number'),
  w('four', 'four', 'numbers', 'number'),
  w('five', 'five', 'numbers', 'number'),
  w('six', 'six', 'numbers', 'number'),
  w('seven', 'seven', 'numbers', 'number'),
  w('eight', 'eight', 'numbers', 'number'),
  w('nine', 'nine', 'numbers', 'number'),
  w('ten', 'ten', 'numbers', 'number'),
  w('head', 'head', 'body', 'noun'),
  w('hair', 'hair', 'body', 'noun'),
  w('eyes', 'eyes', 'body', 'noun'),
  w('ears', 'ears', 'body', 'noun'),
  w('nose', 'nose', 'body', 'noun'),
  w('mouth', 'mouth', 'body', 'noun'),
  w('teeth', 'teeth', 'body', 'noun'),
  w('arms', 'arms', 'body', 'noun'),
  w('hands', 'hands', 'body', 'noun'),
  w('legs', 'legs', 'body', 'noun'),
  w('feet', 'feet', 'body', 'noun'),
  w('tummy', 'tummy', 'body', 'noun'),
  w('jump', 'jump', 'actions', 'verb', { gesture: 'sauter' }),
  w('run', 'run', 'actions', 'verb', { gesture: 'courir' }),
  w('stop', 'stop', 'actions', 'verb', { gesture: 'stop' }),
  w('clap', 'clap', 'actions', 'verb', { gesture: 'frapper dans ses mains' }),
  w('touch', 'touch', 'actions', 'verb', { gesture: 'toucher' }),
  w('sit', 'sit down', 'actions', 'verb', { gesture: 's\'asseoir' }),
  w('stand', 'stand up', 'actions', 'verb', { gesture: 'se lever' }),
  w('turn', 'turn around', 'actions', 'verb', { gesture: 'tourner sur soi-même' }),
  w('dance', 'dance', 'actions', 'verb', { gesture: 'danser' }),
  w('sleep', 'sleep', 'actions', 'verb', { gesture: 'dormir' }),
  w('eat', 'eat', 'actions', 'verb', { gesture: 'manger' }),
  w('drink', 'drink', 'actions', 'verb', { gesture: 'boire' }),
  w('apple', 'apple', 'food', 'noun'),
  w('banana', 'banana', 'food', 'noun'),
  w('milk', 'milk', 'food', 'noun'),
  w('water', 'water', 'food', 'noun'),
  w('bread', 'bread', 'food', 'noun'),
  w('cheese', 'cheese', 'food', 'noun'),
  w('egg', 'egg', 'food', 'noun'),
  w('cake', 'cake', 'food', 'noun'),
  w('cookie', 'cookie', 'food', 'noun'),
  w('juice', 'juice', 'food', 'noun'),
];

export const CHUNKS: Chunk[] = [
  { id: 'its-a', text: "It's a…", theme: 'chunks' },
  { id: 'i-like', text: 'I like…', theme: 'chunks' },
  { id: 'i-dont-like', text: "I don't like…", theme: 'chunks' },
  { id: 'where-is', text: 'Where is…?', theme: 'chunks' },
  { id: 'here-it-is', text: 'Here it is!', theme: 'chunks' },
  { id: 'i-can', text: 'I can…', theme: 'chunks' },
  { id: 'i-want', text: 'I want…', theme: 'chunks' },
  { id: 'this-is-my', text: 'This is my…', theme: 'chunks' },
  { id: 'lets', text: "Let's…", theme: 'chunks' },
];

export const wordById = (id: string): Word | undefined => WORDS.find((x) => x.id === id);

/**
 * Sélection des prochains mots nouveaux (§4.2, §5.3) :
 * jamais deux mots sémantiquement proches le même jour.
 */
export function pickNewWords(candidateIds: string[], alreadyToday: string[], maxNew: number): string[] {
  const picked: string[] = [];
  const blocked = new Set<string>();
  const block = (id: string) => {
    const word = wordById(id);
    blocked.add(id);
    for (const s of word?.similarTo ?? []) blocked.add(s);
  };
  for (const id of candidateIds) {
    if (picked.length >= maxNew) break;
    if (alreadyToday.includes(id) || blocked.has(id)) continue;
    if (WORDS.some((x) => x.id === id)) {
      picked.push(id);
      block(id);
    }
  }
  return picked;
}

export const STORIES: Story[] = [
  {
    id: 'foxy-sees-a-cat',
    theme: 'farm',
    title: 'Foxy sees a cat',
    pages: [
      { text: 'Foxy sees a cat. What does Foxy see? He sees a cat!', svg: wordArt('cat'), question: { prompt: 'What does Foxy see?', choices: ['cat', 'dog'], answerIndex: 0 } },
      { text: 'Foxy sees a dog. What does Foxy see? He sees a dog!', svg: wordArt('dog'), question: { prompt: 'What does Foxy see?', choices: ['dog', 'cat'], answerIndex: 0 } },
      { text: 'Foxy sees a duck. What does Foxy see? He sees a duck!', svg: wordArt('duck'), question: { prompt: 'What does Foxy see?', choices: ['duck', 'fish'], answerIndex: 0 } },
      { text: 'Foxy is happy. Goodbye, Foxy!', svg: 'foxy:happy' },
    ],
  },
  {
    id: 'foxy-is-hungry',
    theme: 'food',
    title: 'Foxy is hungry',
    pages: [
      { text: 'Foxy is hungry. Foxy wants an apple. Yum!', svg: wordArt('apple'), question: { prompt: 'What does Foxy want?', choices: ['apple', 'banana'], answerIndex: 0 } },
      { text: 'Foxy drinks milk. Foxy likes milk!', svg: wordArt('milk'), question: { prompt: 'What does Foxy drink?', choices: ['milk', 'juice'], answerIndex: 0 } },
      { text: 'Foxy eats a cookie. Yummy cookie!', svg: wordArt('cookie'), question: { prompt: 'What does Foxy eat?', choices: ['cookie', 'bread'], answerIndex: 0 } },
      { text: 'Foxy is happy now. Bye bye!', svg: 'foxy:eat' },
    ],
  },
  {
    id: 'foxy-says-jump',
    theme: 'actions',
    title: 'Foxy says jump!',
    pages: [
      { text: 'Foxy says: Jump! Jump, jump, jump!', svg: wordArt('jump'), question: { prompt: 'What does Foxy say?', choices: ['jump', 'sleep'], answerIndex: 0 } },
      { text: 'Foxy says: Clap! Clap your hands!', svg: wordArt('clap'), question: { prompt: 'Clap what?', choices: ['hands', 'feet'], answerIndex: 0 } },
      { text: 'Foxy says: Stop! Stop now. Good!', svg: wordArt('stop'), question: { prompt: 'What does Foxy say?', choices: ['stop', 'run'], answerIndex: 0 } },
      { text: 'Foxy says: Sleep. Good night!', svg: 'foxy:sleep' },
    ],
  },
];
