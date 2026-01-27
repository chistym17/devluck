"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/src/components/Company/DashboardLayout";
import { useQuestionHandler, Question } from "@/src/hooks/companyapihandler/useQuestionHandler";
import { Toast } from "@/src/components/common/Toast";

type QuestionType = "text" | "select" | "checkbox" | "rating";

interface NewQuestion {
  id?: string;
  question: string;
  type: QuestionType;
  options?: string[];
  isRequired?: boolean;
}

export default function AddQuestionsPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const opportunityId = jobId as string;

  const {
    questions: savedQuestions,
    loading,
    error,
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    bulkUpdateQuestions,
    clearError
  } = useQuestionHandler();

  const [questions, setQuestions] = useState<NewQuestion[]>([]);
  const [questionInput, setQuestionInput] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("text");
  const [optionsInput, setOptionsInput] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [questionTypeDropdownOpen, setQuestionTypeDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: 'error' });
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (opportunityId) {
      loadQuestions();
    }
  }, [opportunityId]);

  const loadQuestions = async () => {
    try {
      const loadedQuestions = await getQuestions(opportunityId);
      setQuestions(loadedQuestions.map(q => ({
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options || [],
        isRequired: q.isRequired
      })));
    } catch (error) {
      console.error("Failed to load questions:", error);
    }
  };


  // Add new question (local state only, saved when user clicks Save)
  const addQuestion = () => {
    if (!questionInput.trim()) return;

    const newQuestion: NewQuestion = {
      question: questionInput.trim(),
      type: questionType,
      options: (questionType === "select" || questionType === "checkbox")
        ? optionsInput.split(",").map(o => o.trim()).filter(o => o)
        : [],
      isRequired: isRequired
    };

    setQuestions([...questions, newQuestion]);
    setQuestionInput("");
    setOptionsInput("");
    setQuestionType("text");
    setIsRequired(false);
  };

  // Delete a question
  const handleDeleteQuestion = async (id: string) => {
    if (id) {
      try {
        await deleteQuestion(opportunityId, id);
        setQuestions(questions.filter(q => q.id !== id));
        setToast({ message: 'Question deleted successfully', type: 'success' });
      } catch (error: any) {
        setToast({ message: error.message || 'Failed to delete question', type: 'error' });
      }
    } else {
      const questionIndex = questions.findIndex(q => !q.id);
      if (questionIndex !== -1) {
        setQuestions(questions.filter((_, index) => index !== questionIndex));
      }
    }
  };

  // Save all questions
  const handleSaveQuestions = async () => {
    if (questions.length === 0) {
      setToast({ message: 'Please add at least one question', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      await bulkUpdateQuestions(opportunityId, questions.map((q, index) => ({
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options || [],
        order: index,
        isRequired: q.isRequired || false
      })));
      setToast({ message: 'Questions saved successfully!', type: 'success' });
      await loadQuestions();
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to save questions', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Delete a single option from select/checkbox
  const deleteOption = (qIndex: number, opt: string) => {
    setQuestions(prev => prev.map((q, idx) => {
      if (idx === qIndex && q.options) {
        return { ...q, options: q.options.filter(o => o !== opt) };
      }
      return q;
    }));
  };


  return (
    <DashboardLayout>
      <div className="px-6 py-6 min-h-[calc(100vh-120px)]">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push(`/Company/opportunity/${opportunityId}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            ← Back to Opportunity
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center">Create Opportunity Questions</h1>
        <p className="text-center text-gray-500 mb-8">
        Add questions for candidates applying to this opportunity. Questions are optional.
        </p>


        {/* Add Question Form */}
        <div className="max-w-[700px] mx-auto bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
          <label className="font-semibold text-lg">Question</label>
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Type your question here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 outline-none"
          />

          <label className="font-semibold text-lg">Question Type</label>
          {/* Question Type */}
            <div className="relative w-full mt-2">
            {/* Dropdown header */}
            <div
                onClick={() => setQuestionTypeDropdownOpen(!questionTypeDropdownOpen)}
                className="
                flex px-3.5 py-2.5 justify-between items-center
                bg-white/0
                rounded-lg
                text-black
                text-sm
                cursor-pointer
                backdrop-blur-md
                border border-black/15
                transition
                hover:bg-black/5
                skew-x-[-12deg]
                "
            >
                <span className="skew-x-[12deg]">
                {questionType.charAt(0).toUpperCase() + questionType.slice(1)}
                </span>
                <span className="ml-2 text-xs opacity-70 skew-x-[12deg]">
                <svg
                    width="12"
                    height="6"
                    viewBox="0 0 12 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    d="M5.8344 5.8344C5.63969 5.83478 5.45099 5.76696 5.30106 5.64273L0.301063 1.47606C-0.0533202 1.18151 -0.101823 0.655445 0.192729 0.301062C0.487281 -0.0533202 1.01335 -0.101823 1.36773 0.192729L5.8344 3.92606L10.3011 0.326063C10.4732 0.186254 10.694 0.120838 10.9145 0.1443C11.1351 0.167761 11.3372 0.278163 11.4761 0.451063C11.6303 0.624279 11.7054 0.85396 11.6833 1.08486C11.6612 1.31576 11.5438 1.52699 11.3594 1.66773L6.3594 5.69273C6.20516 5.79733 6.02031 5.8472 5.8344 5.8344Z"
                    fill="#919EAB"
                    fillOpacity="0.8"
                    />
                </svg>
                </span>
            </div>

            {/* Dropdown menu */}
            {questionTypeDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.15)] z-50 max-h-48 overflow-y-scroll">
                <style>{`
                    div::-webkit-scrollbar {
                    display: none;
                    }
                `}</style>

                {(["text", "select", "checkbox", "rating"] as QuestionType[]).map((type) => (
                    <div
                    key={type}
                    onClick={() => {
                        setQuestionType(type);
                        setQuestionTypeDropdownOpen(false);
                    }}
                    className="p-2 text-sm hover:bg-black/5 cursor-pointer"
                    >
                    {type.charAt(0).toUpperCase() + type.slice(1)} 
                    {type === "select" ? " (Single choice)" : ""}
                    {type === "checkbox" ? " (Multiple choice)" : ""}
                    {type === "rating" ? " (1-5 stars)" : ""}
                    </div>
                ))}
                </div>
            )}
            </div>


          {(questionType === "select" || questionType === "checkbox") && (
            <>
              <label className="font-semibold text-lg">Options (comma separated)</label>
              <input
                type="text"
                value={optionsInput}
                onChange={(e) => setOptionsInput(e.target.value)}
                placeholder="Option1, Option2, Option3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 outline-none"
              />
            </>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRequired"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="w-4 h-4 accent-yellow-300"
            />
            <label htmlFor="isRequired" className="text-sm font-medium">
              Required question
            </label>
          </div>

          <button
            onClick={addQuestion}
            className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg transition shadow"
          >
            Add Question
          </button>
        </div>

        {/* Questions Preview */}
        {questions.length > 0 && (
          <div className="mt-10 max-w-[800px] mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-center">Questions</h2>
              <button
                onClick={handleSaveQuestions}
                disabled={saving || loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save All Questions'}
              </button>
            </div>

            {loading && (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading questions...</p>
              </div>
            )}

            {questions.map((q, idx) => (
              <div key={q.id || `temp-${idx}`} className="bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{idx + 1}. {q.question}</span>
                    {q.isRequired && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">Required</span>
                    )}
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded capitalize">{q.type}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(q.id || '')}
                    className="text-red-500 hover:text-red-700 font-bold transition"
                  >
                    Delete
                  </button>
                </div>

                {/* Options Display */}
                {q.type === "select" && q.options && q.options.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600 font-medium">Options:</p>
                    {q.options.map(opt => (
                      <div key={opt} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{opt}</span>
                        <button
                          onClick={() => deleteOption(idx, opt)}
                          className="text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {q.type === "checkbox" && q.options && q.options.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600 font-medium">Options:</p>
                    {q.options.map(opt => (
                      <div key={opt} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{opt}</span>
                        <button
                          onClick={() => deleteOption(idx, opt)}
                          className="text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {q.type === "rating" && (
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-600">Rating scale: </span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg
                        key={star}
                        className="w-6 h-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.564-.955L10 0l2.946 5.955 6.564.955-4.755 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {questions.length === 0 && !loading && (
          <div className="mt-10 max-w-[800px] mx-auto text-center py-8">
            <p className="text-gray-500 text-lg">No questions added yet. Add your first question above.</p>
          </div>
        )}
      </div>
      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        isVisible={!!toast}
        onClose={() => setToast(null)}
      />
    </DashboardLayout>
  );
}
