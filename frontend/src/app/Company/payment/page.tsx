// src/app/Company/payment/page.tsx
"use client";
import {useRouter } from "next/navigation";
import { useState, useMemo, useRef, useEffect } from "react";
import DashboardLayout from "@/src/components/Company/DashboardLayout";
import { ArrowUpRight } from "lucide-react";
import { createPortal } from "react-dom";
import { useContractHandler } from "@/src/hooks/companyapihandler/useContractHandler";
import { usePaymentHandler } from "@/src/hooks/companyapihandler/usePaymentHandler";
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
    <div className="relative w-[329px] h-[185px]">

      {/* ========================
          SVG Card Background
      ======================== */}
      <svg
        viewBox="0 0 329 185"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <g filter="url(#cardShadow)">
          {/* Card Border */}
          <path
            d="M244.278 8C252.822 8 258.583 18.8815 258.583 27.4258C258.583 45.0952 272.907 59.4197 290.576 59.4199C298.805 59.4199 308.932 64.9539 308.932 73.1832V123.865C308.932 139.881 295.948 152.865 279.932 152.865H49C32.9837 152.865 20 139.881 20 123.865V37C20 20.9837 32.9837 8 49 8H244.278Z"
            fill="none"
            stroke="#e6e5eb02"
            strokeWidth="2"
          />

          {/* Card Fill */}
          <path
            d="M244.278 8C252.822 8 258.583 18.8815 258.583 27.4258C258.583 45.0952 272.907 59.4197 290.576 59.4199C298.805 59.4199 308.932 64.9539 308.932 73.1832V123.865C308.932 139.881 295.948 152.865 279.932 152.865H49C32.9837 152.865 20 139.881 20 123.865V37C20 20.9837 32.9837 8 49 8H244.278Z"
            fill="white"
          />
        </g>

        <defs>
          <filter
            id="cardShadow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            filterUnits="objectBoundingBox"
          >
            {/* Small ambient shadow */}
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="1"
              floodColor="rgba(145,158,171,0.2)"
            />
            {/* Main lifted shadow */}
            <feDropShadow
              dx="0"
              dy="12"
              stdDeviation="12"
              floodColor="rgba(145,158,171,0.12)"
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
type ClipImageProps = {
  src: string;
  size?: number; // optional, default 160
};

const ClipImage = ({ src, size = 160 }: ClipImageProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="customClip">
          <path d="M159.4 77.7357C159.4 85.6922 156.24 93.3228 150.614 98.9489L98.9489 150.614C93.3228 156.24 85.6922 159.4 77.7357 159.4H30C13.4315 159.4 0 145.969 0 129.4V30C0 13.4315 13.4315 0 30 0H129.4C145.969 0 159.4 13.4315 159.4 30V77.7357Z" />
        </clipPath>
      </defs>

      <image
        href={src}
        width={size}
        height={size}
        clipPath="url(#customClip)"
        preserveAspectRatio="xMidYMid cover"
      />
    </svg>
  );
};



type ContractCardData = {
  id: string;
  name: string;
  contractTitle: string;
  salary: number | null;
  createdAt: string;
  currency: string;
  status: string;
};

const ApplicantCard = ({
  contract,
  onClick,
}: {
  contract: ContractCardData;
  onClick?: () => void;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
  };

  const formatCurrency = (amount: number | null, currency: string) => {
    if (amount === null || amount === undefined) return "N/A";
    return `${amount} ${currency}`;
  };
  return (
    <div className="relative w-[400px] h-[299px]">
      {/* SVG Card Body */}
      <svg
        width="400"
        height="299"
        viewBox="0 0 439 299"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_dd_12813_54381)">
          <path
            d="M343.862 26.8608C340.794 36.1509 347.713 45.7217 357.496 45.7217H392.373C406.732 45.7217 418.373 57.3623 418.373 71.7217V199.055C418.373 207.233 414.526 214.933 407.988 219.844L352.129 261.799C347.626 265.181 342.147 267.01 336.515 267.01H186.099C171.845 267.01 161.149 253.978 163.927 239.998C166.706 226.018 156.01 212.986 141.756 212.986H46C31.6406 212.986 20 201.346 20 186.986V34C20 19.6406 31.6406 8 46 8H330.228C340.012 8 346.93 17.5707 343.862 26.8608Z"
            fill="white"
          />
        </g>

        <defs>
          <filter
            id="filter0_dd_12813_54381"
            x="0"
            y="0"
            width="438.373"
            height="299.01"
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
              result="effect1_dropShadow_12813_54381"
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
              result="effect1_dropShadow_12813_54381"
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
              in2="effect1_dropShadow_12813_54381"
              result="effect2_dropShadow_12813_54381"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_12813_54381"
              result="shape"
            />
          </filter>
        </defs>
      </svg>


      {/* Button */}
      <button className="absolute left-[5%] top-[73%] flex items-center  justify-center px-3 min-w-[120px] h-[36px] bg-[#FFEB9C] rounded-[8px] transition-all duration-200 hover:bg-[#FFE066] hover:scale-105"
        onClick={onClick}>
        <span className="text-[14px]  font-bold leading-[24px] text-[#1E1E1E]">
          View Details
        </span>
      </button>

      <div
          className={` absolute left-[80%] top-[8%] 
            skew-x-[-12deg]
            flex items-center justify-center
            h-[25px]
            min-w-[60px] px-2
            px-2
            rounded-sm
            
            font-bold
            leading-[24px]
            ${
              contract.status === "Running" &&
              "bg-[#D3FCD2] text-[#22C55E] text-[12px]"
            }
            ${
            contract.status=== "Completed" &&
            "bg-[#E0E0E0] text-[#666666] text-[12px]"
            }
          `}
        >
          {contract.status}
        </div>



    <div className="absolute w-[390px] h-[150px] left-[55%] top-[35%] -translate-x-[50%] -translate-y-[50%] flex flex-row gap-10">
      {/* Content Container */}
      <div className="absolute w-[340px] h-[120px] left-[80%] top-[20%] -translate-x-[50%] -translate-y-[50%] rounded-[24px_0_0_24px] flex flex-col gap-3">
        {/* Info Row */}
        <div className=" flex flex-col absolute top-25 left-[50%] -translate-x-[110%]  w-[120px] h-[110px] flex items-center justify-center gap-1">
          
          {/* Name & Subtitle */}
          <div className="flex flex-coll">
            <span className="font-semibold text-[16px] leading-[24px] text-[#1E1E1E]">
              {contract.name}
            </span>
          </div>
        
          <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
            <img 
              src="/cards/tag.svg" 
              alt="Tag Icon"
            />
            {/* Frame 97 - Label container */}
            <div className="flex flex-col justify-center items-start w-[77px] h-[40px] flex-none ">
              {/* body2 text */}
              <span className="w-[77px] h-[22px] text-[14px] font-normal text-[#1E1E1E] flex items-center">
                {formatDate(contract.createdAt)}
              </span>
              {/* caption text */}
              <span className="w-[77px] h-[18px] text-[12px] font-normal  text-[#00000090] flex items-center">
                Created Date
              </span>
            </div>
          </div>

          <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
            <img 
              src="/cards/tag.svg" 
              alt="Tag Icon"
            />
            {/* Frame 97 - Label container */}
            <div className="flex flex-col justify-center items-start w-[77px] h-[40px] flex-none">
              {/* body2 text */}
              <span className="w-[77px] h-[22px] text-[14px] font-normal text-[#1E1E1E] flex items-center">
                {formatCurrency(contract.salary, contract.currency)}
              </span>
              {/* caption text */}
              <span className="w-[100px] h-[18px] text-[12px] font-normal text-[#00000090] flex items-center">
                Salary
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <ClipImage src="/images/A1.jpeg" />
      </div>
    </div>

      {/* View Details Button */}
      <button
        className="absolute bottom-4 left-[56%] -translate-x-[120%] top-30 w-[102px] h-[111px] flex items-center justify-center"
        onClick={onClick}
      >
        <img
          src="/cards/applicantDetailsButton.svg"
          alt="Applied Students"
        />
      </button>
    </div>

    
  );
};

type ContractRowData = {
  id: string;
  name: string;
  contractTitle: string;
  salary: number | null;
  inContractNumber: string;
  note: string | null;
  status: string;
  currency: string;
};

type ContractRowProps = {
  contract: ContractRowData;
  onMainClick?: () => void;
};

const ContractRow = ({ contract, onMainClick}: ContractRowProps) => {
  const formatCurrency = (amount: number | null, currency: string) => {
    if (amount === null || amount === undefined) return "N/A";
    return `${amount} ${currency}`;
  };

  return (
    <div className="flex w-full gap-4">
      {/* Main 80% section */}
      <div
        className="flex items-center w-9/10 skew-x-[-12deg] rounded-[8] h-[72px] shadow-lg  bg-white cursor-pointer hover:bg-gray-50"
        onClick={onMainClick}
      >
        {/* Left spacer */}
        <div className="w-6 h-full flex-none"></div>

        {/* Applicant Info */}
        <div className="flex-1 flex items-center skew-x-[12deg] h-full px-4 gap-6">

          {/* Name */}
          <div className="flex flex-col justify-center w-[140px]">
            <span className="text-sm font-semibold text-gray-900">{contract.name}</span>
            <span className="text-xs text-gray-400">Applicant Name</span>
          </div>

          {/* Contract Title */}
          <div className="flex flex-col justify-center w-[140px]">
            <span className="text-sm font-semibold text-gray-900">{contract.contractTitle}</span>
            <span className="text-xs text-gray-400">Contract Title</span>
          </div>

          {/* Salary */}
          <div className="flex flex-col justify-center w-[140px]">
            <span className="text-sm font-semibold text-gray-900">{formatCurrency(contract.salary, contract.currency)}</span>
            <span className="text-xs text-gray-400">Salary</span>
          </div>

          {/* Transfer ID */}
          <div className="flex flex-col justify-center w-[160px]">
            <span className="text-sm font-semibold text-gray-900">{contract.inContractNumber}</span>
            <span className="text-xs text-gray-400">Transfer ID</span>
          </div>

           {/* Note */}
          <div className="flex flex-col justify-center w-[160px]">
            <span className="text-sm font-semibold text-gray-900">{contract.note || "N/A"}</span>
            <span className="text-xs text-gray-400">Note</span>
          </div>


          {/* Contract Status */}
          <div className="flex flex-col justify-center items-center">
            <div
              className={`
                ml-4 px-3 py-1 skew-x-[-12deg] rounded-[8] text-xs font-semibold flex items-center justify-center
                ${contract.status === "Running" ? "bg-[#D3FCD2] text-[#22C55E] text-[12px]" : ""}
                ${contract.status === "Completed" ? "bg-[#E0E0E0] text-[#666666] text-[12px]" : ""}
              `}
            >
              {contract.status}
            </div>
            <span className="text-xs text-gray-400">Contract Status</span>
          </div>
        </div>
      </div>

      {/* Second 20% section beside the main card — DETAILS BUTTON */}
      <div
        className="
          relative flex items-center justify-center
          w-1/10 h-[72px]
          skew-x-[-12deg]
          rounded-[8px]
          shadow-lg
          bg-[#FFF9E0]
          cursor-pointer
          hover:bg-[#FFF2B8]
          transition
        "
        onClick={onMainClick}
      >
        <div className="flex items-center gap-2 skew-x-[12deg] font-semibold text-[#1E1E1E]">

          {/* Details SVG */}
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
              d="M11.6667 18.3337H8.33341C5.19091 18.3337 3.61925 18.3337 2.64341 17.357C1.66675 16.3812 1.66675 14.8095 1.66675 11.667V8.33366C1.66675 5.19116 1.66675 3.61949 2.64341 2.64366C3.61925 1.66699 5.19925 1.66699 8.35841 1.66699C8.86341 1.66699 9.26758 1.66699 9.60841 1.68116C9.59758 1.74783 9.59175 1.81533 9.59175 1.88449L9.58341 4.24616C9.58341 5.16033 9.58341 5.96866 9.67091 6.61949C9.76591 7.32533 9.98341 8.03116 10.5601 8.60783C11.1351 9.18283 11.8417 9.40116 12.5476 9.49616C13.1984 9.58366 14.0067 9.58366 14.9209 9.58366H18.2976C18.3334 10.0287 18.3334 10.5753 18.3334 11.3028V11.667C18.3334 14.8095 18.3334 16.3812 17.3567 17.357C16.3809 18.3337 14.8092 18.3337 11.6667 18.3337ZM4.37508 12.0837C4.37508 11.9179 4.44093 11.7589 4.55814 11.6417C4.67535 11.5245 4.83432 11.4587 5.00008 11.4587H11.6667C11.8325 11.4587 11.9915 11.5245 12.1087 11.6417C12.2259 11.7589 12.2917 11.9179 12.2917 12.0837C12.2917 12.2494 12.2259 12.4084 12.1087 12.5256C11.9915 12.6428 11.8325 12.7087 11.6667 12.7087H5.00008C4.83432 12.7087 4.67535 12.6428 4.55814 12.5256C4.44093 12.4084 4.37508 12.2494 4.37508 12.0837ZM4.37508 15.0003C4.37508 14.8346 4.44093 14.6756 4.55814 14.5584C4.67535 14.4412 4.83432 14.3753 5.00008 14.3753H9.58341C9.74917 14.3753 9.90815 14.4412 10.0254 14.5584C10.1426 14.6756 10.2084 14.8346 10.2084 15.0003C10.2084 15.1661 10.1426 15.3251 10.0254 15.4423C9.90815 15.5595 9.74917 15.6253 9.58341 15.6253H5.00008C4.83432 15.6253 4.67535 15.5595 4.55814 15.4423C4.44093 15.3251 4.37508 15.1661 4.37508 15.0003Z"
              fill="#1E1E1E"
            />
            <path
              d="M16.1267 6.34783L12.8267 3.37866C11.8876 2.53283 11.4184 2.10949 10.8409 1.88866L10.8334 4.16699C10.8334 6.13116 10.8334 7.11366 11.4434 7.72366C12.0534 8.33366 13.0359 8.33366 15.0001 8.33366H17.9834C17.6817 7.74699 17.1401 7.26033 16.1267 6.34783Z"
              fill="#1E1E1E"
            />
          </svg>

          <span>Details</span>
        </div>
      </div>
    </div>
  );
};

const ITEMS_PER_PAGE = 6;
export default function PaymentPage() {

    //--------------------------------Action menu--------------------------
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
    // ---------------------------------------------------------------------

    //---------------------filter----------------------------------
    type ContractStatus = "Running" | "Completed" | "All";

    const CONTRACT_STATUSES: ContractStatus[] = ["Running", "Completed", "All"];

    const [selectedContractStatus, setSelectedContractStatus] = useState<ContractStatus[]>([]);
    const [showApplicants, setShowApplicants] = useState(true);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { contracts, loading, listContracts } = useContractHandler();
    const [totalContracts, setTotalContracts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
      const fetchContracts = async () => {
        try {
          const statusFilter = selectedContractStatus.length > 0 && !selectedContractStatus.includes("All") 
            ? selectedContractStatus[0] 
            : undefined;
          
          const response = await listContracts(currentPage, ITEMS_PER_PAGE, searchQuery || undefined, statusFilter);
          setTotalContracts(response.total);
          setTotalPages(response.totalPages);
        } catch (err) {
          console.error("Failed to fetch contracts:", err);
        }
      };

      fetchContracts();
    }, [currentPage, searchQuery, selectedContractStatus, listContracts]);

    // 🔍 Filter contracts
    const filteredContracts = useMemo(() => {
      return contracts.filter(contract => {
        // Search filter
        const searchMatch =
          !searchQuery.trim() ||
          contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contract.contractTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contract.inContractNumber.toLowerCase().includes(searchQuery.toLowerCase());

        // Contract status filter
        const contractMatch =
          selectedContractStatus.length === 0 || // empty = no filter
          selectedContractStatus.includes("All") || // All = include all
          selectedContractStatus.includes(contract.status as "Running" | "Completed");

        return searchMatch && contractMatch;
      });
    }, [contracts, searchQuery, selectedContractStatus]);


    
    // 📄 Pagination
    const paginatedContracts = filteredContracts;
    
    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };
    
    const goToPrevious = () => {
      if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };
    
    const goToNext = () => {
      if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };


    const { payments,  error, listPayments } = usePaymentHandler();

  // Fetch all payments and contracts on mount
  useEffect(() => {
    const fetchData = async () => {
      await listPayments(1, 1000); // get all payments
      await listContracts(1, 1000); // get all contracts
    };
    fetchData();
  }, [listPayments, listContracts]);

  // Refresh payments when page becomes visible or focused (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        listPayments(1, 1000);
      }
    };

    const handleFocus = () => {
      listPayments(1, 1000);
    };

    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleFocus);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [listPayments]);

  // Compute totals dynamically
  const stats = useMemo(() => {
    const totalPaid = payments
      .filter(p => p.paymentStatus === "Paid")
      .reduce((sum, p) => sum + parseFloat(p.monthlyAllowance || "0"), 0);

    const pendingPayment = payments
      .filter(p => p.paymentStatus === "Pending")
      .reduce((sum, p) => sum + parseFloat(p.monthlyAllowance || "0"), 0);

    const due = payments
      .filter(p => p.paymentStatus === "Due")
      .reduce((sum, p) => sum + parseFloat(p.monthlyAllowance || "0"), 0);

    const hold = payments
      .filter(p => p.paymentStatus === "Hold")
      .length; // count of payments on hold

    return [
      { title: "Total Paid", value: `${totalPaid} SAR`, subtitle: `${payments.filter(p => p.paymentStatus === "Paid").length}+ this week` },
      { title: "Pending Payment", value: `${pendingPayment} SAR`, subtitle: `${payments.filter(p => p.paymentStatus === "Pending").length}% growth` },
      { title: "Due", value: `${due} SAR`, subtitle: `${payments.filter(p => p.paymentStatus === "Due").length}% growth` },
      { title: "Hold", value: `${hold}`, subtitle: `${hold} this week` },
    ];
  }, [payments]);


return (
  <DashboardLayout>
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Title */}
      <div className=" mb-8">
        <h1 className="text-[28px] font-bold text-[#1E1E1E]">
          Payment
        </h1>
      </div>
      
      {/* Top row: 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 place-items-center">
        {stats.map((stat) => (
          <Card key={stat.title} title={stat.title} value={stat.value} subtitle={stat.subtitle} />
        ))}
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
            {/* First Filter Button */}
            <button className="hidden sm:flex relative w-[60px] h-[40px] skew-x-[-12deg] bg-transparent border border-black flex items-center justify-center overflow-hidden rounded-lg hover:bg-black/10 transition-all"
            onClick={() => setShowApplicants(!showApplicants)}
            >
              <span className="skew-x-[12deg] font-bold text-sm text-black flex items-center gap-2">
                <svg width="24" height="41" viewBox="0 0 24 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0.5V1H24V0.5V0H0V0.5ZM24 40.5V40H0V40.5V41H24V40.5Z" fill="#141A21"/>
                  <path d="M5.5 25C6.03043 25 6.53914 25.2107 6.91421 25.5858C7.28929 25.9609 7.5 26.4696 7.5 27C7.5 27.5304 7.28929 28.0391 6.91421 28.4142C6.53914 28.7893 6.03043 29 5.5 29C4.96957 29 4.46086 28.7893 4.08579 28.4142C3.71071 28.0391 3.5 27.5304 3.5 27C3.5 26.4696 3.71071 25.9609 4.08579 25.5858C4.46086 25.2107 4.96957 25 5.5 25ZM5.5 18.5C6.03043 18.5 6.53914 18.7107 6.91421 19.0858C7.28929 19.4609 7.5 19.9696 7.5 20.5C7.5 21.0304 7.28929 21.5391 6.91421 21.9142C6.53914 22.2893 6.03043 22.5 5.5 22.5C4.96957 22.5 4.46086 22.2893 4.08579 21.9142C3.71071 21.5391 3.5 21.0304 3.5 20.5C3.5 19.9696 3.71071 19.4609 4.08579 19.0858C4.46086 18.7107 4.96957 18.5 5.5 18.5ZM5.5 12C6.03043 12 6.53914 12.2107 6.91421 12.5858C7.28929 12.9609 7.5 13.4696 7.5 14C7.5 14.5304 7.28929 15.0391 6.91421 15.4142C6.53914 15.7893 6.03043 16 5.5 16C4.96957 16 4.46086 15.7893 4.08579 15.4142C3.71071 15.0391 3.5 14.5304 3.5 14C3.5 13.4696 3.71071 12.9609 4.08579 12.5858C4.46086 12.2107 4.96957 12 5.5 12Z" fill="#1E1E1E"/>
                  <path d="M20.0809 12.5858C19.7058 12.2107 19.1971 12 18.6667 12H12C11.4696 12 10.9609 12.2107 10.5858 12.5858C10.2107 12.9609 10 13.4696 10 14C10 14.5304 10.2107 15.0391 10.5858 15.4142C10.9609 15.7893 11.4696 16 12 16H18.6667C19.1971 16 19.7058 15.7893 20.0809 15.4142C20.456 15.0391 20.6667 14.5304 20.6667 14C20.6667 13.4696 20.456 12.9609 20.0809 12.5858Z" fill="#1E1E1E"/>
                  <path d="M20.0809 19.0858C19.7058 18.7107 19.1971 18.5 18.6667 18.5H12C11.4696 18.5 10.9609 18.7107 10.5858 19.0858C10.2107 19.4609 10 19.9696 10 20.5C10 21.0304 10.2107 21.5391 10.5858 21.9142C10.9609 22.2893 11.4696 22.5 12 22.5H18.6667C19.1971 22.5 19.7058 22.2893 20.0809 21.9142C20.456 21.5391 20.6667 21.0304 20.6667 20.5C20.6667 19.9696 20.456 19.4609 20.0809 19.0858Z" fill="#1E1E1E"/>
                  <path d="M20.0809 25.5858C19.7058 25.2107 19.1971 25 18.6667 25H12C11.4696 25 10.9609 25.2107 10.5858 25.5858C10.2107 25.9609 10 26.4696 10 27C10 27.5304 10.2107 28.0391 10.5858 28.4142C10.9609 28.7893 11.4696 29 12 29H18.6667C19.1971 29 19.7058 28.7893 20.0809 28.4142C20.456 28.0391 20.6667 27.5304 20.6667 27C20.6667 26.4696 20.456 25.9609 20.0809 25.5858Z" fill="#1E1E1E"/>
                </svg>
              </span>
            </button>

            {/* Second Filter Button */}
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
                  className="absolute sm:top-[47%]  sm:left-[68%] top-[106%] left-[5%] mt-2 sm:w-[420px]  w-[360px] skew-x-[-12deg] bg-white border rounded-lg shadow-lg z-50"
                  onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                >
                  <div className="p-2">
                    {/* Contract Status */}
                    <h6 className="px-2 skew-x-[12deg] py-1 font-semibold">Contract Status</h6>
                    <div className="flex gap-2">
                      {CONTRACT_STATUSES.map((status) => {
                        const isSelected = selectedContractStatus.includes(status);

                        return (
                          <div
                            key={status}
                            className="flex items-center skew-x-[12deg] px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-md"
                            onClick={() => {
                              if (status === "All") {
                                setSelectedContractStatus(["Running", "Completed", "All"]);
                              } else {
                                setSelectedContractStatus(prev =>
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12 mt-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      )}

      {/* Empty State */}
      {!loading && paginatedContracts.length === 0 && (
        <div className="flex items-center justify-center py-10 mt-50">
          <p className="text-gray-500">No contracts found</p>
        </div>
      )}

      {/* Contracts Grid */}
      {!loading && paginatedContracts.length > 0 && showApplicants && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center ">
          {paginatedContracts.map((contract) => (
            <ApplicantCard
              key={contract.id}
              contract={{
                id: contract.id,
                name: contract.name,
                contractTitle: contract.contractTitle,
                salary: contract.salary || null,
                createdAt: contract.createdAt,
                currency: contract.currency,
                status: contract.status,
              }}
              onClick={() =>
                router.push(`/Company/payment/${contract.id}`)
              }
            />
          ))}
        </div>
      )}

         {/* Contracts Table */}
      {!loading && paginatedContracts.length > 0 && !showApplicants && (
        <div className="flex flex-col gap-2 mt-4">
          {paginatedContracts.map((contract) => (
            <ContractRow
              key={contract.id}
              contract={{
                id: contract.id,
                name: contract.name,
                contractTitle: contract.contractTitle,
                salary: contract.salary || null,
                inContractNumber: contract.inContractNumber,
                note: contract.note || null,
                status: contract.status,
                currency: contract.currency,
              }}
              onMainClick={() =>
                router.push(`/Company/payment/${contract.id}`)
              }
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
  </DashboardLayout>
);
}