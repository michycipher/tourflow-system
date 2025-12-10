"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, Users, Eye } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { dashboardService, DashboardStats, RecentTour, StepPerformance } from "@/lib/services/dashboard.service";

export default function DashboardPage() {
    const { user, loading, checkAuth } = useAuthStore();
    const router = useRouter();
    
    const [stats, setStats] = useState<DashboardStats>({
        totalTours: 0,
        totalSteps: 0,
        activeTours: 0,
        totalUsers: 0,
    });
    const [recentTours, setRecentTours] = useState<RecentTour[]>([]);
    const [stepPerformance, setStepPerformance] = useState<StepPerformance[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [loading, user, router]);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;

            setDataLoading(true);
            try {
                // Fetch all data in parallel
                const [statsData, toursData, performanceData] = await Promise.all([
                    dashboardService.getDashboardStats(user.id),
                    dashboardService.getRecentTours(user.id, 3),
                    dashboardService.getAverageStepPerformance(user.id),
                ]);

                setStats(statsData);
                setRecentTours(toursData);
                setStepPerformance(performanceData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setDataLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    // Get user's name from metadata, fallback to email
    const getUserName = () => {
        if (user?.user_metadata?.full_name) {
            return user.user_metadata.full_name;
        }
        return user?.email?.split('@')[0] || 'user';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800080] mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-[#110816] min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {getUserName()}!
                </h1>
                <p className="text-slate-400">
                    Here&#39;s what&#39;s happening with your tours today.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Tours */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Eye className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div className="flex items-center text-emerald-500 text-sm">
                            <span className="mr-1">Total</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {dataLoading ? (
                            <span className="animate-pulse">...</span>
                        ) : (
                            stats.totalTours
                        )}
                    </div>
                    <div className="text-slate-400 text-sm">Tours Created</div>
                </div>

                {/* Total Steps */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div className="flex items-center text-emerald-500 text-sm">
                            <span className="mr-1">Steps</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {dataLoading ? (
                            <span className="animate-pulse">...</span>
                        ) : (
                            stats.totalSteps
                        )}
                    </div>
                    <div className="text-slate-400 text-sm">Total Steps</div>
                </div>

                {/* Active Tours */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div className="flex items-center text-emerald-500 text-sm">
                            <span className="mr-1">Active</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {dataLoading ? (
                            <span className="animate-pulse">...</span>
                        ) : (
                            stats.activeTours
                        )}
                    </div>
                    <div className="text-slate-400 text-sm">Active Tours</div>
                </div>

                {/* Total Users */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div className="flex items-center text-emerald-500 text-sm">
                            <span className="mr-1">Accounts</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {dataLoading ? (
                            <span className="animate-pulse">...</span>
                        ) : (
                            stats.totalUsers
                        )}
                    </div>
                    <div className="text-slate-400 text-sm">Registered Users</div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tours */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Recent Tours</h2>
                        <Link href='/dashboard/tours' className="text-cyan-500 hover:text-cyan-400 text-sm flex items-center">
                            View All
                            <span className="ml-1">→</span>
                        </Link>
                    </div>

                    {dataLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 bg-slate-800/50 rounded-lg animate-pulse">
                                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : recentTours.length > 0 ? (
                        <div className="space-y-4">
                            {recentTours.map((tour) => (
                                <div 
                                    key={tour.id} 
                                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    <div>
                                        <h3 className="text-white font-medium mb-1">{tour.title}</h3>
                                        <p className="text-slate-400 text-sm">{tour.total_steps} steps</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        tour.status === 'active' 
                                            ? 'bg-emerald-500/10 text-emerald-500' 
                                            : 'bg-slate-700 text-slate-400'
                                    }`}>
                                        {tour.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <p>No tours yet. Create your first tour to get started!</p>
                            <Link 
                                href="/dashboard/tours/new" 
                                className="mt-4 inline-block px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                            >
                                Create Tour
                            </Link>
                        </div>
                    )}
                </div>

                {/* Step Performance */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <h2 className="text-xl font-semibold text-white mb-6">Average Step Performance</h2>

                    {dataLoading ? (
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="h-3 bg-slate-700 rounded w-16"></div>
                                        <div className="h-3 bg-slate-700 rounded w-12"></div>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2"></div>
                                </div>
                            ))}
                        </div>
                    ) : stepPerformance.length > 0 ? (
                        <div className="space-y-6">
                            {stepPerformance.map((step) => (
                                <div key={step.step_number}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-300 text-sm">Step {step.step_number}</span>
                                        <span className="text-slate-300 text-sm font-medium">
                                            {step.completion_rate.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div 
                                            className="bg-cyan-500 h-2 rounded-full transition-all duration-500" 
                                            style={{ width: `${step.completion_rate}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <p>No step performance data available yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}





// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { CheckCircle, Clock, Users } from "lucide-react";
// import Link from "next/link";
// import { useAuthStore } from "@/lib/store/authStore";

// export default function DashboardPage() {
//     const { user, loading, checkAuth } = useAuthStore();
//     const router = useRouter();

//     useEffect(() => {
//         checkAuth();
//     }, [checkAuth]);

//     useEffect(() => {
//         if (!loading && !user) {
//             router.push("/auth/login");
//         }
//     }, [loading, user, router]);

//     // Get user's name from metadata, fallback to email
//     const getUserName = () => {
//         if (user?.user_metadata?.full_name) {
//             return user.user_metadata.full_name;
//         }
//         return user?.email?.split('@')[0] || 'user';
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-full">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800080] mx-auto"></div>
//                     <p className="mt-4 text-slate-400">Loading...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-8 bg-[#110816] min-h-screen">
//             {/* Header */}
//             <div className="mb-8">
//                 <h1 className="text-3xl font-bold text-white mb-2">
//                     Welcome back, {getUserName()}!
//                 </h1>
//                 <p className="text-slate-400">
//                     Here&#39;s what&#39;s happening with your tours today.
//                 </p>
//             </div>

//             {/* Metrics Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//                 {/* Total Tours */}
//                 <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
//                     <div className="flex items-center justify-between mb-4">
//                         <div className="p-2 bg-cyan-500/10 rounded-lg">
//                             <CheckCircle className="w-5 h-5 text-cyan-500" />
//                         </div>
//                         <div className="flex items-center text-emerald-500 text-sm">
//                             <span className="mr-1">Completed Tours</span>
//                         </div>
//                     </div>
//                     <div className="text-3xl font-bold text-white mb-1">7</div>
//                     <div className="text-slate-400 text-sm">Total tours created</div>
//                 </div>

//                 {/* Total steps configured */}
//                 <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
//                     <div className="flex items-center justify-between mb-4">
//                         <div className="p-2 bg-cyan-500/10 rounded-lg">
//                             <Clock className="w-5 h-5 text-cyan-500" />
//                         </div>
//                         <div className="flex items-center text-emerald-500 text-sm">
//                             <span className="mr-1">Steps</span>
//                         </div>
//                     </div>
//                     <div className="text-3xl font-bold text-white mb-1">0</div>
//                     <div className="text-slate-400 text-sm">Total Steps Configure</div>
//                 </div>

//                 {/* Active Tours */}
//                 <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
//                     <div className="flex items-center justify-between mb-4">
//                         <div className="p-2 bg-cyan-500/10 rounded-lg">
//                             <Users className="w-5 h-5 text-cyan-500" />
//                         </div>
//                         <div className="flex items-center text-emerald-500 text-sm">
//                             <span className="mr-1">Active Tours</span>
//                         </div>
//                     </div>
//                     <div className="text-3xl font-bold text-white mb-1">2</div>
//                     <div className="text-slate-400 text-sm">Active Tours</div>
//                 </div>
//             </div>

//             {/* Bottom Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Recent Tours */}
//                 <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
//                     <div className="flex items-center justify-between mb-6">
//                         <h2 className="text-xl font-semibold text-white">Recent Tours</h2>
//                         <Link href='/dashboard/tours' className="text-cyan-500 hover:text-cyan-400 text-sm flex items-center">
//                             View All
//                             <span className="ml-1">→</span>
//                         </Link>
//                     </div>

//                     <div className="space-y-4">
//                         {/* Welcome Tour */}
//                         <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
//                             <div>
//                                 <h3 className="text-white font-medium mb-1">Welcome Tour</h3>
//                                 <p className="text-slate-400 text-sm">5 steps</p>
//                             </div>
//                             <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium">
//                                 Active
//                             </span>
//                         </div>

//                         {/* Feature Discovery */}
//                         <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
//                             <div>
//                                 <h3 className="text-white font-medium mb-1">Feature Discovery</h3>
//                                 <p className="text-slate-400 text-sm">5 steps</p>
//                             </div>
//                             <span className="px-3 py-1 bg-slate-700 text-slate-400 rounded-full text-xs font-medium">
//                                 Inactive
//                             </span>
//                         </div>

//                         {/* Onboarding Flow */}
//                         <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
//                             <div>
//                                 <h3 className="text-white font-medium mb-1">Onboarding Flow</h3>
//                                 <p className="text-slate-400 text-sm">5 steps</p>
//                             </div>
//                             <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium">
//                                 Active
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Step Performance */}
//                 <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
//                     <h2 className="text-xl font-semibold text-white mb-6">Step Performance</h2>

//                     <div className="space-y-6">
//                         {/* Step 1 */}
//                         <div>
//                             <div className="flex items-center justify-between mb-2">
//                                 <span className="text-slate-300 text-sm">Step 1</span>
//                                 <span className="text-slate-300 text-sm font-medium">95%</span>
//                             </div>
//                             <div className="w-full bg-slate-800 rounded-full h-2">
//                                 <div className="bg-cyan-500 h-2 rounded-full w-[95%]"></div>
//                             </div>
//                         </div>

//                         {/* Step 2 */}
//                         <div>
//                             <div className="flex items-center justify-between mb-2">
//                                 <span className="text-slate-300 text-sm">Step 2</span>
//                                 <span className="text-slate-300 text-sm font-medium">94%</span>
//                             </div>
//                             <div className="w-full bg-slate-800 rounded-full h-2">
//                                 <div className="bg-cyan-500 h-2 rounded-full w-[95%]"></div>
//                             </div>
//                         </div>

//                         {/* Step 3 */}
//                         <div>
//                             <div className="flex items-center justify-between mb-2">
//                                 <span className="text-slate-300 text-sm">Step 3</span>
//                                 <span className="text-slate-300 text-sm font-medium">94%</span>
//                             </div>
//                             <div className="w-full bg-slate-800 rounded-full h-2">
//                                 <div className="bg-cyan-500 h-2 rounded-full w-[95%]"></div>
//                             </div>
//                         </div>

//                         {/* Step 4 */}
//                         <div>
//                             <div className="flex items-center justify-between mb-2">
//                                 <span className="text-slate-300 text-sm">Step 4</span>
//                                 <span className="text-slate-300 text-sm font-medium">93%</span>
//                             </div>
//                             <div className="w-full bg-slate-800 rounded-full h-2">
//                                 <div className="bg-cyan-500 h-2 rounded-full w-[95%]"></div>
//                             </div>
//                         </div>

//                         {/* Step 5 */}
//                         <div>
//                             <div className="flex items-center justify-between mb-2">
//                                 <span className="text-slate-300 text-sm">Step 5</span>
//                                 <span className="text-slate-300 text-sm font-medium">75%</span>
//                             </div>
//                             <div className="w-full bg-slate-800 rounded-full h-2">
//                                 <div className="bg-cyan-500 h-2 rounded-full w-[75%]"></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

