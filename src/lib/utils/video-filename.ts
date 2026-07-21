import { MatchWithPayload } from "@/app/(app)/app/matches/[matchId]/page";

/**
 * Generates a standardized filename for match videos
 * Format: YYYY-MM-DD-opponent-name-video-type.mp4
 */
export function generateVideoFilename(
  match: MatchWithPayload,
  videoType: string
): string {
  const matchDate = new Date(match.matchDate);
  const dateStr = matchDate.toISOString().split("T")[0]; // YYYY-MM-DD format

  const opponentName = match.opponentName || "opponent";
  const cleanOpponentName = opponentName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, ""); // Remove special characters

  return `${dateStr}-${cleanOpponentName}-${videoType}.mp4`;
}

/**
 * Generates a filename for set videos
 * Format: YYYY-MM-DD-opponent-name-set-N.mp4
 */
export function generateSetVideoFilename(
  match: MatchWithPayload,
  setNumber: number
): string {
  return generateVideoFilename(match, `set-${setNumber}`);
}
