import { useEffect, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import { wordArt } from '../content/art';
import { wordById } from '../content/curriculum';
import { AudioPrompt } from '../ui/AudioPrompt';
import { playTapSound, playSuccessSound, playTryAgainSound } from '../speech/sfx';
import type { SpeechProvider } from '../speech/speech';
import { fetchAndCacheAudio } from '../speech/audioCache';
import type { Story } from '../engine/types';

function resolveArt(svg: string): string {
  if (svg.startsWith('foxy:')) return svg; // géré par Foxy
  return wordArt(svg);
}

export function StoryView({ story, speech, childName, onDone }: { story: Story; speech: SpeechProvider; childName: string; onDone: () => void }) {
  const [page, setPage] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const p = story.pages[page];
  const displayText = p.text.replace(/Foxy/g, childName);

  const readPage = () => {
    fetchAndCacheAudio(displayText).then((url) => {
      if (url) {
        const a = new Audio(url);
        a.playbackRate = 0.95;
        a.play().catch(() => speech.speak(displayText));
      } else {
        speech.speak(displayText);
      }
    });
  };

  useEffect(() => {
    setAnswered(false);
    setWrongIdx(null);
    readPage();
  }, [page]);

  const answer = (i: number) => {
    if (!p.question || answered) return;
    playTapSound();
    if (i === p.question.answerIndex) {
      setAnswered(true);
      playSuccessSound();
      speech.speak('Yes! Well done!');
    } else {
      setWrongIdx(i);
      playTryAgainSound();
      speech.speak('Hmm, try again!');
      setTimeout(() => setWrongIdx(null), 900);
    }
  };

  const next = () => {
    playTapSound();
    if (page < story.pages.length - 1) setPage(page + 1);
    else onDone();
  };

  return (
    <div className="screen story-screen">
      <div className="story-progress-bar">
        <span className="story-progress">{page + 1} / {story.pages.length}</span>
        <AudioPrompt onReplay={readPage} label="Listen to story page again" />
      </div>
      <div className="story-art-wrap">
        {p.svg.startsWith('foxy:') ? (
          <Foxy mood={p.svg.split(':')[1] as 'happy'} size={150} onClick={readPage} interactive />
        ) : (
          <div onClick={readPage} className="story-art-interactive" role="button" aria-label="Listen to page">
            <WordImage svg={resolveArt(p.svg)} size={170} />
          </div>
        )}
      </div>
      <p className="story-text">{displayText}</p>
      {p.question && (
        <div className="story-question">
          <p className="instruction">{p.question.prompt}</p>
          <div className="options-grid">
            {p.question.choices.map((c, i) => (
              <button
                key={c}
                className={`option-card small ${wrongIdx === i ? 'shake' : ''} ${answered && i === p.question!.answerIndex ? 'correct' : ''}`}
                onClick={() => answer(i)}
                aria-label={c}
              >
                <WordImage svg={wordById(c)?.svg ?? wordArt(c)} size={90} label={c} />
              </button>
            ))}
          </div>
        </div>
      )}
      <button className="big-btn" onClick={next}>{page < story.pages.length - 1 ? '➡️ Next' : '⭐ Finish'}</button>
    </div>
  );
}
