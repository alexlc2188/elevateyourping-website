// app/api/cloudflare/r2-upload-url/route.ts
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { prismaDb } from "@/lib/db";
import { publishVideoUploadEvent } from "@/lib/pubsub";

// Set CORS headers for the preflight request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function GET(request: Request) {
  try {
    // Get file extension and original filename from query params
    const { searchParams } = new URL(request.url);
    const fileExtension = searchParams.get("fileExtension") || "mp4";
    const originalFilename =
      searchParams.get("filename") || `video.${fileExtension}`;

    // Get video type from query params (default to 'general' if not provided)
    const videoType = searchParams.get("videoType") || "general";

    // Generate date folder in format ddmmyyyy
    const now = new Date();
    const dateFolder = `${now.getDate().toString().padStart(2, "0")}${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${now.getFullYear()}`;

    // Generate a unique filename with organized directory structure
    const uniqueId = crypto.randomUUID();
    const fileName = `videos/${videoType}/${dateFolder}/${uniqueId}.${fileExtension}`;

    // Initialize S3 client for Cloudflare R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
      },
    });

    // Create the command to put an object with CORS headers
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || "",
      Key: fileName,
      ContentType: `video/${fileExtension}`,
      // Add metadata to track the original filename
      Metadata: {
        originalfilename: encodeURIComponent(originalFilename),
      },
    });

    // Generate a presigned URL
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    // Create a video record in the database
    const video = await prismaDb.video.create({
      data: {
        fileKey: fileName,
        publicUrl: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`,
        originalFilename: originalFilename,
        fileSize: 0, // Will be updated after upload
        mimeType: `video/${fileExtension}`,
        status: "UPLOADED", // Initial status
      },
    });

    // // Publish video upload event to PubSub only for exercises or review videos
    // if (videoType === "exercises" || videoType === "review") {
    //   try {
    //     if (
    //       process.env.GOOGLE_CLOUD_PROJECT_ID &&
    //       process.env.GOOGLE_PUBSUB_TOPIC
    //     ) {
    //       await publishVideoUploadEvent(video.id);
    //     }
    //   } catch (pubsubError) {
    //     // Log the error but don't fail the request
    //     console.error("Failed to publish video upload event:", pubsubError);
    //     // We continue with the request even if PubSub publishing fails
    //   }
    // }

    // Return the presigned URL and file details with CORS headers
    return NextResponse.json(
      {
        success: true,
        uploadURL: presignedUrl,
        fileKey: fileName,
        fileId: uniqueId,
        videoId: video.id, // Include the database ID
        publicUrl: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Error generating R2 presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL", details: String(error) },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}
