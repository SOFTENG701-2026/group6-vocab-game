export type OptionType = "color" | "shape";

export type PendingSelection = {
  type: OptionType;
  id: string;
  startX: number;
  startY: number;
} | null;

export type CompletedArrow = {
  id: string;
  type: OptionType;
  sourceId: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  isCorrect: boolean;
};

export type ColorOption = {
  id: string;
  label: string;
  value: string;
};

export type ShapeOption = {
  id: string;
  label: string;

  imageSrc?: string;
};
