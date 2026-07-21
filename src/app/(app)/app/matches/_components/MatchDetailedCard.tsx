import React from "react";
import { MatchDropdownMenu } from "./MatchDropdownMenu";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, convertDateToString, getMatchOutcome } from "@/lib/utils";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MatchLog } from "@/lib/services/matches";

type MatchWithDemo = MatchLog & {
  isDemo?: boolean;
};

interface Props {
  match: MatchWithDemo;
}

const getMatchDisplayState = (match: MatchLog) => {
  if (match.offerType === "LOG") {
    return {
      statusLabel: "Pending Upload",
      statusColor: "text-slate-600 border-slate-400",
      ctaLabel: "Upload Videos",
      ctaHref: `/app/matches/edit/${match.id}`,
    };
  }

  if (!match.isPublished) {
    return {
      statusLabel: "In Review",
      statusColor: "text-blue-600 border-blue-400",
      ctaLabel: "Edit Match",
      ctaHref: `/app/matches/edit/${match.id}`,
    };
  }

  if (match.isPublished && match.offerType === "REVIEW_ONLY") {
    return {
      statusLabel: "Reviewed",
      statusColor: "text-green-700 border-green-400",
      ctaLabel: "View Review",
      ctaHref: `/app/matches/${match.id}/review`,
    };
  }

  if (match.isPublished && match.offerType === "REVIEW_AND_PLAN") {
    return {
      statusLabel: "Reviewed + Plan Ready",
      statusColor: "text-emerald-700 border-emerald-400",
      ctaLabel: "View Training Plan",
      ctaHref: `/app/matches/${match.id}/review`,
    };
  }

  return {
    statusLabel: "Unknown",
    statusColor: "text-slate-600 border-slate-400",
    ctaLabel: "Edit",
    ctaHref: `/app/matches/edit/${match.id}`,
  };
};

export const MatchDetailedCard = ({ match }: Props) => {
  if (!match || !match.opponentName || !match.finalScore) {
    return (
      <Card className="p-6">
        <p className="text-sm text-red-500 font-medium">
          Failed to load match details. Please try again.
        </p>
      </Card>
    );
  }
  const isDemo = match?.isDemo ?? false;
  const isReviewAndPlan = match.offerType === "REVIEW_AND_PLAN";

  let outcome;
  try {
    outcome = getMatchOutcome(match.finalScore);
  } catch (e) {
    outcome = { colorClass: "bg-slate-200 text-slate-600", result: "unknown" };
  }

  const { colorClass } = outcome;

  const { statusLabel, statusColor, ctaLabel, ctaHref } =
    getMatchDisplayState(match);

  return (
    <Card
      key={match.id}
      className={cn(
        "relative transition-shadow border",
        isDemo && "ring-1 ring-orange-400/50 shadow-sm",
      )}>
      {isDemo && <MatchDropdownMenu matchId={match.id} />}
      <CardContent className="">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2 font-bold">
            {isDemo && (
              <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                Demo
              </Badge>
            )}
            <Badge
              variant={"outline"}
              className={`text-[10px] border ${statusColor}`}>
              {statusLabel}
            </Badge>
          </div>
          <h3 className=" text-2xl">
            {!!match.eventName
              ? `vs ${match.opponentName} @ ${match.eventName}`
              : `vs ${match.opponentName} `}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground my-1">
          {convertDateToString(match.matchDate)} •{" "}
          <span
            className={`text-sm font-medium px-2 py-1 rounded ${colorClass} ml-1`}>
            {match.finalScore}
          </span>
        </p>
        <p className="text-sm italic text-slate-600 line-clamp-2 mt-2  ">
          {match.logNote || "\u00A0"}
        </p>
        {isDemo && (
          <div className="p-1 bg-orange-50 mt-2">
            <p className="flex items-center text-sm text-orange-600 italic">
              This is a demo match to help you explore the features.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="flex-1 text-center space-y-2">
          <Separator />

          <p className="text-sm text-muted-foreground">
            {isReviewAndPlan
              ? "Includes highlight, coach review & training plan"
              : "Includes highlight & coach review"}
          </p>
          <Link href={`/app/matches/${match.id}`}>
            <Button variant="destructive" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View Full Analysis
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
