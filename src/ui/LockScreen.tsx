import { useState } from 'react';
import { Foxy } from './Foxy';

export function LockScreen({ onUnlock, error }: { onUnlock: (code: string) => void; error: boolean }) {
  const [code, setCode] = useState('');
  return (
    <div className="screen center lock-screen">
      <Foxy mood="sleep" size={130} />
      <h1 className="hello">🔒 Foxling is locked</h1>
      <p className="sub">Ask a grown-up for the code.</p>
      <input
        className="lock-input"
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={8}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        placeholder="••••"
        autoFocus
      />
      {error && <p className="lock-error">Wrong code, try again!</p>}
      <button
        className="big-btn"
        disabled={code.length < 4}
        onClick={() => onUnlock(code)}
      >
        🔓 Unlock
      </button>
    </div>
  );
}
