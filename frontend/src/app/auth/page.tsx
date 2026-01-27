"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import AuthSystem from "@/src/components/common/AuthSystem";
import { useAuth } from "@/src/hooks/useAuth";

export default function AuthPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current || loading) return;

    if (isAuthenticated && user) {
      const targetPath = user.role === "COMPANY" ? "/Company/dashboard" : "/Student/dashboard";
      if (pathname !== targetPath) {
        hasRedirected.current = true;
        router.push(targetPath);
      }
    }
  }, [user, loading, isAuthenticated, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return null;
  }

  return <AuthSystem initialMode="login" />;
}
