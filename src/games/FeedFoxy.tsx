import { useEffect, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import type { GameProps } from './ShowMe';

export function FeedFoxy({ target, options, speech, onResult }: GameProps) {
  const [fed, setFed] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const clean = target.text.replace(/ down| up| around/g, '');

  useEffect(() => {
    speech.speak(`Feed Foxy the ${clean}!`);
  }, []);

  const pick = (w: typeof options[number]) => {
    if (fed) return;
    if (w.id === target.id) {
      setFed(true);
      if (revealed) {
        speech.speak('Yes! Well done!');
        setTimeout(() => onResult(false), 1000);
      } else {
        speech.speak('Yum yum! Thank you!');
        setTimeout(() => onResult(true), 1100);
      }
    } else {
      setWrongId(w.id);
      speech.speak('No, no! Try again!');
      setTimeout(() => {
        setWrongId(null);
        setRevealed(true);
        speech.speak('Touch it!');
      }, 1200);
    }
  };

  return (
    <div className="game-screen center">
      <Foxy mood={fed ? 'eat' : 'happy'} size={140} />
      <p className="instruction">Feed Foxy!</p>
      <div className="options-grid">
        {options.map((w) => (
          <button key={w.id} className={`option-card small ${wrongId === w.id ? 'shake' : ''} ${fed && w.id === target.id ? 'correct' : ''} ${revealed && w.id === target.id ? 'reveal' : ''}`} onClick={() => pick(w)}>
            <WordImage svg={w.svg} size={100} label={w.text} />
          </button>
        ))}
      </div>
    </div>
  );
}
