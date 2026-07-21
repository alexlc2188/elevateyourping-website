"use client";
import React from "react";

type TagColor = "green" | "red" | "orange";

interface Props {
  text: string;
  color: TagColor;
}

const colorMap: Record<TagColor, string> = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
};

export const PromoTag = ({ text, color }: Props) => {
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${colorMap[color]}`}>
      {text}
    </span>
  );
};
