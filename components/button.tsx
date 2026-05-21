import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { forwardRef } from "react";

type ButtonProps = {
  children?: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  size?: "large" | "medium" | "small";
  variant?:
    | "default"
    | "ingredientColor"
    | "ingredientShape"
    | "ingredientTarget";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    icon,
    iconPosition = "right",
    size = "medium",
    variant = "default",
    onClick,
    disabled = false,
    className = "",
    style,
    "aria-label": ariaLabel
  },
  ref
) {
  const sizeClasses = {
    large: "px-3 py-1.5 text-3xl gap-3 border-2",
    medium: "px-2 py-1 text-lg gap-2 border-2",
    small: "px-1 py-1 text-sm gap-1 border"
  };

  const variantClasses = {
    default: `
      ${sizeClasses[size]}
      bg-(--button-bg)
      text-(--button-text)
      border-(--color-primary-hover)
      hover:border-(--button-hover-border)
      rounded-lg
      shadow-[0_8px_0_var(--button-shadow)]
      active:translate-y-1
      active:shadow-[0_4px_0_var(--button-shadow)]
    `,

    ingredientColor: `
      h-20 w-20 rounded-full border-4
      bg-white
      text-black
      shadow
      hover:scale-105
      active:scale-95
    `,

    ingredientShape: `
      h-20 w-28 rounded-3xl border-4
      bg-white
      text-base font-extrabold text-gray-700
      shadow
      hover:scale-105
      active:scale-95
    `,

    ingredientTarget: `
      flex h-44 w-44 items-center justify-center
      rounded-4xl border-4 border-white
      bg-white
      shadow-lg
      hover:scale-105
      active:scale-95
    `
  };

  return (
    <button
      ref={ref}
      type='button'
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center
        font-bold
        transition-all
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:scale-100
        disabled:active:scale-100
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {icon && iconPosition === "left" && icon}

      {children && <span>{children}</span>}

      {icon && iconPosition === "right" && icon}
    </button>
  );
});

export default Button;
