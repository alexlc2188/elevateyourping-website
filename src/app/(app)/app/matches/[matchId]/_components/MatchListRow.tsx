"use client";

import Link from "next/link";
import { Match } from "@prisma/client";
import { BadgeCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MatchListRow({ match }: { match: Match }) {
  const isReviewed = match.isPublished;

  const date = new Date(match.createdAt);

  const formattedDate = {
    day: date.getDate(),
    month: new Intl.DateTimeFormat("en-AU", { month: "short" })
      .format(date)
      .toUpperCase(),
    full: new Intl.DateTimeFormat("en-AU", {
      month: "long",
      year: "numeric",
    }).format(date),
    year: date.getFullYear(),
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-xl shadow-sm bg-white">
      {/* Left side */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar>
          <AvatarImage src={undefined} />
          <AvatarFallback className="bg-blue-100 text-blue-700">
            {match.opponentName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="truncate">
          <p className="font-semibold text-lg truncate">{match.opponentName}</p>
          <p className="text-sm text-muted-foreground truncate">
            {formattedDate.day} {formattedDate.full}
          </p>
          <div className="flex items-center gap-1 mt-1 text-sm">
            {isReviewed ? (
              <>
                <BadgeCheck className="text-green-500 w-4 h-4" />
                <span className="text-green-600 font-medium">Reviewed</span>
              </>
            ) : (
              <>
                <Clock className="text-orange-600 w-4 h-4" />
                <span className="text-orange-600">Pending Review</span>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Right side */}
      {isReviewed && (
        <div className="shrink-0">
          <Button asChild variant={"destructive"} size={"sm"}>
            <Link href={`/app/matches/reviews/${match.id}`}></Link>
          </Button>
        </div>
      )}
    </div>
  );
}
