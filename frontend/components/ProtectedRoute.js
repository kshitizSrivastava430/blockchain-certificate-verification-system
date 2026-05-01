"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAuth } from "@/lib/api";
import Loader from "@/components/Loader";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await checkAdminAuth();
        if (res.success) {
          setIsAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        // If 401 Unauthorized or any other error, redirect to login
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center relative z-10">
        <Loader text="Verifying Administrator Access..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
