import type { NarrativeEvent } from "./narrative-events";

export type NarrationStep =
  | {
      type: "asset-audio";
      text: string;
      audioSrc: string;
    }
  | {
      type: "tts";
      text: string;
    }
  | {
      type: "wait";
      durationMs: number;
    };

export type NarrationScript = {
  id: string;
  displayText: string; // The main text shown in the dialogue box for the whole script2
  blocking: boolean;
  steps: NarrationStep[];
  onFinishedEvent?: NarrativeEvent;
};

//TODO: add audio files for narration scripts see "// FILE MISSING"
export const narrationScripts = {
  gameStartedIntro: {
    id: "game-started-intro",
    displayText: "Welcome! Let's make magical soup together.",
    blocking: true,
    steps: [
      {
        type: "asset-audio",
        text: "Welcome! Let's make magical soup together.",
        audioSrc: "/audio/narrator/game-started-intro.mp3", // FILE MISSING
      },
    ],
  },

  minigameCompleted: {
    id: "minigame-completed",
    displayText: "Great job! You have completed this task.",
    blocking: true,
    steps: [
      {
        type: "asset-audio",
        text: "Great job! You have completed this task.",
        audioSrc: "/audio/narrator/minigame-completed.mp3", // FILE MISSING
      },
    ],
  },

  shopDiscoveredEarly: {
    id: "shop-discovered-early",
    displayText:
      "Oh! You found the shop already. Nice exploring! This is where you can use your gems to unlock fun rewards.",
    blocking: true,
    steps: [
      {
        type: "asset-audio",
        text: "Oh! You found the shop already. Nice exploring!",
        audioSrc: "/audio/narrator/shop-discovered-early.mp3", // FILE MISSING
      },
      {
        type: "asset-audio",
        text: "This is where you can use your gems to unlock fun rewards.",
        audioSrc: "/audio/narrator/shop-explanation.mp3", // FILE MISSING
      },
    ],
  },

  shopIntroAfterMinigames: {
    id: "shop-intro-after-minigames",
    displayText:
      "Great work finishing your tasks! Now let me show you the shop. You can use your gems here to unlock rewards.",
    blocking: true,
    steps: [
      {
        type: "asset-audio",
        text: "Great work finishing your tasks! Now let me show you the shop.",
        audioSrc: "/audio/narrator/shop-intro-after-minigames.mp3", // FILE MISSING
      },
      {
        type: "asset-audio",
        text: "You can use your gems here to unlock rewards.",
        audioSrc: "/audio/narrator/shop-explanation.mp3", // FILE MISSING
      },
    ],
  },

  achievementsDiscoveredEarly: {
    id: "achievements-discovered-early",
    displayText:
      "Oh! You found the achievements page by yourself! This page shows the special goals you have completed.",
    blocking: true,
    steps: [
      {
        type: "asset-audio",
        text: "Oh! You found the achievements page by yourself!",
        audioSrc: "/audio/narrator/achievements-discovered-early.mp3", // FILE MISSING
      },
      {
        type: "asset-audio",
        text: "This page shows the special goals you have completed.",
        audioSrc: "/audio/narrator/achievements-explanation.mp3", // FILE MISSING
      },
    ],
  },

  achievementsIntroAfterMinigames: {
    id: "achievements-intro-after-minigames",
    displayText: "You can also visit the achievements page. It shows the special goals you have unlocked.",
    blocking: true,
    steps: [
      {
        type: "asset-audio",
        text: "You can also visit the achievements page.",
        audioSrc: "/audio/narrator/achievements-intro-after-minigames.mp3", // FILE MISSING
      },
      {
        type: "asset-audio",
        text: "It shows the special goals you have unlocked.",
        audioSrc: "/audio/narrator/achievements-explanation.mp3", // FILE MISSING
      },
    ],
  },
} satisfies Record<string, NarrationScript>;

export function createCorrectLetterCaughtScript(letter: string): NarrationScript {
  const fileName = letter.toLowerCase();
  return {
    id: `correct-letter-caught-${fileName}`,
    displayText: `Great job! You caught the letter. Now you try! Can you say the letter ${letter}?`,
    blocking: true,
    steps: [
      {
        type: "asset-audio",
        text: "Great job! You caught the letter.",
        audioSrc: "/audio/narrator/generic-caught-letter-congratulate.mp3",
      },

      {
        type: "asset-audio",
        text: "Now you try.",
        audioSrc: "/audio/narrator/generic-now-you-try.mp3",
      },

      {
        type: "wait",
        durationMs: 500,
      },

      {
        type: "asset-audio",
        text: "Can you say the letter: " + letter,
        audioSrc: `/audio/narrator/prompt-say-letter/prompt-say-${fileName}.mp3`,
      },

      {
        type: "wait",
        durationMs: 1500,
      },
    ],
    onFinishedEvent: {
      type: "LETTER_REPEAT_PROMPT_FINISHED",
      letter,
    },
  };
}

export function createWrongLetterCaughtScript(letter: string, expectedLetter: string): NarrationScript {
  return {
    id: `wrong-letter-caught-${letter}-expected-${expectedLetter}`,
    blocking: true,
    steps: [
      {
        type: "asset-audio",
        text: "Almost! That was not the letter we needed.",
        audioSrc: "/audio/narrator/wrong-letter-caught.mp3",
      },
      {
        type: "asset-audio",
        text: "Listen carefully. We are looking for this letter.",
        audioSrc: "/audio/narrator/listen-carefully-letter.mp3",
      },
      {
        type: "asset-audio",
        text: expectedLetter,
        audioSrc: `/audio/narrator/prompt-say-letter/${expectedLetter.toLowerCase()}-sound.mp3`, // FILE MISSING
      },
    ],
  };
}
