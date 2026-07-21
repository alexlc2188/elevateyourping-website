"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { VideoField } from "@/app/(admin)/admin/exercises/_components/video-field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { EncodingStatus } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";

type Video = {
  id: string;
  publicUrl?: string | null;
  encodingStatus?: EncodingStatus | null;
};

type MatchShortSetVideoWithVideo = {
  id: string;
  matchId: string;
  videoId: string;
  setNumber: number;
  video?: Video | null;
  encodingStatus?: EncodingStatus;
};

interface ShortSetVideosSectionProps {
  matchId: string;
  initialVideos?: MatchShortSetVideoWithVideo[] | null;
}

interface SetVideo {
  videoId: string | null;
  publicUrl?: string | null;
  isUploading: boolean;
  encodingStatus?: EncodingStatus;
}

export const ShortSetVideosSection = ({
  matchId,
  initialVideos = [],
}: ShortSetVideosSectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [setVideos, setSetVideos] = useState<Record<number, SetVideo>>({
    1: { videoId: null, publicUrl: null, isUploading: false },
    2: { videoId: null, publicUrl: null, isUploading: false },
    3: { videoId: null, publicUrl: null, isUploading: false },
    4: { videoId: null, publicUrl: null, isUploading: false },
    5: { videoId: null, publicUrl: null, isUploading: false },
    6: { videoId: null, publicUrl: null, isUploading: false },
  });

  // Use a ref to track pending updates and debounce them
  const pendingUpdatesRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);

  // Initialize videos from props
  useEffect(() => {
    // Map the initial videos to our state structure
    const videoMap = { ...setVideos };

    initialVideos?.forEach((video) => {
      if (video.setNumber >= 1 && video.setNumber <= 6) {
        videoMap[video.setNumber] = {
          videoId: video.videoId,
          publicUrl: video.video?.publicUrl || null,
          isUploading: false,
          encodingStatus: video.video?.encodingStatus || undefined,
        };
      }
    });

    setSetVideos(videoMap);
  }, [initialVideos]);

  // Debounced batch update function
  const batchUpdateVideos = useCallback(async () => {
    if (isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    setIsLoading(true);

    try {
      // Get current state
      let currentVideos: Record<number, SetVideo>;
      await new Promise<void>((resolve) => {
        setSetVideos((prev) => {
          currentVideos = prev;
          resolve();
          return prev;
        });
      });

      // Prepare data for API using the current state
      const shortSetVideos = Object.entries(currentVideos!)
        .filter(([_, video]) => video.videoId) // Only include videos with IDs
        .map(([setNum, video]) => ({
          videoId: video.videoId!,
          setNumber: parseInt(setNum),
        }));

      console.log("Batch updating videos:", shortSetVideos);

      // Update the match with the PATCH endpoint
      const response = await fetch(`/api/matches/${matchId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shortSetVideos }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || error.details || "Failed to update short set videos"
        );
      }

      const result = await response.json();

      // Update local state with the API response
      if (result.shortSetVideos) {
        setSetVideos((prev) => {
          const videoMap = { ...prev };

          // Reset all videos first
          Object.keys(videoMap).forEach((key) => {
            const setNum = parseInt(key);
            videoMap[setNum] = {
              ...videoMap[setNum],
              videoId: null,
              publicUrl: null,
              isUploading: false,
            };
          });

          // Then update with the response data
          result.shortSetVideos.forEach(
            (video: MatchShortSetVideoWithVideo) => {
              if (video.setNumber >= 1 && video.setNumber <= 6) {
                videoMap[video.setNumber] = {
                  ...videoMap[video.setNumber],
                  videoId: video.videoId,
                  publicUrl: video.video?.publicUrl || null,
                  isUploading: false,
                  encodingStatus: video.video?.encodingStatus || undefined,
                };
              }
            }
          );

          return videoMap;
        });
      }

      toast.success("Set videos updated");
    } catch (error) {
      console.error("Error updating set videos:", error);
      toast.error(
        typeof error === "object" && error !== null
          ? (error as Error).message
          : "Failed to update set videos"
      );
    } finally {
      setIsLoading(false);
      isUpdatingRef.current = false;
    }
  }, [matchId]);

  // Schedule batch update with debouncing
  const scheduleBatchUpdate = useCallback(() => {
    // Clear any existing pending update
    if (pendingUpdatesRef.current) {
      clearTimeout(pendingUpdatesRef.current);
    }

    // Schedule new update with 500ms delay
    pendingUpdatesRef.current = setTimeout(() => {
      batchUpdateVideos();
    }, 500);
  }, [batchUpdateVideos]);

  // Clean up pending updates on unmount
  useEffect(() => {
    return () => {
      if (pendingUpdatesRef.current) {
        clearTimeout(pendingUpdatesRef.current);
      }
    };
  }, []);

  // Update a single set video (now just updates local state and schedules batch update)
  const updateSetVideo = useCallback(
    (setNumber: number, videoId: string | null) => {
      // Update local state immediately
      setSetVideos((prev) => ({
        ...prev,
        [setNumber]: {
          ...prev[setNumber],
          videoId,
          isUploading: false,
        },
      }));

      // Schedule batch update
      scheduleBatchUpdate();
    },
    [scheduleBatchUpdate]
  );

  // Handle video upload start
  const handleUploadStart = (setNumber: number) => {
    setSetVideos((prev) => ({
      ...prev,
      [setNumber]: {
        ...prev[setNumber],
        isUploading: true,
      },
    }));
  };

  // Handle video set with proper typing
  const handleVideoSet = (
    setNumber: number,
    videoId: string,
    videoUrl?: string,
    encodingStatus?: EncodingStatus
  ) => {
    setSetVideos((prev) => ({
      ...prev,
      [setNumber]: {
        ...prev[setNumber],
        videoId,
        publicUrl:
          videoUrl ||
          `https://pub-66179c0a9fd140ba9e8c7bf44fcb38ba.r2.dev/videos/${videoId}.mp4`,
        isUploading: false,
        encodingStatus: encodingStatus || "PENDING",
      },
    }));

    // Update the backend using the new batched approach
    updateSetVideo(setNumber, videoId);
  };

  // Handle video field change
  const handleVideoFieldChange = (
    setNumber: number,
    videoId: string,
    _?: string,
    videoUrl?: string
  ) => {
    handleVideoSet(setNumber, videoId, videoUrl);
  };

  // Handle video deletion
  const handleVideoDelete = (setNumber: number) => {
    setSetVideos((prev) => ({
      ...prev,
      [setNumber]: {
        videoId: null,
        publicUrl: null,
        isUploading: false,
      },
    }));

    // Update the backend
    updateSetVideo(setNumber, null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Short Set Videos</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground mb-3">
          Upload short, edited versions of each set for player review
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((setNumber) => {
            const video = setVideos[setNumber];
            return (
              <div key={`set-${setNumber}`} className="border rounded-md p-2">
                <div className="flex justify-between items-center mb-2">
                  <Badge
                    variant="outline"
                    className="text-xs font-medium px-1.5 py-0.5"
                  >
                    Set {setNumber}
                  </Badge>
                  {video.videoId && (
                    <ConfirmDialog
                      onConfirm={() => handleVideoDelete(setNumber)}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </ConfirmDialog>
                  )}
                </div>

                <div className="w-full">
                  <VideoField
                    onUploadStart={() => handleUploadStart(setNumber)}
                    onVideoSet={(videoId, _, videoUrl) =>
                      handleVideoFieldChange(setNumber, videoId, _, videoUrl)
                    }
                    videoType="review"
                    label={`Set ${setNumber}`}
                    fieldName="reviewVideoId"
                    initialVideoId={video.videoId || undefined}
                    initialVideoUrl={video.publicUrl || undefined}
                    encodingStatus={video.encodingStatus}
                    onUploadError={() => {
                      setSetVideos((prev) => ({
                        ...prev,
                        [setNumber]: {
                          ...prev[setNumber],
                          isUploading: false,
                        },
                      }));
                      toast.error(
                        `Failed to upload video for Set ${setNumber}`
                      );
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
