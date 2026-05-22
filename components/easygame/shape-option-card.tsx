import Image from "next/image";

type ShapeOptionCardProps = Readonly<{
  label: string;
  imageSrc: string;
  isBotSelected: boolean;
}>;

export default function ShapeOptionCard({
  label,
  imageSrc,
  isBotSelected,
}: ShapeOptionCardProps) {
  return (
    <div
      className={`
        flex flex-col items-center gap-2 px-4 py-3 rounded-2xl
        border-3 transition-all duration-200
        ${isBotSelected
          ? "border-green-500 bg-green-50 scale-105 shadow-lg"
          : "border-transparent bg-white shadow opacity-50"
        }
      `}
    >
      <div className="w-16 h-16 flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={label}
          width={64}
          height={64}
          className="w-full h-full object-contain grayscale"
          draggable={false}
        />
      </div>
      <span className="text-sm font-extrabold text-gray-700">{label}</span>
    </div>
  );
}
