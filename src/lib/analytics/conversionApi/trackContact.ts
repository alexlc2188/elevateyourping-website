import { NextRequest } from "next/server";
import { hashString } from "./hashString";
import getCurrentTimeForFb from "./getCurrentTimeForFb";

// TODO: change variables from crossy to citizen

interface QueryProps {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  request: NextRequest;
}

const FB_ENDPOINT = `https://graph.facebook.com/v17.0/1440743369802292/events?access_token=${process.env.META_ACCESS_TOKEN}`;

export const trackContact = async ({
  email,
  phone,
  firstName,
  lastName,
  request,
}: QueryProps) => {
  const fbpCookie = request.cookies.get("_fbp")?.value;

  const hashedPhone = hashString(phone);
  const hashedEmail = hashString(email);
  const hashedFirstName = hashString(firstName);
  const hashedLastName = hashString(lastName);

  const body = {
    data: [
      {
        event_name: "Contact",
        event_source_url: "/contact",
        event_time: getCurrentTimeForFb(),
        event_id: getCurrentTimeForFb(),
        action_source: "website",
        user_data: {
          em: [hashedEmail],
          ph: [hashedPhone],
          client_ip_address:
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            request.headers.get("x-real-ip") ??
            "0.0.0.0",
          client_user_agent: request.headers.get("user-agent"),
          fn: hashedFirstName,
          ln: hashedLastName,
          fbp: fbpCookie,
        },
      },
    ],
    test_event_code:
      process.env.NEXT_PUBLIC_VERCEL_ENV === "development"
        ? "TEST79268"
        : undefined,
  };

  const res = await fetch(FB_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw res;
  return;
};
