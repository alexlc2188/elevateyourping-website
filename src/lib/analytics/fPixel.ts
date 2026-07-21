
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID;

export const pageview = (eventId: string) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView", { event_id: eventId });
  }
};

export const event = (name: string, options = {}) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", name, options);
  }
};
