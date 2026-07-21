"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createMatchSchema } from "@/lib/validators/matches/matchSchema";
import { createMatch } from "@/lib/api/matches";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";
import { FinalScoreSelector } from "./FinalScoreComponent";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { MainH1 } from "@/components/headers/MainH1";
import { useState } from "react";
import VideoPlayer from "@/components/video-player";
import { Loader2 } from "lucide-react";

const MATCH_REVIEW_VIDEO_URL =
  process.env.NEXT_PUBLIC_MATCH_REVIEW_VIDEO_URL ?? null;

// Define the form values type to match the schema
export type FormValues = z.infer<typeof createMatchSchema>;

export function AddMatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      opponentName: "",
      eventName: "",
      aboutMe: "",
      finalScore: "",
      setVideoIds: [],
      logNote: "",
      playerSets: "",
      opponentSets: "",
      matchDate: new Date(Date.now()),
      offerType: "REVIEW_ONLY", // Always default to REVIEW_ONLY - package selection moved to checkout
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Set custom loading state to true and keep it that way until navigation or error
      setIsLoading(true);

      const result = await createMatch({
        ...data,
      });

      if (!result.success) {
        toast.error(result.error || "Something went wrong");
        // Reset loading state on error
        setIsLoading(false);
        return;
      }

      const matchId = result.match.id;

      // Note: We don't reset the loading state here, as we want to keep the button in loading state
      // until the navigation completes. The page navigation will unmount this component.
      // Always redirect to checkout page where users can select their package
      router.push(`/app/checkout?matchId=${matchId}`);
    } catch (error) {
      console.error("❌ createMatch crashed", error);
      toast.error("An error occurred while creating the match");
      // Reset loading state on error
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 lg:max-w-2xl lg:mx-auto">
      <AppBreadcrumb />
      <MainH1 header="Start Your Match Review" />

      {/* What You'll Get from a Pro Review section */}
      <div>
        <h2 className="text-2xl mb-2">What You'll Get from a Pro Review</h2>
        <div className="bg-slate-800 rounded-lg overflow-hidden mb-6 w-full">
          <VideoPlayer videoUrl={MATCH_REVIEW_VIDEO_URL} controls />
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          In this short video, Coach Alex walks you through the highlights,
          tactical feedback, and personalized training you'll receive.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className=" space-y-6 mt-2 ">
        <div>
          <h2 className="text-2xl mb-2">What We'll Need From You</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-blue-800 font-medium text-sm">
                  Step 1: Match Information
                </h3>
                <p className="text-blue-700 text-sm mt-1">
                  Provide basic match details below. On the next page, you'll
                  upload your match videos and choose your review package.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label className="font-medium flex items-center">
            Opponent Name
            <span className="ml-1 text-red-500">*</span>
            <span className="ml-1 text-xs text-slate-500">(required)</span>
          </label>
          <Input {...register("opponentName")} placeholder="e.g. John Doe" />
          {errors.opponentName && (
            <p className="text-red-500 text-sm">
              {errors.opponentName.message}
            </p>
          )}
        </div>
        <div>
          <label className="font-medium flex items-center">
            Location / Venue
            <span className="ml-1 text-xs text-slate-500">(optional)</span>
          </label>
          <Input
            {...register("eventName")}
            placeholder="e.g. Sydney Open 2024"
          />
          {errors.eventName && (
            <p className="text-red-500 text-sm">{errors.eventName.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="gap-2 ">
            <Label className="font-medium mb-1 flex items-center">
              Match Date
              <span className="ml-1 text-xs text-slate-500">(optional)</span>
            </Label>
            <Controller
              control={form.control}
              name="matchDate"
              render={({ field }) => (
                <Input
                  type="date"
                  {...field}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split("T")[0]
                      : ""
                  }
                />
              )}
            />
            {errors.matchDate && (
              <p className="text-red-500 text-sm">{errors.matchDate.message}</p>
            )}
          </div>
          <FinalScoreSelector
            control={form.control}
            errors={form.formState.errors}
            setValue={form.setValue}
          />
        </div>
        <div>
          <label className="font-medium flex items-center">
            Notes
            <span className="ml-1 text-xs text-slate-500">(optional)</span>
          </label>
          <Textarea
            {...register("logNote")}
            placeholder="e.g. missed too many forehand chops..."
          />
          {errors.logNote && (
            <p className="text-red-500 text-sm">{errors.logNote.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 sm:py-4 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base mb-4 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Continue"
          )}
        </button>
      </form>
    </div>
  );
}
