"use client";

import Image from "next/image";
import { useEffect } from "react";
import BaseSelectionModal, {
  SelectionModalItem
} from "@/components/modals/base-selection-modal";
import { Difficulty } from "@/domain/game-setup/game-setup-types";
import { speak } from "@/lib/speak";

type DifficultyModalProps = {
  isOpen: boolean;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onClose?: () => void;
};

const difficultyItems: SelectionModalItem[] = [
  {
    id: "easy",
    title: "⭐",
    logo: (
      <Image
        src='/difficulty/matching-easy.png'
        alt='Mix and match colors and shapes of a given ingredient'
        width={500}
        height={500}
        className='w-full h-full object-contain'
        draggable={false}
      />
    )
  },
  {
    id: "medium",
    title: "⭐⭐",
    logo: (
      <Image
        src='/difficulty/abc-hard.png'
        alt='Mix and match colors and shapes of a given ingredient'
        width={500}
        height={500}
        className='w-full h-full object-contain'
        draggable={false}
      />
    )
  },
  {
    id: "hard",
    title: "⭐⭐⭐",
    logo: (
      <Image
        src='/difficulty/spelling.svg'
        alt='Arrange lettered blocks to spell an ingredient'
        width={200}
        height={200}
        className='w-full h-full object-contain'
        draggable={false}
      />
    )
  }
];

export default function DifficultyModal({
  isOpen,
  onSelectDifficulty,
  onClose
}: Readonly<DifficultyModalProps>) {
  useEffect(() => {
    if (!isOpen) return;

    speak("Choose a level to play.");
  }, [isOpen]);

  return (
    <BaseSelectionModal
      isOpen={isOpen}
      title='Choose Level'
      titleId='difficulty-modal-title'
      items={difficultyItems}
      onClose={onClose}
      onConfirm={(itemId) => onSelectDifficulty(itemId as Difficulty)}
    />
  );
}
