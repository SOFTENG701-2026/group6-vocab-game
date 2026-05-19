import type { Achievement } from "@/lib/game/types";

export const achievements: Achievement[] = [
  { id: "first-soup", name: "First Soup", icon: "✅", metric: "completions", need: 1, title: "Soup Starter" },
  { id: "three-soups", name: "3 Finished Soups", icon: "🏅", metric: "completions", need: 3, title: "Kitchen Helper" },
  { id: "ten-points", name: "10 Points", icon: "🏆", metric: "points", need: 10, title: "Magic Chef" },
  { id: "fifty-points", name: "50 Points", icon: "⭐", metric: "points", need: 50, title: "Soup Master" },
  { id: "hundred-points", name: "100 Points", icon: "🌟", metric: "points", need: 100, title: "Recall Legend" },
  { id: "ten-soups", name: "10 Finished Soups", icon: "💜", metric: "completions", need: 10, title: "Kind Coach" }
];
