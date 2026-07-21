// components/TrackPurchaseComplete.tsx
"use client";

import { useEffect } from "react";
import sendGtmDataLayer from "@/lib/analytics/sendGtmDataLayer";

export function TrackPurchaseComplete({
  matchId,
  value,
  productName,
  itemId,
}: {
  matchId: string;
  value: number;
  productName: string;
  itemId: string;
}) {
  useEffect(() => {
    sendGtmDataLayer({
      event: "purchase",
      currency: "AUD",
      value: value / 100,
      transaction_id: matchId,
      items: [
        {
          item_id: itemId,
          item_name: productName,
          price: value / 100,
          quantity: 1,
        },
      ],
    });
  }, []);

  return null;
}
