"use client";

import "react-day-picker/dist/style.css";

interface ConfirmSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ConfirmSubmitModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ConfirmSubmitModalProps) => {
  if (!isOpen) return null;
  

    return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/35 backdrop-blur-l" onClick={onClose} />

        {/* Modal */}
        <div
        className="relative w-full max-w-[640px] max-h-[95vh] flex flex-col isolate rounded-4xl bg-[rgba(255,255,255,0.04)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div
            className="flex items-center justify-between w-full h-[85px] px-4 flex-shrink-0"
            style={{
            backgroundImage: "url('/cards/cardHeader.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        >
            <h2
            className="absolute flex items-center text-[#1E1E1E]"
            style={{
                width: "350px",
                height: "36px",
                left: "117.37px",
                top: "21.79px",
                fontFamily: "'Public Sans', sans-serif",
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "36px",
            }}
            >
            Confirm Submission
            </h2>
        </div>

        {/* Form - scrollable */}
        <div className="flex-1 p-6 bg-white text-sm text-gray-700 space-y-3">
        <h3 className="text-lg font-bold text-[#1E1E1E]">
            Ready to Submit Your Application?
        </h3>

        <p>Please take a final moment to:</p>

        <ul className="list-disc pl-5 space-y-1">
            <li>Ensure all required fields (*) are filled</li>
            <li>Review your answers for accuracy</li>
            <li>Confirm your contact information</li>
        </ul>
        </div>


        {/* Footer */}
        <div
            className="flex items-center justify-center w-full h-[90px] flex-shrink-0 bg-cover bg-center px-4"
           style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 638 89' fill='none'><path d='M47.4551 60.5558C47.4563 62.7525 47.1417 64.9379 46.521 67.045C45.1204 62.3152 42.228 58.165 38.2757 55.2134C34.3234 52.2618 29.5229 50.6671 24.5901 50.6671C19.6573 50.6671 14.8567 52.2618 10.9044 55.2134C6.9521 58.165 4.06008 62.3152 2.65949 67.045C1.72948 63.9 1.48671 60.5918 1.94791 57.3448C2.40912 54.0977 3.56341 50.9879 5.33239 48.2263C7.10137 45.4647 9.44353 43.1158 12.2003 41.3392C14.957 39.5626 18.0636 38.3997 21.3094 37.9296C24.5551 37.4594 27.8641 37.693 31.0116 38.6143C34.1592 39.5356 37.0718 41.1231 39.5517 43.2693C42.0317 45.4154 44.0208 48.0698 45.3845 51.0525C46.7481 54.0351 47.4544 57.2762 47.4551 60.5558Z' fill='%23FFEB9C'/><path d='M24.3768 86.6587C13.9982 86.6587 5.55469 83.6081 5.55469 73.2293C5.55469 68.2374 7.53766 63.45 11.0675 59.9202C14.5973 56.3903 19.3848 54.4072 24.3768 54.4072C29.3687 54.4072 34.1562 56.3903 37.686 59.9202C41.2158 63.45 43.1988 68.2374 43.1988 73.2293C43.1988 83.6081 34.7554 86.6587 24.3768 86.6587Z' fill='%23FFEB9C'/><path d='M634.575 60.5558C634.576 62.7525 634.262 64.9379 633.641 67.045C632.24 62.3152 629.348 58.165 625.396 55.2134C621.444 52.2618 616.643 50.6671 611.71 50.6671C606.777 50.6671 601.977 52.2618 598.025 55.2134C594.072 58.165 591.18 62.3152 589.78 67.045C588.85 63.9 588.607 60.5918 589.068 57.3448C589.529 54.0977 590.684 50.9879 592.453 48.2263C594.221 45.4647 596.564 43.1158 599.32 41.3392C602.077 39.5626 605.184 38.3997 608.43 37.9296C611.675 37.4594 614.984 37.693 618.132 38.6143C621.279 39.5356 624.192 41.1231 626.672 43.2693C629.152 45.4154 631.141 48.0698 632.505 51.0525C633.868 54.0351 634.575 57.2762 634.575 60.5558Z' fill='%23FFEB9C'/><path d='M611.497 86.6587C601.118 86.6587 592.675 83.6081 592.675 73.2293C592.675 68.2374 594.658 63.45 598.188 59.9202C601.717 56.3903 606.505 54.4072 611.497 54.4072C616.489 54.4072 621.276 56.3903 624.806 59.9202C628.336 63.45 630.319 68.2374 630.319 73.2293C630.319 83.6081 621.875 86.6587 611.497 86.6587Z' fill='%23FFEB9C'/><path d='M637.257 36.3398C631.114 31.1846 623.177 28.0762 614.51 28.0762C595.018 28.0762 579.216 43.7911 579.216 63.1758C579.216 73.0521 583.32 81.9737 589.922 88.3516H47.335C53.9369 81.9737 58.0409 73.0521 58.041 63.1758C58.041 43.7911 42.2393 28.0762 22.7471 28.0762C14.0797 28.0762 6.14317 31.1846 0 36.3398V0H637.257V36.3398Z' fill='white'/></svg>")`,
            }}
        >
            <div className="flex w-[400px] justify-between">
            <button
                onClick={onClose}
                disabled={isLoading}
                className="relative w-[100px] h-[40px] skew-x-[-12deg] bg-transparent border border-black flex items-center justify-center overflow-hidden rounded-lg hover:bg-black/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="skew-x-[12deg] font-bold text-black">Cancel</span>
            </button>

            <button
            onClick={onConfirm}
            disabled={isLoading}
            className="relative w-[100px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="skew-x-[12deg] font-bold text-black flex items-center justify-center w-full">
                    {isLoading ? (
                    <span className="flex items-center justify-center gap-2 w-full text-center">
                        <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                        </svg>
                        Processing...
                    </span>
                    ) : (
                    'Confirm'
                    )}
                </span>
            </button>

            </div>
        </div>
        </div>
    </div>
    );
};

export default ConfirmSubmitModal;
