import { Eye, Gift, Lock } from "lucide-react";
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
  const isClaimable = canClaimAchievement(achievement);

  const title = getAchievementTitle(achievement);

  return (
    <div
      className='
        flex w-full max-w-9/10 items-center gap-5
        rounded-4xl bg-yellow-950/20 p-5
        shadow-sm backdrop-blur-[1px]
      '
    >
      <div className='rounded-3xl bg-white/25 p-3'>
        <AchievementBadge badgeSrc={achievement.badgeSrc} isUnlocked={achievement.isUnlocked} />
      </div>

      <div className='flex flex-1 flex-col gap-5'>
        <h2
          className='
            text-center text-5xl font-black uppercase tracking-wider
            text-purple-500
            drop-shadow-[4px_4px_0px_white]
            '
        >
          {title}
        </h2>

        <AchievementProgressBar current={achievement.currentProgress} required={achievement.requiredProgress} />

        <div className='grid grid-cols-[2fr_1fr] gap-3'>
          <button
            type='button'
            disabled={!isClaimable}
            onClick={() => onClaim(achievement.id)}
            className={`
                group flex items-center justify-center rounded-lg px-6 py-4
                text-2xl font-black uppercase text-white
                transition active:scale-95
                ${isClaimable ? "bg-emerald-500 hover:bg-emerald-600" : "cursor-not-allowed bg-yellow-950/20"}
            `}
          >
            {!achievement.isUnlocked ? (
              <Lock
                size={34}
                strokeWidth={2}
                className=' transition-transform duration-150 group-active:-translate-x-1 group-active:rotate-12'
              />
            ) : (
              <Gift
                size={34}
                strokeWidth={2}
                className='transition-transform duration-200 group-hover:scale-125 group-hover:-rotate-6'
              />
            )}
          </button>

          <button
            type='button'
            onClick={() => onView(achievement)}
            className='
              flex items-center justify-center rounded-md
              bg-purple-700 px-4 py-2 text-white
              transition hover:bg-purple-800 active:scale-95
            '
          >
            <Eye size={32} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
