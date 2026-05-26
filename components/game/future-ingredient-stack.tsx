import Image from "next/image";
import type { Ingredient } from "@/data/ingredients";

type FutureIngredientStackProps = {
  ingredients: Ingredient[];
  maxVisible?: number;
};

export default function FutureIngredientStack({ ingredients, maxVisible = 4 }: FutureIngredientStackProps) {
  const visibleIngredients = ingredients.slice(0, maxVisible);

  if (visibleIngredients.length === 0) return null;

  //This assumes that the data always has the shape in the first part. This breaks if it has small-heart-shaped, which it shouldn't.
  function getSimpleShapeName(shape: string): string {
    return shape.split("-")[0];
  }
  return (
    <div className='mt-5 flex w-full flex-col items-center'>
      <p className='mb-2 text-xs font-extrabold uppercase tracking-wide text-gray-400'>Coming next</p>

      <div className='relative flex flex-col max-h-44 w-full  gap-y-1 items-center overflow-hidden'>
        {visibleIngredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className='
              flex w-[90%] items-center gap-2 rounded-2xl
              border border-orange-100 bg-orange-50 px-3 py-2 shadow-sm
              transition-all duration-300
            '
          >
            <Image
              src={ingredient.imageSrc}
              alt={ingredient.imageAlt}
              width={48}
              height={48}
              className='h-10 w-10 object-contain'
              draggable={false}
            />

            <div className='min-w-0 text-left'>
              <p className='truncate text-sm font-extrabold text-gray-700'>{ingredient.name}</p>

              <p className='truncate text-xs font-bold text-gray-400'>
                {ingredient.color} · {getSimpleShapeName(ingredient.shape)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
