"use client";
import { useState, useEffect, useMemo } from "react";
import NotificationsCard from "./NotificationsCard";
import type { Notification } from "../../mocks/notifications.mock";
import { mockNotifications } from "../../mocks/notifications.mock";
import { createPortal } from "react-dom"; // For centered modal popup
import NotificationsCardSkeleton from "./NotificationsCardSkeleton";


export default function NotificationsGrid() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** 🧠 Simulate fetching (mock API delay) */
    useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 600); // fake API delay

      return () => clearTimeout(timer);
    }, []);

    const markAsRead = async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    };

    const markAllAsRead = async () => {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    };

  // Filters: Only read/unread (top clickable labels – no search/multi-select)
  const [selectedReadStatus, setSelectedReadStatus] = useState<string>(""); // "" = All, "read" = read only, "unread" = unread only

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Popup state (for card click)
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  /** 🧠 Client-side filtering (by read status only – top labels) */
  const filteredData = useMemo(() => {
    let filtered = notifications || [];

    // Filter by selected read status ("" = all)
    if (selectedReadStatus === "read") {
      filtered = filtered.filter((item) => item.read === true);
    } else if (selectedReadStatus === "unread") {
      filtered = filtered.filter((item) => item.read === false);
    }

    return filtered;
  }, [notifications, selectedReadStatus]);

  /** Counts for stats (from full notifications – accurate even if filtered) */
  const totalCount = notifications.length;
  const readCount = notifications.filter((n) => n.read === true).length;
  const unreadCount = notifications.filter((n) => n.read === false).length;

  /** Pagination */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedReadStatus]);

  /** Popup handlers (card click opens modal) */
  // ✅ FIXED
  const handleOpenPopup = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsPopupOpen(true);
  };

  const handleMarkAsReadInPopup = async () => {
    if (!selectedNotification?.id) return;

    await markAsRead(selectedNotification.id);

    setIsPopupOpen(false);
    setSelectedNotification(null);
  };


  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedNotification(null);
  };

  // Escape key close for popup
  useEffect(() => {
    if (!isPopupOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClosePopup();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isPopupOpen]);

  /** Mark All as Read (footer button) */
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };


  /** Pagination Controls */
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToLastPage = () => setCurrentPage(totalPages);

  /** Loading/Error States */
  if (loading)
    return (
      <div
        className="flex flex-col items-center justify-start mx-auto w-full max-w-[75rem] px-2 sm:px-2 md:px-2 py-1"
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          boxShadow:"0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
          overflow: "hidden",
        }}
      >
        <div className="w-full max-w-[74rem] h-[56px] bg-gray-100 rounded-xl flex items-center justify-between px-2 mb-2 mt-1 gap-2"> {/* Responsive inner width */}
          {[{ label: "All" }, { label: "Unread" }, { label: "Archived" }].map(
            (item) => (
              <div
                key={item.label}
                className="flex-1 h-[40px] rounded-xl bg-white/[0.08] animate-pulse"
              />
            )
          )}
        </div>

        {/* Skeleton notification cards */}
        <div className="flex flex-col w-full items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <NotificationsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-10 text-red-500">
        Error: {error}
      </div>
    );

  if (!notifications || notifications.length === 0)
    return (
      <div className="flex justify-center py-10 text-gray-400">
        No notifications available.
      </div>
    );

  /** Render UI */
  return (
    <>
     <div
        className="flex flex-col items-center justify-start mx-auto w-full max-w-[75rem] px-2 sm:px-2 md:px-2 py-1"
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          boxShadow:"0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
          overflow: "hidden",
        }}
      >

      {/* 🧠 Stats Summary Box */}
      <div className="w-full max-w-[74rem] h-[56px] bg-gray-100 rounded-xl flex items-center justify-between px-2 mb-2 mt-1 gap-2">
        {[
          { label: "All", status: "", color: "#9CA3AF", count: totalCount },
          { label: "Unread", status: "unread", color: "rgba(0, 184, 217, 0.85)", count: unreadCount }, // Blue for unread
          { label: "Archived", status: "read", color: "rgba(34, 197, 94, 0.85)", count: readCount },   // Green for read
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setSelectedReadStatus(item.status)}
            className={`flex-1 h-[40px] flex items-center justify-center gap-2 rounded-lg transition-all duration-200
              ${
                selectedReadStatus === item.status
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-500 hover:bg-white hover:text-gray-900"
              }`}
          >
            <span className="text-sm font-medium">{item.label}</span>
            <div
              className="w-6 h-6 flex items-center justify-center rounded-md text-xs font-semibold text-white"
              style={{ backgroundColor: item.color }}
            >
              {item.count}
            </div>
          </button>
        ))}
      </div>


        {/* Cards Container (max 6 visible + frosted scrollbar) */}
        <div className="notifications-scroll flex flex-col w-full items-center overflow-y-auto custom-scrollbar">
          {filteredData.length === 0 ? (
            <p className="text-gray-400 py-10 text-center text-sm">
              No notifications found for &quot;{selectedReadStatus || "All"}&quot; status.
            </p>
          ) : (
            filteredData.map((notification) => (
              <NotificationsCard
                key={notification.id}
                type={notification.type}
                id={notification.id}
                title={notification.title}
                message={notification.message}
                read={notification.read}
                created_at={notification.created_at}
                user_id={notification.user_id}
                onOpenPopup={() => handleOpenPopup(notification)}
              />
            ))
          )}
        </div>

        <style jsx>{`
          /* Notifications Scroll Container */
          .notifications-scroll {
            max-height: calc(6 * 76px);
            padding-right: 6px;
            scroll-behavior: smooth;
            overflow-y: auto;
          }

          /* ===== Transparent Scrollbar ===== */

          /* Firefox */
          .notifications-scroll {
            scrollbar-width: thin;
            background-color: transparent; /* invisible normally */
          }

          /* Chrome / Edge / Safari */
          .notifications-scroll::-webkit-scrollbar {
            width: 2px;
            height: 4px;
          }

          .notifications-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .notifications-scroll::-webkit-scrollbar-thumb {
            background-color: transparent; /* invisible normally */
            border-radius: 9999px;
            transition: background 0.3s ease;
          }

          .notifications-scroll::-webkit-scrollbar-thumb:hover {
            background-color: rgba(199, 196, 196, 0.3); /* slightly visible on hover */
          }
        `}</style>

      </div>

      {/* NEW: Enhanced Popup Modal */}
      {isPopupOpen && selectedNotification && typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <div
              className="relative flex flex-col items-start p-6 gap-4 bg-white border border-gray-200
                        shadow-xl rounded-xl overflow-y-auto w-full max-w-[32rem] h-auto max-h-[28rem]"
            >
              {/* Close button */}
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-800 font-bold text-sm hover:bg-gray-200 transition-colors"
                aria-label="Close notification details"
              >
                ×
              </button>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900">
                Title:
                <span className="font-normal ml-2 text-gray-700">{selectedNotification.title}</span>
              </h2>

              {/* Type and Date */}
              <div className="flex gap-4 text-gray-600 text-sm">
                <span>Type: <strong>{selectedNotification.type}</strong></span>
                <span>Date: <strong>{new Date(selectedNotification.created_at).toLocaleString()}</strong></span>
                {selectedNotification.read && (
                  <span className="inline-block px-4 py-1 bg-green-100 text-green-700 font-semibold rounded-lg skew-x-[-12deg]">
                    <span className="inline-block skew-x-[12deg]">
                      ✓ Already read
                    </span>
                  </span>

                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2 w-full mt-2 overflow-y-auto max-h-[180px]">
                <label className="text-gray-700 text-sm font-semibold">Message:</label>
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded p-4">
                  {selectedNotification.message || "No message available."}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-between w-full mt-4 gap-2">
                {!selectedNotification.read && (
                  <button
                    onClick={handleMarkAsReadInPopup}
                    disabled={loading}
                    className="relative w-[160px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105"
                  >
                    <span className="skew-x-[12deg] font-bold text-[#1E1E1E] flex items-center justify-center">
                      {loading ? "..." : "Mark as Read"}
                    </span>
                  </button>
                )}
                <button
                  onClick={handleClosePopup}
                  className="relative w-[160px] h-[40px] skew-x-[-12deg] bg-gray-200 flex items-center justify-center overflow-hidden rounded-md hover:bg-gray-300 transition duration-200 hover:scale-105"
                >
                  <span className="skew-x-[12deg] font-bold text-gray-800 flex items-center justify-center">
                    Cancel
                  </span>
                </button>
              </div>

            </div>
          </div>,
          document.body
      )}


    </>
  );
}
