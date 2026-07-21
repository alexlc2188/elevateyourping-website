"use client";

import { updateTrainingPackVideo } from "@/actions/admin/trainingPacksActions";
import { VideoField } from "@/app/(admin)/admin/exercises/_components/video-field";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EncodingStatus, TrainingType } from "@prisma/client";

interface TrainingPackVideoFormProps {
  header: string;
  initialData: {
    packId: string;
    videoId: string | null;
    encodingStatus?: string | null;
  };
  initialVideoUrl?: string;
  description?: string;
}

export const TrainingPackVideoForm = ({
  header,
  initialData,
  initialVideoUrl,
  description,
}: TrainingPackVideoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleVideoSet = async (
    videoId: string,
    thumbnailUrl?: string,
    videoUrl?: string
  ) => {
    setIsSubmitting(true);

    try {
      // Call the server action to update the training pack's introVideo
      const result = await updateTrainingPackVideo({
        packId: initialData.packId,
        videoId: videoId,
      });

      if (result.success) {
        toast.success("Training pack video updated");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update training pack video");
      }
    } catch (error) {
      console.error("Error updating training pack video:", error);
      toast.error("An error occurred while updating the video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-slate-100">
        <h3 className="text-base text-slate-900">{header}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      <div className="p-5">
        <VideoField
          label="Intro Video"
          fieldName="introPackVideoId"
          onVideoSet={handleVideoSet}
          initialVideoId={initialData.videoId || ""}
          initialVideoUrl={initialVideoUrl}
          showCaptureButton={true}
          captureFrameRatio="landscape"
          encodingStatus={
            initialData.encodingStatus as EncodingStatus | undefined
          }
          exerciseType={TrainingType.technique}
        />
      </div>
    </div>
  );
};
