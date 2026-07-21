"use client";

import { updateTrainingPackImage } from "@/actions/admin/trainingPacksActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";
import { imageSchema } from "@/lib/validators/trainingPackSchema";

interface Props {
  header: string;
  initialData: {
    imageUrl: string | null;
    packId: string;
  };
}

export const TrainingPackImageForm = ({ header, initialData }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData.imageUrl || null,
  );
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: { image: undefined },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof imageSchema>) => {
    const file = values.image[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("packId", initialData.packId);

    try {
      const res = await updateTrainingPackImage(formData);

      if (!res.success) {
        throw new Error(res.error || "Upload failed");
      }

      toast.success("Thumbnail updated!");
      toggleEdit();
      setPreviewUrl(res.data); // image URL returned from the action
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
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
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing && previewUrl && (
        <div className="mt-4">
          <Image
            src={previewUrl}
            alt="Training Pack Thumbnail"
            width={400}
            height={200}
            className="rounded-md border object-cover"
          />
        </div>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Input
            type="file"
            accept="image/*"
            disabled={isSubmitting}
            {...form.register("image")}
          />
          {form.watch("image")?.[0] && (
            <div className="w-full aspect-[3/2] relative">
              <Image
                src={URL.createObjectURL(form.watch("image")[0])}
                alt="Preview"
                fill
                className=" rounded border object-cover"
              />
            </div>
          )}
          <Button disabled={isSubmitting} type="submit">
            <UploadCloud className="h-4 w-4 mr-2" /> Upload
          </Button>
        </form>
      )}
    </div>
  );
};
