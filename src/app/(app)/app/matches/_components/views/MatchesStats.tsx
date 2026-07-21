"use client";
import { Stats, TopOpponentsView } from "@/components/stats/TopOpponentsView";
import { MatchLog } from "@/lib/services/matches";
import React from "react";

interface Props {
  matches: MatchLog[];
  stats: Stats
}

export const MatchesStats = ({ matches, stats }: Props) => {
  return (
    <div className="mt-4 ">
      <TopOpponentsView matches={matches} stats={stats} />
    </div>
  );
};
