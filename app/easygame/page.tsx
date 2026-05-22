"use client";

import Image from "next/image";
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
  const isAnimated = Boolean(isCorrectSelection && !isVoiceListening && !isWaitingForVoiceToFinish);
  const isListening = isVoiceListening || isWaitingForVoiceToFinish;
  let buttonIcon = <Mic className="w-8 h-8 text-white stroke-2" />;
  if (isWrongColor) {
    buttonIcon = <XCircle className="w-8 h-8 text-white stroke-2" />;
  } else if (isListening) {
    buttonIcon = (
      <div className="flex items-center justify-center gap-2 w-full">
        <Ear className="w-8 h-8 text-white stroke-2 animate-pulse" />
        <div className="flex items-end gap-1 h-6">
          <span className="w-1 bg-white/90 animate-pulse" style={{ height: 6, animationDelay: "0ms" }} />
          <span className="w-1 bg-white/90 animate-pulse" style={{ height: 10, animationDelay: "120ms" }} />
          <span className="w-1 bg-white/90 animate-pulse" style={{ height: 8, animationDelay: "240ms" }} />
          <span className="w-1 bg-white/90 animate-pulse" style={{ height: 12, animationDelay: "360ms" }} />
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
          ${isAnimated ? "animate-bounce" : ""}
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
    isDropped,
    currentSpeech,
    isSpeaking,
    isVoiceListening,
    isWaitingForVoiceToFinish,
    isWrongColor,
    handleDrop,
    handleAddAndSay,
    goHome,
  } = useEasyGame();

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
    <main className="flex-1 min-h-0 grid grid-rows-[1fr_auto] bg-gradient-to-b from-teal-300 to-yellow-200 overflow-hidden">
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
          <button
            type="button"
            className={`relative transition-all duration-200 ${isDragOver ? "scale-110" : ""}`}
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
              className={`h-[50vh] w-auto drop-shadow-xl transition-all ${isDragOver ? "drop-shadow-2xl brightness-110" : ""}`}
              draggable={false}
            />
            {isRoundComplete && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 pointer-events-none -z-10">
                <span className="text-4xl md:text-5xl opacity-90 animate-bounce drop-shadow-lg">✨</span>
              </div>
            )}
          </button>

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
            {!isDropped && !isRoundComplete && (
              <span className="text-7xl animate-bounce">👉</span>
            )}
            <button
              type="button"
              draggable={true}
              onDragStart={(e) => { e.dataTransfer.setData("text/plain", "ingredient"); e.dataTransfer.effectAllowed = "move"; }}
              className={`flex items-center gap-3 bg-white rounded-2xl px-4 pr-10 py-3 shadow w-fit select-none transition-all text-left ${
                !isRoundComplete && !isDropped
                  ? "cursor-grab active:cursor-grabbing hover:shadow-lg hover:scale-105"
                  : "cursor-default"
              }`}
              aria-label={activeIngredient?.name ?? "Ingredient"}
            >
              <Image
                src={activeIngredient?.imageSrc ?? ""}
                alt={activeIngredient?.name ?? ""}
                width={60}
                height={60}
                className="w-14 h-14 object-contain"
                draggable={false}
              />
              <div>
                <p className="text-3xl font-extrabold text-gray-800">{activeIngredient?.name}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom section: shown only after ingredient is dropped */}
      <div className={`grid grid-cols-2 gap-4 px-6 pb-4 transition-all duration-500 ${isDropped ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        {/* Player color picker */}
        <div className="bg-white/70 rounded-3xl px-6 py-4 relative">
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
                onSelect={handlePickColor}
              />
            ))}
          </div>
        </div>

        {/* Bot shape picker */}
        <div className="bg-white/70 rounded-3xl px-6 py-4">
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
                label={ingredient.name}
                imageSrc={ingredient.imageSrc}
                isBotSelected={ingredient.id === activeIngredient?.id}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
