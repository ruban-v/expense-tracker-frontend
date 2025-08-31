"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("Please enter both email and password.");
    }

    setIsLoading(true);

    try {
      console.log("login with:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await authApi.login(formData);
      const { token } = response.data;
      localStorage.setItem("authToken", token);

      toast.success("Login successful! Redirecting...");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("The email or password you entered is incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg sm:p-6 lg:p-8">
        <h2 className="mb-3 text-center text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl lg:mb-6 lg:text-4xl">
          Welcome Back
        </h2>
        <p className="mb-3 text-center text-sm text-gray-600 sm:mb-4 sm:text-base lg:mb-6 lg:text-lg">
          Please enter your details to sign in.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-2 sm:mb-3 lg:mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700 sm:text-base"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:px-4 sm:py-3 sm:text-base"
              required
            />
          </div>
          <div className="mb-3 sm:mb-4 lg:mb-6">
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700 sm:text-base"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:px-4 sm:py-3 sm:text-base"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400 sm:px-4 sm:py-3 sm:text-base"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
        <p className="mt-3 text-center text-sm text-gray-600 sm:mt-4 lg:mt-6 sm:text-base">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
