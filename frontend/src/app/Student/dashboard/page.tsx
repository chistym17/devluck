// src/app/Student/dashboard/page.tsx
"use client";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
import { ArrowUpRight } from 'lucide-react';
import { mockContracts} from "@/src/mocks/mockContract";
import { useRouter } from "next/navigation";
import { useStudentProfileHandler } from "@/src/hooks/studentapihandler/useStudentProfileHandler";
import { useStudentOpportunityHandler } from "@/src/hooks/studentapihandler/useStudentOpportunityHandler";
import { useStudentDashboardHandler } from "@/src/hooks/studentapihandler/useStudentDashboardHandler";
import { useEffect, useMemo } from "react";

interface Card1Contract {
  id: string | number;
  contractTitle: string;
  company?: string;
  salary?: string;
  workProgress?: number;
  opportunityStatus?: string;
  [key: string]: any;
}
const Card1 = ({
  contract,
  onClick,
}: {
  contract: Card1Contract;
  onClick?: () => void;
}) => {
      const isUpcoming = contract.opportunityStatus === "Upcoming Interview";
  return (
    <div className="relative w-[400px]">
      {/* SVG Shape */}
      <svg width="400" height="165" viewBox="0 0 437 165" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_dd_13195_51018)">
      <path d="M349.288 8C356.801 8 362.051 15.8514 362.051 23.3643C362.051 43.5621 376.54 59.9354 394.415 59.9355C403.457 59.9355 417 66.1145 417 75.1563V109.748C417 122.59 406.59 133 393.748 133H52C34.3269 133 20 118.673 20 101V40C20 22.3269 34.3269 8 52 8H349.288Z" fill="white"/>
      </g>
      <defs>
      <filter id="filter0_dd_13195_51018" x="0" y="0" width="437" height="165" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect1_dropShadow_13195_51018"/>
      <feOffset dy="12"/>
      <feGaussianBlur stdDeviation="12"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.619608 0 0 0 0 0.670588 0 0 0 0.12 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_13195_51018"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="1"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.619608 0 0 0 0 0.670588 0 0 0 0.2 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_13195_51018" result="effect2_dropShadow_13195_51018"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_13195_51018" result="shape"/>
      </filter>
      </defs>
      </svg>


      {/* Content */}
      <div
        className="
          absolute
          left-[6%]
          top-[14.48%]
          right-[9.69%]
          z-10
          flex
          flex-col
          gap-1
          pl-5
        "
      >
        <h3 className="text-[18px] font-bold text-[#1E1E1E]">
          {contract.contractTitle}
        </h3>

       <div className="flex flex-row gap-2">
              
                <div className="flex flex-col justify-center items-start w-[100px] h-[40px]">
                  <span className="text-[14px] font-normal leading-[22px] text-[#1E1E1E]">
                    {contract?.company ?? "-"}
                  </span>
                  <span className="text-[12px] font-normal leading-[18px] text-[#00000090]">
                    Company
                  </span>
                </div>
                <div className="flex flex-col justify-center items-start w-[100px] h-[40px]">
                  <span className="text-[14px] font-normal leading-[22px] text-[#1E1E1E]">
                    {contract?.salary ?? "-"}
                  </span>
                  <span className="text-[12px] font-normal leading-[18px] text-[#00000090]">
                    Salary
                  </span>
                </div>
                  <div className="flex flex-col justify-center items-start w-[100px] h-[40px]">
                  <span className="text-[14px] font-normal leading-[22px] text-[#1E1E1E]">
                    {contract?.workProgress ?? "-"}%
                  </span>
                  <span className="text-[12px] font-normal leading-[18px] text-[#00000090]">
                   Profile Match
                  </span>
                </div>
              </div>

      
      </div>
 

      <button onClick={onClick}
        className={`
          absolute left-[85%] top-[3%]
          w-12 h-12 rounded-full
          flex items-center justify-center
          shadow-md z-20
          transition-all duration-200 ease-out
          hover:scale-105
          group

          ${isUpcoming 
            ? "bg-black hover:bg-black"
            : "bg-[#FFEB9C] hover:bg-[#FFE066]"
          }
        `}
      >
        <ArrowUpRight
          size={24}
          className={`
            transition-transform duration-200 ease-out
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5

            ${isUpcoming ? "text-white" : "text-black"}
          `}
        />
      </button>


    </div>
    );
  };

const Card = ({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) => {
  return (
    <div
      className="
        relative w-[189.5px] h-[127.36px]
        bg-white border border-[#F4F6F8]
        rounded-[16px]
        shadow-lg
        transform -skew-x-12 rounded-[24px]
      "
    >
      {/* Glass blur overlay (Subtract) */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[10px] rounded-[16px] " />

      {/* Frame 109 (centered content) */}
      <div
        className="
          absolute top-1/2 left-[9.82%] right-[9.19%]
          -translate-y-1/2
          flex flex-col gap-[5px] 
        "
      >
        {/* Label */}
        <span className="text-[12px] skew-x-12 leading-[18px] text-black/60">
          {title}
        </span>

        {/* Frame 108 */}
        <div
          className="
            flex items-center justify-between
            px-4 py-[5px]
            bg-[rgba(145,158,171,0.12)]
            rounded-[12px] 
          "
        >
          <span className="text-[24px] skew-x-12 leading-[36px] font-bold text-[#1E1E1E]">
            {value}
          </span>

          {/* Arrow icon */}
          <ArrowUpRight
          size={24}
          className={`
            transition-transform duration-200 ease-out
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5 skew-x-12

         
          `}
        />
        </div>
      </div>
    </div>
  );
};



export default function DashboardPage() {
  const {
    profile,
    profileLoading,
    getProfile,
    experiences,
    experienceLoading,
    getExperiences,
    educations,
    educationLoading,
    getEducations,
    skills,
    skillsLoading,
    getSkills,
  } = useStudentProfileHandler();

  const {
    opportunities,
    loading: opportunitiesLoading,
    listOpportunities,
  } = useStudentOpportunityHandler();

  const {
    stats,
    loading: statsLoading,
    getDashboardStats,
  } = useStudentDashboardHandler();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getProfile(),
          getExperiences(),
          getEducations(),
          getSkills(),
          listOpportunities(1, 4),
          getDashboardStats()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, [getProfile, getExperiences, getEducations, getSkills, listOpportunities, getDashboardStats]);

  const mappedOpportunities = useMemo(() => {
    if (!opportunities || !Array.isArray(opportunities)) {
      return [];
    }
    return opportunities.map((opp) => ({
      id: opp.id,
      applicantId: 0,
      contractTitle: opp.title,
      company: opp.company?.name || "Unknown Company",
      salary: opp.allowance ? `${opp.currency} ${opp.allowance}` : "Not specified",
      workProgress: Math.floor(Math.random() * 100),
      opportunityStatus: "Applied" as const,
      opportunityFrom: "Company" as const,
      deadline: opp.startDate ? new Date(opp.startDate).toLocaleDateString() : "Not specified",
      startDate: opp.startDate ? new Date(opp.startDate).toLocaleDateString() : "Not specified",
      endDate: "Not specified",
      status: "Running" as const,
      applicantIds: [],
      companyId: opp.companyId || "",
      skills: opp.skills || [],
      benefits: opp.benefits || [],
      keyResponsibilities: opp.keyResponsibilities || [],
      whyYoullLoveWorkingHere: opp.whyYouWillLoveWorkingHere || [],
      jobDescription: opp.details || "",
      jobType: (opp.type === "Full-time" || opp.type === "Part-time" || opp.type === "Contract") 
        ? opp.type 
        : "Full-time" as "Full-time" | "Part-time" | "Contract",
      location: opp.location || "Not specified",
    }));
  }, [opportunities]);

  const totalOpportunities = stats?.totalOpportunities ?? 0;
  const totalApplied = stats?.totalApplied ?? 0;
  const totalRejected = stats?.totalRejected ?? 0;
  const upcomingInterviews = 0;

  const isLoading =
  profileLoading ||
  experienceLoading ||
  educationLoading ||
  skillsLoading ||
  opportunitiesLoading ||
  statsLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      </DashboardLayout>
    );
  }


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
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-[1400px] flex flex-col mt-80 sm:mt-0">
        {/* Frame 254 */}
        <div className="
          flex flex-col
          sm:flex-row
          sm:items-start
          sm:justify-between
          gap-10
          w-full
        ">
          {/* Left side */}
          <div className="flex-[8] flex sm:flex-row flex-col h-full rounded-[32px] p-6 gap-10">
            <div className="flex flex-col gap-2">
              {/* Top row: title and buttons */}
              <div className="flex flex-row items-center justify-between w-full h-[48px] gap-6">
                {/* Example Button */}
                <div className="relative w-16 h-10 rounded-lg bg-black text-white flex items-center justify-center -skew-x-12">
                  <div className="skew-x-12">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 8.16212V8.23512C22 9.09512 22 9.52612 21.793 9.87812C21.586 10.2301 21.209 10.4391 20.457 10.8581L19.664 11.2981C20.21 9.45012 20.393 7.46412 20.46 5.76612L20.47 5.54512L20.472 5.49312C21.123 5.71912 21.489 5.88812 21.717 6.20412C22 6.59712 22 7.11912 22 8.16212ZM2 8.16212V8.23512C2 9.09512 2 9.52612 2.207 9.87812C2.414 10.2301 2.791 10.4391 3.543 10.8581L4.337 11.2981C3.79 9.45012 3.607 7.46412 3.54 5.76612L3.53 5.54512L3.529 5.49312C2.877 5.71912 2.511 5.88812 2.283 6.20412C2 6.59712 2 7.12012 2 8.16212Z" fill="#FFEB9C"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2.00012C13.784 2.00012 15.253 2.15712 16.377 2.34712C17.516 2.53912 18.085 2.63512 18.561 3.22112C19.037 3.80712 19.011 4.44012 18.961 5.70612C18.789 10.0551 17.851 15.4861 12.75 15.9661L12.75 19.5001H14.18C14.4111 19.5003 14.635 19.5804 14.8137 19.727C14.9923 19.8736 15.1147 20.0775 15.16 20.3041L15.35 21.2501H18C18.1989 21.2501 18.3897 21.3291 18.5303 21.4698C18.671 21.6104 18.75 21.8012 18.75 22.0001C18.75 22.199 18.671 22.3898 18.5303 22.5305C18.3897 22.6711 18.1989 22.7501 18 22.7501H6C5.80109 22.7501 5.61032 22.6711 5.46967 22.5305C5.32902 22.3898 5.25 22.199 5.25 22.0001C5.25 21.8012 5.32902 21.6104 5.46967 21.4698C5.61032 21.3291 5.80109 21.2501 6 21.2501H8.65L8.84 20.3041C8.88529 20.0775 9.00768 19.8736 9.18634 19.727C9.365 19.5804 9.58891 19.5003 9.82 19.5001H11.25L11.25 15.9661C6.15 15.4861 5.212 10.0541 5.04 5.70612C4.989 4.44012 4.964 3.80612 5.44 3.22112C5.915 2.63512 6.484 2.53912 7.623 2.34712C9.06982 2.11 10.5339 1.99393 12 2.00012ZM12.952 6.19912L12.854 6.02312C12.474 5.34012 12.284 5.00012 12 5.00012C11.716 5.00012 11.526 5.34012 11.146 6.02312L11.048 6.19912C10.94 6.39312 10.886 6.48912 10.802 6.55312C10.717 6.61712 10.612 6.64112 10.402 6.68812L10.212 6.73212C9.474 6.89912 9.105 6.98212 9.017 7.26412C8.929 7.54712 9.181 7.84112 9.684 8.42912L9.814 8.58112C9.957 8.74812 10.029 8.83112 10.061 8.93512C10.093 9.03912 10.082 9.15012 10.061 9.37312L10.041 9.57612C9.965 10.3611 9.927 10.7541 10.156 10.9281C10.386 11.1021 10.732 10.9431 11.423 10.6251L11.601 10.5431C11.798 10.4531 11.896 10.4081 12 10.4081C12.104 10.4081 12.202 10.4531 12.399 10.5431L12.577 10.6251C13.268 10.9441 13.614 11.1021 13.844 10.9281C14.074 10.7541 14.035 10.3611 13.959 9.57612L13.939 9.37312C13.918 9.15012 13.907 9.03912 13.939 8.93512C13.971 8.83212 14.043 8.74812 14.186 8.58112L14.316 8.42912C14.819 7.84112 15.071 7.54712 14.983 7.26412C14.895 6.98212 14.526 6.89912 13.788 6.73212L13.598 6.68812C13.388 6.64112 13.283 6.61812 13.198 6.55312C13.114 6.48912 13.06 6.39312 12.952 6.19912Z" fill="#FFEB9C"/>
                  </svg>
                  </div>
                </div>

                {/* Secondary Button */}
                <div className="w-[160px] h-10 bg-[#FFEB9C] rounded-lg flex items-center justify-center font-bold text-[14px] text-[#1E1E1E] -skew-x-12">
                  <div className="skew-x-12">#{profile?.profileRanking || "-"} Profile Ranking </div>
                </div>

              </div>

              <h1 className="text-4xl font-extrabold">
                {profile?.name || "Complete your name"}
              </h1>

             <p className="text-sm text-black/90">
              {profile?.description
                ? profile.description.length > 250
                  ? profile.description.slice(0, 250) + "..."
                  : profile.description
                : "Complete this field - Add a short description about yourself."}
              </p>

            </div>

            <div className="flex flex-col gap-4">
              {/* Work Progress Label & Bar */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-[12px] leading-[18px] uppercase text-[#1E1E1E]">
                    Profile Complete %
                  </span>
                  <span className="font-bold text-[12px] leading-[18px] uppercase text-[#1E1E1E]">
                    {profile?.profileComplete ?? 0}%
                  </span>
                </div>
                <div className="relative w-[250px] h-[16px] bg-[#1E1E1E] transform -skew-x-[20deg] rounded-[4px]">
                  {/* SVG Indicator */}
                  <div className="absolute z-10 w-[42px] h-[26px] ml-[-10px] mt-[-5px] skew-x-[20deg]">
                    <svg width="42" height="25" viewBox="0 0 42 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.01253 4.4642C7.84355 2.08984 10.0844 0.5 12.6 0.5V24.5H8.45688C4.32379 24.5 1.42837 20.4189 2.79374 16.5179L4.2 12.5L7.01253 4.4642Z" fill="#1E1E1E"/>
                    <path d="M12.6 0.5C10.0844 0.5 7.84355 2.08984 7.01253 4.4642L2.79374 16.5179C1.42837 20.4189 4.32379 24.5 8.45688 24.5H12.6" stroke="#FFEB9C"/>
                    <path d="M12.6001 0.5H28.6001V24.5H12.6001V0.5Z" fill="#1E1E1E"/>
                    <path d="M12.6001 0.5V1H28.6001V0.5V0H12.6001V0.5ZM28.6001 24.5V24H12.6001V24.5V25H28.6001V24.5Z" fill="#FFEB9C"/>
                    <path d="M20.6001 19.5C21.9846 19.5 23.3379 19.0895 24.4891 18.3203C25.6402 17.5511 26.5374 16.4579 27.0673 15.1788C27.5971 13.8997 27.7357 12.4922 27.4656 11.1344C27.1955 9.77651 26.5288 8.52923 25.5498 7.55026C24.5709 6.57129 23.3236 5.90461 21.9657 5.63451C20.6079 5.36441 19.2004 5.50304 17.9213 6.03285C16.6422 6.56266 15.549 7.45987 14.7798 8.61101C14.0106 9.76216 13.6001 11.1155 13.6001 12.5C13.6022 14.3559 14.3404 16.1351 15.6527 17.4474C16.965 18.7597 18.7442 19.4979 20.6001 19.5ZM20.6001 6.27778C21.8017 6.27701 22.9778 6.62441 23.9862 7.27798C24.9946 7.93154 25.7919 8.86327 26.2819 9.96047C26.7719 11.0577 26.9335 12.2733 26.7471 13.4604C26.5607 14.6475 26.0344 15.7552 25.2318 16.6494V15.6111C25.2311 14.9951 25.0538 14.3922 24.7209 13.8738C24.3879 13.3555 23.9134 12.9435 23.3534 12.6867C22.0312 14.3472 19.169 14.3472 17.8468 12.6867C17.289 12.9464 16.8164 13.3591 16.4839 13.8768C16.1514 14.3944 15.9726 14.9959 15.9684 15.6111V16.6494C15.1658 15.7552 14.6395 14.6475 14.4531 13.4604C14.2667 12.2733 14.4283 11.0577 14.9183 9.96047C15.4083 8.86327 16.2056 7.93154 17.214 7.27798C18.2223 6.62441 19.3985 6.27701 20.6001 6.27778Z" fill="#FFEB9C"/>
                    <path d="M20.6 13.3783C21.1665 13.3787 21.7204 13.2111 22.1916 12.8967C22.6628 12.5823 23.0302 12.1352 23.2474 11.612C23.4645 11.0888 23.5216 10.513 23.4115 9.95731C23.3013 9.40164 23.0289 8.89111 22.6286 8.49027C22.2283 8.08944 21.7182 7.81631 21.1626 7.70542C20.6071 7.59453 20.0312 7.65086 19.5077 7.86728C18.9842 8.08371 18.5366 8.45051 18.2216 8.92131C17.9065 9.3921 17.7382 9.94575 17.7378 10.5122C17.7383 11.2715 18.0399 11.9997 18.5764 12.537C19.113 13.0742 19.8407 13.3768 20.6 13.3783Z" fill="#FFEB9C"/>
                    <path d="M34.1874 20.5358C33.3564 22.9102 31.1155 24.5 28.6 24.5L28.6 0.500003L32.7431 0.500003C36.8762 0.500002 39.7716 4.58105 38.4062 8.4821L37 12.5L34.1874 20.5358Z" fill="#1E1E1E"/>
                    <path d="M28.6 24.5C31.1155 24.5 33.3564 22.9102 34.1874 20.5358L38.4062 8.4821C39.7716 4.58105 36.8762 0.500002 32.7431 0.500003L28.6 0.500003" stroke="#FFEB9C"/>
                    </svg>

                  </div>
                  {/* Progress Fill */}
                  <div
                    className="absolute left-0 top-1/2 h-[14px] -translate-y-1/2 rounded bg-[#FFEB9C]"
                    style={{ width: `${profile?.profileComplete ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Email, Availability & Salary Expectation */}
              <div className="flex flex-col gap-4 w-[62px] h-[152px]">
                {[
                  { value: (profile as any)?.email ?? "—", label: "Email", key: "email" },
                  { value: profile?.availability ?? "—", label: "Availability", key: "availability" },
                  { value: (profile as any)?.salaryExpectation ? (profile as any).salaryExpectation.toLocaleString() : "—", label: "Salary Expectation", key: "salaryExpectation" },
                ].map((item) => (
                  <div key={item.key} className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
                    <img src="/cards/tag.svg" alt="Tag Icon" />
                    <div className="flex flex-col justify-center items-start w-[77px] h-[40px] flex-none gap-1">
                      <span className="w-[77px] h-[22px] text-[14px] font-normal leading-[22px] text-[#1E1E1E] flex items-center">
                        {item.value}
                      </span>
                      <span className="w-[77px] h-[18px] text-[12px] font-normal leading-[18px] text-[#00000090] flex items-center">
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

         {/* Right side */}
          <div className="
            flex-[4]
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-4
            flex-1
            justify-items-center
            sm:justify-items-stretch
          ">
            <Card title="All Opportunity" value={totalOpportunities.toString()} />
            <Card title="Total Applied" value={totalApplied.toString()} />
            <Card title="Upcoming Interview" value={upcomingInterviews.toString()} />
            <Card title="Total Rejected" value={totalRejected.toString()} />
          </div>
        </div>
        
        {/* Frame 267 */}
        <div className="flex flex-col sm:flex-row w-full gap-10 sm:gap-15 mt-15 ">


          {/* Frame 266 */}
          <div className="flex-[8] flex flex-col gap-6 px-4 sm:px-0  ">
                  {/* Skills Parallelogram Card */}
                  <div className="flex flex-col gap-10">
                    {/* Row 1 */}
                    <div className="flex flex-row items-start xl:items-stretch justify-center gap-10 flex-wrap xl:flex-nowrap w-full">
                      {/* Experience Card */}
                      <div className="w-full sm:max-w-[360px] sm:min-w-[320px] h-auto relative">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                          Experience Summary
                          </h3>
                        </div>
                        <div className={`w-full sm:max-w-[360px] sm:min-w-[340px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
                          <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                           {experienceLoading ? (
                              <p className="text-[#555] font-publicSans py-4">Loading experience...</p>
                            ) : experiences?.length ? (
                            experiences.map((exp) => (
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
                                    <span className="font-publicSans">
                                    {exp.startDate && exp.endDate
                                      ? `${exp.startDate} - ${exp.endDate}`
                                      : exp.startDate || exp.endDate || "No dates"}
                                  </span>
                                  </div>
                                   <p className="font-publicSans text-[12px] text-[#1E1E1E] mt-1 break-words">
                                    {exp.description ? (exp.description.split(" ").slice(0, 10).join(" ") + (exp.description.split(" ").length > 10 ? "..." : "")) : ""}
                                  </p>
                                </div>
                              ))
                          ) : (
                            <p className="text-[#555] font-publicSans py-4">No experience info available.</p>
                          )}
                        </div>
                        </div>
                      </div>
            
            
                      {/* Card 2 */}
                      <div className="w-full sm:max-w-[360px] sm:min-w-[340px] h-auto relative">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]  ">
                              Education Summary
                            </h3>
                        </div>
                        <div className={`w-full sm:max-w-[360px] sm:min-w-[340px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
                          <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                          {educationLoading ? (
                              <p className="text-[#555] font-publicSans py-4">Loading education...</p>
                            ) : educations?.length ? (
                            educations.map((edu) => (
                                <div
                                  key={edu.id}
                                  className="px-4 py-2  w-full"
                                >
                                  <div className="flex items-center justify-between">
                                    {/* Left side: SVG + Major */}
                                    <div className="flex items-center gap-2">
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C"/>
                                      </svg>
                                      <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E] transform-none">
                                        {edu.major}
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-[12px] text-[#555] transform-none">
                                    <span className="font-publicSans">{edu.name}</span>
                                    
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

                                    <span className="font-publicSans">
                                    {edu.startDate && edu.endDate
                                      ? `${edu.startDate} - ${edu.endDate}`
                                      : edu.startDate || edu.endDate || "No dates"}
                                  </span>
                                  </div>
                                  <p className="font-publicSans text-[12px] text-[#1E1E1E] mt-1">
                                    {edu.description ? (edu.description.split(" ").slice(0, 10).join(" ") + (edu.description.split(" ").length > 10 ? "..." : "")) : ""}
                                  </p>
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
                      {/* Skill Card */}
                      <div className="w-full sm:max-w-[360px] sm:min-w-[340px] h-auto relative">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                          Skill Summary
                          </h3>
            
                         {/* More Button */}
                          
                        </div>
                          <div className={`w-full sm:max-w-[360px] sm:min-w-[340px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
                            <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                              {skillsLoading ? (
                              <p className="text-[#555] font-publicSans py-4">Loading skills...</p>
                            ) : skills?.length ? (
                            <div className="flex flex-wrap gap-3">
                              {skills.map((skill) => (
                                <span
                                  key={skill.id}
                                  className="px-4 py-2 text-[14px] font-publicSans text-[#1E1E1E] transform -skew-x-12 rounded-[8px] border border-black/80 whitespace-nowrap"
                                >
                                  {skill.name}
                                </span>
                              ))}
                              </div>
                            ) : (
                              <p className="text-[#555] font-publicSans">No skills info available.</p>
                            )}
                          </div>
                        </div>
                      </div>
            
            
                      {/* Portfolio Card */}
                      <div className="w-full sm:max-w-[360px] sm:min-w-[340px] h-auto relative">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                          Upcoming Interview
                          </h3>
            
                          
                        </div>
                        <div className={`w-full sm:max-w-[360px] sm:min-w-[340px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
                          <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                            <p className="text-[#555] font-publicSans py-4">
                              No upcoming interviews.
                            </p>
                          </div>
                        </div>
                      </div>
            
                    </div>
                  </div>
          </div>

         {/* Frame 240 */}
          <div className="flex-[4] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                New Opportunity
              </h3>
            </div>

            {/* Opportunities list */}
            <div className="flex flex-wrap justify-center gap-4 w-full ">
              {opportunitiesLoading ? (
                <p className="text-[#555] font-publicSans">
                  Loading opportunities...
                </p>
              ) : mappedOpportunities.length > 0 ? (
                mappedOpportunities.map((opp) => (
                  <div key={opp.id} className="flex justify-center">
                    <Card1
                      contract={opp}
                      onClick={() => router.push(`/Student/dashboard/${opp.id}`)}
                    />
                  </div>
                ))
              ) : (
                <p className="text-[#555] font-publicSans">
                  No opportunities available.
                </p>
              )}
            </div>
          </div>



        </div>
      </div>
      </div>
      </div>

    </DashboardLayout>
  );
}
