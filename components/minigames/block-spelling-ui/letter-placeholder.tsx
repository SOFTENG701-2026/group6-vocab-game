type LetterPlaceholderProps = {
  hintedLetter: string;
  placedLetter?: string;
  status: "empty" | "correct" | "incorrect";
  position: number;
  onDrop: () => void;
  onClick: () => void;
};

export default function LetterPlaceholder({
  hintedLetter,
  placedLetter,
  status,
  position,
  onDrop,
  onClick,
}: LetterPlaceholderProps) {
  const statusClass =
    status === "correct"
      ? "border-green-400 bg-green-50"
      : status === "incorrect"
        ? "animate-pulse border-orange-400 bg-orange-50"
        : "border-gray-300";

  return (
    <button
      type='button'
      onClick={onClick}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
      className={`
        relative flex h-16 w-16 items-center justify-center
        rounded-xl border-3 border-dashed bg-white
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
            relative flex h-12 w-12 items-center justify-center
            rounded-lg border-4 border-gray-300 bg-white
            text-2xl font-black text-gray-900
            shadow-[0_3px_0_rgba(0,0,0,0.18)]
          '
        >
          {placedLetter}
        </span>
      )}
    </button>
  );
}
