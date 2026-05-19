"use client";

import ModalLayer from "@/components/modals/modal-layer";

type EndChoiceModalProps = {
  open: boolean;
  onContinue: () => void;
  onHome: () => void;
};

export default function EndChoiceModal({
  open,
  onContinue,
  onHome
}: EndChoiceModalProps) {
  return (
    <ModalLayer open={open} labelledBy="endChoiceTitle">
      <section className="points-card wide">
        <h2 id="endChoiceTitle">What next?</h2>
        <p>Keep cooking with new ingredients, or go back home.</p>
        <div className="end-actions">
          <button type="button" className="primary-play" onClick={onContinue}>
            Continue Game
          </button>
          <button type="button" className="primary-play quiet" onClick={onHome}>
            Home
          </button>
        </div>
      </section>
    </ModalLayer>
  );
}
