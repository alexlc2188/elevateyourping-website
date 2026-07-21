"use client";

import { useState } from "react";
import Image from "next/image";

const steps = [
  { step: 1, label: "LOG A MATCH", image: "/images/home/log-match.png" },
  {
    step: 2,
    label: "SEE MATCH HISTORY",
    image: "/images/home/match-history.png",
  },
  {
    step: 3,
    label: "UNLOCK YOUR STATS",
    image: "/images/home/unlock-stats.png",
  },
  {
    step: 4,
    label: "GET MATCH REVIEW",
    image: "/images/home/match-review.png",
  },
];

export function MatchLogSection() {
  const [activeStep, setActiveStep] = useState(1); // default to step 3

  const currentImage =
    steps.find((s) => s.step === activeStep)?.image || steps[0].image;

  return (
    <section className="bg-[#f8fafc] py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Text + Steps */}
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl tracking-tight text-black mb-6 text-center md:text-left">
            Track Your Table Tennis Progress
          </h2>

          <p className="text-base md:text-lg text-slate-700 mb-8">
            Log your matches to uncover patterns in your game. Access match history, 
            stats, and detailed reviews — all tailored to help you improve faster in table tennis.
          </p>

          <div className="space-y-3">
            {steps.map(({ step, label }) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`w-full flex items-center justify-between border rounded-lg px-5 py-4 text-left text-sm md:text-base font-medium transition-all duration-200 cursor-pointer ${
                  step === activeStep
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-black border-slate-300 hover:border-blue-400"
                }`}>
                <span>
                  <span className="text-red-600 font-bold mr-2">{step}</span>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Dynamic Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image
            src={currentImage}
            alt={`Preview of step ${activeStep}`}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
