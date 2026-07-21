"use client";

import { MdShoppingCart, MdLogin, MdMenuBook, MdEmail } from "react-icons/md";
import {
  FaTableTennis,
  FaHome,
  FaWalking,
  FaUser,
  FaCog,
} from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// import { routeName } from '@/routes'
import { useMediaQuery } from "usehooks-ts";
import { Logo } from "../logo";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LogOut, Users } from "lucide-react";
import { LogoutButton } from "../auth/logout-button";

type Route = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  adminOnly?: boolean;
};

export const routes: Route[] = [
  {
    label: "Home",
    icon: FaHome,
    href: "/app",
  },
  {
    label: "My Matches",
    icon: FaTableTennis,
    href: "/app/matches",
  },
  {
    label: "My Training",
    icon: FaWalking,
    href: "/app/training",
  },
  {
    label: "Drill Library",
    icon: MdMenuBook,
    href: "/app/training/library",
  },
  // {
  //   label: "Meet the Coach",
  //   icon: Users,
  //   href: "/meet-the-coach",
  // },
  {
    label: "Contact Us",
    icon: MdEmail,
    href: "/app/contact-us",
  },
  {
    label: "Settings",
    icon: FaUser,
    href: "/app/user/profile",
  },
  {
    label: "Admin",
    icon: FaCog,
    href: "/admin",
    adminOnly: true,
  },
  {
    href: "/pricing",
    label: "Pricing",
    icon: MdShoppingCart,
  },
  {
    href: "/auth/login",
    label: "Log in",
    icon: MdLogin,
  },
];

interface SidebarProps {
  shouldCloseMenu?: () => void;
}

export const SidebarApp = ({ shouldCloseMenu }: SidebarProps) => {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const router = useRouter();
  const user = useCurrentUser();

  function handleClick(href: string) {
    router.push(href);
    if (isMobile) {
      shouldCloseMenu?.();
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-100 shadow-sm">
      <div className="h-[80px] py-4">
        <Logo />
      </div>
      <div className="space-y-1 px-3 pt-3">
        {routes.map((route) => {
          if (
            (route.label === "Pricing" && (pathname !== "/" || !isMobile)) ||
            (route.label === "Log in" && (pathname !== "/" || !isMobile))
          ) {
            return;
          }

          // Hide admin menu for non-admin users
          if (route.adminOnly) {
            const canAccessAdmin =
              user?.role === "ADMIN" || user?.role === "OWNER";
            if (!canAccessAdmin) {
              return null;
            }
          }

          return (
            <div
              onClick={() => handleClick(route.href)}
              key={route.href}
              className={cn(
                "group flex w-full cursor-pointer justify-start rounded-lg p-3 font-medium  transition hover:bg-primary-foreground/10 focus:outline-none focus:ring-1 focus:ring-ring active:border-white ",
                pathname === route.href &&
                  "border border-primary bg-primary/20 ",
                route.label === "Log in" && "bg-white text-primary ",
              )}>
              <div className="flex items-center gap-x-2">
                <route.icon className="mr-3 h-8 w-8 " />
                {route.label}
              </div>
            </div>
          );
        })}
      </div>
      {user && (
        <div className="space-y-1 px-3 ">
          <div
            onClick={() => {}}
            className={cn(
              "group flex text-primary w-full cursor-pointer justify-start rounded-lg p-3 font-medium  transition hover:bg-primary-foreground/10 focus:outline-none focus:ring-1 focus:ring-ring active:border-white  ",
            )}>
            <LogoutButton>
              <div className="flex items-center gap-x-2">
                <LogOut className="mr-3 h-8 w-8 " />
                {/* <route.icon className="mr-3 h-8 w-8 " /> */}
                SIGN OUT
              </div>
            </LogoutButton>
          </div>
        </div>
      )}
    </div>
  );
};
