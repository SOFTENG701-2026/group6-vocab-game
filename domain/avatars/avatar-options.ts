import type { AvatarOption } from "@/domain/avatars/avatar-types";

export const avatarOptions: AvatarOption[] = [
  {
    id: "cowboy",
    name: "Cowboy",
    imageSrc: "/avatars/apple.png",
    alt: "Apple avatar",
    availableFor: "human"
  },
  {
    id: "astronaut",
    name: "Astronaut",
    imageSrc: "/avatars/banana.png",
    alt: "Banana avatar",
    availableFor: "human"
  },
  {
    id: "student",
    name: "Student",
    imageSrc: "/avatars/orange.png",
    alt: "Orange avatar",
    availableFor: "human"
  },
  {
    id: "soup-buddy-bot",
    name: "Soup Buddy",
    imageSrc: "/avatars/soup-buddy-bot.png",
    alt: "Soup Buddy bot avatar",
    availableFor: "bot"
  }
];
