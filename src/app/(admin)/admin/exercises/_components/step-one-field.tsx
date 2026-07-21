"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/tooltip-wrapper";

import { SelectTrainingType } from "@/components/exercise/select-training-type";
import { LabelWithOptional } from "@/components/label-with-optional";

type Props = {
  form: any;
  onNext?: () => void;
  isStepOneValid: boolean;
  submitButtonLabel: string
};

export const StepOneFields = ({ form, onNext, isStepOneValid, submitButtonLabel }: Props) => {
  return (
    <>
      <SelectTrainingType label="Type" control={form.control} />
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <LabelWithOptional>
              <FormLabel>Exercise Title</FormLabel>
            </LabelWithOptional>
            <FormControl>
              <Input placeholder="e.g., Forehand Loop" {...field} />
            </FormControl>
            <FormMessage className="text-sm text-red-500" />
            {/* ← show validation error */}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <LabelWithOptional>
              <FormLabel>Duration (sec)</FormLabel>
            </LabelWithOptional>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? null : Number(value));
                }}
              />
            </FormControl>
            <FormMessage className="text-sm text-red-500" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="practiceInstruction"
        render={({ field }) => (
          <FormItem>
            <LabelWithOptional>
              <FormLabel>Practice Instructions</FormLabel>
            </LabelWithOptional>
            <FormControl>
              <Textarea
                placeholder="Explain how to do the exercise..."
                {...field}
              />
            </FormControl>
            <FormMessage className="text-sm text-red-500" />
          </FormItem>
        )}
      />

      {submitButtonLabel && (
        <div className="flex justify-end">
          <TooltipWrapper
            message="Please complete all required fields"
            disabled={isStepOneValid}>
            <Button
              type="submit"
              onClick={() => onNext?.()}
              disabled={!isStepOneValid}>
              {submitButtonLabel}
            </Button>
          </TooltipWrapper>
        </div>
      )}
    </>
  );
};
