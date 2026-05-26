import Button from "@/components/button";

type BasePreviewTutorialModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReplay: () => void;
  title?: string;
  description?: string;

  /**
   * For simple previews with only one input image,
   * such as a mouse icon.
   */
  inputImageSrc?: string;
  inputLabel?: string;

  /**
   * For custom input previews,
   * such as A and D keys shown side by side.
   */
  inputPreview?: React.ReactNode;

  /**
   * Applies an attention seeking animation
   */
  shouldEmphasiseInput?: boolean;
  children: React.ReactNode;
};

export default function BasePreviewTutorialModal({
  isOpen,
  onClose,
  onReplay,
  title = "How To Play",
  description = "Watch the preview, then try it yourself.",
  inputImageSrc,
  inputLabel,
  inputPreview,
  shouldEmphasiseInput = false,
  children,
}: BasePreviewTutorialModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      className='
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 p-6
      '
    >
      <div
        className='
          grid w-full max-w-6xl
          grid-cols-[1fr_260px] gap-5
          rounded-4xl bg-white p-5 shadow-2xl
        '
      >
        {children}

        <aside
          className='
            flex flex-col justify-between
            rounded-4xl bg-slate-100
            p-5 text-center shadow-inner
          '
        >
          <div>
            <h2 className='text-xl font-extrabold text-slate-800'>{title}</h2>

            <p className='mt-3 text-sm font-semibold text-slate-600'>{description}</p>
          </div>

          <div
            className={`flex flex-col items-center gap-4 ${shouldEmphasiseInput ? "animate-tutorial-attention-shake" : ""}`}
          >
            {inputPreview ? (
              inputPreview
            ) : (
              <>
                {inputImageSrc && (
                  <img src={inputImageSrc} alt='' aria-hidden='true' className='h-28 w-28 object-contain' />
                )}

                {inputLabel && (
                  <p
                    className='
                      rounded-2xl bg-white px-4 py-3
                      text-sm font-bold text-slate-700 shadow
                    '
                  >
                    {inputLabel}
                  </p>
                )}
              </>
            )}
          </div>

          <div className='flex w-full gap-3'>
            <Button onClick={onReplay} className='flex-1'>
              Replay
            </Button>

            <Button onClick={onClose} className='flex-1'>
              Close
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
