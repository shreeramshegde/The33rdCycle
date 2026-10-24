/**
 * CHRONOS PROCEDURAL AUDIO ENGINE
 * Uses Web Audio API for zero-latency, zero-download retro mechanical feedback
 * and continuous atmospheric noir background drone.
 * 100% offline-ready, 0 KB external bandwidth.
 */

let audioCtx = null;
let isMuted = localStorage.getItem('chronos_sound_muted') === 'true';

// Ambient Drone Nodes
let droneOsc1 = null;
let droneOsc2 = null;
let droneGain = null;
let noiseNode = null;
let noiseGain = null;
let isDroneRunning = false;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

export const isSoundMuted = () => isMuted;

// Start continuous atmospheric noir investigation drone
export const startAmbientDrone = () => {
  if (isMuted || isDroneRunning) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Dual detuned low frequency oscillators (55Hz and 55.6Hz for slow binaural pulse)
    droneOsc1 = ctx.createOscillator();
    droneOsc2 = ctx.createOscillator();
    droneGain = ctx.createGain();

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, ctx.currentTime);

    droneOsc1.type = 'triangle';
    droneOsc1.frequency.setValueAtTime(55, ctx.currentTime); // Sub-bass A1

    droneOsc2.type = 'sine';
    droneOsc2.frequency.setValueAtTime(55.6, ctx.currentTime); // Slight detune for pulsing drone

    // Gentle fade-in for ambient sound
    droneGain.gain.setValueAtTime(0.001, ctx.currentTime);
    droneGain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 3);

    droneOsc1.connect(filter);
    droneOsc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(ctx.destination);

    droneOsc1.start();
    droneOsc2.start();

    // Subtle analog tape hiss noise floor
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(900, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.5, ctx.currentTime);

    noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.006, ctx.currentTime + 3);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseNode.start();

    isDroneRunning = true;
  } catch (err) {
    console.debug('Audio drone init waiting for user gesture:', err);
  }
};

// Stop ambient drone
export const stopAmbientDrone = () => {
  if (!isDroneRunning) return;
  try {
    const ctx = getAudioContext();
    const now = ctx ? ctx.currentTime : 0;

    if (droneGain && ctx) {
      droneGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
    }
    if (noiseGain && ctx) {
      noiseGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
    }

    setTimeout(() => {
      try {
        if (droneOsc1) { droneOsc1.stop(); droneOsc1.disconnect(); }
        if (droneOsc2) { droneOsc2.stop(); droneOsc2.disconnect(); }
        if (noiseNode) { noiseNode.stop(); noiseNode.disconnect(); }
      } catch {}
      isDroneRunning = false;
      droneOsc1 = null;
      droneOsc2 = null;
      noiseNode = null;
    }, 600);
  } catch {
    isDroneRunning = false;
  }
};

// Toggle all sound (SFX + Ambient Drone)
export const toggleSound = () => {
  isMuted = !isMuted;
  localStorage.setItem('chronos_sound_muted', isMuted ? 'true' : 'false');
  if (isMuted) {
    stopAmbientDrone();
  } else {
    startAmbientDrone();
  }
  return isMuted;
};

// Subtle mechanical terminal key click
export const playKeyClick = () => {
  if (isMuted) return;
  // If drone hasn't started yet due to browser gesture policy, start it on first keypress!
  if (!isDroneRunning) startAmbientDrone();

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
};

// Submitting button press (analog relay engagement)
export const playRelayClick = () => {
  if (isMuted) return;
  if (!isDroneRunning) startAmbientDrone();

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {}
};

// Verification Success: Harmonious dual-frequency chime
export const playSuccessChime = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [587.33, 880, 1174.66].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.08, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.45);
    });
  } catch {}
};

// Rejection Buzz: Low dissonance penalty alert
export const playErrorBuzz = () => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.linearRampToValueAtTime(95, now + 0.22);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch {}
};
