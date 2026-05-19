"use client";

import { useGame } from "@/context/game-provider";

type MonsterProps = {
  line: string;
  className?: string;
};

export default function Monster({ line, className = "" }: MonsterProps) {
  const { getEquippedMonsterClass } = useGame();
  const skinClass = getEquippedMonsterClass();

  return (
    <aside className={`teacher-card ${className}`} aria-label="Monster teacher">
      <div className={`monster fixed-monster ${skinClass}`}>
        <span className="horn left" />
        <span className="horn right" />
        <span className="eye eye-left" />
        <span className="eye eye-right" />
      </div>
      <div className="speech-bubble">
        <p>{line}</p>
      </div>
    </aside>
  );
}
