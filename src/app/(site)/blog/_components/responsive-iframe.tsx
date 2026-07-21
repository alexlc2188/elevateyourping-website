"use client";
export const ResponsiveIframe = ({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) => {
  if (!youtubeId) return null;
  return (
    <div className="relative w-full pb-[56.25%]">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen></iframe>
    </div>
  );
};
