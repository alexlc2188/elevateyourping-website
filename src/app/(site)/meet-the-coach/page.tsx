import React from "react";
import { HeaderSection } from "../_components/HeaderSection";

export const metadata = {
  title: "Meet the Coach | Elevate Your Ping",
  description:
    "Get to know Elevate's lead coach — international competitor Alex Liu Cao — and see how his insights can help take your game to the next level.",
  openGraph: {
    title: "Meet the Coach | Elevate Your Ping",
    description:
      "Meet Alex Liu Cao, Elevate's head coach. International experience, elite feedback, and personalized training plans — all in one place.",
    url: "https://www.elevateyourping.com/pro-coaches",
    siteName: "Elevate Your Ping",
    images: [
      {
        url: "https://www.elevateyourping.com/images/pro-players/alex-liu-cao.jpg",
        width: 1200,
        height: 630,
        alt: "Meet the Coach - Elevate Your Ping",
      },
    ],
    type: "website",
  },
};

const CoachPage = async () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <HeaderSection
        subHeader="ElevateYourPing is led by a single expert for now — Alex Liu Cao — an international player with years of high-level experience. 
    Every review and drill plan is personally crafted by him to help you improve faster, smarter, and with purpose.">
        <h1 className="text-4xl lg:text-5xl text-slate-900">
          Meet Your <span className="text-red-600">Table Tennis Coach</span>
        </h1>
      </HeaderSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {/* Coach Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <img
            src="/images/pro-players/alex-liu-cao.jpg"
            alt="Coach Alex Zhang"
            className="w-full h-64 object-cover"
          />
          <div className="p-6 space-y-3">
            <h2 className="text-xl">Alex Liu Cao</h2>
            <p className="text-sm text-slate-600">
              New Zealand International Player · WR #442
            </p>
            <p className="text-sm text-slate-700">
              Alex brings years of experience competing at the highest
              international level. He’s a passionate coach dedicated to helping
              you improve smarter and faster.
            </p>
            <div className="flex gap-2">
              <span className="text-xs text-slate-500">
                🎓 Elevate Pro Coach
              </span>
              <span className="text-xs text-slate-500">
                🏓 Plays Right-handed
              </span>
            </div>
          </div>
        </div>

        {/* More coaches can follow with same structure */}
      </div>
    </div>
  );
};

export default CoachPage;
