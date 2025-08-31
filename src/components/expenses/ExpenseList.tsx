"use client";
import { Pencil, Trash2 } from "lucide-react";
import { Expense } from "@/api/types";

export type ExpenseListProps = {
  expenses: Expense[];
  loading: boolean;
  error: string;
  onEdit: (exp: Expense) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
};

export default function ExpenseList({
  expenses,
  loading,
  error,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Desktop Loading Skeleton */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4 py-3 px-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="py-3 px-4">
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex gap-1">
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-12"></div>
                  </div>
                  <div className="flex justify-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Loading Skeleton - Ultra compact */}
        <div className="md:hidden space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm"
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className="h-3.5 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-3.5 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="flex gap-1 mb-1.5">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-10"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                </div>
                <div className="flex gap-1">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-8"></div>
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div className="text-base text-red-600 mb-3">{error}</div>;
  if (expenses.length === 0)
    return (
      <div className="text-base text-gray-500 border border-dashed border-gray-300 rounded-lg p-6 text-center">
        No expenses yet. Click <span className="font-medium">Add Expense</span>{" "}
        to create one.
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="py-3 px-4 text-left font-semibold min-w-[200px]">
                  Expense Details
                </th>
                <th className="py-3 px-4 text-right font-semibold min-w-[100px]">
                  Amount
                </th>
                <th className="py-3 px-4 text-center font-semibold min-w-[90px]">
                  Date
                </th>
                <th className="py-3 px-4 text-center font-semibold min-w-[80px]">
                  Time
                </th>
                <th className="py-3 px-4 text-left font-semibold min-w-[150px]">
                  Categories
                </th>
                <th className="py-3 px-4 text-center font-semibold min-w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((exp) => {
                const categoryNames: string[] = exp.categories?.length
                  ? exp.categories.map((c) => c.name)
                  : exp.category_name
                  ? exp.category_name
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : [];
                return (
                  <tr
                    key={exp.id}
                    className="hover:bg-indigo-50/40 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate text-sm">
                          {exp.title}
                        </div>
                        {exp.description && (
                          <div className="text-xs text-gray-500 truncate mt-1">
                            {exp.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-gray-900">
                        ₹{Number(exp.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600 text-xs">
                      {exp.expense_date}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600 text-xs">
                      {exp.expense_time}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {categoryNames.length === 0 && (
                          <span className="text-xs text-gray-400 italic">
                            No categories
                          </span>
                        )}
                        {categoryNames.slice(0, 2).map((name) => (
                          <span
                            key={name}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200"
                          >
                            {name}
                          </span>
                        ))}
                        {categoryNames.length > 2 && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            +{categoryNames.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(exp)}
                          className="p-2 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 transition-colors"
                          title="Edit expense"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(exp.id)}
                          className="p-2 rounded-md bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards - Ultra compact design */}
      <div className="md:hidden space-y-2">
        {expenses.map((exp) => {
          const cats: string[] = exp.categories?.length
            ? exp.categories.map((c) => c.name)
            : exp.category_name
            ? exp.category_name
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [];
          return (
            <div
              key={exp.id}
              className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm"
            >
              {/* Title and Amount in single line */}
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="font-semibold text-gray-900 text-sm truncate flex-1 mr-2">
                  {exp.title}
                </h3>
                <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                  ₹{Number(exp.amount).toFixed(2)}
                </span>
              </div>

              {/* Categories in compact row */}
              {cats.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {cats.slice(0, 2).map((c) => (
                    <span
                      key={c}
                      className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium"
                    >
                      {c}
                    </span>
                  ))}
                  {cats.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      +{cats.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* Date, time and actions in compact row */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex gap-3">
                  <span>{exp.expense_date}</span>
                  <span>{exp.expense_time}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(exp)}
                    className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-medium hover:bg-indigo-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(exp.id)}
                    className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
