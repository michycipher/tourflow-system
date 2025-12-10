"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TourFlowSidebar from "@/components/dashboard/SIdebar";
import { useAuthStore } from "@/lib/store/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    const { user } = useAuthStore();

    const getFullName = () => {
        return user?.user_metadata?.full_name || null;
    };

    const getUserInitials = () => {
        const fullName = getFullName();

        if (fullName) {
            const parts = fullName.trim().split(" ");
            const first = parts[0]?.[0]?.toUpperCase() || "";
            const last = parts[parts.length - 1]?.[0]?.toUpperCase() || "";
            // If only one name, return just first initial
            return parts.length > 1 ? first + last : first;
        }

        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }

        return "User";
    };
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <TourFlowSidebar />

                <div className="flex-1 flex flex-col bg-sidebar-bg">
                    {/* Mobile header */}
                    <div className="p-4 md:hidden justify-between items-center flex border-sidebar-accent border-b">
                        <SidebarTrigger className="border-sidebar-accent border bg-sidebar-accent" />

                        <div className="border-sidebar-accent border h-12 text-white flex items-center justify-center w-12 rounded-full">
                            {getUserInitials()}
                        </div>
                    </div>
                    <main className="flex-1 overflow-auto p-8 bg-[#110816] scrollbar-hide">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
