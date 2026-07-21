export type AnalysisId = "serve-return" | "first-contact" | "rally" | "counter";

export const ANALYSIS_LABELS: Record<AnalysisId, string> = {
  "serve-return": "Serve and return",
  "first-contact": "First contact",
  rally: "Rally",
  counter: "Counter strategy",
};

export type Analysis = {
  id: AnalysisId;
  feedback: string;
  videoId: string;
  youtubeId: string;
};

type Summary = {
  videoId: string;
  summary: string;
};

type SetReview = {
  setNumber: number;
  videoId: string;
  comment: string;
};

type TrainingStep = {
  duration: number;
  label: string;
  drillNumber?: number; // Optional (not every step needs it)
  drillUrl?: string; // new!
};

export type CoachReview = {
  summary: Summary;
  drills: string[];
  sets: SetReview[]; // NEW
  analysis: Analysis[];
  trainingPlan: TrainingStep[];
};

export const coachingReviews: Record<string, CoachReview> = {
  "benxavier-345": {
    trainingPlan: [
      {
        duration: 10,
        label: "Forehand topspin",
        drillNumber: 1,
        drillUrl: "/drills/static1.webm",
      },
      {
        duration: 10,
        label: "Backhand open-up",
        drillNumber: 2,
        drillUrl: "/drills/static2.webm",
      },
      {
        duration: 15,
        label: "Serve push control",
        drillNumber: 3,
        drillUrl: "/drills/dynamic1.webm",
      },
      {
        duration: 10,
        label: "Counter footwork",
        drillNumber: 4,
        drillUrl: "/drills/dynamic2.webm",
      },
      {
        duration: 15,
        label: "Match simulation",
        drillNumber: 5,
        drillUrl: "/drills/serve1.webm",
      }, 
      {
        duration: 15,
        label: "Match simulation",
        drillNumber: 5,
        drillUrl: "/drills/serve2.webm",
      }, 
      {
        duration: 15,
        label: "Match simulation",
        drillNumber: 5,
        drillUrl: "/drills/receive1.webm",
      }, 
      // {
      //   duration: 15,
      //   label: "Match simulation",
      //   drillNumber: 5,
      //   drillUrl: "/drills/receive2.webm",
      // }, 
    ],
    drills: [
      "lHUcCCjtAK4",
      "KwV2qxY_I1k",
      "6w4LrDlqMSQ",
      "fQRDnvNaM3A",
      "lHUcCCjtAK4",
      "KwV2qxY_I1k",
      "6w4LrDlqMSQ",
      "fQRDnvNaM3A",
    ],
    summary: {
      summary: `After reviewing your match against Alex, a few key areas stand out for improvement. First, your receive game is too passive — you’re giving away initiative early, especially against short or half-long serves. Focus on stepping in more aggressively with your forehand flick or backhand banana flick where possible. During rallies, you’re consistent but rarely force errors. You’re playing too safely when there’s a clear opportunity to pivot and attack with your forehand. Start committing to more open-ups on slightly long balls. Also, your positioning after a wide serve return leaves you vulnerable — you’re slow to recover to the middle. On the positive side, your serves are varied and well-disguised. You caught your opponent off-guard with your fast long serve to the backhand at 8–8 — great tactical choice.`,
      videoId: "XtOh4j89Kuk",
    },
    sets: [
      // 🔥 new set-by-set review
      {
        setNumber: 1,
        videoId: "lHUcCCjtAK4",
        comment:
          "Set 1: You started confidently but missed opportunities on short serves.",
      },
      {
        setNumber: 2,
        videoId: "KwV2qxY_I1k",
        comment:
          "Set 2: Good adaptation on serve receive but too passive in rally openings.",
      },
      {
        setNumber: 3,
        videoId: "6w4LrDlqMSQ",
        comment:
          "Set 3: Smart placement improvements, but lost patience at critical points.",
      },
      {
        setNumber: 4,
        videoId: "fQRDnvNaM3A",
        comment:
          "Set 4: Strong comeback, better third ball attacks, but inconsistent serve variations.",
      },
    ],
    analysis: [
      {
        id: "serve-return",
        feedback:
          "You’re relying too much on backspin serves; mix in fast, long topspin serves to disrupt the opponent’s rhythm.",
        videoId: "serve-receive-video",
        youtubeId: "lHUcCCjtAK4",
      },
      {
        id: "first-contact",
        feedback:
          "You're too passive on the third ball — start stepping in and attacking earlier, especially on long returns.",
        videoId: "first-contact-video",
        youtubeId: "KwV2qxY_I1k",
      },
      {
        id: "rally",
        feedback:
          "You tend to play into your opponent's strong zones; work on placing balls wider and deeper to control the pace and positioning.",
        videoId: "rally-review-video",
        youtubeId: "6w4LrDlqMSQ",
      },
      {
        id: "counter",
        feedback:
          "Your current approach is reactive — develop set plays to dictate the rally instead of reacting to it.",
        videoId: "strategy-education-video",
        youtubeId: "fQRDnvNaM3A",
      },
    ],
  },
};
