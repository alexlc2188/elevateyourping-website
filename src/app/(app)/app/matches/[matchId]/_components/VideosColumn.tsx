"use client";
import VideoPlayer from "@/components/video-player";
import { VideoDownloadButton } from "@/components/video-download-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchWithPayload } from "../page";
import { MatchOffer } from "@prisma/client";
import { getVideoUrl } from "@/lib/utils/video-url";
import { generateSetVideoFilename } from "@/lib/utils/video-filename";

const images = [
  "/images/setss/set1.jpg",
  "/images/setss/set2.jpg",
  "/images/setss/set3.jpg",
  "/images/setss/set4.jpg",
  "/images/setss/set5.jpg",
];

export function VideosColumn({ match }: { match: MatchWithPayload }) {
  // Determine which videos to show and their type
  const isUsingShortVideos =
    match.shortSetVideos && match.shortSetVideos.length > 0;
  const setVideos = isUsingShortVideos
    ? match.shortSetVideos
    : match.detailedSetVideos || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-900 md:text-xl lg:text-2xl   ">
            <h3>Your Match Videos</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {setVideos.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No videos uploaded for this match.
            </p>
          ) : (
            <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
              {setVideos.map((setVideo, index) => (
                <div key={setVideo.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium md:text-lg lg:text-xl">
                      Set {setVideo.setNumber || index + 1}
                    </h3>
                    {setVideo.video && (
                      <VideoDownloadButton
                        videoUrl={setVideo.video.publicUrl}
                        filename={generateSetVideoFilename(
                          match,
                          setVideo.setNumber || index + 1,
                        )}
                        variant="ghost"
                        size="sm"
                      />
                    )}
                  </div>
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <VideoPlayer
                      videoUrl={getVideoUrl(setVideo.video)}
                      poster={images[index % images.length]}
                      rounded={false}
                      autoplay={false}
                      controls={true}
                      showCaptureButton={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
