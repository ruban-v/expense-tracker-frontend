import MonthlySummaryChart from "@/components/dashboard/MonthlySummaryChart";

export default function DashboardPage() {
  // Mock data
  const summaryData = {
    totalExpenses: 4694.75,
    totalTransactions: 28,
    averageExpense: 167.67,
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
        <p className="mt-1 text-gray-600">
          Here&apos;s a summary of your financial activity.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-sm font-medium text-gray-500">
            Total Spent (Last 3 Months)
          </h4>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            ₹{summaryData.totalExpenses.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-sm font-medium text-gray-500">
            Total Transactions
          </h4>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {summaryData.totalTransactions}
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-sm font-medium text-gray-500">Average Expense</h4>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            ₹{summaryData.averageExpense.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <MonthlySummaryChart />
    </div>
  );
}
