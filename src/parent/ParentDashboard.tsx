import { useState } from 'react';
import { removeProfile, updateProfile, addCustomWord, removeCustomWord, customWordsFor } from '../store/store';
import { STAGE_ORDER } from '../engine/stages';
import { wordArt } from '../content/art';
import { setDevMistralKey, hasDevMistralKey, clearDevMistralKey, generateStoryWithMistral } from '../speech/mistralClient';
import { validateStory, allowedLexicon } from '../engine/lexicon';
import { wordArt as artFor } from '../content/art';
import { WORDS_ALL } from '../content/curriculum';
import type { AppState, ChildProfile, Story } from '../engine/types';
import { isLockConfigured, setLockCode, removeLock } from '../store/lock';

const CUSTOM_SVGS = ['teddy', 'ball', 'star', 'flower', 'house', 'car', 'cat', 'dog', 'apple'];

function ProgressChart({ state, profileId }: { state: AppState; profileId: string }) {
  const hist = (state.history[profileId] ?? []).slice().sort((a, b) => a.date.localeCompare(b.date));
  const points = hist.map((h, i) => ({ x: 20 + (i * 260) / Math.max(1, hist.length - 1 || 1), y: 90 - Math.min(80, h.wordsReviewed * 4 + h.newWords * 6), date: h.date.slice(5) }));
  return (
    <svg viewBox="0 0 300 100" className="chart" role="img" aria-label="courbe de progression">
      <line x1="20" y1="90" x2="290" y2="90" stroke="#ffd8a8" strokeWidth="2" />
      {points.length > 1 && <polyline points={points.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#f2701d" strokeWidth="3" strokeLinecap="round" />}
      {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#f2701d"><title>{p.date}</title></circle>)}
    </svg>
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

          <h3>📉 Courbe de progression</h3>
          <ProgressChart state={state} profileId={profile.id} />

          <h3>➕ Mots personnalisés (doudou, chien de la famille…)</h3>
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

          <h2>🤖 Génération de contenu (optionnel, clé Mistral)</h2>
          <p className="muted">
            Par défaut, l'app fonctionne 100 % hors ligne avec le contenu pré-généré (78 histoires en banque + voix du navigateur).
            En production (Netlify/Vercel), définissez <code>MISTRAL_API_KEY</code> dans les <strong>variables d'environnement du site</strong> :
            la génération passe alors par un proxy serveur (<code>/api/generate-story</code>) et la clé n'atteint jamais le navigateur.
            En développement local, vous pouvez coller votre clé ci-dessous (mode direct, clé en mémoire d'onglet uniquement).
            Chaque histoire est validée automatiquement contre le vocabulaire déjà appris par l'enfant.
          </p>
          <MistralPanel state={state} profileId={profile?.id} />

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
          <h2>🔒 Verrou d'accès</h2>
          <p className="muted">
            Sans base de données : le code est stocké uniquement sous forme de <strong>hash SHA-256 salé</strong> (20 000 itérations)
            dans le stockage local de cette tablette. Le verrou se rouvre à chaque fermeture de l'onglet.
            Pour une protection réseau complète, activez aussi le Basic Auth Netlify (voir <code>public/_headers</code> et <code>docs/SECURITE.md</code>).
          </p>
          <LockPanel />
          <p className="muted">Aucune donnée ne quitte cet appareil.</p>

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
