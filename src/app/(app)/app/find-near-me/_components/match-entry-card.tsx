"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { UsersIcon, Dumbbell, HouseIcon } from "lucide-react";

export type HeaderIconType = "players" | "clubs" | "coachs";

interface Props {
  title: string;
  description: string;
  href: string;
  icon: HeaderIconType;
}

const iconMap = {
  players: <UsersIcon className="w-8 h-8" />, // can be swapped for an imported image if needed
  clubs: <HouseIcon className="w-8 h-8" />,
  coachs: <Dumbbell className="w-8 h-8" />,
};

const bgMap = {
  players: "bg-blue-600",
  clubs: "bg-red-500",
  coachs: "bg-green-500",
};

export const MatchEntryCard = ({ title, description, href, icon }: Props) => {
  return (
    <Link href={href} className="block">
      <div
        className={cn(
          " text-white px-6 py-10 shadow-md w-full rounded-lg",
          "flex items-start gap-4",
          bgMap[icon],
        )}>
        <div className="bg-white/20 rounded-xl p-3 shrink-0">
          {iconMap[icon]}
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-1 leading-tight">{title}</h3>
          <p className=" leading-snug opacity-90 max-w-xs">{description}</p>
        </div>
      </div>
    </Link>
  );
};
