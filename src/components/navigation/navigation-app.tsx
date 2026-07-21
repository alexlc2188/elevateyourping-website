"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const routes = [
  { label: "Elevate Training Tool", href: "/app/training" },
  { label: "Drill Library", href: "/app/training/library" },
  {
    label: "Pro Match Review",
    href: "/app/matches/log-match?intent=pro-review",
  },
//   {
//     label: "Blog",
//     href: "/app/blog",
//   },
//   {
//     label: "Meet the Coach",
//     href: "/meet-the-coach",
//   },
];

export const NavigationApp = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-1 items-center justify-center gap-x-6 text-sm mr-3">
      {routes.map((route) => {
        const isCurrent = pathname === route.href;

        return (
          <Link
            key={route.label}
            href={route.href}
            className={cn(
              "tracking-wider whitespace-nowrap transition-colors",
              "hover:text-red-600",
              isCurrent && "text-red-600",
            )}
            aria-current={isCurrent ? "page" : undefined}>
            {route.label}
          </Link>
        );
      })}
    </div>
  );
};
