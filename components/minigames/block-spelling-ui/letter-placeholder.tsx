type LetterPlaceholderProps = {
  hintedLetter: string;
  placedLetter?: string;
  isIncorrect: boolean;
  position: number;
  onDrop: () => void;
  onClick: () => void;
};

export default function LetterPlaceholder({
  hintedLetter,
  placedLetter,
  isIncorrect,
  position,
  onDrop,
  onClick,
}: LetterPlaceholderProps) {
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
        ${isIncorrect ? "animate-pulse border-red-400 bg-red-50" : "border-gray-300"}
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
