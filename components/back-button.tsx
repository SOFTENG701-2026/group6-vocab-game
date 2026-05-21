"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/button";

export default function BackButton() {
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

  if (pathname === "/") return null;

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
