import Image from "next/image";
import Button from "@/components/button";
import { Plus, Star, ShoppingCart, Circle } from "lucide-react";

type NavbarProps = {
  gems?: number;
};

export default function Navbar({ gems = 0 }: NavbarProps) {
  return (
    <nav
      className=' w-full h-10
        bg-gray-300
        backdrop-blur-md
        border-b border-white/40
        shadow-sm
        flex items-center justify-end
        px-4 gap-1.5'
    >
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
      <Button
        size='small'
        iconPosition='left'
        icon={<Star className='w-3 h-3 fill-white' />}
      >
        Achievements
      </Button>

      <Button
        size='small'
        iconPosition='left'
        icon={<ShoppingCart className='w-3 h-3 fill-white' />}
      >
        Shop
      </Button>

      {/* Gems display*/}
      <div
        className='
          inline-flex items-center justify-center
          px-1 py-1
          text-[8px]
          gap-1
          rounded-lg
          bg-(--button-bg)
          text-(--button-text)
          border
          border-(--color-primary-hover)
          font-bold
        '
      >
        <Circle
          className='h-3 w-3 fill-yellow-400 text-white'
          strokeWidth={2}
        />
        <span>{gems} gems</span>
      </div>
    </nav>
  );
}
