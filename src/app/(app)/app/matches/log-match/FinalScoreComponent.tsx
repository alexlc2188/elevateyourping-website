"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Controller,
  Control,
  UseFormSetValue,
  FieldErrors,
  useWatch,
} from "react-hook-form";
import { useEffect } from "react";
import { FormValues } from "./AddMatchPage";

interface FinalScoreSelectorProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export const FinalScoreSelector = ({
  control,
  errors,
  setValue,
}: FinalScoreSelectorProps) => {
  const playerSets = useWatch({ control, name: "playerSets" });
  const opponentSets = useWatch({ control, name: "opponentSets" });

  // Auto-update finalScore when both fields are filled
  useEffect(() => {
    if (playerSets !== undefined && opponentSets !== undefined) {
      setValue("finalScore", `${playerSets}–${opponentSets}`);
    }
  }, [playerSets, opponentSets, setValue]);

  const showError =
    errors.playerSets || errors.opponentSets || errors.finalScore;

  return (
    <div>
      <Label className="font-medium flex items-center">
        Final Score
        <span className="ml-1 text-xs text-slate-500">(optional)</span>
      </Label>
      <div className="flex items-center gap-2 mt-1">
        {/* Player Sets */}
        <Controller
          name="playerSets"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger className="w-auto px-2 text-center">
                {field.value !== undefined && field.value !== ""
                  ? field.value
                  : "You"}
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <span className="text-muted-foreground font-semibold">–</span>

        {/* Opponent Sets */}
        <Controller
          name="opponentSets"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger className="w-auto px-2 text-center">
                {field.value !== undefined && field.value !== ""
                  ? field.value
                  : "Them"}
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {showError && (
        <p className="text-red-500 text-sm mt-1">
          {errors.playerSets?.message ||
            errors.opponentSets?.message ||
            errors.finalScore?.message ||
            "Please select both scores"}
        </p>
      )}
    </div>
  );
};
