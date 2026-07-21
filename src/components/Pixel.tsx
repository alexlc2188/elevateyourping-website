"use client";

import Script from "next/script";
import * as fbq from "@/lib/analytics/fPixel";
import { useEffect } from "react";

import { conversionApiPageView } from "@/lib/analytics/conversionApi";
import { usePathname } from "next/navigation";
import { useNavigationEvent } from "@/hooks/useNavigationEvent";

function unixTimestamp(date = Date.now()) {
  return Math.floor(date / 1000);
}

const Pixel = () => {
  const pathname = usePathname();

  useEffect(() => {
    const eventId = unixTimestamp().toString();
    fbq.pageview(eventId);
    conversionApiPageView(pathname, eventId);
  }, [pathname]);

  useNavigationEvent(() => {
    const eventId = unixTimestamp().toString();
    fbq.pageview(eventId);
    conversionApiPageView(pathname, eventId);
  });

  return (
    <>
      <Script
        id="my-fbPixelScript"
        async={true}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', ${fbq.FB_PIXEL_ID});
    `,
        }}
      />
    </>
  );
};

export default Pixel;
