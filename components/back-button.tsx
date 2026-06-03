"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/button";
import { useGameSetup } from "@/context/game-setup-context";

const BACK_ARROW = (
  <span className='inline-flex h-5 w-10 shrink-0 items-center overflow-visible'>
    <ArrowLeft className='h-5 w-5 origin-left scale-x-[2]' strokeWidth={4} />
  </span>
);

function BackButtonInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { difficulty } = useGameSetup();

  function handleBack() {
    const theme = searchParams.get("theme") ?? "fruits-vegetables";

    // From home, go back to landing page
    if (pathname.startsWith("/home")) {
      router.push("/");
      return;
    }

    // From game pages, go back to home with theme
    if (pathname === "/easygame" || pathname === "/game") {
      router.push(`/home?theme=${theme}`);
      return;
    }

    // From achievements/shop, return to the active game
    if (pathname === "/achievements" || pathname === "/shop") {
      if (difficulty === "easy") {
        router.push("/easygame");
        return;
      }

      if (difficulty === "medium" || difficulty === "hard") {
        router.push("/game");
        return;
      }
      // TODO: BUG when you navigate to the game or easygame page and return to theme page. Then clicking Achievements page and then back button it returns you to the game instead of the Theme page, ideally we should clear out the difficulty if the player goes back to lobby.
      router.push(`/home?theme=${theme}`);
      return;
    }

    // Fallback
    router.push(`/home?theme=${theme}`);
  }

  if (pathname === "/") {
    return (
      <span className='invisible pointer-events-none'>
        <Button size='small' iconPosition='left' icon={BACK_ARROW}>
          Back
        </Button>
      </span>
    );
  }

  return (
    <Button size='small' iconPosition='left' icon={BACK_ARROW} onClick={handleBack}>
      Back
    </Button>
  );
}

export default function BackButton() {
  return (
    <Suspense fallback={null}>
      <BackButtonInner />
    </Suspense>
  );
}
