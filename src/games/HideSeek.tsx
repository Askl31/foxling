import { useEffect, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import { scenes } from '../content/art';
import type { GameProps } from './ShowMe';

export function HideSeek({ target, options, speech, onResult }: GameProps) {
  const [hidden, setHidden] = useState<string | null>(target.id);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    speech.speak(`Where is the ${target.text.replace(/ down| up| around/g, '')}? Find it!`);
  }, []);

  const pick = (w: { id: string; text: string; svg: string }) => {
    if (w.id === target.id && hidden && !revealed) {
      setHidden(null);
      speech.speak('Here it is!');
      setTimeout(() => onResult(true), 1000);
    } else if (w.id === target.id && revealed) {
      setHidden(null);
      speech.speak('Yes! Well done!');
      setTimeout(() => onResult(false), 1000);
    } else if (w.id !== target.id) {
      setWrongId(w.id);
      speech.speak('No, no! Try again!');
      setTimeout(() => {
        setWrongId(null);
        setRevealed(true);
        setHidden(null);
        speech.speak('Touch it!');
      }, 1200);
    }
  };

  return (
    <div className="game-screen">
      <div className="scene" dangerouslySetInnerHTML={{ __html: scenes.farm }} />
      <div className="hide-row">
        {options.map((w) => (
          <button
            key={w.id}
            className={`hide-spot ${hidden === w.id ? 'hidden-spot' : ''} ${wrongId === w.id ? 'shake' : ''}`}
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
