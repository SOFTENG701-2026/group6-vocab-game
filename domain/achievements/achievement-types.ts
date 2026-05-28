export type AchievementTier = 1 | 2 | 3;

export type Achievement = {
  id: string;
  name: string;
  badgeSrc: string;
  previewIconSrc: string;
  isUnlocked: boolean;
  isClaimed: boolean;
  tier: AchievementTier;
  currentProgress: number;
  requiredProgress: number;
};
