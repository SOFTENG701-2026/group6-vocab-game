"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import GameShell from "@/components/game/game-shell";
import IngredientCard from "@/components/game/ingredient-card";
import Monster from "@/components/game/monster";
import Pot from "@/components/game/pot";
import EndChoiceModal from "@/components/modals/end-choice-modal";
import PointsModal from "@/components/modals/points-modal";
import WordModal from "@/components/modals/word-modal";
import { useGame } from "@/context/game-provider";
import { speakText } from "@/lib/game/speech";
import type { Ingredient } from "@/lib/game/types";

export default function RecallPage() {
  const router = useRouter();
  const {
    added,
    ingredients,
    recallTargetIndex,
    setRecallTargetIndex,
    wordTarget,
    setWordTarget,
    typedLetters,
    setTypedLetters,
    rewardAwarded,
    setRewardAwarded,
    profile,
    setProfile,
    goHome,
    startContinuedGame
  } = useGame();

  const [recallLine, setRecallLine] = useState("What did we put in the pot?");
  const [conceptText, setConceptText] = useState("");
  const [showConcept, setShowConcept] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [wordOpen, setWordOpen] = useState(false);
  const [wordPrompt, setWordPrompt] = useState("");
  const [wordFeedback, setWordFeedback] = useState("Tap the letters in order.");
  const [pointsOpen, setPointsOpen] = useState(false);
  const [endChoiceOpen, setEndChoiceOpen] = useState(false);

  const target = added[recallTargetIndex];

  const speak = useCallback(async (text: string) => {
    setRecallLine(text);
    await speakText(text);
  }, []);

  useEffect(() => {
    if (!added.length) {
      router.replace("/");
      return;
    }
    if (target) {
      speak(`What did we put in the pot? Find ${target.name.toLowerCase()}!`);
    }
    setShowConcept(false);
    setShowRestart(false);
  }, [recallTargetIndex, target, added.length, router, speak]);

  const handleRecall = async (item: Ingredient) => {
    if (!target) return;
    if (item.id !== target.id) {
      speak(`Good try! We added ${target.name.toLowerCase()}. Can you tap ${target.name.toLowerCase()}?`);
      return;
    }
    await speak(`Yes! ${target.name}!`);
    const concept = `${target.name} is a ${target.category}. It is ${target.trait}.`;
    setConceptText(concept);
    setShowConcept(true);
    await speakText(concept);
    openWordModal(target);
  };

  const openWordModal = async (t: Ingredient) => {
    setWordTarget(t);
    setTypedLetters([]);
    const spelling = t.name.toUpperCase().split("").join("-");
    setWordOpen(true);
    setWordPrompt(spelling);
    await speakText(spelling);
    setWordFeedback(`Tap the letters in order to spell ${t.name}.`);
  };

  const handleLetter = (letter: string) => {
    if (!wordTarget) return;
    const expected = wordTarget.name.toLowerCase()[typedLetters.length];
    if (letter !== expected) {
      setWordFeedback(`Good try. The next letter is ${expected.toUpperCase()}.`);
      return;
    }
    const next = [...typedLetters, letter];
    setTypedLetters(next);
    if (next.length === wordTarget.name.length) {
      setWordFeedback(`Yes! You spelled ${wordTarget.name}.`);
      window.setTimeout(() => {
        setWordOpen(false);
        advanceRecall();
      }, 700);
      return;
    }
    const nextLetter = wordTarget.name.toLowerCase()[next.length];
    setWordFeedback(`Great. Next letter: ${nextLetter.toUpperCase()}.`);
  };

  const advanceRecall = () => {
    window.setTimeout(() => {
      const nextIndex = recallTargetIndex + 1;
      if (nextIndex >= added.length) {
        speak("Magic soup is ready!");
        setConceptText("Wonderful remembering! You earned 10 points.");
        setShowConcept(true);
        setShowRestart(true);
        setPointsOpen(true);
        speakText("You earned ten points.", { rate: 0.84, pitch: 1.08 });
      } else {
        setRecallTargetIndex(nextIndex);
      }
    }, 250);
  };

  const awardPoints = () => {
    if (!rewardAwarded) {
      setRewardAwarded(true);
      setProfile((p) => ({
        ...p,
        points: p.points + 10,
        completions: p.completions + 1
      }));
    }
    setPointsOpen(false);
    setEndChoiceOpen(true);
  };

  if (!added.length) return null;

  return (
    <GameShell>
      <section className="recall-screen" aria-live="polite">
        <Monster line={recallLine} className="recall-teacher" />
        <div className="final-pot">
          <Pot big rainbow />
        </div>
        <h2>What did we put in the pot?</h2>
        <div className="recall-grid">
          {ingredients.map((item) => (
            <IngredientCard
              key={item.id}
              item={item}
              onClick={() => handleRecall(item)}
            />
          ))}
        </div>
        {showConcept && (
          <p className="concept-card">{conceptText}</p>
        )}
        {showRestart && (
          <button type="button" className="primary-play" onClick={goHome}>
            Play Again
          </button>
        )}
      </section>

      <WordModal
        open={wordOpen}
        target={wordTarget}
        typedLetters={typedLetters}
        prompt={wordPrompt}
        feedback={wordFeedback}
        onLetter={handleLetter}
      />
      <PointsModal open={pointsOpen} onOk={awardPoints} />
      <EndChoiceModal
        open={endChoiceOpen}
        onContinue={startContinuedGame}
        onHome={goHome}
      />
    </GameShell>
  );
}
