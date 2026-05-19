"use client";

import ModalLayer from "@/components/modals/modal-layer";

type PointsModalProps = {
  open: boolean;
  onOk: () => void;
};

export default function PointsModal({ open, onOk }: PointsModalProps) {
  return (
    <ModalLayer open={open} labelledBy="pointsModalTitle">
      <section className="points-card">
        <h2 id="pointsModalTitle">+10 points!</h2>
        <p>Great cooking and remembering.</p>
        <button type="button" className="primary-play" onClick={onOk}>
          OK
        </button>
      </section>
    </ModalLayer>
  );
}
