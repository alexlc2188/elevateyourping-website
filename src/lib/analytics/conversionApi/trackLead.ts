import getCurrentTimeForFb from "./getCurrentTimeForFb";
import { NextRequest } from "next/server";
import { hashString } from "./hashString";

// TODO: change variables from crossy to citizen

interface QueryProps {
  email: string;
  event_source_url: string;
  request: NextRequest;
}

const FB_ENDPOINT = `https://graph.facebook.com/v17.0/1440743369802292/events?access_token=${process.env.META_ACCESS_TOKEN}`;

export const trackLead = async ({
  email,
  event_source_url,
  request,
}: QueryProps) => {
  const fbpCookie = request.cookies.get("_fbp")?.value;

  const hashedEmail = hashString(email);

  const body = {
    data: [
      {
        event_name: "Lead",
        event_source_url,
        event_time: getCurrentTimeForFb(),
        event_id: getCurrentTimeForFb(),
        action_source: "website",
        user_data: {
          em: [hashedEmail],
          client_ip_address:
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
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

  if (!res.ok) throw res;
  return await res.json();
};
