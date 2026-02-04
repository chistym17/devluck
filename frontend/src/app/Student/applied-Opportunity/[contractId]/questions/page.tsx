"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
import { useStudentOpportunityHandler } from "@/src/hooks/studentapihandler/useStudentOpportunityHandler";
import { useStudentApplicationHandler } from "@/src/hooks/studentapihandler/useStudentApplicationHandler";
import ConfirmSubmitModal from "@/src/components/Student/ConfirmSubmitModal";
import { Toast } from "@/src/components/common/Toast";

interface Question {
  id: string;
  question: string;
  type: "text" | "select" | "checkbox" | "rating";
  options: string[];
  isRequired: boolean;
}

export default function ContractQuestionsPage() {
  const { contractId } = useParams();
  const router = useRouter();
  const opportunityId = contractId as string;

  const { getOpportunityQuestions, loading: questionsLoading } = useStudentOpportunityHandler();
  const { createApplication, loading: submitting } = useStudentApplicationHandler();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] | number }>({});
  const [page, setPage] = useState(0);
  const pageSize = 3;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!opportunityId) return;
    loadQuestions();
  }, [opportunityId]);

  const loadQuestions = async () => {
    try {
      const loadedQuestions = await getOpportunityQuestions(opportunityId);
      setQuestions(loadedQuestions);
      if (loadedQuestions.length === 0) {
        router.push(`/Student/applied-Opportunity/${opportunityId}`);
      }
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to load questions', type: 'error' });
    }
  };


  const handleChange = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: string, option: string) => {
    const current = (answers[questionId] as string[]) || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    setAnswers((prev) => ({ ...prev, [questionId]: updated }));
  };

  const isSelected = (questionId: string, option: string) => {
    const answer = answers[questionId];
    if (Array.isArray(answer)) {
      return answer.includes(option);
    }
    return answer === option;
  };

  const validateRequiredQuestions = (): boolean => {
    const requiredQuestions = questions.filter(q => q.isRequired);
    for (const q of requiredQuestions) {
      const answer = answers[q.id];
      if (!answer || (Array.isArray(answer) && answer.length === 0) || (typeof answer === 'string' && answer.trim() === '')) {
        setToast({ message: `Please answer the required question: "${q.question}"`, type: 'error' });
        const questionIndex = questions.findIndex(qu => qu.id === q.id);
        if (questionIndex !== -1) {
          setPage(Math.floor(questionIndex / pageSize));
        }
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateRequiredQuestions()) {
      return;
    }

    setIsSubmitting(true);
    setToast({ message: 'Please wait, application is processing...', type: 'success' });

    try {
      const answersArray = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || (q.type === 'checkbox' ? [] : q.type === 'rating' ? 0 : '')
      }));

      await createApplication(opportunityId, answersArray);
      
      setShowConfirmModal(false);
      setToast({ message: 'Application submitted successfully!', type: 'success' });
      setIsSubmitting(false);
      
      setTimeout(() => {
        router.push('/Student/applied-Opportunity');
      }, 1500);
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to submit application', type: 'error' });
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.ceil(questions.length / pageSize);
  const paginatedQuestions = questions.slice(page * pageSize, (page + 1) * pageSize);



  if (questionsLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      </DashboardLayout>
    );
  }

  if (questions.length === 0) {
    return (
      <DashboardLayout>
        <div className="px-6 py-6 min-h-[calc(100vh-120px)]">
          <p className="text-center text-gray-500">No questions found. Redirecting...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <div className="px-6 py-6 min-h-[calc(100vh-120px)] relative">
        <h1 className="text-2xl font-bold mb-6">Application Questions</h1>

        {paginatedQuestions.map((q) => {

  return (
   <div
  key={q.id}
  className="
  w-full
  max-w-[984px]
  px-4 sm:px-0
  skew-x-0 sm:skew-x-[-12deg]
  bg-white
  shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12)]
  drop-shadow-[0px_0px_2px_rgba(145,158,171,0.2)]
  rounded-xl
  overflow-hidden
  mb-6
  mx-auto
"

>
        {/* Unskewed content */}
  <div className="skew-x-0 sm:skew-x-[12deg] px-8 py-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <label className="font-semibold">{q.question}</label>
        {q.isRequired && (
          <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">Required</span>
        )}
      </div>

      {/* TEXT INPUT */}
                {q.type === "text" && (
                  <div className="relative w-full h-[120px] sm:h-[154px] skew-x-0 sm:skew-x-[-12deg]
">
                    <div
                      className="absolute inset-0"
                      style={{
                        borderRadius: "20px",
                        background: "#FBFBFB",
                        border: "1px solid #A2A2A2",
                        boxSizing: "border-box",
                        alignItems: "flex-start", // Align text at top
                      }}
                    />
                   <textarea
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    placeholder="Your answer..."
                    className="absolute top-0 left-0 w-full h-full bg-transparent outline-none px-5 pt-4 pb-2 text-[14px] text-[#171717cc] resize-none skew-x-[12deg]"
                    />  

                  </div>
                )}


      {q.type === "checkbox" && q.options && q.options.length > 0 && (
  <div className="flex flex-col gap-3">
    {q.options.map((opt) => {
      const selected = isSelected(q.id, opt);

      return (
        <div
          key={opt}
          onClick={() => handleCheckboxChange(q.id, opt)}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          {/* ✅ Custom Checkbox */}
          <div className="w-9 h-9 flex items-center justify-center">
            {selected ? (
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

          {/* Option label */}
          <span className="text-sm font-medium">{opt}</span>
        </div>
      );
    })}
  </div>
)}

{q.type === "select" && q.options && q.options.length > 0 && (
  <div className="flex flex-col gap-3 px-3">
    {q.options.map((opt) => {
      const selected = answers[q.id] === opt; // only one can be selected

      return (
        <div
          key={opt}
          onClick={() => handleChange(q.id, opt)} // sets only this option
          className={`flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border transition-all
            ${selected ? "bg-[#FFEB9C] border-[#FFEB9C]" : "bg-white border-gray-300"}
          `}
        >
          {/* ✅ Custom Radio-like SVG */}
          <div className="w-9 h-9 flex items-center justify-center">
            {selected ? (
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

          {/* Option label */}
          <span className="text-sm font-medium">{opt}</span>
        </div>
      );
    })}
  </div>
)}


      {q.type === "rating" && (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => {
          const selected = Number(answers[q.id]) >= value;
          return (
            <svg
              key={value}
              onClick={() => handleChange(q.id, value)}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                selected ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.564-.955L10 0l2.946 5.955 6.564.955-4.755 4.635 1.123 6.545z" />
            </svg>
          );
        })}
      </div>
    )}

    </div>
    </div>
  );
})}

      {/* Pagination buttons */}
      <div className="
        mt-8
        flex
        flex-row
        gap-4
        sm:gap-0
        sm:justify-between
        sm:items-center
      ">

        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 rounded-lg skew-x-[-12deg]  border-1 border-black"
        >
          <span className="skew-x-[12deg] inline-block">
            Previous
          </span>
        </button>

        {page < totalPages - 1 ? (
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            className="px-4 py-2 rounded bg-[#FFEB9C] rounded-lg skew-x-[-12deg]  "
          >
            <span className="skew-x-[12deg] inline-block">
            Next
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (validateRequiredQuestions()) {
                setShowConfirmModal(true);
              }
            }}
            disabled={submitting || isSubmitting}
            className="px-4 py-2 rounded bg-[#FFEB9C] rounded-lg skew-x-[-12deg] disabled:opacity-50"
          >
            <span className="skew-x-[12deg] inline-block">
            {submitting || isSubmitting ? 'Submitting...' : 'Confirm'}
            </span>
          </button>
        )}
      </div>


      </div> 
     <ConfirmSubmitModal
  isOpen={showConfirmModal}
  onClose={() => !isSubmitting && setShowConfirmModal(false)}
  onConfirm={handleSubmit}
  isLoading={isSubmitting}
/>

    <Toast
      message={toast?.message || ''}
      type={toast?.type || 'success'}
      isVisible={!!toast}
      onClose={() => setToast(null)}
    />

    </DashboardLayout>
  );
}
