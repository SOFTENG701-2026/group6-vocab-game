import Link from "next/link";
import Button from "@/components/button";
import { Plus, Star, ShoppingCart, Circle } from "lucide-react";
import BackButton from "./back-button";

type NavbarProps = {
  gems?: number;
};

export default function Navbar({ gems = 0 }: NavbarProps) {
  return (
    <nav
      className=' w-full h-fit py-1
        bg-gray-300
        backdrop-blur-md
        border-b border-gray-500/40
        shadow-sm
        flex items-center justify-between
        px-4 gap-1.5'
    >
      <BackButton />

      <div className='flex items-center justify-end gap-1.5'>
        {/* Avatar */}
        <div
          className='
          h-8 w-8
          flex items-center justify-center
          border border-(--color-primary-hover)
          rounded-full
          bg-(--color-on-primary)
          overflow-hidden
        '
        >
          <Plus className='text-gray-500' />
        </div>

        {/* Buttons */}
        <Link href='/achievements'>
          <Button size='small' iconPosition='left' icon={<Star className='w-5 h-5 fill-white' />}>
            Achievements
          </Button>
        </Link>

        <Link href='/shop'>
          <Button size='small' iconPosition='left' icon={<ShoppingCart className='w-5 h-5 fill-white' />}>
            Shop
          </Button>
        </Link>

        {/* Gems display*/}
        <div
          className='
          inline-flex items-center justify-center
          px-1 py-1 text-sm gap-1 border
          rounded-lg
          bg-(--button-bg)
          text-(--button-text)
          border-(--color-primary-hover)
          font-bold
        '
        >
          <Circle className='h-3 w-3 fill-yellow-400 text-white' strokeWidth={2} />
          <span>{gems} gems</span>
        </div>
      </div>
    </nav>
  );
}
