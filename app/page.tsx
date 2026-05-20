import Image from "next/image";
import Button from "@/components/button";
import { UserRound, UsersRound, Star, ShoppingCart } from "lucide-react";

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
      <Button size='large' icon={<UserRound className='w-6 h-6' />}>
        Play
      </Button>
      <Button size='large' icon={<UsersRound className='w-6 h-6' />}>
        Play with a Friend
      </Button>
    </main>
  );
}
