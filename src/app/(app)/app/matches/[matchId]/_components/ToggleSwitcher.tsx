"use client";
import { Toggle } from "@/components/ui/toggle";
import React from "react";
import { Logo } from "@/components/icons/logo";
import { Glasses, Video } from "lucide-react";
import { Tab } from "./MatchTabsLayout";
import { MatchOffer } from "@prisma/client";
import { MatchWithPayload } from "../page";

interface Props {
  tab: Tab;
  setTab: (tab: Tab) => void;
  isPublished?: boolean;
  match?: MatchWithPayload;
  // match?: {
  //   offerType: string;
  // };
}

const ToggleSwitcher = ({ tab, setTab, isPublished = true, match }: Props) => {
  const switchTo = (tab: Tab) => {
    setTab(tab);
  };

  // Determine the heading based on match status and type
  const getHeading = () => {
    if (match?.offerType === MatchOffer.LOG) return "Match Log";
    if (!isPublished) return "Match Review Pending";
    return "Your Match Review";
  };

  const getMobileHeading = () => {
    if (match?.offerType === MatchOffer.LOG) return "Match Log";

    // Don't show "Review Pending" unless the match was purchased
    const isPaid = match?.paymentStatus === "PURCHASED";

    if (!isPublished && isPaid) return "Review Pending";

    if (tab === "insights") return "Insights";
    if (tab === "training" && match?.offerType === "REVIEW_AND_PLAN")
      return "Training";
    if (tab === "videos") return "Your Videos";
    return "Insights";
  };

  const showToggle = isPublished && match?.offerType !== MatchOffer.LOG;
  const isPaymentCompleted = match?.paymentStatus === "PURCHASED";

  return (
    <div className="mx-auto pb-2  ">
      <div className="flex justify-between items-center">
        <h2 className="hidden text-5xl  lg:block  self-center mx-auto mb-4">
          {getHeading()}
        </h2>
        <h1 className="block text-3xl  lg:hidden  ">{getMobileHeading()}</h1>
        <div className="flex gap-2 lg:hidden">
          <Toggle
            pressed={tab === "insights"}
            onPressedChange={() => switchTo("insights")}
            className="h-10 w-10 p-2"
            aria-label="Toggle insights view">
            <Glasses className="size-6" />
          </Toggle>
          {showToggle && match?.offerType === "REVIEW_AND_PLAN" && (
            <Toggle
              pressed={tab === "training"}
              onPressedChange={() => switchTo("training")}
              className="h-10 w-10 p-2"
              aria-label="Toggle training view">
              <Logo className="size-6" />
            </Toggle>
          )}
          {/* Hide video toggle for match logs, or pending payments */}
          {match?.offerType !== MatchOffer.LOG && isPaymentCompleted && (
            <Toggle
              pressed={tab === "videos"}
              onPressedChange={() => switchTo("videos")}
              className="h-10 w-10 p-2"
              aria-label="Toggle videos view">
              <Video className="size-6" />
            </Toggle>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitcher;
