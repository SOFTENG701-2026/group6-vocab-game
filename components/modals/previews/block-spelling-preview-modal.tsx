"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import type { Ingredient } from "@/data/ingredients";
import { usePreviewTimeline } from "./use-preview-timeline";
import LetterPlaceholder from "@/components/minigames/block-spelling-ui/letter-placeholder";
import BasePreviewTutorialModal from "./base-preview-tutorial-modal";

type BlockSpellingPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient;
  speed?: number;
};

type BlockSpellingPreviewStep =
  | "idle"
  | "press-a"
  | "move-left"
  | "press-d"
  | "move-right"
  | "press-a-centred"
  | "move-left-centred"
  | "wrong-letter-falls"
  | "show-wrong-marker"
  | "correct-letter-falls"
  | "show-correct-marker";

const stepOrder = [
  "idle",
  "press-a",
  "move-left",
  "press-d",
  "move-right",
  "press-a-centred",
  "move-left-centred",
  "wrong-letter-falls",
  "show-wrong-marker",
  "correct-letter-falls",
  "show-correct-marker",
] as const satisfies readonly BlockSpellingPreviewStep[];

const stepDurations: Record<BlockSpellingPreviewStep, number> = {
  idle: 2000,
  "press-a": 700,
  "move-left": 1000,
  "press-d": 700,
  "move-right": 1000,
  "press-a-centred": 1000,
  "move-left-centred": 1000,
  "wrong-letter-falls": 1200,
  "show-wrong-marker": 1200,
  "correct-letter-falls": 1200,
  "show-correct-marker": 1600,
};

export default function BlockSpellingPreviewModal({
  isOpen,
  onClose,
  ingredient,
  speed = 1,
}: BlockSpellingPreviewModalProps) {
  const { step, replay } = usePreviewTimeline<BlockSpellingPreviewStep>({
    isOpen,
    stepOrder,
    stepDurations,
    speed,
  });

  const word = ingredient.name.toUpperCase();
  const wordLetters = word.split("");

  const correctLetter = wordLetters[0] ?? "A";
  const wrongLetter = getWrongLetter(wordLetters);

  const isPressingA =
    step === "press-a" || step === "move-left" || step == "press-a-centred" || step === "move-left-centred";
  const isPressingD = step === "press-d" || step === "move-right";

  const activeLetter = getActiveLetter({
    step,
    correctLetter,
    wrongLetter,
  });

  const shouldShowWrongMarker = step === "show-wrong-marker";
  const shouldShowCorrectMarker = step === "show-correct-marker";
  const shouldEmphasiseInput = step === "idle";

  const placedLetters = getPreviewPlacedLetters({
    wordLetters,
    correctLetter,
    step,
  });

  const basketX = getBasketX(step);
  const fallingLetterY = getFallingLetterY(step);

  return (
    <BasePreviewTutorialModal
      isOpen={isOpen}
      onClose={onClose}
      onReplay={replay}
      title='How to move'
      description='Use A and D to move the basket. Catch letters that belong in the ingredient.'
      shouldEmphasiseInput={shouldEmphasiseInput}
      inputPreview={<KeyboardMovementPreview isPressingA={isPressingA} isPressingD={isPressingD} />}
    >
      <section
        className='
          relative h-130 overflow-hidden
          rounded-4xl bg-gray-300 p-8
        '
      >
        <div className='flex h-full flex-col items-center justify-between'>
          {/* Top instruction area */}
          <div className='flex flex-col items-center gap-4'>
            <div className='flex items-center gap-4 rounded-3xl bg-white/90 px-5 py-3 shadow'>
              <Image
                src={ingredient.imageSrc}
                alt={ingredient.imageAlt}
                width={90}
                height={90}
                className='h-18 w-18 object-contain'
                draggable={false}
              />
              <div className='flex flex-wrap justify-center gap-2'>
                {wordLetters.map((letter, index) => {
                  const placedLetter = placedLetters[index];
                  const isCorrect = placedLetter === letter;

                  return (
                    <LetterPlaceholder
                      key={`${letter}-${index}`}
                      hintedLetter={letter}
                      placedLetter={placedLetter}
                      status={isCorrect ? "correct" : "empty"}
                      position={index + 1}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Play area */}
          <div
            className='
              relative h-72 w-full max-w-xl overflow-hidden
              rounded-3xl border-4 border-white
              bg-linear-to-b from-sky-100 to-emerald-100
              shadow-inner
            '
          >
            {/* Falling letter */}
            <div
              className='
                absolute left-1/2 flex h-16 w-16 items-center justify-center
                rounded-2xl border-4 border-white bg-yellow-200
                text-3xl font-black text-slate-900 shadow-lg
                transition-all duration-700 ease-in-out
              '
              style={{
                top: `${fallingLetterY}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {activeLetter}

              {shouldShowWrongMarker && (
                <div
                  aria-label='Incorrect letter'
                  className='
                    absolute -right-3 -top-3 z-20
                    flex h-9 w-9 items-center justify-center
                    rounded-full bg-red-500 text-white shadow-lg ring-2 ring-white
                  '
                >
                  <X size={24} strokeWidth={4} />
                </div>
              )}

              {shouldShowCorrectMarker && (
                <div
                  aria-label='Correct letter'
                  className='
                    absolute -right-3 -top-3 z-20
                    flex h-9 w-9 items-center justify-center
                    rounded-full bg-green-500 text-white shadow-lg ring-2 ring-white
                  '
                >
                  <Check size={24} strokeWidth={4} />
                </div>
              )}
            </div>

            {/* Basket */}
            <div
              className='
                absolute bottom-2 w-24
                transition-all duration-700 ease-in-out
              '
              style={{
                left: `${basketX}%`,
                transform: "translateX(-50%)",
              }}
            >
              <Image
                src='/basket.svg'
                alt='Letter basket'
                width={120}
                height={120}
                className='h-20 w-24 object-contain'
                draggable={false}
              />
            </div>
          </div>
        </div>
      </section>
    </BasePreviewTutorialModal>
  );
}

type KeyboardMovementPreviewProps = {
  isPressingA: boolean;
  isPressingD: boolean;
};

function KeyboardMovementPreview({ isPressingA, isPressingD }: KeyboardMovementPreviewProps) {
  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='flex items-center justify-center gap-6'>
        <img
          src={isPressingA ? "/assets/tutorial/key-a-active.svg" : "/assets/tutorial/key-a-inactive.svg"}
          alt='A key'
          className={`
            h-24 w-24 object-contain transition-transform duration-200
            ${isPressingA ? "scale-110" : "scale-100"}
          `}
        />

        <img
          src={isPressingD ? "/assets/tutorial/key-d-active.svg" : "/assets/tutorial/key-d-inactive.svg"}
          alt='D key'
          className={`
            h-24 w-24 object-contain transition-transform duration-200
            ${isPressingD ? "scale-110" : "scale-100"}
          `}
        />
      </div>
      <p className='rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow'>Use A and D</p>
    </div>
  );
}

function getBasketX(step: BlockSpellingPreviewStep) {
  switch (step) {
    case "press-a":
    case "move-left":
      return 30;

    case "press-d":
    case "move-right":
      return 70;

    case "wrong-letter-falls":
    case "show-wrong-marker":
    case "correct-letter-falls":
    case "show-correct-marker":
    case "press-a-centred":
    case "idle":
    default:
      return 50;
  }
}

function getFallingLetterY(step: BlockSpellingPreviewStep) {
  switch (step) {
    case "wrong-letter-falls":
    case "correct-letter-falls":
      return 45;

    case "show-wrong-marker":
    case "show-correct-marker":
      return 78;

    default:
      return 20;
  }
}

function getActiveLetter({
  step,
  correctLetter,
  wrongLetter,
}: {
  step: BlockSpellingPreviewStep;
  correctLetter: string;
  wrongLetter: string;
}) {
  switch (step) {
    case "wrong-letter-falls":
    case "show-wrong-marker":
      return wrongLetter;

    case "correct-letter-falls":
    case "show-correct-marker":
      return correctLetter;

    default:
      return correctLetter;
  }
}

function getWrongLetter(ingredientLetters: string[]) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return alphabet.find((letter) => !ingredientLetters.includes(letter)) ?? "X";
}

function getPreviewPlacedLetters({
  wordLetters,
  correctLetter,
  step,
}: {
  wordLetters: string[];
  correctLetter: string;
  step: BlockSpellingPreviewStep;
}) {
  const shouldPlaceCorrectLetter = step === "show-correct-marker";

  if (!shouldPlaceCorrectLetter) {
    return wordLetters.map(() => undefined);
  }

  const firstMatchingIndex = wordLetters.findIndex((letter) => letter === correctLetter);

  return wordLetters.map((letter, index) => {
    return index === firstMatchingIndex ? letter : undefined;
  });
}
