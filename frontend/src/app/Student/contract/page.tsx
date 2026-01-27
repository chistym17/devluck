// src/app/Student/contract/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState, useMemo, useRef, useEffect } from "react";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
import DisputeModal from "@/src/components/Student/DisputeModal";
import { useStudentContractHandler } from "@/src/hooks/studentapihandler/useStudentContractHandler";
import { createPortal } from "react-dom";

interface MappedContract {
  id: string;
  applicantId: number;
  contractTitle: string;
  company: string;
  jobType: string;
  location: string;
  workProgress: number;
  startDate: string;
  endDate: string;
  status: string;
  salary: string;
  startedAt: string;
}

const ApplicantCard = ({
  applicant,
  onClick,
  onDisputeClick,
}: {
  applicant: MappedContract;
  onClick?: () => void;
  onDisputeClick?: () => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      
      className="relative w-[350px] h-[260px] cursor-pointer"
    >
      {/* Inner container is skewed */}
      <div className="absolute inset-0 bg-white border rounded-3xl shadow-lg skew-x-[-12deg] flex items-center justify-center">
        {/* Content inside is un-skewed so text looks normal */}
        <div className="flex flex-col skew-x-[12deg]">
          <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
            {/* Title + Button */}
          <div className="relative w-full flex flex-col items-center justify-center gap-4">
            {/* Title */}
            <h3
              className="text-[18px] leading-[28px] font-semibold text-[#1E1E1E] text-center"
            >
              {applicant.contractTitle}
            </h3>

            {/* Button in top-right corner */}
            <button className="absolute top-0 right-0 w-11 h-11 flex items-center justify-center rounded-full bg-yellow-200"
            onClick={() => setMenuOpen(!menuOpen)}>
              <span className="absolute inset-0 bg-blue-600 opacity-30 hidden"></span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
             {/* Menu */}
            {menuOpen && (
              <div className="absolute top-12 right-0 w-40 bg-white border rounded-md shadow-lg p-2 z-50">
                <button
                  className="w-full flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded"
                  onClick={onClick}
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
                <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded"
                onClick={onDisputeClick}>
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
                <span>Dispute</span>
              </button>

              </div>
            )}
          </div>


            {/* Job Tags */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex flex-row items-center justify-center gap-4 flex-wrap mb-2">
                {/* Job-Tag 1 */}
                <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
                  <img src="/cards/tag.svg" alt="Tag Icon" />
                  <div className="flex flex-col justify-center items-start w-[77px] h-[40px]">
                    <span className="text-[14px] font-normal leading-[22px] text-[#1E1E1E]">
                      {applicant.company}
                    </span>
                    <span className="text-[12px] font-normal leading-[18px] text-[#00000090]">
                      Created Date
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

                {/* Job-Tag 3 */}
                <div className="flex flex-row items-center gap-1.5 w-[250px] h-[40px]">
                  <img src="/cards/tag.svg" alt="Tag Icon" />
                  <div className="flex flex-col justify-center items-start w-[100px] h-[40px]">
                    <span className="text-[14px] font-normal leading-[22px] text-[#1E1E1E]">
                      {applicant.startedAt}
                    </span>
                    <span className="text-[12px] font-normal leading-[18px] text-[#00000090]">
                      Started At
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Work Progress Bar */}
          <div className="w-[320px] h-[80px] p-[16px] flex flex-col  bg-[#FFF9E0] backdrop-blur-[17px] skew-x-[-12deg] rounded-[21px]">
            <div className="skew-x-[12deg] ">
              {/* Work Progress Label */}
              <div className="flex flex-row justify-between items-center w-[280px] h-[19px] mb-2">
                <span className="font-bold text-[12px] leading-[18px] uppercase text-[#1E1E1E]">
                  Work Progress
                </span>
                
                <span className="font-bold text-[12px] leading-[18px] uppercase text-[#1E1E1E]">
                  {applicant.workProgress}%
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="relative w-[280px] h-[16px] bg-[#1E1E1E] transform -skew-x-[20deg] rounded-[4px]">
                {/* Progress Fill */}
                <div
                  className="absolute left-0 top-1/2 h-[14px] -translate-y-1/2 rounded bg-[#FFEB9C]"
                  style={{ width: `${applicant.workProgress}%` }}
                />

                {/* SVG Indicator */}
                <div className="absolute top-1/2 left-[calc(var(--progress)*1%)] -translate-y-1/2 w-[42px] h-[26px]">
                  <img
                    src="/cards/applicantIndicator.svg"
                    alt="Applied Students"
                    className="w-full h-full"
                  />
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
  contract: MappedContract;
  onMainClick?: () => void;
  onSideClick?: () => void;
  onDisputeClick?: () => void; 
  showCheckbox?: boolean;
};

const ContractRow = ({ contract,onMainClick,onDisputeClick,onSideClick,showCheckbox = false }: ContractRowProps) => {
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

        {/* Contract Info */}
        <div className="flex-1 flex items-center skew-x-[12deg] h-full px-4 gap-6">
          {/* Contract ID */}
          <div className="flex flex-col justify-center w-[150px]">
            <span className="text-sm font-semibold text-gray-900">{contract.id.slice(-8)}</span>
            <span className="text-xs text-gray-400">Contract ID</span>
          </div>
          {/* Company Name */}
          <div className="flex flex-col justify-center w-[150px]">
            <span className="text-sm font-semibold text-gray-900">{contract.company}</span>
            <span className="text-xs text-gray-400">Company Name</span>
          </div>
          {/* Contract Title */}
          <div className="flex flex-col justify-center w-[150px]">
            <span className="text-sm font-semibold text-gray-900">{contract.contractTitle}</span>
            <span className="text-xs text-gray-400">Contract Title</span>
          </div>
          {/* Started At */}
          <div className="flex flex-col justify-center w-[150px]">
            <span className="text-sm font-semibold text-gray-900">{contract.startedAt}</span>
            <span className="text-xs text-gray-400">Started At</span>
          </div>
          {/* Salary */}
          <div className="flex flex-col justify-center w-[150px]">
            <span className="text-sm font-semibold text-gray-900">{contract.salary}</span>
            <span className="text-xs text-gray-400">Salary</span>
          </div>
          {/* Contract Status */}
          <div className="flex flex-col justify-center items-center ">
            <div
              className={`
                ml-4 px-3 py-1 skew-x-[-12deg] rounded-[8] text-xs font-semibold flex items-center justify-center
                ${contract.status === "Running" ? "bg-[#D3FCD2] border border-[#22C55E] text-[#22C55E]" : ""}
                ${contract.status === "Completed" ? "bg-[#FFDCDC] border border-[#FF4D4F] text-[#FF4D4F]" : ""}
                ${contract.status === "Dispute" ? "bg-yellow-100 border border-yellow-500 text-yellow-600" : ""}
                ${contract.status !== "Running" && contract.status !== "Completed" && contract.status !== "Dispute" ? "bg-blue-100 border border-blue-200 text-blue-600" : ""}
              `}
            >
              {contract.status}
            </div>
            <span className="text-xs text-gray-400">Contract Status</span>
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
                <button className="w-full flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded"
                onClick={onDisputeClick}>
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
                <span>Dispute</span>
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
   const { 
    contracts, 
    loading: contractsLoading, 
    error: contractsError, 
    listContracts 
  } = useStudentContractHandler();

  const STATUS_LABELS: Record<ContractStatus, string> = {
  Running: "Active Contracts",
  Completed: "Completed",
  Dispute: "Dispute",
};

//--------------------------------Action menu--------------------------
      const [menuOpen, setMenuOpen] = useState(false);
      const menuRef = useRef<HTMLDivElement>(null);
      const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  //---------------------filter----------------------------------
      // Multi-select arrays instead of single string
      type ContractStatus = "Running" | "Completed" | "Dispute";
  
      const CONTRACT_STATUSES: ContractStatus[] = ["Running", "Completed", "Dispute"];
      const [editingContract, setEditingContract] = useState<any>(null);
      const [selectedContractStatus, setSelectedContractStatus] = useState<ContractStatus[]>([]);
      const [showApplicants, setShowApplicants] = useState(true);
      const router = useRouter();
      const [searchQuery, setSearchQuery] = useState("");
      const [currentPage, setCurrentPage] = useState(1);
      const [isModalOpen, setIsModalOpen] = useState(false);

      useEffect(() => {
        const statusFilter = selectedContractStatus.length > 0 ? selectedContractStatus[0].toLowerCase() : undefined;
        listContracts(1, 1000, statusFilter).catch(console.error);
      }, [listContracts, selectedContractStatus]);

      // Map contracts to match mock contract structure
      const mappedContracts = useMemo(() => {
        if (!contracts || !Array.isArray(contracts)) {
          return [];
        }
        return contracts.map((contract) => {
          const statusMap: Record<string, string> = {
            'running': 'Running',
            'completed': 'Completed',
            'dispute': 'Dispute',
            'cancelled': 'Cancelled'
          };
          
          // Format salary
          let salaryDisplay = 'Not specified';
          if (contract.monthlyAllowance !== null && contract.monthlyAllowance !== undefined) {
            const formattedAmount = typeof contract.monthlyAllowance === 'number' 
              ? contract.monthlyAllowance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
              : contract.monthlyAllowance;
            salaryDisplay = `${contract.currency || ''} ${formattedAmount}/month`.trim();
          }
          
          // Format started at date
          const startedAt = contract.createdDate ? new Date(contract.createdDate).toLocaleDateString() : 'Not specified';
          
          return {
            id: contract.id,
            applicantId: 0,
            contractTitle: contract.contractTitle,
            company: contract.company?.name || 'Unknown Company',
            jobType: contract.duration || 'Not specified',
            location: contract.workLocation || 'Not specified',
            workProgress: 0,
            startDate: contract.createdDate ? new Date(contract.createdDate).toLocaleDateString() : 'Not specified',
            endDate: contract.duration || 'Not specified',
            status: statusMap[contract.status.toLowerCase()] || contract.status,
            salary: salaryDisplay,
            startedAt: startedAt,
          };
        });
      }, [contracts]);
  
      // 🔍 Filter contracts
      const filteredApplicants = useMemo(() => {
        return mappedContracts.filter(contract => {
          // Search filter
          const searchMatch =
            !searchQuery.trim() ||
            contract.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.jobType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.contractTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.startDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contract.endDate.toLowerCase().includes(searchQuery.toLowerCase());
  
          // Contract status filter
          const contractMatch =
            selectedContractStatus.length === 0 || // empty = no filter
            selectedContractStatus.includes(contract.status as "Running" | "Completed"|"Dispute");
  
          return searchMatch && contractMatch;
        });
      }, [mappedContracts, searchQuery, selectedContractStatus]);

      // 📄 Pagination
      const [itemsPerPage, setItemsPerPage] = useState(6); // default 6 for desktop

      useEffect(() => {
        const updateItemsPerPage = () => {
          if (window.innerWidth < 640) { // mobile
            setItemsPerPage(5);
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
    <div className="px-4 sm:px-6 lg:px-8 py-6">
     {/* Page Title */}
  <div className="flex flex-col gap-4 mb-8">
    {/* Title */}
    <h1 className="text-[28px] font-bold text-[#1E1E1E]">
      Contract
    </h1>

  {/* Status Filter Buttons */}
  <div className="flex gap-2">
    {CONTRACT_STATUSES.map((status) => {
      const isActive = selectedContractStatus.includes(status);

      return (
        <button
          key={status}
          onClick={() => {
            setSelectedContractStatus(prev =>
              prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
            );
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
            ${
              isActive
                ? " bg-[#FFEB9C]"
                : " "
            }
          `}
        >
          <span className="skew-x-[12deg] text-xs font-semibold whitespace-nowrap">
            {STATUS_LABELS[status]}
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
              placeholder="Search applicants..."
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

           {contractsLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
          </div>
        ) : contractsError ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Error: {contractsError}</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No contracts found</p>
          </div>
        ) : (
          <>
            {showApplicants && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center ">
                {paginatedApplicants.map((contract, index) => (
                  <ApplicantCard
                    key={contract.id || index}
                    applicant={contract}
                    onClick={() =>
                      router.push(`/Student/contract/${contract.id}`)
                    }
                    onDisputeClick={() => setIsModalOpen(true)}
                  />
                ))}
              </div>
            )}
          </>
        )}


         {/* Contracts Grid */}
      {!showApplicants && !contractsLoading && !contractsError && (
        <div className="flex flex-col gap-2 mt-4">
          {paginatedApplicants.map((contract, index) => (
            <ContractRow
              key={contract.id || index}
              contract={contract}
              onMainClick={() =>
                router.push(`/Student/contract/${contract.id}`)
              }
              onDisputeClick={() => setIsModalOpen(true)}
              showCheckbox={true}
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
  </DashboardLayout>
);
}