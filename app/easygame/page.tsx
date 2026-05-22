"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Mic } from "lucide-react";
import { ingredients } from "@/data/ingredients";
import MonsterBubble from "@/components/easygame/monster-bubble";
import ColorOptionCard from "@/components/easygame/color-option-card";
import ShapeOptionCard from "@/components/easygame/shape-option-card";

// Fixed color options: one ingredient image per unique color
const COLOR_OPTIONS = [
  { colorId: "red", label: "Red", imageSrc: "/ingredients/apple.png" },
  { colorId: "yellow", label: "Yellow", imageSrc: "/ingredients/banana.png" },
  { colorId: "orange", label: "Orange", imageSrc: "/ingredients/carrot.png" },
];

function toSpelling(name: string) {
  return name.toUpperCase().split("").join("-");
}

function speak(text: string) {
  if (typeof globalThis.window === "undefined" || !globalThis.speechSynthesis) return;
  globalThis.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1.2;
  globalThis.speechSynthesis.speak(utterance);
}

function getBtnClass(isRoundComplete: boolean, isWrongColor: boolean, selectedColorId: string | null): string {
  if (isRoundComplete) return "bg-green-500 scale-105";
  if (isWrongColor) return "bg-red-500";
  if (selectedColorId) return "bg-pink-500 hover:bg-pink-600 hover:scale-105 active:scale-95";
  return "bg-gray-300 cursor-not-allowed";
}

export default function EasyGamePage() {
  const router = useRouter();
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isWrongColor, setIsWrongColor] = useState(false);
  const [clearSignal, setClearSignal] = useState(0);

  const totalRounds = ingredients.length;
  const isGameComplete = roundIndex >= totalRounds;
  const activeIngredient = ingredients[roundIndex] ?? null;

  // 3 shape options: current ingredient + 2 others (stable per round)
  const shapeOptions = useMemo(() => {
    if (!activeIngredient) return [];
    const others = ingredients
      .filter((i) => i.id !== activeIngredient.id)
      .slice(0, 2);
    const all = [activeIngredient, ...others];
    // stable shuffle seeded by roundIndex
    return [...all].sort((a, b) =>
      (a.id + roundIndex).localeCompare(b.id + roundIndex)
    );
  }, [activeIngredient, roundIndex]);

  function handleAddAndSay() {
    if (!selectedColorId || !activeIngredient || isRoundComplete) return;

    if (selectedColorId !== activeIngredient.colorId) {
      setIsWrongColor(true);
      speak(`Oops! Try again. ${activeIngredient.name} is ${activeIngredient.color}!`);
      setTimeout(() => setIsWrongColor(false), 1500);
      return;
    }

    // Correct!
    setIsRoundComplete(true);
    speak(
      `Great job! ${activeIngredient.name}! ${toSpelling(activeIngredient.name).replaceAll("-", " ")}!`
    );

    setTimeout(() => {
      setRoundIndex((prev) => prev + 1);
      setSelectedColorId(null);
      setIsRoundComplete(false);
      setClearSignal((prev) => prev + 1);
    }, 2500);
  }

  // Game complete screen
  if (isGameComplete) {
    return (
      <main className="h-full flex items-center justify-center bg-gradient-to-b from-teal-300 to-yellow-200">
        <div className="text-center bg-white/80 rounded-4xl p-12 shadow-xl">
          <h1 className="text-4xl font-extrabold text-purple-700 mb-4">🎉 Amazing job!</h1>
          <p className="text-xl font-bold text-gray-700 mb-8">You found all the ingredients!</p>
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="px-8 py-4 rounded-2xl bg-purple-600 text-white font-extrabold text-xl hover:bg-purple-700 transition-all"
          >
            Play Again
          </button>
        </div>
      </main>
    );
  }

  const monsterMessage = isRoundComplete
    ? `Well done! You found ${activeIngredient?.name}!`
    : `Let's make magic soup! Find ${activeIngredient?.name?.toLowerCase()}!`;

  return (
    <main className="flex-1 min-h-0 grid grid-rows-[1fr_auto] bg-gradient-to-b from-teal-300 to-yellow-200 overflow-hidden">
      {/* Top section */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 px-6 pt-4 min-h-0">

        {/* Left: Monster */}
        <div className="flex items-start justify-start pt-4">
          <MonsterBubble message={monsterMessage} />
        </div>

        {/* Center: Pot + title + button */}
        <div className="flex flex-col items-center justify-between py-4">
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center flex-wrap">
              {ingredients.map((ing, idx) => (
                <div
                  key={ing.id}
                  className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all ${
                    idx < roundIndex
                      ? "border-green-400 opacity-100"
                      : idx === roundIndex
                      ? "border-purple-500 ring-2 ring-purple-300 scale-110"
                      : "border-gray-300 opacity-30 grayscale"
                  }`}
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
            <h1 className="text-4xl font-extrabold text-purple-900 mt-1">
              Find {activeIngredient?.name}
            </h1>
          </div>

          <div className="relative">
            <Image
              src="/assets/pot/pot.svg"
              alt="Magic soup pot"
              width={300}
              height={300}
              className="h-[50vh] w-auto drop-shadow-xl"
              draggable={false}
            />
            {isRoundComplete && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl animate-bounce">✨</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddAndSay}
            disabled={!selectedColorId || isRoundComplete}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-full
              font-extrabold text-xl text-white transition-all shadow-lg
              ${getBtnClass(isRoundComplete, isWrongColor, selectedColorId)}
            `}
          >
            <Mic className="w-5 h-5" />
            {isRoundComplete ? "Well done! ✨" : "Add and Say it"}
          </button>
        </div>

        {/* Right: Ingredient info + Drawing canvas */}
        <div className="flex flex-col gap-3 py-4 min-h-0 items-center">
          {/* Ingredient info card */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 pr-10 py-3 shadow w-fit">
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
          </div>

        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-2 gap-4 px-6 pb-4">
        {/* Player color picker */}
        <div className="bg-white/70 rounded-3xl px-6 py-4">
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
                onSelect={setSelectedColorId}
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
