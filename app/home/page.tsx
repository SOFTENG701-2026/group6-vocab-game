import { Suspense } from "react";
import Image from "next/image";
import HomePlayActions from "@/components/home/home-play-actions";

export default function PlayHomePage() {
  return (
    <main className="bg-orange-300 h-full overflow-hidden flex flex-col items-center gap-4 py-6">
      <Image
        src="/logo-title.png"
        alt="Magic Soup Buddies logo"
        width={400}
        height={400}
        priority
      />

      <Suspense fallback={<p className="text-black font-bold">Loading...</p>}>
        <HomePlayActions />
      </Suspense>
    </main>
  );
}
