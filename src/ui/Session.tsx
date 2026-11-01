import { useEffect, useMemo, useState } from 'react';
import { buildSession, recordResult, ensureFragile, type SessionItem } from '../engine/sessionFlow';
import { WORDS_ALL, wordById, pickNewWords, SONGS } from '../content/curriculum';
import { storyOfTheDay, withChildName as withName } from '../content/generatedLoader';
import { customWordsFor } from '../store/store';
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

function distractors(target: Word, count: number, pool: Word[]): Word[] {
  const sameTheme = pool.filter((w) => w.theme === target.theme && w.id !== target.id);
  const others = pool.filter((w) => w.theme !== target.theme && w.id !== target.id);
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
  const [phase, setPhase] = useState<'open' | 'intro' | 'play' | 'end'>('open');
  const [introNew, setIntroNew] = useState<Word | null>(null);
  const [streakFails, setStreakFails] = useState(0);
  const [reexplain, setReexplain] = useState(false);
  const startedAt = useMemo(() => Date.now(), []);

  useEffect(() => {
    speech.speak(`Hello, ${profile.name}! Hello, hello! Let's play with Foxy!`);
  }, []);

  const customs = customWordsFor(state, profile.id);
  const pool = [...WORDS_ALL, ...customs] as typeof WORDS_ALL;

  useEffect(() => {
    const dueWords = Object.entries(state.wordStates)
      .filter(([, ws]) => ws.dueAt <= today)
      .map(([id, ws]) => ({ id, state: ws }));
    const knownIds = new Set(Object.keys(state.wordStates));
    const candidates = pool.filter((w) => !knownIds.has(w.id)).map((w) => w.id);
    const newWordIds = pickNewWords(candidates, [], profile.maxNewWords, pool);
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
    const fails = ok ? 0 : streakFails + 1;
    setStreakFails(fails);
    setReexplain(fails >= 3);
    if (fails >= 3) {
      setTimeout(() => {
        speech.speak(`Let's look together, ${profile.name}! Watch Foxy!`);
        setReexplain(false);
        setStreakFails(0);
      }, 600);
    }
    setStats((s) => ({
      reviewed: s.reviewed + (item.kind === 'review' || item.kind === 'intra' ? 1 : 0),
      correct: s.correct + (ok && (item.kind === 'review' || item.kind === 'intra') ? 1 : 0),
      newWords: s.newWords + (item.kind === 'new' ? 1 : 0),
    }));

    const nextIndex = index + 1;
    if (item.kind === 'new' && item.wordId) {
      const w = wordById(item.wordId);
      if (w) {
        setIndex(nextIndex);
        setIntroNew(w);
        setPhase('intro');
        newWordsIntro(w, speech);
        return;
      }
    }
    if (nextIndex >= items.length) {
      const durationSec = Math.round((Date.now() - startedAt) / 1000);
      onChange(appendHistory(next, profile.id, { date: today, wordsReviewed: stats.reviewed + (item.kind === 'review' ? 1 : 0), correct: stats.correct, newWords: stats.newWords + (item.kind === 'new' ? 1 : 0), durationSec }));
      setPhase('end');
    } else {
      setIndex(nextIndex);
    }
  };

  if (phase === 'open') {
    return (
      <div className="screen center">
        <Foxy mood="happy" size={160} />
        <h2 className="instruction big">🎵 Hello, hello! 🎵</h2>
        <p className="sub">Let's play with Foxy!</p>
        <button className="big-btn" onClick={() => setPhase('play')}>▶️ Let's go!</button>
      </div>
    );
  }

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

  if (phase === 'end') {
    const stickers = Math.min(5, 1 + stats.correct);
    return (
      <div className="screen center">
        <Foxy mood="sleep" size={150} />
        <h2 className="instruction">Well done, {profile.name}! 🌟</h2>
        <div className="sticker-row" aria-label={`${stickers} stickers`}>
          {Array.from({ length: stickers }).map((_, i) => <span key={i} className="sticker">⭐</span>)}
        </div>
        <p className="sub">Foxy is going to sleep now. See you soon!</p>
        <div className="parent-tip">
          <strong>For the parent:</strong> Ask your child: “Where is the cat?” — in real life!
        </div>
        <button className="big-btn" onClick={onExit}>🏠 Home</button>
      </div>
    );
  }

  if (!current) return <div className="screen center"><Foxy mood="happy" /><button className="big-btn" onClick={onExit}>🏠 Home</button></div>;

  if (current.kind === 'story') {
    const story = withName(storyOfTheDay(profile.id, today), profile.name);
    return <StoryView story={story} speech={speech} childName={profile.name} onDone={() => finishItem(true, current)} />;
  }

  const word = current.wordId ? wordById(current.wordId, customs) : undefined;
  if (!word) return <div className="screen center"><Foxy mood="happy" /><button className="big-btn" onClick={onExit}>🏠 Home</button></div>;

  const isNew = current.kind === 'new' || state.wordStates[current.wordId ?? '']?.stage === 'New';
  const nChoices = isNew ? 2 : 3;
  const options = shuffle([word, ...distractors(word, Math.min(4, Math.max(2, nChoices)), pool)]);
  const gameProps = { target: word, options, speech, showText: profile.showWrittenWords, onResult: (ok: boolean) => finishItem(ok, current) };

  let game;
  const isFood = word.theme === 'food' && (current.format === 'show-me');
  switch (true) {
    case isFood: game = <FeedFoxy {...gameProps} />; break;
    case current.format === 'simon-says': game = <SimonSays {...gameProps} />; break;
    case current.format === 'hide-seek': game = <HideSeek {...gameProps} />; break;
    case current.format === 'say-it': game = <SayIt {...gameProps} />; break;
    case current.format === 'karaoke': {
      const song = SONGS.find((s) => s.theme === word.theme) ?? SONGS[0];
      game = <Karaoke {...gameProps} song={song} />;
      break;
    }
    case current.format === 'feed-foxy': game = <FeedFoxy {...gameProps} />; break;
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
      {reexplain && <p className="instruction">👀 Watch Foxy, {profile.name}!</p>}
      {game}
    </div>
  );
}
