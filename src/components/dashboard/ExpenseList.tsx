"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Calendar, Clock, Tag } from "lucide-react";
import { expenseApi } from "@/api/api";
import toast from "react-hot-toast";

interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category_id: string;
  expense_date: string;
  expense_time: string;
  created_at: string;
}

interface ExpenseListProps {
  refreshTrigger: number;
}

const categoryNames: { [key: string]: string } = {
  food: "Food & Dining",
  transport: "Transportation",
  shopping: "Shopping",
  entertainment: "Entertainment",
  health: "Healthcare",
  education: "Education",
  utilities: "Utilities",
  other: "Other",
};

const categoryColors: { [key: string]: string } = {
  food: "bg-orange-100 text-orange-800",
  transport: "bg-blue-100 text-blue-800",
  shopping: "bg-purple-100 text-purple-800",
  entertainment: "bg-pink-100 text-pink-800",
  health: "bg-green-100 text-green-800",
  education: "bg-indigo-100 text-indigo-800",
  utilities: "bg-yellow-100 text-yellow-800",
  other: "bg-gray-100 text-gray-800",
};

export default function ExpenseList({ refreshTrigger }: ExpenseListProps) {
  const isMockMode =
    typeof window !== "undefined" &&
    process.env.NODE_ENV === "development" &&
    !process.env.NEXT_PUBLIC_API_URL;
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    amount: "",
    category_id: "",
    expense_date: "",
    expense_time: "",
  });

  const fetchExpenses = async () => {
    try {
      if (isMockMode) {
        const existingRaw = localStorage.getItem("mockExpenses");
        const existing: Expense[] = existingRaw ? JSON.parse(existingRaw) : [];
        setExpenses(existing);
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login to view expenses");
        return;
      }

      const response = await expenseApi.getExpenses(undefined, token);
      setExpenses(response.data.expenses || []);
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      if (error?.response?.status === 404) {
        toast.error(
          "Expenses API endpoint not found (404). Check NEXT_PUBLIC_API_URL and backend route."
        );
      } else {
        toast.error("Failed to load expenses");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  const handleDelete = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      if (isMockMode) {
        const existingRaw = localStorage.getItem("mockExpenses");
        const existing: Expense[] = existingRaw ? JSON.parse(existingRaw) : [];
        const updated = existing.filter((e) => e.id !== expenseId);
        localStorage.setItem("mockExpenses", JSON.stringify(updated));
        toast.success("Expense deleted successfully (Mock mode)");
        fetchExpenses();
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login to delete expenses");
        return;
      }

      await expenseApi.deleteExpense(expenseId, token);
      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      const errorMessage = error.response?.data?.error || "Failed to delete expense";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setEditForm({
      title: expense.title,
      description: expense.description || "",
      amount: expense.amount.toString(),
      category_id: expense.category_id,
      expense_date: expense.expense_date,
      expense_time: expense.expense_time,
    });
  };

  const handleUpdate = async () => {
    if (!editingExpense) return;

    try {
      const updateData = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        amount: Number(editForm.amount),
        category_id: editForm.category_id,
        expense_date: editForm.expense_date,
        expense_time: editForm.expense_time,
      };

      if (isMockMode) {
        const existingRaw = localStorage.getItem("mockExpenses");
        const existing: Expense[] = existingRaw ? JSON.parse(existingRaw) : [];
        const updated = existing.map((e) =>
          e.id === editingExpense.id ? { ...e, ...updateData } : e
        );
        localStorage.setItem("mockExpenses", JSON.stringify(updated));
        toast.success("Expense updated successfully (Mock mode)");
        setEditingExpense(null);
        fetchExpenses();
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login to update expenses");
        return;
      }

      await expenseApi.updateExpense(editingExpense.id, updateData, token);
      toast.success("Expense updated successfully");
      setEditingExpense(null);
      fetchExpenses();
    } catch (error: any) {
      console.error("Error updating expense:", error);
      const errorMessage = error.response?.data?.error || "Failed to update expense";
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading expenses...</span>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <Tag size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
        <p className="text-gray-600">Start tracking your expenses by adding your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          {editingExpense?.id === expense.id ? (
            // Edit Form
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Title"
              />
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Amount"
                  step="0.01"
                />
                <select
                  value={editForm.category_id}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category_id: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(categoryNames).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={editForm.expense_date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, expense_date: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  value={editForm.expense_time}
                  onChange={(e) => setEditForm(prev => ({ ...prev, expense_time: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingExpense(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Display Mode
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{expense.title}</h3>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${categoryColors[expense.category_id] || categoryColors.other}`}>
                    {categoryNames[expense.category_id] || "Other"}
                  </span>
                </div>
                
                {expense.description && (
                  <p className="text-gray-600 mb-3">{expense.description}</p>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                    <Calendar size={14} />
                    <span>{formatDate(expense.expense_date)}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                    <Clock size={14} />
                    <span>{formatTime(expense.expense_time)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    ₹{expense.amount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit expense"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
