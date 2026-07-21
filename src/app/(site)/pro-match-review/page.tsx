import React from "react";
import ComingSoonPage from "../_components/ComingSoonPage";
import { MatchReviewHero } from "./_components/MatchReviewHero";
import { PainPointsSection } from "./_components/PaintPointSection";
import { MatchHighlightSection } from "./_components/MatchHighlightSection";
import { CoachFeedbackSection } from "./_components/CoachFeedbackSection";
import { CustomTrainingPlanSection } from "./_components/CustomTrainingPlanSection";
import { ReviewPreviewHeader } from "./_components/ReviewPreviewHeader";
import { ReviewTestimonials } from "./_components/ReviewTestimonial";
import { CTAFinalSection } from "./_components/CTAFinalSection";
import { StickyMatchReviewCTA } from "./_components/StickyCta";
import VideoPlayer from "@/components/video-player";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MATCH_REVIEW_HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_MATCH_REVIEW_HERO_VIDEO_URL ?? null;

export const metadata = {
  title: "Pro Match Review | Table Tennis Coaching from Your Match",
  description:
    "Upload your match and get expert feedback + a custom drill plan to fix your weaknesses. Personal coaching from pro player Alex Liu Cao.",
  openGraph: {
    title: "Pro Match Review | Table Tennis Coaching from Your Match",
    description:
      "Upload your match and get expert feedback + a custom drill plan to fix your weaknesses. Personal coaching from pro player Alex Liu Cao.",
    url: "https://www.elevateyourping.com/pro-match-review",
    siteName: "Elevate Your Ping",
    images: [
      {
        url: "https://www.elevateyourping.com/images/home/match-review-phone.png",
        width: 1200,
        height: 630,
        alt: "Pro Match Review by Elevate Your Ping",
      },
    ],
    type: "website",
  },
};

const ProReviewPage = () => {
  return (
    <div className="lg:pt-12">
      <section className="bg-white py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl lg:text-5xl text-slate-900">
              Get a <span className="text-red-600">Pro Match Review</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Upload your match and get a breakdown from Elevate coach Alex Liu
              Cao — a top international player. Your drill plan is built to fix
              your weaknesses and unlock faster progress.
            </p>
            <Button size="lg" className="text-lg mt-4" asChild>
              <Link href="/auth/login">Start Your Match Review</Link>
            </Button>
          </div>
          <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            <VideoPlayer videoUrl={MATCH_REVIEW_HERO_VIDEO_URL} controls />
          </div>
        </div>
      </section>
      <PainPointsSection />
      {/* <ReviewPreviewHeader /> */}
      <MatchHighlightSection />
      <CoachFeedbackSection />
      <CustomTrainingPlanSection />
      <ReviewTestimonials />
      <CTAFinalSection />
      <StickyMatchReviewCTA />
    </div>
  );
};

export default ProReviewPage;
