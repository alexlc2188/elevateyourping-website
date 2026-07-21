"use client";

import * as z from "zod";
// import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { titlePackFormSchema } from "@/lib/validators/trainingPackSchema";
import { toast } from "sonner";
import { createNewPackAction } from "@/actions/admin/trainingPacksActions";

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof titlePackFormSchema>>({
    resolver: zodResolver(titlePackFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof titlePackFormSchema>) => {
    try {
      const { success, data } = await createNewPackAction(values);

      if (!success) {
        toast.error("Something went wrong");
        return;
      }
      toast.success("Course created");
      router.push(`/admin/training-packs`);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name the new pack</h1>
        <p className="text-sm text-slate-600">
          What would you like to name this training pack? Don&apos;t worry, you
          can change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Pack Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Forehand Mastery'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this training pack?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
