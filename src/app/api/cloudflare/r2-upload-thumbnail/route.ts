import { NextResponse } from "next/server";
import { getR2Client } from "@/lib/cloudflare/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const thumbnail = formData.get("thumbnail") as File;

    if (!thumbnail) {
      return NextResponse.json(
        { error: "No thumbnail file provided" },
        { status: 400 },
      );
    }

    // Generate a unique file key for the thumbnail
    const fileKey = `thumbnails/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.jpg`;

    // Get R2 client
    const r2 = getR2Client();

    // Upload the thumbnail to R2
    const arrayBuffer = await thumbnail.arrayBuffer();
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
        Key: fileKey,
        Body: new Uint8Array(arrayBuffer),
        ContentType: "image/jpeg",
      }),
    );

    // Generate the public URL
    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileKey}`;

    return NextResponse.json({ thumbnailUrl: publicUrl });
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
    return NextResponse.json(
      { error: "Failed to upload thumbnail" },
      { status: 500 },
    );
  }
}
