"use client";

import GameShell from "@/components/game/game-shell";
import { shopItems } from "@/lib/data/shop-items";
import { useGame } from "@/context/game-provider";
import type { ShopItem } from "@/lib/game/types";

export default function ShopPage() {
  const {
    profile,
    setProfile,
    shopTab,
    setShopTab,
    closeUtilityScreen,
    pausedReturnPath
  } = useGame();

  const ownsItem = (item: ShopItem) =>
    shopTab === "pot"
      ? profile.ownedPotSkins.includes(item.id)
      : profile.ownedMonsterSkins.includes(item.id);

  const isEquipped = (item: ShopItem) =>
    shopTab === "pot"
      ? profile.equippedPot === item.id
      : profile.equippedMonster === item.id;

  const buyOrEquip = (item: ShopItem) => {
    if (!ownsItem(item)) {
      if (profile.points < item.price) return;
      setProfile((p) => {
        const next = { ...p, points: p.points - item.price };
        if (shopTab === "pot") {
          next.ownedPotSkins = [...p.ownedPotSkins, item.id];
          next.equippedPot = item.id;
        } else {
          next.ownedMonsterSkins = [...p.ownedMonsterSkins, item.id];
          next.equippedMonster = item.id;
        }
        return next;
      });
      return;
    }
    setProfile((p) => ({
      ...p,
      equippedPot: shopTab === "pot" ? item.id : p.equippedPot,
      equippedMonster: shopTab === "monster" ? item.id : p.equippedMonster
    }));
  };

  return (
    <GameShell>
      <section className="shop-screen" aria-labelledby="shopTitle">
        <button
          type="button"
          className="screen-exit"
          onClick={closeUtilityScreen}
          aria-label="Back"
        >
          {pausedReturnPath ? "← Back to Game" : "← Home"}
        </button>
        <h1 id="shopTitle">Magic Shop</h1>
        <div className="shop-tabs" aria-label="Shop categories">
          <button
            type="button"
            className={`shop-tab ${shopTab === "pot" ? "active" : ""}`}
            onClick={() => setShopTab("pot")}
          >
            🍲 Pot Decor
          </button>
          <button
            type="button"
            className={`shop-tab ${shopTab === "monster" ? "active" : ""}`}
            onClick={() => setShopTab("monster")}
          >
            👾 Monster Skin
          </button>
        </div>
        <div className="shop-grid">
          {shopItems[shopTab].map((item) => {
            const owned = ownsItem(item);
            const equipped = isEquipped(item);
            const affordable = profile.points >= item.price;
            return (
              <article
                key={item.id}
                className={`shop-card ${owned || affordable ? "" : "locked"}`}
              >
                <span className="shop-art">{item.icon}</span>
                <strong>{item.name}</strong>
                <span className="shop-note">
                  {owned ? "Owned" : `${item.price} points`}
                </span>
                <button
                  type="button"
                  disabled={!owned && !affordable}
                  onClick={() => buyOrEquip(item)}
                >
                  {equipped ? "Equipped" : owned ? "Equip" : "Buy"}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </GameShell>
  );
}
