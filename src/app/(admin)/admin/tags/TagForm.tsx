"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTagAction } from "@/actions/admin/tagActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const schema = z.object({
  label: z.string().min(2, "Must be at least 2 characters"),
});

type FormValues = z.infer<typeof schema>;

export function TagForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await createTagAction(data.label);
      toast.success("Tag created");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to create tag");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 items-end">
      <div className="flex flex-col gap-1">
        <Input
          {...register("label")}
          placeholder="New tag"
          disabled={loading}
          className={errors.label ? "border-red-500" : ""}
        />
        {errors.label && (
          <span className="text-xs text-red-500">{errors.label.message}</span>
        )}
      </div>

      <Button type="submit"> {loading ? "Adding..." : "Add"}</Button>
    </form>
  );
}
