// Audio utility for interaction sounds

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  
  if (!audioContext) {
    try {
      audioContext = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioContext;
}

export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  } catch {
    // Audio not supported
  }
}

export function playTransitionSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Sweeping frequency for transition effect
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  } catch {
    // Audio not supported
  }
}

export function playSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Two-tone success chime
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch {
    // Audio not supported
  }
}

export function playErrorSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.type = "sawtooth";

    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch {
    // Audio not supported
  }
}
