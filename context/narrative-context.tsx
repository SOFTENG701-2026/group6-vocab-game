"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, useRef, type ReactNode } from "react";
import {
  addMilestones,
  initialNarrativeProgress,
  type NarrativeProgress,
} from "@/domain/narrator/narrative-milestones";
import { findNarrativeRule } from "@/domain/narrator/narrative-rules";
import type { NarrativeEvent } from "@/domain/narrator/narrative-events";
import type { NarrationScript, NarrationStep } from "@/domain/narrator/narrative-scripts";

type NarrativeState = {
  progress: NarrativeProgress;
  currentScript: NarrationScript | null;
  currentStep: NarrationStep | null;
  isPlaying: boolean;
};

type NarrativeAction =
  | {
      type: "SET_PROGRESS";
      progress: NarrativeProgress;
    }
  | {
      type: "START_SCRIPT";
      script: NarrationScript;
    }
  | {
      type: "START_STEP";
      step: NarrationStep;
    }
  | {
      type: "FINISH_SCRIPT";
    };

const initialState: NarrativeState = {
  progress: initialNarrativeProgress,
  currentScript: null,
  currentStep: null,
  isPlaying: false,
};

function narrativeReducer(state: NarrativeState, action: NarrativeAction): NarrativeState {
  switch (action.type) {
    case "SET_PROGRESS":
      return {
        ...state,
        progress: action.progress,
      };

    case "START_SCRIPT":
      return {
        ...state,
        currentScript: action.script,
        currentStep: action.script.steps[0] ?? null,
        isPlaying: true,
      };

    case "START_STEP":
      return {
        ...state,
        currentStep: action.step,
      };

    case "FINISH_SCRIPT":
      return {
        ...state,
        currentScript: null,
        currentStep: null,
        isPlaying: false,
      };

    default:
      return state;
  }
}

type NarrativeContextValue = {
  progress: NarrativeProgress;
  currentScript: NarrationScript | null;
  currentStep: NarrationStep | null;
  isPlaying: boolean;
  shouldBlockInteraction: boolean;
  dispatchNarrativeEvent: (event: NarrativeEvent) => void;
  skipCurrentNarration: () => void;
};

const NarrativeContext = createContext<NarrativeContextValue | null>(null);

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

function playAudio(src: string) {
  return new Promise<void>((resolve) => {
    const audio = new Audio(src);

    audio.onended = () => resolve();

    audio.onerror = () => {
      console.warn(`Audio failed to load: ${src}`);
      resolve();
    };

    audio.play().catch(() => {
      resolve();
    });
  });
}

/**
 * TODO:
 * Replace this with real TTS provider endpoint.
 *
 * Expected response:
 * - audio blob, such as audio/mpeg
 *
 * Example backend route:
 * POST /api/tts
 * body: { text: "A" }
 */
// async function playTtsAudio(text: string) {
//   try {
//     const response = await fetch("/api/tts", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ text }),
//     });

//     if (!response.ok) {
//       console.warn("TTS request failed.");
//       await wait(700);
//       return;
//     }

//     const audioBlob = await response.blob();
//     const audioUrl = URL.createObjectURL(audioBlob);

//     await playAudio(audioUrl);

//     URL.revokeObjectURL(audioUrl);
//   } catch {
//     console.warn("TTS request failed.");
//     await wait(700);
//   }
// }

export function NarrativeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(narrativeReducer, initialState);

  const progressRef = useRef(state.progress);
  const isPlayingRef = useRef(false);
  const queueRef = useRef<NarrationScript[]>([]);
  const runIdRef = useRef(0);

  const finishScript = useCallback(() => {
    dispatch({ type: "FINISH_SCRIPT" });
    isPlayingRef.current = false;
  }, []);

  const runNextQueuedScript = useCallback(() => {
    const nextScript = queueRef.current.shift();

    if (!nextScript) return;

    void runScript(nextScript);
  }, []);

  async function runScript(script: NarrationScript) {
    const runId = crypto.randomUUID();
    runIdRef.current += 1;

    const currentRunNumber = runIdRef.current;

    isPlayingRef.current = true;
    dispatch({ type: "START_SCRIPT", script });

    for (const step of script.steps) {
      if (currentRunNumber !== runIdRef.current) {
        return;
      }

      dispatch({ type: "START_STEP", step });

      if (step.type === "asset-audio") {
        await playAudio(step.audioSrc);
      }

      //   if (step.type === "tts") {
      //     await playTtsAudio(step.text);
      //   }
      

      if (step.type === "wait") {
        await wait(step.durationMs);
      }
    }

    if (currentRunNumber !== runIdRef.current) {
      return;
    }

    finishScript();

    if (script.onFinishedEvent) {
      dispatchNarrativeEvent(script.onFinishedEvent);
      return;
    }

    runNextQueuedScript();

    void runId;
  }

  const dispatchNarrativeEvent = useCallback((event: NarrativeEvent) => {
    const currentProgress = progressRef.current;
    const rule = findNarrativeRule(event, currentProgress);

    if (!rule) return;

    const script = rule.getScript(event, currentProgress);

    if (!script) return;

    if (rule.markCompleted) {
      const nextProgress = addMilestones(currentProgress, rule.markCompleted);
      progressRef.current = nextProgress;
      dispatch({ type: "SET_PROGRESS", progress: nextProgress });
    }

    if (isPlayingRef.current) {
      queueRef.current.push(script);
      return;
    }

    void runScript(script);
  }, []);

  const skipCurrentNarration = useCallback(() => {
    runIdRef.current += 1;
    queueRef.current = [];
    finishScript();
  }, [finishScript]);

  const value = useMemo<NarrativeContextValue>(
    () => ({
      progress: state.progress,
      currentScript: state.currentScript,
      currentStep: state.currentStep,
      isPlaying: state.isPlaying,
      shouldBlockInteraction: state.isPlaying && state.currentScript?.blocking === true,
      dispatchNarrativeEvent,
      skipCurrentNarration,
    }),
    [
      state.progress,
      state.currentScript,
      state.currentStep,
      state.isPlaying,
      dispatchNarrativeEvent,
      skipCurrentNarration,
    ],
  );

  return <NarrativeContext.Provider value={value}>{children}</NarrativeContext.Provider>;
}

export function useNarrative() {
  const context = useContext(NarrativeContext);

  if (!context) {
    throw new Error("useNarrative must be used inside NarrativeProvider");
  }

  return context;
}
