import { useEffect, useState } from 'react';
import { Foxy } from '../ui/Foxy';
import type { GameProps } from './ShowMe';

export function Karaoke({ target, speech, onResult }: GameProps) {
  const [sung, setSung] = useState(false);
  const clean = target.text.replace(/ down| up| around/g, '');

  useEffect(() => {
    speech.speak(`Sing with me! ${clean}, ${clean}, ${clean}!`);
  }, []);

  return (
    <div className="game-screen center">
      <Foxy mood="happy" size={140} />
      <p className="instruction big">🎵 {clean} {clean} {clean}! 🎵</p>
      <button
        className="big-btn"
        onClick={() => {
          if (sung) return;
          setSung(true);
          speech.speak(`La la la! ${clean}! You sing so well!`);
          setTimeout(() => onResult(true), 1100);
        }}
      >
        {sung ? '🌟 Bravo!' : '🎤 Sing!'}
      </button>
    </div>
  );
}
