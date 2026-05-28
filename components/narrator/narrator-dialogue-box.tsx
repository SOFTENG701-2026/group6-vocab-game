"use client";

import Image from "next/image";
import { useNarrative } from "@/context/narrative-context";

export default function NarratorDialogueBox() {
  const { currentScript } = useNarrative();

  if (!currentScript) return null;

  return (
    <div className='fixed left-6 top-6 z-50 max-w-[min(94vw,760px)]'>
      <div className='flex items-start gap-4'>
        <div className='shrink-0'>
          <Image
            src='assets/avatar/monster.svg'
            alt='Narrator monster'
            width={150}
            height={150}
            className='h-32 w-32 object-contain drop-shadow-lg'
            priority
          />
        </div>

        <div className='relative mt-4 min-w-90 max-w-xl rounded-3xl border-4 border-purple-200 bg-white px-6 py-5 text-black shadow-2xl'>
          <div className='absolute -left-3.5 top-10 h-0 w-0 border-y-14 border-y-transparent border-r-16 border-r-white' />

          <p className='text-lg font-extrabold leading-snug text-gray-800'>{currentScript.displayText}</p>
        </div>
      </div>
    </div>
  );
}
