import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";

export const TrainingSettingsModal = ({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (settings: {
    delay: number;
    sessionDuration: number;
    twoPlayerMode: boolean;
  }) => void;
}) => {
  const [delay, setDelay] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [twoPlayerMode, setTwoPlayerMode] = useState(false);

  const handleSave = () => {
    onSave({ delay, sessionDuration, twoPlayerMode });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Training Settings
          </DialogTitle>
        </DialogHeader>

        {/* Delay Setting */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Delay before timer starts (seconds)
          </label>
          <Select
            value={delay.toString()}
            onValueChange={(value) => setDelay(parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select delay" />
            </SelectTrigger>
            <SelectContent>
              {[0, 10, 20, 30, 45, 60].map((d) => (
                <SelectItem key={d} value={d.toString()}>
                  {d} sec
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Session Duration */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Training session duration
          </label>
          <Select
            value={sessionDuration.toString()}
            onValueChange={(value) => setSessionDuration(parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {[30, 60, 90, 120].map((min) => (
                <SelectItem key={min} value={min.toString()}>
                  {min} min
                </SelectItem>
              ))} 
            </SelectContent>
          </Select>
        </div>

        {/* Two Player Mode */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Two Player Mode</span>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-slate-400 text-sm underline">
                  What’s this?
                </button>
              </DialogTrigger>
              <DialogContent className="text-sm">
                <p className="text-sm text-slate-700">
                  <strong>👤 One player:</strong> all drills are completed one
                  after another.
                  <br />
                  <strong>👥 Two players:</strong> take turns — the training
                  plan adjusts so each player gets their turn.
                </p>
              </DialogContent>
            </Dialog>
          </div>
          <Switch
            className="bg-muted data-[state=checked]:bg-secondary"
            checked={twoPlayerMode}
            onCheckedChange={setTwoPlayerMode}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </DialogContent>
    </Dialog>
  );
};
