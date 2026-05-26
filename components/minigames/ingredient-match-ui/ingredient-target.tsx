import Image from "next/image";
import Button from "@/components/button";
import type { Ingredient } from "@/data/ingredients";
import FeedbackMessage from "./feedback-match";

type IngredientTargetProps = {
  ingredient: Ingredient;
  feedbackMessage: string;
  isColorMatched: boolean;
  isShapeMatched: boolean;
  onClick: () => void;
  ingredientRef: React.RefObject<HTMLButtonElement | null>;
};

export default function IngredientTarget({
  ingredient,
  feedbackMessage,
  isColorMatched,
  isShapeMatched,
  onClick,
  ingredientRef,
}: IngredientTargetProps) {
  return (
    <div>
      <div className='flex flex-col items-center gap-4'>
        <Button ref={ingredientRef} variant='ingredientTarget' onClick={onClick} className='relative overflow-hidden'>
          <Image
            src={ingredient.imageSrc}
            alt={ingredient.imageAlt}
            width={150}
            height={150}
            className='relative z-10 h-36 w-36 object-contain'
            draggable={isColorMatched && isShapeMatched}
            onDragStart={(e) => {
              if (!(isColorMatched && isShapeMatched)) return;
              e.dataTransfer.setData("text/plain", ingredient.id);
            }}
          />

          {/* Left half border: colour matched */}
          <span
            aria-hidden='true'
            className={`
            pointer-events-none absolute inset-0 w-1/2
            rounded-l-4xl
            border-y-4 border-l-4 border-green-500
            transition-opacity duration-300 ease-out
            ${isColorMatched ? "opacity-100" : "opacity-0"}
          `}
          />

          {/* Right half border: shape matched */}
          <span
            aria-hidden='true'
            className={`
            pointer-events-none absolute inset-y-0 right-0  w-1/2
            rounded-r-4xl
            border-y-4 border-r-4 border-green-500
            transition-opacity duration-300 ease-out
            ${isShapeMatched ? "opacity-100" : "opacity-0"}
          `}
          />
        </Button>

        <FeedbackMessage message={feedbackMessage} />
      </div>
    </div>
  );
}
