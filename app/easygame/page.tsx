"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Mic, Ear, XCircle } from "lucide-react";
import { ingredients } from "@/data/ingredients";
import { useGameSetup } from "@/context/game-setup-context";
import MonsterBubble from "@/components/easygame/monster-bubble";
import ColorOptionCard from "@/components/easygame/color-option-card";
import ShapeOptionCard from "@/components/easygame/shape-option-card";
import { useEasyGame } from "@/hooks/use-easy-game";

const COLOR_OPTIONS = [
  { colorId: "red", label: "Red" },
  { colorId: "yellow", label: "Yellow" },
  { colorId: "orange", label: "Orange" },
];

const SHAPE_ICON_SRC: Record<string, string> = {
  circle: "/ingredients/easygame-shapes/circle-outline.svg",
  crescent: "/ingredients/easygame-shapes/crescent-outline.svg",
  triangle: "/ingredients/easygame-shapes/triangle-outline.svg",
  heart: "/ingredients/easygame-shapes/heart-outline.svg",
  cone: "/ingredients/easygame-shapes/cone-outline.svg",
};

const AMAZING_STARS = [
  { left: "18%", delay: "0ms", duration: "900ms" },
  { left: "26%", delay: "120ms", duration: "1100ms" },
  { left: "34%", delay: "220ms", duration: "1000ms" },
  { left: "50%", delay: "60ms", duration: "1200ms" },
  { left: "62%", delay: "180ms", duration: "980ms" },
  { left: "74%", delay: "260ms", duration: "1080ms" },
  { left: "82%", delay: "140ms", duration: "950ms" },
];

type AutoDemoCardState = {
  left: number;
  top: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  potLeft: number;
  potTop: number;
};

function getBtnClass(
  isFriendMode: boolean,
  isShapeReviewing: boolean,
  isRoundComplete: boolean,
  isWrongFeedback: boolean,
  selectedColorId: string | null,
): string {
  if (isRoundComplete) return "bg-green-500 scale-105";
  if (isWrongFeedback) return "bg-red-500";
  if (isFriendMode && isShapeReviewing) return "bg-green-500";
  if (selectedColorId) return "bg-purple-600";
  return "bg-gray-300 cursor-not-allowed";
}

function getProgressDotClass(idx: number, roundIndex: number): string {
  if (idx < roundIndex) return "border-green-400 opacity-100";
  if (idx === roundIndex) return "border-purple-500 ring-2 ring-purple-300 scale-110";
  return "border-gray-300 opacity-30 grayscale";
}

function getVoiceButtonText(
  isFriendMode: boolean,
  isShapeReviewing: boolean,
  isRoundComplete: boolean,
  isWrongFeedback: boolean,
  isVoiceListening: boolean,
  isWaitingForVoiceToFinish: boolean,
  selectedColorId: string | null,
): string {
  if (isRoundComplete) return "Well done! ✨";
  if (isWrongFeedback) return "Try again";
  if (isFriendMode && isShapeReviewing) return "Pick shape";
  if (isVoiceListening || isWaitingForVoiceToFinish) return "";
  return "say it";
}

function VoiceActionButton({
  isFriendMode,
  isShapeReviewing,
  selectedColorId,
  isRoundComplete,
  isWrongColor,
  isWrongShape,
  isVoiceListening,
  isWaitingForVoiceToFinish,
  onClick,
}: Readonly<{
  isFriendMode: boolean;
  isShapeReviewing: boolean;
  selectedColorId: string | null;
  isRoundComplete: boolean;
  isWrongColor: boolean;
  isWrongShape: boolean;
  isVoiceListening: boolean;
  isWaitingForVoiceToFinish: boolean;
  onClick: () => void;
}>) {
  const isCorrectSelection = Boolean(selectedColorId && !isWrongColor);
  const isWrongFeedback = isWrongColor || isWrongShape;
  const isWellDone = isRoundComplete;
  const isAnimated = Boolean(isCorrectSelection && !isFriendMode && !isWrongFeedback && !isVoiceListening && !isWaitingForVoiceToFinish && !isRoundComplete);
  const isListening = isVoiceListening || isWaitingForVoiceToFinish;
  const isShapePrompt = isFriendMode && isShapeReviewing && isCorrectSelection && !isRoundComplete;
  let buttonMotionClass = "";
  if (isWellDone) {
    buttonMotionClass = "animate-well-done-bounce";
  } else if (isAnimated) {
    buttonMotionClass = "animate-bounce";
  }
  let buttonIcon = <Mic className="w-8 h-8 text-white stroke-2" />;
  if (isWrongFeedback) {
    buttonIcon = <XCircle className="w-8 h-8 text-white stroke-2" />;
  } else if (isListening) {
    buttonIcon = (
      <div className="flex items-center justify-center gap-2 w-full">
        <Ear className="w-8 h-8 text-white stroke-2 animate-pulse" />
        <div className="flex items-end gap-1 h-7">
          <span className="w-1 bg-white/90 rounded-full animate-listening-wave" style={{ height: 8, animationDelay: "0ms" }} />
          <span className="w-1 bg-white/90 rounded-full animate-listening-wave" style={{ height: 14, animationDelay: "120ms" }} />
          <span className="w-1 bg-white/90 rounded-full animate-listening-wave" style={{ height: 10, animationDelay: "240ms" }} />
          <span className="w-1 bg-white/90 rounded-full animate-listening-wave" style={{ height: 16, animationDelay: "360ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isAnimated && <span className="text-xl -translate-y-1 animate-bounce">✨</span>}

      <button
        type="button"
        onClick={onClick}
        disabled={!isCorrectSelection || isRoundComplete || isVoiceListening || isWaitingForVoiceToFinish || isWrongFeedback || isShapePrompt}
        className={`
          flex items-center gap-2 px-8 py-4 rounded-full
          font-extrabold text-xl text-white transition-all shadow-lg
          ${getBtnClass(isFriendMode, isShapeReviewing, isRoundComplete, isWrongFeedback, selectedColorId)}
          ${buttonMotionClass}
          ${isWrongFeedback ? "animate-shake" : ""}
        `}
      >
        <span className={`flex items-center justify-center h-14 w-14 rounded-full ${isAnimated || isListening ? "animate-pulse" : ""}`}>
          {buttonIcon}
        </span>
        {!isListening && (
          <span className={`text-lg font-extrabold text-white ${isAnimated ? "animate-pulse" : ""}`}>
            {getVoiceButtonText(isFriendMode, isShapeReviewing, isRoundComplete, isWrongFeedback, isVoiceListening, isWaitingForVoiceToFinish, selectedColorId)}
          </span>
        )}
      </button>

      {isAnimated && <span className="text-xl -translate-y-1 animate-bounce">✨</span>}

      <style jsx>{`
        @keyframes listeningWave {
          0%,
          100% {
            transform: translateY(0) scaleY(0.7);
            opacity: 0.75;
          }
          25% {
            transform: translateY(-8px) scaleY(1.2);
            opacity: 1;
          }
          50% {
            transform: translateY(-3px) scaleY(0.9);
            opacity: 0.9;
          }
          75% {
            transform: translateY(-10px) scaleY(1.1);
            opacity: 1;
          }
        }

        :global(.animate-listening-wave) {
          animation: listeningWave 1.35s ease-in-out infinite;
          transform-origin: center bottom;
        }

        @keyframes wellDoneBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        :global(.animate-well-done-bounce) {
          animation: wellDoneBounce 0.5s ease-in-out 4;
        }
      `}</style>
    </div>
  );
}

// Allow this component to be slightly complex due to UI state orchestration.
/* eslint-disable sonarjs/cognitive-complexity, complexity */
export default function EasyGamePage() {
  const { playMode } = useGameSetup();
  const topSectionRef = useRef<HTMLDivElement | null>(null);
  const potButtonRef = useRef<HTMLButtonElement | null>(null);
  const ingredientCardRef = useRef<HTMLButtonElement | null>(null);
  const autoDemoFinishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const potJumpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoDemoCardState, setAutoDemoCardState] = useState<AutoDemoCardState | null>(null);
  const [isClickDemoPlaying, setIsClickDemoPlaying] = useState(false);
  const [isPotJumping, setIsPotJumping] = useState(false);
  const [showInitialHint, setShowInitialHint] = useState(true);
  const {
    roundIndex,
    isGameComplete,
    activeIngredient,
    shapeOptions,
    selectedColorId,
    isRoundComplete,
    isDragOver,
    isDraggingIngredient,
    isDropped,
    currentSpeech,
    isSpeaking,
    isVoiceListening,
    isWaitingForVoiceToFinish,
    
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
    
    handlePickColor,
    handleSelectShape,
    goHome,
    handleAddAndSay,
  } = useEasyGame(playMode);

  useEffect(() => {
    // Keep the initial hint visible until the user clicks the card.
    return () => {
      if (autoDemoFinishTimeoutRef.current) {
        clearTimeout(autoDemoFinishTimeoutRef.current);
        autoDemoFinishTimeoutRef.current = null;
      }
      if (potJumpTimeoutRef.current) {
        clearTimeout(potJumpTimeoutRef.current);
        potJumpTimeoutRef.current = null;
      }
    };
  }, []);

  // Highlight hints when user needs to act
  const shouldHighlightColor = isDropped && isRecallComplete && !selectedColorId && !isRoundComplete && !isWrongColor;
  const shouldHighlightShape = isDropped && isRecallComplete && isShapeReviewing;
  // Highlight the ingredient card when user is prompted to put it into the pot
  const shouldHighlightPut = Boolean(activeIngredient && !isDropped && !isDraggingIngredient && !isRoundComplete);
  const isColorPickerLocked = Boolean(selectedColorId && !isWrongColor);
  const autoDemoCurve = autoDemoCardState
    ? `path("M 0 0 Q ${Math.round(autoDemoCardState.dx * 0.22)} ${Math.round(-Math.max(120, Math.abs(autoDemoCardState.dy) * 0.2 + 100))}, ${Math.round(autoDemoCardState.dx)} ${Math.round(autoDemoCardState.dy)}")`
    : "";

  // autoplay/replay removed; kept click-driven demo only

  // Play a click-driven demo: animate the card into the pot and then call handleDrop()
  function playClickDemo() {
    if (!activeIngredient || isDropped || isRoundComplete || isClickDemoPlaying) return;

    const container = topSectionRef.current;
    const potButton = potButtonRef.current;
    const ingredientCard = ingredientCardRef.current;
    if (!container || !potButton || !ingredientCard) return;

    const containerRect = container.getBoundingClientRect();
    const potRect = potButton.getBoundingClientRect();
    const cardRect = ingredientCard.getBoundingClientRect();

    const startLeft = cardRect.left - containerRect.left;
    const startTop = cardRect.top - containerRect.top;
    const endLeft = potRect.left - containerRect.left + potRect.width / 2 - cardRect.width / 2;
    const endTop = potRect.top - containerRect.top + potRect.height / 2 - cardRect.height / 2;

    setAutoDemoCardState({
      left: startLeft,
      top: startTop,
      width: cardRect.width,
      height: cardRect.height,
      dx: endLeft - startLeft,
      dy: endTop - startTop,
      potLeft: potRect.left - containerRect.left + potRect.width * 0.5 - 14,
      potTop: potRect.top - containerRect.top + potRect.height * 0.08,
    });
    setIsClickDemoPlaying(true);
    setShowInitialHint(false);

    if (autoDemoFinishTimeoutRef.current) {
      clearTimeout(autoDemoFinishTimeoutRef.current);
    }

    autoDemoFinishTimeoutRef.current = setTimeout(() => {
      setAutoDemoCardState(null);
      setIsClickDemoPlaying(false);
      autoDemoFinishTimeoutRef.current = null;

      // then trigger the logical drop to advance the round
        setIsPotJumping(true);
        // after pot jump animation completes, stop jump and trigger drop
        if (potJumpTimeoutRef.current) clearTimeout(potJumpTimeoutRef.current);
        potJumpTimeoutRef.current = setTimeout(() => {
          setIsPotJumping(false);
          potJumpTimeoutRef.current = null;
          handleDrop();
        }, 760);
    }, 2000);
  }

  // Automatically trigger handleAddAndSay when the "Amazing" speech has finished
  useEffect(() => {
    const isReadyToSay = selectedColorId && !isWrongColor && !isRoundComplete && !isShapeReviewing && !isVoiceListening && !isWaitingForVoiceToFinish && !isSpeaking;
    if (!isReadyToSay) return;
    const timer = setTimeout(() => handleAddAndSay(), 0);
    return () => clearTimeout(timer);
  }, [selectedColorId, isWrongColor, isRoundComplete, isShapeReviewing, isVoiceListening, isWaitingForVoiceToFinish, isSpeaking, handleAddAndSay]);

  if (isGameComplete) {
    return (
      <main className="h-full flex items-center justify-center bg-gradient-to-b from-teal-300 to-yellow-200">
        <div className="text-center bg-white/80 rounded-4xl p-12 shadow-xl">
          <h1 className="text-4xl font-extrabold text-purple-700 mb-4">🎉 Amazing job!</h1>
          <p className="text-xl font-bold text-gray-700 mb-8">You found all the ingredients!</p>
          <button
            type="button"
            onClick={goHome}
            className="px-8 py-4 rounded-2xl bg-purple-600 text-white font-extrabold text-xl hover:bg-purple-700 transition-all"
          >
            Play Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex-1 min-h-0 grid grid-rows-[1fr_auto] bg-gradient-to-b from-teal-300 to-yellow-200 overflow-hidden">
      {isAmazingEffect && (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          {AMAZING_STARS.map((star) => (
            <span
              key={`${star.left}-${star.delay}`}
              className="absolute top-[16%] text-3xl animate-star-fall"
              style={{ left: star.left, animationDelay: star.delay, animationDuration: star.duration }}
            >
              ✨
            </span>
          ))}

          <span className="absolute left-[40%] top-[22%] text-5xl animate-firework-pop" style={{ animationDelay: "80ms" }}>
            🎆
          </span>
          <span className="absolute left-[57%] top-[24%] text-4xl animate-firework-pop" style={{ animationDelay: "220ms" }}>
            🎇
          </span>
        </div>
      )}

      {/* Top section */}
      <div ref={topSectionRef} className="relative grid grid-cols-[1fr_auto_1fr] gap-4 px-6 pt-4 min-h-0">

        {isClickDemoPlaying && autoDemoCardState && activeIngredient && (
          <div className="pointer-events-none absolute inset-0 z-40">
            <div
              className="absolute animate-auto-demo-glide"
              style={{
                left: autoDemoCardState.left,
                top: autoDemoCardState.top,
                width: autoDemoCardState.width,
                height: autoDemoCardState.height,
                transformOrigin: "center center",
                offsetPath: autoDemoCurve,
                offsetRotate: "auto",
                offsetAnchor: "50% 50%",
                offsetDistance: "0%",
              }}
            >
              <div className="relative flex flex-col items-center gap-2 bg-white/80 rounded-2xl shadow-xl w-full h-full select-none text-center px-4 border-2 border-dashed border-sky-300/80 ring-4 ring-sky-200/50 backdrop-blur-[1px]">
                <div className="w-full h-[70%] flex items-center justify-center">
                  <Image
                    src={activeIngredient.imageSrc}
                    alt={activeIngredient.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
                <div className="h-[30%] flex items-center justify-center px-2">
                  <p className="text-lg font-extrabold text-gray-800 truncate">{activeIngredient.name}</p>
                </div>
              </div>
            </div>

            <div
              className="absolute animate-pot-pulse pointer-events-none"
              style={{
                left: autoDemoCardState.potLeft,
                top: autoDemoCardState.potTop,
                width: 80,
                height: 80,
              }}
            >
              <div className="h-full w-full rounded-full bg-pink-200/45 blur-xl" />
            </div>
          </div>
        )}

        {/* Left: Monster */}
        <div className="flex items-start justify-start pt-4">
          <MonsterBubble message={currentSpeech} isSpeaking={isSpeaking} />
        </div>

        {/* Center: Progress + Pot + Button */}
        <div className="flex flex-col items-center justify-between py-4">
          {/* Progress indicator */}
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center flex-wrap">
              {ingredients.map((ing, idx) => (
                <div
                  key={ing.id}
                  className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all ${getProgressDotClass(idx, roundIndex)}`}
                >
                  <Image
                    src={ing.imageSrc}
                    alt={ing.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pot (drop target) */}
          <div className="relative flex items-center justify-center">
            {/* drag hints removed; click-only interaction */}

            <button
              type="button"
              ref={potButtonRef}
              className={`relative transition-all duration-200 ${isDragOver || isDraggingIngredient ? "scale-110 animate-bounce" : ""}`}
              aria-label="Magic soup pot"
            >
                <Image
                src="/assets/pot/pot.svg"
                alt="Magic soup pot"
                width={300}
                height={300}
                className={`relative z-10 h-[50vh] w-auto drop-shadow-xl transition-all ${isDragOver ? "drop-shadow-2xl brightness-110" : ""} ${isDropped ? "saturate-150" : ""} ${isPotJumping ? "animate-pot-jump" : ""}`}
                draggable={false}
              />
              {isRoundComplete && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 pointer-events-none -z-10">
                  <span className="text-4xl md:text-5xl opacity-90 animate-bounce drop-shadow-lg">✨</span>
                </div>
              )}
            </button>
          </div>

          {/* Submit button */}
          <VoiceActionButton
            isFriendMode={playMode === "friend"}
            isShapeReviewing={isShapeReviewing}
            selectedColorId={selectedColorId}
            isRoundComplete={isRoundComplete}
            isWrongColor={isWrongColor}
            isWrongShape={isWrongShape}
            isVoiceListening={isVoiceListening}
            isWaitingForVoiceToFinish={isWaitingForVoiceToFinish}
            onClick={handleAddAndSay}
          />
        </div>

        {/* Right: Draggable ingredient card */}
        <div className="flex flex-col gap-3 py-4 min-h-0 items-center">
            <div className="flex items-center gap-5">
            {showInitialHint && !isDropped && !isRoundComplete && !isClickDemoPlaying && activeIngredient && (
              <span className="text-7xl animate-bounce">👉</span>
            )}
            <button
              type="button"
              ref={ingredientCardRef}
              onClick={() => { playClickDemo(); }}
              className={`flex flex-col items-center gap-2 bg-white rounded-2xl shadow w-52 h-60 select-none transition-all text-center px-4 ${
                !isRoundComplete && !isDropped
                  ? "cursor-pointer hover:shadow-lg hover:scale-105"
                  : "cursor-default"
              } ${isWrongColor ? "animate-shake" : ""} ${shouldHighlightPut ? "ring-4 ring-yellow-300 ring-offset-2 ring-offset-white pulse-ring-yellow" : ""} ${isClickDemoPlaying ? "pointer-events-none opacity-0" : "opacity-100"}`}
              aria-label={activeIngredient?.name ?? "Ingredient"}
            >
              <div className="w-full h-[70%] flex items-center justify-center">
                <Image
                  src={activeIngredient?.imageSrc ?? ""}
                  alt={activeIngredient?.name ?? ""}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
              <div className="h-[30%] flex items-center justify-center px-2">
                <p className="text-lg font-extrabold text-gray-800 truncate">{activeIngredient?.name}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recall section: shown after drop, before recall complete */}
      <div className={`relative px-6 pb-4 transition-all duration-500 ${isDropped && !isRecallComplete ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden"}`}>
        {isDropped && !isRecallComplete && !recallWrongId && !recallCorrectSelected && (
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none z-20">
            <span className="text-7xl animate-bounce">👇</span>
          </div>
        )}
        <div className="relative bg-white/80 rounded-3xl px-6 py-8">
          <div className="flex justify-center gap-10">
            {shapeOptions.map((ing) => {
              const isCorrect = ing.id === activeIngredient?.id;
              const isWrong = ing.id === recallWrongId;
              return (
                <button
                  key={ing.id}
                  type="button"
                  disabled={isRecallLocked}
                  onClick={() => handleRecallSelect(ing.id)}
                  className={`flex flex-col items-center gap-2 px-10 py-6 rounded-2xl border-3 transition-all duration-300 shadow
                    ${isWrong ? "border-red-400 bg-red-50" : ""}
                    ${isCorrect && (recallWrongId !== null || recallCorrectSelected) ? "border-green-400 bg-green-50 scale-110 ring-4 ring-green-300" : ""}
                    ${!isWrong && !(isCorrect && (recallWrongId !== null || recallCorrectSelected)) ? "border-transparent bg-white hover:border-purple-300 hover:scale-105" : ""}
                    ${isRecallLocked ? "cursor-not-allowed opacity-70" : ""}
                  `}
                >
                  {/* <Image src={ing.imageSrc} alt={ing.name} width={64} height={64} className="w-16 h-16 object-contain" draggable={false} />
                  <span className="text-sm font-extrabold text-gray-700">{ing.name}</span> */}
                  <span className="text-2xl font-extrabold text-gray-800 tracking-wide">{ing.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom section: shown only after recall is complete */}
      <div className={`grid grid-cols-2 gap-4 px-6 pb-4 transition-all duration-500 ${isDropped && isRecallComplete ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        {/* Player color picker */}
        <div className={`bg-white/70 rounded-3xl px-6 py-4 relative ${isWrongColor ? "animate-shake" : ""} ${shouldHighlightColor ? "pop-bounce" : ""}`}>
          {isDropped && !isRoundComplete && !selectedColorId && (
            <div className="absolute -top-18 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
              <span className="text-7xl animate-bounce">👇</span>
            </div>
          )}
          {/* Outline highlight only when color selection is needed (no badge). */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">👑</span>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Player 1</p>
              <p className="text-base font-extrabold text-purple-700">Pick a color!</p>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            {COLOR_OPTIONS.map((opt) => (
              <ColorOptionCard
                key={opt.colorId}
                {...opt}
                isSelected={selectedColorId === opt.colorId}
                isWrong={isWrongColor && selectedColorId === opt.colorId}
                disabled={isColorPickerLocked}
                onSelect={(colorId) => {
                  handlePickColor(colorId);
                }}
              />
            ))}
          </div>
        </div>

        {/* Bot shape picker */}
        <div className={`bg-white/70 rounded-3xl px-6 py-4 relative ${isWrongShape ? "animate-shake" : ""} ${shouldHighlightShape ? "pop-bounce" : ""}`}>
          {isShapeReviewing && (
            <div className="absolute -top-18 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none">
              <span className="text-7xl animate-bounce">👇</span>
            </div>
          )}
          {/* Outline highlight only when shape review is active (no badge). */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🐻</span>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                {playMode === "friend" ? "Player 2" : "Helper Bot"}
              </p>
              <p className="text-base font-extrabold text-green-700">
                {playMode === "friend" ? "Pick a shape!" : "Bot picks a shape!"}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            {shapeOptions.map((ingredient) => (
              <ShapeOptionCard
                key={ingredient.id}
                label={ingredient.shapeId}
                imageSrc={SHAPE_ICON_SRC[ingredient.shapeId] ?? ingredient.imageSrc}
                isBotSelected={playMode !== "friend" && ingredient.id === activeIngredient?.id}
                isInteractive={playMode === "friend" && isShapeReviewing}
                isSelected={selectedShapeId === ingredient.id}
                isWrong={isWrongShape && selectedShapeId === ingredient.id}
                onSelect={() => {
                  handleSelectShape(ingredient.id);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes starFall {
          0% {
            transform: translateY(-20px) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(130px) scale(1) rotate(120deg);
            opacity: 0;
          }
        }

        @keyframes fireworkPop {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          40% {
            transform: scale(1.15);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0;
          }
        }

        :global(.animate-star-fall) {
          animation-name: starFall;
          animation-timing-function: ease-out;
          animation-fill-mode: both;
        }

        :global(.animate-firework-pop) {
          animation: fireworkPop 900ms ease-out both;
        }

        @keyframes autoDemoGlide {
          0% {
            offset-distance: 0%;
            transform: scale(0.96) rotate(-6deg);
            opacity: 1;
          }
          50% {
            offset-distance: 58%;
            transform: scale(1.12) rotate(6deg);
            opacity: 1;
          }
          80% {
            offset-distance: 90%;
            transform: scale(0.98) rotate(2deg);
            opacity: 1;
          }
          100% {
            offset-distance: 100%;
            transform: scale(0.86) rotate(10deg);
            opacity: 0;
          }
        }

        :global(.animate-auto-demo-glide) {
          animation: autoDemoGlide 2.2s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
          will-change: offset-distance, opacity, transform;
          transform: translateZ(0);
        }

        @keyframes autoDemoPulse {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          35% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }

        :global(.animate-auto-demo-pulse) {
          animation: autoDemoPulse 1.8s ease-out both;
        }

        @keyframes potPulseOnce {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          35% {
            transform: scale(1.1);
            filter: brightness(1.15);
          }
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
        }

        :global(.animate-pot-pulse) {
          animation: potPulseOnce 1.8s ease-out both;
        }

        @keyframes potJump {
          0% { transform: translateY(0) scale(1); filter: brightness(1); }
          18% { transform: translateY(-28px) scale(1.06); filter: brightness(1.12); }
          38% { transform: translateY(0) scale(0.98); filter: brightness(0.98); }
          58% { transform: translateY(-16px) scale(1.04); filter: brightness(1.06); }
          78% { transform: translateY(0) scale(1); filter: brightness(1); }
          100% { transform: translateY(0) scale(1); filter: brightness(1); }
        }

        :global(.animate-pot-jump) {
          animation: potJump 760ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* Pulse ring animations for different ring colors (outer-only, inner content unchanged) */
        @keyframes ringPulseYellow {
          0% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
          50% { box-shadow: 0 0 0 10px rgba(245,158,11,0.22); }
          100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
        }
        @keyframes ringPulsePurple {
          0% { box-shadow: 0 0 0 0 rgba(168,85,247,0); }
          50% { box-shadow: 0 0 0 10px rgba(168,85,247,0.18); }
          100% { box-shadow: 0 0 0 0 rgba(168,85,247,0); }
        }
        @keyframes ringPulseGreen {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
          50% { box-shadow: 0 0 0 10px rgba(34,197,94,0.18); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }

        :global(.pulse-ring-yellow) { animation: ringPulseYellow 1.8s ease-in-out infinite; }
        :global(.pulse-ring-purple) { animation: ringPulsePurple 1.8s ease-in-out infinite; }
        :global(.pulse-ring-green) { animation: ringPulseGreen 1.8s ease-in-out infinite; }

        /* Subtle pop bounce used instead of outer ring for color/shape panels */
        @keyframes popBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.03); }
        }
        :global(.pop-bounce) { animation: popBounce 1.6s ease-in-out infinite; }
      `}</style>
    </main>
  );
}
