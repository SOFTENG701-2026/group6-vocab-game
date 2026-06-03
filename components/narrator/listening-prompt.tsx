"use client";

import { Mic } from "lucide-react";
import ListeningWave from "./listening-wave";

type ListeningPromptProps = {
  isListening: boolean;
};

export default function ListeningPrompt({ isListening }: ListeningPromptProps) {
  return (
    <div
      aria-hidden={!isListening}
      className='w-[min(84vw,22rem)] rounded-[2rem] border-4 border-(--card-border) bg-(--card-body-bg) p-4 shadow-[0_18px_35px_rgba(0,0,0,0.22)]'
    >
      <div className='rounded-[1.5rem] bg-(--card-header-bg) px-5 py-5'>
        <div className='flex min-h-32 items-center justify-center rounded-[1.25rem] bg-(--card-body-bg) px-5 py-5'>
          <Mic
            size={72}
            strokeWidth={2.6}
            className={`
              transition-all duration-300
              ${isListening ? "text-(--color-primary) scale-105" : "text-(--color-primary)"}
            `}
          />
        </div>

        <div className='mt-4 flex items-center justify-center gap-4 rounded-[1.25rem] bg-(--button-bg) px-4 py-4'>
          <Mic size={28} strokeWidth={2.8} className='text-(--color-on-primary)' aria-hidden='true' />

          <ListeningWave isListening={isListening} />
        </div>
      </div>
    </div>
  );
}
