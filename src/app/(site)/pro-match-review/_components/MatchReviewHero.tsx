import VideoPlayer from "@/components/video-player";
import Link from "next/link";

const MATCH_REVIEW_HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_MATCH_REVIEW_HERO_VIDEO_URL ?? null;

export const MatchReviewHero = () => {
  return (
    <section className="bg-slate-50 py-12 mt-12 md:py-24 px-4 md:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div>
          <h2 className="text-center md:text-left text-2xl sm:text-4xl text-slate-900 mb-6 leading-tight tracking-tight">
            Get Pro Feedback on Your Table Tennis Match <br /> Improve in Weeks,
            Not Years
          </h2>

          <p className="text-base md:text-lg text-slate-700 mb-8">
            Upload your match, get a pro breakdown, and follow a plan designed
            just for you — like having a coach in your pocket.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/login"
              className="bg-primary text-center font-semibold text-white px-6 py-3 rounded-lg shadow hover:bg-red-700 transition">
              Start Your Match Review
            </Link>
          </div>
        </div>

        {/* Right video */}
        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
          <VideoPlayer videoUrl={MATCH_REVIEW_HERO_VIDEO_URL} controls />
        </div>
      </div>
    </section>
  );
};
