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
      onClick={() => router.back()}
    >
      Back
    </Button>
  );
}
