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
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    speech.speak(`Show me the ${target.text.replace(/ down| up| around/g, '')}!`);
  }, []);

  const pick = (w: Word) => {
    if (answered) return;
    if (w.id === target.id) {
      setAnswered(true);
      speech.speak('Yes! Well done!');
      setTimeout(() => onResult(!revealed), 900);
    } else {
      setWrong(w.id);
      speech.speak('Hmm, try again!');
      setTimeout(() => {
        setWrong(null);
        setRevealed(true);
        speech.speak('Touch it!');
      }, 1200);
    }
  };

  return (
    <div className="game-screen">
      <div className="options-grid">
        {options.map((w) => (
          <button
            key={w.id}
            className={`option-card ${wrong === w.id ? 'shake' : ''} ${answered && w.id === target.id ? 'correct' : ''} ${revealed && w.id === target.id ? 'reveal' : ''}`}
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
  speech.speak('New word!');
  setTimeout(() => speech.speak(clean), 800);
  return clean;
}

export { wordById };
