import { Card, CardContent } from "@/components/ui/card";
import { WinRateOverTimeChart } from "./WinRateOverTimeChart";
import { getMatchOutcome } from "@/lib/utils";
import { MatchLog } from "@/lib/services/matches";
import { Stats } from "./TopOpponentsView";
import { calculateWinRateByMonth } from "@/lib/utils/matches-stats";

interface Props {
  matches: MatchLog[];
  stats: Stats;
}

export function GlobalStatsSection({ stats, matches }: Props) {
  const totalMatches = stats.totalMatches;
  const wins = stats.wins;
  const losses = stats.losses;

  const topOpponents = stats.topOpponents;

  return (
    <div className="space-y-6">
      {/* First Row: Win/Loss Summary and Top Opponents */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {/* Win/Loss Summary */}
        <div className="bg-blue-500 text-white rounded-lg p-4">
          <h3 className="text-2xl font-bold">{totalMatches} Matches</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• {wins} Wins</li>
            <li>• {losses} Losses</li>
          </ul>
        </div>

        {/* Top Opponents */}
        <div className="border-2 rounded-xl border-gray-300">
          <div className="p-4">
            <h4 className="text-2xl  mb-2">Top Opponents</h4>
            <ul className="text-sm space-y-1">
              {topOpponents.map((opponent) => (
                <li key={opponent.name} className="flex justify-between">
                  <span>{opponent.name}</span>
                  <span className="">{opponent.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm  mb-2">Win Rate Over Time</h4>
              <WinRateOverTimeChart data={calculateWinRateByMonth(matches)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
