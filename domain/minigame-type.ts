import { Difficulty } from "./game-setup/game-setup-types";

export type MinigameId = "ingredient-match" | "letter-spelling";

export const minigamesByDifficulty: Record<Difficulty, MinigameId[]> = {
  easy: ["ingredient-match"],
  hard: ["ingredient-match", "letter-spelling"]
};
