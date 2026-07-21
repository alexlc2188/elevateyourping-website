"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TooltipWrapperProps = {
  children: React.ReactNode;
  message: string;
  disabled?: boolean; // Optional: skip tooltip when disabled
};

export const TooltipWrapper = ({
  children,
  message,
  disabled = false,
}: TooltipWrapperProps) => {
  if (disabled) return <>{children}</>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block">{children}</span>
        </TooltipTrigger>
        <TooltipContent className="whitespace-pre-line max-w-xs">
          <p className="text-sm">{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
