"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { LabelWithOptional } from "@/components/label-with-optional";
import { Textarea } from "@/components/ui/textarea";
import { TagSelector } from "./tag-selector";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag, TrainingExercise } from "@prisma/client";
import { createTagAction } from "@/actions/admin/tagActions";
import { getFocusAreasAction } from "@/actions/admin/focusAreaActions";

type FocusArea = {
  id: string;
  name: string;
};

interface Props {
  exercise: TrainingExercise;
  isStepOneValid: boolean;
  submitButtonLabel: string;
  availableTags: Tag[];
}

export default function StepTwoFields({
  exercise,
  isStepOneValid,
  submitButtonLabel,
  availableTags,
}: Props) {
  const form = useFormContext();
  const [tagOptions, setTagOptions] = useState<Tag[]>(availableTags);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [isLoadingFocusAreas, setIsLoadingFocusAreas] = useState(false);

  // Fetch focus areas from the database
  useEffect(() => {
    async function loadFocusAreas() {
      setIsLoadingFocusAreas(true);
      try {
        const result = await getFocusAreasAction();
        if (result.success && result.data) {
          setFocusAreas(result.data);
        }
      } catch (error) {
        console.error("Error loading focus areas:", error);
      } finally {
        setIsLoadingFocusAreas(false);
      }
    }
    
    loadFocusAreas();
  }, []);

  const watch = form.watch;

  return (
    <>
        <FormField
          control={form.control}
          name="coachNotes"
          render={({ field }) => (
            <FormItem>
              <LabelWithOptional optional>
                <FormLabel>Coach Notes</FormLabel>
              </LabelWithOptional>
              <FormControl>
                <Textarea
                  placeholder="Add note to find it later with more ease"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500" />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Select Tags</FormLabel>
          <FormControl>
            <TagSelector
              availableTags={tagOptions}
              selectedTags={form.watch("tags") || []}
              onChange={(ids) => form.setValue("tags", ids)}
              onCreateTag={async (name) => {
                try {
                  const res = await createTagAction(name);

              // ✅ Ensure it's the expected tag object
                  if (!res || typeof res !== "object" || !("id" in res)) {
                throw new Error("Failed to create tag");
              }

                  const newTag = { id: res.id, name };
                  setTagOptions((prev) => [...prev, newTag]);
                  form.setValue("tags", [...(form.watch("tags") || []), res.id]);
                } catch (err) {
                  console.error("Failed to create tag:", err);
                }
              }}
            />
          </FormControl>
        </FormItem>

        <FormField
          control={form.control}
          name="focusAreas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Focus Area</FormLabel>
              <Select
                onValueChange={(value) => form.setValue("focusAreas", [value])}
                defaultValue={watch("focusAreas")?.[0] || ""}
                disabled={isLoadingFocusAreas}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingFocusAreas ? "Loading focus areas..." : "Select focus area"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {focusAreas.map((focus: FocusArea) => (
                    <SelectItem key={focus.id} value={focus.id}>
                      {focus.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="intensityScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intensity (1–5)</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intensity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <SelectItem key={val} value={val.toString()}>
                        {val}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skillLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {submitButtonLabel && (
          <div className="flex justify-end">
            <TooltipWrapper
              message="Please complete all required fields"
              disabled={isStepOneValid}>
              <Button type="submit" disabled={!isStepOneValid}>
                {submitButtonLabel}
              </Button>
            </TooltipWrapper>
          </div>
        )}
    </>
  );
}
