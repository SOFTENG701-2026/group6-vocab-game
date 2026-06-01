export type NarrativeMilestone =
  | "game_started_intro_seen" //Narrator in game page
  | "all_minigames_completed"
  | "shop_intro_seen" //Narrator introduces shop
  | "achievements_intro_seen" //Narrator introduces achievements
  | "shop_discovered_early"
  | "achievements_discovered_early";

export type NarrativeProgress = {
  completedMilestones: NarrativeMilestone[];
};

export const initialNarrativeProgress: NarrativeProgress = {
  completedMilestones: [],
};

export function hasMilestone(progress: NarrativeProgress, milestone: NarrativeMilestone) {
  return progress.completedMilestones.includes(milestone);
}

export function addMilestones(progress: NarrativeProgress, milestones: NarrativeMilestone[]): NarrativeProgress {
  const nextMilestones = [...progress.completedMilestones];

  for (const milestone of milestones) {
    if (!nextMilestones.includes(milestone)) {
      nextMilestones.push(milestone);
    }
  }

  return {
    ...progress,
    completedMilestones: nextMilestones,
  };
}
