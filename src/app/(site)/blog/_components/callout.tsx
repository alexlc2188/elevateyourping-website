import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalloutProps {
  type?: "tip" | "info" | "warning";
  children: React.ReactNode;
}

const calloutStyles = {
  tip: {
    emoji: "✅",
    label: "Pro Tip",
    border: "border-green-300",
    bg: "bg-green-50",
    text: "text-green-900",
  },
  info: {
    emoji: "💡",
    label: "Info",
    border: "border-secondary-300",
    bg: "bg-secondary/60",
    text: "text-secondary-900",
  },
  warning: {
    emoji: "⚠️",
    label: "Important",
    border: "border-red-300",
    bg: "bg-red-50",
    text: "text-red-900",
  },
};

export function Callout({ type = "tip", children }: CalloutProps) {
  const style = calloutStyles[type];

  return (
    <Card
      className={cn(
        "not-prose border text-base rounded-md px-4",
        style.border,
        style.bg,
      )}>
      <div className={cn("font-semibold flex items-center gap-2", style.text)}>
        <span>{style.emoji}</span>
        <span>{style.label}</span>
      </div>
      <div className=" text-slate-800">{children}</div>
    </Card>
  );
}
