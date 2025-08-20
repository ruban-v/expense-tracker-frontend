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
    <div className="p-4 my-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Filter Expenses
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          name="category_id"
          value={filter.category_id || ""}
          onChange={handleChange}
          className="p-2 border rounded text-gray-900"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="start_date"
          value={filter.start_date || ""}
          onChange={handleChange}
          className="p-2 border rounded text-gray-900"
        />
        <input
          type="date"
          name="end_date"
          value={filter.end_date || ""}
          onChange={handleChange}
          className="p-2 border rounded text-gray-900"
        />
        <input
          type="number"
          name="min_amount"
          placeholder="Min amount"
          value={filter.min_amount || ""}
          onChange={handleChange}
          className="p-2 border rounded text-gray-900 placeholder:text-gray-500"
        />
        <input
          type="number"
          name="max_amount"
          placeholder="Max amount"
          value={filter.max_amount || ""}
          onChange={handleChange}
          className="p-2 border rounded text-gray-900 placeholder:text-gray-500"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Clear
        </button>
        <button
          onClick={handleFilter}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Filter
        </button>
      </div>
    </div>
  );
}
