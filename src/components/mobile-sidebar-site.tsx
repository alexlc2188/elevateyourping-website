"use client";
import { useCallback, useEffect, useState } from "react";
import { FcMenu } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SidebarSite } from "./navigation/sidebar-site";

export const MobileSideBarSite = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function onOpenChange(boolean: boolean) {
    setOpen(boolean);
  }

  const handleShouldCloseMenu = useCallback(() => {
    setOpen(false);
  }, []);

  if (!isMounted) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger>
        <Button
          className=" size-6 md:hidden lg:hidden"
          variant={"ghost"}
          size={"icon"}
          asChild>
          <FcMenu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 [&>button]:hidden">
        {/* Hidden title for a11y compliance */}
        <SheetTitle asChild>
          <VisuallyHidden>Mobile Sidebar Navigation</VisuallyHidden>
        </SheetTitle>
        <SidebarSite shouldCloseMenu={handleShouldCloseMenu} />
      </SheetContent>
    </Sheet>
  );
};
