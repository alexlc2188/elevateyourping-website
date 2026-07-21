"use client";

import * as HoverCard from "@radix-ui/react-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CoachHoverCard() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Avatar className="cursor-pointer ring-2 ring-primary w-16 h-16 rounded-lg overflow-hidden">
          <AvatarImage
            src="/images/coach-ali.jpg"
            alt="Coach Alex"
            className="w-full h-full object-cover object-top"
          />
          <AvatarFallback>CA</AvatarFallback>
        </Avatar>
      </HoverCard.Trigger>
      <HoverCard.Content
        sideOffset={10}
        className="rounded-lg border bg-white p-4 shadow-md w-64">
        <div className="flex items-center gap-3">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/images/coach-ali.jpg" alt="Coach Alex" />
            <AvatarFallback>CA</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-slate-900">Coach Alex</p>
            <p className="text-xs text-muted-foreground">Head Coach — TTC</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Focused on technical precision and smart footwork. Coached 200+
          players to national level.
        </p>
        <p className="mt-2 text-xs text-blue-600 font-medium hover:underline cursor-pointer">
          View all coach tips →
        </p>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
