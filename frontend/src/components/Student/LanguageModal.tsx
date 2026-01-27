"use client";

import React, { useState,useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

interface LanguageData {
  id?: string;
  name: string;   // language name
  level: string;  // Fluent, Basic, Conversational
}

interface LanguageModalProps {
  language?: LanguageData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LanguageData) => void;
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
            alignItems: "center",
            padding: "0 20px",
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

// ---------------- Main experience Modal ----------------
const LanguageModal: React.FC<LanguageModalProps> = ({ language, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<LanguageData>({
    name: "",
    level: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (language) setFormData(language);
    else setFormData({ name: "",level: "" });
  }, [language, isOpen]);



  const handleInputChange = (field: keyof LanguageData, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving language:", error);
    } finally {
      setLoading(false);
    }
  };

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
            {language ? "Edit Language" : "Add Language"}
            </h2>
        </div>

        {/* Form - scrollable */}
        <div
            className="flex-1 flex flex-col gap-4 p-4  bg-white "
            onSubmit={handleSubmit}
        >
           <ParallelogramSelect
            label="Level"
            placeholder="Select level"
            value={formData.level}
            options={["Basic", "Conversational", "Fluent", "Native"]}
            onChange={(value) => handleInputChange("level", value)}
          />
             <ParallelogramInput
            label="Language Name"
            placeholder="Enter language name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />

          </div>
        {/* Footer */}
        <div
            className="flex items-center justify-center w-full h-[90px] flex-shrink-0 bg-cover bg-center px-4"
            style={{
            backgroundImage: "url('/cards/cardFooter.svg')",
            }}
        >
            <div className="flex w-[400px] justify-between">
            <button
                type="button"
                onClick={onClose}
                
                className="relative w-[100px] h-[40px] skew-x-[-12deg] bg-transparent border border-black flex items-center justify-center overflow-hidden rounded-lg hover:bg-black/10 transition-all"
            >
                <span className="skew-x-[12deg] font-bold text-black">Cancel</span>
            </button>

            <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}   // 👈 manually call submit
                className="relative w-[100px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105"
            >
                <span className="skew-x-[12deg] font-bold text-black">
                {loading ? <Loader2 className="animate-spin" /> : language ? "Update" : "Add"}
                </span>
            </button>
            </div>
        </div>
       
        </div>
    </div>
    );
};

export default LanguageModal;
