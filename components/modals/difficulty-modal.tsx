"use client";

import { useState } from "react";
import Image from "next/image";
import Card from "@/components/card";

type DifficultyModalProps = {
  isOpen: boolean;
  onSelectDifficulty: (difficultyId: string) => void;
};

export default function DifficultyModal({
  isOpen,
  onSelectDifficulty
}: DifficultyModalProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const activeCardId = hoveredCardId ?? selectedCardId;

  function handleDifficultySelect(difficultyId: string) {
    setSelectedCardId(difficultyId);
    onSelectDifficulty(difficultyId);
  }

  if (!isOpen) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='difficulty-modal-title'
      className='
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
      '
    >
      <div
        className='
          bg-(--card-body-bg)
          rounded-4xl
          px-10 py-10
          shadow-[0_24px_60px_rgba(0,0,0,0.3)]
        '
      >
        <h2
          id='difficulty-modal-title'
          className='
            text-center text-3xl font-extrabold
            text-(--color-primary-hover)
            mb-8
          '
        >
          Choose Difficulty
        </h2>

        <section className='flex items-center justify-center gap-8'>
          <Card
            id='easy'
            title='Easy'
            logo={
              <Image
                src='/matching-easy.png'
                alt='Mix and Match Colors and Shape of given ingredient'
                width={500}
                height={500}
                className='w-full h-full object-contain'
                draggable={false}
              />
            }
            isSelected={selectedCardId === "easy"}
            isHovered={hoveredCardId === "easy"}
            shouldBlur={activeCardId !== null && activeCardId !== "easy"}
            onSelect={handleDifficultySelect}
            onHoverStart={setHoveredCardId}
            onHoverEnd={() => setHoveredCardId(null)}
          />

          <Card
            id='hard'
            title='Hard'
            logo={
              <Image
                src='/abc-hard.png'
                alt='Arrange lettered blocks to spell an ingredient'
                width={200}
                height={200}
                className='w-full h-full object-contain'
                draggable={false}
              />
            }
            isSelected={selectedCardId === "hard"}
            isHovered={hoveredCardId === "hard"}
            shouldBlur={activeCardId !== null && activeCardId !== "hard"}
            onSelect={handleDifficultySelect}
            onHoverStart={setHoveredCardId}
            onHoverEnd={() => setHoveredCardId(null)}
          />
        </section>
      </div>
    </div>
  );
}
