// Helper function to get the appropriate video URL based on encoding status
export function getVideoUrl(
  video: {
    publicUrl: string;
    streamingUrl: string | null;
    encodingStatus: string | null;
  } | null
): string {
  if (!video) return "";

  // Only use streamingUrl if encoding is COMPLETED and streamingUrl is not empty
  if (
    video.encodingStatus === "COMPLETED" &&
    video.streamingUrl &&
    video.streamingUrl.trim() !== ""
  ) {
    return video.streamingUrl;
  }

  // Otherwise, always use publicUrl
  return video.publicUrl || "";
}
