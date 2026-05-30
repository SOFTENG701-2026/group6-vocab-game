"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/button";
import { useGameSetup } from "@/context/game-setup-context";

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

      router.push(`/home?theme=${theme}`);
      return;
    }

    // Fallback
    router.push(`/home?theme=${theme}`);
  }

  if (pathname === "/") {
    return (
      <span className='invisible pointer-events-none'>
        <Button size='small' iconPosition='left' icon={<ArrowLeft className='w-5 h-5' />}>
          Back
        </Button>
      </span>
    );
  }

  return (
    <Button size='small' iconPosition='left' icon={<ArrowLeft className='w-5 h-5' />} onClick={handleBack}>
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
