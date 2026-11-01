import { useEffect, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import type { GameProps } from './ShowMe';

export function SimonSays({ target, speech, onResult }: GameProps) {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const clean = target.text.replace(/ down| up| around/g, '');

  useEffect(() => {
    speech.speak(`Simon says: ${target.text}!`);
  }, []);

  const confirm = async () => {
    if (done || busy) return;
    setDone(true);
    setBusy(true);
    await speech.speak('Yes! Well done!');
    setTimeout(() => onResult(true), 400);
  };

  return (
    <div className="game-screen center">
      <Foxy mood="point" size={130} />
      <WordImage svg={target.svg} size={130} label={target.text} />
      <p className="instruction">{target.text}!</p>
      <button className="big-btn" onClick={confirm} disabled={done || busy}>✅ Done!</button>
    </div>
  );
}
