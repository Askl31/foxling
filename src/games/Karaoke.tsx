import { useEffect, useState } from 'react';
import { Foxy } from '../ui/Foxy';
import type { GameProps } from './ShowMe';
import type { Song } from '../content/curriculum';

export function Karaoke({ target, speech, onResult, song }: GameProps & { song?: Song }) {
  const [sung, setSung] = useState(false);
  const [line, setLine] = useState(0);
  const clean = target.text.replace(/ down| up| around/g, '');
  const lines = song?.lines ?? [`${clean}, ${clean}, ${clean}!`];

  useEffect(() => {
    speech.speak('Sing with me!');
    setTimeout(() => speech.speak(lines[0]), 900);
  }, []);

  const sing = () => {
    if (sung) return;
    const nextLine = line + 1;
    if (nextLine < lines.length) {
      setLine(nextLine);
      speech.speak(lines[nextLine]);
    } else {
      setSung(true);
      speech.speak('You sing so well!');
      setTimeout(() => onResult(true), 1100);
    }
  };

  return (
    <div className="game-screen center">
      <Foxy mood="happy" size={140} />
      <p className="instruction">{song ? `🎵 ${song.title}` : '🎵 Sing!'}</p>
      <p className="instruction big">{lines[line]}</p>
      <button className="big-btn" onClick={sing}>
        {sung ? '🌟 Bravo!' : line + 1 < lines.length ? '🎤 Sing!' : '🌟 One more!'}
      </button>
    </div>
  );
}
