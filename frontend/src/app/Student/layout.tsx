"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider } from "@/src/lib/sidebarContext";
import { useAuth } from "@/src/hooks/useAuth";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current || loading) return;

    if (!isAuthenticated || !user) {
      if (pathname !== "/auth") {
        hasRedirected.current = true;
        router.push("/auth");
      }
      return;
    }
    
    if (user.role !== "STUDENT") {
      if (!pathname.startsWith("/Company")) {
        hasRedirected.current = true;
        router.push("/Company/dashboard");
      }
      return;
    }

    hasRedirected.current = false;
  }, [user, loading, isAuthenticated, router, pathname]);

  if (loading) {
      return (
        <SidebarProvider>
          <DashboardLayout>
            <div className="flex flex-1 items-center justify-center min-h-[calc(100vh-64px)]">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            </div>
          </DashboardLayout>
        </SidebarProvider>
      );
    }

  if (!isAuthenticated || !user || user.role !== "STUDENT") {
    return null;
  }

  return <SidebarProvider>{children}</SidebarProvider>;
}
