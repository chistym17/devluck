// src/app/Student/notification/page.tsx
"use client";
import DashboardLayout from "@/src/components/Student/DashboardLayout";
import NotificationsGrid from "@/src/components/Student/NotificationsGrid";

export default function NotificationPage() {
    return (
        <DashboardLayout>
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-8">
                Notification
                </h1>

                <NotificationsGrid />
                
            </div>
        </DashboardLayout>
    );
}   