"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import ThemeCard from "@/components/theme/theme-card";
import { gameThemes } from "@/domain/themes/theme-options";

const DEFAULT_INDEX = gameThemes.findIndex(
  (theme) => theme.id === "fruits-vegetables"
);

export default function ThemeSelector() {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollSyncReadyRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(DEFAULT_INDEX);

  const updateActiveIndex = useCallback(() => {
    const container = carouselRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(container.children).forEach((child, index) => {
      const slide = child as HTMLElement;
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - slideCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const slide = container.children[DEFAULT_INDEX] as HTMLElement | undefined;
    slide?.scrollIntoView({ inline: "center", block: "nearest" });
    setActiveIndex(DEFAULT_INDEX);

    requestAnimationFrame(() => {
      updateActiveIndex();
      scrollSyncReadyRef.current = true;
    });
  }, [updateActiveIndex]);

  function handlePlay(themeId: string) {
    const theme = gameThemes.find((t) => t.id === themeId);
    if (!theme?.available) return;
    router.push(`/home?theme=${theme.id}`);
  }

  function goToSlide(index: number) {
    const slide = carouselRef.current?.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveIndex(index);
  }

  function handleScroll() {
    if (!scrollSyncReadyRef.current) return;
    updateActiveIndex();
  }

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <header className="text-center">
        <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold text-(--color-primary-hover)">
          <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
          Choose a Theme
          <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
        </h1>
        <p className="mt-2 text-lg font-semibold text-amber-950/70">
          Pick your favorite and start the magic!
        </p>
      </header>

      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex w-screen snap-x snap-mandatory items-end justify-start gap-8 overflow-x-auto px-[calc(50vw-15rem)] pb-2 scrollbar-none"
      >
        {gameThemes.map((theme, index) => (
          <div key={theme.id} className="snap-center">
            <ThemeCard
              theme={theme}
              isActive={index === activeIndex}
              onPlay={handlePlay}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {gameThemes.map((theme, index) => (
          <button
            key={theme.id}
            type="button"
            aria-label={`Go to ${theme.cardLabel}`}
            onClick={() => goToSlide(index)}
            className={`
              h-2.5 rounded-full transition-all
              ${
                index === activeIndex
                  ? "w-6 bg-(--color-primary-hover)"
                  : "w-2.5 bg-orange-200"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}
