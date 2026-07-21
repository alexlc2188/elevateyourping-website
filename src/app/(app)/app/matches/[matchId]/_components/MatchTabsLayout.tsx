"use client";
import { useState } from "react";
import { InsightsColumn } from "./InsightsColumn";
import { TrainingPreviewColumn } from "./TrainingPreviewColumn";
import { TrainingListColumn } from "./TrainingListColumn";
import { VideosColumn } from "./VideosColumn";
import ToggleSwitcher from "./ToggleSwitcher";
import { MatchWithPayload } from "../page";
import { MatchOffer } from "@prisma/client";
import { CollapsibleVideosSection } from "./CollapsibleVideosSection";

export type Tab = "insights" | "training" | "videos";

export function MatchTabsLayout({
  matchId,
  match,
}: {
  matchId: string;
  match: MatchWithPayload;
}) {
  const [tab, setTab] = useState<Tab>("insights");
  const [activeIndex, setActiveIndex] = useState(0);

  // Check if payment is completed - only show videos if payment is successful
  const isPaymentCompleted = match.paymentStatus === "PURCHASED";

  return (
    <div className={`px-4 py-6 max-w-7xl  mx-auto `}>
      <ToggleSwitcher
        tab={tab}
        setTab={setTab}
        isPublished={match.isPublished}
        match={match}
      />

      <div
        className={`flex flex-col ${
          match.isPublished && match.offerType === MatchOffer.REVIEW_AND_PLAN
            ? "lg:grid-cols-3"
            : " mx-auto"
        } gap-6`}>
        {/* Column 1: Insights - Always visible on desktop, tab-based on mobile */}
        <div
          className={
            match.isPublished && match.offerType === MatchOffer.REVIEW_AND_PLAN
              ? tab === "insights"
                ? "block"
                : "hidden lg:block"
              : tab === "insights"
              ? "block"
              : "hidden lg:block"
          }>
          <InsightsColumn match={match} tab={tab} setTab={setTab} />
        </div>

        <div className="flex flex-col lg:flex-row-reverse lg:justify-between lg:gap-x-4">
          {/* Column 2: Preview - Only show if published and offer type is REVIEW_AND_PLAN */}
          {match.isPublished &&
            match.offerType === MatchOffer.REVIEW_AND_PLAN && (
              <div className="hidden lg:block lg:flex-1">
                <TrainingPreviewColumn
                  matchId={matchId}
                  match={match}
                  activeIndex={activeIndex}
                />
              </div>
            )}

          {/* Column 3: Training or Videos */}
          <div className={tab === "training" ? "block" : "hidden lg:flex"}>
            {match.isPublished &&
              match.offerType === MatchOffer.REVIEW_AND_PLAN && (
                <TrainingListColumn
                  match={match}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              )}
          </div>
        </div>

        {/* Videos Column - Show when videos tab is active (mobile only) */}
        {isPaymentCompleted && (
          <div className={tab === "videos" ? "block lg:hidden" : "hidden"}>
            <VideosColumn match={match} />
          </div>
        )}
      </div>

      {/* Desktop: Collapsible Videos Section for REVIEW_AND_PLAN */}
      {match.isPublished &&
        match.offerType === MatchOffer.REVIEW_AND_PLAN &&
        isPaymentCompleted && <CollapsibleVideosSection match={match} />}

      {/* For non-REVIEW_AND_PLAN: Show videos on desktop */}
      {(!match.isPublished || match.offerType !== MatchOffer.REVIEW_AND_PLAN) &&
        isPaymentCompleted && (
          <div className="hidden lg:block mx-auto mt-6">
            <VideosColumn match={match} />
          </div>
        )}
    </div>
  );
}
