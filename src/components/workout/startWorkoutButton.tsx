"use client";
import { Play } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function StartWorkoutButton({
  onStart,
}: {
  onStart: () => void;
}) {
  const [started, setStarted] = useState(false);

  const handleClick = () => {
    setStarted(true);
    onStart();
  };

  return (
    <Button
      onClick={handleClick}
      disabled={started}
      className="flex items-center gap-2 text-white bg-[#5BACD7] hover:bg-[#4BA0C7] rounded-full shadow-lg transition-all duration-200 ">
      <Play className="w-5 h-5" />
      {started ? "Started" : "Play All"}
    </Button>
  );
}
