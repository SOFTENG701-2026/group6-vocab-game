"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import GameShell from "@/components/game/game-shell";
import IngredientCard from "@/components/game/ingredient-card";
import Monster from "@/components/game/monster";
import Pot from "@/components/game/pot";
import ExitConfirmModal from "@/components/modals/exit-confirm-modal";
import { useGame } from "@/context/game-provider";
import { ingredientBank } from "@/lib/data/ingredient-bank";
import { getColorOptions, getThreeOptions } from "@/lib/game/round-helpers";
import { ShapeMarkup } from "@/lib/game/shapes";
import { speakText } from "@/lib/game/speech";
import type { Ingredient } from "@/lib/game/types";
import { wait } from "@/lib/game/utils";

export default function GamePage() {
  const router = useRouter();
  const {
    mode,
    ingredients,
    round,
    setRound,
    selectedColor,
    setSelectedColor,
    selectedShape,
    setSelectedShape,
    added,
    setAdded,
    selectedAvatars,
    wrongStreak,
    setWrongStreak,
    activeGame,
    setActiveGame,
    goHome
  } = useGame();

  const [monsterLine, setMonsterLine] = useState("Let's make magic soup! Find apple!");
  const [cooking, setCooking] = useState(false);
  const [sayDisabled, setSayDisabled] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [botPicked, setBotPicked] = useState<string | null>(null);
  const potWrapRef = useRef<HTMLDivElement>(null);

  const item = ingredients[round];

  useEffect(() => {
    if (!activeGame) setActiveGame(true);
  }, [activeGame, setActiveGame]);

  useEffect(() => {
    if (!item) return;
    setSelectedColor(null);
    setSelectedShape(null);
    setLeftSelected(null);
    setRightSelected(null);
    setBotPicked(null);
    speakText(`Let's make magic soup! Find ${item.name.toLowerCase()}!`).then(
      () => setMonsterLine(`Let's make magic soup! Find ${item.name.toLowerCase()}!`)
    );
  }, [round, item, setSelectedColor, setSelectedShape]);

  const playerAType = round % 2 === 0 ? "color" : "shape";
  const playerBType = playerAType === "color" ? "shape" : "color";

  const speak = useCallback(async (text: string) => {
    setMonsterLine(text);
    await speakText(text);
  }, []);

  const checkRoundReady = useCallback(
    (target: Ingredient, color: string | null, shape: string | null) => {
      if (!color || !shape) return;
      const colorCorrect = color === target.color;
      const shapeCorrect = shape === target.id;
      if (colorCorrect && shapeCorrect) {
        setWrongStreak(0);
        speak(`Yes! This is ${target.name.toLowerCase()}.`);
      } else {
        const next = wrongStreak + 1;
        setWrongStreak(next);
        if (next >= 5) {
          speak(`Let me help: ${target.name} is ${target.color.toLowerCase()}.`);
        } else if (next >= 3) {
          speak(
            `Hint: choose ${target.color.toLowerCase()} and the ${target.name.toLowerCase()} shape.`
          );
        } else {
          speak(`Good try! Listen again: ${target.name.toLowerCase()}.`);
        }
      }
    },
    [speak, setWrongStreak, wrongStreak]
  );

  const handleChoice = (
    type: "color" | "shape",
    value: string,
    playerId: "A" | "B",
    isBot = false
  ) => {
    if (!item) return;
    if (playerId === "A") setLeftSelected(value);
    else {
      setRightSelected(value);
      if (isBot) setBotPicked(value);
    }
    if (type === "color") setSelectedColor(value);
    else setSelectedShape(value);

    const color = type === "color" ? value : selectedColor;
    const shape = type === "shape" ? value : selectedShape;

    if (mode === "solo" && playerId === "A" && !isBot) {
      window.setTimeout(() => {
        const botValue = playerBType === "color" ? item.color : item.id;
        setRightSelected(botValue);
        setBotPicked(botValue);
        if (playerBType === "color") setSelectedColor(item.color);
        else setSelectedShape(item.id);
        checkRoundReady(
          item,
          playerBType === "color" ? item.color : color,
          playerBType === "shape" ? item.id : shape
        );
      }, 260);
    } else {
      checkRoundReady(item, color, shape);
    }
  };

  const completeSpeaking = async () => {
    if (!item) return;
    const ready =
      selectedColor === item.color && selectedShape === item.id;
    if (!ready) {
      speak(`First find ${item.color.toLowerCase()} and the ${item.name.toLowerCase()} shape.`);
      return;
    }
    setSayDisabled(true);
    await speak(`Let's say it together: ${item.name}.`);
    await speak(`Great speaking! Let's add ${item.name.toLowerCase()} to the pot.`);
    setCooking(true);
    await wait(900);
    const letters = item.name.toLowerCase().split("").join(", ");
    await speakText(
      `${item.name.toLowerCase()}, follow me. ${letters}, ${item.name.toLowerCase()}!`,
      { rate: 0.78, pitch: 1.08, volume: 0.94 }
    );
    setCooking(false);
    setSayDisabled(false);
    const nextAdded = [...added, item];
    setAdded(nextAdded);
    const nextRound = round + 1;
    if (nextRound >= ingredients.length) {
      router.push("/recall");
    } else {
      setRound(nextRound);
    }
  };

  const requestExit = () => {
    setExitOpen(true);
    speakText("Do you want to exit the game?", { rate: 0.84, pitch: 1.08 });
  };

  if (!item) {
    return (
      <GameShell>
        <section className="home-screen">
          <button type="button" className="primary-play" onClick={() => router.push("/select")}>
            Choose Players
          </button>
        </section>
      </GameShell>
    );
  }

  const leftOptions =
    playerAType === "color"
      ? getColorOptions(item, round)
      : getThreeOptions(item, ingredients, round);
  const rightOptions =
    playerBType === "color"
      ? getColorOptions(item, round)
      : getThreeOptions(item, ingredients, round);

  const leftAvatar = selectedAvatars.A || { emoji: "👦" };
  const rightAvatar = selectedAvatars.B || { emoji: "🤖" };
  const leftName =
    mode === "solo" ? `Player 1 ${leftAvatar.emoji}` : `Player 1 ${leftAvatar.emoji}`;
  const rightName =
    mode === "solo"
      ? `Helper Bot ${rightAvatar.emoji}`
      : `Player 2 ${rightAvatar?.emoji || "👧"}`;

  return (
    <GameShell>
      <section className="game-screen" aria-live="polite">
        <button type="button" className="game-exit" onClick={requestExit}>
          Exit
        </button>
        <div className="upper-zone">
          <Monster line={monsterLine} />
          <div className="lesson-stage">
            <p className="round-label">
              Round {round + 1} of {ingredients.length}
            </p>
            <h2>Find {item.name}</h2>
            <div ref={potWrapRef}>
              <Pot soupColor={item.colorValue} cooking={cooking} />
            </div>
            <div className="say-panel">
              <button
                type="button"
                className="say-button"
                disabled={sayDisabled}
                onClick={completeSpeaking}
              >
                🎤 Add and Say it
              </button>
            </div>
          </div>
          <div className="ingredient-preview" aria-label="Ingredient choices">
            {getThreeOptions(item, ingredients, round).map((opt) => (
              <IngredientCard
                key={opt.id}
                item={opt}
                onClick={() =>
                  speak(
                    opt.id === item.id
                      ? `Yes! This is ${item.name.toLowerCase()}!`
                      : `Good try! Listen again: ${item.name.toLowerCase()}.`
                  )
                }
              />
            ))}
          </div>
        </div>

        <div className="lower-zone">
          <StudentPanel
            side="left"
            name={leftName}
            task={
              mode === "solo" && playerAType === "color"
                ? "Pick a color!"
                : playerAType === "color"
                  ? "Pick a color!"
                  : "Pick a shape!"
            }
            avatarEmoji={leftAvatar.emoji}
            options={leftOptions}
            optionType={playerAType}
            target={item}
            selected={leftSelected}
            botPicked={null}
            playerId="A"
            onChoice={handleChoice}
          />
          <StudentPanel
            side="right"
            name={rightName}
            task={
              mode === "solo"
                ? (playerBType === "color" ? "Bot picks a color!" : "Bot picks a shape!")
                : playerBType === "color"
                  ? "Pick a color!"
                  : "Pick a shape!"
            }
            avatarEmoji={rightAvatar.emoji}
            options={rightOptions}
            optionType={playerBType}
            target={item}
            selected={rightSelected}
            botPicked={botPicked}
            playerId="B"
            onChoice={handleChoice}
            right
          />
        </div>

        <footer className="progress-bar">
          <strong>In the pot:</strong>
          <span>
            {added.length
              ? added.map((i) => `${i.emoji} ${i.name}`).join("  ")
              : "Nothing yet"}
          </span>
          <span className="progress-stars">
            {Array.from({ length: ingredients.length }, (_, i) =>
              i < added.length ? "★" : "☆"
            ).join(" ")}
          </span>
        </footer>
      </section>

      <ExitConfirmModal
        open={exitOpen}
        onCancel={() => setExitOpen(false)}
        onConfirm={() => {
          setExitOpen(false);
          goHome();
        }}
      />
    </GameShell>
  );
}

function StudentPanel({
  side,
  name,
  task,
  avatarEmoji,
  options,
  optionType,
  target,
  selected,
  botPicked,
  playerId,
  onChoice,
  right = false
}: {
  side: "left" | "right";
  name: string;
  task: string;
  avatarEmoji: string;
  options: Ingredient[] | { name: string; value: string }[];
  optionType: "color" | "shape";
  target: Ingredient;
  selected: string | null;
  botPicked: string | null;
  playerId: "A" | "B";
  onChoice: (type: "color" | "shape", value: string, playerId: "A" | "B", isBot?: boolean) => void;
  right?: boolean;
}) {
  const studentClass = right ? "student green" : "student blue";

  return (
    <section className={`student-panel ${right ? "right" : ""}`}>
      {!right && (
        <div className={studentClass} aria-hidden="true">
          <span className="avatar-face">{avatarEmoji}</span>
          <span className="student-eye left" />
          <span className="student-eye right" />
        </div>
      )}
      <div>
        <p className="student-name">{name}</p>
        <h3>{task}</h3>
        <div className="choices">
          {optionType === "color"
            ? (options as { name: string; value: string }[]).map((opt) => {
                const colorItem =
                  opt.name === target.color
                    ? target
                    : ingredientBank.find((i) => i.color === opt.name) || target;
                const value = opt.name;
                const isSelected = selected === value;
                const isBot = botPicked === value;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`choice-card ${isSelected ? "selected" : ""} ${isBot ? "bot-pick" : ""}`}
                    onClick={() => onChoice("color", value, playerId)}
                  >
                    <span className="choice-emoji color-choice">{colorItem.emoji}</span>
                    <strong>{opt.name}</strong>
                  </button>
                );
              })
            : (options as Ingredient[]).map((opt) => {
                const value = opt.id;
                const isSelected = selected === value;
                const isBot = botPicked === value;
                return (
                  <button
                    key={value}
                    type="button"
                    className={`choice-card ${isSelected ? "selected" : ""} ${isBot ? "bot-pick" : ""}`}
                    onClick={() => onChoice("shape", value, playerId)}
                  >
                    <ShapeMarkup id={opt.id} />
                    <strong>{opt.name}</strong>
                  </button>
                );
              })}
        </div>
      </div>
      {right && (
        <div className={studentClass} aria-hidden="true">
          <span className="avatar-face">{avatarEmoji}</span>
          <span className="student-eye left" />
          <span className="student-eye right" />
        </div>
      )}
    </section>
  );
}
