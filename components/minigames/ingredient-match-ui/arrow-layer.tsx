import type { CompletedArrow } from "@/domain/ingredients-match-type";

type ArrowLayerProps = {
  arrows: CompletedArrow[];
};

export default function ArrowLayer({ arrows }: ArrowLayerProps) {
  return (
    <svg className='pointer-events-none absolute inset-0 h-full w-full z-0'>
      {arrows.map((arrow) => (
        <line
          key={arrow.id}
          x1={arrow.startX}
          y1={arrow.startY}
          x2={arrow.endX}
          y2={arrow.endY}
          stroke={arrow.isCorrect ? "#22C55E" : "#FB923C"}
          strokeWidth='5'
          strokeLinecap='round'
        />
      ))}
    </svg>
  );
}
