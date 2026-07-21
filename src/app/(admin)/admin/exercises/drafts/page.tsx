// app/admin/exercises/drafts/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getExerciseDrafts } from "@/lib/services/exercises";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { ExerciseActions } from "../_components/exercise-actions";
import {
  getMissingFields,
  isReadyToPublish,
} from "@/lib/utils/exercise-validation";
import { PageHeader } from "../_components/page-header";
import VideoPlayer from "@/components/video-player";

export default async function DraftExercisesPage() {
  const { success, data } = await getExerciseDrafts();

  return (
    <main className="max-w-5xl mx-auto py-8 px-4">
      <PageHeader
        title="Your Draft Exercises"
        showBackButton={false}
        showNewButton={true}
        showPublishedButton={true}
      />
      {!success && (
        <p className="text-red-500">Failed to load draft exercises.</p>
      )}

      {data.length === 0 && success && (
        <p className="text-muted-foreground text-sm">
          No draft exercises found.
        </p>
      )}

      {data.length > 0 && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((exercise) => {
            const missingFields = getMissingFields(exercise);
            const readyToPublish = missingFields.length === 0;

            return (
              <div key={exercise.id} className="space-y-3">
                <Card className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle className="text-lg">{exercise.label}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground line-clamp-3">
                      {exercise.practiceInstruction}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    {exercise.previewVideo?.publicUrl ? (
                      <div className="rounded-md overflow-hidden">
                        <VideoPlayer
                          videoUrl={exercise.previewVideo.publicUrl}
                          poster={exercise.thumbnail || undefined}
                          rounded={true}
                          captureFrameRatio="landscape"
                          showCaptureButton={false}
                        />
                      </div>
                    ) : exercise.thumbnail ? (
                      <div className="relative w-full aspect-video rounded-md overflow-hidden">
                        <Image
                          src={exercise.thumbnail}
                          alt={exercise.label}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground border border-dashed">
                        No thumbnail uploaded
                      </div>
                    )}

                    <p className="text-muted-foreground text-sm">
                      Duration: {Math.floor(exercise.duration / 60)} min
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3">
                    {/* Edit Button */}
                    <div className="w-full">
                      <Link
                        href={`/admin/exercises/${exercise.id}/edit-info`}
                        className="w-full">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full">
                          Edit Exercise
                        </Button>
                      </Link>
                    </div>

                    {/* Exercise Actions */}
                    <div className="w-full">
                      <ExerciseActions
                        exercise={exercise}
                        showEditButton={false}
                        onlyPublish={true}
                        fullWidth={true}
                      />
                    </div>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
