export function speak(text: string) {
  if (typeof globalThis.window === "undefined" || !globalThis.speechSynthesis) return;
  globalThis.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1.2;
  globalThis.speechSynthesis.speak(utterance);
}
