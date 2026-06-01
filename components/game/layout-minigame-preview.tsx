import PreviewHelpButton from "@/components/game/preview-help-button";

type MinigamePreviewFrameProps = {
  onPreviewClick: () => void;
  resetKey?: string;
  children: React.ReactNode;
};

export default function MinigamePreviewFrame({ onPreviewClick, resetKey, children }: MinigamePreviewFrameProps) {
  return (
    <div className='relative h-full min-h-0 w-full'>
      {/* Minigame content */}
      <div className='h-full min-h-0 w-full overflow-hidden rounded-4xl'>{children}</div>

      {/* Help button overlay */}
      <div className='pointer-events-none absolute right-5 top-5 '>
        <PreviewHelpButton onClick={onPreviewClick} resetKey={resetKey} className='pointer-events-auto' />
      </div>
    </div>
  );
}
