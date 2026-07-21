import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/video-player";
import Link from "next/link";

const MATCH_REVIEW_HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_MATCH_REVIEW_HERO_VIDEO_URL ?? null;

export function Hero() {
  return (
    <section
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/images/home/bghome.jpg')",
      }}>
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-5xl leading-tight mb-4">
            Unlock Your Full <br className="hidden md:block" /> Table Tennis
            Potential
          </h1>

          <p className="text-base md:text-lg text-white/80 mb-8">
            Get professional feedback on your match footage and personalized
            training plans to take your <strong>table tennis</strong> game to
            the next level.
          </p>
          <Link href="/pro-match-review">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg">
              Learn From Your Match
            </Button>
          </Link>
        </div>
        <VideoPlayer videoUrl={MATCH_REVIEW_HERO_VIDEO_URL} controls />
      </div>
    </section>
  );
}
