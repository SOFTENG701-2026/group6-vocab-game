"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import IngredientModal from "@/components/modals/ingredient-selection-modal";
import Button from "@/components/button";
import MinigameFallback from "@/components/minigames/minigame-fallback-ui";
import IngredientMatchMinigame from "@/components/minigames/ingredient-match-minigame";
import { ingredients } from "@/data/ingredients";

export default function GamePage() {
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [chosenIngredientIds, setChosenIngredientIds] = useState<string[]>([]);
  const [activeIngredientId, setActiveIngredientId] = useState<string | null>(
    null
  );
  const [isMinigameComplete, setIsMinigameComplete] = useState(false);

  const activeIngredient = useMemo(() => {
    if (!activeIngredientId) return null;

    return (
      ingredients.find((ingredient) => ingredient.id === activeIngredientId) ??
      null
    );
  }, [activeIngredientId]);

  function handleSelectIngredient(ingredientId: string) {
    setChosenIngredientIds((previousIds) => [...previousIds, ingredientId]);
    setActiveIngredientId(ingredientId);
    setIsMinigameComplete(false);
    setIsIngredientModalOpen(false);
  }

  function handleMinigameComplete() {
    setIsMinigameComplete(true);
  }

  function handleIngredientFinished(): void {
    setActiveIngredientId(null);
    setIsMinigameComplete(false);
  }

  return (
    <main className='min-h-screen'>
      <div className='flex min-h-screen flex-col gap-y px-6 py-4'>
        <section className='min-h-36'>
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
        </section>

        <section
          className='
        grid flex-1 w-full
        grid-cols-[1fr_280px] gap-6
      '
        >
          {/* Minigame area */}
          <section className='h-full'>
            {activeIngredient ? (
              <IngredientMatchMinigame
                ingredient={activeIngredient}
                onComplete={handleMinigameComplete}
              />
            ) : (
              <MinigameFallback />
            )}
          </section>

          {/* Active ingredient / button / status area */}
          <aside
            className='
            flex min-h-105 flex-col items-center justify-center
            rounded-4xl bg-white/90 p-5 text-black shadow
          '
          >
            <h2 className='text-center text-xl font-extrabold text-(--color-primary-hover)'>
              Active Ingredient
            </h2>

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
                    A {activeIngredient.color}, {activeIngredient.shape}{" "}
                    ingredient
                  </p>
                </div>
              ) : (
                <div>
                  <p className='font-bold text-gray-700'>
                    No ingredient selected
                  </p>
                  <p className='mt-2 text-sm text-gray-500'>
                    Choose an ingredient to begin.
                  </p>
                </div>
              )}
            </div>

            {!activeIngredient && (
              <Button onClick={() => setIsIngredientModalOpen(true)}>
                Choose Ingredient
              </Button>
            )}

            {activeIngredient && isMinigameComplete && (
              <Button onClick={handleIngredientFinished}>
                Finish Ingredient
              </Button>
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
