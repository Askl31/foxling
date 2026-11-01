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

const w2 = (id: string, text: string, theme: string, kind: Word['kind'] = 'noun'): Word => ({
  id, text, theme, level: 2, kind, svg: wordArt(id),
});

export const WORDS_LEVEL2: Word[] = [
  w2('mummy', 'mummy', 'family'), w2('daddy', 'daddy', 'family'), w2('baby', 'baby', 'family'),
  w2('brother', 'brother', 'family'), w2('sister', 'sister', 'family'),
  w2('grandma', 'grandma', 'family'), w2('grandpa', 'grandpa', 'family'),
  w2('tshirt', 't-shirt', 'clothes'), w2('dress', 'dress', 'clothes'), w2('shoes', 'shoes', 'clothes'),
  w2('hat', 'hat', 'clothes'), w2('socks', 'socks', 'clothes'),
  w2('house', 'house', 'home'), w2('bed', 'bed', 'home'), w2('table', 'table', 'home'),
  w2('chair', 'chair', 'home'), w2('door', 'door', 'home'), w2('window', 'window', 'home'),
  w2('ball', 'ball', 'toys'), w2('doll', 'doll', 'toys'), w2('car', 'car', 'toys'),
  w2('teddy', 'teddy bear', 'toys', 'noun'), w2('blocks', 'blocks', 'toys'),
  w2('sun', 'sun', 'nature'), w2('cloud', 'cloud', 'nature'), w2('rain', 'rain', 'nature'),
  w2('tree', 'tree', 'nature'), w2('flower', 'flower', 'nature'), w2('rainbow', 'rainbow', 'nature'),
  w2('star', 'star', 'nature'), w2('moon', 'moon', 'nature'),
  w2('hello', 'hello', 'politeness'), w2('goodbye', 'goodbye', 'politeness'),
  w2('please', 'please', 'politeness'), w2('thankyou', 'thank you', 'politeness'),
  w2('sorry', 'sorry', 'politeness'), w2('yes', 'yes', 'politeness'), w2('no', 'no', 'politeness'),
];

const w3 = (id: string, text: string, theme: string, kind: Word['kind'] = 'noun'): Word => ({
  id, text, theme, level: 3, kind, svg: wordArt(id),
});

export const WORDS_LEVEL3: Word[] = [
  w3('happy', 'happy', 'emotions'), w3('sad', 'sad', 'emotions'), w3('angry', 'angry', 'emotions'),
  w3('scared', 'scared', 'emotions'), w3('tired', 'tired', 'emotions'), w3('hungry', 'hungry', 'emotions'),
  w3('love', 'I love you', 'emotions'),
  w3('brush', 'brush my teeth', 'daily', 'verb', ), w3('wash', 'wash my hands', 'daily', 'verb'),
  w3('read', 'read', 'daily', 'verb'), w3('play', 'play', 'daily', 'verb'),
  w3('draw', 'draw', 'daily', 'verb'), w3('sing', 'sing', 'daily', 'verb'),
  w3('big', 'big', 'adjectives'), w3('small', 'small', 'adjectives'), w3('hot', 'hot', 'adjectives'),
  w3('cold', 'cold', 'adjectives'), w3('fast', 'fast', 'adjectives'), w3('slow', 'slow', 'adjectives'),
  w3('bus', 'bus', 'vehicles'), w3('bike', 'bike', 'vehicles'), w3('plane', 'plane', 'vehicles'),
  w3('boat', 'boat', 'vehicles'), w3('train', 'train', 'vehicles'),
  w3('lion', 'lion', 'wild'), w3('elephant', 'elephant', 'wild'), w3('monkey', 'monkey', 'wild'),
  w3('tiger', 'tiger', 'wild'), w3('snake', 'snake', 'wild'), w3('bear', 'bear', 'wild'),
  w3('whatsThis', "What's this?", 'questions', 'chunk'), w3('whosThis', "Who's this?", 'questions', 'chunk'),
  w3('howMany', 'How many?', 'questions', 'chunk'),
];

export const WORDS_ALL: Word[] = [...WORDS, ...WORDS_LEVEL2, ...WORDS_LEVEL3];

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

export const wordById = (id: string, custom: { id: string; text: string; svg: string }[] = []): Word | undefined =>
  WORDS_ALL.find((x) => x.id === id) ?? custom.find((c) => c.id === id) as Word | undefined;

/**
 * Sélection des prochains mots nouveaux (§4.2, §5.3) :
 * jamais deux mots sémantiquement proches le même jour.
 */
export function pickNewWords(candidateIds: string[], alreadyToday: string[], maxNew: number, pool: Word[] = WORDS_ALL): string[] {
  const picked: string[] = [];
  const blocked = new Set<string>();
  const block = (id: string) => {
    const word = pool.find((x) => x.id === id);
    blocked.add(id);
    for (const s of word?.similarTo ?? []) blocked.add(s);
  };
  for (const id of candidateIds) {
    if (picked.length >= maxNew) break;
    if (alreadyToday.includes(id) || blocked.has(id)) continue;
    if (pool.some((x) => x.id === id)) {
      picked.push(id);
      block(id);
    }
  }
  return picked;
}

export interface Song {
  id: string;
  theme: string;
  title: string;
  lines: string[];
}

export const SONGS: Song[] = [
  {
    id: 'hello-song',
    theme: 'politeness',
    title: 'Hello, Hello!',
    lines: ['Hello, hello, hello!', 'Hello, how are you?', 'I am happy, thank you!', 'Hello, hello, goodbye!'],
  },
  {
    id: 'farm-song',
    theme: 'farm',
    title: 'Old MacDonald',
    lines: ['Old MacDonald has a cat, E-I-E-I-O!', 'And on that farm he has a cat, E-I-E-I-O!', 'With a meow meow here, and a meow meow there!', 'Here a meow, there a meow, everywhere a meow!'],
  },
  {
    id: 'colors-song',
    theme: 'colors',
    title: 'Rainbow Colors',
    lines: ['Red and yellow and pink and green,', 'Purple and orange and blue!', 'I can sing a rainbow,', 'Sing a rainbow, sing a rainbow with me!'],
  },
  {
    id: 'body-song',
    theme: 'body',
    title: 'Head, Shoulders',
    lines: ['Head, shoulders, knees and toes,', 'Knees and toes! Knees and toes!', 'Head, shoulders, knees and toes,', 'Eyes, ears, mouth and nose!'],
  },
  {
    id: 'actions-song',
    theme: 'actions',
    title: 'Let\'s Move!',
    lines: ['Jump, jump, jump! Clap, clap, clap!', 'Turn around and touch the ground!', 'Sit down, stand up, dance with me!', 'Stop! Freeze! Great job, you!'],
  },
  {
    id: 'food-song',
    theme: 'food',
    title: 'Yummy Time',
    lines: ['Apple, banana, yum yum yum!', 'Milk and cookie, yum yum yum!', 'I like to eat, I like to eat,', 'Yum yum yum, yum yum yum!'],
  },
  {
    id: 'home-song',
    theme: 'home',
    title: 'My House',
    lines: ['This is my house, nice and tall!', 'Door and window, that is all!', 'Bed and table, chair so small,', 'I love my house, one and all!'],
  },
  {
    id: 'feelings-song',
    theme: 'emotions',
    title: 'How Do You Feel?',
    lines: ['Happy, happy, big smile!', 'Sad, sad, I need a while.', 'Angry, angry, stomp stomp!', 'I am fine, thank you, friend!'],
  },
  {
    id: 'wild-song',
    theme: 'wild',
    title: 'At the Zoo',
    lines: ['The lion says roar, roar, roar!', 'The elephant goes stomp, stomp!', 'The monkey swings up in the tree!', 'What do you see? A tiger! Rawr!'],
  },
  {
    id: 'vehicles-song',
    theme: 'vehicles',
    title: 'Going, Going',
    lines: ['The bus goes beep beep beep!', 'The bike goes round and round!', 'The plane flies up in the sky!', 'Choo choo, the train is here!'],
  },
];

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
