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
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
            Welcome Back!
          </h2>
          <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base lg:text-lg">
            Loading your dashboard...
          </p>
        </div>

        {/* Primary Cards Skeleton - 2x2 mobile, 4-in-a-row desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg bg-white p-4 shadow-md border border-gray-100 animate-pulse sm:p-5 lg:p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-3 bg-gray-200 rounded w-16 sm:h-4 sm:w-20 lg:h-3 lg:w-16"></div>
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded mb-2 sm:h-7 lg:h-6"></div>
              <div className="h-3 bg-gray-200 rounded w-24 sm:h-3 sm:w-28 lg:h-3 lg:w-20"></div>
            </div>
          ))}
        </div>

        {/* Secondary Cards Skeleton - 1 column mobile, 3 columns desktop */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={`secondary-${i}`}
              className="rounded-lg bg-white p-4 shadow-md border border-gray-100 animate-pulse sm:p-5 lg:p-4"
            >
              <div className="h-4 bg-gray-200 rounded mb-3 w-24 sm:h-5 sm:w-32 lg:h-4 lg:w-24"></div>
              <div className="space-y-2 lg:space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-16 sm:h-3 sm:w-20 lg:h-3 lg:w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 sm:h-3 sm:w-16 lg:h-3 lg:w-12"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100 animate-pulse sm:p-5 lg:p-6">
          <div className="h-4 bg-gray-200 rounded mb-3 w-40 sm:h-5 sm:w-48 lg:h-5 lg:w-52"></div>
          <div className="h-48 bg-gray-200 rounded sm:h-60 lg:h-80"></div>
        </div>

        {/* Additional Content Skeletons */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-4">
          {[1, 2].map((i) => (
            <div
              key={`extra-${i}`}
              className="rounded-lg bg-white p-4 shadow-md border border-gray-100 animate-pulse sm:p-5 lg:p-6"
            >
              <div className="h-4 bg-gray-200 rounded mb-3 w-32 sm:h-5 sm:w-40 lg:h-5 lg:w-36"></div>
              <div className="space-y-2 sm:space-y-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div
                    key={j}
                    className="flex justify-between items-center py-1"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="h-3 bg-gray-200 rounded mb-1 w-3/4 sm:h-4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2 sm:h-3"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-16 sm:h-4 sm:w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
            Welcome Back!
          </h2>
          <p className="mt-1 text-sm text-red-600 sm:mt-2 sm:text-base lg:text-lg">
            {error}
          </p>
        </div>
        <div className="text-center">
          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard || !dashboard.summary) {
    return (
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
            Welcome Back!
          </h2>
          <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base lg:text-lg">
            No dashboard data available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
          Welcome Back!
        </h2>
        <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base lg:text-lg">
          Here&apos;s a summary of your financial activity.
        </p>
      </div>

      {/* Summary Cards - Responsive Layout: 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-4">
        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow sm:p-5 lg:p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-500 sm:text-base lg:text-sm">
              Today
            </h4>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl">
            ₹{dashboard.summary.today_amount.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-500 mt-1 sm:text-sm lg:text-xs">
            {dashboard.summary.today_count} transactions
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow sm:p-5 lg:p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-500 sm:text-base lg:text-sm">
              Total Expenses
            </h4>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <p className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl">
            ₹{dashboard.summary.total_amount.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-500 mt-1 sm:text-sm lg:text-xs">
            {dashboard.summary.total_expenses} transactions
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow sm:p-5 lg:p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-500 sm:text-base lg:text-sm">
              This Week
            </h4>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
          <p className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl">
            ₹{dashboard.summary.current_week_amount.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-500 mt-1 sm:text-sm lg:text-xs">
            {dashboard.summary.current_week_count} transactions
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow sm:p-5 lg:p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-500 sm:text-base lg:text-sm">
              This Month
            </h4>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-xl font-bold text-gray-800 sm:text-2xl lg:text-xl">
            ₹{dashboard.summary.current_month_amount.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-500 mt-1 sm:text-sm lg:text-xs">
            {dashboard.summary.current_month_count} transactions
          </p>
        </div>
      </div>

      {/* Secondary Stats - Better desktop layout */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-4">
        {/* Weekly Summary */}
        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow sm:p-5 lg:p-4">
          <h4 className="text-base font-semibold text-gray-800 mb-3 sm:text-lg lg:text-base">
            Weekly Summary
          </h4>
          <div className="space-y-2 lg:space-y-3">
            {dashboard.weekly_summary && dashboard.weekly_summary.length > 0 ? (
              dashboard.weekly_summary.slice(0, 3).map((week, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 lg:text-sm">
                    {week.week}
                  </span>
                  <span className="font-semibold text-black text-sm lg:text-sm">
                    ₹{week.total.toLocaleString("en-IN")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-xs lg:text-sm">
                No weekly data yet
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow sm:p-5 lg:p-4">
          <h4 className="text-base font-semibold text-gray-800 mb-3 sm:text-lg lg:text-base">
            Quick Stats
          </h4>
          <div className="space-y-2 lg:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 lg:text-sm">
                Avg Daily
              </span>
              <span className="font-semibold text-black text-sm lg:text-sm">
                ₹
                {dashboard.summary.total_expenses > 0
                  ? Math.round(
                      dashboard.summary.total_amount / 30
                    ).toLocaleString("en-IN")
                  : "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 lg:text-sm">Activity</span>
              <span className="font-semibold text-green-600 text-sm lg:text-sm">
                {dashboard.summary.current_week_count > 0
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 lg:text-sm">Trend</span>
              <span className="font-semibold text-blue-600 text-sm lg:text-sm">
                {dashboard.summary.today_count > 0 ? "↑ Up" : "→ Stable"}
              </span>
            </div>
          </div>
        </div>

        {/* Performance - Now visible on all devices */}
        <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow sm:p-5 lg:p-4">
          <h4 className="text-base font-semibold text-gray-800 mb-3 sm:text-lg lg:text-base">
            Performance
          </h4>
          <div className="space-y-2 lg:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 lg:text-sm">
                Monthly Status
              </span>
              <span className="font-semibold text-purple-600 text-sm lg:text-sm">
                {dashboard.summary.current_month_count > 0 ? "Active" : "New"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 lg:text-sm">
                Weekly Avg
              </span>
              <span className="font-semibold text-indigo-600 text-sm lg:text-sm">
                ₹
                {dashboard.summary.current_week_count > 0
                  ? Math.round(
                      dashboard.summary.current_week_amount / 7
                    ).toLocaleString("en-IN")
                  : "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 lg:text-sm">Health</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-green-600 text-sm lg:text-sm">
                  Good
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      {dashboard &&
        dashboard.monthly_summary &&
        dashboard.monthly_summary.length > 0 && (
          <MonthlySummaryChart data={dashboard.monthly_summary} />
        )}

      {/* Recent Expenses */}
      {dashboard &&
        dashboard.recent_expenses &&
        dashboard.recent_expenses.length > 0 && (
          <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100 sm:p-5 lg:rounded-xl lg:p-6">
            <h4 className="text-base font-semibold text-gray-800 mb-2 sm:text-lg sm:mb-3 lg:mb-4">
              Recent Expenses
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {dashboard.recent_expenses.slice(0, 5).map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-800 text-sm sm:text-base truncate block">
                      {expense.title}
                    </span>
                    <div className="text-xs text-gray-500 sm:text-sm">
                      {expense.expense_date} • {expense.expense_time}
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800 text-sm sm:text-base ml-2">
                    ₹{expense.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Daily Summary */}
      {dashboard &&
        dashboard.daily_summary &&
        dashboard.daily_summary.length > 0 && (
          <div className="rounded-lg bg-white p-4 shadow-md border border-gray-100 sm:p-5 lg:rounded-xl lg:p-6">
            <h4 className="text-base font-semibold text-gray-800 mb-2 sm:text-lg sm:mb-3 lg:mb-4">
              Daily Summary
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {dashboard.daily_summary.slice(0, 7).map((day, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-700 text-sm sm:text-base">
                    {day.day}
                  </span>
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">
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
