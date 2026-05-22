"use client";

import { Ingredient } from "@/data/ingredients";
import ArrowLayer from "./ingredient-match-ui/arrow-layer";
import IngredientTarget from "./ingredient-match-ui/ingredient-target";
import MatchOptionColumn from "./ingredient-match-ui/match-option-column";
import { useIngredientMatchGame } from "./use-ingredient-match-game";

type IngredientMatchMinigameProps = {
  ingredient: Ingredient;
  onComplete?: () => void;
  onDropToPot?: () => void;
};

export default function IngredientMatchMinigame({ ingredient, onComplete, onDropToPot }: IngredientMatchMinigameProps) {
  const {
    containerRef,
    ingredientRef,
    completedArrows,
    pendingSelection,
    matchedColorId,
    matchedShapeId,
    isColorMatched,
    isShapeMatched,
    visibleColorOptions,
    visibleShapeOptions,
    feedbackMessage,
    handleOptionClick,
    handleIngredientClick,
  } = useIngredientMatchGame({ ingredient, onComplete });

  return (
    <div
      ref={containerRef}
      className='
        relative h-full min-h-105 w-full overflow-hidden
        rounded-4xl bg-emerald-400/50 p-8 text-black
      '
    >
      <ArrowLayer arrows={completedArrows} />

      <div className='relative z-10 flex h-full min-h-105 items-center justify-between gap-8'>
        <MatchOptionColumn
          type='color'
          options={visibleColorOptions}
          pendingSelection={pendingSelection}
          matchedOptionId={matchedColorId}
          isTypeMatched={isColorMatched}
          onOptionClick={handleOptionClick}
        />

        <IngredientTarget
          ingredient={ingredient}
          ingredientRef={ingredientRef}
          feedbackMessage={feedbackMessage}
          isColorMatched={isColorMatched}
          isShapeMatched={isShapeMatched}
          onClick={handleIngredientClick}
          onDropToPot={onDropToPot}
        />

        <MatchOptionColumn
          type='shape'
          options={visibleShapeOptions}
          pendingSelection={pendingSelection}
          matchedOptionId={matchedShapeId}
          isTypeMatched={isShapeMatched}
          onOptionClick={handleOptionClick}
        />
      </div>
    </div>
  );
}
