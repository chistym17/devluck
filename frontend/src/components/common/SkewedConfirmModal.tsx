// src/components/common/SkewedConfirmModal.tsx
"use client";

interface SkewedConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SkewedConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: SkewedConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 skew-x-[-12deg]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="skew-x-[12deg]">
          <h3 className="text-xl font-bold mb-4 text-[#1E1E1E]">
            {title}
          </h3>

          <p className="text-gray-600 mb-6">
            {description}
          </p>

          <div className="flex gap-4 justify-end">
            {/* Cancel */}
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors skew-x-[-12deg]"
            >
              <span className=" flex items-center justify-center skew-x-[12deg]">
                {cancelText}
              </span>
            </button>

            {/* Confirm */}
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`
                px-4 py-2 rounded-lg text-white transition-colors skew-x-[-12deg]
                ${danger ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-black/80"}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span className=" flex items-center justify-center skew-x-[12deg]">
                {loading ? "Processing..." : confirmText}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
