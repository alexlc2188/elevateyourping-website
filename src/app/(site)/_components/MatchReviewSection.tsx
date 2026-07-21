import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MatchReviewSection() {
  return (
    <section className="w-full bg-white py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-4xl md:text-5xl tracking-tight text-black mb-6">
            Learn from Your Table Tennis Matches
          </h2>

          <p className="text-base md:text-lg text-slate-700 mb-6">
            Send us your match footage and receive a professionally edited
            highlight, detailed coach commentary, and a training plan tailored
            to your strengths and weaknesses.
          </p>

          {/* Testimonial */}
          <div className="border-l-4 border-red-600 pl-4 text-slate-700 text-sm md:text-base italic mb-8 text-left">
            “After my first review, I knew exactly what to work on. Within 2
            weeks, my game felt sharper and more focused.”
            <br />
            <span className="not-italic font-medium text-sm block mt-2">
              — Daniel, Club Player
            </span>
          </div>
          <Link href={"/auth/login"}>
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg">
            Submit My Match
          </Button>
          </Link>
        </div>

        {/* Right: Image */}
        <div className="rounded-xl overflow-hidden">
          <Image
            src="/images/home/match-review-phone.png"
            alt="Coach feedback and highlight video on mobile"
            width={800}
            height={600}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
