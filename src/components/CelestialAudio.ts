/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setAudioMuted(muted: boolean) {
  isMuted = muted;
}

export function getAudioMuted(): boolean {
  return isMuted;
}

// Gentle, resonant church bell / chime
export function playSacredBell(fundamentalFreq: number = 440) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.setValueAtTime(0.25, now);

  // Church bell partial harmonics (hum, prime, tierce, quint, octave)
  const bellPartials = [
    { ratio: 0.5, gain: 0.35, decay: 3.5 },
    { ratio: 1.0, gain: 0.45, decay: 2.8 },
    { ratio: 1.18, gain: 0.3, decay: 2.4 },
    { ratio: 1.5, gain: 0.25, decay: 2.0 },
    { ratio: 2.0, gain: 0.2, decay: 1.5 },
    { ratio: 2.74, gain: 0.1, decay: 1.0 },
  ];

  bellPartials.forEach((partial) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(fundamentalFreq * partial.ratio, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(partial.gain, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + partial.decay);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + partial.decay);
  });
}

// Delicate celestial arpeggio (harp-like glissando)
export function playAngelicChime() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [349.23, 440.0, 523.25, 698.46, 880.0, 1046.5]; // F4, A4, C5, F5, A5, C6
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.12;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, noteTime);

    gain.gain.setValueAtTime(0.0001, noteTime);
    gain.gain.exponentialRampToValueAtTime(0.18, noteTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 1.9);
  });
}
