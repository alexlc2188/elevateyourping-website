"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl">Something went wrong!</h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Try Again
      </button>
    </div>
  );
}
