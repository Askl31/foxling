import { useMemo, useState } from 'react';
import { loadState, saveState } from './store/store';
import { BrowserSpeechProvider } from './speech/speech';
import { ProfileSelect } from './ui/ProfileSelect';
import { ProfileSetup } from './ui/ProfileSetup';
import { Home } from './ui/Home';
import { Session } from './ui/Session';
import { ParentDashboard } from './parent/ParentDashboard';
import type { AppState } from './engine/types';

type View = 'select' | 'setup' | 'home' | 'session' | 'parent';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [view, setView] = useState<View>(() => (loadState().profiles.length === 0 ? 'setup' : 'select'));
  const speech = useMemo(() => {
    const s = new BrowserSpeechProvider();
    s.setRate(loadState().settings.voiceRate ?? 0.9);
    return s;
  }, []);

  const update = (next: AppState) => {
    saveState(next);
    setState(next);
    speech.setRate(next.settings.voiceRate);
  };

  const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId);

  if (view === 'setup' || (view === 'select' && state.profiles.length === 0)) {
    return <ProfileSetup state={state} onChange={(s) => { update(s); setView('select'); }} />;
  }

  if (view === 'parent') {
    return <ParentDashboard state={state} onChange={update} onBack={() => setView('select')} />;
  }

  if (view === 'select') {
    return (
      <ProfileSelect
        state={state}
        onPick={(id) => { update({ ...state, activeProfileId: id }); setView('home'); }}
        onAdd={() => setView('setup')}
        onParent={() => setView('parent')}
      />
    );
  }

  if (view === 'home' && activeProfile) {
    return <Home state={state} profile={activeProfile} onStart={() => setView('session')} onBack={() => setView('select')} />;
  }

  if (view === 'session' && activeProfile) {
    return <Session state={state} profile={activeProfile} speech={speech} onChange={update} onExit={() => setView('home')} />;
  }

  return <ProfileSelect state={state} onPick={(id) => { update({ ...state, activeProfileId: id }); setView('home'); }} onAdd={() => setView('setup')} onParent={() => setView('parent')} />;
}
