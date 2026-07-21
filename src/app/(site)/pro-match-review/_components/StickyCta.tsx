"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function StickyMatchReviewCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      const bottomBuffer = 850; // adjust if your footer/CTA is taller

      const isPastTop = scrollY > 300;
      const isNearBottom =
        scrollY + windowHeight >= documentHeight - bottomBuffer;

      setVisible(isPastTop && !isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-0 right-0 z-50 px-4 md:px-8 transition-all duration-300 ease-in-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}>
      <div className="max-w-md mx-auto">
        <Link
          href="/auth/login"
          className="block w-full bg-red-600 text-white text-center text-base font-medium py-3 rounded-lg shadow-md hover:bg-red-700 transition">
          Start Your Match Review
        </Link>
      </div>
    </div>
  );
}
