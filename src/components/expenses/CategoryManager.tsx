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
    <div className="flex flex-col h-full p-6">
      <div className="flex-none pb-4 border-b mb-4">
        <form
          onSubmit={handleAddCategory}
          className="flex flex-col md:flex-row gap-2 w-full"
        >
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-black bg-white text-base"
              placeholder="Add new category"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              disabled={loading}
            />
            <label className="flex items-center gap-1 text-sm font-medium text-gray-600 px-3 bg-gray-100 rounded-md border border-gray-300">
              <input
                type="checkbox"
                checked={newIsDefault}
                onChange={(e) => setNewIsDefault(e.target.checked)}
                disabled={loading}
              />
              Default
            </label>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 text-base"
            disabled={loading}
          >
            Add
          </button>
        </form>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 text-base">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-base">{error}</div>
        ) : (
          <ul className="space-y-1.5">
            {categories.map((cat: Category) => (
              <li
                key={cat.id}
                className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 hover:to-white rounded-md px-3 py-2 border border-gray-200 transition-colors"
              >
                {editId === cat.id ? (
                  <form
                    onSubmit={handleEditCategory}
                    className="flex gap-1.5 items-center w-full"
                  >
                    <input
                      type="text"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-black bg-white text-base"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setEditDefault(!editDefault)}
                      className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                        editDefault
                          ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {editDefault ? "✓ Default" : "Default"}
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="px-3 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-gray-800 truncate text-base">
                        {cat.name}
                      </span>
                      {cat.is_default && (
                        <span className="ml-1 text-xs uppercase tracking-wide bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        className="text-base text-indigo-600 hover:text-indigo-800 font-medium"
                        onClick={() => startEdit(cat)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-base text-red-600 hover:text-red-700 font-medium"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
            {categories.length === 0 && (
              <li className="text-gray-500 text-center text-base">
                No categories found.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
