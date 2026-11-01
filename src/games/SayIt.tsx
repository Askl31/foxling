import { useEffect, useRef, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import { AudioPrompt } from '../ui/AudioPrompt';
import { asrAccepts } from '../speech/speech';
import { playTapSound, playSuccessSound, playTryAgainSound } from '../speech/sfx';
import type { GameProps } from './ShowMe';

export function SayIt({ target, speech, showText, onResult }: GameProps) {
  const [listening, setListening] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const fired = useRef(false);
  const clean = target.text.replace(/ down| up| around/g, '');

  const promptSpeech = () => {
    speech.speak('Say it with me!');
    setTimeout(() => speech.speak(clean), 1000);
  };

  useEffect(() => {
    promptSpeech();
  }, []);

  const listen = async () => {
    if (fired.current || listening) return;
    playTapSound();
    setListening(true);
    if (speech.recognitionSupported()) {
      const transcript = await speech.recognize({ lang: 'en-US' });
      setListening(false);
      if (fired.current) return;
      if (asrAccepts(clean, transcript)) {
        fired.current = true;
        setAccepted(true);
        playSuccessSound();
        await speech.speak('Wow! Amazing!');
        setTimeout(() => onResult(true), 400);
      } else {
        playTryAgainSound();
        await speech.speak('Again! You can do it!');
        if (!fired.current) setListening(false);
      }
    } else {
      setTimeout(async () => {
        if (fired.current) return;
        fired.current = true;
        setListening(false);
        setAccepted(true);
        playSuccessSound();
        await speech.speak('I heard you! Well done!');
        setTimeout(() => onResult(true), 400);
      }, 2200);
    }
  };

  return (
    <div className="game-screen say-it-screen">
      <div className="game-prompt-sidebar">
        <Foxy mood={accepted ? 'happy' : listening ? 'surprise' : 'happy'} size={140} onClick={promptSpeech} interactive />
        <AudioPrompt onReplay={promptSpeech} text={`Say: "${clean}"`} showText={showText} />
      </div>
      <div className="say-it-body">
        <WordImage svg={target.svg} size={140} label={target.text} />
        {showText && <p className="instruction big">{clean}</p>}
        <button
          className={`big-btn mic-btn ${listening ? 'listening' : ''}`}
          onClick={listen}
          disabled={listening || accepted}
          aria-label={listening ? 'Foxy is listening' : 'Start speaking'}
        >
          {listening ? '👂 Foxy is listening…' : '🎤 Say it!'}
        </button>
      </div>
    </div>
  );
}
