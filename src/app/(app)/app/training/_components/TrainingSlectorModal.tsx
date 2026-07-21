"use client";

import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  currentTitle?: string;
  pack?: {
    img: string;
    title: string;
    desc: string;
  };
}

export const TrainingSelectorModal = ({ currentTitle, pack }: Props) => {
  const noPlan = !pack;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {noPlan ? "Select Training" : currentTitle}
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto">
        <DialogHeader>
          <DialogTitle>
            {noPlan ? "No Plan Selected" : "Current Training Plan"}
          </DialogTitle>
        </DialogHeader>

        {noPlan ? (
          <div className="rounded-md border px-4 py-3 shadow-sm bg-secondary">
            <h3 className="text-base font-semibold ">
              No training plan is currently selected.
            </h3>
            <p className="text-xs">Go to the library to select one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-hidden flex items-start gap-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-3">
            {/* Image Block */}
            <div className="relative w-28 h-28 rounded-md overflow-hidden shrink-0">
              <Image
                src={pack.img || "https://picsum.photos/600/400"}
                alt={pack.title}
                fill
                className="object-cover"
              />
            </div>
            {/* Info Section */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">{pack.title}</p>
                {pack.desc && (
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {pack.desc}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <hr className="my-4" />

        <Link href="/app/training/library" className="w-full">
          <Button className="w-full justify-center">
            {noPlan ? "🔍 Go to Library" : "🔁 Change Plan in Library"}
          </Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
};
