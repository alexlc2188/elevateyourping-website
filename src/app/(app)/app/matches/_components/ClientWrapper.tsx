"use client";
import React from "react";
import { MatchViewToggle, ToggleViews } from "./MatchViewToggle";
import { MatchesStats } from "./views/MatchesStats";
import { MatchHistoryList } from "./views/MatchHistoryList";

import { ReviewsList } from "./views/ReviewsList";
import { MatchLog } from "@/lib/services/matches";
import { Stats } from "@/components/stats/TopOpponentsView";

interface Props {
  matches: MatchLog[];
  stats: Stats;
}

import { FloatingButton } from "@/components/buttons/FloatingButton";

export const ClientWrapper = ({ matches, stats }: Props) => {
  const [view, setView] = React.useState<ToggleViews>("history");
  const filteredMatchCount =
    matches.filter((match) => match.isPublished).length || 0;

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <MatchViewToggle
          onChange={setView}
          view={view}
          count={filteredMatchCount}
        />
      </div>
      {view !== "stats" && <FloatingButton />}
      {view === "history" && <MatchHistoryList matches={matches} />}
      {view === "reviews" && <ReviewsList matches={matches} />}
      {/* {view === "stats" && <MatchesStats matches={matches} stats={stats} />} */}
    </div>
  );
};
