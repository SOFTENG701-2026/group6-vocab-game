"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/button";

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
        <Button size='small' iconPosition='left' icon={<ArrowLeft className='w-5 h-5' />}>
          Back
        </Button>
      </span>
    );
  }

  return (
    <Button
      size='small'
      iconPosition='left'
      icon={<ArrowLeft className='w-5 h-5' />}
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
