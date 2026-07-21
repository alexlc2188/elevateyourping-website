"use client";

import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
  product: {
    name: string;
    amountInCents: number;
    matchId: string;
    matchOffer?: string;
  };
  disabled?: boolean;
  onValidationError?: (errors: { videos?: string; aboutMe?: string }) => void;
  hasVideos: boolean;
  aboutMe: string;
}

export function CheckoutButton({
  product: { amountInCents, name, matchId, matchOffer },
  disabled = false,
  onValidationError,
  hasVideos,
  aboutMe,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    // Validate required fields
    const errors: { videos?: string; aboutMe?: string } = {};

    if (!hasVideos) {
      errors.videos = "Please upload at least one video";
    }

    if (!aboutMe.trim()) {
      errors.aboutMe =
        "Please provide a description to help coaches recognize you";
    }

    // If there are validation errors, show them and don't proceed
    if (Object.keys(errors).length > 0) {
      onValidationError?.(errors);
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("/api/stripe/review-checkout", {
        method: "POST",
        body: JSON.stringify({
          productName: name,
          amount: amountInCents,
          matchId,
          matchOffer,
        }),
      });

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
      // You could add a toast error here if needed
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      onClick={handleCheckout}
      disabled={isDisabled}
      className="w-full  sm:mx-auto    bg-green-600 hover:bg-green-700 text-white px-6 py-3 sm:py-4 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Lock className=" w-4 h-4" />
          Complete Order
        </div>
      )}
    </button>
  );
}
