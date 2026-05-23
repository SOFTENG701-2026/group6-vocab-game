type LetterTileProps = {
  letter: string;
  isUsed: boolean;
  isComplete: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
};

export default function LetterTile({ letter, isUsed, isComplete, onDragStart, onDragEnd }: LetterTileProps) {
  return (
    <button
      type='button'
      draggable={!isUsed && !isComplete}
      disabled={isUsed || isComplete}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        flex h-14 w-14 cursor-grab items-center justify-center
        rounded-lg border-4 border-gray-300 bg-white
        text-2xl font-black uppercase text-gray-900
        shadow-[0_3px_0_rgba(0,0,0,0.18)]
        transition active:cursor-grabbing
        ${isUsed ? "scale-90 opacity-20" : "hover:-translate-y-1 hover:shadow-lg active:translate-y-0"}
      `}
    >
      {letter}
    </button>
  );
}
