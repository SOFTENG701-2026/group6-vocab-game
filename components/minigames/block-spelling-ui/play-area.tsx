import { FallingLetter } from "@/domain/block-spelling-game-type";
import Image from "next/image";

type BasketSpellingPlayAreaProps = {
  fallingLetters: FallingLetter[];
  basketX: number;
  isBasketSlowed: boolean;
};

export default function BasketSpellingPlayArea({
  fallingLetters,
  basketX,
  isBasketSlowed,
}: BasketSpellingPlayAreaProps) {
  return (
    <div
      className='
        relative h-112 w-3/4 overflow-hidden rounded-3xl
        border-4 border-white bg-linear-to-b from-sky-100 to-emerald-100
        shadow-inner
      '
    >
      {fallingLetters.map((fallingLetter) => (
        <div
          key={fallingLetter.id}
          className='
            absolute flex h-14 w-14 items-center justify-center
            rounded-2xl border-4 border-white bg-yellow-200
            text-3xl font-black text-gray-900 shadow-lg
          '
          style={{
            left: `${fallingLetter.x}%`,
            top: `${fallingLetter.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {fallingLetter.letter}
        </div>
      ))}

      <div
        className={`
          absolute bottom-2 w-24 transition-transform
          ${isBasketSlowed ? "animate-pulse opacity-70" : ""}
        `}
        style={{
          left: `${basketX}%`,
          transform: "translateX(-50%)",
        }}
      >
        <Image
          src='/basket.svg'
          alt='Letter basket'
          width={120}
          height={120}
          className='h-20 w-24 object-contain'
          draggable={false}
        />
      </div>
    </div>
  );
}
