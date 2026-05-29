"use client";

import { useState, ReactNode } from "react";
import type { CardVariant } from "@/components/card";
import Card from "@/components/card";

export type SelectionModalItem = {
  id: string;
  title: string;
  description?: string;
  logo: ReactNode;
};

type BaseSelectionModalProps = {
  isOpen: boolean;
  title: string;
  titleId: string;
  cardVariant?: CardVariant;
  buttonText?: ReactNode;
  items: SelectionModalItem[];
  onConfirm: (itemId: string) => void;
};

export default function BaseSelectionModal({
  isOpen,
  title,
  titleId,
  items,
  cardVariant = "default",
  buttonText,
  onConfirm
}: BaseSelectionModalProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  function handleConfirm(itemId: string) {
    setSelectedCardId(itemId);
    onConfirm(itemId);
  }

  if (!isOpen) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby={titleId}
      className='fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 px-4'
    >
      <div
        className='
          w-full
          max-w-6xl min-h-140
          rounded-4xl bg-(--card-body-bg)
          px-6 py-8 sm:px-10 sm:py-10
          shadow-[0_24px_60px_rgba(0,0,0,0.3)]
          flex flex-col
        '
      >
        <h2
          id={titleId}
          className='text-center text-3xl font-extrabold text-(--color-primary-hover) mb-8'
        >
          {title}
        </h2>

        <section className=' flex-1 flex flex-wrap items-center justify-center gap-8 '>
          {items.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              descriptionContent={item.description}
              logo={item.logo}
              buttonText={buttonText}
              size={cardVariant}
              blurEffect={false}
              isSelected={selectedCardId === item.id}
              onButtonClick={handleConfirm}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
