"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type MatchPerformance = {
  date: string; // "2025-05-01"
  result: "win" | "loss";
  scoreDiff?: number; // e.g., +3 or -4
};

export function OpponentPerformanceChart({
  data,
}: {
  data: MatchPerformance[];
}) {
  const chartData = data.map((match) => ({
    date: match.date,
    score: match.result === "win" ? 1 : 0,
  }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis
            domain={[0, 1]}
            ticks={[0, 1]}
            tickFormatter={(v) => (v === 1 ? "Win" : "Loss")}
          />
          <Tooltip formatter={(val: any) => (val === 1 ? "Win" : "Loss")} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
