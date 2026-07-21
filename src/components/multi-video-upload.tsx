"use client";

import { useState, useEffect } from "react";
import { VideoField } from "@/app/(admin)/admin/exercises/_components/video-field";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";

interface VideoData {
  id: string;
  setNumber?: number;
  publicUrl?: string;
  videoUrl?: string;
}

interface MultiVideoUploadProps {
  onVideosChange: (videoIds: string[]) => void;
  onVideoObjectsChange?: (
    videos: Array<{ id: string; publicUrl?: string; videoUrl?: string }>
  ) => void;
  maxVideos?: number;
  initialVideos?: VideoData[];
  showLabels?: boolean;
  videoType?: string;
  onUploadStateChange?: (isUploading: boolean) => void;
}

type VideoSlot = {
  id: string; // Unique ID for the slot
  videoId: string | null;
  videoUrl: string | null;
  isUploading: boolean;
  slotNumber: number;
};

export const MultiVideoUpload = ({
  onVideosChange,
  onVideoObjectsChange,
  maxVideos = 5,
  initialVideos = [],
  showLabels = true,
  videoType = "matches",
  onUploadStateChange,
}: MultiVideoUploadProps) => {
  // Initialize slots from initial videos
  const [videoSlots, setVideoSlots] = useState<VideoSlot[]>(() => {
    const slots: VideoSlot[] = [];

    // Add existing videos
    if (initialVideos.length > 0) {
      slots.push(
        ...initialVideos.map((video, index) => ({
          id: `initial-${index}`,
          videoId: video.id,
          videoUrl: video.publicUrl || video.videoUrl || null,
          isUploading: false,
          slotNumber: index + 1,
        }))
      );
    }

    // Always add an empty slot if we're under the max limit
    if (slots.length < maxVideos) {
      slots.push({
        id: `slot-${Date.now()}`,
        videoId: null,
        videoUrl: null,
        isUploading: false,
        slotNumber: slots.length + 1,
      });
    }

    return slots;
  });

  // Track which videos have been reported to parent
  const [lastReportedVideos, setLastReportedVideos] = useState<string>("");

  // Check if any uploads are in progress
  const isAnyUploading = videoSlots.some((slot) => slot.isUploading);

  // Get completed videos
  const completedVideos = videoSlots.filter((slot) => slot.videoId);

  // Report video changes to parent
  useEffect(() => {
    const videoIds = completedVideos.map((slot) => slot.videoId!);
    const currentVideosString = JSON.stringify(videoIds);

    if (lastReportedVideos !== currentVideosString) {
      setLastReportedVideos(currentVideosString);
      onVideosChange(videoIds);

      if (onVideoObjectsChange) {
        onVideoObjectsChange(
          completedVideos.map((slot) => ({
            id: slot.videoId!,
            publicUrl: slot.videoUrl || undefined,
            videoUrl: slot.videoUrl || undefined,
          }))
        );
      }
    }
  }, [
    completedVideos,
    onVideosChange,
    onVideoObjectsChange,
    lastReportedVideos,
  ]);

  // Report upload state changes
  useEffect(() => {
    if (onUploadStateChange) {
      onUploadStateChange(isAnyUploading);
    }
  }, [isAnyUploading, onUploadStateChange]);

  // Handle video upload completion
  const handleVideoSet = (
    slotId: string,
    videoId: string,
    videoUrl?: string
  ) => {
    setVideoSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              videoId,
              videoUrl: videoUrl || null,
              isUploading: false,
            }
          : slot
      )
    );
  };

  // Handle upload start
  const handleUploadStart = (slotId: string) => {
    setVideoSlots((prev) => {
      const updated = prev.map((slot) =>
        slot.id === slotId ? { ...slot, isUploading: true } : slot
      );

      // Auto-add a new empty slot if we don't have one and we're under the limit
      const hasEmptySlot = updated.some(
        (slot) => !slot.videoId && !slot.isUploading
      );
      if (!hasEmptySlot && updated.length < maxVideos) {
        updated.push({
          id: `slot-${Date.now()}`,
          videoId: null,
          videoUrl: null,
          isUploading: false,
          slotNumber: updated.length + 1,
        });
      }

      return updated;
    });
  };

  // Handle upload error
  const handleUploadError = (slotId: string) => {
    setVideoSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, isUploading: false } : slot
      )
    );
  };

  // Remove video slot
  const removeVideoSlot = (slotId: string) => {
    setVideoSlots((prev) => {
      const filtered = prev.filter((slot) => slot.id !== slotId);

      // If no slots remain, add an empty slot
      if (filtered.length === 0) {
        return [
          {
            id: `slot-${Date.now()}`,
            videoId: null,
            videoUrl: null,
            isUploading: false,
            slotNumber: 1,
          },
        ];
      }

      // Check if we need to add an empty slot (if all remaining slots have videos)
      const hasEmptySlot = filtered.some(
        (slot) => !slot.videoId && !slot.isUploading
      );
      const updatedSlots = filtered.map((slot, index) => ({
        ...slot,
        slotNumber: index + 1,
      }));

      // Add empty slot if needed and under limit
      if (!hasEmptySlot && updatedSlots.length < maxVideos) {
        updatedSlots.push({
          id: `slot-${Date.now()}`,
          videoId: null,
          videoUrl: null,
          isUploading: false,
          slotNumber: updatedSlots.length + 1,
        });
      }

      return updatedSlots;
    });
  };

  // Move video up in the list
  const moveVideoUp = (slotId: string) => {
    setVideoSlots((prev) => {
      const currentIndex = prev.findIndex((slot) => slot.id === slotId);
      if (currentIndex <= 0) return prev; // Already at top or not found

      const newSlots = [...prev];
      [newSlots[currentIndex - 1], newSlots[currentIndex]] = [
        newSlots[currentIndex],
        newSlots[currentIndex - 1],
      ];

      // Reindex slot numbers
      return newSlots.map((slot, index) => ({
        ...slot,
        slotNumber: index + 1,
      }));
    });
  };

  // Move video down in the list
  const moveVideoDown = (slotId: string) => {
    setVideoSlots((prev) => {
      const currentIndex = prev.findIndex((slot) => slot.id === slotId);
      if (currentIndex === -1 || currentIndex >= prev.length - 1) return prev; // Already at bottom or not found

      const newSlots = [...prev];
      [newSlots[currentIndex], newSlots[currentIndex + 1]] = [
        newSlots[currentIndex + 1],
        newSlots[currentIndex],
      ];

      // Reindex slot numbers
      return newSlots.map((slot, index) => ({
        ...slot,
        slotNumber: index + 1,
      }));
    });
  };

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <div className="flex items-center gap-2">
        {completedVideos.length > 0 && (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            ✓ {completedVideos.length} video
            {completedVideos.length !== 1 ? "s" : ""} uploaded
          </Badge>
        )}
        {isAnyUploading && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {videoSlots.filter((s) => s.isUploading).length} upload
            {videoSlots.filter((s) => s.isUploading).length !== 1 ? "s" : ""} in
            progress
          </Badge>
        )}
      </div>

      {/* Video Upload Slots */}
      <div className="space-y-3 bg-slate-50 rounded-lg p-3">
        {videoSlots.map((slot, index) => {
          const isEmpty = !slot.videoId && !slot.isUploading;
          const canMoveUp = index > 0 && !isEmpty && !slot.isUploading;
          const canMoveDown =
            index < videoSlots.length - 1 && !isEmpty && !slot.isUploading;

          return (
            <div
              key={slot.id}
              className="relative bg-white rounded-md border border-slate-200"
            >
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                      Video {slot.slotNumber}
                    </Badge>
                    {/* Reorder buttons - moved to left for safety */}
                    {!isEmpty &&
                      !slot.isUploading &&
                      videoSlots.filter((s) => s.videoId).length > 1 && (
                        <div className="flex items-center bg-slate-50 rounded-md p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                            disabled={!canMoveUp}
                            onClick={() => moveVideoUp(slot.id)}
                            title="Move up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                            disabled={!canMoveDown}
                            onClick={() => moveVideoDown(slot.id)}
                            title="Move down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                  </div>
                  {/* Delete button - isolated on the right */}
                  {(slot.videoId || videoSlots.length > 1) && (
                    <ConfirmDialog onConfirm={() => removeVideoSlot(slot.id)}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-700"
                        disabled={slot.isUploading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </ConfirmDialog>
                  )}
                </div>

                <VideoField
                  key={slot.id}
                  label=""
                  fieldName="mainVideoId"
                  initialVideoId={slot.videoId || undefined}
                  initialVideoUrl={slot.videoUrl || undefined}
                  onVideoSet={(videoId, _, videoUrl) =>
                    handleVideoSet(slot.id, videoId, videoUrl)
                  }
                  onUploadStart={() => handleUploadStart(slot.id)}
                  onUploadError={() => handleUploadError(slot.id)}
                  videoType={videoType}
                  compact={true}
                  hideMetadata={true}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="text-center">
        {completedVideos.length > 1 && (
          <p className="text-xs text-slate-500 mt-1">
            💡 Use ↑↓ arrows to reorder videos
          </p>
        )}
        {isAnyUploading && (
          <p className="text-xs text-blue-600 mt-1">
            Multiple uploads running...
          </p>
        )}
      </div>
    </div>
  );
};
