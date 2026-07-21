import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";
import { Training } from "@/components/workout/training";
import { prismaDb } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { TrainingHeaderCard } from "../../../../components/headers/training-header-card";
import { formatTime } from "@/lib/utils";
import { TrainingClient } from "./_components/TrainingClient";

const backgroundColors: Record<any["type"], string> = {
  technique: "bg-blue-50",
  rally: "bg-red-50",
  serve: "bg-amber-50",
  return: "bg-purple-50",
  footwork: "bg-emerald-50",
  allInOne: "bg-teal-50",
};

export default async function TrainingPage() {
  const user = await currentUser();

  if (!user?.id) notFound();

  const selectedPack = await prismaDb.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      selectedTrainingPackId: true,
    },
  });

  let pack;

  // todo: load id of beginner pack when we have it.
  // should work with plan and pack
  // by default give the free beginner pack.

  if (selectedPack?.selectedTrainingPackId) {
    pack = await prismaDb.trainingPack.findUnique({
      where: {
        id: selectedPack.selectedTrainingPackId,
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
  }

  let bg = backgroundColors[pack?.trainingPackType ?? "technique"];

  const totalDuration = Math.round(
    pack?.exercises.reduce((acc, e) => {
      return acc + (e.trainingExercise.duration || 0);
    }, 0) ?? 0,
  );

  if (!pack) return <p>Training plan not found!</p>;

  return (
    <div className={`w-full h-full  ${bg} lg:max-w-7xl lg:mx-auto`}>
      <div className="pl-4 flex justify-between items-center">
        <AppBreadcrumb />
      </div>

      {/* TODO: in desktop need to add the preview card because nothing happen. similar to training plan */}

      <div className="mt-4 lg:mt-0 lg:py-8 ">
        <div className="px-4 mx-auto space-y-4 ">
          <TrainingHeaderCard
            pack={{
              description: pack?.description ?? "",
              title: pack?.title ?? "",
              exerciseCount: pack?.exercises.length,
              totalDuration: formatTime(totalDuration),
              tags: ["speed", "power", "agility"],
              type: pack?.trainingPackType ?? "technique",
            }}
          />
          <TrainingClient trainingPack={pack} />
        </div>
      </div>
    </div>
  );
}
