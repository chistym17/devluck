"use client";

import { useEffect,useState } from "react";
import LeftSidebar from "@/src/components/Student/LeftSidebar";
import { useSidebar } from "@/src/lib/sidebarContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="app-container flex">
      {/* Mobile hamburger (GLOBAL) */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(true)}
            className="
              fixed top-4 left-4 z-[1100]
              w-8 h-8
              flex items-center justify-center
              rounded-lg
              bg-white
              shadow-md
              md:hidden
            "
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-gray-800"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>

          </button>
        )}
      <LeftSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main
        className={`flex-1 p-5 transition-all duration-300 overflow-x-hidden ${
          !isMobile
            ? isCollapsed
              ? "pl-[100px]"
              : "pl-[220px]"
            : "pl-0"
        }`}
      >
        <div className="max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
