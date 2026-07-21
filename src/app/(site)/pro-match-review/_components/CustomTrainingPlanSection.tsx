import VideoPlayer from "@/components/video-player";
import React from "react";

const VIDEO_URL = process.env.NEXT_PUBLIC_TRAINING_TOOL_DEMO_URL ?? null;

export const CustomTrainingPlanSection = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl text-slate-900 mb-4">
            Train With Purpose
          </h2>
          <p className="text-slate-600 text-lg mb-6">
            Walk away with 3–5 specific drills built to fix your biggest
            weaknesses — no more random reps.
          </p>
        </div>
        <div className="w-full rounded-lg overflow-hidden">
          <VideoPlayer videoUrl={VIDEO_URL} controls />
        </div>
      </div>
    </section>
  );
};
