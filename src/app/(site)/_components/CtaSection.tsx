import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export const CtaSection = () => {
  return (
    <section className="bg-primary text-white py-24 text-center px-6">
      <h2 className="text-4xl md:text-5xl tracking-tight mb-6">
        Elevate Your Table Tennis Game — One Drill at a Time
      </h2>
      <p className="text-base md:text-lg max-w-xl mx-auto mb-10">
        Join Elevate Your Ping and start your first structured session today.
        Train smarter, improve faster — no guesswork.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 ">
        <Link href="/elevate-training-tool">
          <Button size="lg" variant="secondary" className="text-lg">
            Start Free Training
          </Button>
        </Link>
        <Link href="/pro-match-review">
          <Button
            size="lg"
            variant="outline"
            className="bg-white text-primary hover:bg-slate-100 text-lg">
            Get Coaching
          </Button>
        </Link>
      </div>
    </section>
  );
};
