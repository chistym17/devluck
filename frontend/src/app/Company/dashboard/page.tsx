// src/app/Company/dashboard/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/src/components/Company/DashboardLayout";
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useOpportunityHandler } from "@/src/hooks/companyapihandler/useOpportunityHandler";
import { useCompanyApplicationHandler } from "@/src/hooks/companyapihandler/useCompanyApplicationHandler";

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
      {/* SVG Shape */}
      <svg
        viewBox="0 0 329 185"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <g filter="url(#cardShadow)">
          {/* BORDER */}
          <path
            d="M244.278 8C252.822 8 258.583 18.8815 258.583 27.4258C258.583 45.0952 272.907 59.4197 290.576 59.4199C298.805 59.4199 308.932 64.9539 308.932 73.1832V123.865C308.932 139.881 295.948 152.865 279.932 152.865H49C32.9837 152.865 20 139.881 20 123.865V37C20 20.9837 32.9837 8 49 8H244.278Z"
            fill="none"
            stroke="#e6e5eb02"        // ← border color
            strokeWidth="2"         // ← border thickness
          />

          {/* FILL */}
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

      {/* Content */}
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
     {/* Button */}
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

  /* ──────────────────────────────────────────────
    Job Card Component
────────────────────────────────────────────── */
const JobCard = ({
  jobName,
  jobNumber,
  jobtype,
  country,
  numberOfApplicants,
  onClick,
}: {
  jobName: string;
  jobNumber: string;
  jobtype: string;
  country: string;
  numberOfApplicants: string;
  onClick?: () => void;
}) => {
  return (
   <div className="relative w-[410px] h-[220px]">
      {/* SVG Card Body */}

        <svg width="410" height="220" viewBox="0 0 437 217" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_dd_12779_51761)">
        <path d="M324.419 27.0303C324.419 37.5404 332.939 46.0605 343.449 46.0605H392.015C405.269 46.0605 416.015 56.8057 416.015 70.0605V126.183C416.015 133.732 412.463 140.84 406.428 145.373L360.262 180.047C356.106 183.169 351.048 184.856 345.849 184.856H179.133C166.871 184.856 156.93 174.916 156.93 162.653C156.93 150.39 146.989 140.449 134.726 140.449H44C30.7452 140.449 20 129.704 20 116.449V32C20 18.7452 30.7452 8 44 8H305.389C315.899 8 324.419 16.5201 324.419 27.0303Z" fill="white"/>
        </g>
        <defs>
        <filter id="filter0_dd_12779_51761" x="0" y="0" width="436.015" height="216.856" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect1_dropShadow_12779_51761"/>
        <feOffset dy="12"/>
        <feGaussianBlur stdDeviation="12"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.619608 0 0 0 0 0.670588 0 0 0 0.12 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_12779_51761"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.619608 0 0 0 0 0.670588 0 0 0 0.2 0"/>
        <feBlend mode="normal" in2="effect1_dropShadow_12779_51761" result="effect2_dropShadow_12779_51761"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_12779_51761" result="shape"/>
        </filter>
        </defs>
        </svg>


        <div className="absolute w-[340px] h-[84px] left-[50%] top-[35%] -translate-x-[50%] -translate-y-[50%] rounded-[24px_0_0_24px] flex flex-col gap-4">
          {/* Text */}
          {/* Front End Developer */}
          <div className="flex flex-col gap-2 w-[312px] h-[28px] flex-none">
            <h6 className="font-semibold text-[18px] leading-[28px] text-[#1E1E1E] flex-none">
              {jobName}
            </h6>
          </div>


          {/* Frame 271 - Job tags row */}
          <div className="flex flex-row flex-wrap items-center gap-1 w-[370px] h-[40px]">
            {/* Job-Tag 1 */}
            <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
            <img 
              src="/cards/tag.svg" 
              alt="Tag Icon"
            />
                {/* Frame 97 - Label container */}
              <div className="flex flex-col justify-center items-start w-[77px] h-[40px] flex-none gap-1">
                {/* body2 text */}
                <span className="w-[77px] h-[22px] text-[14px] font-normal leading-[22px] text-[#1E1E1E] flex items-center">
                  {jobtype}
                </span>
                {/* caption text */}
                <span className="w-[49px] h-[18px] text-[12px] font-normal leading-[18px] text-[#00000090] flex items-center">
                  Job Type
                </span>
              </div>
            </div>

            {/* Job-Tag 1 */}
            <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
            <img 
              src="/cards/tag.svg" 
              alt="Tag Icon"
            />
                {/* Frame 97 - Label container */}
              <div className="flex flex-col justify-center items-start w-[77px] h-[40px] flex-none gap-1">
                {/* body2 text */}
                <span className="w-[77px] h-[22px] text-[14px] font-normal leading-[22px] text-[#1E1E1E] flex items-center">
                  {country}
                </span>
                {/* caption text */}
                <span className="w-[49px] h-[18px] text-[12px] font-normal leading-[18px] text-[#00000090] flex items-center">
                  Country
                </span>
              </div>
            </div>
            {/* Job-Tag 1 */}
            <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
             <img 
              src="/cards/tag.svg" 
              alt="Tag Icon"
            />
                {/* Frame 97 - Label container */}
              <div className="flex flex-col justify-center items-start w-[77px] h-[40px] flex-none gap-1">
                {/* body2 text */}
                <span className="w-[77px] h-[22px] text-[14px] font-normal leading-[22px] text-[#1E1E1E] flex items-center">
                  {numberOfApplicants}
                </span>
                {/* caption text */}
                <span className="w-[49px] h-[18px] text-[12px] font-normal leading-[18px] text-[#00000090] flex items-center">
                  Applied
                </span>
              </div>
            </div>
          </div>
        </div>

      {/* Job Number Label */}
      <div className="absolute left-[75.5%] top-[10%] flex items-center justify-center w-20 bg-black/20 rounded-[6px]">
        <span className="text-[12px] font-bold leading-[20px] text-[#1E1E1E] text-center">
          JOB - {jobNumber}
        </span>
      </div>

      {/* Button */}
      <button className="absolute left-[7%] top-[67%] flex items-center justify-center px-3 min-w-[64px] h-[36px] bg-[#FFEB9C] rounded-[8px] transition-all duration-200 hover:bg-[#FFE066] hover:scale-105"
        onClick={onClick}>
        <span className="text-[14px] font-bold leading-[24px] text-[#1E1E1E]">
          View Details
        </span>
      </button>
    </div>
  );
};

    // =======================
    // APPLIED STUDENT CARD COMPONENT
    // ========================
    const AppliedStudentCard = ({
      studentName,
      studentNumber,
      imageUrl,
      onClick,
      applicationId,
    }: {
      studentName: string;
      studentNumber: string;
      imageUrl?: string;
      onClick?: () => void;
      applicationId?: string;
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

export default function DashboardPage() {
  const router = useRouter();

  const {
    opportunities,
    loading: opportunitiesLoading,
    getRecentOpportunities,
  } = useOpportunityHandler();

  const {
    applications,
    loading: applicationsLoading,
    getRecentApplicants,
  } = useCompanyApplicationHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getRecentOpportunities(4),
          getRecentApplicants(4)
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, [getRecentOpportunities, getRecentApplicants]);

  const mappedOpportunities = useMemo(() => {
    if (!opportunities || !Array.isArray(opportunities)) {
      return [];
    }
    return opportunities.map((opp, index) => ({
      id: opp.id,
      jobNumber: opp.id.substring(0, 3) || String(index + 1),
      jobName: opp.title,
      jobtype: opp.type,
      country: opp.location || "Not specified",
      numberOfApplicants: String(opp.applicantCount ?? 0),
    }));
  }, [opportunities]);

  const uniqueApplications = useMemo(() => {
    if (!applications || !Array.isArray(applications)) {
      return [];
    }

    const studentMap = new Map<string, any>();

    applications.forEach((application) => {
      const studentId = application.student?.id;
      if (!studentId) return;

      const existingApplication = studentMap.get(studentId);
      
      if (!existingApplication) {
        studentMap.set(studentId, application);
      } else {
        const existingDate = new Date(existingApplication.appliedAt);
        const currentDate = new Date(application.appliedAt);
        
        if (currentDate > existingDate) {
          studentMap.set(studentId, application);
        }
      }
    });

    return Array.from(studentMap.values());
  }, [applications]);

  const stats = useMemo(() => {
  const totalOpportunities = opportunities.length;

  const totalApplicants = applications.length;

  const pendingApplications = applications.filter(
    app => app.status === "pending"
  ).length;

  const acceptedApplications = applications.filter(
    app => app.status === "accepted"
  ).length;

  return {
    totalOpportunities,
    totalApplicants,
    pendingApplications,
    acceptedApplications,
  };
}, [opportunities, applications]);

const dashboardLoading =
  opportunitiesLoading || applicationsLoading || !stats;

  const dashboardStats = useMemo(() => {
  const formatValue = (val: number) => (dashboardLoading ? "..." : val.toString());

  return [
    {
      title: "Opportunities",
      value: formatValue(stats.totalOpportunities),
      subtitle: "Recently created",
    },
    {
      title: "Applications",
      value: formatValue(stats.totalApplicants),
      subtitle: "Total applications",
    },
    {
      title: "Pending",
      value: formatValue(stats.pendingApplications),
      subtitle: "Waiting for review",
    },
    {
      title: "Accepted",
      value: formatValue(stats.acceptedApplications),
      subtitle: "Approved candidates",
    },
  ];
}, [
  stats,
  dashboardLoading
]);





  return (
    <DashboardLayout>
      
       <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-8">
          Dashboard
        </h1>
      {/* Top row: 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 place-items-center">
          {dashboardStats.map((stat) => (
            <Card
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
            />
          ))}
        </div>

{dashboardLoading ? (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
    </div>
  ) : (
      <div className="flex flex-col xl:flex-row gap-8 pl-2">
        {/* Bottom left column */}
        <div className="flex flex-col gap-6">
            <h4 className="text-[24px] font-bold leading-[36px] text-[#1E1E1E]">
            Recent Created Opportunity
          </h4>

            {mappedOpportunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20  rounded-lg">
                <div className="text-[#1E1E1E] text-lg font-semibold mb-2">No opportunities found</div>
                <div className="text-[#1E1E1E]/60 text-sm">Create your first opportunity to get started</div>
              </div>
            ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
                {mappedOpportunities.map((job) => (
              <JobCard
                    key={job.id}
                jobName={job.jobName}
                jobNumber={job.jobNumber}
                jobtype={job.jobtype}
                country={job.country}
                numberOfApplicants={job.numberOfApplicants}
                    onClick={() => router.push(`/Company/dashboard/job/${job.id}`)}
              />
            ))}
          </div>
            )}
        </div>

        {/* Bottom right column */}
        <div className="flex flex-col gap-8 flex-1">
            <h4 className="text-[24px] font-bold leading-[36px] text-[#1E1E1E]">
            Recent Applied Students
          </h4>
            {uniqueApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20  rounded-lg">
                <div className="text-[#1E1E1E] text-lg font-semibold mb-2">No applicants yet</div>
                <div className="text-[#1E1E1E]/60 text-sm">Applicants will appear here when students apply to your opportunities</div>
              </div>
            ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-8 justify-items-center">
                {uniqueApplications.map((application) => (
              <AppliedStudentCard
                    key={application.id}
                    studentName={application.student?.name || 'Unknown Student'}
                    studentNumber={application.student?.id?.substring(0, 3) || application.id.substring(0, 3)}
                    imageUrl={application.student?.image}
                    applicationId={application.id}
                    onClick={() => {
                      if (application.student?.id) {
                        router.push(`/Company/dashboard/applicant/${application.student.id}`);
              }
                    }}
            />
            ))}
          </div>
            )}
        </div>
      </div>
        )}
      </div>
    
    </DashboardLayout>
  );
}
