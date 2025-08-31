"use client";

import { useEffect, useState } from "react";
import { categoryApi } from "@/api/api";
import { Category } from "@/api/types";

export interface ExpenseFilter {
  category_id?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: string;
  max_amount?: string;
}

interface FilterExpensesFormProps {
  onFilter: (filter: ExpenseFilter) => void;
  onClear: () => void;
}

export default function FilterExpensesForm({
  onFilter,
  onClear,
}: FilterExpensesFormProps) {
  const [filter, setFilter] = useState<ExpenseFilter>({});
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const token = localStorage.getItem("authToken") || "";
        const res = await categoryApi.getCategories(token);
        setCategories(res.data.categories || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    }
    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilter = () => {
    const apiFilter = { ...filter };
    if (apiFilter.start_date) {
      const [y, m, d] = apiFilter.start_date.split("-");
      apiFilter.start_date = `${d}-${m}-${y}`;
    }
    if (apiFilter.end_date) {
      const [y, m, d] = apiFilter.end_date.split("-");
      apiFilter.end_date = `${d}-${m}-${y}`;
    }
    onFilter(apiFilter);
  };

  const handleClear = () => {
    setFilter({});
    onClear();
  };

  return (
    <div className="p-3 sm:p-4">
      <h3 className="text-base font-semibold mb-3 text-gray-800 sm:text-lg">
        Filter Expenses
      </h3>

      {/* Filter Grid - Compact mobile layout */}
      <div className="space-y-3">
        {/* Mobile: Single column, Desktop: Multi-column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1 sm:text-sm sm:mb-2">
              Category
            </label>
            <select
              name="category_id"
              value={filter.category_id || ""}
              onChange={handleChange}
              className="w-full px-2.5 py-2 border-2 border-gray-300 rounded-lg text-xs bg-white text-gray-900 font-medium sm:px-3 sm:py-2.5 sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" className="text-gray-600">
                All Categories
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="text-gray-900">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1 sm:text-sm sm:mb-2">
              From Date
            </label>
            <input
              type="date"
              name="start_date"
              value={filter.start_date || ""}
              onChange={handleChange}
              className="w-full px-2.5 py-2 border-2 border-gray-300 rounded-lg text-xs text-gray-900 font-medium sm:px-3 sm:py-2.5 sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1 sm:text-sm sm:mb-2">
              To Date
            </label>
            <input
              type="date"
              name="end_date"
              value={filter.end_date || ""}
              onChange={handleChange}
              className="w-full px-2.5 py-2 border-2 border-gray-300 rounded-lg text-xs text-gray-900 font-medium sm:px-3 sm:py-2.5 sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Amount Range */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Min Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1 sm:text-sm sm:mb-2">
              Min Amount
            </label>
            <input
              type="number"
              name="min_amount"
              placeholder="Min"
              value={filter.min_amount || ""}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-2.5 py-2 border-2 border-gray-300 rounded-lg text-xs text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-normal sm:px-3 sm:py-2.5 sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Max Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1 sm:text-sm sm:mb-2">
              Max Amount
            </label>
            <input
              type="number"
              name="max_amount"
              placeholder="Max"
              value={filter.max_amount || ""}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-2.5 py-2 border-2 border-gray-300 rounded-lg text-xs text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-normal sm:px-3 sm:py-2.5 sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons - Compact mobile */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={handleFilter}
          className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors sm:flex-none sm:px-4 sm:text-sm"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors sm:flex-none sm:px-4 sm:text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
