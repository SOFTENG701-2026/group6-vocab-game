"use client";

import type { Ingredient } from "@/data/ingredients";
import LetterTile from "./block-spelling-ui/letter-tiles";
import LetterPlaceholder from "./block-spelling-ui/letter-placeholder";
import SpellingIngredientCard from "./block-spelling-ui/spelling-ingredient-card";
import { useBlockSpellingGame } from "./use-block-spelling-game";

type LetterSpellingMinigameProps = {
  ingredient: Ingredient;
  onComplete: () => void;
};

export default function LetterSpellingMinigame({ ingredient, onComplete }: LetterSpellingMinigameProps) {
  const spellingGame = useBlockSpellingGame({
    word: ingredient.name,
    onComplete,
  });

  return (
    <section
      className='
        flex h-full w-full flex-col items-center justify-between gap-8
        rounded-4xl bg-white/90 p-8 text-center shadow select-none
      '
    >
      <SpellingIngredientCard ingredient={ingredient} isComplete={spellingGame.isComplete} />

      <div className='flex max-w-full flex-wrap justify-center gap-3'>
        {spellingGame.targetLetters.map((letter, index) => {
          const placedTile = spellingGame.placedLetters[index];

          return (
            <LetterPlaceholder
              key={`${letter}-${index}`}
              hintedLetter={letter}
              placedLetter={placedTile?.letter}
              status={spellingGame.incorrectIndex === index ? "incorrect" : placedTile ? "correct" : "empty"}
              position={index + 1}
              onDrop={() => spellingGame.handleDrop(index)}
              onClick={() => spellingGame.handlePlaceholderClick(index)}
            />
          );
        })}
      </div>

      <div className='flex w-full justify-center'>
        <div className='grid max-w-90 grid-cols-5 justify-items-center gap-4'>
          {spellingGame.tiles.map((tile) => (
            <LetterTile
              key={tile.id}
              letter={tile.letter}
              isUsed={spellingGame.isTileUsed(tile)}
              isComplete={spellingGame.isComplete}
              onDragStart={() => spellingGame.handleDragStart(tile.id)}
              onDragEnd={spellingGame.handleDragEnd}
            />
          ))}
        </div>
      </div>

      {spellingGame.isComplete && <p className='text-xl font-extrabold text-green-600'>Great spelling!</p>}
    </section>
  );
}
