"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrainingPackType } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Props {
  pack: {
    title: string;
    description: string;
    tags?: string[];
    totalDuration?: string;
    exerciseCount?: number;
    type: TrainingPackType;
    ctaLabel?: string;
    showTags?: boolean;
    hideBrowseButton?: boolean;
    startTrainingButton?: boolean;
  };
}

const backgroundColors: Record<any["type"], string> = {
  technique: "bg-blue-500",
  rally: "bg-red-500",
  serve: "bg-amber-500",
  return: "bg-purple-500",
  footwork: "bg-emerald-500",
  allInOne: "bg-teal-500",
};

export const TrainingHeaderCard = ({ pack }: Props) => {
  const {
    title,
    description,
    tags = [],
    totalDuration = 0,
    exerciseCount = 0,
    type,
    ctaLabel = "Browse Library",
    showTags = true,
    hideBrowseButton = false,
    startTrainingButton = false,
  } = pack;

  const bgColor = backgroundColors[type ?? "technique"];
  const pathname = usePathname();

  const isHomePage = pathname === "/app";
  const notLoggedin = pathname === "/elevate-training-tool"
 

  return (
    <div
      className={`${bgColor} text-white rounded-xl px-6 py-6 flex flex-col gap-3 shadow-md`}>
      <div className="flex items-stretch gap-4">
        {/* Fixed width, dynamic height based on sibling */}
        <div className="relative w-14 shrink-0">
          <div className="relative w-full h-full">
            <Image
              src="/logos/racquet1.png"
              alt="Paddle icon"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-3xl uppercase tracking-wide leading-tight">
            {title}
          </h2>
          <p className="text-sm opacity-90 mt-1 leading-snug line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {showTags && tags.length > 0 && (
        <div className="flex overflow-x-auto items-center gap-2 mt-2 px-1 no-scrollbar">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="min-w-[80px] text-center shrink-0 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <p className="text-sm font-medium">
          {exerciseCount} exercises • {totalDuration}
        </p>
        {!hideBrowseButton && (
          <div className="">
            {startTrainingButton ? (
              <Button
                variant="ghost"
                className={`bg-white text-black  px-6 py-2 rounded-xl hover:bg-white/90`}
                onClick={() => {
                  // Find the first exercise element and click it
                  const firstExercise = document.querySelector(
                    ".training-exercise-item",
                  );
                  if (firstExercise) {
                    (firstExercise as HTMLElement).click();
                  }
                }}>
                {ctaLabel}
              </Button>
            ) : (
              <Link
                href={notLoggedin ? "/drill-library" : isHomePage ? "/app/training" : "/app/training/library"}>
                <Button
                  variant="ghost"
                  className={`bg-white text-black  px-6 py-2 rounded-xl hover:bg-white/90`}>
                  {ctaLabel}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
