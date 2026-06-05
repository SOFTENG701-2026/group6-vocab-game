/**
 * Play a soft bubbling / boiling sound using the Web Audio API.
 * Generates a series of low-pitched filtered noise pops.
 */
export function playBubblingSfx() {
  if (globalThis.window === undefined || !globalThis.AudioContext) return;

  const ctx = new AudioContext();

  // Each "blop" = a short burst of filtered noise
  const blopCount = 10;
  for (let i = 0; i < blopCount; i++) {
    const bufferSize = ctx.sampleRate * 0.06;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let s = 0; s < bufferSize; s++) {
      data[s] = (Math.random() * 2 - 1);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    // Each blop has a slightly different pitch (200–500 Hz) for variety
    filter.frequency.value = 200 + Math.random() * 300;
    filter.Q.value = 8;

    const gain = ctx.createGain();
    const startTime = ctx.currentTime + i * 0.13 + Math.random() * 0.05;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(5, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(startTime);
    source.stop(startTime + 0.13);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
      if (i === blopCount - 1) ctx.close();
    };
  }
}

/** Play a sparkling chime using the Web Audio API — no audio files required. */
export function playSparkleChime() {
  if (globalThis.window === undefined || !globalThis.AudioContext) return;

  const ctx = new AudioContext();
  // Ascending pentatonic notes (Hz) for a "correct answer" feel
  const notes = [880, 1108, 1318, 1568, 1760, 2093];
  const stepMs = 90;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.value = freq;

    const start = ctx.currentTime + i * (stepMs / 1000);
    const end = start + 0.22;

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(3, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.start(start);
    osc.stop(end);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
      if (i === notes.length - 1) ctx.close();
    };
  });
}
