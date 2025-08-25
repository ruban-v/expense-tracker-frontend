"use client";

import { useEffect, useState } from "react";
import { expenseApi } from "@/api/api";
import { Dashboard } from "@/api/types";
import MonthlySummaryChart from "@/components/dashboard/MonthlySummaryChart";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken") || "";
      const response = await expenseApi.getDashboard(token);
      console.log("Dashboard response:", response.data);
      setDashboard(response.data);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="mt-2 text-lg text-gray-600">
            Loading your dashboard...
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-6 shadow-md animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="mt-2 text-lg text-red-600">{error}</p>
        </div>
        <div className="text-center">
          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard || !dashboard.summary) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="mt-2 text-lg text-gray-600">
            No dashboard data available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-gray-800">Welcome Back!</h2>
        <p className="mt-2 text-lg text-gray-600">
          Here&apos;s a summary of your financial activity.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-base font-medium text-gray-500">
            Total Expenses
          </h4>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            ₹{dashboard.summary.total_amount.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {dashboard.summary.total_expenses} transactions
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-base font-medium text-gray-500">This Month</h4>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            ₹{dashboard.summary.current_month_amount.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {dashboard.summary.current_month_count} transactions
          </p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-base font-medium text-gray-500">This Week</h4>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            ₹{dashboard.summary.current_week_amount.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {dashboard.summary.current_week_count} transactions
          </p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Today's Expenses */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Today</h4>
          <p className="text-2xl font-bold text-gray-800">
            ₹{dashboard.summary.today_amount.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {dashboard.summary.today_count} transactions today
          </p>
        </div>

        {/* Weekly Summary */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Weekly Summary
          </h4>
          <div className="space-y-3">
            {dashboard.weekly_summary && dashboard.weekly_summary.length > 0 ? (
              dashboard.weekly_summary.slice(0, 3).map((week, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{week.week}</span>
                  <span className="font-semibold text-black">
                    ₹{week.total.toLocaleString("en-IN")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No weekly data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      {dashboard.monthly_summary && dashboard.monthly_summary.length > 0 && (
        <MonthlySummaryChart data={dashboard.monthly_summary} />
      )}

      {/* Recent Expenses */}
      {dashboard.recent_expenses && dashboard.recent_expenses.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Expenses
          </h4>
          <div className="space-y-3">
            {dashboard.recent_expenses.slice(0, 5).map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <span className="font-medium text-gray-800">
                    {expense.title}
                  </span>
                  <div className="text-sm text-gray-500">
                    {expense.expense_date} • {expense.expense_time}
                  </div>
                </div>
                <span className="font-semibold text-gray-800">
                  ₹{expense.amount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Summary */}
      {dashboard.daily_summary && dashboard.daily_summary.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Daily Summary
          </h4>
          <div className="space-y-3">
            {dashboard.daily_summary.slice(0, 7).map((day, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-700">{day.day}</span>
                <span className="font-semibold text-gray-800">
                  ₹{day.total.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
