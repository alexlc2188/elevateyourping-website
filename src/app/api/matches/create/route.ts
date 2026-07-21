import { NextResponse } from "next/server";
import { prismaDb } from "@/lib/db";
import { createMatchSchema } from "@/lib/validators/matches/matchSchema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = createMatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: parsed.error.errors },
        { status: 400 }
      );
    }

    // Extract setVideoIds from the parsed data
    const { setVideoIds, ...matchData } = parsed.data;

    // Create the match data object, explicitly excluding fields with unique constraints
    // to avoid MongoDB's issue with null values in unique fields
    const matchCreateData = {
      user: {
        connect: { id: session.user.id },
      },
      opponentName: matchData.opponentName,
      // Handle required fields in Prisma schema that are optional in our form
      eventName: matchData.eventName || "", // Empty string for optional field that's required in schema
      matchDate: matchData.matchDate,
      finalScore: matchData.finalScore || "–", // Default dash for optional score
      logNote: matchData.logNote || "", // Empty string for optional notes
      aboutMe: matchData.aboutMe || null,
      offerType: matchData.offerType || "LOG",
      // Explicitly omit highlightVideoId and reviewVideoId fields to avoid MongoDB unique constraint issues
      highlightVideoId: undefined,
      reviewVideoId: undefined,
      
      // We'll create the video relations separately after the match is created
      // to avoid issues with MongoDB's handling of relations
    };

    // Create the match with proper relations
    try {
      // First, create the match without the videos
      const matchDataWithoutVideos = { ...matchCreateData };
      
      const match = await prismaDb.match.create({
        data: matchDataWithoutVideos,
        // Include the created relations in the response
        include: {
          user: true,
        },
      });
      
      // Now create the video relations separately if there are videos
      if (setVideoIds && setVideoIds.length > 0) {
        // First, verify that the videos exist in the database
        const validVideoIds = [];
        for (const videoId of setVideoIds) {
          try {
            const videoExists = await prismaDb.video.findUnique({
              where: { id: videoId },
              select: { id: true }
            });
            
            if (videoExists) {
              validVideoIds.push(videoId);
            } else {
              // Silently skip invalid video IDs
              continue;
            }
          } catch (error) {
            // Silently skip invalid video IDs
            continue;
          }
        }
        
        if (validVideoIds.length > 0) {
          // Create each relation individually for better error tracking
          for (let i = 0; i < validVideoIds.length; i++) {
            try {
              const videoId = validVideoIds[i];
              const setNumber = i + 1;
              
              console.log(`Creating relation for video ${videoId} as set ${setNumber}`);
              
              const detailedSetVideo = await prismaDb.matchDetailedSetVideo.create({
                data: {
                  matchId: match.id,
                  videoId: videoId,
                  setNumber: setNumber,
                }
              });
              
              console.log(`Successfully created relation with ID: ${detailedSetVideo.id}`);
            } catch (error) {
              console.error(`Failed to create relation for video at index ${i}:`, error);
            }
          }
        } else {
          console.log("No valid video IDs found to create relations");
        }
      }
      
      // Fetch the complete match with videos
      const completeMatch = await prismaDb.match.findUnique({
        where: { id: match.id },
        include: {
          detailedSetVideos: true,
          user: true,
        },
      });
    
      // TODO: you may want to remove if you dont want to expose IDS
      console.log("Complete match with videos:", JSON.stringify(completeMatch, null, 2));
      
      revalidatePath("/app/matches");
      return NextResponse.json({ success: true, match: completeMatch });
    } catch (prismaError) {
      console.error("Prisma error creating match:", prismaError);
      return NextResponse.json(
        { error: "Database error", details: prismaError },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Create match error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
