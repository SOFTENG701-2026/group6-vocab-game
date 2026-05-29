"use client";

import Image from "next/image";
import BaseSelectionModal, {
  SelectionModalItem
} from "@/components/modals/base-selection-modal";
import { Difficulty } from "@/domain/game-setup/game-setup-types";

type DifficultyModalProps = {
  isOpen: boolean;
  onSelectDifficulty: (difficulty: Difficulty) => void;
};

const difficultyItems: SelectionModalItem[] = [
  {
    id: "easy",
    title: "Easy",
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
    title: "Medium",
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
    title: "Hard",
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
  onSelectDifficulty
}: DifficultyModalProps) {
  return (
    <BaseSelectionModal
      isOpen={isOpen}
      title='Choose Difficulty'
      titleId='difficulty-modal-title'
      items={difficultyItems}
      //TODO: area for refactor make onConfirm more generic or closer to design context instead of string type.
      onConfirm={(itemId) => onSelectDifficulty(itemId as Difficulty)}
    />
  );
}
