"use client";

import Image from "next/image";
import Confetti from "@/components/game/confetti";
import GameShell from "@/components/game/game-shell";
import { useGame } from "@/context/game-provider";

export default function HomePage() {
  const { openAvatarSelect } = useGame();

  return (
    <GameShell>
      <section className="home-screen" aria-labelledby="homeTitle">
        <Confetti />
        <Image
          src="/logo-title.png"
          alt="Magic Soup Buddies"
          width={400}
          height={120}
          priority
          className="home-logo"
        />
        <button
          type="button"
          className="primary-play"
          onClick={() => openAvatarSelect("solo")}
        >
          Play 👤
        </button>
        <p className="or-label">or</p>
        <button
          type="button"
          className="primary-play wide"
          onClick={() => openAvatarSelect("duo")}
        >
          Play With a Friend 👥
        </button>
      </section>
    </GameShell>
  );
}
