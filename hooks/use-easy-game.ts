"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ingredients } from "@/data/ingredients";
import { speak } from "@/lib/speak";

function toSpelling(name: string) {
  return name.toUpperCase().split("").join(" ");
}

export function useEasyGame() {
  const router = useRouter();
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isWrongColor, setIsWrongColor] = useState(false);
  const [clearSignal, setClearSignal] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropped, setIsDropped] = useState(false);

  const totalRounds = ingredients.length;
  const isGameComplete = roundIndex >= totalRounds;
  const activeIngredient = ingredients[roundIndex] ?? null;

  const shapeOptions = useMemo(() => {
    if (!activeIngredient) return [];
    const others = ingredients
      .filter((i) => i.id !== activeIngredient.id)
      .slice(0, 2);
    const all = [activeIngredient, ...others];
    return [...all].sort((a, b) =>
      (a.id + roundIndex).localeCompare(b.id + roundIndex)
    );
  }, [activeIngredient, roundIndex]);

  function advanceRound() {
    setTimeout(() => {
      setRoundIndex((prev) => prev + 1);
      setSelectedColorId(null);
      setIsRoundComplete(false);
      setIsDropped(false);
      setClearSignal((prev) => prev + 1);
    }, 2500);
  }

  function handleDrop() {
    if (isRoundComplete || isDropped || !activeIngredient) return;
    setIsDropped(true);
    speak(`Good! Now pick the right color for ${activeIngredient.name}!`);
  }

  function handleAddAndSay() {
    if (isRoundComplete || !activeIngredient) return;

    if (!isDropped) {
      speak("Drag the ingredient into the pot first!");
      return;
    }

    if (!selectedColorId) {
      speak("Pick a color first!");
      return;
    }

    if (selectedColorId !== activeIngredient.colorId) {
      setIsWrongColor(true);
      speak(`Oops! Try again. ${activeIngredient.name} is ${activeIngredient.color}!`);
      setTimeout(() => setIsWrongColor(false), 1500);
      return;
    }

    setIsRoundComplete(true);
    speak(`Great job! ${activeIngredient.name}! ${toSpelling(activeIngredient.name)}!`);
    advanceRound();
  }

  function goHome() {
    router.push("/home");
  }

  return {
    roundIndex,
    totalRounds,
    isGameComplete,
    activeIngredient,
    shapeOptions,
    selectedColorId,
    setSelectedColorId,
    isRoundComplete,
    isWrongColor,
    clearSignal,
    isDragOver,
    setIsDragOver,
    isDropped,
    handleDrop,
    handleAddAndSay,
    goHome,
  };
}
