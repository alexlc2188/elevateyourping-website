import { prismaDb } from "../db";
import { currentUser } from "../auth";
import { Prisma } from "@prisma/client";

export type MatchLog = Prisma.MatchGetPayload<{
  select: {
    eventName: true;
    id: true;
    isPublished: true;
    logNote: true;
    matchDate: true;
    opponentName: true;
    finalScore: true;
    offerType: true;
  };
}>;

export const getUserMatches = async (userId: string) => {
  try {
    const matches = await prismaDb.match.findMany({
      where: { userId },
      select: {
        eventName: true,
        id: true,
        isPublished: true,
        logNote: true,
        matchDate: true,
        opponentName: true,
        finalScore: true,
        offerType: true,
      },

      orderBy: { matchDate: "desc" },
    });

    return { success: true, data: matches, error: null };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to fetch user matches",
      data: [],
    };
  }
};

export const getUserFullMatches = async (userId: string) => {
  try {
    const matches = await prismaDb.match.findMany({
      where: { userId },

      include: {
        highlightVideo: {
          select: {
            thumbnailUrl: true,
          },
        },
      },
      orderBy: { matchDate: "desc" },
    });

    return { success: true, data: matches, error: null };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to fetch user matches",
      data: [],
    };
  }
};

/**
 * Fetch a single match by its ID
 */

export const getMatchById = async ({
  matchId,
  userId,
}: {
  matchId?: string;
  userId: string;
}) => {
  if (!matchId) {
    return {
      success: false,
      error: "No match id provided",
      data: null,
    };
  }

  try {
    const match = await prismaDb.match.findUnique({
      where: { id: matchId, userId },
      include: {
        detailedSetVideos: {
          include: {
            video: true, // Include the video object with publicUrl
          },
        },
      },
    });

    if (!match) {
      return {
        success: false,
        error: "Match not found",
        data: null,
      };
    }

    return { success: true, data: match, error: null };
  } catch (error) {
    console.error("getMatchById error:", error);
    return {
      success: false,
      error: "Failed to fetch match",
      data: null,
    };
  }
};

export async function getRecentMatch() {
  const user = await currentUser();
  if (!user) return null;

  try {
    const match = await prismaDb.match.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!match) {
      return {
        success: false,
        error: "Match not found",
        data: null,
      };
    }
    return {
      success: true,
      data: match,
    };
  } catch (error) {
    console.error("❌ createMatch error:", error);
    return {
      success: false,
      error: "Failed to fetch match",
      data: null,
    };
  }
}

export async function publishMatch(matchId: string, isPublished: boolean) {
  if (!matchId) {
    return {
      success: false,
      error: "Missing match id",
      data: null,
    };
  }

  try {
    const updatedMatch = await prismaDb.match.update({
      where: { id: matchId },
      data: {
        isPublished: !isPublished,
      },
    });

    if (!updatedMatch) {
      return {
        success: false,
        error: "No match found for this match",
        data: null,
      };
    }

    return {
      success: true,
      data: updatedMatch,
    };
  } catch (error) {
    console.error("Failed to add exercises to match plan:", error);
    return {
      success: false,
      error: "An error occurred while linking exercises to the plan.",
      data: null,
    };
  }
}
