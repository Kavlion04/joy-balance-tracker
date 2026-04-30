// Soft, pleasant welcome chime using Web Audio API.
// Two gentle bell-like tones (E5 + B5) with a slow fade — no looping, no nagging.

const STORAGE_KEY = "welcome_chime_enabled";
const SESSION_KEY = "welcome_chime_played";

export const isChimeEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === null ? true : v === "1";
};

export const setChimeEnabled = (enabled: boolean) => {
  localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
};

const playTone = (
  ctx: AudioContext,
  freq: number,
  startAt: number,
  duration: number,
  peakGain: number,
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(peakGain, startAt + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
};

export const playWelcomeChime = async () => {
  try {
    const AC: typeof AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch { /* ignore */ }
    }
    const now = ctx.currentTime + 0.05;
    // E5 then B5 — a calm rising fifth
    playTone(ctx, 659.25, now, 1.4, 0.08);
    playTone(ctx, 987.77, now + 0.18, 1.6, 0.06);
    setTimeout(() => ctx.close().catch(() => {}), 2200);
  } catch {
    // silent fail — never let audio break the app
  }
};

export const playWelcomeChimeOncePerSession = () => {
  if (!isChimeEnabled()) return;
  if (sessionStorage.getItem(SESSION_KEY) === "1") return;
  sessionStorage.setItem(SESSION_KEY, "1");
  playWelcomeChime();
};
