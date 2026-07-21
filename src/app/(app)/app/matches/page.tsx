import { Suspense } from "react";
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";
import { currentUser } from "@/lib/auth";
import { getUserMatches, MatchLog } from "@/lib/services/matches";
import { redirect } from "next/navigation";

import { getMatchOutcome } from "@/lib/utils";
import { FloatingButton } from "@/components/buttons/FloatingButton";
import { ClientWrapper } from "./_components/ClientWrapper";
import { Spin } from "@/components/loading/spin";

export default async function MatchesLogsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login"); // or show a fallback error
  }

  const { success, data: matches, error } = await getUserMatches(user!.id);

  if (error) throw new Error("Data not found");

  if (!success || !matches) {
    return (
      <div className="px-4 space-y-4">
        <AppBreadcrumb />
        <div className="text-red-500 text-sm">
          Failed to load your match history. Please try again later.
        </div>
      </div>
    );
  }

  // --- Aggregation logic
  let wins = 0;
  let losses = 0;
  const opponentMap: Record<string, number> = {};

  for (const match of matches) {
    const { result } = getMatchOutcome(match.finalScore);
    if (result === "win") wins++;
    else if (result === "loss") losses++;

    opponentMap[match.opponentName] =
      (opponentMap[match.opponentName] || 0) + 1;
  }

  const topOpponents = Object.entries(opponentMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalMatches = matches.length;

  return (
    <div className="px-4 space-y-4 relative max-w-7xl mx-auto">
      <AppBreadcrumb />
      <Suspense fallback={<Spin />}>
        <ClientWrapper
          matches={matches}
          stats={{
            totalMatches,
            wins,
            losses,
            topOpponents,
          }}
        />
      </Suspense>
    </div>
  );
}
