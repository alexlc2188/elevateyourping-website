export type CoachingReview = {
  firstName: string;
  lastName: string;
  matchId: string;
};

export const users: Record<string, CoachingReview> = {
  "daniel": {
    firstName: "Daniel",
    lastName: "Admon",
    matchId: "vs-pierre",
  },
};
