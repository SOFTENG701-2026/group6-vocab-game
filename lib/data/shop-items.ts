import type { ShopItem } from "@/lib/game/types";

export const shopItems: Record<"pot" | "monster", ShopItem[]> = {
  pot: [
    { id: "classic", name: "Magic Swirl", icon: "🪄", price: 0, className: "" },
    { id: "starry", name: "Starry Pot", icon: "⭐", price: 80, className: "starry" },
    { id: "rainbow-pot", name: "Rainbow Pot", icon: "🌈", price: 120, className: "rainbow-pot" }
  ],
  monster: [
    { id: "purple", name: "Classic Purple", icon: "👾", price: 0, className: "" },
    { id: "octo", name: "Octo Monster", icon: "🐙", price: 100, className: "octo" },
    { id: "foxy", name: "Foxy Friend", icon: "🦊", price: 150, className: "foxy" },
    { id: "mint", name: "Mint Monster", icon: "🟢", price: 180, className: "mint" }
  ]
};
