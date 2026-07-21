"use client";
import { useCallback, useEffect, useState } from "react";
import { FcMenu } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarApp } from "./navigation/sidebar-app";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


export const MobileSideBarApp = () => {
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
      <SheetContent
        side="left"
        className="p-0 [&>button]:text-red-500 [&>button:hover]:text-red-600 [&>button]:bg-transparent [&>button]:shadow-none [&>button]:ring-0 [&>button]:p-1 [&>button]:hidden">
        {/* Hidden title for a11y compliance */}

        <SheetTitle asChild>
          <VisuallyHidden>Mobile Sidebar Navigation</VisuallyHidden>
        </SheetTitle>
        <SidebarApp shouldCloseMenu={handleShouldCloseMenu} />
      </SheetContent>
    </Sheet>
  );
};
