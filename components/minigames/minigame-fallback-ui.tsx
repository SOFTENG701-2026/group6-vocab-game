import Button from "@/components/button";

export default function MinigameFallback() {
  return (
    <div
      className='
        flex h-full min-h-105 w-full flex-col items-center justify-center
        rounded-4xl border-4 border-dashed border-white/20
        bg-white/10 p-8 text-center
      '
    >
      <div className='max-w-md rounded-4xl bg-white/90 p-8 text-black shadow'>
        <h2 className='mt-4 text-2xl font-extrabold text-(--color-primary-hover)'>
          No minigame yet!
        </h2>

        <p className='mt-3 text-base font-medium text-gray-600'>
          The minigame will appear once you choose an ingredient for the magic
          pot!
        </p>

        <div className='mt-6'></div>
      </div>
    </div>
  );
}
