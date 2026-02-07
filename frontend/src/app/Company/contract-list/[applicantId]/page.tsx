"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/src/components/Company/DashboardLayout";
import { mockApplicants } from "@/src/mocks/mockApplicants";
import { mockApplicantPayments } from "@/src/mocks/mockApplicantPayments";
import { ArrowUpRight } from "lucide-react";
import PaymentModal from "@/src/components/Company/PaymentModal";
import { useContractHandler } from "@/src/hooks/companyapihandler/useContractHandler";
import { usePaymentHandler } from "@/src/hooks/companyapihandler/usePaymentHandler";
import { api } from "@/src/lib/api";
import { createPortal } from "react-dom";
import { Toast } from "@/src/components/common/Toast";
  
interface Payment {
  id: string;
  applicantName: string;
  contractId?: string;
  nextPayment: string;
  monthlyAllowance?: string;
  note?: string;
  paymentStatus: string;
  applicantId?: string | null;
  transferId?: string | null;
  workLocation?: string | null;
  method?: string | null;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

/* ──────────────────────────────────────────────
   Card Component
────────────────────────────────────────────── */
const Card = ({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) => {
  return (
    <div className="relative w-[437px] h-[185px]">

      {/* ========================
          SVG Card Background
      ======================== */}
        <svg
        width="437"
        height="185"
        viewBox="0 0 437 185"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <g filter="url(#filter0_dd_12839_50658)">
            <path
            d="M333.25 8C341.794 8 347.555 18.8815 347.555 27.4258C347.555 45.0952 361.879 59.4197 379.548 59.4199H403.41C409.813 59.4199 416.68 63.8245 416.68 70.2269V123.865C416.68 139.881 403.696 152.865 387.68 152.865H49C32.9837 152.865 20 139.881 20 123.865V37C20 20.9837 32.9837 8 49 8H333.25Z"
            fill="white"
            />
        </g>

        <defs>
            <filter
            id="filter0_dd_12839_50658"
            x="0"
            y="0"
            width="436.68"
            height="184.865"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
            >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
            />
            <feMorphology
                radius="4"
                operator="erode"
                in="SourceAlpha"
                result="effect1_dropShadow_12839_50658"
            />
            <feOffset dy="12" />
            <feGaussianBlur stdDeviation="12" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.568627 0 0 0 0 0.619608 0 0 0 0 0.670588 0 0 0 0.12 0"
            />
            <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_12839_50658"
            />
            <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.568627 0 0 0 0 0.619608 0 0 0 0 0.670588 0 0 0 0.2 0"
            />
            <feBlend
                mode="normal"
                in2="effect1_dropShadow_12839_50658"
                result="effect2_dropShadow_12839_50658"
            />
            <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow_12839_50658"
                result="shape"
            />
            </filter>
        </defs>
        </svg>


      {/* ========================
          Card Content
      ======================== */}
      <div
        className="
          absolute
          left-[6.23%]
          top-[14.48%]
          right-[9.69%]
          z-10
          flex
          flex-col
          gap-1
          pl-5
        "
      >
        <h3 className="text-[32px] font-bold leading-[48px] text-[#1E1E1E]">
          {value}
        </h3>

        <h6 className="text-[18px] font-semibold leading-[28px] text-[#1E1E1E]">
          {title}
        </h6>

        {subtitle && (
          <p className="text-[12px] leading-[18px] text-[#1E1E1E]">
            {subtitle}
          </p>
        )}
      </div>

      {/* ========================
          Action Button
      ======================== */}
      <button
        className="
          absolute left-[81.86%] top-[0%]
          w-12 h-12 rounded-full
          bg-[#FFEB9C]
          flex items-center justify-center
          shadow-md z-20
          transition-all duration-200 ease-out
          hover:bg-[#FFE066]
          hover:scale-105
          group
        "
      >
        <ArrowUpRight
          size={24}
          className="
            transition-transform duration-200 ease-out
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5
          "
        />
      </button>

    </div>
  );
};

type ContractRowProps = {
  payment: Payment;
  onSideClick?: () => void;
  onDelete?: () => void;
  showCheckbox?: boolean;
  isSelected: boolean; // ✅ ADD THIS
  onSelect: (id: string, checked: boolean) => void;
};

const ContractRow = ({ payment, onSideClick, onDelete, showCheckbox = false, isSelected, onSelect }: ContractRowProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex w-full gap-4">
      {/* Main 80% section */}
      <div
        className="flex items-center skew-x-[-12deg] rounded-lg h-[72px] shadow-lg bg-white cursor-pointer hover:bg-gray-50"
        onClick={() => {
          onSideClick?.();
        }}
      >

        {/* Left spacer */}
        <div className="w-6 h-full flex-none"></div>

       {/* Checkbox */}
        {showCheckbox && (
          <div
            className="flex items-center skew-x-[12deg] justify-center w-11 h-full pl-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(payment.id!, !isSelected);
            }}
          >
            {isSelected ? (
              /* ✅ SELECTED SVG */
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path
                  d="M15.0537 9.16113C16.6809 7.53396 19.3191 7.53395 20.9463 9.16113L26.8389 15.0537C28.4659 16.6809 28.466 19.3192 26.8389 20.9463L20.9463 26.8389C19.3192 28.466 16.6809 28.4659 15.0537 26.8389L9.16113 20.9463C7.53395 19.3191 7.53396 16.6809 9.16113 15.0537L15.0537 9.16113Z"
                  fill="#FFEB9C"
                />
                <path
                  d="M31.5873 8.96738C25.7014 13.6017 22.2888 16.641 18.7083 22.3035C18.6366 22.4169 18.4767 22.4333 18.3856 22.3348L12.7212 16.2001C12.6426 16.115 12.6504 15.9817 12.7383 15.9064L15.8265 13.2606C15.9194 13.181 16.0609 13.2004 16.129 13.3019L18.3444 16.6048C24.2049 11.4469 29.2798 9.33343 31.3963 8.61265C31.6142 8.53845 31.7681 8.82499 31.5873 8.96738Z"
                  fill="#1E1E1E"
                />
              </svg>
            ) : (
              /* ⬜ UNSELECTED SVG */
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.9463 9.16112C19.3191 7.53394 16.6809 7.53394 15.0537 9.16112L9.16117 15.0537C7.53398 16.6809 7.53398 19.319 9.16117 20.9462L15.0537 26.8388C16.6809 28.466 19.3191 28.466 20.9463 26.8388L26.8388 20.9462C28.466 19.319 28.466 16.6809 26.8388 15.0537L20.9463 9.16112ZM20.357 10.3396C19.0553 9.03789 16.9447 9.03789 15.643 10.3396L10.3397 15.6429C9.03793 16.9447 9.03793 19.0552 10.3397 20.357L15.643 25.6603C16.9447 26.962 19.0553 26.962 20.357 25.6603L25.6603 20.357C26.9621 19.0552 26.9621 16.9447 25.6603 15.6429L20.357 10.3396Z"
                  fill="#637381"
                />
              </svg>
            )}
          </div>
        )}


        {/* Applicant Info */}
        <div className="flex-1 flex items-center skew-x-[12deg] h-full px-4 gap-6">

          {/* Payment Date */}
          <div className="flex flex-col justify-center w-[150px]">
            <span className="text-sm font-semibold text-gray-900">{payment.nextPayment}</span>
            <span className="text-xs text-gray-400">Payment Date</span>
          </div>

          {/* Monthly Allowance */}
          <div className="flex flex-col justify-center w-[150px]">
            <span className="text-sm font-semibold text-gray-900">{payment.monthlyAllowance}</span>
            <span className="text-xs text-gray-400">Monthly Allowance</span>
          </div>

          {/* Transfer ID */}
          <div className="flex flex-col justify-center w-[300px]">
            <span className="text-sm font-semibold text-gray-900">{payment.transferId}</span>
            <span className="text-xs text-gray-400">Transfer ID</span>
          </div>

            {/* Note */}
          <div className="flex flex-col justify-center w-[150px]">
            <span className="text-sm font-semibold text-gray-900">{payment.note || "-"}</span>
            <span className="text-xs text-gray-400">Note</span>
          </div>


            {/* Payment Status */}
            <div className="flex flex-col justify-center items-center w-[150px]">
            <div
                className={`
                ml-4 px-3 py-1 skew-x-[-12deg] rounded-[8px] text-xs font-semibold flex items-center justify-center
                ${payment.paymentStatus === "Paid" ? "bg-[#D3FCD2] border border-[#22C55E] text-[#22C55E]" : ""}
                ${payment.paymentStatus === "Due" ? "bg-[#FFDCDC] border border-[#FF4D4F] text-[#FF4D4F]" : ""}
                ${payment.paymentStatus === "Pending" ? "bg-[#FFF4CC] border border-[#F59E0B] text-[#F59E0B]" : ""}
                `}
            >
                {payment.paymentStatus}
            </div>
            <span className="text-xs text-gray-400">Payment Status</span>
            </div>

        </div>
      </div>

      {/* Second 20% section beside the main card */}
      <div
        className="relative  flex items-center w-1/10 skew-x-[-12deg] rounded-[8] h-[72px] shadow-lg bg-[#FFF9E0] cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();

          const rect = e.currentTarget.getBoundingClientRect();

         setMenuPos({
            top: rect.top + window.scrollY,
            left: rect.right + window.scrollX - 230,
          });



          setMenuOpen((prev) => !prev);
        }}
      >
        <div className="flex items-center justify-center skew-x-[12deg] w-full h-full"
        onClick={onDelete}>
          <div className="flex flex-col items-center justify-center gap-1">
            <svg
              width="77"
              height="72"
              viewBox="0 0 77 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="76.4667" height="72" fill="#FFF9E0" />

              <path
                d="M27.7333 20H23.0852C18.1121 20 13.5891 22.8805 11.486 27.3871L7.08281 36.8226C3.78263 43.8944 8.94481 52 16.7488 52H27.7333"
                stroke="#1E1E1E"
                strokeWidth="1.06667"
              />

              <path
                d="M24.7334 20V20.5H48.7334V20V19.5H24.7334V20ZM48.7334 52V51.5H24.7334V52V52.5H48.7334V52Z"
                fill="#1E1E1E"
              />

              <path
                d="M27.7334 30.3762C27.7334 29.8922 28.0784 29.4992 28.5044 29.4992H31.1694C31.6984 29.4832 32.1654 29.1002 32.3454 28.5342L32.3754 28.4342L32.4904 28.0432C32.5604 27.8032 32.6214 27.5932 32.7074 27.4062C33.0454 26.6672 33.6714 26.1542 34.3944 26.0232C34.5784 25.9902 34.7724 25.9902 34.9944 25.9902H38.4724C38.6954 25.9902 38.8894 25.9902 39.0724 26.0232C39.7954 26.1542 40.4224 26.6672 40.7594 27.4062C40.8454 27.5932 40.9064 27.8022 40.9774 28.0432L41.0914 28.4342L41.1214 28.5342C41.3014 29.1002 41.8614 29.4842 42.3914 29.4992H44.9614C45.3884 29.4992 45.7334 29.8922 45.7334 30.3762C45.7334 30.8602 45.3884 31.2532 44.9624 31.2532H28.5034C28.0784 31.2532 27.7334 30.8602 27.7334 30.3762Z"
                fill="#1E1E1E"
              />

              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M36.3294 45.9902H37.1374C39.9204 45.9902 41.3114 45.9902 42.2174 45.1042C43.1214 44.2182 43.2134 42.7652 43.3984 39.8592L43.6654 35.6712C43.7654 34.0942 43.8154 33.3052 43.3624 32.8062C42.9084 32.3062 42.1424 32.3062 40.6094 32.3062H32.8574C31.3244 32.3062 30.5574 32.3062 30.1044 32.8062C29.6504 33.3062 29.7004 34.0942 29.8014 35.6712L30.0684 39.8592C30.2534 42.7652 30.3454 44.2192 31.2504 45.1042C32.1554 45.9902 33.5464 45.9902 36.3294 45.9902Z"
                fill="#1E1E1E"
              />

              <path
                d="M45.7335 52L50.3816 52C55.3547 52 59.8777 49.1195 61.9808 44.6129L66.384 35.1774C69.6842 28.1056 64.522 20 56.718 20L45.7335 20"
                stroke="#1E1E1E"
                strokeWidth="1.06667"
              />
            </svg>

            
          </div>
        </div>
      </div>
    </div>
  );
};
const ITEMS_PER_PAGE = 6;
export default function ApplicantPage() {

  const [bulkDelete, setBulkDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastVisible, setToastVisible] = useState(false);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const params = useParams<{ applicantId: string }>();
  const contractId = params.applicantId; // This is actually the contract ID
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ------------------ States -------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contract, setContract] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentStats, setPaymentStats] = useState<{ totalPaid: { amount: number; count: number }; pending: { amount: number; count: number }; due: { amount: number; count: number } } | null>(null);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [contractLoading, setContractLoading] = useState(true);
  const [contractError, setContractError] = useState<string | null>(null);
  const [student, setStudent] = useState<any>(null);
  const [studentLoading, setStudentLoading] = useState(true);

  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ------------------ Hooks -------------------
  const { getContractById } = useContractHandler();
  const { listPayments, getPaymentStats, deletePayment } = usePaymentHandler();

  // ------------------ Fetch Contract, Student Profile, and Payments -------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!contractId) {
        setContractLoading(false);
        setContractError("Contract ID is missing");
        return;
      }

      try {
        setContractLoading(true);
        setContractError(null);
        setStudentLoading(true);

        // Fetch contract
        const contractData = await getContractById(contractId);
        setContract(contractData);

        // Fetch student profile with full data if studentId exists
        const contractWithStudentId = contractData as any;
        if (contractWithStudentId.studentId) {
          try {
            const studentResponse = await api.get<{ status: string; data: any }>(
              `/api/company/students/${contractWithStudentId.studentId}?fullProfile=true`
            );
            setStudent(studentResponse.data.data);
          } catch (error: any) {
            // Don't fail the whole page if student profile fails
          } finally {
            setStudentLoading(false);
          }
        } else {
          setStudentLoading(false);
        }

        // Fetch payments and stats for this contract
        setPaymentsLoading(true);
        setStatsLoading(true);
        try {
          const contractUuid = contractData.id;
          const [paymentsResponse, statsResponse] = await Promise.all([
            listPayments(1, 100, undefined, undefined, contractUuid),
            getPaymentStats(contractUuid)
          ]);
          setPayments(paymentsResponse.items);
          setPaymentStats(statsResponse);
        } catch (paymentError: any) {
          setPayments([]);
          setPaymentStats(null);
        } finally {
          setPaymentsLoading(false);
          setStatsLoading(false);
        }
      } catch (error: any) {
        setContractError(error.message || "Failed to fetch contract");
        setContract(null);
      } finally {
        setContractLoading(false);
      }
    };

    fetchData();
  }, [contractId, getContractById, listPayments, getPaymentStats]);

  // ------------------ Find applicant (for backward compatibility with mock data sections) -------------------
  // Note: contractId is a UUID, not a mock ID, so this will likely be undefined
  // We keep this for backward compatibility with sections that still use mock data
  const applicant = mockApplicants.find(a => a.applicantId === contractId);

  // ------------------ Filtered Payments -------------------
  type PaymentStatus = "Pending" | "Due" | "Paid" | "All";
  const PAYMENT_STATUSES: PaymentStatus[] = ["Pending", "Due", "Paid", "All"];

  // Map API payments to match the expected format
  const mappedPayments = useMemo(() => {
    return payments.map((payment: any) => ({
      companyId: payment.companyId || "",         // Added
      createdAt: payment.createdAt || "",         // Added
      updatedAt: payment.updatedAt || "",         // Added
      id: payment.id,
      applicantId: payment.studentId || payment.applicantId || "",
      applicantName: payment.applicantName || "",
      contractId: payment.contractId || "",
      transferId: payment.transferId || "",
      nextPayment: payment.nextPayment || "",
      monthlyAllowance: payment.monthlyAllowance || "",
      method: payment.method || "",
      note: payment.note || "",
      workLocation: payment.workLocation || "",
      paymentStatus: payment.paymentStatus || "Pending"
    }));
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return mappedPayments.filter(payment => {
      // Search filter
      const searchMatch =
        !searchQuery.trim() ||
        (payment.applicantId && payment.applicantId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (payment.applicantName && payment.applicantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (payment.contractId && payment.contractId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (payment.transferId && payment.transferId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (payment.method && payment.method.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (payment.workLocation && payment.workLocation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (payment.monthlyAllowance && payment.monthlyAllowance.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (payment.note && payment.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (payment.paymentStatus && payment.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (payment.nextPayment && payment.nextPayment.toLowerCase().includes(searchQuery.toLowerCase()));

      // Payment status filter
      const paymentMatch =
        selectedPaymentStatus.length === 0 ||
        selectedPaymentStatus.includes("All") ||
        selectedPaymentStatus.includes(payment.paymentStatus as "Pending" | "Due" | "Paid");

      return searchMatch && paymentMatch;
    });
  }, [mappedPayments, searchQuery, selectedPaymentStatus]);

  // Payments for this contract
  const applicantPayments = filteredPayments;

  // ------------------ Pagination -------------------
  const totalPages = Math.ceil(applicantPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = applicantPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };
  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  // ------------------ Modal Handlers -------------------
  const openModal = (payment: any) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditingPayment(null);
    setIsModalOpen(false);
  };

  // ------------------ Loading and Error States (after all hooks) -------------------
  if (contractLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      </DashboardLayout>
    );
  }

  if (contractError || !contract) {
    return (
      <DashboardLayout>
            <div className="flex items-center justify-center min-h-[80vh]">
              <div className="bg-white shadow-md rounded-lg p-8 sm:p-12 text-center max-w-md w-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4 flex items-center justify-center gap-2">
                  ❌ Contract-list Not Found
                </h2>
                <p className="text-[#555] text-base sm:text-lg">
                  No contract-list with ID: <span className="font-semibold text-[#1E1E1E]">{contractId}</span> was found.
                </p>
                <p className="text-[#777] mt-2 text-sm">
                  Please check the ID or go back to the <a href="/Company/contract-list" className="text-blue-500 hover:underline">contract-list</a>.
                </p>
              </div>
            </div>
          </DashboardLayout>
    );
  }

  // Note: applicant is from mock data and may be undefined when using real contract data
  // This is okay - we'll use contract data instead where needed

  return (
    <DashboardLayout>
       <div
        className="
          py-6 min-h-[800px]
          bg-no-repeat
          bg-[center_top]
          bg-[length:340px_auto]
          sm:bg-[65%_top]
          sm:bg-auto
        "
        style={{
          backgroundImage: "url('/pages/applicantInfoBackground.svg')",
          transform: "scale(0.96)",
          transformOrigin: "top center",
        }}
      >


            {/* ✅ CONTENT CONTAINER */}
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div
            className="
              flex flex-row items-start
              justify-start mt-80 sm:mt-0
            "
          >
            <div className="w-[450px] h-auto flex flex-col gap-4"> {/* <-- gap between sections */}

              <div className="flex flex-col gap-[10px] w-[500px]">

                {/* Name + Button Row */}
                <div className="flex items-center justify-between w-full">
                  <h1 className="font-barlow font-extrabold text-[40px] leading-[64px] text-[#1E1E1E]">
                    {student?.name || applicant?.name || contract?.name || contractId}
                  </h1>

                  <div
                    className="relative w-[120px] h-[35px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105"
                  >
                    <span className="skew-x-[12deg] font-bold text-[14px] text-[#1E1E1E]">
                      {student?.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : applicant?.status ? applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1) : contract?.status || "Unknown"}
                    </span>
                  </div>

                  </div>

                  {/* Description */}
                <p className="font-publicSans text-[16px] leading-[24px] text-[#1E1E1E]">
                  {student?.description
                    ? student.description.length > 250
                      ? student.description.slice(0, 250) + "..."
                      : student.description
                    : applicant
                    ? applicant.description.length > 250
                      ? applicant.description.slice(0, 250) + "..."
                      : applicant.description
                    : "Applicant description not found."}
                </p>
                </div>


              {/* Frame 313 example */}
              <div className="flex flex-row justify-between items-center gap-20 w-full sm:max-w-[655px] sm:min-w-[400px] h-full"> {/* <-- updated height */}

                {/* Profile Ranking Card */}
                <div className="relative flex flex-col items-center justify-center w-[200px] sm:w-[260px] h-[260px]">

                  <div className="relative w-[260px] sm:w-[260px] h-[175px]">
                    {/* Background number or placeholder */}
                    <div
                      className={`font-barlow font-extrabold leading-[175px] text-[#C2C2C2] flex w-[200px] sm:w-[260px] h-[175px]
                        ${student?.profileRanking ? "text-[200px]" : "text-[100px] leading-[175px] text-center justify-center items-center"}
                      `}
                    >
                      {student?.profileRanking ?? "N/A"}
                    </div>

                    {/* Profile Ranking label */}
                    <h4 className="absolute left-[70px] top-[85px] font-publicSans font-bold text-[24px] leading-[36px] text-[#1E1E1E]">
                      Profile Ranking
                    </h4>
                  </div>

                  <div className=" justify-between items-center w-[300px] h-[81px] p-[16px] flex flex-col ">
                    {/* Profile Progress Label */}
                    <div className="flex flex-row justify-between items-center w-[200px] sm:w-[260px] h-[19px]">
                      <span className="font-bold text-[12px] leading-[18px] uppercase text-[#1E1E1E]">
                        Profile Progress
                      </span>
                      
                      <span className="font-bold text-[12px] leading-[18px] uppercase text-[#1E1E1E]">
                        {student?.profileComplete || applicant?.profileComplete || 0}%
                      </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="relative w-[200px] sm:w-[260px] h-[16px] bg-[#1E1E1E] transform -skew-x-[20deg]  rounded-[4px]">
                      {/* Progress Fill */}
                      <div
                        className="absolute left-0.5 top-1/2 h-[14px] -translate-y-1/2 rounded bg-[#FFEB9C]"
                        style={{ width: `${student?.profileComplete || applicant?.profileComplete || 0}%` }}
                      />

                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-[62px] h-[152px] mx-auto">
                  {[
                    { value: (student as any)?.email ?? "—", label: "Email", key: "email" },
                    { value: student?.availability ?? "—", label: "Availability", key: "availability" },
                    { value: (student as any)?.salaryExpectation ? (student as any).salaryExpectation.toLocaleString() : "—", label: "Salary Expectation", key: "salaryExpectation" },
                  ].map((item) => (
                    <div key={item.key} className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
                      <img src="/cards/tag.svg" alt="Tag Icon" />
                    <div className="flex flex-col justify-center items-start w-[77px] h-[40px] flex-none gap-1">
                      <span className="w-[77px] h-[22px] text-[14px] font-normal leading-[22px] text-[#1E1E1E] flex items-center">
                          {item.value}
                      </span>
                        <span className="w-[100px] h-[18px] text-[12px] font-normal leading-[18px] text-[#00000090] flex items-center">
                          {item.label}
                      </span>
                    </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Parallelogram Card */}
            <div className="hidden sm:block absolute top-50 left-80 w-[460px] h-auto relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                Skills
              </h3>
            </div>

            {/* Parallelogram background */}
              <div
                className="w-full max-w-[655px] min-w-[460px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden"
                style={{ maxHeight: "250px" }} // <-- crucial
              >
                {/* Inner content (counter-skew) */}
                <div className="transform skew-x-12 px-8 w-full h-full overflow-y-auto">
                {student?.skills && student.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {student.skills.map((skillItem: any) => (
                      <span
                        key={skillItem.skill?.id || skillItem.skillId}
                        className="px-4 py-2 text-[14px] font-publicSans text-[#1E1E1E] transform -skew-x-12 rounded-[8px] border border-black/80 whitespace-nowrap transform-none"
                      >
                        {skillItem.skill?.name || skillItem.name || 'Unknown'}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#555] font-publicSans">No skills info available.</p>
                )}
              </div>
              </div>
            </div>
          </div>

          {/* Skills Parallelogram Card */}
          <div className="flex flex-col items-center justify-center mt-10 sm:mt-40 gap-10">

            {/* Skills Card */}
              <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative sm:hidden">

                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                  Skills
                  </h3>
                </div>
                <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
                  <div className="transform skew-x-12 px-8 w-full h-full overflow-y-auto">
                    {student?.skills && student.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {student.skills.map((skillItem: any) => (
                          <span
                            key={skillItem.skill?.id || skillItem.skillId}
                            className="px-4 py-2 text-[14px] font-publicSans text-[#1E1E1E] transform -skew-x-12 rounded-[8px] border border-black/80 whitespace-nowrap transform-none"
                          >
                            {skillItem.skill?.name || skillItem.name || 'Unknown'}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#555] font-publicSans">No skills info available.</p>
                    )}
                  </div>
                </div>
              </div>

            {/* Row 1 */}
            <div className="flex flex-row items-start xl:items-stretch justify-center gap-10 flex-wrap xl:flex-nowrap w-full">


              {/* Experience Card */}
              <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                  Experience
                  </h3>
                </div>
                <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
                  <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                  {student?.experiences && student.experiences.length > 0 ? (
                    student.experiences.map((exp: any) => (
                        <div key={exp.id} className="px-4 py-2 w-full">
                          <div className="flex items-center justify-between">
                            {/* Left side: SVG + Role */}
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C"/>
                              </svg>
                              <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E] transform-none">
                                {exp.role}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[12px] text-[#555] transform-none">
                            <span className="font-publicSans">{exp.companyName}</span>
                            {/* small rotated square */}
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="transform rotate-45"
                            >
                              <rect x="3.53564" width="5" height="5" fill="black" />
                            </svg>
                            <span className="font-publicSans transform-none">{exp.date}</span>
                          </div>
                          {exp.description && (
                            <p className="font-publicSans text-[12px] text-[#1E1E1E] mt-1 break-words">
                              {exp.description.split(" ").slice(0, 10).join(" ")}
                              {exp.description.split(" ").length > 10 ? "..." : ""}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-[#555] font-publicSans py-4">No experience info available.</p>
                    )}
                  </div>
                </div>
              </div>


              {/* Card 2 */}
              <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]  ">
                      Education
                    </h3>
                </div>
                <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
                  <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                  {student?.educations && student.educations.length > 0 ? (
                    student.educations.map((edu: any) => (
                        <div key={edu.id} className="px-4 py-2 w-full">
                          <div className="flex items-center justify-between">
                            {/* Left side: SVG + Major */}
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C" />
                              </svg>
                              <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E]">
                                {edu.major || edu.degree || "Education"}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[12px] text-[#555]">
                            <span className="font-publicSans">{edu.institution || edu.name || "Institution"}</span>

                            {/* small rotated square */}
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="transform rotate-45"
                            >
                              <rect x="3.53564" width="5" height="5" fill="black" />
                            </svg>

                            <span className="font-publicSans">{edu.startDate} - {edu.endDate || "Present"}</span>
                          </div>
                          {edu.description && (
                            <p className="font-publicSans text-[12px] text-[#1E1E1E] mt-1">
                              {edu.description.split(" ").slice(0, 10).join(" ")}
                              {edu.description.split(" ").length > 10 ? "..." : ""}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-[#555] font-publicSans py-4">No education info available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-row items-start xl:items-stretch justify-center gap-10 flex-wrap xl:flex-nowrap w-full">

              {/* Language Card */}
              <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                  Languages
                  </h3>
                </div>
                <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
                  <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                  {student?.languages && student.languages.length > 0 ? (
                    student.languages.map((lang: any) => (
                        <div key={lang.id} className="px-4 py-2 w-full">
                          <div className="flex items-center justify-between">
                            {/* Left side: SVG + Language name */}
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C" />
                              </svg>
                              <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E]">
                                {lang.name || lang.language}
                              </h4>
                            </div>
                          </div>

                          {/* Level text (optional) */}
                          {lang.level && (
                            <p className="font-publicSans text-[12px] text-[#555] mt-1">
                              {lang.level}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-[#555] font-publicSans py-4">No language info available.</p>
                    )}
                  </div>
                </div>
              </div>


              {/* Portfolio Card */}
              <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                  Portfolio
                  </h3>
                </div>
                <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
                  <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                    {student?.portfolios && student.portfolios.length > 0 ? (
                      student.portfolios.map((port: any) => (
                        <div key={port.id} className="px-4 py-2 w-full">
                          <div className="flex items-center justify-between">
                            {/* Left side: SVG + Portfolio Name */}
                            <div className="flex items-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C" />
                              </svg>
                              <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E]">
                                {port.name || port.title || "Portfolio"}
                              </h4>
                            </div>
                          </div>

                          {/* Portfolio link */}
                          {port.url && (
                            <div className="w-full flex items-center gap-2 mt-1">
                              {/* Conditional SVG icon */}
                              {port.name && port.name.toLowerCase().includes("github") ? (
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect width="40" height="40" rx="8" fill="#FFEB9C" />
                                  <g clipPath="url(#clip0)">
                                    <path d="M20 8.5C13.37 8.5 8 13.78 8 20.292C8 25.503 11.438 29.922 16.205 31.48C16.805 31.591 17.025 31.226 17.025 30.913C17.025 30.633 17.015 29.891 17.01 28.908C13.672 29.619 12.968 27.326 12.968 27.326C12.422 25.965 11.633 25.601 11.633 25.601C10.546 24.87 11.717 24.885 11.717 24.885C12.922 24.967 13.555 26.1 13.555 26.1C14.625 27.903 16.364 27.382 17.05 27.081C17.158 26.318 17.467 25.799 17.81 25.504C15.145 25.209 12.344 24.195 12.344 19.677C12.344 18.39 12.809 17.338 13.579 16.513C13.444 16.215 13.039 15.016 13.684 13.392C13.684 13.392 14.689 13.076 16.984 14.601C17.944 14.339 18.964 14.209 19.984 14.203C21.004 14.209 22.024 14.339 22.984 14.601C25.264 13.076 26.269 13.392 26.269 13.392C26.914 15.016 26.509 16.215 26.389 16.513C27.154 17.338 27.619 18.39 27.619 19.677C27.619 24.207 24.814 25.204 22.144 25.494C22.564 25.848 22.954 26.571 22.954 27.676C22.954 29.254 22.939 30.522 22.939 30.905C22.939 31.214 23.149 31.583 23.764 31.465C28.565 29.917 32 25.495 32 20.292C32 13.78 26.627 8.5 20 8.5Z" fill="black" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0">
                                      <rect width="24" height="24" fill="white" transform="translate(8 8)" />
                                    </clipPath>
                                  </defs>
                                </svg>
                              ) : (
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect width="40" height="40" rx="8" fill="#FFEB9C" />
                                  <path d="M12.5 15.5C12.8978 15.5 13.2794 15.658 13.5607 15.9393C13.842 16.2206 14 16.6022 14 17V27.5C14 27.8978 13.842 28.2794 13.5607 28.5607C13.2794 28.842 12.8978 29 12.5 29H9.5C8.673 29 8 28.328 8 27.5V17C8 16.172 8.673 15.5 9.5 15.5H12.5ZM21.5 11C21.8978 11 22.2794 11.158 22.5607 11.4393C22.842 11.7206 23 12.1022 23 12.5V27.5C23 27.8978 22.842 28.2794 22.5607 28.5607C22.2794 28.842 21.8978 29 21.5 29H18.5C17.673 29 17 28.328 17 27.5V12.5C17 11.672 17.673 11 18.5 11H21.5ZM30.5 18.5C30.8978 18.5 31.2794 18.658 31.5607 18.9393C31.842 19.2206 32 19.6022 32 20V27.5C32 27.8978 31.842 28.2794 31.5607 28.5607C31.2794 28.842 30.8978 29 30.5 29H27.5C27.1022 29 26.7206 28.842 26.4393 28.5607C26.158 28.2794 26 27.8978 26 27.5V20C26 19.6022 26.158 19.2206 26.4393 18.9393C26.7206 18.658 27.1022 18.5 27.5 18.5H30.5Z" fill="black" />
                                </svg>
                              )}

                              {/* Link text */}
                              <a
                                href={port.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-publicSans text-[12px] text-[#555] break-words hover:underline"
                              >
                                {port.url.length > 50 ? port.url.substring(0, 50) + "..." : port.url}
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-[#555] font-publicSans py-4">No portfolio info available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment section  */}
        <div className="mx-auto max-w-[1400px] py-10 px-6 lg:px-10" >

          {/* Page Title */}
          <div className="flex items-center justify-between mb-8">
            {/* Left: Title */}
            <h1 className="text-[28px] font-bold text-[#1E1E1E]">
              payment
            </h1>

            {/* Right: Button group */}
            <div className="flex items-center gap-4">
              {/* Example Button 1 */}
              <button
                className="relative w-[180px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105"
                onClick={() => {
                  setEditingPayment(null); // clear previous data
                  setIsModalOpen(true);
                }}
              >
                <span className="skew-x-[12deg] font-bold text-[#1E1E1E] flex items-center justify-center">
                  Create payment
                </span>
              </button>

            </div>
          </div>

          {/* Top row: 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 gap-4 mb-8 ">
            <Card
              title="Total Paid"
              value={statsLoading ? "..." : `${(paymentStats?.totalPaid.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${contract?.currency || 'SAR'}`}
              subtitle={statsLoading ? "Loading..." : `${paymentStats?.totalPaid.count || 0} payments`}
            />
            <Card
              title="Pending Payment"
              value={statsLoading ? "..." : `${(paymentStats?.pending.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${contract?.currency || 'SAR'}`}
              subtitle={statsLoading ? "Loading..." : `${paymentStats?.pending.count || 0} pending`}
            />
            <Card
              title="Due"
              value={statsLoading ? "..." : `${(paymentStats?.due.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${contract?.currency || 'SAR'}`}
              subtitle={statsLoading ? "Loading..." : `${paymentStats?.due.count || 0} due`}
            />
          </div>

          {/* Main Column */}
          <div className="flex flex-col gap-6">
            {/* Search and Filters Row */}
            <div className="flex items-center gap-2">

              {/* Search Input – Parallelogram */}
              <div
                className="
                    relative
                    w-full max-w-md
                    skew-x-[-12deg]
                    rounded-lg
                    overflow-hidden
                    border border-black/15
                    focus-within:border-black
                    transition-all
                  "
              >
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="
                      w-full
                      px-4 py-2
                      bg-transparent
                      text-black
                      placeholder:text-black/40
                      focus:outline-none
                      skew-x-[12deg]
                    "
                />

                {/* Search Icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.8067 12.86L11.54 10.6C12.2713 9.66831 12.6681 8.51777 12.6667 7.33334C12.6667 6.2785 12.3539 5.24736 11.7678 4.37029C11.1818 3.49323 10.3489 2.80965 9.37431 2.40598C8.39978 2.00231 7.32742 1.89669 6.29285 2.10248C5.25829 2.30827 4.30798 2.81622 3.5621 3.5621C2.81622 4.30798 2.30827 5.25829 2.10248 6.29285C1.89669 7.32742 2.00231 8.39978 2.40598 9.37431C2.80965 10.3489 3.49323 11.1818 4.37029 11.7678C5.24736 12.3539 6.2785 12.6667 7.33334 12.6667C8.51777 12.6681 9.66831 12.2713 10.6 11.54L12.86 13.8067C12.922 13.8692 12.9957 13.9188 13.077 13.9526C13.1582 13.9864 13.2453 14.0039 13.3333 14.0039C13.4213 14.0039 13.5085 13.9864 13.5897 13.9526C13.671 13.9188 13.7447 13.8692 13.8067 13.8067C13.8692 13.7447 13.9188 13.671 13.9526 13.5897C13.9864 13.5085 14.0039 13.4213 14.0039 13.3333C14.0039 13.2453 13.9864 13.1582 13.9526 13.077C13.9188 12.9957 13.8692 12.922 13.8067 12.86ZM3.33334 7.33334C3.33334 6.54221 3.56793 5.76885 4.00746 5.11106C4.44698 4.45326 5.0717 3.94057 5.8026 3.63782C6.53351 3.33507 7.33777 3.25585 8.1137 3.41019C8.88962 3.56454 9.60235 3.9455 10.1618 4.50491C10.7212 5.06432 11.1021 5.77705 11.2565 6.55297C11.4108 7.3289 11.3316 8.13317 11.0289 8.86407C10.7261 9.59497 10.2134 10.2197 9.55562 10.6592C8.89782 11.0987 8.12446 11.3333 7.33334 11.3333C6.27247 11.3333 5.25505 10.9119 4.50491 10.1618C3.75476 9.41162 3.33334 8.3942 3.33334 7.33334Z" fill="#1E1E1E" />
                  </svg>
                </div>
              </div>
              {/* Filter Buttons – Parallelogram on right */}
              <div className="flex gap-2 ml-auto">
                {/*Filter Button */}
                <button className="relative w-[60px] h-[40px] skew-x-[-12deg] bg-transparent border border-black flex items-center justify-center overflow-hidden rounded-lg hover:bg-black/10 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((prev) => !prev);
                  }}
                >
                  <span className="skew-x-[12deg] font-bold text-sm text-black flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 16.5C14.3852 16.5002 14.7556 16.6486 15.0344 16.9144C15.3132 17.1802 15.479 17.5431 15.4975 17.9279C15.516 18.3127 15.3858 18.6898 15.1338 18.9812C14.8818 19.2726 14.5274 19.4558 14.144 19.493L14 19.5H10C9.61478 19.4998 9.24441 19.3514 8.96561 19.0856C8.68682 18.8198 8.52099 18.4569 8.50248 18.0721C8.48396 17.6873 8.61419 17.3102 8.86618 17.0188C9.11816 16.7274 9.47258 16.5442 9.856 16.507L10 16.5H14ZM17 10.5C17.3978 10.5 17.7794 10.658 18.0607 10.9393C18.342 11.2206 18.5 11.6022 18.5 12C18.5 12.3978 18.342 12.7794 18.0607 13.0607C17.7794 13.342 17.3978 13.5 17 13.5H7C6.60218 13.5 6.22064 13.342 5.93934 13.0607C5.65804 12.7794 5.5 12.3978 5.5 12C5.5 11.6022 5.65804 11.2206 5.93934 10.9393C6.22064 10.658 6.60218 10.5 7 10.5H17ZM20 4.5C20.3978 4.5 20.7794 4.65804 21.0607 4.93934C21.342 5.22064 21.5 5.60218 21.5 6C21.5 6.39782 21.342 6.77936 21.0607 7.06066C20.7794 7.34196 20.3978 7.5 20 7.5H4C3.60218 7.5 3.22064 7.34196 2.93934 7.06066C2.65804 6.77936 2.5 6.39782 2.5 6C2.5 5.60218 2.65804 5.22064 2.93934 4.93934C3.22064 4.65804 3.60218 4.5 4 4.5H20Z" fill="#1E1E1E" />
                    </svg>
                  </span>
                </button>
                {/* Action Menu – appears beside the button */}
                {menuOpen && (
                  <div
                    className="absolute right-30 w-[500px] skew-x-[-12deg] bg-white border rounded-lg shadow-lg z-50"
                    onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                  >
                    <div className="p-2">
                      {/* Payment Status */}
                      <h6 className="px-2 skew-x-[12deg] py-1 font-semibold mt-2">Payment Status</h6>
                      <div className="flex gap-2">
                        {PAYMENT_STATUSES.map((status) => {
                          const isSelected = selectedPaymentStatus.includes(status);

                          return (
                            <div
                              key={status}
                              className="flex items-center skew-x-[12deg] px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-md"
                              onClick={() => {
                                if (status === "All") {
                                  setSelectedPaymentStatus(["Pending", "Due", "Paid", "All"]);
                                } else {
                                  setSelectedPaymentStatus(prev =>
                                    prev.includes(status)
                                      ? prev.filter(s => s !== status && s !== "All")
                                      : [...prev.filter(s => s !== "All"), status]
                                  );
                                }
                              }}
                            >
                              <div className="flex items-center justify-center w-9 h-9 mr-2">
                                {isSelected ? /* ✅ SELECTED SVG */
                                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                    <path
                                      d="M15.0537 9.16113C16.6809 7.53396 19.3191 7.53395 20.9463 9.16113L26.8389 15.0537C28.4659 16.6809 28.466 19.3192 26.8389 20.9463L20.9463 26.8389C19.3192 28.466 16.6809 28.4659 15.0537 26.8389L9.16113 20.9463C7.53395 19.3191 7.53396 16.6809 9.16113 15.0537L15.0537 9.16113Z"
                                      fill="#FFEB9C"
                                    />
                                    <path
                                      d="M31.5873 8.96738C25.7014 13.6017 22.2888 16.641 18.7083 22.3035C18.6366 22.4169 18.4767 22.4333 18.3856 22.3348L12.7212 16.2001C12.6426 16.115 12.6504 15.9817 12.7383 15.9064L15.8265 13.2606C15.9194 13.181 16.0609 13.2004 16.129 13.3019L18.3444 16.6048C24.2049 11.4469 29.2798 9.33343 31.3963 8.61265C31.6142 8.53845 31.7681 8.82499 31.5873 8.96738Z"
                                      fill="#1E1E1E"
                                    />
                                  </svg> :  /* ⬜ UNSELECTED SVG */
                                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M20.9463 9.16112C19.3191 7.53394 16.6809 7.53394 15.0537 9.16112L9.16117 15.0537C7.53398 16.6809 7.53398 19.319 9.16117 20.9462L15.0537 26.8388C16.6809 28.466 19.3191 28.466 20.9463 26.8388L26.8388 20.9462C28.466 19.319 28.466 16.6809 26.8388 15.0537L20.9463 9.16112ZM20.357 10.3396C19.0553 9.03789 16.9447 9.03789 15.643 10.3396L10.3397 15.6429C9.03793 16.9447 9.03793 19.0552 10.3397 20.357L15.643 25.6603C16.9447 26.962 19.0553 26.962 20.357 25.6603L25.6603 20.357C26.9621 19.0552 26.9621 16.9447 25.6603 15.6429L20.357 10.3396Z"
                                      fill="#637381"
                                    />
                                  </svg>}
                              </div>
                              <span className="text-sm">{status}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedIds.length > 0 && (
              <div className="ml-[45px] mb-4 skew-x-[-12deg]">
                <div className="flex items-center justify-between bg-[#FFF9E0] border rounded-lg px-4 py-3">
                  
                  {/* Unskew content */}
                  <div className="flex items-center justify-between w-full skew-x-[12deg]">
                    <span className="text-sm font-semibold">
                      {selectedIds.length} selected
                    </span>
                    <div className="flex gap-2">
                     {/* ✅ Unselect Button */}
                      <button
                        className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 skew-x-[-12deg] transition duration-200 hover:scale-105"
                        onClick={() => setSelectedIds([])}
                      >
                        <span className="flex items-center justify-center skew-x-[12deg]">
                          Unselect
                        </span>
                      </button>

                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 skew-x-[-12deg] transition duration-200 hover:scale-105"
                        onClick={() => {
                          setBulkDelete(true);
                          setDeleteConfirmOpen(true);
                        }}
                      >
                        <span className="flex items-center justify-center skew-x-[12deg]">
                          Delete Selected
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 mt-4">
              {paymentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
                </div>
              ) : applicantPayments.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  No payments found
                </div>
              ) : (
                paginatedPayments.map((payment, index) => (
                  <ContractRow
                key={index}
                payment={payment}
                showCheckbox={true}
                isSelected={selectedIds.includes(payment.id!)}
                onSelect={handleSelect}
                onDelete={() => {
                  setSelectedIds(prev => prev.filter(id => id !== payment.id));
                  setPaymentToDelete(payment.id ?? null);
                  setDeleteConfirmOpen(true);
                }}
              />
                ))
              )}
            </div>
          </div>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            {/* Previous */}
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <img src="/ic-eva_arrow-ios-back-fill.svg" alt="Previous" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`
                    relative
                    w-11 h-9
                    skew-x-[-12deg]
                    rounded-md
                    overflow-hidden
                    text-sm font-semibold
                    transition-all duration-200
                    ${currentPage === page
                    ? "border border-black text-black"
                    : "border border-transparent text-black/60 hover:bg-black/10 hover:text-black"
                  }
                  `}
              >
                {/* Un-skew content */}
                <span className="flex h-full w-full items-center justify-center skew-x-[12deg]">
                  {page}
                </span>
              </button>
            ))}

            {/* Next */}
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <img src="/ic-eva_arrow-ios-forward-fill.svg" alt="Next" />
            </button>
          </div>
        )}
      </div>
      <PaymentModal
        isOpen={isModalOpen}
        payment={editingPayment}
        contract={contract}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPayment(null);
        }}
        onSave={async (data) => {
          setIsModalOpen(false);
          setEditingPayment(null);
          // Refresh payments and stats after creating/updating
          setPaymentsLoading(true);
          setStatsLoading(true);
          try {
            const contractUuid = (contract as any)?.id;
            const [paymentsResponse, statsResponse] = await Promise.all([
              listPayments(1, 100, undefined, undefined, contractUuid),
              getPaymentStats(contractUuid)
            ]);
            setPayments(paymentsResponse.items);
            setPaymentStats(statsResponse);
          } catch (error) {
            // Failed to refresh payments or stats
          } finally {
            setPaymentsLoading(false);
            setStatsLoading(false);
          }
        }}
      />
     {deleteConfirmOpen && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setDeleteConfirmOpen(false)}
  >
    <div
      className="bg-white rounded-lg p-6 max-w-md w-full mx-4 skew-x-[-12deg]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="skew-x-[12deg]">
        <h3 className="text-xl font-bold mb-4">Delete Payment</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this payment? This action cannot be undone.
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => {
              setDeleteConfirmOpen(false);
              setPaymentToDelete(null);
              setBulkDelete(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors skew-x-[-12deg]"
            disabled={deleting}
          >
            <span className=" flex items-center justify-center skew-x-[12deg]">
              Cancel
            </span>
          </button>
          <button
           onClick={async () => {
              // If nothing selected, do nothing
              if (!paymentToDelete && selectedIds.length === 0) return;

              setDeleting(true);
              try {
                if (bulkDelete && selectedIds.length > 0) {
                  // Bulk delete
                  await Promise.all(selectedIds.map(id => deletePayment(id)));
                  setSelectedIds([]);
                } else if (paymentToDelete) {
                  // Single delete
                  await deletePayment(paymentToDelete);
                }

                // Refresh payments and stats
                if (contract) {
                  const contractUuid = contract.id;
                  const [paymentsResponse, statsResponse] = await Promise.all([
                    listPayments(1, 100, undefined, undefined, contractUuid),
                    getPaymentStats(contractUuid),
                  ]);

                  setPayments(paymentsResponse.items);
                  setPaymentStats(statsResponse);

                  // Adjust current page if deletion leaves page empty
                  const newTotalPages = Math.ceil(paymentsResponse.items.length / ITEMS_PER_PAGE);
                  if (currentPage > newTotalPages) {
                    setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
                  }
                }

                // Reset modal state
                setDeleteConfirmOpen(false);
                setPaymentToDelete(null);
                setBulkDelete(false);

                // Show success toast
                const count = bulkDelete ? selectedIds.length : 1;
                showToast(`${count} payment${count > 1 ? "s" : ""} deleted successfully!`, "success");

              } catch (error) {
                console.error("Failed to delete payment(s):", error);

                // Show error toast
                showToast("Failed to delete payment(s). Please try again.", "error");
              } finally {
                setDeleting(false);
              }
            }}

            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed skew-x-[-12deg]"
            disabled={deleting}
          >
            <span className=" flex items-center justify-center skew-x-[12deg]">
            {deleting ? "Deleting..." : "Delete"}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
)}
<Toast
  message={toastMessage}
  type={toastType}
  isVisible={toastVisible}
  onClose={() => setToastVisible(false)}
/>

    </DashboardLayout>
  );
}
