"use client";

import { useEffect, useState } from "react";
import { TrainingPackCard } from "./TrainingPackCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrainingPackType, SkillLevel, Prisma } from "@prisma/client";
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";
import { assignPackToUser } from "@/lib/api/trainingPacks";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { cn, formatTime } from "@/lib/utils";
import VideoPlayer from "../video-player";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { DifficultyDropdown, DifficultyWithAll } from "./difficulty-dropdown";

const trainingTypes: TrainingPackType[] = Object.values(TrainingPackType);

export type Pack = Prisma.TrainingPackGetPayload<{
  include: {
    exercises: {
      include: {
        trainingExercise: true;
      };
    };
    introVideo: true;
  };
}>;

interface Props {
  trainingPacks: Pack[];
  trainingPackUserSelected: string | null;
}

export function TrainingLibrary({
  trainingPacks,
  trainingPackUserSelected,
}: Props) {
  const path = usePathname();
  const user = path.includes("/app/") ? useCurrentUser() : null;

  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<
    TrainingPackType | "All"
  >("All");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyWithAll>("All");

  const filtered = trainingPacks.filter((pack) => {
    const matchesCategory =
      selectedCategory === "All" || pack.trainingPackType === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All" ||
      (pack.level !== null && pack.level === selectedDifficulty);
    return matchesCategory && matchesDifficulty;
  });

  async function handleAddTrainingToUser(packId: string) {
    if (!user?.id) {
      toast.error("You must be logged in to add training packs.");
      return;
    }

    const { error, success } = await assignPackToUser(packId, user.id);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Training pack added to your library.");
    router.push("/app/training");
  }

  return (
    <>
      <div className="bg-white min-h-screen text-white pb-20 max-w-7xl mx-auto ">
        <div className="ml-4">
          <AppBreadcrumb />
        </div>

        <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4 px-4 py-4 border-zinc-200">
          {/* Category pills */}
          <div className="flex overflow-x-auto gap-2 no-scrollbar ">
            {trainingTypes.map((type) => (
              <Button
                key={type}
                onClick={() => {
                  setSelectedCategory((prev) => (prev === type ? "All" : type));
                }}
                variant={selectedCategory === type ? "default" : "outline"}
                className={cn(
                  "text-xs font-medium rounded-md px-2 shadow-none capitalize lg:text-base",
                  selectedCategory === type
                    ? "bg-black text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100",
                )}>
                {type}
              </Button>
            ))}
          </div>

          {/* Difficulty dropdown */}
          <DifficultyDropdown
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
          />
        </div>

        {/* Pack Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 lg:grid-cols-4">
          {filtered.map((pack) => {
            return (
              <TrainingPackCard
                onAddToUser={handleAddTrainingToUser}
                onPreview={() => setSelectedPack(pack)}
                key={pack.id}
                pack={{
                  ...pack,
                }}
                isSelected={trainingPackUserSelected === pack.id}
              />
            );
          })}
        </div>
      </div>
      <Dialog open={!!selectedPack} onOpenChange={() => setSelectedPack(null)}>
        <DialogContent className=" px-4">
          {selectedPack && (
            <>
              <DialogHeader>
                {/* <span className="text-slate-500 uppercase text-sm ">
                  Training Overview
                </span> */}
                <DialogTitle className="font-normal text-2xl  uppercase">
                  {selectedPack.title}
                </DialogTitle>
                {/* <h2 className="text-2xl">{selectedPack.title}</h2> */}
                {selectedPack.level && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {selectedPack.level}
                  </Badge>
                )}
              </DialogHeader>

              <p className="text-sm text-slate-600 mt-2">
                {selectedPack.description}
              </p>

              {selectedPack.introVideo && (
                <div className="w-full rounded-md overflow-hidden mt-4">
                  <VideoPlayer
                    videoUrl={
                      selectedPack.introVideo?.streamingUrl ??
                      selectedPack.introVideo?.publicUrl ??
                      ""
                    }
                    autoplay={false}
                    showCaptureButton={false}
                    // poster={selectedPack.imageUrl}
                    controls={true}
                  />
                </div>
              )}

              <div className="mt-6 space-y-4">
                <h3 className="text-lg ">What's Inside</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {selectedPack.exercises.map((exercise) => {
                    return (
                      <li
                        key={exercise.id}
                        className="flex justify-between items-center border-b pb-2">
                        <span>{exercise.trainingExercise.label}</span>
                        <span>
                          {formatTime(exercise.trainingExercise.duration)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {/* 👇 Call-to-Action Button */}
              <div className="mt-6">
                <Button
                  disabled={selectedPack.id === trainingPackUserSelected}
                  size={"lg"}
                  className="w-full h-12 uppercase"
                  onClick={() => {
                    handleAddTrainingToUser?.(selectedPack.id);
                    setSelectedPack(null); // Optional: close dialog after selection
                  }}>
                  {selectedPack.id === trainingPackUserSelected
                    ? "Already Selected"
                    : "Select This Training"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
