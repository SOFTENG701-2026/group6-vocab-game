"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useRouter } from "next/navigation";
import { avatars } from "@/lib/data/avatars";
import { achievements } from "@/lib/data/achievements";
import { ingredientBank } from "@/lib/data/ingredient-bank";
import { shopItems } from "@/lib/data/shop-items";
import { defaultProfile, loadProfile, saveProfile } from "@/lib/game/profile";
import { unlockSpeech } from "@/lib/game/speech";
import type {
  Avatar,
  GameMode,
  Ingredient,
  Profile,
  ShopTab
} from "@/lib/game/types";

type SelectedAvatars = { A: Avatar | null; B: Avatar | null };

type GameContextValue = {
  profile: Profile;
  setProfile: (updater: Profile | ((p: Profile) => Profile)) => void;
  saveProfileState: () => void;
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  ingredients: Ingredient[];
  setIngredients: (items: Ingredient[]) => void;
  round: number;
  setRound: (n: number) => void;
  selectedColor: string | null;
  setSelectedColor: (c: string | null) => void;
  selectedShape: string | null;
  setSelectedShape: (s: string | null) => void;
  added: Ingredient[];
  setAdded: (items: Ingredient[] | ((prev: Ingredient[]) => Ingredient[])) => void;
  recallTargetIndex: number;
  setRecallTargetIndex: (n: number) => void;
  selectedAvatars: SelectedAvatars;
  setSelectedAvatars: (a: SelectedAvatars) => void;
  selectingSlot: "A" | "B";
  setSelectingSlot: (s: "A" | "B") => void;
  shopTab: ShopTab;
  setShopTab: (t: ShopTab) => void;
  rewardAwarded: boolean;
  setRewardAwarded: (v: boolean) => void;
  wrongStreak: number;
  setWrongStreak: (n: number) => void;
  wordTarget: Ingredient | null;
  setWordTarget: (t: Ingredient | null) => void;
  typedLetters: string[];
  setTypedLetters: (letters: string[]) => void;
  activeGame: boolean;
  setActiveGame: (v: boolean) => void;
  pausedReturnPath: string | null;
  setPausedReturnPath: (p: string | null) => void;
  currentTitle: () => string;
  resetRoundState: () => void;
  initIngredients: () => void;
  openAvatarSelect: (mode: GameMode) => void;
  startGame: () => void;
  startContinuedGame: () => void;
  goHome: () => void;
  openUtilityScreen: (path: string) => void;
  closeUtilityScreen: () => void;
  getEquippedPotClass: () => string;
  getEquippedMonsterClass: () => string;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [profile, setProfileState] = useState<Profile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);

  const [mode, setMode] = useState<GameMode>("solo");
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => ingredientBank.slice(0, 6));
  const [round, setRound] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [added, setAdded] = useState<Ingredient[]>([]);
  const [recallTargetIndex, setRecallTargetIndex] = useState(0);
  const [selectedAvatars, setSelectedAvatars] = useState<SelectedAvatars>({
    A: avatars[0],
    B: avatars[3]
  });
  const [selectingSlot, setSelectingSlot] = useState<"A" | "B">("A");
  const [shopTab, setShopTab] = useState<ShopTab>("pot");
  const [rewardAwarded, setRewardAwarded] = useState(false);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [wordTarget, setWordTarget] = useState<Ingredient | null>(null);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [activeGame, setActiveGame] = useState(false);
  const [pausedReturnPath, setPausedReturnPath] = useState<string | null>(null);

  useEffect(() => {
    setProfileState(loadProfile());
    setHydrated(true);
    const onPointer = () => unlockSpeech();
    document.addEventListener("pointerdown", onPointer, { once: true });
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  const setProfile = useCallback(
    (updater: Profile | ((p: Profile) => Profile)) => {
      setProfileState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        return next;
      });
    },
    []
  );

  const saveProfileState = useCallback(() => {
    setProfileState((p) => {
      saveProfile(p);
      return p;
    });
  }, []);

  useEffect(() => {
    if (hydrated) saveProfile(profile);
  }, [profile, hydrated]);

  const currentTitle = useCallback(() => {
    const unlocked = achievements.filter(
      (badge) => (profile[badge.metric] || 0) >= badge.need
    );
    return unlocked.at(-1)?.title || "Soup Buddy";
  }, [profile]);

  const resetRoundState = useCallback(() => {
    setRound(0);
    setSelectedColor(null);
    setSelectedShape(null);
    setAdded([]);
    setRecallTargetIndex(0);
    setRewardAwarded(false);
    setWrongStreak(0);
    setWordTarget(null);
    setTypedLetters([]);
  }, []);

  const initIngredients = useCallback(() => {
    setIngredients(ingredientBank.slice(0, 6));
  }, []);

  const goHome = useCallback(() => {
    setActiveGame(false);
    setPausedReturnPath(null);
    setWordTarget(null);
    setTypedLetters([]);
    if (typeof window !== "undefined") window.speechSynthesis?.cancel?.();
    router.push("/");
  }, [router]);

  const openAvatarSelect = useCallback(
    (nextMode: GameMode) => {
      initIngredients();
      setMode(nextMode);
      setSelectingSlot("A");
      setSelectedAvatars({
        A: avatars[0],
        B: nextMode === "solo" ? avatars[3] : null
      });
      router.push("/select");
    },
    [initIngredients, router]
  );

  const startGame = useCallback(() => {
    setActiveGame(true);
    setPausedReturnPath(null);
    resetRoundState();
    router.push("/game");
  }, [resetRoundState, router]);

  const startContinuedGame = useCallback(() => {
    const reviewCount = Math.min(2, Math.max(1, added.length ? 2 : 1));
    const reviewItems = added.slice(-reviewCount);
    const previousIds = new Set(added.map((item) => item.id));
    const offset = Math.floor(profile.points / 10) % ingredientBank.length;
    const freshItems = ingredientBank
      .slice(offset)
      .concat(ingredientBank.slice(0, offset))
      .filter((item) => !previousIds.has(item.id))
      .slice(0, 6 - reviewItems.length);
    const shuffled = [...freshItems, ...reviewItems].sort(
      (a, b) => ((a.id.charCodeAt(0) * 37) % 5) - ((b.id.charCodeAt(0) * 37) % 5)
    );
    setIngredients(shuffled);
    startGame();
  }, [added, profile.points, startGame]);

  const openUtilityScreen = useCallback(
    (path: string) => {
      if (activeGame) {
        const current =
          typeof window !== "undefined" ? window.location.pathname : null;
        setPausedReturnPath(current);
      } else {
        setPausedReturnPath(null);
      }
      router.push(path);
    },
    [activeGame, router]
  );

  const closeUtilityScreen = useCallback(() => {
    if (pausedReturnPath) {
      const path = pausedReturnPath;
      setPausedReturnPath(null);
      router.push(path);
      return;
    }
    goHome();
  }, [pausedReturnPath, router, goHome]);

  const getEquippedPotClass = useCallback(() => {
    return shopItems.pot.find((i) => i.id === profile.equippedPot)?.className || "";
  }, [profile.equippedPot]);

  const getEquippedMonsterClass = useCallback(() => {
    return (
      shopItems.monster.find((i) => i.id === profile.equippedMonster)?.className || ""
    );
  }, [profile.equippedMonster]);

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      saveProfileState,
      mode,
      setMode,
      ingredients,
      setIngredients,
      round,
      setRound,
      selectedColor,
      setSelectedColor,
      selectedShape,
      setSelectedShape,
      added,
      setAdded,
      recallTargetIndex,
      setRecallTargetIndex,
      selectedAvatars,
      setSelectedAvatars,
      selectingSlot,
      setSelectingSlot,
      shopTab,
      setShopTab,
      rewardAwarded,
      setRewardAwarded,
      wrongStreak,
      setWrongStreak,
      wordTarget,
      setWordTarget,
      typedLetters,
      setTypedLetters,
      activeGame,
      setActiveGame,
      pausedReturnPath,
      setPausedReturnPath,
      currentTitle,
      resetRoundState,
      initIngredients,
      openAvatarSelect,
      startGame,
      startContinuedGame,
      goHome,
      openUtilityScreen,
      closeUtilityScreen,
      getEquippedPotClass,
      getEquippedMonsterClass
    }),
    [
      profile,
      setProfile,
      saveProfileState,
      mode,
      ingredients,
      round,
      selectedColor,
      selectedShape,
      added,
      recallTargetIndex,
      selectedAvatars,
      selectingSlot,
      shopTab,
      rewardAwarded,
      wrongStreak,
      wordTarget,
      typedLetters,
      activeGame,
      pausedReturnPath,
      currentTitle,
      resetRoundState,
      initIngredients,
      openAvatarSelect,
      startGame,
      startContinuedGame,
      goHome,
      openUtilityScreen,
      closeUtilityScreen,
      getEquippedPotClass,
      getEquippedMonsterClass
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
