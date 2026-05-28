"use client";

import Image from "next/image";
import { Mic } from "lucide-react";
import ListeningPrompt from "./listening-prompt";
import { useNarrative } from "@/context/narrative-context";

export default function NarratorDialogueBox() {
  const { currentScript, currentStep } = useNarrative();

  const isListeningStep = currentStep?.type === "listening";

  if (!currentScript) return null;

  return (
    <div className='fixed inset-0 z-9999'>
      {/* Dark background layer and blocks clicks/navigation behind the narrator. */}
      <div className='absolute inset-0 bg-black/80' />

      {/* Narrator content */}
      <div className='absolute left-6 top-6 max-w-[min(94vw,900px)]'>
        <div className='flex items-start gap-5'>
          <div className='shrink-0'>
            <Image
              src='/assets/avatar/monster.svg'
              alt='Narrator monster'
              width={220}
              height={220}
              className='h-44 w-44 object-contain drop-shadow-2xl'
              priority
            />
          </div>

          <div className='relative mt-8 min-w-110 max-w-2xl rounded-3xl border-4 border-(--color-primary) bg-white px-7 py-6 text-black shadow-2xl'>
            <div className='absolute -left-4 top-12 h-0 w-0 border-y-16 border-y-transparent border-r-18 border-r-white' />

            <p className='text-xl font-extrabold leading-snug text-gray-800'>{currentScript.displayText}</p>

            <ListeningPrompt isListening={isListeningStep} />
          </div>
        </div>
      </div>
    </div>
  );
}
