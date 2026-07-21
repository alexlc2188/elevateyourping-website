"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
// import { LogoutButton } from '@/components/auth/logout-button'
import { ExitIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
// import { LoginButton } from './login-button'
import Link from "next/link";
import { MdSettings } from "react-icons/md";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Separator } from "../ui/separator";
import { LogoutButton } from "./logout-button";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

const UserButton = () => {
  const user = useCurrentUser();

  const [isMounted, setIsMounted] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // if (!user)
  //     return (
  //         <LoginButton mode="modal" asChild>
  //             <Button variant={'primary'} size={'lg'}>
  //                 Sign in
  //             </Button>
  //         </LoginButton>
  //     )

  if (!user || !isDesktop) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar>
          <AvatarImage
            src={user?.image ?? undefined}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="bg-primary">
            <FaUser className="text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 space-y-2" align="end">
        <Link href={"/app/user/profile"}>
          <DropdownMenuItem className="py-2">
            <MdSettings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <Separator />
        </Link>
        <LogoutButton>
          <DropdownMenuItem className="py-2 text-primary ">
            <ExitIcon className="mr-2 h-4 w-4 text-primary" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
