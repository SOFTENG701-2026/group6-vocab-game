"use client";

import { GameProvider } from "@/context/game-provider";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}
