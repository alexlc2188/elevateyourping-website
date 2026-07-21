import { prismaDb } from "@/lib/db";
import { TrainingHeaderCard } from "@/components/headers/training-header-card";
import { formatTime } from "@/lib/utils";
import { TrainingClient } from "@/app/(app)/app/training/_components/TrainingClient";
import { UnlockMorePacksSection } from "./_components/UnlockMorePacksSection";

const freePackId =
  process.env.NODE_ENV === "development"
    ? "685b578a2312fa0148273f81"
    : "6857760c9cbdfe67f389d58d";

export const metadata = {
  title: "Elevate Training Tool | Free Table Tennis Drills & Technique Packs",
  description:
    "Train smarter with Elevate Training Tool — a guided training experience with drills, technique tips, timers, and demos. No signup required for Topspin Basics.",
  openGraph: {
    title: "Elevate Training Tool | Free Table Tennis Drills & Technique Packs",
    description:
      "Train smarter with Elevate Training Tool — a guided training experience with drills, technique tips, timers, and demos. No signup required for Topspin Basics.",
    url: "https://www.elevateyourping.com/elevate-training-tool",
    siteName: "Elevate Your Ping",
    images: [
      {
        url: "https://www.elevateyourping.com/images/home/elevate-tool.png",
        width: 800,
        height: 1000,
        alt: "Elevate Training Tool Preview",
      },
    ],
    type: "website",
  },
};

export default async function ElevateTrainingToolPage() {
  const freePack = await prismaDb.trainingPack.findUnique({
    where: {
      id: freePackId,
    },
    include: {
      exercises: {
        include: {
          trainingExercise: {
            include: {
              mainVideo: {
                select: {
                  publicUrl: true,
                  streamingUrl: true,
                },
              },
              previewVideo: {
                select: {
                  publicUrl: true,
                  streamingUrl: true,
                },
              },
              tags: {
                include: {
                  tag: true,
                },
              },
            },
          },
        },
        orderBy: {
          position: "asc", // optional: ensures stable ordering
        },
      },
    },
  });

  const totalDuration = Math.round(
    freePack?.exercises.reduce((acc, e) => {
      return acc + (e.trainingExercise.duration || 0);
    }, 0) ?? 0,
  );

  return (
    <section className="w-full px-4 py-10  bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl lg:text-5xl text-slate-900">
            Elevate <span className="text-red-600">Training Tool</span>
          </h1>
          <p className="md:text-lg text-slate-700 max-w-2xl mx-auto">
            Improve your game with guided table tennis drills. Try Topspin
            Basics right now — no signup needed.
          </p>
        </div>

        {/* Training Tool */}
        <div className="space-y-6">
          <TrainingHeaderCard
            pack={{
              description: freePack?.description ?? "",
              title: freePack?.title ?? "",
              exerciseCount: freePack?.exercises.length,
              totalDuration: formatTime(totalDuration),
              tags: ["speed", "power", "agility"],
              type: freePack?.trainingPackType ?? "technique",
            }}
          />
          <TrainingClient trainingPack={freePack!} />
        </div>
        <UnlockMorePacksSection />
      </div>
    </section>
  );
}
