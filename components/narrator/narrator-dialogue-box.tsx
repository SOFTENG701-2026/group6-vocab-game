"use client";

import Image from "next/image";
import { useNarrative } from "@/context/narrative-context";

function getStepText(step: ReturnType<typeof useNarrative>["currentStep"]) {
  if (!step) return "";

  if ("text" in step) {
    return step.text;
  }

  return "";
}

export default function NarratorDialogueBox() {
  const { currentScript } = useNarrative();

  const text = currentScript?.displayText ?? "";

  if (!currentScript || !text) return null;

  return (
    <div className='fixed bottom-4 left-4 z-50 max-w-[min(92vw,680px)]'>
      <div className='flex items-end gap-3'>
        <div className='shrink-0'>
          <Image
            src='/assets/avatar/monster.svg'
            alt='Narrator monster'
            width={128}
            height={128}
            className='h-28 w-28 object-contain drop-shadow-lg'
            priority
          />
        </div>

        <div className='relative mb-10 max-w-sm rounded-3xl bg-white px-5 py-4 text-black shadow-xl'>
          <div className='absolute -left-2.5 bottom-6 h-0 w-0 border-y-10 border-y-transparent border-r-12 border-r-white' />

          <p className='text-sm font-extrabold leading-snug text-gray-800'>{text}</p>
        </div>
      </div>
    </div>
  );
}
