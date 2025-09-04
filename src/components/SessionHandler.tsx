"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function SessionHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const errorData = error.response.data;

          if (
            errorData?.error === "session_expired" ||
            errorData?.message?.includes("Session expired") ||
            errorData?.message?.includes("session expired")
          ) {
            toast.error("Your session has expired. Please log in again.");

            // Clear auth token from localStorage
            localStorage.removeItem("authToken");

            if (pathname !== "/login") {
              setTimeout(() => {
                router.push("/login");
              }, 1000);
            }
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [router, pathname]);
  return null;
}
