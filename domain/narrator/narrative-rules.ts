import type { NarrativeEvent } from "./narrative-events";
import type { NarrativeMilestone, NarrativeProgress } from "./narrative-milestones";
import { hasMilestone } from "./narrative-milestones";
import { NarrativePresentation } from "./narrative-presentation";
import {
  createCorrectLetterCaughtScript,
  createWrongLetterCaughtScript,
  narrationScripts,
  type NarrationScript,
} from "./narrative-scripts";

export type NarrativeRule = {
  id: string;
  when: (event: NarrativeEvent, progress: NarrativeProgress) => boolean;

  // Controls what is said / played.
  getScript: (event: NarrativeEvent, progress: NarrativeProgress) => NarrationScript | null;

  // Controls how it appears visually.
  getPresentation?: (event: NarrativeEvent, progress: NarrativeProgress) => NarrativePresentation;

  markCompleted?: NarrativeMilestone[];
};

export const narrativeRules: NarrativeRule[] = [
  {
    id: "game-started-intro",
    when: (event, progress) => event.type === "GAME_STARTED" && !hasMilestone(progress, "game_started_intro_seen"),

    getScript: () => narrationScripts.gameStartedIntro,

    markCompleted: ["game_started_intro_seen"],

    getPresentation: () => ({ type: "hidden" }),
  },

  {
    id: "minigame-completed",
    when: (event) => event.type === "MINIGAME_COMPLETED",

    getScript: () => narrationScripts.minigameCompleted,
  },

  {
    id: "correct-letter-caught",
    when: (event) => event.type === "CORRECT_LETTER_CAUGHT",

    getScript: (event) => {
      if (event.type !== "CORRECT_LETTER_CAUGHT") return null;

      return createCorrectLetterCaughtScript(event.letter);
    },

    getPresentation: (event) => {
      if (event.type !== "CORRECT_LETTER_CAUGHT") return { type: "dialogue" };

      return {
        type: "caught-letter-dialogue",
        letter: event.letter,
      };
    },
  },

  {
    id: "wrong-letter-caught",
    when: (event) => event.type === "WRONG_LETTER_CAUGHT",

    getScript: (event) => {
      if (event.type !== "WRONG_LETTER_CAUGHT") return null;

      return createWrongLetterCaughtScript(event.letter, event.expectedLetter);
    },
  },

  {
    id: "shop-discovered-early",
    when: (event, progress) =>
      event.type === "SHOP_PAGE_VISITED" &&
      !hasMilestone(progress, "all_minigames_completed") &&
      !hasMilestone(progress, "shop_intro_seen"),

    getScript: () => narrationScripts.shopDiscoveredEarly,

    markCompleted: ["shop_intro_seen", "shop_discovered_early"],
  },

  {
    id: "shop-intro-after-minigames",
    when: (event, progress) => event.type === "MINIGAMES_ALL_COMPLETED" && !hasMilestone(progress, "shop_intro_seen"),

    getScript: () => narrationScripts.shopIntroAfterMinigames,

    markCompleted: ["shop_intro_seen", "all_minigames_completed"],
  },

  {
    id: "achievements-discovered-early",
    when: (event, progress) =>
      event.type === "ACHIEVEMENTS_PAGE_VISITED" &&
      !hasMilestone(progress, "all_minigames_completed") &&
      !hasMilestone(progress, "achievements_intro_seen"),

    getScript: () => narrationScripts.achievementsDiscoveredEarly,

    markCompleted: ["achievements_intro_seen", "achievements_discovered_early"],
  },

  {
    id: "achievements-intro-after-minigames",
    when: (event, progress) =>
      event.type === "MINIGAMES_ALL_COMPLETED" && !hasMilestone(progress, "achievements_intro_seen"),

    getScript: () => narrationScripts.achievementsIntroAfterMinigames,

    markCompleted: ["achievements_intro_seen", "all_minigames_completed"],
  },
];

export function findNarrativeRule(event: NarrativeEvent, progress: NarrativeProgress) {
  return narrativeRules.find((rule) => rule.when(event, progress)) ?? null;
}
