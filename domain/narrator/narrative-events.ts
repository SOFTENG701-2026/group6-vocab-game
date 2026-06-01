import type { MinigameId } from "@/domain/minigame-type";

export type NarrativeEvent =
  | { type: "GAME_STARTED" }
  | {
      type: "MINIGAME_STARTED";
      minigameId: MinigameId;
    }
  | {
      type: "MINIGAME_COMPLETED";
      minigameId: MinigameId;
    }
  | {
      type: "MINIGAMES_ALL_COMPLETED";
    }
  | {
      type: "LETTER_REPEAT_PROMPT_FINISHED";
      letter: string;
    }
  | {
      type: "SHOP_PAGE_VISITED";
    }
  | {
      type: "ACHIEVEMENTS_PAGE_VISITED";
    }
  | {
      type: "CORRECT_LETTER_CAUGHT";
      letter: string;
    }
  | {
      type: "WRONG_LETTER_CAUGHT";
      letter: string;
      expectedLetter: string;
    };
