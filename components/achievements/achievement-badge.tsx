type AchievementBadgeProps = {
  name: string;
  badgeSrc: string;
  isUnlocked: boolean;
};

export default function AchievementBadge({ name, badgeSrc, isUnlocked }: AchievementBadgeProps) {
  return (
    <div className='relative h-64 w-64 shrink-0'>
      <img
        src={isUnlocked ? badgeSrc : "/assets/achievements/full-locked.svg"}
        alt={isUnlocked ? `${name} achievement badge` : "Locked achievement badge"}
        className={`
          h-full w-full object-contain
          transition duration-200
          ${isUnlocked ? "brightness-100" : "brightness-75 grayscale"}
        `}
      />
    </div>
  );
}
