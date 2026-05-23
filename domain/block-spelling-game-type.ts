export type PlacedLetter = {
  letter: string;
  isFilled: boolean;
};

export type FallingLetter = {
  id: string;
  letter: string;
  x: number;
  y: number;
  speed: number;
};

export type CatchResult =
  | { type: "correct"; placeholderIndex: number }
  | { type: "already-completed" }
  | { type: "wrong" };
