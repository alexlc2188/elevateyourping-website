export type AnalysisId = "serve-return" | "first-contact" | "rally" | "counter";

export const ANALYSIS_LABELS: Record<AnalysisId, string> = {
  "serve-return": "Serve and return",
  "first-contact": "First contact",
  rally: "Rally",
  counter: "Counter strategy",
};

export type TrainingStepType =
  | "technique"
  | "rally"
  | "serve"
  | "return"
  | "footwork";

export type IconType = "table" | "fitness" | "insights";

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

export type TrainingStep = {
  /** duration in sec for the exercise */
  duration: number;
  label: string;
  drillNumber?: number;
  thumbnail: string;
  /** 10 sec preview */
  previewId: string;
  /** long form video */
  videoId: string;
  type: TrainingStepType;
  iconType: IconType;
  description: string;
  /** Optional: shown instead of time when type is 'footwork' */
  reps?: {
    sets: number;
    repetitions: number;
  };
};

export type CoachReview = {
  highlightVideoId: string;
  coachInsightsVideoId: string;
  summary: Summary;
  sets: SetReview[];
  analysis: Analysis[];
  trainingPlan?: TrainingStep[];
};

export type CoachingReview = {
  firstName: string;
  lastName: string;
  matches: Record<string, CoachReview>; // matchId as key
};

// reviewId: "efdd4b2c73c7d09a9b282b797b621ac5"

export const users: Record<string, CoachingReview> = {
  daniel: {
    firstName: "Daniel",
    lastName: "Admon",
    matches: {
      "vs-pierre": {
        highlightVideoId: "7b36b2ab980876cfded140a4fd6680a2",
        coachInsightsVideoId: "2fc9804c2e1e841dbe5e245bedfea6e7",
        summary: {
          summary: `Against Pierre, you showed strong service variation but struggled in third ball attacks. Focus on stepping in earlier on long pushes.`,
          videoId: "5bb6919d1f12a9adbc837146b7e1d674", // TODO: replace with post match video
        },
        sets: [
          {
            setNumber: 1,
            videoId: "5bb6919d1f12a9adbc837146b7e1d674",
            comment:
              "Missed key backhand receives and struggled under pressure on long serves.",
          },
          {
            setNumber: 2,
            videoId: "24614529328bde5933f4aca0cb153df5",
            comment:
              "Adapted to backspin rallies but missed chances during sudden third-ball attacks.",
          },
          {
            setNumber: 3,
            videoId: "6535754e058e512a78a6fa41f16bc378",
            comment:
              "Strong loop placement and offensive rhythm led to a dominant set win.",
          },
          {
            setNumber: 4,
            videoId: "13e52a47b9375d9f7b6b09d031bb4e83",
            comment:
              "Maintained aggressive play but positioning errors led to missed finishing shots.",
          },
          {
            setNumber: 5,
            videoId: "ef03e3eeb2f2a4f403b0763b0f949478",
            comment:
              "Took early control and stayed consistent to close out the match confidently.",
          },
        ],
        analysis: [
          {
            id: "serve-return",
            feedback: "Improve variation between short and fast long serves.",
            videoId: "vid01",
            youtubeId: "abc123",
          },
          {
            id: "rally",
            feedback: "Use more pivot forehands to break opponent's rhythm.",
            videoId: "vid02",
            youtubeId: "def456",
          },
        ],
        trainingPlan: [
          {
            duration: 300, // add back to 300
            label: "Backhand Drive",
            drillNumber: 1,
            previewId: "1c9b5694c6e45908ec851a85128c686e",
            videoId: "5456ce97d71313e82305946bef1e94f6",
            thumbnail: "/stills/technique-1.jpg",
            type: "technique",
            iconType: "table",
            description:
              "Backhand drive drill. Start with a neutral elbow. Bend your wrist slightly back, then brush over the ball as your forearm extends forward. Repeat the motion — wrist back, brush forward — for consistent, controlled shots.",
          },
          {
            duration: 300,
            label: "Forehand Loop",
            drillNumber: 2,
            previewId: "5d5867f598557fcbe3f4eed6c2e3822c",
            videoId: "751b04c8bdc4294c44fb0b753fbe527b",
            thumbnail: "/stills/technique-2.jpg",
            type: "technique",
            iconType: "table",
            description:
              "Practice your forehand loop with a strong backswing and full weight shift. Start low, rotate the waist, and drive forward into the ball. Stay centered, stay aggressive.",
          },
          {
            duration: 420,
            label: "Backhand to Pivot",
            drillNumber: 2,
            previewId: "39ba201c3085b25e6e0bc8d1d363c384",
            videoId: "c29fad932b8caffe348e58bd4923fa90",
            thumbnail: "/stills/rally-1.jpg",
            type: "rally",
            iconType: "table",
            description:
              "Two backhand drives, then pivot hard into two forehand loops. Focus on speed, space, and full commitment to attack off the backhand side.",
          },
          {
            duration: 420,
            label: "BH/FH Transition",
            drillNumber: 2,
            previewId: "8931366062900b718485ae6f827c6e7d",
            videoId: "8a7154f86fccecb2c429236025f7af11",
            thumbnail: "/stills/rally-2.jpg",
            type: "rally",
            iconType: "table",
            description:
              "One backhand drive, sidestep, one forehand loop — then reset. Stay low, move in a triangle, and focus on smooth transitions between both sides.",
          },
          {
            duration: 420,
            label: "Short Serve Attack",
            drillNumber: 2,
            previewId: "fb269a6f8856bfdbf8472fcc64a2c071",
            videoId: "0cefc4ddd1e0420984e39c73036f8ecb",
            thumbnail: "/stills/serve-1.jpg",
            type: "serve",
            iconType: "table",
            description:
              "Short backspin serve to the forehand topspin to open, then step back and finish strong with your backhand. Take control early.",
          },
          {
            duration: 420,
            label: "Long Serve Pivot",
            drillNumber: 2,
            previewId: "a08b57f4602250b9c6b892534c8ecf9d",
            videoId: "c03793e52949229979689ed299085412",
            thumbnail: "/stills/serve-2.jpg",
            type: "serve",
            iconType: "table",
            description:
              "Fast long serve to the backhand, pivot quickly, and attack the third ball strong. Aim to win the point early or set up an easy finish.",
          },
          {
            duration: 300,
            label: "Return Backspin",
            drillNumber: 2,
            previewId: "2d77d0fd7fdff8e3ab2cc8d81a8e8519",
            videoId: "",
            thumbnail: "/stills/nice.jpg",
            type: "return",
            iconType: "table",
            description:
              "Practice receiving long backspin serves to your forehand. Stay low, brush up on contact, and transfer your weight forward for a spinny open-up.",
          },
          {
            duration: 300,
            label: "Return to Middle",
            drillNumber: 2,
            previewId: "51d14529b6ef48c8fa7e7125a69d5524",
            videoId: "",
            thumbnail: "/stills/return-1.jpg",
            type: "return",
            iconType: "table",
            description:
              "React fast to a surprise long serve to the middle. Stay low, pivot quickly, and use a compact forehand loop to return with timing and control.",
          },
          {
            duration: 360,
            label: "Side Steps",
            drillNumber: 2,
            previewId: "aebf2b8da29e1a2748a1f0a45467541d",
            videoId: "",
            thumbnail: "/stills/footwork-1.jpg",
            type: "footwork",
            iconType: "fitness",
            description:
              "Practice your side steps with a low stance. Push off each leg to move left and right—stay light on your toes and repeat for 20 reps!",
            reps: {
              sets: 3,
              repetitions: 20,
            },
          },
          {
            duration: 360,
            label: "Pivot Drill",
            drillNumber: 2,
            previewId: "5bef47e975b758ce6f1c7004c6716ae0",
            videoId: "",
            thumbnail: "/stills/footwork-2.jpg",
            type: "footwork",
            iconType: "fitness",
            description:
              "Work on your pivot by loading your back leg, right for right-handers, left for lefties, rotate across, then return to ready position. Smooth, quick, and controlled for 20 reps!",
            reps: {
              sets: 3,
              repetitions: 15,
            },
          },
        ],
      },
    },
  },
};
