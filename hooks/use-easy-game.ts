"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isGameComplete = roundIndex >= ingredients.length;
  const activeIngredient = ingredients[roundIndex] ?? null;

  const say = useCallback((text: string) => {
    setCurrentSpeech(text);
    setIsSpeaking(true);
    speak(text, () => setIsSpeaking(false));
  }, []);

  useEffect(() => {
    if (activeIngredient) {
      say(`Let's put ${activeIngredient.name} into the pot!`);
    }
  }, [activeIngredient, say]);

  const shapeOptions = useMemo(() => {
    if (!activeIngredient) return [];
    const others = ingredients
      .filter((i) => i.id !== activeIngredient.id)
      .slice(0, 2);
    return [activeIngredient, ...others].sort((a, b) =>
      (a.id + roundIndex).localeCompare(b.id + roundIndex)
    );
  }, [activeIngredient, roundIndex]);

  function advanceRound() {
    setTimeout(() => {
      setRoundIndex((prev) => prev + 1);
      setSelectedColorId(null);
      setIsRoundComplete(false);
      setIsDropped(false);
    }, 2500);
  }

  function handleDrop() {
    if (isRoundComplete || isDropped || !activeIngredient) return;
    setIsDropped(true);
    say(`Good! Now pick the right color for ${activeIngredient.name}!`);
  }

  function handlePickColor(colorId: string) {
    if (isRoundComplete || !isDropped || !activeIngredient) return;

    setSelectedColorId(colorId);

    if (colorId !== activeIngredient.colorId) {
      say(`Almost there! Let’s find ${activeIngredient.name} together!`);
      setTimeout(() => setSelectedColorId(null), 1800);
      return;
    }

    // Correct!
    setIsRoundComplete(true);
    say(`Amazing! ${activeIngredient.name} is ${activeIngredient.color}!`);
    advanceRound();
  }

  function handleAddAndSay() {
    if (isRoundComplete || !activeIngredient) return;

    if (!isDropped) {
      say("Drag the ingredient into the pot first!");
      return;
    }

    if (!selectedColorId) {
      say("Pick a color first!");
      return;
    }

    if (selectedColorId !== activeIngredient.colorId) {
      say(`Oops! Try again. ${activeIngredient.name} is ${activeIngredient.color}!`);
      return;
    }

    setIsRoundComplete(true);
    say(`Great job! ${activeIngredient.name}! ${toSpelling(activeIngredient.name)}!`);
    advanceRound();
  }

  function goHome() {
    router.push("/home");
  }

  return {
    roundIndex,
    isGameComplete,
    activeIngredient,
    shapeOptions,
    selectedColorId,
    isRoundComplete,
    isDragOver,
    setIsDragOver,
    isDropped,
    currentSpeech,
    isSpeaking,
    handleDrop,
    handlePickColor,
    goHome,
    handleAddAndSay,
  };
}
