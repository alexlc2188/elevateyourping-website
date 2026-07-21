"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TrainingType } from "@prisma/client";

const trainingTypeOptions: TrainingType[] = [
  "technique",
  "rally",
  "serve",
  "return",
  "footwork",
] as const;

type Props = {
  control: any;
  label?: string;
};

export function SelectTrainingType({
  control,
  label = "Training Type",
}: Props) {
  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select exercise type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {trainingTypeOptions.map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
