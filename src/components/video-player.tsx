"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Cropper, { Area } from "react-easy-crop";
import { TrainingType } from "@prisma/client";
import Hls from "hls.js";
import sendGtmDataLayer from "@/lib/analytics/sendGtmDataLayer";

export default function VideoPlayer({
  videoUrl,
  poster,
  rounded = true,
  autoplay = false,
  forcePlay = false,
  onEnded,
  muted = false,
  controls = true,
  onFrameCapture,
  showCaptureButton = false,
  overlayTitle,
  exerciseType,
  captureFrameRatio,
  onPlay,
  onPause,
  onUserInteracting,
}: {
  videoUrl: string | null;
  poster?: string;
  rounded?: boolean;
  autoplay?: boolean;
  forcePlay?: boolean;
  onEnded?: () => void;
  muted?: boolean;
  controls?: boolean;
  onFrameCapture?: (blob: Blob) => void;
  showCaptureButton?: boolean;
  captureFrameRatio?: "portrait" | "landscape" | undefined;
  overlayTitle?: string;
  exerciseType?: TrainingType;
  onPlay?: () => void;
  onPause?: () => void;
  onUserInteracting?: (interacting: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [frameImage, setFrameImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<
    { level: number; height: number; bitrate: number }[]
  >([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 for auto
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  // Check if the URL is an HLS stream (.m3u8)
  const isHlsStream = videoUrl?.toLowerCase().endsWith(".m3u8");

  // Initialize HLS.js when the component mounts or when the video URL changes
  useEffect(() => {
    // Clean up previous HLS instance if it exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Only initialize HLS.js if we have a video element, a video URL, and it's an HLS stream
    if (videoRef.current && videoUrl && isHlsStream) {
      // Check if HLS.js is supported in this browser
      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;

        // Load the HLS manifest
        hls.loadSource(videoUrl);

        // Attach the HLS media to the video element
        hls.attachMedia(videoRef.current);

        // Optional: Handle HLS.js events
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Extract quality levels
          const levels = hls.levels.map((level, index) => ({
            level: index,
            height: level.height,
            bitrate: level.bitrate,
          }));
          setAvailableQualities(levels);

          if (autoplay || forcePlay) {
            videoRef.current?.play().catch((error) => {
              console.error("Error playing video:", error);
            });
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
          // If there's a fatal error, try to recover
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // Try to recover network error
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                // Try to recover media error
                hls.recoverMediaError();
                break;
              default:
                // Cannot recover, destroy the instance
                hls.destroy();
                hlsRef.current = null;
                break;
            }
          }
        });
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        // For Safari, which has native HLS support
        videoRef.current.src = videoUrl;
        if (autoplay || forcePlay) {
          videoRef.current.play().catch((error) => {
            console.error("Error playing video:", error);
          });
        }
      }
    }

    // Clean up when component unmounts
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl, autoplay, forcePlay, isHlsStream]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setShowPlayButton(true);
    if (onEnded) onEnded();
    handleTrack("complete");
  };

  const handleQualityChange = (qualityLevel: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = qualityLevel;
      setCurrentQuality(qualityLevel);
      setShowQualityMenu(false);
    }
  };

  // to track events in ga4
  const handleTrack = (action: "play" | "pause" | "complete") => {
    if (!videoUrl) return;

    sendGtmDataLayer({
      event: `video_${action}`,
      video_url: videoUrl,
      video_title: overlayTitle ?? "Untitled",
      exercise_type: exerciseType ?? "unknown",
    });
  };

  const getQualityLabel = (quality: {
    level: number;
    height: number;
    bitrate: number;
  }) => {
    if (quality.height >= 1080) return "1080p";
    if (quality.height >= 720) return "720p";
    if (quality.height >= 480) return "480p";
    if (quality.height >= 360) return "360p";
    return `${quality.height}p`;
  };

  const captureFrame = async () => {
    if (!videoRef.current) return;
    setIsCapturing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setFrameImage(dataUrl);
      toast.success("Frame captured, crop before saving");
    } catch (error) {
      toast.error("Failed to capture frame.");
    } finally {
      setIsCapturing(false);
    }
  };

  const getCroppedImage = async (): Promise<Blob> => {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = frameImage!;
    });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx || !croppedAreaPixels) throw new Error("Crop failed");

    const upscaleFactor = 2;
    canvas.width = croppedAreaPixels.width * upscaleFactor;
    canvas.height = croppedAreaPixels.height * upscaleFactor;

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width * upscaleFactor,
      croppedAreaPixels.height * upscaleFactor,
    );

    return new Promise((resolve, reject) =>
      canvas.toBlob(
        (blob) => {
          if (!blob) reject("Blob generation failed");
          else resolve(blob);
        },
        "image/jpeg",
        0.95,
      ),
    );
  };

  const handleSave = async () => {
    const blob = await getCroppedImage();
    if (onFrameCapture) onFrameCapture(blob);
    toast.success("Cropped thumbnail saved.");
    setFrameImage(null); // close cropper
  };

  return (
    <div
      className={cn(
        "aspect-video w-full overflow-hidden relative bg-black",
        rounded ? "rounded-lg" : "rounded-none",
      )}>
      {/* Video player */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-10"
        // Only set src directly for non-HLS videos, HLS videos are handled by hls.js
        src={!isHlsStream ? videoUrl || undefined : undefined}
        // Only remove poster for match logs (we keep it for reviewed matches and training exercises)
        // We identify match logs by checking if overlayTitle is not provided and exerciseType is not provided
        // For reviewed matches and training exercises, we keep the poster image
        poster={poster}
        autoPlay={autoplay || forcePlay}
        controls={controls}
        muted={muted}
        playsInline
        onEnded={handleVideoEnd}
        preload="auto"
        crossOrigin="anonymous"
        onPlay={() => {
          setIsPlaying(true);
          setShowPlayButton(false);
          onPlay?.();
          handleTrack("play");
        }}
        onPause={() => {
          setIsPlaying(false);
          setShowPlayButton(true);
          onPause?.();
          handleTrack("pause");
        }}
        onPointerDown={() => onUserInteracting?.(true)}
        onPointerUp={() => onUserInteracting?.(false)}
        onPointerLeave={() => onUserInteracting?.(false)}
      />

      {/* Quality selector for HLS streams */}
      {isHlsStream && availableQualities.length > 1 && controls && (
        <div className="absolute top-4 right-4 z-30">
          <div className="relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {currentQuality === -1
                ? "Auto"
                : getQualityLabel(
                    availableQualities.find(
                      (q) => q.level === currentQuality,
                    ) || availableQualities[0],
                  )}
            </button>

            {showQualityMenu && (
              <div className="absolute top-full right-0 mt-1 bg-black/90 rounded-md shadow-lg min-w-[100px] overflow-hidden">
                <button
                  onClick={() => handleQualityChange(-1)}
                  className={cn(
                    "block w-full text-left px-3 py-2 text-sm text-white hover:bg-white/20 transition-colors",
                    currentQuality === -1 && "bg-white/20",
                  )}>
                  Auto
                </button>
                {availableQualities
                  .sort((a, b) => b.height - a.height)
                  .map((quality) => (
                    <button
                      key={quality.level}
                      onClick={() => handleQualityChange(quality.level)}
                      className={cn(
                        "block w-full text-left px-3 py-2 text-sm text-white hover:bg-white/20 transition-colors",
                        currentQuality === quality.level && "bg-white/20",
                      )}>
                      {getQualityLabel(quality)}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Capture button */}
      {showCaptureButton && videoUrl && (
        <button
          onClick={captureFrame}
          disabled={isCapturing}
          className="absolute bottom-16 right-4 bg-white/90 hover:bg-white text-black px-3 py-1.5 rounded-md text-sm font-medium shadow-lg transition-colors z-30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          {isCapturing ? "Capturing..." : "Capture Frame"}
        </button>
      )}

      {/* Cropping modal */}
      {frameImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-lg h-[300px] bg-white rounded-md">
            <Cropper
              image={frameImage}
              crop={crop}
              zoom={zoom}
              aspect={captureFrameRatio === "portrait" ? 9 / 16 : 16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            />
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setFrameImage(null)}
              className="text-white border px-4 py-2 rounded-md">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Save Thumbnail
            </button>
          </div>
        </div>
      )}

      {/* Optional overlay gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 mix-blend-overlay pointer-events-none" /> */}
    </div>
  );
}
