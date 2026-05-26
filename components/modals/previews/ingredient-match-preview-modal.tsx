"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import type { Ingredient } from "@/data/ingredients";
import type { CompletedArrow } from "@/domain/ingredients-match-type";
import { shapeOptions } from "@/domain/ingredients-match-options";
import ArrowLayer from "@/components/minigames/ingredient-match-ui/arrow-layer";
import PreviewCursor from "./preview-cursor";
import BasePreviewTutorialModal from "./base-preview-tutorial-modal";
import { Point, usePreviewMeasuredPoints } from "./use-preview-measured-points";
import { usePreviewTimeline } from "./use-preview-timeline";

type IngredientMatchPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient;
  speed?: number;
};

type IngredientMatchPreviewStep =
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

type IngredientMatchTargetId = "colour-option" | "wrong-shape-option" | "target-ingredient";

const stepOrder = [
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
] as const satisfies readonly IngredientMatchPreviewStep[];

const stepDurations: Record<IngredientMatchPreviewStep, number> = {
  idle: 2000,

  "move-to-colour": 1000,
  "click-colour": 500,
  "move-colour-to-target": 1200,
  "click-target-after-colour": 300,
  "colour-done": 1200,

  "move-to-wrong-shape": 2000,
  "click-wrong-shape": 500,
  "move-wrong-shape-to-target": 1000,
  "click-target-after-wrong-shape": 300,
  "wrong-shape-done": 3000,
};

const targetIds = [
  "colour-option",
  "wrong-shape-option",
  "target-ingredient",
] as const satisfies readonly IngredientMatchTargetId[];

const fallbackPoint: Point = {
  x: 80,
  y: 390,
};

export default function IngredientMatchPreviewModal({
  isOpen,
  onClose,
  ingredient,
  speed = 1,
}: IngredientMatchPreviewModalProps) {
  const wrongShape = shapeOptions.find((shape) => shape.id !== ingredient.shapeId);

  const { step, replay, isAtOrAfter, isBetween } = usePreviewTimeline<IngredientMatchPreviewStep>({
    isOpen,
    stepOrder,
    stepDurations,
    speed,
  });

  const { containerRef, setElementRef, points } = usePreviewMeasuredPoints<IngredientMatchTargetId>({
    isOpen,
    targetIds,
    dependencyKey: ingredient.id,
  });

  const isClicking =
    step === "click-colour" ||
    step === "click-wrong-shape" ||
    step === "click-target-after-colour" ||
    step === "click-target-after-wrong-shape";

  const hasCorrectColourMatch = isAtOrAfter("colour-done");
  const hasWrongShapeAttempt = isAtOrAfter("wrong-shape-done");

  const shouldShowCorrectActionCheck = isBetween("click-target-after-colour", "move-to-wrong-shape");
  const shouldShowWrongActionX = isAtOrAfter("click-target-after-wrong-shape");
  const shouldEmphasiseInput = step === "idle";

  const cursorPosition = getIngredientMatchCursorPoint(step, points);

  const cursorImage = isClicking ? "/assets/tutorial/mouse-click.svg" : "/assets/tutorial/mouse-default.svg";

  const mousePanelImage = isClicking ? "/assets/tutorial/mouse-left-active.svg" : "/assets/tutorial/mouse-inactive.svg";

  const arrows = getIngredientMatchArrows({
    points,
    ingredient,
    wrongShapeId: wrongShape?.id ?? "wrong-shape",
    hasCorrectColourMatch,
    hasWrongShapeAttempt,
  });

  return (
    <BasePreviewTutorialModal
      isOpen={isOpen}
      onClose={onClose}
      onReplay={replay}
      title='How to play'
      description='Watch the finger choose an option, click it, then connect it to the ingredient.'
      shouldEmphasiseInput={shouldEmphasiseInput}
      inputImageSrc={mousePanelImage}
      inputLabel={isClicking ? "Click!" : "Move"}
    >
      <section
        ref={containerRef}
        className='
          relative h-130 overflow-hidden
          rounded-4xl bg-gray-300
        '
      >
        <ArrowLayer arrows={arrows} />

        <div className='flex h-full items-center justify-between px-12'>
          <div className='flex flex-col items-center gap-10 z-10'>
            <button
              ref={setElementRef("colour-option")}
              className={`
                h-28 w-28 rounded-full border-4 shadow
                ${hasCorrectColourMatch ? "border-blue-500" : "border-white"}
              `}
              style={{ backgroundColor: ingredient.color }}
            />

            <button
              ref={setElementRef("wrong-shape-option")}
              className={`
                flex h-28 w-28 items-center justify-center
                rounded-3xl border-4 bg-white p-4 shadow
                ${hasWrongShapeAttempt ? "border-orange-400" : "border-white"}
              `}
            >
              {wrongShape?.imageSrc ? (
                <Image
                  src={wrongShape.imageSrc}
                  alt={wrongShape.label}
                  width={80}
                  height={80}
                  className='h-full w-full object-contain'
                />
              ) : (
                <span className='text-sm font-bold'>{wrongShape?.label ?? "Shape"}</span>
              )}
            </button>
          </div>

          <div className='flex flex-col items-center gap-5'>
            <div
              ref={setElementRef("target-ingredient")}
              className={`
                relative flex h-44 w-44 items-center justify-center
                overflow-hidden rounded-4xl bg-white shadow
              `}
            >
              <Image
                src={ingredient.imageSrc}
                alt={ingredient.imageAlt}
                width={180}
                height={180}
                className='relative z-10 h-36 w-36 object-contain'
                draggable={false}
              />

              {/* Orange half green border: progression */}
              {hasWrongShapeAttempt && (
                <span
                  className='animate-pulse pointer-events-none absolute inset-y-0 right-0  w-1/2
                    rounded-r-4xl
                    border-y-4 border-r-4 border-orange-500 border-dashed
                    transition-opacity duration-300 ease-out'
                />
              )}

              {shouldShowCorrectActionCheck && (
                <div className='absolute right-2 top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white shadow-lg ring-2 ring-white'>
                  <Check size={24} strokeWidth={4} />
                </div>
              )}

              {shouldShowWrongActionX && (
                <div className='absolute right-2 top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-lg ring-2 ring-white'>
                  <X size={24} strokeWidth={4} />
                </div>
              )}

              <span
                aria-hidden='true'
                className={`
                  pointer-events-none absolute inset-y-0 left-0 w-1/2
                  rounded-l-4xl border-y-4 border-l-4 border-green-500
                  transition-opacity duration-300 ease-out
                  ${hasCorrectColourMatch ? "opacity-100" : "opacity-0"}
                `}
              />
            </div>
          </div>
        </div>

        <PreviewCursor position={cursorPosition} imageSrc={cursorImage} speed={speed} />
      </section>
    </BasePreviewTutorialModal>
  );
}

function getIngredientMatchCursorPoint(
  step: IngredientMatchPreviewStep,
  points: Partial<Record<IngredientMatchTargetId, Point>>,
): Point {
  switch (step) {
    case "move-to-colour":
    case "click-colour":
      return points["colour-option"] ?? fallbackPoint;

    case "move-colour-to-target":
    case "click-target-after-colour":
    case "colour-done":
      return points["target-ingredient"] ?? fallbackPoint;

    case "move-to-wrong-shape":
    case "click-wrong-shape":
      return points["wrong-shape-option"] ?? fallbackPoint;

    case "move-wrong-shape-to-target":
    case "click-target-after-wrong-shape":
    case "wrong-shape-done":
      return points["target-ingredient"] ?? fallbackPoint;

    case "idle":
    default:
      return fallbackPoint;
  }
}

function getIngredientMatchArrows({
  points,
  ingredient,
  wrongShapeId,
  hasCorrectColourMatch,
  hasWrongShapeAttempt,
}: {
  points: Partial<Record<IngredientMatchTargetId, Point>>;
  ingredient: Ingredient;
  wrongShapeId: string;
  hasCorrectColourMatch: boolean;
  hasWrongShapeAttempt: boolean;
}) {
  const arrows: CompletedArrow[] = [];

  const colourPoint = points["colour-option"];
  const wrongShapePoint = points["wrong-shape-option"];
  const targetPoint = points["target-ingredient"];

  if (!targetPoint) return arrows;

  if (hasCorrectColourMatch && colourPoint) {
    arrows.push({
      id: "preview-correct-colour",
      type: "color",
      sourceId: ingredient.colorId,
      startX: colourPoint.x,
      startY: colourPoint.y,
      endX: targetPoint.x,
      endY: targetPoint.y,
      isCorrect: true,
    });
  }

  if (hasWrongShapeAttempt && wrongShapePoint) {
    arrows.push({
      id: "preview-wrong-shape",
      type: "shape",
      sourceId: wrongShapeId,
      startX: wrongShapePoint.x,
      startY: wrongShapePoint.y,
      endX: targetPoint.x,
      endY: targetPoint.y,
      isCorrect: false,
    });
  }

  return arrows;
}
