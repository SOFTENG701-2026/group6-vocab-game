import { useMemo, useRef, useState } from "react";
import { Ingredient } from "@/data/ingredients";
import { colorOptions, shapeOptions } from "@/domain/ingredients-match-options";

import {
  ColorOption,
  ShapeOption,
  CompletedArrow,
  OptionType,
  PendingSelection
} from "@/domain/ingredients-match-type";

type UseIngredientMatchGameProps = {
  ingredient: Ingredient;
  onComplete?: () => void;
};

export function useIngredientMatchGame({
  ingredient,
  onComplete
}: UseIngredientMatchGameProps) {
  //State for making connection lines between color/shape - ingredient
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

  //Utilised for
  const isColorMatched = matchedColorId === ingredient.colorId;
  const isShapeMatched = matchedShapeId === ingredient.shapeId;

  const visibleColorOptions = useMemo(() => {
    const correctColor = colorOptions.find(
      (color) => color.id === ingredient.colorId
    );

    const incorrectColors = colorOptions.filter(
      (color) => color.id !== ingredient.colorId
    );

    return [correctColor, ...incorrectColors]
      .filter((color): color is ColorOption => Boolean(color))
      .slice(0, 3);
  }, [ingredient.colorId]);

  const visibleShapeOptions = useMemo(() => {
    const correctShape = shapeOptions.find(
      (shape) => shape.id === ingredient.shapeId
    );

    const incorrectShapes = shapeOptions.filter(
      (shape) => shape.id !== ingredient.shapeId
    );

    return [correctShape, ...incorrectShapes]
      .filter((shape): shape is ShapeOption => Boolean(shape))
      .slice(0, 3);
  }, [ingredient.shapeId]);

  function getNextPrompt(
    nextMatchedColorId: string | null,
    nextMatchedShapeId: string | null
  ) {
    const hasCorrectColor = nextMatchedColorId === ingredient.colorId;
    const hasCorrectShape = nextMatchedShapeId === ingredient.shapeId;

    if (hasCorrectColor && hasCorrectShape) {
      return `Great job! You matched the ${ingredient.name}.`;
    }

    if (hasCorrectColor && !hasCorrectShape) {
      return "Nice! Now match the shape.";
    }

    if (!hasCorrectColor && hasCorrectShape) {
      return "Nice! Now match the colour.";
    }

    return "Choose the matching colour or shape, then tap the ingredient.";
  }

  function handleOptionClick(
    event: React.MouseEvent<HTMLButtonElement>,
    type: OptionType,
    id: string
  ) {
    if (!containerRef.current) return;

    if (type === "color" && isColorMatched && id !== matchedColorId) {
      return;
    }

    if (type === "shape" && isShapeMatched && id !== matchedShapeId) {
      return;
    }

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
      if (isColorMatched && !isShapeMatched) {
        setFeedbackMessage("Choose a shape, then tap the ingredient.");
        return;
      }

      if (!isColorMatched && isShapeMatched) {
        setFeedbackMessage("Choose a colour, then tap the ingredient.");
        return;
      }

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
      setFeedbackMessage(
        pendingSelection.type === "color"
          ? "Almost! Try another colour."
          : "Almost! Try another shape."
      );

      setPendingSelection(null);
      return;
    }

    setPendingSelection(null);

    setFeedbackMessage(getNextPrompt(nextMatchedColorId, nextMatchedShapeId));

    const isMinigameComplete =
      nextMatchedColorId === ingredient.colorId &&
      nextMatchedShapeId === ingredient.shapeId;

    if (isMinigameComplete) {
      onComplete?.();
    }
  }

  return {
    containerRef,
    ingredientRef,
    completedArrows,
    pendingSelection,
    matchedColorId,
    matchedShapeId,
    isColorMatched,
    isShapeMatched,
    visibleColorOptions,
    visibleShapeOptions,
    feedbackMessage,
    handleOptionClick,
    handleIngredientClick
  };
}
