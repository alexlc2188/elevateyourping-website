"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { VideoField } from "./video-field";
import { TrainingType } from "@prisma/client";

type Props = {
  label: string;
  fieldName: "mainVideoId" | "previewVideoId";
  onVideoSet: (id: string, thumb?: string) => void;
  exerciseType?: TrainingType;
};

export const VideoInputBlock = ({
  label,
  fieldName,
  onVideoSet,
  exerciseType,
}: Props) => {
  const [mode, setMode] = useState<"upload" | "manual">("upload");
  const [manualId, setManualId] = useState("");
  const [manualThumb, setManualThumb] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleManualSubmit = async () => {
    const trimmed = manualId.trim();
    if (!trimmed) return;
    setLoading(true);

    const thumbUrl = `https://videodelivery.net/${trimmed}/thumbnails/thumbnail.jpg`;

    try {
      const res = await fetch(thumbUrl, { method: "HEAD" });
      if (res.ok) {
        setManualThumb(thumbUrl);
        onVideoSet(trimmed, thumbUrl);
      } else {
        setManualThumb(null);
        onVideoSet(trimmed);
      }
    } catch {
      setManualThumb(null);
      onVideoSet(trimmed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 border rounded-md p-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="space-x-2">
          <Button
            size="sm"
            variant={mode === "upload" ? "default" : "ghost"}
            onClick={() => setMode("upload")}
            type="button">
            Upload
          </Button>
          <Button
            size="sm"
            variant={mode === "manual" ? "default" : "ghost"}
            onClick={() => setMode("manual")}
            type="button">
            Enter ID
          </Button>
        </div>
      </div>

      {/* Upload Mode */}
      {mode === "upload" && (
        <VideoField
          showCaptureButton
          captureFrameRatio="landscape"
          label={`Upload ${label}`}
          fieldName={fieldName}
          onVideoSet={onVideoSet}
          exerciseType={exerciseType}
        />
      )}

      {/* Manual Mode */}
      {mode === "manual" && (
        <div className="space-y-2">
          <Input
            placeholder="Enter Cloudflare video ID"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
          />

          <Button
            size="sm"
            type="button"
            onClick={handleManualSubmit}
            disabled={!manualId.trim() || loading}>
            {loading ? "Checking..." : "Confirm ID"}
          </Button>

          {manualThumb && (
            <div className="relative w-full aspect-video rounded-md overflow-hidden border">
              <img
                src={manualThumb}
                alt="Manual Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                <CheckCircle className="text-green-600" />
              </div>
            </div>
          )}
          <p className="text-muted-foreground text-xs">
            Paste the Cloudflare UID of an already uploaded video.
          </p>
        </div>
      )}
    </div>
  );
};
