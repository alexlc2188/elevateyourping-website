import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";
import { HeaderIconType, MatchEntryCard } from "./_components/match-entry-card";

const DATA = [
  {
    type: "players",
    title: "Players",
    description:
      "Find table tennis players near you to challenge, train with, or connect for friendly matches.",
    href: "/app/matches/results",
    icon: "players",
  },
  {
    type: "clubs",
    title: "Clubs",
    description:
      "Discover clubs in your area where you can join training sessions, tournaments, or social games.",
    href: "/app/matches/reviews",
    icon: "clubs",
  },
  {
    type: "coachs",
    title: "Coaches",
    description:
      "Looking to improve your game? Find certified table tennis coaches nearby offering lessons and feedback.",
    href: "/app/matches/reviews",
    icon: "coachs",
  },
];

export default function FindNearMePage() {
  return (
    <div className="p-4 space-y-4">
      <AppBreadcrumb />
      <h1 className="text-2xl mt-4 uppercase">Find near me</h1>
      <div className="space-y-8">
        {DATA.map((header) => (
          <MatchEntryCard
            key={header.type}
            description={header.description}
            href={header.href}
            title={header.title}
            icon={header.icon as HeaderIconType}
          />
        ))}
      </div>
    </div>
  );
}
