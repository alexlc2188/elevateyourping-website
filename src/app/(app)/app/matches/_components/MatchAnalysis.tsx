import React from "react";
import { VideoPlayerWithDownload } from "@/components/video-player-with-download";

type MatchAnalysisProps = {
  videoUrl?: string | null;
  publicUrl?: string | null;
  matchTitle?: string;
};

export const MatchAnalysis: React.FC<MatchAnalysisProps> = ({
  videoUrl,
  publicUrl,
  matchTitle = "Match Review",
}) => {
  return (
    <section className="">
      <div className="rounded-lg overflow-hidden shadow-md">
        {videoUrl || publicUrl ? (
          <VideoPlayerWithDownload
            videoUrl={videoUrl}
            publicUrl={publicUrl}
            poster="/images/post-match-strategy-frame.jpg"
            rounded={false}
            autoplay={false}
            forcePlay={false}
            showCaptureButton={false}
            title={matchTitle}
            downloadFilename={`${matchTitle
              .toLowerCase()
              .replace(/\s+/g, "-")}-analysis.mp4`}
            className="bg-white p-4"
          />
        ) : (
          <div className="flex items-center w-full aspect-video justify-center bg-slate-100 -500 text-sm">
            No analysis video available.
          </div>
        )}
      </div>
    </section>
  );
};
