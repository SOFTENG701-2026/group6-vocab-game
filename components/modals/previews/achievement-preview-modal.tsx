import { X } from "lucide-react";
import { Achievement } from "@/domain/achievements/achievement-types";

type AchievementPreviewModalProps = {
  achievement: Achievement | null;
  onClose: () => void;
};

export default function AchievementPreviewModal({ achievement, onClose }: AchievementPreviewModalProps) {
  if (!achievement) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      className='
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/80 p-6
      '
    >
      <div
        className='
          relative flex flex-col items-center gap-5
          rounded-4xl bg-white/10 p-10
          backdrop-blur-sm
        '
      >
        <button
          type='button'
          onClick={onClose}
          aria-label='Close achievement preview'
          className='
            absolute -right-4 -top-4 z-20
            flex h-12 w-12 items-center justify-center
            rounded-full bg-red-500 text-white shadow-lg
            transition hover:scale-110 hover:bg-red-600 active:scale-95
          '
        >
          <X size={30} strokeWidth={4} />
        </button>

        <img
          src={achievement.isUnlocked ? achievement.previewIconSrc : "/assets/achievements/icon-locked.svg"}
          alt={`${achievement.name} achievement icon`}
          className='
            h-120 w-120 object-contain
            drop-shadow-2xl
            transition duration-200
          '
        />
      </div>
    </div>
  );
}
