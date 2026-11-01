import { useState } from 'react';
import { Foxy } from './Foxy';
import { playTapSound, playTryAgainSound } from '../speech/sfx';

export function LockScreen({ onUnlock, error }: { onUnlock: (code: string) => void; error: boolean }) {
  const [code, setCode] = useState('');

  const pressDigit = (d: string) => {
    playTapSound();
    if (code.length < 8) {
      setCode((prev) => prev + d);
    }
  };

  const pressBackspace = () => {
    playTapSound();
    setCode((prev) => prev.slice(0, -1));
  };

  const submit = () => {
    playTapSound();
    onUnlock(code);
    if (error) {
      playTryAgainSound();
    }
  };

  return (
    <div className="screen center lock-screen">
      <Foxy mood="sleep" size={120} />
      <h1 className="hello">🔒 Foxling is locked</h1>
      <p className="sub">Espace verrouillé · Demandez à un adulte</p>

      <div className="lock-display" aria-label={`Code entered: ${code.length} digits`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className={`lock-dot ${i < code.length ? 'filled' : ''}`} />
        ))}
      </div>

      <div className="numpad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button key={digit} type="button" className="numpad-btn" onClick={() => pressDigit(digit)}>
            {digit}
          </button>
        ))}
        <button type="button" className="numpad-btn numpad-action" onClick={pressBackspace} aria-label="Effacer">
          ⌫
        </button>
        <button type="button" className="numpad-btn" onClick={() => pressDigit('0')}>
          0
        </button>
        <button
          type="button"
          className="numpad-btn numpad-submit"
          disabled={code.length < 4}
          onClick={submit}
          aria-label="Valider"
        >
          ✓
        </button>
      </div>

      {error && <p className="lock-error">Code incorrect, essayez à nouveau !</p>}
    </div>
  );
}
