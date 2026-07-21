"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandItem } from "@/components/ui/command";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";

type Props = {
  userTrainingPacks: {
    trainingPack: {
      id: string;
      title: string;
    };
  }[];
  userTrainingPlans: {
    trainingPlan: {
      id: string;
      title: string;
      match: {
        isPublished: boolean;
      };
    };
  }[];
};

export const HeaderSelector = ({ userTrainingPacks, userTrainingPlans }: Props) => {
  const [trainingPackId, setTrainingPackId] = useQueryState("trainingPackId", {
    shallow: false,
  });
  const [trainingPlanId, setTrainingPlanId] = useQueryState("trainingPlanId", {
    shallow: false,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentPlan = userTrainingPlans.find((p) => p.trainingPlan.id === trainingPlanId);
  const currentPack = userTrainingPacks.find((p) => p.trainingPack.id === trainingPackId);

  return (
    <div className="flex justify-between items-center p-4 gap-4 flex-wrap">
      <h1 className="text-3xl font-bold">Training</h1>
      <Popover>
        <PopoverTrigger asChild>
          <Button ref={triggerRef} variant="outline">
            {currentPlan?.trainingPlan.title ||
              currentPack?.trainingPack.title ||
              "Select Training"}
            <Plus />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0 ">
          <Command>
            {userTrainingPlans.map(({ trainingPlan }) => {
              if (!trainingPlan.match?.isPublished) return null;
              return (
                <CommandItem
                  key={`plan-${trainingPlan.id}`}
                  value={trainingPlan.title}
                  className="cursor-pointer"
                  onSelect={() => {
                    setTrainingPlanId(trainingPlan.id);
                    triggerRef.current?.click();
                  }}>
                  {trainingPlan.title}
                </CommandItem>
              );
            })}

            {userTrainingPacks.length > 0 && <hr className="my-2" />}

            {userTrainingPacks.map(({ trainingPack }) => (
              <CommandItem
                key={`pack-${trainingPack.id}`}
                value={trainingPack.title}
                className="cursor-pointer"
                onSelect={() => {
                  setTrainingPackId(trainingPack.id);
                  triggerRef.current?.click();
                }}>
                {trainingPack.title}
              </CommandItem>
            ))}

            <CommandItem className="mt-1">
              <Link href="/app/training/library" className="w-full">
                <Button variant="secondary" className="w-full justify-start">
                  + Add from Library
                </Button>
              </Link>
            </CommandItem>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
