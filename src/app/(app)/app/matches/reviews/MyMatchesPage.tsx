"use client";

import Link from "next/link";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { Check, Grid2X2, LayoutPanelLeft, List, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import { AddMatchCard } from "../AddMatchCard";
import MatchList from "../[matchId]/_components/MatchList";

type MatchWithHighlightThumb = Prisma.MatchGetPayload<{
  include: {
    highlightVideo: {
      select: {
        thumbnailUrl: true;
      };
    };
  };
}>;

interface MatchCardProps {
  match: MatchWithHighlightThumb;
  variant?: "carousel" | "grid" | "list";
}

const formattedDate = (date: Date) => ({
  day: date.getDate(),
  month: new Intl.DateTimeFormat("en-AU", { month: "short" })
    .format(date)
    .toUpperCase(),
  full: new Intl.DateTimeFormat("en-AU", {
    month: "long",
    year: "numeric",
  }).format(date),
  year: date.getFullYear(),
});

function MatchCard({ match, variant = "list" }: MatchCardProps) {
  const date = new Date(match.createdAt);
  const user = useCurrentUser();

  if (variant === "carousel") {
    return (
      <div className="relative w-full h-[calc(100vh-16rem)] overflow-hidden rounded-lg shadow-xl">
        <div className="w-full relative aspect-[9/16]">
          <Image
            fill
            src={match.highlightVideo?.thumbnailUrl ?? "/tempBg.jpg"}
            alt={`Match against ${match.opponentName}`}
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

        <div className="absolute inset-0 z-20 flex flex-col justify-between p-4">
          <div className="space-y-2">
            <div className="absolute top-4 left-4 z-30 bg-slate-800 text-white text-xs p-2 rounded-lg shadow ">
              <p className="bg-primary inline-block px-1">
                {match.eventName?.toUpperCase() || "EVENT"}
              </p>
              <div className="text-left text-white font-bold text-lg md:text-xl">
                Match vs {match.opponentName?.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-white/90">
              <div className="inline-flex rounded-full overflow-hidden border border-white">
                <div className="px-3 py-1 text-white font-bold text-lg">
                  {formattedDate(date).day}
                </div>
                <div className="px-3 py-1 bg-white text-black font-bold text-lg">
                  {formattedDate(date).month}
                </div>
              </div>
              <div className="bg-white text-black px-3 py-1 rounded-md shadow-sm text-lg font-semibold">
                {match.finalScore || ""}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {match.isPublished && (
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium text-sm">
                    Reviewed
                  </span>
                </div>
              )}
              <Link href={`/app/matches/${match.id}`}>
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-base py-3">
                  <Eye className="w-5 h-5 mr-2" /> View Match
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-black shadow-md">
        <Image
          fill
          src={match.highlightVideo?.thumbnailUrl ?? "/tempBg.jpg"}
          alt={`Match against ${match.opponentName}`}
          className="object-cover w-full h-full"
          priority
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Top badge */}
        <div className="absolute top-4 left-4 z-20 bg-slate-800/80 rounded-md px-2 py-1">
          <p className="text-xs text-white font-semibold">
            {match.eventName?.toUpperCase() || "EVENT"}
          </p>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="text-white space-y-1 mb-3">
            <h2 className="text-sm font-bold leading-tight truncate">
              Match vs {match.opponentName?.toUpperCase() || "OPPONENT"}
            </h2>
            <p className="text-[10px] text-primary font-medium">
              {formattedDate(date).full}
            </p>
          </div>

          <Link href={`/app/matches/${match.id}`}>
            <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md text-sm py-2">
              View Match
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // NOT USED BASICALLY THIS BELOW
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
      <div>
        <h2 className="text-base font-bold">
          {user?.name || "Jay"} VS {match.opponentName || "Jay"}
        </h2>
        <p className="text-sm text-muted-foreground">{match.eventName}</p>
        <p className="text-xs text-yellow-600 font-medium">
          {formattedDate(date).full} {formattedDate(date).year}
        </p>
      </div>
      <Link href={`/app/matches/${match.id}`}>
        <Button size="sm">View</Button>
      </Link>
    </div>
  );
}

export default function MyMatchesPage({
  matches,
}: {
  matches: MatchWithHighlightThumb[];
}) {
  const [viewMode, setViewMode] = useState<"carousel" | "grid" | "list">(
    "list",
  );

  return (
    <div>
      <div className="mx-auto py-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Matches</h1>
          <div className="flex gap-2">
            <Toggle
              pressed={viewMode === "carousel"}
              onPressedChange={() => setViewMode("carousel")}
              aria-label="Toggle carousel view">
              <LayoutPanelLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={viewMode === "grid"}
              onPressedChange={() => setViewMode("grid")}
              aria-label="Toggle grid view">
              <Grid2X2 className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={viewMode === "list"}
              onPressedChange={() => setViewMode("list")}
              aria-label="Toggle list view">
              <List className="h-4 w-4" />
            </Toggle>
          </div>
        </div>
      </div>

      {viewMode === "carousel" && (
        <div className="w-full mt-4">
          <Carousel className="w-full">
            <CarouselContent>
              {matches.map((match) => (
                <CarouselItem key={match.id}>
                  <MatchCard match={match} variant="carousel" />
                </CarouselItem>
              ))}
              <CarouselItem>
                <AddMatchCard variant="carousel" />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      )}

      {viewMode === "grid" && (
        <div className="px-0 mt-4 md:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <MatchCard key={match.id} variant="grid" match={match} />
            ))}
            <AddMatchCard variant="grid" />
          </div>
        </div>
      )}

      {viewMode === "list" && (
        <div className="pb-[100px]">
          <MatchList matches={matches} />
        </div>
      )}
    </div>
  );
}
