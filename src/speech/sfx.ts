/**
 * SFX (Sound Effects) générés via Web Audio API native.
 * 0 dépendance, 0 ko de téléchargement, 100 % offline et réponse instantanée (0 ms de latence).
 *
 * Conçu spécifiquement pour les enfants de 4-6 ans :
 * - Sons chauds, arrondis et doux (ondes sinusoïdales et triangulaires avec enveloppes douces).
 * - Aucun son punitif (pas de buzzer dur ou strident).
 * - Feedback haptique/auditif immédiat dès que le doigt touche l'écran.
 */

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtor) {
      audioCtx = new AudioCtor();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const playTapSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(750, now + 0.05);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.06);
};

export const playSuccessSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Arpège ascendant chaleureux : Do5 (523Hz), Mi5 (659Hz), Sol5 (784Hz), Do6 (1046Hz)
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + idx * 0.08;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.3);
  });
};

export const playTryAgainSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Deux notes douces et réconfortantes (rebond bienveillant) : Mi4 (329Hz) -> La4 (440Hz)
  const notes = [329.63, 440.0];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + idx * 0.12;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.12, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.2);
  });
};

export const playStarSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Étoile brillante : tintement cristallin
  const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + idx * 0.05;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.15, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.36);
  });
};

export const playMunchSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Bruit de croque mignon "nom-nom" pour Feed Foxy
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.1);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
};
