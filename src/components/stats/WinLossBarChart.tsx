"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

type WinLossChartProps = {
  wins: number;
  losses: number;
};

export function WinLossBarChart({ wins, losses }: WinLossChartProps) {
  const data = [
    { label: "Wins", value: wins, color: "#22c55e" }, // green
    { label: "Losses", value: losses, color: "#ef4444" }, // red
  ];

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" fontSize={12} interval={0} />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip
            formatter={(value: number, name: string) => [`${value}`, name]}
          />
          <Bar dataKey="value" barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
