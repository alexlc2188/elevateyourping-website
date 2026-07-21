import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function SettingsControls({
  delay,
  setDelay,
  duration,
  setDuration,
  mode,
  setMode,
}: {
  delay: number;
  setDelay: (v: number) => void;
  duration: number;
  setDuration: (v: number) => void;
  mode: string;
  setMode: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-4">
      {/* Delay */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="px-3 py-1 h-auto">
            ⏱ Delay: {delay}s <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1 rounded-md border bg-white shadow-md">
          {[0, 5, 10, 15].map((val) => (
            <Button
              key={val}
              variant="ghost"
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                delay === val
                  ? "bg-secondary font-semibold text-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setDelay(val)}>
              {val} seconds
            </Button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Duration */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="px-3 py-1 h-auto">
            🕒 Duration: {duration}min <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1 rounded-md border bg-white shadow-md">
          {[30, 60].map((val) => (
            <Button
              key={val}
              variant="ghost"
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                duration === val
                  ? "bg-secondary font-semibold text-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setDuration(val)}>
              {val} minutes
            </Button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Mode */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="px-3 py-1 h-auto">
            <span className="mr-1">{mode === "Solo" ? "👤" : "👤👤"}</span>
            <span>Mode: {mode}</span>
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1 rounded-md border bg-white shadow-md">
          {["Solo", "Two Player"].map((val) => (
            <Button
              key={val}
              variant="ghost"
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
                mode === val
                  ? "bg-secondary font-semibold text-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setMode(val)}>
              {val}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
