import { useEffect, useMemo, useState } from "react";

type UsePreviewTimelineProps<Step extends string> = {
  isOpen: boolean;
  stepOrder: readonly Step[];
  stepDurations: Record<Step, number>;
  speed?: number;
  shouldLoop?: boolean;
};

export function usePreviewTimeline<Step extends string>({
  isOpen,
  stepOrder,
  stepDurations,
  speed = 1,
  shouldLoop = true,
}: UsePreviewTimelineProps<Step>) {
  const [stepIndex, setStepIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  const safeSpeed = Math.max(0.25, speed);
  const step = stepOrder[stepIndex];

  const stepIndexByName = useMemo(() => {
    return stepOrder.reduce(
      (lookup, currentStep, index) => {
        lookup[currentStep] = index;
        return lookup;
      },
      {} as Record<Step, number>,
    );
  }, [stepOrder]);

  function replay() {
    setStepIndex(0);
    setReplayKey((current) => current + 1);
  }

  function isAtOrAfter(targetStep: Step) {
    return stepIndex >= stepIndexByName[targetStep];
  }

  function isBefore(targetStep: Step) {
    return stepIndex < stepIndexByName[targetStep];
  }

  function isBetween(startStep: Step, endStep: Step) {
    return isAtOrAfter(startStep) && isBefore(endStep);
  }

  useEffect(() => {
    if (!isOpen) return;

    setStepIndex(0);

    let timeoutId: number | undefined;

    function runTimeline(index: number) {
      const currentStep = stepOrder[index];
      const duration = stepDurations[currentStep] / safeSpeed;

      timeoutId = window.setTimeout(() => {
        const nextIndex = index + 1;

        if (nextIndex >= stepOrder.length) {
          if (!shouldLoop) return;

          setStepIndex(0);
          runTimeline(0);
          return;
        }

        setStepIndex(nextIndex);
        runTimeline(nextIndex);
      }, duration);
    }

    runTimeline(0);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isOpen, replayKey, safeSpeed, shouldLoop, stepOrder, stepDurations]);

  return {
    step,
    stepIndex,
    replay,
    isAtOrAfter,
    isBefore,
    isBetween,
  };
}
