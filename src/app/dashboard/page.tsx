"use client";

import MonthlySummaryChart from "@/components/dashboard/MonthlySummaryChart";

// Mock data for the summary cards
const summaryData = {
  totalExpenses: 76543.21,
  totalTransactions: 123,
  averageExpense: 622.3,
};

// Mock data for the chart
const mockMonthlyData = [
  { month: "Jan", total: 4000 },
  { month: "Feb", total: 3000 },
  { month: "Mar", total: 5000 },
  { month: "Apr", total: 4500 },
  { month: "May", total: 6000 },
  { month: "Jun", total: 5500 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-gray-800">Welcome Back!</h2>
        <p className="mt-2 text-lg text-gray-600">
          Here&apos;s a summary of your financial activity.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-base font-medium text-gray-500">
            Total Spent (Last 3 Months)
          </h4>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            ₹{summaryData.totalExpenses.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-base font-medium text-gray-500">
            Total Transactions
          </h4>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {summaryData.totalTransactions}
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-base font-medium text-gray-500">
            Average Expense
          </h4>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            ₹{summaryData.averageExpense.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <MonthlySummaryChart data={mockMonthlyData} />
    </div>
  );
}

