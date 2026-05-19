"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GameShell from "@/components/game/game-shell";
import { avatars } from "@/lib/data/avatars";
import { useGame } from "@/context/game-provider";
import type { Avatar } from "@/lib/game/types";

function avatarTag(
  isPickedByA: boolean,
  isPickedByB: boolean,
  mode: "solo" | "duo"
) {
  if (isPickedByA) return "Player 1";
  if (isPickedByB) return mode === "solo" ? "Helper Bot" : "Player 2";
  return "Tap to choose";
}

export default function SelectPage() {
  const router = useRouter();
  const {
    mode,
    selectedAvatars,
    setSelectedAvatars,
    selectingSlot,
    setSelectingSlot,
    startGame
  } = useGame();

  useEffect(() => {
    if (mode === "solo") {
      setSelectedAvatars({ A: avatars[0], B: avatars[3] });
    }
  }, [mode, setSelectedAvatars]);

  const chooseAvatar = (avatar: Avatar) => {
    if (mode === "solo") {
      setSelectedAvatars({
        A: avatar,
        B: avatar.id === "robot" ? avatars[0] : avatars[3]
      });
    } else if (selectingSlot === "A") {
      setSelectedAvatars({ A: avatar, B: null });
      setSelectingSlot("B");
    } else {
      setSelectedAvatars({ ...selectedAvatars, B: avatar });
    }
  };

  const ready =
    mode === "solo" || (selectedAvatars.A && selectedAvatars.B);

  const title =
    mode === "solo" ? "Choose Your Player" : "Choose Two Players";
  const helper =
    mode === "solo"
      ? "Pick one player. Helper Bot will choose the other answers."
      : selectingSlot === "B"
        ? "Now Player 2 chooses a different buddy."
        : "Player 1 chooses first. Player 2 chooses next.";

  return (
    <GameShell>
      <section className="select-screen" aria-labelledby="selectTitle">
        <h1 id="selectTitle">{title}</h1>
        <p className="select-helper">{helper}</p>
        <div className="avatar-select-grid">
          {avatars.map((avatar) => {
            const isPickedByA = selectedAvatars.A?.id === avatar.id;
            const isPickedByB = selectedAvatars.B?.id === avatar.id;
            const disabled =
              mode === "duo" && selectingSlot === "B" && isPickedByA;
            return (
              <button
                key={avatar.id}
                type="button"
                className={`avatar-option ${isPickedByA || isPickedByB ? "selected" : ""} ${disabled ? "disabled" : ""}`}
                disabled={disabled}
                onClick={() => chooseAvatar(avatar)}
              >
                <span className="avatar-preview">{avatar.emoji}</span>
                <strong>{avatar.name}</strong>
                <span className="player-tag">
                  {avatarTag(isPickedByA, isPickedByB, mode)}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="primary-play"
          disabled={!ready}
          onClick={startGame}
        >
          {ready ? "Start Game" : "Pick Player 2"}
        </button>
        <button
          type="button"
          className="screen-exit"
          style={{ position: "relative", left: 0, top: 0 }}
          onClick={() => router.push("/")}
        >
          ← Home
        </button>
      </section>
    </GameShell>
  );
}
