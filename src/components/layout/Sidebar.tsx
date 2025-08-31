"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BarChart3, ClipboardList, User, LogOut } from "lucide-react";
import { authApi } from "@/api/api";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("authToken");
      toast.success("You have been logged out.");
      router.push("/login");
    }
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Expenses", href: "/expenses", icon: ClipboardList },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile and tablet */}
      <div className="hidden lg:flex h-screen w-64 flex-col bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b px-4">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="ExpenseT Logo"
              width={32}
              height={32}
              className="h-12 w-12"
            />
            <h1 className="text-3xl font-bold text-indigo-600">ExpenseT</h1>
          </div>
        </div>
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center rounded-md px-4 py-3 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <link.icon className="mr-3 h-6 w-6" />
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-4 py-3 text-base font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-6 w-6" />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Top Header - Simple header with just logo */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b">
        <div className="flex h-14 items-center justify-center px-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="ExpenseT Logo"
              width={28}
              height={28}
              className="h-12 w-12"
            />
            <h1 className="text-xl font-bold text-indigo-600">ExpenseT</h1>
          </div>
        </div>
      </div>

      {/* Bottom Floating Navigation - Visible on mobile and tablet only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white border-t shadow-lg">
          <div className="flex justify-around items-center py-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex flex-col items-center px-3 py-2 min-w-0 flex-1 text-center transition-colors ${
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  <link.icon
                    className={`h-6 w-6 mb-1 ${
                      isActive ? "text-indigo-600" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "text-indigo-600" : "text-gray-600"
                    }`}
                  >
                    {link.name}
                  </span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center px-3 py-2 min-w-0 flex-1 text-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
