import { getPublishedExercises } from "@/lib/services/exercises";
import Image from "next/image";
import { ExerciseActions } from "../exercises/_components/exercise-actions";
import { PageHeader } from "./_components/page-header";
import VideoPlayer from "@/components/video-player";

export default async function ExerciseListPage() {
  const { success, data } = await getPublishedExercises();

  return (
    <main className="py-10">
      <PageHeader
        title="All Exercises"
        showBackButton={false}
        showNewButton={true}
        showDraftsButton={true}
      />

      {/* TODO: Insert exercise table/list here */}
      {!success && <p className="text-red-500">Failed to load exercises.</p>}

      {data.length === 0 && success && (
        <p className="text-muted-foreground text-sm">
          No published exercises found.
        </p>
      )}

      {data.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((exercise) => (
            <div
              key={exercise.id}
              className="border rounded-md overflow-hidden">
              {exercise.previewVideo?.publicUrl ? (
                <VideoPlayer
                  showCaptureButton={false}
                  videoUrl={exercise.previewVideo.publicUrl}
                  poster={exercise.thumbnail || undefined}
                  rounded={false}
                />
              ) : exercise.thumbnail ? (
                <Image
                  src={exercise?.thumbnail}
                  alt={exercise.label}
                  width={400}
                  height={225}
                  className="w-full h-auto object-cover aspect-video"
                />
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  No thumbnail
                </div>
              )}
              <div className="p-4 space-y-2">
                <h2 className="">{exercise.label}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {exercise.practiceInstruction}
                </p>
                <p className="text-xs text-muted-foreground">
                  Duration: {Math.floor(exercise.duration / 60)} min
                </p>
                <div className="pt-2">
                  <ExerciseActions exercise={exercise} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
