import VideoPlayer from "@/components/video-player";
import React from "react";
import { CoachQuote } from "./CoachQuote";

const VIDEO_URL = process.env.NEXT_PUBLIC_MATCH_REVIEW_VIDEO_DEMO_URL ?? null;

export const CoachFeedbackSection = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 md:px-8 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Text + Quote */}
        <div className="order-1 md:order-2 space-y-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl text-slate-900 mb-2">
              Get Honest, Pro-Level Coaching
            </h2>
            <p className="text-slate-600 text-lg">
              You’ll stop guessing and start progressing — with direct,
              no-nonsense feedback from a top-level coach.
            </p>
          </div>
          <hr />
          <CoachQuote />
        </div>

        <div className="order-2 md:order-1 w-full rounded-lg overflow-hidden">
          <VideoPlayer videoUrl={VIDEO_URL} controls />
        </div>
      </div>
    </section>
  );
};
