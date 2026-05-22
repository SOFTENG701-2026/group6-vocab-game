import Image from "next/image";

type MonsterBubbleProps = Readonly<{
  message: string;
}>;

export default function MonsterBubble({ message }: MonsterBubbleProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Speech bubble */}
      <div className="relative bg-white rounded-2xl px-4 py-3 shadow-md max-w-[160px]">
        <p className="text-sm font-bold text-gray-800 leading-snug">{message}</p>
        {/* Bubble tail pointing down */}
        <div className="absolute -bottom-3 left-6 w-0 h-0
          border-l-[8px] border-l-transparent
          border-r-[8px] border-r-transparent
          border-t-[12px] border-t-white" />
      </div>
      <Image
        src="/assets/avatar/monster.svg"
        alt="Monster"
        width={640}
        height={720}
        className="w-80 h-auto object-contain drop-shadow-md"
        draggable={false}
      />
    </div>
  );
}
