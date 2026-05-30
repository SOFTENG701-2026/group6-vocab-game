import Image from "next/image";

type ShapeOptionCardProps = Readonly<{
  label: string;
  imageSrc: string;
  isBotSelected: boolean;
  isInteractive?: boolean;
  isSelected?: boolean;
  isWrong?: boolean;
  onSelect?: () => void;
}>;

export default function ShapeOptionCard({
  label,
  imageSrc,
  isBotSelected,
  isInteractive = false,
  isSelected = false,
  isWrong = false,
  onSelect,
}: ShapeOptionCardProps) {
  let stateClassName = "border-transparent bg-white shadow opacity-90";

  if (isWrong) {
    stateClassName = "border-red-400 bg-red-50 animate-shake";
  } else if (isInteractive && isSelected) {
    stateClassName = "border-green-500 bg-green-50 scale-105 shadow-lg";
  } else if (isBotSelected) {
    stateClassName = "border-green-500 bg-green-50 scale-105 shadow-lg";
  }

  const content = (
    <>
      <div className="w-20 h-20 flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={label}
          width={80}
          height={80}
          className="w-full h-full object-contain grayscale"
          draggable={false}
        />
      </div>
      <span className="text-base font-extrabold text-gray-700">{label}</span>
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`
          flex flex-col items-center gap-3 px-6 py-4 rounded-3xl
          border-3 transition-all duration-200
          hover:scale-105
          ${stateClassName}
        `}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={`
        flex flex-col items-center gap-3 px-6 py-4 rounded-3xl
        border-3 transition-all duration-200
        ${stateClassName}
      `}
    >
      {content}
    </div>
  );
}
