import { notFound } from "next/navigation";
import { users } from "@/__data/users-simplified";
import { MatchReviewPage } from "./_components/MatchReviewPage";

const ReviewPage = async ({
  params,
}: {
  params: Promise<{
    userId: string;
    matchId: string;
    viewType: "sets" | "recap";
  }>;
}) => {
  const { userId, matchId, viewType } = await params;
  const user = users[userId];
  const match = user?.matches?.[matchId];
  const header =
    viewType === "sets" ? "Match Review Analysis" : "Post Match Strategy";

  const posterImage =
    viewType === "sets"
      ? "/images/match-review-analysis-frame.jpg"
      : "/images/post-match-strategy-frame.jpg";

  if (!match) return notFound();

  let videos: { title: string; videoId: string; description?: string }[] = [];

  if (viewType === "sets") {
    videos = match.sets.map((set) => ({
      title: `Set ${set.setNumber}`,
      videoId: set.videoId,
      description: set.comment,
    }));
  } else if (viewType === "recap") {
    videos = [
      {
        title: `Your coach insights`,
        videoId: match.coachInsightsVideoId,
        description: "",
      },
    ];
  }

  return (
    <div className="bg-white">
      <MatchReviewPage
        videos={videos}
        header={header}
        posterImage={posterImage}
      />
    </div>
  );
};

export default ReviewPage;
