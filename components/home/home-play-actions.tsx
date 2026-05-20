"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import DifficultyModal from "@/components/modals/difficulty-modal";
import { UserRound, UsersRound } from "lucide-react";

import { PlayMode } from "@/domain/game-setup/game-setup-types";

export default function HomePlayActions() {
  const router = useRouter();

  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState(false);
  const [selectedPlayMode, setSelectedPlayMode] = useState<PlayMode | null>(
    null
  );

  function openDifficultyModal(playMode: PlayMode) {
    setSelectedPlayMode(playMode);
    setIsDifficultyModalOpen(true);
  }

  function handleDifficultySelect(difficultyId: string) {
    if (!selectedPlayMode) return;

    setIsDifficultyModalOpen(false);

    // Future progression:
    // This can later route to avatar/name setup before gameplay.
    router.push(`/setup?mode=${selectedPlayMode}&difficulty=${difficultyId}`);
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
