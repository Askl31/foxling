import { useEffect, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import type { GameProps } from './ShowMe';

export function FeedFoxy({ target, options, speech, onResult }: GameProps) {
  const [fed, setFed] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);

  const clean = target.text.replace(/ down| up| around/g, '');

  useEffect(() => {
    speech.speak(`Feed Foxy the ${clean}!`);
  }, []);

  const pick = async (w: typeof options[number]) => {
    if (fed || busy) return;
    if (w.id === target.id) {
      setFed(true);
      setBusy(true);
      if (revealed) {
        // En cas de correction : on répète le mot de nourriture puis Foxy remercie
        await speech.speak(clean);
        await speech.speak('Yum yum! Thank you!');
        setTimeout(() => onResult(false), 500);
      } else {
        await speech.speak('Yum yum! Thank you!');
        setTimeout(() => onResult(true), 400);
      }
    } else {
      setBusy(true);
      setWrongId(w.id);
      await speech.speak('No, no! Try again!');
      setWrongId(null);
      setRevealed(true);
      await speech.speak('Touch it!');
      setBusy(false);
    }
  };

  return (
    <div className="game-screen center">
      <Foxy mood={fed ? 'eat' : 'happy'} size={140} />
      <p className="instruction">Feed Foxy!</p>
      <div className="options-grid">
        {options.map((w) => (
          <button
            key={w.id}
            className={`option-card small ${wrongId === w.id ? 'shake' : ''} ${fed && w.id === target.id ? 'correct' : ''} ${revealed && w.id === target.id ? 'reveal' : ''}`}
            disabled={busy || fed || (revealed && w.id !== target.id)}
            onClick={() => pick(w)}
          >
            <WordImage svg={w.svg} size={100} label={w.text} />
          </button>
        ))}
      </div>
    </div>
  );
}
