"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      size='small'
      iconPosition='left'
      icon={<ArrowLeft className='w-5 h-5' />}
      /**TODO:
       * router.push("/") to home when there is no gameplay going on.
       * router.push("/path to gameplay when the player has started a gameplay")
       *
       */
      onClick={() => router.push("/")}
    >
      Back
    </Button>
  );
}
