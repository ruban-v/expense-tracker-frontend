"use client";
import CategoryManager from "@/components/expenses/CategoryManager";
import { Category } from "@/api/types";
import { FolderOpen } from "lucide-react";

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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] max-h-[700px] min-h-[500px] border border-gray-200 relative overflow-hidden flex flex-col">
        {/* Header with inline buttons */}
        <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-indigo-50 to-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <FolderOpen size={16} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                Manage Categories
              </h3>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <CategoryManager onCategoryChange={onChanged} />
        </div>
      </div>
    </div>
  );
}
