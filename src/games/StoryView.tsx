import { useEffect, useState } from 'react';
import { Foxy, WordImage } from '../ui/Foxy';
import { wordArt } from '../content/art';
import { wordById } from '../content/curriculum';
import type { SpeechProvider } from '../speech/speech';
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

  useEffect(() => {
    setAnswered(false);
    setWrongIdx(null);
    speech.speak(p.text.replace(/Foxy/g, childName));
  }, [page]);

  const displayText = p.text.replace(/Foxy/g, childName);

  const answer = (i: number) => {
    if (!p.question || answered) return;
    if (i === p.question.answerIndex) {
      setAnswered(true);
      speech.speak('Yes! Well done!');
    } else {
      setWrongIdx(i);
      speech.speak('Hmm, try again!');
      setTimeout(() => setWrongIdx(null), 900);
    }
  };

  const next = () => {
    if (page < story.pages.length - 1) setPage(page + 1);
    else onDone();
  };

  return (
    <div className="screen story-screen">
      <div className="story-progress">{page + 1} / {story.pages.length}</div>
      {p.svg.startsWith('foxy:') ? (
        <Foxy mood={p.svg.split(':')[1] as 'happy'} size={150} />
      ) : (
        <WordImage svg={resolveArt(p.svg)} size={170} />
      )}
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
