import { useEffect, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import { AudioPrompt } from '../ui/AudioPrompt';
import { playTapSound, playMunchSound, playSuccessSound, playTryAgainSound } from '../speech/sfx';
import type { GameProps } from './ShowMe';

export function FeedFoxy({ target, options, speech, showText, onResult }: GameProps) {
  const [fed, setFed] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [flyingId, setFlyingId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);

  const clean = target.text.replace(/ down| up| around/g, '');

  const promptSpeech = () => {
    speech.speak(`Feed Foxy the ${clean}!`);
  };

  useEffect(() => {
    promptSpeech();
  }, []);

  const pick = async (w: typeof options[number]) => {
    if (fed || busy) return;
    playTapSound();

    if (w.id === target.id) {
      setBusy(true);
      setFlyingId(w.id);
      playMunchSound();

      setTimeout(() => {
        setFed(true);
        playSuccessSound();
      }, 350);

      if (revealed) {
        // En cas de correction : on répète le mot de nourriture puis Foxy remercie
        await speech.speak(clean);
        await speech.speak('Yum yum! Thank you!');
        setTimeout(() => onResult(false), 600);
      } else {
        await speech.speak('Yum yum! Thank you!');
        setTimeout(() => onResult(true), 500);
      }
    } else {
      setBusy(true);
      setWrongId(w.id);
      playTryAgainSound();
      await speech.speak('No, no! Try again!');
      setWrongId(null);
      setRevealed(true);
      await speech.speak('Touch it!');
      setBusy(false);
    }
  };

  return (
    <div className="game-screen feed-foxy-screen">
      <div className="game-prompt-sidebar">
        <Foxy mood={fed ? 'eat' : revealed ? 'point' : 'happy'} size={140} onClick={promptSpeech} interactive />
        <AudioPrompt onReplay={promptSpeech} text={`Feed Foxy: ${clean}`} showText={showText} />
      </div>
      <div className="options-grid">
        {options.map((w) => (
          <button
            key={w.id}
            className={`option-card small ${w.id === flyingId ? 'flying' : ''} ${wrongId === w.id ? 'shake' : ''} ${fed && w.id === target.id ? 'correct' : ''} ${revealed && w.id === target.id ? 'reveal' : ''}`}
            disabled={busy || fed || (revealed && w.id !== target.id)}
            onClick={() => pick(w)}
            aria-label={w.text}
          >
            <WordImage svg={w.svg} size={110} label={w.text} />
            {showText && <span className="word-text">{w.text}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
