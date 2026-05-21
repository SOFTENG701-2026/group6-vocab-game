import { Suspense } from "react";
import ThemeSelector from "@/components/home/theme-selector";

export default function HomePage() {
  return (
    <main className="bg-orange-300 flex-1 flex w-full flex-col items-center justify-center gap-4 px-4">
      <Suspense fallback={<p className="text-black font-bold">Loading themes...</p>}>
        <ThemeSelector />
      </Suspense>
    </main>
  );
}
