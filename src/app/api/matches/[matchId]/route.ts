import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prismaDb } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// PATCH /api/matches/[matchId] - Update a match
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ matchId: string }> },
) {
  try {
    // Extract matchId from URL path
    // const url = new URL(req.url);
    // const pathSegments = url.pathname.split("/");
    // const matchId = pathSegments[pathSegments.length - 1];

    const { matchId } = await params;

    console.log(`[MATCH_PATCH] Processing request for matchId: ${matchId}`);

    const session = await auth();

    if (!session?.user?.id) {
      console.log("[MATCH_PATCH] Unauthorized - No user session");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;
    console.log(
      `[MATCH_PATCH] User ID from session: ${userId}, Role: ${userRole}`,
    );

    // Check if user has admin privileges
    const isAdmin =
      userRole === "ADMIN" || userRole === "COACH" || userRole === "OWNER";
    console.log(`[MATCH_PATCH] Is admin: ${isAdmin}`);

    // Additional debug info
    console.log(
      "[MATCH_PATCH] Full session user object:",
      JSON.stringify(session.user),
    );

    // Get the data from the request body
    const body = await req.json();
    const { offerType, aboutMe, notes, detailedSetVideos, shortSetVideos } =
      body;

    console.log(
      `[MATCH_PATCH] Request body:`,
      JSON.stringify({
        hasOfferType: !!offerType,
        hasAboutMe: !!aboutMe,
        hasNotes: !!notes,
        detailedSetVideosCount: detailedSetVideos?.length,
        shortSetVideosCount: shortSetVideos?.length,
      }),
    );

    // First check if the match exists
    // Try to find the match without userId constraint first to debug
    const matchExists = await prismaDb.match.findUnique({
      where: {
        id: matchId,
      },
    });

    if (!matchExists) {
      console.log(`[MATCH_PATCH] Match not found with ID: ${matchId}`);
      return new NextResponse("Match not found", { status: 404 });
    }

    console.log(
      `[MATCH_PATCH] Match found. Owner userId: ${matchExists.userId}`,
    );

    // If user is an admin, they can modify any match
    // If not an admin, check if the match belongs to the user
    let existingMatch;

    if (isAdmin) {
      console.log(`[MATCH_PATCH] User is admin, allowing access to match`);
      existingMatch = matchExists;
    } else {
      // Regular user - check if they own the match
      existingMatch = await prismaDb.match.findFirst({
        where: {
          id: matchId,
          userId,
        },
      });

      if (!existingMatch) {
        console.log(
          `[MATCH_PATCH] User ${userId} is not authorized to modify match ${matchId}`,
        );
        return new NextResponse("Not authorized to modify this match", {
          status: 403,
        });
      }
    }

    // Update the match with the new data
    const updatedMatch = await prismaDb.match.update({
      where: {
        id: matchId,
      },
      data: {
        offerType,
        aboutMe,
        notes,
      },
    });

    // If we have detailed set videos, update them
    if (detailedSetVideos && Array.isArray(detailedSetVideos)) {
      // First delete existing detailed set videos
      await prismaDb.matchDetailedSetVideo.deleteMany({
        where: {
          matchId,
        },
      });

      // Then create new ones
      for (const setVideo of detailedSetVideos) {
        await prismaDb.matchDetailedSetVideo.create({
          data: {
            matchId,
            videoId: setVideo.videoId,
            setNumber: setVideo.setNumber,
          },
        });
      }
    }

    // If we have short set videos, update them
    if (shortSetVideos && Array.isArray(shortSetVideos)) {
      // First delete existing short set videos
      await prismaDb.matchShortSetVideo.deleteMany({
        where: {
          matchId,
        },
      });

      // Then create new ones
      for (const setVideo of shortSetVideos) {
        await prismaDb.matchShortSetVideo.create({
          data: {
            matchId,
            videoId: setVideo.videoId,
            setNumber: setVideo.setNumber,
          },
        });
      }
    }

    // Get the updated match with all relations
    const finalMatch = await prismaDb.match.findUnique({
      where: {
        id: matchId,
      },
      include: {
        detailedSetVideos: {
          include: {
            video: true,
          },
        },
        shortSetVideos: {
          include: {
            video: true,
          },
        },
      },
    });

    return NextResponse.json(finalMatch);
  } catch (error) {
    console.error("[MATCH_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET /api/matches/[matchId] - Get a match by ID
export async function GET(request: Request) {
  try {
    // Extract matchId from URL path
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const matchId = pathSegments[pathSegments.length - 1];

    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const match = await prismaDb.match.findUnique({
      where: {
        id: matchId,
        userId,
      },
      include: {
        detailedSetVideos: {
          include: {
            video: true,
          },
        },
        shortSetVideos: {
          include: {
            video: true,
          },
        },
      },
    });

    if (!match) {
      return new NextResponse("Match not found", { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("[MATCH_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
