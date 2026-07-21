"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MultiVideoUploader({
  onUpload,
}: {
  onUpload: (files: File[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const handleUploadClick = () => {
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileChange}
      />

      {files.length > 0 && (
        <ul className="list-disc ml-4 text-sm text-muted-foreground">
          {files.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleUploadClick();
        }}
        disabled={files.length === 0}>
        Upload Videos
      </Button>
    </div>
  );
}
