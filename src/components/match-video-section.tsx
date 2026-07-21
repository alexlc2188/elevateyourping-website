"use client";

import VideoPlayer from "@/components/video-player";
import { VideoDownloadButton } from "@/components/video-download-button";

interface MatchVideoSectionProps {
  title: string;
  videoUrl?: string | null;
  publicUrl?: string | null;
  poster?: string;
  rounded?: boolean;
  autoplay?: boolean;
  downloadFilename?: string;
  className?: string;
}

export function MatchVideoSection({
  title,
  videoUrl,
  publicUrl,
  poster,
  rounded = true,
  autoplay = false,
  downloadFilename,
  className = "",
}: MatchVideoSectionProps) {
  const streamingUrl = videoUrl || publicUrl || null;
  const downloadUrl = publicUrl || videoUrl;

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg  text-slate-900 md:text-xl lg:text-2xl">{title}</h3>
        {downloadUrl && (
          <VideoDownloadButton
            videoUrl={downloadUrl}
            filename={
              downloadFilename ||
              `${title.toLowerCase().replace(/\s+/g, "-")}.mp4`
            }
            variant="outline"
            size="sm"
          />
        )}
      </div>

      <div className="p-4">
        {streamingUrl ? (
          <VideoPlayer
            videoUrl={streamingUrl}
            poster={poster}
            rounded={rounded}
            autoplay={autoplay}
            controls={true}
            showCaptureButton={false}
          />
        ) : (
          <div className="flex items-center w-full aspect-video justify-center bg-slate-100 text-slate-500 text-sm rounded-lg">
            No video available.
          </div>
        )}
      </div>
    </div>
  );
}
