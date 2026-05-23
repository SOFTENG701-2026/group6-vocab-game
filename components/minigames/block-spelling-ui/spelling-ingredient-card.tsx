import Image from "next/image";
import type { Ingredient } from "@/data/ingredients";

type SpellingIngredientCardProps = {
  ingredient: Ingredient;
  isComplete: boolean;
};

export default function SpellingIngredientCard({ ingredient, isComplete }: SpellingIngredientCardProps) {
  return (
    <div className='flex flex-col items-center'>
      <h2 className='text-2xl font-extrabold text-(--color-primary-hover)'>Spell the ingredient</h2>

      <div
        className={`
          mt-4 rounded-3xl bg-white p-4 shadow
          ${isComplete ? "cursor-grab" : "cursor-not-allowed opacity-70"}
        `}
        draggable={isComplete}
        onDragStart={(event) => {
          if (!isComplete) {
            event.preventDefault();
            return;
          }

          event.dataTransfer.setData("text/plain", ingredient.id);
          event.dataTransfer.effectAllowed = "move";
        }}
      >
        <Image
          src={ingredient.imageSrc}
          alt={ingredient.imageAlt}
          width={150}
          height={150}
          className='h-32 w-32 object-contain'
          draggable={false}
        />
      </div>

      <p className='mt-3 text-xl font-extrabold text-gray-700'>{ingredient.name}</p>
    </div>
  );
}
