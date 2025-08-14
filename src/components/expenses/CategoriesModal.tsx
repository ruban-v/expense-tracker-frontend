"use client";
import CategoryManager from "@/components/expenses/CategoryManager";
import { Category } from "@/api/types";

export type CategoriesModalProps = {
  open: boolean;
  onClose: () => void;
  onChanged?: (categories: Category[]) => void;
};

export default function CategoriesModal({
  open,
  onClose,
  onChanged,
}: CategoriesModalProps) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-xl border border-gray-200">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Manage Categories
          </h3>
          <CategoryManager onCategoryChange={onChanged} />
          <div className="flex justify-end pt-3">
            <button
              className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
