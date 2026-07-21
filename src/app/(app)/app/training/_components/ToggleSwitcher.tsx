"use client";
import { Toggle } from "@/components/ui/toggle";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Logo } from "@/components/icons/logo";
import { Library } from "lucide-react";

export const ToggleSwitcher = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("tab") ?? "training";

  const switchTo = (tab: "library" | "training") => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mx-auto pb-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {current === "library" ? "Library" : "Training"}
        </h1>
        <div className="flex gap-2">
          <Toggle
            pressed={current === "library"}
            onPressedChange={() => switchTo("library")}
            className="h-10 w-10 p-2"
            aria-label="Toggle insights view">
            <Library className="size-6" />
          </Toggle>
          <Toggle
            pressed={current === "training"}
            onPressedChange={() => switchTo("training")}
            className="h-10 w-10 p-2"
            aria-label="Toggle training view">
            <Logo className="size-6" />
          </Toggle>
        </div>
      </div>
    </div>
  );
};
