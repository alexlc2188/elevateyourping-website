"use client";
import { updateTrainingPackTitle } from "@/actions/admin/trainingPacksActions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trainingPlanTitleSchema } from "@/lib/validators/trainingPlanSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  header: string;
  initialData: {
    title: string;
    packId?: string | null;
  };
}

export const TrainingPackTitleForm = ({ header, initialData }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof trainingPlanTitleSchema>>({
    resolver: zodResolver(trainingPlanTitleSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof trainingPlanTitleSchema>) => {
    const { success } = await updateTrainingPackTitle({
      trainingPackId: initialData.packId!,
      form: values,
    });

    if (!success) {
      toast.error("Something went wrong");
      return;
    }

    // success
    toast.success("Title Saved !");
    toggleEdit();
    router.refresh();
    form.reset();
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {header}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <span className="text-red-500">Cancel</span>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit section
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2 capitalize">{initialData.title}</p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Forehand Mastery Pro"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center mt-1">
                    <FormMessage />
                    <p
                      className={`text-xs ${
                        field.value.length < 10
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}>
                      {field.value.length}/10 characters minimum
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
              {!isValid && form.getValues("title").length < 10 && (
                <p className="text-xs text-red-500 ml-2">
                  Title must be at least 10 characters
                </p>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
