import { useEffect, useMemo, useState } from 'react';
import { buildSession, recordResult, ensureFragile, type SessionItem } from '../engine/sessionFlow';
import { WORDS, wordById, pickNewWords, STORIES } from '../content/curriculum';
import { toISODate } from '../engine/schedule';
import { ShowMe, newWordsIntro } from '../games/ShowMe';
import { SimonSays } from '../games/SimonSays';
import { HideSeek } from '../games/HideSeek';
import { FeedFoxy } from '../games/FeedFoxy';
import { SayIt } from '../games/SayIt';
import { Karaoke } from '../games/Karaoke';
import { StoryView } from '../games/StoryView';
import { Foxy } from './Foxy';
import { appendHistory, ensureWordState, setWordState } from '../store/store';
import type { AppState, ChildProfile, Word } from '../engine/types';
import type { SpeechProvider } from '../speech/speech';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function distractors(target: Word, count: number): Word[] {
  const sameTheme = WORDS.filter((w) => w.theme === target.theme && w.id !== target.id);
  const others = WORDS.filter((w) => w.theme !== target.theme && w.id !== target.id);
  return shuffle([...sameTheme, ...others]).slice(0, count - 1);
}

export function Session({
  state,
  profile,
  speech,
  onChange,
  onExit,
}: {
  state: AppState;
  profile: ChildProfile;
  speech: SpeechProvider;
  onChange: (s: AppState) => void;
  onExit: () => void;
}) {
  const today = toISODate(new Date());
  const [items, setItems] = useState<SessionItem[]>([]);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({ reviewed: 0, correct: 0, newWords: 0 });
  const [phase, setPhase] = useState<'intro' | 'play' | 'story' | 'end'>('intro');
  const [introNew, setIntroNew] = useState<Word | null>(null);
  const startedAt = useMemo(() => Date.now(), []);

  useEffect(() => {
    const dueWords = Object.entries(state.wordStates)
      .filter(([, ws]) => ws.dueAt <= today)
      .map(([id, ws]) => ({ id, state: ws }));
    const knownIds = new Set(Object.keys(state.wordStates));
    const candidates = WORDS.filter((w) => !knownIds.has(w.id)).map((w) => w.id);
    const newWordIds = pickNewWords(candidates, [], profile.maxNewWords);
    const fragile = ensureFragile(state, profile.id, today);
    const session = buildSession({ dueWords, newWordIds, fragileWordId: fragile, todayISO: today });
    setItems(session);
  }, []);

  const current = items[index];

  const finishItem = (ok: boolean, item: SessionItem) => {
    let next = state;
    if (item.wordId) {
      next = ensureWordState(next, item.wordId);
      const ws = next.wordStates[item.wordId];
      const updated = recordResult(ws, ok ? 'success' : 'failure', item.format as never, today);
      next = setWordState(next, item.wordId, updated);
      if (item.kind === 'new') next = { ...next };
    }
    onChange(next);
    setStats((s) => ({
      reviewed: s.reviewed + (item.kind === 'review' || item.kind === 'intra' ? 1 : 0),
      correct: s.correct + (ok && (item.kind === 'review' || item.kind === 'intra') ? 1 : 0),
      newWords: s.newWords + (item.kind === 'new' ? 1 : 0),
    }));

    if (item.kind === 'new' && item.wordId) {
      const w = wordById(item.wordId);
      if (w) {
        setIntroNew(w);
        setPhase('intro');
        newWordsIntro(w, speech);
        return;
      }
    }
    if (item.kind === 'story') {
      setPhase('story');
      return;
    }
    const nextIndex = index + 1;
    if (nextIndex >= items.length) {
      const durationSec = Math.round((Date.now() - startedAt) / 1000);
      onChange(appendHistory(next, profile.id, { date: today, wordsReviewed: stats.reviewed + (item.kind === 'review' ? 1 : 0), correct: stats.correct, newWords: stats.newWords + (item.kind === 'new' ? 1 : 0), durationSec }));
      setPhase('end');
    } else {
      setIndex(nextIndex);
    }
  };

  if (phase === 'intro' && introNew) {
    return (
      <div className="screen center">
        <Foxy mood="point" size={140} />
        <h2 className="instruction">New word!</h2>
        <button className="option-card big-card" onClick={() => { speech.speak(`${introNew.text}!`); }}>
          <span dangerouslySetInnerHTML={{ __html: introNew.svg }} className="word-art" style={{ width: 160, height: 160 }} />
          {profile.showWrittenWords && <span className="word-text">{introNew.text}</span>}
        </button>
        <button className="big-btn" onClick={() => { setPhase('play'); setIntroNew(null); }}>👍 Got it!</button>
      </div>
    );
  }

  if (phase === 'story') {
    const story = STORIES[Math.floor(Math.random() * STORIES.length)];
    return <StoryView story={story} speech={speech} childName={profile.name} onDone={() => finishItem(true, { kind: 'story', format: 'story' })} />;
  }

  if (phase === 'end') {
    return (
      <div className="screen center">
        <Foxy mood="sleep" size={150} />
        <h2 className="instruction">Well done, {profile.name}! 🌟</h2>
        <p className="sub">Foxy is going to sleep now. See you soon!</p>
        <div className="parent-tip">
          <strong>For the parent:</strong> Ask your child: “Where is the cat?” — in real life!
        </div>
        <button className="big-btn" onClick={onExit}>🏠 Home</button>
      </div>
    );
  }

  if (!current) return <div className="screen center"><Foxy mood="happy" /><button className="big-btn" onClick={onExit}>🏠 Home</button></div>;

  const word = current.wordId ? wordById(current.wordId) : undefined;
  if (!word) {
    finishItem(true, current);
    return null;
  }

  const isNew = current.kind === 'new' || state.wordStates[current.wordId ?? '']?.stage === 'New';
  const nChoices = isNew ? 2 : 3;
  const options = shuffle([word, ...distractors(word, Math.min(4, Math.max(2, nChoices)))]);
  const gameProps = { target: word, options, speech, showText: profile.showWrittenWords, onResult: (ok: boolean) => finishItem(ok, current) };

  let game;
  switch (current.format) {
    case 'simon-says': game = <SimonSays {...gameProps} />; break;
    case 'hide-seek': game = <HideSeek {...gameProps} />; break;
    case 'say-it': game = <SayIt {...gameProps} />; break;
    case 'karaoke': game = <Karaoke {...gameProps} />; break;
    case 'feed-foxy': game = <FeedFoxy {...gameProps} />; break;
    default: game = <ShowMe {...gameProps} />;
  }

  return (
    <div className="session-wrap">
      <div className="session-header">
        <Foxy mood="happy" size={54} />
        <div className="progress-dots">
          {items.map((it, i) => (
            <span key={i} className={`dot ${i < index ? 'done' : ''} ${i === index ? 'current' : ''}`} />
          ))}
        </div>
      </div>
      {game}
    </div>
  );
}
