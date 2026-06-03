"use client";

import { Mic } from "lucide-react";
import ListeningWave from "./listening-wave";

type CaughtLetterListeningCardProps = {
  letter: string;
  isListening: boolean;
};

export default function CaughtLetterListeningCard({ letter, isListening }: CaughtLetterListeningCardProps) {
  const normalisedLetter = letter.toUpperCase();

  return (
    <div
      className='
        w-[min(88vw,25rem)]
        overflow-hidden
        rounded-4xl
        border-[3px] border-(--card-border)
        bg-(--card-body-bg)
        shadow-[0_16px_30px_rgba(0,0,0,0.18)]
      '
      aria-label={`Caught letter ${normalisedLetter}`}
    >
      <div className='flex flex-col'>
        {/* Letter area */}
        <div className='flex min-h-96 items-center justify-center bg-neutral-100 px-6 py-8'>
          <span className='text-[10rem] font-black leading-none text-black select-none'>{normalisedLetter}</span>
        </div>

        {/* Bottom listening bar */}
        <div className='flex items-center justify-between bg-(--button-bg) px-6 py-5'>
          <Mic
            size={52}
            strokeWidth={2.5}
            className={`
              shrink-0 transition-colors duration-300
              ${isListening ? "text-green-400" : "text-(--color-on-primary)"}
            `}
            aria-hidden='true'
          />

          <div className='flex flex-1 justify-center px-4'>
            <ListeningWave isListening={isListening} />
          </div>

          {/* Spacer so the wave stays visually centered */}
          <div className='w-13 shrink-0' aria-hidden='true' />
        </div>
      </div>
    </div>
  );
}
