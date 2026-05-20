import type { AvatarId } from "@/domain/avatars/avatar-types";

export type PlayMode = "single" | "friend";

export type Difficulty = "easy" | "hard";

export type PlayerType = "human" | "bot";

export type PlayerSetup = {
  id: string;
  type: PlayerType;
  name: string;
  avatarId: AvatarId;
};

export type GameSetup = {
  playMode: PlayMode;
  difficulty: Difficulty;
  players: PlayerSetup[];
};
