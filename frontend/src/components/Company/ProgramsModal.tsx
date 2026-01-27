"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import "react-day-picker/dist/style.css";

interface ProgramsData {
  Program: string[];
}


interface ProgramsModalProps {
  Program?: string[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProgramsData) => void;
}


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

// Main Programs Modal Component
const ProgramsModal: React.FC<ProgramsModalProps> = ({
  Program,
  isOpen,
  onClose,
  onSave,
}) => {
  const [programText, setProgramText] = useState<string>("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const incoming = Program ?? [];
    setProgramText(incoming.join(", "));
  }, [Program, isOpen]);
  const submit = async () => {
    setLoading(true);
    try {
      const parsed = Array.from(
        new Set(
          programText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      );
      await onSave({ Program: parsed });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/35 backdrop-blur-l z-50" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative z-60 w-full max-w-[640px] max-h-[95vh] flex flex-col isolate rounded-4xl bg-[rgba(255,255,255,0.04)] overflow-hidden"
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
            {Program ? "Edit Programs" : "Add Programs"}
          </h2>
        </div>

        {/* Form - scrollable */}
        <form
          className="flex-1 flex flex-col gap-4 p-4  bg-white "
          onSubmit={handleSubmit}
        >

          <ParallelogramInput
            label="Programs Name"
            placeholder="Ex: Internship, Full-time, Part-time"
            value={programText}
            onChange={(e) => setProgramText(e.target.value)}
          />
          {/* Add multiple skills separate by comma */}
          <span
            className="ml-5"
            style={{
              width: "215px",
              height: "18px",
              fontFamily: "'Public Sans', sans-serif",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "18px",
              display: "flex",
              alignItems: "center",
              color: "rgba(23, 23, 23, 0.4)",
            }}
          >
            Add multiple programs separate by comma
          </span>

        </form>

        {/* Footer */}
        <div
          className="flex items-center justify-center w-full h-[90px] flex-shrink-0 bg-cover bg-center px-4"
          style={{
            backgroundImage: "url('/cards/cardFooter.svg')",
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
              type="button"
              onClick={submit}
              disabled={loading}
              className="relative w-[100px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105"
            >
              <span className="skew-x-[12deg] font-bold text-black">
                {loading ? <Loader2 className="animate-spin" /> : Program ? "Update" : "Add"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramsModal;
