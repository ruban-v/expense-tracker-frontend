import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    axios.post(`${BASE_URL}/register`, data),

  login: (data: { email: string; password: string }) =>
    axios.post(`${BASE_URL}/login`, data),

  forgotPassword: (data: { email: string }) =>
    axios.post(`${BASE_URL}/forgot-password`, data),
};

export const expenseApi = {
  addExpense: (
    data: {
      title: string;
      description?: string;
      amount: number;
      category_id: string;
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
      category_id: string;
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
    params: Record<string, string | number | boolean> | undefined,
    token: string
  ) =>
    axios.get(`${BASE_URL}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    }),

  getMonthlySummary: (token: string) =>
    axios.get(`${BASE_URL}/expenses/summary/monthly`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
