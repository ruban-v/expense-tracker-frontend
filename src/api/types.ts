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
  is_default?: boolean;
};

export type Expense = {
  id: string;
  user_id?: string;
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

export type User = {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deactivated_at?: string | null;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Dashboard types - Updated to match actual API response
export type DailySummary = {
  day: string;
  total: number;
};

export type MonthlySummary = {
  month: string;
  total: number;
};

export type WeeklySummary = {
  week: string;
  total: number;
};

export type RecentExpense = {
  id: string;
  title: string;
  amount: number;
  expense_date: string;
  expense_time: string;
};

export type Summary = {
  current_month_amount: number;
  current_month_count: number;
  current_week_amount: number;
  current_week_count: number;
  today_amount: number;
  today_count: number;
  total_amount: number;
  total_expenses: number;
};

export type Dashboard = {
  daily_summary: DailySummary[];
  monthly_summary: MonthlySummary[];
  weekly_summary: WeeklySummary[];
  recent_expenses: RecentExpense[];
  summary: Summary;
};

// API Request types
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  name: string;
  profile_image?: string | null;
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

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
  description?: string;
  amount: number;
  categories: string[];
  expense_date: string;
  expense_time: string;
};

export type UpdateExpenseRequest = {
  title: string;
  description?: string;
  amount: number;
  categories: string[];
  expense_date: string;
  expense_time: string;
};

export type ExpenseFilters = {
  category_id?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
};

// API Response types
export type AuthApiResponse = {
  message: string;
  user?: User;
  token?: string;
  session_id?: string;
};

export type ProfileApiResponse = {
  message: string;
  profile: Profile;
};

export type CategoryApiResponse = {
  categories: Category[];
};

export type SingleCategoryApiResponse = {
  message: string;
  category_id: string;
  name: string;
  is_default: boolean;
};

export type ExpenseApiResponse = {
  expenses: Expense[];
};

export type SingleExpenseApiResponse = {
  message: string;
  expense: Expense;
};

export type DashboardApiResponse = {
  dashboard: Dashboard;
};

export type MessageApiResponse = {
  message: string;
};

// Error types
export type ApiError = {
  error: string;
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

export type ProfileFormData = {
  name: string;
  profile_image?: string | null;
};

export type PasswordFormData = {
  current_password: string;
  new_password: string;
  confirm_password: string;
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
