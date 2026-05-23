type LetterPlaceholderProps = {
  hintedLetter: string;
  placedLetter?: string;
  status: "empty" | "correct";
  position: number;
};

export default function LetterPlaceholder({ hintedLetter, placedLetter, status, position }: LetterPlaceholderProps) {
  const statusClass = status === "correct" ? "border-green-400 bg-green-50" : "border-gray-300 bg-white";

  return (
    <div
      className={`
        relative flex h-14 w-14 items-center justify-center
        rounded-xl border-3 border-dashed
        text-2xl font-black uppercase shadow-inner
        transition
        ${statusClass}
      `}
      aria-label={`Letter position ${position}`}
    >
      <span className='absolute text-gray-300'>{hintedLetter}</span>

      {placedLetter && (
        <span
          className='
            relative flex h-10 w-10 items-center justify-center
            rounded-lg border-4 border-gray-300 bg-white
            text-2xl font-black text-gray-900
            shadow-[0_3px_0_rgba(0,0,0,0.18)]
          '
        >
          {placedLetter}
        </span>
      )}
    </div>
  );
}
