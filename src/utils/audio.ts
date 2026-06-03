// Web Audio Synthesizer for AuraSynth AI

const pitchToFreq: Record<string, number> = {
  'C5': 523.25,
  'B4': 493.88,
  'A#4': 466.16,
  'A4': 440.00,
  'G#4': 415.30,
  'G4': 392.00,
  'F#4': 369.99,
  'F4': 349.23,
  'E4': 329.63,
  'D#4': 311.13,
  'D4': 293.66,
  'C#4': 277.18,
  'C4': 261.63,
  'B3': 246.94,
  'A#3': 233.08,
  'A3': 220.00,
  'G#3': 207.65,
  'G3': 196.00,
  'F#3': 185.00,
  'F3': 174.61,
  'E3': 164.81,
  'D#3': 155.56,
  'D3': 146.83,
  'C#3': 138.59,
  'C3': 130.81
};

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPitch(pitchName: string, durationSec = 0.3, type: OscillatorType = 'sine') {
  try {
    const ctx = getAudioContext();
    const freq = pitchToFreq[pitchName];
    if (!freq) return;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Choose nice sounds
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Smooth volume progression to prevent audio clicking
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + durationSec);
  } catch (err) {
    console.warn('Web Audio synthesis is unavailable or blocked by browser permissions:', err);
  }
}
