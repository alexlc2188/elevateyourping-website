"use client";

import { useEffect } from "react";

import { loadGTM } from "@/lib/analytics/loadGtm";
import { GTM_ID } from "@/constants/base";
import { getConsent } from "@/lib/local-storage";

export const GTMInitializer = () => {
  useEffect(() => {
    const consent = getConsent();

    // TODO: Later change if european risks about privacy
    // if (consent?.accepted) {
    //   loadGTM(GTM_ID);
    // }
     loadGTM(GTM_ID);
  }, []);

  return null;
};
