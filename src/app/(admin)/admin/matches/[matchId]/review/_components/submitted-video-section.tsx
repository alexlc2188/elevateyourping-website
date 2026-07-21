"use client";

import { Match, MatchDetailedSetVideo } from "@prisma/client";
import React, { useState } from "react";
import VideoPlayer from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp, Play } from "lucide-react";

interface Props {
  match: Match & {
    detailedSetVideos?: (MatchDetailedSetVideo & {
      video?: { publicUrl?: string } | null
    })[] | null
  };
}

export const SubmittedVideoSection = ({ match }: Props) => {
  const { detailedSetVideos } = match;
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  
  // Get the videos from the detailedSetVideos relation
  const videos = detailedSetVideos?.map(setVideo => ({
    id: setVideo.videoId,
    setNumber: setVideo.setNumber,
    publicUrl: setVideo.video?.publicUrl
  })) || [];
  
  // Sort videos by set number
  videos.sort((a, b) => a.setNumber - b.setNumber);
  
  // Function to toggle video expansion
  const toggleVideo = (videoId: string) => {
    if (expandedVideo === videoId) {
      setExpandedVideo(null);
    } else {
      setExpandedVideo(videoId);
    }
  };
  
  // Get the video URL, either from the video object or generate it from the ID
  const getVideoUrl = (video: { id: string, publicUrl?: string | null }) => {
    if (video.publicUrl) return video.publicUrl;
    // Fallback to CDN URL pattern if no publicUrl is available
    return `https://d1rlkurvpkf4gj.cloudfront.net/${video.id}`;
  };

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Submitted Videos</h2>

      {videos.length > 0 ? (
        <div className="space-y-4">
          {videos.map((video) => (
            <div 
              key={video.id}
              className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                onClick={() => toggleVideo(video.id)}
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <Play size={16} />
                  </div>
                  <span className="font-medium">Set {video.setNumber}</span>
                </div>
                <div className="flex items-center">
                  <a
                    href={getVideoUrl(video)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-700 mr-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={18} />
                  </a>
                  {expandedVideo === video.id ? (
                    <ChevronUp size={18} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-500" />
                  )}
                </div>
              </div>
              
              {expandedVideo === video.id && (
                <div className="p-4 pt-0">
                  <div className="relative aspect-video overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                    <VideoPlayer
                      videoUrl={getVideoUrl(video)}
                      controls={true}
                      rounded={true}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 border border-slate-200 border-dashed rounded-lg bg-slate-50 text-center">
          <p className="text-slate-500">No videos submitted yet.</p>
        </div>
      )}
    </section>
  );
};
