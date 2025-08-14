"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { expenseApi } from "@/api/api";
import { Expense } from "@/api/types";
import ExpenseList from "@/components/expenses/ExpenseList";
import AddExpenseForm, {
  AddExpensePayload,
} from "@/components/expenses/AddExpenseForm";
import CategoriesModal from "@/components/expenses/CategoriesModal";

export default function ExpensesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [expensesError, setExpensesError] = useState("");
  function getCurrentDate() {
    return new Date().toISOString().slice(0, 10);
  }
  function getCurrentTime() {
    return new Date().toTimeString().slice(0, 5);
  }
  function apiDateToForm(date: string | undefined) {
    if (!date || !/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/.test(date))
      return getCurrentDate();
    const [d, m, y] = date.split("-");
    return `${y}-${m}-${d}`;
  }
  function apiTimeToForm(time: string | undefined) {
    if (!time) return getCurrentTime();
    const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) return getCurrentTime();
    let hour = parseInt(match[1], 10);
    const min = match[2];
    const ap = match[3].toUpperCase();
    if (ap === "AM") {
      if (hour === 12) hour = 0;
    } else if (ap === "PM") {
      if (hour !== 12) hour += 12;
    }
    return `${String(hour).padStart(2, "0")}:${min}`;
  }
  const initialForm: AddExpensePayload = {
    title: "",
    description: "",
    amount: "",
    category_ids: [],
    expense_date: "",
    expense_time: "",
  };
  const [form, setForm] = useState<AddExpensePayload>(initialForm);

  async function loadExpenses() {
    setExpensesLoading(true);
    setExpensesError("");
    try {
      const token = localStorage.getItem("authToken") || "";
      const res = await expenseApi.getExpenses(undefined, token);
      setExpenses(res.data.expenses || []);
    } catch {
      setExpensesError("Failed to load expenses");
    } finally {
      setExpensesLoading(false);
    }
  }
  useEffect(() => {
    loadExpenses();
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm({
      ...initialForm,
      expense_date: getCurrentDate(),
      expense_time: getCurrentTime(),
    });
    setShowAddForm(true);
  }
  function openEdit(exp: Expense) {
    setEditingId(exp.id);
    setForm({
      title: exp.title || "",
      description: exp.description || "",
      amount: String(exp.amount ?? ""),
      category_ids: (exp.categories?.map((c) => c.id) || []) as string[],
      expense_date: apiDateToForm(exp.expense_date),
      expense_time: apiTimeToForm(exp.expense_time),
    });
    setShowAddForm(true);
  }
  async function handleDeleteExpense(id: string) {
    if (!confirm("Delete this expense?")) return;
    try {
      const token = localStorage.getItem("authToken") || "";
      await expenseApi.deleteExpense(id, token);
      (await import("react-hot-toast")).default.success("Deleted expense");
      loadExpenses();
    } catch {
      (await import("react-hot-toast")).default.error(
        "Failed to delete expense"
      );
    }
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="mx-auto w-full py-4 px-3 sm:px-6 lg:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
            <p className="mt-1 text-base text-gray-500">
              Manage and track your recent spending
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCatModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow text-base"
            >
              Categories
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow text-base"
            >
              <Plus size={18} />
              Add Expense
            </button>
            <button
              onClick={loadExpenses}
              className="flex items-center gap-2 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors border border-gray-200 shadow text-base"
              title="Refresh expenses"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            Recent Expenses{" "}
            {expensesLoading && (
              <span className="text-sm font-normal text-indigo-500 animate-pulse">
                Loading...
              </span>
            )}
          </h2>
          <ExpenseList
            expenses={expenses}
            loading={expensesLoading}
            error={expensesError}
            onEdit={openEdit}
            onDelete={handleDeleteExpense}
            onRefresh={loadExpenses}
          />
        </div>
        <CategoriesModal
          open={showCatModal}
          onClose={() => setShowCatModal(false)}
        />
        {showAddForm && (
          <AddExpenseForm
            editingId={editingId}
            initialValue={form}
            onCancel={() => setShowAddForm(false)}
            onSaved={() => {
              setShowAddForm(false);
              setEditingId(null);
              setForm({ ...initialForm });
              loadExpenses();
            }}
          />
        )}
      </div>
    </div>
  );
}
