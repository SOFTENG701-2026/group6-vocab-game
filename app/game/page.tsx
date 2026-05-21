"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import IngredientModal from "@/components/modals/ingredient-selection-modal";
import Button from "@/components/button";
import MinigameFallback from "@/components/minigames/minigame-fallback-ui";
import IngredientMatchMinigame from "@/components/minigames/ingredient-match-minigame";
import { ingredients } from "@/data/ingredients";
import { minigamesByDifficulty, type MinigameId } from "@/domain/minigame-type";
import { useGameSetup } from "@/context/game-setup-context";

export default function GamePage() {
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [chosenIngredientIds, setChosenIngredientIds] = useState<string[]>([]);
  const [activeIngredientId, setActiveIngredientId] = useState<string | null>(null);

  const [activeMinigameIndex, setActiveMinigameIndex] = useState(0);
  const [isIngredientComplete, setIsIngredientComplete] = useState(false);

  //derived data

  const { difficulty } = useGameSetup();
  const activeMinigames = minigamesByDifficulty[difficulty];
  const activeMinigameId = activeMinigames[activeMinigameIndex];
  const isLastMinigame = activeMinigameIndex === activeMinigames.length - 1;
  const activeIngredient = useMemo(() => {
    if (!activeIngredientId) return null;

    return ingredients.find((ingredient) => ingredient.id === activeIngredientId) ?? null;
  }, [activeIngredientId]);

  function handleSelectIngredient(ingredientId: string) {
    setChosenIngredientIds((previousIds) => [...previousIds, ingredientId]);
    setActiveIngredientId(ingredientId);
    setActiveMinigameIndex(0);
    setIsIngredientComplete(false);
    setIsIngredientModalOpen(false);
  }

  function handleMinigameComplete() {
    if (!isLastMinigame) {
      setActiveMinigameIndex((previousIndex) => previousIndex + 1);
      return;
    }

    setIsIngredientComplete(true);
  }

  function handleIngredientFinished(): void {
    setActiveIngredientId(null);
    setActiveMinigameIndex(0);
    setIsIngredientComplete(false);
  }

  function renderActiveMinigame(minigameId: MinigameId) {
    if (!activeIngredient) {
      return <MinigameFallback />;
    }

    if (isIngredientComplete) {
      return (
        <div className='flex h-full items-center justify-center rounded-4xl bg-white/90 p-8 text-center shadow'>
          <div>
            <h2 className='text-3xl font-extrabold text-(--color-primary-hover)'>Well done!</h2>

            <p className='mt-3 text-lg font-bold text-gray-700'>
              You completed all minigames for {activeIngredient.name}.
            </p>
          </div>
        </div>
      );
    }

    switch (minigameId) {
      case "ingredient-match":
        return <IngredientMatchMinigame ingredient={activeIngredient} onComplete={handleMinigameComplete} />;

      //TODO: Implement Spelling Minigame
      case "letter-spelling":
        return (
          <div className='flex h-full items-center justify-center rounded-4xl bg-white/90 p-8 text-center shadow'>
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
            flex min-h-105 flex-col items-center justify-center
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
            <div className='mt-6 flex flex-1 items-center justify-center text-center'>
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
                </div>
              ) : (
                <div>
                  <p className='font-bold text-gray-700'>No ingredient selected</p>
                  <p className='mt-2 text-sm text-gray-500'>Choose an ingredient to begin.</p>
                </div>
              )}
            </div>

            {!activeIngredient && <Button onClick={() => setIsIngredientModalOpen(true)}>Choose Ingredient</Button>}

            {activeIngredient && isIngredientComplete && (
              <Button onClick={handleIngredientFinished}>Finish Ingredient</Button>
            )}
          </aside>
        </section>
      </div>

      <IngredientModal
        isOpen={isIngredientModalOpen}
        chosenIngredientIds={chosenIngredientIds}
        onSelectIngredient={handleSelectIngredient}
      />
    </main>
  );
}
