"use client";

import { Mic } from "lucide-react";

type ListeningPromptProps = {
  isListening: boolean;
};

export default function ListeningPrompt({ isListening }: ListeningPromptProps) {
  const iconColorClass = isListening ? "text-green-400" : "text-white";
  const waveColorClass = isListening ? "bg-green-400" : "bg-white/90";
  const buttonColorClass = isListening ? "bg-white" : "bg-(--color-primary)";

  return (
    <div
      aria-hidden={!isListening}
      className='pointer-events-none fixed inset-0 z-10000 flex items-center justify-center'
    >
      <div
        className={`
          flex h-56 w-56 flex-col items-center justify-center gap-5
          rounded-full ${buttonColorClass} shadow-2xl
          transition-all duration-500 ease-out
          ${isListening ? "scale-100 opacity-100 animate-mic-pulse" : "scale-90 opacity-35"}
        `}
      >
        <Mic
          size={72}
          strokeWidth={2.8}
          className={`
            transition-all duration-500 ease-out
            ${iconColorClass}
            ${isListening ? "scale-110" : "scale-100"}
          `}
        />

        <div
          className={`
            flex h-10 items-end gap-2 transition-opacity duration-500
            ${isListening ? "opacity-100" : "opacity-70"}
          `}
        >
          <span
            className={`
              w-2 rounded-full transition-colors duration-500
              ${waveColorClass}
              ${isListening ? "animate-listening-wave" : ""}
            `}
            style={{ height: 12, animationDelay: "0ms" }}
          />
          <span
            className={`
              w-2 rounded-full transition-colors duration-500
              ${waveColorClass}
              ${isListening ? "animate-listening-wave" : ""}
            `}
            style={{ height: 24, animationDelay: "120ms" }}
          />
          <span
            className={`
              w-2 rounded-full transition-colors duration-500
              ${waveColorClass}
              ${isListening ? "animate-listening-wave" : ""}
            `}
            style={{ height: 16, animationDelay: "240ms" }}
          />
          <span
            className={`
              w-2 rounded-full transition-colors duration-500
              ${waveColorClass}
              ${isListening ? "animate-listening-wave" : ""}
            `}
            style={{ height: 30, animationDelay: "360ms" }}
          />
        </div>
      </div>
    </div>
  );
}
