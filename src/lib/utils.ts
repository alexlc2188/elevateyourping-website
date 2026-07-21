import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Enter time in seconds
 */
export const formatTime = (s: number) => {
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;

  // if no leftover seconds, just show “X min”
  if (seconds === 0) {
    return `${minutes} min`;
  }

  // otherwise show “m:ss”
  const secStr = seconds.toString().padStart(2, "0");
  return `${minutes}:${secStr} min`;
};

export const isSafari = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const convertDateToString = (date: Date) =>
  format(new Date(date), "dd/MM/yyyy");

type MatchOutcome = {
  result: "win" | "loss" | "draw";
  colorClass: string; // tailwind classes for styling
};

export function getMatchOutcome(score: string): MatchOutcome {
  const cleanedScore = score.replace(/[–—−]/g, "-"); // normalize dash
  const [left, right] = cleanedScore.split("-").map(Number);

  if (isNaN(left) || isNaN(right)) {
    return {
      result: "draw",
      colorClass: "bg-slate-200 text-slate-600",
    };
  }

  if (left > right) {
    return {
      result: "win",
      colorClass: "bg-green-200 text-green-700",
    };
  }

  if (right > left) {
    return {
      result: "loss",
      colorClass: "bg-red-200 text-red-700",
    };
  }

  return {
    result: "draw",
    colorClass: "bg-slate-200 text-slate-600",
  };
}


