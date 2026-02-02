"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import "react-day-picker/dist/style.css";
import { useCompanyApplicationHandler } from "@/src/hooks/companyapihandler/useCompanyApplicationHandler";
import { useContractHandler } from "@/src/hooks/companyapihandler/useContractHandler";
import { useOpportunityHandler } from "@/src/hooks/companyapihandler/useOpportunityHandler";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

interface ContractData {
  email: string;
  name: string;

  contractTitle: string;

  Contract: string;

  contractStatus: string;

  startDate: string;

  endDate: string;

  salary?: string;

  note?: string;

  opportunityId?: string;
}

interface ContractModalProps {
  contract?: ContractData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ContractData) => void;
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
              className={`text-[14px] ${value ? "text-[#171717cc]" : "text-[#17171780]"
                }`}
            >
              {value || placeholder}
            </span>

            {/* Arrow */}
            <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.66752 4.66752C4.51175 4.66782 4.36079 4.61357 4.24085 4.51418L0.24085 1.18085C-0.0426562 0.945208 -0.0814581 0.524356 0.154183 0.24085C0.389825 -0.0426562 0.810677 -0.0814581 1.09418 0.154183L4.66752 3.14085L8.24085 0.26085C8.37858 0.149003 8.55521 0.0966707 8.73164 0.11544C8.90807 0.134209 9.06973 0.22253 9.18085 0.36085C9.30427 0.499423 9.36435 0.683168 9.34664 0.867889C9.32893 1.05261 9.23502 1.22159 9.08752 1.33418L5.08752 4.55418C4.96413 4.63786 4.81625 4.67776 4.66752 4.66752Z" fill="#1E1E1E" />
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
                  ${value === option
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

type Value = Date | null | [Date | null, Date | null];
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
    <div ref={ref} className="relative w-full">
      {/* Label */}
      <label className="absolute -top-2 left-5 h-[18px] px-3 bg-[#FFEB9C] text-xs text-[#1E1E1E] flex items-center skew-x-[-12deg] z-30 rounded-md">
        <span className="skew-x-[12deg]">{label}</span>
      </label>

      {/* Field */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative w-full h-[48px]"
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

      {/* react-date-picker */}
      {open && (
        <div
          className="absolute z-50"
          style={{
            top: "-230px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <DatePicker
  value={value ? new Date(value) : null}
  onChange={(val: Value) => {
    if (val instanceof Date) {
      onChange(val.toISOString().split("T")[0]);
      setOpen(false);
    }
  }}
  calendarIcon={null}
  clearIcon={null}
  isOpen={true}

/>
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

// Parallelogram Autocomplete Email Input Component
const ParallelogramEmailAutocomplete = ({
  label,
  placeholder,
  value,
  onChange,
  suggestions,
  isLoading,
  onSuggestionSelect,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions: Array<{ email: string; id: string; name: string }>;
  isLoading: boolean;
  onSuggestionSelect: (email: string, name: string) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (suggestions.length > 0 && value.length >= 1) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [suggestions, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const selected = suggestions[selectedIndex];
          onSuggestionSelect(selected.email, selected.name);
          setShowDropdown(false);
          setSelectedIndex(-1);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: { email: string; name: string }) => {
    onSuggestionSelect(suggestion.email, suggestion.name);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  return (
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
              position: "relative",
            }}
          >
            <input
              ref={inputRef}
              type="email"
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0 && value.length >= 1) {
                  setShowDropdown(true);
                }
              }}
              placeholder={placeholder}
              className="bg-transparent outline-none w-full text-[14px] text-[#171717cc]"
            />
            {isLoading && (
              <div className="absolute right-5">
                <Loader2 className="w-4 h-4 animate-spin text-[#171717cc]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 mt-2 bg-white rounded-[12px] z-40 shadow-lg border border-[#1C252E] max-h-[200px] overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`
                px-5 py-3 text-sm cursor-pointer border-b border-[#1C252E]/10 last:border-b-0
                ${index === selectedIndex
                  ? "bg-[#FFEB9C] font-semibold"
                  : "hover:bg-[#FFEB9C]/60"
                }
              `}
            >
              <div className="font-medium text-[#171717cc]">{suggestion.email}</div>
              {suggestion.name && (
                <div className="text-xs text-[#17171780] mt-1">{suggestion.name}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Contract Modal Component
const ContractModal: React.FC<ContractModalProps> = ({
  contract,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ContractData>({
    email: "",
    name: "",
    contractTitle: "",
    Contract: "",
    startDate: "",
    endDate: "",
    salary: "",
    note: "",
    contractStatus: "",
    opportunityId: "",
  });

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [validatingEmail, setValidatingEmail] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailSuggestions, setEmailSuggestions] = useState<Array<{ email: string; id: string; name: string }>>([]);
  const [isSearchingEmail, setIsSearchingEmail] = useState(false);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { searchUserByEmail } = useCompanyApplicationHandler();
  const { createContract, updateContract } = useContractHandler();
  const { opportunities, listOpportunities } = useOpportunityHandler();

  useEffect(() => {
    if (isOpen) {
      listOpportunities(1, 1000).catch(console.error);
    }
  }, [isOpen, listOpportunities]);

  useEffect(() => {
    if (contract) {
      setFormData({
        email: (contract as any).email || "",
        name: (contract as any).name || "",
        contractTitle: contract.contractTitle || "",
        Contract: contract.Contract || "",
        startDate: contract.startDate || "",
        endDate: contract.endDate || "",
        salary: (contract as any).salary || "",
        note: contract.note || "",
        contractStatus: contract.contractStatus || "",
        opportunityId: (contract as any).opportunityId || "",
      });
      // Clear email error when editing (email is optional for updates)
      setEmailError(null);
    } else {
      setFormData({
        email: "",
        name: "",
        contractTitle: "",
        Contract: "",
        startDate: "",
        endDate: "",
        salary: "",
        note: "",
        contractStatus: "",
        opportunityId: "",
      });
    }
    setSubmitError(null);
    setEmailError(null);
  }, [contract, isOpen]);


  const handleInputChange = (field: keyof ContractData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "email") {
      // Clear previous timeouts
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setEmailError(null);

      // Real-time autocomplete search (starts from first character)
      if (value.trim().length >= 1) {
        setIsSearchingEmail(true);
        searchTimeoutRef.current = setTimeout(async () => {
          try {
            const suggestions = await searchUserByEmail(value.trim());
            setEmailSuggestions(suggestions);
          } catch (error: any) {
            setEmailSuggestions([]);
          } finally {
            setIsSearchingEmail(false);
          }
        }, 150);
      } else {
        setEmailSuggestions([]);
        setIsSearchingEmail(false);
      }

      // Validate full email format when user stops typing
      if (value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          setEmailError("Invalid email format");
          return;
        }

        setValidatingEmail(true);
        validationTimeoutRef.current = setTimeout(async () => {
          try {
            const suggestions = await searchUserByEmail(value.trim());
            // Check if the exact email exists in suggestions
            const exactMatch = suggestions.find(s => s.email.toLowerCase() === value.trim().toLowerCase());
            if (!exactMatch) {
              setEmailError("User does not exist or is not a student");
            } else {
              setEmailError(null);
            }
          } catch (error: any) {
            setEmailError(error.message || "User does not exist or is not a student");
          } finally {
            setValidatingEmail(false);
          }
        }, 500);
      }
    }
  };

  const handleEmailSuggestionSelect = (email: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      email: email,
      name: name || prev.name
    }));
    setEmailSuggestions([]);
    setEmailError(null);
  };

  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const isEditing = !!(contract as any)?.id;

    // Email validation only required for new contracts
    if (!isEditing && (emailError || validatingEmail)) {
      return;
    }

    // Validation - email only required for new contracts
    if (!isEditing && !formData.email.trim()) {
      setSubmitError("Email is required for new contracts");
      return;
    }

    if (!formData.name.trim() || !formData.contractTitle.trim() || !formData.Contract || !formData.contractStatus) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      if (isEditing) {
        // Update existing contract
        const contractId = (contract as any).id;
        const contractData = {
          contractTitle: formData.contractTitle,
          name: formData.name.trim(),
          email: formData.email.trim() || undefined,
          duration: formData.Contract,
          salary: formData.salary ? parseFloat(formData.salary) : undefined,
          note: formData.note || undefined,
          status: formData.contractStatus
        };

        await updateContract(contractId, contractData);
      } else {
        // Create new contract
        const contractNumber = `CNT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const contractData = {
          contractTitle: formData.contractTitle,
          email: formData.email.trim(),
          name: formData.name.trim(),
          inContractNumber: contractNumber,
          inContractList: [],
          currency: "USD",
          duration: formData.Contract,
          monthlyAllowance: 0,
          salary: formData.salary ? parseFloat(formData.salary) : undefined,
          workLocation: "",
          note: formData.note || undefined,
          status: formData.contractStatus,
          opportunityId: formData.opportunityId || undefined
        };

        await createContract(contractData);
      }

      onSave(formData);
      onClose();
    } catch (error: any) {
      setSubmitError(error.message || (isEditing ? "Failed to update contract" : "Failed to create contract"));
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
            {contract ? "Edit Contract" : "Create Contract"}
          </h2>
        </div>

        {/* Form - scrollable */}
        <form
          className="flex-1 flex flex-col gap-4 p-4  bg-white overflow-y-auto "
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-4">
          <ParallelogramSelect
            label="Opportunity"
            placeholder="Select opportunity"
            value={formData.opportunityId ? opportunities.find(opp => opp.id === formData.opportunityId)?.title || "" : ""}
            options={["", ...opportunities.map(opp => opp.title)]}
            onChange={(value) => {
              const selectedOpp = opportunities.find(opp => opp.title === value);
              handleInputChange("opportunityId", selectedOpp?.id || "");
            }}
          />

          <div className="flex flex-col gap-1">
            <ParallelogramEmailAutocomplete
              label="Email"
              placeholder="Enter student email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              suggestions={emailSuggestions}
              isLoading={isSearchingEmail}
              onSuggestionSelect={handleEmailSuggestionSelect}
            />
            {validatingEmail && (
              <p className="text-xs text-gray-500 ml-5">Checking...</p>
            )}
            {emailError && (
              <p className="text-xs text-red-500 ml-5">{emailError}</p>
            )}
          </div>

          <ParallelogramInput
            label="Name"
            placeholder="Enter applicant name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />

          <ParallelogramInput
            label="Contract Titlle"
            placeholder="Enter contract title"
            value={formData.contractTitle}
            onChange={(e) => handleInputChange("contractTitle", e.target.value)}
          />

          <ParallelogramSelect
            label="contractStatus"
            placeholder="Select contractStatus"
            value={formData.contractStatus}
            options={[
              "Running",
              "Completed"
            ]}
            onChange={(val) => handleInputChange("contractStatus", val)}
          />

          <ParallelogramSelect
            label="Duration"
            placeholder="Select duration"
            value={formData.Contract}
            options={[
              "1 month",
              "3 months",
              "6 months",
              "12 months",
            ]}
            onChange={(val) => handleInputChange("Contract", val)}
          />
          <ParallelogramDatePicker
            label="Start Date"
            placeholder="YYYY-MM-DD"
            value={formData.startDate}
            onChange={(val) => handleInputChange("startDate", val)}
          />
          <ParallelogramDatePicker
            label="End Date"
            placeholder="YYYY-MM-DD"
            value={formData.endDate}
            onChange={(val) => handleInputChange("endDate", val)}
          />
          <ParallelogramInput
            label="Salary"
            placeholder="Enter salary amount"
            type="number"
            value={formData.salary ?? ""}
            onChange={(e) => handleInputChange("salary", e.target.value)}
          />
          <ParallelogramInput
            label="Note"
            placeholder="Note"
            value={formData.note ?? ""}
            onChange={(e) => handleInputChange("note", e.target.value)}
          />
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

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
              onClick={handleSubmit}
              disabled={loading || !!emailError || validatingEmail}
              className="relative w-[100px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="skew-x-[12deg] font-bold text-black">
                {loading ? <Loader2 className="animate-spin" /> : contract ? "Update" : "Confirm"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
