"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface Props {
  className?: string;
}

export const BackButton = ({ className }: Props) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      className={cn(
        "p-2 text-sm font-medium  flex items-center cursor-pointer",
        className && className,
      )}>
      <ArrowLeft className="w-5 h-5 mr-1" />
      Back
    </Button>
  );
};
