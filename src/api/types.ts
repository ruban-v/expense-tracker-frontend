// Base entity types
export type Category = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type ExpenseCategory = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  title: string;
  description?: string;
  amount: number;
  expense_date: string;
  expense_time: string;
  category_name?: string;
  categories?: ExpenseCategory[];
  created_at: string;
  updated_at: string;
};

// API Request types
export type CreateCategoryRequest = {
  name: string;
  is_default: boolean;
};


export type UpdateCategoryRequest = {
  name: string;
  is_default: boolean;
};

export type CreateExpenseRequest = {
  title: string;
  description: string;
  amount: number;
  categories: string[];
  expense_date: string;
  expense_time: string;
};

export type UpdateExpenseRequest = {
  title: string;
  description: string;
  amount: number;
  categories: string[];
  expense_date: string;
  expense_time: string;
};

// API Response types
export type CategoryApiResponse = {
  success: boolean;
  data: {
    categories: Category[];
  };
};

export type ExpenseApiResponse = {
  success: boolean;
  data: {
    expenses: Expense[];
  };
};

export type SingleExpenseApiResponse = {
  success: boolean;
  data: {
    expense: Expense;
  };
};

export type SingleCategoryApiResponse = {
  success: boolean;
  data: {
    category: Category;
  };
};

// Error types
export type ApiError = {
  success: false;
  error: string;
  message?: string;
};

export type AxiosErrorLike = {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
};

// Form types
export type AddExpenseFormData = {
  title: string;
  description: string;
  amount: string | number;
  category_ids: string[];
  expense_date: string;
  expense_time: string;
};

export type CategoryFormData = {
  name: string;
  is_default: boolean;
};

// Component prop types
export type ExpenseListProps = {
  expenses: Expense[];
  loading: boolean;
  error: string;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
};

export type CategoryManagerProps = {
  onCategoryChange?: (categories: Category[]) => void;
};

export type AddExpenseFormProps = {
  editingId: string | null;
  initialValue: AddExpenseFormData;
  onCancel: () => void;
  onSaved: () => void;
};

export type CategoriesModalProps = {
  open: boolean;
  onClose: () => void;
  onChanged?: (categories: Category[]) => void;
};

// Utility types
export type LoadingState = {
  loading: boolean;
  error: string;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type FilterParams = {
  category_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
};

export type ExpenseFilters = PaginationParams & FilterParams;
