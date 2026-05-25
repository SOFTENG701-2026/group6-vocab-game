"use client";

import Image from "next/image";
import Button from "@/components/button";
import type { Ingredient } from "@/data/ingredients";
import { shapeOptions } from "@/domain/ingredients-match-options";
import { useState, useRef, useLayoutEffect, useEffect } from "react";

type IngredientMatchPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient;
};

type PreviewStep =
  | "idle"
  | "move-to-colour"
  | "click-colour"
  | "move-colour-to-target"
  | "click-target-after-colour"
  | "colour-done"
  | "move-to-wrong-shape"
  | "click-wrong-shape"
  | "move-wrong-shape-to-target"
  | "click-target-after-wrong-shape"
  | "wrong-shape-done";

type Point = {
  x: number;
  y: number;
};

type LayoutPoints = {
  colourCenter: Point;
  wrongShapeCenter: Point;
  targetCenter: Point;
};

const stepOrder: PreviewStep[] = [
  "idle",

  "move-to-colour",
  "click-colour",
  "move-colour-to-target",
  "click-target-after-colour",
  "colour-done",

  "move-to-wrong-shape",
  "click-wrong-shape",
  "move-wrong-shape-to-target",
  "click-target-after-wrong-shape",
  "wrong-shape-done",
];

const stepDurations: Record<PreviewStep, number> = {
  idle: 2000,

  "move-to-colour": 1000,
  "click-colour": 500,
  "move-colour-to-target": 1200,
  "click-target-after-colour": 500,
  "colour-done": 1200,

  "move-to-wrong-shape": 2000,
  "click-wrong-shape": 1000,
  "move-wrong-shape-to-target": 1000,
  "click-target-after-wrong-shape": 500,
  "wrong-shape-done": 1800,
};

const CURSOR_SIZE = 56;

const fallbackCursorPosition: Point = {
  x: 80,
  y: 390,
};

export default function IngredientMatchPreviewModal({ isOpen, onClose, ingredient }: IngredientMatchPreviewModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [layoutPoints, setLayoutPoints] = useState<LayoutPoints | null>(null);

  const previewAreaRef = useRef<HTMLDivElement | null>(null);
  const colourOptionRef = useRef<HTMLButtonElement | null>(null);
  const wrongShapeRef = useRef<HTMLButtonElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const step = stepOrder[stepIndex];

  const cursorPosition = getCursorPosition(step, layoutPoints);

  const isClicking =
    step === "click-colour" ||
    step === "click-wrong-shape" ||
    step === "click-target-after-colour" ||
    step === "click-target-after-wrong-shape";

  const cursorImage = isClicking ? "/assets/tutorial/mouse-click.svg" : "/assets/tutorial/mouse-default.svg";

  const mousePanelImage = isClicking ? "/assets/tutorial/mouse-left-active.svg" : "/assets/tutorial/mouse-inactive.svg";

  const wrongShape = shapeOptions.find((shape) => shape.id !== ingredient.shapeId);

  function getCenterPoint(element: HTMLElement, container: HTMLElement): Point {
    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2,
    };
  }

  function getCursorPosition(step: PreviewStep, layoutPoints: LayoutPoints | null): Point {
    if (!layoutPoints) {
      return fallbackCursorPosition;
    }

    switch (step) {
      case "move-to-colour":
      case "click-colour":
        return layoutPoints.colourCenter;

      case "move-colour-to-target":
      case "click-target-after-colour":
      case "colour-done":
        return layoutPoints.targetCenter;

      case "move-to-wrong-shape":
      case "click-wrong-shape":
        return layoutPoints.wrongShapeCenter;

      case "move-wrong-shape-to-target":
      case "click-target-after-wrong-shape":
      case "wrong-shape-done":
        return layoutPoints.targetCenter;

      case "idle":
      default:
        return fallbackCursorPosition;
    }
  }

  // Measure the elements: colour, shape options and target ingredient for mouse movements.
  useLayoutEffect(() => {
    if (!isOpen) return;

    function measurePositions() {
      if (!previewAreaRef.current || !colourOptionRef.current || !wrongShapeRef.current || !targetRef.current) {
        return;
      }

      const container = previewAreaRef.current;

      setLayoutPoints({
        colourCenter: getCenterPoint(colourOptionRef.current, container),
        wrongShapeCenter: getCenterPoint(wrongShapeRef.current, container),
        targetCenter: getCenterPoint(targetRef.current, container),
      });
    }

    measurePositions();

    window.addEventListener("resize", measurePositions);

    return () => {
      window.removeEventListener("resize", measurePositions);
    };
  }, [isOpen, ingredient.id]);

  //Run the animation timeline by moving through the defined preview steps.
  useEffect(() => {
    if (!isOpen) return;

    setStepIndex(0);

    let timeoutId: number | undefined;

    function runTimeline(index: number) {
      const currentStep = stepOrder[index];
      const duration = stepDurations[currentStep];

      timeoutId = window.setTimeout(() => {
        const nextIndex = index + 1;

        if (nextIndex >= stepOrder.length) {
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
  }, [isOpen, replayKey]);

  if (!isOpen) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6'
    >
      <div
        className='grid w-full max-w-6xl grid-cols-[1fr_240px] gap-5 rounded-4xl bg-white p-5 shadow-2xl
        '
      >
        {/* Left preview area */}
        <section
          ref={previewAreaRef}
          className='
            relative h-130 overflow-hidden
            rounded-4xl bg-emerald-300
          '
        >
          {/* Left options */}
          <div className='absolute left-10 top-30 flex flex-col gap-10'>
            {/* Correct colour option */}
            <button
              ref={colourOptionRef}
              aria-label={`${ingredient.color} colour option`}
              className='
                h-28 w-28 rounded-full
                border-4 border-white shadow
              '
              style={{ backgroundColor: ingredient.color }}
            />

            {/* Wrong shape option */}
            <button
              ref={wrongShapeRef}
              aria-label={wrongShape?.label ?? "Wrong shape option"}
              className='
                flex h-28 w-28 items-center justify-center
                rounded-3xl border-4 border-white
                bg-white p-4 shadow
              '
            >
              {wrongShape?.imageSrc ? (
                <img src={wrongShape.imageSrc} alt={wrongShape.label} className='h-full w-full object-contain' />
              ) : (
                <span className='text-sm font-bold text-slate-800'>{wrongShape?.label ?? "Shape"}</span>
              )}
            </button>
          </div>

          {/* Target ingredient */}
          <div className='absolute right-24 top-1/2 -translate-y-1/2'>
            <div className='flex flex-col items-center gap-5'>
              <div
                ref={targetRef}
                className='
                  relative flex h-44 w-44 items-center justify-center
                  overflow-hidden rounded-4xl bg-white shadow
                '
              >
                <Image
                  src={ingredient.imageSrc}
                  alt={ingredient.imageAlt}
                  width={180}
                  height={180}
                  className='h-36 w-36 object-contain'
                  draggable={false}
                />
              </div>

              <div
                className='
                  max-w-xs rounded-2xl bg-white/95
                  px-5 py-3 text-center text-sm
                  font-bold text-slate-800 shadow
                '
              >
                Watch how to choose an option and connect it to the ingredient.
              </div>
            </div>
          </div>

          {/* Static cursor placeholder */}
          <img
            src={cursorImage}
            alt=''
            aria-hidden='true'
            className='pointer-events-none absolute z-20 transition-all duration-700 ease-in-out'
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              width: CURSOR_SIZE,
              height: CURSOR_SIZE,
              transform: "translate(-50%, -50%)",
            }}
          />
        </section>

        {/* Right instruction panel */}
        <aside
          className='
            flex flex-col justify-between
            rounded-4xl bg-slate-100
            p-5 text-center shadow-inner
          '
        >
          <div>
            <h2 className='text-xl font-extrabold text-slate-800'>How to play</h2>

            <p className='mt-3 text-sm font-semibold text-slate-600'>
              Watch the finger choose an option, click it, then connect it to the ingredient.
            </p>
          </div>

          <div className='flex flex-col items-center gap-4'>
            <img src={mousePanelImage} alt='Mouse preview' className='h-28 w-28 object-contain' />

            <p className='rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow'>
              {isClicking ? "Click!" : "Move"}
            </p>
          </div>

          <div className='flex w-full gap-3'>
            <Button
              onClick={() => {
                setReplayKey((current) => current + 1);
                setStepIndex(0);
              }}
              className='flex-1'
            >
              Replay
            </Button>

            <Button onClick={onClose} className='flex-1'>
              Close
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
