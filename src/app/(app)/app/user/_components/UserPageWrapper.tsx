import { cn } from "@/lib/utils";
import React from "react";

export const UserPageWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "max-w-7xl mx-auto px-3 lg:px-6 py-6 lg:py-12 space-y-6  lg:space-y-10",
        className && className,
      )}>
      {children}
    </div>
  );
};
