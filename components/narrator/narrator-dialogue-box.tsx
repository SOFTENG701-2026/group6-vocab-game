"use client";

import Image from "next/image";
import CaughtLetterListeningCard from "./caught-letter-listening-card";
import ListeningPrompt from "./listening-prompt";
import { useNarrative } from "@/context/narrative-context";

export default function NarratorDialogueBox() {
  const { currentScript, currentStep, presentation, shouldBlockInteraction } = useNarrative();

  const isListeningStep = currentStep?.type === "listening";

  if (!currentScript || presentation.type === "hidden") {
    return null;
  }

  function renderCenteredPresentation() {
    if (presentation.type === "caught-letter-dialogue") {
      return <CaughtLetterListeningCard letter={presentation.letter} isListening={isListeningStep} />;
    }

    if (isListeningStep) {
      return <ListeningPrompt isListening={isListeningStep} />;
    }

    return null;
  }

  return (
    <div className='fixed inset-0 z-9999 pointer-events-none'>
      {shouldBlockInteraction && <div className='absolute inset-0 bg-black/70 pointer-events-auto' />}

      {/* Avatar + dialogue box stay connected on the top-left */}
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

          <div className='relative mt-8 min-w-110 max-w-2xl rounded-3xl border-4 border-(--card-border) bg-(--card-body-bg) px-7 py-6 text-black shadow-2xl'>
            <div className='absolute -left-4 top-12 h-0 w-0 border-y-16 border-y-transparent border-r-18 border-r-(--card-body-bg)' />

            <p className='text-xl font-extrabold leading-snug text-gray-800'>{currentScript.displayText}</p>
          </div>
        </div>
      </div>

      {/* Letter card / listening prompt is separate and centred */}
      <div className='absolute inset-0 flex items-center justify-center px-4'>{renderCenteredPresentation()}</div>
    </div>
  );
}
