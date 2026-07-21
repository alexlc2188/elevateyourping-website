"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

export const MatchLogHeaderCard = () => {
  return (
    <Card className="bg-blue-600 text-white rounded-xl p-6 flex flex-col gap-4 shadow-md">
      <div className="flex items-start gap-4">
        <div className="bg-white/20 p-3 rounded-xl">
          <ClipboardList className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold">
            Your Past Results
          </h2>
          <p className="text-sm opacity-90 mt-1 leading-snug">
            Track past matches with scores, opponents, and notes. Upgrade to
            unlock match analysis and training suggestions.
          </p>
        </div>
      </div>
    </Card>
  );
};
