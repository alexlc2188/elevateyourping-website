"use client";

import { Match } from "@prisma/client";
import { useState } from "react";
// import { demoData } from "../../_data/demo";

import { MatchDetailedCard } from "../MatchDetailedCard";
import { MatchLog } from "@/lib/services/matches";

interface Props {
  matches: MatchLog[];
}

type MatchWithDemo = Match & {
  isDemo?: boolean;
};

export const ReviewsList = ({ matches }: Props) => {
  const [hiddenDemo, setHiddenDemo] = useState(false);

  // const matchesWithDemo = [demoData, ...matches] as MatchWithDemo[];
  const matchesWithDemo = [...matches] as MatchWithDemo[];

  const filteredMatches = matchesWithDemo.filter((match) => match.isPublished);

  return (
    <div className=" mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* {matches.length === 0 && (
        <p className="text-muted-foreground text-sm">No matches found.</p>
      )} */}

      {filteredMatches.map((match) => {
        const isReviewed = match.isPublished; // or however you track it

        return <MatchDetailedCard key={match.id} match={match} />;
      })}
    </div>
  );
};
