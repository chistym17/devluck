"use client";

import React, { useState,useEffect } from "react";
import { Loader2 } from "lucide-react";

interface UniversityData {
  name: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  description?: string;
  corporate?: string;
  image?: string;
  totalStudents?: number;
  ugStudents?: number;
  pgStudents?: number;
  totalDoctors?: number;
  staff?: number;
  qsWorldRanking?: number;
  qsRankingBySubject?: number;
  qsSustainabilityRanking?: number;
  programs?: string[];
}

interface UniversityModalProps {
  university?: UniversityData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UniversityData) => void;
}

type MultiInputListProps = {
  label: string;
  items: string[];
  setItems: (items: string[]) => void;
};

const MultiInputList: React.FC<MultiInputListProps> = ({ label, items, setItems }) => {
  const [currentValue, setCurrentValue] = useState("");

  const addItem = () => {
    if (currentValue.trim() !== "") {
      setItems([...items, currentValue.trim()]);
      setCurrentValue("");
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="flex flex-col gap-2  ">
      <ParallelogramInput
        label={label}
        placeholder={`Add ${label.toLowerCase()}`}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        type="text"
      />
      {/* Add button */}
      <button
        type="button"
        onClick={addItem}
        className="self-start px-3 py-1 rounded-md bg-[#FFEB9C] font-semibold text-black hover:bg-[#FFE066] transition"
      >
        Add
      </button>
      {/* Display list */}
      <ul className="flex flex-col gap-1 pl-4">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="text-red-500 font-bold px-2"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ParallelogramFileInput = ({
  label,
  image,
  onChange,
}: {
  label: string;
  image?: string;
  onChange: (file: File | null) => void;
}) => {
  const defaultImage = "/images/U2.jpeg";
  const [preview, setPreview] = useState<string | null>(image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else if (image) {
      setPreview(image);
    } else {
      setPreview(null);
    }
  }, [image, selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      onChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-[175px] h-[204px] relative">
      <label className="relative w-[144px] h-[144px] flex items-center justify-center cursor-pointer">
        {/* Dashed circle */}
        <div className="absolute w-[144px] h-[144px] border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center z-10">
          {/* Camera icon + label always visible on top */}
          <div className="flex flex-col items-center justify-center gap-1 text-center z-20 pointer-events-none">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M16.0001 13.6667C16.2653 13.6667 16.5197 13.7721 16.7072 13.9596C16.8947 14.1472 17.0001 14.4015 17.0001 14.6667V16.3334H18.6667C18.932 16.3334 19.1863 16.4388 19.3739 16.6263C19.5614 16.8138 19.6667 17.0682 19.6667 17.3334C19.6667 17.5986 19.5614 17.853 19.3739 18.0405C19.1863 18.228 18.932 18.3334 18.6667 18.3334H17.0001V20.0001C17.0001 20.2653 16.8947 20.5196 16.7072 20.7072C16.5197 20.8947 16.2653 21.0001 16.0001 21.0001C15.7349 21.0001 15.4805 20.8947 15.293 20.7072C15.1054 20.5196 15.0001 20.2653 15.0001 20.0001V18.3334H13.3334C13.0682 18.3334 12.8138 18.228 12.6263 18.0405C12.4388 17.853 12.3334 17.5986 12.3334 17.3334C12.3334 17.0682 12.4388 16.8138 12.6263 16.6263C12.8138 16.4388 13.0682 16.3334 13.3334 16.3334H15.0001V14.6667C15.0001 14.4015 15.1054 14.1472 15.293 13.9596C15.4805 13.7721 15.7349 13.6667 16.0001 13.6667Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M13.0374 28.0001H18.9627C23.1241 28.0001 25.2054 28.0001 26.7001 27.0201C27.345 26.5974 27.9004 26.0519 28.3347 25.4147C29.3334 23.9481 29.3334 21.9041 29.3334 17.8187C29.3334 13.7321 29.3334 11.6894 28.3347 10.2227C27.9005 9.58554 27.345 9.04006 26.7001 8.6174C25.7401 7.98673 24.5374 7.7614 22.6961 7.6814C21.8174 7.6814 21.0614 7.02806 20.8894 6.1814C20.758 5.56122 20.4164 5.00544 19.9225 4.608C19.4287 4.21055 18.8127 3.99581 18.1787 4.00006H13.8214C12.5041 4.00006 11.3694 4.9134 11.1107 6.1814C10.9387 7.02806 10.1827 7.6814 9.30408 7.6814C7.46408 7.7614 6.26141 7.98806 5.30008 8.6174C4.65557 9.04015 4.10058 9.58563 3.66675 10.2227C2.66675 11.6894 2.66675 13.7321 2.66675 17.8187C2.66675 21.9041 2.66675 23.9467 3.66541 25.4147C4.09741 26.0494 4.65208 26.5947 5.30008 27.0201C6.79475 28.0001 8.87608 28.0001 13.0374 28.0001ZM21.3334 17.3334C21.3334 18.7479 20.7715 20.1044 19.7713 21.1046C18.7711 22.1048 17.4146 22.6667 16.0001 22.6667C14.5856 22.6667 13.229 22.1048 12.2288 21.1046C11.2287 20.1044 10.6667 18.7479 10.6667 17.3334C10.6667 15.9189 11.2287 14.5624 12.2288 13.5622C13.229 12.562 14.5856 12.0001 16.0001 12.0001C17.4146 12.0001 18.7711 12.562 19.7713 13.5622C20.7715 14.5624 21.3334 15.9189 21.3334 17.3334ZM24.0001 12.3334C23.7349 12.3334 23.4805 12.4388 23.293 12.6263C23.1054 12.8138 23.0001 13.0682 23.0001 13.3334C23.0001 13.5986 23.1054 13.853 23.293 14.0405C23.4805 14.228 23.7349 14.3334 24.0001 14.3334H25.3334C25.5986 14.3334 25.853 14.228 26.0405 14.0405C26.2281 13.853 26.3334 13.5986 26.3334 13.3334C26.3334 13.0682 26.2281 12.8138 26.0405 12.6263C25.853 12.4388 25.5986 12.3334 25.3334 12.3334H24.0001Z" fill="white"/>
            </svg>

            <span className="text-xs text-gray-400">{label}</span>
          </div>
        </div>

        <img
          src={preview || defaultImage}
          alt="Preview"
          className="absolute w-[128px] h-[128px] rounded-full object-cover z-0"
        />

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          className="absolute w-full h-full opacity-0 cursor-pointer rounded-full z-30"
          onChange={handleFileChange}
        />
      </label>

      {/* Allowed file types */}
      <span className="text-xs text-gray-400 text-center">
        Allowed *.jpeg, *.jpg, *.png, *.gif
        Max size of 3.1 MB
      </span>
    </div>
  );
};

const ParallelogramInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
}) => (

  <div className="relative w-full h-[48px]">
    <label
      className="absolute -top-2 left-5 h-[18px] px-3 bg-[#FFEB9C] text-[#1E1E1E] text-xs font-normal select-none flex items-center skew-x-[-12deg] z-20"
      style={{ borderRadius: "6px" }}
    >
      <span className="skew-x-[12deg]">{label}</span>
    </label>
    <div className="overflow rounded-[12px] h-full w-full">
      <div
        className="h-full w-full border border-[#1C252E]"
        style={{ transform: "skewX(-15deg)", borderRadius: "12px", background: "transparent" }}
      >
        <div
          style={{
            transform: "skewX(15deg)",
            height: "100%",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
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
                value={value ?? ""}
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

const UniversityModal: React.FC<UniversityModalProps> = ({
  university,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UniversityData>({
    name: "",
    description: "",
    address: "",
    website: "",
    email: "",
    phoneNumber: "",
    corporate: "",
    image: "",
    totalStudents: 0,
    ugStudents: 0,
    pgStudents: 0,
    staff: 0,
    totalDoctors: 0,
    qsWorldRanking: undefined,
    qsRankingBySubject: undefined,
    qsSustainabilityRanking: undefined,
    programs: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (university) setFormData(university);
    else
      setFormData({
       name: "",
        description: "",
        address: "",
        website: "",
        email: "",
        phoneNumber: "",
        corporate: "",
        image: "",
        totalStudents: 0,
        ugStudents: 0,
        pgStudents: 0,
        staff: 0,
        totalDoctors: 0,
        qsWorldRanking: undefined,
        qsRankingBySubject: undefined,
        qsSustainabilityRanking: undefined,
        programs: [],
      });
  }, [university, isOpen]);

  const handleInputChange = <K extends keyof UniversityData>(
    field: K,
    value: UniversityData[K]
    ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('devluck_token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.data.url;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image || university?.image;

      if (selectedFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImageToCloudinary(selectedFile);
        } catch (error: any) {
          console.error("Error uploading image:", error);
          alert(`Failed to upload image: ${error.message}`);
          setUploadingImage(false);
          setLoading(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      await onSave({
        ...formData,
        image: imageUrl, // ✅ real URL saved
      });

      onClose();
    } catch (error) {
      console.error("Failed to save university:", error);
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/35 backdrop-blur-l" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-[640px] max-h-[95vh] flex flex-col isolate rounded-4xl bg-[rgba(255,255,255,0.04)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between w-full h-[85px] px-4 flex-shrink-0"
          style={{
            backgroundImage: "url('/cards/cardHeader.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2
            className="absolute flex items-center text-[#1E1E1E]"
            style={{
              width: "350px",
              height: "36px",
              left: "117.37px",
              top: "21.79px",
              fontFamily: "'Public Sans', sans-serif",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "36px",
            }}
          >
            {university ? "Edit University" : "Create University"}
          </h2>
        </div>

        {/* Form - scrollable */}
        {/* Form - scrollable */}
<form
  className="flex-1 flex flex-col gap-4 p-4 bg-white overflow-y-auto"
  onSubmit={handleSubmit}
>
  <div className="flex flex-col gap-4">

    <div className="flex justify-center">
      <ParallelogramFileInput
        label="University Image"
        image={formData.image}
        onChange={(file) => {
          if (file) {
            setSelectedFile(file);
            setFormData((prev) => ({
              ...prev,
              image: URL.createObjectURL(file), // preview only
            }));
          } else {
            setSelectedFile(null);
          }
        }}
      />
    </div>

    <ParallelogramInput
      label="University Name"
      placeholder="Enter university name"
      value={formData.name}
      onChange={(e) => handleInputChange("name", e.target.value)}
    />

    <ParallelogramInput
      label="University Description"
      placeholder="Enter description"
      value={formData.description || ""}
      onChange={(e) => handleInputChange("description", e.target.value)}
    />

    <ParallelogramInput
      label="Address"
      placeholder="Full address"
      value={formData.address || ""}
      onChange={(e) => handleInputChange("address", e.target.value)}
    />

    <ParallelogramInput
      label="Corporate"
      placeholder="e.g., N.I.U is a research-driven public university"
      value={formData.corporate || ""}
      onChange={(e) => handleInputChange("corporate", e.target.value)}
    />

    <ParallelogramInput
      label="Website"
      placeholder="https://university.edu"
      value={formData.website || ""}
      onChange={(e) => handleInputChange("website", e.target.value)}
    />

    <ParallelogramInput
      label="Email"
      placeholder="info@university.edu"
      value={formData.email || ""}
      onChange={(e) => handleInputChange("email", e.target.value)}
    />

    <ParallelogramInput
      label="Phone Number"
      placeholder="+20 123 456 789"
      value={formData.phoneNumber || ""}
      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
    />

    {/* Numbers */}
    <ParallelogramInput
      label="Total Students"
      type="number"
      value={formData.totalStudents || 0}
      onChange={(e) => handleInputChange("totalStudents", Number(e.target.value))}
    />

    <ParallelogramInput
      label="Undergraduate Students"
      type="number"
      value={formData.ugStudents || 0}
      onChange={(e) => handleInputChange("ugStudents", Number(e.target.value))}
    />

    <ParallelogramInput
      label="Postgraduate Students"
      type="number"
      value={formData.pgStudents || 0}
      onChange={(e) => handleInputChange("pgStudents", Number(e.target.value))}
    />

    <ParallelogramInput
      label="Total Staff"
      type="number"
      value={formData.staff || 0}
      onChange={(e) => handleInputChange("staff", Number(e.target.value))}
    />

    <ParallelogramInput
      label="Total Doctors"
      type="number"
      value={formData.totalDoctors || 0}
      onChange={(e) => handleInputChange("totalDoctors", Number(e.target.value))}
    />

    <ParallelogramInput
      label="QS World Ranking"
      type="number"
      value={formData.qsWorldRanking || ""}
      onChange={(e) => handleInputChange("qsWorldRanking", e.target.value ? Number(e.target.value) : undefined)}
    />

    <ParallelogramInput
      label="QS Ranking By Subject"
      type="number"
      value={formData.qsRankingBySubject || ""}
      onChange={(e) => handleInputChange("qsRankingBySubject", e.target.value ? Number(e.target.value) : undefined)}
    />

    <ParallelogramInput
      label="QS Sustainability Ranking"
      type="number"
      value={formData.qsSustainabilityRanking || ""}
      onChange={(e) => handleInputChange("qsSustainabilityRanking", e.target.value ? Number(e.target.value) : undefined)}
    />
  </div>

  {/* Programs List */}
  <MultiInputList
    label="Programs"
    items={formData.programs || []}
    setItems={(items) =>
      setFormData((prev) => ({ ...prev, programs: items }))
    }
  />
</form>


        {/* Footer */}
        <div
          className="flex items-center justify-center w-full h-[90px] flex-shrink-0 bg-cover bg-center px-4"
          style={{
            backgroundImage: "url('/cards/cardFooter.svg')",
          }}
        >
          <div className="flex w-[400px] justify-between">
            <button
              onClick={onClose}
              className="relative w-[100px] h-[40px] skew-x-[-12deg] bg-transparent border border-black flex items-center justify-center overflow-hidden rounded-lg hover:bg-black/10 transition-all"
            >
              <span className="skew-x-[12deg] font-bold text-black">Cancel</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="relative w-[100px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105"
            >
              <span className="skew-x-[12deg] font-bold text-black">
                {loading ? <Loader2 className="animate-spin" /> : university ? "Update" : "Confirm"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityModal;
