"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type MatchResult = {
  date: string; // "May" or "2025-05-22"
  result: "win" | "loss";
  scoreDiff: number; // e.g. +5 for 11–6, –2 for 9–11
};

export function OpponentBarChart({ data }: { data: MatchResult[] }) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip
            formatter={(value: number, name: string) => [
              `Score Diff: ${value}`,
              "Match",
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Bar dataKey="scoreDiff">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.result === "win" ? "#22c55e" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
