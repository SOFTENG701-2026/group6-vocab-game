import Image from "next/image";
import HomePlayActions from "@/components/home/home-play-actions";

export default function Home() {
  return (
    <main className='bg-orange-300 min-h-screen flex flex-col items-center gap-4'>
      <Image
        src='/logo-title.png'
        alt='Magic Soup Buddies logo'
        width={400}
        height={400}
        priority
      />

      <HomePlayActions />
    </main>
  );
}
