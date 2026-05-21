import { Suspense } from "react";
import ThemeSelector from "@/components/home/theme-selector";

export default function HomePage() {
  return (
    <main className='flex flex-col bg-orange-300 min-h-full items-center gap-4'>
      <Image src='/logo-title.png' alt='Magic Soup Buddies logo' width={400} height={400} priority />

      <HomePlayActions />
    </main>
  );
}
