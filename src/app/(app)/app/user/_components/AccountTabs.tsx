"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Optional utility to handle class merging

const tabs = [
  { label: "My account", href: "/app/user/profile" },
  { label: "My  match reviews", href: "/app/user/match-reviews" },
  // { label: "My subscriptions", href: "/app/user/subscriptions" },
  { label: "Invoices", href: "/app/user/orders" },
  // { label: "Favorites", href: "/favorites" },
];

export function AccountTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8 md:justify-start">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium",
            pathname === tab.href
              ? "bg-secondary text-white"
              : "hover:bg-secondary/80 text-black/90 outline outline-secondary",
          )}>
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
