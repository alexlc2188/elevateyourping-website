"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { publishExerciseAction, unpublishExerciseAction } from "@/actions/admin/exercises";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { ExerciseStatus, TrainingExercise } from "@prisma/client";
import { getMissingFields, isReadyToPublish } from "@/lib/utils/exercise-validation";

interface ExerciseActionsProps {
  exercise: TrainingExercise & {
    tags?: any[];
    focusAreas?: any[];
  };
  showEditButton?: boolean;
  showTooltip?: boolean;
  className?: string;
  buttonSize?: "sm" | "default" | "lg";
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onlyPublish?: boolean;
  onlyUnpublish?: boolean;
  fullWidth?: boolean;
}

export const ExerciseActions = ({ 
  exercise,
  showEditButton = true,
  showTooltip = true,
  className = "",
  buttonSize = "sm",
  buttonVariant,
  onlyPublish = false,
  onlyUnpublish = false,
  fullWidth = false
}: ExerciseActionsProps) => {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  
  const isPublished = exercise.status === ExerciseStatus.PUBLISHED;
  const readyToPublish = isReadyToPublish(exercise);

  // Determine if we should show publish or unpublish button
  const showPublishButton = !isPublished && !onlyUnpublish;
  const showUnpublishButton = isPublished && !onlyPublish;

  // Handle publishing an exercise
  const handlePublish = async () => {
    if (!readyToPublish) {
      toast.error("Please fill in all required fields before publishing");
      return;
    }
    
    setIsPublishing(true);
    try {
      const result = await publishExerciseAction(exercise.id);
      
      if (result.success) {
        toast.success("Exercise published successfully!");
        // Stay on the current page, just refresh to show updated data
        router.refresh();
      } else {
        toast.error(result.error || "Failed to publish exercise");
      }
    } catch (error) {
      console.error("Error publishing exercise:", error);
      toast.error("An error occurred while publishing the exercise");
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle unpublishing an exercise
  const handleUnpublish = async () => {
    setIsUnpublishing(true);
    try {
      const result = await unpublishExerciseAction(exercise.id);
      
      if (result.success) {
        toast.success("Exercise unpublished successfully!");
        // Stay on the current page, just refresh to show updated data
        router.refresh();
      } else {
        toast.error(result.error || "Failed to unpublish exercise");
      }
    } catch (error) {
      console.error("Error unpublishing exercise:", error);
      toast.error("An error occurred while unpublishing the exercise");
    } finally {
      setIsUnpublishing(false);
    }
  };

  // Determine width class based on fullWidth prop
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <div className={`flex ${fullWidth ? 'w-full flex-col' : ''} gap-2 ${className}`}>
      {/* Edit button */}
      {showEditButton && (
        
        <Link 
          href={`/admin/exercises/${exercise.id}/edit-info`}
          className={fullWidth ? "w-full" : ""}
        >
          <Button 
            size={buttonSize} 
            variant="outline"
            className={fullWidth ? "w-full" : ""}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </Link>
      )}

      {/* Publish button with tooltip */}
      {showPublishButton && (
        <TooltipWrapper
          message={
            readyToPublish || !showTooltip
              ? ""
              : `Missing fields:\n${getMissingFields(exercise).join("\n")}`
          }
          disabled={readyToPublish || !showTooltip}
        >
          <Button 
            size={buttonSize}
            variant={buttonVariant || (readyToPublish ? "default" : "outline")}
            onClick={handlePublish}
            disabled={!readyToPublish || isPublishing}
            className={widthClass}
          >
            {isPublishing 
              ? "Publishing..." 
              : readyToPublish 
                ? "📤 Publish" 
                : "⚠️ Complete required fields"}
          </Button>
        </TooltipWrapper>
      )}

      {/* Unpublish button */}
      {showUnpublishButton && (
        <Button 
          size={buttonSize}
          variant={buttonVariant || "destructive"}
          onClick={handleUnpublish}
          disabled={isUnpublishing}
          className={widthClass}
        >
          {isUnpublishing ? "Unpublishing..." : "Unpublish"}
        </Button>
      )}
    </div>
  );
};
