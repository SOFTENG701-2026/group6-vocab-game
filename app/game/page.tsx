"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/button";
import MinigameFallback from "@/components/minigames/minigame-fallback-ui";
import IngredientMatchMinigame from "@/components/minigames/ingredient-match-minigame";
import { ingredients } from "@/data/ingredients";
import { minigamesByDifficulty, type MinigameId } from "@/domain/minigame-type";
import { useGameSetup } from "@/context/game-setup-context";
import FutureIngredientStack from "@/components/game/future-ingredient-stack";
import BlockSpellingMinigame from "@/components/minigames/block-spelling-minigame";
import IngredientPotDropArea from "@/components/game/shared-pot-drop-area";
import IngredientMatchPreviewModal from "@/components/modals/previews/ingredient-match-preview-modal";
import BlockSpellingPreviewModal from "@/components/modals/previews/block-spelling-preview-modal";
import MinigamePreviewFrame from "@/components/game/layout-minigame-preview";

export default function GamePage() {
  const [activeIngredientIndex, setActiveIngredientIndex] = useState(0);
  const activeIngredient = ingredients[activeIngredientIndex] ?? null;
  const futureIngredients = ingredients.slice(activeIngredientIndex + 1);
  const [activeMinigameIndex, setActiveMinigameIndex] = useState(0);
  const [isShowingCompletion, setIsShowingCompletion] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  //derived state
  const { difficulty } = useGameSetup();
  const isIngredientListEmpty = activeIngredientIndex === ingredients.length;
  const activeMinigames = minigamesByDifficulty[difficulty];
  const activeMinigameId = activeMinigames[activeMinigameIndex];
  const isLastMinigame = activeMinigameIndex === activeMinigames.length - 1;
  const canDropIngredientToPot = isShowingCompletion && isLastMinigame && activeIngredient !== null;

  function handleMinigameComplete() {
    if (isShowingCompletion) return;

    if (!isLastMinigame) {
      setActiveMinigameIndex((prev) => prev + 1);
      return;
    }

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

            <p className='mt-3 text-lg font-bold text-gray-700'>You&apos;ve run out of ingredients.</p>
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

      case "letter-spelling":
        return (
          <BlockSpellingMinigame
            key={`${activeIngredient.id}-${activeMinigameIndex}`}
            ingredient={activeIngredient}
            onComplete={handleMinigameComplete}
          />
        );
    }
  }

  function renderActivePreviewModal(minigameId: MinigameId) {
    if (!activeIngredient) return null;

    switch (minigameId) {
      case "ingredient-match":
        return (
          <IngredientMatchPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            ingredient={activeIngredient}
          />
        );

      case "letter-spelling":
        return (
          <BlockSpellingPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            ingredient={activeIngredient}
          />
        );

      case "easy-game":
        return null;

      default:
        return null;
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
          <section className='h-full flex flex-col gap-3 overflow-hidden'>
            <MinigamePreviewFrame
              onPreviewClick={() => setIsPreviewOpen(true)}
              resetKey={`$activeIngredient?.id}-${activeMinigameId}`}
            >
              {activeIngredient ? renderActiveMinigame(activeMinigameId) : <MinigameFallback />}
            </MinigamePreviewFrame>
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
                {difficulty === "hard" ? "Hard Mode" : difficulty === "medium" ? "Medium Mode" : "Easy Mode"} ·
                Minigame {activeMinigameIndex + 1} of {activeMinigames.length}
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
            <IngredientPotDropArea
              canDrop={canDropIngredientToPot}
              onDropToPot={() => {
                setIsShowingCompletion(false);
                skipCurrentIngredient();
              }}
            />
            <Button onClick={skipCurrentIngredient} disabled={isIngredientListEmpty}>
              Skip Ingredient
            </Button>
          </aside>
        </section>
      </div>
      {renderActivePreviewModal(activeMinigameId)}
    </main>
  );
}
