export type AvatarId = "cowboy" | "astronaut" | "student" | "soup-buddy-bot"; //Subject to change

export type AvatarOption = {
  id: AvatarId;
  name: string;
  imageSrc: string;
  alt: string;
  availableFor: "human" | "bot" | "both";
};
