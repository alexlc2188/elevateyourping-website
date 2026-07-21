"use client";
import Link from "next/link";
import MatchListRow from "./MatchListRow";
import { Match } from "@prisma/client";

import { Button } from "@/components/ui/button";

const MatchList = ({ matches }: { matches: Match[] }) => (
  <div className="space-y-2 mt-4">
    {matches.map((match) => (
      <MatchListRow key={match.id} match={match} />
    ))}
    <Button
      asChild
      variant="ghost"
      className="w-full text-red-600 border border-red-200">
      <Link href="/app/matches/new">+ Add New Match</Link>
    </Button>

    {/* <Dialog>
      <DialogTrigger asChild>
        <div className="border rounded-xl p-4 flex items-center gap-2 justify-center text-primary hover:bg-blue-50 cursor-pointer">
          <Plus className="w-5 h-5" />
          <Button
            variant="ghost"
            className="w-full text-red-600 border border-red-200">
            + Add New Match
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade Required</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>You’ve reached the free match limit.</p>
          <p>Upgrade to unlock unlimited match analysis and review tools.</p>
        </div>
        <Link href="/pricing">
          <Button className="w-full mt-4">View Plans & Upgrade</Button>
        </Link>
      </DialogContent>
    </Dialog> */}
  </div>
);

export default MatchList;
