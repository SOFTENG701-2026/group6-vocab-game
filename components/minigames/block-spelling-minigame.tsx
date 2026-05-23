"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Ingredient } from "@/data/ingredients";
import LetterTile from "./block-spelling-ui/letter-tiles";
import LetterPlaceholder from "./block-spelling-ui/letter-placeholder";
import SpellingIngredientCard from "./block-spelling-ui/spelling-ingredient-card";

type LetterTile = {
  id: string;
  letter: string;
  isUsed: boolean;
};

type LetterSpellingMinigameProps = {
  ingredient: Ingredient;
  onComplete: () => void;
};

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

function normaliseWord(word: string) {
  return word.toLowerCase().replace(/[^a-z]/g, "");
}

function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getRandomDecoyLetters(wordLetters: string[], count: number) {
  const wordLetterSet = new Set(wordLetters);

  const availableLetters = ALPHABET.filter((letter) => !wordLetterSet.has(letter));

  return shuffleArray(availableLetters).slice(0, count);
}

function createLetterTiles(word: string) {
  const wordLetters = word.split("");

  const decoyCount = Math.floor(Math.random() * 2) + 3;
  const decoyLetters = getRandomDecoyLetters(wordLetters, decoyCount);

  const allLetters = [...wordLetters, ...decoyLetters];

  let shuffledLetters = shuffleArray(allLetters);

  while (shuffledLetters.slice(0, word.length).join("") === word) {
    shuffledLetters = shuffleArray(allLetters);
  }

  return shuffledLetters.map((letter, index) => ({
    id: `${letter}-${index}-${crypto.randomUUID()}`,
    letter,
    isUsed: false,
  }));
}

export default function LetterSpellingMinigame({ ingredient, onComplete }: LetterSpellingMinigameProps) {
  const targetWord = useMemo(() => normaliseWord(ingredient.name), [ingredient.name]);

  const targetLetters = useMemo(() => targetWord.split(""), [targetWord]);

  const [tiles, setTiles] = useState<LetterTile[]>(() => createLetterTiles(targetWord));

  const [placedLetters, setPlacedLetters] = useState<(LetterTile | null)[]>(() => Array(targetWord.length).fill(null));

  const [draggedTileId, setDraggedTileId] = useState<string | null>(null);
  const [incorrectIndex, setIncorrectIndex] = useState<number | null>(null);

  const completedWord = placedLetters.map((tile) => tile?.letter ?? "").join("");

  const isComplete = completedWord === targetWord;

  function completeIfCorrect(updatedPlacedLetters: (LetterTile | null)[]) {
    const newWord = updatedPlacedLetters.map((placedTile) => placedTile?.letter ?? "").join("");

    if (newWord === targetWord) {
      window.setTimeout(() => {
        onComplete();
      }, 700);
    }
  }

  function handleDragStart(tileId: string) {
    setDraggedTileId(tileId);
  }

  function handleDragEnd() {
    setDraggedTileId(null);
  }

  function handleDrop(index: number) {
    if (!draggedTileId || isComplete) return;
    if (placedLetters[index]) return;

    const draggedTile = tiles.find((tile) => tile.id === draggedTileId);
    if (!draggedTile || draggedTile.isUsed) return;

    const expectedLetter = targetLetters[index];

    if (draggedTile.letter !== expectedLetter) {
      setIncorrectIndex(index);

      window.setTimeout(() => {
        setIncorrectIndex(null);
      }, 500);

      return;
    }

    const updatedPlacedLetters = [...placedLetters];
    updatedPlacedLetters[index] = draggedTile;

    setPlacedLetters(updatedPlacedLetters);

    setTiles((currentTiles) =>
      currentTiles.map((tile) => (tile.id === draggedTile.id ? { ...tile, isUsed: true } : tile)),
    );

    completeIfCorrect(updatedPlacedLetters);
  }

  function handlePlaceholderClick(index: number) {
    const tileToRemove = placedLetters[index];
    if (!tileToRemove || isComplete) return;

    const updatedPlacedLetters = [...placedLetters];
    updatedPlacedLetters[index] = null;

    setPlacedLetters(updatedPlacedLetters);

    setTiles((currentTiles) =>
      currentTiles.map((tile) => (tile.id === tileToRemove.id ? { ...tile, isUsed: false } : tile)),
    );
  }

  return (
    <section
      className='
      flex h-full w-full flex-col items-center justify-between gap-8
      rounded-4xl bg-white/90 p-8 text-center shadow
    '
    >
      <SpellingIngredientCard ingredient={ingredient} isComplete={isComplete} />

      <div className='flex max-w-full flex-wrap justify-center gap-3'>
        {targetLetters.map((letter, index) => {
          const placedTile = placedLetters[index];

          return (
            <LetterPlaceholder
              key={`${letter}-${index}`}
              hintedLetter={letter}
              placedLetter={placedTile?.letter}
              isIncorrect={incorrectIndex === index}
              position={index + 1}
              onDrop={() => handleDrop(index)}
              onClick={() => handlePlaceholderClick(index)}
            />
          );
        })}
      </div>

      <div className='flex w-full justify-center'>
        <div className='grid max-w-90 grid-cols-5 justify-items-center gap-4'>
          {tiles.map((tile) => (
            <LetterTile
              key={tile.id}
              letter={tile.letter}
              isUsed={tile.isUsed}
              isComplete={isComplete}
              onDragStart={() => handleDragStart(tile.id)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>

      {isComplete && <p className='text-xl font-extrabold text-green-600'>Great spelling!</p>}
    </section>
  );
}
