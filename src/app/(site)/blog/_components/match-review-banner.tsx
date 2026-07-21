"use client";
import Link from "next/link";
import Image from "next/image";

export function MatchReviewBanner() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-5xl mx-auto shadow-md">
      <h2 className="text-2xl md:text-3xl font-semibold text-red-600">
        Want Personalized Feedback?
      </h2>
      <p className="text-slate-700 mt-2 max-w-xl mx-auto">
        Get a professional match review from our coaching team and break through
        your plateau.
      </p>
      <Link
        href="/pro-match-review"
        className="inline-block bg-red-500 text-white px-6 py-3 my-3 rounded-md hover:bg-red-600 transition no-underline">
        Get a Match Review →
      </Link>

      {/* Nicholas Lum Quote */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center justify-center  text-left max-w-3xl mx-auto">
        <Image
          src="/images/pro-players/nicholas-lum-rounded.png" // Use non-rounded image
          alt="Nicholas Lum"
          height={100}
          width={100}
        />

        <div className="text-slate-700 ">
          <p className="italic text-base">
            “Alex is not just a skilled player but also a fantastic coach with
            years of experience competing at the highest international levels.
            His deep understanding of the game — from advanced strategy to
            fine-tuning technique — makes him an invaluable teacher.”
          </p>
          <div className="mt-2 font-semibold text-slate-900">
            — Nicholas Lum
          </div>
          <div className="text-slate-500 text-sm">
            Australian National Team • WR #41
          </div>
        </div>
      </div>
    </div>
  );
}
