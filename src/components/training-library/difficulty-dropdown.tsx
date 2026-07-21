"use client";
import React from "react";
import { SkillLevel } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DifficultyWithAll = SkillLevel | "All";

interface Props {
  selectedDifficulty: DifficultyWithAll;
  setSelectedDifficulty: (level: DifficultyWithAll) => void;
}

export const DifficultyDropdown = ({
  selectedDifficulty,
  setSelectedDifficulty,
}: Props) => {
  return (
    <div className="max-w-[180px]">
      <Select
        value={selectedDifficulty}
        onValueChange={(val) =>
          setSelectedDifficulty(val as DifficultyWithAll)
        }>
        <SelectTrigger className="h-9 w-full px-4 text-sm lg:text-base border border-slate-300 rounded-md bg-white text-slate-800 focus:ring-2 focus:ring-black focus:border-black">
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          {["All", "BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
            <SelectItem key={level} value={level}>
              {level.charAt(0) + level.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
