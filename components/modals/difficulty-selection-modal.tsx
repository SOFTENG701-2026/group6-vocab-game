"use client";

import Image from "next/image";
import BaseSelectionModal, {
  SelectionModalItem
} from "@/components/modals/base-selection-modal";

type DifficultyModalProps = {
  isOpen: boolean;
  onSelectDifficulty: (difficultyId: string) => void;
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
    id: "hard",
    title: "Hard",
    logo: (
      <Image
        src='/difficulty/abc-hard.png'
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
      buttonText="Let's Begin"
      onConfirm={onSelectDifficulty}
    />
  );
}
