import { useEffect, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import type { GameProps } from './ShowMe';

export function FeedFoxy({ target, options, speech, onResult }: GameProps) {
  const [fed, setFed] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    speech.speak(`Foxy is hungry! Feed Foxy the ${target.text}!`);
  }, []);

  const pick = (w: typeof options[number]) => {
    if (fed) return;
    if (w.id === target.id) {
      setFed(true);
      speech.speak(`Yum yum! Foxy loves ${target.text}! Thank you!`);
      setTimeout(() => onResult(true), 1100);
    } else {
      setWrongId(w.id);
      speech.speak(`Foxy doesn't want the ${w.text}! The ${target.text}!`);
      setTimeout(() => setWrongId(null), 1200);
    }
  };

  return (
    <div className="game-screen center">
      <Foxy mood={fed ? 'eat' : 'happy'} size={140} />
      <p className="instruction">Feed Foxy!</p>
      <div className="options-grid">
        {options.map((w) => (
          <button key={w.id} className={`option-card small ${wrongId === w.id ? 'shake' : ''} ${fed && w.id === target.id ? 'correct' : ''}`} onClick={() => pick(w)}>
            <WordImage svg={w.svg} size={100} label={w.text} />
          </button>
        ))}
      </div>
    </div>
  );
}
