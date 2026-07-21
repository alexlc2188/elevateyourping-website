"use client";

import {
  updateMatchVideo,
  deleteMatchVideo,
} from "@/actions/admin/matchesActions";
import { VideoField } from "@/app/(admin)/admin/exercises/_components/video-field";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { EncodingStatus, TrainingType } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface MatchVideoFormProps {
  header: string;
  initialData: {
    matchId: string;
    videoId: string | null;
    encodingStatus?: string | null;
  };
  initialVideoUrl?: string;
  description?: string;
  videoType: "highlight" | "review";
}

export const MatchVideoForm = ({
  header,
  initialData,
  initialVideoUrl,
  description,
  videoType,
}: MatchVideoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleVideoSet = async (
    videoId: string,
    thumbnailUrl?: string,
    videoUrl?: string
  ) => {
    setIsSubmitting(true);

    try {
      // Determine which field to update based on videoType
      const updateData =
        videoType === "highlight"
          ? { highlightVideoId: videoId }
          : { reviewVideoId: videoId };

      // Call the server action to update the match's video
      const result = await updateMatchVideo({
        matchId: initialData.matchId,
        ...updateData,
      });

      if (result.success) {
        toast.success(`Match ${videoType} video updated`);
        router.refresh();
      } else {
        toast.error(
          result.error || `Failed to update match ${videoType} video`
        );
      }
    } catch (error) {
      console.error(`Error updating match ${videoType} video:`, error);
      toast.error("An error occurred while updating the video");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVideoDelete = async () => {
    setIsSubmitting(true);

    try {
      const result = await deleteMatchVideo({
        matchId: initialData.matchId,
        videoType,
      });

      if (result.success) {
        toast.success(`Match ${videoType} video deleted`);
        router.refresh();
      } else {
        toast.error(
          result.error || `Failed to delete match ${videoType} video`
        );
      }
    } catch (error) {
      console.error(`Error deleting match ${videoType} video:`, error);
      toast.error("An error occurred while deleting the video");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine the field name based on video type
  const fieldName =
    videoType === "highlight" ? "highlightVideoId" : "reviewVideoId";

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex justify-between items-start">
        <div>
          <h3 className="text-base  text-slate-900">{header}</h3>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
        {initialData.videoId && (
          <ConfirmDialog onConfirm={handleVideoDelete}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </ConfirmDialog>
        )}
      </div>

      <div className="p-5">
        <VideoField
          label={videoType === "highlight" ? "Highlight Video" : "Review Video"}
          fieldName={fieldName}
          onVideoSet={handleVideoSet}
          initialVideoId={initialData.videoId || ""}
          initialVideoUrl={initialVideoUrl}
          showCaptureButton={false}
          captureFrameRatio="landscape"
          videoType="review"
          encodingStatus={
            initialData.encodingStatus as EncodingStatus | undefined
          }
          exerciseType={TrainingType.technique}
        />
      </div>
    </div>
  );
};
