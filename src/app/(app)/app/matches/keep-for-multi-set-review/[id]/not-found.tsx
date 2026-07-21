// app/not-found.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col items-center justify-center text-center  bg-yellow-200 space-y-6 p-6">
      <h1 className="text-4xl font-bold text-destructive">
        404 – Page Not Found
      </h1>
      <p className="text-muted-foreground max-w-md">
        Oops! The page you're looking for doesn't exist or the user ID is
        invalid.
      </p>
      <Button onClick={() => router.push("/")} className="mt-4">
        Go to Home
      </Button>
    </div>
  );
}
