"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddExpenseForm from "@/components/dashboard/AddExpenseForm";
import ExpenseList from "@/components/dashboard/ExpenseList";
import { Toaster } from "react-hot-toast";

export default function DemoPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Expense Tracker Demo
          </h1>
          <p className="text-lg text-gray-600">
            This is a demonstration of the expense management functionality.
          </p>
        </div>

        {/* Demo Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How to Test:
          </h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Click "Add Expense" to create a new expense</li>
            <li>• Fill in the form with title, amount, category, date, and time</li>
            <li>• View the expense in the list below</li>
            <li>• Click the edit icon to modify an expense</li>
            <li>• Click the delete icon to remove an expense</li>
            <li>• Note: This demo uses mock data since no backend is connected</li>
          </ul>
        </div>

        {/* Add Expense Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Plus size={16} />
            Add Expense
          </button>
        </div>

        {/* Expense List */}
        <ExpenseList refreshTrigger={refreshTrigger} />

        {/* Add Expense Modal */}
        {showAddForm && (
          <AddExpenseForm
            onExpenseAdded={handleExpenseAdded}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
}
