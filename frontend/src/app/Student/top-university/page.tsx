// src/app/Student/top-university/page.tsx
"use client";
import {useRouter } from "next/navigation";
import { useState, useMemo, useRef, useEffect } from "react";
import DashboardLayout from "@/src/components/Student/DashboardLayout";

import { mockUniversities } from "@/src/mocks/mockUniversities";

const UniversityCard = ({
  university,
  onClick,
}: {
  university: typeof mockUniversities[0];
  onClick?: () => void;
}) => {
  return (
    <div className="relative w-[230px] h-[455px]">
      {/* SVG Card Body */}
      <svg
        width="400"
        height="419"
        viewBox="0 0 436 419"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* =====================
            Main Card Body
        ====================== */}
        <g filter="url(#filter0_dd_12789_51720)">
          <path
            d="M376 8C398.091 8 416 25.9086 416 48V324.255C416 333.091 408.837 340.255 400 340.255H304.555C297.538 340.255 291.339 344.827 289.268 351.532L281.972 375.145C279.9 381.85 273.702 386.422 266.685 386.422H60C37.9086 386.422 20 368.513 20 346.422V213.15C20 204.838 26.7378 198.101 35.0494 198.101H46.6678C50.2023 198.101 52.8464 201.345 52.1333 204.807C51.4202 208.268 54.0643 211.513 57.5988 211.513H141.595C145.581 211.513 149.018 208.711 149.823 204.807C150.627 200.902 154.065 198.101 158.051 198.101H186C194.837 198.101 202 190.937 202 182.101V24C202 15.1634 209.163 8 218 8H376Z"
            fill="white"
          />
        </g>

        {/* =====================
            Inner Card Shape
        ====================== */}
        <g filter="url(#filter1_dd_12789_51720)">
          <path
            d="M187.276 171.112C187.276 178.831 181.019 185.089 173.299 185.089H166.786C161.296 185.089 157.188 180.049 158.296 174.672C159.403 169.294 155.296 164.255 149.806 164.255H73.3876C67.1953 164.255 61.8556 168.607 60.6064 174.672C59.3573 180.737 54.0176 185.089 47.8253 185.089H41.1903C29.4872 185.089 20 175.602 20 163.899V34C20 19.6406 31.6406 8 46 8H161.276C175.636 8 187.276 19.6406 187.276 34V171.112Z"
            fill="white"
          />
        </g>

        {/* =====================
            Filters (ORIGINAL SHADOWS)
        ====================== */}
        <defs>
          {/* ---- Main Card Shadow ---- */}
          <filter
            id="filter0_dd_12789_51720"
            x="0"
            y="0"
            width="436"
            height="418.422"
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
              result="effect1_dropShadow_12789_51720"
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
              result="effect1_dropShadow_12789_51720"
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
              in2="effect1_dropShadow_12789_51720"
              result="effect2_dropShadow_12789_51720"
            />

            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_12789_51720"
              result="shape"
            />
          </filter>

          {/* ---- Inner Card Shadow ---- */}
          <filter
            id="filter1_dd_12789_51720"
            x="0"
            y="0"
            width="207.276"
            height="217.089"
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
              result="effect1_dropShadow_12789_51720"
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
              result="effect1_dropShadow_12789_51720"
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
              in2="effect1_dropShadow_12789_51720"
              result="effect2_dropShadow_12789_51720"
            />

            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_12789_51720"
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
          top: "32px",
          left: "12%",
          height: "130px",
          width: "135px",
          borderRadius: "20px",
          backgroundColor: "#E0E0E0",
          zIndex: 2,
        }}
      >
        {university.image ? (
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

      {/* Adress/PhoneNumber */}
      <div
        className="absolute flex flex-col items-start gap-[15px]"
        style={{
          left: "87%",
          top: "7%",
          bottom: "53.71%",
          width: "65%",
        }}
      >
        {/* Address Title */}
        <h6 className="font-semibold text-[18px] leading-[28px] text-black">
          Address
        </h6>

        {/* Frame 338 */}
        <div className="flex flex-col items-start  gap-[12px]"
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
              {university.address}
            </span>
          </div>

          {/* Frame 337 - Phone */}
          <div className="flex items-center gap-[14px]">
            {/* Phone Icon */}
            <div className="relative w-[24px] h-[24px]">
              {/* replace with your actual icon */}
              <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.7425 14.5413L16.1358 15.1453C16.1358 15.1453 14.6918 16.58 10.7518 12.6626C6.81181 8.74531 8.25581 7.31064 8.25581 7.31064L8.63714 6.92931C9.57981 5.99331 9.66914 4.48931 8.84647 3.39064L7.16647 1.14664C6.14781 -0.213361 4.18114 -0.393361 3.01448 0.766639L0.921142 2.84664C0.343808 3.42264 -0.0428587 4.16664 0.003808 4.99331C0.123808 7.10931 1.08114 11.66 6.41981 16.9693C12.0825 22.5986 17.3958 22.8226 19.5678 22.62C20.2558 22.556 20.8531 22.2066 21.3345 21.7266L23.2278 19.844C24.5078 18.5733 24.1478 16.3933 22.5105 15.504L19.9638 14.1186C18.8891 13.5346 17.5825 13.7066 16.7425 14.5413Z" fill="#1E1E1E"/>
              </svg>
            </div>
            {/* Phone Label */}
            <span className="text-[14px] leading-[22px] text-[#1E1E1E]">
              {university.phoneNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Title/Description */}
      <div
        className="absolute flex flex-col items-start"
        style={{
          left: "15%",
          top: "47%",
          width: "120%",
        }}
      >
        {/* Title */}
        <h5 className="font-bold text-[20px] leading-[30px] text-black">
          {university.name}
        </h5>

        {/* Description */}
        <p className="text-[16px] leading-[24px] text-black">
          <span>
            {university.description.split(" ").slice(0, 14).join(" ")}
            {university.description.split(" ").length > 14 ? "..." : ""}
          </span>

        </p>
      </div>

      {/* Highlight Button */}
      <div
        className="
          absolute
          flex items-center
          w-[80px] h-[32px]
          skew-x-[-12deg]
          rounded-MD
        "
        style={{
          top: "175px",
          left: "25%",
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
            # {university.id}
          </span>
        </div>
      </div>

      {/* Button */}
      <button className="absolute left-[116%] top-[74%] flex items-center skew-x-[-12deg] justify-center px-3 min-w-[110px] h-[36px] bg-[#FFEB9C] rounded-lg transition-all duration-200 hover:bg-[#FFE066] hover:scale-105"
        onClick={onClick}>
        <span className="text-[14px] skew-x-[12deg] font-bold leading-[24px] text-[#1E1E1E]">
          View Details
        </span>
      </button>

    </div>
  );
};

type UniversityRowProps = {
  university: typeof mockUniversities[0];
  onMainClick?: () => void;
  onSideClick?: () => void;
  showCheckbox?: boolean;
};

const UniversityRow = ({ university,onMainClick,onSideClick,showCheckbox = false }: UniversityRowProps) => {
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
        className="flex items-center w-full skew-x-[-12deg] rounded-[8] h-[72px] shadow-lg  bg-white cursor-pointer hover:bg-gray-50"
        onClick={onMainClick}
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
          <div className="flex flex-col justify-center w-[140px]">
            <span className="text-sm font-semibold text-gray-900">UN-ID-{university.id}</span>
            <span className="text-xs text-gray-400">university ID</span>
          </div>
          {/* Name */}
          <div className="flex flex-col justify-center w-[240px]">
            <span className="text-sm font-semibold text-gray-900">{university.name}</span>
            <span className="text-xs text-gray-400">university Name</span>
          </div>
          {/* Contract Title */}
          <div className="flex flex-col justify-center w-[140px]">
            <span className="text-sm font-semibold text-gray-900">{university.phoneNumber}</span>
            <span className="text-xs text-gray-400">Phone Number</span>
          </div>
          {/* Start Date */}
          <div className="flex flex-col justify-center w-[240px]">
            <span className="text-sm font-semibold text-gray-900">{university.address}</span>
            <span className="text-xs text-gray-400">Address</span>
          </div>
          {/* End Date */}
          <div className="flex flex-col justify-center w-[80px]">
            <span className="text-sm font-semibold text-gray-900">{university.qsWorldRanking}</span>
            <span className="text-xs text-gray-400">World Ranking</span>
          </div>

          {/* End Date */}
          <div className="flex flex-col justify-center w-[80px]">
            <span className="text-sm font-semibold text-gray-900">{university.qsRankingBySubject}</span>
            <span className="text-xs text-gray-400">Ranking By Subject</span>
          </div>

          {/* End Date */}
          <div className="flex flex-col justify-center ">
            <span className="text-sm font-semibold text-gray-900">{university.qsSustainabilityRanking}</span>
            <span className="text-xs text-gray-400">Sustainability Ranking</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};


export default function TopUniversityPage() {

    //---------------------filter----------------------------------
        const [showUniversities, setShowUniversities] = useState(true);
        const router = useRouter();
        const [searchQuery, setSearchQuery] = useState("");
        const [currentPage, setCurrentPage] = useState(1);

    
        // 🔍 Filter applicants
        const filteredUniversities = useMemo(() => {
          return mockUniversities.filter(applicant => {
            // Search filter
            const searchMatch =
              !searchQuery.trim() ||
              applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              applicant.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
              applicant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
              applicant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              applicant.id.toLowerCase().includes(searchQuery.toLowerCase());

            return searchMatch;
          });
        }, [searchQuery]);
    
    
        
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
        const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
        
        const paginatedUniversities = filteredUniversities.slice(
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
        {/* =====================
            Page Title
        ====================== */}
        <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-8">
           University
        </h1>

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
                placeholder="Search universities..."
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

              {/* Toggle Universities*/}
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
                onClick={() => setShowUniversities(!showUniversities)}
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
              universities Grid
          ====================== */}
          {showUniversities && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-2">

              {paginatedUniversities.map((university, index) => (
                <UniversityCard
                  key={index}
                  university={university}
                  onClick={() =>
                    router.push(
                      `/Student/top-university/${university.id}`
                    )
                  }
                />
              ))}
            </div>
          )}

          {/* =====================
              universities List
          ====================== */}
          {!showUniversities && (
            <div className="flex flex-col gap-2 mt-4">
              {paginatedUniversities.map((university, index) => (
                <UniversityRow
                  key={index}
                  university={university}
                  onMainClick={() =>
                    router.push(
                      `/Student/top-university/${university.id}`
                    )
                  }
                  showCheckbox={true}
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