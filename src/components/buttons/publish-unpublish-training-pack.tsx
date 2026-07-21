"use client";

import { Trash } from "lucide-react";
import { useState } from "react";
// import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "../dialogs/confirm-dialog";
import { toast } from "sonner";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { publishTrainingPackAction } from "@/actions/admin/trainingPacksActions";

interface ActionsProps {
  disabled: boolean;
  trainingPackId: string;
  isPublished: boolean;
}

export const PublishUnpublishButtonTrainingPack = ({
  disabled,
  isPublished,
  trainingPackId,
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      const { success, data } = await publishTrainingPackAction({
        packId: trainingPackId,
        isPublished,
      });

      if (!success) {
        toast.error("Could not publish match");

        return;
      }

      toast.success("Match is published");
      if (data?.isPublished) {
        confetti.onOpen();
      }
      router.push("/admin/training-packs");
    } catch (error) {
      console.error(error);
      toast.error("Could not publish match");
    }
    // try {
    //   setIsLoading(true);
    //   if (isPublished) {
    //     await axios.patch(`/api/courses/${courseId}/unpublish`);
    //     toast.success("Course unpublished");
    //   } else {
    //     await axios.patch(`/api/courses/${courseId}/publish`);
    //     toast.success("Course published");
    //     confetti.onOpen();
    //   }
    //   router.refresh();
    // } catch {
    //   toast.error("Something went wrong");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const onDelete = async () => {
    // try {
    //   setIsLoading(true);
    //   await axios.delete(`/api/courses/${courseId}`);
    //   toast.success("Course deleted");
    //   router.refresh();
    //   router.push(`/teacher/courses`);
    // } catch {
    //   toast.error("Something went wrong");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="flex items-center gap-x-2">
      {!disabled && (
        <Button
          className="cursor-pointer"
          onClick={onClick}
          disabled={disabled || isLoading}
          variant="outline"
          size="sm">
          {isPublished ? "Unpublish" : "Publish"}
        </Button>
      )}
      <ConfirmDialog onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmDialog>
    </div>
  );
};
