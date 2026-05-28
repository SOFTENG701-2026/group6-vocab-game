"use client";

import { PlacedLetter, FallingLetter, CatchResult } from "@/domain/block-spelling-game-type";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UseBasketSpellingGameProps = {
  word: string;
  onComplete: () => void;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Basket / collision tuning
const BASKET_WIDTH = 18;
const BASKET_CATCH_Y = 88;

// Movement tuning
const NORMAL_BASKET_SPEED = 0.2;
const SLOWED_BASKET_SPEED = 0.16;
const SLOW_DURATION_MS = 800;

// Falling letter tuning
const MAX_FALLING_LETTERS = 3;
const LETTER_SPAWN_INTERVAL_MS = 1400;
const MIN_HORIZONTAL_DISTANCE = 20;

// Spawn chance tuning
const NEEDED_LETTER_CHANCE = 0.6;
const COMPLETED_LETTER_CHANCE = 0.1;
// Distractor letter chance = 1 - %Needed if no completed letter else: 1 - %Needed - %Completed

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function normaliseWord(word: string) {
  return word.toUpperCase().replace(/[^A-Z]/g, "");
}

export function useBasketSpellingGame({ word, onComplete }: UseBasketSpellingGameProps) {
  const targetLetters = useMemo(() => normaliseWord(word).split(""), [word]);

  const [placedLetters, setPlacedLetters] = useState<PlacedLetter[]>(() =>
    targetLetters.map((letter) => ({
      letter,
      isFilled: false,
    })),
  );

  const [fallingLetters, setFallingLetters] = useState<FallingLetter[]>([]);
  const [basketX, setBasketX] = useState(50);
  const [feedbackMessage, setFeedbackMessage] = useState(`Catch the letters that belong in ${word}.`);
  const [slowUntil, setSlowUntil] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const placedLettersRef = useRef(placedLetters);
  const basketXRef = useRef(basketX);
  const slowUntilRef = useRef(slowUntil);
  const isCompleteRef = useRef(isComplete);

  const pressedKeysRef = useRef({
    left: false,
    right: false,
  });

  //Keeps the useRef states synchronised
  useEffect(() => {
    placedLettersRef.current = placedLetters;
  }, [placedLetters]);

  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  useEffect(() => {
    slowUntilRef.current = slowUntil;
  }, [slowUntil]);

  useEffect(() => {
    isCompleteRef.current = isComplete;
  }, [isComplete]);

  function getNeededLetters() {
    return placedLettersRef.current.filter((slot) => !slot.isFilled).map((slot) => slot.letter);
  }

  function getCompletedLetters() {
    return placedLettersRef.current.filter((slot) => slot.isFilled).map((slot) => slot.letter);
  }

  function getCatchResult(letter: string): CatchResult {
    const placeholderIndex = placedLettersRef.current.findIndex((slot) => slot.letter === letter && !slot.isFilled);

    if (placeholderIndex !== -1) {
      return {
        type: "correct",
        placeholderIndex,
      };
    }

    const letterExistsInWord = placedLettersRef.current.some((slot) => slot.letter === letter);

    if (letterExistsInWord) {
      return {
        type: "already-completed",
      };
    }

    return {
      type: "wrong",
    };
  }

  /**
   * The returned `x` value controls the horizontal spawn position
   *
   * The returned `speed` value controls how quickly the letter
   * falls down the play area each animation frame.
   */
  function createFallingLetter(): FallingLetter | null {
    const neededLetters = getNeededLetters();
    const completedLetters = getCompletedLetters();

    if (neededLetters.length === 0) return null;

    const targetLetterSet = new Set(targetLetters);
    const distractorLetters = ALPHABET.filter((letter) => !targetLetterSet.has(letter));

    const roll = Math.random();

    let nextLetter: string;

    if (roll < NEEDED_LETTER_CHANCE) {
      nextLetter = randomItem(neededLetters);
    } else if (roll < NEEDED_LETTER_CHANCE + COMPLETED_LETTER_CHANCE) {
      nextLetter = completedLetters.length > 0 ? randomItem(completedLetters) : randomItem(neededLetters);
    } else {
      nextLetter = randomItem(distractorLetters);
    }

    return {
      id: crypto.randomUUID(),
      letter: nextLetter,
      x: Math.floor(Math.random() * 70) + 15,
      y: 0,
      speed: 0.16 + Math.random() * 0.08,
    };
  }

  const spawnLetter = useCallback(() => {
    if (isCompleteRef.current) return;

    setFallingLetters((currentLetters) => {
      if (currentLetters.length >= MAX_FALLING_LETTERS) {
        return currentLetters;
      }

      const nextLetter = createFallingLetter();

      if (!nextLetter) {
        return currentLetters;
      }

      const isTooCloseToAnotherLetter = currentLetters.some(
        (letter) => Math.abs(letter.x - nextLetter.x) < MIN_HORIZONTAL_DISTANCE,
      );

      if (isTooCloseToAnotherLetter) {
        return currentLetters;
      }

      return [...currentLetters, nextLetter];
    });
  }, [targetLetters]);

  /**
   * Is called when the basket catches a letter that is not needed to:
   * 1) spell the word - Distractor Letter
   * 2) doesn't need more of it - Completed Letter
   */
  function slowBasketTemporarily() {
    const until = Date.now() + SLOW_DURATION_MS;

    slowUntilRef.current = until;
    setSlowUntil(until);

    window.setTimeout(() => {
      if (slowUntilRef.current === until) {
        setSlowUntil(null);
        slowUntilRef.current = null;
      }
    }, SLOW_DURATION_MS);
  }

  const handleLetterCaught = useCallback(
    (caughtLetter: FallingLetter) => {
      const result = getCatchResult(caughtLetter.letter);

      setFallingLetters((currentLetters) => currentLetters.filter((letter) => letter.id !== caughtLetter.id));

      if (result.type === "correct") {
        setPlacedLetters((currentLetters) => {
          const updatedLetters = [...currentLetters];

          updatedLetters[result.placeholderIndex] = {
            ...updatedLetters[result.placeholderIndex],
            isFilled: true,
          };

          const completed = updatedLetters.every((slot) => slot.isFilled);

          if (completed) {
            setIsComplete(true);
            isCompleteRef.current = true;
            setFallingLetters([]);
            setFeedbackMessage(`Great spelling! You spelled ${word}.`);
            onComplete();
          } else {
            setFeedbackMessage(`Nice! ${caughtLetter.letter} belongs in ${word}.`);
          }

          return updatedLetters;
        });

        return;
      }

      if (result.type === "already-completed") {
        slowBasketTemporarily();
        setFeedbackMessage(`We already caught all the ${caughtLetter.letter} letters.`);
        return;
      }

      slowBasketTemporarily();
      setFeedbackMessage(`${caughtLetter.letter} is not in ${word}. Try another letter.`);
    },
    [onComplete, word],
  );

  /** Reset state when active ingredient changes*/
  useEffect(() => {
    setPlacedLetters(
      targetLetters.map((letter) => ({
        letter,
        isFilled: false,
      })),
    );

    setFallingLetters([]);
    setBasketX(50);
    setSlowUntil(null);
    setIsComplete(false);
    setFeedbackMessage(`Catch the letters that belong in ${word}.`);

    placedLettersRef.current = targetLetters.map((letter) => ({
      letter,
      isFilled: false,
    }));

    slowUntilRef.current = null;
    isCompleteRef.current = false;
  }, [targetLetters, word]);

  /** Spawning letter effect when the game starts or resets*/
  useEffect(() => {
    if (isComplete) return;

    const timeoutId = window.setTimeout(() => {
      spawnLetter();
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [isComplete, spawnLetter]);

  /** While the word is not complete, keep trying to spawn a new falling letter every few seconds.*/
  useEffect(() => {
    if (isComplete) return;

    const intervalId = window.setInterval(() => {
      spawnLetter();
    }, LETTER_SPAWN_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [isComplete, spawnLetter]);

  /**
   * Move every falling letter downward
   * Check whether each letter touches the basket
   * Remove letter that were caught or fell to the bottom
   */
  useEffect(() => {
    if (isComplete) return;

    let animationFrameId: number;

    function animateFallingLetters() {
      setFallingLetters((currentLetters) => {
        const caughtLetters: FallingLetter[] = [];
        const remainingLetters: FallingLetter[] = [];

        for (const letter of currentLetters) {
          const nextY = letter.y + letter.speed;

          //Check collision with the basket
          const basketDistance = Math.abs(letter.x - basketXRef.current);
          const hasReachedBasket = nextY >= BASKET_CATCH_Y;
          const isCaught = hasReachedBasket && basketDistance <= BASKET_WIDTH / 2;

          if (isCaught) {
            caughtLetters.push(letter);
            continue;
          }

          //Remove letters that fall below play area: 100 -> 100%
          if (nextY > 100) {
            continue;
          }

          //Update falling letter on every frame
          remainingLetters.push({
            ...letter,
            y: nextY,
          });
        }

        window.setTimeout(() => {
          caughtLetters.forEach((letter) => {
            handleLetterCaught(letter);
          });
        }, 0);

        return remainingLetters;
      });

      animationFrameId = window.requestAnimationFrame(animateFallingLetters);
    }

    animationFrameId = window.requestAnimationFrame(animateFallingLetters);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [isComplete, handleLetterCaught]);

  //Keyboard event A and D or left arrow and right arrow to move the basket
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        pressedKeysRef.current.left = true;
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        pressedKeysRef.current.right = true;
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        pressedKeysRef.current.left = false;
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        pressedKeysRef.current.right = false;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  /** Ensure smooth continuous basket movement */
  useEffect(() => {
    let animationFrameId: number;

    function animateBasketMovement() {
      //Only move the basket when the word is not complete
      if (!isCompleteRef.current) {
        const isMovingLeft = pressedKeysRef.current.left;
        const isMovingRight = pressedKeysRef.current.right;

        if (isMovingLeft !== isMovingRight) {
          const isSlowed = slowUntilRef.current !== null && Date.now() < slowUntilRef.current;

          const speed = isSlowed ? SLOWED_BASKET_SPEED : NORMAL_BASKET_SPEED;

          setBasketX((currentX) => {
            const direction = isMovingLeft ? -1 : 1;
            const nextX = currentX + direction * speed;
            return Math.max(12, Math.min(88, nextX));
          });
        }
      }

      animationFrameId = window.requestAnimationFrame(animateBasketMovement);
    }

    animationFrameId = window.requestAnimationFrame(animateBasketMovement);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  const isBasketSlowed = slowUntil !== null && Date.now() < slowUntil;

  return {
    targetLetters,
    placedLetters,
    fallingLetters,
    basketX,
    feedbackMessage,
    isBasketSlowed,
    isComplete,
  };
}
