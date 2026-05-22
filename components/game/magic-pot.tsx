"use client";

import React, { useState, useCallback, useRef } from "react";
import { ingredients, type Ingredient } from "@/data/ingredients";

// ─── Color map: colorId → hex ─────────────────────────────────────────────────

const COLOR_MAP: Record<string, string[]> = {
  red:    ["#FF3B30", "#FF6B6B"],
  yellow: ["#FFD60A", "#FFE566"],
  orange: ["#FF9F0A", "#FFBC5C"],
  white:  ["#F2F2F7", "#FFFFFF"],
};

function getHexColors(colorId: string): string[] {
  return COLOR_MAP[colorId] ?? ["#888888", "#aaaaaa"];
}

// ─── Color blending ───────────────────────────────────────────────────────────

interface SoupState {
  colors: string[];
  label: string;
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function mixColor(a: string, b: string, t: number) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

function blendColors(colorIds: string[]): SoupState {
  if (colorIds.length === 0) return { colors: ["#404059", "#2a2a3d"], label: "清汤" };

  const allHex = colorIds.flatMap(id => getHexColors(id));
  const primary = colorIds.map(id => getHexColors(id)[0]);
  const unique = [...new Set(primary)];

  if (unique.length === 1) {
    return { colors: [allHex[0], allHex[1]], label: "单色汤" };
  }

  if (unique.length >= 4) {
    return {
      colors: ["#FF3B30", "#FF9F0A", "#FFD60A"],
      label: "彩虹汤",
    };
  }

  const stops = unique.map((c, i) => mixColor(c, unique[(i + 1) % unique.length], 0.35));
  return { colors: [unique[0], ...stops, unique[unique.length - 1]], label: "混合汤" };
}

// ─── Falling item type ────────────────────────────────────────────────────────

interface FallingItem {
  id: string;
  ingredient: Ingredient;
  x: number;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MagicPot({ className, onDrop }: { className?: string; onDrop?: (ing: Ingredient) => void }) {
  const [dropped, setDropped] = useState<Ingredient[]>([]);
  const [falling, setFalling] = useState<FallingItem[]>([]);
  const [soup, setSoup] = useState<SoupState>({ colors: ["#404059", "#2a2a3d"], label: "清汤" });
  const [splashing, setSplashing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const counter = useRef(0);

  const dropIngredient = useCallback((ingredient: Ingredient) => {
    counter.current += 1;
    const itemId = `${ingredient.id}-${counter.current}`;
    const xPos = 25 + Math.random() * 50;

    setFalling(prev => [...prev, { id: itemId, ingredient, x: xPos }]);

    setTimeout(() => {
      setDropped(prev => {
        const next = [...prev, ingredient];
        setSoup(blendColors(next.map(i => i.colorId)));
        return next;
      });
      setSplashing(true);
      setFalling(prev => prev.filter(f => f.id !== itemId));
      setTimeout(() => setSplashing(false), 600);
    }, 700);
  }, []);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const ingredient = ingredients.find(i => i.id === id);
    if (ingredient) {
      dropIngredient(ingredient);
      onDrop?.(ingredient);
    }
    setIsDragOver(false);
  }

  // Build SVG gradient stop markup as a string (for dangerouslySetInnerHTML)
  const gradStops = soup.colors
    .map((c, i) =>
      `<stop offset="${Math.round((i / Math.max(soup.colors.length - 1, 1)) * 100)}%" stop-color="${c}"/>`
    )
    .join("");

  return (
    <div className={`${className ?? ""} flex flex-col items-center px-4 py-2`}>

      {/* Pot scene (drop target) */}
      <div className="relative w-full max-w-md flex flex-col items-center">
        <div
          className={`relative w-full ${isDragOver ? "ring-4 ring-white/20 rounded-3xl" : ""}`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >

          <svg
            width="469" height="437" viewBox="0 0 469 437"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-2xl"
          >
            <defs>
              <radialGradient
                id="soupGrad" cx="50%" cy="50%" r="55%"
                dangerouslySetInnerHTML={{ __html: gradStops }}
              />
              <radialGradient id="soupShimmer" cx="28%" cy="35%" r="45%">
                <stop offset="0%" stopColor="white" stopOpacity="0.25" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Handles */}
            <ellipse cx="427.995" cy="215.431" rx="26.4733" ry="36.2267"
              transform="rotate(-17.1856 427.995 215.431)" fill="#404059"/>
            <ellipse cx="26.4733" cy="36.2267" rx="26.4733" ry="36.2267"
              transform="matrix(-0.955352 -0.295468 -0.295468 0.955352 87.9905 198.644)" fill="#404059"/>

            {/* Pot body */}
            <path
              d="M437 241.293C437 334.238 349.696 418 242 418C134.304 418 47 342.653 47 249.707C47 156.762 134.304 73 242 73C349.696 73 437 148.347 437 241.293Z"
              fill="#1F1F2E"
            />

            {/* ★ Top opening — soup surface, the ONLY dynamic part */}
            <path
              d="M423 136.5C423 176.541 340.844 209 239.5 209C138.156 209 56 176.541 56 136.5C56 96.4594 138.156 64 239.5 64C340.844 64 423 96.4594 423 136.5Z"
              fill="url(#soupGrad)"
              style={{ transition: "fill 0.8s ease" }}
            />

            {/* Shimmer on soup surface */}
            <path
              d="M423 136.5C423 176.541 340.844 209 239.5 209C138.156 209 56 176.541 56 136.5C56 96.4594 138.156 64 239.5 64C340.844 64 423 96.4594 423 136.5Z"
              fill="url(#soupShimmer)"
            />

            {/* Original white highlight */}
            <ellipse cx="125.4" cy="151.873" rx="55.7333" ry="19.5067"
              fill="white" fillOpacity="0.18"/>

            {/* Handle inner */}
            <ellipse cx="426.78" cy="213.452" rx="17" ry="25.5"
              transform="rotate(-27.2168 426.78 213.452)" fill="#1F1F2E"/>
            <ellipse cx="17" cy="25.5" rx="17" ry="25.5"
              transform="matrix(-0.889283 -0.457358 -0.457358 0.889283 79.5609 208.55)" fill="#1F1F2E"/>

            {/* Bubbles */}
            {dropped.length > 0 && [
              { cx: 180, delay: 0,   dur: 2.2 },
              { cx: 240, delay: 0.7, dur: 1.9 },
              { cx: 300, delay: 1.3, dur: 2.4 },
              { cx: 215, delay: 0.4, dur: 2.0 },
            ].map((b, i) => (
              <circle key={i} cx={b.cx} cy={158} r={5} fill="white" fillOpacity="0.3">
                <animateTransform attributeName="transform" type="translate"
                  values="0 0;0 -16;0 0" dur={`${b.dur}s`} begin={`${b.delay}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.7;0"
                  dur={`${b.dur}s`} begin={`${b.delay}s`} repeatCount="indefinite"/>
              </circle>
            ))}
          </svg>

          {/* Falling ingredient images */}
          {falling.map(item => (
            <div
              key={item.id}
              className="absolute top-0 w-12 h-12 pointer-events-none z-10 animate-[dropIn_0.7s_cubic-bezier(0.45,0,0.55,1)_forwards]"
              style={{ left: `${item.x}%`, transform: "translateX(-50%)" }}
            >
              <img
                src={item.ingredient.imageSrc}
                alt={item.ingredient.imageAlt}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          ))}

          {/* Splash */}
          {splashing && (
            <div className="absolute top-[34%] left-1/2 -translate-x-1/2 pointer-events-none z-20">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white animate-[splashOut_0.5s_ease-out_forwards]"
                  style={{
                    animationDelay: `${i * 50}ms`,
                    transform: `rotate(${i * 60}deg) translateY(-4px)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        </div>
      </div>
  );    
}


