// src/app/Student/applied-Opportunity/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState, useMemo, useRef, useEffect } from "react";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
import { useStudentApplicationHandler } from "@/src/hooks/studentapihandler/useStudentApplicationHandler";
import DisputeModal from "@/src/components/Student/DisputeModal";
import { Toast } from "@/src/components/common/Toast";
import { createPortal } from "react-dom";
import SkewedConfirmModal from "@/src/components/common/SkewedConfirmModal";


const Card = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => {
  return (
    <div className="relative w-[329px] h-[185px]">
      {/* SVG Shape */}
      <svg width="331" height="209" viewBox="0 0 331 209" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dd_13132_51013)">
        <path d="M57.8752 16.697C59.2406 11.5688 63.8841 8 69.1909 8V177H36.0088C25.4987 177 17.8432 167.039 20.5475 156.883L57.8752 16.697Z" fill="white"/>
        <rect width="192" height="169" transform="translate(69.1909 8)" fill="white"/>
        <path d="M272.507 168.303C271.141 173.431 266.498 177 261.191 177L261.191 8L294.373 8C304.883 8 312.539 17.9607 309.834 28.1169L272.507 168.303Z" fill="white"/>
        </g>
        <defs>
        <filter id="filter0_dd_13132_51013" x="-4.80908" y="0" width="340" height="209" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect1_dropShadow_13132_51013"/>
        <feOffset dy="12"/>
        <feGaussianBlur stdDeviation="12"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.619608 0 0 0 0 0.670588 0 0 0 0.12 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_13132_51013"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.619608 0 0 0 0 0.670588 0 0 0 0.2 0"/>
        <feBlend mode="normal" in2="effect1_dropShadow_13132_51013" result="effect2_dropShadow_13132_51013"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_13132_51013" result="shape"/>
        </filter>
        </defs>
      </svg>
      <div className=" absolute left-[22%] top-[36px] items-center justify-center ">
        <h6 className="text-[18px] font-semibold leading-[28px] text-[#1E1E1E]">
          {title}
        </h6>
      </div>


      {/* Content */}
      <div className=" absolute left-[48%] top-[73px] z-[3] -translate-x-1/2 items-center justify-center w-[200px] h-[80px] p-[16px] flex flex-col  bg-[#FFF9E0] backdrop-blur-[17px] skew-x-[-12deg] rounded-[21px]">
        <div className="flex flex-row gap-2 skew-x-[12deg]">

            <h4 className="flex  text-[24px] font-bold leading-[36px] text-[#1E1E1E]">
              {value}
            </h4>

            <svg width="76" height="40" viewBox="0 0 76 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1875 8.03579C12.872 3.22275 17.4144 0 22.5138 0H26V40H14.0948C7.20633 40 2.38062 33.1982 4.65623 26.6965L7 20L11.1875 8.03579Z" fill="#FFEB9C"/>
            <rect width="24" height="40" transform="translate(26)" fill="#FFEB9C"/>
            <path d="M48 16.1622V16.2352C48 17.0952 48 17.5262 47.793 17.8782C47.586 18.2302 47.209 18.4392 46.457 18.8582L45.664 19.2982C46.21 17.4502 46.393 15.4642 46.46 13.7662L46.47 13.5452L46.472 13.4932C47.123 13.7192 47.489 13.8882 47.717 14.2042C48 14.5972 48 15.1192 48 16.1622ZM28 16.1622V16.2352C28 17.0952 28 17.5262 28.207 17.8782C28.414 18.2302 28.791 18.4392 29.543 18.8582L30.337 19.2982C29.79 17.4502 29.607 15.4642 29.54 13.7662L29.53 13.5452L29.529 13.4932C28.877 13.7192 28.511 13.8882 28.283 14.2042C28 14.5972 28 15.1202 28 16.1622Z" fill="#454F5B"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M38 10.0002C39.784 10.0002 41.253 10.1572 42.377 10.3472C43.516 10.5392 44.085 10.6352 44.561 11.2212C45.037 11.8072 45.011 12.4402 44.961 13.7062C44.789 18.0552 43.851 23.4862 38.75 23.9662V27.5002H40.18C40.4111 27.5004 40.635 27.5805 40.8137 27.7271C40.9923 27.8737 41.1147 28.0776 41.16 28.3042L41.35 29.2502H44C44.1989 29.2502 44.3897 29.3293 44.5303 29.4699C44.671 29.6106 44.75 29.8013 44.75 30.0002C44.75 30.1991 44.671 30.3899 44.5303 30.5306C44.3897 30.6712 44.1989 30.7502 44 30.7502H32C31.8011 30.7502 31.6103 30.6712 31.4697 30.5306C31.329 30.3899 31.25 30.1991 31.25 30.0002C31.25 29.8013 31.329 29.6106 31.4697 29.4699C31.6103 29.3293 31.8011 29.2502 32 29.2502H34.65L34.84 28.3042C34.8853 28.0776 35.0077 27.8737 35.1863 27.7271C35.365 27.5805 35.5889 27.5004 35.82 27.5002H37.25V23.9662C32.15 23.4862 31.212 18.0542 31.04 13.7062C30.989 12.4402 30.964 11.8062 31.44 11.2212C31.915 10.6352 32.484 10.5392 33.623 10.3472C35.0698 10.1101 36.5339 9.99404 38 10.0002ZM38.952 14.1992L38.854 14.0232C38.474 13.3402 38.284 13.0002 38 13.0002C37.716 13.0002 37.526 13.3402 37.146 14.0232L37.048 14.1992C36.94 14.3932 36.886 14.4892 36.802 14.5532C36.717 14.6172 36.612 14.6412 36.402 14.6882L36.212 14.7322C35.474 14.8992 35.105 14.9822 35.017 15.2642C34.929 15.5472 35.181 15.8412 35.684 16.4292L35.814 16.5812C35.957 16.7482 36.029 16.8312 36.061 16.9352C36.093 17.0392 36.082 17.1502 36.061 17.3732L36.041 17.5762C35.965 18.3612 35.927 18.7542 36.156 18.9282C36.386 19.1022 36.732 18.9432 37.423 18.6252L37.601 18.5432C37.798 18.4532 37.896 18.4082 38 18.4082C38.104 18.4082 38.202 18.4532 38.399 18.5432L38.577 18.6252C39.268 18.9442 39.614 19.1022 39.844 18.9282C40.074 18.7542 40.035 18.3612 39.959 17.5762L39.939 17.3732C39.918 17.1502 39.907 17.0392 39.939 16.9352C39.971 16.8322 40.043 16.7482 40.186 16.5812L40.316 16.4292C40.819 15.8412 41.071 15.5472 40.983 15.2642C40.895 14.9822 40.526 14.8992 39.788 14.7322L39.598 14.6882C39.388 14.6412 39.283 14.6182 39.198 14.5532C39.114 14.4892 39.06 14.3932 38.952 14.1992Z" fill="#454F5B"/>
            <path d="M64.8125 31.9642C63.128 36.7772 58.5856 40 53.4862 40L50 40L50 2.27299e-06L61.9052 1.23221e-06C68.7937 6.29997e-07 73.6194 6.80176 71.3438 13.3035L69 20L64.8125 31.9642Z" fill="#FFEB9C"/>
            </svg>
        </div>
      </div>
     
    </div>
  );
};

interface MappedApplication {
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
  opportunityStatus: "Applied" | "Upcoming Interview" | "Rejected" | "Withdrawn";
  opportunityFrom: "Company" | "Investor";
  skills: string[];
  benefits: string[];
  keyResponsibilities: string[];
  whyYoullLoveWorkingHere: string[];
  originalStatus?: string;
  appliedAt?: string;
  opportunityId?: string;
}


const ApplicantCard = ({
  applicant,
  onClick,
  onWithdraw,
  isWithdrawing,
}: {
  applicant: MappedApplication;
  onClick?: () => void;
  onWithdraw?: () => void;
  isWithdrawing?: boolean;
}) => {
  const getStatusDisplay = () => {
    if (applicant.originalStatus === 'pending') return 'Applied';
    if (applicant.originalStatus === 'accepted') return 'Accepted';
    if (applicant.originalStatus === 'rejected') return 'Rejected';
    if (applicant.originalStatus === 'withdrawn') return 'Withdrawn';
    return 'Applied';
  };
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="relative w-[350px] h-[260px]">

      {/* Inner container is skewed */}
      <div className="absolute inset-0 bg-white border rounded-3xl shadow-lg skew-x-[-12deg]" >

        {/* Content inside is un-skewed so text looks normal */}
        <div className="flex flex-col skew-x-[12deg] mt-5">
          <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
            {/* Title + Button */}
          <div className="relative w-full flex flex-col items-center justify-center gap-4">
            {/* Title */}
            <h3
              className="text-[18px] leading-[28px] font-semibold text-[#1E1E1E] text-center"
            >
              {applicant.contractTitle.length > 25
              ? applicant.contractTitle.slice(0, 25) + "…"
              : applicant.contractTitle}

            </h3>

            {/* Button in top-right corner */}
            <button className="absolute top-0 right-0 w-11 h-11 flex items-center justify-center rounded-full bg-yellow-200">
              <span className="absolute inset-0 bg-blue-600 opacity-30 hidden"></span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M21 11.098V16.091C21 19.187 21 20.736 20.266 21.412C19.916 21.735 19.474 21.938 19.003 21.992C18.016 22.105 16.863 21.085 14.558 19.046C13.538 18.145 13.029 17.694 12.44 17.576C12.1497 17.5167 11.8503 17.5167 11.56 17.576C10.97 17.694 10.461 18.145 9.442 19.046C7.137 21.085 5.984 22.105 4.997 21.991C4.52527 21.9367 4.08299 21.734 3.734 21.412C3 20.736 3 19.188 3 16.091V11.097C3 6.81 3 4.666 4.318 3.333C5.636 2 7.758 2 12 2C16.242 2 18.364 2 19.682 3.332C21 4.664 21 6.81 21 11.098ZM8.25 6C8.25 5.80109 8.32902 5.61032 8.46967 5.46967C8.61032 5.32902 8.80109 5.25 9 5.25H15C15.1989 5.25 15.3897 5.32902 15.5303 5.46967C15.671 5.61032 15.75 5.80109 15.75 6C15.75 6.19891 15.671 6.38968 15.5303 6.53033C15.3897 6.67098 15.1989 6.75 15 6.75H9C8.80109 6.75 8.61032 6.67098 8.46967 6.53033C8.32902 6.38968 8.25 6.19891 8.25 6Z" fill="black"/>
              </svg>

            </button>
             {/* Menu */}
            
          </div>


            {/* Job Tags */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex flex-row items-center justify-center gap-4 flex-wrap mb-2">
                {/* Job-Tag 1 */}
                <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
                  <img src="/cards/tag.svg" alt="Tag Icon" />
                  <div className="flex flex-col justify-center items-start w-[77px] h-[40px]">
                    <span className="text-[14px] font-normal leading-[22px] text-[#1E1E1E]">
                      {applicant.company?.length > 10
                    ? applicant.company.slice(0, 10) + "…"
                    : applicant.company}
                    </span>
                    <span className="text-[12px] font-normal leading-[18px] text-[#00000090]">
                      Company
                    </span>
                  </div>
                </div>

                {/* Job-Tag 2 */}
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

                {/* Job-Description */}
                <div className="flex flex-row items-start  w-full h-[40px] px-4 ">
                  <div className="flex flex-col justify-startitems-start w-full h-[40px]">
                    <span className="text-[14px] font-normal leading-[22px] text-[#1E1E1E] break-words">
                      {applicant.jobDescription.length > 85
                        ? applicant.jobDescription.slice(0, 85) + "…"
                        : applicant.jobDescription}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Work Progress Bar */}
          <div className="w-[320px] h-[80px] p-[16px] flex flex-row  bg-[#FFF9E0] backdrop-blur-[17px] skew-x-[-12deg] rounded-[21px]">
            <div className="skew-x-[12deg] flex flex-row gap-10">

              <button className="relative w-[80px] h-[40px] skew-x-[-12deg] bg-transparent border border-black flex items-center justify-center overflow-hidden rounded-lg hover:bg-black/10 transition-all"
               onClick={onClick}>
                <span className="skew-x-[12deg] text-[14px] font-bold leading-[24px] text-[#141A21]">
                    Details
                  </span>
              </button>
              <div className="flex flex-row">
                 <div className="flex flex-col justify-center items-start w-[77px] h-[40px]">
                      <span 
                        className={`text-[14px] font-normal leading-[22px] ${
                          applicant.originalStatus === 'pending' ? 'text-blue-600' :
                          applicant.originalStatus === 'accepted' ? 'text-green-600' :
                          applicant.originalStatus === 'rejected' ? 'text-red-600' :
                          applicant.originalStatus === 'withdrawn' ? 'text-gray-600' :
                          'text-[#1E1E1E]'
                        }`}
                      >
                        {getStatusDisplay()}
                      </span>
                      <span className="text-[12px] font-normal leading-[18px] text-[#00000090]">
                        Status
                      </span>
                </div>

                <div className="flex flex-col justify-center items-start w-[77px] h-[40px]">
                      <span className="text-[14px] font-normal leading-[22px] text-[#1E1E1E]">
                        {applicant.deadline}
                      </span>
                      <span className="text-[12px] font-normal leading-[18px] text-[#00000090]">
                        Deadline
                      </span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



type ContractRowProps = {
  contract: MappedApplication;
  applicantName?: string;
  onMainClick?: () => void;
  onDisputeClick?: () => void;
  showCheckbox?: boolean;
  index?: number;
  onWithdraw?: () => void;
  isWithdrawing?: boolean;
};

const ContractRow = ({ contract,onMainClick,onWithdraw,isWithdrawing,onDisputeClick,showCheckbox = false, index = 0 }: ContractRowProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);


 // Close when clicking outside
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
        className="flex items-center w-9/10 skew-x-[-12deg] rounded-[8] h-[72px] shadow-lg  bg-white cursor-pointer hover:bg-gray-50"
        
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
          {/* CO-ID */}
          <div className="flex flex-col justify-center w-[150px]">
              <span className="text-sm font-semibold text-gray-900">
                {String((index + 1)).padStart(3, '0')}
              </span>
              <span className="text-xs text-gray-400">Application ID</span>
          </div>
          {/* Name */}
          <div className="flex flex-col justify-center w-[150px]">
            <span className="text-sm font-semibold text-gray-900">{contract.company}</span>
            <span className="text-xs text-gray-400">Company Name</span>
          </div>
          {/* Contract Title */}
          <div className="flex flex-col justify-center w-[200px]">
            <span className="text-sm font-semibold text-gray-900">{contract.contractTitle}</span>
            <span className="text-xs text-gray-400">Application Title</span>
          </div>
          {/* Applied At */}
          <div className="flex flex-col justify-center w-[150px]">
            <span className="text-sm font-semibold text-gray-900">{contract.appliedAt || 'Not specified'}</span>
            <span className="text-xs text-gray-400">Applied At</span>
          </div>
          {/* Application Status */}
          <div className="flex flex-col justify-center items-center ">
            <div
              className={`
                ml-4 px-3 py-1 skew-x-[-12deg] rounded-[8] text-xs font-semibold flex items-center justify-center
                ${contract.originalStatus === 'pending' ? "bg-blue-100 border border-blue-500 text-blue-600" : ""}
                ${contract.originalStatus === 'accepted' ? "bg-[#D3FCD2] border border-[#22C55E] text-[#22C55E]" : ""}
                ${contract.originalStatus === 'rejected' ? "bg-[#FFDCDC] border border-[#FF4D4F] text-[#FF4D4F]" : ""}
                ${contract.originalStatus === 'withdrawn' ? "bg-gray-100 border border-gray-400 text-gray-600" : ""}
                ${!contract.originalStatus ? "bg-blue-100 border border-blue-200 text-blue-600" : ""}
              `}
            >
              {contract.originalStatus === 'pending' ? 'Applied' :
               contract.originalStatus === 'accepted' ? 'Accepted' :
               contract.originalStatus === 'rejected' ? 'Rejected' :
               contract.originalStatus === 'withdrawn' ? 'Withdrawn' :
               'Applied'}
            </div>
            <span className="text-xs text-gray-400">Application Status</span>
          </div>
        </div>
      </div>

      {/* Second 20% section beside the main card */}

      <div
        className="flex items-center w-1/10 skew-x-[-12deg] rounded-[8] h-[72px] shadow-lg bg-[#FFF9E0] cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();

          const rect = e.currentTarget.getBoundingClientRect();

         setMenuPos({
            top: rect.top + window.scrollY ,
            left: rect.right + window.scrollX - 230,
          });



          setMenuOpen((prev) => !prev);
        }}

>
        <div className="flex items-center justify-center w-full h-full">
          {/* Example Frame 295 content */}
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
            {/* Menu */}
            {menuOpen && menuPos &&
            createPortal(
              <div
                ref={menuRef}
                className="absolute top-12 right-0 w-40 bg-white border rounded-md shadow-lg p-2 z-50"
                style={{
                  top: menuPos.top,
                  left: menuPos.left,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                 <button
                  className="w-full flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded"
                  onClick={onMainClick}
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
                      d="M11.6667 18.3337H8.33341C5.19091 18.3337 3.61925 18.3337 2.64341 17.357C1.66675 16.3812 1.66675 14.8095 1.66675 11.667V8.33366C1.66675 5.19116 1.66675 3.61949 2.64341 2.64366C3.61925 1.66699 5.19925 1.66699 8.35841 1.66699C8.86341 1.66699 9.26758 1.66699 9.60841 1.68116C9.59758 1.74783 9.59175 1.81533 9.59175 1.88449L9.58341 4.24616C9.58341 5.16033 9.58341 5.96866 9.67091 6.61949C9.76591 7.32533 9.98341 8.03116 10.5601 8.60783C11.1351 9.18283 11.8417 9.40116 12.5476 9.49616C13.1984 9.58366 14.0067 9.58366 14.9209 9.58366H18.2976C18.3334 10.0287 18.3334 10.5753 18.3334 11.3028V11.667C18.3334 14.8095 18.3334 16.3812 17.3567 17.357C16.3809 18.3337 14.8092 18.3337 11.6667 18.3337ZM4.37508 12.0837C4.37508 11.9179 4.44093 11.7589 4.55814 11.6417C4.67535 11.5245 4.83432 11.4587 5.00008 11.4587H11.6667C11.8325 11.4587 11.9915 11.5245 12.1087 11.6417C12.2259 11.7589 12.2917 11.9179 12.2917 12.0837C12.2917 12.2494 12.2259 12.4084 12.1087 12.5256C11.9915 12.6428 11.8325 12.7087 11.6667 12.7087H5.00008C4.83432 12.7087 4.67535 12.6428 4.55814 12.5256C4.44093 12.4084 4.37508 12.2494 4.37508 12.0837ZM4.37508 15.0003C4.37508 14.8346 4.44093 14.6756 4.55814 14.5584C4.67535 14.4412 4.83432 14.3753 5.00008 14.3753H9.58341C9.74917 14.3753 9.90815 14.4412 10.0254 14.5584C10.1426 14.6756 10.2084 14.8346 10.2084 15.0003C10.2084 15.1661 10.1426 15.3251 10.0254 15.4423C9.90815 15.5595 9.74917 15.6253 9.58341 15.6253H5.00008C4.83432 15.6253 4.67535 15.5595 4.55814 15.4423C4.44093 15.3251 4.37508 15.1661 4.37508 15.0003Z"
                      fill="#1E1E1E"
                    />
                    <path
                      d="M16.1267 6.34783L12.8267 3.37866C11.8876 2.53283 11.4184 2.10949 10.8409 1.88866L10.8334 4.16699C10.8334 6.13116 10.8334 7.11366 11.4434 7.72366C12.0534 8.33366 13.0359 8.33366 15.0001 8.33366H17.9834C17.6817 7.74699 17.1401 7.26033 16.1267 6.34783Z"
                      fill="#1E1E1E"
                    />
                  </svg>

                  <span>Details</span>
                </button>
                <button
  className={`
    w-full flex items-center gap-2 px-2 py-1 rounded
    hover:bg-gray-100 transition-all
    ${contract.originalStatus === 'withdrawn' ? 'opacity-50 cursor-not-allowed' : ''}
  `}
  onClick={(e) => {
    e.stopPropagation();
    if (contract.originalStatus !== 'withdrawn') {
      onWithdraw?.();
    }
  }}
  disabled={contract.originalStatus === 'withdrawn'}
>
                {/* SVG Icon */}
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

                {/* Text */}
                <span>
                  {contract.originalStatus === 'withdrawn' ? 'Withdrawn' : 'Withdraw'}
                </span>
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




export default function ContractListPage() {

      const [confirmOpen, setConfirmOpen] = useState(false);
      const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
      const [confirmType, setConfirmType] = useState<"withdraw" | "delete">("withdraw");

      const handleConfirmAction = async () => {
        if (!selectedApplicationId) return;

        try {
          if (confirmType === "withdraw") {
            setWithdrawingApplicationId(selectedApplicationId);
            await withdrawApplication(selectedApplicationId);
            setToast({ message: "Application withdrawn successfully!", type: "success" });
          } else {
            await deleteApplication(selectedApplicationId);
            setToast({ message: "Application deleted successfully!", type: "success" });
          }

          await getApplications(1, 1000);
        } catch (err: any) {
          setToast({
            message: err.message || "Action failed",
            type: "error",
          });
        } finally {
          setWithdrawingApplicationId(null);
          setConfirmOpen(false);
          setSelectedApplicationId(null);
        }
      };


       const { 
        applications, 
        loading: applicationsLoading, 
        error: applicationsError, 
        getApplications,
        withdrawApplication,
        deleteApplication 
      } = useStudentApplicationHandler();

      const [menuOpen, setMenuOpen] = useState(false);
      const menuRef = useRef<HTMLDivElement>(null);
      const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
      const [withdrawingApplicationId, setWithdrawingApplicationId] = useState<string | null>(null);
      const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

      useEffect(() => {
        getApplications(1, 1000).catch(console.error);
      }, [getApplications]);

      const handleWithdraw = async (applicationId: string) => {
        try {
          setWithdrawingApplicationId(applicationId);
          await withdrawApplication(applicationId);
          setToast({ message: "Application withdrawn successfully!", type: 'success' });
          await getApplications(1, 1000);
        } catch (err: any) {
          setToast({ message: err.message || "Failed to withdraw application", type: 'error' });
        } finally {
          setWithdrawingApplicationId(null);
        }
      };

      const handleDelete = async (applicationId: string) => {
        try {
          await deleteApplication(applicationId);
          setToast({ message: "Application deleted successfully!", type: 'success' });
          await getApplications(1, 1000);
        } catch (err: any) {
          setToast({ message: err.message || "Failed to delete application", type: 'error' });
        }
      };

      const mappedApplications = useMemo(() => {
        if (!applications || !Array.isArray(applications)) {
          return [];
        }
        return applications.map((app, index) => {
          const opp = app.opportunity || {};
          const statusMap: Record<string, string> = {
            'pending': 'Applied',
            'accepted': 'Upcoming Interview',
            'rejected': 'Rejected',
            'withdrawn': 'Withdrawn'
          };
          return {
            id: index + 1,
            originalId: app.id,
            applicantId: 0,
            contractTitle: opp.title || 'Unknown Opportunity',
            company: opp.company?.name || 'Unknown Company',
            salary: opp.allowance ? `${opp.currency || 'USD'} ${opp.allowance}` : 'Not specified',
            jobType: (opp.type === "Full-time" || opp.type === "Part-time" || opp.type === "Contract") 
              ? opp.type 
              : "Full-time" as "Full-time" | "Part-time" | "Contract",
            location: opp.location || 'Not specified',
            jobDescription: opp.details || '',
            workProgress: Math.floor(Math.random() * 100),
            deadline: opp.startDate ? new Date(opp.startDate).toLocaleDateString() : 'Not specified',
            startDate: opp.startDate ? new Date(opp.startDate).toLocaleDateString() : 'Not specified',
            endDate: 'Not specified',
            status: 'Running' as const,
            applicantIds: [],
            companyId: opp.companyId || '',
            opportunityStatus: (statusMap[app.status] || 'Applied') as "Applied" | "Upcoming Interview" | "Rejected",
            opportunityFrom: 'Company' as const,
            skills: opp.skills || [],
            benefits: opp.benefits || [],
            keyResponsibilities: opp.keyResponsibilities || [],
            whyYoullLoveWorkingHere: opp.whyYouWillLoveWorkingHere || [],
            originalStatus: app.status,
            appliedAt: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Not specified',
            opportunityId: app.opportunityId,
          };
        });
      }, [applications]);

      const allCount = mappedApplications.length;
      const appliedCount = mappedApplications.filter(c => c.opportunityStatus === "Applied").length;
      const upcomingCount = mappedApplications.filter(c => c.opportunityStatus === "Upcoming Interview").length;
      const rejectedCount = mappedApplications.filter(c => c.opportunityStatus === "Rejected").length;

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

      const [editingContract, setEditingContract] = useState<any>(null);
      const [selectedOpportunityStatus, setSelectedOpportunityStatus] =useState<OpportunityStatus | "All">("All");
      const [showApplicants, setShowApplicants] = useState(true);
      const router = useRouter();
      const [searchQuery, setSearchQuery] = useState("");
      const [currentPage, setCurrentPage] = useState(1);
      const [isModalOpen, setIsModalOpen] = useState(false);
  
      // 🔍 Filter applicants
      const filteredApplicants = useMemo(() => {
        console.log('[AppliedOpportunity] mappedApplications:', mappedApplications.length);
        console.log('[AppliedOpportunity] selectedOpportunityStatus:', selectedOpportunityStatus);
        const filtered = mappedApplications.filter(contract => {
          // Search filter
          const searchMatch =
            !searchQuery.trim() ||
            contract.contractTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.jobType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (contract.startDate && contract.startDate.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (contract.endDate && contract.endDate.toLowerCase().includes(searchQuery.toLowerCase()));
  
          // Contract status filter
          const opportunityMatch =
          selectedOpportunityStatus === "All" ||
          contract.opportunityStatus === selectedOpportunityStatus;

          return searchMatch && opportunityMatch;
        });
        console.log('[AppliedOpportunity] filteredApplicants:', filtered.length);
        return filtered;
      }, [mappedApplications, searchQuery, selectedOpportunityStatus]);
  
  
      // 📄 Pagination
      const [itemsPerPage, setItemsPerPage] = useState(6); // default 6 for desktop
      useEffect(() => {
        const updateItemsPerPage = () => {
          if (window.innerWidth < 640) { // mobile
            setItemsPerPage(4);
          } else {
            setItemsPerPage(6); // desktop
          }
        };
        updateItemsPerPage(); // run once on mount
        window.addEventListener("resize", updateItemsPerPage); // run on resize

        return () => window.removeEventListener("resize", updateItemsPerPage);
      }, []);
      const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
      
      const paginatedApplicants = filteredApplicants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
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
  
    
return (
  <DashboardLayout>
    <Toast
      message={toast?.message || ''}
      type={toast?.type || 'success'}
      isVisible={!!toast}
      onClose={() => setToast(null)}
    />
    <div className="px-4 sm:px-6 lg:px-8 py-6">
     {/* Page Title */}
  <div className="flex flex-col gap-4 mb-8">
    {/* Title */}
    <h1 className="text-[28px] font-bold text-[#1E1E1E]">
      Applied Opportunity
    </h1>

     {/* Top row: 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 place-items-center">
        <Card title="All Opportunity" value={allCount.toString()} />
        <Card title="Total Applied" value={appliedCount.toString()} />
        <Card title="Upcoming Interview" value={upcomingCount.toString()} />
        <Card title="Total Rejected" value={rejectedCount.toString()} />
      </div>


  {/* Status Filter Buttons */}
  <div className="flex gap-2">
  {(["All", ...OPPORTUNITY_STATUSES] as const).map(status => {
    const isActive = selectedOpportunityStatus === status;

    return (
      <button
        key={status}
        onClick={() => {
          setSelectedOpportunityStatus(status);
          setCurrentPage(1);
        }}
        className={`
          relative
          w-[128px]
          h-[30px]
          skew-x-[-12deg]
          rounded-md
          transition-all
          flex
          items-center
          justify-center
          ${isActive ? "bg-[#FFEB9C]" : ""}
        `}
      >
        <span className="skew-x-[12deg] text-xs font-semibold whitespace-nowrap">
          {OPPORTUNITY_LABELS[status]}
        </span>
      </button>
    );
  })}
</div>



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
              placeholder="Search Applied Opportunities..."
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
          </div>
        </div>

            {applicationsLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          </div>
        ) : applicationsError ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Error: {applicationsError}</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : showApplicants && (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center ">
            {paginatedApplicants.map((contract, index) => (
              <ApplicantCard
                key={contract.originalId || index}
                applicant={contract}
                onClick={() => {
                  if (contract.opportunityId) {
                    router.push(`/Student/applied-Opportunity/${contract.opportunityId}?from=applied`);
                  }
                }}
                onWithdraw={() => handleWithdraw(contract.originalId)}
                isWithdrawing={withdrawingApplicationId !== null}
              />
            ))}
          </div>
        )}


        {/* Contracts Grid */}
      {!showApplicants && !applicationsLoading && !applicationsError && filteredApplicants.length > 0 && (
        <div className="flex flex-col gap-2 mt-4">
          {paginatedApplicants.map((contract, index) => (
            <ContractRow
              key={contract.originalId || index}
              contract={contract}
              applicantName="Student"
              onMainClick={() => {
                if (contract.opportunityId) {
                  router.push(`/Student/applied-Opportunity/${contract.opportunityId}?from=applied`);
                }
              }}
              onWithdraw={() => {
                setSelectedApplicationId(contract.originalId);
                setConfirmType("withdraw");
                setConfirmOpen(true);
              }}
              isWithdrawing={withdrawingApplicationId !== null}
              showCheckbox={true}
              index={(currentPage - 1) * itemsPerPage + index}
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
     <DisputeModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onSave={(data) => {
      console.log("Contract saved:", data);
      setIsModalOpen(false);
  }}
/>
<SkewedConfirmModal
  open={confirmOpen}
  title={confirmType === "withdraw" ? "Withdraw Application" : "Delete Application"}
  description={
    confirmType === "withdraw"
      ? "Are you sure you want to withdraw this application? This action cannot be undone."
      : "Are you sure you want to delete this application? This action cannot be undone."
  }
  confirmText={confirmType === "withdraw" ? "Withdraw" : "Delete"}
  cancelText="Cancel"
  danger
  loading={withdrawingApplicationId !== null}
  onCancel={() => setConfirmOpen(false)}
  onConfirm={handleConfirmAction}
/>

  </DashboardLayout>
);
}