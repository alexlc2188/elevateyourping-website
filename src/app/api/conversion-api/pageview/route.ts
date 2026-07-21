import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!process.env.META_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "Missing META_ACCESS_TOKEN" },
      { status: 500 },
    );
  }

  const FB_ENDPOINT = `https://graph.facebook.com/v17.0/1440743369802292/events?access_token=${process.env.META_ACCESS_TOKEN}`;

  try {
    const {
      event_source_url,
      event_id,
    }: { event_source_url: string; event_id: string } = await request.json();

    const fbpCookie = request.cookies.get("_fbp")?.value;

    const body = {
      data: [
        {
          event_name: "PageView",
          event_source_url,
          event_time: Math.floor(Date.now() / 1000),
          event_id: event_id,
          action_source: "website",
          user_data: {
            client_ip_address:
              request.headers.get("x-forwarded-for") ??
              request.headers.get("x-real-ip") ??
              "0.0.0.0",
            client_user_agent: request.headers.get("user-agent"),
            fbp: fbpCookie,
          },
        },
      ],
    };

    const res = await fetch(FB_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const resJson = await res.json();
    return NextResponse.json(
      {
        res: resJson,
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
