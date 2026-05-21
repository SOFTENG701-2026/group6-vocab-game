import type { CompletedArrow } from "@/domain/ingredients-match-type";

type ArrowLayerProps = {
  arrows: CompletedArrow[];
};

export default function ArrowLayer({ arrows }: ArrowLayerProps) {
  return (
    <svg className='pointer-events-none absolute inset-0 h-full w-full'>
      <defs>
        <marker
          id='arrowhead'
          markerWidth='10'
          markerHeight='10'
          refX='8'
          refY='3'
          orient='auto'
        >
          <path d='M0,0 L0,6 L9,3 z' fill='currentColor' />
        </marker>
      </defs>

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
          markerEnd='url(#arrowhead)'
        />
      ))}
    </svg>
  );
}
