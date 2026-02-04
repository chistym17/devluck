"use client";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/src/components/Company/DashboardLayout";
import { useTopCompanyHandler, type TopCompanyDetail } from "@/src/hooks/companyapihandler/useTopCompanyHandler";
import { useReviewHandler } from "@/src/hooks/companyapihandler/useReviewHandler";
import { useState, useMemo, useRef, useEffect } from "react";
import { useSidebar } from "@/src/lib/sidebarContext";
import { ArrowUpRight } from 'lucide-react';

interface ClipImageProps {
    src?: string;
    width?: number;
    height?: number;
}

const ClipImage = ({ src, width = 239, height = 271 }: ClipImageProps) => {
    const hasImage = !!src;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ background: "transparent" }} // transparent background
        >
            <defs>
                <mask
                    id="mask0"
                    maskUnits="userSpaceOnUse"
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    style={{ maskType: "alpha" }}
                >
                    <path d="M222.5 0.5L155 0H83.5L70 13L26.5 26H0V35.5V240.55C32.3519 259.391 69.9679 270.183 110.104 270.183C157.941 270.183 202.32 256.216 238.5 231.85V105V98.5H234H229H222.5V94V0.5Z" fill="white" />
                </mask>
            </defs>

            {hasImage ? (
                <g mask="url(#mask0)">
                    <image
                        href={src}
                        width={width}
                        height={height}
                        preserveAspectRatio="xMidYMid slice"
                    />
                </g>
            ) : (
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#999"
                    fontSize="16"
                    fontFamily="sans-serif"
                >
                    No image found
                </text>
            )}
        </svg>
    );
};


type UploadItem = {
    file: File;
    preview?: string;
    progress: number;
    uploading: boolean;
    error?: string;
};

const MAX_FILE_SIZE_MB = 5;
const MAX_FILES = 5;

export default function TopCompanyPage() {
    const { isCollapsed } = useSidebar();
    const params = useParams();
    const { companyId } = params;
    const { topCompany, loading, error, getTopCompanyById } = useTopCompanyHandler();
    const { reviews: companyReviews, getReviews } = useReviewHandler();

    // ============= file upload state (must be before conditional returns) ==============
    const [files, setFiles] = useState<UploadItem[]>([]);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        if (companyId && typeof companyId === 'string') {
            getTopCompanyById(companyId).then((data) => {
                console.log('Company data loaded:', data);
                console.log('Addresses:', data.addresses);
                if (data.addresses && data.addresses.length > 0) {
                    console.log('First address details:', {
                        id: data.addresses[0].id,
                        name: data.addresses[0].name,
                        tag: data.addresses[0].tag,
                        address: data.addresses[0].address,
                        phoneNumber: data.addresses[0].phoneNumber
                    });
                }
                console.log('Programs:', data.programs);
            }).catch((err) => {
                console.error('Failed to load company details:', err);
            });
            getReviews(companyId);
        }
    }, [companyId, getTopCompanyById, getReviews]);

    const company = topCompany;
    const reviews = companyReviews;

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-screen items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !company) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="bg-white shadow-md rounded-lg p-8 sm:p-12 text-center max-w-md w-full">
                    <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4 flex items-center justify-center gap-2">
                        ❌ Company Not Found
                    </h2>

                    <p className="text-[#555] text-base sm:text-lg">
                        {error || "The requested company could not be found."}
                    </p>

                    <p className="text-[#777] mt-2 text-sm">
                        Please check the ID or go back to the{" "}
                        <a
                        href="/Company/top-company"
                        className="text-blue-500 hover:underline font-medium"
                        >
                        Top companies
                        </a>
                        .
                    </p>
                    </div>
                </div>
            </DashboardLayout>

        );
    }

    /* -----------------------------
        FAKE UPLOAD (SIMULATION)
    ------------------------------ */
    const simulateUpload = (index: number) => {
        setFiles((prev) =>
            prev.map((f, i) =>
                i === index ? { ...f, uploading: true, error: undefined } : f
            )
        );

        let progress = 0;

        const interval = setInterval(() => {
            progress += 10;

            setFiles((prev) =>
                prev.map((f, i) =>
                    i === index ? { ...f, progress } : f
                )
            );

            if (progress >= 100) {
                clearInterval(interval);

                // simulate random failure
                const failed = Math.random() < 0.2;

                setFiles((prev) =>
                    prev.map((f, i) =>
                        i === index
                            ? failed
                                ? {
                                    ...f,
                                    uploading: false,
                                    progress: 0,
                                    error: "Upload failed. Retry.",
                                }
                                : { ...f, uploading: false, progress: 100 }
                            : f
                    )
                );
            }
        }, 300);
    };

    /* -----------------------------
        FILE HANDLER
    ------------------------------ */
    const handleFiles = (incoming: File[]) => {
        if (files.length + incoming.length > MAX_FILES) {
            alert(`Max ${MAX_FILES} files allowed`);
            return;
        }

        incoming.forEach((file) => {
            if (
                !file.type.startsWith("image/") &&
                file.type !== "application/pdf"
            ) {
                alert("Only images and PDFs allowed");
                return;
            }

            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                alert(`Max file size ${MAX_FILE_SIZE_MB}MB`);
                return;
            }

            const item: UploadItem = {
                file,
                preview: file.type.startsWith("image/")
                    ? URL.createObjectURL(file)
                    : undefined,
                progress: 0,
                uploading: false,
            };

            setFiles((prev) => {
                const index = prev.length;
                setTimeout(() => simulateUpload(index), 100);
                return [...prev, item];
            });
        });
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const clearAll = () => {
        setFiles([]);
    };

    return (
        <DashboardLayout>
            <div
                className={`relative w-full min-h-[1000px] p-4 transform md:scale-[0.96] md:origin-top
          ${isCollapsed ? "ml-[50px]" : "ml-0"}
        `}
                style={{
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="hidden md:block">
                    <svg
                        width="1292"
                        height="678"
                        viewBox="0 0 1292 678"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <g filter="url(#filter0_dd_12905_50619)">
                            <path
                                d="M1005.62 86.1074C1005.62 108.199 1023.53 126.107 1045.62 126.107H1232C1254.09 126.107 1272 144.016 1272 166.107V364C1272 386.091 1254.09 404 1232 404H594.999C572.908 404 554.999 421.909 554.999 444V606C554.999 628.091 537.09 646 514.999 646H60C37.9086 646 20 628.091 20 606V352.315C20 330.224 37.9086 312.315 60 312.315H284.618C306.71 312.315 324.618 294.407 324.618 272.315V48C324.618 25.9086 342.527 8 364.618 8H965.618C987.71 8 1005.62 25.9086 1005.62 48V86.1074Z"
                                fill="#FFEB9C"
                            />
                        </g>

                        <defs>
                            <filter
                                id="filter0_dd_12905_50619"
                                x="0"
                                y="0"
                                width="1292"
                                height="678"
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
                                    result="effect1_dropShadow_12905_50619"
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
                                    result="effect1_dropShadow_12905_50619"
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
                                    in2="effect1_dropShadow_12905_50619"
                                    result="effect2_dropShadow_12905_50619"
                                />
                                <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect2_dropShadow_12905_50619"
                                    result="shape"
                                />
                            </filter>
                        </defs>
                    </svg>



                    {/* =======================
                    ROTATED CARD WITH IMAGE
                ======================= */}
                    <div
                        className="absolute   overflow-hidden"
                        style={{
                            top: "25px",
                            left: "45px",
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
                            {company?.image ? (
                                <img
                                    src={company.image}
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

                    </div>

                    {/* =======================
                   Corporate  CARD
                ======================= */}
                    <div
                        className="absolute left-[375px] top-[55px] w-[627px] h-[263px] flex flex-col items-start gap-6"
                    >
                        <h4 className="font-publicSans font-bold text-[24px] leading-[36px] text-black m-0">
                            Corporate
                        </h4>
                        <p className="font-publicSans font-normal text-[16px] leading-[24px] text-black m-0">
                            {company?.description || "No description available."}
                        </p>
                    </div>

                    {/* =======================
                   Verification  CARD
                ======================= */}
                    <div
                        className="absolute left-[1050px] top-[25px]"
                        style={{
                            height: "98.32px",
                            width: "245.83px",
                            background: "#FFFFFF",
                            boxShadow:
                                "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                            borderRadius: "24px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0",
                            gap: "3px",
                        }}
                    >
                        {/* Button */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "0px 12px",
                                gap: "8px",
                                width: "193px",
                                minWidth: "64px",
                                height: "36px",
                                background: "#FFEB9C",
                                borderRadius: "8px",
                                fontFamily: "'Public Sans', sans-serif",
                                fontWeight: 700,
                                fontSize: "14px",
                                lineHeight: "24px",
                                color: "#1E1E1E",
                                border: "none",
                            }}
                        >
                            {/* Start icon (hidden) */}
                            <span style={{ display: "none", width: "20px", height: "20px" }} />

                            {/* Label */}
                            <span
                                style={{
                                    width: "55px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}
                            >
                                {company?.status}
                            </span>

                            {/* End icon (hidden) */}
                            <span style={{ display: "none", width: "20px", height: "20px" }} />
                        </div>

                        {/* Caption */}
                        <span
                            style={{
                                width: "193px",
                                height: "18px",
                                fontFamily: "'Public Sans', sans-serif",
                                fontWeight: 400,
                                fontSize: "12px",
                                lineHeight: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center", // <-- add this
                                textAlign: "center",
                                color: "#1C252E",
                            }}
                        >
                            Verification
                        </span>
                    </div>


                    {/* =======================
                   Address  CARD
                ======================= */}
                    <div
                        className="absolute left-[1050px] top-[175px]"
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
                        <div className="flex flex-col items-start  gap-[20px]"
                        >
                            {/* Frame 336 - Location */}
                            <div className="flex items-center  gap-[14px]">
                                {/* Location Icon */}
                                <div className="relative w-[24px] h-[24px]">
                                    {/* replace with your actual icon */}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C14.3869 2 16.6761 2.94821 18.364 4.63604C20.0518 6.32387 21 8.61305 21 11C21 14.074 19.324 16.59 17.558 18.395C16.6755 19.2869 15.7128 20.0956 14.682 20.811L14.256 21.101L14.056 21.234L13.679 21.474L13.343 21.679L12.927 21.921C12.6445 22.0818 12.325 22.1663 12 22.1663C11.675 22.1663 11.3555 22.0818 11.073 21.921L10.657 21.679L10.137 21.359L9.945 21.234L9.535 20.961C8.42298 20.2083 7.38707 19.3489 6.442 18.395C4.676 16.588 3 14.074 3 11C3 8.61305 3.94821 6.32387 5.63604 4.63604C7.32387 2.94821 9.61305 2 12 2ZM12 8C11.606 8 11.2159 8.0776 10.8519 8.22836C10.488 8.37913 10.1573 8.6001 9.87868 8.87868C9.6001 9.15726 9.37913 9.48797 9.22836 9.85195C9.0776 10.2159 9 10.606 9 11C9 11.394 9.0776 11.7841 9.22836 12.1481C9.37913 12.512 9.6001 12.8427 9.87868 13.1213C10.1573 13.3999 10.488 13.6209 10.8519 13.7716C11.2159 13.9224 11.606 14 12 14C12.7956 14 13.5587 13.6839 14.1213 13.1213C14.6839 12.5587 15 11.7956 15 11C15 10.2044 14.6839 9.44129 14.1213 8.87868C13.5587 8.31607 12.7956 8 12 8Z" fill="#1E1E1E" />
                                    </svg>
                                </div>
                                {/* Address Label */}
                                <span className="text-[14px] leading-[22px] text-[#1E1E1E]">
                                    {company?.addresses && company.addresses.length > 0
                                        ? company.addresses.map((a) => a.address).join(" , ")
                                        : company?.address || "No address available"}
                                </span>
                            </div>

                            {/* Frame 337 - Phone */}
                            <div className="flex items-center gap-[14px]">
                                {/* Phone Icon */}
                                <div className="relative w-[32px] h-[32px]">
                                    {/* replace with your actual icon */}
                                    <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.7425 14.5413L16.1358 15.1453C16.1358 15.1453 14.6918 16.58 10.7518 12.6626C6.81181 8.74531 8.25581 7.31064 8.25581 7.31064L8.63714 6.92931C9.57981 5.99331 9.66914 4.48931 8.84647 3.39064L7.16647 1.14664C6.14781 -0.213361 4.18114 -0.393361 3.01448 0.766639L0.921142 2.84664C0.343808 3.42264 -0.0428587 4.16664 0.003808 4.99331C0.123808 7.10931 1.08114 11.66 6.41981 16.9693C12.0825 22.5986 17.3958 22.8226 19.5678 22.62C20.2558 22.556 20.8531 22.2066 21.3345 21.7266L23.2278 19.844C24.5078 18.5733 24.1478 16.3933 22.5105 15.504L19.9638 14.1186C18.8891 13.5346 17.5825 13.7066 16.7425 14.5413Z" fill="#1E1E1E" />
                                    </svg>
                                </div>
                                {/* Phone Label */}
                                <span className="text-[14px] leading-[22px] text-[#1E1E1E]">
                                    {company?.addresses && company.addresses.length > 0
                                        ? company.addresses.map((a) => a.phoneNumber).filter(Boolean).join(" , ")
                                        : company?.phoneNumber || "No phone available"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* =======================
                   Profile Ranking 
                ======================= */}
                    <div
                        style={{
                            position: "absolute",
                            height: "260px",
                            width: "500px",
                            left: "70px",
                            top: "355px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "row", // Row layout for ranking + programs side by side
                            gap: "24px",
                        }}
                    >
                        {/* Profile Ranking Section */}
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "250px",
                                height: "260px",
                            }}
                        >
                            {/* Background number */}
                            <div
                                style={{
                                    fontFamily: "Barlow, sans-serif",
                                    fontWeight: 800,
                                    fontSize: "200px",
                                    lineHeight: "175px",
                                    color: "rgba(23, 23, 23, 0.32)",
                                    width: "225px",
                                    height: "175px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {company ? (company.profileRanking || 0) : "N/A"}
                            </div>

                            {/* Label */}
                            <h4
                                style={{
                                    position: "absolute",
                                    left: "70px",
                                    top: "85px",
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "24px",
                                    lineHeight: "36px",
                                    color: "#1E1E1E",
                                }}
                            >
                                Profile Ranking
                            </h4>

                            {/* Progress */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    gap: "8px",
                                    width: "220px",
                                    height: "81px",
                                    padding: "5px",
                                    backdropFilter: "blur(17px)",
                                    borderRadius: "21px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "154px",
                                        height: "19px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "'Public Sans', sans-serif",
                                            fontWeight: 700,
                                            fontSize: "12px",
                                            lineHeight: "18px",
                                            textTransform: "uppercase",
                                            color: "#1E1E1E",
                                        }}
                                    >
                                        Profile Complete
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "'Public Sans', sans-serif",
                                            fontWeight: 700,
                                            fontSize: "12px",
                                            lineHeight: "18px",
                                            textTransform: "uppercase",
                                            color: "#1E1E1E",
                                        }}
                                    >
                                        {company?.progress || 0}%
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div
                                    style={{
                                        position: "relative",
                                        width: "220px",
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
                                            width: `${company?.progress || 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Programs Section */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "16px",
                                width: "208px",
                            }}
                        >
                            {/* Programs Label */}
                            <div
                                style={{
                                    width: "208px",
                                    height: "28px",
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "24px",
                                    lineHeight: "36px",
                                    color: "#000000",
                                }}
                            >
                                <h4 className="font-publicSans font-bold text-[24px] leading-[36px] text-black m-0">
                                    Programs
                                </h4>
                            </div>

                            {/* Programs Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    alignItems: "flex-start",
                                    gap: "16px",
                                    width: "208px",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    paddingRight: "4px",
                                }}
                            >
                                {(company?.programs && company.programs.length > 0) ? company.programs.map((program: any, index: number) => (
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
                                        {program?.name || program}
                                    </div>
                                )) : (
                                    <span className="text-[14px] leading-[22px] text-[#1E1E1E]">No programs available</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* =======================
                Current Employee
                ======================= */}
                    <div
                        className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden no-scrollbar"
                        style={{
                            position: "absolute",
                            width: "535px",
                            height: "295px",
                            left: "45px",
                            top: "690px",
                            background: "#FFFFFF",
                            boxShadow:
                                "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                            borderRadius: "24px",
                            padding: "16px",

                        }}
                    >
                        {company?.employees && company.employees.length > 0 ? (
                            company.employees.slice(0, 6).map((employee) => {
                                const student = employee.student;
                                return (
                                    <div
                                        key={employee.id}
                                        className="flex-shrink-0"
                                        style={{
                                            transform: "scale(0.6)",
                                            transformOrigin: "top left",
                                            marginRight: "-120px",
                                        }}
                                    >
                                        <div>Employee: {student?.name || "Employee"}</div>
                                    </div>
                                );
                            })
                        ) : (
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#919EAB",
                                    fontSize: "14px",
                                    textAlign: "center",
                                    padding: "24px",
                                }}
                            >
                                No employees assigned to this company yet
                            </div>
                        )}
                    </div>



                    {/* =======================
                        Documents
                ======================= */}
                    <div
                        style={{
                            position: "absolute",
                            width: "329px",
                            height: "535.33px",
                            left: "605px",
                            top: "450px",
                            background: "#FFFFFF",
                            boxShadow:
                                "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                            borderRadius: "24px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "24px",
                            boxSizing: "border-box",
                        }}
                    >
                        <div style={{ width: "100%", maxWidth: "420px" }}>
                            {/* Upload Box */}
                            <div
                                onClick={() => document.getElementById("file-input")?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragging(false);
                                    handleFiles(Array.from(e.dataTransfer.files));
                                }}
                                style={{
                                    height: "130px",
                                    borderRadius: "16px",
                                    background: dragging ? "#FFF7CC" : "#F5F5F5",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <input
                                    id="file-input"
                                    type="file"
                                    multiple
                                    accept="image/*,application/pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) =>
                                        e.target.files && handleFiles(Array.from(e.target.files))
                                    }
                                />

                                <img
                                    src="/illustrations/upload.svg"
                                    alt="Upload"
                                    style={{ width: "90px", pointerEvents: "none" }}
                                />

                                <div style={{ fontWeight: 600, marginTop: "8px" }}>
                                    Drop or select files
                                </div>
                            </div>

                            {/* Clear All */}
                            {files.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    style={{
                                        marginTop: "12px",
                                        background: "none",
                                        border: "none",
                                        color: "#D32F2F",
                                        cursor: "pointer",
                                    }}
                                >
                                    Clear all
                                </button>
                            )}

                            {/* File List */}
                            <div
                                style={{
                                    marginTop: "16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                    overflowY: "auto",           // enable vertical scroll
                                    maxHeight: "300px",           // adjust according to your container
                                    width: "100%",                // fill parent width
                                    paddingRight: "4px",          // optional: for scrollbar space
                                }}
                            >
                                {files.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            padding: "12px",
                                            borderRadius: "12px",

                                        }}
                                    >
                                        {/* Preview */}
                                        {item.preview ? (
                                            <img
                                                src={item.preview}
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    borderRadius: "8px",
                                                    background: "#D32F2F",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19.2895 24.2922H9.66699V25.5217C9.66699 25.9801 9.84904 26.4196 10.1731 26.7437C10.4972 27.0678 10.9367 27.2499 11.395 27.25H24.439C24.8973 27.2499 25.3368 27.0679 25.6608 26.7438C25.9848 26.4198 26.1669 25.9803 26.167 25.522V10.8123L20.1045 4.75H11.395C10.9367 4.75 10.4972 4.93206 10.1731 5.25612C9.84905 5.58018 9.66699 6.01971 9.66699 6.478V15.3322H19.2895C19.5056 15.3322 19.7129 15.4181 19.8658 15.571C20.0186 15.7238 20.1045 15.9311 20.1045 16.1472V23.4772C20.1044 23.6934 20.0185 23.9006 19.8657 24.0535C19.7129 24.2063 19.5056 24.2922 19.2895 24.2922Z" fill="#EAEAE4" />
                                                    <path d="M26.167 10.8123L20.1045 4.75V9.08425C20.1046 9.54252 20.2866 9.98201 20.6107 10.3061C20.9347 10.6301 21.3742 10.8122 21.8325 10.8123H26.167Z" fill="#BABAB9" />
                                                    <path d="M19.2895 15.332H6.64703C6.19692 15.332 5.83203 15.6969 5.83203 16.147V23.477C5.83203 23.9271 6.19692 24.292 6.64703 24.292H19.2895C19.7396 24.292 20.1045 23.9271 20.1045 23.477V16.147C20.1045 15.6969 19.7396 15.332 19.2895 15.332Z" fill="#F24646" />
                                                    <path d="M9.20891 20.4443C9.99091 20.4443 10.5684 19.9405 10.5684 19.2265C10.5684 18.5125 9.99091 18.0088 9.20891 18.0088H7.58691V21.615H8.35866V20.4443H9.20891ZM8.35891 18.7175H9.12416C9.50741 18.7175 9.76966 18.9175 9.76966 19.2265C9.76966 19.5355 9.50741 19.7358 9.12416 19.7358H8.35866L8.35891 18.7175Z" fill="#FFFCEE" />
                                                    <path d="M14.7102 19.8098C14.7102 18.7548 13.8495 18.0098 12.637 18.0098H11.3457V21.6155H12.637C13.849 21.6155 14.7102 20.8648 14.7102 19.8098ZM12.7367 20.9123H12.1172V18.7123H12.7367C12.8871 18.7026 13.0378 18.724 13.1796 18.7749C13.3214 18.8258 13.4513 18.9053 13.5612 19.0084C13.6711 19.1114 13.7587 19.236 13.8186 19.3742C13.8785 19.5125 13.9093 19.6616 13.9093 19.8123C13.9093 19.9629 13.8785 20.112 13.8186 20.2503C13.7587 20.3886 13.6711 20.5131 13.5612 20.6162C13.4513 20.7193 13.3214 20.7987 13.1796 20.8497C13.0378 20.9006 12.8871 20.9219 12.7367 20.9123Z" fill="#FFFCEE" />
                                                    <path d="M18.349 18.707V18.0088H15.5723V21.615H16.349V20.1873H18.16V19.489H16.349V18.707H18.349Z" fill="#FFFCEE" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600 }}>
                                                {item.file.name.length > 15
                                                    ? item.file.name.slice(0, 15) + "..."
                                                    : item.file.name}
                                            </div>
                                            <div style={{ fontSize: "12px", color: "rgba(23,23,23,0.48)" }}>
                                                {(item.file.size / 1024 / 1024).toFixed(2)} MB
                                            </div>

                                            {/* Progress */}
                                            <div
                                                style={{
                                                    height: "6px",
                                                    background: "#E0E0E0",
                                                    borderRadius: "4px",
                                                    marginTop: "6px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: `${item.progress}%`,
                                                        height: "100%",
                                                        background: item.error
                                                            ? "#D32F2F"
                                                            : item.uploading
                                                                ? "#FFAB00"
                                                                : "#00C853",
                                                    }}
                                                />
                                            </div>

                                            {item.error && (
                                                <div style={{ color: "#D32F2F", fontSize: "12px" }}>
                                                    {item.error}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            {item.error && (
                                                <button
                                                    onClick={() => simulateUpload(index)}
                                                    style={{
                                                        border: "none",
                                                        background: "#FFAB00",
                                                        borderRadius: "6px",
                                                        padding: "4px 8px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Retry
                                                </button>
                                            )}

                                            <button
                                                onClick={() => removeFile(index)}
                                                style={{
                                                    border: "none",
                                                    background: "#D32F2F",
                                                    color: "#FFF",
                                                    borderRadius: "55px",
                                                    padding: "5px 10px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* =======================
                    Review CARD
                ======================= */}
                    <div
                        style={{
                            position: "absolute",
                            height: "535.33px",
                            width: "329px",
                            left: "965px",
                            top: "450px",
                            background: "#FFFFFF",
                            boxShadow:
                                "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                            borderRadius: "24px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            padding: "16px",
                            boxSizing: "border-box",
                        }}
                    >
                        <h4
                            style={{
                                fontFamily: "'Public Sans', sans-serif",
                                fontWeight: 700,
                                fontSize: "18px",
                                marginBottom: "12px",
                            }}
                        >
                            Reviews
                        </h4>

                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                             {reviews.length === 0 ? (
                            <div
                                style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#919EAB",
                                fontSize: "14px",
                                textAlign: "center",
                                padding: "24px",
                                }}
                            >
                                No reviews available
                            </div>
                            ) : (
                            reviews.map((review) => (
                                <div
                                    key={review.id}
                                    style={{
                                        padding: "12px",
                                        borderRadius: "12px",

                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                    }}
                                >
                                    {/* Reviewer Info + Rating Stars */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        {/* Reviewer Info */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <img
                                                src={review.studentImage || "/default-avatar.png"}
                                                alt={review.name}
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: 600,
                                                        fontSize: "14px",
                                                        color: "#1E1E1E",
                                                    }}
                                                >
                                                    {review.name}
                                                </div>
                                                <div style={{ fontSize: "12px", color: "#888" }}>
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rating Stars with SVG */}
                                        <div style={{ display: "flex", gap: "4px" }}>
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <span key={i}>
                                                    {i < review.rating ? (
                                                        // Filled Star
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M14.6336 17.4998C14.5004 17.5004 14.3689 17.4689 14.2503 17.4082L10.0003 15.1832L5.75029 17.4082C5.61228 17.4807 5.45669 17.5131 5.30119 17.5017C5.14569 17.4902 4.99652 17.4354 4.87065 17.3433C4.74477 17.2513 4.64724 17.1258 4.58914 16.9811C4.53103 16.8365 4.51469 16.6784 4.54196 16.5248L5.37529 11.8332L1.94196 8.49984C1.83484 8.39295 1.75885 8.2589 1.72215 8.11209C1.68544 7.96528 1.68941 7.81124 1.73362 7.66651C1.78192 7.51841 1.87077 7.38681 1.99008 7.28664C2.10939 7.18648 2.25439 7.12177 2.40862 7.09984L7.15862 6.40818L9.25029 2.13318C9.31853 1.99229 9.42507 1.87346 9.55772 1.79032C9.69036 1.70718 9.84374 1.66309 10.0003 1.66309C10.1568 1.66309 10.3102 1.70718 10.4429 1.79032C10.5755 1.87346 10.6821 1.99229 10.7503 2.13318L12.867 6.39984L17.617 7.09151C17.7712 7.11343 17.9162 7.17815 18.0355 7.27831C18.1548 7.37847 18.2437 7.51007 18.292 7.65818C18.3362 7.80291 18.3401 7.95694 18.3034 8.10376C18.2667 8.25057 18.1907 8.38461 18.0836 8.49151L14.6503 11.8248L15.4836 16.5165C15.5134 16.6727 15.4978 16.8342 15.4387 16.9819C15.3797 17.1295 15.2796 17.2572 15.1503 17.3498C14.9994 17.4556 14.8177 17.5083 14.6336 17.4998Z" fill="#FFAB00" />
                                                        </svg>
                                                    ) : (
                                                        // Empty Star
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <g opacity="0.48">
                                                                <path d="M14.6336 17.4998C14.5004 17.5004 14.3689 17.4689 14.2503 17.4082L10.0003 15.1832L5.75029 17.4082C5.61228 17.4807 5.45669 17.5131 5.30119 17.5017C5.14569 17.4902 4.99652 17.4354 4.87065 17.3433C4.74477 17.2513 4.64724 17.1258 4.58914 16.9811C4.53103 16.8365 4.51469 16.6784 4.54196 16.5248L5.37529 11.8332L1.94196 8.49984C1.83484 8.39295 1.75885 8.2589 1.72215 8.11209C1.68544 7.96528 1.68941 7.81124 1.73362 7.66651C1.78192 7.51841 1.87077 7.38681 1.99008 7.28664C2.10939 7.18648 2.25439 7.12177 2.40862 7.09984L7.15862 6.40818L9.25029 2.13318C9.31853 1.99229 9.42507 1.87346 9.55772 1.79032C9.69036 1.70718 9.84374 1.66309 10.0003 1.66309C10.1568 1.66309 10.3102 1.70718 10.4429 1.79032C10.5755 1.87346 10.6821 1.99229 10.7503 2.13318L12.867 6.39984L17.617 7.09151C17.7712 7.11343 17.9162 7.17815 18.0355 7.27831C18.1548 7.37847 18.2437 7.51007 18.292 7.65818C18.3362 7.80291 18.3401 7.95694 18.3034 8.10376C18.2667 8.25057 18.1907 8.38461 18.0836 8.49151L14.6503 11.8248L15.4836 16.5165C15.5134 16.6727 15.4978 16.8342 15.4387 16.9819C15.3797 17.1295 15.2796 17.2572 15.1503 17.3498C14.9994 17.4556 14.8177 17.5083 14.6336 17.4998Z" fill="#919EAB" />
                                                            </g>
                                                        </svg>
                                                    )}
                                                </span>
                                            ))}
                                        </div>

                                    </div>

                                    {/* Review Text */}
                                    <div style={{ fontSize: "13px", color: "#333" }}>{review.review}</div>
                                </div>
                            )))}

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
                        {company?.image ? (
                            <img
                                src={company.image}
                                alt={company.name}
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

                    {/* Company Info */}
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

                        {/* Corporate Title Row */}
                        <div className="flex items-center justify-between w-full">
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

                            {/* Status Badge */}
                            <span className="inline-block px-4 py-1 bg-green-200 text-green-600 font-semibold rounded-lg skew-x-[-12deg]">
                                <span className="inline-block skew-x-[12deg]">
                                    {company?.status || "N/A"}
                                </span>
                            </span>
                        </div>


                        <h4 className="font-normal text-base leading-6 text-black">{company?.corporate}</h4>

                        {/* Profile Ranking Section */}
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "250px",
                                height: "260px",
                            }}
                        >

                            {/* Background number */}
                            <div
                                style={{
                                    fontFamily: "Barlow, sans-serif",
                                    fontWeight: 800,
                                    fontSize: "200px",
                                    lineHeight: "175px",
                                    color: "rgba(23, 23, 23, 0.32)",
                                    width: "225px",
                                    height: "175px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {company ? company.profileRanking : "N/A"}
                            </div>

                            {/* Label */}
                            <h4
                                style={{
                                    position: "absolute",
                                    left: "50px",
                                    top: "85px",
                                    fontFamily: "'Public Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "24px",
                                    lineHeight: "36px",
                                    color: "#1E1E1E",
                                }}
                            >
                                Profile Ranking
                            </h4>

                            {/* Progress */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    gap: "8px",
                                    width: "220px",
                                    height: "81px",
                                    padding: "5px",
                                    backdropFilter: "blur(17px)",
                                    borderRadius: "21px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "220px",
                                        height: "19px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "'Public Sans', sans-serif",
                                            fontWeight: 700,
                                            fontSize: "12px",
                                            lineHeight: "18px",
                                            textTransform: "uppercase",
                                            color: "#1E1E1E",
                                        }}
                                    >
                                        Profile Complete
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "'Public Sans', sans-serif",
                                            fontWeight: 700,
                                            fontSize: "12px",
                                            lineHeight: "18px",
                                            textTransform: "uppercase",
                                            color: "#1E1E1E",
                                        }}
                                    >
                                        {company?.progress}%
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div
                                    style={{
                                        position: "relative",
                                        width: "220px",
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
                                            width: `${company?.progress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
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
                            <div className="flex flex-col items-start  gap-[20px]"
                            >
                                {/* Frame 336 - Location */}
                                <div className="flex items-center  gap-[14px]">
                                    {/* Location Icon */}
                                    <div className="relative w-[24px] h-[24px]">
                                        {/* replace with your actual icon */}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C14.3869 2 16.6761 2.94821 18.364 4.63604C20.0518 6.32387 21 8.61305 21 11C21 14.074 19.324 16.59 17.558 18.395C16.6755 19.2869 15.7128 20.0956 14.682 20.811L14.256 21.101L14.056 21.234L13.679 21.474L13.343 21.679L12.927 21.921C12.6445 22.0818 12.325 22.1663 12 22.1663C11.675 22.1663 11.3555 22.0818 11.073 21.921L10.657 21.679L10.137 21.359L9.945 21.234L9.535 20.961C8.42298 20.2083 7.38707 19.3489 6.442 18.395C4.676 16.588 3 14.074 3 11C3 8.61305 3.94821 6.32387 5.63604 4.63604C7.32387 2.94821 9.61305 2 12 2ZM12 8C11.606 8 11.2159 8.0776 10.8519 8.22836C10.488 8.37913 10.1573 8.6001 9.87868 8.87868C9.6001 9.15726 9.37913 9.48797 9.22836 9.85195C9.0776 10.2159 9 10.606 9 11C9 11.394 9.0776 11.7841 9.22836 12.1481C9.37913 12.512 9.6001 12.8427 9.87868 13.1213C10.1573 13.3999 10.488 13.6209 10.8519 13.7716C11.2159 13.9224 11.606 14 12 14C12.7956 14 13.5587 13.6839 14.1213 13.1213C14.6839 12.5587 15 11.7956 15 11C15 10.2044 14.6839 9.44129 14.1213 8.87868C13.5587 8.31607 12.7956 8 12 8Z" fill="#1E1E1E" />
                                        </svg>
                                    </div>
                                    {/* Address Label */}
                                    <span className="text-[14px] leading-[22px] text-[#1E1E1E]">
                                        {company?.addresses && company.addresses.length > 0
                                            ? company.addresses.map((a) => a.address).join(" , ")
                                            : company?.address || "No address available"}
                                    </span>
                                </div>

                                {/* Frame 337 - Phone */}
                                <div className="flex items-center gap-[14px]">
                                    {/* Phone Icon */}
                                    <div className="relative w-[32px] h-[32px]">
                                        {/* replace with your actual icon */}
                                        <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.7425 14.5413L16.1358 15.1453C16.1358 15.1453 14.6918 16.58 10.7518 12.6626C6.81181 8.74531 8.25581 7.31064 8.25581 7.31064L8.63714 6.92931C9.57981 5.99331 9.66914 4.48931 8.84647 3.39064L7.16647 1.14664C6.14781 -0.213361 4.18114 -0.393361 3.01448 0.766639L0.921142 2.84664C0.343808 3.42264 -0.0428587 4.16664 0.003808 4.99331C0.123808 7.10931 1.08114 11.66 6.41981 16.9693C12.0825 22.5986 17.3958 22.8226 19.5678 22.62C20.2558 22.556 20.8531 22.2066 21.3345 21.7266L23.2278 19.844C24.5078 18.5733 24.1478 16.3933 22.5105 15.504L19.9638 14.1186C18.8891 13.5346 17.5825 13.7066 16.7425 14.5413Z" fill="#1E1E1E" />
                                        </svg>
                                    </div>
                                    {/* Phone Label */}
                                    <span className="text-[14px] leading-[22px] text-[#1E1E1E]">
                                        {company?.addresses && company.addresses.length > 0
                                            ? company.addresses.map((a) => a.phoneNumber).filter(Boolean).join(" , ")
                                            : company?.phoneNumber || "No phone available"}
                                    </span>
                                </div>
                            </div>
                        </div>



                        {/* Programs Section */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "16px",
                                width: "208px",
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
                                <h6 className="font-semibold text-[20px] leading-[28px] text-black">
                                    Programs
                                </h6>
                            </div>

                            {/* Programs Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    alignItems: "flex-start",
                                    gap: "16px",
                                    width: "208px",
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    paddingRight: "4px",
                                }}
                            >
                                {(company?.programs && company.programs.length > 0) ? company.programs.map((program: any, index: number) => (
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
                                        {program?.name || program}
                                    </div>
                                )) : (
                                    <span className="text-[14px] leading-[22px] text-[#1E1E1E]">No programs available</span>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* =======================
                        Review CARD
                    ======================= */}
                    <div
                        style={{
                            height: "530px",
                            background: "#FFFFFF",
                            boxShadow:
                                "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                            borderRadius: "24px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            padding: "16px",
                            boxSizing: "border-box",
                        }}
                    >
                        <h4
                            style={{
                                fontFamily: "'Public Sans', sans-serif",
                                fontWeight: 700,
                                fontSize: "18px",
                                marginBottom: "12px",
                            }}
                        >
                            Reviews
                        </h4>

                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                             {reviews.length === 0 ? (
                            <div
                                style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#919EAB",
                                fontSize: "14px",
                                textAlign: "center",
                                padding: "24px",
                                }}
                            >
                                No reviews available
                            </div>
                            ) : (
                            reviews.map((review) => (
                                <div
                                    key={review.id}
                                    style={{
                                        padding: "12px",
                                        borderRadius: "12px",

                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "6px",
                                    }}
                                >
                                    {/* Reviewer Info + Rating Stars */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        {/* Reviewer Info */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <img
                                                src={review.studentImage || "/default-avatar.png"}
                                                alt={review.name}
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: 600,
                                                        fontSize: "14px",
                                                        color: "#1E1E1E",
                                                    }}
                                                >
                                                    {review.name}
                                                </div>
                                                <div style={{ fontSize: "12px", color: "#888" }}>
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rating Stars with SVG */}
                                        <div style={{ display: "flex", gap: "4px" }}>
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <span key={i}>
                                                    {i < review.rating ? (
                                                        // Filled Star
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M14.6336 17.4998C14.5004 17.5004 14.3689 17.4689 14.2503 17.4082L10.0003 15.1832L5.75029 17.4082C5.61228 17.4807 5.45669 17.5131 5.30119 17.5017C5.14569 17.4902 4.99652 17.4354 4.87065 17.3433C4.74477 17.2513 4.64724 17.1258 4.58914 16.9811C4.53103 16.8365 4.51469 16.6784 4.54196 16.5248L5.37529 11.8332L1.94196 8.49984C1.83484 8.39295 1.75885 8.2589 1.72215 8.11209C1.68544 7.96528 1.68941 7.81124 1.73362 7.66651C1.78192 7.51841 1.87077 7.38681 1.99008 7.28664C2.10939 7.18648 2.25439 7.12177 2.40862 7.09984L7.15862 6.40818L9.25029 2.13318C9.31853 1.99229 9.42507 1.87346 9.55772 1.79032C9.69036 1.70718 9.84374 1.66309 10.0003 1.66309C10.1568 1.66309 10.3102 1.70718 10.4429 1.79032C10.5755 1.87346 10.6821 1.99229 10.7503 2.13318L12.867 6.39984L17.617 7.09151C17.7712 7.11343 17.9162 7.17815 18.0355 7.27831C18.1548 7.37847 18.2437 7.51007 18.292 7.65818C18.3362 7.80291 18.3401 7.95694 18.3034 8.10376C18.2667 8.25057 18.1907 8.38461 18.0836 8.49151L14.6503 11.8248L15.4836 16.5165C15.5134 16.6727 15.4978 16.8342 15.4387 16.9819C15.3797 17.1295 15.2796 17.2572 15.1503 17.3498C14.9994 17.4556 14.8177 17.5083 14.6336 17.4998Z" fill="#FFAB00" />
                                                        </svg>
                                                    ) : (
                                                        // Empty Star
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <g opacity="0.48">
                                                                <path d="M14.6336 17.4998C14.5004 17.5004 14.3689 17.4689 14.2503 17.4082L10.0003 15.1832L5.75029 17.4082C5.61228 17.4807 5.45669 17.5131 5.30119 17.5017C5.14569 17.4902 4.99652 17.4354 4.87065 17.3433C4.74477 17.2513 4.64724 17.1258 4.58914 16.9811C4.53103 16.8365 4.51469 16.6784 4.54196 16.5248L5.37529 11.8332L1.94196 8.49984C1.83484 8.39295 1.75885 8.2589 1.72215 8.11209C1.68544 7.96528 1.68941 7.81124 1.73362 7.66651C1.78192 7.51841 1.87077 7.38681 1.99008 7.28664C2.10939 7.18648 2.25439 7.12177 2.40862 7.09984L7.15862 6.40818L9.25029 2.13318C9.31853 1.99229 9.42507 1.87346 9.55772 1.79032C9.69036 1.70718 9.84374 1.66309 10.0003 1.66309C10.1568 1.66309 10.3102 1.70718 10.4429 1.79032C10.5755 1.87346 10.6821 1.99229 10.7503 2.13318L12.867 6.39984L17.617 7.09151C17.7712 7.11343 17.9162 7.17815 18.0355 7.27831C18.1548 7.37847 18.2437 7.51007 18.292 7.65818C18.3362 7.80291 18.3401 7.95694 18.3034 8.10376C18.2667 8.25057 18.1907 8.38461 18.0836 8.49151L14.6503 11.8248L15.4836 16.5165C15.5134 16.6727 15.4978 16.8342 15.4387 16.9819C15.3797 17.1295 15.2796 17.2572 15.1503 17.3498C14.9994 17.4556 14.8177 17.5083 14.6336 17.4998Z" fill="#919EAB" />
                                                            </g>
                                                        </svg>
                                                    )}
                                                </span>
                                            ))}
                                        </div>

                                    </div>

                                    {/* Review Text */}
                                    <div style={{ fontSize: "13px", color: "#333" }}>{review.review}</div>
                                </div>
                            )))}

                        </div>
                    </div>
                    {/* =======================
                            Documents
                    ======================= */}
                    <div
                        style={{
                            height: "520px",
                            background: "#FFFFFF",
                            boxShadow:
                                "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                            borderRadius: "24px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "24px",
                            boxSizing: "border-box",
                        }}
                    >
                        <div style={{ width: "100%", maxWidth: "420px" }}>
                            {/* Upload Box */}
                            <div
                                onClick={() => document.getElementById("file-input")?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragging(false);
                                    handleFiles(Array.from(e.dataTransfer.files));
                                }}
                                style={{
                                    height: "130px",
                                    borderRadius: "16px",
                                    background: dragging ? "#FFF7CC" : "#F5F5F5",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <input
                                    id="file-input"
                                    type="file"
                                    multiple
                                    accept="image/*,application/pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) =>
                                        e.target.files && handleFiles(Array.from(e.target.files))
                                    }
                                />

                                <img
                                    src="/illustrations/upload.svg"
                                    alt="Upload"
                                    style={{ width: "90px", pointerEvents: "none" }}
                                />

                                <div style={{ fontWeight: 600, marginTop: "8px" }}>
                                    Drop or select files
                                </div>
                            </div>

                            {/* Clear All */}
                            {files.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    style={{
                                        marginTop: "12px",
                                        background: "none",
                                        border: "none",
                                        color: "#D32F2F",
                                        cursor: "pointer",
                                    }}
                                >
                                    Clear all
                                </button>
                            )}

                            {/* File List */}
                            <div
                                style={{
                                    marginTop: "16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                    overflowY: "auto",           // enable vertical scroll
                                    maxHeight: "300px",           // adjust according to your container
                                    width: "100%",                // fill parent width
                                    paddingRight: "4px",          // optional: for scrollbar space
                                }}
                            >
                                {files.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            padding: "12px",
                                            borderRadius: "12px",

                                        }}
                                    >
                                        {/* Preview */}
                                        {item.preview ? (
                                            <img
                                                src={item.preview}
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    borderRadius: "8px",
                                                    background: "#D32F2F",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19.2895 24.2922H9.66699V25.5217C9.66699 25.9801 9.84904 26.4196 10.1731 26.7437C10.4972 27.0678 10.9367 27.2499 11.395 27.25H24.439C24.8973 27.2499 25.3368 27.0679 25.6608 26.7438C25.9848 26.4198 26.1669 25.9803 26.167 25.522V10.8123L20.1045 4.75H11.395C10.9367 4.75 10.4972 4.93206 10.1731 5.25612C9.84905 5.58018 9.66699 6.01971 9.66699 6.478V15.3322H19.2895C19.5056 15.3322 19.7129 15.4181 19.8658 15.571C20.0186 15.7238 20.1045 15.9311 20.1045 16.1472V23.4772C20.1044 23.6934 20.0185 23.9006 19.8657 24.0535C19.7129 24.2063 19.5056 24.2922 19.2895 24.2922Z" fill="#EAEAE4" />
                                                    <path d="M26.167 10.8123L20.1045 4.75V9.08425C20.1046 9.54252 20.2866 9.98201 20.6107 10.3061C20.9347 10.6301 21.3742 10.8122 21.8325 10.8123H26.167Z" fill="#BABAB9" />
                                                    <path d="M19.2895 15.332H6.64703C6.19692 15.332 5.83203 15.6969 5.83203 16.147V23.477C5.83203 23.9271 6.19692 24.292 6.64703 24.292H19.2895C19.7396 24.292 20.1045 23.9271 20.1045 23.477V16.147C20.1045 15.6969 19.7396 15.332 19.2895 15.332Z" fill="#F24646" />
                                                    <path d="M9.20891 20.4443C9.99091 20.4443 10.5684 19.9405 10.5684 19.2265C10.5684 18.5125 9.99091 18.0088 9.20891 18.0088H7.58691V21.615H8.35866V20.4443H9.20891ZM8.35891 18.7175H9.12416C9.50741 18.7175 9.76966 18.9175 9.76966 19.2265C9.76966 19.5355 9.50741 19.7358 9.12416 19.7358H8.35866L8.35891 18.7175Z" fill="#FFFCEE" />
                                                    <path d="M14.7102 19.8098C14.7102 18.7548 13.8495 18.0098 12.637 18.0098H11.3457V21.6155H12.637C13.849 21.6155 14.7102 20.8648 14.7102 19.8098ZM12.7367 20.9123H12.1172V18.7123H12.7367C12.8871 18.7026 13.0378 18.724 13.1796 18.7749C13.3214 18.8258 13.4513 18.9053 13.5612 19.0084C13.6711 19.1114 13.7587 19.236 13.8186 19.3742C13.8785 19.5125 13.9093 19.6616 13.9093 19.8123C13.9093 19.9629 13.8785 20.112 13.8186 20.2503C13.7587 20.3886 13.6711 20.5131 13.5612 20.6162C13.4513 20.7193 13.3214 20.7987 13.1796 20.8497C13.0378 20.9006 12.8871 20.9219 12.7367 20.9123Z" fill="#FFFCEE" />
                                                    <path d="M18.349 18.707V18.0088H15.5723V21.615H16.349V20.1873H18.16V19.489H16.349V18.707H18.349Z" fill="#FFFCEE" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600 }}>
                                                {item.file.name.length > 15
                                                    ? item.file.name.slice(0, 15) + "..."
                                                    : item.file.name}
                                            </div>
                                            <div style={{ fontSize: "12px", color: "rgba(23,23,23,0.48)" }}>
                                                {(item.file.size / 1024 / 1024).toFixed(2)} MB
                                            </div>

                                            {/* Progress */}
                                            <div
                                                style={{
                                                    height: "6px",
                                                    background: "#E0E0E0",
                                                    borderRadius: "4px",
                                                    marginTop: "6px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: `${item.progress}%`,
                                                        height: "100%",
                                                        background: item.error
                                                            ? "#D32F2F"
                                                            : item.uploading
                                                                ? "#FFAB00"
                                                                : "#00C853",
                                                    }}
                                                />
                                            </div>

                                            {item.error && (
                                                <div style={{ color: "#D32F2F", fontSize: "12px" }}>
                                                    {item.error}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            {item.error && (
                                                <button
                                                    onClick={() => simulateUpload(index)}
                                                    style={{
                                                        border: "none",
                                                        background: "#FFAB00",
                                                        borderRadius: "6px",
                                                        padding: "4px 8px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Retry
                                                </button>
                                            )}

                                            <button
                                                onClick={() => removeFile(index)}
                                                style={{
                                                    border: "none",
                                                    background: "#D32F2F",
                                                    color: "#FFF",
                                                    borderRadius: "55px",
                                                    padding: "5px 10px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* =======================
                        Current Employee
                        ======================= */}
                    <div
                        className="flex flex-row gap-4 overflow-x-auto overflow-y-hidden no-scrollbar"
                        style={{
                            height: "295px",
                            background: "#FFFFFF",
                            boxShadow:
                                "0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)",
                            borderRadius: "24px",
                            padding: "16px",
                        }}
                    >
                        {company?.employees && company.employees.length > 0 ? (
                            company.employees.slice(0, 6).map((employee) => {
                                const student = employee.student;
                                return (
                                    <div
                                        key={employee.id}
                                        className="flex-shrink-0"
                                        style={{
                                            transform: "scale(0.6)",
                                            transformOrigin: "top left",
                                            marginRight: "-120px",
                                        }}
                                    >
                                        <div>Employee: {student?.name || "Employee"}</div>
                                    </div>
                                );
                            })
                        ) : (
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#919EAB",
                                    fontSize: "14px",
                                    textAlign: "center",
                                    padding: "24px",
                                }}
                            >
                                No employees assigned to this company yet
                            </div>
                        )}
                    </div>
                    {/* =======================
                    END MOBILE LAYOUT
                ======================= */}



                </div>

            </div>

        </DashboardLayout>
    );
}
