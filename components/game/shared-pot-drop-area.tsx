import MagicPot from "./magic-pot";

type IngredientPotDropAreaProps = {
  canDrop: boolean;
  onDropToPot: () => void;
};

export default function IngredientPotDropArea({ canDrop, onDropToPot }: IngredientPotDropAreaProps) {
  return (
    <div
      className={`
        w-full h-72 max-h-auto overflow-hidden rounded-4xl
        border border-white/20 bg-white/10 shadow-inner
      `}
    >
      <MagicPot
        className='w-full h-full'
        onDrop={() => {
          if (!canDrop) return;
          onDropToPot();
        }}
      />
    </div>
  );
}
