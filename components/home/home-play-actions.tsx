"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import DifficultyModal from "@/components/modals/difficulty-selection-modal";
import { UserRound, UsersRound } from "lucide-react";
import { useGameSetup } from "@/context/game-setup-context";
import { Difficulty, PlayMode } from "@/domain/game-setup/game-setup-types";

export default function HomePlayActions() {
  const router = useRouter();
  const { setDifficulty } = useGameSetup();
  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode | null>(null);

  function openDifficultyModal(playMode: PlayMode) {
    /**TODO: if single player allow user to create only one avatar and automatically create avatar for buddy-bot.
     * else allow user to create two avatars
     */
    setPlayMode(playMode);
    setIsDifficultyModalOpen(true);
  }

  function handleDifficultySelect(difficulty: Difficulty) {
    if (!playMode) return;
    setDifficulty(difficulty);
    setIsDifficultyModalOpen(false);
    if (difficulty === "easy") {
      router.push("/easygame");
    } else if (difficulty === "medium") {
      // TODO: route to dedicated medium game page when ready
      router.push("/game");
    } else {
      router.push("/game");
    }
  }

  return (
    <>
      <Button
        size='large'
        icon={<UserRound className='w-6 h-6' />}
        onClick={() => openDifficultyModal("single")}
      >
        Play
      </Button>

      <h1 className='text-black text-2xl font-bold'> OR </h1>

      <Button
        size='large'
        icon={<UsersRound className='w-6 h-6' />}
        onClick={() => openDifficultyModal("friend")}
      >
        Play with a Friend
      </Button>

      <DifficultyModal
        isOpen={isDifficultyModalOpen}
        onSelectDifficulty={handleDifficultySelect}
      />
    </>
  );
}
