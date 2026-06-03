"use client";

type ListeningWaveProps = {
  isListening: boolean;
};

export default function ListeningWave({ isListening }: ListeningWaveProps) {
  const waveColorClass = isListening ? "bg-green-400" : "bg-white/75";

  return (
    <div
      className={`
        flex h-11 items-end gap-1.5 transition-opacity duration-300
        ${isListening ? "opacity-100" : "opacity-75"}
      `}
      aria-hidden='true'
    >
      <span
        className={`
          w-2.5 rounded-full transition-all duration-300
          ${waveColorClass}
          ${isListening ? "animate-listening-wave" : ""}
        `}
        style={{ height: 12, animationDelay: "0ms" }}
      />
      <span
        className={`
          w-2.5 rounded-full transition-all duration-300
          ${waveColorClass}
          ${isListening ? "animate-listening-wave" : ""}
        `}
        style={{ height: 24, animationDelay: "120ms" }}
      />
      <span
        className={`
          w-2.5 rounded-full transition-all duration-300
          ${waveColorClass}
          ${isListening ? "animate-listening-wave" : ""}
        `}
        style={{ height: 34, animationDelay: "240ms" }}
      />
      <span
        className={`
          w-2.5 rounded-full transition-all duration-300
          ${waveColorClass}
          ${isListening ? "animate-listening-wave" : ""}
        `}
        style={{ height: 44, animationDelay: "360ms" }}
      />
      <span
        className={`
          w-2.5 rounded-full transition-all duration-300
          ${waveColorClass}
          ${isListening ? "animate-listening-wave" : ""}
        `}
        style={{ height: 34, animationDelay: "480ms" }}
      />
      <span
        className={`
          w-2.5 rounded-full transition-all duration-300
          ${waveColorClass}
          ${isListening ? "animate-listening-wave" : ""}
        `}
        style={{ height: 24, animationDelay: "600ms" }}
      />
      <span
        className={`
          w-2.5 rounded-full transition-all duration-300
          ${waveColorClass}
          ${isListening ? "animate-listening-wave" : ""}
        `}
        style={{ height: 12, animationDelay: "720ms" }}
      />
    </div>
  );
}
