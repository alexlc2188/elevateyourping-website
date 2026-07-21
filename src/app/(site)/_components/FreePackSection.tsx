import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export const FreePackSection = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 text-center md:text-left">
        {/* Left Text Content */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-4xl md:text-5xl tracking-tight text-black mb-6">
            🔥 Train Smarter With the Elevate Tool — No Signup Needed
          </h2>
          <p className="text-base md:text-lg text-slate-700 mb-8">
            Unlock a free, structured drill pack with video breakdowns, timers,
            and pro tips — built to level up your forehand, footwork, and
            timing.
          </p>
          <Link href="/elevate-training-tool">
            <Button size="lg" className="text-lg">
              Unlock Your Free Topspin Pack
            </Button>
          </Link>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center">
          <div className="rounded-xl overflow-hidden w-full max-w-sm">
            <Image
              src="/images/home/elevate-tool.png"
              alt="Preview of table tennis drill templates from the free pack"
              width={400}
              height={300}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
