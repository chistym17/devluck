"use client";

import React, { useState,useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

interface ContractDispute {
  reason: string;
  note: string;
}


interface ContractDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ContractDispute) => void;
}



type ParallelogramSelectProps = {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

// Parallelogram Select Component
const ParallelogramSelect = ({
  label,
  placeholder,
  value,
  options,
  onChange,
}: ParallelogramSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full h-[48px]">
      {/* Label */}
      <label
        className="absolute -top-2 left-5 h-[18px] px-3 bg-[#FFEB9C] text-[#1E1E1E] text-xs select-none flex items-center skew-x-[-12deg] z-30"
        style={{ borderRadius: "6px" }}
      >
        <span className="skew-x-[12deg]">{label}</span>
      </label>

      {/* Field */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative w-full h-full"
      >
        <div
          className="h-full w-full border border-[#1C252E] rounded-[12px]"
          style={{ transform: "skewX(-15deg)" }}
        >
          <div
            className="h-full flex items-center justify-between px-5"
            style={{ transform: "skewX(15deg)" }}
          >
            <span
              className={`text-[14px] ${
                value ? "text-[#171717cc]" : "text-[#17171780]"
              }`}
            >
              {value || placeholder}
            </span>

            {/* Arrow */}
            <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.66752 4.66752C4.51175 4.66782 4.36079 4.61357 4.24085 4.51418L0.24085 1.18085C-0.0426562 0.945208 -0.0814581 0.524356 0.154183 0.24085C0.389825 -0.0426562 0.810677 -0.0814581 1.09418 0.154183L4.66752 3.14085L8.24085 0.26085C8.37858 0.149003 8.55521 0.0966707 8.73164 0.11544C8.90807 0.134209 9.06973 0.22253 9.18085 0.36085C9.30427 0.499423 9.36435 0.683168 9.34664 0.867889C9.32893 1.05261 9.23502 1.22159 9.08752 1.33418L5.08752 4.55418C4.96413 4.63786 4.81625 4.67776 4.66752 4.66752Z" fill="#1E1E1E"/>
            </svg>

          </div>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 right-0 mt-2 bg-white  rounded-[12px] z-40 shadow-md overflow-hidden"
         
        >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`
                  px-5 py-2 text-sm cursor-pointer
                  ${
                    value === option
                      ? "bg-[#FFEB9C] font-semibold"
                      : "hover:bg-[#FFEB9C]/60"
                  }
                `}
              >
                {option}
              </div>
            ))}
        
        </div>
      )}
    </div>
  );
};

// Parallelogram DatePicker Component
const ParallelogramDatePicker = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative w-full h-[48px]">
      {/* Label */}
      <label className="absolute -top-2 left-5 h-[18px] px-3 bg-[#FFEB9C] text-xs text-[#1E1E1E] flex items-center skew-x-[-12deg] z-30 rounded-md">
        <span className="skew-x-[12deg]">{label}</span>
      </label>

      {/* Field */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative w-full h-full"
      >
        <div
          className="h-full w-full border border-[#1C252E] rounded-[12px]"
          style={{ transform: "skewX(-15deg)" }}
        >
          <div
            className="h-full flex items-center px-5"
            style={{ transform: "skewX(15deg)" }}
          >
            <span
              className={`text-[14px] ${
                value ? "text-[#171717cc]" : "text-[#17171780]"
              }`}
            >
              {value || placeholder}
            </span>
          </div>
        </div>
      </button>

     {/* Calendar */}
{open && (
  <div
    className="absolute z-50"
    style={{
      top: "-230px", // move slightly higher
      left: "50%",   // center horizontally relative to the input
      transform: "translateX(-50%)", // center and keep parallelogram skew
      minWidth: "250px", // normal width
      maxWidth: "350px",
    }}
  >
    <div className="bg-white border rounded-[12px] p-3 shadow-lg">
        <DayPicker
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }
          }}
        />
    </div>
  </div>
)}
    </div>
  );
};

// Parallelogram Input Component
const ParallelogramInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
}) => (
  <div className="relative w-full h-[48px]">
    <label
      className="absolute -top-2 left-5 h-[18px] px-3 bg-[#FFEB9C] text-[#1E1E1E] text-xs font-normal select-none flex items-center skew-x-[-12deg] z-20"
      style={{ borderRadius: "6px" }}
    >
      <span className="skew-x-[12deg]">{label}</span>
    </label>
    <div className="overflow rounded-[12px] h-full w-full">
      <div
        className="h-full w-full border border-[#1C252E]"
        style={{ transform: "skewX(-15deg)", borderRadius: "12px", background: "transparent" }}
      >
        <div
          style={{
            transform: "skewX(15deg)",
            height: "100%",
            display: "flex",
            alignItems: "flex-start", // Align text at top
            padding: "10px 20px 0", // Top padding so text doesn't touch border
          }}
        >
          {type === "textarea" ? (
            <textarea
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="bg-transparent outline-none w-full resize-none text-[14px] text-[#171717cc] h-full"
            />
          ) : (
            <input
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="bg-transparent outline-none w-full text-[14px] text-[#171717cc]"
            />
          )}
        </div>
      </div>
    </div>
  </div>
);

// Main payment Modal Component
const DisputeModal: React.FC<ContractDisputeModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ContractDispute>({
  reason: "",
  note: "",
});


  const [loading, setLoading] = useState(false);

   useEffect(() => {
  if (isOpen) {
    setFormData({ reason: "", note: "" });
  }
}, [isOpen]);



  const handleInputChange = (field: keyof ContractDispute, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock save
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

    return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/35 backdrop-blur-l" onClick={onClose} />

        {/* Modal */}
        <div
        className="relative w-full max-w-[640px] max-h-[95vh] flex flex-col isolate rounded-4xl bg-[rgba(255,255,255,0.04)] overflow"
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
            Send Contract Dispute

            </h2>
        </div>

        {/* Form - scrollable */}
        <form
            className="flex-1 flex flex-col gap-4 p-4  bg-white "
            onSubmit={handleSubmit}
        >
            <ParallelogramSelect
            label="Select Reason"
            placeholder="Choose dispute reason"
            value={formData.reason}
            options={[
                "Payment Issue",
                "Contract Terms",
                "Work Scope Disagreement",
                "Delay / Deadline Issue",
                "Other",
            ]}
            onChange={(value) =>
                setFormData((prev) => ({ ...prev, reason: value }))
            }
            />
            <ParallelogramInput
            label="Note"
            placeholder="Write your dispute details here..."
            value={formData.note}
            type="textarea"
            onChange={(e) =>
                setFormData((prev) => ({ ...prev, note: e.target.value }))
            }
            />



            
        </form>

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
                className="relative w-[100px] h-[40px] skew-x-[-12deg] bg-transparent border border-black flex items-center justify-center overflow-hidden rounded-lg hover:bg-black/10 transition-all"
            >
                <span className="skew-x-[12deg] font-bold text-black">Cancel</span>
            </button>

            <button
                type="submit"
                disabled={loading}
                className="relative w-[100px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105"
            >
                <span className="skew-x-[12deg] font-bold text-black">
                {loading ? <Loader2 className="animate-spin" /> : "Send"}

                </span>
            </button>
            </div>
        </div>
        </div>
    </div>
    );
};

export default DisputeModal;
 