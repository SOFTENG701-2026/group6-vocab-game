import Image from "next/image";

type MonsterBubbleProps = Readonly<{
  message: string;
  isSpeaking?: boolean;
}>;

export default function MonsterBubble({ message, isSpeaking = false }: MonsterBubbleProps) {
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

      {/* Monster image — floats when speaking */}
      <Image
        src="/assets/avatar/monster.svg"
        alt="Monster"
        width={640}
        height={720}
        className="w-80 h-auto object-contain drop-shadow-md"
        style={isSpeaking ? { animation: "monsterFloat 0.5s ease-in-out infinite alternate" } : undefined}
        draggable={false}
      />

      {isSpeaking && (
        <style>{`
          @keyframes monsterFloat {
            from { transform: translateY(0px) rotate(-2deg); }
            to   { transform: translateY(-10px) rotate(2deg); }
          }
        `}</style>
      )}
    </div>
  );
}
