// components/admin/tags/tag-button.tsx
"use client";

import { startTransition, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { deleteTagAction } from "@/actions/admin/tagActions";
import { toast } from "sonner";

export function TagButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = confirm(`Delete tag "${name}"?`);
    if (!confirmed) return;

    startTransition(() => {
      deleteTagAction(id).then((res) => {
        if (res.success) {
          router.refresh();
          toast.success("Tag deleted!");
        } else {
          toast.error("Failed to delete tag.");
        }
      });
    });
  };

  return (
    <button
      onClick={handleDelete}
      className={cn(
        "bg-secondary text-sm px-3 py-1 rounded-full border text-white flex items-center gap-1 cursor-pointer",
        isPending && "opacity-50 pointer-events-none",
      )}>
      <span>{name}</span>
      <Trash2 className="w-3.5 h-3.5 text-white/80 hover:text-white" />
    </button>
  );
}
