"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Difficulty, PlayMode } from "@/domain/game-setup/game-setup-types";

type GameSetupContextValue = {
  difficulty: Difficulty;
  playMode: PlayMode;
  setDifficulty: (difficulty: Difficulty) => void;
  setMode: (playMode: PlayMode) => void;
};

const GameSetupContext = createContext<GameSetupContextValue | null>(null);

type GameSetupProviderProps = {
  children: ReactNode;
};

export function GameSetupProvider({ children }: Readonly<GameSetupProviderProps>) {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [playMode, setPlayMode] = useState<PlayMode>("single");
  const value = useMemo(() => ({ difficulty, playMode, setDifficulty, setMode: setPlayMode }), [difficulty, playMode]);

  return (
    <GameSetupContext.Provider value={value}>
      {children}
    </GameSetupContext.Provider>
  );
}

export function useGameSetup() {
  const context = useContext(GameSetupContext);

  if (!context) {
    throw new Error("useGameSetup must be used inside GameSetupProvider");
  }

  return context;
}
