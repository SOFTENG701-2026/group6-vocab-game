/**
 * Card component implementation notes
 *
 * This component is a reusable interactive card used for both difficulty
 * selection and ingredient selection.
 *
 * Important implementation details:
 *
 * - Each card requires an `id` so the parent component can identify which card
 *   is selected, hovered, or should have its blur effect applied.
 *
 * - Optional props allow the same card component to support different layouts:
 *   a difficulty-selection card can render a title, logo, and button, while an
 *   ingredient-selection card can also render a description title and
 *   description content.
 *
 * - The `size` prop controls the card layout. The default size is intended for
 *   difficulty-selection cards, while the compact size is intended for
 *   ingredient-selection cards.
 *
 * - Blur behaviour is controlled through `blurEffect`, `isSelected`,
 *   `isHovered`, and `shouldBlur`. This allows only the active card to appear
 *   clear, while inactive cards remain blurred or faded.
 *
 * - The card becomes clear when blur is disabled, or when it is selected or
 *   hovered and it should not be blurred.
 */

"use client";

import type { ReactNode } from "react";
import Button from "@/components/button";

type CardProps = {
  //id to select for removing and adding blur effects
  id: string;
  logo: ReactNode;

  //optional-params
  disabled?: boolean;
  title?: string;
  buttonText?: string;
  descriptionTitle?: string;
  descriptionContent?: string;

  //Sizing default = difficulty selection, compact = ingredient selection
  size?: "default" | "compact";

  blurEffect?: boolean;

  // Remove blur effects when selected or not hovered.
  isSelected?: boolean;
  isHovered?: boolean;
  shouldBlur?: boolean;

  onSelect?: (id: string) => void;
  onButtonClick?: (id: string) => void;
  onHoverStart?: (id: string) => void;
  onHoverEnd?: () => void;
};

export default function Card({
  id,
  title,
  logo,
  buttonText = "LET'S BEGIN",
  disabled = false,

  descriptionTitle,
  descriptionContent,

  size = "default",

  blurEffect = true,

  isSelected = false,
  isHovered = false,
  shouldBlur = false,

  onSelect,
  onButtonClick,
  onHoverStart,
  onHoverEnd
}: CardProps) {
  const isCompact = size === "compact";
  const hasDescription = Boolean(descriptionTitle || descriptionContent);
  const isClear = getIsClear();

  function getIsClear() {
    // Only remove blur if the effect is disabled or if the card is not hovered or clicked on.
    return !blurEffect || ((isSelected || isHovered) && !shouldBlur);
  }

  function getCardSizeClasses() {
    return isCompact ? "min-w-52 max-w-60" : "min-w-56 max-w-80";
  }

  function getHeaderSpacingClasses() {
    return isCompact ? "pt-5 pb-6" : "pt-6 pb-8";
  }

  function getTitleSpacingClasses() {
    return isCompact ? "mb-3" : "mb-5";
  }

  function getTitleColorClasses() {
    return isClear ? "text-(--color-primary-hover)" : "text-gray-500";
  }

  function getLogoVisibilityClasses() {
    return isClear
      ? "opacity-100 blur-none grayscale-0"
      : "opacity-35 blur-[1.5px] grayscale";
  }

  function getDescriptionSpacingClasses() {
    return isCompact ? "px-8 pt-7 pb-6" : "px-8 pt-8 pb-6";
  }

  function getDescriptionTitleSizeClasses() {
    return isCompact ? "text-xl" : "text-2xl";
  }

  function getDescriptionContentSizeClasses() {
    return isCompact ? "mt-1 text-sm" : "mt-2 text-lg";
  }

  function getButtonSpacingClasses() {
    return isCompact ? "pt-2 pb-8" : "py-8";
  }

  function getButtonVisibilityClasses() {
    return isClear ? "opacity-100" : "opacity-45";
  }

  function handleClick() {
    if (disabled) return;
    onSelect?.(id);
  }

  function handleButtonClick() {
    if (disabled) return;
    onButtonClick?.(id);
  }

  function getDisabledClasses() {
    return disabled
      ? "opacity-50 grayscale cursor-not-allowed pointer-events-none hover:translate-y-0 hover:border-transparent"
      : "";
  }

  function renderTitle() {
    if (!title) return null;

    return (
      <h2
        className={`
          text-sm font-extrabold uppercase tracking-[0.18em]
          transition-colors duration-300
          ${getTitleSpacingClasses()}
          ${getTitleColorClasses()}
        `}
      >
        {title}
      </h2>
    );
  }

  function renderDescription() {
    if (!hasDescription) return null;

    return (
      <div className={getDescriptionSpacingClasses()}>
        {descriptionTitle && (
          <h2
            className={`
              font-extrabold leading-tight text-gray-800
              ${getDescriptionTitleSizeClasses()}
            `}
          >
            {descriptionTitle}
          </h2>
        )}

        {descriptionContent && (
          <p
            className={`
              font-medium tracking-wider text-gray-500
              ${getDescriptionContentSizeClasses()}
            `}
          >
            {descriptionContent}
          </p>
        )}
      </div>
    );
  }

  function renderButton() {
    if (!buttonText) return null;

    return (
      <div
        onClick={(event) => event.stopPropagation()}
        className={`
      flex items-center justify-center px-8
      ${isCompact ? "pt-2 pb-8" : "py-8"}
    `}
      >
        <div
          className={`
        transition-opacity duration-300
        ${isClear ? "opacity-100" : "opacity-45"}
      `}
        >
          <Button size='medium' onClick={handleButtonClick}>
            {buttonText}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <article
      onClick={handleClick}
      onMouseEnter={() => onHoverStart?.(id)}
      onMouseLeave={onHoverEnd}
      className={`
        group
        w-fit
        overflow-hidden
        rounded-4xl
        bg-(--card-body-bg)
        border-2 border-transparent
        shadow-[0_18px_35px_rgba(0,0,0,0.16)]
        transition-all duration-300
        cursor-pointer
        hover:-translate-y-1
        hover:border-(--color-primary-hover)
        hover:shadow-[0_24px_45px_rgba(0,0,0,0.2)]
        ${getCardSizeClasses()}
        ${getDisabledClasses()}
      `}
    >
      <div
        className={`
          bg-(--card-header-bg)
          rounded-b-4xl
          flex flex-col items-center justify-center
          px-8
          ${getHeaderSpacingClasses()}
        `}
      >
        {renderTitle()}

        <div
          className={`
            flex items-center justify-center
            transition-all duration-300
            ${getLogoVisibilityClasses()}
          `}
        >
          {logo}
        </div>
      </div>

      {renderDescription()}

      {renderButton()}
    </article>
  );
}
