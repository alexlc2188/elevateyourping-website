"use client";

import { useState } from "react";
import { TopOpponentsTable } from "./TopOpponentsTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { WinLossDonutChart } from "./WinLossDonutChart";
import { GlobalStatsSection } from "./GlobalStatsSection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WinRateOverTimeChart } from "./WinRateOverTimeChart";
import { TrophyIcon, PercentCircle, BarChart3 } from "lucide-react";
import { MatchLog } from "@/lib/services/matches";
import { getMatchOutcome } from "@/lib/utils";
import { calculateWinRateByMonth } from "@/lib/utils/matches-stats";
import { getInitials } from "@/lib/user";

const mockData = [
  {
    id: "1",
    name: "Emma Smith",
    matches: 5,
    win: 3,
    loss: 2,
    avgScore: 10.6,
    lastMatchDate: "2025-05-25",
  },
  {
    id: "2",
    name: "John Doe",
    matches: 4,
    win: 2,
    loss: 2,
    avgScore: 8.9,
    lastMatchDate: "2025-05-22",
  },
];

export type OpponentStats = {
  id: string;
  name: string;
  count: number;
  wins: number;
  losses: number;
};

export interface Stats {
  totalMatches: number;
  wins: number;
  losses: number;
  topOpponents: { name: string; count: number }[];
}

interface Props {
  matches: MatchLog[];
  stats: Stats;
}

export function calculateOpponentStats(matches: MatchLog[]): OpponentStats[] {
  const map: Record<
    string,
    { id: string; wins: number; losses: number; count: number }
  > = {};

  for (const match of matches) {
    const opponent = match.opponentName;
    const { result } = getMatchOutcome(match.finalScore);

    if (!map[opponent]) {
      map[opponent] = {
        id: match.id,
        wins: 0,
        losses: 0,
        count: 0,
      };
    }

    map[opponent].count++;

    if (result === "win") map[opponent].wins++;
    else if (result === "loss") map[opponent].losses++;
  }

  return Object.entries(map)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.count - a.count);
}

export function TopOpponentsView({ matches, stats }: Props) {
  const [selectedOpponent, setSelectedOpponent] =
    useState<OpponentStats | null>(null);

  const filtered = matches.filter(
    (match) => match.opponentName === selectedOpponent?.name,
  );

  const winRateData = calculateWinRateByMonth(filtered);
  return (
    <div className="pb-8">
      <GlobalStatsSection stats={stats} matches={matches} />
      <TopOpponentsTable
        data={calculateOpponentStats(matches)}
        onSelectOpponent={(opponent) => setSelectedOpponent(opponent)}
      />

      <Dialog
        open={!!selectedOpponent}
        onOpenChange={() => setSelectedOpponent(null)}>
        <DialogContent className=" overflow-y-auto max-h-[90vh]">
          <DialogHeader className="flex flex-col items-center space-y-2">
            <Avatar className="h-10 w-10 ring-2 ring-red-500">
              <AvatarFallback>
                {getInitials(selectedOpponent?.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-xl text-center font-normal">
              VS {selectedOpponent?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedOpponent && (
            <div className="space-y-6 text-sm">
              {/* 1. Profile Summary */}
              <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-4 gap-y-2 text-sm text-slate-800">
                {/* Matches */}
                <span className="flex items-center gap-1 text-muted-foreground font-medium">
                  <TrophyIcon className="w-4 h-4 text-secondary" />
                  Matches
                </span>
                <span>{selectedOpponent.count}</span>

                {/* Win Rate */}
                <span className="flex items-center gap-1 text-muted-foreground font-medium">
                  <PercentCircle className="w-4 h-4 text-secondary" />
                  Win Rate
                </span>
                <span>
                  {Math.round(
                    (selectedOpponent.wins / selectedOpponent.count) * 100,
                  )}
                  %
                </span>

                {/* W–L */}
                <span className="flex items-center gap-1 text-muted-foreground font-medium">
                  <BarChart3 className="w-4 h-4 text-secondary" />
                  W–L
                </span>
                <span>
                  {selectedOpponent.wins}–{selectedOpponent.losses}
                </span>
              </div>

              {/* 2. Win/Loss Over Time Chart */}
              <h4 className="text-sm  mb-2">Win/Loss Over Time</h4>
              <div className="grid grid-cols-2 ">
                <WinRateOverTimeChart data={winRateData} />
                <WinLossDonutChart
                  wins={selectedOpponent.wins}
                  losses={selectedOpponent.losses}
                />
              </div>

              {/* 4. Match History Button */}
              <div className="flex justify-center">
                <Button className="w-full" variant="outline" size="sm">
                  View Match History
                </Button>
              </div>

              {/* 5. CTA: Start Training Plan */}
              <div className="bg-secondary p-4 rounded-md text-center">
                <h4 className="text-lg font-normal  mb-1 text-black">
                  Train Against {selectedOpponent.name}
                </h4>
                <p className="text-sm text-black mb-3">
                  Start a personalized training plan based on your matches.
                </p>
                <Button
                  size="sm"
                  onClick={() => console.log("Start training clicked")}>
                  Start Training Plan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
