"use client";

import { updateTrainingPackDescription } from "@/actions/admin/trainingPacksActions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { descriptionSchema } from "@/lib/validators/trainingPackSchema";
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
    description: string | null;
    packId: string;
  };
}

export const TrainingPackDescriptionForm = ({ header, initialData }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof descriptionSchema>>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      description: initialData.description ?? "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof descriptionSchema>) => {
    const { success } = await updateTrainingPackDescription({
      packId: initialData.packId,
      form: values,
    });

    if (!success) {
      toast.error("Something went wrong");
      return;
    }

    toast.success("Description saved!");
    toggleEdit();
    router.refresh();
    form.reset(values);
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
        <p className="text-sm mt-2 whitespace-pre-wrap">
          {initialData.description || "No description provided."}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Describe what this training pack covers..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
