"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/card";
import { gameThemes } from "@/domain/themes/theme-options";
import type { GameTheme, GameThemeId } from "@/domain/themes/theme-options";

export default function ThemeSelector() {
  const router = useRouter();
  const [selectedThemeId, setSelectedThemeId] = useState<GameThemeId | null>(null);
  const [hoveredThemeId, setHoveredThemeId] = useState<GameThemeId | null>(null);

  const activeThemeId = hoveredThemeId ?? selectedThemeId;

  function handleThemeSelect(themeId: string) {
    const theme = gameThemes.find((t) => t.id === themeId);
    if (!theme?.available) return;
    setSelectedThemeId(theme.id);
  }

  function handleThemeBegin(themeId: string) {
    const theme = gameThemes.find((t) => t.id === themeId);
    if (!theme?.available) return;
    router.push(`/home?theme=${theme.id}`);
  }

  function renderThemeLogo(theme: GameTheme) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={theme.image}
        alt={theme.label}
        className={`h-32 w-32 bg-transparent object-contain ${!theme.available ? "opacity-60" : ""}`}
        draggable={false}
      />
    );
  }

  return (
    <section className="flex w-full max-w-6xl flex-wrap items-center justify-center gap-6 px-4">
      {gameThemes.map((theme) => {
        const isAvailable = theme.available;
        const isSelected = selectedThemeId === theme.id;
        const isHovered = hoveredThemeId === theme.id;
        const shouldBlur =
          isAvailable && activeThemeId !== null && activeThemeId !== theme.id;

        return (
          <Card
            key={theme.id}
            id={theme.id}
            title={theme.label}
            logo={renderThemeLogo(theme)}
            descriptionTitle={theme.label}
            descriptionContent={theme.description}
            buttonText={isAvailable ? "Let's Begin" : "Coming Soon"}
            disabled={!isAvailable}
            blurEffect={false}
            isSelected={isSelected}
            isHovered={isHovered}
            shouldBlur={shouldBlur}
            onSelect={handleThemeSelect}
            onButtonClick={handleThemeBegin}
            onHoverStart={(id) => {
              if (gameThemes.find((t) => t.id === id)?.available) {
                setHoveredThemeId(id as GameThemeId);
              }
            }}
            onHoverEnd={() => setHoveredThemeId(null)}
          />
        );
      })}
    </section>
  );
}
