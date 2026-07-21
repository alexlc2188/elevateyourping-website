"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const CoachQuote = () => {
  return (
    <div className="flex gap-4 items-center mt-4">
      <div className="relative w-24 h-24 overflow-hidden rounded-full">
        <Image
          src="/images/home/alex-coach.png"
          alt="Coach Alex"
          fill
          className="object-contain rounded-full"
        />
      </div>
      <p className="text-base italic text-slate-600">
        “This is what I’d tell you at the table. Now you can get that feedback
        online.”
        <br />
        <span className="not-italic text-slate-500 font-medium">
          — Coach Alex
        </span>
      </p>
    </div>
  );
};
