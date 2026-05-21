export type GameThemeId = "transport" | "garden" | "fruits-vegetables";

export type GameTheme = {
  id: GameThemeId;
  label: string;
  description: string;
  image: string;
  available: boolean;
};

export const gameThemes: GameTheme[] = [
  {
    id: "transport",
    label: "Transport",
    description: "Choose the vehicle, and start the journey!",
    image: "/assets/transport/transport.svg",
    available: false
  },
  {
    id: "garden",
    label: "Garden",
    description: "Grow the plants, and watch them grow!",
    image: "/assets/garden/garden.png",
    available: false
  },
  {
    id: "fruits-vegetables",
    label: "Fruits & Vegetables",
    description: "Add the ingredient, and make a magic soup!",
    image: "/assets/ingredients/ingredients.png",
    available: true
  }
];

export function getThemeById(id: GameThemeId): GameTheme | undefined {
  return gameThemes.find((theme) => theme.id === id);
}
