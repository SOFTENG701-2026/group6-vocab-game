type AchievementProgressBarProps = {
  current: number;
  required: number;
};

export default function AchievementProgressBar({ current, required }: AchievementProgressBarProps) {
  const progressPercent = Math.min((current / required) * 100, 100);

  return (
    <div className='relative h-12 w-full overflow-hidden rounded-full bg-gray-200'>
      <div
        className='h-full rounded-full bg-green-400 transition-all duration-300'
        style={{ width: `${progressPercent}%` }}
      />

      <p className='absolute inset-0 flex items-center justify-center text-lg font-black text-black font-pixel'>
        {current} / {required}
      </p>
    </div>
  );
}
