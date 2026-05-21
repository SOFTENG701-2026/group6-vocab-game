import Image from "next/image";
import Button from "@/components/button";
import type { Ingredient } from "@/data/ingredients";
import FeedbackMessage from "./feedback-match";

type IngredientTargetProps = {
  ingredient: Ingredient;
  feedbackMessage: string;
  onClick: () => void;
  ingredientRef: React.RefObject<HTMLButtonElement | null>;
};

export default function IngredientTarget({
  ingredient,
  feedbackMessage,
  onClick,
  ingredientRef
}: IngredientTargetProps) {
  return (
    <div className='flex flex-col items-center gap-4'>
      <Button ref={ingredientRef} variant='ingredientTarget' onClick={onClick}>
        <Image
          src={ingredient.imageSrc}
          alt={ingredient.imageAlt}
          width={150}
          height={150}
          className='h-36 w-36 object-contain'
          draggable={false}
        />
      </Button>

      <FeedbackMessage message={feedbackMessage} />
    </div>
  );
}
