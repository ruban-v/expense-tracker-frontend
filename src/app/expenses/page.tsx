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

  // Master list of all expenses
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  // List of expenses to display after filtering
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

  const [expensesLoading, setExpensesLoading] = useState(false);
  const [expensesError, setExpensesError] = useState("");
  const [filter, setFilter] = useState<ExpenseFilter>({});

  // Load all expenses from the API
  const loadExpenses = useCallback(async () => {
    setExpensesLoading(true);
    setExpensesError("");
    try {
      const token = localStorage.getItem("authToken") || "";
      const res = await expenseApi.getExpenses(undefined, token);
      setAllExpenses(res.data.expenses || []);
    } catch {
      setExpensesError("Failed to load expenses");
    } finally {
      setExpensesLoading(false);
    }
  }, []);

  // Load expenses on initial render
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // Apply filters to the master list
  useEffect(() => {
    let expenses = [...allExpenses];
    const { category_id, start_date, end_date, min_amount, max_amount } =
      filter;

    if (category_id) {
      expenses = expenses.filter((exp) =>
        exp.categories?.some((cat) => cat.id === category_id)
      );
    }
    if (start_date) {
      expenses = expenses.filter((exp) => {
        if (!exp.expense_date) return false;
        const expenseDate = new Date(
          exp.expense_date.split("-").reverse().join("-")
        );
        return expenseDate >= new Date(start_date);
      });
    }
    if (end_date) {
      expenses = expenses.filter((exp) => {
        if (!exp.expense_date) return false;
        const expenseDate = new Date(
          exp.expense_date.split("-").reverse().join("-")
        );
        return expenseDate <= new Date(end_date);
      });
    }
    if (min_amount) {
      expenses = expenses.filter((exp) => exp.amount >= Number(min_amount));
    }
    if (max_amount) {
      expenses = expenses.filter((exp) => exp.amount <= Number(max_amount));
    }

    setFilteredExpenses(expenses);
  }, [allExpenses, filter]);

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
      loadExpenses(); // Reload all expenses
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
    loadExpenses();
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
          <p className="mt-1 text-base text-gray-500">
            Manage and track your recent spending
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilterForm(!showFilterForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300"
          >
            Filter
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-gray-200"
            title="Refresh expenses"
          >
            <RefreshCcw size={20} />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus size={20} /> Add Expense
          </button>
          <button
            onClick={() => setShowCatModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
          >
            Manage Categories
          </button>
        </div>
      </div>

      {showFilterForm && (
        <FilterExpensesForm
          onFilter={handleFilter}
          onClear={handleClearFilter}
        />
      )}

      <ExpenseList
        expenses={filteredExpenses}
        loading={expensesLoading}
        error={expensesError}
        onEdit={openEdit}
        onDelete={handleDeleteExpense}
        onRefresh={handleRefresh}
      />

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
            loadExpenses();
          }}
        />
      )}
    </div>
  );
}
