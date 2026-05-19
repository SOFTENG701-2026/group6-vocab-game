export type Ingredient = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  colorValue: string;
  category: string;
  trait: string;
  spell: string;
};

export type Avatar = {
  id: string;
  name: string;
  emoji: string;
};

export type Achievement = {
  id: string;
  name: string;
  icon: string;
  metric: "completions" | "points";
  need: number;
  title: string;
};

export type ShopItem = {
  id: string;
  name: string;
  icon: string;
  price: number;
  className: string;
};

export type Profile = {
  points: number;
  completions: number;
  ownedPotSkins: string[];
  ownedMonsterSkins: string[];
  equippedPot: string;
  equippedMonster: string;
};

export type GameMode = "solo" | "duo";

export type ShopTab = "pot" | "monster";
