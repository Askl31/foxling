import { useEffect, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import { scenes } from '../content/art';
import type { GameProps } from './ShowMe';

export function HideSeek({ target, options, speech, onResult }: GameProps) {
  const [hidden, setHidden] = useState<string | null>(target.id);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const clean = target.text.replace(/ down| up| around/g, '');

  useEffect(() => {
    speech.speak(`Where is the ${clean}? Find it!`);
  }, []);

  const pick = async (w: { id: string; text: string; svg: string }) => {
    if (busy) return;
    if (w.id === target.id) {
      setBusy(true);
      setHidden(null);
      if (revealed) {
        // Correction : on rappelle le mot cible puis confirmation
        await speech.speak(clean);
        await speech.speak('Here it is!');
        setTimeout(() => onResult(false), 500);
      } else {
        await speech.speak('Here it is!');
        setTimeout(() => onResult(true), 400);
      }
    } else {
      setBusy(true);
      setWrongId(w.id);
      await speech.speak('No, no! Try again!');
      setWrongId(null);
      setRevealed(true);
      setHidden(null);
      await speech.speak('Touch it!');
      setBusy(false);
    }
  };

  return (
    <div className="game-screen">
      <div className="scene" dangerouslySetInnerHTML={{ __html: scenes.farm }} />
      <div className="hide-row">
        {options.map((w) => (
          <button
            key={w.id}
            className={`hide-spot ${hidden === w.id ? 'hidden-spot' : ''} ${wrongId === w.id ? 'shake' : ''} ${revealed && w.id === target.id ? 'reveal' : ''}`}
            disabled={busy || (revealed && w.id !== target.id)}
            onClick={() => pick(w)}
            aria-label={w.text}
          >
            {hidden !== w.id && <WordImage svg={w.svg} size={90} label={w.text} />}
            {hidden === w.id && <Foxy mood="surprise" size={80} />}
          </button>
        ))}
      </div>
    </div>
  );
}
