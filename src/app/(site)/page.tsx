import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Hero } from "./_components/Hero";
import MatchReviewSection from "./_components/MatchReviewSection";
import { FreePackSection } from "./_components/FreePackSection";
import { TestimonialSection } from "./_components/TestimonialSection";
import { MatchLogSection } from "./_components/MatchLogSection";
import { CtaSection } from "./_components/CtaSection";

export default async function HomePage() {
  const user = await currentUser();

  if (user) {
    redirect("/app");
  }

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <MatchReviewSection />
      <TestimonialSection />
      <FreePackSection />
      <CtaSection />
    </main>
  );
}
