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
      <div className="rounded-lg bg-white p-4 shadow-md sm:p-5 lg:rounded-xl lg:p-6">
        <h3 className="text-base font-semibold text-gray-800 sm:text-lg lg:text-xl">
          Monthly Expense Summary
        </h3>
        <div className="mt-3 flex h-48 w-full items-center justify-center sm:mt-4 sm:h-60 lg:h-80">
          <p className="text-gray-500 text-sm sm:text-base">
            No data available for the chart.
          </p>
        </div>
      </div>
    );
  }

  // Format the data for the chart
  const chartData = data.map((item) => ({
    month: item.month,
    total: item.total,
  }));

  return (
    <div className="rounded-lg bg-white p-4 shadow-md sm:p-5 lg:rounded-xl lg:p-6">
      <h3 className="text-base font-semibold text-gray-800 sm:text-lg lg:text-xl">
        Monthly Expense Summary
      </h3>
      <div className="mt-3 h-48 w-full chart-container sm:mt-4 sm:h-60 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              className="sm:text-sm"
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
              className="sm:text-sm"
            />
            <Tooltip
              cursor={{ fill: "rgba(239, 246, 255, 0.5)" }}
              contentStyle={{
                borderRadius: "0.5rem",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                border: "1px solid #E5E7EB",
                fontSize: "14px",
              }}
              formatter={(value) => [
                `₹${Number(value).toFixed(2)}`,
                "Total Expenses",
              ]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "10px",
                fontSize: "14px",
              }}
            />
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
