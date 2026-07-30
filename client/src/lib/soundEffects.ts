// Web Audio API Synthesizer for Authentic Windows 98 Sound Effects

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// User interaction listener to resume AudioContext if suspended by browser autoplay policy
if (typeof window !== 'undefined') {
  const initAudioOnUserInteraction = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'running') {
      window.removeEventListener('pointerdown', initAudioOnUserInteraction);
      window.removeEventListener('keydown', initAudioOnUserInteraction);
    }
  };
  window.addEventListener('pointerdown', initAudioOnUserInteraction);
  window.addEventListener('keydown', initAudioOnUserInteraction);
}

/**
 * Windows 98 Startup Sound
 * Authentic synthesized chord swell and ambient crystal chimes
 */
export function playStartupSound(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.01, now);
  masterGain.gain.exponentialRampToValueAtTime(0.4, now + 0.6);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
  masterGain.connect(ctx.destination);

  // Warm chord frequencies: Eb3, Bb3, Eb4, G4, Bb4, Eb5
  const freqs = [155.56, 233.08, 311.13, 392.00, 466.16, 622.25];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Alternate waveform for rich analog texture
    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Staggered entry for atmospheric swell effect
    const startTime = now + (i * 0.08);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.15, startTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + 2.6);
  });

  // High crystal chime accent: C6, Eb6, G6
  const chimeFreqs = [1046.50, 1244.51, 1567.98];
  chimeFreqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + 0.8 + idx * 0.12);

    const chimeStart = now + 0.8 + idx * 0.12;
    gain.gain.setValueAtTime(0.12, chimeStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, chimeStart + 1.2);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(chimeStart);
    osc.stop(chimeStart + 1.3);
  });
}

/**
 * Windows File / App / Folder Open Sound
 * Classic high-pitched dual pop / chime ("ding" open sound)
 */
export function playOpenSound(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.25, now);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  masterGain.connect(ctx.destination);

  // Two quick cheerful ascending tones (C6 -> G6)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(1046.50, now); // C6
  osc1.frequency.setValueAtTime(1318.51, now + 0.04); // E6
  osc1.frequency.setValueAtTime(1567.98, now + 0.08); // G6

  osc1.connect(masterGain);
  osc1.start(now);
  osc1.stop(now + 0.22);

  // Transient click layer
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = 'triangle';
  clickOsc.frequency.setValueAtTime(2400, now);
  clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
  clickGain.gain.setValueAtTime(0.15, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickOsc.start(now);
  clickOsc.stop(now + 0.04);
}

/**
 * Windows Window Close Sound
 * Soft retro descending double chime
 */
export function playCloseSound(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.2, now);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  masterGain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now); // A5
  osc.frequency.setValueAtTime(587.33, now + 0.05); // D5

  osc.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.18);
}

/**
 * Windows Window Minimize Sound
 * Smooth descending frequency sweep
 */
export function playMinimizeSound(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.18, now);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  masterGain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(750, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.13);

  osc.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.14);
}

/**
 * Windows Window Maximize / Restore Sound
 * Smooth ascending frequency sweep
 */
export function playMaximizeSound(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.18, now);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  masterGain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(850, now + 0.13);

  osc.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.14);
}

/**
 * Windows System Error / Alert Sound
 * Authentic Windows 98 Critical Stop ("Chord.wav" / "Hand.wav")
 */
export function playErrorSound(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.3, now);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
  masterGain.connect(ctx.destination);

  // Critical stop chord tones: C3, G3, Eb4 (Low jarring chord)
  const freqs = [130.81, 196.00, 311.13, 415.30];
  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    // Lowpass filter to emulate 90s vintage PC speaker / soundcard DAC
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    osc.connect(filter);
    filter.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.38);
  });
}

/**
 * Recycle Bin Empty / Trash Sound
 * Paper crumple white-noise burst effect
 */
export function playRecycleBinSound(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.25; // 250ms noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2500, now);
  filter.frequency.exponentialRampToValueAtTime(300, now + 0.24);
  filter.Q.setValueAtTime(1.5, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.25);
}

/**
 * Menu / Button Click Sound
 * Micro retro click pulse
 */
export function playMenuClickSound(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.015);

  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.02);
}

/**
 * Windows 98 Shutdown Sound
 * Descending retro shutdown motif
 */
export function playShutdownSound(soundEnabled = true) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.25, now);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
  masterGain.connect(ctx.destination);

  // Descending notes: F5 -> D5 -> C5 -> F4
  const notes = [
    { freq: 698.46, time: 0 },
    { freq: 587.33, time: 0.25 },
    { freq: 523.25, time: 0.5 },
    { freq: 349.23, time: 0.8 },
  ];

  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + n.time;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(n.freq, startTime);

    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + 1.3);
  });
}
