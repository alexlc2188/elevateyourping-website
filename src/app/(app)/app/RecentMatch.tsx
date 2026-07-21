import Image from "next/image";
import { getRecentMatch } from "@/lib/services/matches";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import Link from "next/link";

export const RecentMatch = async () => {
  const user = await currentUser();
  const recentMatch = await getRecentMatch();

  if (!recentMatch?.data) {
    return (
      <div className="text-muted-foreground text-sm">
        No recent match found.
      </div>
    );
  }

  const { id, opponentName, eventName, createdAt, finalScore } =
    recentMatch.data;

  const date = createdAt
    ? new Intl.DateTimeFormat("en-AU", {
        month: "long",
        year: "numeric",
      }).format(new Date(createdAt))
    : "Date unknown";

  return (
    <Link href={`/app/matches/${id}`}>
      <div className="flex gap-4 rounded-xl overflow-hidden border bg-white">
        <div className="relative w-36 aspect-[3/4]">
          <Image
            src="https://pub-7edbbf1fcb43441b8e9623aed2184c0f.r2.dev/thumbnails/1747725159226-gqnr7b0lw0d.jpg"
            alt="Recent Match"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 p-4">
          <p className="text-sm text-secondary font-medium mb-1">
            Recent Match
          </p>
          <h3 className="text-lg font-black leading-tight">
            {user?.name} VS {opponentName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {eventName} • {date}
          </p>
          <div className="mt-3">
            <Button size="sm" variant="default">
              View Match
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
