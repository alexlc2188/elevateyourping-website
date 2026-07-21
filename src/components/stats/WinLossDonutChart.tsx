"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function WinLossDonutChart({
  wins,
  losses,
}: {
  wins: number;
  losses: number;
}) {
  const total = wins + losses;
  const winRate = total ? Math.round((wins / total) * 100) : 0;

  const data = [
    { name: "Wins", value: wins, color: "#22c55e" },
    { name: "Losses", value: losses, color: "#ef4444" },
  ];

  return (
    <div className="w-full h-40 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
          
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={55}
            paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}`, name]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-lg font-semibold">{winRate}%</div>
        <div className="text-xs text-muted-foreground">Win Rate</div>
      </div>
    </div>
  );
}
