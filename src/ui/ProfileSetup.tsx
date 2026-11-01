import { useState } from 'react';
import { createProfile } from '../store/store';
import type { AppState } from '../engine/types';

const AVATAR_COLORS = ['#ff8c42', '#4dabf7', '#69db7c', '#f783ac', '#9775fa', '#ffd43b'];
const PASSION_OPTIONS = ['dinosaurs', 'princesses', 'cars', 'animals', 'space', 'soccer', 'dancing', 'music'];

export function ProfileSetup({ state, onChange }: { state: AppState; onChange: (s: AppState) => void }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState<4 | 6>(4);
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [passions, setPassions] = useState<string[]>([]);

  const submit = () => {
    onChange(createProfile(state, name, age, color, passions));
  };

  return (
    <div className="screen parent-screen">
      <h1>👨‍👩‍👧 Créer un profil enfant</h1>
      <p className="muted">Deux profils possibles : un enfant de 4 ans et un enfant de 6 ans.</p>

      <label className="field">
        <span>Prénom de l'enfant</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ex. Léa" maxLength={16} />
      </label>

      <div className="field">
        <span>Âge</span>
        <div className="age-picker">
          {([4, 6] as const).map((a) => (
            <button key={a} className={`age-btn ${age === a ? 'selected' : ''}`} onClick={() => setAge(a)}>
              {a} ans {a === 4 ? '· 5 min / 3 mots' : '· 10 min / 5 mots'}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>Couleur du profil</span>
        <div className="color-row">
          {AVATAR_COLORS.map((c) => (
            <button key={c} className={`color-dot ${color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={`couleur ${c}`} />
          ))}
        </div>
      </div>

      <div className="field">
        <span>Passions (pour les histoires personnalisées)</span>
        <div className="passion-row">
          {PASSION_OPTIONS.map((p) => (
            <button
              key={p}
              className={`chip ${passions.includes(p) ? 'selected' : ''}`}
              onClick={() => setPassions((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button className="big-btn" onClick={submit} disabled={state.profiles.length >= 2}>
        ✅ Créer le profil
      </button>
      {state.profiles.length >= 2 && <p className="muted">Les deux profils sont déjà créés.</p>}
    </div>
  );
}
