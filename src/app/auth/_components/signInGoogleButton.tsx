"use client";

import { Spin } from "@/components/loading/spin";
import sendGtmDataLayer from "@/lib/analytics/sendGtmDataLayer";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export const SignInGoogleButton = () => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    sendGtmDataLayer({ event: "login_button_click" });
    try {
      await signIn("google");
    } catch (error) {
      toast.error("An error occured!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id="google-login-button"
      disabled={loading}
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg bg-white border border-gray-300 shadow-md hover:shadow-lg transition-all hover:bg-gray-100 active:scale-95 disabled:opacity-60 cursor-pointer">
      {loading ? (
        <div className="flex items-center gap-2">
          <Spin />
          <span className="text-gray-700">Redirecting to Google...</span>
        </div>
      ) : (
        <>
          <FcGoogle className="w-5 h-5" />
          <span className="text-gray-800 font-medium text-xl">
            Sign in with Google
          </span>
        </>
      )}
    </button>
  );
};
