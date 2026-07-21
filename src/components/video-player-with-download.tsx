"use client";

import VideoPlayer from "@/components/video-player";
import { VideoDownloadButton } from "@/components/video-download-button";

interface VideoPlayerWithDownloadProps {
  videoUrl?: string | null;
  publicUrl?: string | null;
  poster?: string;
  rounded?: boolean;
  autoplay?: boolean;
  forcePlay?: boolean;
  showCaptureButton?: boolean;
  controls?: boolean;
  muted?: boolean;
  title?: string;
  downloadFilename?: string;
  className?: string;
  showDownloadButton?: boolean;
}

export function VideoPlayerWithDownload({
  videoUrl,
  publicUrl,
  poster,
  rounded = true,
  autoplay = false,
  forcePlay = false,
  showCaptureButton = false,
  controls = true,
  muted = false,
  title = "Video",
  downloadFilename,
  className = "",
  showDownloadButton = true,
}: VideoPlayerWithDownloadProps) {
  // Use publicUrl for download (MP4 format) and videoUrl for streaming
  const downloadUrl = publicUrl || videoUrl;
  const streamingUrl = videoUrl || publicUrl || null;

  return (
    <div className={`space-y-3 ${className}`}>
      <VideoPlayer
        videoUrl={streamingUrl}
        poster={poster}
        rounded={rounded}
        autoplay={autoplay}
        forcePlay={forcePlay}
        showCaptureButton={showCaptureButton}
        controls={controls}
        muted={muted}
      />

      {/* Download button below the video */}
      {downloadUrl && showDownloadButton && (
        <div className="flex justify-end">
          <VideoDownloadButton
            videoUrl={downloadUrl}
            filename={
              downloadFilename ||
              `${title.toLowerCase().replace(/\s+/g, "-")}.mp4`
            }
            variant="outline"
            size="sm"
          />
        </div>
      )}
    </div>
  );
}
