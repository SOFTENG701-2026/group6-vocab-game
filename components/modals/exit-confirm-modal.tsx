"use client";

import ModalLayer from "@/components/modals/modal-layer";

type ExitConfirmModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ExitConfirmModal({
  open,
  onCancel,
  onConfirm
}: ExitConfirmModalProps) {
  return (
    <ModalLayer open={open} labelledBy="exitConfirmTitle">
      <section className="points-card wide">
        <h2 id="exitConfirmTitle">Exit game?</h2>
        <p>Your current soup will stop cooking.</p>
        <div className="end-actions">
          <button type="button" className="primary-play quiet" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="primary-play" onClick={onConfirm}>
            Exit
          </button>
        </div>
      </section>
    </ModalLayer>
  );
}
