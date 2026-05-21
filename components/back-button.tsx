"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/button";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  function handleBack() {
    if (pathname.startsWith("/home")) {
      router.push("/");
      return;
    }
    router.push("/");
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
