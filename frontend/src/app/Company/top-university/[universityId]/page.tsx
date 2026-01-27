"use client";

import DashboardLayout from "@/src/components/Company/DashboardLayout";
import React from "react";
import { mockUniversities } from "@/src/mocks/mockUniversities";
import { useSidebar } from "@/src/lib/sidebarContext";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function TopUniversityPage() {
    const { isCollapsed } = useSidebar(); // ✅ get collapse state
    const params = useParams(); 
    const {universityId } = params;
    const university = mockUniversities.find(a => a.id === universityId);
  

   
  return (
    <DashboardLayout>
                 <div
        className={`relative w-full min-h-[1000px] p-4 overflow-hidden transform md:scale-[0.96] md:origin-top
          ${isCollapsed ? "ml-[50px]" : "ml-[10px]"}
        `}
         style={{
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="hidden md:block">
                <svg width="1252" height="539" viewBox="0 0 1252 539" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1252 506.874C1252 524.547 1237.67 538.874 1220 538.874H889.723C872.05 538.874 857.723 524.547 857.723 506.874V442.722C857.723 425.049 843.396 410.722 825.723 410.722H427.138C409.465 410.722 395.138 425.049 395.138 442.722V506.874C395.138 524.547 380.811 538.874 363.138 538.874L32.0001 538.875C14.3269 538.875 0 524.548 0 506.875V325.001C0 307.328 14.3269 293.001 32 293.001H257C274.673 293.001 289 278.674 289 261.001V32C289 14.3269 303.327 0 321 0H1220C1237.67 0 1252 14.3269 1252 32V506.874Z" fill="#FFEB9C"/>
                </svg>


                {/* =======================
                    ROTATED CARD WITH IMAGE
                ======================= */}
                <div
                className="absolute   overflow-hidden"
                style={{
                    top: "15px",
                    left: "20px",
                    width: "275px",
                    height: "277px",
                    borderRadius: "24px",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                    zIndex: 2,
                }}
                >
                {/* IMAGE */}
                <div
                    className="absolute overflow-hidden"
                    style={{
                    top: "20px", // adjust inside the rotated card
                    left: "20px",
                    width: "85%",
                    height: "85%",
                    borderRadius: "20px",
                    backgroundColor: "#E0E0E0",
                    zIndex: 3,
            
                    }}
                >
                    {university?.image ? (
                    <img
                        src={university.image}
                        alt={university.name}
                        style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        }}
                    />
                    ) : (
                    <div
                        style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        color: "#888",
                        }}
                    >
                        No Image
                    </div>
                    )}
                </div>
                </div>

                {/* =======================
                   Corporate  CARD
                ======================= */}
                <div
                className="absolute left-[360px] top-[55px] w-[880px] h-[263px] flex flex-col items-start gap-4"
                >
                <h4 className="font-publicSans font-bold text-[24px] leading-[36px] text-black m-0">
                    Corporate
                </h4>
                <p className="font-publicSans font-normal text-[16px] leading-[24px] text-black m-0">
                  {university?.corporate}
                </p>
                </div>
                
               


                {/* =======================
                   Address  CARD
                ======================= */}
                <div
                className="absolute"
                style={{
                    width: "245.83px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    padding: "0",
                    gap: "10px",
                    left: "70px",
                        top: "355px",
                }}
                >
                    {/* Address Title */}
                    <h6 className="font-semibold text-[20px] leading-[28px] text-black">
                    Address
                    </h6>

                    {/* Frame 338 */}
                    <div className="flex flex-col items-start  gap-[5px]"
                        >
                        {/* Frame 336 - Location */}
                        <div className="flex items-center  gap-[10px]">
                            {/* Location Icon */}
                            <div className="relative w-[24px] h-[24px]">
                            {/* replace with your actual icon */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C14.3869 2 16.6761 2.94821 18.364 4.63604C20.0518 6.32387 21 8.61305 21 11C21 14.074 19.324 16.59 17.558 18.395C16.6755 19.2869 15.7128 20.0956 14.682 20.811L14.256 21.101L14.056 21.234L13.679 21.474L13.343 21.679L12.927 21.921C12.6445 22.0818 12.325 22.1663 12 22.1663C11.675 22.1663 11.3555 22.0818 11.073 21.921L10.657 21.679L10.137 21.359L9.945 21.234L9.535 20.961C8.42298 20.2083 7.38707 19.3489 6.442 18.395C4.676 16.588 3 14.074 3 11C3 8.61305 3.94821 6.32387 5.63604 4.63604C7.32387 2.94821 9.61305 2 12 2ZM12 8C11.606 8 11.2159 8.0776 10.8519 8.22836C10.488 8.37913 10.1573 8.6001 9.87868 8.87868C9.6001 9.15726 9.37913 9.48797 9.22836 9.85195C9.0776 10.2159 9 10.606 9 11C9 11.394 9.0776 11.7841 9.22836 12.1481C9.37913 12.512 9.6001 12.8427 9.87868 13.1213C10.1573 13.3999 10.488 13.6209 10.8519 13.7716C11.2159 13.9224 11.606 14 12 14C12.7956 14 13.5587 13.6839 14.1213 13.1213C14.6839 12.5587 15 11.7956 15 11C15 10.2044 14.6839 9.44129 14.1213 8.87868C13.5587 8.31607 12.7956 8 12 8Z" fill="#1E1E1E"/>
                            </svg>
                            </div>
                            {/* Address Label */}
                            <span className="text-[14px] leading-[22px] text-[#1E1E1E]">
                            {university?.address}
                            </span>
                        </div>

                        {/* Frame 337 - Phone */}
                        <div className="flex items-center gap-[10px]">
                            {/* Phone Icon */}
                            <div className="relative w-[32px] h-[32px]">
                            {/* replace with your actual icon */}
                            <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.7425 14.5413L16.1358 15.1453C16.1358 15.1453 14.6918 16.58 10.7518 12.6626C6.81181 8.74531 8.25581 7.31064 8.25581 7.31064L8.63714 6.92931C9.57981 5.99331 9.66914 4.48931 8.84647 3.39064L7.16647 1.14664C6.14781 -0.213361 4.18114 -0.393361 3.01448 0.766639L0.921142 2.84664C0.343808 3.42264 -0.0428587 4.16664 0.003808 4.99331C0.123808 7.10931 1.08114 11.66 6.41981 16.9693C12.0825 22.5986 17.3958 22.8226 19.5678 22.62C20.2558 22.556 20.8531 22.2066 21.3345 21.7266L23.2278 19.844C24.5078 18.5733 24.1478 16.3933 22.5105 15.504L19.9638 14.1186C18.8891 13.5346 17.5825 13.7066 16.7425 14.5413Z" fill="#1E1E1E"/>
                            </svg>
                            </div>
                            {/* Phone Label */}
                            <span className="text-[14px] leading-[22px] text-[#1E1E1E]">
                            {university?.phoneNumber}
                            </span>
                        </div>

                         {/* Frame 337 - email */}
                        <div className="flex items-center gap-[10px]">
                            {/* Phone Icon */}
                            <div className="relative w-[32px] h-[32px]">
                            {/* replace with your actual icon */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.71993 11.599L8.15878 12.7988C9.99459 14.3286 10.9135 15.0935 11.9984 15.0935C13.0853 15.0935 14.0032 14.3286 15.84 12.7978L17.2798 11.598C17.6328 11.304 17.8098 11.156 17.9038 10.955C17.9988 10.7531 17.9988 10.5231 17.9988 10.0622V7.9994C17.9988 7.67944 17.9981 7.38014 17.9968 7.10151C17.9848 5.33072 17.8988 4.36484 17.2668 3.73191C16.5339 3 15.356 3 12.9993 3H10.9995C8.64273 3 7.46385 3 6.73192 3.73191C6.09899 4.36484 6.012 5.33072 6 7.10151V10.0622C6 10.5221 6 10.7531 6.09399 10.955C6.18898 11.156 6.36696 11.304 6.71993 11.599ZM9.24967 6.99952C9.24967 6.80063 9.32868 6.60989 9.46931 6.46925C9.60995 6.32862 9.8007 6.24961 9.99959 6.24961H13.9992C14.1981 6.24961 14.3888 6.32862 14.5295 6.46925C14.6701 6.60989 14.7491 6.80063 14.7491 6.99952C14.7491 7.19841 14.6701 7.38915 14.5295 7.52979C14.3888 7.67042 14.1981 7.74943 13.9992 7.74943H9.99959C9.8007 7.74943 9.60995 7.67042 9.46931 7.52979C9.32868 7.38915 9.24967 7.19841 9.24967 6.99952ZM10.2496 9.99916C10.2496 9.80027 10.3286 9.60953 10.4692 9.46889C10.6098 9.32826 10.8006 9.24925 10.9995 9.24925H12.9993C13.1982 9.24925 13.3889 9.32826 13.5296 9.46889C13.6702 9.60953 13.7492 9.80027 13.7492 9.99916C13.7492 10.198 13.6702 10.3888 13.5296 10.5294C13.3889 10.6701 13.1982 10.7491 12.9993 10.7491H10.9995C10.8006 10.7491 10.6098 10.6701 10.4692 10.5294C10.3286 10.3888 10.2496 10.198 10.2496 9.99916Z" fill="#1E1E1E"/>
                            <path opacity="0.5" d="M8.15837 12.7989L6.71852 11.599C6.36555 11.3041 6.18857 11.1571 6.09358 10.9551C5.99859 10.7531 5.99959 10.5232 5.99959 10.0632V7.10156C4.69972 7.22955 3.82481 7.51851 3.17188 8.17143C2 9.34229 2 11.2291 2 15.0006C2 18.7702 2 20.6559 3.17188 21.8268C4.34376 22.9977 6.22857 22.9997 9.99918 22.9997H13.9988C17.7694 22.9997 19.6552 22.9997 20.8261 21.8278C21.9969 20.6559 21.9979 18.7712 21.9979 15.0006C21.9979 11.2301 21.9979 9.34329 20.8261 8.17143C20.1731 7.51851 19.2972 7.22955 17.9964 7.10156C17.9977 7.38153 17.9984 7.68149 17.9984 8.00145V10.0642C17.9984 10.5242 17.9984 10.7541 17.9034 10.9561C17.8094 11.1581 17.6334 11.3061 17.2784 11.6L15.8386 12.7999C14.0028 14.3297 13.0849 15.0946 11.999 15.0946C10.9131 15.0946 9.99418 14.3287 8.15837 12.7989Z" fill="#1E1E1E"/>
                            </svg>

                            </div>
                            {/* Phone Label */}
                            <span className="text-[14px] leading-[22px] text-[#1E1E1E]">
                            {university?.email}
                            </span>
                        </div>

                    </div>
                </div>

                {/* =======================
                       Programs
                ======================= */}
                    <div
                    style={{
                        position: "absolute",
                        width: "395.14px",
                        height: "390.06px",
                        left: "25px",
                        top: "590px",
                        background: "#FFFFFF",
                        borderRadius: "20px",
                        boxShadow:
                        "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                        padding: "24px", // adds inner spacing
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                    >
                    {/* Programs Section */}
                    <div
                        style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "16px",
                        width: "208px",
                        height: "350px",
                        }}
                    >
                        {/* Programs Label */}
                        <div
                        style={{
                            width: "208px",
                            height: "28px",
                            fontFamily: "'Public Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: "18px",
                            lineHeight: "28px",
                            color: "#000000",
                        }}
                        >
                        Programs
                        </div>

                        {/* Programs Buttons */}
                        <div
                        style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                        gap: "16px",
                        width: "350px",
                        overflowY: "auto",     // ✅ enable vertical scroll
                        overflowX: "hidden",  // ✅ prevent horizontal scroll
                        paddingRight: "4px",  // optional: space for scrollbar
                        }}
                        >
                        {university?.programs?.map((program, index) => (
                            <div
                            key={index}
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "6px 12px",
                                gap: "8px",
                                border: "1px solid #1E1E1E",
                                borderRadius: "8px",
                                fontFamily: "'Public Sans', sans-serif",
                                fontWeight: 700,
                                fontSize: "14px",
                                lineHeight: "24px",
                                color: "#1E1E1E",
                            }}
                            >
                            {program}
                            </div>
                        ))}
                        </div>
                    </div>
                  
                </div>

                {/* =======================
                    Rankings Card
                ======================= */}
                <div
                style={{
                    position: "absolute",
                    width: "398px",
                    height: "511.33px",
                    left: "450px",
                    top: "470px",
                    background: "#FFFFFF",
                    borderRadius: "20px",
                    boxShadow:
                    "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                    padding: "24px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "29px", // spacing between ranking blocks
                    alignItems: "center",
                    overflowY: "auto", // scroll if content exceeds height
                }}
                >
                {/* Ranking Block 1 */}
                <div
                    style={{
                    width: "350px",
                    height: "130px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    }}
                >
                    <div
                    style={{
                        width: "350px",
                        height: "100px",
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 800,
                        fontSize: "100px",
                        lineHeight: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "#1E1E1E",
                    }}
                    >
                    #{String(university?.qsWorldRanking ?? 0).padStart(2, "0")}
                    </div>
                    <div
                    style={{
                        width: "350px",
                        height: "30px",
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "#1E1E1E",
                    }}
                    >
                    QS World University Rankings
                    </div>
                </div>

                {/* Ranking Block 2 */}
                <div
                    style={{
                    width: "350px",
                    height: "130px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    }}
                >
                    <div
                    style={{
                        width: "350px",
                        height: "100px",
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 800,
                        fontSize: "100px",
                        lineHeight: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "#1E1E1E",
                    }}
                    >
                    #{String(university?.qsRankingBySubject ?? 0).padStart(2, "0")}
                    </div>
                    <div
                    style={{
                        width: "350px",
                        height: "30px",
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "#1E1E1E",
                    }}
                    >
                    QS WUR Ranking By Subject
                    </div>
                </div>

                {/* Ranking Block 3 */}
                <div
                    style={{
                    width: "350px",
                    height: "130px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    }}
                >
                    <div
                    style={{
                        width: "350px",
                        height: "100px",
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 800,
                        fontSize: "100px",
                        lineHeight: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "#1E1E1E",
                    }}
                    >
                    #{String(university?.qsSustainabilityRanking ?? 0).padStart(2, "0")}
                    </div>
                    <div
                    style={{
                        width: "350px",
                        height: "30px",
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "#1E1E1E",
                    }}
                    >
                    QS Sustainability Ranking
                    </div>
                </div>
                </div>


                {/* =======================
                    Total Students Card
                ======================= */}
                <div
                style={{
                    position: "absolute",
                    width: "395.14px",
                    height: "387.06px",
                    left: "885px",
                    top: "595px",
                    background: "#FFFFFF",
                    borderRadius: "20px",
                    boxShadow:
                    "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                    padding: "24px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                }}
                >
                {/* -----------------------
                    Total Students Header
                ----------------------- */}
                <div
                    style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    }}
                >
                    <div
                    style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "18px",
                        lineHeight: "28px",
                        color: "#1E1E1E",
                    }}
                    >
                    Total Students
                    </div>
                    <div
                    style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "18px",
                        lineHeight: "28px",
                        color: "#1E1E1E",
                    }}
                    >
                    {university?.totalStudents.toLocaleString() ?? 0} {/* show total students */}
                    </div>
                </div>

                {/* -----------------------
                    Progress Bar (Total Students)
                ----------------------- */}
                <div
                    style={{
                    position: "relative",
                    width: "350px",
                    height: "16px",
                    background: "#1E1E1E",
                    transform: "skewX(-20deg)",
                    borderRadius: "4px",
                    }}
                >
                    <div
                    style={{
                        position: "absolute",
                        left: "0.5px",
                        top: "50%",
                        height: "14px",
                        transform: "translateY(-50%)",
                        borderRadius: "4px",
                        background: "#FFEB9C",
                        // dynamically calculate width based on totalStudents (max 38,000)
                        width: `${Math.min(((university?.totalStudents ?? 0) / 38000) * 100, 100)}%`,
                    }}
                    />
                </div>

                {/* -----------------------
                    UG / PG Students Breakdown
                ----------------------- */}
                <div
                    style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "25px", // spacing between UG and PG blocks
                    width: "347px",
                    height: "18px",
                    }}
                >
                    {/* UG Students */}
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "161px",
                        gap: "10px",
                    }}
                    >
                    <div
                        style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "18px",
                        color: "#1E1E1E",
                        }}
                    >
                        UG Students
                    </div>
                    <div
                        style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "18px",
                        textAlign: "right",
                        color: "#1E1E1E",
                        }}
                    >
                        {university?.ugStudents.toLocaleString() ?? 0} {/* show UG number */}
                    </div>
                    <div
                        style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "18px",
                        textAlign: "right",
                        color: "#1E1E1E",
                        }}
                    >
                        {Math.round(
                        ((university?.ugStudents ?? 0) / (university?.totalStudents ?? 1)) * 100
                        )}
                        % {/* calculate UG percentage */}
                    </div>
                    </div>

                    {/* PG Students */}
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "161px",
                        gap: "10px",
                    }}
                    >
                    <div
                        style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "18px",
                        color: "#1E1E1E",
                        }}
                    >
                        PG Students
                    </div>
                    <div
                        style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "18px",
                        textAlign: "right",
                        color: "#1E1E1E",
                        }}
                    >
                        {university?.pgStudents.toLocaleString() ?? 0} {/* show PG number */}
                    </div>
                    <div
                        style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "18px",
                        textAlign: "right",
                        color: "#1E1E1E",
                        }}
                    >
                        {Math.round(
                        ((university?.pgStudents ?? 0) / (university?.totalStudents ?? 1)) * 100
                        )}
                        % {/* calculate PG percentage */}
                    </div>
                    </div>
                </div>
                 {/* -----------------------
                    Total Doctors Header
                ----------------------- */}
                <div
                    style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    }}
                >
                    <div
                    style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "18px",
                        lineHeight: "28px",
                        color: "#1E1E1E",
                    }}
                    >
                    Total Doctors
                    </div>
                    <div
                    style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "18px",
                        lineHeight: "28px",
                        color: "#1E1E1E",
                    }}
                    >
                    {university?.totalDoctors.toLocaleString() ?? 0} {/* show total students */}
                    </div>
                </div>

                {/* -----------------------
                    Progress Bar (Total Students)
                ----------------------- */}
                <div
                    style={{
                    position: "relative",
                    width: "350px",
                    height: "16px",
                    background: "#1E1E1E",
                    transform: "skewX(-20deg)",
                    borderRadius: "4px",
                    }}
                >
                    <div
                    style={{
                        position: "absolute",
                        left: "0.5px",
                        top: "50%",
                        height: "14px",
                        transform: "translateY(-50%)",
                        borderRadius: "4px",
                        background: "#FFEB9C",
                        // dynamically calculate width based on totalStudents (max 2500)
                        width: `${Math.min(((university?.totalDoctors ?? 0) / 2500) * 100, 100)}%`,
                    }}
                    />
                </div>

                 {/* -----------------------
                    Total Staff Header
                ----------------------- */}
                <div
                    style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    }}
                >
                    <div
                    style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "18px",
                        lineHeight: "28px",
                        color: "#1E1E1E",
                    }}
                    >
                    Total Staff
                    </div>
                    <div
                    style={{
                        fontFamily: "'Public Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "18px",
                        lineHeight: "28px",
                        color: "#1E1E1E",
                    }}
                    >
                    {university?.staff.toLocaleString() ?? 0} {/* show total students */}
                    </div>
                </div>

                {/* -----------------------
                    Progress Bar (Total Students)
                ----------------------- */}
                <div
                    style={{
                    position: "relative",
                    width: "350px",
                    height: "16px",
                    background: "#1E1E1E",
                    transform: "skewX(-20deg)",
                    borderRadius: "4px",
                    }}
                >
                    <div
                    style={{
                        position: "absolute",
                        left: "0.5px",
                        top: "50%",
                        height: "14px",
                        transform: "translateY(-50%)",
                        borderRadius: "4px",
                        background: "#FFEB9C",
                        // dynamically calculate width based on totalStudents (max 2500)
                        width: `${Math.min(((university?.staff ?? 0) / 2500) * 100, 100)}%`,
                    }}
                    />
                </div>
                </div>
                </div>

                <div className="block md:hidden p-4 space-y-4">
                    {/* =======================
                        MOBILE LAYOUT
                        Stacked cards, scrollable sections
                    ======================= */}
                    {/* IMAGE */}
                        <div className="bg-[#FFFF] rounded-lg p-2 shadow-md space-y-2 w-[250] h-[250] mx-auto"
                        style={{
                        boxShadow:
                        "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                        borderRadius: "24px",
                        display: "flex",
                        flexDirection: "column",
                        padding: "10px",
                        boxSizing: "border-box",
                        }}
                        >
                        {university?.image ? (
                        <img
                            src={university.image}
                            alt={university.name}
                            className="w-full h-full object-cover rounded-[20px]" // rounded image
                            style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            }}
                        />
                        ) : (
                        <div
                            style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            color: "#888",
                            }}
                        >
                            No Image
                        </div>
                        )}
                    </div>

                    {/* University Info */}
                    <div className="bg-[#FFEB9C] rounded-lg p-2 shadow-md space-y-2"
                     style={{
                    boxShadow:
                    "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                    borderRadius: "24px",
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px",
                    boxSizing: "border-box",
                    }}
                    >
                  
                    
                        {/* Title */}
                        <h4
                            style={{
                            fontFamily: "'Public Sans', sans-serif",
                            fontStyle: "normal",
                            fontWeight: 700,
                            fontSize: "24px",
                            lineHeight: "36px", // 150%
                            color: "#000000",
                            margin: 0, // remove default margin
                            }}
                        >
                            Corporate
                        </h4>

                        


                        <h4 className="font-normal text-base leading-6 text-black">{university?.corporate}</h4>
                         
                        
                        {/* Location */}
                        <div
                        style={{
                            width: "245.83px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            padding: "0",
                            gap: "10px",
                        }}
                        >
                            {/* Address Title */}
                            <h6 className="font-semibold text-[20px] leading-[28px] text-black">
                            Address
                            </h6>

                            {/* Frame 338 */}
                            <div className="flex flex-col items-start  gap-[10px]"
                                >
                                {/* Frame 336 - Location */}
                                <div className="flex items-center  gap-[14px]">
                                    {/* Location Icon */}
                                    <div className="relative w-[24px] h-[24px]">
                                    {/* replace with your actual icon */}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C14.3869 2 16.6761 2.94821 18.364 4.63604C20.0518 6.32387 21 8.61305 21 11C21 14.074 19.324 16.59 17.558 18.395C16.6755 19.2869 15.7128 20.0956 14.682 20.811L14.256 21.101L14.056 21.234L13.679 21.474L13.343 21.679L12.927 21.921C12.6445 22.0818 12.325 22.1663 12 22.1663C11.675 22.1663 11.3555 22.0818 11.073 21.921L10.657 21.679L10.137 21.359L9.945 21.234L9.535 20.961C8.42298 20.2083 7.38707 19.3489 6.442 18.395C4.676 16.588 3 14.074 3 11C3 8.61305 3.94821 6.32387 5.63604 4.63604C7.32387 2.94821 9.61305 2 12 2ZM12 8C11.606 8 11.2159 8.0776 10.8519 8.22836C10.488 8.37913 10.1573 8.6001 9.87868 8.87868C9.6001 9.15726 9.37913 9.48797 9.22836 9.85195C9.0776 10.2159 9 10.606 9 11C9 11.394 9.0776 11.7841 9.22836 12.1481C9.37913 12.512 9.6001 12.8427 9.87868 13.1213C10.1573 13.3999 10.488 13.6209 10.8519 13.7716C11.2159 13.9224 11.606 14 12 14C12.7956 14 13.5587 13.6839 14.1213 13.1213C14.6839 12.5587 15 11.7956 15 11C15 10.2044 14.6839 9.44129 14.1213 8.87868C13.5587 8.31607 12.7956 8 12 8Z" fill="#1E1E1E"/>
                                    </svg>
                                    </div>
                                    {/* Address Label */}
                                    <span className="text-[14px] leading-[22px] text-[#1E1E1E]">
                                    {university?.address}
                                    </span>
                                </div>

                                {/* Frame 337 - Phone */}
                                <div className="flex items-center gap-[14px]">
                                    {/* Phone Icon */}
                                    <div className="relative w-[32px] h-[32px]">
                                    {/* replace with your actual icon */}
                                    <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.7425 14.5413L16.1358 15.1453C16.1358 15.1453 14.6918 16.58 10.7518 12.6626C6.81181 8.74531 8.25581 7.31064 8.25581 7.31064L8.63714 6.92931C9.57981 5.99331 9.66914 4.48931 8.84647 3.39064L7.16647 1.14664C6.14781 -0.213361 4.18114 -0.393361 3.01448 0.766639L0.921142 2.84664C0.343808 3.42264 -0.0428587 4.16664 0.003808 4.99331C0.123808 7.10931 1.08114 11.66 6.41981 16.9693C12.0825 22.5986 17.3958 22.8226 19.5678 22.62C20.2558 22.556 20.8531 22.2066 21.3345 21.7266L23.2278 19.844C24.5078 18.5733 24.1478 16.3933 22.5105 15.504L19.9638 14.1186C18.8891 13.5346 17.5825 13.7066 16.7425 14.5413Z" fill="#1E1E1E"/>
                                    </svg>
                                    </div>
                                    {/* Phone Label */}
                                    <span className="text-[14px] leading-[22px] text-[#1E1E1E]">
                                    {university?.phoneNumber}
                                    </span>
                                </div>
                                {/* Frame 337 - email */}
                                <div className="flex items-center gap-[10px]">
                                    {/* Phone Icon */}
                                    <div className="relative w-[32px] h-[32px]">
                                    {/* replace with your actual icon */}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.71993 11.599L8.15878 12.7988C9.99459 14.3286 10.9135 15.0935 11.9984 15.0935C13.0853 15.0935 14.0032 14.3286 15.84 12.7978L17.2798 11.598C17.6328 11.304 17.8098 11.156 17.9038 10.955C17.9988 10.7531 17.9988 10.5231 17.9988 10.0622V7.9994C17.9988 7.67944 17.9981 7.38014 17.9968 7.10151C17.9848 5.33072 17.8988 4.36484 17.2668 3.73191C16.5339 3 15.356 3 12.9993 3H10.9995C8.64273 3 7.46385 3 6.73192 3.73191C6.09899 4.36484 6.012 5.33072 6 7.10151V10.0622C6 10.5221 6 10.7531 6.09399 10.955C6.18898 11.156 6.36696 11.304 6.71993 11.599ZM9.24967 6.99952C9.24967 6.80063 9.32868 6.60989 9.46931 6.46925C9.60995 6.32862 9.8007 6.24961 9.99959 6.24961H13.9992C14.1981 6.24961 14.3888 6.32862 14.5295 6.46925C14.6701 6.60989 14.7491 6.80063 14.7491 6.99952C14.7491 7.19841 14.6701 7.38915 14.5295 7.52979C14.3888 7.67042 14.1981 7.74943 13.9992 7.74943H9.99959C9.8007 7.74943 9.60995 7.67042 9.46931 7.52979C9.32868 7.38915 9.24967 7.19841 9.24967 6.99952ZM10.2496 9.99916C10.2496 9.80027 10.3286 9.60953 10.4692 9.46889C10.6098 9.32826 10.8006 9.24925 10.9995 9.24925H12.9993C13.1982 9.24925 13.3889 9.32826 13.5296 9.46889C13.6702 9.60953 13.7492 9.80027 13.7492 9.99916C13.7492 10.198 13.6702 10.3888 13.5296 10.5294C13.3889 10.6701 13.1982 10.7491 12.9993 10.7491H10.9995C10.8006 10.7491 10.6098 10.6701 10.4692 10.5294C10.3286 10.3888 10.2496 10.198 10.2496 9.99916Z" fill="#1E1E1E"/>
                                    <path opacity="0.5" d="M8.15837 12.7989L6.71852 11.599C6.36555 11.3041 6.18857 11.1571 6.09358 10.9551C5.99859 10.7531 5.99959 10.5232 5.99959 10.0632V7.10156C4.69972 7.22955 3.82481 7.51851 3.17188 8.17143C2 9.34229 2 11.2291 2 15.0006C2 18.7702 2 20.6559 3.17188 21.8268C4.34376 22.9977 6.22857 22.9997 9.99918 22.9997H13.9988C17.7694 22.9997 19.6552 22.9997 20.8261 21.8278C21.9969 20.6559 21.9979 18.7712 21.9979 15.0006C21.9979 11.2301 21.9979 9.34329 20.8261 8.17143C20.1731 7.51851 19.2972 7.22955 17.9964 7.10156C17.9977 7.38153 17.9984 7.68149 17.9984 8.00145V10.0642C17.9984 10.5242 17.9984 10.7541 17.9034 10.9561C17.8094 11.1581 17.6334 11.3061 17.2784 11.6L15.8386 12.7999C14.0028 14.3297 13.0849 15.0946 11.999 15.0946C10.9131 15.0946 9.99418 14.3287 8.15837 12.7989Z" fill="#1E1E1E"/>
                                    </svg>

                                    </div>
                                    {/* Phone Label */}
                                    <span className="text-[14px] leading-[22px] text-[#1E1E1E]">
                                    {university?.email}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                     {/* =======================
                            Programs
                        ======================= */}
                            <div
                            style={{
                                height: "390.06px",
                                background: "#FFFFFF",
                                borderRadius: "20px",
                                boxShadow:
                                "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                                padding: "24px", // adds inner spacing
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                                overflowX: "auto", // scroll if content exceeds height
                                overflowY: "hidden", // prevent horizontal scroll
                            }}
                            >
                            {/* Programs Section */}
                            <div
                                style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-center",
                                gap: "16px",
                                width: "300px",
                                height: "350px",
                                }}
                            >
                                {/* Programs Label */}
                                <div
                                style={{
                                    width: "208px",
                                    height: "28px",
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    lineHeight: "28px",
                                    color: "#000000",
                                }}
                                >
                                Programs
                                </div>

                                {/* Programs Buttons */}
                                <div
                                style={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "flex-center",
                                gap: "16px",
                                overflowY: "auto",     // ✅ enable vertical scroll
                                overflowX: "hidden",  // ✅ prevent horizontal scroll
                                paddingRight: "4px",  // optional: space for scrollbar
                                }}
                                >
                                {university?.programs?.map((program, index) => (
                                    <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "6px 12px",
                                        gap: "8px",
                                        border: "1px solid #1E1E1E",
                                        borderRadius: "8px",
                                        fontFamily: "'Public Sans', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        lineHeight: "24px",
                                        color: "#1E1E1E",
                                    }}
                                    >
                                    {program}
                                    </div>
                                ))}
                                </div>
                            </div>
                        
                        </div>

                        {/* =======================
                            Rankings Card
                        ======================= */}
                        <div
                        style={{
                            height: "511.33px",
                            background: "#FFFFFF",
                            borderRadius: "20px",
                            boxShadow:
                            "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                            padding: "24px",
                            boxSizing: "border-box",
                            display: "flex",
                            flexDirection: "column",
                            gap: "29px", // spacing between ranking blocks
                            alignItems: "center",
                            overflowX: "auto", // scroll if content exceeds height
                            overflowY: "hidden", // prevent horizontal scroll
                        }}
                        >
                            {/* Ranking Block 1 */}
                            <div
                                style={{
                                width: "350px",
                                height: "130px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                }}
                            >
                                <div
                                style={{
                                    width: "350px",
                                    height: "100px",
                                    fontFamily: "'Barlow', sans-serif",
                                    fontWeight: 800,
                                    fontSize: "100px",
                                    lineHeight: "100px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    color: "#1E1E1E",
                                }}
                                >
                                #{String(university?.qsWorldRanking ?? 0).padStart(2, "0")}
                                </div>
                                <div
                                style={{
                                    width: "350px",
                                    height: "30px",
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "20px",
                                    lineHeight: "30px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    color: "#1E1E1E",
                                }}
                                >
                                QS World University Rankings
                                </div>
                            </div>

                            {/* Ranking Block 2 */}
                            <div
                                style={{
                                width: "350px",
                                height: "130px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                }}
                            >
                                <div
                                style={{
                                    width: "350px",
                                    height: "100px",
                                    fontFamily: "'Barlow', sans-serif",
                                    fontWeight: 800,
                                    fontSize: "100px",
                                    lineHeight: "100px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    color: "#1E1E1E",
                                }}
                                >
                                #{String(university?.qsRankingBySubject ?? 0).padStart(2, "0")}
                                </div>
                                <div
                                style={{
                                    width: "350px",
                                    height: "30px",
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "20px",
                                    lineHeight: "30px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    color: "#1E1E1E",
                                }}
                                >
                                QS WUR Ranking By Subject
                                </div>
                            </div>

                            {/* Ranking Block 3 */}
                            <div
                                style={{
                                width: "350px",
                                height: "130px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                }}
                            >
                                <div
                                style={{
                                    width: "350px",
                                    height: "100px",
                                    fontFamily: "'Barlow', sans-serif",
                                    fontWeight: 800,
                                    fontSize: "100px",
                                    lineHeight: "100px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    color: "#1E1E1E",
                                }}
                                >
                                #{String(university?.qsSustainabilityRanking ?? 0).padStart(2, "0")}
                                </div>
                                <div
                                style={{
                                    width: "350px",
                                    height: "30px",
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "20px",
                                    lineHeight: "30px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    color: "#1E1E1E",
                                }}
                                >
                                QS Sustainability Ranking
                                </div>
                            </div>
                        </div>


                        {/* =======================
                            Total Students Card
                        ======================= */}
                        <div
                        style={{
                            height: "387.06px",
                            background: "#FFFFFF",
                            borderRadius: "20px",
                            boxShadow:
                            "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                            padding: "24px",
                            boxSizing: "border-box",
                            display: "flex",
                            flexDirection: "column",
                            gap: "30px",
                            overflowX: "auto", // scroll if content exceeds height
                            overflowY: "hidden", // prevent horizontal scroll
                        }}
                        >
                        {/* -----------------------
                            Total Students Header
                        ----------------------- */}
                        <div
                            style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            }}
                        >
                                <div
                                style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    lineHeight: "28px",
                                    color: "#1E1E1E",
                                }}
                                >
                                Total Students
                                </div>
                                <div
                                style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    lineHeight: "28px",
                                    color: "#1E1E1E",
                                }}
                                >
                                {university?.totalStudents.toLocaleString() ?? 0} {/* show total students */}
                                </div>
                            </div>

                            {/* -----------------------
                                Progress Bar (Total Students)
                            ----------------------- */}
                            <div
                                style={{
                                position: "relative",
                                width: "300px",
                                height: "16px",
                                background: "#1E1E1E",
                                transform: "skewX(-20deg)",
                                borderRadius: "4px",
                                }}
                            >
                                <div
                                style={{
                                    position: "absolute",
                                    left: "0.5px",
                                    top: "50%",
                                    height: "14px",
                                    transform: "translateY(-50%)",
                                    borderRadius: "4px",
                                    background: "#FFEB9C",
                                    // dynamically calculate width based on totalStudents (max 38,000)
                                    width: `${Math.min(((university?.totalStudents ?? 0) / 38000) * 100, 100)}%`,
                                }}
                                />
                            </div>

                            {/* -----------------------
                                UG / PG Students Breakdown
                            ----------------------- */}
                            <div
                                style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "15px", // spacing between UG and PG blocks
                                width: "300px",
                                height: "18px",
                                }}
                            >
                                {/* UG Students */}
                                <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "161px",
                                    gap: "10px",
                                }}
                                >
                                <div
                                    style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "18px",
                                    color: "#1E1E1E",
                                    }}
                                >
                                    UG Students
                                </div>
                                <div
                                    style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "18px",
                                    textAlign: "right",
                                    color: "#1E1E1E",
                                    }}
                                >
                                    {university?.ugStudents.toLocaleString() ?? 0} {/* show UG number */}
                                </div>
                                <div
                                    style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "18px",
                                    textAlign: "right",
                                    color: "#1E1E1E",
                                    }}
                                >
                                    {Math.round(
                                    ((university?.ugStudents ?? 0) / (university?.totalStudents ?? 1)) * 100
                                    )}
                                    % {/* calculate UG percentage */}
                                </div>
                                </div>

                                {/* PG Students */}
                                <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "161px",
                                    gap: "10px",
                                }}
                                >
                                <div
                                    style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "18px",
                                    color: "#1E1E1E",
                                    }}
                                >
                                    PG Students
                                </div>
                                <div
                                    style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "18px",
                                    textAlign: "right",
                                    color: "#1E1E1E",
                                    }}
                                >
                                    {university?.pgStudents.toLocaleString() ?? 0} {/* show PG number */}
                                </div>
                                <div
                                    style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: "12px",
                                    lineHeight: "18px",
                                    textAlign: "right",
                                    color: "#1E1E1E",
                                    }}
                                >
                                    {Math.round(
                                    ((university?.pgStudents ?? 0) / (university?.totalStudents ?? 1)) * 100
                                    )}
                                    % {/* calculate PG percentage */}
                                </div>
                                </div>
                            </div>
                            {/* -----------------------
                                Total Doctors Header
                            ----------------------- */}
                            <div
                                style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                }}
                            >
                                <div
                                style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    lineHeight: "28px",
                                    color: "#1E1E1E",
                                }}
                                >
                                Total Doctors
                                </div>
                                <div
                                style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    lineHeight: "28px",
                                    color: "#1E1E1E",
                                }}
                                >
                                {university?.totalDoctors.toLocaleString() ?? 0} {/* show total students */}
                                </div>
                            </div>

                            {/* -----------------------
                                Progress Bar (Total Students)
                            ----------------------- */}
                            <div
                                style={{
                                position: "relative",
                                width: "300px",
                                height: "16px",
                                background: "#1E1E1E",
                                transform: "skewX(-20deg)",
                                borderRadius: "4px",
                                }}
                            >
                                <div
                                style={{
                                    position: "absolute",
                                    left: "0.5px",
                                    top: "50%",
                                    height: "14px",
                                    transform: "translateY(-50%)",
                                    borderRadius: "4px",
                                    background: "#FFEB9C",
                                    // dynamically calculate width based on totalStudents (max 2500)
                                    width: `${Math.min(((university?.totalDoctors ?? 0) / 2500) * 100, 100)}%`,
                                }}
                                />
                            </div>

                            {/* -----------------------
                                Total Staff Header
                            ----------------------- */}
                            <div
                                style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                }}
                            >
                                <div
                                style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    lineHeight: "28px",
                                    color: "#1E1E1E",
                                }}
                                >
                                Total Staff
                                </div>
                                <div
                                style={{
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    lineHeight: "28px",
                                    color: "#1E1E1E",
                                }}
                                >
                                {university?.staff.toLocaleString() ?? 0} {/* show total students */}
                                </div>
                            </div>

                            {/* -----------------------
                                Progress Bar (Total Students)
                            ----------------------- */}
                            <div
                                style={{
                                position: "relative",
                                width: "300px",
                                height: "16px",
                                background: "#1E1E1E",
                                transform: "skewX(-20deg)",
                                borderRadius: "4px",
                                }}
                            >
                                <div
                                style={{
                                    position: "absolute",
                                    left: "0.5px",
                                    top: "50%",
                                    height: "14px",
                                    transform: "translateY(-50%)",
                                    borderRadius: "4px",
                                    background: "#FFEB9C",
                                    // dynamically calculate width based on totalStudents (max 2500)
                                    width: `${Math.min(((university?.staff ?? 0) / 2500) * 100, 100)}%`,
                                }}
                                />
                            </div>
                        </div>

                       
                {/* =======================
                    END MOBILE LAYOUT
                ======================= */}


                    
                </div>               
        </div>

    </DashboardLayout>
  );
}
