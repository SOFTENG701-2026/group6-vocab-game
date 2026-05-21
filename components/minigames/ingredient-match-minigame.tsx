"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Ingredient } from "@/data/ingredients";

type IngredientMatchMinigameProps = {
  ingredient: Ingredient;
  onComplete?: () => void;
};

type OptionType = "color" | "shape";

type PendingSelection = {
  type: OptionType;
  id: string;
  startX: number;
  startY: number;
} | null;

type CompletedArrow = {
  id: string;
  type: OptionType;
  sourceId: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isCorrect: boolean;
};

const colorOptions = [
  { id: "red", label: "Red", value: "#EF4444" },
  { id: "yellow", label: "Yellow", value: "#FACC15" },
  { id: "orange", label: "Orange", value: "#FB923C" }
];

const shapeOptions = [
  { id: "circle", label: "Circle" },
  { id: "crescent", label: "Crescent" },
  { id: "triangle", label: "Triangle" },
  { id: "heart", label: "Heart" },
  { id: "cone", label: "Cone" }
];

export default function IngredientMatchMinigame({
  ingredient,
  onComplete
}: IngredientMatchMinigameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ingredientRef = useRef<HTMLButtonElement | null>(null);

  const [pendingSelection, setPendingSelection] =
    useState<PendingSelection>(null);

  const [completedArrows, setCompletedArrows] = useState<CompletedArrow[]>([]);
  const [matchedColorId, setMatchedColorId] = useState<string | null>(null);
  const [matchedShapeId, setMatchedShapeId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Choose the matching colour or shape, then tap the ingredient."
  );

  const visibleShapeOptions = useMemo(() => {
    const correctShape = shapeOptions.find(
      (shape) => shape.id === ingredient.shapeId
    );

    const incorrectShapes = shapeOptions.filter(
      (shape) => shape.id !== ingredient.shapeId
    );

    return [correctShape, ...incorrectShapes].filter(Boolean).slice(0, 3);
  }, [ingredient.shapeId]);

  const visibleColorOptions = useMemo(() => {
    const correctColor = colorOptions.find(
      (color) => color.id === ingredient.colorId
    );

    const incorrectColors = colorOptions.filter(
      (color) => color.id !== ingredient.colorId
    );

    return [correctColor, ...incorrectColors].filter(Boolean).slice(0, 3);
  }, [ingredient.colorId]);

  function handleOptionClick(
    event: React.MouseEvent<HTMLButtonElement>,
    type: OptionType,
    id: string
  ) {
    if (!containerRef.current) return;

    const optionRect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const startX = optionRect.left + optionRect.width / 2 - containerRect.left;
    const startY = optionRect.top + optionRect.height / 2 - containerRect.top;

    setPendingSelection({
      type,
      id,
      startX,
      startY
    });

    setFeedbackMessage("Great! Now tap the ingredient in the middle.");
  }

  function handleIngredientClick() {
    if (!pendingSelection || !containerRef.current || !ingredientRef.current) {
      setFeedbackMessage("Choose a colour or shape first.");
      return;
    }

    const ingredientRect = ingredientRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const endX =
      ingredientRect.left + ingredientRect.width / 2 - containerRect.left;

    const endY =
      ingredientRect.top + ingredientRect.height / 2 - containerRect.top;

    const isCorrect =
      (pendingSelection.type === "color" &&
        pendingSelection.id === ingredient.colorId) ||
      (pendingSelection.type === "shape" &&
        pendingSelection.id === ingredient.shapeId);

    const newArrow: CompletedArrow = {
      id: crypto.randomUUID(),
      type: pendingSelection.type,
      sourceId: pendingSelection.id,
      startX: pendingSelection.startX,
      startY: pendingSelection.startY,
      endX,
      endY,
      isCorrect
    };

    setCompletedArrows((previousArrows) => [
      ...previousArrows.filter((arrow) => arrow.type !== pendingSelection.type),
      newArrow
    ]);

    let nextMatchedColorId = matchedColorId;
    let nextMatchedShapeId = matchedShapeId;

    if (isCorrect && pendingSelection.type === "color") {
      nextMatchedColorId = pendingSelection.id;
      setMatchedColorId(pendingSelection.id);
    }

    if (isCorrect && pendingSelection.type === "shape") {
      nextMatchedShapeId = pendingSelection.id;
      setMatchedShapeId(pendingSelection.id);
    }

    if (!isCorrect) {
      setFeedbackMessage("Almost! Try another one.");
    } else {
      setFeedbackMessage("Nice match!");
    }

    setPendingSelection(null);

    const isMinigameComplete =
      nextMatchedColorId === ingredient.colorId &&
      nextMatchedShapeId === ingredient.shapeId;

    if (isMinigameComplete) {
      setFeedbackMessage(`Great job! You matched the ${ingredient.name}.`);
      onComplete?.();
    }
  }

  return (
    <div
      ref={containerRef}
      className='
        relative h-full min-h-105 w-full overflow-hidden
        rounded-4xl bg-sky-200/50 p-8 text-black
      '
    >
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

        {completedArrows.map((arrow) => (
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

      <div className='relative z-10 flex h-full min-h-105 items-center justify-between gap-8'>
        <div className='flex flex-col gap-4'>
          {visibleColorOptions.map((color) => {
            if (!color) return null;

            const isSelected =
              pendingSelection?.type === "color" &&
              pendingSelection.id === color.id;

            const isMatched = matchedColorId === color.id;

            return (
              <button
                key={color.id}
                type='button'
                onClick={(event) => handleOptionClick(event, "color", color.id)}
                className={`
                  h-20 w-20 rounded-full border-4 shadow
                  transition-transform hover:scale-105
                  ${
                    isSelected || isMatched ? "border-blue-500" : "border-white"
                  }
                `}
                style={{ backgroundColor: color.value }}
                aria-label={color.label}
              />
            );
          })}
        </div>

        <div className='flex flex-col items-center gap-4'>
          <button
            ref={ingredientRef}
            type='button'
            onClick={handleIngredientClick}
            className='
              flex h-44 w-44 items-center justify-center
              rounded-4xl bg-white shadow-lg
              transition-transform hover:scale-105
            '
          >
            <Image
              src={ingredient.imageSrc}
              alt={ingredient.imageAlt}
              width={150}
              height={150}
              className='h-36 w-36 object-contain'
              draggable={false}
            />
          </button>

          <p className='max-w-xs rounded-2xl bg-white/90 px-4 py-3 text-center text-sm font-bold text-gray-700 shadow'>
            {feedbackMessage}
          </p>
        </div>

        <div className='flex flex-col gap-4'>
          {visibleShapeOptions.map((shape) => {
            if (!shape) return null;

            const isSelected =
              pendingSelection?.type === "shape" &&
              pendingSelection.id === shape.id;

            const isMatched = matchedShapeId === shape.id;

            return (
              <button
                key={shape.id}
                type='button'
                onClick={(event) => handleOptionClick(event, "shape", shape.id)}
                className={`
                  h-20 w-28 rounded-3xl border-4 bg-white
                  text-base font-extrabold shadow
                  transition-transform hover:scale-105
                  ${
                    isSelected || isMatched ? "border-blue-500" : "border-white"
                  }
                `}
              >
                {shape.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
