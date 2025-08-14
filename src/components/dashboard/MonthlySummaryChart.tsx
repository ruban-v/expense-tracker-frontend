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

const mockData = [
  { month: "Jun 2025", total: 1543.75 },
  { month: "Jul 2025", total: 950.5 },
  { month: "Aug 2025", total: 1200.0 },
  { month: "Sep 2025", total: 1800.25 },
  { month: "Oct 2025", total: 1100.0 },
  { month: "Nov 2025", total: 2150.8 },
];

export default function MonthlySummaryChart() {
  //   const { data, error, isLoading } = useSWR('/api/expenses/summary/monthly', fetcher);

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">
        Monthly Expense Summary
      </h3>
      <div className="mt-4 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockData}
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
              formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Total"]}
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
