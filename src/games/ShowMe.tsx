import { useEffect, useState } from 'react';
import { WordImage } from '../ui/Foxy';
import { wordById } from '../content/curriculum';
import type { SpeechProvider } from '../speech/speech';
import type { Word } from '../engine/types';

export interface GameProps {
  target: Word;
  options: Word[];
  speech: SpeechProvider;
  showText: boolean;
  onResult: (ok: boolean) => void;
}

export function ShowMe({ target, options, speech, showText, onResult }: GameProps) {
  const [wrong, setWrong] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    speech.speak(`Show me the ${target.text.replace(/ down| up| around/g, '')}!`);
  }, []);

  const pick = (w: Word) => {
    if (answered) return;
    if (w.id === target.id) {
      setAnswered(true);
      speech.speak(`Yes! It's a ${target.text}! Well done!`);
      setTimeout(() => onResult(true), 900);
    } else {
      setWrong(w.id);
      speech.speak(`Hmm, that's the ${w.text}. Show me the ${target.text}!`);
      setTimeout(() => {
        setWrong(null);
        speech.speak(`The ${target.text}! Touch it!`);
        onResult(false);
      }, 1400);
    }
  };

  return (
    <div className="game-screen">
      <div className="options-grid">
        {options.map((w) => (
          <button
            key={w.id}
            className={`option-card ${wrong === w.id ? 'shake' : ''} ${answered && w.id === target.id ? 'correct' : ''}`}
            onClick={() => pick(w)}
          >
            <WordImage svg={w.svg} size={140} label={w.text} />
            {showText && <span className="word-text">{w.text}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export function newWordsIntro(target: Word, speech: SpeechProvider): string {
  const clean = target.text.replace(/ down| up| around/g, '');
  speech.speak(`Look! It's a ${clean}! ${target.text[0].toUpperCase() + target.text.slice(1)}! Say it with me: ${clean}!`);
  return clean;
}

export { wordById };
