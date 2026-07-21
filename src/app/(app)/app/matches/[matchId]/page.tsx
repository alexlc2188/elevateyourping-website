import { AppBreadcrumb } from "@/components/app/AppBreadcrumb";
import { MatchTabsLayout } from "./_components/MatchTabsLayout";
import { prismaDb } from "@/lib/db";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";

export type MatchWithPayload = Prisma.MatchGetPayload<{
  include: {
    highlightVideo: {
      select: {
        publicUrl: true;
        streamingUrl: true;
        encodingStatus: true;
      };
    };
    reviewVideo: {
      select: {
        publicUrl: true;
        streamingUrl: true;
        encodingStatus: true;
      };
    };
    shortSetVideos: {
      include: {
        video: {
          select: {
            publicUrl: true;
            streamingUrl: true;
            encodingStatus: true;
          };
        };
      };
    };
    detailedSetVideos: {
      include: {
        video: {
          select: {
            publicUrl: true;
            streamingUrl: true;
            encodingStatus: true;
          };
        };
      };
    };
    trainingPlan: {
      include: {
        exercises: {
          include: {
            trainingExercise: {
              include: {
                mainVideo: {
                  select: {
                    publicUrl: true;
                    streamingUrl: true;
                    encodingStatus: true;
                  };
                };
                previewVideo: {
                  select: {
                    publicUrl: true;
                    streamingUrl: true;
                    encodingStatus: true;
                  };
                };
                tags: {
                  include: {
                    tag: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export default async function MatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ matchId }, { tab }] = await Promise.all([params, searchParams]);

  let match;

  try {
    match = await prismaDb.match.findUnique({
      where: { id: matchId },
      include: {
        highlightVideo: {
          select: {
            publicUrl: true,
            streamingUrl: true,
            encodingStatus: true,
          },
        },
        reviewVideo: {
          select: {
            publicUrl: true,
            streamingUrl: true,
            encodingStatus: true,
          },
        },
        shortSetVideos: {
          include: {
            video: {
              select: {
                publicUrl: true,
                streamingUrl: true,
                encodingStatus: true,
              },
            },
          },
        },
        detailedSetVideos: {
          include: {
            video: {
              select: {
                publicUrl: true,
                streamingUrl: true,
                encodingStatus: true,
              },
            },
          },
        },
        trainingPlan: {
          include: {
            exercises: {
              include: {
                trainingExercise: {
                  include: {
                    mainVideo: {
                      select: {
                        publicUrl: true,
                        streamingUrl: true,
                        encodingStatus: true,
                      },
                    },
                    previewVideo: {
                      select: {
                        publicUrl: true,
                        streamingUrl: true,
                        encodingStatus: true,
                      },
                    },
                    tags: {
                      include: {
                        tag: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }

  if (!match) return notFound();

  return (
    <div className={`w-full h-full bg-slate-100`}>
      <div className="max-w-screen-xl mx-auto pl-4">
        <AppBreadcrumb opponentName={match.opponentName ?? "UNKNOWN"} />
      </div>

      <MatchTabsLayout match={match} matchId={matchId} />
    </div>
  );
}
