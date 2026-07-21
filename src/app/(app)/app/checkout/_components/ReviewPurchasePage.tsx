"use client";

import { MainH1 } from "@/components/headers/MainH1";
import { MultiVideoUpload } from "@/components/multi-video-upload";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import VideoPlayer from "@/components/video-player";
import { Match, Product } from "@prisma/client";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MatchOffer } from "@prisma/client";
import { CheckoutButton } from "./CheckoutButton";
import { ReviewPackageSelector } from "./ReviewPackageSelector";
import { NicholasLumQuote } from "@/app/(site)/blog/_components/nicholas-lum-quote";

interface Props {
  match: Match;
  products: Product[];
  selectedProduct: Product;
}

const MATCH_REVIEW_VIDEO_URL =
  process.env.NEXT_PUBLIC_MATCH_REVIEW_VIDEO_URL ?? null;

export default function ReviewPurchasePage({
  match,
  products,
  selectedProduct,
}: Props) {
  // Add state to track current package selection (allows upgrade)
  const [currentPackage, setCurrentPackage] = useState<MatchOffer>(
    selectedProduct.matchOffer || "REVIEW_ONLY",
  );

  // Use current package for pricing calculations
  const currentProduct =
    products.find((p) => p.matchOffer === currentPackage) || selectedProduct;
  const productPrice = currentProduct.amount / 100;

  // Optional (only for "bundle" to show savings)
  const isBundle = currentProduct.matchOffer === "REVIEW_AND_PLAN";
  const fullPriceIfSeparate = 99 + 99 + 29;
  const getProductPrice = (type: MatchOffer) =>
    products.find((p) => p.matchOffer === type)?.amount ?? 0;
  const savings = fullPriceIfSeparate - productPrice;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isAutoSavingText, setIsAutoSavingText] = useState(false);

  // Refs for debouncing text auto-save
  const aboutMeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    videos?: string;
    aboutMe?: string;
  }>({});

  // The match object should include detailedSetVideos after being created
  // We need to use type assertion since the exact structure might vary
  const matchWithVideos = match as Match & {
    detailedSetVideos?: Array<{
      id: string;
      videoId: string;
      setNumber: number;
      video?: { publicUrl?: string } | null;
    }>;
    offerType?: MatchOffer;
  };

  // Extract video data from the detailedSetVideos relationship
  const initialVideos =
    matchWithVideos.detailedSetVideos &&
    matchWithVideos.detailedSetVideos.length > 0
      ? matchWithVideos.detailedSetVideos.map((setVideo) => ({
          id: setVideo.videoId,
          setNumber: setVideo.setNumber,
          // Use the publicUrl from the video object if available, otherwise construct it
          publicUrl: setVideo.video?.publicUrl,
        }))
      : [];

  // State to track videos and form fields
  const [videos, setVideos] = useState(initialVideos);
  const [aboutMe, setAboutMe] = useState(matchWithVideos.aboutMe || "");
  const [notes, setNotes] = useState(matchWithVideos.notes || "");

  // Determine which package was selected (from the previous page)
  // Use current package instead of fixed selection
  const selectedPackage = currentPackage;

  // Function to auto-save videos as they're uploaded
  const autoSaveVideos = async (
    newVideoIds: string[],
    showToast = true,
    previousCount?: number,
  ) => {
    try {
      setIsAutoSaving(true);

      // Prepare the video data for the API call
      const videoData = newVideoIds.map((id, index) => ({
        videoId: id,
        setNumber: index + 1,
      }));

      // Make API call to save just the videos
      const response = await fetch(`/api/matches/${matchWithVideos.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          detailedSetVideos: videoData,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to auto-save videos: ${response.status}`);
        // Don't throw error here - we don't want to interrupt the upload process
        // The user can still proceed and videos will be saved on final submission
        if (showToast) {
          toast.error(
            "Failed to auto-save videos. They will be saved when you complete the purchase.",
          );
        }
      } else {
        console.log("Videos auto-saved successfully");
        if (showToast) {
          const currentCount = newVideoIds.length;

          if (currentCount === 0) {
            toast.success("All videos cleared successfully!");
          } else if (previousCount !== undefined) {
            if (currentCount > previousCount) {
              const addedCount = currentCount - previousCount;
              toast.success(
                `Video${addedCount > 1 ? "s" : ""} uploaded successfully!`,
              );
            } else if (currentCount < previousCount) {
              const deletedCount = previousCount - currentCount;
              toast.success(
                `Video${deletedCount > 1 ? "s" : ""} deleted successfully!`,
              );
            } else {
              toast.success("Videos updated successfully!");
            }
          } else {
            toast.success("Videos saved successfully!");
          }
        }
      }
    } catch (error) {
      console.error("Error auto-saving videos:", error);
      if (showToast) {
        toast.error(
          "Failed to auto-save videos. They will be saved when you complete the purchase.",
        );
      }
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Function to auto-save text fields (debounced)
  const autoSaveTextFields = useCallback(
    async (fieldName: "aboutMe" | "notes", value: string) => {
      try {
        setIsAutoSavingText(true);

        const response = await fetch(`/api/matches/${matchWithVideos.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [fieldName]: value,
          }),
        });

        if (!response.ok) {
          console.error(`Failed to auto-save ${fieldName}: ${response.status}`);
          // Don't show error toast for auto-save failures to avoid interrupting user
        } else {
          console.log(`${fieldName} auto-saved successfully`);
          // Show subtle success indicator without interrupting user
          if (hasUserInteracted) {
            toast.success(
              `${fieldName === "aboutMe" ? "Description" : "Notes"} saved!`,
              {
                duration: 2000,
              },
            );
          }
        }
      } catch (error) {
        console.error(`Error auto-saving ${fieldName}:`, error);
        // Don't show error toast for auto-save failures
      } finally {
        setIsAutoSavingText(false);
      }
    },
    [matchWithVideos.id, hasUserInteracted],
  );

  // Debounced auto-save for aboutMe field
  const debouncedSaveAboutMe = useCallback(
    (value: string) => {
      if (aboutMeTimeoutRef.current) {
        clearTimeout(aboutMeTimeoutRef.current);
      }
      aboutMeTimeoutRef.current = setTimeout(() => {
        autoSaveTextFields("aboutMe", value);
      }, 1000); // 1 second delay
    },
    [autoSaveTextFields],
  );

  // Debounced auto-save for notes field
  const debouncedSaveNotes = useCallback(
    (value: string) => {
      if (notesTimeoutRef.current) {
        clearTimeout(notesTimeoutRef.current);
      }
      notesTimeoutRef.current = setTimeout(() => {
        autoSaveTextFields("notes", value);
      }, 1000); // 1 second delay
    },
    [autoSaveTextFields],
  );

  // // Function to update the match with selected package and details
  // const updateMatch = async () => {
  //   // Reset validation errors
  //   setValidationErrors({});

  //   // Validate required fields
  //   const errors: { videos?: string; aboutMe?: string } = {};

  //   if (!videos.length) {
  //     errors.videos = "Please upload at least one video";
  //   }

  //   if (!aboutMe.trim()) {
  //     errors.aboutMe =
  //       "Please provide a description to help coaches recognize you";
  //   }

  //   // If there are validation errors, show them and don't proceed
  //   if (Object.keys(errors).length > 0) {
  //     setValidationErrors(errors);
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);

  //     // Prepare the video data for the API call
  //     const videoData = videos.map((video, index) => ({
  //       videoId: video.id,
  //       setNumber: index + 1,
  //     }));

  //     // Make API call to update the match
  //     const response = await fetch(`/api/matches/${matchWithVideos.id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         offerType: selectedPackage,
  //         aboutMe,
  //         notes,
  //         detailedSetVideos: videoData,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error(`API error (${response.status}):`, errorText);
  //       throw new Error(
  //         `Failed to update match: ${response.status} ${errorText}`
  //       );
  //     }

  //     const updatedMatch = await response.json();

  //     toast.success("Your free review has been confirmed!");

  //     // Redirect to the match details page
  //     router.push(`/app/matches/${matchWithVideos.id}`);
  //   } catch (error) {
  //     console.error("Error updating match:", error);
  //     toast.error(
  //       error instanceof Error
  //         ? error.message
  //         : "Something went wrong. Please try again."
  //     );
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="space-y-6 my-6">
      <MainH1 header="Complete Your Match Review" />

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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-semibold">
              2
            </div>
          </div>
          <div>
            <h3 className="text-blue-800 font-medium text-sm">
              Step 2: Upload Videos & Complete Purchase
            </h3>
            <p className="text-blue-700 text-sm mt-1">
              Upload your match videos and provide additional details for our
              coaches to analyze.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl mb-4">What We'll Need from You</h2>

      {/* Information section */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-4 w-4 text-blue-400 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-2">
            <p className="text-sm text-blue-800">
              Upload videos of your match - either the{" "}
              <strong>full match</strong> or <strong>individual sets</strong>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Select one video at a time. Multiple uploads run simultaneously.
            </p>
          </div>
        </div>
      </div>

      {/* Video upload section */}
      <div className="mt-2" data-section="videos">
        {videos.length > 0 ? (
          <>
            {isAutoSaving && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-blue-600 animate-pulse">
                  Saving...
                </span>
              </div>
            )}
            <MultiVideoUpload
              onVideosChange={(newVideoIds) => {
                const previousCount = videos.length;
                const newVideos = newVideoIds.map((id, index) => ({
                  id,
                  setNumber: index + 1,
                  publicUrl: undefined,
                }));
                setVideos(newVideos);
                // Clear video validation error when videos are added
                if (newVideoIds.length > 0 && validationErrors.videos) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    videos: undefined,
                  }));
                }
                // Auto-save videos whenever they change (including deletions)
                // Only show toast if user has interacted (not on initial load)
                autoSaveVideos(newVideoIds, hasUserInteracted, previousCount);
                setHasUserInteracted(true);
              }}
              maxVideos={5}
              initialVideos={videos}
              videoType="matches"
              onUploadStateChange={setIsVideoUploading}
            />
          </>
        ) : (
          <>
            {validationErrors.videos && (
              <p className="text-sm text-red-500 font-medium mb-2">
                {validationErrors.videos}
              </p>
            )}
            <MultiVideoUpload
              onVideosChange={(newVideoIds) => {
                // Create new video objects without publicUrl
                const previousCount = videos.length;
                const newVideos = newVideoIds.map((id, index) => ({
                  id,
                  setNumber: index + 1,
                  publicUrl: undefined, // This should come from the backend
                }));
                setVideos(newVideos);
                // Clear video validation error when videos are added
                if (newVideoIds.length > 0 && validationErrors.videos) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    videos: undefined,
                  }));
                }
                // Auto-save videos whenever they change (including deletions)
                // Only show toast if user has interacted (not on initial load)
                autoSaveVideos(newVideoIds, hasUserInteracted, previousCount);
                setHasUserInteracted(true);
              }}
              maxVideos={5}
              initialVideos={[]}
              onUploadStateChange={setIsVideoUploading}
            />
          </>
        )}
      </div>

      {/* Description field */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="font-medium">My Description</label>
          {isAutoSavingText && (
            <span className="text-xs text-blue-600 animate-pulse">
              Saving...
            </span>
          )}
        </div>
        <Textarea
          data-field="aboutMe"
          value={aboutMe}
          onChange={(e) => {
            const newValue = e.target.value;
            setAboutMe(newValue);
            setHasUserInteracted(true);

            // Clear validation error when user types
            if (validationErrors.aboutMe) {
              setValidationErrors((prev) => ({
                ...prev,
                aboutMe: undefined,
              }));
            }

            // Trigger debounced auto-save
            debouncedSaveAboutMe(newValue);
          }}
          placeholder="e.g. tall, red shirt, left handed..."
          className={validationErrors.aboutMe ? "border-red-500" : ""}
        />
        {validationErrors.aboutMe ? (
          <p className="text-red-500 text-sm mt-1">
            {validationErrors.aboutMe}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            This helps our coaches recognize you on video.
          </p>
        )}
      </div>

      {/* Notes field */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="font-medium">Notes to Coach (optional)</label>
          {isAutoSavingText && (
            <span className="text-xs text-blue-600 animate-pulse">
              Saving...
            </span>
          )}
        </div>
        <Textarea
          value={notes}
          onChange={(e) => {
            const newValue = e.target.value;
            setNotes(newValue);
            setHasUserInteracted(true);

            // Trigger debounced auto-save
            debouncedSaveNotes(newValue);
          }}
          placeholder="Additional notes... e.g. specific components to look out for"
        />
      </div>

      {/* Card-based package selector */}
      <ReviewPackageSelector
        products={products}
        selected={currentPackage}
        onSelect={setCurrentPackage}
      />

      <Separator />

      <NicholasLumQuote />

      <h3 className="text-2xl mt-6 mb-2">Review Summary</h3>

      <Card className="p-4 shadow-sm rounded-xl">
        <CardContent className="p-0 flex flex-col gap-4">
          <ul className="space-y-2 text-xs lg:text-base">
            <li className="flex justify-between items-center ">
              <span>✔️ Personal Match Highlight</span>
              <div className="space-x-1">
                <span className="text-green-500">Free</span>
                <span className="text-muted-foreground line-through text-sm lg:text-lg">
                  $29
                </span>
              </div>
            </li>
            <li className="flex justify-between items-center">
              <span>✔️ Expert Coach Review</span>
              <span className="text-muted-foreground text-sm lg:text-lg">
                Included
              </span>
            </li>
            <li
              className={`flex justify-between items-center ${
                currentPackage === "REVIEW_ONLY" ? "opacity-50" : ""
              }`}>
              <span>
                {currentPackage === "REVIEW_AND_PLAN" ? "✔️" : "➕"} Custom
                Training Plan
              </span>
              <span className="text-muted-foreground text-sm lg:text-lg">
                {currentPackage === "REVIEW_AND_PLAN"
                  ? "Included"
                  : "Not included"}
              </span>
            </li>
          </ul>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                {currentPackage === "REVIEW_AND_PLAN"
                  ? "Bundle"
                  : "Review Only"}
              </p>
              {currentPackage === "REVIEW_AND_PLAN" && (
                <p className="text-xs text-muted-foreground">
                  Save $69 vs separate purchase
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center">
                <p className="text-xl font-bold text-black/90 mr-2">
                  AUD {productPrice}
                </p>
              </div>
              {currentPackage === "REVIEW_AND_PLAN" && (
                <p className="text-xs text-green-600 font-medium">
                  Best Value!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <CheckoutButton
        product={{
          name: currentProduct.name,
          amountInCents: currentProduct.amount,
          matchId: match.id,
          matchOffer: currentPackage,
        }}
        hasVideos={videos.length > 0}
        aboutMe={aboutMe}
        onValidationError={(errors) => {
          setValidationErrors(errors);
          // Scroll to first error field
          if (errors.videos) {
            // Scroll to videos section
            const videosSection = document.querySelector(
              '[data-section="videos"]',
            );
            videosSection?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          } else if (errors.aboutMe) {
            // Scroll to description field
            const descriptionField = document.querySelector(
              '[data-field="aboutMe"]',
            );
            descriptionField?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }}
      />
    </div>
  );
}
