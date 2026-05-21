import { Suspense } from "react";
import ThemeSelector from "@/components/theme/theme-selector";

export default function HomePage() {
  return (
    <main className="relative flex-1 overflow-hidden bg-orange-300">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <span className="absolute -left-10 top-24 h-28 w-28 rounded-full bg-orange-200/70" />
        <span className="absolute right-8 top-16 h-20 w-20 rounded-full bg-orange-200/60" />
        <span className="absolute bottom-24 left-1/4 h-16 w-16 rounded-full bg-orange-200/50" />
        <span className="absolute bottom-32 right-1/4 h-24 w-24 rounded-full bg-orange-200/60" />
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-center px-4 py-10">
        <Suspense fallback={<p className="font-bold text-black">Loading themes...</p>}>
          <ThemeSelector />
        </Suspense>
      </div>
    </main>
  );
}
