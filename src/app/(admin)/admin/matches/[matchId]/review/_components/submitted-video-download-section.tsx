import { Match } from "@prisma/client";
import React from "react";

interface Props {
  match: Match;
}

export const SubmittedVideoDownloadSection = ({ match }: Props) => {
  // const { videoSubmittedByUser } = match;

  // const videos = [videoSubmittedByUser];

  return (
    <div>NOT NEEDED</div>
    // <section className="mt-6">
    //   <h2 className="text-lg font-semibold mb-2">Submitted Videos</h2>

    //   {videos.length > 0 ? (
    //     <ul className="space-y-2">
    //       {videos.map((videoId, idx) => (
    //         <li
    //           key={videoId}
    //           className="flex items-center justify-between border p-3 rounded-md bg-muted/30">
    //           <span>Set {idx + 1}</span>
    //           <a
    //             href={`https://your-cdn.com/videos/${videoId}`} // Replace with real CDN base URL
    //             download
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             className="text-blue-600 hover:underline text-sm">
    //             Download
    //           </a>
    //         </li>
    //       ))}
    //     </ul>
    //   ) : (
    //     <p className="text-sm text-muted-foreground">
    //       No videos submitted yet.
    //     </p>
    //   )}
    // </section>
  );
};
