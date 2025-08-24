import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    axios.post(`${BASE_URL}/register`, data),

  login: (data: { email: string; password: string }) =>
    axios.post(`${BASE_URL}/login`, data),

  logout: (token: string) =>
    axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),

  forgotPassword: (data: { email: string }) =>
    axios.post(`${BASE_URL}/forgot-password`, data),
};

export const profileApi = {
  getProfile: (token: string) =>
    axios.get(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateProfile: (
    data: { name: string; profile_image?: string | null },
    token: string
  ) =>
    axios.put(`${BASE_URL}/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  changePassword: (
    data: { current_password: string; new_password: string },
    token: string
  ) =>
    axios.put(`${BASE_URL}/profile/password`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export const categoryApi = {
  getCategories: (token: string) =>
    axios.get(`${BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createCategory: (
    data: { name: string; is_default: boolean },
    token: string
  ) =>
    axios.post(`${BASE_URL}/categories`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateCategory: (
    id: string,
    data: { name: string; is_default: boolean },
    token: string
  ) =>
    axios.put(`${BASE_URL}/categories/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  deleteCategory: (id: string, token: string) =>
    axios.delete(`${BASE_URL}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export const expenseApi = {
  addExpense: (
    data: {
      title: string;
      description?: string;
      amount: number;
      categories: string[];
      expense_date: string;
      expense_time: string;
    },
    token: string
  ) =>
    axios.post(`${BASE_URL}/expenses`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateExpense: (
    id: string,
    data: {
      title: string;
      description?: string;
      amount: number;
      categories: string[];
      expense_date: string;
      expense_time: string;
    },
    token: string
  ) =>
    axios.put(`${BASE_URL}/expenses/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  deleteExpense: (id: string, token: string) =>
    axios.delete(`${BASE_URL}/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getExpenses: (
    params:
      | {
          category_id?: string;
          start_date?: string;
          end_date?: string;
          min_amount?: number;
          max_amount?: number;
        }
      | undefined,
    token: string
  ) =>
    axios.get(`${BASE_URL}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    }),

  getDashboard: (token: string) =>
    axios.get(`${BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
