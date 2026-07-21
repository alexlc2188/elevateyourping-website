"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Training Plan Error:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto text-center mt-20 space-y-4">
      <h2 className="text-2xl font-bold text-destructive">
        Something went wrong
      </h2>
      <p className="text-muted-foreground">
        Please try again or report the issue if it persists.
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
          Try Again
        </button>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded text-muted-foreground hover:text-foreground transition">
          Go Back
        </button>
      </div>
    </div>
  );
}
