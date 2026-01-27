// src/app/Student/profile/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
import { useStudentProfileHandler } from "@/src/hooks/studentapihandler/useStudentProfileHandler";

import ProfileModal from "@/src/components/Student/ProfileModal";
import ExperienceModal from "@/src/components/Student/ExperienceModal";
import EducationModal from "@/src/components/Student/EducationModal";
import LanguageModal from "@/src/components/Student/LanguageModal";
import PortfolioModal from "@/src/components/Student/PortfolioModal";
import SkillsModal from "@/src/components/Student/SkillsModal";

export default function ApplicantPage() {

  const {
    profile,
    profileLoading,
    profileError,
    getProfile,
    createProfile,
    updateProfile,
    skills,
    skillsLoading,
    getSkills,
    addSkills,
    removeSkill,
    experiences,
    experienceLoading,
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
    educations,
    educationLoading,
    getEducations,
    createEducation,
    updateEducation,
    deleteEducation,
    languages,
    languageLoading,
    getLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    portfolios,
    portfolioLoading,
    getPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  } = useStudentProfileHandler();

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);

  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);

  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [editingEducation, setEditingEducation] = useState<any>(null);

  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<any>(null);

  const [isModalOpen5, setIsModalOpen5] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<any>(null);

  const [isModalOpen6, setIsModalOpen6] = useState(false);
  const [editingSkills, setEditingSkills] = useState<any>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get profile, if 404, create a basic one
        try {
          await getProfile();
        } catch (error: any) {
          if (error.message.includes('not found') || error.message.includes('404')) {
            // Profile doesn't exist, create a basic one
            await createProfile({
              name: "New Student",
              description: "",
              availability: undefined,
              profileComplete: 0
            });
          }
        }
        
        // Fetch all related data
        await Promise.all([
          getSkills(),
          getExperiences(),
          getEducations(),
          getLanguages(),
          getPortfolios()
        ]);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, []);

  

  // Loading state
  if (profileLoading && !profile) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString() : "—";


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
  
        <div className="flex flex-col  gap-[10px] w-full max-w-[500px]">
  
            {/* Name + Button Row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">

              <h1 className="font-barlow font-extrabold text-[40px] leading-[64px] text-[#1E1E1E]">
                {profile?.name || "Complete your name"}
              </h1>

             <div
                className="relative w-[60px] h-[35px] skew-x-[-12deg] border-1 border-black flex items-center justify-center overflow-hidden rounded-md  transition-transform duration-200 transform hover:scale-105 "
                 onClick={() => {
                          setEditingProfile(profile); 
                          setIsModalOpen1(true);
                        }}
              >
                <div className="skew-x-[12deg]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.2793 2.152C13.9093 2 13.4393 2 12.5003 2C11.5613 2 11.0913 2 10.7213 2.152C10.2288 2.35421 9.8367 2.74377 9.63132 3.235C9.53732 3.458 9.50132 3.719 9.48632 4.098C9.47965 4.3726 9.40305 4.64097 9.26376 4.87772C9.12448 5.11447 8.92711 5.31178 8.69032 5.451C8.44906 5.5851 8.17786 5.65615 7.90184 5.65754C7.62582 5.65894 7.35392 5.59065 7.11132 5.459C6.77332 5.281 6.52832 5.183 6.28632 5.151C5.75687 5.08148 5.22139 5.2238 4.79632 5.547C4.47832 5.789 4.24332 6.193 3.77432 7C3.30432 7.807 3.07032 8.21 3.01732 8.605C2.94732 9.131 3.09132 9.663 3.41732 10.084C3.56532 10.276 3.77432 10.437 4.09732 10.639C4.57432 10.936 4.88032 11.442 4.88032 12C4.88032 12.558 4.57432 13.064 4.09832 13.36C3.77432 13.563 3.56532 13.724 3.41632 13.916C3.2554 14.1239 3.13728 14.3617 3.0688 14.6156C3.00031 14.8694 2.98282 15.1343 3.01732 15.395C3.07032 15.789 3.30432 16.193 3.77432 17L3.77993 17.0096C4.24618 17.8102 4.47958 18.211 4.79632 18.453C5.22032 18.776 5.75632 18.918 6.28632 18.849C6.52832 18.817 6.77332 18.719 7.11132 18.541C7.35404 18.4092 7.62613 18.3408 7.90234 18.3422C8.17855 18.3436 8.44994 18.4147 8.69132 18.549C9.17732 18.829 9.46532 19.344 9.48632 19.902C9.50132 20.282 9.53732 20.542 9.63132 20.765C9.83532 21.255 10.2273 21.645 10.7213 21.848C11.0913 22 11.5613 22 12.5003 22C13.4393 22 13.9093 22 14.2793 21.848C14.7719 21.6458 15.1639 21.2562 15.3693 20.765C15.4633 20.542 15.4993 20.282 15.5143 19.902C15.5343 19.344 15.8233 18.828 16.3103 18.549C16.5516 18.4149 16.8228 18.3439 17.0988 18.3425C17.3748 18.3411 17.6467 18.4093 17.8893 18.541C18.2273 18.719 18.4723 18.817 18.7143 18.849C19.2443 18.919 19.7803 18.776 20.2043 18.453C20.5223 18.211 20.7573 17.807 21.2263 17C21.6963 16.193 21.9303 15.79 21.9833 15.395C22.0177 15.1343 22 14.8693 21.9314 14.6155C21.8627 14.3616 21.7444 14.1239 21.5833 13.916C21.4353 13.724 21.2263 13.563 20.9033 13.361C20.4263 13.064 20.1203 12.558 20.1203 12C20.1203 11.442 20.4263 10.936 20.9023 10.64C21.2263 10.437 21.4353 10.276 21.5843 10.084C21.7452 9.87606 21.8633 9.63829 21.9318 9.38443C22.0003 9.13057 22.0178 8.86566 21.9833 8.605C21.9303 8.211 21.6963 7.807 21.2263 7L21.2207 6.99035C20.7545 6.1898 20.521 5.78903 20.2043 5.547C19.7792 5.2238 19.2438 5.08148 18.7143 5.151C18.4723 5.183 18.2273 5.281 17.8893 5.459C17.6466 5.59083 17.3745 5.65922 17.0983 5.65782C16.8221 5.65642 16.5507 5.58528 16.3093 5.451C16.0727 5.31166 15.8755 5.11429 15.7364 4.87755C15.5973 4.64081 15.5209 4.37251 15.5143 4.098C15.4993 3.718 15.4633 3.458 15.3693 3.235C15.2677 2.99174 15.1191 2.77088 14.9321 2.58506C14.745 2.39923 14.5232 2.25208 14.2793 2.152ZM15.5226 12C15.5226 13.657 14.1686 15 12.4996 15C10.8296 15 9.47656 13.657 9.47656 12C9.47656 10.343 10.8296 9 12.4996 9C14.1696 9 15.5226 10.343 15.5226 12Z" fill="#1E1E1E"/>
                  </svg>
                </div>
              </div>

            </div>

            {/* Description */}
              <p className="font-publicSans text-[16px] leading-[24px] text-[#1E1E1E] break-words">
                {profile?.description
                ? profile.description.length > 250
                  ? profile.description.slice(0, 250) + "..."
                  : profile.description
                : "Complete your description to tell employers about yourself."}
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
                    ${profile?.profileRanking ? "text-[200px]" : "text-[100px] leading-[175px] text-center justify-center items-center"}
                  `}
                >
                  {profile?.profileRanking ?? "N/A"}
                </div>

                {/* Profile Ranking label */}
                <h4 className="absolute left-[70px] top-[85px] font-publicSans font-bold text-[24px] leading-[36px] text-[#1E1E1E] flex ">
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
                    {profile?.profileComplete || 0}%
                  </span>
                </div>

                {/* Progress Bar Container */}
                <div className="relative w-[200px] sm:w-[260px] h-[16px] bg-[#1E1E1E] transform -skew-x-[20deg]  rounded-[4px]">
                  {/* Progress Fill */}
                  <div
                    className="absolute left-0.5 top-1/2 h-[14px] -translate-y-1/2 rounded bg-[#FFEB9C]"
                    style={{ width: `${profile?.profileComplete || 0}%` }}
                  />

                </div>
              </div>
            </div>
           <div className="flex flex-col gap-4 w-[62px] h-[152px] mx-auto">
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
        {/* Skills Parallelogram Card */}
        <div className="hidden sm:block absolute top-50 left-80 w-[460px] h-auto relative">
        <div className="flex items-center justify-between mb-6">
               <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
            Skills
          </h3>

              {/* More Button */}
              <button
                className="relative w-[80px] h-[32px] skew-x-[-12deg]  border border-black flex items-center justify-center rounded-md cursor-pointer duration-200 hover:scale-105  transition"
                 onClick={() => {
                        setEditingSkills(null);
                        setIsModalOpen6(true);        
                      }}
              >
                <div className="skew-x-[12deg] font-semibold text-[14px] text-[#1E1E1E]">
                      More
                    </div>
              </button>
            </div>

        {/* Parallelogram background */}
          <div
            className="w-[439px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden"
            style={{ maxHeight: "250px" }} // <-- crucial
          >
            {/* Inner content (counter-skew) */}
              <div className="transform skew-x-12 px-8 w-full h-full overflow-y-auto">
              {skillsLoading ? (
                <p className="text-[#555] font-publicSans">Loading skills...</p>
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
                <p className="text-[#555] font-publicSans">Complete this field - Add your skills to showcase your expertise.</p>
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

              {/* More Button */}
              <button
                className="relative w-[80px] h-[32px] skew-x-[-12deg]  border border-black flex items-center justify-center rounded-md cursor-pointer duration-200 hover:scale-105  transition"
                 onClick={() => {
                        setEditingSkills(null);
                        setIsModalOpen6(true);        
                      }}
              >
                <div className="skew-x-[12deg] font-semibold text-[14px] text-[#1E1E1E]">
                      More
                    </div>
              </button>
            </div>
            <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
              <div className="transform skew-x-12 px-8 w-full h-full overflow-y-auto">
                 {skillsLoading ? (
                <p className="text-[#555] font-publicSans">Loading skills...</p>
              ) : skills?.length ? (
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-4 py-2 text-[14px] font-publicSans text-[#1E1E1E] transform -skew-x-12 rounded-[8px] border border-black/80 whitespace-nowrap transform-none"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#555] font-publicSans">Complete this field - Add your skills to showcase your expertise.</p>
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

              {/* More Button */}
              <button
                className="relative w-[80px] h-[32px] skew-x-[-12deg]  border border-black flex items-center justify-center rounded-md cursor-pointer duration-200 hover:scale-105  transition"
                 onClick={() => {
                        setEditingExperience(null);
                        setIsModalOpen2(true);        
                      }}
              >
                <div className="skew-x-[12deg] font-semibold text-[14px] text-[#1E1E1E]">
                      More
                    </div>
              </button>
            </div>
            <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
              <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                {experienceLoading ? (
                  <p className="text-[#555] font-publicSans py-4">Loading experience...</p>
                ) : experiences?.length ? (
                experiences.map((exp) => (
                    <div key={exp.id} className="px-4 py-2 w-full">
                      <div className="flex items-center justify-between">
                        {/* Left side: SVG + Role */}
                        <div className="flex items-center gap-2"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C"/>
                          </svg>
                          <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E]">
                            {exp.role}
                          </h4>
                        </div>

                        {/* Right side: button with custom SVG */}
                        <button className="transition-transform"
                         onClick={() => {
                          setEditingExperience(exp); 
                          setIsModalOpen2(true);
                        }}
                        >
                          <svg
                            width="30"
                            height="24"
                            viewBox="0 0 30 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M5.53809 0.666992H24.4619C27.1522 0.667195 29.3328 2.84777 29.333 5.53809V9C29.333 16.9161 22.9161 23.333 15 23.333C7.08392 23.333 0.666993 16.9161 0.666992 9V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z" fill="#FFEB9C"/>
                            <path d="M5.53809 0.666992H24.4619C27.1522 0.667195 29.3328 2.84777 29.333 5.53809V9C29.333 16.9161 22.9161 23.333 15 23.333C7.08392 23.333 0.666993 16.9161 0.666992 9V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z" stroke="#E6D48C" strokeWidth="1.33333"/>
                            <path d="M14.6001 16.1007L19.5308 11.1701C18.7012 10.8237 17.9478 10.3177 17.3134 9.68072C16.6762 9.04619 16.1699 8.29257 15.8234 7.46272L10.8928 12.3934C10.5081 12.7781 10.3154 12.9707 10.1501 13.1827C9.95483 13.4329 9.7874 13.7036 9.65076 13.9901C9.53543 14.2327 9.44943 14.4914 9.27743 15.0074L8.36943 17.7294C8.32764 17.854 8.32144 17.9878 8.35152 18.1158C8.38161 18.2438 8.44679 18.3608 8.53974 18.4537C8.63269 18.5467 8.74972 18.6119 8.87769 18.642C9.00565 18.672 9.13946 18.6658 9.26409 18.6241L11.9861 17.7161C12.5028 17.5441 12.7608 17.4581 13.0034 17.3427C13.2901 17.2061 13.5608 17.0387 13.8108 16.8434C14.0228 16.6781 14.2154 16.4854 14.6001 16.1007ZM20.8988 9.80205C21.3904 9.31043 21.6666 8.64364 21.6666 7.94838C21.6666 7.25312 21.3904 6.58634 20.8988 6.09472C20.4071 5.6031 19.7404 5.3269 19.0451 5.3269C18.3498 5.3269 17.6831 5.6031 17.1914 6.09472L16.6001 6.68605L16.6254 6.76005C16.9168 7.59386 17.3937 8.35065 18.0201 8.97338C18.6614 9.61852 19.4447 10.1048 20.3074 10.3934L20.8988 9.80205Z" fill="#1E1E1E"/>
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[12px] text-[#555]">
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
                        {exp.description ? (
                          <>
                        {exp.description.split(" ").slice(0, 10).join(" ")}
                        {exp.description.split(" ").length > 10 ? "..." : ""}
                          </>
                        ) : ""}
                      </p>
                    </div>
                   ))
              ) : (
                <p className="text-[#555] font-publicSans py-4">Complete this field - Add your work experience to showcase your professional background.</p>
              )}
            </div>
            </div>
          </div>


          {/* Card 2 */}
          <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E] ">
                  Education
                </h3>
              {/* More Button */}
              <button
                className="relative w-[80px] h-[32px] skew-x-[-12deg]  border border-black flex items-center justify-center rounded-md cursor-pointer duration-200 hover:scale-105  transition"
                 onClick={() => {
                        setEditingEducation(null);
                        setIsModalOpen3(true);        
                      }}
              >
                <div className="skew-x-[12deg] font-semibold text-[14px] text-[#1E1E1E]">
                      More
                    </div>
              </button>
             
            </div>
            <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
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
                          <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E]">
                            {edu.major}
                          </h4>
                        </div>

                        {/* Right side: Button with new SVG */}
                        <button className="transition-transform"
                         onClick={() => {
                          setEditingEducation(edu); 
                          setIsModalOpen3(true);
                        }}
                        >
                          <svg
                            width="30"
                            height="24"
                            viewBox="0 0 30 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.53809 0.666992H24.4619C27.1522 0.667195 29.3328 2.84777 29.333 5.53809V9C29.333 16.9161 22.9161 23.333 15 23.333C7.08392 23.333 0.666993 16.9161 0.666992 9V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z"
                              fill="#FFEB9C"
                            />
                            <path
                              d="M5.53809 0.666992H24.4619C27.1522 0.667195 29.3328 2.84777 29.333 5.53809V9C29.333 16.9161 22.9161 23.333 15 23.333C7.08392 23.333 0.666993 16.9161 0.666992 9V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z"
                              stroke="#E6D48C"
                              strokeWidth="1.33333"
                            />
                            <path
                              d="M14.6001 16.1007L19.5308 11.1701C18.7012 10.8237 17.9478 10.3177 17.3134 9.68072C16.6762 9.04619 16.1699 8.29257 15.8234 7.46272L10.8928 12.3934C10.5081 12.7781 10.3154 12.9707 10.1501 13.1827C9.95483 13.4329 9.7874 13.7036 9.65076 13.9901C9.53543 14.2327 9.44943 14.4914 9.27743 15.0074L8.36943 17.7294C8.32764 17.854 8.32144 17.9878 8.35152 18.1158C8.38161 18.2438 8.44679 18.3608 8.53974 18.4537C8.63269 18.5467 8.74972 18.6119 8.87769 18.642C9.00565 18.672 9.13946 18.6658 9.26409 18.6241L11.9861 17.7161C12.5028 17.5441 12.7608 17.4581 13.0034 17.3427C13.2901 17.2061 13.5608 17.0387 13.8108 16.8434C14.0228 16.6781 14.2154 16.4854 14.6001 16.1007ZM20.8988 9.80205C21.3904 9.31043 21.6666 8.64364 21.6666 7.94838C21.6666 7.25312 21.3904 6.58634 20.8988 6.09472C20.4071 5.6031 19.7404 5.3269 19.0451 5.3269C18.3498 5.3269 17.6831 5.6031 17.1914 6.09472L16.6001 6.68605L16.6254 6.76005C16.9168 7.59386 17.3937 8.35065 18.0201 8.97338C18.6614 9.61852 19.4447 10.1048 20.3074 10.3934L20.8988 9.80205Z"
                              fill="#1E1E1E"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-[#555]">
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
                        {edu.description ? (
                          <>
                        {edu.description.split(" ").slice(0, 10).join(" ")}
                        {edu.description.split(" ").length > 10 ? "..." : ""}
                          </>
                        ) : ""}
                      </p>
                    </div>
                ))
              ) : (
                <p className="text-[#555] font-publicSans py-4">Complete this field - Add your education history to showcase your academic background.</p>
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

             {/* More Button */}
              <button
                className="relative w-[80px] h-[32px] skew-x-[-12deg]  border border-black flex items-center justify-center rounded-md cursor-pointer duration-200 hover:scale-105  transition"
                 onClick={() => {
                        setEditingLanguage(null);
                        setIsModalOpen4(true);        
                      }}
              >
                <div className="skew-x-[12deg] font-semibold text-[14px] text-[#1E1E1E]">
                      More
                    </div>
              </button>
            </div>
            <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
              <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                 {languageLoading ? (
                  <p className="text-[#555] font-publicSans py-4">Loading languages...</p>
                ) : languages?.length ? (
                languages.map((lang) => (
                    <div key={lang.id} className="px-4 py-2 w-full">
                      <div className="flex items-center justify-between">
                        {/* Left side: SVG + Language name */}
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C"/>
                          </svg>
                          <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E]">
                            {lang.name}
                          </h4>
                        </div>

                        {/* Right side: level button */}
                        <button className="transition-transform"
                         onClick={() => {
                          setEditingLanguage(lang); 
                          setIsModalOpen4(true);
                        }}>
                          <svg
                            width="30"
                            height="24"
                            viewBox="0 0 30 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M5.53809 0.666992H24.4619C27.1522 0.667195 29.3328 2.84777 29.333 5.53809V9C29.333 16.9161 22.9161 23.333 15 23.333C7.08392 23.333 0.666993 16.9161 0.666992 9V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z" fill="#FFEB9C"/>
                            <path d="M5.53809 0.666992H24.4619C27.1522 0.667195 29.3328 2.84777 29.333 5.53809V9C29.333 16.9161 22.9161 23.333 15 23.333C7.08392 23.333 0.666993 16.9161 0.666992 9V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z" stroke="#E6D48C" strokeWidth="1.33333"/>
                            <path d="M14.6001 16.1007L19.5308 11.1701C18.7012 10.8237 17.9478 10.3177 17.3134 9.68072C16.6762 9.04619 16.1699 8.29257 15.8234 7.46272L10.8928 12.3934C10.5081 12.7781 10.3154 12.9707 10.1501 13.1827C9.95483 13.4329 9.7874 13.7036 9.65076 13.9901C9.53543 14.2327 9.44943 14.4914 9.27743 15.0074L8.36943 17.7294C8.32764 17.854 8.32144 17.9878 8.35152 18.1158C8.38161 18.2438 8.44679 18.3608 8.53974 18.4537C8.63269 18.5467 8.74972 18.6119 8.87769 18.642C9.00565 18.672 9.13946 18.6658 9.26409 18.6241L11.9861 17.7161C12.5028 17.5441 12.7608 17.4581 13.0034 17.3427C13.2901 17.2061 13.5608 17.0387 13.8108 16.8434C14.0228 16.6781 14.2154 16.4854 14.6001 16.1007ZM20.8988 9.80205C21.3904 9.31043 21.6666 8.64364 21.6666 7.94838C21.6666 7.25312 21.3904 6.58634 20.8988 6.09472C20.4071 5.6031 19.7404 5.3269 19.0451 5.3269C18.3498 5.3269 17.6831 5.6031 17.1914 6.09472L16.6001 6.68605L16.6254 6.76005C16.9168 7.59386 17.3937 8.35065 18.0201 8.97338C18.6614 9.61852 19.4447 10.1048 20.3074 10.3934L20.8988 9.80205Z" fill="#1E1E1E"/>
                          </svg>
                        </button>
                      </div>

                      {/* Level text (optional) */}
                      <p className="font-publicSans text-[12px] text-[#555] mt-1">
                        {lang.level}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-[#555] font-publicSans py-4">Complete this field - Add languages you speak to showcase your communication skills.</p>
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

              {/* More Button */}
              <button
                className="relative w-[80px] h-[32px] skew-x-[-12deg]  border border-black flex items-center justify-center rounded-md cursor-pointer duration-200 hover:scale-105  transition"
                 onClick={() => {
                        setEditingPortfolio(null);
                        setIsModalOpen5(true);        
                      }}
              >
                <div className="skew-x-[12deg] font-semibold text-[14px] text-[#1E1E1E]">
                      More
                    </div>
              </button>
            </div>
            <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
              <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                {portfolioLoading ? (
                  <p className="text-[#555] font-publicSans py-4">Loading portfolio...</p>
                ) : portfolios?.length ? (
                  portfolios.map((port) => (
                    <div key={port.id} className="px-4 py-2 w-full">
                      <div className="flex items-center justify-between">
                        {/* Left side: SVG + Portfolio Name */}
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C"/>
                          </svg>
                          <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E]">
                            {port.name}
                          </h4>
                        </div>

                        {/* Right side: clickable link SVG */}
                        <button className="transition-transform"
                         onClick={() => {
                          setEditingPortfolio(port); 
                          setIsModalOpen5(true);
                        }}>
                          <svg
                            width="30"
                            height="24"
                            viewBox="0 0 30 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M5.53809 0.666992H24.4619C27.1522 0.667195 29.3328 2.84777 29.333 5.53809V9C29.333 16.9161 22.9161 23.333 15 23.333C7.08392 23.333 0.666993 16.9161 0.666992 9V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z" fill="#FFEB9C"/>
                            <path d="M5.53809 0.666992H24.4619C27.1522 0.667195 29.3328 2.84777 29.333 5.53809V9C29.333 16.9161 22.9161 23.333 15 23.333C7.08392 23.333 0.666993 16.9161 0.666992 9V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z" stroke="#E6D48C" strokeWidth="1.33333"/>
                            <path d="M14.6001 16.1007L19.5308 11.1701C18.7012 10.8237 17.9478 10.3177 17.3134 9.68072C16.6762 9.04619 16.1699 8.29257 15.8234 7.46272L10.8928 12.3934C10.5081 12.7781 10.3154 12.9707 10.1501 13.1827C9.95483 13.4329 9.7874 13.7036 9.65076 13.9901C9.53543 14.2327 9.44943 14.4914 9.27743 15.0074L8.36943 17.7294C8.32764 17.854 8.32144 17.9878 8.35152 18.1158C8.38161 18.2438 8.44679 18.3608 8.53974 18.4537C8.63269 18.5467 8.74972 18.6119 8.87769 18.642C9.00565 18.672 9.13946 18.6658 9.26409 18.6241L11.9861 17.7161C12.5028 17.5441 12.7608 17.4581 13.0034 17.3427C13.2901 17.2061 13.5608 17.0387 13.8108 16.8434C14.0228 16.6781 14.2154 16.4854 14.6001 16.1007ZM20.8988 9.80205C21.3904 9.31043 21.6666 8.64364 21.6666 7.94838C21.6666 7.25312 21.3904 6.58634 20.8988 6.09472C20.4071 5.6031 19.7404 5.3269 19.0451 5.3269C18.3498 5.3269 17.6831 5.6031 17.1914 6.09472L16.6001 6.68605L16.6254 6.76005C16.9168 7.59386 17.3937 8.35065 18.0201 8.97338C18.6614 9.61852 19.4447 10.1048 20.3074 10.3934L20.8988 9.80205Z" fill="#1E1E1E"/>
                          </svg>
                        </button>
                      </div>
                      {/* portfolio link */}
                      <div key={port.id} className=" w-full">
                        <div className="flex items-center gap-2">
                          {/* Conditional SVG icon */}
                          {port.name.toLowerCase() === "github" ? (
                            <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="40" height="40" rx="8" fill="#FFEB9C"/>
                              <g clipPath="url(#clip0)">
                                <path d="M20 8.5C13.37 8.5 8 13.78 8 20.292C8 25.503 11.438 29.922 16.205 31.48C16.805 31.591 17.025 31.226 17.025 30.913C17.025 30.633 17.015 29.891 17.01 28.908C13.672 29.619 12.968 27.326 12.968 27.326C12.422 25.965 11.633 25.601 11.633 25.601C10.546 24.87 11.717 24.885 11.717 24.885C12.922 24.967 13.555 26.1 13.555 26.1C14.625 27.903 16.364 27.382 17.05 27.081C17.158 26.318 17.467 25.799 17.81 25.504C15.145 25.209 12.344 24.195 12.344 19.677C12.344 18.39 12.809 17.338 13.579 16.513C13.444 16.215 13.039 15.016 13.684 13.392C13.684 13.392 14.689 13.076 16.984 14.601C17.944 14.339 18.964 14.209 19.984 14.203C21.004 14.209 22.024 14.339 22.984 14.601C25.264 13.076 26.269 13.392 26.269 13.392C26.914 15.016 26.509 16.215 26.389 16.513C27.154 17.338 27.619 18.39 27.619 19.677C27.619 24.207 24.814 25.204 22.144 25.494C22.564 25.848 22.954 26.571 22.954 27.676C22.954 29.254 22.939 30.522 22.939 30.905C22.939 31.214 23.149 31.583 23.764 31.465C28.565 29.917 32 25.495 32 20.292C32 13.78 26.627 8.5 20 8.5Z" fill="black"/>
                              </g>
                              <defs>
                                <clipPath id="clip0">
                                  <rect width="24" height="24" fill="white" transform="translate(8 8)"/>
                                </clipPath>
                              </defs>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="40" height="40" rx="8" fill="#FFEB9C"/>
                              <path d="M12.5 15.5C12.8978 15.5 13.2794 15.658 13.5607 15.9393C13.842 16.2206 14 16.6022 14 17V27.5C14 27.8978 13.842 28.2794 13.5607 28.5607C13.2794 28.842 12.8978 29 12.5 29H9.5C8.673 29 8 28.328 8 27.5V17C8 16.172 8.673 15.5 9.5 15.5H12.5ZM21.5 11C21.8978 11 22.2794 11.158 22.5607 11.4393C22.842 11.7206 23 12.1022 23 12.5V27.5C23 27.8978 22.842 28.2794 22.5607 28.5607C22.2794 28.842 21.8978 29 21.5 29H18.5C17.673 29 17 28.328 17 27.5V12.5C17 11.672 17.673 11 18.5 11H21.5ZM30.5 18.5C30.8978 18.5 31.2794 18.658 31.5607 18.9393C31.842 19.2206 32 19.6022 32 20V27.5C32 27.8978 31.842 28.2794 31.5607 28.5607C31.2794 28.842 30.8978 29 30.5 29H27.5C27.1022 29 26.7206 28.842 26.4393 28.5607C26.158 28.2794 26 27.8978 26 27.5V20C26 19.6022 26.158 19.2206 26.4393 18.9393C26.7206 18.658 27.1022 18.5 27.5 18.5H30.5Z" fill="black"/>
                            </svg>
                          )}

                          {/* Link text */}
                          <p className="font-publicSans text-[12px] text-[#555] break-words">
                            {port.link.split(" ").slice(0, 10).join(" ")}
                            {port.link.split(" ").length > 10 ? "..." : ""}
                          </p>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <p className="text-[#555] font-publicSans py-4">Complete this field - Add your portfolio links to showcase your work.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </div>
    <ProfileModal
      isOpen={isModalOpen1}
      profile={editingProfile}
      onClose={() => setIsModalOpen1(false)}
      onSave={async (data) => {
        await updateProfile({
          name: data.name,
          email: data.email,
          description: data.description,
          availability: data.availability || undefined,
          salaryExpectation: data.salaryExpectation ? parseFloat(data.salaryExpectation) : undefined,
          image: data.image || undefined
        });
        await getProfile();
      }}
    />
    <ExperienceModal
      isOpen={isModalOpen2}
      experience={editingExperience}
      onClose={() => {
        setEditingExperience(null);
        setIsModalOpen2(false);
      }}
      onSave={async (data) => {
        if (editingExperience?.id) {
          await updateExperience(editingExperience.id, {
            role: data.role,
            companyName: data.companyName,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description
          });
        } else {
          await createExperience({
            role: data.role,
            companyName: data.companyName,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description
          });
        }
        await getExperiences();
        await getProfile();
        setEditingExperience(null);
      }}
    />
    <EducationModal
      isOpen={isModalOpen3}
      education={editingEducation}
      onClose={() => {
        setEditingEducation(null);
        setIsModalOpen3(false);
      }}
      onSave={async (data) => {
        if (editingEducation?.id) {
          await updateEducation(editingEducation.id, {
            name: data.name,
            major: data.major,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description
          });
        } else {
          await createEducation({
            name: data.name,
            major: data.major,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.description
          });
        }
        await getEducations();
        await getProfile();
        setEditingEducation(null);
      }}
    />
    <LanguageModal
      isOpen={isModalOpen4}
      language={editingLanguage}
      onClose={() => {
        setEditingLanguage(null);
        setIsModalOpen4(false);
      }}
      onSave={async (data) => {
        if (editingLanguage?.id) {
          await updateLanguage(editingLanguage.id, {
            name: data.name,
            level: data.level
          });
        } else {
          await createLanguage({
            name: data.name,
            level: data.level
          });
        }
        await getLanguages();
        await getProfile();
        setEditingLanguage(null);
      }}
    />
    <PortfolioModal
      isOpen={isModalOpen5}
      portfolio={editingPortfolio}
      onClose={() => {
        setEditingPortfolio(null);
        setIsModalOpen5(false);
      }}
      onSave={async (data) => {
        if (editingPortfolio?.id) {
          await updatePortfolio(editingPortfolio.id, {
            name: data.name,
            link: data.link
          });
        } else {
          await createPortfolio({
            name: data.name,
            link: data.link
          });
        }
        await getPortfolios();
        await getProfile();
        setEditingPortfolio(null);
      }}
    />
    <SkillsModal
      isOpen={isModalOpen6}
      skills={editingSkills}
      onClose={() => {
        setEditingSkills(null);
        setIsModalOpen6(false);
      }}
      onSave={async (data) => {
        if (Array.isArray(data.skills)) {
          await addSkills(data.skills);
        }
        await getSkills();
        await getProfile();
        setEditingSkills(null);
      }}
    />
    </DashboardLayout>
  );
}
