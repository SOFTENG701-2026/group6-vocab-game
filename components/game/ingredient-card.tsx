import type { Ingredient } from "@/lib/game/types";

type IngredientCardProps = {
  item: Ingredient;
  onClick?: () => void;
};

export default function IngredientCard({ item, onClick }: IngredientCardProps) {
  return (
    <button
      type="button"
      className="ingredient-card"
      aria-label={item.name}
      onClick={onClick}
    >
      <span className="ingredient-emoji">{item.emoji}</span>
      <span>
        <strong>{item.name}</strong>
        <span className="spell">{item.spell}</span>
      </span>
    </button>
  );
}
