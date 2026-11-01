import { useState } from 'react';
import { removeProfile, updateProfile, addCustomWord, removeCustomWord, customWordsFor } from '../store/store';
import { STAGE_ORDER } from '../engine/stages';
import { wordArt } from '../content/art';
import { setDevMistralKey, hasDevMistralKey, clearDevMistralKey, generateStoryWithMistral } from '../speech/mistralClient';
import { validateStory, allowedLexicon } from '../engine/lexicon';
import { wordArt as artFor } from '../content/art';
import { WORDS_ALL } from '../content/curriculum';
import type { AppState, ChildProfile, Story, WordLike } from '../engine/types';
import { isLockConfigured, setLockCode, removeLock } from '../store/lock';

const CUSTOM_SVGS = ['teddy', 'ball', 'star', 'flower', 'house', 'car', 'cat', 'dog', 'apple'];

function StickerAlbum({ state, customs }: { state: AppState; customs: WordLike[] }) {
  const entries = Object.entries(state.wordStates);
  const pool = [...WORDS_ALL, ...customs];

  if (entries.length === 0) {
    return (
      <div className="chart-empty">
        <span>🌱</span>
        <p>Aucun mot encore vu. Commencez une première session pour remplir l'album !</p>
      </div>
    );
  }

  return (
    <div className="sticker-album-grid">
      {entries.map(([id, ws]) => {
        const w = pool.find((x) => x.id === id);
        const isAcquired = ws.stage === 'Acquired' || ws.stage === 'D30';
        return (
          <div key={id} className={`sticker-card ${isAcquired ? 'acquired' : 'learning'}`}>
            <span className="sticker-badge">{isAcquired ? '⭐ Acquis' : FR_STAGES[ws.stage]}</span>
            <div
              className="sticker-thumb"
              dangerouslySetInnerHTML={{ __html: w?.svg ?? wordArt(id) }}
            />
            <span className="sticker-name">{w?.text ?? id}</span>
          </div>
        );
      })}
    </div>
  );
}

function BackupRestorePanel({ state, onChange }: { state: AppState; onChange: (s: AppState) => void }) {
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const exportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `foxling-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setMsg({ type: 'ok', text: '✅ Sauvegarde téléchargée avec succès.' });
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as AppState;
        if (parsed.profiles && parsed.wordStates && parsed.settings) {
          onChange(parsed);
          setMsg({ type: 'ok', text: '✅ Sauvegarde restaurée avec succès ! Vos profils et données sont à jour.' });
        } else {
          setMsg({ type: 'err', text: '❌ Le fichier sélectionné n\'est pas une sauvegarde Foxling valide.' });
        }
      } catch {
        setMsg({ type: 'err', text: '❌ Impossible de lire ce fichier.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="backup-panel">
      <div className="backup-actions">
        <button className="big-btn small-btn" onClick={exportBackup}>
          💾 Exporter la sauvegarde (JSON)
        </button>
        <label className="big-btn small-btn backup-import-btn">
          📂 Restaurer un fichier JSON
          <input type="file" accept=".json" onChange={importBackup} style={{ display: 'none' }} />
        </label>
      </div>
      {msg && <p className={`backup-msg ${msg.type}`}>{msg.text}</p>}
    </div>
  );
}

function ProgressChart({ state, profileId }: { state: AppState; profileId: string }) {
  const hist = (state.history[profileId] ?? []).slice().sort((a, b) => a.date.localeCompare(b.date));
  if (hist.length === 0) {
    return (
      <div className="chart-empty">
        <span>🌱</span>
        <p>Aucune session enregistrée pour l'instant. La courbe apparaîtra après la première séance !</p>
      </div>
    );
  }
  const points = hist.map((h, i) => ({
    x: 20 + (i * 260) / Math.max(1, hist.length - 1 || 1),
    y: 90 - Math.min(80, h.wordsReviewed * 4 + h.newWords * 6),
    date: h.date.slice(5),
  }));
  return (
    <div className="chart-wrapper">
      <svg viewBox="0 0 300 100" className="chart" role="img" aria-label="courbe de progression">
        <line x1="20" y1="90" x2="290" y2="90" stroke="#ffd8a8" strokeWidth="2" />
        {points.length > 1 && (
          <polyline
            points={points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#f2701d"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#f2701d">
            <title>{p.date}</title>
          </circle>
        ))}
      </svg>
      <div className="chart-legend">
        <span>📅 Évolution de l'effort et du rappel au fil des jours</span>
      </div>
    </div>
  );
}

const FR_STAGES: Record<string, string> = {
  New: 'Nouveau', D1: 'J+1', D3: 'J+3', D7: 'J+7', D14: 'J+14', D30: 'J+30', Acquired: 'Acquis',
};

function CustomWordForm({ state, profileId, onChange }: { state: AppState; profileId: string; onChange: (s: AppState) => void }) {
  const [text, setText] = useState('');
  const [svg, setSvg] = useState(CUSTOM_SVGS[0]);
  return (
    <div className="custom-form">
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="ex. Médor (le chien)" maxLength={20} />
      <div className="color-row">
        {CUSTOM_SVGS.map((s) => (
          <button key={s} className={`custom-svg-btn ${svg === s ? 'selected' : ''}`} onClick={() => setSvg(s)} aria-label={`image ${s}`}>
            <span dangerouslySetInnerHTML={{ __html: wordArt(s) }} style={{ width: 34, height: 34, display: 'block' }} />
          </button>
        ))}
      </div>
      <button className="big-btn small-btn" disabled={!text.trim()} onClick={() => { onChange(addCustomWord(state, profileId, text, svg)); setText(''); }}>➕ Ajouter</button>
    </div>
  );
}

export function ParentDashboard({ state, onChange, onBack }: { state: AppState; onChange: (s: AppState) => void; onBack: () => void }) {
  const [tab, setTab] = useState<string>(state.profiles[0]?.id ?? 'reglages');
  const [wordsView, setWordsView] = useState<'album' | 'table'>('album');

  const profile = state.profiles.find((p) => p.id === tab);

  const testVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance("Hello! I am Foxy! Let's learn English together!");
      u.lang = 'en-US';
      u.volume = state.settings.volume;
      u.rate = state.settings.voiceRate;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="screen parent-screen">
      <div className="parent-header-bar">
        <button className="parent-back-btn" onClick={onBack} aria-label="Retour à l'accueil">
          ← Retour
        </button>
        <div className="parent-title-group">
          <h1>👨‍👩‍👧 Espace parent</h1>
          <p className="parent-subtitle">Suivi des apprentissages, réglages et gestion des données</p>
        </div>
      </div>

      <div className="parent-nav-tabs">
        {state.profiles.map((p) => (
          <button
            key={p.id}
            className={`parent-tab ${tab === p.id ? 'active' : ''}`}
            onClick={() => setTab(p.id)}
          >
            <span className="tab-avatar-dot" style={{ background: p.avatarColor }} />
            {p.name} ({p.age} ans)
          </button>
        ))}
        <button
          className={`parent-tab ${tab === 'reglages' ? 'active' : ''}`}
          onClick={() => setTab('reglages')}
        >
          ⚙️ Réglages & Sécurité
        </button>
      </div>

      {profile && tab === profile.id && (
        <div className="parent-tab-content">
          <div className="parent-card">
            <h2>📈 Statistiques de {profile.name}</h2>
            <div className="stat-grid">
              <div className="stat">
                <span className="stat-num">{Object.values(state.wordStates).filter((w) => w.stage === 'Acquired').length}</span>
                <span className="stat-label">⭐ Mots acquis</span>
              </div>
              <div className="stat">
                <span className="stat-num">{Object.keys(state.wordStates).length}</span>
                <span className="stat-label">👁️ Mots vus</span>
              </div>
              <div className="stat">
                <span className="stat-num">{(state.history[profile.id] ?? []).length}</span>
                <span className="stat-label">📅 Sessions jouées</span>
              </div>
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
                <span className="stat-label">🎯 Taux de réussite</span>
              </div>
            </div>
          </div>

          <div className="parent-card">
            <div className="card-header-split">
              <div>
                <h3>📚 Vocabulaire ({Object.keys(state.wordStates).length} mot{Object.keys(state.wordStates).length > 1 ? 's' : ''})</h3>
                <p className="card-subtitle">Visualisez les progrès de mémorisation mot par mot</p>
              </div>
              <div className="tabs">
                <button className={`tab ${wordsView === 'album' ? 'selected' : ''}`} onClick={() => setWordsView('album')}>
                  🖼️ Album vignettes
                </button>
                <button className={`tab ${wordsView === 'table' ? 'selected' : ''}`} onClick={() => setWordsView('table')}>
                  📋 Tableau SRS
                </button>
              </div>
            </div>

            {wordsView === 'album' ? (
              <StickerAlbum state={state} customs={customWordsFor(state, profile.id)} />
            ) : (
              <div className="table-responsive">
                <table className="words-table">
                  <thead><tr><th>Mot</th><th>Stade</th><th>Prochaine révision</th><th>Relances</th></tr></thead>
                  <tbody>
                    {Object.entries(state.wordStates)
                      .sort((a, b) => STAGE_ORDER.indexOf(a[1].stage) - STAGE_ORDER.indexOf(b[1].stage))
                      .slice(0, 40)
                      .map(([id, ws]) => (
                        <tr key={id}>
                          <td><strong>{id}</strong></td>
                          <td><span className="stage-badge">{FR_STAGES[ws.stage]}</span></td>
                          <td>{ws.dueAt}</td>
                          <td>{ws.lapses}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="parent-card">
            <h3>📉 Courbe d'apprentissage</h3>
            <p className="card-subtitle">Volume et rappels quotidiens au fil des sessions</p>
            <ProgressChart state={state} profileId={profile.id} />
          </div>

          <div className="parent-card">
            <h3>➕ Mots personnalisés (doudou, chien de la famille...)</h3>
            <p className="card-subtitle">
              Ajoutez des mots uniques à votre environnement : ils seront automatiquement injectés dans les jeux et histoires de {profile.name}.
            </p>
            <div className="custom-word-row">
              {customWordsFor(state, profile.id).map((w) => (
                <span key={w.id} className="custom-chip">
                  <span dangerouslySetInnerHTML={{ __html: wordArt(w.svg) }} style={{ width: 28, height: 28, display: 'inline-block', verticalAlign: 'middle' }} />
                  {' '}{w.text}
                  <button className="chip-del" onClick={() => onChange(removeCustomWord(state, w.id))} aria-label={`supprimer ${w.text}`}>✕</button>
                </span>
              ))}
            </div>
            <CustomWordForm state={state} profileId={profile.id} onChange={onChange} />
          </div>

          <div className="parent-card">
            <h3>📅 Historique des sessions récentes</h3>
            {(state.history[profile.id] ?? []).length === 0 ? (
              <p className="muted">Aucune session enregistrée pour le moment. Foxy attend {profile.name} pour jouer !</p>
            ) : (
              <ul className="history-list">
                {(state.history[profile.id] ?? []).slice().reverse().slice(0, 10).map((h) => (
                  <li key={h.date}>
                    📅 <strong>{h.date}</strong> : {h.newWords} nouveau(x) mot(s), {h.correct}/{h.wordsReviewed} réussites, durée {Math.round(h.durationSec / 60)} min
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="parent-card">
            <h3>🎯 Passions & réglages du profil</h3>
            <label className="field">
              <span>Passions de {profile.name} (séparées par des virgules)</span>
              <input
                value={profile.passions.join(', ')}
                placeholder="ex. dinosaures, princesses, voitures..."
                onChange={(e) => onChange(updateProfile(state, profile.id, { passions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
              />
              <small className="muted">Foxy utilise ces passions pour personnaliser les histoires.</small>
            </label>
            <label className="field checkbox" style={{ marginTop: 12 }}>
              <input
                type="checkbox"
                checked={profile.sessionLock}
                onChange={(e) => onChange(updateProfile(state, profile.id, { sessionLock: e.target.checked }))}
              />
              <span>Verrou de session (limite à 1 session par jour pour {profile.name})</span>
            </label>
            <div className="danger-zone">
              <h4>Zone sensible</h4>
              <p className="muted">Supprime définitivement ce profil et son historique local.</p>
              <button className="danger-btn" onClick={() => { if (confirm(`Supprimer définitivement le profil de ${profile.name} ?`)) onChange(removeProfile(state, profile.id)); }}>
                🗑️ Supprimer ce profil
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'reglages' && (
        <div className="parent-tab-content">
          <div className="parent-card">
            <h2>🔊 Audio & Voix de Foxy</h2>
            <div className="settings-sliders">
              <label className="field">
                <span>Volume de la voix : <strong>{Math.round(state.settings.volume * 100)} %</strong></span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={state.settings.volume}
                  onChange={(e) => onChange({ ...state, settings: { ...state.settings, volume: Number(e.target.value) } })}
                />
              </label>
              <label className="field">
                <span>Vitesse d'élocution : <strong>{state.settings.voiceRate.toFixed(2)}x</strong></span>
                <input
                  type="range"
                  min={0.6}
                  max={1.2}
                  step={0.05}
                  value={state.settings.voiceRate}
                  onChange={(e) => onChange({ ...state, settings: { ...state.settings, voiceRate: Number(e.target.value) } })}
                />
              </label>
            </div>
            <button className="big-btn small-btn voice-test-btn" onClick={testVoice}>
              🔊 Tester la voix de Foxy
            </button>
            <div style={{ marginTop: 16 }}>
              <label className="field checkbox">
                <input
                  type="checkbox"
                  checked={state.settings.sessionLockEnabled}
                  onChange={(e) => onChange({ ...state, settings: { ...state.settings, sessionLockEnabled: e.target.checked } })}
                />
                <span>Activer le verrou de session global pour tous les profils</span>
              </label>
            </div>
          </div>

          <div className="parent-card">
            <h2>💡 Défis du quotidien (Hors-écran)</h2>
            <p className="card-subtitle">
              Propositions simples et bienveillantes pour prolonger l'anglais naturellement dans les moments du quotidien :
            </p>
            <div className="challenges-grid">
              <div className="challenge-card">
                <span className="challenge-icon">🐱</span>
                <p>« Ask your child: <em>Where is the cat?</em> » — dans la vraie vie !</p>
              </div>
              <div className="challenge-card">
                <span className="challenge-icon">🙌</span>
                <p>« <em>Show me your hands!</em> » — avant de passer à table.</p>
              </div>
              <div className="challenge-card">
                <span className="challenge-icon">🔢</span>
                <p>« Count with your child: <em>one, two, three!</em> » — en montant les marches.</p>
              </div>
            </div>
          </div>

          <div className="parent-card">
            <h2>💾 Sauvegarde & Restauration (Zéro perte)</h2>
            <p className="card-subtitle">
              Vos données sont stockées uniquement sur cet appareil. Exportez régulièrement un fichier JSON pour prévenir toute purge du navigateur ou pour transférer les progrès sur une autre tablette.
            </p>
            <BackupRestorePanel state={state} onChange={onChange} />
          </div>

          <div className="parent-card">
            <h2>🔒 Verrou d'accès parental (Code PIN)</h2>
            <p className="card-subtitle">
              Protégez l'accès à cet espace. Le code est chiffré localement (hash SHA-256 salé 20 000 itérations). Il se reverrouille à chaque fermeture de l'onglet.
            </p>
            <LockPanel />
          </div>

          <div className="parent-card">
            <h2>🤖 Générateur d'histoires IA (Avancé / Optionnel)</h2>
            <p className="card-subtitle">
              L'application intègre déjà plus de 75 histoires validées 100 % hors ligne. Ce panneau vous permet de générer des histoires supplémentaires via Mistral AI si vous le souhaitez.
            </p>
            <MistralPanel state={state} profileId={state.profiles[0]?.id} />
          </div>
        </div>
      )}
    </div>
  );
}

function LockPanel() {
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [configured, setConfigured] = useState(isLockConfigured());

  const save = async () => {
    if (code.length < 4) { setMsg('❌ Le code doit faire au moins 4 chiffres.'); return; }
    if (code !== confirm) { setMsg('❌ Les deux codes ne correspondent pas.'); return; }
    await setLockCode(code);
    setConfigured(true);
    setMsg('✅ Verrou activé. Le code n\'est jamais stocké en clair.');
    setCode(''); setConfirm('');
  };

  return (
    <div className="mistral-panel">
      {configured ? (
        <>
          <span className="ok-badge">✅ Verrou actif (hash local uniquement)</span>
          <button className="danger-btn" onClick={() => { removeLock(); setConfigured(false); setMsg('Verrou supprimé.'); }}>Supprimer le verrou</button>
        </>
      ) : (
        <>
          <div className="key-row">
            <input type="password" inputMode="numeric" placeholder="Nouveau code (4+ chiffres)" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
            <input type="password" inputMode="numeric" placeholder="Confirmer" value={confirm} onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ''))} />
          </div>
          <button className="big-btn small-btn" onClick={save}>🔒 Activer le verrou</button>
        </>
      )}
      {msg && <p className="mistral-msg">{msg}</p>}
    </div>
  );
}

function MistralPanel({ state, profileId }: { state: AppState; profileId?: string }) {
  const [keyInput, setKeyInput] = useState('');
  const [configured, setConfigured] = useState(hasDevMistralKey());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<Story | null>(null);

  const profile = profileId ? state.profiles.find((p) => p.id === profileId) : undefined;

  const generate = async () => {
    if (!profile) return;
    setBusy(true); setMsg(null); setPreview(null);
    try {
      const allowed = allowedLexicon(state.wordStates, []);
      const learned = WORDS_ALL.filter((w) => allowed.has(w.id)).map((w) => w.id);
      const raw = await generateStoryWithMistral({
        allowedWords: learned.length ? learned : ['cat', 'dog', 'duck', 'fish'],
        childName: profile.name,
        passions: profile.passions,
        theme: WORDS_ALL.find((w) => allowed.has(w.id))?.theme ?? 'farm',
      });
      const parsed = JSON.parse(raw) as { title: string; pages: { text: string; imageHint?: string; question?: { prompt: string; choices: string[]; answerIndex: number } }[] };
      const allowed2 = allowedLexicon(state.wordStates, []);
      allowed2.add(profile.name.toLowerCase().replace(/[^a-z'-]/g, ''));
      const story: Story = {
        id: `mistral-${Date.now()}`,
        theme: 'custom',
        title: parsed.title ?? 'New story',
        pages: parsed.pages.map((p) => ({
          text: p.text,
          svg: artFor(p.imageHint ?? 'foxy') && (p.imageHint ?? '').length < 30 && WORDS_ALL.some((w) => w.id === p.imageHint) ? WORDS_ALL.find((w) => w.id === p.imageHint)!.svg : 'foxy:happy',
          question: p.question ? { prompt: p.question.prompt, choices: p.question.choices, answerIndex: p.question.answerIndex } : undefined,
        })),
      };
      const violations = validateStory(story, allowed2);
      if (violations.length) {
        setMsg(`⚠️ Histoire rejetée (lexique non appris : ${violations.join(', ')}). Régénérez ou apprenez d'abord ces mots.`);
      } else {
        setPreview(story);
        setMsg(`✅ Histoire « ${story.title} » générée et validée (${story.pages.length} pages, lexique 100 % appris). Aperçu ci-dessous.`);
      }
    } catch (e) {
      setMsg(`❌ ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mistral-panel">
      {!configured ? (
        <div className="field">
          <span>Clé API Mistral — mode développement local uniquement (en prod, utilisez la variable d'environnement du site)</span>
          <div className="key-row">
            <input type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="sk-…" />
            <button className="big-btn small-btn" disabled={!keyInput.trim()} onClick={() => { setDevMistralKey(keyInput); setConfigured(true); setKeyInput(''); }}>Activer</button>
          </div>
        </div>
      ) : (
        <div className="key-row">
          <span className="ok-badge">✅ Clé dev active (session uniquement) — sinon le proxy serveur est utilisé</span>
          <button className="danger-btn" onClick={() => { clearDevMistralKey(); setConfigured(false); setMsg(null); }}>Oublier la clé</button>
        </div>
      )}
      {configured && profile && (
        <button className="big-btn" disabled={busy} onClick={generate}>
          {busy ? '⏳ Génération…' : `✨ Générer une histoire pour ${profile.name}`}
        </button>
      )}
      {msg && <p className="mistral-msg">{msg}</p>}
      {preview && (
        <div className="story-preview">
          <strong>{preview.title}</strong>
          {preview.pages.map((p, i) => <p key={i}>{p.text}</p>)}
        </div>
      )}
      <p className="muted">Script en amont (hors ligne ensuite) : <code>MISTRAL_API_KEY=… node scripts/generate-content.mjs stories --count 40</code></p>
    </div>
  );
}
