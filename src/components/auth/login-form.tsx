"use client";
import Link from "next/link";
import React, { useState, useTransition } from "react";

import { useSearchParams } from "next/navigation";

// import { FormError } from "@/components/form-error";
// import { FormSuccess } from "@/components/form-success";

import { Loader } from "@/components/loader";
import { signIn } from "@/auth";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-red-700 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <img
          src="/logos/full-logo.png"
          alt="Elevate Your Ping Logo"
          className="mx-auto w-auto h-20 mb-4"
        />
        <h1 className="text-2xl  mb-2">Welcome to Elevate Your Ping</h1>
        <p className="text-slate-600 mb-6">
          Log in or create your account using Google to continue
        </p>
        <button
          onClick={() => signIn("google")}
          className="text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600">
          <img
            src="/logos/web_light_sq_SI.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
        <p className="text-sm text-slate-400 mt-6">
          One click — no password needed
        </p>
      </div>
    </div>
  );
};
