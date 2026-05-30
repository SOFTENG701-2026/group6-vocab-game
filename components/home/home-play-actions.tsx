"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DifficultyModal from "@/components/modals/difficulty-selection-modal";
import { useGameSetup } from "@/context/game-setup-context";
import { Difficulty, PlayMode } from "@/domain/game-setup/game-setup-types";

type FaceTone = "peach" | "blue" | "mint";

function CuteKidFace({
  tone = "peach"
}: Readonly<{ tone?: FaceTone }>) {
  const toneClasses = {
    peach: "bg-[#ffd9c2]",
    blue: "bg-[#cfe9ff]",
    mint: "bg-[#d6f6e7]"
  }[tone];

  const shirtClasses = {
    peach: "bg-[#ff7b7b]",
    blue: "bg-[#5aa9ff]",
    mint: "bg-[#6BCB77]"
  }[tone];

  return (
    <div
      className="
        relative flex h-28 w-28 flex-col items-center justify-end
        overflow-hidden rounded-full border-4 border-white
        shadow-[0_8px_20px_rgba(0,0,0,0.08)]
        transition-transform duration-200
      "
    >
      {/* face */}
      <div className={`absolute inset-0 ${toneClasses}`} />

      {/* hair */}
      <div className="absolute top-0 h-10 w-full bg-[#5b3b2a]" />

      {/* cheeks */}
      <span className="absolute left-4 top-14 h-3 w-4 rounded-full bg-[#ff9db1] opacity-60" />
      <span className="absolute right-4 top-14 h-3 w-4 rounded-full bg-[#ff9db1] opacity-60" />

      {/* eyes */}
      <div className="absolute top-11 z-10 flex gap-5">
        <div className="relative h-3.5 w-3.5 rounded-full bg-[#3f2a1f]">
          <span className="absolute left-[2px] top-[2px] h-1 w-1 rounded-full bg-white" />
        </div>

        <div className="relative h-3.5 w-3.5 rounded-full bg-[#3f2a1f]">
          <span className="absolute left-[2px] top-[2px] h-1 w-1 rounded-full bg-white" />
        </div>
      </div>

      {/* mouth */}
      <div className="absolute top-[3.9rem] z-10 flex h-3.5 w-6 items-end justify-center overflow-hidden rounded-b-full bg-[#3f2a1f]">
        <div className="h-2 w-3 rounded-t-full bg-[#ff8da1]" />
      </div>

      {/* shirt */}
      <div
        className={`
          relative z-10 h-7 w-16 rounded-t-3xl border-t-2 border-white
          ${shirtClasses}
        `}
      />
    </div>
  );
}

function CuteRobotFace() {
  return (
    <div
      className="
        relative flex h-28 w-28 flex-col items-center justify-end
        overflow-hidden rounded-[2rem]
        border-4 border-white
        bg-[#f2fbff]

        shadow-[0_8px_20px_rgba(0,0,0,0.08)]

        transition-transform duration-200
      "
    >
      {/* antenna */}
      <div className="absolute top-2 flex flex-col items-center">
        <span className="h-2.5 w-2.5 rounded-full bg-[#8fd4ff]" />
        <span className="h-2 w-1 rounded-full bg-[#d8f2ff]" />
      </div>

      {/* cheeks */}
      <span className="absolute left-4 top-14 h-2.5 w-3 rounded-full bg-[#dcf5ff] opacity-80" />
      <span className="absolute right-4 top-14 h-2.5 w-3 rounded-full bg-[#dcf5ff] opacity-80" />

      {/* eyes */}
      <div className="absolute top-11 flex gap-5">
        <div className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#1f8a70]">
          <span className="h-1 w-1 rounded-full bg-white" />
        </div>

        <div className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#1f8a70]">
          <span className="h-1 w-1 rounded-full bg-white" />
        </div>
      </div>

      {/* mouth */}
      <div className="absolute top-[4rem] h-1.5 w-7 rounded-full bg-[#1f8a70]" />

      {/* body */}
      <div className="relative z-10 h-7 w-16 rounded-t-3xl border-t-2 border-white bg-[#88c9ff]" />
    </div>
  );
}

function ChildPairIllustration() {
  return (
    <div className="relative flex h-44 w-full items-center justify-center gap-5">
      <div className="translate-x-3 rotate-[-6deg]">
        <CuteKidFace tone="peach" />
      </div>

      <div className="-translate-x-3 rotate-[6deg]">
        <CuteKidFace tone="mint" />
      </div>
    </div>
  );
}

function KidAndRobotIllustration() {
  return (
    <div className="relative flex h-44 w-full items-center justify-center gap-5">
      <div className="translate-x-3 rotate-[-5deg]">
        <CuteKidFace tone="peach" />
      </div>

      <div className="-translate-x-3 rotate-[8deg]">
        <CuteRobotFace />
      </div>
    </div>
  );
}

export default function HomePlayActions() {
  const router = useRouter();

  const { setDifficulty, setMode } = useGameSetup();

  const [isDifficultyModalOpen, setIsDifficultyModalOpen] =
    useState(false);

  const [playMode, setPlayMode] =
    useState<PlayMode | null>(null);

  function openDifficultyModal(nextPlayMode: PlayMode) {
    setPlayMode(nextPlayMode);
    setMode(nextPlayMode);
    setIsDifficultyModalOpen(true);
  }

  function handleDifficultySelect(difficulty: Difficulty) {
    if (!playMode) return;

    setDifficulty(difficulty);

    setIsDifficultyModalOpen(false);

    if (difficulty === "easy") {
      router.push("/easygame");
    } else {
      router.push("/game");
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">

          {/* SOLO */}
          <button
            type="button"
            onClick={() => openDifficultyModal("single")}
            aria-label="Play solo with robot"
            className="
              group

              flex min-h-[22rem] flex-col
              items-center justify-between

              overflow-hidden

              rounded-[2.5rem]
              border-4 border-[#34a08a]

              bg-white

              px-6 py-7

              shadow-[0_10px_30px_rgba(0,0,0,0.08)]

              transition-all duration-200

              hover:-translate-y-1
              hover:shadow-[0_14px_35px_rgba(0,0,0,0.12)]

              active:translate-y-[2px]
            "
          >
            <div className="flex flex-1 items-center justify-center w-full">
              <KidAndRobotIllustration />
            </div>

            <div className="mt-2 flex flex-col items-center">
              <span
                className="
                  text-2xl font-black
                  tracking-[0.08em]
                  text-[#34a08a]
                "
              >
                1 PLAYER
              </span>
            </div>
          </button>

          {/* FRIENDS */}
          <button
            type="button"
            onClick={() => openDifficultyModal("friend")}
            aria-label="Play with friends"
            className="
              group

              flex min-h-[22rem] flex-col
              items-center justify-between

              overflow-hidden

              rounded-[2.5rem]
              border-4 border-[#ffab5e]

              bg-white

              px-6 py-7

              shadow-[0_10px_30px_rgba(0,0,0,0.08)]

              transition-all duration-200

              hover:-translate-y-1
              hover:shadow-[0_14px_35px_rgba(0,0,0,0.12)]

              active:translate-y-[2px]
            "
          >
            <div className="flex flex-1 items-center justify-center w-full">
              <ChildPairIllustration />
            </div>

            <div className="mt-2 flex flex-col items-center">
              <span
                className="
                  text-2xl font-black
                  tracking-[0.08em]
                  text-[#ffab5e]
                "
              >
                2 PLAYER
              </span>
            </div>
          </button>
        </div>
      </div>

      <DifficultyModal
        isOpen={isDifficultyModalOpen}
        onSelectDifficulty={handleDifficultySelect}
        onClose={() => setIsDifficultyModalOpen(false)}
      />
    </>
  );
}