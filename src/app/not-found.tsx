// src/app/not-found.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl mb-4">404 - Page Not Found</h1>
      <p className="mb-6 text-gray-600">
        The page you’re looking for doesn’t exist.
      </p>
      <Button size="lg" asChild>
        <Link href={"/"}>Go back home</Link>
      </Button>
    </div>
  );
}
