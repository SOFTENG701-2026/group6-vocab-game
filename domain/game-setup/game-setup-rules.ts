import type { AvatarId } from "@/domain/avatars/avatar-types";
import type {
  Difficulty,
  GameSetup,
  PlayerSetup,
  PlayMode
} from "@/domain/game-setup/game-setup-types";

export function getRequiredHumanPlayerCount(playMode: PlayMode): number {
  if (playMode === "single") return 1;
  return 2;
}

export function shouldCreateBotPartner(playMode: PlayMode): boolean {
  return playMode === "single";
}

export function createBotPartner(): PlayerSetup {
  return {
    id: "bot-partner",
    type: "bot",
    name: "Soup Buddy",
    avatarId: "soup-buddy-bot"
  };
}

export function createHumanPlayer(
  playerNumber: number,
  name: string,
  avatarId: AvatarId
): PlayerSetup {
  return {
    id: `player-${playerNumber}`,
    type: "human",
    name,
    avatarId
  };
}

export function createFinalGameSetup(
  playMode: PlayMode,
  difficulty: Difficulty,
  humanPlayers: PlayerSetup[]
): GameSetup {
  const requiredHumanPlayers = getRequiredHumanPlayerCount(playMode);

  if (humanPlayers.length !== requiredHumanPlayers) {
    throw new Error(
      `Invalid setup: ${playMode} mode requires ${requiredHumanPlayers} human player(s).`
    );
  }

  const players = shouldCreateBotPartner(playMode)
    ? [...humanPlayers, createBotPartner()]
    : humanPlayers;

  return {
    playMode,
    difficulty,
    players
  };
}

export function isValidPlayMode(value: string | null): value is PlayMode {
  return value === "single" || value === "friend";
}

export function isValidDifficulty(value: string | null): value is Difficulty {
  return value === "easy" || value === "medium" || value === "hard";
}
