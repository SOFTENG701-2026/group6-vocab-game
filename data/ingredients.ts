export type Ingredient = {
  id: string;
  name: string;
  shape: string;
  shapeId: string;
  color: string;
  colorId: string;
  imageSrc: string;
  imageAlt: string;
};

export const ingredients: Ingredient[] = [
  {
    id: "banana",
    name: "Banana",
    shape: "crescent-shaped",
    shapeId: "crescent",
    color: "yellow",
    colorId: "yellow",
    imageSrc: "/ingredients/banana.png",
    imageAlt: "A yellow crescent-shaped banana"
  },
  {
    id: "apple",
    name: "Apple",
    shape: "circular",
    shapeId: "circle",
    color: "red",
    colorId: "red",
    imageSrc: "/ingredients/apple.png",
    imageAlt: "A red circular apple"
  },
  {
    id: "strawberry",
    name: "Strawberry",
    shape: "heart-shaped",
    shapeId: "heart",
    color: "red",
    colorId: "red",
    imageSrc: "/ingredients/strawberry.png",
    imageAlt: "A red heart-shaped strawberry"
  },
  {
    id: "carrot",
    name: "Carrot",
    shape: "cone-shaped",
    shapeId: "cone",
    color: "orange",
    colorId: "orange",
    imageSrc: "/ingredients/carrot.png",
    imageAlt: "An orange cone-shaped carrot"
  },
  {
    id: "watermelon",
    name: "Watermelon",
    shape: "triangular",
    shapeId: "triangle",
    color: "red",
    colorId: "red",
    imageSrc: "/ingredients/watermelon-slice.png",
    imageAlt: "A red triangular watermelon slice"
  }
];

export function getIngredientById(ingredientId: string) {
  return ingredients.find((ingredient) => ingredient.id === ingredientId);
}
