"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
      {/* Skewed wrapper */}
      <div
        className={`
          skew-x-[-12deg]
          rounded-xl
          shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.25)]
          border
          ${
            isSuccess
              ? "bg-[#FFEB9C] border-black"
              : "bg-[#FFE4E4] border-red-400"
          }
        `}
      >
        {/* Unskew content */}
        <div className="skew-x-[12deg] flex items-start gap-3 px-5 py-4 min-w-[320px] max-w-[480px]">
          {/* Icon */}
          <div className="mt-[2px]">
            {isSuccess ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#1E1E1E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="#B42318"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          {/* Message */}
          <p className="flex-1 text-sm font-medium text-[#1E1E1E] leading-relaxed">
            {message}
          </p>

          {/* Close */}
          <button
            onClick={onClose}
            className={`
              w-7 h-7
              flex items-center justify-center
              rounded-full
              border
              transition-colors
              flex-shrink-0
              ${
                isSuccess
                  ? "bg-[#FFF3C4] border-black hover:bg-[#FFEB9C]"
                  : "bg-[#FFECEC] border-red-400 hover:bg-[#FFDADA]"
              }
            `}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke={isSuccess ? "#1E1E1E" : "#B42318"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
