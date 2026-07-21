"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoDownloadButtonProps {
  videoUrl?: string | null;
  filename?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function VideoDownloadButton({
  videoUrl,
  filename = "video.mp4",
  variant = "outline",
  size = "sm",
  className = "",
}: VideoDownloadButtonProps) {
  const handleOpenVideo = () => {
    if (!videoUrl) {
      return;
    }

    window.open(videoUrl, "_blank", "noopener,noreferrer");
  };

  if (!videoUrl) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleOpenVideo}
      className={`flex items-center text-slate-700 gap-2 ${className} shadow-md`}
    >
      <ExternalLink className="w-4 h-4" />
      Open Video
    </Button>
  );
}
