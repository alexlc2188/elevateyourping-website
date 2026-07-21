"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Play } from "lucide-react";
import VideoPlayer from "@/components/video-player";

type VideoItem = {
  title: string;
  videoId: string;
  description?: string;
};

type Props = {
  videos: VideoItem[];
  header: string;
  posterImage: string;
};

export const MatchReviewPage = ({ videos, header, posterImage }: Props) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 top-[80px] bg-white flex flex-col">
      <div className="mb-4">{/* <AppBreadcrumb /> */}</div>
      {/* Fixed player on top */}
      <div className="shrink-0">
        <VideoPlayer
          videoUrl={selectedVideoId}
          forcePlay={!!selectedVideoId}
          rounded={false}
          poster={posterImage}
          autoplay
        />
      </div>

      {/* Scrollable area below */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <h2 className="text-3xl font-bold mb-4 uppercase">{header}</h2>
        <div className="space-y-4">
          {videos.map((item, i) => (
            <Card
              key={i}
              onClick={() => setSelectedVideoId(item.videoId)}
              className={`cursor-pointer ${
                item.videoId === selectedVideoId
                  ? "ring-2 ring-[#5BACD7] bg-blue-50"
                  : ""
              }`}>
              <CardContent className="px-4">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{item.title}</h2>
                    {item.description && (
                      <p className="text-sm text-slate-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-8 w-9 h-9 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center transition shrink-0  ">
                    <Play className="w-4 h-4 text-slate-800" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
