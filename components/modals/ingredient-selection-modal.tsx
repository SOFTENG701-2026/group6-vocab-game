"use client";

import Image from "next/image";
import BaseSelectionModal, {
  SelectionModalItem
} from "@/components/modals/base-selection-modal";

export type Ingredient = {
  id: string;
  name: string;
  shape: string;
  color: string;
  imageSrc: string;
  imageAlt: string;
};

type IngredientModalProps = {
  isOpen: boolean;
  chosenIngredientIds: string[];
  onSelectIngredient: (ingredientId: string) => void;
};

const ingredients: Ingredient[] = [
  {
    id: "banana",
    name: "Banana",
    shape: "crescent-shaped",
    color: "yellow",
    imageSrc: "/ingredients/banana.png",
    imageAlt: "A yellow crescent-shaped banana"
  },
  {
    id: "apple",
    name: "Apple",
    shape: "circular",
    color: "red",
    imageSrc: "/ingredients/apple.png",
    imageAlt: "A red circular apple"
  },
  {
    id: "strawberry",
    name: "Strawberry",
    shape: "heart-shaped",
    color: "red",
    imageSrc: "/ingredients/strawberry.png",
    imageAlt: "A red heart-shaped strawberry"
  },
  {
    id: "carrot",
    name: "Carrot",
    shape: "cone-shaped",
    color: "orange",
    imageSrc: "/ingredients/carrot.png",
    imageAlt: "An orange cone-shaped carrot"
  },
  {
    id: "watermelon",
    name: "Watermelon",
    shape: "triangular",
    color: "red",
    imageSrc: "/ingredients/watermelon-slice.png",
    imageAlt: "A red triangular watermelon slice"
  }
];

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
      description: ` A ${ingredient.color} ${ingredient.shape} ingredient`,
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

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
