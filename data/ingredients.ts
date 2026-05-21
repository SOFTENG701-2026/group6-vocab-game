export type Ingredient = {
  id: string;
  name: string;
  shape: string;
  color: string;
  imageSrc: string;
  imageAlt: string;
};

export const ingredients: Ingredient[] = [
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

export function getIngredientById(ingredientId: string) {
  return ingredients.find((ingredient) => ingredient.id === ingredientId);
}
