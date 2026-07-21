"use client";
import { useState, useEffect } from "react";
import { MAX_VIDEO_SIZE } from "@/constants/video";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
} from "lucide-react";
import VideoPlayer from "@/components/video-player";
import { EncodingStatus, TrainingType } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type VideoFieldProps = {
  label: string;
  fieldName:
    | "mainVideoId"
    | "previewVideoId"
    | "highlightVideoId"
    | "reviewVideoId"
    | "introPackVideoId";
  onVideoSet: (
    id: string,
    thumbnailUrl?: string,
    videoUrl?: string,
    index?: number,
    totalFiles?: number
  ) => void;
  onVideoDelete?: () => void;
  initialVideoId?: string;
  initialVideoUrl?: string;
  initialThumbnailUrl?: string;
  exerciseType?: TrainingType;
  captureFrameRatio?: "landscape" | "portrait";
  encodingStatus?: EncodingStatus;
  onUploadStart?: () => void;
  onUploadError?: () => void;
  allowMultiple?: boolean; // New prop to allow multiple file selection
  showCaptureButton?: boolean; // Added to fix prop error
  videoType?: string; // NEW: for controlling upload folder
  compact?: boolean; // NEW: for mobile-friendly compact interface
  hideMetadata?: boolean; // NEW: hide video ID and encoding status
};

// Component to display encoding status
const EncodingStatusBadge = ({ status }: { status?: EncodingStatus }) => {
  if (!status) {
    return null;
  }

  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
        >
          <Clock className="w-3 h-3" /> Pending Encoding
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
        >
          <div className="w-3 h-3 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          Encoding in Progress
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
        >
          <CheckCircle className="w-3 h-3" />
          Encoding Complete
        </Badge>
      );
    case "FAILED":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" /> Encoding Failed
        </Badge>
      );
    default:
      return null;
  }
};

// Custom confirm dialog for video deletion
const VideoDeleteConfirmDialog = ({
  children,
  onConfirm,
  videoLabel,
}: {
  children: React.ReactNode;
  onConfirm: () => void;
  videoLabel: string;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {videoLabel}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this video? This action will
            immediately update the exercise and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete Video
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const VideoField = ({
  label,
  fieldName,
  onVideoSet,
  onVideoDelete,
  initialVideoId,
  initialVideoUrl,
  initialThumbnailUrl,
  exerciseType,
  captureFrameRatio = "landscape",
  encodingStatus,
  onUploadStart,
  onUploadError,
  allowMultiple = false, // Default to allowing multiple files
  showCaptureButton = false,
  videoType = "general", // Default to general for backward compatibility
  compact = false, // Default to false for backward compatibility
  hideMetadata = false, // Default to false for backward compatibility
}: VideoFieldProps) => {
  // State for video upload and processing
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(
    initialVideoUrl || null
  );

  const [currentEncodingStatus, setCurrentEncodingStatus] = useState<
    EncodingStatus | null | undefined
  >(encodingStatus || null);

  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    initialThumbnailUrl || null
  );

  // Store XMLHttpRequest reference for cancellation
  const [currentUploadXhr, setCurrentUploadXhr] =
    useState<XMLHttpRequest | null>(null);

  // Track current uploading filename
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(
    null
  );

  // Update videoUrl when initialVideoUrl changes
  useEffect(() => {
    setVideoUrl(initialVideoUrl || null);
  }, [initialVideoUrl]);

  // Update thumbnailUrl when initialThumbnailUrl changes
  useEffect(() => {
    setThumbnailUrl(initialThumbnailUrl || null);
  }, [initialThumbnailUrl]);

  // Update currentEncodingStatus when encodingStatus changes
  useEffect(() => {
    setCurrentEncodingStatus(encodingStatus || null);
  }, [encodingStatus]);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Track if we have an existing video to display
  const [existingVideo, setExistingVideo] = useState(
    Boolean(initialVideoUrl && initialVideoId)
  );

  // Update existingVideo state when props change
  useEffect(() => {
    setExistingVideo(Boolean(initialVideoUrl && initialVideoId));
  }, [initialVideoUrl, initialVideoId]);

  // Handle video deletion
  const handleDeleteVideo = () => {
    setVideoUrl(null);
    setThumbnailUrl(null);
    setExistingVideo(false);
    setUploaded(false);
    setCurrentEncodingStatus(null);
    setError(null);

    // Call the onVideoDelete callback if provided
    if (onVideoDelete) {
      onVideoDelete();
    }
  };

  // Handle upload cancellation
  const handleCancelUpload = () => {
    if (currentUploadXhr) {
      currentUploadXhr.abort();
      setCurrentUploadXhr(null);
    }

    // Reset upload state
    setUploading(false);
    setProcessing(false);
    setUploadProgress(0);
    setUploadingFileName(null);
    setError(null);

    console.log("Upload cancelled by user");

    // Notify parent component that upload has been cancelled
    if (onUploadError) {
      onUploadError();
    }
  };

  // Set up global drag and drop handlers
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    const handleDrop = (e: DragEvent) => {
      if (e.target instanceof HTMLInputElement && e.target.type === "file")
        return;
      e.preventDefault();
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Handle file upload to R2 using pre-signed URL
  const handleUpload = async (
    file: File,
    fileIndex?: number,
    totalFiles?: number
  ) => {
    if (!file) return;
    console.log(
      "Starting upload process for file:",
      file.name,
      file.type,
      file.size
    );
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setUploadingFileName(file.name); // Store the filename

    // Notify parent component that upload has started
    if (onUploadStart) {
      onUploadStart();
    }

    try {
      // Extract file extension from file name
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const contentType = file.type || `video/${fileExtension}`;

      console.log("Step 1: Requesting pre-signed URL...");

      // Generate the upload URL
      const uploadUrl = `/api/cloudflare/r2-upload-url?fileExtension=${fileExtension}`;
      // Use the videoType prop directly
      const uploadUrlWithType = `${uploadUrl}&videoType=${videoType}`;

      // Request a presigned upload URL from the API
      const res = await fetch(uploadUrlWithType);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to get upload URL (${res.status})`
        );
      }

      const { uploadURL, fileKey, videoId, publicUrl } = await res.json();
      console.log(
        "Step 2: Received pre-signed URL, starting direct upload to R2..."
      );

      // Step 2: Upload the file directly to R2 using the pre-signed URL
      const xhr = new XMLHttpRequest();
      setCurrentUploadXhr(xhr); // Store reference for cancellation
      xhr.open("PUT", uploadURL);
      xhr.setRequestHeader("Content-Type", contentType);

      // Set up progress tracking
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          console.log(`Upload progress: ${percent}%`);
          setUploadProgress(percent);
        } else {
          console.log("Upload progress not computable");
        }
      };

      // Add event listener for upload start
      xhr.upload.onloadstart = () => {
        console.log("Direct upload to R2 started");
        setUploadProgress(0);
      };

      // Handle response from R2
      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Direct upload to R2 completed successfully");

          // Update UI to show processing state
          setUploadProgress(100);
          setUploading(false);
          setProcessing(true);

          // Call the onVideoSet callback with the video ID, thumbnail URL, and file index info
          onVideoSet(
            videoId,
            thumbnailUrl || undefined,
            publicUrl,
            fileIndex,
            totalFiles
          );

          // Only update the UI state if this is a single upload or the last file in a batch
          if (
            fileIndex === undefined ||
            (totalFiles !== undefined && fileIndex === totalFiles - 1)
          ) {
            setUploading(false);
            setProcessing(false);
            setUploaded(true);
            setExistingVideo(true);
            setVideoUrl(publicUrl);
            setThumbnailUrl(thumbnailUrl || null);
            setError(null);
          }

          // Update encoding status to PENDING
          setCurrentEncodingStatus("PENDING");

          // Turn off processing state after a slight delay for better UX
          setTimeout(() => {
            setProcessing(false);
            setCurrentUploadXhr(null); // Clean up reference
            setUploadingFileName(null); // Clear filename
            console.log("Video ready for display");
          }, 2000);
        } else {
          console.error(
            "Upload to R2 failed with status:",
            xhr.status,
            xhr.statusText
          );
          setError(
            `Upload failed with status ${xhr.status}: ${xhr.statusText}`
          );
          setUploading(false);
          setProcessing(false);
          setCurrentUploadXhr(null); // Clean up reference
          setUploadingFileName(null); // Clear filename
        }
      };

      xhr.onerror = (event) => {
        console.error("XHR upload to R2 failed:", event);
        setError(
          "Network error during upload to R2. This may be due to CORS restrictions."
        );
        setUploading(false);
        setProcessing(false);
        setCurrentUploadXhr(null); // Clean up reference
        setUploadingFileName(null); // Clear filename

        // Notify parent component that upload has failed
        if (onUploadError) {
          onUploadError();
        }
      };

      // Handle upload cancellation/abort
      xhr.onabort = () => {
        console.log("Upload aborted by user");
        setUploading(false);
        setProcessing(false);
        setUploadProgress(0);
        setCurrentUploadXhr(null); // Clean up reference
        setUploadingFileName(null); // Clear filename
        setError("Upload cancelled");
      };

      // Send the file directly to R2
      console.log("Sending file to R2...");
      xhr.send(file);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
      setUploading(false);
      setProcessing(false);
      setCurrentUploadXhr(null); // Clean up reference
      setUploadingFileName(null); // Clear filename

      // Notify parent component that upload has failed
      if (onUploadError) {
        onUploadError();
      }
    }
  };

  const handleFrameCapture = async (blob: Blob) => {
    try {
      // Create a FormData object to send the thumbnail
      const formData = new FormData();
      formData.append("thumbnail", blob, "thumbnail.jpg");

      // Upload the thumbnail
      const response = await fetch("/api/cloudflare/r2-upload-thumbnail", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload thumbnail");
      }

      const { thumbnailUrl } = await response.json();
      setThumbnailUrl(thumbnailUrl);

      // Update the video with the new thumbnail
      if (initialVideoId) {
        onVideoSet(initialVideoId, thumbnailUrl, videoUrl || initialVideoUrl);
      }
    } catch (err) {
      console.error("Error uploading thumbnail:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      let oversized = false;
      for (let i = 0; i < e.target.files.length; i++) {
        if (e.target.files[i].size > MAX_VIDEO_SIZE) {
          oversized = true;
          break;
        }
      }
      if (oversized) {
        setError(
          "One or more videos exceed the 1GB limit. Please select smaller files."
        );
        return;
      }
      // If multiple files are selected
      if (allowMultiple && e.target.files.length > 1) {
        const totalFiles = e.target.files.length;
        if (onUploadStart) onUploadStart();
        // Process each file sequentially using an async function
        const processFiles = async () => {
          // Store files in a local variable to avoid null check issues
          const files = e.target.files;
          if (!files) return;

          for (let i = 0; i < totalFiles; i++) {
            const file = files[i];
            if (file) {
              try {
                await handleUpload(file, i, totalFiles);
              } catch (error) {
                console.error(`Error uploading file ${i + 1}:`, error);
                if (onUploadError) onUploadError();
              }
            }
          }
        };
        // Execute the async function
        processFiles();
      } else {
        // Single file upload
        const file = e.target.files[0];
        if (file) handleUpload(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (
      e.dataTransfer &&
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      let oversized = false;
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        if (e.dataTransfer.files[i].size > MAX_VIDEO_SIZE) {
          oversized = true;
          break;
        }
      }
      if (oversized) {
        setError(
          "One or more videos exceed the 500MB limit. Please select smaller files."
        );
        return;
      }
      // If multiple files are dropped
      if (allowMultiple && e.dataTransfer.files.length > 1) {
        const totalFiles = e.dataTransfer.files.length;
        if (onUploadStart) onUploadStart();
        // Process each file sequentially using an async function
        const processFiles = async () => {
          for (let i = 0; i < totalFiles; i++) {
            const file = e.dataTransfer.files[i];
            if (file) {
              try {
                await handleUpload(file, i, totalFiles);
              } catch (error) {
                console.error(`Error uploading file ${i + 1}:`, error);
                if (onUploadError) onUploadError();
              }
            }
          }
        };
        // Execute the async function
        processFiles();
      } else {
        // Single file upload
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
      }
    }
  };

  return (
    <div
      className={`${hideMetadata ? "" : "space-y-2 border rounded-md"} ${
        compact && !hideMetadata ? "p-2" : !hideMetadata ? "p-4" : ""
      }`}
    >
      {/* Header with label and encoding status */}
      {!hideMetadata && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>{label}</Label>
            {initialVideoId && (
              <div className="text-xs text-muted-foreground">
                Video ID: {initialVideoId}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {currentEncodingStatus && (
              <EncodingStatusBadge status={currentEncodingStatus} />
            )}
            {existingVideo && onVideoDelete && (
              <VideoDeleteConfirmDialog
                onConfirm={handleDeleteVideo}
                videoLabel={label}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
                  disabled={uploading || processing}
                >
                  <Trash2 size={14} />
                </Button>
              </VideoDeleteConfirmDialog>
            )}
          </div>
        </div>
      )}

      {/* Video upload and display */}
      <>
        {existingVideo && videoUrl ? (
          // Show existing video with replace options
          <div className="space-y-2">
            <div
              className={`relative w-full aspect-video rounded-md overflow-hidden transition ${
                isDragging
                  ? "border-2 border-primary bg-primary/10"
                  : "border border-border"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleUpload(file);
              }}
            >
              {/* Video player with frame capture */}
              <VideoPlayer
                videoUrl={videoUrl}
                poster={thumbnailUrl || undefined}
                rounded={false}
                controls={true}
                onFrameCapture={handleFrameCapture}
                captureFrameRatio={captureFrameRatio}
                exerciseType={exerciseType}
                showCaptureButton={showCaptureButton}
              />
              {/* Overlay for drag and drop functionality only */}
              {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-all pointer-events-none">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium">
                    Drop to Replace
                  </div>
                </div>
              )}
              {(uploading || processing) && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                  {uploading ? (
                    <>
                      <div className="text-white mb-2 font-medium">
                        Uploading video...
                      </div>
                      {uploadingFileName && (
                        <div className="text-white text-xs mb-2 opacity-80 max-w-xs truncate">
                          {uploadingFileName}
                        </div>
                      )}
                      <div className="w-2/3 mb-1">
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                      <div className="text-white text-sm mb-3">
                        {uploadProgress}% complete
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelUpload}
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                      >
                        Cancel Upload
                      </Button>
                    </>
                  ) : processing ? (
                    <>
                      <div className="text-white mb-2 font-medium">
                        Processing video...
                      </div>
                      <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
                      <div className="text-white text-sm">
                        This may take a few seconds
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Show upload interface
          <label
            className={`flex flex-col items-center justify-center border-2 rounded-md ${
              compact ? "px-4 py-4" : "px-6 py-10"
            } bg-white text-center w-full transition cursor-pointer ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-dashed border-gray-300 hover:bg-slate-50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              if (!compact) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={compact ? undefined : handleDrop}
          >
            <UploadCloud
              className={`${compact ? "w-5 h-5" : "w-8 h-8"} text-slate-400 ${
                compact ? "mb-1" : "mb-2"
              }`}
            />
            <span
              className={`${compact ? "text-xs" : "text-sm"} text-slate-600`}
            >
              {isDragging && !compact
                ? "Drop video(s) to upload"
                : compact
                ? "Tap to select video"
                : "Click or drag video here"}
            </span>
            {allowMultiple && !compact && (
              <span className="text-xs text-slate-500 mt-1">
                You can select multiple videos at once
              </span>
            )}

            <input
              type="file"
              accept="video/*"
              multiple={allowMultiple} // Allow multiple file selection
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              form="" // Ensures it does not attach to nearest <form>
            />

            {(uploading || processing) && (
              <div
                className={`${compact ? "mt-2 space-y-1" : "mt-4 space-y-2"}`}
              >
                {uploading ? (
                  <>
                    <div
                      className={`flex justify-between ${
                        compact ? "text-xs" : "text-sm"
                      } text-slate-600`}
                    >
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    {uploadingFileName && !compact && (
                      <div className="text-xs text-slate-500 mb-1 truncate">
                        {uploadingFileName}
                      </div>
                    )}
                    <Progress
                      value={uploadProgress}
                      className={`w-full ${compact ? "h-1" : "h-2"}`}
                    />
                    {!compact && (
                      <div className="flex justify-center mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCancelUpload();
                          }}
                          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          Cancel Upload
                        </Button>
                      </div>
                    )}
                  </>
                ) : processing ? (
                  <div
                    className={`flex items-center justify-center space-x-2 ${
                      compact ? "text-xs" : "text-sm"
                    } text-slate-600`}
                  >
                    <div
                      className={`${
                        compact ? "w-4 h-4" : "w-5 h-5"
                      } border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
                    ></div>
                    <span>Processing...</span>
                  </div>
                ) : null}
              </div>
            )}
          </label>
        )}
      </>

      {error && (
        <div className="text-red-500 text-sm flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};
