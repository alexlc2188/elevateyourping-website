"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Add options as props
export function AssignExercisesModal({
  open,
  onClose,
  targetType,
  setTargetType,
  selectedExerciseIds,
  matchOptions,
  packOptions,
}: {
  open: boolean;
  onClose: () => void;
  targetType: "match" | "pack";
  setTargetType: (v: null) => void; // for back action
  selectedExerciseIds: string[];
  matchOptions: { id: string; name: string }[];
  packOptions: { id: string; name: string }[];
}) {
  const [targetId, setTargetId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  // Reset step on close
  useEffect(() => {
    if (!open) {
      setStep(1);
      setTargetId(null);
    }
  }, [open]);

  const handleConfirm = () => {
    // TODO: API call to assign selectedExerciseIds to targetId
    console.log({ selectedExerciseIds, targetId, targetType });
    onClose();
  };

  const options = targetType === "match" ? matchOptions : packOptions;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 1
              ? `Select ${targetType === "match" ? "Match" : "Pack"}`
              : "Confirm Assignment"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <select
              value={targetId ?? ""}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full border px-3 py-2 rounded-md">
              <option value="">Select {targetType}</option>
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => {
                  setTargetType(null);
                  setStep(1);
                }}
                variant="ghost">
                Back
              </Button>
              <Button onClick={() => setStep(2)} disabled={!targetId}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You're about to assign{" "}
              <strong>{selectedExerciseIds.length}</strong> exercises to:
            </p>
            <div className="border p-3 rounded-md text-sm bg-muted">
              {targetType === "match" ? "Match" : "Pack"} ID:{" "}
              <code>{targetId}</code>
            </div>
            <div className="flex justify-between pt-4">
              <Button onClick={() => setStep(1)} variant="ghost">
                Back
              </Button>
              <Button onClick={handleConfirm}>Confirm Assignment</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
