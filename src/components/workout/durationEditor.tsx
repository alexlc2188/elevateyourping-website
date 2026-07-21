"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Pencil, Timer } from "lucide-react";

export function DurationEditor({
  duration,
  setDuration,
  disabled = false,
}: {
  duration: number;
  setDuration: (val: number) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [tempMinutes, setTempMinutes] = useState(Math.floor(duration / 60));

  const handleSave = () => {
    const clamped = Math.max(1, Math.min(tempMinutes, 60));
    setDuration(clamped * 60); // set in seconds
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-sm h-auto px-3 py-1 border-gray-200 bg-white active:bg-accent/30"
          disabled={disabled}>
          <Timer /> Duration: {Math.floor(duration / 60)} min
          <Pencil className="ml-1 h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3 space-y-2">
        <label className="text-xs text-muted-foreground">
          Set duration (minutes)
        </label>
        <Input
          type="number"
          value={tempMinutes}
          onChange={(e) => setTempMinutes(parseInt(e.target.value || "1"))}
          min={1}
          max={60}
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
