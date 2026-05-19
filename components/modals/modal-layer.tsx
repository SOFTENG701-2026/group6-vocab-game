import type { ReactNode } from "react";

type ModalLayerProps = {
  open: boolean;
  children: ReactNode;
  labelledBy?: string;
};

export default function ModalLayer({ open, children, labelledBy }: ModalLayerProps) {
  if (!open) return null;
  return (
    <div
      className="modal-layer"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      {children}
    </div>
  );
}
