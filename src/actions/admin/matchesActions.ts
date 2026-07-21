"use server";

import { prismaDb } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

/**
 * Update a match video (either review or highlight)
 */
export async function updateMatchVideo({
  matchId,
  reviewVideoId,
  highlightVideoId,
}: {
  matchId: string;
  reviewVideoId?: string;
  highlightVideoId?: string;
}) {
  // Role validation
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) {
    return {
      success: false,
      error: auth.error,
      data: null,
    };
  }

  if (!matchId) {
    return {
      success: false,
      error: "Match ID is required",
      data: null,
    };
  }

  // Check if at least one video ID is provided
  if (!reviewVideoId && !highlightVideoId) {
    return {
      success: false,
      error: "At least one video ID is required",
      data: null,
    };
  }

  try {
    // Prepare update data based on which video ID is provided
    const updateData: any = {};

    // First, update the video's encoding status to PENDING if it's a new video
    if (reviewVideoId) {
      // Update the video's encoding status to PENDING
      await prismaDb.video.update({
        where: { id: reviewVideoId },
        data: { encodingStatus: "PENDING" },
      });

      // Connect the video to the match
      updateData.reviewVideo = {
        connect: {
          id: reviewVideoId,
        },
      };
    }

    if (highlightVideoId) {
      // Update the video's encoding status to PENDING
      await prismaDb.video.update({
        where: { id: highlightVideoId },
        data: { encodingStatus: "PENDING" },
      });

      // Connect the video to the match
      updateData.highlightVideo = {
        connect: {
          id: highlightVideoId,
        },
      };
    }

    // Update the match with the new video relation
    const updatedMatch = await prismaDb.match.update({
      where: {
        id: matchId,
      },
      data: updateData,
    });

    if (!updatedMatch) {
      return {
        success: false,
        error: "Match not found",
        data: null,
      };
    }

    return {
      success: true,
      data: updatedMatch,
      error: null,
    };
  } catch (error) {
    console.error("Error updating match video:", error);
    return {
      success: false,
      error: "Failed to update the match video",
      data: null,
    };
  }
}

/**
 * Delete a match video (either review or highlight)
 */
export async function deleteMatchVideo({
  matchId,
  videoType,
}: {
  matchId: string;
  videoType: "review" | "highlight";
}) {
  // Role validation
  const auth = await requireRole([UserRole.ADMIN, UserRole.COACH]);
  if (!auth.success) {
    return {
      success: false,
      error: auth.error,
      data: null,
    };
  }

  if (!matchId) {
    return {
      success: false,
      error: "Match ID is required",
      data: null,
    };
  }

  try {
    // Prepare update data to disconnect the video
    const updateData =
      videoType === "highlight"
        ? { highlightVideo: { disconnect: true } }
        : { reviewVideo: { disconnect: true } };

    // Update the match to disconnect the video
    const updatedMatch = await prismaDb.match.update({
      where: {
        id: matchId,
      },
      data: updateData,
    });

    if (!updatedMatch) {
      return {
        success: false,
        error: "Match not found",
        data: null,
      };
    }

    return {
      success: true,
      data: updatedMatch,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting match video:", error);
    return {
      success: false,
      error: "Failed to delete the match video",
      data: null,
    };
  }
}
