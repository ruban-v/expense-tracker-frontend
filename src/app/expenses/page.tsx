"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function ExpensesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  return (
    <div className="h-full bg-gray-50">
      <div className="mx-auto max-w-4xl py-8 px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Expenses</h1>
            <p className="mt-2 text-gray-500">
              Manage and track your recent spending
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>

        <div className="rounded-xl bg-white shadow-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Expenses
            </h2>
          </div>
        </div>

        {showAddForm && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setShowAddForm(false)}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg border border-gray-200">
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
