import type { ReactNode } from "react";
import Button from "@/components/button";

type CardProps = {
  title?: string;
  logo: ReactNode;
  buttonText?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function Card({
  title,
  logo,
  buttonText = "LET'S BEGIN",
  onClick,
  disabled = false
}: CardProps) {
  return (
    <article
      className='
        group
        w-fit
        min-w-56
        max-w-80
        overflow-hidden
        rounded-[2rem]
        bg-[#FFFFFA]
        border-2 border-transparent
        shadow-[0_18px_35px_rgba(0,0,0,0.16)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[var(--color-primary-hover)]
        hover:shadow-[0_24px_45px_rgba(0,0,0,0.2)]
      '
    >
      {/* Top image area */}
      <div
        className='
          bg-[#EDE0FF]
          rounded-b-[2rem]
          flex flex-col items-center justify-center
          px-8 pt-6 pb-8
        '
      >
        {title && (
          <h2
            className='
              mb-5
              text-sm font-extrabold uppercase tracking-[0.18em]
              text-gray-500
              transition-colors duration-300
              group-hover:text-[var(--color-primary-hover)]
            '
          >
            {title}
          </h2>
        )}

        <div
          className='
            flex items-center justify-center
            opacity-35 blur-[1.5px] grayscale
            transition-all duration-300
            group-hover:opacity-100
            group-hover:blur-none
            group-hover:grayscale-0
          '
        >
          {logo}
        </div>
      </div>

      {/* Bottom button area */}
      <div className='flex items-center justify-center px-8 py-12'>
        <div
          className='
            opacity-45
            transition-opacity duration-300
            group-hover:opacity-100
          '
        >
          <Button size='medium' onClick={disabled ? undefined : onClick}>
            {buttonText}
          </Button>
        </div>
      </div>
    </article>
  );
}
