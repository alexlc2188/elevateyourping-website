"use client";
import { updateMatchVideo } from "@/actions/admin/matches";
import { VideoField } from "@/app/(admin)/admin/exercises/_components/video-field";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/video-player";

import { Pencil, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface Props {
  header: string;
  initialData: {
    matchReviewVideoId: string | null;
    matchId: string;
  };
  initialVideoUrl?: string;
}

export const MatchVideoUploadForm = ({ header, initialData, initialVideoUrl }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl || null);
  const [videoId, setVideoId] = useState<string | null>(initialData?.matchReviewVideoId || null);
  const router = useRouter();
  
  // Initialize with the video URL if available
  useEffect(() => {
    if (initialVideoUrl) {
      setVideoUrl(initialVideoUrl);
    }
  }, [initialVideoUrl]);

  const toggleEdit = () => setIsEditing((current) => !current);

  const handleSaveVideo = async (type: "review", id: string, url?: string) => {
    setIsSubmitting(true);

    try {
      // First update local state immediately so the UI shows the video right away
      setVideoId(id);
      if (url) {
        setVideoUrl(url);
      }
      
      // Then save to the database
      const { success } = await updateMatchVideo({
        matchId: initialData.matchId,
        type,
        videoId: id,
      });

      if (!success) {
        toast.error("Something went wrong");
        // Revert state changes if save failed
        setVideoId(initialData?.matchReviewVideoId || null);
        setVideoUrl(initialVideoUrl || null);
        return;
      }
      
      toast.success("Review video saved");
      toggleEdit();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error("Failed to save video");
      // Revert state changes if save failed
      setVideoId(initialData?.matchReviewVideoId || null);
      setVideoUrl(initialVideoUrl || null);
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {header}
        {!isEditing && (
          <div className="flex items-center gap-x-2">
            <Button
              onClick={toggleEdit}
              variant="outline"
              size="sm"
              disabled={isSubmitting}
            >
              {
                videoId ? (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Replace Video
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Upload Video
                  </>
                )
              }
            </Button>
          </div>
        )}
      </div>
      
      {!isEditing && (
        <div className="mt-4">
          {videoId && videoUrl ? (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-md border bg-slate-50">
                <VideoPlayer
                  videoUrl={videoUrl}
                  controls={true}
                  rounded={true}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Video ID: {videoId}
              </p>
            </div>
          ) : videoId ? (
            <div className="flex items-center justify-center h-40 bg-slate-200 rounded-md">
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-2">Video ID: {videoId}</p>
                <p className="text-xs text-slate-400">Video URL not available</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 bg-slate-200 rounded-md">
              <div className="text-center">
                <UploadCloud className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">No video uploaded</p>
                <p className="text-xs text-slate-400 mt-1">Click "Upload Video" to add one</p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {isEditing && (
        <VideoField
          fieldName="reviewVideoId"
          label="Upload match review"
          onVideoSet={(id, thumbnailUrl) => {
            // The VideoField component passes id and thumbnailUrl
            handleSaveVideo("review", id, thumbnailUrl);
          }}
          showCaptureButton={true}
          captureFrameRatio="landscape"
          initialVideoId={initialData?.matchReviewVideoId ?? ""}
          initialVideoUrl={videoUrl || undefined}
        />
      )}
    </div>
  );
};
