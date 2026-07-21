import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const MatchDropdownMenu = ({ matchId }: { matchId: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-3 right-3 w-8 h-8 p-0 border border-gray-300 shadow-sm hover:bg-muted">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/app/matches/edit/${matchId}`}>Edit Match</Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Delete (Coming Soon)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
