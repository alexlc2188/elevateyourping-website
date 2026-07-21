import { MatchLog } from "../services/matches";
import { getMatchOutcome } from "../utils";

export function calculateWinRateByMonth(matches: MatchLog[]) {
  const monthlyStats: Record<string, { wins: number; total: number }> = {};

  for (const match of matches) {
    const date = new Date(match.matchDate);
    const monthKey = date.toLocaleString("default", {
      month: "short",
    }); // e.g. "Apr"

    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = { wins: 0, total: 0 };
    }

    const { result } = getMatchOutcome(match.finalScore);
    if (result === "win") {
      monthlyStats[monthKey].wins++;
    }
    monthlyStats[monthKey].total++;
  }

  // Convert to chart-friendly format
  const result = Object.entries(monthlyStats).map(
    ([month, { wins, total }]) => ({
      month,
      rate: Math.round((wins / total) * 100),
    }),
  );

  // Optional: Sort by actual calendar month order
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  result.sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
  );

  return result;
}
