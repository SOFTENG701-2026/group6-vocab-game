"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import IngredientModal from "@/components/modals/ingredient-selection-modal";
import Button from "@/components/button";
import MinigameFallback from "@/components/minigames/minigame-fallback-ui";
import { ingredients } from "@/data/ingredients";

export default function GamePage() {
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [chosenIngredientIds, setChosenIngredientIds] = useState<string[]>([]);
  const [activeIngredientId, setActiveIngredientId] = useState<string | null>(
    null
  );

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
    setIsIngredientModalOpen(false);
  }

  function handleIngredientFinished(): void {
    /**TODO: currently a dummy implementation
     * It should
     * 1) only activate the button when the minigame is finished
     * 2) prevent the opening of modal when there is no more ingredients
     */
    throw new Error("Function not implemented.");
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
              <MinigameArea activeIngredientId={activeIngredient.id} />
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

            {activeIngredient && (
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

type MinigameAreaProps = {
  activeIngredientId: string;
};

function MinigameArea({ activeIngredientId }: MinigameAreaProps) {
  return (
    <div
      className='
        flex h-full min-h-105 w-full items-center justify-center
        rounded-4xl bg-sky-200/50 p-8 text-center
      '
    >
      <div>
        <h2 className='text-2xl font-extrabold text-white'>Minigame Area</h2>
        <p className='mt-2 text-white/70'>
          Current ingredient: {activeIngredientId}
        </p>
      </div>
    </div>
  );
}
