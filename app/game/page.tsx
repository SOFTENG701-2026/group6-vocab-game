"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "@/components/button";
import MinigameFallback from "@/components/minigames/minigame-fallback-ui";
import IngredientMatchMinigame from "@/components/minigames/ingredient-match-minigame";
import { ingredients } from "@/data/ingredients";
import { minigamesByDifficulty, type MinigameId } from "@/domain/minigame-type";
import { useGameSetup } from "@/context/game-setup-context";
import FutureIngredientStack from "@/components/game/future-ingredient-stack";

export default function GamePage() {
  const [activeIngredientIndex, setActiveIngredientIndex] = useState(0);
  const activeIngredient = ingredients[activeIngredientIndex] ?? null;
  const futureIngredients = ingredients.slice(activeIngredientIndex + 1);
  const [activeMinigameIndex, setActiveMinigameIndex] = useState(0);
  const isIngredientListEmpty = activeIngredientIndex === ingredients.length;
  const [isShowingCompletion, setIsShowingCompletion] = useState(false);
  //derived state
  const { difficulty } = useGameSetup();
  const activeMinigames = minigamesByDifficulty[difficulty];
  const activeMinigameId = activeMinigames[activeMinigameIndex];
  const isLastMinigame = activeMinigameIndex === activeMinigames.length - 1;
  //constants
  const COMPLETION_DELAY_MS = 1500;

  //Automatically advance after 1.5s when a minigame is complete
  useEffect(() => {
    if (!isShowingCompletion) return;

    const timeoutId = window.setTimeout(() => {
      if (!isLastMinigame) {
        setActiveMinigameIndex((previousIndex) => previousIndex + 1);
      } else {
        skipCurrentIngredient();
      }

      setIsShowingCompletion(false);
    }, COMPLETION_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isShowingCompletion, isLastMinigame]);

  function handleMinigameComplete() {
    if (isShowingCompletion) return;
    setIsShowingCompletion(true);
  }

  //Utilised on finished and when optionally skipping ingredients
  function skipCurrentIngredient(): void {
    setActiveIngredientIndex((prev) => prev + 1);
    setActiveMinigameIndex(0);
  }

  function renderActiveMinigame(minigameId: MinigameId) {
    if (!activeIngredient) {
      return <MinigameFallback />;
    }

    if (isIngredientListEmpty) {
      //TODO: PLACEHOLDER for monster dialogue
      return (
        <div className='flex h-full items-center justify-center rounded-4xl bg-white/90 p-8 text-center shadow'>
          <div>
            <h2 className='text-3xl font-extrabold text-(--color-primary-hover)'>Well done!</h2>

            <p className='mt-3 text-lg font-bold text-gray-700'>You've ran out of ingredients.</p>
          </div>
        </div>
      );
    }

    switch (minigameId) {
      case "ingredient-match":
        return (
          <IngredientMatchMinigame
            key={`${activeIngredient.id}-${activeMinigameIndex}`}
            ingredient={activeIngredient}
            onComplete={handleMinigameComplete}
          />
        );

      //TODO: Implement Spelling Minigame
      case "letter-spelling":
        return (
          <div className='flex h-full items-center justify-center rounded-4xl p-8 text-center shadow'>
            <div>
              <h2 className='text-2xl font-extrabold text-(--color-primary-hover)'>Letter Spelling Minigame</h2>

              <p className='mt-2 text-gray-600'>Spell the word: {activeIngredient.name}</p>

              <div className='mt-6'>
                <Button onClick={handleMinigameComplete}>Complete Placeholder</Button>
              </div>
            </div>
          </div>
        );
    }
  }

  return (
    <main className='min-h-screen'>
      <div className='flex min-h-screen flex-col gap-y px-6 py-4'>
        {/* TODO: add section for monster dialogue uncomment <section> as an example */}
        {/* <section className='min-h-36'>
          <div className='flex h-full items-center rounded-4xl bg-white/90 p-8 text-black shadow'>
            <div>
              <p className='text-sm font-bold uppercase tracking-wide text-gray-500'>
                Monster says
              </p>
              <p className='mt-2 text-2xl font-extrabold text-(--color-primary-hover)'>
                Choose an ingredient to add to the soup!
              </p>
            </div>
          </div>
        </section> */}

        <section
          className='
        grid flex-1 w-full
        grid-cols-[1fr_280px] gap-6
      '
        >
          {/* Minigame area */}
          <section className='h-full'>
            {activeIngredient ? renderActiveMinigame(activeMinigameId) : <MinigameFallback />}
          </section>

          {/* Active ingredient / button / status area */}
          <aside
            className='
            flex min-h-105 flex-col items-center 
            rounded-4xl bg-white/90 p-5 text-black shadow
          '
          >
            <h2 className='text-center text-xl font-extrabold text-(--color-primary-hover)'>Active Ingredient</h2>
            {activeIngredient && (
              <p className='mt-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700'>
                {difficulty === "hard" ? "Hard Mode" : "Easy Mode"} · Minigame {activeMinigameIndex + 1} of{" "}
                {activeMinigames.length}
              </p>
            )}
            <div className='my-4 flex flex-col items-center  text-center'>
              {activeIngredient ? (
                <div
                  className='
                  flex w-full flex-col items-center justify-center
                  rounded-3xl bg-white p-5 shadow
                '
                >
                  <Image
                    src={activeIngredient.imageSrc}
                    alt={activeIngredient.imageAlt}
                    width={180}
                    height={180}
                    className='h-40 w-40 object-contain'
                    draggable={false}
                  />

                  <p className='mt-4 text-center text-base font-bold text-gray-700'>
                    A {activeIngredient.color}, {activeIngredient.shape} ingredient
                  </p>

                  <FutureIngredientStack ingredients={futureIngredients} />
                </div>
              ) : (
                <div>
                  <p className='font-bold text-gray-700'>No ingredient selected</p>
                  <p className='mt-2 text-sm text-gray-500'>Choose an ingredient to begin.</p>
                </div>
              )}
            </div>
            <Button onClick={skipCurrentIngredient}>Skip Ingredient</Button>
          </aside>
        </section>
      </div>
    </main>
  );
}
