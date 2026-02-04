"use client";
import { useState, useEffect } from "react";
import {useParams } from "next/navigation";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
import { useTopStudentsHandler } from "@/src/hooks/studentapihandler/useTopStudentsHandler";

export default function ApplicantPage() {
  const params = useParams();
  const { applicantId } = params;
  const { student: applicant, loading, error, getTopStudentById } = useTopStudentsHandler();

  useEffect(() => {
    if (applicantId && typeof applicantId === 'string') {
      getTopStudentById(applicantId);
    }
  }, [applicantId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !applicant) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-white shadow-md rounded-lg p-8 sm:p-12 text-center max-w-md w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4 flex items-center justify-center gap-2">
              ❌ Student Not Found
            </h2>
            <p className="text-[#555] text-base sm:text-lg">
              {error || `No student with ID: ${applicantId} was found.`}
            </p>
            <p className="text-[#777] mt-2 text-sm">
              Please check the ID or go back to the <a href="/Student/top-student" className="text-blue-500 hover:underline">top-student</a>.
            </p>
          </div>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
                <h1 className="font-barlow font-extrabold text-[40px] leading-[64px] text-[#1E1E1E]">
                  {applicant?.name || applicantId}
                </h1>

                <div
                  className="relative w-[120px] h-[35px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105"
                >
                  <span className="skew-x-[12deg] font-bold text-[14px] text-[#1E1E1E]">
                    {applicant?.status ? applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1) : 'Active'}
                  </span>
                </div>

              </div>

              {/* Description */}
              <p className="font-publicSans text-[16px] leading-[24px] text-[#1E1E1E] break-words">
                {applicant?.description
                  ? applicant.description.length > 250
                    ? applicant.description.slice(0, 250) + "..."
                    : applicant.description
                  : "No description available."}
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
                    ${applicant?.profileRanking ? "text-[200px]" : "text-[100px] leading-[175px] text-center justify-center items-center"}
                  `}
                >
                  {applicant?.profileRanking ?? "N/A"}
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
                    {applicant?.profileComplete || 0}%
                  </span>
                </div>

                {/* Progress Bar Container */}
                <div className="relative w-[200px] sm:w-[260px] h-[16px] bg-[#1E1E1E] transform -skew-x-[20deg]  rounded-[4px]">
                  {/* Progress Fill */}
                  <div
                    className="absolute left-0.5 top-1/2 h-[14px] -translate-y-1/2 rounded bg-[#FFEB9C]"
                    style={{ width: `${applicant?.profileComplete || 0}%` }}
                  />

                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-[62px] h-[152px] mx-auto">
              {/* First pair */}
              <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
                <img 
                  src="/cards/tag.svg" 
                  alt="Tag Icon"
                />
                  {/* Frame 97 - Label container */}
                <div className="flex flex-col justify-center items-start w-[77px] h-[40px] flex-none gap-1">
                  {/* body2 text */}
                  <span className="w-[77px] h-[22px] text-[14px] font-normal leading-[22px] text-[#1E1E1E] flex items-center">
                    ${applicant?.salaryExpectation || 'N/A'}
                  </span>
                  {/* caption text */}
                  <span className="w-[49px] h-[18px] text-[12px] font-normal leading-[18px] text-[#00000090] flex items-center">
                    Salary
                  </span>
                </div>
              </div>

              {/* Second pair */}
              <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
                <img 
                  src="/cards/tag.svg" 
                  alt="Tag Icon"
                />
                  {/* Frame 97 - Label container */}
                <div className="flex flex-col justify-center items-start w-[77px] h-[40px] flex-none gap-1">
                  {/* body2 text */}
                  <span className="w-[77px] h-[22px] text-[14px] font-normal leading-[22px] text-[#1E1E1E] flex items-center">
                    {applicant?.availability}
                  </span>
                  {/* caption text */}
                  <span className="w-[49px] h-[18px] text-[12px] font-normal leading-[18px] text-[#00000090] flex items-center">
                    Availability
                  </span>
                </div>
              </div>
              {/* Third pair */}
              <div className="flex flex-row items-center gap-1.5 w-[115px] h-[40px]">
                <img 
                  src="/cards/tag.svg" 
                  alt="Tag Icon"
                />
                  {/* Frame 97 - Label container */}
                <div className="flex flex-col justify-center items-start w-[77px] h-[40px] flex-none gap-1">
                  {/* body2 text */}
                  <span className="w-[77px] h-[22px] text-[14px] font-normal leading-[22px] text-[#1E1E1E] flex items-center">
                    Riyadh
                  </span>
                  {/* caption text */}
                  <span className="w-[49px] h-[18px] text-[12px] font-normal leading-[18px] text-[#00000090] flex items-center">
                    City
                  </span>
                </div>
              </div>
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
            {applicant?.skills?.length ? (
              <div className="flex flex-wrap gap-3">
                {applicant.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-[14px] font-publicSans text-[#1E1E1E] transform -skew-x-12 rounded-[8px] border border-black/80 whitespace-nowrap transform-none"
                  >
                    {skill}
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
                {applicant?.skills?.length ? (
                  <div className="flex flex-wrap gap-3">
                    {applicant.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 text-[14px] font-publicSans text-[#1E1E1E] transform -skew-x-12 rounded-[8px] border border-black/80 whitespace-nowrap transform-none"
                      >
                        {skill}
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
              {applicant?.experiences?.length ? (
                applicant.experiences.map((exp: any) => (
                    <div key={exp.id} className="px-4 py-2 w-full">
                      <div className="flex items-center justify-between">
                        {/* Left side: SVG + Role */}
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C"/>
                          </svg>
                          <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E] transform-none">
                            {exp?.role || 'N/A'}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-[#555] transform-none">
                        <span className="font-publicSans">{exp?.companyName || 'N/A'}</span>
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
                        <span className="font-publicSans transform-none">{`${exp?.startDate || ''} - ${exp?.endDate || ''}`}</span>
                      </div>
                      <p className="font-publicSans text-[12px] text-[#1E1E1E] mt-1 break-words transform-none">
                        {exp?.description ? (
                          <>
                            {exp.description.split(" ").slice(0, 10).join(" ")}
                            {exp.description.split(" ").length > 10 ? "..." : ""}
                          </>
                        ) : 'No description'}
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
          <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]  ">
                  Education
                </h3>
            </div>
            <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
              <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
              {applicant?.educations?.length ? (
                applicant.educations.map((edu: any) => (
                    <div key={edu.id} className="px-4 py-2 w-full">
                      <div className="flex items-center justify-between">
                        {/* Left side: SVG + Major */}
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C"/>
                          </svg>
                          <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E] transform-none">
                            {edu?.major || 'N/A'}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-[#555] transform-none">
                        <span className="font-publicSans">{edu?.name || 'N/A'}</span>
                        
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

                        <span className="font-publicSans">{`${edu?.startDate || ''} - ${edu?.endDate || ''}`}</span>
                      </div>
                      <p className="font-publicSans text-[12px] text-[#1E1E1E] mt-1">
                        {edu?.description ? (
                          <>
                            {edu.description.split(" ").slice(0, 10).join(" ")}
                            {edu.description.split(" ").length > 10 ? "..." : ""}
                          </>
                        ) : 'No description'}
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

          {/* Language Card */}
          <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
              Languages
              </h3>
            </div>
            <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 max-h-[250px]`}>
              <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
              {applicant?.languages?.length ? (
                applicant.languages.map((lang: any) => (
                    <div key={lang.id} className="px-4 py-2 w-full">
                      <div className="flex items-center justify-between">
                        {/* Left side: SVG + Language name */}
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C"/>
                          </svg>
                          <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E] transform-none">
                            {lang?.name || 'N/A'}
                          </h4>
                        </div>
                      </div>

                      {/* Level text (optional) */}
                      <p className="font-publicSans text-[12px] text-[#555] mt-1 transform-none">
                        {lang?.level || 'N/A'}
                      </p>
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
                {applicant?.portfolios?.length ? (
                  applicant.portfolios.map((port: any) => (
                      <div key={port.id} className="px-4 py-2 w-full">
                        <div className="flex items-center justify-between">
                          {/* Left side: SVG + Portfolio Name */}
                          <div className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="7.89111" width="11.16" height="11.16" transform="rotate(45 7.89111 0)" fill="#FFEB9C"/>
                            </svg>
                            <h4 className="font-publicSans font-semibold text-[14px] text-[#1E1E1E]">
                              {port?.name || 'N/A'}
                            </h4>
                          </div>
                        </div>

                        {/* Portfolio link */}
                        <div className="w-full flex items-center gap-2 mt-1">
                          {/* Conditional SVG icon */}
                          {port?.name?.toLowerCase() === "github" ? (
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="40" height="40" rx="8" fill="#FFEB9C"/>
                              <path d="M12.5 15.5C12.8978 15.5 13.2794 15.658 13.5607 15.9393C13.842 16.2206 14 16.6022 14 17V27.5C14 27.8978 13.842 28.2794 13.5607 28.5607C13.2794 28.842 12.8978 29 12.5 29H9.5C8.673 29 8 28.328 8 27.5V17C8 16.172 8.673 15.5 9.5 15.5H12.5ZM21.5 11C21.8978 11 22.2794 11.158 22.5607 11.4393C22.842 11.7206 23 12.1022 23 12.5V27.5C23 27.8978 22.842 28.2794 22.5607 28.5607C22.2794 28.842 21.8978 29 21.5 29H18.5C17.673 29 17 28.328 17 27.5V12.5C17 11.672 17.673 11 18.5 11H21.5ZM30.5 18.5C30.8978 18.5 31.2794 18.658 31.5607 18.9393C31.842 19.2206 32 19.6022 32 20V27.5C32 27.8978 31.842 28.2794 31.5607 28.5607C31.2794 28.842 30.8978 29 30.5 29H27.5C27.1022 29 26.7206 28.842 26.4393 28.5607C26.158 28.2794 26 27.8978 26 27.5V20C26 19.6022 26.158 19.2206 26.4393 18.9393C26.7206 18.658 27.1022 18.5 27.5 18.5H30.5Z" fill="black"/>
                            </svg>
                          )}

                          {/* Link text */}
                          <p className="font-publicSans text-[12px] text-[#555] break-words transform-none">
                            {port?.link ? (
                              <>
                                {port.link.split(" ").slice(0, 10).join(" ")}
                                {port.link.split(" ").length > 10 ? "..." : ""}
                              </>
                            ) : 'No link'}
                          </p>
                        </div>
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
    </div>
    </DashboardLayout>
  );
}
