"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  detectInAppBrowser,
  getBrowserInstructions,
} from "@/lib/utils/in-app-browser-detection";
import { Smartphone } from "lucide-react";

export const InAppBrowserModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<{
    isInAppBrowser: boolean;
    platform: string;
  } | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const detection = detectInAppBrowser();
      setBrowserInfo(detection);

      if (detection.isInAppBrowser) {
        setIsOpen(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
  };

  if (!browserInfo?.isInAppBrowser) {
    return null;
  }

  const instructions = getBrowserInstructions(browserInfo.platform);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {instructions.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {instructions.message}
          </p>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">How to open in browser:</h4>
            <ol className="text-sm space-y-1">
              {instructions.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="w-full"
            >
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
