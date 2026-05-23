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
  onSelect: (colorId: string) => void;
}>;

export default function ColorOptionCard({
  colorId,
  label,
  isSelected,
  isWrong,
  onSelect,
}: ColorOptionCardProps) {
  const hex = COLOR_HEX[colorId] ?? "#d1d5db";

  return (
    <>
      <button
        type="button"
        onClick={() => onSelect(colorId)}
        className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${isSelected ? "border-purple-500 bg-purple-50 scale-105 shadow-lg" : "border-transparent bg-white hover:border-purple-300 hover:scale-102 shadow"} ${isWrong ? "animate-shake" : ""}`}
      >
        <div
          className="w-14 h-14 rounded-full shadow-md border-2 border-white"
          style={{ backgroundColor: hex }}
        />
        <span className="text-sm font-extrabold text-gray-700">{label}</span>
      </button>
    </>
  );
}
