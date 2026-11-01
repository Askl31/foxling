import type { AppState, ChildProfile } from '../engine/types';
import { playTapSound } from '../speech/sfx';

export function ProfileSelect({
  state,
  onPick,
  onAdd,
  onParent,
}: {
  state: AppState;
  onPick: (id: string) => void;
  onAdd: () => void;
  onParent: () => void;
}) {
  return (
    <div className="screen home-screen">
      <h1 className="app-title">🦊 Foxling</h1>
      <p className="tagline">Who is playing today?</p>
      <div className="profile-row">
        {state.profiles.map((p: ChildProfile) => (
          <button
            key={p.id}
            className="profile-card"
            onClick={() => { playTapSound(); onPick(p.id); }}
            aria-label={`Select profile ${p.name}, ${p.age} years old`}
          >
            <span className="avatar" style={{ background: p.avatarColor }}>
              {p.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="profile-name">{p.name}</span>
            <span className="profile-age">{p.age} years old</span>
          </button>
        ))}
        {state.profiles.length < 2 && (
          <button
            className="profile-card add-card"
            onClick={() => { playTapSound(); onAdd(); }}
            aria-label="Create a new profile"
          >
            <span className="avatar add-avatar">＋</span>
            <span className="profile-name">New profile</span>
          </button>
        )}
      </div>
      <button
        className="parent-link"
        onClick={() => { playTapSound(); onParent(); }}
        aria-label="Accéder à l'espace parent en français"
      >
        ⚙️ Espace parent (français)
      </button>
    </div>
  );
}
