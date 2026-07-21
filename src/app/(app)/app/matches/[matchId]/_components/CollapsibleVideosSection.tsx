"use client";
import { useState } from "react";
import { MatchWithPayload } from "../page";
import { ChevronDown, ChevronUp } from "lucide-react";
import { VideosColumn } from "./VideosColumn";

export const CollapsibleVideosSection = ({
  match,
}: {
  match: MatchWithPayload;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if there are any videos to show
  // Prioritize shortSetVideos (processed), fallback to detailedSetVideos (original)
  const videos =
    match.shortSetVideos && match.shortSetVideos.length > 0
      ? match.shortSetVideos
      : match.detailedSetVideos || [];
  const hasVideos = videos.length > 0;

  if (!hasVideos) return null;

  return (
    <div className="hidden lg:block mt-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-100/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                  Your Match Videos
                </h3>
                <p className="text-sm  text-slate-600">
                  {videos.length} video
                  {videos.length !== 1 ? "s" : ""} uploaded
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-600 font-medium">
                {isExpanded ? "Hide" : "Show"}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
              ) : (
                <ChevronDown className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
              )}
            </div>
          </button>

          {isExpanded && (
            <div className="border-t border-blue-100 bg-white">
              <div className="p-6">
                <VideosColumn match={match} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
