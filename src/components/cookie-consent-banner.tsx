"use client";

import React from "react";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import { saveConsent } from "@/lib/local-storage";
import { loadGTM } from "@/lib/analytics/loadGtm";
import { GTM_ID } from "@/constants/base";
import sendGtmDataLayer from "@/lib/analytics/sendGtmDataLayer";

export const CookieConsentBanner = () => {
  const handleAccept = () => {
    saveConsent(true);
    sendGtmDataLayer({ event: "consent_granted" });
    loadGTM(GTM_ID);
    // Optional: load GTM or analytics here
    // loadGTM();
  };

  return (
    <CookieConsent
      location="bottom"
      cookieName="consentCookie"
      buttonText="Accept"
      onAccept={handleAccept}
      containerClasses="fixed bottom-0 w-full z-50 bg-slate-800 text-white px-4 py-3 shadow-md"
      buttonClasses="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition"
      contentClasses="text-sm text-center "
      buttonWrapperClasses="flex justify-center   w-full"
      expires={180}>
      <p className="m-0">
        We use cookies to enhance your experience.{" "}
        <Link href="/cookies">
          <span className="underline font-semibold text-white hover:text-yellow-300 cursor-pointer ml-1">
            Learn more
          </span>
        </Link>
      </p>
    </CookieConsent>
  );
};
