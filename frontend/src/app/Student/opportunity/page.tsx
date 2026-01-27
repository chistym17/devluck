// src/app/Student/opportunity/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState, useMemo, useRef, useEffect } from "react";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
import { useStudentOpportunityHandler } from "@/src/hooks/studentapihandler/useStudentOpportunityHandler";
import { useStudentApplicationHandler } from "@/src/hooks/studentapihandler/useStudentApplicationHandler";
import { Toast } from "@/src/components/common/Toast";
import { Range } from "react-range";
interface MappedOpportunity {
  id: number;
  originalId: string;
  applicantId: number;
  contractTitle: string;
  company: string;
  salary: string;
  jobType: "Full-time" | "Part-time" | "Contract";
  location: string;
  jobDescription: string;
  workProgress: number;
  deadline: string;
  startDate: string;
  endDate: string;
  status: string;
  applicantIds: any[];
  companyId: string;
  opportunityStatus: "Applied" | "Upcoming Interview" | "Rejected";
  opportunityFrom: "Company" | "Investor";
  skills: string[];
  benefits: string[];
  keyResponsibilities: string[];
  whyYoullLoveWorkingHere: string[];
}

const ApplicantCard = ({
  applicant,
  onClick,
  onApply,
  isApplying,
}: {
  applicant: MappedOpportunity;
  onClick?: () => void;
  onApply?: () => void;
  isApplying?: boolean;
}) => {
  return (
    <div className="relative w-[400px] h-[389px] cursor-pointer">
       <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 436 389"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_dd_13159_51018)">
        <path d="M416 80C416 102.091 398.091 120 376 120H372.5C351.237 120 334 137.237 334 158.5C334 179.763 351.237 197 372.5 197H376C398.091 197 416 214.909 416 237V317C416 339.091 398.091 357 376 357H335.525C326.204 357 319.057 348.722 320.418 339.5C321.779 330.278 314.632 322 305.311 322H160.689C150.528 322 141.901 329.447 140.418 339.5C138.935 349.553 130.308 357 120.146 357H60C37.9086 357 20 339.091 20 317V48C20 25.9086 37.9086 8 60 8H230.236C240.366 8 248.147 16.972 246.714 27C245.282 37.028 253.063 46 263.193 46H332.807C343.82 46 353.157 37.9021 354.714 27C356.272 16.0979 365.609 8 376.622 8H384.633C401.957 8 416 22.0435 416 39.367V80Z" fill="white"/>
        </g>
        <defs>
        <filter id="filter0_dd_13159_51018" x="0" y="0" width="436" height="389" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect1_dropShadow_13159_51018"/>
        <feOffset dy="12"/>
        <feGaussianBlur stdDeviation="12"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.619608 0 0 0 0 0.670588 0 0 0 0.12 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_13159_51018"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.619608 0 0 0 0 0.670588 0 0 0 0.2 0"/>
        <feBlend mode="normal" in2="effect1_dropShadow_13159_51018" result="effect2_dropShadow_13159_51018"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_13159_51018" result="shape"/>
        </filter>
        </defs>
      </svg>

      <div className="relative w-50 h-50">
        {/* Background Circle */}
        <div className="absolute top-[70%] left-[160%] w-11 h-11 bg-[#FFEB9C] rounded-full flex items-center justify-center">
          {/* Icon */}
          <div className="w-6 h-6 flex items-center justify-center">
            {/* Replace this with your actual SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 8.16211V8.23511C22 9.09511 22 9.52611 21.793 9.87811C21.586 10.2301 21.209 10.4391 20.457 10.8581L19.664 11.2981C20.21 9.45011 20.393 7.46411 20.46 5.76611L20.47 5.54511L20.472 5.49311C21.123 5.71911 21.489 5.88811 21.717 6.20411C22 6.59711 22 7.11911 22 8.16211ZM2 8.16211V8.23511C2 9.09511 2 9.52611 2.207 9.87811C2.414 10.2301 2.791 10.4391 3.543 10.8581L4.337 11.2981C3.79 9.45011 3.607 7.46411 3.54 5.76611L3.53 5.54511L3.529 5.49311C2.877 5.71911 2.511 5.88811 2.283 6.20411C2 6.59711 2 7.12011 2 8.16211Z" fill="#1E1E1E"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2.00011C13.784 2.00011 15.253 2.15711 16.377 2.34711C17.516 2.53911 18.085 2.63511 18.561 3.22111C19.037 3.80711 19.011 4.44011 18.961 5.70611C18.789 10.0551 17.851 15.4861 12.75 15.9661V19.5001H14.18C14.4111 19.5003 14.635 19.5804 14.8137 19.727C14.9923 19.8736 15.1147 20.0775 15.16 20.3041L15.35 21.2501H18C18.1989 21.2501 18.3897 21.3291 18.5303 21.4698C18.671 21.6104 18.75 21.8012 18.75 22.0001C18.75 22.199 18.671 22.3898 18.5303 22.5304C18.3897 22.6711 18.1989 22.7501 18 22.7501H6C5.80109 22.7501 5.61032 22.6711 5.46967 22.5304C5.32902 22.3898 5.25 22.199 5.25 22.0001C5.25 21.8012 5.32902 21.6104 5.46967 21.4698C5.61032 21.3291 5.80109 21.2501 6 21.2501H8.65L8.84 20.3041C8.88529 20.0775 9.00768 19.8736 9.18634 19.727C9.365 19.5804 9.58891 19.5003 9.82 19.5001H11.25V15.9661C6.15 15.4861 5.212 10.0541 5.04 5.70611C4.989 4.44011 4.964 3.80611 5.44 3.22111C5.915 2.63511 6.484 2.53911 7.623 2.34711C9.06982 2.10999 10.5339 1.99392 12 2.00011ZM12.952 6.19911L12.854 6.02311C12.474 5.34011 12.284 5.00011 12 5.00011C11.716 5.00011 11.526 5.34011 11.146 6.02311L11.048 6.19911C10.94 6.39311 10.886 6.48911 10.802 6.55311C10.717 6.61711 10.612 6.64111 10.402 6.68811L10.212 6.73211C9.474 6.89911 9.105 6.98211 9.017 7.26411C8.929 7.54711 9.181 7.84111 9.684 8.42911L9.814 8.58111C9.957 8.74811 10.029 8.83111 10.061 8.93511C10.093 9.03911 10.082 9.15011 10.061 9.37311L10.041 9.57611C9.965 10.3611 9.927 10.7541 10.156 10.9281C10.386 11.1021 10.732 10.9431 11.423 10.6251L11.601 10.5431C11.798 10.4531 11.896 10.4081 12 10.4081C12.104 10.4081 12.202 10.4531 12.399 10.5431L12.577 10.6251C13.268 10.9441 13.614 11.1021 13.844 10.9281C14.074 10.7541 14.035 10.3611 13.959 9.57611L13.939 9.37311C13.918 9.15011 13.907 9.03911 13.939 8.93511C13.971 8.83211 14.043 8.74811 14.186 8.58111L14.316 8.42911C14.819 7.84111 15.071 7.54711 14.983 7.26411C14.895 6.98211 14.526 6.89911 13.788 6.73211L13.598 6.68811C13.388 6.64111 13.283 6.61811 13.198 6.55311C13.114 6.48911 13.06 6.39311 12.952 6.19911Z" fill="#1E1E1E"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute top-[82%] left-[33%]   ">
        <button className="relative flex items-center w-[155px] h-[40px] "onClick={onClick}>
          {/* Center Frame */}
          <div className="flex-1 flex justify-center items-center gap-2 bg-[#FFEB9C] h-[40px] px-2 skew-x-[-12deg] rounded-[12px] transform transition-transform duration-200 hover:scale-105">
            {/* Text */}
            <span className="font-publicSans font-bold text-[14px] leading-[24px] text-[#1E1E1E] skew-x-[12deg]">
              Apply
            </span>
          </div>
        </button>
      </div>

      {/* ===== CONTENT SECTION ===== */}
      <div className="absolute top-[50px] left-[5%] left-0 w-[320px] px-5 flex flex-col gap-3">
        {/* Title */}
        <h3 className="font-bold text-lg text-[#1E1E1E]">{applicant.contractTitle}</h3>

       {/* Description */}
        <div className="h-[60px] overflow-hidden">
          <p className="text-sm text-gray-600">
            {applicant.jobDescription
              ? applicant.jobDescription.split(" ").slice(0, 15).join(" ") +
                (applicant.jobDescription.split(" ").length > 15 ? "..." : "")
              : "No description available"}
          </p>
        </div>

        {/* Two-column Info */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
                  <img src="/cards/tag.svg" alt="Tag Icon" />
                  <div className="flex flex-col justify-center items-start w-[77px] h-[40px]">
                    <span className="text-[14px] font-normal leading-[22px] text-[#1E1E1E]">
                      {applicant.company}
                    </span>
                    <span className="text-[12px] font-normal leading-[18px] text-[#00000090]">
                      Company
                    </span>
                  </div>
              </div>

              <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
                  <img src="/cards/tag.svg" alt="Tag Icon" />
                  <div className="flex flex-col justify-center items-start w-[77px] h-[40px]">
                    <span className="text-[14px] font-normal leading-[22px] text-[#1E1E1E]">
                      {applicant.salary}
                    </span>
                    <span className="text-[12px] font-normal leading-[18px] text-[#00000090]">
                      Salary
                    </span>
                  </div>
              </div>

              <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
                  <img src="/cards/tag.svg" alt="Tag Icon" />
                  <div className="flex flex-col justify-center items-start w-[77px] h-[40px]">
                    <span className="text-[14px] font-normal leading-[22px] text-[#1E1E1E]">
                      {applicant.jobType}
                    </span>
                    <span className="text-[12px] font-normal leading-[18px] text-[#00000090]">
                      Job Type
                    </span>
                  </div>
              </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-700">{applicant.workProgress}%</span>
            <span className="text-sm text-gray-500">Match</span>
            
            <span className="font-semibold text-gray-700">{applicant.deadline}</span>
            <span className="text-sm text-gray-500">Deadline</span>
          </div>
        </div>
      </div>

      <div className="absolute top-[3%] left-[59%] flex items-center w-[85px] h-[40px] ">
        {/* Center Frame */}
        <div className="flex-1 flex justify-center items-center gap-2 w-[51px] h-[40px] bg-[#FFEB9C] skew-x-[-12deg] rounded-[12px]">
          {/* Text */}
          <span className="font-publicSans font-bold text-[14px] leading-[24px] text-[#1E1E1E] skew-x-[12deg] rounded-[12px]">
             {applicant.location
              ? applicant.location.split(" ").slice(0, 1).join(" ") +
                (applicant.location.split(" ").length > 1 ? "..." : "")
              : "No location available"}
          </span>
        </div>
      </div>





    </div>
  );
};





const ITEMS_PER_PAGE = 4;
export default function ContractListPage() {
      const [applyingOpportunityId, setApplyingOpportunityId] = useState<string | null>(null);
      const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

      // API Hooks
      const { opportunities, loading: opportunitiesLoading, error: opportunitiesError, listOpportunities, getOpportunityQuestions } = useStudentOpportunityHandler();
      const { createApplication, loading: applying } = useStudentApplicationHandler();

      const [menuOpen, setMenuOpen] = useState(false);
      const menuRef = useRef<HTMLDivElement>(null);
      const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

      // Fetch all opportunities on mount
      useEffect(() => {
        listOpportunities(1, 1000).catch(console.error);
      }, []);

      // Map opportunities to mockContracts format
      const mappedOpportunities = useMemo(() => {
        if (!opportunities || !Array.isArray(opportunities)) {
          return [];
        }
        const mapped: MappedOpportunity[] = opportunities.map((opp, index) => {
          const mappedItem: MappedOpportunity = {
            id: index + 1, // Use index for display, but keep opp.id for API calls
            originalId: opp.id, // Store original ID for API calls
            applicantId: 0, // Not used for opportunities
            contractTitle: opp.title,
            company: opp.company?.name || "Unknown Company",
            salary: opp.allowance ? `${opp.currency} ${opp.allowance}` : "Not specified",
            jobType: (opp.type === "Full-time" || opp.type === "Part-time" || opp.type === "Contract") 
              ? opp.type 
              : "Full-time" as "Full-time" | "Part-time" | "Contract",
            location: opp.location || "Not specified",
            jobDescription: opp.details || "",
            workProgress: Math.floor(Math.random() * 100), // Random for now, can be calculated later
            deadline: opp.startDate ? new Date(opp.startDate).toLocaleDateString() : "Not specified",
            startDate: opp.startDate ? new Date(opp.startDate).toLocaleDateString() : "Not specified",
            endDate: "Not specified",
            status: "Running",
            applicantIds: [],
            companyId: opp.companyId || "",
            opportunityStatus: "Applied", // Default status
            opportunityFrom: "Company",
            skills: opp.skills || [],
            benefits: opp.benefits || [],
            keyResponsibilities: opp.keyResponsibilities || [],
            whyYoullLoveWorkingHere: opp.whyYouWillLoveWorkingHere || [],
          }
          return mappedItem
        })
        return mapped
      }, [opportunities]);

      // Use only real API data (no mock fallback)
      const displayContracts = mappedOpportunities;

      const allCount = displayContracts.length;
      const appliedCount = displayContracts.filter(c => c.opportunityStatus === "Applied").length;
      const upcomingCount = displayContracts.filter(c => c.opportunityStatus === "Upcoming Interview").length;
      const rejectedCount = displayContracts.filter(c => c.opportunityStatus === "Rejected").length;

  //---------------------filter----------------------------------

      type OpportunityStatus = "Applied" | "Upcoming Interview" | "Rejected";

      const OPPORTUNITY_STATUSES: OpportunityStatus[] = [
        "Applied",
        "Upcoming Interview",
        "Rejected",
      ];

      const OPPORTUNITY_LABELS: Record<OpportunityStatus | "All", string> = {
        All: "All",
        Applied: "Applied",
        "Upcoming Interview": "Upcoming Interview",
        Rejected: "Rejected",
      };

      const [selectedOpportunityFrom, setSelectedOpportunityFrom] = useState<"All" | "Company" | "Investor">("All");

      const OPPORTUNITY_FROM_OPTIONS = ["All", "Company", "Investor"];


      const [editingContract, setEditingContract] = useState<any>(null);
      const [selectedOpportunityStatus, setSelectedOpportunityStatus] =useState<OpportunityStatus | "All">("All");
      const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
      const [selectedLocation, setSelectedLocation] = useState<string>("All");
      const [showApplicants, setShowApplicants] = useState(true);
      const router = useRouter();
      const [searchQuery, setSearchQuery] = useState("");
      const [currentPage, setCurrentPage] = useState(1);
      const [isModalOpen, setIsModalOpen] = useState(false);

      const MIN_SALARY = 0;
      const MAX_SALARY = 10000;

      const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 10000]);


      const locations = useMemo(() => {
        const unique = Array.from(
          new Set(displayContracts.map(c => c.location))
        );
        return ["All", ...unique];
      }, [displayContracts]);

  
      // Handle Apply button click
      const handleApply = async (contract: MappedOpportunity) => {
        try {
          const opportunityId = (contract as any).originalId || String(contract.id);
          setApplyingOpportunityId(opportunityId);
          
          const questions = await getOpportunityQuestions(opportunityId);
          
          if (questions && questions.length > 0) {
            router.push(`/Student/opportunity/${opportunityId}/questions`);
          } else {
          await createApplication(opportunityId);
          setToast({ message: "Application submitted successfully!", type: 'success' });
          }
        } catch (err: any) {
          setToast({ message: err.message || "Failed to submit application", type: 'error' });
        } finally {
          setApplyingOpportunityId(null);
        }
      };

      // 🔍 Filter applicants
      const filteredApplicants = useMemo(() => {
        return displayContracts.filter(contract => {
          // Search filter
          const searchMatch =
            !searchQuery.trim() ||
            contract.contractTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.jobType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (contract.startDate && contract.startDate.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (contract.endDate && contract.endDate.toLowerCase().includes(searchQuery.toLowerCase()));
  
          // Opportunity Status filter
          const opportunityMatch =
          selectedOpportunityStatus === "All" ||
          contract.opportunityStatus === selectedOpportunityStatus;

          // Location filter
          const locationMatch =
          selectedLocation === "All" ||
          contract.location === selectedLocation;

          // Salary filter
          const salaryStr = String(contract.salary).replace(/[^0-9]/g, "");
          const salary = salaryStr ? Number(salaryStr) : 0;
          
          // If salary is 0 or "Not specified", include it (don't filter out)
          const salaryMatch = 
            salary === 0 || 
            contract.salary === "Not specified" ||
            (salary >= salaryRange[0] && salary <= salaryRange[1]);

          // Opportunity From filter
          const opportunityFromMatch =
          selectedOpportunityFrom === "All" ||
          contract.opportunityFrom === selectedOpportunityFrom;

          return searchMatch && opportunityMatch && locationMatch && salaryMatch && opportunityFromMatch;
        });
      }, [displayContracts, searchQuery, selectedOpportunityStatus, selectedLocation, salaryRange, selectedOpportunityFrom]);
  
  
      
      // 📄 Pagination
      const totalPages = Math.ceil(filteredApplicants.length / ITEMS_PER_PAGE);
      
      const paginatedApplicants = filteredApplicants.slice(
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

      const STEP = 100;
      const MIN = 0;
      const MAX = 10000;

return (
  <DashboardLayout>
    <Toast
      message={toast?.message || ''}
      type={toast?.type || 'success'}
      isVisible={!!toast}
      onClose={() => setToast(null)}
    />
    <div className="px-4 sm:px-6 lg:px-8 py-6">

      {/* Main Row: Search (1/2) + Grid (1/2) */}
      <div className="flex flex-col lg:flex-row gap-6 sm:mt-0 mt-4">

        {/* ================= LEFT COLUMN — SEARCH + LOCATION (1/2) ================= */}
        <div className="w-full lg:w-1/3">
          <div className="flex flex-col gap-4">

            {/* 🔍 Search */}
            <div
              className="
                relative
                w-full
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
                placeholder="Search Opportunities..."
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

              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.8067 12.86L11.54 10.6C12.2713 9.66831 12.6681 8.51777 12.6667 7.33334C12.6667 6.2785 12.3539 5.24736 11.7678 4.37029C11.1818 3.49323 10.3489 2.80965 9.37431 2.40598C8.39978 2.00231 7.32742 1.89669 6.29285 2.10248C5.25829 2.30827 4.30798 2.81622 3.5621 3.5621C2.81622 4.30798 2.30827 5.25829 2.10248 6.29285C1.89669 7.32742 2.00231 8.39978 2.40598 9.37431C2.80965 10.3489 3.49323 11.1818 4.37029 11.7678C5.24736 12.3539 6.2785 12.6667 7.33334 12.6667C8.51777 12.6681 9.66831 12.2713 10.6 11.54L12.86 13.8067C12.922 13.8692 12.9957 13.9188 13.077 13.9526C13.1582 13.9864 13.2453 14.0039 13.3333 14.0039C13.4213 14.0039 13.5085 13.9864 13.5897 13.9526C13.671 13.9188 13.7447 13.8692 13.8067 13.8067C13.8692 13.7447 13.9188 13.671 13.9526 13.5897C13.9864 13.5085 14.0039 13.4213 14.0039 13.3333C14.0039 13.2453 13.9864 13.1582 13.9526 13.077C13.9188 12.9957 13.8692 12.922 13.8067 12.86ZM3.33334 7.33334C3.33334 6.54221 3.56793 5.76885 4.00746 5.11106C4.44698 4.45326 5.0717 3.94057 5.8026 3.63782C6.53351 3.33507 7.33777 3.25585 8.1137 3.41019C8.88962 3.56454 9.60235 3.9455 10.1618 4.50491C10.7212 5.06432 11.1021 5.77705 11.2565 6.55297C11.4108 7.3289 11.3316 8.13317 11.0289 8.86407C10.7261 9.59497 10.2134 10.2197 9.55562 10.6592C8.89782 11.0987 8.12446 11.3333 7.33334 11.3333C6.27247 11.3333 5.25505 10.9119 4.50491 10.1618C3.75476 9.41162 3.33334 8.3942 3.33334 7.33334Z" fill="#1E1E1E"/>
                </svg>
              </div>
            </div>

              {/* LOcation */}
            <div className="relative w-full mt-2">

              {/* Dropdown header */}
              <div
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="
                  flex px-3.5 py-2.5 justify-between items-center
                  bg-white/0
                  rounded-lg
                  text-black
                  text-sm
                  cursor-pointer
                  backdrop-blur-md
                  border border-black/15
                  transition
                  hover:bg-black/5
                  skew-x-[-12deg]
                "
              >
                <span className="skew-x-[12deg]">
                  {selectedLocation || "Select Location"}
                </span>

                <span className="ml-2 text-xs opacity-70 skew-x-[12deg]">
                  <svg
                    width="12"
                    height="6"
                    viewBox="0 0 12 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.8344 5.8344C5.63969 5.83478 5.45099 5.76696 5.30106 5.64273L0.301063 1.47606C-0.0533202 1.18151 -0.101823 0.655445 0.192729 0.301062C0.487281 -0.0533202 1.01335 -0.101823 1.36773 0.192729L5.8344 3.92606L10.3011 0.326063C10.4732 0.186254 10.694 0.120838 10.9145 0.1443C11.1351 0.167761 11.3372 0.278163 11.4761 0.451063C11.6303 0.624279 11.7054 0.85396 11.6833 1.08486C11.6612 1.31576 11.5438 1.52699 11.3594 1.66773L6.3594 5.69273C6.20516 5.79733 6.02031 5.8472 5.8344 5.8344Z"
                      fill="#919EAB"
                      fillOpacity="0.8"
                    />
                  </svg>
                </span>
              </div>

              {/* Dropdown menu */}
              {locationDropdownOpen && (
                <div
                  className="
                    absolute top-full left-0 w-full mt-1
                    bg-white
                    rounded-lg
                    shadow-[0_0_15px_rgba(0,0,0,0.15)]
                    z-50
                    max-h-48
                    overflow-y-scroll
                  
                  "
                >
                  <style>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>

                  {/* Clear */}
                  <div
                    onClick={() => {
                      setSelectedLocation("");
                      setCurrentPage(1);
                      setLocationDropdownOpen(false);
                    }}
                    className="p-2 text-sm hover:bg-black/5 cursor-pointer "
                  >
                    Select Location
                  </div>

                  {/* Locations */}
                  {locations.map((loc) => (
                    <div
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setCurrentPage(1);
                        setLocationDropdownOpen(false);
                      }}
                      className="p-2 text-sm hover:bg-black/5 cursor-pointer"
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>


              {/* Opportunity From */}
            <div className="p-2">
              <h6 className="px-2py-1 font-semibold">Opportunity From</h6>
              <div className="flex flex-col gap-2">
                {["All", "Company", "Investor"].map((option) => {
                  const isSelected = selectedOpportunityFrom === option;

                  return (
                    <div
                      key={option}
                      className="flex items-center  px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-md"
                      onClick={() => setSelectedOpportunityFrom(option as any)}
                    >
                      <div className="flex items-center justify-center w-9 h-9 mr-2">
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
                      <span className="text-sm">{option}</span>
                    </div>
                  );
                })}
              </div>
            </div>

              {/* Salary Range */} 
            <div className="w-[397px] flex flex-col gap-4">
              {/* Title */}
              <p className="text-sm font-semibold text-[#1E1E1E]">
                Salary Range
              </p>

              {/* Min / Max display */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-semibold text-[#919EAB]">Min</span>
                  <input
                    type="number"
                    min={MIN}
                    max={salaryRange[1] - STEP}
                    step={STEP}
                    value={salaryRange[0]}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      if (val < MIN) val = MIN;
                      if (val > salaryRange[1] - STEP) val = salaryRange[1] - STEP;
                      setSalaryRange([val, salaryRange[1]]);
                    }}
                    className="px-2 py-1 bg-[#919EAB14] rounded-md text-sm text-[#1E1E1E] outline-none border border-transparent focus:border-[#1E1E1E33]"
                  />
                </div>

                <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-semibold text-[#919EAB]">Max</span>
                    <input
                      type="number"
                      min={salaryRange[0] + STEP}
                      max={MAX}
                      step={STEP}
                      value={salaryRange[1]}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > MAX) val = MAX;
                        if (val < salaryRange[0] + STEP) val = salaryRange[0] + STEP;
                        setSalaryRange([salaryRange[0], val]);
                      }}
                      className="px-2 py-1 bg-[#919EAB14] rounded-md text-sm text-[#1E1E1E] outline-none border border-transparent focus:border-[#1E1E1E33]"
                    />
                </div>
              </div>

            {/* React Range Slider */}
              <div className="mt-2">
                <Range
                  step={STEP}
                  min={MIN}
                  max={MAX}
                  values={salaryRange}
                  onChange={(values) => setSalaryRange(values as [number, number])}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="h-1.5 bg-[#919EAB1F] rounded-full relative"
                    >
                      {/* Active Track */}
                      <div
                        className="absolute h-full bg-[#FFEB9C] rounded-full"
                        style={{
                          left: `${((salaryRange[0] - MIN) / (MAX - MIN)) * 100}%`,
                          width: `${((salaryRange[1] - salaryRange[0]) / (MAX - MIN)) * 100}%`,
                        }}
                      />
                      {children}
                    </div>
                  )}
                 renderThumb={({ props, index }) => {
                    const { key, ...rest } = props; // remove key from spread
                    return (
                      <div
                        key={index} // Pass key directly
                        {...rest}   // Spread the rest
                        className="w-4 h-4 bg-white border border-gray-300 rounded-full shadow cursor-pointer"
                      />
                    );
                  }}
                />
              </div>

              {/* Scale */}
              <div className="flex justify-between text-xs text-[#919EAB]">
                <span>$0</span>
                <span>$2k</span>
                <span>$4k</span>
                <span>$6k</span>
                <span>$8k</span>
                <span>$10k</span>
              </div>
            </div>

          </div>
        </div>


        {/* ================= RIGHT COLUMN — GRID (3/4) ================= */}
        <div className="w-full lg:w-2/3 " >
          {opportunitiesLoading ? (
           <div className="flex h-screen items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          </div>
          ) : opportunitiesError ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">Error: {opportunitiesError}</p>
            </div>
          ) : showApplicants && (
             <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-4">
            {paginatedApplicants.map((contract, index) => {
              const opportunityId = (contract as any).originalId || String(contract.id);
              return (
                <ApplicantCard
                  key={contract.id || index}
                  applicant={contract}
                  onClick={() =>
                    router.push(`/Student/opportunity/${opportunityId}`)
                  }
                  onApply={() => handleApply(contract)}
                  isApplying={applyingOpportunityId === opportunityId}
                />
              );
            })}
          </div>
          )}

           {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={goToPrevious}
                disabled={currentPage === 1}
                className="px-3 py-1 disabled:opacity-40"
              >
                <img src="/ic-eva_arrow-ios-back-fill.svg" alt="Previous" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`
                    relative
                    w-11 h-9
                    skew-x-[-12deg]
                    rounded-md
                    transition-all
                    ${
                      currentPage === page
                        ? "border border-black"
                        : "hover:bg-black/10"
                    }
                  `}
                >
                  <span className="flex h-full w-full items-center justify-center skew-x-[12deg]">
                    {page}
                  </span>
                </button>
              ))}

              <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1 disabled:opacity-40"
              >
                <img src="/ic-eva_arrow-ios-forward-fill.svg" alt="Next" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>

   


  </DashboardLayout>
);

}