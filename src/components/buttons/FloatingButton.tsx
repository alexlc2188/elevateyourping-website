import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

export const FloatingButton = () => {
  return (
    <Link href="/app/matches/log-match">
      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-red-600 text-white shadow-lg ring-1 ring-black/10">
        <Plus className="size-7" />
      </Button>
    </Link>
  );
};
