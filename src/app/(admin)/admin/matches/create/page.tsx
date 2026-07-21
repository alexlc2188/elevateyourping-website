"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { toast } from "sonner";
import { createMatchSchema } from "@/lib/validators/matches/matchSchema";
import { createMatch } from "@/lib/api/matches";
import { useState } from "react";
import { MultiVideoUploader } from "@/components/multi-video-uploader";
import { BackButton } from "@/components/back-button";

type FormValues = z.infer<typeof createMatchSchema>;

export default function CreateMatchPage() {
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: { opponentName: "", logNote: "" },
  });

  const handleUploadAndSubmit = async (data: FormValues) => {
    try {
      let videoIds: string[] = [];

      //   if (videoFiles.length > 0) {
      //     const formData = new FormData();
      //     videoFiles.forEach((file) => formData.append("videos", file));

      //     const res = await fetch("/api/matches/upload-videos", {
      //       method: "POST",
      //       body: formData,
      //     });

      //     const uploadData = await res.json();
      //     if (!uploadData.success) throw new Error("Upload failed");
      //     videoIds = uploadData.ids;
      //   }

      const result = await createMatch({
        ...data,
        // videosSubmittedByUser: ["wkjhdfjhfkhkjdh", "jhjhuehfohfohour"],
      });

      if (result.success) {
        toast.success("Match created");
        form.reset();
        setVideoFiles([]);
      } else {
        toast.error("Failed to create match");
      }
    } catch (err: any) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <main className="space-y-6  py-10 ">
      <BackButton />
      <h1 className="text-2xl font-bold mb-6">Create Match</h1>
      <MultiVideoUploader onUpload={(files) => console.log(files)} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUploadAndSubmit, (errors) => {
            console.log("Validation errors:", errors);
          })}
          className="space-y-6">
          <FormField
            control={form.control}
            name="opponentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opponent</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Create Match</Button>
        </form>
      </Form>
    </main>
  );
}
