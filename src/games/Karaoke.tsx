import { useEffect, useState } from 'react';
import { Foxy } from '../ui/Foxy';
import { AudioPrompt } from '../ui/AudioPrompt';
import { playTapSound, playSuccessSound } from '../speech/sfx';
import type { GameProps } from './ShowMe';
import type { Song } from '../content/curriculum';

export function Karaoke({ target, speech, onResult, song }: GameProps & { song?: Song }) {
  const [sung, setSung] = useState(false);
  const [line, setLine] = useState(0);
  const clean = target.text.replace(/ down| up| around/g, '');
  const lines = song?.lines ?? [`${clean}, ${clean}, ${clean}!`];

  const replayLine = () => {
    speech.speak(lines[line]);
  };

  useEffect(() => {
    speech.speak('Sing with me!');
    setTimeout(() => speech.speak(lines[0]), 900);
  }, []);

  const sing = async () => {
    if (sung) return;
    playTapSound();
    const nextLine = line + 1;
    if (nextLine < lines.length) {
      setLine(nextLine);
      speech.speak(lines[nextLine]);
    } else {
      setSung(true);
      playSuccessSound();
      await speech.speak('You sing so well!');
      setTimeout(() => onResult(true), 400);
    }
  };

  return (
    <div className="game-screen karaoke-screen">
      <div className="game-prompt-sidebar">
        <Foxy mood="happy" size={130} onClick={replayLine} interactive />
        <AudioPrompt onReplay={replayLine} text="Listen again" />
      </div>
      <div className="karaoke-body">
        <p className="instruction">{song ? `🎵 ${song.title}` : '🎵 Sing!'}</p>
        <div className="karaoke-bubble">
          <span className="karaoke-music-note">🎶</span>
          <p className="instruction big karaoke-line">{lines[line]}</p>
        </div>
        <button className="big-btn" onClick={sing} aria-label={line + 1 < lines.length ? 'Next line' : 'Finish song'}>
          {sung ? '🌟 Bravo!' : line + 1 < lines.length ? '🎤 Sing!' : '🌟 One more!'}
        </button>
      </div>
    </div>
  );
}
