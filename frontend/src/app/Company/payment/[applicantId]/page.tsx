// src/app/Company/payment/[contractId]/page.tsx
"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import DashboardLayout from "@/src/components/Company/DashboardLayout";
import { ArrowUpRight } from "lucide-react";
import { useParams } from "next/navigation";
import PaymentModal from "@/src/components/Company/PaymentModal";
import { useContractHandler } from "@/src/hooks/companyapihandler/useContractHandler";
import { usePaymentHandler } from "@/src/hooks/companyapihandler/usePaymentHandler";

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
};

const ContractRow = ({ payment, onSideClick, onDelete, showCheckbox = false }: ContractRowProps) => {
  const [checked, setChecked] = useState(false);
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
              e.stopPropagation(); // 🔥 prevent row click
              setChecked((prev) => !prev);
            }}
          >
            {checked ? (
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
        <div className="flex items-center justify-center skew-x-[12deg] w-full h-full">
          <div className="flex flex-col items-center justify-center gap-1">
            <svg width="77" height="72" viewBox="0 0 77 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="76.4667" height="72" fill="#FFF9E0"/>
              <path d="M27.7333 20H23.0852C18.1121 20 13.5891 22.8805 11.486 27.3871L7.08281 36.8226C3.78263 43.8944 8.94481 52 16.7488 52H27.7333" stroke="#1E1E1E" strokeWidth="1.06667"/>
              <path d="M24.7334 20V20.5H48.7334V20V19.5H24.7334V20ZM48.7334 52V51.5H24.7334V52V52.5H48.7334V52Z" fill="#1E1E1E"/>
              <path d="M36.7334 38C37.838 38 38.7334 37.1046 38.7334 36C38.7334 34.8954 37.838 34 36.7334 34C35.6288 34 34.7334 34.8954 34.7334 36C34.7334 37.1046 35.6288 38 36.7334 38Z" fill="#1E1E1E"/>
              <path d="M36.7334 31C37.838 31 38.7334 30.1046 38.7334 29C38.7334 27.8954 37.838 27 36.7334 27C35.6288 27 34.7334 27.8954 34.7334 29C34.7334 30.1046 35.6288 31 36.7334 31Z" fill="#1E1E1E"/>
              <path d="M36.7334 45C37.838 45 38.7334 44.1046 38.7334 43C38.7334 41.8954 37.838 41 36.7334 41C35.6288 41 34.7334 41.8954 34.7334 43C34.7334 44.1046 35.6288 45 36.7334 45Z" fill="#1E1E1E"/>
              <path d="M45.7335 52L50.3816 52C55.3547 52 59.8777 49.1195 61.9808 44.6129L66.384 35.1774C69.6842 28.1056 64.522 20 56.718 20L45.7335 20" stroke="#1E1E1E" strokeWidth="1.06667"/>
            </svg>

            {menuOpen && menuPos &&
            createPortal(
              <div
                ref={menuRef}
                className="fixed w-[180px] rounded-xl bg-white shadow-2xl border py-2 z-50"
                style={{
                  top: menuPos.top,
                  left: menuPos.left,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="w-full flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setMenuOpen(false);
                    onSideClick?.();
                  }}
                >
                 <svg fill="#000000" width="20px" height="20px" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><title/><path d="M84.4373,11.577a18.0012,18.0012,0,0,0-25.46,0L8.0639,62.4848A5.9955,5.9955,0,0,0,6.306,66.7271V83.6964a5.9968,5.9968,0,0,0,6,6H29.2813a5.9959,5.9959,0,0,0,4.2423-1.7579l50.92-50.9078A18.0419,18.0419,0,0,0,84.4373,11.577Zm-8.49,8.4847a6.014,6.014,0,0,1,.0058,8.4846l-4.243,4.243-8.4891-8.4861,4.2416-4.2415A5.998,5.998,0,0,1,75.9468,20.0617Zm-49.15,57.6345h-8.49V69.2116L54.7352,32.7871l8.489,8.4861Z"/></svg>

                  <span>Edit</span>
                </button>

                <button 
                  className="w-full flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.();
                  }}
                >
                  <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.99526 11.1738L14.7071 15.886C14.8642 16.0378 15.0746 16.1217 15.293 16.1198C15.5114 16.1179 15.7203 16.0303 15.8748 15.8759C16.0292 15.7215 16.1168 15.5125 16.1187 15.2941C16.1206 15.0757 16.0366 14.8653 15.8849 14.7082L11.173 9.99597L15.8849 5.28375C16.0366 5.12664 16.1206 4.91623 16.1187 4.69782C16.1168 4.47941 16.0292 4.27049 15.8748 4.11605C15.7203 3.9616 15.5114 3.874 15.293 3.8721C15.0746 3.8702 14.8642 3.95416 14.7071 4.1059L9.99526 8.81813L5.28337 4.1059C5.12557 3.95792 4.91639 3.87713 4.70009 3.88065C4.48379 3.88416 4.27735 3.97169 4.12443 4.12472C3.97152 4.27775 3.88414 4.48427 3.88078 4.70059C3.87742 4.91691 3.95835 5.12604 4.10643 5.28375L8.81749 9.99597L4.1056 14.7082C4.02605 14.785 3.96259 14.877 3.91894 14.9786C3.87529 15.0802 3.85231 15.1895 3.85135 15.3001C3.85039 15.4107 3.87146 15.5204 3.91334 15.6228C3.95522 15.7252 4.01707 15.8182 4.09528 15.8964C4.17348 15.9746 4.26648 16.0364 4.36885 16.0783C4.47121 16.1202 4.58089 16.1413 4.69149 16.1403C4.80208 16.1394 4.91138 16.1164 5.013 16.0727C5.11462 16.0291 5.20653 15.9656 5.28337 15.886L9.99526 11.1738Z"
                    fill="#1C252E"
                  />
                </svg>
                   <span>Delete</span>
                </button>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

    const ITEMS_PER_PAGE = 6;
export default function PaymentPage() {

    // ---------------modal popup--------
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<any>(null);
    const [selectedContract, setSelectedContract] = useState<any>(null);
    //-----------------------------------
    
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    
    const params = useParams<{ applicantId: string }>();
    const contractId = params.applicantId;

    const { getContractById, loading: contractLoading } = useContractHandler();
    const { listPayments: fetchPayments, deletePayment: deletePaymentApi, getPaymentStats } = usePaymentHandler();
    const [contract, setContract] = useState<any>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [paymentStats, setPaymentStats] = useState<{ totalPaid: { amount: number; count: number }; pending: { amount: number; count: number }; due: { amount: number; count: number } } | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const contractData = await getContractById(contractId);
                setContract(contractData);
                setSelectedContract({
                    id: contractData.id,
                    name: contractData.name,
                    inContractNumber: contractData.inContractNumber,
                    salary: contractData.salary,
                    currency: contractData.currency,
                });

                try {
                    const contractUuid = contractData.id;
                    const [paymentsResponse, statsResponse] = await Promise.all([
                        fetchPayments(1, 100, undefined, undefined, contractUuid),
                        getPaymentStats(contractUuid)
                    ]);
                    setPayments(paymentsResponse.items);
                    setPaymentStats(statsResponse);
                } catch (error) {
                    console.error("Failed to fetch payments or stats:", error);
                    setPayments([]);
                    setPaymentStats(null);
                } finally {
                    setStatsLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch contract:", error);
            } finally {
                setLoading(false);
            }
        };

        if (contractId) {
            fetchData();
        }
    }, [contractId, getContractById, fetchPayments]);

    //--------------------------------Action menu--------------------------
    const [menuOpen, setMenuOpen] = useState(false);
    // ---------------------------------------------------------------------

    //---------------------filter----------------------------------
    type PaymentStatus = "Pending" | "Due" | "Paid" | "All";

    const PAYMENT_STATUSES: PaymentStatus[] = ["Pending", "Due", "Paid", "All"];

    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // 🔍 Filter payments
    const filteredPayments = useMemo(() => {
        return payments.filter(payment => {
            // Search filter
            const searchMatch =
            !searchQuery.trim() ||
            (payment.applicantName && payment.applicantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (payment.contractId && payment.contractId.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (payment.transferId && payment.transferId.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (payment.monthlyAllowance && payment.monthlyAllowance.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (payment.note && payment.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (payment.paymentStatus && payment.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (payment.nextPayment && payment.nextPayment.toLowerCase().includes(searchQuery.toLowerCase()));

            // Payment status filter
            const paymentMatch =
            selectedPaymentStatus.length === 0 ||
            selectedPaymentStatus.includes("All") ||
            (payment.paymentStatus && selectedPaymentStatus.includes(payment.paymentStatus as "Pending" | "Due" | "Paid"));

            return searchMatch && paymentMatch;
        });
    }, [payments, searchQuery, selectedPaymentStatus]);

        // 📄 Pagination
        const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

        const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
        );

    const formatCurrency = (amount: number) => {
      return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${contract?.currency || 'SAR'}`;
    };

    
    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };
    
    const goToPrevious = () => {
      if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };
    
    const goToNext = () => {
      if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

return (
  <DashboardLayout>
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8">
        {/* Left: Title */}
        <h1 className="text-[28px] font-bold text-[#1E1E1E]">
          Payment - {contract?.name || "Loading..."}
        </h1>

        {/* Right: Button group */}
        <div className="flex items-center gap-4">
          {/* Example Button 1 */}
                <button
                  className="relative w-[180px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!contract}
                  onClick={() => {
                    if (!contract) return;
                    setEditingPayment(null);
                    setSelectedContract({
                      id: contract.id,
                      name: contract.name,
                      inContractNumber: contract.inContractNumber,
                      salary: contract.salary,
                      currency: contract.currency,
                    });
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
          value={statsLoading ? "..." : formatCurrency(paymentStats?.totalPaid.amount || 0)} 
          subtitle={statsLoading ? "Loading..." : `${paymentStats?.totalPaid.count || 0} payments`} 
        />
        <Card 
          title="Pending Payment" 
          value={statsLoading ? "..." : formatCurrency(paymentStats?.pending.amount || 0)} 
          subtitle={statsLoading ? "Loading..." : `${paymentStats?.pending.count || 0} pending`} 
        />
        <Card 
          title="Due" 
          value={statsLoading ? "..." : formatCurrency(paymentStats?.due.amount || 0)} 
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
                <path d="M13.8067 12.86L11.54 10.6C12.2713 9.66831 12.6681 8.51777 12.6667 7.33334C12.6667 6.2785 12.3539 5.24736 11.7678 4.37029C11.1818 3.49323 10.3489 2.80965 9.37431 2.40598C8.39978 2.00231 7.32742 1.89669 6.29285 2.10248C5.25829 2.30827 4.30798 2.81622 3.5621 3.5621C2.81622 4.30798 2.30827 5.25829 2.10248 6.29285C1.89669 7.32742 2.00231 8.39978 2.40598 9.37431C2.80965 10.3489 3.49323 11.1818 4.37029 11.7678C5.24736 12.3539 6.2785 12.6667 7.33334 12.6667C8.51777 12.6681 9.66831 12.2713 10.6 11.54L12.86 13.8067C12.922 13.8692 12.9957 13.9188 13.077 13.9526C13.1582 13.9864 13.2453 14.0039 13.3333 14.0039C13.4213 14.0039 13.5085 13.9864 13.5897 13.9526C13.671 13.9188 13.7447 13.8692 13.8067 13.8067C13.8692 13.7447 13.9188 13.671 13.9526 13.5897C13.9864 13.5085 14.0039 13.4213 14.0039 13.3333C14.0039 13.2453 13.9864 13.1582 13.9526 13.077C13.9188 12.9957 13.8692 12.922 13.8067 12.86ZM3.33334 7.33334C3.33334 6.54221 3.56793 5.76885 4.00746 5.11106C4.44698 4.45326 5.0717 3.94057 5.8026 3.63782C6.53351 3.33507 7.33777 3.25585 8.1137 3.41019C8.88962 3.56454 9.60235 3.9455 10.1618 4.50491C10.7212 5.06432 11.1021 5.77705 11.2565 6.55297C11.4108 7.3289 11.3316 8.13317 11.0289 8.86407C10.7261 9.59497 10.2134 10.2197 9.55562 10.6592C8.89782 11.0987 8.12446 11.3333 7.33334 11.3333C6.27247 11.3333 5.25505 10.9119 4.50491 10.1618C3.75476 9.41162 3.33334 8.3942 3.33334 7.33334Z" fill="#1E1E1E"/>
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
                  <path d="M14 16.5C14.3852 16.5002 14.7556 16.6486 15.0344 16.9144C15.3132 17.1802 15.479 17.5431 15.4975 17.9279C15.516 18.3127 15.3858 18.6898 15.1338 18.9812C14.8818 19.2726 14.5274 19.4558 14.144 19.493L14 19.5H10C9.61478 19.4998 9.24441 19.3514 8.96561 19.0856C8.68682 18.8198 8.52099 18.4569 8.50248 18.0721C8.48396 17.6873 8.61419 17.3102 8.86618 17.0188C9.11816 16.7274 9.47258 16.5442 9.856 16.507L10 16.5H14ZM17 10.5C17.3978 10.5 17.7794 10.658 18.0607 10.9393C18.342 11.2206 18.5 11.6022 18.5 12C18.5 12.3978 18.342 12.7794 18.0607 13.0607C17.7794 13.342 17.3978 13.5 17 13.5H7C6.60218 13.5 6.22064 13.342 5.93934 13.0607C5.65804 12.7794 5.5 12.3978 5.5 12C5.5 11.6022 5.65804 11.2206 5.93934 10.9393C6.22064 10.658 6.60218 10.5 7 10.5H17ZM20 4.5C20.3978 4.5 20.7794 4.65804 21.0607 4.93934C21.342 5.22064 21.5 5.60218 21.5 6C21.5 6.39782 21.342 6.77936 21.0607 7.06066C20.7794 7.34196 20.3978 7.5 20 7.5H4C3.60218 7.5 3.22064 7.34196 2.93934 7.06066C2.65804 6.77936 2.5 6.39782 2.5 6C2.5 5.60218 2.65804 5.22064 2.93934 4.93934C3.22064 4.65804 3.60218 4.5 4 4.5H20Z" fill="#1E1E1E"/>
                </svg>
              </span>
            </button>
            {/* Action Menu – appears beside the button */}
              {menuOpen && (
                <div
                  className="absolute top-88 right-20 mt-2 w-[500px] skew-x-[-12deg] bg-white border rounded-lg shadow-lg z-50"
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

        {paginatedPayments.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2">No payments found</p>
              <p className="text-gray-400 text-sm">Create a payment to get started.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            {paginatedPayments.map((payment, index) => (
              <ContractRow
                key={index}
                payment={payment}
                showCheckbox={true}
                onSideClick={() => {
                  setEditingPayment(payment);
                  setSelectedContract(null);
                  setIsModalOpen(true);
                }}
                onDelete={() => {
                  setPaymentToDelete(payment.id);
                  setDeleteConfirmOpen(true);
                }}
              />
            ))}
          </div>
        )}


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

    <PaymentModal
      isOpen={isModalOpen}
      payment={editingPayment}
      contract={selectedContract}
      onClose={() => {
        setIsModalOpen(false);
        setEditingPayment(null);
        if (contract) {
          setSelectedContract({
            id: contract.id,
            name: contract.name,
            inContractNumber: contract.inContractNumber,
            salary: contract.salary,
            currency: contract.currency,
          });
        }
      }}
      onSave={async (data) => {
        setIsModalOpen(false);
        setEditingPayment(null);
        if (contract) {
          try {
            const contractUuid = contract.id;
            const [paymentsResponse, statsResponse] = await Promise.all([
              fetchPayments(1, 100, undefined, undefined, contractUuid),
              getPaymentStats(contractUuid)
            ]);
            setPayments(paymentsResponse.items);
            setPaymentStats(statsResponse);
            setCurrentPage(1);
          } catch (error) {
            console.error("Failed to refresh payments:", error);
          }
        }
      }}
    />

    {deleteConfirmOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirmOpen(false)}>
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 skew-x-[-12deg]" onClick={(e) => e.stopPropagation()}>
          <div className="skew-x-[12deg]">
            <h3 className="text-xl font-bold mb-4">Delete Payment</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this payment? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setPaymentToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!paymentToDelete) return;
                  setDeleting(true);
                  try {
                    await deletePaymentApi(paymentToDelete);
                    if (contract) {
                      const contractUuid = contract.id;
                      const [paymentsResponse, statsResponse] = await Promise.all([
                        fetchPayments(1, 100, undefined, undefined, contractUuid),
                        getPaymentStats(contractUuid)
                      ]);
                      setPayments(paymentsResponse.items);
                      setPaymentStats(statsResponse);
                    }
                    setDeleteConfirmOpen(false);
                    setPaymentToDelete(null);
                  } catch (error) {
                    console.error("Failed to delete payment:", error);
                    alert("Failed to delete payment. Please try again.");
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </DashboardLayout>
);
}