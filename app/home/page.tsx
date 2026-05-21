import { Suspense } from "react";
import Image from "next/image";
import HomePlayActions from "@/components/home/home-play-actions";

export default function PlayHomePage() {
  return (
    <main className='flex flex-col bg-orange-300 min-h-full items-center gap-4'>
      <Image src='/logo-title.png' alt='Magic Soup Buddies logo' width={400} height={400} priority />

      <Suspense fallback={<p className="text-black font-bold">Loading...</p>}>
        <HomePlayActions />
      </Suspense>
    </main>
  );
}

