"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

type MoodPerformance = {
  mood: "Happy" | "Neutral" | "Frustrated";
  Win: number;
  Loss: number;
};

const moodColors = {
  Win: "#22c55e", // green
  Loss: "#ef4444", // red
};

export function MoodVsPerformanceChart({ data }: { data: MoodPerformance[] }) {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mood" fontSize={12} />
          <YAxis
            allowDecimals={false}
            fontSize={12}
            label={{
              value: "Matches",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: {
                textAnchor: "middle",
                fontSize: 12,
                fill: "#6b7280", // muted-foreground
              },
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="Win" fill={moodColors.Win} />
          <Bar dataKey="Loss" fill={moodColors.Loss} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
