"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("Please fill in all fields.");
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setIsLoading(true);

    try {
      await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (e) {
      toast.error(`An account with this email already exists: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg sm:p-6 lg:p-8">
        <h2 className="mb-3 text-center text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl lg:mb-6 lg:text-4xl">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-2 sm:mb-3 lg:mb-4">
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700 sm:text-base"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:px-4 sm:py-3 sm:text-base"
              required
            />
          </div>
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
          <div className="mb-2 sm:mb-3 lg:mb-4">
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
          <div className="mb-3 sm:mb-4 lg:mb-6">
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700 sm:text-base"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
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
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </div>
        </form>
        <p className="mt-3 text-center text-sm text-gray-600 sm:mt-4 lg:mt-6 sm:text-base">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
