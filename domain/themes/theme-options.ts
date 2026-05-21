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
    description: "Buses, trains, and more",
    image: "/assets/transport/transport.svg",
    available: false
  },
  {
    id: "garden",
    label: "Garden",
    description: "Flowers, plants, and nature",
    image: "/assets/garden/garden.png",
    available: false
  },
  {
    id: "fruits-vegetables",
    label: "Fruits & Vegetables",
    description: "Fruits, vegetables",
    image: "/assets/ingredients/ingredients.png",
    available: true
  }
];

export function getThemeById(id: GameThemeId): GameTheme | undefined {
  return gameThemes.find((theme) => theme.id === id);
}
