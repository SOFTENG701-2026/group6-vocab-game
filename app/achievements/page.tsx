"use client";

import GameShell from "@/components/game/game-shell";
import { achievements } from "@/lib/data/achievements";
import { useGame } from "@/context/game-provider";

export default function AchievementsPage() {
  const { profile, closeUtilityScreen, pausedReturnPath, currentTitle } = useGame();

  return (
    <GameShell>
      <section className="reward-screen" aria-labelledby="achievementsTitle">
        <button
          type="button"
          className="screen-exit"
          onClick={closeUtilityScreen}
          aria-label="Back"
        >
          {pausedReturnPath ? "← Back to Game" : "← Home"}
        </button>
        <h1 id="achievementsTitle">Achievements</h1>
        <p className="reward-summary">
          {profile.completions} soups finished. {profile.points} points saved.
          Current title: {currentTitle()}.
        </p>
        <div className="badge-grid">
          {achievements.map((badge) => {
            const currentValue = profile[badge.metric] || 0;
            const unlocked = currentValue >= badge.need;
            const unit = badge.metric === "completions" ? "soups" : "points";
            return (
              <article
                key={badge.id}
                className={`badge-card ${unlocked ? "" : "locked"}`}
              >
                <span className="badge-art">{unlocked ? badge.icon : "★"}</span>
                <strong>{badge.name}</strong>
                <span className="badge-note">
                  {unlocked ? badge.title : `${currentValue}/${badge.need} ${unit}`}
                </span>
              </article>
            );
          })}
        </div>
      </section>
    </GameShell>
  );
}
