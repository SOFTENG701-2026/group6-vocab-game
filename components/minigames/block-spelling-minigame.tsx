"use client";

import Image from "next/image";
import type { Ingredient } from "@/data/ingredients";
import LetterPlaceholder from "./block-spelling-ui/letter-placeholder";
import SpellingIngredientCard from "./block-spelling-ui/spelling-ingredient-card";
import { useBasketSpellingGame } from "./use-block-spelling-game";
import BasketSpellingPlayArea from "./block-spelling-ui/play-area";

type LetterSpellingMinigameProps = {
  ingredient: Ingredient;
  onComplete: () => void;
};

export default function LetterSpellingMinigame({ ingredient, onComplete }: LetterSpellingMinigameProps) {
  const spellingGame = useBasketSpellingGame({
    word: ingredient.name,
    onComplete,
  });

  return (
    <section
      className='
        flex h-full w-full flex-col items-center justify-between gap-5
        rounded-4xl bg-white/90 p-6 text-center shadow select-none
      '
    >
      <SpellingIngredientCard ingredient={ingredient} isComplete={spellingGame.isComplete} />
      <div className='flex max-w-full flex-wrap justify-center gap-2'>
        {spellingGame.targetLetters.map((letter, index) => {
          const slot = spellingGame.placedLetters[index];

          return (
            <LetterPlaceholder
              key={`${letter}-${index}`}
              hintedLetter={letter}
              placedLetter={slot?.isFilled ? slot.letter : undefined}
              status={slot?.isFilled ? "correct" : "empty"}
              position={index + 1}
            />
          );
        })}
      </div>
      <p
        className={`
          min-h-10 rounded-2xl bg-white px-5 py-2
          text-base font-bold text-gray-700 shadow
          ${spellingGame.isBasketSlowed ? "text-orange-500" : ""}
        `}
      >
        {spellingGame.feedbackMessage}
      </p>
      <BasketSpellingPlayArea
        fallingLetters={spellingGame.fallingLetters}
        basketX={spellingGame.basketX}
        isBasketSlowed={spellingGame.isBasketSlowed}
      />
      a{spellingGame.isComplete && <p className='text-xl font-extrabold text-green-600'>Great spelling!</p>}
    </section>
  );
}
