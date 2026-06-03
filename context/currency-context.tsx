"use client";

import { createContext, useContext, useRef, useState, type ReactNode, type RefObject } from "react";

type FlyingGem = {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
};

type CurrencyContextValue = {
  gems: number;
  isGemsBumping: boolean;
  gemTargetRef: RefObject<HTMLDivElement | null>;
  claimGems: (amount: number, sourceElement: HTMLElement) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const FLY_GEM_DURATION_MS = 1500;
const GEM_COUNT_INCREMENT_DELAY_MS = FLY_GEM_DURATION_MS - 200;
const GEM_BUMP_DURATION_MS = 350;
const GEM_CLEANUP_DELAY_MS = FLY_GEM_DURATION_MS + 300;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [gems, setGems] = useState(0);
  const [isGemsBumping, setIsGemsBumping] = useState(false);
  const [flyingGems, setFlyingGems] = useState<FlyingGem[]>([]);

  const gemTargetRef = useRef<HTMLDivElement | null>(null);

  function claimGems(amount: number, sourceElement: HTMLElement) {
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = gemTargetRef.current?.getBoundingClientRect();

    if (!targetRect) {
      setGems((currentGems) => currentGems + amount);
      return;
    }

    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;

    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    const newFlyingGems: FlyingGem[] = Array.from({ length: 8 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      startX,
      startY,
      endX,
      endY,
      delay: index * 45,
    }));

    setFlyingGems((currentGems) => [...currentGems, ...newFlyingGems]);

    window.setTimeout(() => {
      setGems((currentGems) => currentGems + amount);
      setIsGemsBumping(true);
    }, GEM_COUNT_INCREMENT_DELAY_MS);

    window.setTimeout(() => {
      setIsGemsBumping(false);
    }, GEM_COUNT_INCREMENT_DELAY_MS + GEM_BUMP_DURATION_MS);

    window.setTimeout(() => {
      setFlyingGems((currentGems) =>
        currentGems.filter((gem) => !newFlyingGems.some((newGem) => newGem.id === gem.id)),
      );
    }, GEM_CLEANUP_DELAY_MS);
  }

  return (
    <CurrencyContext.Provider
      value={{
        gems,
        isGemsBumping,
        gemTargetRef,
        claimGems,
      }}
    >
      {children}

      <div className='pointer-events-none fixed inset-0 z-9999'>
        {flyingGems.map((gem) => (
          <span
            key={gem.id}
            className='absolute h-16 w-16 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.9)] animate-fly-gem'
            style={
              {
                left: gem.startX - 32,
                top: gem.startY - 32,
                "--gem-end-x": `${gem.endX - gem.startX}px`,
                "--gem-end-y": `${gem.endY - gem.startY}px`,
                animationDelay: `${gem.delay}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }

  return context;
}
