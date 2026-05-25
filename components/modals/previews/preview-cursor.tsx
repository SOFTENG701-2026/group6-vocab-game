import type { Point } from "./use-preview-measured-points";

type PreviewCursorProps = {
  position: Point;
  imageSrc: string;
  size?: number;
  speed?: number;
};

export default function PreviewCursor({ position, imageSrc, size = 56, speed = 1 }: PreviewCursorProps) {
  const safeSpeed = Math.max(0.25, speed);

  return (
    <img
      src={imageSrc}
      alt=''
      aria-hidden='true'
      className='pointer-events-none absolute z-20 transition-all ease-in-out'
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        transitionDuration: `${700 / safeSpeed}ms`,
      }}
    />
  );
}
