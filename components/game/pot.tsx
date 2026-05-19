"use client";

import { useGame } from "@/context/game-provider";

type PotProps = {
  soupColor?: string;
  cooking?: boolean;
  big?: boolean;
  rainbow?: boolean;
  className?: string;
};

export default function Pot({
  soupColor,
  cooking = false,
  big = false,
  rainbow = false,
  className = ""
}: PotProps) {
  const { getEquippedPotClass } = useGame();
  const potClass = getEquippedPotClass();

  return (
    <div className={`pot-wrap ${className}`}>
      <div className="steam" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div
        className={`pot ${potClass} ${big ? "big" : ""} ${cooking ? "cooking" : ""}`}
      >
        <div
          className={`soup ${rainbow ? "rainbow" : ""}`}
          style={soupColor && !rainbow ? { background: soupColor } : undefined}
        />
        <div className={`bubbles ${rainbow ? "sparkle" : ""}`} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
