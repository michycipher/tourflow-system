"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TourFlowSidebar from "@/components/dashboard/SIdebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <TourFlowSidebar />

                <div className="flex-1 flex flex-col bg-sidebar-bg">
                    {/* Mobile header */}
                    <div className="p-4 md:hidden justify-between items-center flex border-sidebar-accent border-b">
                        <SidebarTrigger className="border-sidebar-accent border bg-sidebar-accent" />

                        <div className="border-sidebar-accent border h-12 text-white flex items-center justify-center w-12 rounded-full">
                            A
                        </div>
                    </div>
                    <main className="flex-1 overflow-auto p-8 bg-[#110816]">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
