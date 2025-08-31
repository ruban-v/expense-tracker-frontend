"use client";
import { useEffect, useState, useCallback } from "react";
import { Plus, X, RefreshCw } from "lucide-react";
import { categoryApi, expenseApi } from "@/api/api";
import { Category } from "@/api/types";

export type AddExpensePayload = {
  title: string;
  description: string;
  amount: string | number;
  category_ids: string[];
  expense_date: string;
  expense_time: string;
};

export type AddExpenseFormProps = {
  editingId: string | null;
  initialValue: AddExpensePayload;
  onCancel: () => void;
  onSaved: () => void;
};

function formDateToApi(date: string) {
  if (!date || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) return date;
  const [y, m, d] = date.split("-");
  return `${d}-${m}-${y}`;
}
function formTimeToApi(time: string) {
  if (!time || !/^[0-9]{2}:[0-9]{2}$/.test(time)) return time;
  const [hStr, min] = time.split(":");
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h = h - 12;
  const hh = String(h).padStart(2, "0");
  return `${hh}:${min} ${suffix}`;
}

export default function AddExpenseForm({
  editingId,
  initialValue,
  onCancel,
  onSaved,
}: AddExpenseFormProps) {
  const [form, setForm] = useState<AddExpensePayload>(initialValue);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catSearch, setCatSearch] = useState("");
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    setCatLoading(true);
    setCatError("");
    try {
      const token = localStorage.getItem("authToken") || "";
      const res = await categoryApi.getCategories(token);
      const fetchedCategories = res.data.categories || [];
      setCategories(fetchedCategories);
    } catch {
      setCatError("Failed to load categories");
    } finally {
      setCatLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (!editingId && categories.length > 0 && form.category_ids.length === 0) {
      const defaultCategories = categories.filter(
        (cat: Category) => cat.is_default
      );
      const defaultCategoryIds = defaultCategories.map(
        (cat: Category) => cat.id
      );
      if (defaultCategoryIds.length > 0) {
        setForm((prevForm) => ({
          ...prevForm,
          category_ids: defaultCategoryIds,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.amount ||
      !form.category_ids.length ||
      !form.expense_date ||
      !form.expense_time
    ) {
      setError("Please fill all required fields.");
      return;
    }
    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken") || "";
      if (editingId) {
        await expenseApi.updateExpense(
          editingId,
          {
            title: form.title,
            description: form.description,
            amount: Number(form.amount),
            categories: form.category_ids,
            expense_date: formDateToApi(form.expense_date),
            expense_time: formTimeToApi(form.expense_time),
          },
          token
        );
      } else {
        await expenseApi.addExpense(
          {
            title: form.title,
            description: form.description,
            amount: Number(form.amount),
            categories: form.category_ids,
            expense_date: formDateToApi(form.expense_date),
            expense_time: formTimeToApi(form.expense_time),
          },
          token
        );
      }
      if (typeof window !== "undefined") {
        (await import("react-hot-toast")).default.success(
          editingId ? "Expense updated" : "Expense added"
        );
      }
      onSaved();
    } catch {
      setError(
        editingId
          ? "Failed to update expense. Please try again."
          : "Failed to add expense. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-1 sm:p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-2xl max-h-[98vh] sm:max-h-[85vh] border border-gray-200 relative overflow-hidden flex flex-col">
        {/* Header with inline buttons */}
        <div className="flex items-center justify-between p-2 sm:p-4 border-b bg-gradient-to-r from-indigo-50 to-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Plus size={12} className="text-indigo-600 sm:w-4 sm:h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-lg">
                {editingId ? "Edit Expense" : "Add Expense"}
              </h3>
            </div>
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-md sm:rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md sm:rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
            >
              {loading
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                ? "Update"
                : "Save"}
            </button>
          </div>
        </div>

        {/* Mobile Optimized Form */}
        <div className="p-2 sm:p-6 space-y-3 sm:space-y-3 flex-1 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full rounded-md sm:rounded-lg border-2 border-gray-300 px-2 py-2 sm:px-3 sm:py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 outline-none text-gray-900 text-sm sm:text-base placeholder:text-gray-500"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Grocery shopping"
            />
          </div>

          {/* Amount - Full width on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2.5">
            <div className="sm:col-span-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-md sm:rounded-lg border-2 border-gray-300 px-2 py-2 sm:px-3 sm:py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 outline-none text-gray-900 text-sm sm:text-base placeholder:text-gray-500"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                placeholder="0.00"
              />
            </div>

            {/* Date & Time - Side by side on mobile */}
            <div className="grid grid-cols-2 gap-2 sm:col-span-2 sm:grid-cols-2 sm:gap-2.5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full rounded-md sm:rounded-lg border-2 border-gray-300 px-2 py-2 sm:px-3 sm:py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 outline-none text-gray-900 text-sm sm:text-base"
                  value={form.expense_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expense_date: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  className="w-full rounded-md sm:rounded-lg border-2 border-gray-300 px-2 py-2 sm:px-3 sm:py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 outline-none text-gray-900 text-sm sm:text-base"
                  value={form.expense_time}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expense_time: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">
              Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded-md sm:rounded-lg border-2 border-gray-300 px-2 py-2 sm:px-3 sm:py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 outline-none text-gray-900 resize-none text-sm sm:text-base placeholder:text-gray-500"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Optional note"
            />
          </div>

          {/* Categories - Mobile Optimized with Fixed Height */}
          <div>
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-800">
                Categories <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={loadCategories}
                disabled={catLoading}
                className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md sm:rounded-lg transition-colors disabled:opacity-50 border border-indigo-200"
              >
                <RefreshCw
                  size={12}
                  className={catLoading ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
            <div className="border-2 border-gray-300 rounded-md sm:rounded-lg p-2 sm:p-3 bg-gray-50 h-48 sm:h-64 flex flex-col">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full mb-2 px-2 py-2 sm:px-3 sm:py-2.5 border-2 border-gray-200 rounded-md sm:rounded-lg text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 outline-none text-gray-900 placeholder-gray-500 bg-white"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
              />
              <div className="flex-1 overflow-y-auto">
                {catLoading && (
                  <div className="text-xs sm:text-sm text-gray-500 p-3 text-center">
                    Loading...
                  </div>
                )}
                {catError && (
                  <div className="text-xs sm:text-sm text-red-500 p-3 text-center">
                    {catError}
                  </div>
                )}
                {!catLoading && !catError && categories.length === 0 && (
                  <div className="text-xs sm:text-sm text-gray-500 p-3 text-center">
                    No categories found
                  </div>
                )}
                {!catLoading && !catError && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {categories
                      .filter((c) =>
                        c.name.toLowerCase().includes(catSearch.toLowerCase())
                      )
                      .map((cat) => {
                        const selected = form.category_ids.includes(cat.id);
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                category_ids: selected
                                  ? f.category_ids.filter((id) => id !== cat.id)
                                  : [...f.category_ids, cat.id],
                              }))
                            }
                            className={`text-left text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2.5 rounded-md sm:rounded-lg transition-colors font-medium ${
                              selected
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-white hover:bg-gray-100 border-2 border-gray-200 text-gray-700"
                            }`}
                          >
                            {cat.name}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
              {/* Selected Categories Pills - Fixed at bottom */}
              <div className="mt-2 pt-2 border-t border-gray-300 min-h-[2rem]">
                {form.category_ids.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {form.category_ids.map((id) => {
                      const cat = categories.find((c) => c.id === id);
                      if (!cat) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold border border-indigo-200"
                        >
                          {cat.name}
                          <button
                            type="button"
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                category_ids: f.category_ids.filter(
                                  (cid) => cid !== id
                                ),
                              }))
                            }
                            className="hover:text-red-600 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
