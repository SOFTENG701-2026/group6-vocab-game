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
        flex flex-col items-center gap-3 px-6 py-4 rounded-3xl
        border-3 transition-all duration-200
        ${isBotSelected
          ? "border-green-500 bg-green-50 scale-105 shadow-lg"
          : "border-transparent bg-white shadow opacity-90"
        }
      `}
    >
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
    </div>
  );
}
