import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
  bgColor?: string;
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = React.memo(
  ({ bgColor, textColor }) => {
    return (
      <div className="px-3">
        <Link
          className="focus:ring-offset-3 flex h-full w-full items-center rounded-xl focus:outline-none focus:ring-1 focus:ring-white "
          href={"/"}>
          <div className={cn("relative ", bgColor)}>
            <Image
              alt="Logo"
              src="/logos/full-logo.png"
              width={96}
              height={96}
            />
          </div>
          {/* <h1 className={cn("text-md font-black", textColor)}>
            Elevate Your Ping
          </h1> */}
        </Link>
      </div>
    );
  },
);

Logo.displayName = "Logo";
