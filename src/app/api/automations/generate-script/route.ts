import { NextResponse } from "next/server";

// app/api/generate-script/route.ts
export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.6,
      }),
    });

    const data = await res.json();

    if (!data?.choices?.[0]?.message?.content) {
      console.error("OpenAI returned unexpected response:", data);
      return NextResponse.json(
        { result: "⚠️ OpenAI did not return a valid response." },
        { status: 500 },
      );
    }

    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { result: "❌ Failed to generate script. Please try again later." },
      { status: 500 },
    );
  }
}
