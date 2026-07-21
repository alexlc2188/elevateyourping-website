import { Download } from "lucide-react";

export function DownloadButton({ url }: { url: string }) {
  return (
    <a
      href={url}
      download
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80">
      <Download className="w-4 h-4" />
      Download Video
    </a>
  );
}
