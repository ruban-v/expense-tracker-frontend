"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { expenseApi } from "@/api/api";
import { Expense } from "@/api/types";
import ExpenseList from "@/components/expenses/ExpenseList";
import AddExpenseForm, {
  AddExpensePayload,
} from "@/components/expenses/AddExpenseForm";
import CategoriesModal from "@/components/expenses/CategoriesModal";
import FilterExpensesForm, {
  ExpenseFilter,
} from "@/components/expenses/FilterExpensesForm";

export default function ExpensesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [expensesError, setExpensesError] = useState("");
  const [filter, setFilter] = useState<ExpenseFilter>({});

  const loadExpenses = useCallback(async (currentFilter: ExpenseFilter) => {
    setExpensesLoading(true);
    setExpensesError("");
    try {
      const token = localStorage.getItem("authToken") || "";
      const params: Record<string, string> = {};
      if (currentFilter.category_id) {
        params.category_id = currentFilter.category_id;
      }
      if (currentFilter.start_date) {
        params.start_date = currentFilter.start_date;
      }
      if (currentFilter.end_date) {
        params.end_date = currentFilter.end_date;
      }
      if (currentFilter.min_amount) {
        params.min_amount = currentFilter.min_amount;
      }
      if (currentFilter.max_amount) {
        params.max_amount = currentFilter.max_amount;
      }

      const res = await expenseApi.getExpenses(params, token);
      setExpenses(res.data.expenses || []);
    } catch {
      setExpensesError("Failed to load expenses");
    } finally {
      setExpensesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses(filter);
  }, [filter, loadExpenses]);

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
      loadExpenses(filter); // Reload expenses with current filter
    } catch {
      (await import("react-hot-toast")).default.error("Failed to delete");
    }
  }

  function handleFilter(newFilter: ExpenseFilter) {
    setFilter(newFilter);
  }

  function handleClearFilter() {
    setFilter({});
  }

  function handleRefresh() {
    handleClearFilter();
    setShowFilterForm(false);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            Manage and track your recent spending
          </p>
        </div>
        
        {/* Action buttons - Mobile optimized */}
        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-3">
          <button
            onClick={() => setShowFilterForm(!showFilterForm)}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors sm:px-4 ${
              showFilterForm
                ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Filter
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Refresh expenses"
          >
            <RefreshCcw size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium transition-colors sm:px-4"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={() => setShowCatModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 text-sm font-medium transition-colors sm:px-4"
          >
            <span className="hidden sm:inline">Categories</span>
            <span className="sm:hidden">Cat.</span>
          </button>
        </div>
      </div>

      {/* Filter Form - Improved layout */}
      {showFilterForm && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <FilterExpensesForm
            onFilter={handleFilter}
            onClear={handleClearFilter}
          />
        </div>
      )}

      {/* Expenses List - Better spacing */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <ExpenseList
          expenses={expenses}
          loading={expensesLoading}
          error={expensesError}
          onEdit={openEdit}
          onDelete={handleDeleteExpense}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Modals */}
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
            loadExpenses(filter);
          }}
        />
      )}
    </div>
  );
}
