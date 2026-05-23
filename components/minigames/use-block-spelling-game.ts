import { useMemo, useState } from "react";

export type LetterTile = {
  id: string;
  letter: string;

  /**
   * Number of times this letter is needed in the target word.
   * Decoy letters have a requiredCount of 0.
   */
  requiredCount: number;
};

type UseBlockSpellingGameArgs = {
  word: string;
  onComplete: () => void;
};

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 * Converts an ingredient name into a clean spelling target.
 *
 * Example:
 * "Red Apple!" -> "redapple"
 */
function normaliseWord(word: string) {
  return word.toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * Returns a shuffled copy of an array without mutating the original array.
 * Used to randomise letter tile order and decoy letters.
 */
function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

/**
 * Selects random decoy letters that are not part of the target word.
 */
function getRandomDecoyLetters(wordLetters: string[], count: number) {
  const wordLetterSet = new Set(wordLetters);

  const availableLetters = ALPHABET.filter((letter) => !wordLetterSet.has(letter));

  return shuffleArray(availableLetters).slice(0, count);
}

function countLetters(letters: string[]) {
  return letters.reduce<Record<string, number>>((counts, letter) => {
    counts[letter] = (counts[letter] ?? 0) + 1;
    return counts;
  }, {});
}

/**
 * Creates the letter tiles shown to the player.
 *
 * Only one tile is created per unique letter in the word. For repeated letters,
 * requiredCount stores how many times that letter must be placed.
 *
 */
function createLetterTiles(word: string): LetterTile[] {
  const wordLetters = word.split("");
  const letterCounts = countLetters(wordLetters);

  const uniqueWordLetters = Object.keys(letterCounts);

  const decoyCount = Math.floor(Math.random() * 2) + 3;
  const decoyLetters = getRandomDecoyLetters(uniqueWordLetters, decoyCount);

  const allLetters = [...uniqueWordLetters, ...decoyLetters];

  return shuffleArray(allLetters).map((letter) => ({
    id: `${letter}-${crypto.randomUUID()}`,
    letter,
    requiredCount: letterCounts[letter] ?? 0,
  }));
}

export function useBlockSpellingGame({ word, onComplete }: UseBlockSpellingGameArgs) {
  const targetWord = useMemo(() => normaliseWord(word), [word]);

  const targetLetters = useMemo(() => targetWord.split(""), [targetWord]);

  const [tiles] = useState<LetterTile[]>(() => createLetterTiles(targetWord));

  const [placedLetters, setPlacedLetters] = useState<(LetterTile | null)[]>(() => Array(targetWord.length).fill(null));

  const [draggedTileId, setDraggedTileId] = useState<string | null>(null);
  const [incorrectIndex, setIncorrectIndex] = useState<number | null>(null);

  const completedWord = placedLetters.map((tile) => tile?.letter ?? "").join("");

  const isComplete = completedWord === targetWord;

  /**
   * Returns how many times a letter has already been placed.
   * Used to decide whether a repeated-letter tile should remain draggable.
   */
  function getTileUsedCount(letter: string) {
    return placedLetters.filter((placedTile) => placedTile?.letter === letter).length;
  }

  /**
   * Checks whether a tile has been used for all required positions.
   *
   * Example:
   * In "apple", the "p" tile remains usable after one placement,
   * but becomes used after two placements.
   */
  function isTileUsed(tile: LetterTile) {
    return tile.requiredCount > 0 && getTileUsedCount(tile.letter) >= tile.requiredCount;
  }

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
    if (!draggedTile) return;

    if (isTileUsed(draggedTile)) return;

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
    completeIfCorrect(updatedPlacedLetters);
  }

  function handlePlaceholderClick(index: number) {
    const tileToRemove = placedLetters[index];
    if (!tileToRemove || isComplete) return;

    const updatedPlacedLetters = [...placedLetters];
    updatedPlacedLetters[index] = null;

    setPlacedLetters(updatedPlacedLetters);
  }

  return {
    targetLetters,
    tiles,
    placedLetters,
    incorrectIndex,
    isComplete,
    isTileUsed,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handlePlaceholderClick,
  };
}
