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
  const [busy, setBusy] = useState(false);
  const clean = target.text.replace(/ down| up| around/g, '');

  useEffect(() => {
    speech.speak(`Show me the ${clean}!`);
  }, []);

  const pick = async (w: Word) => {
    if (answered || busy) return;

    if (w.id === target.id) {
      setAnswered(true);
      setBusy(true);
      if (revealed) {
        // En cas d'erreur préalable, on renforce la correction :
        // Foxy prononce le mot cible, puis un encouragement chaleureux
        await speech.speak(clean);
        await speech.speak('Good job!');
        setTimeout(() => onResult(false), 500);
      } else {
        // Succès direct du premier coup
        await speech.speak('Yes! Well done!');
        setTimeout(() => onResult(true), 400);
      }
    } else {
      // Erreur : on verrouille les clics, on joue le feedback bienveillant, puis on guide vers la correction
      setBusy(true);
      setWrong(w.id);
      await speech.speak('Hmm, try again!');
      setWrong(null);
      setRevealed(true);
      await speech.speak('Touch it!');
      setBusy(false);
    }
  };

  return (
    <div className="game-screen">
      <div className="options-grid">
        {options.map((w) => (
          <button
            key={w.id}
            className={`option-card ${wrong === w.id ? 'shake' : ''} ${answered && w.id === target.id ? 'correct' : ''} ${revealed && w.id === target.id ? 'reveal' : ''}`}
            disabled={busy || answered || (revealed && w.id !== target.id)}
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
