import { useEffect, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import { scenes } from '../content/art';
import { AudioPrompt } from '../ui/AudioPrompt';
import { playTapSound, playSuccessSound, playTryAgainSound } from '../speech/sfx';
import type { GameProps } from './ShowMe';

export function HideSeek({ target, options, speech, showText, onResult }: GameProps) {
  const [found, setFound] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);
  const clean = target.text.replace(/ down| up| around/g, '');

  const promptSpeech = () => {
    speech.speak(`Where is the ${clean}? Find it!`);
  };

  useEffect(() => {
    promptSpeech();
  }, []);

  const pick = async (w: { id: string; text: string; svg: string }) => {
    if (busy || found) return;
    playTapSound();

    if (w.id === target.id) {
      setBusy(true);
      setFound(true);
      playSuccessSound();
      if (revealed) {
        // Correction : on rappelle le mot cible puis confirmation
        await speech.speak(clean);
        await speech.speak('Here it is! Peekaboo!');
        setTimeout(() => onResult(false), 600);
      } else {
        await speech.speak('Here it is! Peekaboo!');
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
    <div className="game-screen hide-seek-screen">
      <div className="game-prompt-sidebar">
        <div className="scene-mini" dangerouslySetInnerHTML={{ __html: scenes.farm }} />
        <AudioPrompt onReplay={promptSpeech} text={`Where is the ${clean}?`} showText={showText} />
      </div>
      <div className="options-grid">
        {options.map((w) => (
          <button
            key={w.id}
            className={`option-card hide-card ${w.id === target.id && found ? 'found-peekaboo' : ''} ${wrongId === w.id ? 'shake' : ''} ${revealed && w.id === target.id ? 'reveal' : ''}`}
            disabled={busy || (revealed && w.id !== target.id)}
            onClick={() => pick(w)}
            aria-label={w.text}
          >
            <div className="hide-card-art">
              <WordImage svg={w.svg} size={110} label={w.text} />
              {w.id === target.id && found && (
                <div className="peekaboo-foxy">
                  <Foxy mood="surprise" size={85} />
                </div>
              )}
            </div>
            {showText && <span className="word-text">{w.text}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
