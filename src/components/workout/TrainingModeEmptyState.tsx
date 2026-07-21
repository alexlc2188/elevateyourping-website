import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

{
  /* Empty state */
}

export const TrainingModeEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6">
      <div className="w-full aspect-[4/3] relative">
        {/* todo: find a more suitable image */}
        <Image
          src="/stills/technique-1.jpg"
          alt="Robot with paddle"
          fill
          className="object-cover mx-auto"
        />
      </div>

      <p className="text-lg font-medium text-slate-800">
        Let’s get started by picking something from your available plans or
        exploring the drill library.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button asChild className="w-full text-md py-5" variant="default">
          <Link href="/app/training/library">📚 Explore Drill Library</Link>
        </Button>

        <Button asChild className="w-full text-md py-5" variant="secondary">
          <Link href="/app/matches">🎯 Start From Match Review</Link>
        </Button>
      </div>
    </div>
  );
};
