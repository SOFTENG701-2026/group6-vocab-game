import { Difficulty } from "./game-setup/game-setup-types";

export type MinigameId = "ingredient-match" | "letter-spelling";

export const minigamesByDifficulty: Record<Exclude<Difficulty, "easy">, MinigameId[]> = {
  medium: ["ingredient-match"],
  hard: ["ingredient-match", "letter-spelling"]
};
