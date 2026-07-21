"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrainingSettingsModal } from "./trainingSettingsModal";
import { Settings } from "lucide-react";

export const TrainingSettingsButton = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    delay: 10,
    sessionDuration: 30,
    twoPlayerMode: false,
  });

  const handleSave = (newSettings: typeof settings) => {
    setSettings(newSettings);
    console.log("Saved Settings:", newSettings);
    // You can store them in context or pass them as props to other components
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-medium  ">
        <Settings className="h-5 w-5" />
        Settings
      </Button>

      <TrainingSettingsModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};
