"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function TabSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("tab") ?? "insights";

  const switchTo = (tab: "insights" | "training") => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex bg-slate-100 rounded-full p-1 mb-6 w-11/12 mx-auto md:w-6/12 lg:hidden">
      <button
        className={`flex-1 py-2 text-sm font-semibold rounded-full transition md:text-lg ${
          current === "insights"
            ? "bg-white shadow text-black"
            : "text-slate-500"
        }`}
        onClick={() => switchTo("insights")}
        >
        INSIGHTS
      </button>
      <button
        className={`flex-1 py-2 text-sm font-semibold rounded-full transition md:text-lg ${
          current === "training"
            ? "bg-white shadow text-black"
            : "text-slate-500"
        }`}
        onClick={() => switchTo("training")}>
        TRAINING
      </button>
    </div>
  );
}
