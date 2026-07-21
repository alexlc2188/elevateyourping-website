import { MatchWithPayload } from "../page";
import { MatchAnalysis } from "../../_components/MatchAnalysis";
import { TrainingSwitchBanner } from "../../_components/TrainingSwitchBanner";
import { Tab } from "./MatchTabsLayout";
import VideoPlayer from "@/components/video-player";
import { VideoPlayerWithDownload } from "@/components/video-player-with-download";
import { MatchVideoSection } from "@/components/match-video-section";
import { Card } from "@/components/ui/card";
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { MatchOffer } from "@prisma/client";
import { VideosColumn } from "./VideosColumn";
import { getVideoUrl } from "@/lib/utils/video-url";
import { generateVideoFilename } from "@/lib/utils/video-filename";
import { PurchaseOfferScreen } from "./PurchaseOfferScreen";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export function InsightsColumn({
  match,
  tab,
  setTab,
}: {
  match: MatchWithPayload;
  tab: Tab;
  setTab: (tab: Tab) => void;
}) {
  const searchParams = useSearchParams();
  const isPaymentSuccess = searchParams.get("success") === "true";

  const isPaid = match.paymentStatus === "PURCHASED";
  const isLog = match.offerType === MatchOffer.LOG;

  // If user just returned from successful Stripe checkout, treat as paid even if webhook hasn't arrived yet
  const isEffectivelyPaid = isPaid || isPaymentSuccess;

  // Handle payment status errors first
  if (
    match.paymentStatus === "FAILED" ||
    match.paymentStatus === "EXPIRED" ||
    match.paymentStatus === "CANCELLED"
  ) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-800">
              Payment{" "}
              {match.paymentStatus === "FAILED"
                ? "Failed"
                : match.paymentStatus === "EXPIRED"
                ? "Expired"
                : "Cancelled"}
            </h2>
            <p className="text-slate-600 max-w-md">
              {match.paymentStatus === "FAILED"
                ? "Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists."
                : match.paymentStatus === "EXPIRED"
                ? "Your checkout session has expired. Please start a new checkout to complete your purchase."
                : "Your payment was cancelled. You can try again whenever you're ready."}
            </p>
            <Button asChild>
              <Link
                href={`/app/checkout?matchId=${match.id}&selectedProductUpsell=${match.offerType}`}>
                Try Again
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 1. 📘 LOG Match — always show info + PurchaseOfferScreen
  if (isLog) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Opponent</p>
                <p className="font-medium">{match.opponentName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date</p>
                <p className="font-medium">
                  {new Date(match.matchDate).toISOString().split("T")[0]}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Score</p>
                <p className="font-medium">{match.finalScore}</p>
              </div>
              {match.logNote && (
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Notes</p>
                  <p className="font-medium">{match.logNote}</p>
                </div>
              )}
            </div>

            {match.detailedSetVideos?.length > 0 && (
              <div className="w-full">
                <VideosColumn match={match} />
              </div>
            )}

            <PurchaseOfferScreen match={match} />
          </div>
        </Card>
      </div>
    );
  }

  // 2. ⏳ Match not published yet, but paid (or just returned from successful payment) = in review
  if (!match.isPublished && isEffectivelyPaid) {
    return (
      <div className="space-y-6">
        {/* Payment Success Confirmation */}
        <Card className="p-8 lg:p-16 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-5xl  text-green-800">
              Payment Received!
            </h2>
            <p className="text-slate-600 max-w-md md:max-w-lg lg:text-lg">
              {isPaymentSuccess && !isPaid
                ? "Thank you for your purchase! We're processing your payment confirmation and will update your account shortly."
                : "Thank you for your purchase! Your payment has been successfully processed."}
            </p>

            {/* Show what they purchased */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
              <h3 className="md:text-lg lg:text-2xl text-green-900 mb-2">
                You Purchased:
              </h3>
              <div className="flex items-center justify-center gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium lg:text-base">
                  {match.offerType === "REVIEW_ONLY"
                    ? "Match Review"
                    : match.offerType === "REVIEW_AND_PLAN"
                    ? "Full Training Bundle (Match Review + Personalized Training Plan)"
                    : "Custom Package"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Review Progress Status */}
        <Card className="p-8 lg:p-16 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-amber-100 p-3">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-5xl ">
              Review in Progress
            </h2>
            <p className="text-slate-600 max-w-md md:max-w-lg lg:text-lg">
              Our coach is currently reviewing your match. This process
              typically takes 24–48 hours. You'll receive an email notification
              when your analysis is ready.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // 3. ⚠ Match payment pending or not complete (but not if user just returned from successful payment)
  if (match.paymentStatus === "PENDING" && !isPaymentSuccess) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-5xl ">
              Payment Required
            </h2>
            <p className="text-slate-600 max-w-md md:max-w-lg lg:text-lg">
              You selected a review offer, but the payment hasn't been completed
              yet. Please return to the checkout page to finalize your order.
            </p>
            <Button size={"lg"} asChild>
              <Link
                href={`/app/checkout?matchId=${match.id}&selectedProductUpsell=${match.offerType}`}>
                Continue to checkout
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 4. ✅ Published + paid = show analysis UI
  if (match.isPublished && isEffectivelyPaid) {
    return (
      <div className="space-y-6 flex flex-col lg:flex-row lg:gap-4">
        <div className="flex-1">
          <MatchVideoSection
            title="Match Highlights"
            videoUrl={getVideoUrl(match.highlightVideo)}
            publicUrl={match.highlightVideo?.publicUrl}
            poster="/images/matches/hero-insights.jpg"
            downloadFilename={generateVideoFilename(match, "highlights")}
          />
        </div>

        <div className="flex-1">
          <MatchVideoSection
            title="Match Analysis"
            videoUrl={getVideoUrl(match.reviewVideo)}
            publicUrl={match.reviewVideo?.publicUrl}
            poster="/images/post-match-strategy-frame.jpg"
            downloadFilename={generateVideoFilename(match, "analysis")}
          />
        </div>

        {match.offerType === "REVIEW_AND_PLAN" && (
          <TrainingSwitchBanner tab={tab} setTab={setTab} />
        )}
      </div>
    );
  }

  // 5. ⚠ Default fallback - should not normally reach here
  return (
    <div className="space-y-6">
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-slate-100 p-3">
            <AlertCircle className="h-8 w-8 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold">Loading...</h2>
          <p className="text-slate-600 max-w-md">
            Please wait while we load your match details.
          </p>
        </div>
      </Card>
    </div>
  );
}
