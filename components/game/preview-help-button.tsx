"use client";

import { useEffect, useState } from "react";

type PreviewHelpButtonProps = {
  onClick: () => void;
  label?: string;
  shouldPulse?: boolean;
  resetKey?: string;
  className?: string;
};

export default function PreviewHelpButton({
  onClick,
  label = "Show preview",
  shouldPulse = true,
  resetKey,

  className = "",
}: PreviewHelpButtonProps) {
  const [hasBeenClicked, setHasBeenClicked] = useState(false);

  useEffect(() => {
    setHasBeenClicked(false);
  }, [resetKey]);

  const shouldShowPulse = shouldPulse && !hasBeenClicked;

  function handleClick() {
    setHasBeenClicked(true);
    onClick();
  }

  return (
    <button
      type='button'
      aria-label={label}
      title={label}
      onClick={handleClick}
      className={`
        group relative 
        flex h-12 w-12 items-center justify-center
        rounded-full border-4 border-purple-500
        bg-white text-purple-600 shadow-lg
        transition-all duration-200 ease-out

        hover:scale-110 hover:bg-purple-500 hover:text-white
        focus:outline-none focus:ring-4 focus:ring-purple-300
        active:scale-95

        ${className}
      `}
    >
      {shouldShowPulse && (
        <span
          aria-hidden='true'
          className='
            absolute inset-0 -z-10
            rounded-full bg-purple-400/60
            animate-ping
          '
        />
      )}

      <span className='text-2xl font-extrabold leading-none transition-transform duration-200 group-hover:rotate-12 group-focus:rotate-12'>
        ?
      </span>
    </button>
  );
}
