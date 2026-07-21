import Link from "next/link";
import { Plus } from "lucide-react";

export function AddMatchCard({
  variant = "grid",
}: {
  variant?: "grid" | "carousel";
}) {
  const baseStyles =
    "relative rounded-lg overflow-hidden flex items-center justify-center text-muted-foreground border border-dashed border-gray-300 hover:bg-muted/20 cursor-pointer";

  const sizeClass =
    variant === "carousel"
      ? "aspect-[9/16] h-[calc(100vh-16rem)] w-full"
      : "aspect-[9/16]";

  return (
    <Link href="/app/matches/new">
      <div className={`${baseStyles} ${sizeClass}`}>
        <div className="flex flex-col items-center justify-center space-y-2">
          <Plus className="w-6 h-6" />
          <span className="font-medium">Add New Match</span>
        </div>
      </div>
    </Link>
  );
}
