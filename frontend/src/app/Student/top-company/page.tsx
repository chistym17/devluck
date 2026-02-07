// src/app/Student/top-company/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
import { useTopCompanyHandler, type TopCompany } from "@/src/hooks/companyapihandler/useTopCompanyHandler";
import { ArrowUpRight } from 'lucide-react';

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

const CompanyCard = ({
  company,
  onClick,
}: {
  company: TopCompany;
  onClick?: () => void;
}) => {
  return (
    <div className="relative w-[290px] h-[356px]">
      {/* SVG Card Body */}
      <svg
        width="290"
        height="356"
        viewBox="0 0 290 356"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_dd_12888_50613)">
          <path
            d="M245.469 311.11C244.876 318.311 238.858 323.854 231.632 323.854H209.454C200.305 323.854 193.657 315.159 196.056 306.33L199.529 293.548C201.928 284.719 195.28 276.024 186.131 276.024H79.5054C73.2396 276.024 67.7503 280.221 66.1075 286.268L58.6786 313.61C57.0358 319.657 51.5465 323.854 45.2807 323.854H33.8845C25.7671 323.854 19.3811 316.92 20.0478 308.829L40.4488 61.2989C41.0423 54.0977 47.0599 48.5557 54.2855 48.5557H120.558C126.716 48.5557 132.138 44.4994 133.877 38.5921L139.948 17.9636C141.687 12.0562 147.109 8 153.267 8H255.375C263.493 8 269.879 14.934 269.212 23.024L245.469 311.11Z"
            fill="white"
          />
        </g>
        <defs>
          <filter
            id="filter0_dd_12888_50613"
            x="0"
            y="0"
            width="289.26"
            height="355.854"
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
              result="effect1_dropShadow_12888_50613"
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
              result="effect1_dropShadow_12888_50613"
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
              in2="effect1_dropShadow_12888_50613"
              result="effect2_dropShadow_12888_50613"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_12888_50613"
              result="shape"
            />
          </filter>
        </defs>
      </svg>



      {/* =======================
          PROFILE IMAGE PLACEHOLDER / IMAGE
      ======================== */}
     {/* Image 17 */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: "60px",
          left: "25%",
          height: "90px",
          width: "145px",
          borderRadius: "20px",
          backgroundColor: "#E0E0E0",
          zIndex: 2,
        }}
      >
        {(company.logo || company.image) ? (
          <img
            src={company.logo || company.image || "/default-company.png"}
            alt={company.name}
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

     

     {/* Title/Description */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          top: "170px", // move this to control vertical position
          left: "50%",   // center horizontally
          transform: "translateX(-50%)", // perfectly center
          width: "auto", // let content determine width
        }}
      >
        {/* University Name */}
        <h5
          className="text-[20px] font-bold text-center text-[#1E1E1E]"
          style={{
            lineHeight: '30px',
            width: "140%",
            textShadow: '0px 17.08px 20.88px rgba(213, 118, 246, 0.33)'
          }}
        >
          {company.name}
        </h5>

        {/* Job Tags Container */}
        <div className="flex flex-row items-center gap-4 w-full h-[40px]">
          {/* First Job Tag */}
          <div className="flex flex-row items-center gap-[6px] ">
            <div className="w-[32px] h-[24px]">
              {/* Replace with actual icon */}
              <svg
                width="32"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.53809 0.666992H26.4619C29.1522 0.667192 31.3328 2.84776 31.333 5.53809V8C31.333 16.4684 24.4684 23.333 16 23.333C7.53163 23.333 0.666992 16.4684 0.666992 8V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z"
                  fill="#FFEB9C"
                  fillOpacity="0.16"
                />
                <path
                  d="M5.53809 0.666992H26.4619C29.1522 0.667192 31.3328 2.84776 31.333 5.53809V8C31.333 16.4684 24.4684 23.333 16 23.333C7.53163 23.333 0.666992 16.4684 0.666992 8V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z"
                  stroke="#E6D48C"
                  strokeWidth="1.33333"
                />
                <path
                  d="M16 3.11035C18.1217 3.11035 20.1566 3.95321 21.6569 5.4535C23.1571 6.95379 24 8.98862 24 11.1104C24 13.8428 22.5102 16.0792 20.9404 17.6837C20.156 18.4765 19.3003 19.1954 18.384 19.8312L18.0053 20.089L17.8276 20.2072L17.4924 20.4206L17.1938 20.6028L16.824 20.8179C16.5729 20.9608 16.2889 21.036 16 21.036C15.7111 21.036 15.4271 20.9608 15.176 20.8179L14.8062 20.6028L14.344 20.3184L14.1733 20.2072L13.8089 19.9646C12.8204 19.2955 11.8996 18.5316 11.0596 17.6837C9.48978 16.0775 8 13.8428 8 11.1104C8 8.98862 8.84285 6.95379 10.3431 5.4535C11.8434 3.95321 13.8783 3.11035 16 3.11035ZM16 8.44369C15.6498 8.44369 15.303 8.51266 14.9795 8.64667C14.656 8.78069 14.362 8.97711 14.1144 9.22473C13.8668 9.47236 13.6703 9.76633 13.5363 10.0899C13.4023 10.4134 13.3333 10.7602 13.3333 11.1104C13.3333 11.4605 13.4023 11.8073 13.5363 12.1308C13.6703 12.4544 13.8668 12.7483 14.1144 12.996C14.362 13.2436 14.656 13.44 14.9795 13.574C15.303 13.708 15.6498 13.777 16 13.777C16.7072 13.777 17.3855 13.4961 17.8856 12.996C18.3857 12.4959 18.6667 11.8176 18.6667 11.1104C18.6667 10.4031 18.3857 9.72483 17.8856 9.22473C17.3855 8.72464 16.7072 8.44369 16 8.44369Z"
                  fill="#E6D48C"
                />
              </svg>

            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[14px] text-[#1E1E1E]">rafah</span>
              <span className="text-[12px] text-black/56">Location</span>
            </div>
          </div>

          {/* Second Job Tag */}
          <div className="flex flex-row items-center gap-[6px] ">
            <div className="w-[32px] h-[24px]">
              {/* Replace with actual icon */}
                <svg
                  width="32"
                  height="24"
                  viewBox="0 0 32 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.53809 0.666992H26.4619C29.1522 0.667192 31.3328 2.84776 31.333 5.53809V8C31.333 16.4684 24.4684 23.333 16 23.333C7.53163 23.333 0.666992 16.4684 0.666992 8V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z"
                    fill="#FFEB9C"
                    fillOpacity="0.16"
                  />
                  <path
                    d="M5.53809 0.666992H26.4619C29.1522 0.667192 31.3328 2.84776 31.333 5.53809V8C31.333 16.4684 24.4684 23.333 16 23.333C7.53163 23.333 0.666992 16.4684 0.666992 8V5.53809C0.667195 2.84777 2.84777 0.667195 5.53809 0.666992Z"
                    stroke="#E6D48C"
                    strokeWidth="1.33333"
                  />
                  <path
                    d="M24 12.8887V19.4967C24 19.6757 23.9639 19.8529 23.8939 20.0177C23.8239 20.1826 23.7215 20.3316 23.5926 20.4559C23.4638 20.5803 23.3113 20.6774 23.1441 20.7415C22.9769 20.8056 22.7985 20.8354 22.6196 20.8291L22.5013 20.8193L16 20.0069V12.8887H24ZM14.2222 12.8887V19.7847L9.55733 19.2015C9.12729 19.1478 8.73169 18.9388 8.44491 18.6139C8.15812 18.289 7.99991 17.8705 8 17.4371V12.8887H14.2222ZM22.5013 3.18021C22.679 3.15801 22.8593 3.17183 23.0315 3.22083C23.2037 3.26983 23.3643 3.35301 23.5037 3.46542C23.643 3.57783 23.7583 3.71715 23.8427 3.87508C23.9271 4.03301 23.9787 4.20631 23.9947 4.38465L24 4.50287V11.1109H16V3.99265L22.5013 3.18021ZM14.2222 4.21487V11.1109H8V6.56243C7.99991 6.12904 8.15812 5.71055 8.44491 5.38563C8.73169 5.0607 9.12729 4.85172 9.55733 4.79798L14.2222 4.21487Z"
                    fill="#E6D48C"
                  />
                </svg>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[14px] text-[#1E1E1E]">Type</span>
              <span className="text-[12px] text-black/56">Employee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Button */}
      <div
        className="
          absolute
          flex items-center
          w-[90px] h-[32px]
          skew-x-[-12deg]
          rounded-MD
        "
        style={{
          top: "10px",
          left: "15%",
          zIndex: 2,
          borderRadius: "8px", // Your desired radius
          overflow: "hidden",  // Makes skewed inner content clipped to rounded corners
        }}
      >
        {/* Frame 261 (Center) */}
        <div className="flex items-center justify-center  gap-[4px] w-[93.6px] h-[32px] bg-[#FFEB9C] py-[4px]">
          {/* Icon */}
          <div className="relative skew-x-[12deg] w-[24px] h-[24px]">
            {/* Replace with your real icon SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 8.16223V8.23523C22 9.09523 22 9.52624 21.793 9.87824C21.586 10.2302 21.209 10.4392 20.457 10.8582L19.664 11.2982C20.21 9.45024 20.393 7.46423 20.46 5.76623L20.47 5.54524L20.472 5.49324C21.123 5.71924 21.489 5.88824 21.717 6.20424C22 6.59724 22 7.11924 22 8.16223ZM2 8.16223V8.23523C2 9.09523 2 9.52624 2.207 9.87824C2.414 10.2302 2.791 10.4392 3.543 10.8582L4.337 11.2982C3.79 9.45024 3.607 7.46423 3.54 5.76623L3.53 5.54524L3.529 5.49324C2.877 5.71924 2.511 5.88824 2.283 6.20424C2 6.59724 2 7.12023 2 8.16223Z" fill="#1C252E"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2.00024C13.784 2.00024 15.253 2.15724 16.377 2.34724C17.516 2.53924 18.085 2.63524 18.561 3.22124C19.037 3.80724 19.011 4.44024 18.961 5.70624C18.789 10.0552 17.851 15.4862 12.75 15.9662V19.5002H14.18C14.4111 19.5004 14.635 19.5805 14.8137 19.7271C14.9923 19.8737 15.1147 20.0776 15.16 20.3042L15.35 21.2502H18C18.1989 21.2502 18.3897 21.3293 18.5303 21.4699C18.671 21.6106 18.75 21.8013 18.75 22.0002C18.75 22.1991 18.671 22.3899 18.5303 22.5306C18.3897 22.6712 18.1989 22.7502 18 22.7502H6C5.80109 22.7502 5.61032 22.6712 5.46967 22.5306C5.32902 22.3899 5.25 22.1991 5.25 22.0002C5.25 21.8013 5.32902 21.6106 5.46967 21.4699C5.61032 21.3293 5.80109 21.2502 6 21.2502H8.65L8.84 20.3042C8.88529 20.0776 9.00768 19.8737 9.18634 19.7271C9.365 19.5805 9.58891 19.5004 9.82 19.5002H11.25V15.9662C6.15 15.4862 5.212 10.0542 5.04 5.70624C4.989 4.44024 4.964 3.80624 5.44 3.22124C5.915 2.63524 6.484 2.53924 7.623 2.34724C9.06982 2.11011 10.5339 1.99404 12 2.00024ZM12.952 6.19923L12.854 6.02323C12.474 5.34023 12.284 5.00024 12 5.00024C11.716 5.00024 11.526 5.34023 11.146 6.02323L11.048 6.19923C10.94 6.39324 10.886 6.48923 10.802 6.55324C10.717 6.61724 10.612 6.64124 10.402 6.68824L10.212 6.73223C9.474 6.89923 9.105 6.98223 9.017 7.26424C8.929 7.54724 9.181 7.84124 9.684 8.42923L9.814 8.58124C9.957 8.74824 10.029 8.83124 10.061 8.93524C10.093 9.03924 10.082 9.15024 10.061 9.37324L10.041 9.57624C9.965 10.3612 9.927 10.7542 10.156 10.9282C10.386 11.1022 10.732 10.9432 11.423 10.6252L11.601 10.5432C11.798 10.4532 11.896 10.4082 12 10.4082C12.104 10.4082 12.202 10.4532 12.399 10.5432L12.577 10.6252C13.268 10.9442 13.614 11.1022 13.844 10.9282C14.074 10.7542 14.035 10.3612 13.959 9.57624L13.939 9.37324C13.918 9.15024 13.907 9.03924 13.939 8.93524C13.971 8.83224 14.043 8.74824 14.186 8.58124L14.316 8.42923C14.819 7.84124 15.071 7.54724 14.983 7.26424C14.895 6.98223 14.526 6.89923 13.788 6.73223L13.598 6.68824C13.388 6.64124 13.283 6.61824 13.198 6.55324C13.114 6.48923 13.06 6.39324 12.952 6.19923Z" fill="#1C252E"/>
            </svg>

          </div>
          {/* Text */}
          <span className="font-bold text-[14px] skew-x-[12deg] leading-[24px] text-[#1E1E1E]">
            #{company.id.startsWith('C') ? company.id : `C${company.id.slice(0, 4)}`}
          </span>
        </div>
      </div>

      {/* Button */}
      <button className="absolute left-[24%] top-[80%] flex items-center skew-x-[-12deg] justify-center px-3 min-w-[120px] h-[36px] bg-[#FFEB9C] rounded-[8px] transition-all duration-200 hover:bg-[#FFE066] hover:scale-105"
        onClick={onClick}>
        <span className="text-[14px] skew-x-[12deg] font-bold leading-[24px] text-[#1E1E1E]">
          View Details
        </span>
      </button>

    </div>
  );
};

type CompanyRowProps = {
  company: TopCompany;
  onMainClick?: () => void;
  onSideClick?: () => void;
};

const CompanyRow = ({ company,onMainClick}: CompanyRowProps) => {
  const displayValue = (value?: string | null) =>
  value && value.trim() !== "" ? value : "N/A";

  return (
    <div className="flex justify-center w-full gap-4">
      {/* Main 80% section */}
      <div
        className="flex items-center px-6 skew-x-[-12deg] rounded-[8px] h-[72px] shadow-lg bg-white"
        onClick={onMainClick}
      >

          {/* Left spacer */}
        <div className="w-6 h-full flex-none"></div>

         {/* Company Info */}
        <div className="flex-1 flex items-center skew-x-[12deg] h-full px-4 gap-6">
          {/* Company ID */}
          <div className="flex flex-col justify-center w-[140px]">
            <span className="text-sm font-semibold text-gray-900">CO-ID-{company.id.startsWith('C') ? company.id : `C${company.id.slice(0, 10)}`}</span>
            <span className="text-xs text-gray-400">Company ID</span>
          </div>
          {/* Company Name */}
          <div className="flex flex-col justify-center w-[140px]">
            <span className="text-sm font-semibold text-gray-900">{displayValue(company.name)}</span>
            <span className="text-xs text-gray-400">Company Name</span>
          </div>
          {/* Phone Number */}
          <div className="flex flex-col justify-center w-[140px]">
            <span className="text-sm font-semibold text-gray-900">{displayValue(company.phoneNumber)}</span>
            <span className="text-xs text-gray-400">Phone Number</span>
          </div>

          {/* Company Location */}
          <div className="flex flex-col justify-center w-[140px]">
            <span className="text-sm font-semibold text-gray-900">{displayValue(company.location || company.addresses?.[0]?.address)}</span>
            <span className="text-xs text-gray-400">Location</span>
          </div>

          {/* Company Status */}
          <div className="flex flex-col justify-center items-center">
            <div
              className={`
                ml-4 px-3 py-1 skew-x-[-12deg] rounded-[8px] text-xs font-semibold
                flex items-center justify-center
                ${
                  company.status === "Verified"
                    ? "bg-[#D3FCD2] border border-[#22C55E] text-[#22C55E]"
                    : ""
                }
                ${
                  company.status === "Pending"
                    ? "bg-[#FFEB9C]/40 border border-[#E6D48C] text-[#B59A00]"
                    : ""
                }
                ${!company.status || (company.status !== "Verified" && company.status !== "Pending")
                    ? "bg-gray-100 border border-gray-300 text-gray-600"
                    : ""
                }
              `}
            >
              {company.status || 'N/A'}
            </div>
            <span className="text-xs text-gray-400">Company Status</span>
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

export default function TopCompanyPage() {
  const [showCompanies, setShowCompanies] = useState(true);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { topCompanies, loading, error, getTopCompanies } = useTopCompanyHandler();

  useEffect(() => {
    getTopCompanies(1, 100).catch((err) => {
      console.error('Failed to load top companies:', err);
    });
  }, [getTopCompanies]);

  const filteredCompanies = useMemo(() => {
    if (!topCompanies || topCompanies.length === 0) return [];
    
    return topCompanies.filter(company => {
      const searchMatch =
        !searchQuery.trim() ||
        company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.addresses && company.addresses.some(addr => 
          addr.address?.toLowerCase().includes(searchQuery.toLowerCase())
        ));
  
      return searchMatch;
    });
  }, [topCompanies, searchQuery]);
     
     
         
         // 📄 Pagination
        const [itemsPerPage, setItemsPerPage] = useState(10); // default 10 for desktop

        useEffect(() => {
          const updateItemsPerPage = () => {
            if (window.innerWidth < 640) { // mobile
              setItemsPerPage(4);
            } else {
              setItemsPerPage(10); // desktop
            }
          };

          updateItemsPerPage(); // run once on mount
          window.addEventListener("resize", updateItemsPerPage); // run on resize

          return () => window.removeEventListener("resize", updateItemsPerPage);
        }, []);

         const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
         
         const paginatedCompanies = filteredCompanies.slice(
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

        const totalCompanies = topCompanies.length;

        const verifiedCompanies = topCompanies.filter(
          (company) => company.status === "Verified"
        ).length;

        const pendingCompanies = topCompanies.filter(
          (company) => company.status === "Pending"
        ).length;

        const totalContracts = topCompanies.reduce(
          (sum, company) => sum + (company.contractsCount || 0),
          0
        );

        if (loading && topCompanies.length === 0) {
            return (
              <DashboardLayout>
                <div className="flex h-screen items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
                </div>
              </DashboardLayout>
            );
          }
        
          if (error && topCompanies.length === 0) {
            return (
              <DashboardLayout>
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                  <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-8">
                    Company
                  </h1>
                  <div className="flex justify-center py-10 text-red-500">
                    Error: {error}
                  </div>
                </div>
              </DashboardLayout>
            );
          }

   return (
       <DashboardLayout>
       <div className="px-4 sm:px-6 lg:px-8 py-6">
         {/* =====================
             Page Title
         ====================== */}
         <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-8">
            Company
         </h1>
         {/* Top row: 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 place-items-center">
            <Card
              title="Total Companies"
              value={totalCompanies.toString()}
              subtitle="All registered companies"
            />

            <Card
              title="Verified Companies"
              value={verifiedCompanies.toString()}
              subtitle="Approved profiles"
            />

            <Card
              title="Pending Companies"
              value={pendingCompanies.toString()}
              subtitle="Awaiting review"
            />

            <Card
              title="Total Employees"
              value={totalContracts.toLocaleString()}
              subtitle="All available contracts"
            />
          </div>

 
         {/* =====================
             Main Column
         ====================== */}
         <div className="flex flex-col gap-6">
 
           {/* =====================
               Search + Actions Row
           ====================== */}
           <div className="flex items-center gap-2">
 
             {/* -------- Search Input (Parallelogram) -------- */}
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
                 placeholder="Search companies..."
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
                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                   <path d="M13.8067 12.86L11.54 10.6..." fill="#1E1E1E" />
                 </svg>
               </div>
             </div>
 
             {/* -------- Filter Buttons -------- */}
             <div className="ml-auto gap-2 hidden sm:flex">
 
               {/* Toggle Companies / Contracts */}
               <button
                 className="
                   relative w-[60px] h-[40px]
                   skew-x-[-12deg]
                   bg-transparent
                   border border-black
                   flex items-center justify-center
                   overflow-hidden rounded-lg
                   hover:bg-black/10
                   transition-all
                 "
                 onClick={() => setShowCompanies(!showCompanies)}
               >
                 <span className="skew-x-[12deg]">
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
 
           {/* =====================
               Company Grid
           ====================== */}
           {showCompanies && (
      
              <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-5 gap-2 justify-items-center">
               {paginatedCompanies.map((company, index) => (
                 <CompanyCard
                   key={index}
                   company={company}
                   onClick={() =>
                     router.push(
                       `/Student/top-company/${company.id}`
                     )
                   }
                 />
               ))}
             </div>
           )}
 
           {/* =====================
               Company List
           ====================== */}
           {!showCompanies && (
             <div className="flex flex-col gap-2 mt-4">
               {paginatedCompanies.map((company, index) => (
                 <CompanyRow
                   key={index}
                   company={company}
                   onMainClick={() =>
                     router.push(
                       `/Student/top-company/${company.id}`
                     )
                   }
                  
                 />
               ))}
             </div>
           )}
         </div>
       </div>
 
       {/* =====================
           Pagination
       ====================== */}
       {totalPages > 1 && (
         <div className="flex items-center justify-center gap-3 mt-10">
 
           {/* Previous */}
           <button
             onClick={goToPrevious}
             disabled={currentPage === 1}
             className="disabled:opacity-40 disabled:cursor-not-allowed"
           >
             <img src="/ic-eva_arrow-ios-back-fill.svg" alt="Prev" />
           </button>
 
           {/* Page Numbers */}
           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
             <button
               key={page}
               onClick={() => goToPage(page)}
               className={`
                 w-11 h-9
                 skew-x-[-12deg]
                 rounded-md
                 text-sm font-semibold
                 transition-all
                 ${
                   currentPage === page
                     ? "border border-black text-black"
                     : "text-black/60 hover:bg-black/10"
                 }
               `}
             >
               <span className="skew-x-[12deg] flex h-full w-full items-center justify-center">
                 {page}
               </span>
             </button>
           ))}
 
           {/* Next */}
           <button
             onClick={goToNext}
             disabled={currentPage === totalPages}
             className="disabled:opacity-40 disabled:cursor-not-allowed"
           >
             <img src="/ic-eva_arrow-ios-forward-fill.svg" alt="Next" />
           </button>
         </div>
       )}
     </DashboardLayout>
   );
 }