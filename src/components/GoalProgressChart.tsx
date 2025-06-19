// components/GoalProgressChart.tsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { parseISO, format, differenceInDays } from "date-fns";

export interface Contribution {
  date: string;    // ISO string, e.g. "2025-06-10"
  amount: number;
}
// import { Goal } from "../types"; // Adjust the import path as necessary

export interface GoalProgressChartProps {
  targetAmount: number;
  contributions: Contribution[];
  currencySymbol?: string;
}

const GoalProgressChart: React.FC<GoalProgressChartProps> = ({
  targetAmount,
  contributions,
  currencySymbol = "₹",
}) => {
  const data = useMemo(() => {
    const sorted = [...contributions].sort(
      (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
    );
    let running = 0;
    return sorted.map((c) => {
      running += c.amount;
      return {
        date: format(parseISO(c.date), "MMM yyyy"),
        saved: running,
      };
    });
  }, [contributions]);

const projection = useMemo(() => {
  if (data.length < 2) return "Add more contributions for a projection.";

  const first = parseISO(contributions[0].date);
  const last = parseISO(contributions[contributions.length - 1].date);
  const daysElapsed = Math.max(differenceInDays(last, first), 1);
  const totalSaved = data[data.length - 1].saved;

  if (totalSaved >= targetAmount) {
    return "Goal already reached 🎉";
  }

  const dailyRate = totalSaved / daysElapsed;
  const daysLeft = Math.ceil((targetAmount - totalSaved) / dailyRate);

  const months = Math.floor(daysLeft / 30);
  const days = daysLeft % 30;

  let parts = [];
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

  const timeStr = parts.join(" and ");

  return `At this rate you’ll hit your target in ~${timeStr}.`;
}, [data, contributions, targetAmount]);


  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Savings Over Time</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "#4A5568", fontSize: 12 }} />
            <YAxis
              domain={[0, targetAmount]}
              tickFormatter={(v) => `${currencySymbol}${Math.round(v / 1000)}k`}
              tick={{ fill: "#4A5568", fontSize: 12 }}
            />
            <Tooltip formatter={(val: number) => `${currencySymbol}${val.toLocaleString()}`} />
            <Line
              type="monotone"
              dataKey="saved"
              stroke="#4F46E5"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-gray-600 italic">{projection}</p>
    </div>
  );
};

export default GoalProgressChart;
