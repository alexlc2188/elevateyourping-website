"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

export const LoginButton = () => {
  return (
    <Button
      onClick={() => signIn("google")}
      className="text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-red-600">
      <img src="/logos/web_light_sq_SI.svg" alt="Google" className="w-5 h-5" />
      Continue with Google
    </Button>
  );
};
