"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Mic, Ear, XCircle } from "lucide-react";
import { ingredients } from "@/data/ingredients";
import MonsterBubble from "@/components/easygame/monster-bubble";
import ColorOptionCard from "@/components/easygame/color-option-card";
import ShapeOptionCard from "@/components/easygame/shape-option-card";
import { useEasyGame } from "@/hooks/use-easy-game";

const COLOR_OPTIONS = [
  { colorId: "red", label: "Red" },
  { colorId: "yellow", label: "Yellow" },
  { colorId: "orange", label: "Orange" },
];

const AMAZING_STARS = [
  { left: "18%", delay: "0ms", duration: "900ms" },
  { left: "26%", delay: "120ms", duration: "1100ms" },
  { left: "34%", delay: "220ms", duration: "1000ms" },
  { left: "50%", delay: "60ms", duration: "1200ms" },
  { left: "62%", delay: "180ms", duration: "980ms" },
  { left: "74%", delay: "260ms", duration: "1080ms" },
  { left: "82%", delay: "140ms", duration: "950ms" },
];

function getBtnClass(isRoundComplete: boolean, isWrongColor: boolean, selectedColorId: string | null): string {
  if (isRoundComplete) return "bg-green-500 scale-105";
  if (isWrongColor) return "bg-red-500";
  if (selectedColorId) return "bg-purple-600";
  return "bg-gray-300 cursor-not-allowed";
}

function getProgressDotClass(idx: number, roundIndex: number): string {
  if (idx < roundIndex) return "border-green-400 opacity-100";
  if (idx === roundIndex) return "border-purple-500 ring-2 ring-purple-300 scale-110";
  return "border-gray-300 opacity-30 grayscale";
}

function getVoiceButtonText(
  isRoundComplete: boolean,
  isWrongColor: boolean,
  isVoiceListening: boolean,
  isWaitingForVoiceToFinish: boolean,
  selectedColorId: string | null,
): string {
  if (isRoundComplete) return "Well done! ✨";
  if (isWrongColor) return "Try again";
  if (isVoiceListening || isWaitingForVoiceToFinish) return "";
  return "say it";
}

function VoiceActionButton({
  selectedColorId,
  isRoundComplete,
  isWrongColor,
  isVoiceListening,
  isWaitingForVoiceToFinish,
  onClick,
}: Readonly<{
  selectedColorId: string | null;
  isRoundComplete: boolean;
  isWrongColor: boolean;
  isVoiceListening: boolean;
  isWaitingForVoiceToFinish: boolean;
  onClick: () => void;
}>) {
  const isCorrectSelection = Boolean(selectedColorId && !isWrongColor);
  const isWellDone = isRoundComplete;
  const isAnimated = Boolean(isCorrectSelection && !isVoiceListening && !isWaitingForVoiceToFinish && !isRoundComplete);
  const isListening = isVoiceListening || isWaitingForVoiceToFinish;
  let buttonMotionClass = "";
  if (isWellDone) {
    buttonMotionClass = "animate-well-done-bounce";
  } else if (isAnimated) {
    buttonMotionClass = "animate-bounce";
  }
  let buttonIcon = <Mic className="w-8 h-8 text-white stroke-2" />;
  if (isWrongColor) {
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
        disabled={!isCorrectSelection || isRoundComplete || isVoiceListening || isWaitingForVoiceToFinish || isWrongColor}
        className={`
          flex items-center gap-2 px-8 py-4 rounded-full
          font-extrabold text-xl text-white transition-all shadow-lg
          ${getBtnClass(isRoundComplete, isWrongColor, selectedColorId)}
          ${buttonMotionClass}
          ${isWrongColor ? "animate-shake" : ""}
        `}
      >
        <span className={`flex items-center justify-center h-14 w-14 rounded-full ${isAnimated || isListening ? "animate-pulse" : ""}`}>
          {buttonIcon}
        </span>
        {!isListening && (
          <span className={`text-lg font-extrabold text-white ${isAnimated ? "animate-pulse" : ""}`}>
            {getVoiceButtonText(isRoundComplete, isWrongColor, isVoiceListening, isWaitingForVoiceToFinish, selectedColorId)}
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

export default function EasyGamePage() {
  const {
    roundIndex,
    isGameComplete,
    activeIngredient,
    shapeOptions,
    selectedColorId,
    handlePickColor,
    isRoundComplete,
    isDragOver,
    setIsDragOver,
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
    isShapeReviewing,
    handleDrop,
    handleRecallSelect,
    handleIngredientDragStart,
    handleIngredientDragEnd,
    handleAddAndSay,
    goHome,
  } = useEasyGame();

  // Automatically trigger handleAddAndSay when the color is selected
  useEffect(() => {
    const isReadyToSay = selectedColorId && !isWrongColor && !isRoundComplete && !isVoiceListening && !isWaitingForVoiceToFinish;
    if (!isReadyToSay) return;
    const timer = setTimeout(() => handleAddAndSay(), 1000);
    return () => clearTimeout(timer);
  }, [selectedColorId, isWrongColor, isRoundComplete, isVoiceListening, isWaitingForVoiceToFinish, handleAddAndSay]);

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
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 px-6 pt-4 min-h-0">

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
            {isDraggingIngredient && !isDropped && !isRoundComplete && (
              <div className="absolute left-[-4.5rem] top-1/2 -translate-y-1/2 pointer-events-none animate-bounce">
                <span className="text-7xl drop-shadow-lg">👉</span>
              </div>
            )}

            <button
              type="button"
              className={`relative transition-all duration-200 ${isDragOver || isDraggingIngredient ? "scale-110 animate-bounce" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleDrop(); }}
              aria-label="Magic soup pot"
            >
              <Image
                src="/assets/pot/pot.svg"
                alt="Magic soup pot"
                width={300}
                height={300}
                className={`relative z-10 h-[50vh] w-auto drop-shadow-xl transition-all ${isDragOver ? "drop-shadow-2xl brightness-110" : ""} ${isDropped ? "saturate-150" : ""}`}
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
            selectedColorId={selectedColorId}
            isRoundComplete={isRoundComplete}
            isWrongColor={isWrongColor}
            isVoiceListening={isVoiceListening}
            isWaitingForVoiceToFinish={isWaitingForVoiceToFinish}
            onClick={handleAddAndSay}
          />
        </div>

        {/* Right: Draggable ingredient card */}
        <div className="flex flex-col gap-3 py-4 min-h-0 items-center">
          <div className="flex items-center gap-5">
            {!isDraggingIngredient && !isDropped && !isRoundComplete && (
              <span className="text-7xl animate-bounce">👉</span>
            )}
            <button
              type="button"
              draggable={true}
              onDragStart={(e) => { e.dataTransfer.setData("text/plain", "ingredient"); e.dataTransfer.effectAllowed = "move"; handleIngredientDragStart(); }}
              onDragEnd={handleIngredientDragEnd}
              className={`flex items-center gap-4 bg-white rounded-2xl px-5 pr-12 py-4 shadow w-fit select-none transition-all text-left ${
                !isRoundComplete && !isDropped
                  ? "cursor-grab active:cursor-grabbing hover:shadow-lg hover:scale-105"
                  : "cursor-default"
              } ${isWrongColor ? "animate-shake" : ""}`}
              aria-label={activeIngredient?.name ?? "Ingredient"}
            >
              <Image
                src={activeIngredient?.imageSrc ?? ""}
                alt={activeIngredient?.name ?? ""}
                width={112}
                height={112}
                className="w-28 h-28 object-contain"
                draggable={false}
              />
              <div>
                <p className="text-base font-extrabold text-gray-800">{activeIngredient?.name}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recall section: shown after drop, before recall complete */}
      <div className={`px-6 pb-4 transition-all duration-500 ${isDropped && !isRecallComplete ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden"}`}>
        <div className="relative bg-white/80 rounded-3xl px-6 py-8">
          {isDropped && !isRecallComplete && !recallWrongId && !recallCorrectSelected && (
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none">
              <span className="text-7xl animate-bounce">👇</span>
            </div>
          )}
          <div className="flex justify-center gap-10">
            {shapeOptions.map((ing) => {
              const isCorrect = ing.id === activeIngredient?.id;
              const isWrong = ing.id === recallWrongId;
              return (
                <button
                  key={ing.id}
                  type="button"
                  onClick={() => handleRecallSelect(ing.id)}
                  className={`flex flex-col items-center gap-2 px-10 py-6 rounded-2xl border-3 transition-all duration-300 shadow
                    ${isWrong ? "border-red-400 bg-red-50" : ""}
                    ${isCorrect && (recallWrongId !== null || recallCorrectSelected) ? "border-green-400 bg-green-50 scale-110 ring-4 ring-green-300" : ""}
                    ${!isWrong && !(isCorrect && (recallWrongId !== null || recallCorrectSelected)) ? "border-transparent bg-white hover:border-purple-300 hover:scale-105" : ""}
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
        <div className={`bg-white/70 rounded-3xl px-6 py-4 relative ${isWrongColor ? "animate-shake" : ""}`}>
          {isDropped && !isRoundComplete && !selectedColorId && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
              <span className="text-7xl animate-bounce">👇</span>
            </div>
          )}
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
                onSelect={handlePickColor}
              />
            ))}
          </div>
        </div>

        {/* Bot shape picker */}
        <div className="bg-white/70 rounded-3xl px-6 py-4 relative">
          {isShapeReviewing && (
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none">
              <span className="text-7xl animate-bounce">👇</span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🐻</span>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Helper Bot</p>
              <p className="text-base font-extrabold text-green-700">Bot picks a shape!</p>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            {shapeOptions.map((ingredient) => (
              <ShapeOptionCard
                key={ingredient.id}
                label={ingredient.shapeId}
                imageSrc={ingredient.imageSrc}
                isBotSelected={ingredient.id === activeIngredient?.id}
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
      `}</style>
    </main>
  );
}
