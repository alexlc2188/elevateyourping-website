"use client";

import {
  updateTrainingPackLevel,
  updateTrainingPackType,
} from "@/actions/admin/trainingPacksActions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trainingPackTypeSchema } from "@/lib/validators/trainingPackSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrainingPackType } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  header: string;
  initialData: {
    trainingPackType: TrainingPackType | null;
    packId: string;
  };
}

export const TrainingPackTypeForm = ({ header, initialData }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof trainingPackTypeSchema>>({
    resolver: zodResolver(trainingPackTypeSchema),
    defaultValues: {
      type: initialData.trainingPackType ?? undefined,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof trainingPackTypeSchema>) => {
    const { success } = await updateTrainingPackType({
      packId: initialData.packId,
      form: values,
    });

    if (!success) {
      toast.error("Something went wrong");
      return;
    }

    toast.success("Level saved!");
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
        <p className="text-sm mt-2 capitalize">
          {initialData.trainingPackType?.toLowerCase() || "Not set"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      disabled={isSubmitting}
                      value={field.value}
                      onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TrainingPackType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() +
                              type.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
