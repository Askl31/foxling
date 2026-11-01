export interface SpeechProvider {
  speak(text: string, opts?: { rate?: number }): void;
  stop(): void;
  isSupported(): boolean;
  recognize(opts?: { lang?: string }): Promise<string | null>;
  recognitionSupported(): boolean;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: unknown) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

const getRecognitionCtor = (): (new () => SpeechRecognitionLike) | null => {
  const w = window as unknown as Record<string, unknown>;
  const ctor = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => SpeechRecognitionLike) | undefined;
  return ctor ?? null;
};

export class BrowserSpeechProvider implements SpeechProvider {
  private rate: number;

  constructor(defaultRate = 0.9) {
    this.rate = defaultRate;
  }

  setRate(rate: number): void {
    this.rate = rate;
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  speak(text: string, opts?: { rate?: number }): void {
    if (!this.isSupported()) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = opts?.rate ?? this.rate;
    utter.pitch = 1.15;
    const voices = window.speechSynthesis.getVoices();
    const en = voices.find((v) => v.lang.startsWith('en') && /female|samantha|zira|susan/i.test(v.name))
      ?? voices.find((v) => v.lang.startsWith('en'));
    if (en) utter.voice = en;
    window.speechSynthesis.speak(utter);
  }

  stop(): void {
    if (this.isSupported()) window.speechSynthesis.cancel();
  }

  recognitionSupported(): boolean {
    return getRecognitionCtor() !== null;
  }

  recognize(opts?: { lang?: string }): Promise<string | null> {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return Promise.resolve(null);
    return new Promise((resolve) => {
      const rec = new Ctor();
      rec.lang = opts?.lang ?? 'en-US';
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      let done = false;
      const finish = (val: string | null) => {
        if (done) return;
        done = true;
        resolve(val);
      };
      rec.onresult = (e: unknown) => {
        const ev = e as { results: ArrayLike<ArrayLike<{ transcript: string }>> };
        const best = Array.from(ev.results[0] ?? []).map((a) => a.transcript).join(' ');
        finish(best || null);
      };
      rec.onerror = () => finish(null);
      rec.onend = () => finish(null);
      try {
        rec.start();
      } catch {
        finish(null);
      }
      setTimeout(() => finish(null), 6000);
    });
  }
}

/**
 * Tolérance ASR §8.3 : valide si le phonème initial (ou une sous-chaîne)
 * du mot attendu est détecté dans la transcription.
 */
export function asrAccepts(expected: string, transcript: string | null): boolean {
  if (!transcript) return false;
  const exp = expected.toLowerCase().replace(/[^a-z]/g, '');
  const got = transcript.toLowerCase();
  if (!exp) return true;
  if (got.includes(exp)) return true;
  const head = exp.slice(0, 2);
  return head.length > 0 && got.replace(/[^a-z]/g, '').includes(head);
}
