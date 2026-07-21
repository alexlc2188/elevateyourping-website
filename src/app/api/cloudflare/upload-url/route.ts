// app/api/cloudflare/upload-url/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_API_TOKEN;

  if (!accountId || !token) {
    return NextResponse.json(
      { error: "Cloudflare env vars missing" },
      { status: 500 },
    );
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        maxDurationSeconds: 900, // optional
        allowedOrigins: ["*"], // optional — restrict in production
        requireSignedURLs: false,
      }),
    },
  );

  const data = await response.json();

  if (!data.success || !data.result?.uploadURL) {
    return NextResponse.json(
      { error: "Failed to get upload URL" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    uploadURL: data.result.uploadURL,
    uid: data.result.uid,
  });
}
