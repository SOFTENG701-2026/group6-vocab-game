import { useState } from "react";
import { Eye, Gift, Lock } from "lucide-react";
import { useCurrency } from "@/context/currency-context";
import AchievementBadge from "./achievement-badge";
import AchievementProgressBar from "./achievement-progress-bar";
import { canClaimAchievement, getAchievementTitle } from "@/lib/achievement-utils";
import type { Achievement } from "@/domain/achievements/achievement-types";

type AchievementRowProps = {
  achievement: Achievement;
  onClaim: (achievementId: string) => void;
  onView: (achievement: Achievement) => void;
};

export default function AchievementRow({ achievement, onClaim, onView }: AchievementRowProps) {
  const [isClaimIconShaking, setIsClaimIconShaking] = useState(false);
  const { claimGems } = useCurrency();

  const isClaimable = canClaimAchievement(achievement);

  const title = getAchievementTitle(achievement);

  function handleClaimClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!achievement.isUnlocked || !isClaimable) {
      setIsClaimIconShaking(true);

      window.setTimeout(() => {
        setIsClaimIconShaking(false);
      }, 400);

      return;
    }

    if (!isClaimable) return;

    onClaim(achievement.id);
    claimGems(50, event.currentTarget);
  }

  return (
    <div
      className='
        flex w-full max-w-9/10 items-center gap-5
        rounded-4xl bg-[#d3c399]/50
        shadow-sm backdrop-blur-[1px]
      '
    >
      <div className='rounded-3xl bg-[#d6d0c2] p-3'>
        <AchievementBadge name={achievement.name} badgeSrc={achievement.badgeSrc} isUnlocked={achievement.isUnlocked} />
      </div>

      <div className='flex flex-1 flex-col gap-5 px-8'>
        <h2
          className='
            font-pixel
            text-center text-4xl font-black uppercase tracking-wider
            text-[#b95efe]
            [text-shadow:-2px_3px_0_#3f3a35,-6px_5px_0_rgba(0,0,0,0.25)]
          '
        >
          {title}
        </h2>

        <AchievementProgressBar current={achievement.currentProgress} required={achievement.requiredProgress} />

        <div className='grid grid-cols-[2fr_1fr] gap-4'>
          <button
            type='button'
            onClick={handleClaimClick}
            className={`
              group flex items-center justify-center rounded-lg py-3
              text-2xl font-black uppercase text-white
              transition active:scale-95
              ${
                !achievement.isUnlocked
                  ? "bg-yellow-950/20 text-white/70 hover:bg-yellow-950/30"
                  : isClaimable
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "cursor-not-allowed bg-yellow-950/20 text-gray-500 hover:bg-yellow-950/30"
              }
            `}
          >
            {!achievement.isUnlocked ? (
              <Lock
                size={34}
                strokeWidth={2}
                className={`
                  transition-transform duration-200
                  ${isClaimIconShaking ? "animate-lock-shake" : ""}
                `}
              />
            ) : (
              <Gift
                size={34}
                strokeWidth={2}
                className={`
                  transition-transform duration-200
                  ${isClaimable ? "group-hover:scale-125 group-hover:-rotate-6" : ""}
                  ${isClaimIconShaking ? "animate-lock-shake" : ""}
                `}
              />
            )}
          </button>

          <button
            type='button'
            onClick={() => onView(achievement)}
            className='
              group flex items-center justify-center rounded-md
              bg-(--color-primary) px-4 py-2 text-white
              transition hover:bg-purple-800 active:scale-95
            '
          >
            <Eye
              size={32}
              strokeWidth={3}
              className='transition-transform duration-200
                  group-hover:scale-125 group-hover:-rotate-6'
            />
          </button>
        </div>
      </div>
    </div>
  );
}
