import { Difficulty } from "./game-setup/game-setup-types";

export type MinigameId = "easy-game" | "ingredient-match" | "letter-spelling";

export const minigamesByDifficulty: Record<Difficulty, MinigameId[]> = {
  easy: ["easy-game"],
  medium: ["ingredient-match"],
  hard: ["ingredient-match", "letter-spelling"],
};
