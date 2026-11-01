import { useEffect, useRef, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import { asrAccepts } from '../speech/speech';
import type { GameProps } from './ShowMe';

export function SayIt({ target, speech, onResult }: GameProps) {
  const [listening, setListening] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const fired = useRef(false);
  const clean = target.text.replace(/ down| up| around/g, '');

  useEffect(() => {
    speech.speak('Say it with me!');
    setTimeout(() => speech.speak(clean), 1100);
  }, []);

  const listen = async () => {
    if (fired.current) return;
    setListening(true);
    if (speech.recognitionSupported()) {
      const transcript = await speech.recognize({ lang: 'en-US' });
      setListening(false);
      if (fired.current) return;
      if (asrAccepts(clean, transcript)) {
        fired.current = true;
        setAccepted(true);
        speech.speak('Wow! Amazing!');
        setTimeout(() => onResult(true), 1000);
      } else {
        speech.speak('Again! You can do it!');
        setTimeout(() => { if (!fired.current) setListening(false); }, 800);
      }
    } else {
      setTimeout(() => {
        if (fired.current) return;
        fired.current = true;
        setListening(false);
        setAccepted(true);
        speech.speak('I heard you! Well done!');
        setTimeout(() => onResult(true), 900);
      }, 2200);
    }
  };

  return (
    <div className="game-screen center">
      <Foxy mood={accepted ? 'happy' : 'surprise'} size={140} />
      <WordImage svg={target.svg} size={130} label={target.text} />
      <p className="instruction">Say: “{clean}”</p>
      <button className={`big-btn mic-btn ${listening ? 'listening' : ''}`} onClick={listen}>
        {listening ? '🎤 Listening…' : '🎤 Say it!'}
      </button>
    </div>
  );
}
