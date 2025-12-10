"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Map,
    BarChart3,
    Code,
    Settings,
    LogOut,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/store/authStore";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Map, label: "Tours", href: "/dashboard/tours" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Code, label: "Embed Code", href: "/dashboard/embed" },
    // { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function TourFlowSidebar() {
    const pathname = usePathname();
    const { user, signOut, checkAuth } = useAuthStore();

    // Load auth on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLogout = async () => {
        await signOut();
    };

    // Get full name from user metadata
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

        return "U";
    };

    const getDisplayName = () => {
        const fullName = getFullName();

        if (fullName) {
            return fullName;
        }

        if (user?.email) {
            return user.email.split("@")[0]; // fallback to email username
        }

        return "User";
    };

    const getTruncatedEmail = () => {
        const email = user?.email || "user@example.com";
        return email.length > 20 ? email.substring(0, 20) + "..." : email;
    };

    return (
        <Sidebar className="border-r border-slate-800 bg-sidebar static">
            <SidebarHeader className="border-b border-slate-800 p-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#800080]">
                        <Map className="h-5 w-5 text-white" />
                    </div>
                    <Link href='/'>
                    <span className="text-lg font-semibold text-white">
                        TourFlow
                    </span>
                    </Link>
                </div>
            </SidebarHeader>

            {/* MENU */}
            <SidebarContent className="p-2 mt-6 space-y-3">
                <SidebarMenu>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    className={`w-full justify-start gap-3 py-6 px-3 text-sm ${
                                        isActive
                                            ? "bg-primary! text-white!"
                                            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                    }`}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter className="border-t border-slate-800 p-3">
                {/* USER CARD */}
                <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#800080]">
                        <span className="text-sm font-semibold text-white">
                            {getUserInitials()}
                        </span>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white">
                            {getDisplayName()}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                            {getTruncatedEmail()}
                        </p>
                    </div>
                </div>

                {/* LOGOUT BUTTON */}
                <SidebarMenuButton
                    onClick={handleLogout}
                    className="w-full justify-start gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/50 logout-hover cursor-pointer transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    );
}



// "use client";
// import React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//     LayoutDashboard,
//     Map,
//     BarChart3,
//     Code,
//     Settings,
//     LogOut,
//     User,
// } from "lucide-react";
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarFooter,
//     SidebarHeader,
//     SidebarMenu,
//     SidebarMenuButton,
//     SidebarMenuItem,
// } from "@/components/ui/sidebar";

// const menuItems = [
//     { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
//     { icon: Map, label: "Tours", href: "/dashboard/tours" },
//     { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
//     { icon: Code, label: "Embed Code", href: "/dashboard/embed" },
//     { icon: Settings, label: "Settings", href: "/dashboard/settings" },
// ];

// export default function TourFlowSidebar() {
//     const pathname = usePathname();

//     const handleLogout = () => {
//         // Add your logout logic here
//         console.log("Logging out...");
//         // Example: signOut() for next-auth
//         // router.push('/login')
//     };

//     return (
//         <Sidebar className="border-r border-slate-800 bg-sidebar static">
//             <SidebarHeader className="border-b border-slate-800 p-4">
//                 <div className="flex items-center gap-2">
//                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
//                         <Map className="h-5 w-5 text-white" />
//                     </div>
//                     <span className="text-lg font-semibold text-white">
//                         TourFlow
//                     </span>
//                 </div>
//             </SidebarHeader>

//             <SidebarContent className="p-2 mt-6">
//                 <SidebarMenu>
//                     {menuItems.map((item) => {
//                         const isActive = pathname === item.href;

//                         return (
//                             <SidebarMenuItem key={item.label}>
//                                 <SidebarMenuButton
//                                     asChild
//                                     isActive={isActive}
//                                     className={`w-full justify-start gap-3 py-6 px-3 text-sm ${
//                                         isActive
//                                             ? "bg-sidebar-primary text-cyan-400"
//                                             : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
//                                     }`}
//                                 >
//                                     <Link href={item.href}>
//                                         <item.icon className="h-4 w-4" />
//                                         <span>{item.label}</span>
//                                     </Link>
//                                 </SidebarMenuButton>
//                             </SidebarMenuItem>
//                         );
//                     })}
//                 </SidebarMenu>
//             </SidebarContent>

//             <SidebarFooter className="border-t border-slate-800 p-3">
//                 <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
//                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500">
//                         <User className="h-4 w-4 text-white" />
//                     </div>
//                     <div className="flex-1 overflow-hidden">
//                         <p className="text-sm font-medium text-white">
//                             adexbolaji00
//                         </p>
//                         <p className="truncate text-xs text-slate-400">
//                             adexbolaji00@gmail.c...
//                         </p>
//                     </div>
//                 </div>

//                 <SidebarMenuButton
//                     onClick={handleLogout}
//                     className="w-full justify-start gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 cursor-pointer"
//                 >
//                     <LogOut className="h-4 w-4" />
//                     <span>Logout</span>
//                 </SidebarMenuButton>
//             </SidebarFooter>
//         </Sidebar>
//     );
// }
