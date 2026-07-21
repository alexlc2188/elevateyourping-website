// import { checkSubscription } from '@/lib/subscription'
// import UserButton from './auth/user-button'
// import { UpgradeButton } from './buttons/upgrade-button'
"use client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MobileSideBarSite } from "../mobile-sidebar-site";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// import { ModeToggle } from './mode-toggle'
// import { currentUser } from '@/lib/auth'

const routes = [
  { label: "Elevate Training Tool", href: "/elevate-training-tool" },
  { label: "Drill Library", href: "/drill-library" },
  {
    label: "Pro Match Review",
    href: "/pro-match-review",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Meet the Coach",
    href: "/meet-the-coach",
  },
];

export const NavbarSite = () => {
  const pathname = usePathname();
  // const user = await currentUser()
  // const isPro = await checkSubscription(user?.id)

  return (
    <div className="flex items-center justify-between border-b border-border bg-background p-4 shadow-sm w-full">
      {/* Left: Logo */}
      <div className="flex items-center gap-x-3 shrink-0">
        <Logo />
      </div>

      {/* Right: Burger + Login */}
      <div className="flex items-center gap-x-6 shrink-0">
        {/* Center: Nav links (only on desktop) */}
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

        <Link href="/auth/login">
          <Button
            size="lg"
            className="uppercase tracking-wider text-sm px-3 py-1 whitespace-nowrap">
            Get Started
          </Button>
        </Link>
        <MobileSideBarSite />
      </div>
    </div>
  );
};
