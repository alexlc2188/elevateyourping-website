import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList, Video } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { TrainingHeaderCard } from "@/components/headers/training-header-card";
import { prismaDb } from "@/lib/db";
import { redirect } from "next/navigation";
import { formatTime } from "@/lib/utils";

const getUserTrainingPackId = async (userId: string) => {
  try {
    const data = await prismaDb.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        selectedTrainingPackId: true,
      },
    });

    if (!data) {
      return {
        data: null,
        error: "No training pack selected found",
        success: false,
      };
    }

    return {
      data,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching trainingPackId", error);
    return {
      data: null,
      error: "Could not retrieve user pack id",
      success: false,
    };
  }
};

export default async function DashboardHome() {
  const user = await currentUser();

  if (!user) redirect("/auth/login");

  const { data } = await getUserTrainingPackId(user.id);

  let pack;

  // todo: load id of beginner pack when we have it.
  // by default give the free beginner pack.

  if (data?.selectedTrainingPackId) {
    pack = await prismaDb.trainingPack.findUnique({
      where: {
        id: data.selectedTrainingPackId,
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
              },
            },
          },
          orderBy: {
            position: "asc", // optional: ensures stable ordering
          },
        },
      },
    });
  }

  const totalDuration = Math.round(
    pack?.exercises.reduce((acc, e) => {
      return acc + (e.trainingExercise.duration || 0);
    }, 0) ?? 0,
  );

  return (
    <div className="p-4 space-y-6 lg:p-8 lg:my-8 max-w-7xl mx-auto lg:bg-slate-100 lg:rounded-xl">
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden shadow-md bg-black lg:h-[350px]">
        <Image
          src="/images/hero-admin.jpg"
          alt="Hero Player"
          fill
          className="object-cover opacity-70 z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-0" />

        <div className="relative z-10 p-6 text-white lg:flex lg:items-center lg:justify-between  lg:h-[350px]">
          <div className="mx-auto space-y-4">
            <div>
              <h2 className="text-3xl lg:text-5xl  tracking-tight">
                Welcome Back, {user?.name}!
              </h2>
              <p className="text-sm mt-2 text-white/90 lg:text-lg lg:max-w-2/3">
                Let&apos;s elevate your game today. Continue your training or
                explore something new.
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <Button className="text-lg" asChild>
                <Link href="/app/training/library">
                  Explore Drills Library
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Review - Now prominently placed */}
      <div>
        <h2 className="text-2xl lg:text-3xl mb-4">PROFESSIONAL REVIEW</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Upload Match */}
          <div className="w-full rounded-xl border-2 border-red-200 p-6 bg-gradient-to-br from-red-50 to-orange-50  transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="bg-red-500 p-4 rounded-full">
                <Video className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium  mb-2 text-lg text-slate-900 md:text-xl">
                  Get Pro Match Review
                </h3>
                <p className="text-slate-700 mb-4 text-sm">
                  Upload your match to receive professional highlights,
                  insights, and a personalized training plan.
                </p>
                <Button asChild>
                  <Link href="/app/matches/log-match?intent=pro-review">
                    Upload Match Video
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* View My Reviews */}
          <div className="w-full rounded-xl border p-6 bg-white  transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="bg-slate-200 p-4 rounded-full ">
                <ClipboardList className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-2 text-slate-900 md:text-xl">
                  View My Match Reviews
                </h3>
                <p className="text-slate-700 mb-4 text-sm">
                  See your uploaded matches, feedback, and training plans — all
                  in one place.
                </p>
                <Button asChild>
                  <Link href="/app/matches">View Reviews</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Tools - Simplified and less prominent */}
      {/* <div>
        <h2 className="text-2xl lg:text-3xl mb-4">MATCH TOOLS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/app/matches">
            <div className="rounded-lg border p-3 hover:shadow-sm transition cursor-pointer bg-white">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-medium text-base md:text-xl">
                    View Matches
                  </h3>
                  <p className="text-xs text-muted-foreground md:text-base">
                    See your match history and stats
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/app/matches/log-match">
            <div className="rounded-lg border p-3 hover:shadow-sm transition cursor-pointer bg-white">
              <div className="flex items-center gap-3">
                <Plus className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-medium text-base md:text-xl">
                    New Match Review
                  </h3>
                  <p className="text-xs text-muted-foreground md:text-base">
                    Get professional analysis of your match
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div> */}

      <div className="space-y-4 lg:max-w-1/3 ">
        <div>
          <h3 className="text-2xl lg:text-3xl ">Continue Training</h3>
          <p className="text-sm opacity-90 lg:text-base">
            Keep up the momentum and start your next session
          </p>
        </div>
        <TrainingHeaderCard
          pack={{
            description: pack?.description ?? "",
            title: pack?.title ?? "",
            exerciseCount: pack?.exercises.length,
            totalDuration: formatTime(totalDuration),
            tags: ["speed", "power", "agility"],
            type: pack?.trainingPackType ?? "technique",
            ctaLabel: "Start Training",
            showTags: false,
          }}
        />
      </div>
    </div>
  );
}
