import { distractorColors } from "@/lib/data/ingredient-bank";
import type { Ingredient } from "@/lib/game/types";
import { shuffle } from "@/lib/game/utils";

export function getThreeOptions(
  target: Ingredient,
  ingredients: Ingredient[],
  round: number
): Ingredient[] {
  const others = ingredients.filter((item) => item.id !== target.id);
  const rotated = others.slice(round).concat(others.slice(0, round));
  return shuffle([target, ...rotated.slice(0, 2)], round);
}

export function getColorOptions(
  target: Ingredient,
  round: number
): { name: string; value: string }[] {
  const others = distractorColors.filter(([name]) => name !== target.color);
  const rotated = others.slice(round).concat(others.slice(0, round));
  return shuffle(
    [
      { name: target.color, value: target.colorValue },
      ...rotated.slice(0, 2).map(([name, value]) => ({ name, value }))
    ],
    round
  );
}
