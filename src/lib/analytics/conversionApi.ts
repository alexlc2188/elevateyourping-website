// Page view
export async function conversionApiPageView(url: string, eventId: string) {
  const data = {
    event_source_url: url,
    event_id: eventId,
  };
  const res = await fetch("/api/conversion-api/pageview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to send meta analytics for Pageview");
  return await res.json();
}
