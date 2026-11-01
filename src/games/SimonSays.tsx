import { useEffect, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import { AudioPrompt } from '../ui/AudioPrompt';
import { playTapSound, playSuccessSound } from '../speech/sfx';
import type { GameProps } from './ShowMe';

export function SimonSays({ target, speech, showText, onResult }: GameProps) {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const clean = target.text.replace(/ down| up| around/g, '').trim().toLowerCase();

  const promptSpeech = () => {
    speech.speak(`Simon says: ${target.text}!`);
  };

  useEffect(() => {
    promptSpeech();
  }, []);

  const confirm = async () => {
    if (done || busy) return;
    playTapSound();
    setDone(true);
    setBusy(true);
    playSuccessSound();
    await speech.speak('Yes! Well done!');
    setTimeout(() => onResult(true), 400);
  };

  let foxyMood: 'happy' | 'point' | 'sleep' | 'surprise' = done ? 'happy' : 'point';
  let actionAnimClass = '';

  if (!done) {
    if (clean === 'sleep') {
      foxyMood = 'sleep';
    } else if (clean === 'stop') {
      foxyMood = 'surprise';
    } else if (clean === 'jump') {
      actionAnimClass = 'foxy-simon-jump';
    } else if (clean === 'dance') {
      actionAnimClass = 'foxy-simon-dance';
    } else if (clean === 'turn') {
      actionAnimClass = 'foxy-simon-turn';
    } else if (clean === 'clap') {
      actionAnimClass = 'foxy-simon-clap';
    }
  }

  return (
    <div className="game-screen simon-screen">
      <div className="game-prompt-sidebar">
        <Foxy mood={foxyMood} className={actionAnimClass} size={140} onClick={promptSpeech} interactive />
        <AudioPrompt onReplay={promptSpeech} text={`Simon says: ${target.text}!`} showText={showText} />
      </div>
      <div className="simon-body">
        <div className="simon-card">
          <WordImage svg={target.svg} size={150} label={target.text} />
          {showText && <p className="instruction big">{target.text}!</p>}
        </div>
        <button className="big-btn" onClick={confirm} disabled={done || busy} aria-label="I did it">
          {done ? '🌟 Great job!' : '✅ Done!'}
        </button>
      </div>
    </div>
  );
}
