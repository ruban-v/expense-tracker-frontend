"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddExpenseForm from "@/components/dashboard/AddExpenseForm";
import ExpenseList from "@/components/dashboard/ExpenseList";

export default function ExpensesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Expenses
          </h2>
          <p className="text-gray-500 mt-1">Manage and track your recent spending</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <ExpenseList refreshTrigger={refreshTrigger} />
        </div>
      </div>

      {showAddForm && (
        <AddExpenseForm
          onExpenseAdded={handleExpenseAdded}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
