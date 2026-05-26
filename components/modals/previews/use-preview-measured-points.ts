import { useCallback, useLayoutEffect, useRef, useState } from "react";

export type Point = {
  x: number;
  y: number;
};

type UsePreviewMeasuredPointsProps<TargetId extends string> = {
  isOpen: boolean;
  targetIds: readonly TargetId[];
  dependencyKey?: string;
};

export function usePreviewMeasuredPoints<TargetId extends string>({
  isOpen,
  targetIds,
  dependencyKey,
}: UsePreviewMeasuredPointsProps<TargetId>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const elementMapRef = useRef<Partial<Record<TargetId, HTMLElement | null>>>({});

  const [points, setPoints] = useState<Partial<Record<TargetId, Point>>>({});

  const setElementRef = useCallback((targetId: TargetId) => {
    return (element: HTMLElement | null) => {
      elementMapRef.current[targetId] = element;
    };
  }, []);

  const measure = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const nextPoints: Partial<Record<TargetId, Point>> = {};

    for (const targetId of targetIds) {
      const element = elementMapRef.current[targetId];

      if (!element) continue;

      nextPoints[targetId] = getCenterPoint(element, container);
    }

    setPoints(nextPoints);
  }, [targetIds]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    measure();

    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [dependencyKey, isOpen, measure]);

  return {
    containerRef,
    setElementRef,
    points,
    measure,
  };
}

function getCenterPoint(element: HTMLElement, container: HTMLElement): Point {
  const rect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top + rect.height / 2,
  };
}
