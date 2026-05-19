"use client";

import ModalLayer from "@/components/modals/modal-layer";
import { alphabet } from "@/lib/data/ingredient-bank";
import type { Ingredient } from "@/lib/game/types";

type WordModalProps = {
  open: boolean;
  target: Ingredient | null;
  typedLetters: string[];
  prompt: string;
  feedback: string;
  onLetter: (letter: string) => void;
};

export default function WordModal({
  open,
  target,
  typedLetters,
  prompt,
  feedback,
  onLetter
}: WordModalProps) {
  if (!target) return null;
  const needed = new Set(target.name.toLowerCase().split(""));

  return (
    <ModalLayer open={open} labelledBy="wordModalTitle">
      <section className="word-modal-card">
        <h2 id="wordModalTitle">Look at the spelling</h2>
        <p id="wordModalPrompt">{prompt}</p>
        <div className="typed-word" aria-label="Typed word">
          {target.name.split("").map((_, index) => (
            <span key={index}>{typedLetters[index]?.toUpperCase() || ""}</span>
          ))}
        </div>
        <div className="alphabet-grid">
          {alphabet.map((letter) => (
            <button
              key={letter}
              type="button"
              className={`letter-tile ${needed.has(letter) ? "needed" : ""} ${
                typedLetters.includes(letter) ? "chosen" : ""
              }`}
              onClick={() => onLetter(letter)}
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="word-feedback">{feedback}</p>
      </section>
    </ModalLayer>
  );
}
