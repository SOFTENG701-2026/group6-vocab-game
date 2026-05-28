"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type PauseReason = "narrator" | "preview" | "modal" | "transition";

type GamePauseContextValue = {
  isGamePaused: boolean;
  pauseReasons: PauseReason[];
  pauseGame: (reason: PauseReason) => void;
  resumeGame: (reason: PauseReason) => void;
};

const GamePauseContext = createContext<GamePauseContextValue | null>(null);

export function GamePauseProvider({ children }: { children: ReactNode }) {
  const [pauseReasons, setPauseReasons] = useState<PauseReason[]>([]);

  const pauseGame = useCallback((reason: PauseReason) => {
    setPauseReasons((currentReasons) => {
      if (currentReasons.includes(reason)) return currentReasons;

      return [...currentReasons, reason];
    });
  }, []);

  const resumeGame = useCallback((reason: PauseReason) => {
    setPauseReasons((currentReasons) => currentReasons.filter((currentReason) => currentReason !== reason));
  }, []);

  const value = useMemo<GamePauseContextValue>(
    () => ({
      isGamePaused: pauseReasons.length > 0,
      pauseReasons,
      pauseGame,
      resumeGame,
    }),
    [pauseReasons, pauseGame, resumeGame],
  );

  return <GamePauseContext.Provider value={value}>{children}</GamePauseContext.Provider>;
}

export function useGamePause() {
  const context = useContext(GamePauseContext);

  if (!context) {
    throw new Error("useGamePause must be used inside GamePauseProvider");
  }

  return context;
}
