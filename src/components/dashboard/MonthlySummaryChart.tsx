"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlySummary } from "@/api/types";

interface MonthlySummaryChartProps {
  data?: MonthlySummary[];
}

export default function MonthlySummaryChart({
  data,
}: MonthlySummaryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="text-xl font-semibold text-gray-800">
          Monthly Expense Summary
        </h3>
        <div className="mt-4 flex h-80 w-full items-center justify-center">
          <p className="text-gray-500">No data available for the chart.</p>
        </div>
      </div>
    );
  }

  // Format the data for the chart
  const chartData = data.map((item) => ({
    month: formatMonth(item.month),
    total: item.total,
  }));

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">
        Monthly Expense Summary
      </h3>
      <div className="mt-4 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 14 }} />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 14 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(239, 246, 255, 0.5)" }}
              contentStyle={{
                borderRadius: "0.5rem",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                border: "1px solid #E5E7EB",
              }}
              formatter={(value) => [
                `₹${Number(value).toFixed(2)}`,
                "Total Expenses",
              ]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar
              dataKey="total"
              fill="#4F46E5"
              name="Total Expenses"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Helper function to format month from "Aug 2025" format
function formatMonth(monthStr: string): string {
  try {
    // Handle format like "Aug 2025"
    return monthStr;
  } catch {
    // Fallback if format is different
    return monthStr;
  }
}
