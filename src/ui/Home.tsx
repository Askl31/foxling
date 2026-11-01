import { Foxy } from './Foxy';
import { playTapSound } from '../speech/sfx';
import type { AppState, ChildProfile, WordState } from '../engine/types';
import { isSessionDoneToday } from '../engine/srs';
import { toISODate } from '../engine/schedule';

export function Home({
  state,
  profile,
  onStart,
  onBack,
}: {
  state: AppState;
  profile: ChildProfile;
  onStart: () => void;
  onBack: () => void;
}) {
  const today = toISODate(new Date());
  const hist = state.history[profile.id] ?? [];
  const doneToday = isSessionDoneToday(hist, today);
  const lock = profile.sessionLock && state.settings.sessionLockEnabled;
  const wordsLearned = Object.values(state.wordStates).filter(
    (w: WordState) => w.stage === 'Acquired' || w.stage === 'D30' || w.stage === 'D14',
  ).length;

  return (
    <div className="screen home-screen">
      <button className="back-btn" onClick={() => { playTapSound(); onBack(); }} aria-label="Go back">
        ←
      </button>
      <Foxy mood={doneToday ? 'sleep' : 'happy'} size={150} />
      <h1 className="hello">Hello, {profile.name}! 👋</h1>
      <p className="sub">{doneToday ? 'Foxy is sleeping. See you tomorrow!' : 'Ready to play with Foxy?'}</p>
      <div className="stars-row" aria-label={`${wordsLearned} words learned`}>
        ⭐ {wordsLearned} words
      </div>
      <button
        className="big-btn play-btn"
        onClick={() => { playTapSound(); onStart(); }}
        disabled={doneToday && lock}
      >
        {doneToday ? '🌙 Session done for today' : '▶️ Play with Foxy'}
      </button>
    </div>
  );
}
