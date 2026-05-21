"use client";

import { useState } from "react";
import IngredientModal from "@/components/modals/ingredient-selection-modal";
import Button from "@/components/button";

export default function GamePage() {
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [chosenIngredientIds, setChosenIngredientIds] = useState<string[]>([]);

  function handleSelectIngredient(ingredientId: string) {
    setChosenIngredientIds((previousIds) => [...previousIds, ingredientId]);
    setIsIngredientModalOpen(false);

    // continue your game logic here
    // for example: setCurrentIngredient(ingredientId)
  }

  return (
    <main>
      <Button onClick={() => setIsIngredientModalOpen(true)}>
        Choose Ingredient
      </Button>

      <IngredientModal
        isOpen={isIngredientModalOpen}
        chosenIngredientIds={chosenIngredientIds}
        onSelectIngredient={handleSelectIngredient}
      />
    </main>
  );
}
