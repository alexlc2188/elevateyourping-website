"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tab } from "../[matchId]/_components/MatchTabsLayout";

interface Props {
  tab: Tab;
  setTab: (tab: Tab) => void;
}

export function TrainingSwitchBanner({ tab, setTab }: Props) {
  const pathname = usePathname();
  return (
    <motion.div
      className="text-center lg:hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}>
      <p className="text-sm uppercase text-muted-foreground tracking-wide mb-2">
        Next Step
      </p>
      <div className="p-4 bg-secondary/10 rounded-xl shadow-sm max-w-lg mx-auto">
        <p className="text-lg font-semibold mb-3">
          Want to train what you just reviewed?
        </p>
        <Link href={`${pathname}?tab=training`}>
          <Button
            className="rounded-full px-6"
            onClick={() =>
              setTab(tab === "insights" ? "training" : "insights")
            }>
            Go to Training Section →
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
