import React from "react";
import {
    LayoutDashboard,
    Map,
    BarChart3,
    Code,
    Settings,
    LogOut,
    User,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: Map, label: "Tours" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Code, label: "Embed Code" },
    { icon: Settings, label: "Settings" },
];

export default function TourFlowSidebar() {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-black">
                <Sidebar className="border-r border-slate-800 bg-black">
                    <SidebarHeader className="border-b border-slate-800 p-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
                                <Map className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-white">
                                TourFlow
                            </span>
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="p-2">
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        isActive={item.active}
                                        className={`w-full justify-start gap-3 px-3 py-2.5 text-sm ${
                                            item.active
                                                ? "bg-slate-800 text-cyan-400"
                                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                        }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-slate-800 p-3">
                        <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-white">
                                    adexbolaji00
                                </p>
                                <p className="truncate text-xs text-slate-400">
                                    adexbolaji00@gmail.c...
                                </p>
                            </div>
                        </div>

                        <SidebarMenuButton className="w-full justify-start gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarFooter>
                </Sidebar>
            </div>
        </SidebarProvider>
    );
}
