"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
interface NotificationsCardProps {
  id: string;
  title: string;
  type: string;
  message: string;
  read: boolean;
  createdAt?: string;
  user_id: string;
  onOpenPopup: (notification: {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt?: string;
    user_id: string;
  }) => void;
}

export default function NotificationsCard({
  id,
  title,
  message,
  read,
  type,
  createdAt,
  user_id,
  onOpenPopup,
}: NotificationsCardProps) {
  const truncateId = (userId: string, maxLength = 8) => {
    if (!userId) return "Unknown";
    return userId.length > maxLength ? `${userId.slice(0, maxLength)}...` : userId;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenPopup({
      id,
      title,
      message,
      read,
      createdAt,
      user_id,
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full cursor-pointer transition-colors hover:bg-gray-50"
    >
      <div
        className="relative flex flex-row items-center justify-between w-full"
        style={{
          height: "76px",
          padding: "16px",
          gap: "24px",
          borderBottom: "1px dashed rgba(145,158,171,0.2)",
          background: "transparent", // Transparent background
          boxSizing: "border-box",
        }}
      >
        {/* ✅ Bell Icon */}
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-gray-600" />
        </div>

        {/* ✅ Main Content */}
        <div className="flex flex-row items-center justify-between flex-1 min-w-0">
          {/* Left side (title + info) */}
          <div className="flex flex-col items-start gap-1 min-w-0">
             <span
              className={`text-sm font-semibold truncate ${
                read ? "text-gray-700" : "text-[#FFE066]"
              }`}
            >
              {title || "No title"}
            </span>

            <span className="text-xs text-gray-400 flex items-center">
              <span>{formatDate(createdAt)}</span>
              <span className="mx-1">•</span>
              <span className="capitalize">{type}</span>
            </span>
          </div>

          {/* ✅ Blue dot at end if unread */}
          {!read && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFE066] flex-shrink-0 mr-2" />
          )}
        </div>
      </div>
    </div>
  );
}
 