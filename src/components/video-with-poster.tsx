"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Adjust if you're using another utility
import Image from "next/image";

export default function VideoWithPoster({
  videoId,
  poster,
  rounded = true,
  autoplay = false,
  showPlayIcon = true,
  playIconSize = "regular",
  forcePlay = false,
  isTouchable = true,
  onEnded,
  overlayTitle,
}: {
  videoId: string | null;
  poster?: string;
  rounded?: boolean;
  autoplay?: boolean;
  showPlayIcon?: boolean;
  playIconSize?: "regular" | "small";
  forcePlay?: boolean;
  isTouchable?: boolean;
  onEnded?: () => void;
  overlayTitle?: string;
}) {
  const [showPlayer, setShowPlayer] = useState(forcePlay || false);

  const shouldShowPoster = !showPlayer;
  const iconSize = playIconSize === "regular" ? "w-16 h-16" : "w-8 h-8";
  const playIconSizeSvg = playIconSize === "regular" ? "w-12 h-12" : "w-6 h-6";

  useEffect(() => {
    // If forcePlay is true, show the player immediately
    if (forcePlay) {
      setShowPlayer(true);
    } else {
      // Reset to poster for new videos
      setShowPlayer(false);
    }
  }, [videoId, forcePlay]);

  return (
    <div
      className={cn(
        "aspect-video w-full overflow-hidden relative bg-black",
        rounded ? "rounded-lg" : "rounded-none",
      )}>
      {/* Poster image (fallback or clickable) */}
      {shouldShowPoster && poster && (
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={() => {
            if (isTouchable) setShowPlayer(true);
          }}>
          <Image
            src={poster}
            alt="Poster"
            fill
            className="object-cover z-10"
            priority
          />
          {overlayTitle && (
            <div className="absolute inset-0  flex items-center justify-center z-20  text-center  ">
              <h2 className="text-white text-5xl font-black drop-shadow-lg leading-none m-0 p-0">
                {overlayTitle}
              </h2>
            </div>
          )}

          {showPlayIcon && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div
                className={cn(
                  " bg-white/90 rounded-full flex items-center justify-center w-12 h-12 animate-pulse ",
                  iconSize,
                )}>
                <svg
                  className={cn("w-10 h-10 text-black", playIconSizeSvg)}
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M6 4l10 6-10 6V4z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actual video player */}
      {showPlayer && videoId && (
        <video
          key={videoId}
          src={videoId}
          autoPlay={autoplay || forcePlay}
          controls
          className="w-full h-full object-contain bg-black absolute inset-0 "
          onEnded={() => {
            setShowPlayer(false);
            if (onEnded) onEnded();
          }}
        />
        // <Stream
        //   key={videoId}
        //   controls
        //   autoplay={autoplay || forcePlay}
        //   volume={0.5}
        //   src={videoId}
        //   preload
        //   className="absolute inset-0 w-full h-full"
        //   onEnded={() => {
        //     setShowPlayer(false);
        //     if (onEnded) onEnded();
        //   }}
        // />
      )}
    </div>
  );
}
