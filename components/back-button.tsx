"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/button";

const BACK_ARROW = (
  <span className='inline-flex h-5 w-10 shrink-0 items-center overflow-visible'>
    <ArrowLeft
      className='h-5 w-5 origin-left scale-x-[2]'
      strokeWidth={4}
    />
  </span>
);

function BackButtonInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleBack() {
    if (pathname.startsWith("/home")) {
      router.push("/");
      return;
    }
    const theme = searchParams.get("theme") ?? "fruits-vegetables";
    router.push(`/home?theme=${theme}`);
  }

  if (pathname === "/") {
    return (
      <span className="invisible pointer-events-none">
        <Button size='small' iconPosition='left' icon={BACK_ARROW}>
          Back
        </Button>
      </span>
    );
  }

  return (
    <Button
      size='small'
      iconPosition='left'
      icon={BACK_ARROW}
      onClick={handleBack}
    >
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
