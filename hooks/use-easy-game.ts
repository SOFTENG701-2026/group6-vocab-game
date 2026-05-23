"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
  const [isWrongColor, setIsWrongColor] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDraggingIngredient, setIsDraggingIngredient] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isWaitingForVoiceToFinish, setIsWaitingForVoiceToFinish] = useState(false);
  const [isPotGuideVisible, setIsPotGuideVisible] = useState(false);
  const [isAmazingEffect, setIsAmazingEffect] = useState(false);
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const potGuideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const amazingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGameComplete = roundIndex >= ingredients.length;
  const activeIngredient = ingredients[roundIndex] ?? null;

  const say = useCallback((text: string, onDone?: () => void) => {
    setCurrentSpeech(text);
    setIsSpeaking(true);
    speak(text, () => {
      setIsSpeaking(false);
      onDone?.();
    });
  }, []);

  useEffect(() => {
    return () => {
      if (listenTimeoutRef.current) {
        clearTimeout(listenTimeoutRef.current);
        listenTimeoutRef.current = null;
      }

      if (potGuideTimeoutRef.current) {
        clearTimeout(potGuideTimeoutRef.current);
        potGuideTimeoutRef.current = null;
      }

      if (amazingTimeoutRef.current) {
        clearTimeout(amazingTimeoutRef.current);
        amazingTimeoutRef.current = null;
      }
    };
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

  function advanceRound(delayMs = 2500) {
    setTimeout(() => {
      setRoundIndex((prev) => prev + 1);
      setSelectedColorId(null);
      setIsWrongColor(false);
      setIsRoundComplete(false);
      setIsDropped(false);
      setIsVoiceListening(false);
      setIsWaitingForVoiceToFinish(false);
      setIsDraggingIngredient(false);
      setIsAmazingEffect(false);
    }, delayMs);
  }

  function handleDrop() {
    if (isRoundComplete || isDropped || !activeIngredient) return;
    setIsDropped(true);
    setIsPotGuideVisible(false);
    setIsDraggingIngredient(false);
    say(`Good! Now pick the right color for ${activeIngredient.name}!`);
  }

  function handleIngredientDragStart() {
    if (isRoundComplete || isDropped || !activeIngredient) return;
    setIsDraggingIngredient(true);
  }

  function handleIngredientDragEnd() {
    setIsDraggingIngredient(false);
  }

  function handleIngredientClick() {
    if (isRoundComplete || isDropped || !activeIngredient) return;

    setIsPotGuideVisible(true);

    if (potGuideTimeoutRef.current) clearTimeout(potGuideTimeoutRef.current);
    potGuideTimeoutRef.current = setTimeout(() => {
      setIsPotGuideVisible(false);
      potGuideTimeoutRef.current = null;
    }, 2200);
  }

  function handlePickColor(colorId: string) {
    if (isRoundComplete || !isDropped || !activeIngredient) return;

    setSelectedColorId(colorId);
    const isCorrectColor = colorId === activeIngredient.colorId;
    setIsWrongColor(!isCorrectColor);

    if (!isCorrectColor) {
      say(`Almost there! ${activeIngredient.name} is ${activeIngredient.color}!`, () => {
        setIsWrongColor(false);
        setSelectedColorId(null);
      });
      return;
    }

    setIsAmazingEffect(true);
    if (amazingTimeoutRef.current) clearTimeout(amazingTimeoutRef.current);
    amazingTimeoutRef.current = setTimeout(() => {
      setIsAmazingEffect(false);
      amazingTimeoutRef.current = null;
    }, 2000);

    say(`Amazing! Let's say it together: ${activeIngredient.name} !`);
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
      setIsWrongColor(true);
      say(`Oops! Try again. ${activeIngredient.name} is ${activeIngredient.color}!`, () => {
        setIsWrongColor(false);
        setSelectedColorId(null);
      });
      return;
    }

    setIsWaitingForVoiceToFinish(true);
    setIsVoiceListening(true);

    if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
    listenTimeoutRef.current = setTimeout(() => {
      setIsVoiceListening(false);
      setIsWaitingForVoiceToFinish(false);
      setIsRoundComplete(true);
      setIsPotGuideVisible(false);
      setIsDraggingIngredient(false);
      setIsAmazingEffect(false);
      setCurrentSpeech(`Great job! ${activeIngredient.name}! ${toSpelling(activeIngredient.name)}!`);
      setIsSpeaking(true);
      speak(`Great job! ${activeIngredient.name}! ${toSpelling(activeIngredient.name)}!`, () => {
        setIsSpeaking(false);
        advanceRound(500);
      });
      listenTimeoutRef.current = null;
    }, 2500);
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
    isDraggingIngredient,
    isDropped,
    currentSpeech,
    isSpeaking,
    isVoiceListening,
    isWaitingForVoiceToFinish,
    isPotGuideVisible,
    isAmazingEffect,
    isWrongColor,
    handleDrop,
    handleIngredientDragStart,
    handleIngredientDragEnd,
    handleIngredientClick,
    handlePickColor,
    goHome,
    handleAddAndSay,
  };
}
