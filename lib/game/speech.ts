import { wait } from "@/lib/game/utils";

function getKidFriendlyVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const preferredNames = [
    "Samantha", "Ava", "Allison", "Susan", "Zoe", "Jenny", "Aria",
    "Google US English", "Microsoft Zira", "Victoria", "Karen", "Tessa", "Moira"
  ];
  return (
    preferredNames
      .map((name) => voices.find((v) => v.name.toLowerCase().includes(name.toLowerCase())))
      .find(Boolean) ||
    voices.find((v) => v.lang.startsWith("en") && v.localService) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    null
  );
}

export function unlockSpeech(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.resume?.();
  window.speechSynthesis.getVoices();
}

function softenSpeechText(text: string): string {
  return text
    .replace(/!/g, ".")
    .replace(/\bfollow me\b/gi, "follow me")
    .replace(/,\s*([a-z]),\s*([a-z]),\s*([a-z])/gi, ", $1, $2, $3")
    .replace(/\s+/g, " ")
    .trim();
}

type SpeakOptions = { rate?: number; pitch?: number; volume?: number; cancel?: boolean };

export function speakText(text: string, options: SpeakOptions = {}): Promise<void> {
  if (!text) return Promise.resolve();
  const cleanText = softenSpeechText(text.replace(/[★☆🟡🎤🪄🍎🍌🥕🍇🍐🌽]/g, ""));
  if (!cleanText) return Promise.resolve();
  const estimatedDuration = Math.max(1700, cleanText.length * 82);
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return wait(estimatedDuration);

  unlockSpeech();
  if (options.cancel !== false) window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "en-US";
  utterance.rate = options.rate ?? 0.86;
  utterance.pitch = options.pitch ?? 1.08;
  utterance.volume = options.volume ?? 0.92;
  utterance.voice = getKidFriendlyVoice();

  return new Promise((resolve) => {
    const fallback = window.setTimeout(resolve, estimatedDuration);
    utterance.onend = () => {
      window.clearTimeout(fallback);
      resolve();
    };
    utterance.onerror = () => {
      window.clearTimeout(fallback);
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
}
