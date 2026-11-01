import { useState } from 'react';
import { removeProfile, updateProfile } from '../store/store';
import { STAGE_ORDER } from '../engine/stages';
import type { AppState, ChildProfile } from '../engine/types';

const FR_STAGES: Record<string, string> = {
  New: 'Nouveau', D1: 'J+1', D3: 'J+3', D7: 'J+7', D14: 'J+14', D30: 'J+30', Acquired: 'Acquis',
};

export function ParentDashboard({ state, onChange, onBack }: { state: AppState; onChange: (s: AppState) => void; onBack: () => void }) {
  const [tab, setTab] = useState<string>(state.profiles[0]?.id ?? 'reglages');

  const profile = state.profiles.find((p) => p.id === tab);

  return (
    <div className="screen parent-screen">
      <button className="back-btn" onClick={onBack}>← Retour</button>
      <h1>👨‍👩‍👧 Espace parent</h1>

      <div className="tabs">
        {state.profiles.map((p) => (
          <button key={p.id} className={`tab ${tab === p.id ? 'selected' : ''}`} onClick={() => setTab(p.id)}>
            {p.name} ({p.age} ans)
          </button>
        ))}
        <button className={`tab ${tab === 'reglages' ? 'selected' : ''}`} onClick={() => setTab('reglages')}>⚙️ Réglages</button>
      </div>

      {profile && tab === profile.id && (
        <div>
          <h2>📈 Progression de {profile.name}</h2>
          <div className="stat-grid">
            <div className="stat"><span className="stat-num">{Object.values(state.wordStates).filter((w) => w.stage === 'Acquired').length}</span><span>mots acquis</span></div>
            <div className="stat"><span className="stat-num">{Object.keys(state.wordStates).length}</span><span>mots vus</span></div>
            <div className="stat"><span className="stat-num">{(state.history[profile.id] ?? []).length}</span><span>sessions</span></div>
            <div className="stat">
              <span className="stat-num">
                {(() => {
                  const h = state.history[profile.id] ?? [];
                  if (!h.length) return '—';
                  const total = h.reduce((a, x) => a + x.correct, 0);
                  const tot = h.reduce((a, x) => a + x.wordsReviewed, 0);
                  return tot ? `${Math.round((total / tot) * 100)} %` : '—';
                })()}
              </span>
              <span>taux de réussite</span>
            </div>
          </div>

          <h3>Mots en cours d'apprentissage</h3>
          <table className="words-table">
            <thead><tr><th>Mot</th><th>Stade</th><th>Prochaine révision</th><th>Relances</th></tr></thead>
            <tbody>
              {Object.entries(state.wordStates)
                .sort((a, b) => STAGE_ORDER.indexOf(a[1].stage) - STAGE_ORDER.indexOf(b[1].stage))
                .slice(0, 40)
                .map(([id, ws]) => (
                  <tr key={id}>
                    <td>{id}</td><td>{FR_STAGES[ws.stage]}</td><td>{ws.dueAt}</td><td>{ws.lapses}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h3>Historique des sessions</h3>
          <ul className="history-list">
            {(state.history[profile.id] ?? []).slice().reverse().slice(0, 10).map((h) => (
              <li key={h.date}>{h.date} — {h.newWords} nouveaux mots, {h.correct}/{h.wordsReviewed} réussites, {Math.round(h.durationSec / 60)} min</li>
            ))}
          </ul>

          <h3>Passions & réglages du profil</h3>
          <label className="field">
            <span>Passions (séparées par des virgules)</span>
            <input
              value={profile.passions.join(', ')}
              onChange={(e) => onChange(updateProfile(state, profile.id, { passions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
            />
          </label>
          <label className="field checkbox">
            <input
              type="checkbox"
              checked={profile.sessionLock}
              onChange={(e) => onChange(updateProfile(state, profile.id, { sessionLock: e.target.checked }))}
            />
            <span>Verrou de session (1 session / jour)</span>
          </label>
          <button className="danger-btn" onClick={() => { if (confirm(`Supprimer le profil de ${profile.name} ?`)) onChange(removeProfile(state, profile.id)); }}>
            🗑️ Supprimer ce profil
          </button>
        </div>
      )}

      {tab === 'reglages' && (
        <div>
          <h2>⚙️ Réglages</h2>
          <label className="field">
            <span>Volume de la voix ({Math.round(state.settings.volume * 100)} %)</span>
            <input type="range" min={0} max={1} step={0.05} value={state.settings.volume}
              onChange={(e) => onChange({ ...state, settings: { ...state.settings, volume: Number(e.target.value) } })} />
          </label>
          <label className="field">
            <span>Vitesse de la voix ({state.settings.voiceRate.toFixed(2)})</span>
            <input type="range" min={0.6} max={1.2} step={0.05} value={state.settings.voiceRate}
              onChange={(e) => onChange({ ...state, settings: { ...state.settings, voiceRate: Number(e.target.value) } })} />
          </label>
          <label className="field checkbox">
            <input type="checkbox" checked={state.settings.sessionLockEnabled}
              onChange={(e) => onChange({ ...state, settings: { ...state.settings, sessionLockEnabled: e.target.checked } })} />
            <span>Activer le verrou de session pour tous les profils</span>
          </label>
          <h3>💡 Défis hors-écran du jour</h3>
          <ul className="history-list">
            <li>« Ask your child: Where is the cat? » — dans la vraie vie !</li>
            <li>« Show me your hands! » — au moment du goûter.</li>
            <li>« Count with your child: one, two, three! » — dans la voiture.</li>
          </ul>
          <p className="muted">Aucune donnée ne quitte cet appareil.</p>
        </div>
      )}
    </div>
  );
}
