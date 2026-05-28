"use client";

import { useState } from "react";
import AchievementRow from "@/components/achievements/achievement-row";
import AchievementPreviewModal from "@/components/modals/previews/achievement-preview-modal";
import { canClaimAchievement, getNextWordChefProgress } from "@/lib/achievement-utils";
import type { Achievement } from "@/domain/achievements/achievement-types";

const initialAchievements: Achievement[] = [
  {
    id: "beginner",
    badgeSrc: "/assets/achievements/full-beginner.svg",
    previewIconSrc: "/assets/achievements/icon-beginner.svg",
    isUnlocked: true,
    isClaimed: false,
    tier: 1,
    currentProgress: 1,
    requiredProgress: 1,
    name: "Beginner",
  },
  {
    id: "apple",
    badgeSrc: "/assets/achievements/full-apple.svg",
    previewIconSrc: "/assets/achievements/icon-apple.svg",
    isUnlocked: true,
    isClaimed: false,
    tier: 1,
    currentProgress: 1,
    requiredProgress: 1,
    name: "Apple",
  },
  {
    id: "banana",
    badgeSrc: "/assets/achievements/full-banana.svg",
    previewIconSrc: "/assets/achievements/icon-banana.svg",
    isUnlocked: true,
    isClaimed: false,
    tier: 1,
    currentProgress: 0,
    requiredProgress: 1,
    name: "Banana",
  },
  {
    id: "carrot",
    badgeSrc: "/assets/achievements/full-carrot.svg",
    previewIconSrc: "/assets/achievements/icon-carrot.svg",
    isUnlocked: true,
    isClaimed: false,
    tier: 1,
    currentProgress: 0,
    requiredProgress: 1,
    name: "Carrot",
  },
  {
    id: "strawberry",
    badgeSrc: "/assets/achievements/full-strawberry.svg",
    previewIconSrc: "/assets/achievements/icon-strawberry.svg",
    isUnlocked: true,
    isClaimed: false,
    tier: 1,
    currentProgress: 0,
    requiredProgress: 1,
    name: "Strawberry",
  },
  {
    id: "watermelon",
    badgeSrc: "/assets/achievements/full-watermelon.svg",
    previewIconSrc: "/assets/achievements/icon-watermelon.svg",
    isUnlocked: true,
    isClaimed: false,
    tier: 1,
    currentProgress: 0,
    requiredProgress: 1,
    name: "Watermelon",
  },
  {
    id: "locked-one",
    badgeSrc: "/assets/achievements/full-watermelon.svg",
    previewIconSrc: "/assets/achievements/icon-watermelon.svg",
    isUnlocked: false,
    isClaimed: false,
    tier: 1,
    currentProgress: 0,
    requiredProgress: 1,
    name: "locked-one",
  },

  {
    id: "locked-two",
    badgeSrc: "/assets/achievements/full-watermelon.svg",
    previewIconSrc: "/assets/achievements/icon-watermelon.svg",
    isUnlocked: false,
    isClaimed: false,
    tier: 1,
    currentProgress: 0,
    requiredProgress: 1,
    name: "locked-two",
  },
];

export default function AchievementPage() {
  const [achievements, setAchievements] = useState(initialAchievements);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  function handleClaimAchievement(achievementId: string) {
    setAchievements((currentAchievements) =>
      currentAchievements.map((achievement) => {
        if (achievement.id !== achievementId) return achievement;

        const isClaimable = canClaimAchievement(achievement);

        if (!isClaimable) return achievement;

        if (achievement.id === "beginner") {
          return {
            title: "TEXT",
            ...achievement,
            isClaimed: true,
            isUnlocked: true,
            currentProgress: 1,
            requiredProgress: 1,
          };
        }

        const nextProgress = getNextWordChefProgress(achievement.tier);

        return {
          ...achievement,
          isClaimed: nextProgress.isClaimed,
          isUnlocked: true,
          tier: nextProgress.tier,
          currentProgress: nextProgress.currentProgress,
          requiredProgress: nextProgress.requiredProgress,
        };
      }),
    );
  }

  return (
    <main
      className='
    h-[calc(100vh-42px)]
    overflow-hidden
    bg-cover bg-center bg-no-repeat
  '
      style={{
        backgroundImage: "url('/assets/achievements/page-background.svg')",
      }}
    >
      <section
        className='
      grid h-full w-full grid-cols-[clamp(220px,18vw,340px)_1fr]
      overflow-hidden
    '
      >
        {/* Empty left column to reserve space for the blue line/book spine */}
        <div aria-hidden='true' />

        {/* Scrollable achievement area */}
        <div
          className='
        min-h-0 overflow-y-auto
        py-8 pr-10
        scrollbar-thin
        [scrollbar-color:#8b5cf6_transparent]
      '
        >
          <div className='flex min-h-full flex-col gap-8 pb-8'>
            {achievements.map((achievement) => (
              <AchievementRow
                key={achievement.id}
                achievement={achievement}
                onClaim={handleClaimAchievement}
                onView={setSelectedAchievement}
              />
            ))}
          </div>
        </div>
      </section>

      <AchievementPreviewModal achievement={selectedAchievement} onClose={() => setSelectedAchievement(null)} />
    </main>
  );
}
