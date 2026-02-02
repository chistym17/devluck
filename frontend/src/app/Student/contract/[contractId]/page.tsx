"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useRef, useEffect } from "react";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
import { Toast } from "@/src/components/common/Toast";
import { useStudentContractHandler } from "@/src/hooks/studentapihandler/useStudentContractHandler";
import { useStudentPaymentHandler } from "@/src/hooks/studentapihandler/useStudentPaymentHandler";
import { useStudentReviewHandler } from "@/src/hooks/studentapihandler/useStudentReviewHandler";


// Parallelogram Input Component
const ParallelogramInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
}) => (
  <div className="relative w-full sm:w-120 h-[48px]">
    <label
      className="absolute -top-2 left-5 h-[18px] px-3 bg-[#FFEB9C] text-[#1E1E1E] text-xs font-normal select-none flex items-center skew-x-[-12deg] z-20 "
      style={{ borderRadius: "6px" }}
    >
      <span className="skew-x-[2deg]">{label}</span>
    </label>
    <div className="overflow rounded-[12px] h-full w-full">
      <div
        className="h-30 w-full border border-[#1C252E]"
        style={{ transform: "skewX(-2deg)", borderRadius: "12px", background: "transparent" }}
      >
        <div
          style={{
            transform: "skewX(2deg)",
            height: "100%",
            display: "flex",
            alignItems: "flex-start", // Align text at top
            padding: "10px 20px 0", // Top padding so text doesn't touch border
          }}
        >
          {type === "textarea" ? (
            <textarea
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="bg-transparent outline-none w-full resize-none text-[14px] text-[#171717cc] h-full"
            />
          ) : (
            <input
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="bg-transparent outline-none w-full text-[14px] text-[#171717cc]"
            />
          )}
        </div>
      </div>
    </div>
  </div>
);

type PaymentRowProps = {
  payment: {
    id: string;
    transferId?: string;
    nextPayment: string;
    monthlyAllowance: string;
    paymentStatus: string;
  };
};

const PaymentRow = ({ payment }: PaymentRowProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center skew-x-[-12deg] rounded-[8] sm:h-[72px] h-[100px] shadow-lg bg-white hover:bg-gray-50">
        <div className="w-6 h-full flex-none"></div>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 md:flex md:items-center skew-x-[12deg]">
          <div className="flex flex-col justify-center w-[160px]">
            <span className="text-sm font-semibold text-gray-900">{payment.transferId || payment.id}</span>
            <span className="text-xs text-gray-400">Payment ID</span>
          </div>
          <div className="flex flex-col justify-center w-[160px]">
            <span className="text-sm font-semibold text-gray-900">{payment.nextPayment}</span>
            <span className="text-xs text-gray-400">Next Payment</span>
          </div>
          <div className="flex flex-col justify-center w-[160px]">
            <span className="text-sm font-semibold text-gray-900">{payment.monthlyAllowance}</span>
            <span className="text-xs text-gray-400">Amount</span>
          </div>
          <div className="flex flex-col justify-start md:justify-center items-start md:items-center">
            <div
              className={`
                ml-4 px-3 py-1 skew-x-[-12deg] rounded-[8] text-xs font-semibold flex justify-start md:justify-center items-start md:items-center 
                ${payment.paymentStatus === "Paid" ? "bg-[#D3FCD2] border border-[#22C55E] text-[#22C55E]" : ""}
                ${payment.paymentStatus === "Pending" ? "bg-[#DFE3E8] border border-black text-black" : ""}
                ${payment.paymentStatus === "Due" ? "bg-[#FEE2E2] border border-[#EF4444] text-[#EF4444]" : ""}
              `}
            >
              {payment.paymentStatus}
            </div>
            <span className="text-xs text-gray-400">Payment Status</span>
          </div>
        </div>
      </div>
    </div>
  );
};




export default function contractDetailPage() {
    const [review, setReview] = useState("");
    const [starRating, setStarRating] = useState(0);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    
   const { contractId } = useParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"Contract Details" | "Job Details">(
    "Contract Details"
  );

  const { contract, loading, error, getContractById } = useStudentContractHandler();
  const { payments, loading: paymentsLoading, listPayments } = useStudentPaymentHandler();
  const { createReview, loading: reviewLoading } = useStudentReviewHandler();

  useEffect(() => {
    if (contractId && typeof contractId === 'string') {
      getContractById(contractId).catch(console.error);
      listPayments(1, 100, contractId).catch(console.error);
    }
  }, [contractId, getContractById, listPayments]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !contract) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="p-6 text-center ">
            <h2 className="text-xl font-bold">Contract Not Found</h2>
            <p className="text-red-500 mt-2">{error || "Contract not found"}</p>
            <button
              className="mt-4 px-4 py-2 bg-yellow-300 rounded hover:bg-yellow-400"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const opportunity = (contract as any).opportunity;




  return (
    <>
    <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-6 py-6">

            <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2">
                {/* Tabs */}
                <div className="flex gap-4 mb-6 sm:mt-0 mt-4">
                    {/* Contract Details */}
                    <button
                    onClick={() => setActiveTab("Contract Details")}
                    className={
                        activeTab === "Contract Details"
                        ? "relative w-[180px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center rounded-md transition hover:scale-105"
                        : "w-[180px] h-[40px] flex items-center justify-center text-black/60 hover:text-black"
                    }
                    >
                    <span className={activeTab === "Contract Details" ? "skew-x-[12deg] font-semibold" : ""}>
                        Contract Details
                    </span>
                    </button>

                    {/* Job Details */}
                    <button
                    onClick={() => setActiveTab("Job Details")}
                    className={
                        activeTab === "Job Details"
                        ? "relative w-[180px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center rounded-md transition hover:scale-105"
                        : "w-[180px] h-[40px] flex items-center justify-center text-black/60 hover:text-black"
                    }
                    >
                    <span className={activeTab === "Job Details" ? "skew-x-[12deg] font-semibold" : ""}>
                        Job Details
                    </span>
                    </button>
                </div>

                {/* Content */}
                {activeTab === "Contract Details" && (
                    <div className="flex flex-col gap-6">
                    <section>
                        <h2 className="font-semibold text-xl mb-2">Contract Title</h2>
                        <p>{contract.contractTitle || "N/A"}</p>
                    </section>

                      <section>
                        <h3 className="font-semibold mb-2">Contract Information</h3>
                        <div className="flex flex-col gap-3">
                          <div>
                            <span className="text-gray-600">Contract Number: </span>
                            <span className="font-medium">{contract.inContractNumber || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Duration: </span>
                            <span className="font-medium">{contract.duration || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Monthly Allowance: </span>
                            <span className="font-medium">
                              {contract.currency || "USD"} {contract.monthlyAllowance?.toLocaleString() || "N/A"}
                            </span>
                          </div>
                          {contract.salary && (
                            <div>
                              <span className="text-gray-600">Salary: </span>
                              <span className="font-medium">
                                {contract.currency || "USD"} {contract.salary.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600">Work Location: </span>
                            <span className="font-medium">{contract.workLocation || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Status: </span>
                            <span className="font-medium">{contract.status || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Created Date: </span>
                            <span className="font-medium">
                              {contract.createdDate ? new Date(contract.createdDate).toLocaleDateString() : "N/A"}
                            </span>
                          </div>
                        </div>
                      </section>

                      {contract.note && (
                        <section>
                          <h3 className="font-semibold mb-2">Notes</h3>
                          <p>{contract.note}</p>
                        </section>
                      )}

                      {contract.company && (
                        <section>
                          <h3 className="font-semibold mb-2">Company Information</h3>
                          <div className="flex flex-col gap-2">
                            <div>
                              <span className="text-gray-600">Company: </span>
                              <span className="font-medium">{contract.company.name || "N/A"}</span>
                            </div>
                            {contract.company.location && (
                              <div>
                                <span className="text-gray-600">Location: </span>
                                <span className="font-medium">{contract.company.location}</span>
                              </div>
                            )}
                            {contract.company.industry && (
                              <div>
                                <span className="text-gray-600">Industry: </span>
                                <span className="font-medium">{contract.company.industry}</span>
                              </div>
                            )}
                          </div>
                        </section>
                      )}
                    </div>
                )}

                {activeTab === "Job Details" && (
                    <div className="flex flex-col gap-6">
                    {opportunity ? (
                      <>
                        <section>
                            <h2 className="font-semibold text-xl mb-2">Job Description</h2>
                            <p>{opportunity.details || "No description available"}</p>
                        </section>

                        {opportunity.keyResponsibilities && opportunity.keyResponsibilities.length > 0 && (
                    <section>
                        <h3 className="font-semibold mb-2">Key Responsibilities</h3>
                        <ul className="list-disc pl-6 space-y-1">
                              {opportunity.keyResponsibilities.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                        ))}
                        </ul>
                    </section>
                        )}

                        {opportunity.whyYouWillLoveWorkingHere && opportunity.whyYouWillLoveWorkingHere.length > 0 && (
                    <section>
                        <h3 className="font-semibold mb-2">Why You'll Love Working Here</h3>
                        <ul className="list-disc pl-6 space-y-1">
                              {opportunity.whyYouWillLoveWorkingHere.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                        ))}
                        </ul>
                    </section>
                        )}

                        {opportunity.skills && opportunity.skills.length > 0 && (
                        <section>
                          <h3 className="font-semibold mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                              {opportunity.skills.map((skill: string, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-sm skew-x-[-12deg]  rounded-[6px] border border-black "
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </section>
                        )}

                        {opportunity.benefits && opportunity.benefits.length > 0 && (
                        <section>
                          <h3 className="font-semibold mb-2">Benefits</h3>
                          <div className="flex flex-wrap gap-2">
                              {opportunity.benefits.map((benefit: string, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-sm skew-x-[-12deg]  rounded-[6px] border border-black "
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </section>
                        )}
                      </>
                    ) : (
                      <section>
                        <p className="text-gray-500">No opportunity details available for this contract.</p>
                      </section>
                    )}
                    </div>
                )}
            </div>

            <div className="w-full lg:w-1/2 flex items-start">
                <div className="flex flex-col gap-2 w-full">
                    <div className="w-full ">

                        {/* Payments Label */}
                        <h3 className="text-lg font-semibold mb-4">
                        Payments
                        </h3>

                        {/* Payments List */}
                        <div className="max-h-[400px] overflow-y-auto pr-4 pl-4 overflow-x-hidden ">
                        <div className="flex flex-col gap-2">
                            {paymentsLoading ? (
                              <p className="text-sm text-gray-500">Loading payments...</p>
                            ) : payments.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No payments found for this contract.
                            </p>
                            ) : (
                            payments.map((payment) => (
                                <PaymentRow
                                key={payment.id}
                                payment={payment}
                                />
                            ))
                            )}
                        </div>
                        </div>
                    </div>
                    {/* Payments Label */}
                        <h3 className="text-lg font-semibold mb-4">
                        Review
                        </h3>
                    <div className="flex w-full md:skew-x-[-12deg] max-w-[560px] h-[320px] shadow-lg bg-white sm:items-start items-center rounded-[8] overflow-hidden mt-5 flex-col p-10">

                        <div className="flex flex-col ">
  
                        {/* Input */}
                        <div className="w-full flex justify-center  mb-25">
                            <div className="w-full max-w-md">
                            <ParallelogramInput
                                label="Write your comments"
                                placeholder="Ex: 6 months Project"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                type="textarea"
                            />
                            </div>
                        </div>

                        {/* Stars */}
                        <div className="flex justify-start  md:skew-x-[12deg] gap-2 mb-5">
                            {[1,2,3,4,5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setStarRating(star)}
                                className="text-yellow-400 text-3xl"
                            >
                                {star <= starRating ? "★" : "☆"}
                            </button>
                            ))}
                        </div>

                      {/* Buttons */}
                        <div className="flex w-full flex-row gap-5 sm:flex-row sm:justify-between px-4">
                            <button
                                className="px-6 py-2  border border-black rounded-md transition hover:scale-105 "
                                onClick={() => {
                                setReview("");
                                setStarRating(0);
                                }}
                            >
                              <div className=" md:skew-x-[12deg]">
                                Cancel
                              </div>
                            </button>
                            <button
                                className="px-6 py-2 bg-[#FFEB9C] rounded-md transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={async () => {
                                  if (!review.trim() || starRating === 0) {
                                    setToast({ message: 'Please provide both a review and a rating', type: 'error' });
                                    return;
                                  }
                                  if (!contractId || typeof contractId !== 'string') {
                                    setToast({ message: 'Contract ID is missing', type: 'error' });
                                    return;
                                  }
                                  try {
                                    await createReview({
                                      review: review.trim(),
                                      rating: starRating,
                                      contractId: contractId
                                    });
                                    setReview("");
                                    setStarRating(0);
                                    setToast({ message: 'Review submitted successfully!', type: 'success' });
                                  } catch (error: any) {
                                    setToast({ message: error.message || 'Failed to submit review', type: 'error' });
                                  }
                                }}
                                disabled={reviewLoading || !review.trim() || starRating === 0}
                            > 
                              <div className="md:skew-x-[12deg]">
                                {reviewLoading ? "Sending..." : "Send"}
                                </div>
                            </button>
                        </div>

                        </div>
                    </div>
                </div>
            </div>


    </div>
        </div>

    </DashboardLayout>
    <Toast
      message={toast?.message || ''}
      type={toast?.type || 'success'}
      isVisible={!!toast}
      onClose={() => setToast(null)}
    />
    </>
  );
}
