import { useState } from 'react';
import { playTapSound } from '../speech/sfx';

export function AudioPrompt({
  onReplay,
  label = 'Listen again',
  text,
  showText = false,
}: {
  onReplay: () => void;
  label?: string;
  text?: string;
  showText?: boolean;
}) {
  const [pulsing, setPulsing] = useState(false);

  const handleClick = () => {
    playTapSound();
    setPulsing(true);
    onReplay();
    setTimeout(() => setPulsing(false), 600);
  };

  return (
    <div className="audio-prompt-row">
      <button
        type="button"
        className={`replay-btn ${pulsing ? 'pulsing' : ''}`}
        onClick={handleClick}
        aria-label={label}
        title={label}
      >
        <span className="replay-icon" aria-hidden="true">🔊</span>
        <span className="replay-text">Listen</span>
      </button>
      {showText && text && <span className="instruction-badge">{text}</span>}
    </div>
  );
}
