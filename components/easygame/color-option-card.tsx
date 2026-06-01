const COLOR_HEX: Record<string, string> = {
  red: "#ef4444",
  yellow: "#facc15",
  orange: "#f97316",
  green: "#22c55e",
  purple: "#a855f7",
  blue: "#3b82f6",
  pink: "#ec4899",
  white: "#f3f4f6",
  brown: "#92400e",
};

type ColorOptionCardProps = Readonly<{
  colorId: string;
  label: string;
  imageSrc?: string;
  isSelected: boolean;
  isWrong: boolean;
  disabled?: boolean;
  onSelect: (colorId: string) => void;
}>;

export default function ColorOptionCard({
  colorId,
  label,
  isSelected,
  isWrong,
  disabled = false,
  onSelect,
}: ColorOptionCardProps) {
  const hex = COLOR_HEX[colorId] ?? "#d1d5db";

  return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect(colorId)}
        className={`flex flex-col items-center gap-3 px-6 py-4 rounded-3xl border-2 transition-all duration-200 ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"} ${isSelected ? "border-purple-500 bg-purple-50 scale-105 shadow-lg" : "border-transparent bg-white hover:border-purple-300 shadow"} ${isWrong ? "animate-shake" : ""}`}
      >
        <div
          className="w-16 h-16 rounded-full shadow-md border-2 border-white"
          style={{ backgroundColor: hex }}
        />
        <span className="text-base font-extrabold text-gray-700">{label}</span>
      </button>
  );
}
