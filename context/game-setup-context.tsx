"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Difficulty } from "@/domain/game-setup/game-setup-types";

type GameSetupContextValue = {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
};

const GameSetupContext = createContext<GameSetupContextValue | null>(null);

type GameSetupProviderProps = {
  children: ReactNode;
};

export function GameSetupProvider({ children }: GameSetupProviderProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  return (
    <GameSetupContext.Provider value={{ difficulty, setDifficulty }}>
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
