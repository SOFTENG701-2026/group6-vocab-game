import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  size?: "large" | "medium" | "small";
  onClick?: () => void;
};

export default function Button({
  children,
  icon,
  iconPosition = "right",
  size = "medium",
  onClick
}: ButtonProps) {
  const sizeClasses = {
    large: "px-3 py-1.5 text-3xl gap-3 border-2",
    medium: "px-2 py-1 text-lg gap-2 border-2 ",
    small: "px-1 py-1 text-sm gap-1 border"
  };

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
         ${sizeClasses[size]}
        bg-(--button-bg)
        text-(--button-text)
        border-(--color-primary-hover)
        hover:border-(--button-hover-border)
        font-bold
        rounded-lg
        shadow-[0_8px_0_var(--button-shadow)]
        active:translate-y-1
        active:shadow-[0_4px_0_var(--button-shadow)]
        transition-all
      `}
    >
      {icon && iconPosition === "left" && icon}

      <span>{children}</span>

      {icon && iconPosition === "right" && icon}
    </button>
  );
}
