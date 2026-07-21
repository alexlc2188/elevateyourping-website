// import { checkSubscription } from '@/lib/subscription'
// import UserButton from './auth/user-button'
// import { UpgradeButton } from './buttons/upgrade-button'

import { SessionProvider } from "next-auth/react";
import UserButton from "../auth/user-button";
import { Logo } from "../logo";
import { MobileSideBarApp } from "../mobile-sidebar-app";

// import { currentUser } from "@/lib/auth";
import { NavigationApp } from "./navigation-app";

export const NavbarApp = async () => {
  // const user = await currentUser();
  // const isPro = await checkSubscription(user?.id)

  return (
    <div className="flex h-full items-center justify-between border-b border-border  p-4 shadow-sm bg-white  ">
      <div className=" flex w-full  items-center justify-between gap-x-4 ">
        <Logo />
        {/* {!isPro.isActive && <UpgradeButton />} */}
        <div className="flex items-center gap-x-6">
          <NavigationApp />
          <SessionProvider>
            <UserButton />
            <MobileSideBarApp />
          </SessionProvider>
        </div>
      </div>
    </div>
  );
};
