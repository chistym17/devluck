"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSidebar } from "@/src/lib/sidebarContext";
import { useUnreadNotifications } from "@/src/hooks/studentapihandler/useUnreadNotifications";


  
const LeftSidebar = ({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) => {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  const glowRightRef = useRef<HTMLDivElement>(null);
  const glowLeftRef = useRef<HTMLDivElement>(null);

  // Calculate unread notifications
  const { unreadLabel, unreadCount } = useUnreadNotifications()

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
 
  // Glow effect after layout
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeItem = document.querySelector(".menu-subitem.active");
      if (!activeItem) return;
      const sidebar = activeItem.closest(".sidebar");
      if (!sidebar) return;
      const rect = activeItem.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();
      if (glowRightRef.current) glowRightRef.current.style.top = rect.top - sidebarRect.top + "px";
      if (glowLeftRef.current) glowLeftRef.current.style.top = rect.top - sidebarRect.top + "px";
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname, mobileOpen]);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

 const mainMenuItems = [
  { name: "Dashboard", path: "/Student/dashboard", icon: "/icons/dashboard.svg" },
  { name: "Opportunity", path: "/Student/opportunity", icon: "/icons/opportunityStudent.svg" },
  { name: "Applied Opportunity", path: "/Student/applied-Opportunity", icon: "/icons/opportunity.svg" },
  { name: "Profile", path: "/Student/profile", icon: "/icons/profile.svg" },
  { name: "Contracts", path: "/Student/contract", icon: "/icons/contract.svg"},
  { name: "Top10 Student", path: "/Student/top-student", icon: "/icons/top-applicant.svg" },
  { name: "Top Company", path: "/Student/top-company", icon: "/icons/company.svg" },
  { name: "Top University", path: "/Student/top-university", icon: "/icons/university.svg" },
];

const bottomMenuItems = [
  { name: "Notification", path: "/Student/notification", icon: "/icons/notification.svg" },
  { name: "Settings", path: "/Student/settings", icon: "/icons/settings.svg" },
];


  const getClass = (path: string) => pathname.startsWith(path) ? "menu-item active" : "menu-item";

  const getIcon = (base: string, isActive: boolean) => {
    if (!isActive) return base;
    const parts = base.split(".");
    return `${parts[0]}.${parts[1]}`;
  };

  if (isMobile && !mobileOpen) return null;

  return (
    <>
      {isMobile && mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${isCollapsed && !isMobile ? "collapsed" : ""} ${isMobile ? "mobile" : ""} ${mobileOpen ? "open" : ""}`}>
        {!isMobile && (
          <button className={`collapse-btn ${isCollapsed ? "collapsed" : ""}`} onClick={toggleCollapse}>
            <img src={isCollapsed ? "/ic-eva_arrow-ios-forward-fill.svg" : "/ic-eva_arrow-ios-back-fill.svg"} alt="Toggle sidebar" />
          </button>
        )}
        <div className="sidebar-content">
          <div className="sidebar-logo">
            <Image
              src="/icons/logo.svg"   // Path relative to /public
              alt="Logo"
              width={60}             // Adjust width as needed
              height={40}             // Adjust height as needed
              priority                // optional: preloads image
            />
          </div>
          {/* Top menu */}
          <nav className="menu">
            {mainMenuItems.map((item) => (
              <Link key={item.name} href={item.path} className={getClass(item.path)} onClick={() => isMobile && setMobileOpen(false)}>
                <Image src={getIcon(item.icon, pathname === item.path)} alt={item.name} width={24} height={24} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        {/* Bottom menu */}
          <nav className="menu bottom-menu">
            {bottomMenuItems.map(item => {
              const isNotification = item.name === "Notification";
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`menu-subitem ${pathname === item.path ? "active" : ""}`}
                  onClick={() => isMobile && setMobileOpen(false)}
                >
                  <div className="relative flex items-center">
                    <Image src={item.icon} alt={item.name} width={24} height={24} />
                    {/* Badge for unread notifications */}
                    {isNotification && unreadCount > 0 && (
                      <span className="unread-badge absolute flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-500 rounded-full">
                        {unreadLabel}
                      </span>
                    )}
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="sidebar-glow" ref={glowRightRef}></div>
        <div className="sidebar-glow-left" ref={glowLeftRef}></div>
      </aside>
    </>
  );
};

export default LeftSidebar;
