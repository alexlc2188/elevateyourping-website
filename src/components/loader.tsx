import { cn } from "@/lib/utils";

type LoaderProps = {
  className?: string;
};

export const Loader = ({ className }: LoaderProps) => (
  <div className="flex h-full w-full items-center justify-center">
    <div
      className={cn(
        "relative h-5 w-5 rounded-full bg-orange-500 animate-bounce-table-tennis shadow-md",
        className,
      )}
    />
  </div>
);
