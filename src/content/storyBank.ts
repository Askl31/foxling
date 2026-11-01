import type { Story } from '../engine/types';

/**
 * Banque d'histoires PRÉ-GÉNÉRÉES et commitées : utilisables 100 % offline,
 * zéro appel LLM pendant l'usage. Le placeholder {name} = prénom de l'enfant.
 * Lexique : uniquement mots du curriculum + mots-outils de la liste blanche + {name} (§8.1).
 * Règle §8.1 : phrase ≤ 6 mots, structure répétitive, question cliquable par page.
 */

function page(text: string, svgId: string, question?: { prompt: string; choices: string[]; answerIndex: number }): Story['pages'][number] {
  return { text, svg: svgId, question };
}

export const STORY_BANK: Story[] = [
  {
    id: 'bank-farm-1', theme: 'farm', title: '{name} sees the animals',
    pages: [
      page('{name} sees a cat!', 'cat', { prompt: 'What do you see?', choices: ['cat', 'dog'], answerIndex: 0 }),
      page('{name} sees a dog!', 'dog', { prompt: 'What do you see?', choices: ['dog', 'duck'], answerIndex: 0 }),
      page('{name} sees a duck!', 'duck', { prompt: 'What do you see?', choices: ['duck', 'cow'], answerIndex: 0 }),
      page('{name} sees a cow. Bye bye!', 'cow'),
    ],
  },
  {
    id: 'bank-farm-2', theme: 'farm', title: 'Small and big',
    pages: [
      page('A mouse is small. What is small?', 'mouse', { prompt: 'What is small?', choices: ['mouse', 'pig'], answerIndex: 0 }),
      page('A pig is big. What is big?', 'pig', { prompt: 'What is big?', choices: ['pig', 'mouse'], answerIndex: 0 }),
      page('A frog says ribbit! What says ribbit?', 'frog', { prompt: 'What says ribbit?', choices: ['frog', 'bird'], answerIndex: 0 }),
      page('A horse runs fast. Bye bye!', 'horse'),
    ],
  },
  {
    id: 'bank-colors-1', theme: 'colors', title: '{name} and colors',
    pages: [
      page('It is red! What color?', 'apple', { prompt: 'What color?', choices: ['red', 'blue'], answerIndex: 0 }),
      page('It is blue! What color?', 'fish', { prompt: 'What color?', choices: ['blue', 'red'], answerIndex: 0 }),
      page('It is yellow! What color?', 'sun', { prompt: 'What color?', choices: ['yellow', 'blue'], answerIndex: 0 }),
      page('It is green! Bye bye!', 'frog'),
    ],
  },
  {
    id: 'bank-colors-2', theme: 'colors', title: 'More colors',
    pages: [
      page('The pig is pink. What color?', 'pig', { prompt: 'What color?', choices: ['pink', 'black'], answerIndex: 0 }),
      page('The sheep is white. What color?', 'sheep', { prompt: 'What color?', choices: ['white', 'pink'], answerIndex: 0 }),
      page('The horse is brown. What color?', 'horse', { prompt: 'What color?', choices: ['brown', 'white'], answerIndex: 0 }),
      page('A rainbow! Bye bye!', 'rainbow'),
    ],
  },
  {
    id: 'bank-numbers-1', theme: 'numbers', title: 'Count with me',
    pages: [
      page('One fish! How many?', 'fish', { prompt: 'How many?', choices: ['one', 'two'], answerIndex: 0 }),
      page('Two ducks! How many?', 'duck', { prompt: 'How many?', choices: ['two', 'one'], answerIndex: 0 }),
      page('Three birds! How many?', 'bird', { prompt: 'How many?', choices: ['three', 'two'], answerIndex: 0 }),
      page('Four stars! Bye bye!', 'star'),
    ],
  },
  {
    id: 'bank-numbers-2', theme: 'numbers', title: 'Five to ten',
    pages: [
      page('Five apples! How many?', 'apple', { prompt: 'How many?', choices: ['five', 'four'], answerIndex: 0 }),
      page('Six eggs! How many?', 'egg', { prompt: 'How many?', choices: ['six', 'five'], answerIndex: 0 }),
      page('Seven, eight, nine, ten! How many?', 'star', { prompt: 'How many?', choices: ['ten', 'nine'], answerIndex: 0 }),
      page('Ten stars! Bye bye!', 'moon'),
    ],
  },
  {
    id: 'bank-body-1', theme: 'body', title: 'My body',
    pages: [
      page('Touch your nose!', 'nose', { prompt: 'What do you touch?', choices: ['nose', 'ears'], answerIndex: 0 }),
      page('Clap your hands!', 'hands', { prompt: 'What do you clap?', choices: ['hands', 'feet'], answerIndex: 0 }),
      page('Two eyes! One mouth! Count!', 'eyes', { prompt: 'How many eyes?', choices: ['two', 'one'], answerIndex: 0 }),
      page('Head and tummy! Bye bye!', 'head'),
    ],
  },
  {
    id: 'bank-actions-1', theme: 'actions', title: 'Jump, jump!',
    pages: [
      page('Jump! Jump!', 'jump', { prompt: 'What do you do?', choices: ['jump', 'sleep'], answerIndex: 0 }),
      page('Run! Run fast!', 'run', { prompt: 'What do you do?', choices: ['run', 'stop'], answerIndex: 0 }),
      page('Stop! Sit down! Stand up!', 'stop', { prompt: 'What do you do?', choices: ['stop', 'jump'], answerIndex: 0 }),
      page('Dance! Sleep now. Bye bye!', 'dance'),
    ],
  },
  {
    id: 'bank-food-1', theme: 'food', title: '{name} is hungry',
    pages: [
      page('{name} has an apple!', 'apple', { prompt: 'What do you want?', choices: ['apple', 'ball'], answerIndex: 0 }),
      page('Drink milk! Yum!', 'milk', { prompt: 'What do you drink?', choices: ['milk', 'juice'], answerIndex: 0 }),
      page('Eat a cookie! Crunch!', 'cookie', { prompt: 'What do you eat?', choices: ['cookie', 'bread'], answerIndex: 0 }),
      page('{name} is happy! Bye bye!', 'foxy:eat'),
    ],
  },
  {
    id: 'bank-food-2', theme: 'food', title: 'Yummy',
    pages: [
      page('A yellow banana! Yum!', 'banana', { prompt: 'What is yellow?', choices: ['banana', 'apple'], answerIndex: 0 }),
      page('Bread and cheese! Yum!', 'cheese', { prompt: 'What is yummy?', choices: ['cheese', 'stone'], answerIndex: 0 }),
      page('Cake! Yum yum!', 'cake', { prompt: 'What is yummy?', choices: ['cake', 'water'], answerIndex: 0 }),
      page('Drink water! Bye bye!', 'water'),
    ],
  },
  {
    id: 'bank-family-1', theme: 'family', title: 'My home folks',
    pages: [
      page('This is mummy! Who is this?', 'mummy', { prompt: 'Who is this?', choices: ['mummy', 'daddy'], answerIndex: 0 }),
      page('This is daddy! Who is this?', 'daddy', { prompt: 'Who is this?', choices: ['daddy', 'mummy'], answerIndex: 0 }),
      page('A baby! Small baby!', 'baby', { prompt: 'Who is small?', choices: ['baby', 'daddy'], answerIndex: 0 }),
      page('I love you! Bye!', 'grandma'),
    ],
  },
  {
    id: 'bank-home-1', theme: 'home', title: 'My house',
    pages: [
      page('This is my house! What is it?', 'house', { prompt: 'What is it?', choices: ['house', 'car'], answerIndex: 0 }),
      page('A door! Open the door!', 'door', { prompt: 'What is it?', choices: ['door', 'window'], answerIndex: 0 }),
      page('A bed! Sleep tight!', 'bed', { prompt: 'Where do you sleep?', choices: ['bed', 'chair'], answerIndex: 0 }),
      page('A chair! Sit down! Bye!', 'chair'),
    ],
  },
  {
    id: 'bank-toys-1', theme: 'toys', title: 'Play time',
    pages: [
      page('A ball! Bounce the ball!', 'ball', { prompt: 'What do you bounce?', choices: ['ball', 'doll'], answerIndex: 0 }),
      page('A car! Beep!', 'car', { prompt: 'Beep beep! What is it?', choices: ['car', 'bus'], answerIndex: 0 }),
      page('My teddy! Nice!', 'teddy', { prompt: 'What is soft?', choices: ['teddy', 'blocks'], answerIndex: 0 }),
      page('Blocks! Stack! Bye!', 'blocks'),
    ],
  },
  {
    id: 'bank-nature-1', theme: 'nature', title: 'Sun and rain',
    pages: [
      page('The sun is up! What is up?', 'sun', { prompt: 'What is up?', choices: ['sun', 'moon'], answerIndex: 0 }),
      page('Rain! Plip plop!', 'rain', { prompt: 'What falls?', choices: ['rain', 'sun'], answerIndex: 0 }),
      page('A flower! What grows?', 'flower', { prompt: 'What grows?', choices: ['flower', 'cloud'], answerIndex: 0 }),
      page('A rainbow! Night!', 'rainbow'),
    ],
  },
  {
    id: 'bank-politeness-1', theme: 'politeness', title: 'Hello!',
    pages: [
      page('Hello! What do you say?', 'hello', { prompt: 'What do you say?', choices: ['hello', 'goodbye'], answerIndex: 0 }),
      page('Thank you! Please!', 'thankyou', { prompt: 'What do you say?', choices: ['thank you', 'sorry'], answerIndex: 0 }),
      page('Oops! Sorry!', 'sorry', { prompt: 'Oops! What do you say?', choices: ['sorry', 'hello'], answerIndex: 0 }),
      page('Bye bye! Bye bye!', 'goodbye'),
    ],
  },
  {
    id: 'bank-emotions-1', theme: 'emotions', title: 'How do you feel?',
    pages: [
      page('I am happy!', 'happy', { prompt: 'How do you feel?', choices: ['happy', 'sad'], answerIndex: 0 }),
      page('I am sad. Oh no!', 'sad', { prompt: 'How do you feel?', choices: ['sad', 'happy'], answerIndex: 0 }),
      page('I am hungry! Yum!', 'hungry', { prompt: 'How do you feel?', choices: ['hungry', 'tired'], answerIndex: 0 }),
      page('I am tired. Bye bye!', 'tired'),
    ],
  },
  {
    id: 'bank-vehicles-1', theme: 'vehicles', title: 'Beep beep',
    pages: [
      page('A car! Beep!', 'car', { prompt: 'What is it?', choices: ['car', 'boat'], answerIndex: 0 }),
      page('A bus! Big bus!', 'bus', { prompt: 'What is it?', choices: ['bus', 'car'], answerIndex: 0 }),
      page('A plane! Up!', 'plane', { prompt: 'What flies?', choices: ['plane', 'bus'], answerIndex: 0 }),
      page('A train! Choo choo! Bye!', 'train'),
    ],
  },
  {
    id: 'bank-wild-1', theme: 'wild', title: 'At the zoo',
    pages: [
      page('The lion says roar! What says roar?', 'lion', { prompt: 'What says roar?', choices: ['lion', 'duck'], answerIndex: 0 }),
      page('The elephant is big!', 'elephant', { prompt: 'What is big?', choices: ['elephant', 'mouse'], answerIndex: 0 }),
      page('The monkey swings!', 'monkey', { prompt: 'What swings?', choices: ['monkey', 'bear'], answerIndex: 0 }),
      page('The tiger! Rawr! Bye bye!', 'tiger'),
    ],
  },
];

export function storyBankFor(profileId: string, dateISO: string): Story {
  let h = 0;
  const s = `${profileId}:${dateISO}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return STORY_BANK[h % STORY_BANK.length];
}

export function withChildName(story: Story, name: string): Story {
  return { ...story, pages: story.pages.map((p) => ({ ...p, text: p.text.split('{name}').join(name) })) };
}
