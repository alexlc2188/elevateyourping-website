"use client";

import {  MdSports, MdMenuBook } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { useMediaQuery } from "usehooks-ts";
import { Logo } from "../logo";
import { TimerReset, Users } from "lucide-react";

export const routes = [
  {
    label: "Elevate Training Tool",
    href: "/elevate-training-tool",
    icon: TimerReset,
  },
  {
    label: "Drill Library",
    icon: MdMenuBook,
    href: "/drill-library",
  },
  {
    label: "Pro Match Review",
    icon: MdSports,
    href: "/pro-match-review",
  },
  {
    label: "Meet the Coach",
    icon: Users,
    href: "/meet-the-coach",
  },
  // {
  //   label: "Community",
  //   icon: FaUsers,
  //   href: "/community",
  // },
  // {
  //   label: "Pricing",
  //   icon: FaTags,
  //   href: "/pricing",
  // },
];

interface SidebarProps {
  shouldCloseMenu?: () => void;
}

export const SidebarSite = ({ shouldCloseMenu }: SidebarProps) => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const router = useRouter();

  function handleClick(href: string) {
    router.push(href);
    if (isMobile) {
      shouldCloseMenu?.();
    }
  }

  return (
    <div
      className="flex h-full flex-col overflow-y-auto bg-slate-100
 shadow-sm">
      <div className="h-[80px] py-4">
        <Logo />
      </div>
      <p className="text-sm uppercase  px-6 mt-6 mb-2">Navigation</p>
      <nav className="space-y-1 px-3 pt-3">
        {routes.map((route) => {
          return (
            <div
              onClick={() => handleClick(route.href)}
              key={route.href}
              className={cn(
                "group flex w-full cursor-pointer justify-start rounded-lg p-3 font-medium transition hover:bg-primary-foreground/10 focus:outline-none focus:ring-1 focus:ring-ring active:border-white",
                pathname === route.href &&
                  "border border-primary bg-primary/20",
              )}>
              <div className="flex items-center gap-x-2">
                <route.icon className="mr-3 h-8 w-8 " />
                {route.label}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};
