"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { expenseApi } from "@/api/api";
import toast from "react-hot-toast";

interface AddExpenseFormProps {
  onExpenseAdded: () => void;
  onClose: () => void;
}

interface ExpenseFormData {
  title: string;
  description: string;
  amount: string;
  category_id: string;
  expense_date: string;
  expense_time: string;
}

const categories = [
  { id: "food", name: "Food & Dining" },
  { id: "transport", name: "Transportation" },
  { id: "shopping", name: "Shopping" },
  { id: "entertainment", name: "Entertainment" },
  { id: "health", name: "Healthcare" },
  { id: "education", name: "Education" },
  { id: "utilities", name: "Utilities" },
  { id: "other", name: "Other" },
];

export default function AddExpenseForm({ onExpenseAdded, onClose }: AddExpenseFormProps) {
  const isMockMode =
    process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: "",
    description: "",
    amount: "",
    category_id: "",
    expense_date: new Date().toISOString().split("T")[0],
    expense_time: new Date().toTimeString().slice(0, 5),
  });

  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    if (!formData.category_id) {
      newErrors.category_id = "Category is required";
    }

    if (!formData.expense_date) {
      newErrors.expense_date = "Date is required";
    }

    if (!formData.expense_time) {
      newErrors.expense_time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get token from localStorage (you might want to use a proper auth context)
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        toast.error("Please login to add expenses");
        return;
      }

      const expenseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        amount: Number(formData.amount),
        category_id: formData.category_id,
        expense_date: formData.expense_date,
        expense_time: formData.expense_time,
      };

      // MOCK MODE: Simulate successful API call for testing
      if (isMockMode) {
        const existingRaw = localStorage.getItem("mockExpenses");
        const existing: any[] = existingRaw ? JSON.parse(existingRaw) : [];
        const newExpense = {
          id: typeof crypto !== "undefined" && (crypto as any).randomUUID
            ? (crypto as any).randomUUID()
            : `${Date.now()}`,
          ...expenseData,
          created_at: new Date().toISOString(),
        };
        existing.unshift(newExpense);
        localStorage.setItem("mockExpenses", JSON.stringify(existing));
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success("Expense added successfully! (Mock mode)");
        onExpenseAdded();
        onClose();
        return;
      }

      await expenseApi.addExpense(expenseData, token);
      
      toast.success("Expense added successfully!");
      onExpenseAdded();
      onClose();
    } catch (error: any) {
      console.error("Error adding expense:", error?.response || error);
      const status = error?.response?.status;
      const errorMessage =
        error?.response?.data?.error ||
        (status === 401
          ? "Unauthorized: Please log in with a valid account."
          : status === 404
          ? "Endpoint not found: Check API base URL."
          : "Failed to add expense");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Add New Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter expense title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-1">
              Amount (₹) *
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.amount ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-1">
              Category *
            </label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => handleInputChange("category_id", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                errors.category_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" className="text-gray-500">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-900 mb-1">
                Date *
              </label>
              <input
                type="date"
                id="date"
                value={formData.expense_date}
                onChange={(e) => handleInputChange("expense_date", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.expense_date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.expense_date && (
                <p className="mt-1 text-sm text-red-600">{errors.expense_date}</p>
              )}
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-semibold text-gray-900 mb-1">
                Time *
              </label>
              <input
                type="time"
                id="time"
                value={formData.expense_time}
                onChange={(e) => handleInputChange("expense_time", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.expense_time ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.expense_time && (
                <p className="mt-1 text-sm text-red-600">{errors.expense_time}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
