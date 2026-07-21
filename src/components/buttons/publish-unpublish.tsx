"use client";

import { Trash } from "lucide-react";
import { useState, useTransition } from "react";
// import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "../dialogs/confirm-dialog";
import { toast } from "sonner";
import {
  createUserTrainingSelectionForPlan,
  publishMatchAction,
} from "@/actions/admin/matches";

import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ActionsProps {
  disabled: boolean;
  matchId: string;
  isPublished: boolean;
}

export const PublishUnpublishButton = ({
  disabled,
  isPublished,
  matchId,
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onClick = async () => {
    try {
      const { success, data } = await publishMatchAction({
        matchId,
        isPublished,
      });

      if (!success) {
        toast.error("Could not publish match");

        return;
      }

      if (data?.isPublished) {
        toast.success("Match is published");
      } else {
        toast.warning("Match is unpublished");
      }

      if (data?.isPublished) {
        confetti.onOpen();

        const { error } = await createUserTrainingSelectionForPlan({
          userId: data.userId,
          trainingPlanId: data.trainingPlanId!,
        });

        if (error) throw error;
      }
      router.push("/admin/matches");
    } catch (error) {
      console.error(error);
      toast.error("Could not publish match");
    }
  };

  // todo: delete match
  // const onDelete = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { success, error } = await deleteMatchById(matchId);
  //     if (success) {
  //       toast.success("Match deleted successfully");
  //       router.push("/admin/matches");
  //     }

  //     if (error) throw error;
  //   } catch (error) {
  //     console.error("DELETE MATCHE ERROR", error);
  //     toast.error("An error occured. Could not delete the match.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/matches/${matchId}/delete`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unknown error");
      }

      toast.success("Match deleted successfully");
      router.push("/admin/matches");
      router.refresh();
    } catch (error) {
      console.error("DELETE MATCH ERROR", error);
      toast.error("Could not delete the match.");
    } finally {
      setIsLoading(false);
    }
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
