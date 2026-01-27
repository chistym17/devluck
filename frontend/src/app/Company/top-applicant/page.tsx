// src/app/Company/top-applicant/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/src/components/Company/DashboardLayout";
import { mockApplicants } from "@/src/mocks/mockApplicants";
import { useState, useMemo, useRef, useEffect } from "react";
// =======================
// APPLIED STUDENT CARD COMPONENT
// ========================
const AppliedStudentCard = ({
  studentName,
  studentNumber,
  imageUrl,
  onClick,
}: {
  studentName: string;
  studentNumber: string;
  imageUrl?: string; // ✅ ready for backend
  onClick?: () => void;
}) => {
  return (
    <div className="relative w-[220px] h-[350px]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      >
      {/* =======================
          SVG CARD BACKGROUND
      ======================== */}
      <img
        src="/cards/appliedStudent.svg"
        alt="Applied Students"
      />

      {/* =======================
          PROFILE IMAGE PLACEHOLDER / IMAGE
      ======================== */}
      <div
        className="absolute left-1/2 overflow-hidden"
        style={{
          width: "161.46px",
          height: "150.38px",
          borderRadius: "51.8066px",
          backgroundColor: "#E0E0E0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: "-75px",
          transform: "translate(-51%, -85%)",
          zIndex: 2,
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={studentName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[14px] text-[#888]">No Image</span>
        )}

        {/* =======================
            PROFILE ICON OVERLAY
        ======================== */}
        <div
          className="absolute left-1/2"
          style={{
            width: "60px",
            height: "60px",
            bottom: "-12px",
            transform: "translateX(-50%)",
          }}
        >
          <img
            src="/cards/appliedStudentIcon.svg"
            alt="Applied Students"
            className="w-full h-full object-contain"
          />
        </div>
      </div>


      {/* =======================
          STUDENT NAME
      ======================== */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          flexDirection: "row",
          gap: "4.75px",
          width: "144.87px",
          height: "48px",
          left: "50%",
          top: "77.14px",
          transform: "translateX(-50%)",
        }}
      >
        {/* Rotated yellow square */}
        <div
          style={{
            width: "7.16px",
            height: "7.16px",
            backgroundColor: "#FFEB9C",
            transform: "rotate(-45deg)",
          }}
        />

        {/* Student name text */}
        <div
          style={{
            width: "130px",
            height: "48px",
            fontFamily: "'Rock Salt', cursive",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "20px",
            lineHeight: "47px",
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            color: "#1C252E",
            textShadow:
              "0px 14.2468px 17.4128px rgba(213, 118, 246, 0.33)",
          }}
        >
          {studentName}
        </div>
      </div>

      {/* =======================
          STUDENT NUMBER
      ======================== */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          flexDirection: "row",
          gap: "4.75px",
          width: "23px",
          height: "48px",
          left: `calc(50% - 23px/2 - 65.12px)`,
          top: "22.91px",
          fontFamily: "'Public Sans', sans-serif",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "15.8298px",
          lineHeight: "47px",
          textAlign: "center",
          color: "#1C252E",
          flex: "none",
          order: 0,
          flexGrow: 0,
        }}
      >
        #{studentNumber}
      </div>
    </div>
  );
};


export default function TopApplicantPage() {
  
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredApplicants = useMemo(() => {
        return mockApplicants.filter(applicant => {
          // Search filter
          const searchMatch =
            !searchQuery.trim() ||
            applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            applicant.applicantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            applicant.contractTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            applicant.startDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
            applicant.endDate.toLowerCase().includes(searchQuery.toLowerCase());
          return searchMatch ;
        });
      }, [searchQuery]);

  // 📄 Pagination
  const [itemsPerPage, setItemsPerPage] = useState(10); // default 10 for desktop
  
  useEffect(() => {
    const updateItemsPerPage = () => {
              if (window.innerWidth < 640) { // mobile
                setItemsPerPage(6);
              } else {
                setItemsPerPage(10); // desktop
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
        <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-8">
          Top Applicants
        </h1>
        {/* =======================
            APPLIED STUDENTS GRID
        ======================== */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 justify-items-center ">
          {paginatedApplicants.map((applicant, index) => (
            <AppliedStudentCard
              key={applicant.applicantId}
              studentName={applicant.name}
              studentNumber={applicant.applicantId}
              imageUrl={applicant.image} // 👈 backend-ready
              onClick={() => router.push(`/Company/top-applicant/${applicant.applicantId}`)}
            />
          ))}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
                      {/* Previous */}
                      <button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium rounded-md 
                                  disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                      <img 
                      src="/ic-eva_arrow-ios-back-fill.svg" 
                      alt="Applied Students"
                    />
                      </button>

                    {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                            ${
                              currentPage === page
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
                        className="px-3 py-1 text-sm font-medium rounded-md 
                                  disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <img 
                      src="/ic-eva_arrow-ios-forward-fill.svg" 
                      alt="Applied Students"
                    />
                      </button>
        </div>
        )}
    </DashboardLayout>
  );
}
