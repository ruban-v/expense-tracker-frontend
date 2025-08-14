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
  if (loading)
    return (
      <div className="text-sm text-indigo-500 animate-pulse">
        Loading expenses...
      </div>
    );
  if (error) return <div className="text-sm text-red-600 mb-3">{error}</div>;
  if (expenses.length === 0)
    return (
      <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-4 text-center">
        No expenses yet. Click <span className="font-medium">Add Expense</span>{" "}
        to create one.
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wide">
            <tr>
              <th className="py-2.5 px-3 text-left font-semibold w-[25%]">
                Title
              </th>
              <th className="py-2.5 px-3 text-right font-semibold w-[12%]">
                Amount
              </th>
              <th className="py-2.5 px-3 text-center font-semibold w-[12%]">
                Date
              </th>
              <th className="py-2.5 px-3 text-center font-semibold w-[10%]">
                Time
              </th>
              <th className="py-2.5 px-3 text-left font-semibold w-[28%]">
                Category
              </th>
              <th className="py-2.5 px-3 text-center font-semibold w-[13%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
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
                  className="border-t border-gray-100 hover:bg-indigo-50/40 transition-colors"
                >
                  <td className="py-2 px-3 font-medium text-gray-800 truncate">
                    <div className="truncate">{exp.title}</div>
                    {exp.description && (
                      <div className="text-[10px] text-gray-500 truncate">
                        {exp.description}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3 text-gray-700 text-right font-medium">
                    ₹ {Number(exp.amount).toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-gray-600 text-center">
                    {exp.expense_date}
                  </td>
                  <td className="py-2 px-3 text-gray-600 text-center">
                    {exp.expense_time}
                  </td>
                  <td className="py-2 px-3 text-gray-600">
                    <div className="flex flex-wrap gap-1">
                      {categoryNames.length === 0 && (
                        <span className="text-[10px] text-gray-400 italic">
                          No categories
                        </span>
                      )}
                      {categoryNames.map((name) => (
                        <span
                          key={name}
                          className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-indigo-600/90 text-white shadow-sm hover:shadow transition-all hover:-translate-y-0.5 hover:bg-indigo-600 focus:outline-none"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex justify-center gap-1.5">
                      <button
                        onClick={() => onEdit(exp)}
                        className="p-1 rounded-md bg-white border border-gray-200 text-indigo-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-sm transition-colors focus:ring-2 focus:ring-indigo-400"
                        title="Edit"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => onDelete(exp.id)}
                        className="p-1 rounded-md bg-white border border-gray-200 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm transition-colors focus:ring-2 focus:ring-red-400"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-2.5">
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
              className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col gap-1.5"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 truncate text-sm">
                    {exp.title}
                  </div>
                  {exp.description && (
                    <div className="text-[10px] text-gray-500 truncate">
                      {exp.description}
                    </div>
                  )}
                </div>
                <div className="text-right text-sm font-medium text-gray-700">
                  ₹ {Number(exp.amount).toFixed(2)}
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {cats.length === 0 && (
                  <span className="text-[9px] text-gray-400 italic">
                    No categories
                  </span>
                )}
                {cats.map((c) => (
                  <span
                    key={c}
                    className="px-1.5 py-0.5 bg-indigo-600/90 text-white rounded-full text-[9px] font-medium shadow-sm hover:shadow transition-all hover:-translate-y-0.5 hover:bg-indigo-600"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-500">
                <span>{exp.expense_date}</span>
                <span>{exp.expense_time}</span>
              </div>
              <div className="flex gap-1.5 pt-0.5">
                <button
                  onClick={() => onEdit(exp)}
                  className="flex-1 py-1 text-[10px] rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(exp.id)}
                  className="flex-1 py-1 text-[10px] rounded-md bg-red-50 hover:bg-red-100 text-red-600 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
