import { NextResponse } from "next/server";

// app/api/generate-script/route.ts
export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        size: "1792x1024",
        n: 1,
      }),
    });
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`DALL·E error (${res.status}): ${errorBody}`);
    }

    const data = await res.json();
    const imageUrl = data?.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI.");
    }

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error("Thumbnail generation failed:", error);
    return NextResponse.json(
      { error: "❌ Failed to generate thumbnail." },
      { status: 500 },
    );
  }
}
