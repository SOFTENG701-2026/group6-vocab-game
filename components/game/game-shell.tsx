import type { ReactNode } from "react";

export default function GameShell({ children }: { children: ReactNode }) {
  return <main className="game-shell">{children}</main>;
}
