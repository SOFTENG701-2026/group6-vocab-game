let speechRunId = 0;

export function speak(text: string, onEnd?: () => void) {
  speechRunId += 1;
  const runId = speechRunId;

  function finish() {
    if (runId !== speechRunId) return;
    onEnd?.();
  }

  if (globalThis.window === undefined || !globalThis.speechSynthesis) {
    setTimeout(finish, 0);
    return;
  }

  globalThis.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1.2;

  let didFinish = false;
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
  const finishOnce = () => {
    if (didFinish) return;
    didFinish = true;
    if (fallbackTimer) clearTimeout(fallbackTimer);
    finish();
  };
  const fallbackMs = Math.min(Math.max(text.length * 90, 1200), 10000);
  fallbackTimer = setTimeout(finishOnce, fallbackMs);

  utterance.onend = finishOnce;
  utterance.onerror = finishOnce;
  globalThis.speechSynthesis.speak(utterance);
}
