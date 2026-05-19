"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/context/game-provider";

export default function Navbar() {
  const pathname = usePathname();
  const { profile, selectedAvatars, mode, openUtilityScreen } = useGame();

  const hideOnGameFlow =
    pathname === "/game" || pathname === "/recall" || pathname === "/select";

  if (hideOnGameFlow) return null;

  return (
    <header className="top-bar" aria-label="Game navigation">
      <Link className="brand" href="/" aria-label="Magic Soup Buddies home">
        🪄 Magic Soup Buddies
      </Link>
      <div className="top-actions">
        <button className="round-icon" type="button" aria-label="Add student">
          +
        </button>
        <span className="avatar-chip">{selectedAvatars.A?.emoji || "👦"}</span>
        <span className="avatar-chip">
          {selectedAvatars.B?.emoji || (mode === "solo" ? "🤖" : "👧")}
        </span>
        <button
          type="button"
          className="nav-pill"
          onClick={() => openUtilityScreen("/achievements")}
        >
          ★ Achievements
        </button>
        <button
          type="button"
          className="nav-pill"
          onClick={() => openUtilityScreen("/shop")}
        >
          🛒 Shop
        </button>
        <span className="gem-pill">🟡 {profile.points} points</span>
      </div>
    </header>
  );
}
