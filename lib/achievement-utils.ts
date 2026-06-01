import type { AchievementTier, Achievement } from "@/domain/achievements/achievement-types";

export function getWordChefTitle(tier: AchievementTier) {
  if (tier === 1) return "WORD CHEF I";
  if (tier === 2) return "WORD CHEF II";
  return "WORD CHEF III";
}

export function getAchievementTitle(achievement: Achievement) {
  if (!achievement.isUnlocked) {
    return "KEEP PLAYING!";
  }

  if (achievement.id === "beginner") {
    return "GETTING STARTED";
  }

  return getWordChefTitle(achievement.tier);
}

export function canClaimAchievement(achievement: Achievement) {
  if (achievement.id === "beginner") {
    return achievement.isUnlocked && !achievement.isClaimed;
  }

  return (
    achievement.isUnlocked && !achievement.isClaimed && achievement.currentProgress >= achievement.requiredProgress
  );
}

export function getNextWordChefProgress(tier: AchievementTier) {
  if (tier === 1) {
    return {
      tier: 2 as const,
      currentProgress: 1,
      requiredProgress: 3,
      isClaimed: false,
    };
  }

  if (tier === 2) {
    return {
      tier: 3 as const,
      currentProgress: 3,
      requiredProgress: 5,
      isClaimed: false,
    };
  }

  return {
    tier: 3 as const,
    currentProgress: 5,
    requiredProgress: 5,
    isClaimed: true,
  };
}
