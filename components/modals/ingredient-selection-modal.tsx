"use client";

import Image from "next/image";
import BaseSelectionModal, {
  SelectionModalItem
} from "@/components/modals/base-selection-modal";
import { ingredients } from "@/data/ingredients";

type IngredientModalProps = {
  isOpen: boolean;
  chosenIngredientIds: string[];
  onSelectIngredient: (ingredientId: string) => void;
};

export default function IngredientModal({
  isOpen,
  chosenIngredientIds,
  onSelectIngredient
}: IngredientModalProps) {
  const availableIngredients = ingredients.filter(
    (ingredient) => !chosenIngredientIds.includes(ingredient.id)
  );

  const visibleIngredients = availableIngredients.slice(0, 3);

  const ingredientItems: SelectionModalItem[] = visibleIngredients.map(
    (ingredient) => ({
      id: ingredient.id,
      title: ingredient.name,
      description: `A ${ingredient.color}, ${ingredient.shape} ingredient`,
      logo: (
        <Image
          src={ingredient.imageSrc}
          alt={ingredient.imageAlt}
          width={300}
          height={300}
          className='h-50 w-50 object-contain'
          draggable={false}
        />
      )
    })
  );

  return (
    <BaseSelectionModal
      isOpen={isOpen && ingredientItems.length > 0}
      title='Choose an Ingredient'
      titleId='ingredient-modal-title'
      items={ingredientItems}
      cardVariant='compact'
      buttonText='Select'
      onConfirm={onSelectIngredient}
    />
  );
}
