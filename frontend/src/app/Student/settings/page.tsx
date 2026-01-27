// src/app/Student/settings/page.tsx
"use client";

import { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
import AddressModal from "@/src/components/common/AddressModal";
import DeleteConfirmationModal from "@/src/components/common/DeleteConfirmationModal";
import { useAuth } from "@/src/hooks/useAuth"; 
import { useStudentSettingsHandler } from "@/src/hooks/studentapihandler/useStudentSettingsHandler";
import { useStudentProfileHandler } from "@/src/hooks/studentapihandler/useStudentProfileHandler";
import { Eye, EyeOff } from "lucide-react";
// src/mocks/mockUniversityAddresses.ts
export const mockUniversityAddresses = [
  {
    id: "addr-1",
    name: "MIT",
    tag: "Home",
    address: "77 Massachusetts Ave, Cambridge, MA 02139, United States",
    phoneNumber: "+1 617-253-1000",
  },
  {
    id: "addr-2",
    name: "MIT",
    tag: "Office",
    address: "Building 10, Cambridge, MA 02139, United States",
    phoneNumber: "+1 617-253-2000",
  },
  {
    id: "addr-3",
    name: "MIT",
    tag: "Admissions",
    address: "84 Massachusetts Ave, Cambridge, MA 02139, United States",
    phoneNumber: "+1 617-258-8800",
  },
];

const colors = [
  "#FFEB9C",
  "#EAAFFF",
  "#77ED8B",
  "#76CFFA",
];
 
export default function SettingsPage() {
 const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingAddress, setEditingAddress] = useState<any>(null);
   const [showPassword, setShowPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [deletingProfile, setDeletingProfile] = useState(false);
   const { logout } = useAuth();
   const router = useRouter();
 
   // Settings hook
   const {
     settings,
     getSettings,
     updateSettings,
     changePasswordLoading,
     changePasswordError,
     changePassword,
     addresses,
     addressLoading,
     getAddresses,
     createAddress,
     updateAddress,
     deleteAddress
   } = useStudentSettingsHandler();

   // Profile hook for delete
   const { deleteProfile } = useStudentProfileHandler();
 
   // Theme state from API
   const [apiTheme, setApiTheme] = useState(settings?.theme || 'light');
   const [apiThemeColor, setApiThemeColor] = useState(settings?.themeColor || '#FFEB9C');
 
   // Password state
   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showPasswordSection, setShowPasswordSection] = useState(false);
 
   const handleLogout = async () => {
     try {
       await logout();
       router.push("/auth");
     } catch (error) {
       console.error("Logout failed:", error);
     }
   };
 
   // Load settings and addresses on component mount
   useEffect(() => {
     getSettings().catch(console.error);
     getAddresses().catch(console.error);
   }, []);
 
   // Handle theme update
   const handleThemeUpdate = async () => {
     try {
       await updateSettings({
         theme: apiTheme,
         themeColor: apiThemeColor
       });
       alert('Theme updated successfully!');
     } catch (error) {
       console.error("Failed to update theme:", error);
       alert('Failed to update theme');
     }
   };
 
   // Handle password change
   const handlePasswordChange = async (e: React.FormEvent) => {
     e.preventDefault();
 
     if (newPassword !== confirmPassword) {
       alert('New password and confirm password do not match');
       return;
     }
 
     if (newPassword.length < 6) {
       alert('Password must be at least 6 characters long');
       return;
     }
 
     try {
       await changePassword(currentPassword, newPassword, confirmPassword);
       alert('Password changed successfully!');
       setCurrentPassword('');
       setNewPassword('');
       setConfirmPassword('');
       setShowPasswordSection(false);
     } catch (error) {
       console.error("Failed to change password:", error);
       alert('Failed to change password. Please check your current password.');
     }
   };
 
 
   const [activeTab, setActiveTab] = useState<
       "general" | "notification"| "security"
     >("general");
 
   const [activity, setActivity] = useState({
   jobAlerts: true,
   emailNotifications: true,
   profileVisibility: true,
   NewsAndAnnouncements: true,
   WeeklyProductUpdates: true,
   WeeklyBlogDigest: true,
   });
 
   const [selectedColor, setSelectedColor] = useState(colors[0]);
   const [theme, setTheme] = useState<"light" | "dark">("light");
   const ThemeOption = ({
       label,
       active,
       onClick,
     }: {
       label: string;
       active: boolean;
       onClick: () => void;
     }) => {
       return (
         <button
           onClick={onClick}
           className={`flex items-center h-[139px] rounded-[24px] transition-all
             ${active ? "bg-[#FFFCF0] border border-[#FFEB9C]" : ""}
           `}
         >
           {/* Center */}
           <div className="w-[240px] h-full skew-x-12 flex flex-col justify-center gap-[16px] px-4 ">
             <div className="flex items-center justify-between">
               {/* Icon */}
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path opacity="0.32" d="M16.9462 11.0863C16.9759 11.0875 17.0055 11.0886 17.035 11.0898C20.1966 11.2176 22.5 13.3358 22.5 16.5C22.5 19.6642 20.1966 21.7824 17.035 21.9102C15.7057 21.9639 14.0498 22 12 22C9.9502 22 8.2943 21.9639 6.965 21.9102C3.80337 21.7824 1.5 19.6642 1.5 16.5C1.5 14.0317 2.90165 12.1999 5.019 11.4529C5.2406 8.2951 7.3872 6.02435 10.6413 6.00125C10.7585 6.00045 10.878 6 11 6C11.122 6 11.2415 6.00045 11.3587 6.00125C14.4855 6.02345 16.5897 8.1208 16.9462 11.0863Z" fill="#1E1E1E"/>
               <path d="M19.2407 2.28853C19.5263 2.12002 19.5419 1.62921 19.2169 1.57222C18.1306 1.38179 16.9755 1.56344 15.9464 2.17059C14.4123 3.07575 13.5394 4.70186 13.501 6.38837C15.4283 7.12677 16.6785 8.86242 16.9459 11.0863L17.0347 11.0898C17.7391 11.1183 18.401 11.2456 19.0042 11.4612C19.6324 11.3806 20.2555 11.1732 20.8383 10.8294C21.8673 10.2222 22.5988 9.2907 22.9806 8.23415C23.0948 7.918 22.6711 7.6864 22.3855 7.8549C20.8813 8.74235 18.958 8.2157 18.0896 6.6786C17.2212 5.1415 17.7366 3.17599 19.2407 2.28853Z" fill="#1E1E1E"/>
               </svg>
               {/* Switch */}
               <div
                 className={`w-[25px] h-[16px] rounded-full border flex items-center p-[3px]
                   ${active
                     ? "bg-[#FFEB9C] border-[#CCBC7D] justify-end"
                     : "bg-[#919EAB]/40 border-[#DFE3E8] justify-start"}
                 `}
               >
                 <div className="w-[10px] h-[10px] bg-white rounded-full" />
               </div>
             </div>
 
             <span className="text-[13px] font-semibold text-[#1E1E1E]">
               {label}
             </span>
           </div>
         </button>
       );
     };
 
     function Switch({
       enabled,
       onToggle,
     }: {
       enabled: boolean;
       onToggle: () => void;
     }) {
       return (
         <button
           onClick={onToggle}
           className={`w-[33px] h-[20px] rounded-full p-[3px] flex items-center transition-all ${
             enabled ? "bg-[#FFEB9C]" : "bg-[rgba(145,158,171,0.48)]"
           }`}
         >
           <div
             className={`w-[14px] h-[14px] bg-white rounded-full transition-all ${
               enabled ? "translate-x-[13px]" : "translate-x-0"
             }`}
           />
         </button>
       );
     }
 
 
  return (
    <DashboardLayout>
      <div
        className="py-6 min-h-[800px]"
        style={{
          transform: "scale(0.96)",
          transformOrigin: "top center",
        }}
      >
{/* ✅ CONTENT CONTAINER */}
    <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center justify-between mb-8">
          {/* Left: Title */}
          <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-8">
            Setting
          </h1>

          {/* Right: Button group */}
          <div className="flex items-center gap-4">
            {/* Example Button 1 */}
            <button
              onClick={handleLogout}
              className="relative w-[100px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md hover:bg-[#FFE066] transition duration-200 hover:scale-105">
              <span className="skew-x-[12deg] font-bold text-[#1E1E1E] flex items-center justify-center">
                Log Out
              </span>
            </button>

          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {/* general Tab */}
          <button
            onClick={() => setActiveTab("general")}
            className={
              activeTab === "general"
                ? "relative w-[180px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md transition duration-200 hover:bg-[#FFE066] hover:scale-105"
                : "w-[180px] h-[40px] flex items-center justify-center text-black/60 hover:text-black transition"
            }
          >
            <span
              className={
                activeTab === "general" ? "skew-x-[12deg] font-semibold" : ""
              }
            >
              General
            </span>
          </button>

          {/* Applied notification Tab */}
          <button
            onClick={() => setActiveTab("notification")}
            className={
              activeTab === "notification"
                ? "relative w-[180px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md transition duration-200 hover:bg-[#FFE066] hover:scale-105"
                : "w-[180px] h-[40px] flex items-center justify-center text-black/60 hover:text-black transition"
            }
          >
            <span
              className={
                activeTab === "notification" ? "skew-x-[12deg] font-semibold" : ""
              }
            >
              Notification
            </span>
          </button>
             {/* Applied Security Tab */}
          <button
            onClick={() => setActiveTab("security")}
            className={
              activeTab === "security"
                ? "relative w-[180px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center overflow-hidden rounded-md transition duration-200 hover:bg-[#FFE066] hover:scale-105"
                : "w-[180px] h-[40px] flex items-center justify-center text-black/60 hover:text-black transition"
            }
          >
            <span
              className={
                activeTab === "security" ? "skew-x-[12deg] font-semibold" : ""
              }
            >
              Security
            </span>
          </button>
        </div>

        {/* TAB CONTENT */}
        {activeTab === "general" && (
          <div className="flex flex-col gap-6">
            {/* Row 1 */}
            <div className="flex flex-row items-start xl:items-stretch justify-center gap-10 flex-wrap xl:flex-nowrap w-full">
              {/* Address Card */}
              <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                  Address
                  </h3>

                  {/* More Button */}
                  <button
                    className="relative w-[80px] h-[32px] skew-x-[-12deg]  border border-black flex items-center justify-center rounded-md cursor-pointer duration-200 hover:scale-105  transition"
                        onClick={() => {
                        setIsModalOpen(true);        
                      }}
                  >
                    <div className="skew-x-[12deg] font-semibold text-[14px] text-[#1E1E1E]">
                      More
                    </div>
                  </button>
                </div>
                <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 h-[200px]`}>
                  <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 overflow-y-auto">
                     {addressLoading ? (
                      <p className="text-[#555] text-[14px] font-publicSans">Loading addresses...</p>
                     ) : addresses.length > 0 ? (
                      addresses.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-row items-start gap-5 w-full"
                      >
                        {/* Left Content */}
                        <div className="flex flex-col gap-1 p-5 w-full rounded-lg">
                          {/* Name + Tag */}
                          <div className="flex items-center gap-2">
                            <span className="font-publicSans font-semibold text-[14px] text-[#1E1E1E]">
                              {item.name}
                            </span>
                            <span className="font-publicSans font-normal text-[14px] text-[#1C252E]">
                              ({item.tag})
                            </span>
                          </div>

                          {/* Address */}
                          <div className="font-publicSans font-normal text-[14px] text-[#1C252E]">
                            {item.address}
                          </div>

                          {/* Phone */}
                          <div className="font-publicSans font-normal text-[14px] text-[#1C252E]">
                            {item.phoneNumber}
                          </div>
                        </div>

                        {/* Edit Icon */}
                        <div className="flex items-center justify-center w-[30px] h-[24px]"
                          onClick={() => {
                          setEditingAddress(item); 
                          setIsModalOpen(true);        
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
                              d="M14.6003 16.101L19.531 11.1703C18.7014 10.8239 17.948 10.3179 17.3137 9.68096C16.6764 9.04644 16.1702 8.29281 15.8237 7.46296L10.893 12.3936C10.5083 12.7783 10.3157 12.971 10.1503 13.183C9.95508 13.4331 9.78764 13.7039 9.65101 13.9903C9.53567 14.233 9.44967 14.4916 9.27767 15.0076L8.36967 17.7296C8.32788 17.8543 8.32168 17.9881 8.35177 18.116C8.38185 18.244 8.44704 18.361 8.53999 18.454C8.63294 18.5469 8.74997 18.6121 8.87793 18.6422C9.00589 18.6723 9.13971 18.6661 9.26434 18.6243L11.9863 17.7163C12.503 17.5443 12.761 17.4583 13.0037 17.343C13.2903 17.2063 13.561 17.039 13.811 16.8436C14.023 16.6783 14.2157 16.4856 14.6003 16.101ZM20.899 9.8023C21.3906 9.31067 21.6668 8.64389 21.6668 7.94863C21.6668 7.25337 21.3906 6.58659 20.899 6.09496C20.4074 5.60334 19.7406 5.32715 19.0453 5.32715C18.3501 5.32715 17.6833 5.60334 17.1917 6.09496L16.6003 6.6863L16.6257 6.7603C16.9171 7.59411 17.3939 8.3509 18.0203 8.97363C18.6617 9.61876 19.445 10.105 20.3077 10.3936L20.899 9.8023Z"
                              fill="#1E1E1E"
                            />
                          </svg>
                        </div>
                      </div>
                   ))
                    ) : (
                      <p className="text-[#555] text-[14px] font-publicSans">
                        No Address available.
                      </p>
                    )}
                  </div>
                </div>
              </div>


              {/* Select Theme Card */}
              <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                    Select Theme
                  </h3>
                </div>

                <div className="w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] p-6 h-[200px]">
                  <div
                    className="
                      transform px-4 sm:px-8
                      w-full
                      flex gap-4 sm:gap-[32px]
                      overflow-x-auto
                      sm:overflow-visible
                      flex-nowrap
                      scrollbar-hide
                    "
                  >
                    {/* Light Theme */}
                    <ThemeOption
                      label="Light"
                      active={theme === "light"}
                      onClick={() => setTheme("light")}
                    />

                    {/* Dark Theme */}
                    <ThemeOption
                      label="Dark"
                      active={theme === "dark"}
                      onClick={() => setTheme("dark")}
                    />

                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-row items-start xl:items-stretch justify-center gap-10 flex-wrap xl:flex-nowrap w-full">
              {/*  Profile Card */}
              <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                  Profile
                  </h3>
                </div>
                <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 h-[200px]`}>
                  <div className="transform skew-x-12 px-8 w-full flex flex-col gap-3 ">
                    <div className="w-[485px] h-[113px] flex flex-col justify-center items-start p-[20px] gap-[4px] ">
  
                      {/* Row */}
                      <div className="w-[260px] sm:w-[485px] h-[32px] flex items-center justify-between gap-[8px]">
                        
                        {/* Profile Label */}
                        <span className="font-public-sans font-semibold text-[14px] leading-[22px] text-[#1E1E1E]">
                          Delete Profile
                        </span>

                        {/* Delete Button */}
                        <button 
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center px-[16px] -skew-x-20 rounded-[10px]  border border-[#FF5630] h-[32px] hover:bg-[#FF5630]/10 transition-colors"
                        >
                            <span className="font-public-sans font-bold skew-x-20 text-[14px] leading-[24px] text-[#FF5630]">
                              Delete Profile
                            </span>
                        </button>

                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Select Theme Color Card*/}
              <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                  Select Theme Color
                  </h3>
                </div>
                <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 h-[200px]`}>
                  <div className="transform skew-x-12 px-8 w-full h-full flex items-center justify-center">
                    <div className="w-[485px] h-[56px] flex items-center justify-center gap-[16px]">
                          {colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className="w-[63.85px] h-[56px] flex items-center justify-center bg-white rounded-[12px]"
                            >
                              <div
                                className={`w-[31.85px] h-[31.85px] rounded-full ${
                                  selectedColor === color
                                    ? "border-[2px] border-[#353535]"
                                    : "border border-transparent"
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            </button>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

         {/* TAB CONTENT */}
        {activeTab === "notification" && (
          <div className="flex flex-col gap-6">
            {/* Row 1 */}
            <div className="flex flex-row items-start xl:items-stretch justify-center gap-10 flex-wrap xl:flex-nowrap w-full">

              {/* Activity Card */}
              <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                  Activity
                  </h3>
                </div>
                <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 h-[200px]`}>
                  <div className="transform skew-x-12 px-8 w-full flex flex-col">
                     <div className="sm:w-[485px] w-[260px]  flex flex-col gap-[17px]">
      
                      {/* Job Alerts */}
                      <div className="w-full h-[38px] flex items-center gap-[9px]">
                        <span className="flex-1 text-[14px] text-[#1E1E1E]">
                          Email me when someone comments onmy article
                        </span>
                        <Switch
                          enabled={activity.jobAlerts}
                          onToggle={() =>
                            setActivity({ ...activity, jobAlerts: !activity.jobAlerts })
                          }
                        />
                      </div>

                      {/* Email Notifications */}
                      <div className="w-full h-[38px] flex items-center gap-[9px]">
                        <span className="flex-1 text-[14px] text-[#1E1E1E]">
                          Email me when someone answers on my form
                        </span>
                        <Switch
                          enabled={activity.emailNotifications}
                          onToggle={() =>
                            setActivity({
                              ...activity,
                              emailNotifications: !activity.emailNotifications,
                            })
                          }
                        />
                      </div>

                      {/* Profile Visibility */}
                      <div className="w-full h-[38px] flex items-center gap-[9px]">
                        <span className="flex-1 text-[14px] text-[#1E1E1E]">
                          Email me hen someone follows me
                        </span>
                        <Switch
                          enabled={activity.profileVisibility}
                          onToggle={() =>
                            setActivity({
                              ...activity,
                              profileVisibility: !activity.profileVisibility,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Card */}
              <div className="w-full sm:max-w-[655px] sm:min-w-[580px] h-auto relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                  Application
                  </h3>
                </div>
                <div className={`w-full sm:max-w-[655px] sm:min-w-[580px] bg-white shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)] transform -skew-x-12 rounded-[24px] flex flex-col items-start justify-start p-6 overflow-hidden transition-all duration-300 h-[200px]`}>
                  <div className="transform skew-x-12 px-8 w-full flex flex-col">
                     <div className="sm:w-[485px] w-[260px]  flex flex-col gap-[17px]">
      
                      {/* News and announcements */}
                      <div className="w-full h-[38px] flex items-center gap-[9px]">
                        <span className="flex-1 text-[14px] text-[#1E1E1E]">
                          News and announcements
                        </span>
                        <Switch
                          enabled={activity.NewsAndAnnouncements}
                          onToggle={() =>
                            setActivity({ ...activity, NewsAndAnnouncements: !activity.NewsAndAnnouncements})
                          }
                        />
                      </div>

                      {/* Weekly product updates */}
                      <div className="w-full h-[38px] flex items-center gap-[9px]">
                        <span className="flex-1 text-[14px] text-[#1E1E1E]">
                          Weekly product updates
                        </span>
                        <Switch
                          enabled={activity.WeeklyProductUpdates}
                          onToggle={() =>
                            setActivity({
                              ...activity,
                              WeeklyProductUpdates: !activity.WeeklyProductUpdates,
                            })
                          }
                        />
                      </div>

                      {/* Weekly blog digest */}
                      <div className="w-full h-[38px] flex items-center gap-[9px]">
                        <span className="flex-1 text-[14px] text-[#1E1E1E]">
                          Weekly blog digest
                        </span>
                        <Switch
                          enabled={activity.WeeklyBlogDigest}
                          onToggle={() =>
                            setActivity({
                              ...activity,
                              WeeklyBlogDigest: !activity.WeeklyBlogDigest,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

         {/* Security Tab */}
        {activeTab === "security" && (
          <div className="flex flex-col gap-6">
            <div className="w-full sm:max-w-[655px] sm:min-w-[580px] relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-barlow font-bold text-[24px] text-[#1E1E1E]">
                  Password
                </h3>
              </div>

             {/* Card wrapper */}
              <div className="relative w-full">
                {/* Decorative skew background */}
                <div
                  className="
                    absolute inset-0
                    bg-white
                    rounded-[24px]
                    shadow-[0_4px_12px_rgba(145,158,171,0.3),0_0_4px_rgba(145,158,171,0.2)]
                    -skew-x-12
                    pointer-events-none
                  "
                />

                {/* Real content */}
                <div
                  className="
                    relative
              
                    px-10
                    py-8
                    w-full
                    flex
                    flex-col
                    gap-6
                  "
                >
                  <form
                    onSubmit={handlePasswordChange}
                    className="flex flex-col gap-5 w-full"
                  >

                    {/* Current Password */}
                    <div className="relative w-full h-[48px]">
                      <label className="absolute -top-2 left-5 h-[18px] px-3 bg-[#FFEB9C] text-[#1E1E1E] text-xs flex items-center skew-x-[-12deg] z-20 rounded-md">
                        <span className="skew-x-[12deg]">Current Password</span>
                      </label>
                      <div className="absolute inset-0 border border-[#1C252E] rounded-[12px] -skew-x-12 pointer-events-none" />
                      <div className="relative h-full flex items-center px-5 bg-transparent">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full bg-transparent outline-none text-[12px] text-[#171717cc]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="ml-2 text-[#171717cc]"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="relative w-full h-[48px]">
                      <label className="absolute -top-2 left-5 h-[18px] px-3 bg-[#FFEB9C] text-[#1E1E1E] text-xs flex items-center skew-x-[-12deg] z-20 rounded-md">
                        <span className="skew-x-[12deg]">New Password</span>
                      </label>
                      <div className="absolute inset-0 border border-[#1C252E] rounded-[12px] -skew-x-12 pointer-events-none" />
                      <div className="relative h-full flex items-center px-5 bg-transparent">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full bg-transparent outline-none text-[12px] text-[#171717cc]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="ml-2 text-[#171717cc]"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative w-full h-[48px]">
                      <label className="absolute -top-2 left-5 h-[18px] px-3 bg-[#FFEB9C] text-[#1E1E1E] text-xs flex items-center skew-x-[-12deg] z-20 rounded-md">
                        <span className="skew-x-[12deg]">Confirm Password</span>
                      </label>
                      <div className="absolute inset-0 border border-[#1C252E] rounded-[12px] -skew-x-12 pointer-events-none" />
                      <div className="relative h-full flex items-center px-5 bg-transparent">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full bg-transparent outline-none text-[12px] text-[#171717cc]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="ml-2 text-[#171717cc]"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {changePasswordError && (
                      <div className="text-red-500 text-sm">{changePasswordError}</div>
                    )}

                    <button
                      type="submit"
                      disabled={changePasswordLoading}
                      className="relative w-[200px] h-[40px] skew-x-[-12deg] bg-[#FFEB9C] flex items-center justify-center rounded-md hover:bg-[#FFE066] transition disabled:opacity-50"
                    >
                      <span className="skew-x-[12deg] font-bold text-[#1E1E1E]">
                        {changePasswordLoading ? "Changing..." : "Change Password"}
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      </div>
      <AddressModal
      isOpen={isModalOpen}
      address={editingAddress}
      onClose={() => {
        setIsModalOpen(false);
        setEditingAddress(null);
      }}
      onSave={async (data) => {
        try {
          if (editingAddress?.id) {
            await updateAddress(editingAddress.id, data);
          } else {
            await createAddress(data);
          }
          setIsModalOpen(false);
          setEditingAddress(null);
          await getAddresses();
        } catch (error) {
          console.error("Failed to save address:", error);
          alert('Failed to save address. Please try again.');
        }
      }}
    />

    <DeleteConfirmationModal
      isOpen={showDeleteConfirm}
      onClose={() => setShowDeleteConfirm(false)}
      onConfirm={async () => {
        setDeletingProfile(true);
        try {
          await deleteProfile();
          await logout();
          router.push("/auth");
        } catch (error) {
          console.error("Failed to delete profile:", error);
          alert('Failed to delete profile. Please try again.');
        } finally {
          setDeletingProfile(false);
        }
      }}
      title="Delete Account"
      message="Are you sure you want to permanently delete your account? This will delete all your data including profile, applications, contracts, and reviews. This action cannot be undone."
      isLoading={deletingProfile}
    />
    </DashboardLayout>
    );
}