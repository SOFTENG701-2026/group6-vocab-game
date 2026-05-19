import type { Profile } from "@/lib/game/types";

export const defaultProfile: Profile = {
  points: 0,
  completions: 0,
  ownedPotSkins: ["classic"],
  ownedMonsterSkins: ["purple"],
  equippedPot: "classic",
  equippedMonster: "purple"
};

const STORAGE_KEY = "magicSoupProfile";

export function loadProfile(): Profile {
  if (typeof window === "undefined") return { ...defaultProfile };
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return { ...defaultProfile, ...stored };
  } catch {
    return { ...defaultProfile };
  }
}

export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
