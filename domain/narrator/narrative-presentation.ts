export type NarrativePresentation =
  | {
      type: "hidden";
    }
  | {
      type: "dialogue";
    }
  | {
      type: "caught-letter-dialogue";
      letter: string;
    };

export const DEFAULT_NARRATIVE_PRESENTATION: NarrativePresentation = {
  type: "dialogue",
};
