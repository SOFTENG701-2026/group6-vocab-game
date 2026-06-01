"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ingredients } from "@/data/ingredients";
import type { PlayMode } from "@/domain/game-setup/game-setup-types";
import { speak } from "@/lib/speak";

function toSpelling(name: string) {
  return name.toUpperCase().split("").join(" ");
}

export function useEasyGame(playMode: PlayMode = "single") {
  const router = useRouter();
  const isFriendMode = playMode === "friend";
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [isWrongColor, setIsWrongColor] = useState(false);
  const [isWrongShape, setIsWrongShape] = useState(false);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDraggingIngredient, setIsDraggingIngredient] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [isRecallComplete, setIsRecallComplete] = useState(false);
  const [isRecallLocked, setIsRecallLocked] = useState(false);
  const [recallWrongId, setRecallWrongId] = useState<string | null>(null);
  const [recallCorrectSelected, setRecallCorrectSelected] = useState(false);
  const [isShapeReviewing, setIsShapeReviewing] = useState(false);
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
      setSelectedShapeId(null);
      setIsWrongColor(false);
      setIsWrongShape(false);
      setIsRoundComplete(false);
      setIsDropped(false);
      setIsRecallComplete(false);
      setIsRecallLocked(false);
      setRecallWrongId(null);
      setRecallCorrectSelected(false);
      setIsShapeReviewing(false);
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
    say(`What did we put in the pot? Let's choose one from the list!`);
  }

  function handleRecallSelect(ingredientId: string) {
    if (!activeIngredient || isRecallComplete || isRecallLocked) return;

    setIsRecallLocked(true);

    if (ingredientId === activeIngredient.id) {
      setRecallCorrectSelected(true);
      say(
        `Yay! We added ${activeIngredient.name}! It is ${activeIngredient.color} and ${activeIngredient.shape}.`,
        () => setTimeout(() => {
          setIsRecallComplete(true);
          say(`Now let's find ${activeIngredient.name}'s color together!`);
        }, 500)
      );
    } else {
      setRecallWrongId(ingredientId);
      say(
        `Hmm, let's look together. We added ${activeIngredient.name}! ${activeIngredient.name}！`,
        () => setTimeout(() => {
          setRecallWrongId(null);
          setIsRecallComplete(true);
          say(`Now let's find ${activeIngredient.name}'s color together!`);
        }, 500)
      );
    }
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

    triggerAmazingEffect();

    say(`Amazing! Let's say it together: ${activeIngredient.name} !`);
  }

  function triggerAmazingEffect() {
    setIsAmazingEffect(true);
    if (amazingTimeoutRef.current) clearTimeout(amazingTimeoutRef.current);
    amazingTimeoutRef.current = setTimeout(() => {
      setIsAmazingEffect(false);
      amazingTimeoutRef.current = null;
    }, 2000);
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

    function startShapeReview() {
      setIsShapeReviewing(true);

      if (isFriendMode) {
        return;
      }

      const shapeName = activeIngredient.shapeId;
      const msg = `Yay! Your buddy found the shape! It's ${shapeName}! Now let's try the next one!`;
      setCurrentSpeech(msg);
      setIsSpeaking(true);
      speak(msg, () => {
        setIsSpeaking(false);
        setIsShapeReviewing(false);
        advanceRound(700);
      });
    }

    function onGreetingDone() {
      setIsSpeaking(false);
      startShapeReview();
    }

    if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
    listenTimeoutRef.current = setTimeout(() => {
      setIsVoiceListening(false);
      setIsWaitingForVoiceToFinish(false);
      setIsPotGuideVisible(false);
      setIsDraggingIngredient(false);
      setIsAmazingEffect(false);

      if (isFriendMode) {
        setIsShapeReviewing(true);
        const promptMsg = `Great job! Player 2, can you find the ${activeIngredient.shape} shape?`;
        setCurrentSpeech(promptMsg);
        setIsSpeaking(true);
        speak(promptMsg, () => {
          setIsSpeaking(false);
          onGreetingDone();
        });
        listenTimeoutRef.current = null;
        return;
      }

      setIsRoundComplete(true);
      const greetMsg = `Great job! ${activeIngredient.name}! ${toSpelling(activeIngredient.name)}!`;
      setCurrentSpeech(greetMsg);
      setIsSpeaking(true);
      speak(greetMsg, onGreetingDone);
      listenTimeoutRef.current = null;
    }, 2500);
  }

  function handleSelectShape(selectedIngredientId: string) {
    if (!isFriendMode || isRoundComplete || !isShapeReviewing || !activeIngredient) return;

    setSelectedShapeId(selectedIngredientId);

    if (selectedIngredientId !== activeIngredient.id) {
      setIsWrongShape(true);
      say(`Almost there! ${activeIngredient.name} is a ${activeIngredient.shape} shape!`, () => {
        setTimeout(() => {
          setIsWrongShape(false);
          setSelectedShapeId(null);
        }, 400);
      });
      return;
    }

    setIsWrongShape(false);
    setIsRoundComplete(true);
    setIsShapeReviewing(false);
    if (isFriendMode) {
      triggerAmazingEffect();
    }
    const successMsg = isFriendMode
      ? `Great job! ${activeIngredient.name}! ${toSpelling(activeIngredient.name)}!`
      : `Great job! ${activeIngredient.name} is a ${activeIngredient.shape} shape!`;

    say(successMsg, () => {
      advanceRound(700);
    });
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
    isRecallComplete,
    recallWrongId,
    recallCorrectSelected,
    isRecallLocked,
    isShapeReviewing,
    selectedShapeId,
    isWrongShape,
    handleDrop,
    handleRecallSelect,
    handleIngredientDragStart,
    handleIngredientDragEnd,
    handleIngredientClick,
    handlePickColor,
    handleSelectShape,
    goHome,
    handleAddAndSay,
  };
}
