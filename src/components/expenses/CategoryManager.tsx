import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { categoryApi } from "@/api/api";

type AxiosErrorLike = {
  response?: { data?: { error?: string } };
};

type Category = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

type Props = {
  onCategoryChange?: (categories: Category[]) => void;
};

export default function CategoryManager({ onCategoryChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(false);
  const [newIsDefault, setNewIsDefault] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDefault, setEditDefault] = useState(false);

  async function fetchCategories() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken") || "";
      const res = await categoryApi.getCategories(token);
      setCategories(res.data.categories);
      if (onCategoryChange) onCategoryChange(res.data.categories);
    } catch {
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  }

  // fetch categories on mount
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newCat.trim()) return toast.error("Category name required");
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken") || "";
      await categoryApi.createCategory(
        { name: newCat, is_default: newIsDefault },
        token
      );
      toast.success("Category added");
      setNewCat("");
      setNewIsDefault(false);
      fetchCategories();
    } catch {
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(cat: Category) {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditDefault(cat.is_default);
  }

  function cancelEdit() {
    setEditId(null);
    setEditName("");
    setEditDefault(false);
  }

  async function handleEditCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editId) return;
    if (!editName.trim()) return toast.error("Name required");
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken") || "";
      await categoryApi.updateCategory(
        editId,
        { name: editName, is_default: editDefault },
        token
      );
      toast.success("Category updated");
      cancelEdit();
      fetchCategories();
    } catch (err: unknown) {
      const msg =
        (err as AxiosErrorLike).response?.data?.error ||
        "Failed to update category"; // safe access for axios error shape
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }
  async function handleDeleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken") || "";
      await categoryApi.deleteCategory(id, token);
      toast.success("Deleted");
      fetchCategories();
    } catch (err: unknown) {
      const msg =
        (err as AxiosErrorLike).response?.data?.error || "Delete failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-none pb-3 border-b mb-3">
        <form
          onSubmit={handleAddCategory}
          className="flex flex-col gap-2 md:flex-row md:gap-2"
        >
          {/* Input field - full width on mobile, flex-1 on desktop */}
          <input
            type="text"
            className="w-full md:flex-1 rounded-lg border border-gray-300 px-3 py-2 text-black bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Add new category"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            disabled={loading}
          />

          {/* Buttons - together on mobile, separate on desktop */}
          <div className="flex gap-2 md:contents">
            <button
              type="button"
              onClick={() => setNewIsDefault((v) => !v)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                newIsDefault
                  ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              }`}
              disabled={loading}
            >
              {newIsDefault ? "✓ Default" : "Default"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 text-sm font-medium"
              disabled={loading}
            >
              Add
            </button>
          </div>
        </form>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 text-sm py-8">
            Loading...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-sm py-8">{error}</div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat: Category) => (
              <div
                key={cat.id}
                className="bg-white hover:bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-indigo-200 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {editId === cat.id ? (
                  <form
                    onSubmit={handleEditCategory}
                    className="flex flex-col gap-2"
                  >
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-black bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setEditDefault(!editDefault)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          editDefault
                            ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {editDefault ? "✓ Default" : "Default"}
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 font-medium"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-lg text-xs hover:bg-gray-400 font-medium"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-gray-900 font-medium text-sm truncate">
                        {cat.name}
                      </span>
                      {cat.is_default && (
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                        onClick={() => startEdit(cat)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-gray-500 text-center text-sm py-8">
                No categories found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
