"use client";

import { ArrowRight } from "lucide-react";
import type { GameTheme } from "@/domain/themes/theme-options";

type ThemeCardProps = {
  theme: GameTheme;
  isActive?: boolean;
  onPlay: (themeId: string) => void;
};

export default function ThemeCard({ theme, isActive = false, onPlay }: ThemeCardProps) {
  const disabled = !theme.available;
  const isFeatured = theme.id === "fruits-vegetables";

  return (
    <article
      className={`
        shrink-0 overflow-hidden rounded-[2.5rem] bg-white
        shadow-[0_20px_40px_rgba(0,0,0,0.12)]
        transition-all duration-300
        ${isFeatured ? "w-[30rem]" : "w-[25rem]"}
        ${
          isActive
            ? "scale-100 opacity-100"
            : isFeatured
              ? "scale-[0.97] opacity-90"
              : "scale-90 opacity-50"
        }
        ${disabled ? "grayscale" : ""}
      `}
    >
      <div
        className={`relative mx-4 mt-4 flex items-center justify-center rounded-3xl bg-(--card-header-bg) px-4 py-10 ${
          isFeatured ? "pt-12" : "pt-11"
        }`}
      >
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-extrabold tracking-wide text-(--color-primary-hover)">
          {theme.tag}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={theme.image}
          alt={theme.label}
          className={`mx-auto w-full object-contain object-center ${isFeatured ? "h-90" : "h-80"}`}
          draggable={false}
        />
      </div>

      <div className={`px-6 pb-6 text-center ${isFeatured ? "pt-6" : "pt-5"}`}>
        <h2
          className={`mt-2 font-extrabold leading-tight text-gray-900 ${
            isFeatured ? "text-3xl" : "text-[1.65rem]"
          }`}
        >
          {theme.cardLabel}
        </h2>

        <div
          aria-hidden="true"
          className={`flex items-center justify-center gap-1.5 ${isFeatured ? "mt-5 mb-1" : "mt-4 mb-1"}`}
        >
          <span
            className={`invisible h-0.5 rounded-full bg-(--color-primary) ${isFeatured ? "w-12" : "w-10"}`}
          />
          <span className="invisible h-2 w-2 rounded-full bg-(--color-primary-hover)" />
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onPlay(theme.id)}
          className={`
            flex w-full items-center justify-center gap-2
            rounded-2xl font-extrabold text-white transition-all
            ${isFeatured ? "px-5 py-4 text-xl" : "px-4 py-3.5 text-[1.05rem]"}
            ${
              disabled
                ? "cursor-not-allowed bg-gray-400"
                : "bg-(--color-primary) hover:bg-(--color-primary-hover) active:scale-[0.98]"
            }
          `}
        >
          {disabled ? "Coming Soon" : "Let's Play"}
          {!disabled && (
            <ArrowRight className={isFeatured ? "h-6 w-6" : "h-5 w-5"} strokeWidth={3} />
          )}
        </button>
      </div>
    </article>
  );
}
